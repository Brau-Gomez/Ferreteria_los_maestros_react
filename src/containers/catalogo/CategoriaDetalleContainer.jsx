// Contenedor de la página de una categoría: lee la URL, consulta el servicio
// de categorías y reutiliza el catálogo con la categoría ya elegida.
import { useParams } from 'react-router-dom';
import VistaCategoria from '@/components/organisms/catalogo/VistaCategoria.jsx';
import ProductosContainer from '@/containers/catalogo/ProductosContainer.jsx';
import { obtenerCategorias } from '@/services/categorias.js';

function CategoriaDetalleContainer() {
  const { categoria } = useParams();
  const existe = obtenerCategorias().includes(categoria);

  return (
    <VistaCategoria categoria={categoria} existe={existe}>
      {/* key: al cambiar de categoría el catálogo reinicia sus filtros. */}
      <ProductosContainer key={categoria} categoriaInicial={categoria} />
    </VistaCategoria>
  );
}

export default CategoriaDetalleContainer;