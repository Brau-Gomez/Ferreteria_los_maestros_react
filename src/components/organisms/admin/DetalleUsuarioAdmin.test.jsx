import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DetalleUsuarioAdmin from '@/components/organisms/admin/DetalleUsuarioAdmin.jsx';

const usuario = {
  run: '123456785',
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@gmail.com',
  tipoUsuario: 'Cliente',
  activo: true,
  comuna: 'La Serena',
};
const compras = [
  { id: 'PED-1700000000000', fecha: '14/11/2023', entrega: 'Despacho', total: 11980 },
  { id: 'PED-1600000000000', fecha: '13/09/2020', entrega: 'Retiro en tienda', total: 5990 },
];

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <DetalleUsuarioAdmin
        usuario={usuario}
        error=""
        compras={compras}
        totalComprado={17970}
        onEliminar={() => {}}
        {...propiedades}
      />
    </MemoryRouter>,
  );
}

describe('DetalleUsuarioAdmin', () => {
  it('muestra los datos del perfil y "No informado" en los vacíos', () => {
    mostrar();
    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument();
    expect(screen.getByText('ana@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('La Serena')).toBeInTheDocument();
    expect(screen.getAllByText('No informado').length).toBeGreaterThan(0);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('muestra el historial de compras con enlace a cada boleta y el total comprado', () => {
    mostrar();
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('$17.970')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver boleta' })[0]).toHaveAttribute('href', '/admin/ordenes/PED-1700000000000');
  });

  it('muestra un mensaje si el usuario no tiene compras', () => {
    mostrar({ compras: [], totalComprado: 0 });
    expect(screen.getByText('Este usuario todavía no tiene compras.')).toBeInTheDocument();
  });

  it('avisa al presionar Eliminar usuario y muestra el error recibido', () => {
    const onEliminar = vi.fn();
    mostrar({ onEliminar, error: 'Debe existir al menos un perfil Administrador.' });
    expect(screen.getByRole('alert')).toHaveTextContent('Debe existir al menos un perfil Administrador.');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar usuario' }));
    expect(onEliminar).toHaveBeenCalledTimes(1);
  });

  it('muestra un aviso si el usuario no existe', () => {
    mostrar({ usuario: undefined });
    expect(screen.getByText('Usuario no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a usuarios' })).toHaveAttribute('href', '/admin/usuarios');
  });
});