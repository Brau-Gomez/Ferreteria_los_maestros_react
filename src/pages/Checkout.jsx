// Página de checkout. Solo aporta el contenedor visual; la lógica vive en
// CheckoutContainer. La ruta se protege en App.jsx (requiere sesión).
import Container from 'react-bootstrap/Container';
import CheckoutContainer from '../containers/CheckoutContainer.jsx';

function Checkout() {
  return (
    <Container className="py-5">
      <CheckoutContainer />
    </Container>
  );
}

export default Checkout;