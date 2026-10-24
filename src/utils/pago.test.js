import { procesarPago } from './pago.js';

describe('procesarPago', () => {
  it('aprueba una tarjeta común', () => {
    expect(procesarPago('4111 1111 1111 1111')).toEqual({ ok: true, mensaje: 'Pago aprobado.' });
  });

  it('rechaza una tarjeta terminada en 0000', () => {
    const resultado = procesarPago('4111111111110000');
    expect(resultado.ok).toBe(false);
    expect(resultado.mensaje).toBe('El banco rechazó la tarjeta.');
  });
});