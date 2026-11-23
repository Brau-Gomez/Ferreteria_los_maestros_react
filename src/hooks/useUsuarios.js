// Hooks para usuarios con TanStack Query.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  obtenerPerfil, 
  actualizarPerfil, 
  listarUsuarios, 
  obtenerUsuario, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
  obtenerCuentaCorriente,
  crearAbono
} from '../api/usuariosApi.js';

export function useUsuarios(params = {}) {
  const { data: usuarios = [], isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => listarUsuarios(params),
    staleTime: 2 * 60 * 1000,
  });

  return { usuarios, isLoading, error, refetch };
}

export function useUsuario(run) {
  const { data: usuario, isLoading, error, refetch } = useQuery({
    queryKey: ['usuario', run],
    queryFn: () => obtenerUsuario(run),
    enabled: !!run,
    staleTime: 2 * 60 * 1000,
  });

  return { usuario, isLoading, error, refetch };
}

export function usePerfil() {
  const { data: perfil, isLoading, error, refetch } = useQuery({
    queryKey: ['perfil'],
    queryFn: obtenerPerfil,
    staleTime: 5 * 60 * 1000,
  });

  return { perfil, isLoading, error, refetch };
}

export function useActualizarPerfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: actualizarPerfil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useActualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ run, usuario }) => actualizarUsuario(run, usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
    },
  });
}

export function useEliminarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useCuentaCorriente(run) {
  const { data: cuenta, isLoading, error, refetch } = useQuery({
    queryKey: ['cuentaCorriente', run],
    queryFn: () => obtenerCuentaCorriente(run),
    enabled: !!run,
    staleTime: 2 * 60 * 1000,
  });

  return { cuenta, isLoading, error, refetch };
}

export function useCrearAbono() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ run, abono }) => crearAbono(run, abono),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuentaCorriente'] });
    },
  });
}