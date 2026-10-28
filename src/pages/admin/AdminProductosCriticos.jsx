// Productos con stock crítico (solo Administrador).
import AdminProductosContainer from '@/containers/admin/AdminProductosContainer.jsx';

function AdminProductosCriticos() {
  return <AdminProductosContainer soloCriticos />;
}

export default AdminProductosCriticos;