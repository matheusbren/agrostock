/*
 * validators.js — ID 12: validações por Regex
 *
 * Cada função é PURA (não toca no DOM) e retorna boolean. A expressão regular
 * de cada regra está comentada logo acima do seu uso, para defesa do ID 12.
 *
 * A função aplicarFeedback() é o único ponto que mexe no DOM: ela apenas
 * adiciona/remove as classes is-valid / is-invalid do Bootstrap e escreve a
 * mensagem inline — sem alterar nenhum CSS existente do projeto.
 *
 * Observação: a MÁSCARA de digitação dos campos (jQuery Mask, ID 21) fica em
 * app.js. Validação (aqui) e máscara (lá) são responsabilidades separadas.
 */

/**
 * Valida um endereço de e-mail.
 * @param {string} valor
 * @returns {boolean}
 */
function validarEmail(valor) {
  // Regex: texto sem espaços + "@" + domínio sem espaços + "." + extensão sem espaços.
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(valor).trim());
}

/**
 * Valida telefone brasileiro nos formatos "(00) 00000-0000" (celular) ou
 * "(00) 0000-0000" (fixo).
 * @param {string} valor
 * @returns {boolean}
 */
function validarTelefone(valor) {
  // Regex: "(" + 2 dígitos + ") " + 4 OU 5 dígitos + "-" + 4 dígitos.
  var regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return regex.test(String(valor).trim());
}

/**
 * Valida CEP com 8 dígitos, aceitando o hífen ("00000-000" ou "00000000").
 * @param {string} valor
 * @returns {boolean}
 */
function validarCEP(valor) {
  // Regex: 5 dígitos + hífen OPCIONAL + 3 dígitos.
  var regex = /^\d{5}-?\d{3}$/;
  return regex.test(String(valor).trim());
}

/**
 * Valida o nome do insumo: mínimo de 2 caracteres e não pode ser só espaços.
 * @param {string} valor
 * @returns {boolean}
 */
function validarNomeInsumo(valor) {
  // Regex: pelo menos 2 caracteres quaisquer (aplicada ao valor já sem espaços nas pontas).
  var regex = /^.{2,}$/;
  return regex.test(String(valor).trim());
}

/**
 * Valida quantidade: número inteiro ou decimal estritamente maior que zero.
 * @param {string|number} valor
 * @returns {boolean}
 */
function validarQuantidade(valor) {
  // Regex: um ou mais dígitos, com parte decimal opcional separada por "." ou ",".
  // Ex.: "10", "10.5", "10,5" passam no formato; "abc", "-3", "" não passam.
  var regex = /^\d+([.,]\d+)?$/;
  var texto = String(valor).trim();
  if (!regex.test(texto)) {
    return false;
  }
  // Converte vírgula decimal em ponto e exige valor > 0 (descarta "0" e "0,0").
  var numero = parseFloat(texto.replace(',', '.'));
  return numero > 0;
}

/**
 * Aplica feedback visual a um campo: liga/desliga as classes is-valid /
 * is-invalid do Bootstrap e mostra a mensagem inline logo abaixo do campo.
 * Não altera o CSS do projeto — só manipula classes e o elemento de mensagem.
 * @param {Element|jQuery} inputEl - campo de formulário.
 * @param {boolean} valido         - resultado da validação.
 * @param {string} mensagem        - texto exibido ao usuário.
 */
function aplicarFeedback(inputEl, valido, mensagem) {
  var $input = $(inputEl);

  // Alterna as classes de validação do Bootstrap.
  $input.removeClass('is-valid is-invalid');
  $input.addClass(valido ? 'is-valid' : 'is-invalid');

  // Procura (ou cria, na primeira vez) o elemento de mensagem após o campo.
  var $feedback = $input.nextAll('.valid-feedback, .invalid-feedback').first();
  if ($feedback.length === 0) {
    $feedback = $('<div></div>').insertAfter($input);
  }

  // Usa a classe de feedback correspondente do Bootstrap e força display:block,
  // para a mensagem aparecer sem depender de o formulário estar marcado como validado.
  $feedback
    .attr('class', valido ? 'valid-feedback' : 'invalid-feedback')
    .css('display', 'block')
    .text(mensagem || '');
}

// Expõe todas as funções num único objeto global, consumido pelos scripts de página.
window.AgroValidators = {
  validarEmail: validarEmail,
  validarTelefone: validarTelefone,
  validarCEP: validarCEP,
  validarNomeInsumo: validarNomeInsumo,
  validarQuantidade: validarQuantidade,
  aplicarFeedback: aplicarFeedback,
};
