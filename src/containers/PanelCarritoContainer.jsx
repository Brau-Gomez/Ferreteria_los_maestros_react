// Contenedor del panel lateral del carrito: conecta el CartContext con el
// organismo presentacional PanelCarrito.
import PanelCarrito from '../components/organisms/PanelCarrito.jsx';
import { useCarrito } from '../hooks/useCarrito.js';

function PanelCarritoContainer() {
  const { items, total, panelAbierto, cerrarPanel, cambiarCantidad, quitar, vaciar } =
    useCarrito();

  return (
    <PanelCarrito
      items={items}
      total={total}
      abierto={panelAbierto}
      onCerrar={cerrarPanel}
      onCambiarCantidad={cambiarCantidad}
      onQuitar={quitar}
      onVaciar={vaciar}
    />
  );
}

export default PanelCarritoContainer;