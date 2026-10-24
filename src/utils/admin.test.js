import { esCritico, productosCriticos } from './admin.js';

const normal = { codigo: 'A', stock: 10, stockMinimo: 3 };
const justo = { codigo: 'B', stock: 3, stockMinimo: 3 };
const agotado = { codigo: 'C', stock: 0, stockMinimo: 2 };

describe('stock crítico', () => {
  it('es crítico cuando el stock es igual o menor al mínimo', () => {
    expect(esCritico(normal)).toBe(false);
    expect(esCritico(justo)).toBe(true);
    expect(esCritico(agotado)).toBe(true);
  });

  it('productosCriticos filtra solo los críticos', () => {
    expect(productosCriticos([normal, justo, agotado])).toEqual([justo, agotado]);
  });
});