/*
 * storage.js — ID 14: Web Storage / localStorage
 *
 * Camada de persistência LOCAL do AgroStock. É a fonte de dados usada quando o
 * site roda no GitHub Pages (sem JSON Server). Tudo é guardado no localStorage
 * do navegador, então os dados permanecem após recarregar a página.
 *
 * Chaves usadas:
 * - 'agrostock:insumos'      -> lista (array) de insumos;
 * - 'agrostock:preferencias' -> objeto de preferências (usado em configuracoes).
 *
 * Todas as leituras/escritas usam try/catch para nunca quebrar o layout caso o
 * localStorage esteja indisponível (ex.: navegação privada). Exposto em
 * window.AgroStorage.
 */
(function () {
  'use strict';

  // Chaves do localStorage (centralizadas para evitar erros de digitação).
  var CHAVE_INSUMOS = 'agrostock:insumos';
  var CHAVE_PREFS = 'agrostock:preferencias';

  // Dados iniciais — espelham o db.json para o site já abrir com conteúdo.
  var SEED_INSUMOS = [
    { id: '1', nome: 'Fertilizante NPK 20-20-20', categoria: 'Fertilizante', quantidade: 2450, unidade: 'kg', fornecedorId: '1', dataCompra: '2026-03-15', estoqueMin: 500, descricao: 'Fertilizante mineral balanceado para adubação de cobertura em diversas culturas.' },
    { id: '2', nome: 'Semente de Soja RR', categoria: 'Semente', quantidade: 30, unidade: 'sacas', fornecedorId: '2', dataCompra: '2026-04-02', estoqueMin: 50, descricao: 'Semente de soja transgênica resistente a glifosato, alto vigor germinativo.' },
    { id: '3', nome: 'Glifosato 480 SL', categoria: 'Defensivo', quantidade: 450, unidade: 'litros', fornecedorId: '3', dataCompra: '2026-02-20', estoqueMin: 100, descricao: 'Herbicida sistêmico não seletivo para controle de plantas daninhas.' },
    { id: '4', nome: 'Ureia 46% N', categoria: 'Fertilizante', quantidade: 180, unidade: 'kg', fornecedorId: '1', dataCompra: '2026-01-28', estoqueMin: 200, descricao: 'Fonte nitrogenada concentrada para adubação de cobertura.' },
    { id: '5', nome: 'Semente de Milho Híbrido', categoria: 'Semente', quantidade: 120, unidade: 'sacas', fornecedorId: '2', dataCompra: '2026-03-18', estoqueMin: 40, descricao: 'Milho híbrido de alto rendimento, indicado para safra de verão.' },
    { id: '6', nome: 'Mancozebe Fungicida', categoria: 'Defensivo', quantidade: 25, unidade: 'kg', fornecedorId: '3', dataCompra: '2026-05-10', estoqueMin: 60, descricao: 'Fungicida de contato de amplo espectro para proteção foliar.' }
  ];

  // ── Insumos ────────────────────────────────────────────────────────────────

  // Lê a lista de insumos do localStorage; retorna [] se vazio ou em caso de erro.
  function lerInsumos() {
    try {
      var bruto = window.localStorage.getItem(CHAVE_INSUMOS);
      return bruto ? JSON.parse(bruto) : [];
    } catch (e) {
      console.error('Erro ao ler insumos do localStorage:', e);
      return [];
    }
  }

  // Grava a lista inteira de insumos; retorna true/false conforme sucesso.
  function salvarInsumos(arr) {
    try {
      window.localStorage.setItem(CHAVE_INSUMOS, JSON.stringify(arr || []));
      return true;
    } catch (e) {
      console.error('Erro ao salvar insumos no localStorage:', e);
      return false;
    }
  }

  // Gera um id string único = (maior id numérico existente) + 1.
  function proximoId(lista) {
    var maior = 0;
    lista.forEach(function (item) {
      var n = parseInt(item.id, 10);
      if (!isNaN(n) && n > maior) {
        maior = n;
      }
    });
    return String(maior + 1);
  }

  // Adiciona um insumo novo (gerando o id) e retorna o objeto criado.
  function adicionarInsumo(obj) {
    var lista = lerInsumos();
    var novo = Object.assign({}, obj, { id: proximoId(lista) });
    lista.push(novo);
    salvarInsumos(lista);
    return novo;
  }

  // Atualiza o insumo de id informado (mantendo o id) e retorna o objeto atualizado
  // (ou null se não encontrar).
  function atualizarInsumo(id, obj) {
    var lista = lerInsumos();
    var atualizado = null;
    var nova = lista.map(function (item) {
      if (String(item.id) === String(id)) {
        atualizado = Object.assign({}, item, obj, { id: item.id });
        return atualizado;
      }
      return item;
    });
    salvarInsumos(nova);
    return atualizado;
  }

  // Remove o insumo de id informado; retorna true se algo foi removido.
  function removerInsumo(id) {
    var lista = lerInsumos();
    var nova = lista.filter(function (item) {
      return String(item.id) !== String(id);
    });
    salvarInsumos(nova);
    return nova.length < lista.length;
  }

  // ── Preferências ─────────────────────────────────────────────────────────────

  // Lê o objeto de preferências; retorna {} se vazio ou em caso de erro.
  function lerPreferencias() {
    try {
      var bruto = window.localStorage.getItem(CHAVE_PREFS);
      return bruto ? JSON.parse(bruto) : {};
    } catch (e) {
      console.error('Erro ao ler preferências do localStorage:', e);
      return {};
    }
  }

  // Grava o objeto de preferências; retorna true/false conforme sucesso.
  function salvarPreferencias(obj) {
    try {
      window.localStorage.setItem(CHAVE_PREFS, JSON.stringify(obj || {}));
      return true;
    } catch (e) {
      console.error('Erro ao salvar preferências no localStorage:', e);
      return false;
    }
  }

  // ── Seed inicial ─────────────────────────────────────────────────────────────

  // Se ainda não há nada gravado na chave de insumos, semeia os dados iniciais.
  // (Usa getItem === null para diferenciar "nunca gravado" de "lista vazia".)
  function semear() {
    try {
      if (window.localStorage.getItem(CHAVE_INSUMOS) === null) {
        salvarInsumos(SEED_INSUMOS);
      }
    } catch (e) {
      console.error('Erro ao semear insumos iniciais:', e);
    }
  }
  semear();

  // Exposição da API pública desta camada.
  window.AgroStorage = {
    CHAVE_INSUMOS: CHAVE_INSUMOS,
    CHAVE_PREFS: CHAVE_PREFS,
    lerInsumos: lerInsumos,
    salvarInsumos: salvarInsumos,
    adicionarInsumo: adicionarInsumo,
    atualizarInsumo: atualizarInsumo,
    removerInsumo: removerInsumo,
    lerPreferencias: lerPreferencias,
    salvarPreferencias: salvarPreferencias
  };
})();
