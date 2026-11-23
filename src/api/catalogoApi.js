// API de catálogo: regiones, comunas, cobertura
import apiClient from './apiClient.js';

export async function listarRegiones() {
  const { data } = await apiClient.get('/regions');
  const regiones = Array.isArray(data) ? data : data?.data || [];
  return regiones.map((region) => ({
    id: region.id,
    nombre: region.name ?? region.nombre,
  }));
}

export async function listarComunas(regionId) {
  const { data } = await apiClient.get(`/communes/region/${encodeURIComponent(regionId)}`);
  const comunas = Array.isArray(data) ? data : data?.data || [];
  return comunas.map((comuna) => ({
    id: comuna.id,
    nombre: comuna.name ?? comuna.nombre,
    regionId: comuna.regionId,
  }));
}

export async function obtenerCobertura() {
  const { data } = await apiClient.get('/coverage');
  return Array.isArray(data) ? data : data?.data || [];
}