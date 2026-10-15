// Estado de stock de un producto.
// Portado desde estadoProducto() del js/compartido/utilidades.js original.
// Lo usan el catálogo, el detalle de producto y el panel admin.
export function estadoProducto(producto) {
  if (producto.stock <= producto.stockMinimo) return 'Stock crítico';
  return 'Disponible';
}
