import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DetalleProductoAdmin from './DetalleProductoAdmin.jsx';

const producto = {
  codigo: 'M1', nombre: 'Tablón de pino', categoria: 'Madera', subcategoria: '', marca: 'Acme',
  unidad: 'U', descripcion: '', precioVenta: 5990, stock: 10, stockMinimo: 2, imagen: '',
};

function mostrar(props) {
  return render(
    <MemoryRouter>
      <DetalleProductoAdmin producto={producto} esAdmin error="" onEliminar={vi.fn()} {...props} />
    </MemoryRouter>,
  );
}

describe('DetalleProductoAdmin', () => {
  it('muestra los datos del producto y "No informado" en los vacíos', () => {
    mostrar();
    expect(screen.getByRole('heading', { name: 'Tablón de pino' })).toBeInTheDocument();
    expect(screen.getByText('$5.990')).toBeInTheDocument();
    expect(screen.getByText('10 unidades')).toBeInTheDocument();
    expect(screen.getAllByText('No informado').length).toBeGreaterThan(0);
  });

  it('el administrador puede editar y eliminar', () => {
    const onEliminar = vi.fn();
    mostrar({ onEliminar });
    expect(screen.getByRole('button', { name: 'Editar producto' })).toHaveAttribute('href', '/admin/productos/M1/editar');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onEliminar).toHaveBeenCalled();
  });

  it('el vendedor solo consulta', () => {
    mostrar({ esAdmin: false });
    expect(screen.queryByRole('button', { name: 'Editar producto' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  });

  it('muestra el error cuando llega', () => {
    mostrar({ error: 'No fue posible eliminar' });
    expect(screen.getByRole('alert')).toHaveTextContent('No fue posible eliminar');
  });
});