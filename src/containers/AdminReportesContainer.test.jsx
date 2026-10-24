import { render, screen } from '@testing-library/react';
import AdminReportesContainer from './AdminReportesContainer.jsx';

describe('AdminReportesContainer', () => {
  beforeEach(() => localStorage.clear());

  it('calcula el reporte con los pedidos guardados', () => {
    localStorage.setItem('ep1-orders', JSON.stringify([
      { id: 'PED-1', total: 11980, delivery: 'Despacho', productos: [
        { codigo: 'A', nombre: 'Cemento', categoria: 'Herramientas', precioVenta: 5990, cantidad: 2 },
      ] },
    ]));
    render(<AdminReportesContainer />);
    expect(screen.getByText('Cemento')).toBeInTheDocument();
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
  });

  it('sin pedidos muestra los avisos vacíos', () => {
    render(<AdminReportesContainer />);
    expect(screen.getAllByText('Todavía no hay ventas registradas.')).toHaveLength(2);
  });
});