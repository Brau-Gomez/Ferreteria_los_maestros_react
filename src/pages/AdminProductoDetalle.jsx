// Detalle de producto visible para Administrador y Vendedor.
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useProductos } from '../hooks/useProductos.js';
import { useSesion } from '../hooks/useSesion.js';
import ImagenProducto from '../components/atoms/ImagenProducto.jsx';
import { eliminarRegistro, clavesDatos, leerListaGuardada, obtenerProductos } from '../services/almacenamiento.js';
import { estadoProducto } from '../utils/productos.js';
import { formatearDinero } from '../utils/dinero.js';

function AdminProductoDetalle() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { productos } = useProductos();
  const { usuario } = useSesion();
  const [error, setError] = useState('');
  const producto = productos.find((item) => item.codigo === codigo.toUpperCase());
  const esAdmin = usuario.tipoUsuario === 'Administrador';

  function eliminar() {
    if (!window.confirm(`¿Eliminar el producto ${producto.codigo}?`)) return;
    const lista = leerListaGuardada(clavesDatos.productos) || obtenerProductos();
    if (!eliminarRegistro(clavesDatos.productos, lista, 'codigo', producto.codigo)) {
      setError('No fue posible eliminar el producto. Puedes reintentarlo.');
      return;
    }
    navigate('/admin/productos');
  }

  if (!producto) {
    return <Alert variant="warning"><h1>Producto no encontrado</h1><p>Vuelve al listado para seleccionar una referencia existente.</p><Link to="/admin/productos">Volver a productos</Link></Alert>;
  }

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
        <div><p className="admin-kicker"><Link to="/admin/productos">Productos</Link> / {producto.codigo}</p><h1>{producto.nombre}</h1><p>Información del catálogo persistente mediante su código.</p></div>
        <div className="admin-actions">
          <Button as={Link} to="/admin/productos" variant="outline-primary">Volver</Button>
          {esAdmin && <Button as={Link} to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>Editar producto</Button>}
          {esAdmin && <Button variant="outline-danger" onClick={eliminar}>Eliminar</Button>}
        </div>
      </header>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <section className="admin-panel admin-detail-grid">
        <div className="admin-product-visual"><ImagenProducto producto={producto} className="admin-product-image" /></div>
        <dl className="admin-details mb-0">{campos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor || 'No informado'}</dd></div>)}</dl>
      </section>
    </>
  );
}

export default AdminProductoDetalle;
