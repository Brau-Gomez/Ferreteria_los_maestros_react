// Hooks para órdenes con TanStack Query.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crearOrden, listarOrdenes, obtenerOrden, actualizarEstadoOrden } from '../api/ordenesApi.js';

export function useCrearOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orden, idempotencyKey }) => crearOrden(orden, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
      queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
}

export function useOrdenes(params = {}) {
  const { data: ordenes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['ordenes', params],
    queryFn: () => listarOrdenes(params),
    staleTime: 2 * 60 * 1000,
  });

  return { ordenes, isLoading, error, refetch };
}

export function useOrden(id) {
  const { data: orden, isLoading, error, refetch } = useQuery({
    queryKey: ['orden', id],
    queryFn: () => obtenerOrden(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

  return { orden, isLoading, error, refetch };
}

export function useActualizarEstadoOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }) => actualizarEstadoOrden(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
    },
  });
}