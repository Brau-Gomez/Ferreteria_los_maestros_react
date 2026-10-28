import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminPerfilContainer from '@/containers/admin/AdminPerfilContainer.jsx';

describe('AdminPerfilContainer', () => {
  it('muestra el perfil de la sesión activa', () => {
    localStorage.clear();
    localStorage.setItem('ep1-users', JSON.stringify([
      { run: '222222222', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true },
    ]));
    localStorage.setItem('ep1-user', JSON.stringify({ run: '222222222' }));
    render(<MemoryRouter><AuthProvider><AdminPerfilContainer /></AuthProvider></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Vera Vende' })).toBeInTheDocument();
    expect(screen.getByText('vera@duoc.cl')).toBeInTheDocument();
  });
});