// Resumen del carrito: total y botón para ir al checkout.
// Presentacional: la entrega y el pago se eligen en el checkout.
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { formatearDinero } from '../../utils/dinero.js';

function ResumenPedido({ total }) {
  return (
    <Card className="resumen-pedido">
      <Card.Body>
        <h2 className="h4">Resumen del pedido</h2>
        <p className="total-resumen">
          Total <strong>{formatearDinero(total)}</strong>
        </p>
        <Button as={Link} to="/checkout" variant="warning" className="w-100">
          Ir a pagar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ResumenPedido;