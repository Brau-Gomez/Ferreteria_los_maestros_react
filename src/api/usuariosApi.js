// API de usuarios y perfil
import apiClient from './apiClient.js';

export async function obtenerPerfil() {
  const { data } = await apiClient.get('/auth/me');
  return normalizarUsuario(data);
}

export async function actualizarPerfil(datos) {
  const { data } = await apiClient.patch('/users/me', datos);
  return normalizarUsuario(data);
}

export async function listarUsuarios(params = {}) {
  const { data } = await apiClient.get('/users', { params });
  const page = data?.content ? data : null;
  if (!page) return Array.isArray(data) ? data.map(normalizarUsuario) : [];
  return page.content.map(normalizarUsuario);
}

export async function obtenerUsuario(run) {
  const { data } = await apiClient.get(`/users/${encodeURIComponent(run)}`);
  return normalizarUsuario(data);
}

export async function crearUsuario(usuario) {
  const { data } = await apiClient.post('/users', usuario);
  return normalizarUsuario(data);
}

export async function actualizarUsuario(run, usuario) {
  const { data } = await apiClient.patch(`/users/${encodeURIComponent(run)}`, usuario);
  return normalizarUsuario(data);
}

export async function eliminarUsuario(run) {
  await apiClient.delete(`/users/${encodeURIComponent(run)}`);
}

export async function obtenerCuentaCorriente(run) {
  const { data } = await apiClient.get(`/users/${encodeURIComponent(run)}/current-account`);
  return data;
}

export async function crearAbono(run, abono) {
  const { data } = await apiClient.post(`/users/${encodeURIComponent(run)}/deposits`, abono);
  return data;
}

export function normalizarUsuario(usuario) {
  if (!usuario) return usuario;
  const roles = usuario.roles || [];
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
    tipoUsuario: roles.includes('ADMIN') || roles.includes('VENDEDOR')
      ? (roles.includes('ADMIN') ? 'Administrador' : 'Vendedor')
      : 'Cliente',
  };
}