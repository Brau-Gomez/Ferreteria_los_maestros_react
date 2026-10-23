// Container del carrito: concentra el carrito, la sesión, el tipo de
// entrega y la confirmación del pedido. Solo renderiza VistaCarrito.
import { useState } from 'react';
import VistaCarrito from '../components/organisms/VistaCarrito.jsx';
import { useCarrito } from '../hooks/useCarrito.js';
import { useSesion } from '../hooks/useSesion.js';

function CarritoContainer() {
  const { items, total, cambiarCantidad, quitar, confirmarPedido } = useCarrito();
  const { usuario } = useSesion();
  const [entrega, setEntrega] = useState('Retiro en tienda');
  // Aviso de la última acción: { ok, mensaje } o null.
  const [aviso, setAviso] = useState(null);
  const [pedidoRecibido, setPedidoRecibido] = useState(false);

  function actualizarCantidad(codigo, cantidad) {
    const resultado = cambiarCantidad(codigo, cantidad);
    if (!resultado.ok) setAviso(resultado);
  }

  function confirmar(evento) {
    evento.preventDefault();
    const resultado = confirmarPedido(usuario, entrega);
    setAviso(resultado);
    if (resultado.ok) setPedidoRecibido(true);
  }

  return (
    <VistaCarrito
      items={items}
      total={total}
      entrega={entrega}
      aviso={aviso}
      pedidoRecibido={pedidoRecibido}
      onCambiarCantidad={actualizarCantidad}
      onQuitar={quitar}
      onCambiarEntrega={setEntrega}
      onConfirmar={confirmar}
      onCerrarAviso={() => setAviso(null)}
    />
  );
}

export default CarritoContainer;