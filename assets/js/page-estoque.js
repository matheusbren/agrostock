/*
 * page-estoque.js — Indicadores de Desempenho: ID 20, 22, 23
 *
 * Liga a página estoque.html à camada de dados do AgroStock:
 * - ID 23: lê os insumos via AgroApi.listarInsumos() e RENDERIZA a tabela
 *   dinamicamente em #corpoTabelaEstoque (substituindo as linhas estáticas);
 * - ID 20: usa jQuery para manipular o DOM, tratar eventos e animar —
 *   busca em tempo real (fadeIn/fadeOut), filtro por categoria e exclusão
 *   com confirmação via Modal do Bootstrap;
 * - ID 22: a exclusão chama AgroApi.excluirInsumo(id) (DELETE na API fake
 *   quando em localhost; localStorage caso contrário).
 *
 * Só roda na página de estoque (checa a existência de #corpoTabelaEstoque).
 */
$(document).ready(function () {
  var $corpo = $('#corpoTabelaEstoque');
  if ($corpo.length === 0) {
    return; // não é a página de estoque
  }

  var $busca = $('#buscaEstoque');
  var categoriaAtiva = ''; // '' = todas as categorias

  // Ícone do Material Symbols conforme a categoria do insumo.
  var ICONES = {
    fertilizante: 'eco',
    semente: 'grain',
    defensivo: 'water_drop',
  };

  // ── Utilidades ───────────────────────────────────────────────────────────────

  // Escapa o valor para uso seguro dentro de HTML (evita injeção ao montar linhas).
  function esc(valor) {
    if (valor === null || valor === undefined) {
      valor = '';
    }
    return $('<div>').text(String(valor)).html();
  }

  // Formata número no padrão brasileiro (2450 -> "2.450", 0.5 -> "0,5").
  function formatarNumero(n) {
    var num = Number(n);
    if (isNaN(num)) {
      num = 0;
    }
    return num.toLocaleString('pt-BR');
  }

  // Decide o status a partir da quantidade x estoque mínimo.
  function calcularStatus(qtd, min) {
    if (qtd <= 0) {
      return {
        chave: 'esgotado',
        badgeClasse: 'badge-esgotado',
        badgeTexto: 'Esgotado',
        alerta: true,
      };
    }
    if (min > 0 && qtd < min) {
      return {
        chave: 'baixo',
        badgeClasse: 'badge-estoque-baixo',
        badgeTexto: 'Estoque Baixo',
        alerta: true,
      };
    }
    return {
      chave: 'ok',
      badgeClasse: 'badge-em-estoque',
      badgeTexto: 'Em Estoque',
      alerta: false,
    };
  }

  // ── Render (ID 23) ───────────────────────────────────────────────────────────

  // Monta o HTML de UMA linha da tabela, espelhando a marcação estática original.
  function montarLinha(insumo) {
    var qtd = Number(insumo.quantidade) || 0;
    var min = Number(insumo.estoqueMin) || 0;
    var unidade = insumo.unidade || '';
    var categoria = insumo.categoria || '';
    var nome = insumo.nome || '(sem nome)';
    var fornecedor = insumo.fornecedor || '—';
    var icone = ICONES[categoria.toLowerCase()] || 'inventory_2';
    var status = calcularStatus(qtd, min);

    // Segunda linha da coluna Quantidade: alerta em vermelho ou "Mín:" discreto.
    var qtdClasse = status.alerta ? ' text-error-agro' : '';
    var subClasse = status.alerta ? 'text-error-agro fw-600' : 'text-muted-agro';
    var subTexto;
    if (status.chave === 'esgotado') {
      subTexto = 'Esgotado';
    } else if (status.chave === 'baixo') {
      subTexto = 'Estoque Baixo!';
    } else {
      subTexto = min > 0 ? 'Mín: ' + formatarNumero(min) + ' ' + esc(unidade) : '—';
    }

    return (
      '<tr class="linha-insumo" data-id="' +
      esc(insumo.id) +
      '" data-categoria="' +
      esc(categoria) +
      '">' +
      '<td>' +
      '<div class="d-flex align-items-center gap-3">' +
      '<div class="rounded-2 d-flex align-items-center justify-content-center" style="width:2.5rem;height:2.5rem;background:rgba(23,51,14,0.08);color:var(--agro-primary);">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem;">' +
      icone +
      '</span>' +
      '</div>' +
      '<div>' +
      '<p class="fw-700 mb-0" style="font-size:0.875rem;">' +
      esc(nome) +
      '</p>' +
      '<p class="mb-0 text-muted-agro" style="font-size:0.6875rem;">Cód: ' +
      esc(insumo.id) +
      '</p>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '<td><span class="text-muted-agro" style="font-size:0.8125rem;">' +
      esc(categoria) +
      '</span></td>' +
      '<td class="text-end">' +
      '<p class="fw-700 mb-0' +
      qtdClasse +
      '" style="font-size:0.875rem;">' +
      formatarNumero(qtd) +
      ' ' +
      esc(unidade) +
      '</p>' +
      '<p class="mb-0 ' +
      subClasse +
      '" style="font-size:0.6875rem;">' +
      subTexto +
      '</p>' +
      '</td>' +
      '<td>' +
      '<div class="d-flex align-items-center gap-2">' +
      '<span class="rounded-circle" style="width:0.5rem;height:0.5rem;background:var(--agro-secondary);display:inline-block;flex-shrink:0;"></span>' +
      '<span class="text-muted-agro" style="font-size:0.875rem;">' +
      esc(fornecedor) +
      '</span>' +
      '</div>' +
      '</td>' +
      '<td><span class="badge-status ' +
      status.badgeClasse +
      '">' +
      status.badgeTexto +
      '</span></td>' +
      '<td class="text-end">' +
      '<div class="d-flex align-items-center justify-content-end gap-1">' +
      '<a href="detalhes.html?id=' +
      encodeURIComponent(insumo.id) +
      '" class="btn-icon" aria-label="Ver detalhes">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem;">visibility</span>' +
      '</a>' +
      '<a href="editar.html?id=' +
      encodeURIComponent(insumo.id) +
      '" class="btn-icon" aria-label="Editar">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem;">edit</span>' +
      '</a>' +
      '<button type="button" class="btn-icon btn-excluir" data-id="' +
      esc(insumo.id) +
      '" data-nome="' +
      esc(nome) +
      '" aria-label="Excluir">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem;">delete</span>' +
      '</button>' +
      '</div>' +
      '</td>' +
      '</tr>'
    );
  }

  // Renderiza a lista inteira no #corpoTabelaEstoque (substitui as linhas estáticas).
  function renderizar(lista) {
    $corpo.empty();

    if (!lista || lista.length === 0) {
      // Estado vazio: nenhuma linha cadastrada (ID 23 — passo 4 do escopo).
      $corpo.html(
        '<tr id="linhaVazia"><td colspan="6" class="text-center text-muted-agro py-5" style="font-size:0.9375rem;">' +
          'Nenhum insumo cadastrado.' +
          '</td></tr>'
      );
      atualizarContagens(0, 0);
      return;
    }

    var html = '';
    lista.forEach(function (insumo) {
      html += montarLinha(insumo);
    });
    // Linha auxiliar (oculta) exibida quando um filtro não retorna resultados.
    html +=
      '<tr id="linhaSemResultado" style="display:none;"><td colspan="6" class="text-center text-muted-agro py-5" style="font-size:0.9375rem;">' +
      'Nenhum insumo corresponde ao filtro.' +
      '</td></tr>';
    $corpo.html(html);
    atualizarContagens(lista.length, lista.length);
  }

  // Atualiza os contadores textuais (filtro e rodapé) com a contagem real.
  function atualizarContagens(visiveis, total) {
    $('#totalItens').text(total);
    $('#contagemEstoque').text(
      'Exibindo ' + visiveis + ' de ' + total + ' ' + (total === 1 ? 'item' : 'itens')
    );
  }

  // ── Filtros e busca (ID 20) ──────────────────────────────────────────────────

  // Aplica busca + categoria juntas, animando as linhas com fadeIn/fadeOut.
  function aplicarFiltros() {
    var termo = ($busca.val() || '').trim().toLowerCase();
    var $linhas = $corpo.find('tr.linha-insumo');
    var visiveis = 0;

    $linhas.each(function () {
      var $tr = $(this);
      var cat = String($tr.data('categoria') || '').toLowerCase();
      var casaCategoria = categoriaAtiva === '' || cat === categoriaAtiva.toLowerCase();
      var casaBusca = termo === '' || $tr.text().toLowerCase().indexOf(termo) !== -1;

      if (casaCategoria && casaBusca) {
        $tr.fadeIn(150);
        visiveis += 1;
      } else {
        $tr.fadeOut(150);
      }
    });

    // Mostra a mensagem de "sem resultado" só quando há linhas, mas nenhuma passou.
    $('#linhaSemResultado').toggle(visiveis === 0 && $linhas.length > 0);
    atualizarContagens(visiveis, $linhas.length);
  }

  // Busca em tempo real conforme o texto digitado no campo do topo.
  $busca.on('input', function () {
    aplicarFiltros();
  });

  // Botões-pílula de categoria: alternam a aparência ativo/inativo e filtram.
  $('.btn-categoria').on('click', function () {
    var valor = $(this).data('categoria');
    categoriaAtiva = valor ? String(valor) : '';
    $('.btn-categoria').removeClass('btn-agro-primary').addClass('btn-agro-secondary');
    $(this).removeClass('btn-agro-secondary').addClass('btn-agro-primary');
    aplicarFiltros();
  });

  // ── Exclusão com Modal (ID 20 + ID 22) ───────────────────────────────────────

  var idParaExcluir = null;
  var modalEl = document.getElementById('modalExcluir');
  var modalExcluir = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

  // Clique no botão de excluir de uma linha: guarda o id e abre o modal.
  $corpo.on('click', '.btn-excluir', function () {
    idParaExcluir = $(this).data('id');
    var nome = $(this).data('nome');
    $('#nomeInsumoExcluir').text(nome ? String(nome) : 'este insumo');
    if (modalExcluir) {
      modalExcluir.show();
    }
  });

  // Confirmação: chama a API (DELETE — ID 22) e remove a linha com animação.
  $('#btnConfirmarExclusao').on('click', async function () {
    if (idParaExcluir === null) {
      return;
    }

    var ok = await window.AgroApi.excluirInsumo(idParaExcluir);
    if (modalExcluir) {
      modalExcluir.hide();
    }

    if (ok) {
      var $linha = $corpo.find('tr.linha-insumo[data-id="' + idParaExcluir + '"]');
      $linha.fadeOut(250, function () {
        $(this).remove();
        if ($corpo.find('tr.linha-insumo').length === 0) {
          renderizar([]); // volta ao estado vazio quando some o último item
        } else {
          aplicarFiltros(); // recalcula contadores respeitando o filtro ativo
        }
      });
      window.mostrarToast('Insumo excluído com sucesso.', 'sucesso');
    } else {
      window.mostrarToast('Não foi possível excluir o insumo.', 'erro');
    }

    idParaExcluir = null;
  });

  // ── Carga inicial (ID 23) ────────────────────────────────────────────────────

  async function carregar() {
    var lista = await window.AgroApi.listarInsumos();
    renderizar(lista);
  }
  carregar();
});
