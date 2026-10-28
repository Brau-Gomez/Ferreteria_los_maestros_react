// Container de la página Categorías: calcula cuántos productos tiene cada
// categoría vigente. Solo renderiza ListaCategorias.
import { useState } from 'react';
import ListaCategorias from '@/components/organisms/catalogo/ListaCategorias.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { obtenerCategorias } from '@/services/categorias.js';
import { contarPorCategoria } from '@/utils/productos.js';

function CategoriasContainer() {
  const { productos } = useProductos();
  const [categorias] = useState(() => obtenerCategorias());
  return <ListaCategorias categorias={contarPorCategoria(productos, categorias)} />;
}

export default CategoriasContainer;