// Container de la página Categorías: calcula cuántos productos tiene cada
// categoría vigente via API. Solo renderiza ListaCategorias.
import ListaCategorias from '@/components/organisms/catalogo/ListaCategorias.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { useCategorias } from '@/hooks/useProductos.js';
import { contarPorCategoria } from '@/utils/productos.js';

function CategoriasContainer() {
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  return <ListaCategorias categorias={contarPorCategoria(productos, categorias)} />;
}

export default CategoriasContainer;