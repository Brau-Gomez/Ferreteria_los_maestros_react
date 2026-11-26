import { validarClave, validarClaveNueva, validarCorreo, validarTexto } from './comunes.js';

describe('validarCorreo', () => {
  it('devuelve texto vacío con un correo permitido', () => {
    expect(validarCorreo('ana@duoc.cl')).toBe('');
    expect(validarCorreo('profe@profesor.duoc.cl')).toBe('');
    expect(validarCorreo('ana@gmail.com')).toBe('');
  });

  it('exige el correo', () => {
    expect(validarCorreo('   ')).toBe('El correo es obligatorio.');
  });

  it('rechaza un correo sin formato válido', () => {
    expect(validarCorreo('ana.duoc.cl')).toBe('Ingresa un correo válido.');
  });

  it('rechaza dominios no permitidos', () => {
    expect(validarCorreo('ana@yahoo.com')).toBe(
      'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.',
    );
  });
});

describe('validarClave', () => {
  it('acepta entre 4 y 10 caracteres', () => {
    expect(validarClave('abcd')).toBe('');
    expect(validarClave('abcdefghij')).toBe('');
  });

  it('rechaza claves demasiado cortas o largas', () => {
    const mensaje = 'La contraseña debe tener entre 4 y 10 caracteres.';
    expect(validarClave('abc')).toBe(mensaje);
    expect(validarClave('abcdefghijk')).toBe(mensaje);
  });
});

describe('validarTexto', () => {
  it('exige el texto cuando es obligatorio', () => {
    expect(validarTexto('  ', 'El nombre', 100, true)).toBe('El nombre es obligatorio.');
  });

  it('acepta un texto vacío cuando es opcional', () => {
    expect(validarTexto('', 'El nombre', 100, false)).toBe('');
  });

  it('rechaza un texto que supera el máximo', () => {
    expect(validarTexto('abcdef', 'El nombre', 5, true)).toBe(
      'El nombre admite hasta 5 caracteres.',
    );
  });
});
describe('validarClaveNueva', () => {
  it('acepta entre 8 y 10 caracteres, como exige auth-service', () => {
    expect(validarClaveNueva('abcd1234')).toBe('');
    expect(validarClaveNueva('abcd123456')).toBe('');
  });

  it('rechaza claves de menos de 8 o más de 10 caracteres', () => {
    const mensaje = 'La contraseña debe tener entre 8 y 10 caracteres.';
    expect(validarClaveNueva('abcd123')).toBe(mensaje);
    expect(validarClaveNueva('abcd1234567')).toBe(mensaje);
  });
});
