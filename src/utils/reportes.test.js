import { resumenVentas, productosMasVendidos, ventasPorCategoria } from './reportes.js';

const pedidos = [
  {
    id: 'PED-1', total: 17970, delivery: 'Despacho',
    productos: [
      { codigo: 'A', nombre: 'Cemento', categoria: 'Mat. Construcción', precioVenta: 5990, cantidad: 3 },
    ],
  },
  {
    id: 'PED-2', total: 11980, delivery: 'Retiro en tienda',
    productos: [
      { codigo: 'A', nombre: 'Cemento', categoria: 'Mat. Construcción', precioVenta: 5990, cantidad: 1 },
      { codigo: 'B', nombre: 'Taladro', categoria: 'Herramientas', precioVenta: 5990, cantidad: 1 },
    ],
  },
];

describe('resumenVentas', () => {
  it('suma el total, cuenta órdenes y calcula el ticket promedio', () => {
    const resumen = resumenVentas(pedidos);
    expect(resumen.totalVentas).toBe(29950);
    expect(resumen.cantidadOrdenes).toBe(2);
    expect(resumen.ticketPromedio).toBe(14975);
  });

  it('separa las ventas por tipo de entrega', () => {
    const { porEntrega } = resumenVentas(pedidos);
    expect(porEntrega).toEqual([
      { entrega: 'Retiro en tienda', ordenes: 1, total: 11980 },
      { entrega: 'Despacho', ordenes: 1, total: 17970 },
    ]);
  });

  it('sin pedidos todo vale cero', () => {
    const resumen = resumenVentas([]);
    expect(resumen.totalVentas).toBe(0);
    expect(resumen.ticketPromedio).toBe(0);
  });
});

describe('productosMasVendidos', () => {
  it('acumula unidades por producto y ordena de mayor a menor', () => {
    const lista = productosMasVendidos(pedidos);
    expect(lista[0]).toEqual({ codigo: 'A', nombre: 'Cemento', unidades: 4, total: 23960 });
    expect(lista[1].codigo).toBe('B');
  });

  it('respeta el límite', () => {
    expect(productosMasVendidos(pedidos, 1)).toHaveLength(1);
  });

  it('ignora pedidos sin lista de productos', () => {
    expect(productosMasVendidos([{ id: 'PED-3', total: 1 }])).toEqual([]);
  });
});

describe('ventasPorCategoria', () => {
  it('agrupa por categoría y ordena por monto', () => {
    const lista = ventasPorCategoria(pedidos);
    expect(lista[0]).toEqual({ categoria: 'Mat. Construcción', unidades: 4, total: 23960 });
    expect(lista[1]).toEqual({ categoria: 'Herramientas', unidades: 1, total: 5990 });
  });

  it('usa "Sin categoría" cuando el producto no la trae', () => {
    const lista = ventasPorCategoria([{ id: 'PED-4', productos: [{ codigo: 'Z', precioVenta: 100, cantidad: 2 }] }]);
    expect(lista[0].categoria).toBe('Sin categoría');
  });
});