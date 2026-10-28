// Container del detalle de producto: resuelve el producto desde la URL,
// calcula el stock restante según el carrito y maneja la cantidad elegida.
// El código llega por la ruta (/productos/:codigo), así el detalle se puede
// recargar y compartir.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FichaProducto from '@/components/organisms/catalogo/FichaProducto.jsx';
import ProductoNoEncontrado from '@/components/organisms/catalogo/ProductoNoEncontrado.jsx';
import { useCarrito } from '@/hooks/useCarrito.js';
import { useProductos } from '@/hooks/useProductos.js';

function ProductoDetalleContainer({ codigo }) {
  const { pathname } = useLocation();
  const { productos } = useProductos();
  const { agregar, items } = useCarrito();
  // Aviso del último "Agregar": { ok, mensaje } o null.
  const [aviso, setAviso] = useState(null);

  // Normaliza como parametroPagina().trim().toUpperCase() del original.
  const codigoCodificado = pathname.slice('/productos/'.length).replace(/\/$/, '');
  let codigoDecodificado = '';
  try {
    codigoDecodificado = decodeURIComponent(codigoCodificado || codigo || '');
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    console.warn('El código del producto en la URL tiene una codificación inválida.', error);
  }
  const codigoBuscado = codigoDecodificado.trim().toUpperCase();

  // La cantidad elegida se asocia al código para reiniciarse si cambia.
  const [seleccionCantidad, setSeleccionCantidad] = useState({
    codigo: codigoBuscado,
    cantidad: 1,
  });
  const cantidadSeleccionada =
    seleccionCantidad.codigo === codigoBuscado
      ? seleccionCantidad.cantidad
      : 1;

  // Derivados: se recalculan en cada render, sin estado duplicado.
  const producto = productos.find((p) => p.codigo === codigoBuscado);
  const cantidadEnCarrito = producto
    ? items.find((item) => item.codigo === producto.codigo)?.cantidad || 0
    : 0;
  const stockRestante = producto
    ? Math.max(0, Math.floor(producto.stock) - cantidadEnCarrito)
    : 0;
  const tope = Math.max(1, stockRestante);
  const cantidad = Math.min(cantidadSeleccionada, tope);

  // El original ajustaba document.title al nombre del producto; al
  // desmontar la vista se restaura el título general del sitio.
  useEffect(() => {
    if (!producto) return undefined;
    const tituloAnterior = document.title;
    document.title = `${producto.nombre} | Ferretería Los Maestros`;
    return () => {
      document.title = tituloAnterior;
    };
  }, [producto]);

  if (!producto) return <ProductoNoEncontrado />;

  return (
    <FichaProducto
      producto={producto}
      cantidad={cantidad}
      tope={tope}
      sinStock={stockRestante < 1}
      aviso={aviso}
      onCambiarCantidad={(nuevaCantidad) =>
        setSeleccionCantidad({ codigo: codigoBuscado, cantidad: nuevaCantidad })
      }
      onAgregar={() => setAviso(agregar(producto.codigo, cantidad))}
      onCerrarAviso={() => setAviso(null)}
    />
  );
}

export default ProductoDetalleContainer;