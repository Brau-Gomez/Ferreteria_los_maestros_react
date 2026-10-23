// Tarjeta "Historial de pedidos" de Mi cuenta.
// Presentacional: lista los pedidos recibidos o invita a ir al catálogo.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import TarjetaPedido from '../molecules/TarjetaPedido.jsx';

function HistorialPedidos({ pedidos }) {
  return (
    <Card className="tarjeta-cuenta cuenta-ancha">
      <Card.Body>
        <h2 className="h5">Historial de pedidos</h2>
        {pedidos.length ? pedidos.map((pedido) => (
          <TarjetaPedido key={pedido.id} pedido={pedido} />
        )) : (
          <Alert variant="light" className="sin-resultados mb-0">
            <h3 className="h5">Todavía no tienes pedidos confirmados</h3>
            <p>Cuando confirmes una compra, aparecerá aquí con su detalle.</p>
            <Button as={Link} to="/productos" variant="warning">Ir al catálogo</Button>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default HistorialPedidos;