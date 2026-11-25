// Container de la boleta: busca la orden por id (de la URL) via API, su cliente y
// calcula el desglose de IVA. Solo renderiza BoletaAdmin.
import { useParams } from 'react-router-dom';
import BoletaAdmin from '@/components/organisms/admin/BoletaAdmin.jsx';
import { useOrden } from '@/hooks/useOrdenes.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import { desgloseIva, nombreCliente } from '@/utils/boleta.js';
import { fechaPedido } from '@/utils/cuenta.js';
import { estadoPedido } from '@/utils/estadoPedido.js';

function AdminOrdenDetalleContainer() {
  const { id } = useParams();
  const { orden: pedido, isLoading } = useOrden(id);
  const { usuarios } = useUsuarios();

  if (isLoading || !pedido) {
    return null;
  }

  const boleta = {
    pedido,
    cliente: nombreCliente(usuarios, pedido.runUsuario, pedido.customerEmail),
    fecha: fechaPedido(pedido),
    estado: estadoPedido(pedido),
    desglose: desgloseIva(pedido.total),
  };

  return <BoletaAdmin boleta={boleta} onImprimir={() => window.print()} />;
}

export default AdminOrdenDetalleContainer;