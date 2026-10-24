// Boleta de una orden (vista admin). Presentacional: recibe la boleta ya
// armada por el container o null si la orden no existe.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { formatearDinero } from '../../utils/dinero.js';

function BoletaAdmin({ boleta, onImprimir }) {
  if (!boleta) {
    return (
      <Alert variant="warning">
        <h1>Orden no encontrada</h1>
        <p>Vuelve al listado para seleccionar una orden existente.</p>
        <Link to="/admin/ordenes">Volver a órdenes</Link>
      </Alert>
    );
  }

  const { pedido, cliente, fecha, desglose } = boleta;
  const productos = Array.isArray(pedido.productos) ? pedido.productos : [];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker"><Link to="/admin/ordenes">Órdenes</Link> / {pedido.id}</p>
          <h1>Boleta {pedido.id}</h1>
          <p>Ferretería Los Maestros · {fecha}</p>
        </div>
        <div className="admin-actions">
          <Button as={Link} to="/admin/ordenes" variant="outline-primary">Volver</Button>
          <Button onClick={onImprimir}>Imprimir boleta</Button>
        </div>
      </header>
      <section className="admin-panel">
        <dl className="admin-details">
          <div><dt>Cliente</dt><dd>{cliente}</dd></div>
          <div><dt>Entrega</dt><dd>{pedido.delivery}</dd></div>
          {pedido.despacho && (
            <div>
              <dt>Dirección de despacho</dt>
              <dd>{pedido.despacho.direccion}, {pedido.despacho.comuna}, {pedido.despacho.region}</dd>
            </div>
          )}
        </dl>
        <Table responsive className="admin-table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, indice) => (
              <tr key={`${producto.codigo}-${indice}`}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{formatearDinero(producto.precioVenta)}</td>
                <td>{formatearDinero(producto.precioVenta * producto.cantidad)}</td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan="4">Sin detalle de productos.</td></tr>
            )}
          </tbody>
        </Table>
        <dl className="admin-details mb-0">
          <div><dt>Neto</dt><dd>{formatearDinero(desglose.neto)}</dd></div>
          <div><dt>IVA (19%)</dt><dd>{formatearDinero(desglose.iva)}</dd></div>
          <div><dt>Total</dt><dd><strong>{formatearDinero(desglose.total)}</strong></dd></div>
        </dl>
      </section>
    </>
  );
}

export default BoletaAdmin;