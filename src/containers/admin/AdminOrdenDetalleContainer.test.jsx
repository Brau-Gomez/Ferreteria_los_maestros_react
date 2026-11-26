import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminOrdenDetalleContainer from '@/containers/admin/AdminOrdenDetalleContainer.jsx';

// Orden tal como la devuelve order-service.
const orden = {
  id: 'PED-1700000000000',
  customerEmail: 'ana@gmail.com',
  status: 'CONFIRMED',
  total: 11900,
  notes: 'Retiro en tienda',
  createdAt: '2026-11-25T12:00:00Z',
  items: [{ productCode: 'MC001', productName: 'Cemento gris', unitPrice: 5950, quantity: 2 }],
};

async function mostrar(id, textoEsperado) {
  localStorage.setItem('ep1-users', JSON.stringify([
    { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true },
  ]));
  localStorage.setItem('ep1-orders', JSON.stringify([orden]));
  render(
    <MemoryRouter initialEntries={['/admin/ordenes/' + id]}>
      <Routes>
        <Route path="/admin/ordenes/:id" element={<AdminOrdenDetalleContainer />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText(textoEsperado);
}

describe('AdminOrdenDetalleContainer', () => {
  it('muestra la boleta con el cliente y el desglose de IVA', async () => {
    await mostrar('PED-1700000000000', 'Boleta PED-1700000000000');
    expect(await screen.findByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('$10.000')).toBeInTheDocument();
    expect(screen.getByText('$1.900')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });

  it('avisa si la orden no existe', async () => {
    await mostrar('PED-1', 'Orden no encontrada');
    expect(screen.getByText('Orden no encontrada')).toBeInTheDocument();
  });

  it('imprimir llama a window.print', async () => {
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    await mostrar('PED-1700000000000', 'Boleta PED-1700000000000');
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir boleta' }));
    expect(imprimir).toHaveBeenCalledTimes(1);
    imprimir.mockRestore();
  });
});
