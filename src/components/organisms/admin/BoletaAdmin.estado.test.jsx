import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoletaAdmin from '@/components/organisms/admin/BoletaAdmin.jsx';

const boleta = {
  pedido: { id: 'PED-1700000000000', delivery: 'Retiro en tienda', productos: [] },
  cliente: 'Ana Pérez',
  fecha: '14/11/2023',
  estado: 'Pagado',
  desglose: { neto: 0, iva: 0, total: 0 },
};

describe('BoletaAdmin: estado (RF-17)', () => {
  it('muestra el estado de la orden', () => {
    render(<MemoryRouter><BoletaAdmin boleta={boleta} onImprimir={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });
});