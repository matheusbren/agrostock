/*
 * page-dashboard.js — Indicador de Desempenho: ID 24 (API pública Open-Meteo)
 *
 * Liga o painel (index.html) aos dados:
 * - ID 24: AgroPublicApis.buscarClima() (Open-Meteo) atualiza a temperatura e a
 *   descrição do card de clima; em falha mantém um texto neutro, sem quebrar o
 *   layout (exigência do tratamento de erro do ID 24);
 * - extra: o KPI de "estoque baixo" é calculado a partir de
 *   AgroApi.listarInsumos() (mesma regra usada no estoque).
 *
 * Só roda no painel (checa a existência de #climaTemp).
 */
$(document).ready(function () {
  if ($('#climaTemp').length === 0) {
    return; // não é o painel
  }

  // Rótulo do card reflete a cidade configurada (coordenadas usadas na Open-Meteo).
  var coords = (window.AGRO_CONFIG && window.AGRO_CONFIG.coords) || {};
  if (coords.cidade) {
    $('#climaLocal').text(coords.cidade);
  }

  // ── ID 24: clima atual (Open-Meteo) ──────────────────────────────────────────
  async function carregarClima() {
    var clima = await window.AgroPublicApis.buscarClima();
    if (clima && typeof clima.temperatura === 'number') {
      $('#climaTemp').text(Math.round(clima.temperatura) + '°C');
      $('#climaDesc').text(window.AgroPublicApis.descreverTempo(clima.codigo));
    } else {
      // Falha de rede/serviço: texto neutro, layout preservado.
      $('#climaTemp').text('—°C');
      $('#climaDesc').text('Clima indisponível no momento.');
    }
  }
  carregarClima();

  // ── KPI: itens com estoque baixo, a partir dos insumos ───────────────────────
  async function carregarKpis() {
    var lista = await window.AgroApi.listarInsumos();
    var baixos = lista.filter(function (i) {
      var q = Number(i.quantidade) || 0;
      var m = Number(i.estoqueMin) || 0;
      return q <= 0 || (m > 0 && q < m);
    }).length;
    $('#kpiEstoqueBaixo').text(baixos);
  }
  if ($('#kpiEstoqueBaixo').length) {
    carregarKpis();
  }
});
