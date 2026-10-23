import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider.jsx';
import IngresoContainer from './IngresoContainer.jsx';

const usuarios = [
  { run: '11111111-1', nombre: 'Ana', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true },
  { run: '22222222-2', nombre: 'Admin', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true },
];

function mostrar() {
  return render(
    <MemoryRouter initialEntries={['/ingreso']}>
      <AuthProvider>
        <Routes>
          <Route path="/ingreso" element={<IngresoContainer />} />
          <Route path="/cuenta" element={<p>Página cuenta</p>} />
          <Route path="/admin" element={<p>Página admin</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function escribir(correo, clave) {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } });
}

describe('IngresoContainer', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ep1-users', JSON.stringify(usuarios));
  });

  it('valida el correo mientras se escribe', () => {
    mostrar();
    escribir('ana@hotmail.com', 'demo123');
    expect(screen.getByText(/Usa un correo @duoc.cl/)).toBeInTheDocument();
  });

  it('un botón demo completa correo y clave', () => {
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Administrador' }));
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('admin@duoc.cl');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('demo123');
  });

  it('muestra un aviso si las credenciales son incorrectas', async () => {
    mostrar();
    escribir('cliente@gmail.com', 'otraclave');
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  it('lleva al cliente a /cuenta y guarda la sesión', async () => {
    mostrar();
    escribir('cliente@gmail.com', 'demo123');
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Página cuenta')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ep1-user'))).toEqual({ run: '11111111-1' });
  });

  it('lleva al administrador a /admin', async () => {
    mostrar();
    escribir('admin@duoc.cl', 'demo123');
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Página admin')).toBeInTheDocument();
  });
});