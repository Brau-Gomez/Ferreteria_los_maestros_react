// Registro portado desde tienda/registro.html. La página solo arma el
// encabezado; el estado y el guardado viven en RegistroContainer.
import Container from 'react-bootstrap/Container';
import RegistroContainer from '@/containers/auth/RegistroContainer.jsx';

function Registro() {
  return (
    <Container className="py-5">
      <div className="pagina-angosta mx-auto">
        <h1>Crear una cuenta</h1>
        <p>Registro de cliente para esta demostración local.</p>
        <RegistroContainer />
      </div>
    </Container>
  );
}

export default Registro;