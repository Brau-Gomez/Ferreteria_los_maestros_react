// Detalle de un producto en el panel admin. Presentacional: el container
// decide qué acciones existen según el perfil y ejecuta la eliminación.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ImagenProducto from '../atoms/ImagenProducto.jsx';
import { formatearDinero } from '../../utils/dinero.js';
import { estadoProducto } from '../../utils/productos.js';

function DetalleProductoAdmin({ producto, esAdmin, error, onEliminar }) {
  const campos = [
    ['Código', producto.codigo],
    ['Categoría', producto.categoria],
    ['Subcategoría', producto.subcategoria],
    ['Marca', producto.marca],
    ['Unidad', producto.unidad],
    ['Descripción', producto.descripcion],
    ['Precio de venta', formatearDinero(producto.precioVenta)],
    ['Stock disponible', `${producto.stock} unidades`],
    ['Stock crítico', `${producto.stockMinimo} unidades`],
    ['Estado', estadoProducto(producto)],
  ];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker"><Link to="/admin/productos">Productos</Link> / {producto.codigo}</p>
          <h1>{producto.nombre}</h1>
          <p>Información del catálogo persistente mediante su código.</p>
        </div>
        <div className="admin-actions">
          <Button as={Link} to="/admin/productos" variant="outline-primary">Volver</Button>
          {esAdmin && <Button as={Link} to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>Editar producto</Button>}
          {esAdmin && <Button variant="outline-danger" onClick={onEliminar}>Eliminar</Button>}
        </div>
      </header>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <section className="admin-panel admin-detail-grid">
        <div className="admin-product-visual"><ImagenProducto producto={producto} className="admin-product-image" /></div>
        <dl className="admin-details mb-0">
          {campos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor || 'No informado'}</dd></div>)}
        </dl>
      </section>
    </>
  );
}

export default DetalleProductoAdmin;