// API de usuarios y perfil
import apiClient from './apiClient.js';

export async function obtenerPerfil() {
  const { data } = await apiClient.get('/auth/me');
  return normalizarUsuario(data);
}


export async function listarUsuarios(params = {}) {
  const { data } = await apiClient.get('/users', { params });
  const page = data?.content ? data : null;
  if (!page) return Array.isArray(data) ? data.map(normalizarUsuario) : [];
  return page.content.map(normalizarUsuario);
}

// El backend identifica usuarios por id (UUID); el panel trabaja con el RUN.
async function buscarPorRun(run) {
  const usuario = (await listarUsuarios({ size: 100 })).find((item) => item.run === run);
  if (!usuario) {
    const error = new Error('Usuario no encontrado.');
    error.response = { status: 404, data: { mensaje: 'Usuario no encontrado.' } };
    throw error;
  }
  return usuario;
}

const ROL_POR_TIPO = { Administrador: 'ADMIN', Vendedor: 'VENDEDOR', Cliente: 'CLIENTE', Contratista: 'CONTRATISTA' };

function usuarioParaApi(usuario, anterior = {}) {
  const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim();
  const tipo = usuario.esContratista && usuario.tipoUsuario === 'Cliente' ? 'Contratista' : usuario.tipoUsuario;
  return {
    email: usuario.correo,
    nombreCompleto,
    rut: usuario.run,
    telefono: usuario.telefono ?? anterior.telefono ?? null,
    rol: ROL_POR_TIPO[tipo] || anterior.rol || 'CLIENTE',
  };
}

export async function obtenerUsuario(run) {
  return buscarPorRun(run);
}

export async function crearUsuario(usuario) {
  const { data } = await apiClient.post('/users', usuarioParaApi(usuario));
  return normalizarUsuario(data);
}

export async function actualizarUsuario(run, usuario) {
  const anterior = await buscarPorRun(run);
  const { data } = await apiClient.put(`/users/${anterior.id}`, usuarioParaApi(usuario, anterior));
  return normalizarUsuario(data);
}

export async function eliminarUsuario(run) {
  const anterior = await buscarPorRun(run);
  await apiClient.delete(`/users/${anterior.id}`);
}


// Cuenta corriente del usuario autenticado (contratista).
export async function obtenerMiCuentaCorriente() {
  const { data } = await apiClient.get('/cuentas-corrientes/me');
  return data;
}


// Sin roles (datos ya normalizados) se conserva el tipo que venga.
function tipoSegunRoles(roles, tipoActual) {
  if (roles.includes('ADMIN')) return 'Administrador';
  if (roles.includes('VENDEDOR')) return 'Vendedor';
  if (roles.length) return 'Cliente';
  return tipoActual || 'Cliente';
}

export function normalizarUsuario(usuario) {
  if (!usuario) return usuario;
  // auth-service envía "roles" (lista); user-service envía "rol" (texto).
  const roles = usuario.roles || (usuario.rol ? [usuario.rol] : []);
  // El backend devuelve nombreCompleto y estado; el panel trabaja con nombre/apellidos/activo.
  const [nombre = '', ...apellidos] = String(
    usuario.nombreCompleto ?? usuario.fullName ?? usuario.nombre ?? '',
  ).split(' ');
  return {
    ...usuario,
    correo: usuario.email ?? usuario.correo,
    run: usuario.run ?? usuario.rut,
    nombre: usuario.nombre ?? nombre,
    apellidos: usuario.apellidos ?? apellidos.join(' '),
    activo: usuario.activo ?? (usuario.estado ? usuario.estado === 'ACTIVO' : true),
    // El contratista compra como cliente, pero además tiene cuenta corriente.
    esContratista: usuario.esContratista ?? roles.includes('CONTRATISTA'),
    tipoUsuario: tipoSegunRoles(roles, usuario.tipoUsuario),
  };
}