// Mock de la API - DEBE IR AL PRINCIPIO
import { mockAuthApi, mockUsuariosApi, mockOrdenesApi } from '@/__mocks__/api.js';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import CuentaContainer from '@/containers/cuenta/CuentaContainer.jsx';

vi.mock('@/api/authApi.js', () => mockAuthApi);
vi.mock('@/api/usuariosApi.js', () => ({
  ...mockUsuariosApi,
  normalizarUsuario: (usuario) => usuario,
}));
vi.mock('@/api/ordenesApi.js', () => mockOrdenesApi);

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

const cliente = {
  run: '11111111-1', nombre: 'Ana', apellidos: 'Pérez', correo: 'cliente@gmail.com',
  tipoUsuario: 'Cliente', activo: true, direccion: 'Calle 123',
};
const contratista = {
  ...cliente,
  esContratista: true,
  empresa: { razonSocial: 'Constructora Sur', rut: '761234567', direccion: 'Av. Norte 45' },
};
const admin = {
  run: '22222222-2', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl',
  tipoUsuario: 'Administrador', activo: true,
};
const pedido = {
  id: 'PED-1700000000000', runUsuario: '11111111-1', delivery: 'Despacho', total: 11980,
  productos: [{ codigo: 'MC001', nombre: 'Cemento gris 25 kg', cantidad: 2, precioVenta: 5990 }],
};

vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);



function mostrar({ usuarios, sesion, pedidos = [] }) {
  sessionStorageMock.clear();
  localStorageMock.clear();
  mockAuthApi.me.mockReset();
  mockUsuariosApi.listarUsuarios.mockReset();
  mockOrdenesApi.listarOrdenes.mockReset();
  
  if (sesion) {
    sessionStorageMock.setItem('accessToken', 'token');
    mockAuthApi.me.mockResolvedValue(usuarios.find(u => u.run === sesion));
  }
  mockUsuariosApi.listarUsuarios.mockResolvedValue(usuarios);
  mockOrdenesApi.listarOrdenes.mockResolvedValue(pedidos);
  
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CuentaContainer />
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('CuentaContainer', () => {
  it('no muestra nada si no hay sesión', () => {
    mostrar({ usuarios: [cliente] });
    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument();
  });

  it('muestra el historial de pedidos del cliente con sesión', async () => {
    mostrar({ usuarios: [cliente], sesion: cliente.run, pedidos: [pedido] });
    expect(await screen.findByText('Historial de pedidos')).toBeInTheDocument();
    expect(screen.getByText('PED-1700000000000')).toBeInTheDocument();
  });

  it('muestra el historial de pedidos también al contratista', async () => {
    mostrar({ usuarios: [contratista], sesion: cliente.run, pedidos: [pedido] });
    expect(await screen.findByText('Historial de pedidos')).toBeInTheDocument();
    expect(screen.getByText('Cemento gris 25 kg')).toBeInTheDocument();
  });

  it('muestra al contratista su cuenta corriente con la compra como cargo', async () => {
    mostrar({ usuarios: [contratista], sesion: cliente.run, pedidos: [pedido] });
    expect(await screen.findByText('Cuenta corriente')).toBeInTheDocument();
    expect(screen.getByText('Con saldo pendiente')).toBeInTheDocument();
    expect(screen.getByText('Compra en tienda')).toBeInTheDocument();
  });

  it('muestra al administrador el acceso al panel', async () => {
    mostrar({ usuarios: [admin], sesion: admin.run });
    expect(await screen.findByText('Acceso de administrador')).toBeInTheDocument();
  });
});