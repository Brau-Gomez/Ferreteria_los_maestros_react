import { render, screen, fireEvent } from '@testing-library/react';
import ContactoContainer from '@/containers/contacto/ContactoContainer.jsx';

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }));
}

describe('ContactoContainer', () => {
  it('no muestra errores antes del primer intento de envío', () => {
    render(<ContactoContainer />);
    escribir('Correo electrónico', 'hola@yahoo.com');
    expect(screen.queryByText(/Usa un correo/)).not.toBeInTheDocument();
  });

  it('muestra los errores si se envía el formulario vacío', () => {
    render(<ContactoContainer />);
    enviar();
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El comentario es obligatorio.')).toBeInTheDocument();
  });

  it('rechaza un correo con dominio no permitido', () => {
    render(<ContactoContainer />);
    escribir('Correo electrónico', 'hola@yahoo.com');
    enviar();
    expect(
      screen.getByText('Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'),
    ).toBeInTheDocument();
  });

  it('muestra el mensaje de éxito y limpia el formulario con datos válidos', () => {
    render(<ContactoContainer />);
    escribir('Nombre completo', 'Ana Pérez');
    escribir('Correo electrónico', 'ana@duoc.cl');
    escribir('Comentario', 'Quiero cotizar cemento.');
    enviar();
    expect(screen.getByText(/Consulta registrada/)).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
  });
});