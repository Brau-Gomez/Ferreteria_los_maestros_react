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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminLayout from '@/components/organisms/admin/AdminLayout.jsx';

const admin = { run: '12345678-5', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '22222222-2', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };
const cliente = { run: '33333333-3', nombre: 'Ana', apellidos: 'Cliente', correo: 'ana@gmail.com', tipoUsuario: 'Cliente', activo: true };

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function renderAdmin({ user, ruta = '/admin' }) {
  sessionStorageMock.clear();
  localStorageMock.clear();
  mockAuthApi.me.mockReset();
  
  if (user) {
    sessionStorageMock.setItem('accessToken', 'token');
    mockAuthApi.me.mockResolvedValue(user);
  }
  
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/ingreso" element={<p>Pantalla de ingreso</p>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<p>Contenido resumen</p>} />
              <Route path="productos" element={<p>Contenido productos</p>} />
              <Route path="productos/nuevo" element={<p>Contenido nuevo</p>} />
              <Route path="usuarios" element={<p>Contenido usuarios</p>} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout', () => {
  beforeEach(() => {
    mockAuthApi.me.mockReset();
  });

  it('sin sesión redirige al ingreso', () => {
    renderAdmin({});
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
  });

  it('un cliente ve el aviso de acceso restringido', async () => {
    renderAdmin({ user: cliente });
    await waitFor(() => {
      expect(screen.getByText('Acceso restringido')).toBeInTheDocument();
    });
  });

  it('el administrador ve todo el menú y el contenido', async () => {
    renderAdmin({ user: admin });
    await waitFor(() => {
      expect(screen.getByText('Contenido resumen')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Usuarios' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Stock crítico' })).toBeInTheDocument();
  });

  it('el vendedor entrando a /admin va al listado de productos y no ve Usuarios', async () => {
    renderAdmin({ user: vendedor });
    await waitFor(() => {
      expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    });
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Stock crítico' })).not.toBeInTheDocument();
  });

  it('el vendedor no puede abrir rutas de edición', async () => {
    renderAdmin({ user: vendedor, ruta: '/admin/productos/nuevo' });
    await waitFor(() => {
      expect(screen.getByText('Contenido productos')).toBeInTheDocument();
    });
  });

  it('cerrar sesión lleva a la pantalla de ingreso', async () => {
    renderAdmin({ user: admin });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByText('Pantalla de ingreso')).toBeInTheDocument();
  });
});