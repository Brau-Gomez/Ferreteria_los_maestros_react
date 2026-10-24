// Container de reportes: lee los pedidos guardados y calcula el resumen,
// los productos más vendidos y las ventas por categoría.
// Solo renderiza ReporteVentas.
import { useState } from 'react';
import ReporteVentas from '../components/organisms/ReporteVentas.jsx';
import { clavesDatos, leerListaGuardada } from '../services/almacenamiento.js';
import { productosMasVendidos, resumenVentas, ventasPorCategoria } from '../utils/reportes.js';

function AdminReportesContainer() {
  const [pedidos] = useState(() => leerListaGuardada(clavesDatos.pedidos) || []);
  return (
    <ReporteVentas
      resumen={resumenVentas(pedidos)}
      masVendidos={productosMasVendidos(pedidos)}
      porCategoria={ventasPorCategoria(pedidos)}
    />
  );
}

export default AdminReportesContainer;