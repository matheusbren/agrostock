/*
 * api.js — ID 22/23: JSON Server (fake API) com fallback para localStorage
 *
 * Esta é a "ponte" da camada de dados — o coração dos IDs 22/23 (+ 14):
 *
 *   Cada função decide a FONTE dos dados conforme window.AGRO_CONFIG:
 *   - usarJsonServer === true  -> fala com o JSON Server via fetch (GET/POST/
 *     PUT/DELETE em `${apiBase}/insumos`). É o ID 22 (requisição à API fake)
 *     e o ID 23 (os dados retornados alimentam as telas).
 *   - usarJsonServer === false -> delega para window.AgroStorage (localStorage,
 *     ID 14), simulando as mesmas operações.
 *
 *   Em AMBOS os caminhos as funções retornam dados no MESMO formato
 *   (lista -> array; item -> objeto; criar/editar -> objeto; excluir -> boolean).
 *   Assim os scripts de página NÃO precisam saber de onde o dado veio.
 *
 * Erros de rede são tratados com try/catch + toast, sem quebrar o layout.
 * Exposto em window.AgroApi.
 */
(function () {
  'use strict';

  var config = window.AGRO_CONFIG || {};
  var usarApi = config.usarJsonServer === true; // true só em localhost
  var base = config.apiBase; // ex.: 'http://localhost:3000' (null em produção)

  // Mostra um toast de erro de forma segura (mostrarToast é definido em app.js).
  function avisarErro(mensagem) {
    if (typeof window.mostrarToast === 'function') {
      window.mostrarToast(mensagem, 'erro');
    }
  }

  // Lança erro se a resposta HTTP não foi bem-sucedida (cai no catch de quem chamou).
  function checarResposta(resp) {
    if (!resp.ok) {
      throw new Error('HTTP ' + resp.status);
    }
  }

  // GET /insumos -> array de insumos.
  async function listarInsumos() {
    if (usarApi) {
      try {
        var resp = await fetch(base + '/insumos');
        checarResposta(resp);
        return await resp.json();
      } catch (e) {
        console.error('Falha ao listar insumos via API:', e);
        avisarErro('Não foi possível carregar os insumos do servidor.');
        return [];
      }
    }
    // Fallback: localStorage (Web Storage, ID 14).
    return window.AgroStorage.lerInsumos();
  }

  // GET /insumos/:id -> objeto do insumo (ou null).
  async function obterInsumo(id) {
    if (usarApi) {
      try {
        var resp = await fetch(base + '/insumos/' + id);
        checarResposta(resp);
        return await resp.json();
      } catch (e) {
        console.error('Falha ao obter insumo via API:', e);
        avisarErro('Não foi possível carregar o insumo.');
        return null;
      }
    }
    var lista = window.AgroStorage.lerInsumos();
    var achado = lista.filter(function (i) {
      return String(i.id) === String(id);
    })[0];
    return achado || null;
  }

  // POST /insumos -> objeto criado (com id atribuído pela fonte).
  async function criarInsumo(obj) {
    if (usarApi) {
      try {
        var resp = await fetch(base + '/insumos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj),
        });
        checarResposta(resp);
        return await resp.json();
      } catch (e) {
        console.error('Falha ao criar insumo via API:', e);
        avisarErro('Não foi possível salvar o insumo.');
        return null;
      }
    }
    return window.AgroStorage.adicionarInsumo(obj);
  }

  // PUT /insumos/:id -> objeto atualizado (ou null).
  async function editarInsumo(id, obj) {
    if (usarApi) {
      try {
        var resp = await fetch(base + '/insumos/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj),
        });
        checarResposta(resp);
        return await resp.json();
      } catch (e) {
        console.error('Falha ao editar insumo via API:', e);
        avisarErro('Não foi possível atualizar o insumo.');
        return null;
      }
    }
    return window.AgroStorage.atualizarInsumo(id, obj);
  }

  // DELETE /insumos/:id -> true em caso de sucesso, false em caso de falha.
  async function excluirInsumo(id) {
    if (usarApi) {
      try {
        var resp = await fetch(base + '/insumos/' + id, { method: 'DELETE' });
        checarResposta(resp);
        return true;
      } catch (e) {
        console.error('Falha ao excluir insumo via API:', e);
        avisarErro('Não foi possível excluir o insumo.');
        return false;
      }
    }
    return window.AgroStorage.removerInsumo(id);
  }

  // Exposição da API pública desta camada (mesma assinatura nos dois ambientes).
  window.AgroApi = {
    listarInsumos: listarInsumos,
    obterInsumo: obterInsumo,
    criarInsumo: criarInsumo,
    editarInsumo: editarInsumo,
    excluirInsumo: excluirInsumo,
  };
})();
