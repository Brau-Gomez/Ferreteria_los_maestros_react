import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormularioProductoAdmin from './FormularioProductoAdmin.jsx';

const datos = { codigo: 'ab1', nombre: 'Taladro', descripcion: '', precio: '100', stock: '5', stockCritico: '', categoria: '' };

function mostrar(extra = {}) {
  const props = {
    modo: 'nuevo', datos, errores: {}, mensaje: '', guardando: false, categorias: ['Madera', 'Jardín'],
    tieneImagen: false, rutaCancelar: '/admin/productos',
    onCambiar: vi.fn(), onArchivo: vi.fn(), onEnviar: vi.fn((e) => e.preventDefault()),
    ...extra,
  };
  render(<MemoryRouter><FormularioProductoAdmin {...props} /></MemoryRouter>);
  return props;
}

describe('FormularioProductoAdmin', () => {
  it('en modo nuevo muestra los títulos de creación', () => {
    mostrar();
    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar producto' })).toBeInTheDocument();
    expect(screen.getByText('Opcional, máximo 500 KB.')).toBeInTheDocument();
  });

  it('en modo editar cambia los textos y avisa de la imagen actual', () => {
    mostrar({ modo: 'editar', tieneImagen: true });
    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
    expect(screen.getByText('Imagen actual conservada si no seleccionas otra.')).toBeInTheDocument();
  });

  it('informa los cambios de los campos y de la categoría', () => {
    const props = mostrar();
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Martillo' } });
    fireEvent.change(screen.getByLabelText('Categoría *'), { target: { value: 'Madera' } });
    expect(props.onCambiar).toHaveBeenCalledWith('nombre', 'Martillo');
    expect(props.onCambiar).toHaveBeenCalledWith('categoria', 'Madera');
  });

  it('pasa el código a mayúsculas al salir del campo', () => {
    const props = mostrar();
    fireEvent.blur(screen.getByLabelText('Código *'), { target: { value: 'ab1' } });
    expect(props.onCambiar).toHaveBeenCalledWith('codigo', 'AB1');
  });

  it('entrega el archivo elegido', () => {
    const props = mostrar();
    const archivo = new File(['x'], 'foto.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Imagen'), { target: { files: [archivo] } });
    expect(props.onArchivo).toHaveBeenCalledWith(archivo);
  });

  it('envía el formulario', () => {
    const props = mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(props.onEnviar).toHaveBeenCalled();
  });

  it('deshabilita el botón mientras guarda y muestra errores y mensaje', () => {
    mostrar({ guardando: true, errores: { nombre: 'Nombre inválido' }, mensaje: 'Revisa los campos' });
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled();
    expect(screen.getByText('Nombre inválido')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos');
  });
});