// Container del detalle de usuario del admin: busca el perfil por RUN,
// arma su historial de compras y maneja la eliminación protegida via API.
// Solo renderiza DetalleUsuarioAdmin.
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetalleUsuarioAdmin from '@/components/organisms/admin/DetalleUsuarioAdmin.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { useEliminarUsuario } from '@/hooks/useUsuarios.js';
import { ordenarPedidos } from '@/utils/boleta.js';
import { fechaPedido, pedidosDeUsuario } from '@/utils/cuenta.js';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';

function AdminUsuarioDetalleContainer() {
  const { run } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion, isAuthenticated, loading: authLoading } = useSesion();
  
  // Usar hooks de API
  const { usuarios, isLoading: usuariosLoading, refetch: refetchUsuarios } = useUsuarios();
  const { ordenes, isLoading: ordenesLoading, refetch: refetchOrdenes } = useOrdenes();
  const eliminarUsuarioMutation = useEliminarUsuario();
  
  const [error, setError] = useState('');
  const runBuscado = (run || '').replace(/[.\-\s]/g, '').toUpperCase();
  const usuario = usuarios.find((item) => item.run === runBuscado);

  const loading = authLoading || usuariosLoading || ordenesLoading;

  const compras = usuario
    ? ordenarPedidos(pedidosDeUsuario(ordenes, usuario)).map((pedido) => ({
        id: pedido.id,
        fecha: fechaPedido(pedido),
        entrega: pedido.delivery,
        total: Number(pedido.total) || 0,
      }))
    : [];
  const totalComprado = compras.reduce((suma, compra) => suma + compra.total, 0);

  async function eliminar() {
    if (!usuario || !sesion) {
      setError('No se pudo verificar la sesión.');
      return;
    }
    // La sesión viene de auth-service (sin RUN): se compara por correo.
    const esLaSesion = (sesion.correo && usuario.correo === sesion.correo)
      || (sesion.run && usuario.run === sesion.run);
    if (esLaSesion) {
      setError('No puedes eliminar el perfil con el que tienes iniciada la sesión.');
      return;
    }
    if (
      usuario.tipoUsuario === 'Administrador' &&
      usuarios.filter((item) => item.tipoUsuario === 'Administrador').length <= 1
    ) {
      setError('Debe existir al menos un perfil Administrador.');
      return;
    }
    if (!window.confirm(`¿Eliminar el perfil de ${usuario.nombre} ${usuario.apellidos}?`)) return;
    
    try {
      setError('');
      await eliminarUsuarioMutation.mutateAsync(usuario.run);
      await Promise.all([refetchUsuarios(), refetchOrdenes()]);
      navigate('/admin/usuarios');
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.message || 'No fue posible eliminar el usuario.';
      setError(msg);
    }
  }

  if (loading) {
    return null;
  }

  if (!usuario) {
    return (
      <AvisoNoEncontradoAdmin
        titulo="Usuario no encontrado"
        texto="Vuelve al listado para seleccionar un perfil existente."
        ruta="/admin/usuarios"
        etiquetaRuta="Volver a usuarios"
      />
    );
  }

  return (
    <DetalleUsuarioAdmin
      usuario={usuario}
      error={error}
      compras={compras}
      totalComprado={totalComprado}
      onEliminar={eliminar}
    />
  );
}

export default AdminUsuarioDetalleContainer;