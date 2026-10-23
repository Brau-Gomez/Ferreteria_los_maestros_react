import { render, screen } from '@testing-library/react';
import CampoFormulario from './CampoFormulario.jsx';

describe('CampoFormulario', () => {
  it('muestra la etiqueta y el valor recibido', () => {
    render(
      <CampoFormulario id="nombre" etiqueta="Nombre" value="Ana" onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana');
  });

  it('muestra el mensaje y marca el campo como inválido cuando hay error', () => {
    render(
      <CampoFormulario
        id="correo"
        etiqueta="Correo"
        value=""
        onChange={() => {}}
        error="El correo es obligatorio."
      />,
    );
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid');
  });

  it('no marca el campo como inválido si no hay error', () => {
    render(
      <CampoFormulario id="correo" etiqueta="Correo" value="" onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Correo')).not.toHaveClass('is-invalid');
  });

  it('muestra el texto de ayuda cuando se entrega', () => {
    render(
      <CampoFormulario
        id="run"
        etiqueta="RUN"
        ayuda="Sin puntos ni guion."
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Sin puntos ni guion.')).toBeInTheDocument();
  });
});