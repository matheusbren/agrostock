/*
 * page-configuracoes.js — Indicadores de Desempenho: ID 14 (Web Storage) e ID 12 (Regex)
 *
 * Liga configuracoes.html à camada de persistência local:
 * - ID 14: lê/grava as preferências em AgroStorage (localStorage), aplicando nos
 *   switches de notificação e nos campos de perfil/sistema. Os dados sobrevivem
 *   ao reload da página;
 * - ID 12: valida e-mail e telefone por Regex (AgroValidators) antes de salvar,
 *   com feedback inline + toast.
 *
 * Só roda na página de configurações (checa a existência de #formPerfil).
 */
$(document).ready(function () {
  if ($('#formPerfil').length === 0) {
    return; // não é a página de configurações
  }

  var V = window.AgroValidators;
  var CAMPOS = [
    'nomeCompleto',
    'cargo',
    'email',
    'telefone',
    'nomeFazenda',
    'cidade',
    'areaTotal',
    'moeda'
  ];
  var SWITCHES = ['notifBaixo', 'notifValidade', 'notifEntrega', 'notifEmail'];

  // Lê os campos de texto/select de perfil e sistema.
  function lerCampos() {
    var dados = {};
    CAMPOS.forEach(function (campo) {
      dados[campo] = $('#' + campo).val();
    });
    return dados;
  }

  // Lê o estado (boolean) dos switches de notificação.
  function lerSwitches() {
    var dados = {};
    SWITCHES.forEach(function (sw) {
      dados[sw] = $('#' + sw).prop('checked');
    });
    return dados;
  }

  // Aplica as preferências salvas: só sobrescreve o que existir, preservando os
  // valores padrão do HTML quando ainda não há nada gravado.
  function aplicar(prefs) {
    CAMPOS.forEach(function (campo) {
      if (Object.prototype.hasOwnProperty.call(prefs, campo)) {
        $('#' + campo).val(prefs[campo]);
      }
    });
    SWITCHES.forEach(function (sw) {
      if (Object.prototype.hasOwnProperty.call(prefs, sw)) {
        $('#' + sw).prop('checked', !!prefs[sw]);
      }
    });
  }

  // ── Carga inicial (ID 14) ────────────────────────────────────────────────────
  aplicar(window.AgroStorage.lerPreferencias());

  // ── Switches: cada mudança persiste imediatamente (ID 14) ────────────────────
  $('#' + SWITCHES.join(', #')).on('change', function () {
    var prefs = window.AgroStorage.lerPreferencias();
    Object.assign(prefs, lerSwitches());
    window.AgroStorage.salvarPreferencias(prefs);
    window.mostrarToast('Preferência de notificação salva.', 'sucesso');
  });

  // ── Salvar perfil/sistema: valida (ID 12) e persiste tudo (ID 14) ────────────
  function salvarTudo() {
    var emailOk = V.validarEmail($('#email').val());
    var telOk = V.validarTelefone($('#telefone').val());

    V.aplicarFeedback(
      document.getElementById('email'),
      emailOk,
      emailOk ? '' : 'Informe um e-mail válido (ex.: nome@dominio.com).'
    );
    V.aplicarFeedback(
      document.getElementById('telefone'),
      telOk,
      telOk ? '' : 'Telefone no formato (11) 98765-4321.'
    );

    if (!emailOk || !telOk) {
      window.mostrarToast('Verifique os campos destacados.', 'erro');
      return;
    }

    // Mescla os valores atuais sobre o que já estava salvo e grava (ID 14).
    var prefs = window.AgroStorage.lerPreferencias();
    Object.assign(prefs, lerCampos(), lerSwitches());
    window.AgroStorage.salvarPreferencias(prefs);
    window.mostrarToast('Preferências salvas com sucesso!', 'sucesso');
  }

  // O perfil é um <form>: o submit (botão "Salvar Alterações") dispara o salvar.
  $('#formPerfil').on('submit', function (event) {
    event.preventDefault();
    salvarTudo();
  });
  // Botões "Salvar Preferências" (notificações) e "Salvar Configurações" (sistema).
  $('#btnSalvarNotif, #btnSalvarSistema').on('click', salvarTudo);
});
