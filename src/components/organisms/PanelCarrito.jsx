// Panel lateral global del carrito (Fase 5).
// Porta js/tienda/carrito-panel.js con Offcanvas de react-bootstrap:
// abrir al agregar, Escape/X/"Seguir comprando" para cerrar, controles
// de cantidad, eliminar, vaciar y enlace a la página del carrito.
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ImagenProducto from '../atoms/ImagenProducto.jsx';
import ControlCantidadCarrito from '../molecules/ControlCantidadCarrito.jsx';
import { useCarrito } from '../../hooks/useCarrito.js';
import { formatearDinero } from '../../utils/dinero.js';

function PanelCarrito() {
  const {
    items,
    total,
    panelAbierto,
    cerrarPanel,
    cambiarCantidad,
    quitar,
    vaciar,
  } = useCarrito();

  function ajustarCantidad(codigo, cantidad) {
    cambiarCantidad(codigo, cantidad);
  }

  function irAlCarrito() {
    // En el HTML la navegación recargaba y cerraba el panel. En la SPA
    // se debe cerrar explícitamente antes de cambiar de ruta.
    cerrarPanel();
  }

  return (
    <Offcanvas
      show={panelAbierto}
      onHide={cerrarPanel}
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
                    ajustarCantidad(producto.codigo, cantidad)
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
                onClick={() => quitar(producto.codigo)}
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
            <Button variant="outline-primary" className="w-100" onClick={vaciar}>
              Vaciar carrito
            </Button>
            <Button
              as={Link}
              to="/carrito"
              variant="warning"
              className="w-100 mt-2"
              onClick={irAlCarrito}
            >
              Ir al carrito
            </Button>
          </>
        )}
        <Button
          variant="outline-primary"
          className={`w-100${items.length > 0 ? ' mt-2' : ''}`}
          onClick={cerrarPanel}
        >
          Seguir comprando
        </Button>
      </div>
    </Offcanvas>
  );
}

export default PanelCarrito;
