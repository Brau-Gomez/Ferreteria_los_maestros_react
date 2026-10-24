import { fireEvent, render, screen } from '@testing-library/react';
import AdminCategoriasContainer from './AdminCategoriasContainer.jsx';

const productos = [
  { codigo: 'P1', nombre: 'Tablón', categoria: 'Madera', precioVenta: 1000, stock: 5, stockMinimo: 1 },
];

function mostrar() {
  localStorage.clear();
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  localStorage.setItem('ep1-categories', JSON.stringify(['Madera', 'Jardín']));
  return render(<AdminCategoriasContainer />);
}

describe('AdminCategoriasContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('agrega una categoría válida y la guarda', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'Iluminación' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(screen.getByText('Categoría "Iluminación" creada.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-categories'))).toContain('Iluminación');
  });

  it('rechaza una categoría repetida', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'madera' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(screen.getByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-categories'))).toHaveLength(2);
  });

  it('al renombrar actualiza también los productos', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Madera' }));
    const campo = screen.getByLabelText('Nuevo nombre para Madera');
    fireEvent.change(campo, { target: { value: 'Maderas' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText('Categoría renombrada a "Maderas".')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-categories'))).toEqual(['Maderas', 'Jardín']);
    expect(JSON.parse(localStorage.getItem('ep1-products'))[0].categoria).toBe('Maderas');
  });

  it('muestra el error si el nuevo nombre es inválido y permite cancelar', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Jardín' }));
    const campo = screen.getByLabelText('Nuevo nombre para Jardín');
    fireEvent.change(campo, { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByLabelText('Nuevo nombre para Jardín')).not.toBeInTheDocument();
  });

  it('no elimina una categoría con productos', () => {
    const confirmar = vi.spyOn(window, 'confirm');
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Madera' }));
    expect(screen.getByText(/tiene 1 producto/)).toBeInTheDocument();
    expect(confirmar).not.toHaveBeenCalled();
  });

  it('elimina una categoría vacía tras confirmar', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Jardín' }));
    expect(screen.getByText('Categoría "Jardín" eliminada.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-categories'))).toEqual(['Madera']);
  });

  it('no elimina si la persona cancela la confirmación', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Jardín' }));
    expect(JSON.parse(localStorage.getItem('ep1-categories'))).toEqual(['Madera', 'Jardín']);
  });

  it('avisa si no se pudo guardar', () => {
    mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'Iluminación' } });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('lleno'); });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(screen.getByText('No se pudo guardar la categoría.')).toBeInTheDocument();
  });
});