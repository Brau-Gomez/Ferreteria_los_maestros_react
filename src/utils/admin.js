// Utilidades del panel de administración.

// Un producto es crítico cuando su stock llegó al mínimo definido
// (misma regla que estadoProducto: "Stock crítico").
export function esCritico(producto) {
  return producto.stock <= producto.stockMinimo;
}

export function productosCriticos(productos) {
  return productos.filter(esCritico);
}