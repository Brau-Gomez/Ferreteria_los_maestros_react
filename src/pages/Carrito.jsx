// Página del carrito y confirmación de pedido (Fase 5).
// Porta tienda/carrito.html + dibujarCarrito()/submit de carrito.js:
// filas editables, resumen, entrega y confirmación fiel en ep1-orders.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FilaCarrito from '../components/FilaCarrito.jsx';
import { useCarrito } from '../hooks/useCarrito.js';
import { useSesion } from '../hooks/useSesion.js';
import { formatearDinero } from '../utils/dinero.js';

function Carrito() {
  const { items, total, cambiarCantidad, quitar, confirmarPedido } = useCarrito();
  const { usuario } = useSesion();
  const [entrega, setEntrega] = useState('Retiro en tienda');
  const [aviso, setAviso] = useState(null);
  const [pedidoRecibido, setPedidoRecibido] = useState(false);

  function actualizarCantidad(codigo, cantidad) {
    const resultado = cambiarCantidad(codigo, cantidad);
    if (!resultado.ok) setAviso(resultado);
  }

  function confirmar(evento) {
    evento.preventDefault();
    const resultado = confirmarPedido(usuario, entrega);
    setAviso(resultado);
    if (resultado.ok) setPedidoRecibido(true);
  }

  // El original reemplazaba #cart-content al terminar el pedido. La
  // condición conserva el mismo resultado sin manipular el DOM a mano.
  if (pedidoRecibido) {
    return (
      <Container className="py-5">
        <div className="sin-resultados">
          <h1>Pedido recibido</h1>
          <p>Tu solicitud quedó guardada en este navegador.</p>
          <Link to="/cuenta">Ver mi cuenta</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Solicitud de productos</p>
      <h1 className="titulo-seccion mb-4">Tu carrito</h1>

      {aviso && (
        <Alert
          variant={aviso.ok ? 'success' : 'danger'}
          dismissible
          onClose={() => setAviso(null)}
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
            {items.map((producto) => (
              <FilaCarrito
                key={producto.codigo}
                producto={producto}
                onCambiarCantidad={actualizarCantidad}
                onQuitar={quitar}
              />
            ))}
          </Col>
          <Col lg={4}>
            <Card className="resumen-pedido">
              <Card.Body>
                <h2 className="h4">Resumen del pedido</h2>
                <p className="total-resumen">
                  Total <strong>{formatearDinero(total)}</strong>
                </p>
                <Form onSubmit={confirmar}>
                  <fieldset>
                    <legend className="fs-6">Tipo de entrega</legend>
                    <Form.Check
                      type="radio"
                      id="retiro-tienda"
                      name="entrega"
                      value="Retiro en tienda"
                      label="Retiro en tienda"
                      checked={entrega === 'Retiro en tienda'}
                      onChange={(evento) => setEntrega(evento.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      id="despacho"
                      name="entrega"
                      value="Despacho"
                      label="Despacho"
                      checked={entrega === 'Despacho'}
                      onChange={(evento) => setEntrega(evento.target.value)}
                    />
                  </fieldset>
                  <Button type="submit" variant="warning" className="w-100">
                    Confirmar pedido
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Carrito;
