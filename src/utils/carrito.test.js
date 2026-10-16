import { cantidadCarrito, totalCarrito } from './carrito.js';

const items = [
  { codigo: 'MC001', precioVenta: 5990, cantidad: 2 },
  { codigo: 'HE002', precioVenta: 12000, cantidad: 1 },
];

describe('cantidadCarrito', () => {
  it('suma las unidades de todos los productos', () => {
    expect(cantidadCarrito(items)).toBe(3);
  });

  it('devuelve 0 con el carrito vacío', () => {
    expect(cantidadCarrito([])).toBe(0);
  });
});

describe('totalCarrito', () => {
  it('suma precio por cantidad de cada producto', () => {
    expect(totalCarrito(items)).toBe(5990 * 2 + 12000);
  });

  it('devuelve 0 con el carrito vacío', () => {
    expect(totalCarrito([])).toBe(0);
  });
});