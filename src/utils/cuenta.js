// Cálculos puros de Mi cuenta, portados desde js/tienda/cuenta.js.

export function fechaDesdeMarca(marca) {
  const numero = Number(marca);
  if (!Number.isFinite(numero) || numero <= 0) return 'Sin fecha';
  return new Date(numero).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function marcaPedido(id) {
  const marca = Number(String(id || '').split('-').at(-1));
  return Number.isFinite(marca) && marca > 0 ? marca : 0;
}

export function pedidosDeUsuario(pedidos, run) {
  return pedidos.filter((pedido) => pedido.runUsuario === run);
}

// Convierte compras y abonos en movimientos cronológicos para acumular saldo.
export function movimientosCuenta(pedidos, abonos, runUsuario) {
  const cargos = pedidos.map((pedido) => ({
    marca: marcaPedido(pedido.id),
    documento: pedido.id,
    glosa: 'Compra en tienda',
    cargo: Number(pedido.total) || 0,
    abono: 0,
  }));
  const pagos = abonos
    .filter((abono) => abono.runUsuario === runUsuario)
    .map((abono) => ({
      marca: Number(abono.fecha) || 0,
      documento: abono.id || 'ABONO',
      glosa: abono.glosa || 'Pago recibido',
      cargo: 0,
      abono: Number(abono.monto) || 0,
    }));

  return [...cargos, ...pagos].sort((a, b) => a.marca - b.marca);
}

export function resumenCuenta(movimientos, hoy = new Date()) {
  let saldo = 0;
  let cargosDelMes = 0;
  const filas = movimientos.map((movimiento) => {
    saldo += movimiento.cargo - movimiento.abono;
    const fecha = new Date(movimiento.marca);
    if (
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    ) {
      cargosDelMes += movimiento.cargo;
    }
    return { ...movimiento, saldo };
  });
  const vencimiento = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  return {
    filas,
    saldo,
    cargosDelMes,
    vencimiento: vencimiento.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
  };
}
