// Mi cuenta porta perfil, pedidos y cuenta corriente desde tienda/cuenta.html.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import TarjetaPerfil from '../components/molecules/TarjetaPerfil.jsx';
import TarjetaPedido from '../components/molecules/TarjetaPedido.jsx';
import CuentaCorriente from '../components/organisms/CuentaCorriente.jsx';
import { clavesDatos, leerListaGuardada } from '../services/almacenamiento.js';
import { movimientosCuenta, pedidosDeUsuario } from '../utils/cuenta.js';
import { useSesion } from '../hooks/useSesion.js';

function Cuenta() {
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
    <Container className="py-5">
      <header className="mb-4">
        <p className="eyebrow mb-2">Perfil y pedidos</p>
        <h1 className="titulo-seccion">Mi cuenta</h1>
      </header>
      <div className="cuenta-grid">
        <TarjetaPerfil usuario={usuario} />

        {esCliente && (
          <Card className="tarjeta-cuenta h-100">
            <Card.Body>
              <h2 className="h5">Dirección de despacho</h2>
              {usuario.direccion ? (
                <dl className="perfil-datos mb-0">
                  <div className="perfil-fila"><dt>Dirección</dt><dd>{usuario.direccion}</dd></div>
                  {usuario.comuna && <div className="perfil-fila"><dt>Comuna</dt><dd>{usuario.comuna}</dd></div>}
                  {usuario.region && <div className="perfil-fila"><dt>Región</dt><dd>{usuario.region}</dd></div>}
                </dl>
              ) : (
                <p className="cuenta-descripcion mb-0">
                  Todavía no registras una dirección de despacho.
                </p>
              )}
            </Card.Body>
          </Card>
        )}

        {usuario.esContratista && usuario.empresa && (
          <Card className="tarjeta-cuenta h-100">
            <Card.Body>
              <h2 className="h5">Datos de la empresa</h2>
              <dl className="perfil-datos mb-0">
                <div className="perfil-fila"><dt>Razón social</dt><dd>{usuario.empresa.razonSocial}</dd></div>
                <div className="perfil-fila"><dt>RUT</dt><dd>{usuario.empresa.rut}</dd></div>
                <div className="perfil-fila"><dt>Dirección</dt><dd>{usuario.empresa.direccion}</dd></div>
              </dl>
            </Card.Body>
          </Card>
        )}

        {esCliente ? (
          <Card className="tarjeta-cuenta cuenta-ancha">
            <Card.Body>
              <h2 className="h5">Historial de pedidos</h2>
              {pedidosUsuario.length ? pedidosUsuario.map((pedido) => (
                <TarjetaPedido key={pedido.id} pedido={pedido} />
              )) : (
                <Alert variant="light" className="sin-resultados mb-0">
                  <h3 className="h5">Todavía no tienes pedidos confirmados</h3>
                  <p>Cuando confirmes una compra, aparecerá aquí con su detalle.</p>
                  <Button as={Link} to="/productos" variant="warning">Ir al catálogo</Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Card className="tarjeta-cuenta h-100">
            <Card.Body>
              <h2 className="h5">Acceso de {usuario.tipoUsuario.toLowerCase()}</h2>
              <p className="cuenta-descripcion">
                {usuario.tipoUsuario === 'Administrador'
                  ? 'Tienes acceso completo a la administración de productos y usuarios.'
                  : 'Puedes gestionar el catálogo de productos y revisar el stock.'}
              </p>
              <Button as={Link} to="/admin" variant="warning">
                Ir al panel de administración
              </Button>
            </Card.Body>
          </Card>
        )}

        {esCliente && usuario.esContratista && <CuentaCorriente movimientos={movimientos} />}
      </div>
    </Container>
  );
}

export default Cuenta;
