/**
 * Cálculo e classificação do Índice de Massa Corporal (IMC).
 *
 * Este módulo é compatível com Node.js (para testes com Jest) e com navegadores
 * (para a página estática publicada no GitHub Pages). O export só é aplicado
 * quando o objeto `module` existe, evitando quebrar a página no navegador.
 */

/**
 * Calcula o IMC a partir de peso (kg) e altura (m).
 * @param {number} peso - Peso em quilogramas.
 * @param {number} altura - Altura em metros.
 * @returns {number} IMC arredondado para 2 casas decimais.
 * @throws {Error} Se peso ou altura forem zero, negativos ou não números.
 */
function calcularIMC(peso, altura) {
  if (typeof peso !== 'number' || typeof altura !== 'number') {
    throw new Error('Peso e altura devem ser números.');
  }

  if (Number.isNaN(peso) || Number.isNaN(altura)) {
    throw new Error('Peso e altura não podem ser NaN.');
  }

  if (peso <= 0) {
    throw new Error('Peso deve ser maior que zero.');
  }

  if (altura <= 0) {
    throw new Error('Altura deve ser maior que zero.');
  }

  const imc = peso / (altura * altura);
  return Number(imc.toFixed(2));
}

/**
 * Classifica o IMC nas faixas definidas pela Organização Mundial da Saúde.
 * @param {number} imc - Valor do IMC já calculado.
 * @returns {string} Classificação: "Abaixo do peso", "Peso normal", "Sobrepeso" ou "Obesidade".
 * @throws {Error} Se o IMC não for um número.
 */
function classificarIMC(imc) {
  if (typeof imc !== 'number' || Number.isNaN(imc)) {
    throw new Error('IMC deve ser um número.');
  }

  if (imc < 18.5) {
    return 'Abaixo do peso';
  }

  if (imc <= 24.9) {
    return 'Peso normal';
  }

  if (imc <= 29.9) {
    return 'Sobrepeso';
  }

  return 'Obesidade';
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('form-imc');
  const pesoInput = document.getElementById('peso');
  const alturaInput = document.getElementById('altura');
  const resultado = document.getElementById('resultado');
  const imcValor = document.getElementById('imc-valor');
  const classificacao = document.getElementById('classificacao');
  const erro = document.getElementById('erro');
  const erroMensagem = document.getElementById('erro-mensagem');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resultado.hidden = true;
    erro.hidden = true;

    if (!pesoInput.value || !alturaInput.value) {
      erroMensagem.textContent = 'Informe peso e altura.';
      erro.hidden = false;
      return;
    }

    try {
      const imc = calcularIMC(pesoInput.valueAsNumber, alturaInput.valueAsNumber);
      imcValor.textContent = imc.toFixed(2);
      classificacao.textContent = classificarIMC(imc);
      resultado.hidden = false;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      erroMensagem.textContent = error.message;
      erro.hidden = false;
    }
  });
}

// Exporta apenas quando rodando no Node (jest, etc.).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcularIMC, classificarIMC };
}