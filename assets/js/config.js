/*
 * config.js — Configuração global do AgroStock
 *
 * Indicadores de Desempenho (apoio): ID 22 (JSON Server) e ID 14 (Web Storage).
 *
 * Estratégia de ambiente (GitHub Pages vs JSON Server):
 * - Em desenvolvimento (hostname "localhost" ou "127.0.0.1") usamos o JSON
 *   Server em http://localhost:3000 como fonte de dados (API REST fake).
 * - Em produção (GitHub Pages ou qualquer outro hostname) o JSON Server não
 *   existe, então a aplicação usa o localStorage do navegador como fonte de
 *   dados. Assim o site funciona offline e hospedado de forma estática.
 *
 * Este arquivo apenas DEFINE a configuração em window.AGRO_CONFIG.
 * Quem decide de onde ler/gravar é a camada api.js, consultando a flag
 * window.AGRO_CONFIG.usarJsonServer.
 */
(function () {
  'use strict';

  // hostname atual do navegador (ex.: "localhost", "127.0.0.1" ou "matheusbren.github.io").
  var host = window.location.hostname;

  // Verdadeiro somente quando a página está rodando na máquina do desenvolvedor.
  var ehLocal = host === 'localhost' || host === '127.0.0.1';

  // Configuração lida por todas as demais camadas/páginas.
  window.AGRO_CONFIG = {
    // Base da API fake (JSON Server). Fica null quando não há servidor (produção).
    apiBase: ehLocal ? 'http://localhost:3000' : null,
    // Flag usada pela camada de dados para escolher entre API e localStorage.
    usarJsonServer: ehLocal,
    // Coordenadas padrão para a API de clima (Open-Meteo) exibida no dashboard.
    coords: { lat: -25.39, lon: -51.46, cidade: 'Guarapuava-PR' }
  };
})();
