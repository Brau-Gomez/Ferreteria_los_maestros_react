import { categoriasPresentes, estadoProducto, filtrarProductos } from './productos.js';

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', categoria: 'Materiales', stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro percutor', marca: 'Bosch', categoria: 'Herramientas', stock: 0, stockMinimo: 2 },
  { codigo: 'HE002', nombre: 'Martillo carpintero', marca: 'Stanley', categoria: 'Herramientas', stock: 10, stockMinimo: 3 },
];

describe('filtrarProductos', () => {
  it('sin filtros devuelve todos los productos', () => {
    expect(filtrarProductos(catalogo)).toHaveLength(3);
  });

  it('busca por nombre sin distinguir mayúsculas', () => {
    const resultado = filtrarProductos(catalogo, { texto: 'TALADRO' });
    expect(resultado.map((p) => p.codigo)).toEqual(['HE001']);
  });

  it('busca por código y por marca', () => {
    expect(filtrarProductos(catalogo, { texto: 'mc001' })).toHaveLength(1);
    expect(filtrarProductos(catalogo, { texto: 'stanley' })).toHaveLength(1);
  });

  it('filtra por categoría exacta', () => {
    const resultado = filtrarProductos(catalogo, { categoria: 'Herramientas' });
    expect(resultado).toHaveLength(2);
  });

  it('con "solo stock" descarta los productos agotados', () => {
    const resultado = filtrarProductos(catalogo, { soloStock: true });
    expect(resultado.map((p) => p.codigo)).toEqual(['MC001', 'HE002']);
  });

  it('combina los tres filtros', () => {
    const resultado = filtrarProductos(catalogo, {
      texto: 'he',
      categoria: 'Herramientas',
      soloStock: true,
    });
    expect(resultado.map((p) => p.codigo)).toEqual(['HE002']);
  });

  it('devuelve lista vacía si nada coincide', () => {
    expect(filtrarProductos(catalogo, { texto: 'zzz' })).toEqual([]);
  });
});

describe('categoriasPresentes', () => {
  it('devuelve las categorías sin repetir y ordenadas', () => {
    expect(categoriasPresentes(catalogo)).toEqual(['Herramientas', 'Materiales']);
  });
});

describe('estadoProducto', () => {
  it('marca "Stock crítico" cuando el stock es igual o menor al mínimo', () => {
    expect(estadoProducto({ stock: 2, stockMinimo: 2 })).toBe('Stock crítico');
  });

  it('marca "Disponible" cuando el stock supera el mínimo', () => {
    expect(estadoProducto({ stock: 10, stockMinimo: 2 })).toBe('Disponible');
  });
});