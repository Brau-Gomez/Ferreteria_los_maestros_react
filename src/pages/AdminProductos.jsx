// Listado del catálogo para Administrador y Vendedor.
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useProductos } from '../hooks/useProductos.js';
import { useSesion } from '../hooks/useSesion.js';
import { estadoProducto } from '../utils/productos.js';
import { formatearDinero } from '../utils/dinero.js';

function AdminProductos() {
  const { productos } = useProductos();
  const { usuario } = useSesion();
  const esAdmin = usuario.tipoUsuario === 'Administrador';

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Inventario</p>
          <h1>Productos</h1>
          <p>Listado para consultar el catálogo y abrir el detalle de cada referencia.</p>
        </div>
        {esAdmin && <Button as={Link} to="/admin/productos/nuevo" variant="warning">Nuevo producto</Button>}
      </header>
      <section className="admin-panel" aria-labelledby="titulo-tabla-productos">
        <div className="admin-panel-header">
          <div><h2 id="titulo-tabla-productos">Catálogo administrable</h2><p>{productos.length} productos disponibles en la fuente local.</p></div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col">Precio</th><th scope="col">Stock</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
            <tbody>
              {productos.map((producto) => {
                const critico = producto.stock <= producto.stockMinimo;
                return (
                  <tr key={producto.codigo}>
                    <td>{producto.codigo}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>{formatearDinero(producto.precioVenta)}</td>
                    <td>{producto.stock}</td>
                    <td><Badge bg={critico ? 'danger' : 'success'}>{estadoProducto(producto)}</Badge></td>
                    <td className="admin-table-actions">
                      <Link to={`/admin/productos/${encodeURIComponent(producto.codigo)}`}>Ver</Link>
                      {esAdmin && <> · <Link to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>Editar</Link></>}
                    </td>
                  </tr>
                );
              })}
              {productos.length === 0 && <tr><td colSpan="7">No hay productos en el catálogo.</td></tr>}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default AdminProductos;
