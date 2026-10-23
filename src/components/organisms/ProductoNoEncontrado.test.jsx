import { render, screen } from '@testing-library/react';
import ProductoNoEncontrado from './ProductoNoEncontrado.jsx';

describe('ProductoNoEncontrado', () => {
  it('avisa que el producto no existe e invita a volver al catálogo', () => {
    render(<ProductoNoEncontrado />);
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByText('Vuelve al catálogo para seleccionar uno.')).toBeInTheDocument();
  });
});