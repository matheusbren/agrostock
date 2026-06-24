/*
 * page-relatorios.js — Indicadores de Desempenho: ID 20, 22, 23
 *
 * Liga relatorios.html à camada de dados:
 * - ID 22/23: AgroApi.listarInsumos() alimenta os KPIs, a distribuição por
 *   categoria e o histórico de alertas — tudo calculado a partir dos insumos
 *   reais (localStorage em produção; JSON Server em localhost);
 * - ID 20: jQuery monta o DOM dinamicamente (.html()).
 *
 * Observação: o gráfico de "Movimentação Mensal" e o seletor de período
 * permanecem visuais (o modelo de dados é um retrato atual, sem histórico de
 * entradas/saídas para uma série temporal).
 *
 * Só roda na página de relatórios (checa a existência de #repCorpoAlertas).
 */
$(document).ready(function () {
  if ($('#repCorpoAlertas').length === 0) {
    return; // não é a página de relatórios
  }

  // Escapa o valor para uso seguro dentro de HTML.
  function esc(valor) {
    if (valor === null || valor === undefined) {
      valor = '';
    }
    return $('<div>').text(String(valor)).html();
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

  // Classifica um insumo pela quantidade x estoque mínimo.
  function classificar(insumo) {
    var q = Number(insumo.quantidade) || 0;
    var m = Number(insumo.estoqueMin) || 0;
    if (q <= 0) {
      return 'esgotado';
    }
    if (m > 0 && q < m) {
      return 'baixo';
    }
    return 'ok';
  }

  // Cor da barra/percentual conforme a categoria (com fallback).
  function corCategoria(cat) {
    var c = String(cat).toLowerCase();
    if (c.indexOf('fertil') === 0) {
      return { bar: 'bar-primary', cor: 'var(--agro-primary)' };
    }
    if (c.indexOf('sement') === 0) {
      return { bar: 'bar-secondary', cor: 'var(--agro-secondary)' };
    }
    if (c.indexOf('defensiv') === 0 || c.indexOf('pesticid') === 0) {
      return { bar: 'bar-tertiary', cor: 'var(--agro-tertiary)' };
    }
    return { bar: 'bar-primary', cor: 'var(--agro-primary)' };
  }

  // ── KPIs: contagem por situação de estoque ───────────────────────────────────
  function renderKpis(lista) {
    var ok = 0;
    var baixo = 0;
    var esgotado = 0;
    lista.forEach(function (insumo) {
      var s = classificar(insumo);
      if (s === 'esgotado') {
        esgotado += 1;
      } else if (s === 'baixo') {
        baixo += 1;
      } else {
        ok += 1;
      }
    });
    $('#repTotal').text(lista.length);
    $('#repOk').text(ok);
    $('#repBaixo').text(baixo);
    $('#repEsgotado').text(esgotado);
  }

  // ── Distribuição por categoria (percentual por nº de itens) ───────────────────
  function renderCategorias(lista) {
    if (lista.length === 0) {
      $('#repCategorias').html(
        '<p class="text-muted-agro mb-0" style="font-size:0.875rem;">Nenhum insumo cadastrado.</p>'
      );
      return;
    }

    var grupos = {};
    lista.forEach(function (insumo) {
      var cat = insumo.categoria || 'Sem categoria';
      grupos[cat] = (grupos[cat] || 0) + 1;
    });

    var total = lista.length;
    var html = '';
    Object.keys(grupos)
      .sort()
      .forEach(function (cat) {
        var pct = Math.round((grupos[cat] / total) * 100);
        var c = corCategoria(cat);
        html +=
          '<div>' +
          '<div class="d-flex justify-content-between mb-2">' +
          '<span class="fw-700" style="font-size:0.875rem;">' +
          esc(cat) +
          '</span>' +
          '<span class="fw-700" style="font-size:0.875rem;color:' +
          c.cor +
          ';">' +
          pct +
          '%</span>' +
          '</div>' +
          '<div class="progress-agro" style="height:8px;"><div class="bar ' +
          c.bar +
          '" style="width:' +
          pct +
          '%"></div></div>' +
          '</div>';
      });
    $('#repCategorias').html(html);
  }

  // ── Histórico de alertas: itens em estoque baixo ou esgotado ──────────────────
  function renderAlertas(lista) {
    var alertas = lista.filter(function (insumo) {
      return classificar(insumo) !== 'ok';
    });

    if (alertas.length === 0) {
      $('#repCorpoAlertas').html(
        '<tr><td colspan="4" class="text-center text-muted-agro py-4" style="font-size:0.875rem;">' +
          'Nenhum alerta de estoque no momento.' +
          '</td></tr>'
      );
      $('#repContagemAlertas').text('Nenhum alerta');
      return;
    }

    var html = '';
    alertas.forEach(function (insumo) {
      var esgotado = classificar(insumo) === 'esgotado';
      var badgeClasse = esgotado ? 'badge-esgotado' : 'badge-estoque-baixo';
      var badgeTexto = esgotado ? 'Esgotado' : 'Estoque Baixo';
      html +=
        '<tr>' +
        '<td class="fw-700" style="font-size:0.875rem;">' +
        esc(insumo.nome) +
        '</td>' +
        '<td class="text-muted-agro" style="font-size:0.8125rem;">' +
        formatarData(insumo.dataCompra) +
        '</td>' +
        '<td class="text-muted-agro" style="font-size:0.8125rem;">' +
        esc(insumo.categoria || '—') +
        '</td>' +
        '<td><span class="badge-status ' +
        badgeClasse +
        '">' +
        badgeTexto +
        '</span></td>' +
        '</tr>';
    });
    $('#repCorpoAlertas').html(html);

    var n = alertas.length;
    $('#repContagemAlertas').text(
      'Mostrando ' + n + ' de ' + n + ' ' + (n === 1 ? 'alerta' : 'alertas')
    );
  }

  // ── Carga inicial ─────────────────────────────────────────────────────────────
  async function carregar() {
    var lista = await window.AgroApi.listarInsumos();
    renderKpis(lista);
    renderCategorias(lista);
    renderAlertas(lista);
  }
  carregar();
});
