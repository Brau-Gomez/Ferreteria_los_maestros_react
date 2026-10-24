// Container de la página Categorías: calcula cuántos productos tiene cada
// categoría oficial. Solo renderiza ListaCategorias.
import ListaCategorias from '../components/organisms/ListaCategorias.jsx';
import { categoriasProducto } from '../data/categorias.js';
import { useProductos } from '../hooks/useProductos.js';
import { contarPorCategoria } from '../utils/productos.js';

function CategoriasContainer() {
  const { productos } = useProductos();
  return <ListaCategorias categorias={contarPorCategoria(productos, categoriasProducto)} />;
}

export default CategoriasContainer;