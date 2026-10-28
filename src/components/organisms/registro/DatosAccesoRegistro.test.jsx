import { render, screen, fireEvent } from '@testing-library/react';
import DatosAccesoRegistro from '@/components/organisms/registro/DatosAccesoRegistro.jsx';

const base = {
  datos: { telefono: '', correo: '', clave: '', confirmacion: '' },
  errores: {},
  onCambio: () => {},
};

describe('DatosAccesoRegistro', () => {
  it('muestra los cuatro campos de acceso', () => {
    render(<DatosAccesoRegistro {...base} />);
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo *')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña *')).toBeInTheDocument();
  });

  it('avisa el campo y muestra el error de confirmación', () => {
    const onCambio = vi.fn();
    render(
      <DatosAccesoRegistro
        {...base}
        errores={{ confirmacion: 'Las contraseñas deben coincidir.' }}
        onCambio={onCambio}
      />,
    );
    fireEvent.change(screen.getByLabelText('Correo *'), { target: { value: 'ana@gmail.com' } });
    expect(onCambio).toHaveBeenCalledWith('correo', 'ana@gmail.com');
    expect(screen.getByText('Las contraseñas deben coincidir.')).toBeInTheDocument();
  });
});