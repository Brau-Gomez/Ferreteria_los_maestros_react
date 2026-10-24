// Página de una categoría: reutiliza el catálogo con la categoría ya elegida.
// Si la categoría de la URL no existe, muestra un aviso con enlace de vuelta.
import { Link, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ProductosContainer from '../containers/ProductosContainer.jsx';
import { categoriasProducto } from '../data/categorias.js';

function CategoriaDetalle() {
  const { categoria } = useParams();

  if (!categoriasProducto.includes(categoria)) {
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
      {/* key: al cambiar de categoría el catálogo reinicia sus filtros. */}
      <ProductosContainer key={categoria} categoriaInicial={categoria} />
    </Container>
  );
}

export default CategoriaDetalle;