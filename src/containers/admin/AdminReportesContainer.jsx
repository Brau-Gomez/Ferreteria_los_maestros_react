// Container de reportes: lee los pedidos via API y calcula el resumen,
// los productos más vendidos y las ventas por categoría.
// Las órdenes no guardan la categoría, así que se completa con el catálogo.
// Solo renderiza ReporteVentas.
import ReporteVentas from '@/components/organisms/admin/ReporteVentas.jsx';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { useProductos } from '@/hooks/useProductos.js';
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from '@/utils/reportes.js';

function AdminReportesContainer() {
  const { ordenes } = useOrdenes();
  const { productos } = useProductos();

  const categoriaPorCodigo = new Map(productos.map((producto) => [producto.codigo, producto.categoria]));
  const pedidos = ordenes.map((pedido) => ({
    ...pedido,
    productos: (pedido.productos || []).map((producto) => ({
      ...producto,
      categoria: producto.categoria || categoriaPorCodigo.get(producto.codigo),
    })),
  }));

  return (
    <ReporteVentas
      resumen={resumenVentas(pedidos)}
      masVendidos={productosMasVendidos(pedidos)}
      porCategoria={ventasPorCategoria(pedidos)}
    />
  );
}

export default AdminReportesContainer;