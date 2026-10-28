// Container del detalle de usuario del admin: busca el perfil por RUN,
// arma su historial de compras y maneja la eliminación protegida.
// Solo renderiza DetalleUsuarioAdmin.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetalleUsuarioAdmin from '@/components/organisms/admin/DetalleUsuarioAdmin.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { clavesDatos, eliminarRegistro, leerListaGuardada, obtenerUsuarios } from '@/services/almacenamiento.js';
import { ordenarPedidos } from '@/utils/boleta.js';
import { fechaDesdeMarca, marcaPedido, pedidosDeUsuario } from '@/utils/cuenta.js';

function AdminUsuarioDetalleContainer() {
  const { run } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion } = useSesion();
  const [error, setError] = useState('');
  const runBuscado = (run || '').replace(/[.\-\s]/g, '').toUpperCase();
  const [usuarios] = useState(() => obtenerUsuarios());
  const [pedidos] = useState(() => leerListaGuardada(clavesDatos.pedidos) || []);
  const usuario = usuarios.find((item) => item.run === runBuscado);

  const compras = usuario
    ? ordenarPedidos(pedidosDeUsuario(pedidos, usuario.run)).map((pedido) => ({
        id: pedido.id,
        fecha: fechaDesdeMarca(marcaPedido(pedido.id)),
        entrega: pedido.delivery,
        total: Number(pedido.total) || 0,
      }))
    : [];
  const totalComprado = compras.reduce((suma, compra) => suma + compra.total, 0);

  function eliminar() {
    if (usuario.run === sesion.run) {
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
    const lista = leerListaGuardada(clavesDatos.usuarios) || obtenerUsuarios();
    if (!eliminarRegistro(clavesDatos.usuarios, lista, 'run', usuario.run)) {
      setError('No fue posible eliminar el usuario. Puedes reintentarlo.');
      return;
    }
    navigate('/admin/usuarios');
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