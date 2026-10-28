import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HistorialPedidos from '@/components/organisms/cuenta/HistorialPedidos.jsx';

const pedidos = [
  {
    id: 'PED-1700000000000',
    delivery: 'Despacho',
    total: 11980,
    productos: [{ codigo: 'MC001', nombre: 'Cemento gris 25 kg', cantidad: 2, precioVenta: 5990 }],
  },
];

function mostrar(lista) {
  return render(
    <MemoryRouter>
      <HistorialPedidos pedidos={lista} />
    </MemoryRouter>,
  );
}

describe('HistorialPedidos', () => {
  it('muestra una tarjeta por cada pedido', () => {
    mostrar(pedidos);
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Despacho')).toBeInTheDocument();
  });

  it('invita a ir al catálogo cuando no hay pedidos', () => {
    mostrar([]);
    expect(screen.getByText('Todavía no tienes pedidos confirmados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir al catálogo' })).toBeInTheDocument();
  });
});