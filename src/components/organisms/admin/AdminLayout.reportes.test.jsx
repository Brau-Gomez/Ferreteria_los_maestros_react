// Mock de la API de autenticación - DEBE IR AL PRINCIPIO
import { mockAuthApi } from '@/__mocks__/api.js';
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

vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminLayout from '@/components/organisms/admin/AdminLayout.jsx';

const admin = { run: '12345678-5', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '22222222-2', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function mostrar(sesion, ruta) {
  sessionStorageMock.clear();
  localStorageMock.clear();
  mockAuthApi.me.mockReset();
  
  sessionStorageMock.setItem('accessToken', 'token');
  mockAuthApi.me.mockResolvedValue(sesion);
  
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="reportes" element={<p>Contenido reportes</p>} />
              <Route path="perfil" element={<p>Contenido perfil</p>} />
              <Route path="productos" element={<p>Contenido productos</p>} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout: Reportes y Mi perfil', () => {
  beforeEach(() => {
    mockAuthApi.me.mockReset();
  });

  it('el administrador ve Reportes y Mi perfil', async () => {
    mostrar(admin, '/admin/reportes');
    await waitFor(() => {
      expect(screen.getByText('Contenido reportes')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Reportes' })).toHaveAttribute('href', '/admin/reportes');
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toBeInTheDocument();
  });

  it('el vendedor no accede a reportes', async () => {
    mostrar(vendedor, '/admin/reportes');
    await waitFor(() => {
      expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    });
    expect(screen.queryByRole('link', { name: 'Reportes' })).not.toBeInTheDocument();
  });

  it('el vendedor sí accede a su perfil', async () => {
    mostrar(vendedor, '/admin/perfil');
    await waitFor(() => {
      expect(screen.getByText('Contenido perfil')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Mi perfil' })).toBeInTheDocument();
  });
});