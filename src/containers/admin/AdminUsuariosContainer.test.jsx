import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminUsuariosContainer from '@/containers/admin/AdminUsuariosContainer.jsx';

describe('AdminUsuariosContainer', () => {
  it('lista los usuarios que entrega la API con su perfil', async () => {
    localStorage.setItem('ep1-users', JSON.stringify([
      { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true },
      { run: '333333333', nombre: 'Carlos', apellidos: 'Contratista', correo: 'contratista@gmail.com', tipoUsuario: 'Cliente', esContratista: true, activo: true },
    ]));
    render(
      <MemoryRouter>
        <AdminUsuariosContainer />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('2 perfiles registrados.')).toBeInTheDocument();
    expect(screen.getByText('Contratista')).toBeInTheDocument();
  });
});
