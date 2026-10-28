// Container de Ofertas: obtiene los productos en oferta y maneja el carrito.
// Solo renderiza VistaOfertas.
import { useState } from 'react';
import VistaOfertas from '@/components/organisms/catalogo/VistaOfertas.jsx';
import { useCarrito } from '@/hooks/useCarrito.js';
import { useProductos } from '@/hooks/useProductos.js';
import { productosEnOferta } from '@/utils/productos.js';

function OfertasContainer() {
  const { productos } = useProductos();
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState(null);

  return (
    <VistaOfertas
      productos={productosEnOferta(productos)}
      aviso={aviso}
      onAgregar={(codigo) => setAviso(agregar(codigo))}
      onCerrarAviso={() => setAviso(null)}
    />
  );
}

export default OfertasContainer;