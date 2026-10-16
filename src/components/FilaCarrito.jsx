// Fila de producto en la página del carrito (antes .cart-item).
// Mantiene el input numérico del original; la página recibe el callback
// para actualizar la cantidad en el CartContext.
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ImagenProducto from './ImagenProducto.jsx';
import { formatearDinero } from '../utils/dinero.js';

function FilaCarrito({ producto, onCambiarCantidad, onQuitar }) {
  const subtotal = producto.precioVenta * producto.cantidad;

  function cambiarDesdeInput(evento) {
    onCambiarCantidad(producto.codigo, Number(evento.target.value));
  }

  return (
    <article className="fila-carrito card mb-3">
      <div className="card-body d-flex align-items-center gap-3">
        <ImagenProducto producto={producto} className="miniatura-carrito" />
        <div className="flex-grow-1">
          <h2 className="h6 mb-1">{producto.nombre}</h2>
          <p className="text-body-secondary mb-0">
            {formatearDinero(producto.precioVenta)}
          </p>
        </div>
        <div className="acciones-fila-carrito">
          <Form.Label
            htmlFor={`cantidad-${producto.codigo}`}
            className="small mb-1"
          >
            Cantidad
          </Form.Label>
          <Form.Control
            id={`cantidad-${producto.codigo}`}
            className="input-cantidad-carrito"
            type="number"
            min={0}
            max={producto.stock}
            step={1}
            value={producto.cantidad}
            onChange={cambiarDesdeInput}
          />
          <strong>{formatearDinero(subtotal)}</strong>
          <Button
            variant="link"
            className="p-0 enlace-quitar"
            onClick={() => onQuitar(producto.codigo)}
          >
            Quitar
          </Button>
        </div>
      </div>
    </article>
  );
}

export default FilaCarrito;
