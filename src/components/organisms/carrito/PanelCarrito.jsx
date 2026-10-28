// Panel lateral global del carrito (presentacional): recibe todo por props.
// El estado vive en containers/PanelCarritoContainer.jsx.
// Porta js/tienda/carrito-panel.js con Offcanvas de react-bootstrap:
// abrir al agregar, Escape/X/"Seguir comprando" para cerrar, controles
// de cantidad, eliminar, vaciar y enlace a la página del carrito.
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ImagenProducto from '@/components/atoms/ImagenProducto.jsx';
import ControlCantidadCarrito from '@/components/molecules/ControlCantidadCarrito.jsx';
import { formatearDinero } from '@/utils/dinero.js';

function PanelCarrito({
  items = [],
  total = 0,
  abierto = false,
  onCerrar,
  onCambiarCantidad,
  onQuitar,
  onVaciar,
}) {
  return (
    <Offcanvas
      show={abierto}
      onHide={onCerrar}
      placement="end"
      backdrop={false}
      scroll
      aria-label="Carrito de compras"
      className="panel-carrito"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Mi carrito</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {items.length === 0 ? (
          <p className="panel-carrito-vacio">
            Todavía no agregas productos.
          </p>
        ) : (
          items.map((producto) => (
            <article key={producto.codigo} className="item-panel-carrito">
              <ImagenProducto producto={producto} className="miniatura-panel" />
              <div className="info-panel-carrito">
                <h3>{producto.nombre}</h3>
                <ControlCantidadCarrito
                  cantidad={producto.cantidad}
                  tope={producto.stock}
                  onCambiar={(cantidad) =>
                    onCambiarCantidad(producto.codigo, cantidad)
                  }
                />
                <p>
                  Subtotal:{' '}
                  {formatearDinero(producto.precioVenta * producto.cantidad)}
                </p>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onQuitar(producto.codigo)}
              >
                Eliminar
              </Button>
            </article>
          ))
        )}
      </Offcanvas.Body>
      <div className="pie-panel-carrito">
        {items.length > 0 && (
          <>
            <p className="total-panel-carrito">
              Total <strong>{formatearDinero(total)}</strong>
            </p>
            <Button variant="outline-primary" className="w-100" onClick={onVaciar}>
              Vaciar carrito
            </Button>
            {/* En la SPA el panel se cierra explícitamente antes de cambiar de ruta. */}
            <Button
              as={Link}
              to="/carrito"
              variant="warning"
              className="w-100 mt-2"
              onClick={onCerrar}
            >
              Ir al carrito
            </Button>
          </>
        )}
        <Button
          variant="outline-primary"
          className={`w-100${items.length > 0 ? ' mt-2' : ''}`}
          onClick={onCerrar}
        >
          Seguir comprando
        </Button>
      </div>
    </Offcanvas>
  );
}

export default PanelCarrito;