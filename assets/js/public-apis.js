/*
 * public-apis.js — ID 24: APIs públicas (ViaCEP e Open-Meteo)
 *
 * Reúne o consumo de DUAS APIs públicas reais, ambas gratuitas e sem chave:
 * - ViaCEP    -> preenche endereço a partir do CEP (cadastro/edição de insumo);
 * - Open-Meteo -> traz o clima atual exibido no dashboard.
 *
 * Todas as chamadas usam async/await + fetch e tratam erro de rede com
 * try/catch (exigência do ID 24): em falha, avisam o usuário e/ou retornam null,
 * sem quebrar o layout. Exposto em window.AgroPublicApis.
 */
(function () {
  'use strict';

  // Mostra um toast de erro de forma segura (mostrarToast é definido em app.js).
  function avisarErro(mensagem) {
    if (typeof window.mostrarToast === 'function') {
      window.mostrarToast(mensagem, 'erro');
    }
  }

  // ── ViaCEP ───────────────────────────────────────────────────────────────────

  /**
   * Busca o endereço de um CEP na API ViaCEP.
   * @param {string} cep - CEP digitado (com ou sem máscara).
   * @returns {Promise<{endereco:string, cidade:string, estado:string}|null>}
   */
  async function buscarCEP(cep) {
    // Valida o formato ANTES de chamar a API (reaproveita o ID 12).
    if (!window.AgroValidators.validarCEP(cep)) {
      avisarErro('CEP inválido. Use 8 dígitos (ex.: 85010-260).');
      return null;
    }

    // Mantém só os 8 dígitos para montar a URL exigida pela ViaCEP.
    var digitos = String(cep).replace(/\D/g, '');

    try {
      var resp = await fetch('https://viacep.com.br/ws/' + digitos + '/json/');
      if (!resp.ok) {
        throw new Error('HTTP ' + resp.status);
      }
      var dados = await resp.json();

      // A ViaCEP responde { "erro": true } quando o CEP não existe.
      if (dados.erro === true) {
        avisarErro('CEP não encontrado.');
        return null;
      }

      // Monta o endereço a partir de logradouro + bairro (ignorando partes vazias).
      var partes = [dados.logradouro, dados.bairro].filter(function (p) {
        return p && p.trim() !== '';
      });

      return {
        endereco: partes.join(', '),
        cidade: dados.localidade || '',
        estado: dados.uf || ''
      };
    } catch (e) {
      console.error('Falha ao consultar a ViaCEP:', e);
      avisarErro('Não foi possível consultar o CEP. Verifique sua conexão.');
      return null;
    }
  }

  // ── Open-Meteo ───────────────────────────────────────────────────────────────

  /**
   * Traduz o weathercode (padrão WMO) da Open-Meteo em texto PT-BR.
   * @param {number} codigo
   * @returns {string}
   */
  function descreverTempo(codigo) {
    var tabela = {
      0: 'Céu limpo',
      1: 'Predominantemente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Névoa',
      48: 'Névoa com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa densa',
      56: 'Garoa congelante leve',
      57: 'Garoa congelante densa',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Neve fraca',
      73: 'Neve moderada',
      75: 'Neve forte',
      77: 'Grãos de neve',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva fortes',
      85: 'Pancadas de neve leves',
      86: 'Pancadas de neve fortes',
      95: 'Trovoada',
      96: 'Trovoada com granizo leve',
      99: 'Trovoada com granizo forte'
    };
    return tabela[codigo] || 'Condição indisponível';
  }

  /**
   * Busca o clima atual na Open-Meteo usando as coordenadas de AGRO_CONFIG.
   * @returns {Promise<{temperatura:number, codigo:number}|null>}
   */
  async function buscarClima() {
    var coords = (window.AGRO_CONFIG && window.AGRO_CONFIG.coords) || {};
    var url =
      'https://api.open-meteo.com/v1/forecast?latitude=' +
      coords.lat +
      '&longitude=' +
      coords.lon +
      '&current_weather=true';

    try {
      var resp = await fetch(url);
      if (!resp.ok) {
        throw new Error('HTTP ' + resp.status);
      }
      var dados = await resp.json();

      // A Open-Meteo entrega o clima atual em current_weather.
      if (!dados.current_weather) {
        return null;
      }
      return {
        temperatura: dados.current_weather.temperature,
        codigo: dados.current_weather.weathercode
      };
    } catch (e) {
      // Falha de clima NÃO deve impedir o dashboard de carregar: só registra e retorna null.
      console.error('Falha ao consultar a Open-Meteo:', e);
      return null;
    }
  }

  // Exposição da API pública deste módulo.
  window.AgroPublicApis = {
    buscarCEP: buscarCEP,
    buscarClima: buscarClima,
    descreverTempo: descreverTempo
  };
})();
