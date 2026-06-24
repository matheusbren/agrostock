/*
 * page-detalhes.js — Indicadores de Desempenho: ID 22, 23
 *
 * Liga a página detalhes.html à camada de dados:
 * - lê o id do insumo da querystring (?id=...), passado pelo estoque.html;
 * - ID 22/23: AgroApi.obterInsumo(id) (GET) e preenche os campos exibidos,
 *   reaproveitando os elementos existentes (nome, categoria, quantidade,
 *   estoque mínimo, fornecedor, data de compra e descrição);
 * - exclusão: o botão de confirmação do modal #modalExcluir chama
 *   AgroApi.excluirInsumo(id) (DELETE — ID 22) e redireciona para estoque.html.
 *
 * Só roda na página de detalhes (checa a existência de #detNome).
 */
$(document).ready(function () {
  if ($('#detNome').length === 0) {
    return; // não é a página de detalhes
  }

  // id do insumo vindo da URL (estoque/edição -> detalhes.html?id=<id>).
  var id = new URLSearchParams(window.location.search).get('id');

  // Formata número no padrão brasileiro (2450 -> "2.450").
  function formatarNumero(n) {
    var num = Number(n);
    if (isNaN(num)) {
      num = 0;
    }
    return num.toLocaleString('pt-BR');
  }

  // Converte 'YYYY-MM-DD' em 'DD/MM/YYYY' sem depender de fuso horário.
  function formatarData(iso) {
    if (!iso) {
      return '—';
    }
    var partes = String(iso).split('-');
    if (partes.length !== 3) {
      return String(iso);
    }
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  // Status (mesma regra do estoque) para o badge do card de nível.
  function statusBadge(qtd, min) {
    if (qtd <= 0) {
      return { classe: 'badge-esgotado', texto: 'Esgotado' };
    }
    if (min > 0 && qtd < min) {
      return { classe: 'badge-estoque-baixo', texto: 'Estoque Baixo' };
    }
    return { classe: 'badge-em-estoque', texto: 'Em Estoque' };
  }

  // Escreve "<número> <unidade>" preservando o estilo do <span> da unidade.
  function setMetrica(seletor, valor, unidade) {
    $(seletor)
      .empty()
      .append(document.createTextNode(formatarNumero(valor) + ' '))
      .append(
        $('<span></span>').css({ fontSize: '1rem', fontWeight: 500, opacity: 0.5 }).text(unidade)
      );
  }

  // Preenche a página inteira com os dados do insumo.
  function preencher(insumo) {
    var unidade = insumo.unidade || '';
    var qtd = Number(insumo.quantidade) || 0;
    var min = Number(insumo.estoqueMin) || 0;

    var nome = insumo.nome || '(sem nome)';
    $('#detNome').text(nome);
    $('#detBreadcrumbNome').text(nome);
    document.title = 'AgroStock — ' + nome;

    $('#detCodigo').text('Cód: ' + insumo.id);
    $('#detCategoria').text('Categoria: ' + (insumo.categoria || '—'));

    setMetrica('#detQuantidade', qtd, unidade);
    setMetrica('#detEstoqueMin', min, unidade);

    var st = statusBadge(qtd, min);
    $('#detStatus')
      .attr('class', 'badge-status ' + st.classe)
      .text(st.texto);

    if (insumo.descricao) {
      $('#detDescricao').text(insumo.descricao);
    }

    $('#detFornecedor').text(insumo.fornecedor || '—');

    // "Datas": usa a data de compra como entrada do lote principal.
    $('#detLote').text('#' + insumo.id);
    $('#detDataCompra').text(formatarData(insumo.dataCompra));
    $('#detLoteQtd').text(formatarNumero(qtd) + ' ' + unidade);

    // Texto do modal de exclusão + links de edição com o id na URL.
    $('#nomeInsumoExcluir').text(nome);
    $('#linkEditar, #linkEditarRapido').attr(
      'href',
      'editar.html?id=' + encodeURIComponent(insumo.id)
    );
  }

  async function carregar() {
    if (!id) {
      window.mostrarToast('Insumo não informado.', 'erro');
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1200);
      return;
    }
    var insumo = await window.AgroApi.obterInsumo(id);
    if (!insumo) {
      window.mostrarToast('Insumo não encontrado.', 'erro');
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1200);
      return;
    }
    preencher(insumo);
  }
  carregar();

  // Confirmação de exclusão -> DELETE (ID 22) -> volta para a lista.
  $('#btnConfirmarExclusao').on('click', async function () {
    if (!id) {
      return;
    }
    var ok = await window.AgroApi.excluirInsumo(id);
    if (ok) {
      window.mostrarToast('Insumo excluído com sucesso.', 'sucesso');
      setTimeout(function () {
        window.location.href = 'estoque.html';
      }, 1000);
    } else {
      window.mostrarToast('Não foi possível excluir o insumo.', 'erro');
    }
  });
});
