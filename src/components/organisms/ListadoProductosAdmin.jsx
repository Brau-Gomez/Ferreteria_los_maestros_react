// Listado de productos del panel admin (catálogo completo o stock crítico).
// Presentacional: recibe los textos, los productos y si el usuario es admin.
import { Link } from 'react-router-dom';
import InsigniaEstado from '../atoms/InsigniaEstado.jsx';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { estadoProducto } from '../../utils/productos.js';
import { esCritico } from '../../utils/admin.js';
import { formatearDinero } from '../../utils/dinero.js';

function ListadoProductosAdmin({
  kicker,
  titulo,
  descripcion,
  tituloPanel,
  productos,
  esAdmin,
  mostrarNuevo,
  textoVacio,
}) {
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">{kicker}</p>
          <h1>{titulo}</h1>
          <p>{descripcion}</p>
        </div>
        {esAdmin && mostrarNuevo && (
          <Button as={Link} to="/admin/productos/nuevo" variant="warning">Nuevo producto</Button>
        )}
      </header>
      <section className="admin-panel" aria-labelledby="titulo-tabla-productos">
        <div className="admin-panel-header">
          <div>
            <h2 id="titulo-tabla-productos">{tituloPanel}</h2>
            <p>{productos.length} productos en esta lista.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{formatearDinero(producto.precioVenta)}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <InsigniaEstado variante={esCritico(producto) ? 'danger' : 'success'}>
                      {estadoProducto(producto)}
                    </InsigniaEstado>
                  </td>
                  <td className="admin-table-actions">
                    <Link to={`/admin/productos/${encodeURIComponent(producto.codigo)}`}>Ver</Link>
                    {esAdmin && (
                      <>
                        {' · '}
                        <Link to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>Editar</Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr><td colSpan="7">{textoVacio}</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default ListadoProductosAdmin;