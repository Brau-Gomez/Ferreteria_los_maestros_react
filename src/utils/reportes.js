// Cálculos de los reportes de ventas del panel admin (funciones puras).
// Trabajan sobre los pedidos guardados en ep1-orders.

function productosDe(pedido) {
  return Array.isArray(pedido.productos) ? pedido.productos : [];
}

// Totales generales y ventas por tipo de entrega.
export function resumenVentas(pedidos) {
  const totalVentas = pedidos.reduce((suma, pedido) => suma + (Number(pedido.total) || 0), 0);
  const cantidadOrdenes = pedidos.length;
  const ticketPromedio = cantidadOrdenes ? Math.round(totalVentas / cantidadOrdenes) : 0;

  const porEntrega = ['Retiro en tienda', 'Despacho'].map((entrega) => {
    const delTipo = pedidos.filter((pedido) => pedido.delivery === entrega);
    return {
      entrega,
      ordenes: delTipo.length,
      total: delTipo.reduce((suma, pedido) => suma + (Number(pedido.total) || 0), 0),
    };
  });

  return { totalVentas, cantidadOrdenes, ticketPromedio, porEntrega };
}

// Productos con más unidades vendidas (de mayor a menor).
export function productosMasVendidos(pedidos, limite = 5) {
  const acumulado = new Map();
  pedidos.forEach((pedido) => {
    productosDe(pedido).forEach((producto) => {
      const cantidad = Number(producto.cantidad) || 0;
      const actual = acumulado.get(producto.codigo) || {
        codigo: producto.codigo,
        nombre: producto.nombre,
        unidades: 0,
        total: 0,
      };
      actual.unidades += cantidad;
      actual.total += cantidad * (Number(producto.precioVenta) || 0);
      acumulado.set(producto.codigo, actual);
    });
  });
  return [...acumulado.values()]
    .sort((a, b) => b.unidades - a.unidades || b.total - a.total)
    .slice(0, limite);
}

// Ventas agrupadas por categoría (de mayor a menor monto).
export function ventasPorCategoria(pedidos) {
  const acumulado = new Map();
  pedidos.forEach((pedido) => {
    productosDe(pedido).forEach((producto) => {
      const categoria = producto.categoria || 'Sin categoría';
      const cantidad = Number(producto.cantidad) || 0;
      const actual = acumulado.get(categoria) || { categoria, unidades: 0, total: 0 };
      actual.unidades += cantidad;
      actual.total += cantidad * (Number(producto.precioVenta) || 0);
      acumulado.set(categoria, actual);
    });
  });
  return [...acumulado.values()].sort((a, b) => b.total - a.total);
}