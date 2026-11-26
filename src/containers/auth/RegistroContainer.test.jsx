import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegistroContainer from '@/containers/auth/RegistroContainer.jsx';

function mostrar() {
  return render(
    <MemoryRouter>
      <RegistroContainer />
    </MemoryRouter>,
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function completarCliente() {
  escribir('Nombre *', 'Ana');
  escribir('Apellidos *', 'Pérez Soto');
  escribir('RUN *', '123456785');
  escribir('Comuna *', 'La Serena');
  escribir('Dirección *', 'Calle 123');
  escribir('Correo *', 'ana@gmail.com');
  escribir('Contraseña *', 'abcd1234');
  escribir('Confirmar contraseña *', 'abcd1234');
}

describe('RegistroContainer', () => {
  beforeEach(() => {
    localStorage.setItem('ep1-users', JSON.stringify([]));
  });

  it('valida el RUN mientras se escribe', () => {
    mostrar();
    escribir('RUN *', '123');
    expect(screen.getByText('Ingresa un RUN válido, entre 7 y 9 caracteres.')).toBeInTheDocument();
  });

  it('avisa si las contraseñas no coinciden', () => {
    mostrar();
    escribir('Contraseña *', 'abcd1234');
    escribir('Confirmar contraseña *', 'otra');
    expect(screen.getByText('Las contraseñas deben coincidir.')).toBeInTheDocument();
  });

  it('muestra los datos de empresa solo para contratistas', () => {
    mostrar();
    expect(screen.queryByText('Datos de la empresa')).not.toBeInTheDocument();
    escribir('¿Cómo vas a comprar? *', 'Contratista');
    expect(screen.getByText('Datos de la empresa')).toBeInTheDocument();
  });

  it('no guarda la cuenta si el formulario tiene errores', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(JSON.parse(localStorage.getItem('ep1-users'))).toHaveLength(0);
  });

  it('rechaza una contraseña de menos de 8 caracteres (regla de auth-service)', () => {
    mostrar();
    escribir('Contraseña *', 'abcd123');
    expect(screen.getByText('La contraseña debe tener entre 8 y 10 caracteres.')).toBeInTheDocument();
  });

  it('crea la cuenta en el backend y limpia el formulario', async () => {
    mostrar();
    await screen.findByRole('option', { name: 'La Serena' });
    completarCliente();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(await screen.findByText(/Cuenta creada/)).toBeInTheDocument();
    const usuarios = JSON.parse(localStorage.getItem('ep1-users'));
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].correo).toBe('ana@gmail.com');
    // La contraseña la guarda (hasheada) el backend; nunca queda en el navegador.
    expect(usuarios[0].clave).toBeUndefined();
    expect(screen.getByLabelText('Nombre *')).toHaveValue('');
  });
});