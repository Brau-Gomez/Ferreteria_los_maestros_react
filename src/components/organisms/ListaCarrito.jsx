// Lista de filas del carrito. Presentacional: recibe los items y avisa
// los cambios de cantidad y las quitadas mediante callbacks.
import FilaCarrito from '../molecules/FilaCarrito.jsx';

function ListaCarrito({ items, onCambiarCantidad, onQuitar }) {
  return (
    <>
      {items.map((producto) => (
        <FilaCarrito
          key={producto.codigo}
          producto={producto}
          onCambiarCantidad={onCambiarCantidad}
          onQuitar={onQuitar}
        />
      ))}
    </>
  );
}

export default ListaCarrito;