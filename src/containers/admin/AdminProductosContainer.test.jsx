// Mock de la API de autenticación y productos - DEBE IR AL PRINCIPIO
import { mockAuthApi, mockProductosApi } from '@/__mocks__/api.js';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminProductosContainer from '@/containers/admin/AdminProductosContainer.jsx';

vi.mock('@/api/authApi.js', () => mockAuthApi);
vi.mock('@/api/productosApi.js', () => mockProductosApi);

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

const catalogo = [
  { codigo: 'MC001', nombre: 'Cemento gris', categoria: 'Mat. Construcción', precioVenta: 5990, stock: 80, stockMinimo: 20 },
  { codigo: 'HE001', nombre: 'Taladro', categoria: 'Herramientas', precioVenta: 39990, stock: 1, stockMinimo: 2 },
];
const admin = { run: '12345678-5', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true };
const vendedor = { run: '22222222-2', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});


vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);


function renderWithProviders({ sesion, propiedades }) {
  sessionStorageMock.clear();
  localStorageMock.clear();
  mockAuthApi.me.mockReset();
  mockProductosApi.listarProductos.mockReset();
  
  sessionStorageMock.setItem('accessToken', 'token');
  mockAuthApi.me.mockResolvedValue(sesion);
  mockProductosApi.listarProductos.mockResolvedValue(catalogo);
  
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProductosContainer {...propiedades} />
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminProductosContainer', () => {
  it('lista todo el catálogo para el administrador', async () => {
    renderWithProviders({ sesion: admin, propiedades: {} });
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Productos' })).toBeInTheDocument();
    });
    expect(screen.getByText('Cemento gris')).toBeInTheDocument();
    expect(screen.getByText('Taladro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuevo producto' })).toBeInTheDocument();
  });

  it('el vendedor no ve acciones de edición', async () => {
    renderWithProviders({ sesion: vendedor, propiedades: {} });
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument();
  });

  it('con soloCriticos muestra únicamente los productos con stock crítico', async () => {
    renderWithProviders({ sesion: admin, propiedades: { soloCriticos: true } });
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Productos críticos' })).toBeInTheDocument();
    });
    expect(screen.getByText('Taladro')).toBeInTheDocument();
    expect(screen.queryByText('Cemento gris')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument();
  });
});