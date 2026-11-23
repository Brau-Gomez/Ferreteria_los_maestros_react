// Container de Mi cuenta: lee la sesión, los pedidos y los abonos via API
// y calcula el historial y los movimientos de la cuenta corriente.
import { useSesion } from '@/hooks/useSesion.js';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import VistaCuenta from '@/components/organisms/cuenta/VistaCuenta.jsx';
import { movimientosCuenta } from '@/utils/cuenta.js';

function CuentaContainer() {
  const { usuario } = useSesion();
  const { ordenes: pedidos } = useOrdenes();
  const { usuarios } = useUsuarios();

  if (!usuario) return null;

  // GET /orders ya devuelve solo los pedidos del usuario autenticado (cliente o contratista).
  // El perfil de /auth/me no trae run, así que filtrar aquí por run deja el historial vacío.
  const abonos = usuarios.flatMap(u => u.abonos || []).filter(a => a.userRun === usuario.run);

  const movimientos = usuario.esContratista
    ? movimientosCuenta(pedidos, abonos, usuario.run)
    : [];

  return (
    <VistaCuenta
      usuario={usuario}
      pedidos={pedidos}
      movimientos={movimientos}
    />
  );
}

export default CuentaContainer;