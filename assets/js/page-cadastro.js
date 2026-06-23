/*
 * page-cadastro.js — Indicadores: ID 11, 12, 14, 21, 22, 24
 *
 * Liga a página cadastro.html à camada JS:
 * - ID 24: ViaCEP preenche o endereço a partir do CEP (AgroPublicApis.buscarCEP);
 * - ID 11: validação HTML nativa (required/min + checkValidity/reportValidity);
 * - ID 12: validação por Regex de nome e quantidade (AgroValidators);
 * - ID 22/14: persistência via AgroApi.criarInsumo (JSON Server ou localStorage);
 * - ID 21: a máscara do #cep já é aplicada no app.js (jQuery Mask).
 *
 * Usa apenas os IDs já existentes no HTML (formCadastro, nomeInsumo, categoria,
 * descricao, quantidade, unidade, estoqueMin, fornecedor, cep, endereco, toastCEP).
 */
$(document).ready(function () {
  // Só executa na página de cadastro (segurança: o form precisa existir).
  var $form = $('#formCadastro');
  if ($form.length === 0) {
    return;
  }

  var V = window.AgroValidators;
  var formEl = $form[0];

  // ── ID 24: ViaCEP no blur/change do CEP ──────────────────────────────────────
  $('#cep').on('blur change', async function () {
    var cep = $('#cep').val().trim();
    if (cep === '') {
      return; // nada digitado: não consulta
    }

    // buscarCEP valida o formato, consulta a ViaCEP e trata erros com toast.
    var resultado = await window.AgroPublicApis.buscarCEP(cep);

    if (resultado) {
      // Sucesso: preenche o endereço (logradouro/bairro + cidade/UF).
      var textoEndereco = resultado.endereco;
      if (resultado.cidade) {
        textoEndereco += ' - ' + resultado.cidade + '/' + resultado.estado;
      }
      $('#endereco').val(textoEndereco);
      V.aplicarFeedback(document.getElementById('cep'), true, '');

      // Mostra o toast de sucesso já existente na página (#toastCEP).
      var toastEl = document.getElementById('toastCEP');
      if (toastEl) {
        bootstrap.Toast.getOrCreateInstance(toastEl).show();
      }
    } else {
      // Falha/CEP inválido: buscarCEP já mostrou o toast; aqui marca o campo.
      V.aplicarFeedback(document.getElementById('cep'), false, 'CEP não encontrado ou inválido.');
    }
  });

  // ── Submit: valida (ID 11 + ID 12) e persiste (ID 22/14) ─────────────────────
  $form.on('submit', async function (event) {
    // Impede o reload padrão do formulário.
    event.preventDefault();

    // ID 11 — validação HTML nativa (atributos required/min do HTML).
    var nativaOk = formEl.checkValidity();
    if (!nativaOk) {
      formEl.reportValidity(); // exibe as mensagens nativas do navegador
    }

    // ID 12 — validação por Regex (nome do insumo e quantidade).
    var nome = $('#nomeInsumo').val();
    var qtd = $('#quantidade').val();
    var nomeOk = V.validarNomeInsumo(nome);
    var qtdOk = V.validarQuantidade(qtd);

    V.aplicarFeedback(
      document.getElementById('nomeInsumo'),
      nomeOk,
      nomeOk ? '' : 'Informe um nome com pelo menos 2 caracteres.'
    );
    V.aplicarFeedback(
      document.getElementById('quantidade'),
      qtdOk,
      qtdOk ? '' : 'Quantidade deve ser um número maior que zero.'
    );

    // Bloqueia o envio se qualquer validação falhou.
    if (!nativaOk || !nomeOk || !qtdOk) {
      window.mostrarToast('Verifique os campos destacados.', 'erro');
      return;
    }

    // ── Monta o objeto insumo a partir do formulário ──────────────────────────
    // Extrai a abreviação da unidade (ex.: "Quilogramas (kg)" -> "kg").
    var unidadeBruta = $('#unidade').val();
    var matchUnidade = unidadeBruta.match(/\(([^)]+)\)/);
    var unidade = matchUnidade ? matchUnidade[1] : unidadeBruta;

    var insumo = {
      nome: nome.trim(),
      categoria: $('#categoria').val(),
      descricao: $('#descricao').val().trim(),
      // Converte vírgula decimal em ponto antes de virar número.
      quantidade: parseFloat(String(qtd).replace(',', '.')),
      unidade: unidade,
      estoqueMin: parseFloat(String($('#estoqueMin').val()).replace(',', '.')) || 0,
      // Sem campo de data no form: usa a data de hoje (YYYY-MM-DD).
      dataCompra: new Date().toISOString().slice(0, 10),
      fornecedor: $('#fornecedor').val().trim()
    };

    // ── ID 22/14: persiste via camada de dados (API fake ou localStorage) ─────
    var criado = await window.AgroApi.criarInsumo(insumo);

    if (criado) {
      window.mostrarToast('Insumo cadastrado com sucesso!', 'sucesso');
      // Pequeno atraso para o usuário ver o toast antes de ir para a lista.
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1200);
    } else {
      window.mostrarToast('Não foi possível cadastrar o insumo.', 'erro');
    }
  });
});
