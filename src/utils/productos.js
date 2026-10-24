// Utilidades del catálogo de productos.
// Portado desde js/compartido/utilidades.js y js/tienda/catalogo.js.

// Estado de stock de un producto.
// Portado desde estadoProducto() del utilidades.js original.
// Lo usan el catálogo, el detalle de producto y el panel admin.
export function estadoProducto(producto) {
  if (producto.stock <= producto.stockMinimo) return 'Stock crítico';
  return 'Disponible';
}

// Filtra el catálogo según los tres controles de la barra de filtros.
// Portado desde mostrarCatalogo() del js/tienda/catalogo.js original,
// separado como función pura para poder probarlo sin la interfaz:
// - texto: busca en código, nombre y marca (sin distinguir mayúsculas).
// - categoria: "Todas" o una categoría exacta.
// - soloStock: descarta los productos agotados.
export function filtrarProductos(
  productos,
  { texto = '', categoria = 'Todas', soloStock = false } = {},
) {
  const busqueda = texto.trim().toLowerCase();
  const visibles = [];
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const informacion = (
      producto.codigo +
      ' ' +
      producto.nombre +
      ' ' +
      (producto.marca || '')
    ).toLowerCase();
    if (busqueda && informacion.indexOf(busqueda) === -1) continue;
    if (categoria !== 'Todas' && categoria !== producto.categoria) continue;
    if (soloStock && producto.stock < 1) continue;
    visibles.push(producto);
  }
  return visibles;
}

// Lista ordenada de categorías presentes en el catálogo. El <select> del
// original se armaba desde los propios productos, no desde una lista fija.
export function categoriasPresentes(productos) {
  const categorias = [];
  for (let i = 0; i < productos.length; i++) {
    if (categorias.indexOf(productos[i].categoria) === -1)
      categorias.push(productos[i].categoria);
  }
  return categorias.sort();
}


// Productos marcados en oferta. Una oferta se define con enOferta: true y
// un precioAnterior mayor al precio de venta actual (precioVenta ya es el
// precio rebajado que se cobra en el carrito).
export function esOferta(producto) {
  return Boolean(producto.enOferta) && producto.precioAnterior > producto.precioVenta;
}

export function productosEnOferta(productos) {
  return productos.filter(esOferta);
}

// Porcentaje de descuento redondeado respecto del precio anterior.
export function porcentajeDescuento(producto) {
  if (!esOferta(producto)) return 0;
  return Math.round(
    ((producto.precioAnterior - producto.precioVenta) / producto.precioAnterior) * 100,
  );
}

// Cantidad de productos por categoría, en el orden de la lista recibida.
export function contarPorCategoria(productos, categorias) {
  return categorias.map((categoria) => ({
    categoria,
    cantidad: productos.filter((producto) => producto.categoria === categoria).length,
  }));
}
