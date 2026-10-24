// Container del listado de productos del admin. Con soloCriticos muestra
// únicamente los productos con stock crítico. Solo renderiza el organismo.
import ListadoProductosAdmin from '../components/organisms/ListadoProductosAdmin.jsx';
import { useProductos } from '../hooks/useProductos.js';
import { useSesion } from '../hooks/useSesion.js';
import { productosCriticos } from '../utils/admin.js';

function AdminProductosContainer({ soloCriticos = false }) {
  const { productos } = useProductos();
  const { usuario } = useSesion();
  const esAdmin = usuario.tipoUsuario === 'Administrador';

  if (soloCriticos) {
    return (
      <ListadoProductosAdmin
        kicker="Inventario"
        titulo="Productos críticos"
        descripcion="Productos cuyo stock llegó al mínimo definido. Conviene reponerlos."
        tituloPanel="Stock crítico"
        productos={productosCriticos(productos)}
        esAdmin={esAdmin}
        mostrarNuevo={false}
        textoVacio="No hay productos con stock crítico."
      />
    );
  }

  return (
    <ListadoProductosAdmin
      kicker="Inventario"
      titulo="Productos"
      descripcion="Listado para consultar el catálogo y abrir el detalle de cada referencia."
      tituloPanel="Catálogo administrable"
      productos={productos}
      esAdmin={esAdmin}
      mostrarNuevo
      textoVacio="No hay productos en el catálogo."
    />
  );
}

export default AdminProductosContainer;