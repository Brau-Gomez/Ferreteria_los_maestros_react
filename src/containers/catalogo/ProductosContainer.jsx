// Container del catálogo: concentra datos, estado de filtros y carrito.
// No tiene markup propio: solo renderiza el organismo presentacional.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogoProductos from '@/components/organisms/catalogo/CatalogoProductos.jsx';
import { useCarrito } from '@/hooks/useCarrito.js';
import { useProductos } from '@/hooks/useProductos.js';
import { categoriasPresentes, filtrarProductos } from '@/utils/productos.js';

// categoriaInicial: opcional, la usa la página de una categoría.
function ProductosContainer({ categoriaInicial = 'Todas' }) {
  const { productos } = useProductos();
  const { agregar } = useCarrito();
  // El buscador del encabezado envía el texto como ?q=...
  const [parametros] = useSearchParams();
  const textoUrl = parametros.get('q') || '';
  const [filtros, setFiltros] = useState({
    texto: textoUrl,
    categoria: categoriaInicial,
    soloStock: false,
  });
  // Aviso del último "Agregar": { ok, mensaje } o null.
  const [aviso, setAviso] = useState(null);

  // Si el texto de la URL cambia (nueva búsqueda desde el encabezado), se aplica.
  useEffect(() => {
    setFiltros((previos) => ({ ...previos, texto: textoUrl }));
  }, [textoUrl]);

  // Derivados: se recalculan en cada render, sin estado duplicado.
  const categorias = categoriasPresentes(productos);
  const visibles = filtrarProductos(productos, filtros);

  function cambiarFiltro(campo, valor) {
    setFiltros((previos) => ({ ...previos, [campo]: valor }));
  }

  // El CartContext valida el stock y devuelve { ok, mensaje }.
  function agregarDesdeCatalogo(codigo) {
    setAviso(agregar(codigo));
  }

  return (
    <CatalogoProductos
      productos={visibles}
      filtros={filtros}
      categorias={categorias}
      aviso={aviso}
      onCambioFiltro={cambiarFiltro}
      onAgregar={agregarDesdeCatalogo}
      onCerrarAviso={() => setAviso(null)}
    />
  );
}

export default ProductosContainer;