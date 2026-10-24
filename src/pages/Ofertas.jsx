// Página de ofertas: productos con precio rebajado.
import Container from 'react-bootstrap/Container';
import OfertasContainer from '../containers/OfertasContainer.jsx';

function Ofertas() {
  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Precios rebajados</p>
      <h1 className="titulo-seccion mb-4">Ofertas</h1>
      <OfertasContainer />
    </Container>
  );
}

export default Ofertas;