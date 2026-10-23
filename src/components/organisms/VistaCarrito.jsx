// Vista completa del carrito: encabezado, aviso, lista y resumen, o los
// estados "vacío" y "pedido recibido". Presentacional: sin estado propio.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListaCarrito from './ListaCarrito.jsx';
import ResumenPedido from './ResumenPedido.jsx';

function VistaCarrito({
  items,
  total,
  entrega,
  aviso,
  pedidoRecibido,
  onCambiarCantidad,
  onQuitar,
  onCambiarEntrega,
  onConfirmar,
  onCerrarAviso,
}) {
  // El original reemplazaba el contenido al terminar el pedido.
  if (pedidoRecibido) {
    return (
      <div className="sin-resultados">
        <h1>Pedido recibido</h1>
        <p>Tu solicitud quedó guardada en este navegador.</p>
        <Link to="/cuenta">Ver mi cuenta</Link>
      </div>
    );
  }

  return (
    <>
      <p className="eyebrow mb-2">Solicitud de productos</p>
      <h1 className="titulo-seccion mb-4">Tu carrito</h1>

      {aviso && (
        <Alert
          variant={aviso.ok ? 'success' : 'danger'}
          dismissible
          onClose={onCerrarAviso}
        >
          {aviso.mensaje}
        </Alert>
      )}

      {items.length === 0 ? (
        <div className="sin-resultados">
          <h2>Tu carrito está vacío</h2>
          <Link to="/productos">Ver catálogo</Link>
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <ListaCarrito
              items={items}
              onCambiarCantidad={onCambiarCantidad}
              onQuitar={onQuitar}
            />
          </Col>
          <Col lg={4}>
            <ResumenPedido
              total={total}
              entrega={entrega}
              onCambiarEntrega={onCambiarEntrega}
              onConfirmar={onConfirmar}
            />
          </Col>
        </Row>
      )}
    </>
  );
}

export default VistaCarrito;