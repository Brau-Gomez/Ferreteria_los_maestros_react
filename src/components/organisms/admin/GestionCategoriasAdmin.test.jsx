import { fireEvent, render, screen } from '@testing-library/react';
import GestionCategoriasAdmin from '@/components/organisms/admin/GestionCategoriasAdmin.jsx';

function propsBase(extra = {}) {
  return {
    categorias: [{ categoria: 'Madera', cantidad: 2 }, { categoria: 'Jardín', cantidad: 0 }],
    nuevoNombre: '', error: '', mensaje: '', editando: '', valorEdicion: '',
    onCambiarNuevo: vi.fn(), onAgregar: vi.fn(), onEditar: vi.fn(), onCambiarEdicion: vi.fn(),
    onGuardarEdicion: vi.fn(), onCancelarEdicion: vi.fn(), onEliminar: vi.fn(),
    ...extra,
  };
}

describe('GestionCategoriasAdmin', () => {
  it('lista las categorías con su cantidad de productos', () => {
    render(<GestionCategoriasAdmin {...propsBase()} />);
    expect(screen.getByText('Madera')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('envía el formulario de nueva categoría', () => {
    const props = propsBase();
    render(<GestionCategoriasAdmin {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    expect(props.onAgregar).toHaveBeenCalled();
  });

  it('informa lo que se escribe en el campo nuevo', () => {
    const props = propsBase();
    render(<GestionCategoriasAdmin {...props} />);
    fireEvent.change(screen.getByLabelText('Nombre de la nueva categoría'), { target: { value: 'A' } });
    expect(props.onCambiarNuevo).toHaveBeenCalledWith('A');
  });

  it('dispara editar y eliminar por categoría', () => {
    const props = propsBase();
    render(<GestionCategoriasAdmin {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar Jardín' }));
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Jardín' }));
    expect(props.onEditar).toHaveBeenCalledWith('Jardín');
    expect(props.onEliminar).toHaveBeenCalledWith('Jardín');
  });

  it('en modo edición muestra el campo con Guardar y Cancelar', () => {
    const props = propsBase({ editando: 'Madera', valorEdicion: 'Madera' });
    render(<GestionCategoriasAdmin {...props} />);
    expect(screen.getByLabelText('Nuevo nombre para Madera')).toHaveValue('Madera');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(props.onGuardarEdicion).toHaveBeenCalled();
    expect(props.onCancelarEdicion).toHaveBeenCalled();
  });

  it('muestra los avisos de error y de éxito', () => {
    render(<GestionCategoriasAdmin {...propsBase({ error: 'Algo falló', mensaje: 'Todo bien' })} />);
    expect(screen.getByText('Algo falló')).toBeInTheDocument();
    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });

  it('avisa cuando no hay categorías', () => {
    render(<GestionCategoriasAdmin {...propsBase({ categorias: [] })} />);
    expect(screen.getByText('No hay categorías guardadas.')).toBeInTheDocument();
  });
});