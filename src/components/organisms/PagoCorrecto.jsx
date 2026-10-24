// Vista "Pago correcto": número de pedido y resumen de lo pagado.
// Presentacional.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { formatearDinero } from '../../utils/dinero.js';

function PagoCorrecto({ pedido }) {
  return (
    <div className="sin-resultados">
      <Alert variant="success">Pago realizado correctamente.</Alert>
      <h1>Pedido {pedido.id}</h1>
      <p>
        Total pagado: <strong>{formatearDinero(pedido.total)}</strong>
      </p>
      <p>Entrega: {pedido.entrega}</p>
      <p>Enviamos el detalle a {pedido.correo}.</p>
      <Link to="/cuenta">Ver mis pedidos</Link>
    </div>
  );
}

export default PagoCorrecto;