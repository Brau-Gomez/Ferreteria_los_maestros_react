// Mock de la API de autenticación - DEBE IR AL PRINCIPIO
import { mockAuthApi } from '@/__mocks__/api.js';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.jsx';
import AdminPerfilContainer from '@/containers/admin/AdminPerfilContainer.jsx';

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

const vendedor = { run: '22222222-2', nombre: 'Vera', apellidos: 'Vende', correo: 'vera@duoc.cl', tipoUsuario: 'Vendedor', activo: true };

vi.stubGlobal('sessionStorage', sessionStorageMock);
vi.stubGlobal('localStorage', localStorageMock);


describe('AdminPerfilContainer', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    localStorageMock.clear();
    mockAuthApi.me.mockReset();
    sessionStorageMock.setItem('accessToken', 'token');
    mockAuthApi.me.mockResolvedValue(vendedor);
  });

  it('muestra el perfil de la sesión activa', async () => {
    render(<MemoryRouter><AuthProvider><AdminPerfilContainer /></AuthProvider></MemoryRouter>);
    expect(await screen.findByRole('heading', { name: 'Vera Vende' })).toBeInTheDocument();
    expect(screen.getByText('vera@duoc.cl')).toBeInTheDocument();
  });
});