// Ficha de un producto: imagen, datos, selector de cantidad y botón de agregar.
// Presentacional: recibe el producto ya resuelto y avisa las acciones.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ImagenProducto from '../atoms/ImagenProducto.jsx';
import SelectorCantidad from '../molecules/SelectorCantidad.jsx';
import { formatearDinero } from '../../utils/dinero.js';

function FichaProducto({
  producto,
  cantidad,
  tope,
  sinStock,
  aviso,
  onCambiarCantidad,
  onAgregar,
  onCerrarAviso,
}) {
  return (
    <Container className="pagina-angosta py-5">
      <Link to="/productos" className="d-inline-block fw-bold mb-4">
        ← Volver al catálogo
      </Link>

      {/* La grilla de la ficha la maneja .ficha-producto en theme.css. */}
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
            onCambiar={onCambiarCantidad}
            tope={tope}
            disabled={sinStock}
          />
          <Button
            variant="warning"
            size="lg"
            disabled={sinStock}
            onClick={onAgregar}
          >
            {sinStock ? 'Stock completo en el carrito' : 'Agregar al carrito'}
          </Button>
          {aviso && (
            <Alert
              variant={aviso.ok ? 'success' : 'danger'}
              dismissible
              className="mb-0"
              onClose={onCerrarAviso}
            >
              {aviso.mensaje}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FichaProducto;