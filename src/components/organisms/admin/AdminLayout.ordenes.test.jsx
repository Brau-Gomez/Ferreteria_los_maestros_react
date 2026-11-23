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

function mostrar(sesion, ruta = '/admin/ordenes') {
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
              <Route path="ordenes" element={<p>Contenido órdenes</p>} />
              <Route path="ordenes/:id" element={<p>Contenido detalle orden</p>} />
              <Route path="productos" element={<p>Contenido productos</p>} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminLayout: Órdenes', () => {
  beforeEach(() => {
    mockAuthApi.me.mockReset();
  });

  it('el administrador ve el enlace y la página de órdenes', async () => {
    mostrar(admin);
    await waitFor(() => {
      expect(screen.getByText('Contenido órdenes')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Órdenes' })).toHaveAttribute('href', '/admin/ordenes');
  });

  it('el vendedor también ve el enlace y la lista de órdenes (RF-17)', async () => {
    mostrar(vendedor);
    await waitFor(() => {
      expect(screen.getByText('Contenido órdenes')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Órdenes' })).toHaveAttribute('href', '/admin/ordenes');
  });

  it('el vendedor puede abrir el detalle de una orden', async () => {
    mostrar(vendedor, '/admin/ordenes/PED-1700000000000');
    await waitFor(() => {
      expect(screen.getByText('Contenido detalle orden')).toBeInTheDocument();
    });
  });
});