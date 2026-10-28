import { render, screen, fireEvent } from '@testing-library/react';
import FormularioContacto from '@/components/organisms/tienda/FormularioContacto.jsx';

const base = {
  datos: { nombre: '', correo: '', comentario: '' },
  errores: {},
  mensaje: '',
  onCambio: () => {},
  onEnviar: (evento) => evento.preventDefault(),
};

describe('FormularioContacto', () => {
  it('muestra los tres campos y el botón de enviar', () => {
    render(<FormularioContacto {...base} />);
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Comentario')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Enviar consulta' }),
    ).toBeInTheDocument();
  });

  it('avisa el campo y el valor cuando el usuario escribe', () => {
    const onCambio = vi.fn();
    render(<FormularioContacto {...base} onCambio={onCambio} />);
    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'Ana' },
    });
    expect(onCambio).toHaveBeenCalledWith('nombre', 'Ana');
  });

  it('llama a onEnviar al presionar el botón', () => {
    const onEnviar = vi.fn((evento) => evento.preventDefault());
    render(<FormularioContacto {...base} onEnviar={onEnviar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
  });

  it('muestra el mensaje de éxito cuando se recibe', () => {
    render(<FormularioContacto {...base} mensaje="Consulta registrada" />);
    expect(screen.getByText('Consulta registrada')).toBeInTheDocument();
  });
});