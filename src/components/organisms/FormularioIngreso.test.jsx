import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormularioIngreso from './FormularioIngreso.jsx';

const base = {
  datos: { correo: '', clave: '' },
  errores: {},
  mensaje: '',
  enviando: false,
  cuentasDemo: [{ tipo: 'Administrador', correo: 'admin@duoc.cl' }],
  onCambio: () => {},
  onSeleccionarDemo: () => {},
  onEnviar: (evento) => evento.preventDefault(),
};

function mostrar(propiedades) {
  return render(
    <MemoryRouter>
      <FormularioIngreso {...base} {...propiedades} />
    </MemoryRouter>,
  );
}

describe('FormularioIngreso', () => {
  it('muestra los campos, el botón y el enlace de registro', () => {
    mostrar();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Crear una cuenta')).toBeInTheDocument();
  });

  it('avisa cada cambio con el nombre del campo', () => {
    const onCambio = vi.fn();
    mostrar({ onCambio });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'abcd' },
    });
    expect(onCambio).toHaveBeenCalledWith('correo', 'ana@gmail.com');
    expect(onCambio).toHaveBeenCalledWith('clave', 'abcd');
  });

  it('muestra los errores y el mensaje recibidos', () => {
    mostrar({
      errores: { correo: 'Ingresa un correo válido.' },
      mensaje: 'Correo o contraseña incorrectos.',
    });
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.');
  });

  it('deshabilita el botón mientras se envía', () => {
    mostrar({ enviando: true });
    expect(screen.getByRole('button', { name: 'Ingresando…' })).toBeDisabled();
  });
});