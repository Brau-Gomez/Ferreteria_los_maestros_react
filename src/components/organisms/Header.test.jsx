import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthProvider.jsx';
import { CartProvider } from '../../context/CartProvider.jsx';
import Header from './Header.jsx';

const cliente = { run: '222222222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };
const admin = { run: '123456785', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const producto = { codigo: 'MC001', nombre: 'Cemento', precioVenta: 5990, stock: 10, stockMinimo: 1 };

function mostrar({ sesion, carrito = [] } = {}) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([cliente, admin]));
  localStorage.setItem('ep1-products', JSON.stringify([producto]));
  localStorage.setItem('ep1-cart', JSON.stringify(carrito));
  if (sesion) localStorage.setItem('ep1-user', JSON.stringify({ run: sesion }));
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<p>Portada</p>} />
            <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('sin sesión muestra Ingreso y Contacto, y no Mi cuenta', () => {
    mostrar();
    expect(screen.getByRole('link', { name: 'Ingreso' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Mi cuenta' })).not.toBeInTheDocument();
  });

  it('con un cliente muestra Mi cuenta y Cerrar sesión, sin Administración', () => {
    mostrar({ sesion: cliente.run });
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Administración' })).not.toBeInTheDocument();
  });

  it('con un administrador muestra Administración y oculta Contacto', () => {
    mostrar({ sesion: admin.run });
    expect(screen.getByRole('link', { name: 'Administración' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Contacto' })).not.toBeInTheDocument();
  });

  it('muestra en el contador la cantidad de unidades del carrito', () => {
    mostrar({ carrito: [{ ...producto, cantidad: 3 }] });
    expect(screen.getByRole('link', { name: /Carrito/ })).toHaveTextContent('3');
  });

  it('al cerrar sesión lleva a la pantalla de ingreso', () => {
    mostrar({ sesion: cliente.run });
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-user'))).toBeNull();
  });
});