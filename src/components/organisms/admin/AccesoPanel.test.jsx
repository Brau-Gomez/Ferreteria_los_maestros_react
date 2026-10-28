import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccesoPanel from '@/components/organisms/admin/AccesoPanel.jsx';

function mostrar(tipoUsuario) {
  return render(
    <MemoryRouter>
      <AccesoPanel tipoUsuario={tipoUsuario} />
    </MemoryRouter>,
  );
}

describe('AccesoPanel', () => {
  it('describe el acceso completo del administrador', () => {
    mostrar('Administrador');
    expect(screen.getByText('Acceso de administrador')).toBeInTheDocument();
    expect(screen.getByText(/acceso completo a la administración/)).toBeInTheDocument();
  });

  it('describe el acceso del vendedor y enlaza al panel', () => {
    mostrar('Vendedor');
    expect(screen.getByText('Acceso de vendedor')).toBeInTheDocument();
    expect(screen.getByText(/gestionar el catálogo/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir al panel de administración' })).toHaveAttribute('href', '/admin');
  });
});