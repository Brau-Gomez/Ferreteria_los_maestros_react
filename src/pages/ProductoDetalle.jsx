// Detalle de producto (Fase 4 del plan de migración).
// Porta tienda/producto-detalle.html + js/tienda/producto-detalle.js:
// ficha con imagen, datos, selector de cantidad y "Agregar al carrito".
// El código llega por la URL (/productos/:codigo), como el ?codigo= original,
// así el detalle se puede recargar y compartir.
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useProductos } from '../hooks/useProductos.js';
import { useCarrito } from '../hooks/useCarrito.js';
import { formatearDinero } from '../utils/dinero.js';
import ImagenProducto from '../components/ImagenProducto.jsx';
import SelectorCantidad from '../components/SelectorCantidad.jsx';

function DetalleProductoConCodigo({ codigo }) {
  const { pathname } = useLocation();
  const { productos } = useProductos();
  const { agregar, items } = useCarrito();
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
  const [seleccionCantidad, setSeleccionCantidad] = useState({
    codigo: codigoBuscado,
    cantidad: 1,
  });
  const cantidadSeleccionada =
    seleccionCantidad.codigo === codigoBuscado
      ? seleccionCantidad.cantidad
      : 1;
  const producto = productos.find((p) => p.codigo === codigoBuscado);
  const cantidadEnCarrito = producto
    ? items.find((item) => item.codigo === producto.codigo)?.cantidad || 0
    : 0;
  const stockRestante = producto
    ? Math.max(0, Math.floor(producto.stock) - cantidadEnCarrito)
    : 0;
  const cantidad = Math.min(
    cantidadSeleccionada,
    Math.max(1, stockRestante),
  );

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

  // Renderizado condicional: producto inexistente (antes el innerHTML
  // "Producto no encontrado" del original).
  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h1 className="mb-3">Producto no encontrado</h1>
        <p className="text-body-secondary mb-0">
          Vuelve al catálogo para seleccionar uno.
        </p>
      </Container>
    );
  }

  const sinStock = stockRestante < 1;

  function agregarAlCarrito() {
    setAviso(agregar(producto.codigo, cantidad));
  }

  return (
    <Container className="pagina-angosta py-5">
      <Link to="/productos" className="d-inline-block fw-bold mb-4">
        ← Volver al catálogo
      </Link>

      {/* Ficha del producto (antes .detail-card): grilla con la misma
          separación del original (la maneja .ficha-producto en theme.css). */}
      <Card className="ficha-producto">
        <Card.Body>
          <ImagenProducto producto={producto} />
          <span className="chip-categoria d-inline-block">
            {producto.categoria}
          </span>
          <h1 className="ficha-titulo">{producto.nombre}</h1>
          <p className="text-body-secondary mb-0">
            {producto.descripcion || 'Sin descripción adicional.'}
          </p>
          <p className="text-body-secondary mb-0">
            {producto.marca || ''} · {producto.unidad || ''}
          </p>
          <strong className="ficha-precio">
            {formatearDinero(producto.precioVenta)}
          </strong>
          <p className="text-body-secondary mb-0">
            Stock disponible: {producto.stock}
          </p>
          <SelectorCantidad
            cantidad={cantidad}
            onCambiar={(nuevaCantidad) =>
              setSeleccionCantidad({
                codigo: codigoBuscado,
                cantidad: nuevaCantidad,
              })
            }
            tope={Math.max(1, stockRestante)}
            disabled={sinStock}
          />
          <Button
            variant="warning"
            size="lg"
            disabled={sinStock}
            onClick={agregarAlCarrito}
          >
            {sinStock ? 'Stock completo en el carrito' : 'Agregar al carrito'}
          </Button>
          {aviso && (
            <Alert
              variant={aviso.ok ? 'success' : 'danger'}
              dismissible
              className="mb-0"
              onClose={() => setAviso(null)}
            >
              {aviso.mensaje}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

function ProductoDetalle() {
  const { codigo } = useParams();
  return <DetalleProductoConCodigo key={codigo} codigo={codigo} />;
}

export default ProductoDetalle;
