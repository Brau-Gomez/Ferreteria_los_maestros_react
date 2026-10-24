import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { CartProvider } from '../context/CartProvider.jsx';
import HeaderContainer from './HeaderContainer.jsx';

function Ubicacion() {
  const { pathname, search } = useLocation();
  return <p>Ruta: {pathname + search}</p>;
}

function mostrar() {
  localStorage.clear();
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <CartProvider>
          <HeaderContainer />
          <Routes>
            <Route path="*" element={<Ubicacion />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Header: búsqueda, categorías y ofertas', () => {
  it('buscar lleva al catálogo con el texto en la URL', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'taladro' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByText('Ruta: /productos?q=taladro')).toBeInTheDocument();
  });

  it('buscar vacío lleva al catálogo sin filtro', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByText('Ruta: /productos')).toBeInTheDocument();
  });

  it('tiene enlace a Ofertas', () => {
    mostrar();
    expect(screen.getByRole('link', { name: 'Ofertas' })).toHaveAttribute('href', '/ofertas');
  });

  it('el menú Categorías lista todas las categorías', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
    expect(screen.getByRole('link', { name: 'Todas las categorías' })).toHaveAttribute('href', '/categorias');
    expect(screen.getByRole('link', { name: 'Electricidad' })).toHaveAttribute('href', '/categorias/Electricidad');
  });
});