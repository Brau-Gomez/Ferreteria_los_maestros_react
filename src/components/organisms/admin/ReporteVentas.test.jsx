import { render, screen } from '@testing-library/react';
import ReporteVentas from '@/components/organisms/admin/ReporteVentas.jsx';

const resumen = {
  totalVentas: 29950, cantidadOrdenes: 2, ticketPromedio: 14975,
  porEntrega: [
    { entrega: 'Retiro en tienda', ordenes: 1, total: 11980 },
    { entrega: 'Despacho', ordenes: 1, total: 17970 },
  ],
};
const masVendidos = [{ codigo: 'A', nombre: 'Cemento', unidades: 4, total: 23960 }];
const porCategoria = [{ categoria: 'Herramientas', unidades: 4, total: 23960 }];

describe('ReporteVentas', () => {
  it('muestra las métricas, entregas, productos y categorías', () => {
    render(<ReporteVentas resumen={resumen} masVendidos={masVendidos} porCategoria={porCategoria} />);
    expect(screen.getByRole('heading', { name: 'Reportes' })).toBeInTheDocument();
    expect(screen.getByText('Cemento')).toBeInTheDocument();
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
    expect(screen.getByText('Retiro en tienda')).toBeInTheDocument();
    expect(screen.getByText('Despacho')).toBeInTheDocument();
  });

  it('avisa cuando no hay ventas', () => {
    render(<ReporteVentas resumen={{ ...resumen, totalVentas: 0, cantidadOrdenes: 0, ticketPromedio: 0 }} masVendidos={[]} porCategoria={[]} />);
    expect(screen.getAllByText('Todavía no hay ventas registradas.')).toHaveLength(2);
  });
});