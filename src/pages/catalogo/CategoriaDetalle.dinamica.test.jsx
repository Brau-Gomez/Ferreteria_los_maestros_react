import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '@/context/CartProvider.jsx';
import CategoriaDetalle from '@/pages/catalogo/CategoriaDetalle.jsx';

describe('CategoriaDetalle con categorías guardadas', () => {
  it('reconoce una categoría creada por el admin', () => {
    localStorage.clear();
    localStorage.setItem('ep1-categories', JSON.stringify(['Iluminación']));
    render(
      <MemoryRouter initialEntries={['/categorias/Iluminaci%C3%B3n']}>
        <CartProvider><Routes><Route path="/categorias/:categoria" element={<CategoriaDetalle />} /></Routes></CartProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Iluminación' })).toBeInTheDocument();
  });

  it('una categoría eliminada muestra el aviso', () => {
    localStorage.clear();
    localStorage.setItem('ep1-categories', JSON.stringify(['Iluminación']));
    render(
      <MemoryRouter initialEntries={['/categorias/Madera']}>
        <CartProvider><Routes><Route path="/categorias/:categoria" element={<CategoriaDetalle />} /></Routes></CartProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Categoría no encontrada' })).toBeInTheDocument();
  });
});