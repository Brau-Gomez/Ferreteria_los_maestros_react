// Mock de la API de autenticación - DEBE IR AL PRINCIPIO
import { mockAuthApi } from '@/__mocks__/api.js';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import IngresoContainer from '@/containers/auth/IngresoContainer.jsx';

vi.mock('@/api/authApi.js', () => mockAuthApi);

// Mock de sessionStorage y localStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

const usuarios = [
  { run: '11111111-1', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true },
  { run: '22222222-2', nombre: 'Admin', apellidos: 'Demo', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true },
];

vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);


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
    sessionStorageMock.clear();
    localStorageMock.clear();
    mockAuthApi.login.mockReset();
    mockAuthApi.login.mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', usuario: usuarios[0] });
  });

  it('valida el correo mientras se escribe', () => {
    mostrar();
    escribir('ana@hotmail.com', 'demo123');
    expect(screen.getByText(/Usa un correo @duoc.cl/)).toBeInTheDocument();
  });

  it('un botón demo completa correo y clave', () => {
    // La clave demo se configura con VITE_DEMO_PASSWORD (ver .env.example).
    vi.stubEnv('VITE_DEMO_PASSWORD', 'demo123');
    mostrar();
    fireEvent.click(screen.getByRole('button', { name: 'Administrador' }));
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('admin@duoc.cl');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('demo123');
    vi.unstubAllEnvs();
  });

  it('muestra un aviso si las credenciales son incorrectas', async () => {
    mockAuthApi.login.mockRejectedValueOnce({ response: { data: { mensaje: 'Correo o contraseña incorrectos.' } } });
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
    expect(sessionStorageMock.getItem('accessToken')).toBe('token');
    expect(localStorageMock.getItem('refreshToken')).toBe('refresh');
  });

  it('lleva al administrador a /admin', async () => {
    mockAuthApi.login.mockResolvedValueOnce({ accessToken: 'token', refreshToken: 'refresh', usuario: usuarios[1] });
    mostrar();
    escribir('admin@duoc.cl', 'demo123');
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Página admin')).toBeInTheDocument();
  });
});