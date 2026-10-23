import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GrillaProductos from './GrillaProductos.jsx';

const productos = [
  { codigo: 'MC001', nombre: 'Cemento gris 25 kg', marca: 'Polpaico', unidad: 'Saco', categoria: 'Materiales', precioVenta: 5990, stock: 80 },
  { codigo: 'HE001', nombre: 'Taladro percutor', marca: 'Bosch', unidad: 'Unidad', categoria: 'Herramientas', precioVenta: 39990, stock: 0 },
];

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <GrillaProductos productos={productos} onAgregar={() => {}} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('GrillaProductos', () => {
  it('muestra una tarjeta por cada producto', () => {
    mostrar();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
    expect(screen.getByText('Taladro percutor')).toBeInTheDocument();
    expect(screen.getAllByText('Ver detalle')).toHaveLength(2);
  });

  it('muestra "Sin resultados" cuando no hay productos', () => {
    mostrar({ productos: [] });
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('avisa el código del producto al presionar "Agregar"', () => {
    const onAgregar = vi.fn();
    mostrar({ onAgregar });
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);
    expect(onAgregar).toHaveBeenCalledWith('MC001');
  });

  it('deshabilita "Agregar" en un producto sin stock', () => {
    mostrar();
    expect(screen.getAllByRole('button', { name: 'Agregar' })[1]).toBeDisabled();
    expect(screen.getByText('Sin stock disponible')).toBeInTheDocument();
  });
});