import { render, screen, fireEvent } from '@testing-library/react';
import DatosEmpresaRegistro from '@/components/organisms/registro/DatosEmpresaRegistro.jsx';

const base = {
  datos: { empresaRut: '', empresaRazon: '', empresaDireccion: '' },
  errores: {},
  onCambio: () => {},
};

describe('DatosEmpresaRegistro', () => {
  it('muestra los tres campos de la empresa', () => {
    render(<DatosEmpresaRegistro {...base} />);
    expect(screen.getByLabelText('RUT de la empresa *')).toBeInTheDocument();
    expect(screen.getByLabelText('Razón social *')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección de la empresa *')).toBeInTheDocument();
  });

  it('avisa el campo y el valor al escribir', () => {
    const onCambio = vi.fn();
    render(<DatosEmpresaRegistro {...base} onCambio={onCambio} />);
    fireEvent.change(screen.getByLabelText('Razón social *'), {
      target: { value: 'Constructora Sur' },
    });
    expect(onCambio).toHaveBeenCalledWith('empresaRazon', 'Constructora Sur');
  });
});