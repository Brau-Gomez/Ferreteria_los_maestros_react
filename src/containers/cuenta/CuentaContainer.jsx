// Container de Mi cuenta: lee la sesión, los pedidos y los abonos guardados
// y calcula el historial y los movimientos de la cuenta corriente.
import { useState } from 'react';
import VistaCuenta from '@/components/organisms/cuenta/VistaCuenta.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { clavesDatos, leerListaGuardada } from '@/services/almacenamiento.js';
import { movimientosCuenta, pedidosDeUsuario } from '@/utils/cuenta.js';

function CuentaContainer() {
  const { usuario } = useSesion();
  // Lectura inicial desde los servicios de persistencia; los datos no se
  // duplican en localStorage dentro del componente.
  const [pedidos] = useState(() => leerListaGuardada(clavesDatos.pedidos) || []);
  const [abonos] = useState(() => leerListaGuardada(clavesDatos.abonos) || []);

  if (!usuario) return null; // ProtectedRoute redirige antes de mostrar esta página.

  const esCliente = usuario.tipoUsuario === 'Cliente';
  const pedidosUsuario = esCliente ? pedidosDeUsuario(pedidos, usuario.run) : [];
  const movimientos = usuario.esContratista
    ? movimientosCuenta(pedidosUsuario, abonos, usuario.run)
    : [];

  return (
    <VistaCuenta
      usuario={usuario}
      pedidos={pedidosUsuario}
      movimientos={movimientos}
    />
  );
}

export default CuentaContainer;