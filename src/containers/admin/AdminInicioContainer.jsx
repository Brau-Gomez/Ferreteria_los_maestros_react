// Container del resumen admin: calcula las métricas del catálogo y los
// usuarios via API. Solo renderiza ResumenAdmin.
import ResumenAdmin from '@/components/organisms/admin/ResumenAdmin.jsx';
import { useProductos } from '@/hooks/useProductos.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import { productosCriticos } from '@/utils/admin.js';

function AdminInicioContainer() {
  const { productos } = useProductos();
  const { usuarios } = useUsuarios();
  return (
    <ResumenAdmin
      totalProductos={productos.length}
      totalUsuarios={usuarios.length}
      totalCriticos={productosCriticos(productos).length}
    />
  );
}

export default AdminInicioContainer;