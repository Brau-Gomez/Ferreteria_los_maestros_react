import { esOferta, productosEnOferta, porcentajeDescuento, contarPorCategoria } from './productos.js';

const normal = { codigo: 'A', categoria: 'Madera', precioVenta: 1000 };
const oferta = { codigo: 'B', categoria: 'Madera', precioVenta: 800, enOferta: true, precioAnterior: 1000 };
const ofertaInvalida = { codigo: 'C', categoria: 'Jardín', precioVenta: 1000, enOferta: true, precioAnterior: 900 };

describe('ofertas', () => {
  it('esOferta exige la marca y un precio anterior mayor', () => {
    expect(esOferta(oferta)).toBe(true);
    expect(esOferta(normal)).toBe(false);
    expect(esOferta(ofertaInvalida)).toBe(false);
  });

  it('productosEnOferta devuelve solo las ofertas válidas', () => {
    expect(productosEnOferta([normal, oferta, ofertaInvalida])).toEqual([oferta]);
  });

  it('porcentajeDescuento redondea y vale 0 sin oferta', () => {
    expect(porcentajeDescuento(oferta)).toBe(20);
    expect(porcentajeDescuento({ ...oferta, precioVenta: 667 })).toBe(33);
    expect(porcentajeDescuento(normal)).toBe(0);
  });
});

describe('contarPorCategoria', () => {
  it('cuenta los productos de cada categoría, incluso las vacías', () => {
    const resultado = contarPorCategoria([normal, oferta, ofertaInvalida], ['Madera', 'Jardín', 'Pinturas']);
    expect(resultado).toEqual([
      { categoria: 'Madera', cantidad: 2 },
      { categoria: 'Jardín', cantidad: 1 },
      { categoria: 'Pinturas', cantidad: 0 },
    ]);
  });
});