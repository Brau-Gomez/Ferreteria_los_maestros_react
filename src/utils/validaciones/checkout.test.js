import { validarCheckout, validarTarjeta, hayErrores } from './checkout.js';

const datosValidos = {
  nombre: 'Ana',
  apellidos: 'Pérez Soto',
  correo: 'ana@gmail.com',
  entrega: 'Retiro en tienda',
  direccion: '',
  comuna: '',
  tarjeta: '4111 1111 1111 1111',
};

describe('validarTarjeta', () => {
  it('acepta 16 dígitos con o sin espacios', () => {
    expect(validarTarjeta('4111111111111111')).toBe('');
    expect(validarTarjeta('4111 1111 1111 1111')).toBe('');
  });

  it('rechaza vacío y largos incorrectos', () => {
    expect(validarTarjeta('')).toBe('El número de tarjeta es obligatorio.');
    expect(validarTarjeta('1234')).toBe('La tarjeta debe tener 16 dígitos.');
  });
});

describe('validarCheckout', () => {
  it('no marca errores con retiro en tienda y datos válidos', () => {
    expect(hayErrores(validarCheckout(datosValidos))).toBe(false);
  });

  it('exige dirección y comuna solo con despacho', () => {
    const errores = validarCheckout({ ...datosValidos, entrega: 'Despacho' });
    expect(errores.direccion).not.toBe('');
    expect(errores.comuna).toBe('Selecciona una comuna.');
  });

  it('marca nombre y correo vacíos', () => {
    const errores = validarCheckout({ ...datosValidos, nombre: '', correo: '' });
    expect(errores.nombre).not.toBe('');
    expect(errores.correo).toBe('El correo es obligatorio.');
    expect(hayErrores(errores)).toBe(true);
  });
});