import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResumenAdmin from './ResumenAdmin.jsx';

describe('ResumenAdmin', () => {
  it('muestra las tres métricas recibidas', () => {
    render(
      <MemoryRouter>
        <ResumenAdmin totalProductos={85} totalUsuarios={4} totalCriticos={7} />
      </MemoryRouter>,
    );
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('incluye el acceso rápido a productos críticos', () => {
    render(
      <MemoryRouter>
        <ResumenAdmin totalProductos={1} totalUsuarios={1} totalCriticos={0} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Productos críticos/ })).toHaveAttribute('href', '/admin/criticos');
  });
});