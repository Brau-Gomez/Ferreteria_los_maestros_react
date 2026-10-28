// Página del carrito y confirmación de pedido. La página solo aporta el
// contenedor de la vista; la lógica vive en CarritoContainer.
import Container from 'react-bootstrap/Container';
import CarritoContainer from '@/containers/carrito/CarritoContainer.jsx';

function Carrito() {
  return (
    <Container className="py-5">
      <CarritoContainer />
    </Container>
  );
}

export default Carrito;