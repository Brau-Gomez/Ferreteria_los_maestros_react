// Container de Mi cuenta: lee la sesión, los pedidos y (si es contratista) su
// cuenta corriente via API, y calcula los movimientos de la cuenta.
import { useSesion } from '@/hooks/useSesion.js';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { useMiCuentaCorriente } from '@/hooks/useMiCuentaCorriente.js';
import VistaCuenta from '@/components/organisms/cuenta/VistaCuenta.jsx';
import { movimientosCuenta } from '@/utils/cuenta.js';

function CuentaContainer() {
  const { usuario } = useSesion();
  // GET /orders ya devuelve solo los pedidos del usuario autenticado (cliente o contratista).
  const { ordenes: pedidos } = useOrdenes();
  const { cuenta } = useMiCuentaCorriente(usuario?.esContratista);

  if (!usuario) return null;

  // Cada compra del contratista es un cargo en su cuenta corriente.
  const movimientos = usuario.esContratista
    ? movimientosCuenta(pedidos, [], usuario.run)
    : [];

  return (
    <VistaCuenta
      usuario={usuario}
      pedidos={pedidos}
      movimientos={movimientos}
      cuenta={cuenta}
    />
  );
}

export default CuentaContainer;