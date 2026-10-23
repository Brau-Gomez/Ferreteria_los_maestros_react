// Container del catálogo: concentra datos, estado de filtros y carrito.
// No tiene markup propio: solo renderiza el organismo presentacional.
import { useState } from 'react';
import CatalogoProductos from '../components/organisms/CatalogoProductos.jsx';
import { useCarrito } from '../hooks/useCarrito.js';
import { useProductos } from '../hooks/useProductos.js';
import { categoriasPresentes, filtrarProductos } from '../utils/productos.js';

const filtrosIniciales = { texto: '', categoria: 'Todas', soloStock: false };

function ProductosContainer() {
  const { productos } = useProductos();
  const { agregar } = useCarrito();
  const [filtros, setFiltros] = useState(filtrosIniciales);
  // Aviso del último "Agregar": { ok, mensaje } o null.
  const [aviso, setAviso] = useState(null);

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