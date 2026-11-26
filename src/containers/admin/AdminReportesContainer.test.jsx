import { render, screen } from '@testing-library/react';
import AdminReportesContainer from '@/containers/admin/AdminReportesContainer.jsx';

describe('AdminReportesContainer', () => {
  it('calcula el reporte con las órdenes y completa la categoría desde el catálogo', async () => {
    localStorage.setItem('ep1-products', JSON.stringify([
      { codigo: 'A', nombre: 'Cemento', categoria: 'Herramientas', precioVenta: 5990, stock: 9, stockMinimo: 1 },
    ]));
    localStorage.setItem('ep1-orders', JSON.stringify([
      { id: 'PED-1', total: 11980, notes: 'Despacho', createdAt: '2026-11-01T12:00:00Z', items: [
        { productCode: 'A', productName: 'Cemento', unitPrice: 5990, quantity: 2 },
      ] },
    ]));
    render(<AdminReportesContainer />);
    expect(await screen.findByText('Cemento')).toBeInTheDocument();
    expect(await screen.findByText('Herramientas')).toBeInTheDocument();
  });

  it('sin órdenes muestra los avisos vacíos', async () => {
    render(<AdminReportesContainer />);
    expect(await screen.findAllByText('Todavía no hay ventas registradas.')).toHaveLength(2);
  });
});
