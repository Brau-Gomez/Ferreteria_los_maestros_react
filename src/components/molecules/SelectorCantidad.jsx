// Selector de cantidad de la ficha de producto (antes .detail-quantity).
// Porta los botones data-detail-inc/dec del js/tienda/producto-detalle.js
// original: los botones +/- ajustan el valor entre 1 y el stock disponible.
// Componente controlado: el valor vive en la página que lo usa.
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SelectorCantidad({ cantidad, onCambiar, tope, disabled = false }) {
  // Clampa igual que el original: mínimo 1, máximo el tope recibido.
  function ajustar(delta) {
    const nueva = Math.min(Math.max(1, cantidad + delta), tope);
    if (nueva !== cantidad) onCambiar(nueva);
  }

  // Lo escrito a mano también se ajusta a los límites del campo.
  function escribir(evento) {
    const escrita = Math.floor(Number(evento.target.value) || 1);
    onCambiar(Math.min(Math.max(1, escrita), tope));
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Form.Label htmlFor="detalle-cantidad" className="mb-0 fw-bold">
        Cantidad
      </Form.Label>
      <Button
        variant="outline-primary"
        className="boton-cantidad"
        aria-label="Quitar una unidad"
        disabled={disabled}
        onClick={() => ajustar(-1)}
      >
        &minus;
      </Button>
      <Form.Control
        id="detalle-cantidad"
        className="cantidad-input"
        type="number"
        min={1}
        max={tope}
        step={1}
        value={cantidad}
        disabled={disabled}
        onChange={escribir}
      />
      <Button
        variant="outline-primary"
        className="boton-cantidad"
        aria-label="Agregar una unidad"
        disabled={disabled}
        onClick={() => ajustar(1)}
      >
        +
      </Button>
    </div>
  );
}

export default SelectorCantidad;
