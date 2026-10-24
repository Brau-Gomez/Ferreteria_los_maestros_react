import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header.jsx';

const cliente = { tipoUsuario: 'Cliente' };
const admin = { tipoUsuario: 'Administrador' };

function mostrar(props = {}) {
  return render(
    <MemoryRouter>
      <Header onCambiarBusqueda={vi.fn()} onBuscar={vi.fn()} onCerrarSesion={vi.fn()} {...props} />
    </MemoryRouter>,
  );
}

describe('Header (presentacional)', () => {
  it('sin usuario muestra Ingreso y Contacto', () => {
    mostrar();
    expect(screen.getByRole('link', { name: 'Ingreso' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
  });
  it('cliente ve Mi cuenta y Cerrar sesión', () => {
    const onCerrarSesion = vi.fn();
    mostrar({ usuario: cliente, onCerrarSesion });
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(onCerrarSesion).toHaveBeenCalledTimes(1);
  });
  it('perfil interno ve Administración y no ve Contacto', () => {
    mostrar({ usuario: admin });
    expect(screen.getByRole('link', { name: 'Administración' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Contacto' })).not.toBeInTheDocument();
  });
  it('muestra el contador recibido', () => {
    mostrar({ contador: 7 });
    expect(screen.getByRole('link', { name: /Carrito/ })).toHaveTextContent('7');
  });
  it('lista las categorías recibidas', () => {
    mostrar({ categorias: ['Pinturas'] });
    fireEvent.click(screen.getByText('Categorías'));
    expect(screen.getByRole('link', { name: 'Pinturas' })).toHaveAttribute('href', '/categorias/Pinturas');
  });
  it('notifica el texto escrito y el envío del buscador', () => {
    const onCambiarBusqueda = vi.fn();
    const onBuscar = vi.fn((e) => e.preventDefault());
    mostrar({ onCambiarBusqueda, onBuscar });
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'sierra' } });
    expect(onCambiarBusqueda).toHaveBeenCalledWith('sierra');
    fireEvent.submit(screen.getByRole('search'));
    expect(onBuscar).toHaveBeenCalledTimes(1);
  });
});