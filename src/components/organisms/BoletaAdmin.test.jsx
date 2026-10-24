import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoletaAdmin from './BoletaAdmin.jsx';

const boleta = {
  pedido: {
    id: 'PED-1700000000000',
    delivery: 'Despacho',
    despacho: { direccion: 'Calle 1 #23', comuna: 'La Serena', region: 'Región de Coquimbo' },
    productos: [{ codigo: 'MC001', nombre: 'Cemento gris', precioVenta: 5990, cantidad: 2 }],
  },
  cliente: 'Ana Pérez',
  fecha: '14/11/2023',
  desglose: { neto: 10067, iva: 1913, total: 11980 },
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <BoletaAdmin boleta={boleta} onImprimir={() => {}} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('BoletaAdmin', () => {
  it('muestra cliente, productos, desglose de IVA y total', () => {
    mostrar();
    expect(screen.getByText('Boleta PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText('$10.067')).toBeInTheDocument();
    expect(screen.getByText('$1.913')).toBeInTheDocument();
    expect(screen.getByText('$11.980', { selector: 'strong' })).toBeInTheDocument();
  });

  it('muestra la dirección de despacho cuando existe', () => {
    mostrar();
    expect(screen.getByText(/Calle 1 #23, La Serena/)).toBeInTheDocument();
  });

  it('no muestra dirección en un retiro en tienda', () => {
    const retiro = { ...boleta, pedido: { ...boleta.pedido, delivery: 'Retiro en tienda', despacho: undefined } };
    mostrar({ boleta: retiro });
    expect(screen.queryByText('Dirección de despacho')).not.toBeInTheDocument();
  });

  it('avisa al imprimir', () => {
    const onImprimir = vi.fn();
    mostrar({ onImprimir });
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir boleta' }));
    expect(onImprimir).toHaveBeenCalledTimes(1);
  });

  it('muestra un aviso si la orden no existe', () => {
    mostrar({ boleta: null });
    expect(screen.getByText('Orden no encontrada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/admin/ordenes');
  });
});