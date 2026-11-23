// Container de reportes: lee los pedidos via API y calcula el resumen,
// los productos más vendidos y las ventas por categoría.
// Solo renderiza ReporteVentas.
import ReporteVentas from '@/components/organisms/admin/ReporteVentas.jsx';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from '@/utils/reportes.js';

function AdminReportesContainer() {
  const { ordenes: pedidos } = useOrdenes();
  return (
    <ReporteVentas
      resumen={resumenVentas(pedidos)}
      masVendidos={productosMasVendidos(pedidos)}
      porCategoria={ventasPorCategoria(pedidos)}
    />
  );
}

export default AdminReportesContainer;