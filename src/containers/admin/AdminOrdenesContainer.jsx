// Container del listado de órdenes: lee pedidos y usuarios via API y arma
// las filas (fecha, cliente, estado, total). Solo renderiza ListadoOrdenesAdmin.
import ListadoOrdenesAdmin from '@/components/organisms/admin/ListadoOrdenesAdmin.jsx';
import { useOrdenes } from '@/hooks/useOrdenes.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import { nombreCliente, ordenarPedidos } from '@/utils/boleta.js';
import { fechaPedido } from '@/utils/cuenta.js';
import { estadoPedido } from '@/utils/estadoPedido.js';

function AdminOrdenesContainer() {
  const { ordenes: pedidos } = useOrdenes();
  const { usuarios } = useUsuarios();

  const ordenes = ordenarPedidos(pedidos).map((pedido) => ({
    id: pedido.id,
    fecha: fechaPedido(pedido),
    cliente: nombreCliente(usuarios, pedido.runUsuario, pedido.customerEmail),
    entrega: pedido.delivery,
    estado: estadoPedido(pedido),
    total: Number(pedido.total) || 0,
  }));

  return <ListadoOrdenesAdmin ordenes={ordenes} />;
}

export default AdminOrdenesContainer;