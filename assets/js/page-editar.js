/*
 * page-editar.js — Indicadores de Desempenho: ID 12, 21, 22, 23
 *
 * Liga a página editar.html à camada de dados:
 * - lê o id da querystring (?id=...), passado pelo estoque/detalhes;
 * - ID 22/23: AgroApi.obterInsumo(id) e PREENCHE o formulário existente;
 * - ID 12: no submit valida nome e quantidade com AgroValidators (Regex);
 * - ID 22: AgroApi.editarInsumo(id, obj) (PUT) e redireciona para
 *   detalhes.html?id=<id> com toast de sucesso;
 * - ID 21: a máscara do #cep já é aplicada no app.js (jQuery Mask).
 *
 * Só roda na página de edição (checa a existência de #formEditar).
 */
$(document).ready(function () {
  var $form = $('#formEditar');
  if ($form.length === 0) {
    return; // não é a página de edição
  }

  var V = window.AgroValidators;
  var formEl = $form[0];
  var id = new URLSearchParams(window.location.search).get('id');
  var insumoAtual = null; // guarda o registro carregado (preserva campos não editados)

  // Retorna '' quando o valor é nulo/indefinido (evita "null" nos inputs).
  function ouVazio(v) {
    return v === null || v === undefined ? '' : v;
  }

  // Seleciona no <select> a opção cujo texto/valor casa com 'valor'. Se não
  // existir (ex.: categoria da seed que não está na lista), cria uma opção com
  // o valor real para não perder o dado.
  function selecionarOpcao($sel, valor) {
    var alvo = String(ouVazio(valor));
    var casou = false;
    $sel.find('option').each(function () {
      if ($(this).text() === alvo || $(this).val() === alvo) {
        $(this).prop('selected', true);
        casou = true;
        return false;
      }
    });
    if (!casou && alvo !== '') {
      $sel.append($('<option></option>').text(alvo).prop('selected', true));
    }
  }

  // Unidade: casa pela abreviação entre parênteses ("kg" -> "Quilogramas (kg)").
  function selecionarUnidade(valor) {
    var alvo = String(ouVazio(valor)).toLowerCase();
    var casou = false;
    $('#unidade option').each(function () {
      var texto = $(this).text();
      var m = texto.match(/\(([^)]+)\)/);
      var abrev = (m ? m[1] : texto).toLowerCase();
      if (abrev === alvo) {
        $(this).prop('selected', true);
        casou = true;
        return false;
      }
    });
    if (!casou && alvo !== '') {
      $('#unidade').append($('<option></option>').text(valor).prop('selected', true));
    }
  }

  // Preenche o formulário com os dados do insumo.
  function preencher(insumo) {
    $('#nomeInsumo').val(ouVazio(insumo.nome));
    selecionarOpcao($('#categoria'), insumo.categoria);
    $('#descricao').val(ouVazio(insumo.descricao));
    $('#quantidade').val(ouVazio(insumo.quantidade));
    selecionarUnidade(insumo.unidade);
    $('#estoqueMin').val(ouVazio(insumo.estoqueMin));
    $('#fornecedor').val(ouVazio(insumo.fornecedor));

    // CEP/Endereço não fazem parte do insumo (fornecedor é denormalizado): limpa
    // os valores estáticos do protótipo para não exibir dados de outro registro.
    $('#cep').val('');
    $('#endereco').val('');

    // Links de navegação levam o id adiante.
    $('#linkCancelar, #linkVoltarDetalhes').attr(
      'href',
      'detalhes.html?id=' + encodeURIComponent(insumo.id)
    );
    $('#linkVoltarDetalhes').text(insumo.nome || 'Detalhes');
  }

  // ── Submit: valida (ID 12) e atualiza via PUT (ID 22) ────────────────────────
  $form.on('submit', async function (event) {
    event.preventDefault();
    if (!id || !insumoAtual) {
      return;
    }

    // Validação HTML nativa + Regex (mesma estratégia do cadastro).
    var nativaOk = formEl.checkValidity();
    if (!nativaOk) {
      formEl.reportValidity();
    }

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

    if (!nativaOk || !nomeOk || !qtdOk) {
      window.mostrarToast('Verifique os campos destacados.', 'erro');
      return;
    }

    // Extrai a abreviação da unidade (ex.: "Quilogramas (kg)" -> "kg").
    var unidadeBruta = $('#unidade').val();
    var matchUnidade = unidadeBruta.match(/\(([^)]+)\)/);
    var unidade = matchUnidade ? matchUnidade[1] : unidadeBruta;

    // Mescla as edições sobre o registro atual (preserva id, dataCompra etc.).
    var obj = Object.assign({}, insumoAtual, {
      nome: nome.trim(),
      categoria: $('#categoria').val(),
      descricao: $('#descricao').val().trim(),
      quantidade: parseFloat(String(qtd).replace(',', '.')),
      unidade: unidade,
      estoqueMin: parseFloat(String($('#estoqueMin').val()).replace(',', '.')) || 0,
      fornecedor: $('#fornecedor').val().trim()
    });

    var atualizado = await window.AgroApi.editarInsumo(id, obj);
    if (atualizado) {
      window.mostrarToast('Insumo atualizado com sucesso!', 'sucesso');
      setTimeout(function () {
        window.location.href = 'detalhes.html?id=' + encodeURIComponent(id);
      }, 1200);
    } else {
      window.mostrarToast('Não foi possível atualizar o insumo.', 'erro');
    }
  });

  // ── Carga inicial (ID 22/23) ─────────────────────────────────────────────────
  async function carregar() {
    if (!id) {
      window.mostrarToast('Insumo não informado.', 'erro');
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1200);
      return;
    }
    insumoAtual = await window.AgroApi.obterInsumo(id);
    if (!insumoAtual) {
      window.mostrarToast('Insumo não encontrado.', 'erro');
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1200);
      return;
    }
    preencher(insumoAtual);
  }
  carregar();
});
