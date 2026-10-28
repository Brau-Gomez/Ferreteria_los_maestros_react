// Ingreso portado desde tienda/inicio-sesion.html. La página solo aporta
// el contenedor; el estado y el inicio de sesión viven en IngresoContainer.
import Container from 'react-bootstrap/Container';
import IngresoContainer from '@/containers/auth/IngresoContainer.jsx';

function Ingreso() {
  return (
    <Container className="pagina-angosta py-5">
      <IngresoContainer />
    </Container>
  );
}

export default Ingreso;