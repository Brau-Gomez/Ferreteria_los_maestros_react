import { fireEvent, render, screen } from '@testing-library/react';
import AdminCategoriasContainer from '@/containers/admin/AdminCategoriasContainer.jsx';
import { fallarSiguientePeticion } from '@/test/servidorFalso.js';

const productos = [
  { codigo: 'P1', nombre: 'Tablón', categoria: 'Madera', precioVenta: 1000, stock: 5, stockMinimo: 1 },
];

// Prepara el backend falso y espera a que la tabla cargue desde la API.
async function mostrar() {
  localStorage.setItem('ep1-products', JSON.stringify(productos));
  localStorage.setItem('ep1-categories', JSON.stringify(['Madera', 'Jardín']));
  render(<AdminCategoriasContainer />);
  await screen.findByRole('button', { name: 'Editar Madera' });
}

const categoriasGuardadas = () => JSON.parse(localStorage.getItem('ep1-categories'));

describe('AdminCategoriasContainer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('agrega una categoría válida y la guarda', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'Iluminación' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(await screen.findByText('Categoría "Iluminación" creada.')).toBeInTheDocument();
    expect(categoriasGuardadas()).toContain('Iluminación');
  });

  it('rechaza una categoría repetida', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'madera' } });
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(await screen.findByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument();
    expect(categoriasGuardadas()).toHaveLength(2);
  });

  it('al renombrar actualiza también los productos', async () => {
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Madera' }));
    const campo = screen.getByLabelText('Nuevo nombre para Madera');
    fireEvent.change(campo, { target: { value: 'Maderas' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('Categoría renombrada a "Maderas".')).toBeInTheDocument();
    expect(categoriasGuardadas()).toEqual(['Maderas', 'Jardín']);
    expect(JSON.parse(localStorage.getItem('ep1-products'))[0].categoria).toBe('Maderas');
  });

  it('muestra el error si el nuevo nombre es inválido y permite cancelar', async () => {
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Editar Jardín' }));
    const campo = screen.getByLabelText('Nuevo nombre para Jardín');
    fireEvent.change(campo, { target: { value: 'ab' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByLabelText('Nuevo nombre para Jardín')).not.toBeInTheDocument();
  });

  it('no elimina una categoría con productos', async () => {
    const confirmar = vi.spyOn(window, 'confirm');
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Madera' }));
    expect(await screen.findByText(/tiene 1 producto/)).toBeInTheDocument();
    expect(confirmar).not.toHaveBeenCalled();
  });

  it('elimina una categoría vacía tras confirmar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Jardín' }));
    expect(await screen.findByText('Categoría "Jardín" eliminada.')).toBeInTheDocument();
    expect(categoriasGuardadas()).toEqual(['Madera']);
  });

  it('no elimina si la persona cancela la confirmación', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Jardín' }));
    expect(categoriasGuardadas()).toEqual(['Madera', 'Jardín']);
  });

  it('avisa si el servidor no pudo guardar', async () => {
    await mostrar();
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'Iluminación' } });
    fallarSiguientePeticion(500, 'No se pudo guardar la categoría.');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(await screen.findByText('No se pudo guardar la categoría.')).toBeInTheDocument();
    expect(categoriasGuardadas()).toEqual(['Madera', 'Jardín']);
  });
});
