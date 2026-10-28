import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminOrdenDetalleContainer from '@/containers/admin/AdminOrdenDetalleContainer.jsx';

const pedido = {
  id: 'PED-1700000000000',
  runUsuario: '123456785',
  total: 11900,
  delivery: 'Retiro en tienda',
  productos: [{ codigo: 'MC001', nombre: 'Cemento gris', precioVenta: 5950, cantidad: 2 }],
};

function mostrar(id) {
  localStorage.clear();
  localStorage.setItem('ep1-users', JSON.stringify([
    { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true },
  ]));
  localStorage.setItem('ep1-orders', JSON.stringify([pedido]));
  return render(
    <MemoryRouter initialEntries={['/admin/ordenes/' + id]}>
      <Routes>
        <Route path="/admin/ordenes/:id" element={<AdminOrdenDetalleContainer />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AdminOrdenDetalleContainer', () => {
  it('muestra la boleta de la orden con su desglose de IVA', () => {
    mostrar('PED-1700000000000');
    expect(screen.getByText('Boleta PED-1700000000000')).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('$10.000')).toBeInTheDocument();
    expect(screen.getByText('$1.900')).toBeInTheDocument();
  });

  it('avisa si la orden no existe', () => {
    mostrar('PED-1');
    expect(screen.getByText('Orden no encontrada')).toBeInTheDocument();
  });

  it('imprimir llama a window.print', () => {
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    mostrar('PED-1700000000000');
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir boleta' }));
    expect(imprimir).toHaveBeenCalledTimes(1);
    imprimir.mockRestore();
  });
});