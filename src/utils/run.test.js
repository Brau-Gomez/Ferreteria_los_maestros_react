import { normalizarRun, runValido } from './run.js';

describe('normalizarRun', () => {
  it('quita puntos, guiones y espacios y pasa la K a mayúscula', () => {
    expect(normalizarRun('12.345.678-5')).toBe('123456785');
    expect(normalizarRun('9.876.543-k')).toBe('9876543K');
  });
});

describe('runValido', () => {
  it('acepta un RUN con dígito verificador correcto', () => {
    expect(runValido('123456785')).toBe(true);
    expect(runValido('12.345.678-5')).toBe(true);
  });

  it('rechaza un RUN con dígito verificador incorrecto', () => {
    expect(runValido('123456780')).toBe(false);
  });

  it('rechaza un RUN con formato inválido', () => {
    expect(runValido('abc')).toBe(false);
    expect(runValido('123')).toBe(false);
  });
});