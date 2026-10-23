import { render, screen, fireEvent } from '@testing-library/react';
import DatosPersonalesRegistro from './DatosPersonalesRegistro.jsx';

const datos = {
  nombre: '', apellidos: '', run: '', fechaNacimiento: '', comuna: '', direccion: '',
};
const base = {
  datos,
  errores: {},
  region: 'Región de Coquimbo',
  comunas: ['La Serena', 'Ovalle'],
  onCambio: () => {},
};

describe('DatosPersonalesRegistro', () => {
  it('muestra los campos, la región y las comunas recibidas', () => {
    render(<DatosPersonalesRegistro {...base} />);
    expect(screen.getByLabelText('Nombre *')).toBeInTheDocument();
    expect(screen.getByLabelText('RUN *')).toBeInTheDocument();
    expect(screen.getByLabelText('Región de residencia')).toHaveValue('Región de Coquimbo');
    expect(screen.getByRole('option', { name: 'La Serena' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ovalle' })).toBeInTheDocument();
  });

  it('avisa el campo y el valor al escribir y al elegir comuna', () => {
    const onCambio = vi.fn();
    render(<DatosPersonalesRegistro {...base} onCambio={onCambio} />);
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Comuna *'), { target: { value: 'Ovalle' } });
    expect(onCambio).toHaveBeenCalledWith('nombre', 'Ana');
    expect(onCambio).toHaveBeenCalledWith('comuna', 'Ovalle');
  });

  it('muestra los errores recibidos', () => {
    render(
      <DatosPersonalesRegistro
        {...base}
        errores={{ run: 'Ingresa un RUN válido, entre 7 y 9 caracteres.' }}
      />,
    );
    expect(screen.getByText('Ingresa un RUN válido, entre 7 y 9 caracteres.')).toBeInTheDocument();
  });
});