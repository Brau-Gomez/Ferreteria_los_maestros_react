import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListadoUsuariosAdmin from '@/components/organisms/admin/ListadoUsuariosAdmin.jsx';

const usuarios = [
  { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true },
  { run: '222222222', nombre: 'Luis', apellidos: 'Soto', correo: 'luis@duoc.cl', tipoUsuario: 'Vendedor', activo: false },
];

function mostrar(lista) {
  return render(
    <MemoryRouter>
      <ListadoUsuariosAdmin usuarios={lista} />
    </MemoryRouter>,
  );
}

describe('ListadoUsuariosAdmin', () => {
  it('muestra nombre completo, perfil y estado de cada usuario', () => {
    mostrar(usuarios);
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Vendedor')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('enlaza a ver y editar cada usuario y a crear uno nuevo', () => {
    mostrar(usuarios);
    expect(screen.getAllByRole('link', { name: 'Ver' })[0]).toHaveAttribute('href', '/admin/usuarios/123456785');
    expect(screen.getAllByRole('link', { name: 'Editar' })[1]).toHaveAttribute('href', '/admin/usuarios/222222222/editar');
    expect(screen.getByRole('button', { name: 'Nuevo usuario' })).toHaveAttribute('href', '/admin/usuarios/nuevo');
  });

  it('muestra un mensaje si no hay usuarios', () => {
    mostrar([]);
    expect(screen.getByText('No hay usuarios guardados.')).toBeInTheDocument();
  });
});