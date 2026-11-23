// Mock global de la API para tests
const mockUsuarios = [
  { run: '11111111-1', nombre: 'Ana', apellidos: 'Demo', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true },
  { run: '22222222-2', nombre: 'Admin', apellidos: 'Demo', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true },
  { run: '12345678-5', nombre: 'Administrador', apellidos: 'Demo Grupo 6', correo: 'admin@duoc.cl', tipoUsuario: 'Administrador', activo: true },
  { run: '11111111-1', nombre: 'Vendedor', apellidos: 'Demo Grupo 6', correo: 'vendedor@profesor.duoc.cl', tipoUsuario: 'Vendedor', activo: true },
  { run: '22222222-2', nombre: 'Cliente', apellidos: 'Demo Grupo 6', correo: 'cliente@gmail.com', tipoUsuario: 'Cliente', activo: true },
];

const mockProductos = [
  { codigo: 'MC001', nombre: 'Cemento', precioVenta: 5990, stock: 80, categoria: 'Mat. Construcción', imagen: '' },
];

let currentUser = null;

export const mockAuthApi = {
  login: vi.fn(async (correo, clave) => {
    const user = mockUsuarios.find(u => u.correo === correo && u.activo);
    if (!user) throw { response: { data: { mensaje: 'Correo o contraseña incorrectos.' } } };
    if (user.claveHuella && clave !== 'demo123') throw { response: { data: { mensaje: 'Correo o contraseña incorrectos.' } } };
    currentUser = user;
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', usuario: user };
  }),
  me: vi.fn(async () => {
    if (!currentUser) throw new Error('No session');
    return currentUser;
  }),
  logout: vi.fn(async () => {
    currentUser = null;
  }),
  register: vi.fn(),
};

export const mockProductosApi = {
  listarProductos: vi.fn(async () => mockProductos),
  obtenerProducto: vi.fn(async (codigo) => mockProductos.find(p => p.codigo === codigo)),
  crearProducto: vi.fn(),
  actualizarProducto: vi.fn(),
  eliminarProducto: vi.fn(),
  listarCategorias: vi.fn(async () => ['Electricidad', 'Gasfitería', 'Herramientas', 'Jardín', 'Madera', 'Mat. Construcción', 'Pinturas', 'Seguridad', 'Tornillería']),
  crearCategoria: vi.fn(),
  actualizarCategoria: vi.fn(),
  eliminarCategoria: vi.fn(),
  subirImagen: vi.fn(),
};

export const mockCarritoApi = {
  obtenerCarrito: vi.fn(async () => []),
  agregarAlCarrito: vi.fn(),
  actualizarCantidadCarrito: vi.fn(),
  quitarDelCarrito: vi.fn(),
  vaciarCarrito: vi.fn(),
};

export const mockOrdenesApi = {
  crearOrden: vi.fn(async (orden) => ({ id: 'PED-123', ...orden })),
  listarOrdenes: vi.fn(async () => []),
  obtenerOrden: vi.fn(),
  actualizarEstadoOrden: vi.fn(),
};

export const mockUsuariosApi = {
  obtenerPerfil: vi.fn(async () => currentUser),
  actualizarPerfil: vi.fn(),
  listarUsuarios: vi.fn(async () => mockUsuarios),
  obtenerUsuario: vi.fn(async (run) => mockUsuarios.find(u => u.run === run)),
  crearUsuario: vi.fn(),
  actualizarUsuario: vi.fn(),
  eliminarUsuario: vi.fn(),
  obtenerCuentaCorriente: vi.fn(),
  crearAbono: vi.fn(),
};

export const mockCatalogoApi = {
  listarRegiones: vi.fn(async () => [{ id: 1, nombre: 'Región de Coquimbo' }]),
  listarComunas: vi.fn(async () => [{ id: 1, nombre: 'La Serena', regionId: 1 }]),
  obtenerCobertura: vi.fn(async () => []),
};

export const mockPagosApi = {
  simularPago: vi.fn(async ({ numeroTarjeta }) => (
    numeroTarjeta.endsWith('0000')
      ? { aprobado: false, estado: 'RECHAZADO', mensaje: 'El banco rechazó la tarjeta.' }
      : { aprobado: true, estado: 'APROBADO', mensaje: 'Pago aprobado.', transactionId: 'PAY-DEMO-123' }
  )),
};

// Mock global para apiClient
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
};