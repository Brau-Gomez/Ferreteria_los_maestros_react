// Vista de una categoría (presentacional): encabezado + contenido, o aviso
// si la categoría no existe. El catálogo llega como children.
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

function VistaCategoria({ categoria, existe, children }) {
  if (!existe) {
    return (
      <Container className="py-5">
        <div className="sin-resultados">
          <h1>Categoría no encontrada</h1>
          <Link to="/categorias">Ver todas las categorías</Link>
        </div>
      </Container>
    );
  }
  return (
    <Container className="py-5">
      <p className="eyebrow mb-2">
        <Link to="/categorias">Categorías</Link> / {categoria}
      </p>
      <h1 className="titulo-seccion mb-3">{categoria}</h1>
      {children}
    </Container>
  );
}

export default VistaCategoria;