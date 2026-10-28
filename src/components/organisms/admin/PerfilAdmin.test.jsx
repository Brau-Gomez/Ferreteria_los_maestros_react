import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PerfilAdmin from '@/components/organisms/admin/PerfilAdmin.jsx';

const base = { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl', region: 'Metropolitana', comuna: 'Santiago' };

function mostrar(usuario) {
  return render(<MemoryRouter><PerfilAdmin usuario={usuario} /></MemoryRouter>);
}

describe('PerfilAdmin', () => {
  it('el administrador ve sus datos y el enlace para editar', () => {
    mostrar({ ...base, tipoUsuario: 'Administrador' });
    expect(screen.getByRole('heading', { name: 'Ana Pérez' })).toBeInTheDocument();
    expect(screen.getByText('ana@duoc.cl')).toBeInTheDocument();
    expect(screen.getByText('No informado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar mi perfil' })).toHaveAttribute('href', '/admin/usuarios/123456785/editar');
    expect(screen.getByText('Ver reportes de ventas y productos críticos')).toBeInTheDocument();
  });

  it('el vendedor no ve el botón de editar y ve sus permisos', () => {
    mostrar({ ...base, tipoUsuario: 'Vendedor' });
    expect(screen.queryByRole('button', { name: 'Editar mi perfil' })).not.toBeInTheDocument();
    expect(screen.getByText('Consultar el catálogo de productos')).toBeInTheDocument();
  });
});