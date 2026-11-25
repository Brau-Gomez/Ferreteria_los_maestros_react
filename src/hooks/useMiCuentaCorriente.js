// Cuenta corriente del usuario autenticado (solo contratistas).
import { useQuery } from '@tanstack/react-query';
import { obtenerMiCuentaCorriente } from '../api/usuariosApi.js';

export function useMiCuentaCorriente(habilitado) {
  const { data: cuenta, isLoading, error } = useQuery({
    queryKey: ['miCuentaCorriente'],
    queryFn: () => obtenerMiCuentaCorriente(),
    enabled: Boolean(habilitado),
    staleTime: 2 * 60 * 1000,
  });

  return { cuenta, isLoading, error };
}