// Prueba con MOCK: se reemplaza la creación de la orden para controlar la
// boleta simulada que devuelve el backend, sin depender de la API real.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckoutContainer from '@/containers/checkout/CheckoutContainer.jsx';
import { crearOrdenMock } from '@/hooks/useOrdenes.js';

vi.mock('@/hooks/useSesion.js', () => {
  const usuario = {
    nombre: 'Ana',
    apellidos: 'Soto',
    correo: 'ana@gmail.com',
    direccion: 'Calle 1 #23',
    comuna: 'La Serena',
  };
  return { useSesion: () => ({ usuario }) };
});
vi.mock('@/hooks/useCarrito.js', () => ({
  useCarritoQuery: () => {
    const items = [{
      codigo: 'MC001',
      nombre: 'Cemento gris 25 kg',
      precioVenta: 5990,
      cantidad: 1,
    }];
    return { items, total: 5990, isLoading: false, refetch: vi.fn() };
  },
  useVaciarCarrito: () => ({ isPending: false, mutateAsync: vi.fn() }),
}));
vi.mock('@/hooks/useOrdenes.js', () => {
  const crearOrdenMock = vi.fn();
  return {
    crearOrdenMock,
    useCrearOrden: () => ({ isPending: false, mutateAsync: crearOrdenMock }),
  };
});
vi.mock('@/hooks/useCatalogo.js', () => ({
  useRegiones: () => ({
    regiones: [{ id: 1, nombre: 'Región de Coquimbo' }],
    isLoading: false,
  }),
  useComunas: () => ({
    comunas: [{ id: 1, nombre: 'La Serena' }],
    isLoading: false,
  }),
}));

const boleta = {
  folio: 'BOL-DEMO-1234',
  fecha: '2026-11-23T12:00:00Z',
  emisor: 'Ferretería Los Maestros',
  items: [{
    productCode: 'MC001',
    productName: 'Cemento gris 25 kg',
    unitPrice: 5990,
    quantity: 1,
    totalPrice: 5990,
  }],
  neto: 5033.61,
  iva: 956.39,
  despacho: 0,
  total: 5990,
  transaccionId: 'SIM-DEMO-123',
  estadoPago: 'COMPLETED',
};

beforeEach(() => {
  crearOrdenMock.mockReset();
  crearOrdenMock.mockResolvedValue({ id: 'PED-DEMO-123', total: 5990, boleta });
  render(
    <MemoryRouter>
      <CheckoutContainer />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByLabelText('Número de tarjeta *'), { target: { value: '4111111111111111' } });
});

describe('CheckoutContainer con la boleta simulada del backend (mock)', () => {
  it('confirma la orden y muestra la boleta devuelta por el backend', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    await waitFor(() => {
      expect(screen.getByText('Pago realizado correctamente.')).toBeInTheDocument();
    });
    expect(crearOrdenMock).toHaveBeenCalledWith(expect.objectContaining({
      orden: expect.objectContaining({
        items: [expect.objectContaining({ codigo: 'MC001', cantidad: 1 })],
      }),
    }));
    expect(screen.getByText('Boleta BOL-DEMO-1234')).toBeInTheDocument();
    expect(screen.getByText(/SIM-DEMO-123/)).toBeInTheDocument();
  });

  it('muestra el error cuando el backend no puede confirmar la orden', async () => {
    crearOrdenMock.mockRejectedValueOnce(new Error('No se pudo confirmar la orden.'));
    fireEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }));
    await waitFor(() => {
      expect(screen.getByText('No se pudo confirmar la orden.')).toBeInTheDocument();
    });
  });
});
