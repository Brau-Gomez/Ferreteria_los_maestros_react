// Vista "Pago con error": explica el motivo y permite reintentar el pago.
// Presentacional: el carrito se conserva, solo avisa con onReintentar.
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function PagoConError({ mensaje, onReintentar }) {
  return (
    <div className="sin-resultados">
      <Alert variant="danger">No se pudo realizar el pago.</Alert>
      <h1>Pago con error</h1>
      <p>{mensaje}</p>
      <Button variant="warning" onClick={onReintentar}>
        Volver a realizar el pago
      </Button>
    </div>
  );
}

export default PagoConError;