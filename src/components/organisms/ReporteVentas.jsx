// Reporte de ventas del panel admin. Presentacional: recibe el resumen y
// las listas ya calculadas por el container.
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { formatearDinero } from '../../utils/dinero.js';

function ReporteVentas({ resumen, masVendidos, porCategoria }) {
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Ventas</p>
          <h1>Reportes</h1>
          <p>Resumen de las compras registradas en la tienda.</p>
        </div>
      </header>
      <Row className="g-3 admin-metrics" aria-label="Resumen de ventas">
        <Col sm={6} xl={4}>
          <Card className="admin-metric"><Card.Body>
            <span>Ventas totales</span><strong>{formatearDinero(resumen.totalVentas)}</strong><small>IVA incluido</small>
          </Card.Body></Card>
        </Col>
        <Col sm={6} xl={4}>
          <Card className="admin-metric"><Card.Body>
            <span>Órdenes</span><strong>{resumen.cantidadOrdenes}</strong><small>compras registradas</small>
          </Card.Body></Card>
        </Col>
        <Col sm={6} xl={4}>
          <Card className="admin-metric"><Card.Body>
            <span>Ticket promedio</span><strong>{formatearDinero(resumen.ticketPromedio)}</strong><small>por orden</small>
          </Card.Body></Card>
        </Col>
      </Row>

      <section className="admin-panel mt-4" aria-labelledby="titulo-por-entrega">
        <div className="admin-panel-header"><div><h2 id="titulo-por-entrega">Ventas por tipo de entrega</h2></div></div>
        <div className="admin-table-wrap">
          <Table responsive className="admin-table mb-0">
            <thead>
              <tr><th scope="col">Entrega</th><th scope="col">Órdenes</th><th scope="col">Total</th></tr>
            </thead>
            <tbody>
              {resumen.porEntrega.map((fila) => (
                <tr key={fila.entrega}>
                  <td>{fila.entrega}</td><td>{fila.ordenes}</td><td>{formatearDinero(fila.total)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>

      <section className="admin-panel mt-4" aria-labelledby="titulo-mas-vendidos">
        <div className="admin-panel-header"><div><h2 id="titulo-mas-vendidos">Productos más vendidos</h2></div></div>
        <div className="admin-table-wrap">
          <Table responsive className="admin-table mb-0">
            <thead>
              <tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Unidades</th><th scope="col">Total</th></tr>
            </thead>
            <tbody>
              {masVendidos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td><td>{producto.nombre}</td>
                  <td>{producto.unidades}</td><td>{formatearDinero(producto.total)}</td>
                </tr>
              ))}
              {masVendidos.length === 0 && <tr><td colSpan="4">Todavía no hay ventas registradas.</td></tr>}
            </tbody>
          </Table>
        </div>
      </section>

      <section className="admin-panel mt-4" aria-labelledby="titulo-por-categoria">
        <div className="admin-panel-header"><div><h2 id="titulo-por-categoria">Ventas por categoría</h2></div></div>
        <div className="admin-table-wrap">
          <Table responsive className="admin-table mb-0">
            <thead>
              <tr><th scope="col">Categoría</th><th scope="col">Unidades</th><th scope="col">Total</th></tr>
            </thead>
            <tbody>
              {porCategoria.map((fila) => (
                <tr key={fila.categoria}>
                  <td>{fila.categoria}</td><td>{fila.unidades}</td><td>{formatearDinero(fila.total)}</td>
                </tr>
              ))}
              {porCategoria.length === 0 && <tr><td colSpan="3">Todavía no hay ventas registradas.</td></tr>}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default ReporteVentas;