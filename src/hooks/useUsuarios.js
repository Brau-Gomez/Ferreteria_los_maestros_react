// Hooks para usuarios con TanStack Query.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  obtenerPerfil, 
  listarUsuarios, 
  obtenerUsuario, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario,
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
