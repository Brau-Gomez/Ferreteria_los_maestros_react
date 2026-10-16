// Detalle de producto (Fase 4 del plan de migración).
// Porta tienda/producto-detalle.html + js/tienda/producto-detalle.js:
// ficha con imagen, datos, selector de cantidad y "Agregar al carrito".
// El código llega por la URL (/productos/:codigo), como el ?codigo= original,
// así el detalle se puede recargar y compartir.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useProductos } from '../hooks/useProductos.js';
import { useCarrito } from '../hooks/useCarrito.js';
import { formatearDinero } from '../utils/dinero.js';
import ImagenProducto from '../components/ImagenProducto.jsx';
import SelectorCantidad from '../components/SelectorCantidad.jsx';

function ProductoDetalle() {
  const { codigo } = useParams();
  const { productos } = useProductos();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState(null);

  // Normaliza como parametroPagina().trim().toUpperCase() del original.
  const codigoBuscado = String(codigo || '').trim().toUpperCase();
  const producto = productos.find((p) => p.codigo === codigoBuscado);

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

  const sinStock = producto.stock < 1;

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
            onCambiar={setCantidad}
            tope={Math.max(1, producto.stock)}
            disabled={sinStock}
          />
          <Button
            variant="warning"
            size="lg"
            disabled={sinStock}
            onClick={agregarAlCarrito}
          >
            Agregar al carrito
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

export default ProductoDetalle;
