// Página con todas las categorías del catálogo.
import Container from 'react-bootstrap/Container';
import CategoriasContainer from '../containers/CategoriasContainer.jsx';

function Categorias() {
  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">Catálogo de materiales</p>
      <h1 className="titulo-seccion mb-4">Categorías</h1>
      <CategoriasContainer />
    </Container>
  );
}

export default Categorias;