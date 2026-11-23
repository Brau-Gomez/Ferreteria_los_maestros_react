// Utilidades de test compartidas para componentes con TanStack Query y Auth.
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import { CartProvider } from '@/context/CartProvider.jsx';

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

// QueryClient para tests
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrapper con todos los providers necesarios
export function createWrapper({ queryClient = createTestQueryClient(), initialEntries = ['/'] } = {}) {
  return ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

// Render con providers
export function renderWithProviders(ui, options = {}) {
  const { wrapper = createWrapper(), ...renderOptions } = options;
  return render(ui, { wrapper, ...renderOptions });
}

// Helper para esperar a que termine el loading
export async function waitForLoading() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

// Mock de usuario admin
export const mockAdmin = { 
  run: '12345678-5', 
  nombre: 'Admin', 
  apellidos: 'Duoc', 
  correo: 'admin@duoc.cl', 
  tipoUsuario: 'Administrador', 
  activo: true 
};

// Mock de usuario vendedor
export const mockVendedor = { 
  run: '22222222-2', 
  nombre: 'Vera', 
  apellidos: 'Vende', 
  correo: 'vera@duoc.cl', 
  tipoUsuario: 'Vendedor', 
  activo: true 
};

// Mock de usuario cliente
export const mockCliente = { 
  run: '33333333-3', 
  nombre: 'Ana', 
  apellidos: 'Cliente', 
  correo: 'ana@gmail.com', 
  tipoUsuario: 'Cliente', 
  activo: true 
};

// Reset de storage entre tests
export function resetStorage() {
  sessionStorageMock.clear();
  localStorageMock.clear();
}