import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HeaderContainer from '@/containers/layout/HeaderContainer.jsx';

const cliente = { run: '222222222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };
const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const producto = { codigo: 'MC001', nombre: 'Cemento', precioVenta: 5990, stock: 10, stockMinimo: 1 };

function mostrar({ sesion, carrito = [] } = {}) {
  localStorage.setItem('ep1-users', JSON.stringify([cliente, admin]));
  localStorage.setItem('ep1-products', JSON.stringify([producto]));
  localStorage.setItem('ep1-cart', JSON.stringify(carrito));
  if (sesion) localStorage.setItem('ep1-user', JSON.stringify(sesion));
  render(
    <MemoryRouter initialEntries={['/']}>
      <HeaderContainer />
      <Routes>
        <Route path="/" element={<p>Portada</p>} />
        <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('sin sesión muestra Ingreso y Contacto, y no Mi cuenta', async () => {
    mostrar();
    expect(await screen.findByRole('link', { name: 'Ingreso' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Mi cuenta' })).not.toBeInTheDocument();
  });

  it('con un cliente muestra Mi cuenta y Cerrar sesión, sin Administración', async () => {
    mostrar({ sesion: cliente });
    expect(await screen.findByRole('link', { name: 'Mi cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument();
  });

  it('con un administrador muestra Administración y oculta Contacto', async () => {
    mostrar({ sesion: admin });
    expect(await screen.findByRole('link', { name: 'Administración' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Contacto' })).not.toBeInTheDocument();
  });

  it('muestra en el contador la cantidad de unidades del carrito', async () => {
    // El carrito vive en el backend y exige sesión iniciada.
    mostrar({ sesion: cliente, carrito: [{ codigo: 'MC001', cantidad: 3 }] });
    await screen.findByRole('link', { name: 'Mi cuenta' });
    await vi.waitFor(() => expect(screen.getByRole('link', { name: /Carrito/ })).toHaveTextContent('3'));
  });

  it('al cerrar sesión lleva a la pantalla de ingreso', async () => {
    mostrar({ sesion: cliente });
    fireEvent.click(await screen.findByRole('button', { name: 'Cerrar sesión' }));
    expect(await screen.findByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
  });
});
