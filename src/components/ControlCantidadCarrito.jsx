// Controles +/- compactos del panel lateral (antes .cart-panel-qty).
// Recibe estado y callbacks por props: no conoce localStorage ni Context.
import Button from 'react-bootstrap/Button';

function ControlCantidadCarrito({ cantidad, onCambiar, tope }) {
  return (
    <div className="control-cantidad-carrito">
      <Button
        variant="outline-primary"
        className="boton-cantidad-carrito"
        aria-label="Quitar una unidad"
        onClick={() => onCambiar(cantidad - 1)}
      >
        &minus;
      </Button>
      <span className="valor-cantidad-carrito">{cantidad}</span>
      <Button
        variant="outline-primary"
        className="boton-cantidad-carrito"
        aria-label="Agregar una unidad"
        disabled={cantidad >= tope}
        onClick={() => onCambiar(cantidad + 1)}
      >
        +
      </Button>
    </div>
  );
}

export default ControlCantidadCarrito;
