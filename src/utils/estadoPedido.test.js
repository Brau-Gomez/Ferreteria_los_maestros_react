import { estadoPedido } from './estadoPedido.js';

describe('estadoPedido', () => {
  it('por defecto un pedido está Pagado', () => {
    expect(estadoPedido({ id: 'PED-1', total: 1000 })).toBe('Pagado');
  });
  it('respeta el estado propio del pedido', () => {
    expect(estadoPedido({ id: 'PED-2', estado: 'Entregado' })).toBe('Entregado');
  });
  it('ignora estados vacíos o que no son texto', () => {
    expect(estadoPedido({ estado: '   ' })).toBe('Pagado');
    expect(estadoPedido({ estado: 5 })).toBe('Pagado');
    expect(estadoPedido(null)).toBe('Pagado');
  });
});