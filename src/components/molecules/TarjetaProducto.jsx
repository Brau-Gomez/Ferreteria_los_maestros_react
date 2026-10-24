// Tarjeta de producto para la grilla del catálogo (antes .product-card).
// Componente de presentación (Single Responsibility): recibe el producto
// y el manejador de "Agregar" como props; la lógica del carrito vive en
// el CartContext y la coordinación en la página que la usa.
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ImagenProducto from '../atoms/ImagenProducto.jsx';
import PrecioProducto from '../atoms/PrecioProducto.jsx';
import { esOferta, porcentajeDescuento } from '../../utils/productos.js';

function TarjetaProducto({ producto, onAgregar, className = '' }) {
  const sinStock = producto.stock < 1;
  const enOferta = esOferta(producto);
  return (
    <Card className={`tarjeta-producto h-100 ${className}`.trim()}>
      <Card.Body className="d-flex flex-column">
        <ImagenProducto producto={producto} />
        <span className="chip-categoria d-inline-block mt-3 mb-1">
          {producto.categoria}
        </span>
        <h2 className="h5 mt-1 mb-1">{producto.nombre}</h2>
        <p className="text-body-secondary mb-2">
          {producto.marca || ''} · {producto.unidad || ''}
        </p>
        {/* margin-top:auto en .tarjeta-precio empuja precio, stock y
            botones al fondo de la tarjeta, como el original. */}
        <strong className="tarjeta-precio">
          <PrecioProducto
            precio={producto.precioVenta}
            precioAnterior={enOferta ? producto.precioAnterior : undefined}
            descuento={porcentajeDescuento(producto)}
          />
        </strong>
        <p className="tarjeta-stock small text-body-secondary mb-3">
          {sinStock
            ? 'Sin stock disponible'
            : `Stock disponible: ${producto.stock}`}
        </p>
        <div className="d-flex gap-2">
          <Button
            as={Link}
            to={`/productos/${encodeURIComponent(producto.codigo)}`}
            variant="primary"
            className="btn-chico flex-grow-1"
          >
            Ver detalle
          </Button>
          <Button
            variant="primary"
            className="btn-chico flex-grow-1"
            disabled={sinStock}
            onClick={() => onAgregar(producto.codigo)}
          >
            Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TarjetaProducto;