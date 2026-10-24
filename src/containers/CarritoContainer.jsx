// Container del carrito: concentra el carrito y los avisos de cantidad.
// La confirmación del pedido se hace en el checkout. Solo renderiza VistaCarrito.
import { useState } from 'react';
import VistaCarrito from '../components/organisms/VistaCarrito.jsx';
import { useCarrito } from '../hooks/useCarrito.js';

function CarritoContainer() {
  const { items, total, cambiarCantidad, quitar } = useCarrito();
  // Aviso de la última acción: { ok, mensaje } o null.
  const [aviso, setAviso] = useState(null);

  function actualizarCantidad(codigo, cantidad) {
    const resultado = cambiarCantidad(codigo, cantidad);
    if (!resultado.ok) setAviso(resultado);
  }

  return (
    <VistaCarrito
      items={items}
      total={total}
      aviso={aviso}
      onCambiarCantidad={actualizarCantidad}
      onQuitar={quitar}
      onCerrarAviso={() => setAviso(null)}
    />
  );
}

export default CarritoContainer;