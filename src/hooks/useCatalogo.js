// Hooks para datos geográficos (regiones, comunas, cobertura) con TanStack Query.
import { useQuery } from '@tanstack/react-query';
import { listarRegiones, listarComunas, obtenerCobertura } from '../api/catalogoApi.js';

export function useRegiones() {
  const { data: regiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['regiones'],
    queryFn: listarRegiones,
    staleTime: 30 * 60 * 1000, // 30 minutos, cambian rara vez
  });

  return { regiones, isLoading, error, refetch };
}

export function useComunas(regionId) {
  const { data: comunas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['comunas', regionId],
    queryFn: () => listarComunas(regionId),
    enabled: !!regionId,
    staleTime: 30 * 60 * 1000,
  });

  return { comunas, isLoading, error, refetch };
}

export function useCobertura() {
  const { data: cobertura = [], isLoading, error, refetch } = useQuery({
    queryKey: ['cobertura'],
    queryFn: obtenerCobertura,
    staleTime: 30 * 60 * 1000,
  });

  return { cobertura, isLoading, error, refetch };
}