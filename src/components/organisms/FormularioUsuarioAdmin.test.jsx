import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormularioUsuarioAdmin from './FormularioUsuarioAdmin.jsx';

const datos = { run: '123456785', nombre: 'Ana', apellidos: 'Pérez', correo: 'a@b.cl', fechaNacimiento: '', tipoUsuario: '', region: 'Región de Coquimbo', comuna: '', direccion: 'Calle 1' };

function mostrar(extra = {}) {
  const props = {
    modo: 'nuevo', datos, errores: {}, mensaje: '', roles: ['Administrador', 'Vendedor', 'Cliente'],
    regiones: ['Región de Coquimbo'], comunas: ['La Serena', 'Ovalle'], rutaCancelar: '/admin/usuarios',
    onCambiar: vi.fn(), onCambiarRegion: vi.fn(), onNormalizarRun: vi.fn(), onEnviar: vi.fn((e) => e.preventDefault()),
    ...extra,
  };
  render(<MemoryRouter><FormularioUsuarioAdmin {...props} /></MemoryRouter>);
  return props;
}

describe('FormularioUsuarioAdmin', () => {
  it('muestra los textos del modo nuevo y las opciones', () => {
    mostrar();
    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar usuario' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Vendedor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ovalle' })).toBeInTheDocument();
  });

  it('muestra los textos del modo editar', () => {
    mostrar({ modo: 'editar' });
    expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });

  it('informa los cambios de campo, perfil, región y comuna', () => {
    const props = mostrar();
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Luis' } });
    fireEvent.change(screen.getByLabelText('Tipo de usuario *'), { target: { value: 'Vendedor' } });
    fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value: 'Ovalle' } });
    fireEvent.change(screen.getByLabelText('Región *'), { target: { value: 'Región de Coquimbo' } });
    expect(props.onCambiar).toHaveBeenCalledWith('nombre', 'Luis');
    expect(props.onCambiar).toHaveBeenCalledWith('tipoUsuario', 'Vendedor');
    expect(props.onCambiar).toHaveBeenCalledWith('comuna', 'Ovalle');
    expect(props.onCambiarRegion).toHaveBeenCalledWith('Región de Coquimbo');
  });

  it('normaliza el RUN al salir del campo', () => {
    const props = mostrar();
    fireEvent.blur(screen.getByLabelText('RUN *'));
    expect(props.onNormalizarRun).toHaveBeenCalled();
  });

  it('envía el formulario y muestra errores y mensaje', () => {
    const props = mostrar({ errores: { correo: 'Correo inválido' }, mensaje: 'No fue posible guardar' });
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No fue posible guardar');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(props.onEnviar).toHaveBeenCalled();
  });
});