const { calcularIMC, classificarIMC } = require('../src/imc');

describe('calcularIMC', () => {
  test('cálculo correto do IMC (70 kg e 1,75 m)', () => {
    expect(calcularIMC(70, 1.75)).toBeCloseTo(22.86, 2);
  });

  test('cálculo com valor arredondado (80 kg e 1,80 m)', () => {
    expect(calcularIMC(80, 1.8)).toBeCloseTo(24.69, 2);
  });

  test('lança erro quando peso é zero', () => {
    expect(() => calcularIMC(0, 1.75)).toThrow('Peso deve ser maior que zero.');
  });

  test('lança erro quando peso é negativo', () => {
    expect(() => calcularIMC(-10, 1.75)).toThrow('Peso deve ser maior que zero.');
  });

  test('lança erro quando altura é zero', () => {
    expect(() => calcularIMC(70, 0)).toThrow('Altura deve ser maior que zero.');
  });

  test('lança erro quando altura é negativa', () => {
    expect(() => calcularIMC(70, -1.75)).toThrow('Altura deve ser maior que zero.');
  });

  test('lança erro quando peso não é número', () => {
    expect(() => calcularIMC('70', 1.75)).toThrow('Peso e altura devem ser números.');
  });

  test('lança erro quando altura não é número', () => {
    expect(() => calcularIMC(70, '1.75')).toThrow('Peso e altura devem ser números.');
  });

  test('lança erro quando peso é NaN', () => {
    expect(() => calcularIMC(NaN, 1.75)).toThrow('Peso e altura não podem ser NaN.');
  });
});

describe('classificarIMC', () => {
  test('classifica como "Abaixo do peso" para IMC < 18,5', () => {
    expect(classificarIMC(17.9)).toBe('Abaixo do peso');
  });

  test('classifica como "Peso normal" para IMC de 18,5 a 24,9', () => {
    expect(classificarIMC(18.5)).toBe('Peso normal');
    expect(classificarIMC(24.9)).toBe('Peso normal');
    expect(classificarIMC(22)).toBe('Peso normal');
  });

  test('classifica como "Sobrepeso" para IMC de 25 a 29,9', () => {
    expect(classificarIMC(25)).toBe('Sobrepeso');
    expect(classificarIMC(29.9)).toBe('Sobrepeso');
    expect(classificarIMC(27)).toBe('Sobrepeso');
  });

  test('classifica como "Obesidade" para IMC >= 30', () => {
    expect(classificarIMC(30)).toBe('Obesidade');
    expect(classificarIMC(35)).toBe('Obesidade');
  });

  test('lança erro quando IMC não é número', () => {
    expect(() => classificarIMC('22')).toThrow('IMC deve ser um número.');
  });
});