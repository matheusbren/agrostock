/*
 * app.js — Utilidades compartilhadas do AgroStock
 *
 * Indicador de Desempenho: ID 20 (uso de jQuery para manipulação do DOM).
 *
 * Carregado em todas as páginas. Oferece:
 * - window.mostrarToast(mensagem, tipo): exibe uma notificação reutilizando o
 *   componente Toast do Bootstrap (cria um container fixo se ainda não houver);
 * - um $(document).ready() vazio, ponto de partida para os scripts de página.
 */

/**
 * Exibe um toast (notificação) reaproveitando o componente Toast do Bootstrap.
 * @param {string} mensagem - Texto exibido ao usuário.
 * @param {string} [tipo]   - 'sucesso' | 'erro' | 'info' (define a cor da marca).
 */
function mostrarToast(mensagem, tipo) {
  // jQuery: procura o container fixo; se não existir ainda, cria no canto inferior direito.
  var $container = $('#agroToastContainer');
  if ($container.length === 0) {
    $container = $('<div>', {
      id: 'agroToastContainer',
      class: 'toast-container position-fixed bottom-0 end-0 p-4',
      css: { zIndex: 1100 }
    }).appendTo(document.body);
  }

  // Cor do indicador conforme o tipo, usando as variáveis CSS do tema.
  var cores = {
    sucesso: 'var(--agro-primary)',
    erro: 'var(--agro-error)',
    info: 'var(--agro-on-surface-variant)'
  };
  var cor = cores[tipo] || cores.info;

  // Monta o markup do toast com as mesmas classes visuais já usadas nas páginas.
  var $toast = $(
    '<div class="toast toast-agro" role="alert" aria-live="assertive" aria-atomic="true">' +
      '<div class="d-flex align-items-center gap-3 p-3">' +
        '<span class="rounded-circle flex-shrink-0" style="width:0.6rem;height:0.6rem;"></span>' +
        '<span class="flex-grow-1" style="font-size:0.875rem;"></span>' +
        '<button type="button" class="btn-close ms-2" data-bs-dismiss="toast" aria-label="Fechar"></button>' +
      '</div>' +
    '</div>'
  );
  // Aplica a cor no indicador e usa .text() para escapar a mensagem (evita injeção de HTML).
  $toast.find('span.rounded-circle').css('background', cor);
  $toast.find('span.flex-grow-1').text(mensagem);
  $container.append($toast);

  // Inicializa e exibe via API do Bootstrap; remove o elemento do DOM ao esconder.
  var toast = new bootstrap.Toast($toast[0], { delay: 4000 });
  $toast.on('hidden.bs.toast', function () {
    $toast.remove();
  });
  toast.show();
}

// Expõe o helper como global para que os scripts de página possam usá-lo.
window.mostrarToast = mostrarToast;

// Ponto de entrada compartilhado — cada página adiciona o seu próprio script depois.
$(document).ready(function () {
  // Intencionalmente vazio: a inicialização específica fica nos scripts de página.
});
