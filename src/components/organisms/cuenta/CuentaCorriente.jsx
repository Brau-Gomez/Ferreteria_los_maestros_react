import Card from 'react-bootstrap/Card';
import { formatearDinero } from '@/utils/dinero.js';
import { fechaDesdeMarca, resumenCuenta } from '@/utils/cuenta.js';

function CuentaCorriente({ movimientos }) {
  if (movimientos.length === 0) {
    return (
      <Card className="tarjeta-cuenta cuenta-ancha">
        <Card.Body>
          <h2 className="h5">Cuenta corriente</h2>
          <p className="cuenta-descripcion mb-0">
            Aún no registras movimientos en tu cuenta.
          </p>
        </Card.Body>
      </Card>
    );
  }

  const resumen = resumenCuenta(movimientos);
  const pendiente = resumen.saldo > 0;

  return (
    <Card className="tarjeta-cuenta cuenta-ancha">
      <Card.Body>
        <div className="cuenta-encabezado">
          <h2 className="h5">Cuenta corriente</h2>
          <span className={`cuenta-estado${pendiente ? ' cuenta-estado-pendiente' : ''}`}>
            {pendiente ? 'Con saldo pendiente' : 'Al día'}
          </span>
        </div>
        <p className="cuenta-descripcion">
          Las compras se cargan a tu cuenta y se pagan al cierre de cada mes.
        </p>
        <div className="resumen-grid mb-3">
          <div><b>{formatearDinero(resumen.saldo)}</b><small>Saldo pendiente</small></div>
          <div><b>{formatearDinero(resumen.cargosDelMes)}</b><small>Cargos del mes</small></div>
          <div><b>{resumen.vencimiento}</b><small>Vence el</small></div>
        </div>
        <div className="tabla-scroll">
          <table className="tabla-cuenta">
            <thead>
              <tr><th>Fecha</th><th>Documento</th><th>Detalle</th><th>Cargo</th><th>Abono</th><th>Saldo</th></tr>
            </thead>
            <tbody>
              {resumen.filas.map((fila, indice) => (
                <tr key={`${fila.documento}-${fila.marca}-${indice}`}>
                  <td>{fechaDesdeMarca(fila.marca)}</td>
                  <td>{fila.documento}</td>
                  <td>{fila.glosa}</td>
                  <td>{fila.cargo ? formatearDinero(fila.cargo) : '—'}</td>
                  <td>{fila.abono ? formatearDinero(fila.abono) : '—'}</td>
                  <td>{formatearDinero(fila.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CuentaCorriente;
