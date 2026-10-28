import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminUsuariosContainer from '@/containers/admin/AdminUsuariosContainer.jsx';

describe('AdminUsuariosContainer', () => {
  it('lista los usuarios guardados en el navegador', () => {
    localStorage.clear();
    localStorage.setItem('ep1-users', JSON.stringify([
      { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true },
    ]));
    render(
      <MemoryRouter>
        <AdminUsuariosContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('1 perfiles guardados en este navegador.')).toBeInTheDocument();
  });
});