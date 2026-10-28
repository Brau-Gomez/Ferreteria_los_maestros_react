import { render, screen } from '@testing-library/react';
import ResumenCompra from '@/components/organisms/checkout/ResumenCompra.jsx';

describe('ResumenCompra', () => {
  it('lista los productos con su subtotal y muestra el total', () => {
    const items = [{ codigo: 'MC001', nombre: 'Cemento gris 25 kg', precioVenta: 5990, cantidad: 2 }];
    render(<ResumenCompra items={items} total={11980} />);
    expect(screen.getByText(/Cemento gris 25 kg/)).toBeInTheDocument();
    expect(screen.getAllByText('$11.980')).toHaveLength(2);
  });
});