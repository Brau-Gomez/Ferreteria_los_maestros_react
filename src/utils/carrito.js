// Cálculos derivados del carrito.
// Se separan del CartProvider para reutilizarlos en la página, el panel
// lateral y las pruebas sin depender de React ni de localStorage.

// Total de unidades que muestra el badge del Header.
export function cantidadCarrito(items) {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

// Total monetario del resumen de pedido y del panel lateral.
export function totalCarrito(items) {
  return items.reduce(
    (suma, item) => suma + item.precioVenta * item.cantidad,
    0,
  );
}
