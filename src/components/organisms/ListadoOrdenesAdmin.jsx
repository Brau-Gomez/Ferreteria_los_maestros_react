// Listado de órdenes de compra del panel admin. Presentacional: recibe las
// filas ya preparadas por el container ({ id, fecha, cliente, entrega, estado, total }).
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { formatearDinero } from '../../utils/dinero.js';

function ListadoOrdenesAdmin({ ordenes }) {
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Ventas</p>
          <h1>Órdenes</h1>
          <p>Compras realizadas en la tienda, de la más reciente a la más antigua.</p>
        </div>
      </header>
      <section className="admin-panel" aria-labelledby="titulo-tabla-ordenes">
        <div className="admin-panel-header">
          <div>
            <h2 id="titulo-tabla-ordenes">Órdenes registradas</h2>
            <p>{ordenes.length} órdenes guardadas en este navegador.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Entrega</th>
                <th scope="col">Estado</th>
                <th scope="col">Total</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{orden.fecha}</td>
                  <td>{orden.cliente}</td>
                  <td>{orden.entrega}</td>
                  <td>{orden.estado}</td>
                  <td>{formatearDinero(orden.total)}</td>
                  <td>
                    <Link to={`/admin/ordenes/${encodeURIComponent(orden.id)}`}>Ver boleta</Link>
                  </td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr><td colSpan="7">Todavía no hay órdenes registradas.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default ListadoOrdenesAdmin;