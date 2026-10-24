import { render, screen } from '@testing-library/react';
import PrecioProducto from './PrecioProducto.jsx';

describe('PrecioProducto', () => {
  it('sin oferta muestra solo el precio', () => {
    render(<PrecioProducto precio={5990} />);
    expect(screen.getByText('$5.990')).toBeInTheDocument();
    expect(screen.queryByText(/Oferta/)).not.toBeInTheDocument();
  });
  it('en oferta muestra el precio anterior tachado y el descuento', () => {
    const { container } = render(<PrecioProducto precio={4990} precioAnterior={5990} descuento={17} />);
    expect(screen.getByText('Oferta -17%')).toBeInTheDocument();
    expect(container.querySelector('del')).toHaveTextContent('$5.990');
  });
  it('si el precio anterior no es mayor, no hay oferta', () => {
    render(<PrecioProducto precio={5990} precioAnterior={5990} descuento={0} />);
    expect(screen.queryByText(/Oferta/)).not.toBeInTheDocument();
  });
});