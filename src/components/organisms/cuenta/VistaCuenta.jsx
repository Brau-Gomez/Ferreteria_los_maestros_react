// Vista completa de Mi cuenta: encabezado y tarjetas según el tipo de usuario.
// Presentacional: recibe los datos ya calculados por el container.
import Container from 'react-bootstrap/Container';
import TarjetaPerfil from '@/components/molecules/TarjetaPerfil.jsx';
import AccesoPanel from '@/components/organisms/admin/AccesoPanel.jsx';
import CuentaCorriente from '@/components/organisms/cuenta/CuentaCorriente.jsx';
import DatosEmpresa from '@/components/organisms/tienda/DatosEmpresa.jsx';
import DireccionDespacho from '@/components/organisms/checkout/DireccionDespacho.jsx';
import HistorialPedidos from '@/components/organisms/cuenta/HistorialPedidos.jsx';

function VistaCuenta({ usuario, pedidos, movimientos }) {
  const esCliente = usuario.tipoUsuario === 'Cliente';

  return (
    <Container className="py-5">
      <header className="mb-4">
        <p className="eyebrow mb-2">Perfil y pedidos</p>
        <h1 className="titulo-seccion">Mi cuenta</h1>
      </header>
      <div className="cuenta-grid">
        <TarjetaPerfil usuario={usuario} />
        {esCliente && <DireccionDespacho usuario={usuario} />}
        {usuario.esContratista && usuario.empresa && (
          <DatosEmpresa empresa={usuario.empresa} />
        )}
        {esCliente
          ? <HistorialPedidos pedidos={pedidos} />
          : <AccesoPanel tipoUsuario={usuario.tipoUsuario} />}
        {esCliente && usuario.esContratista && (
          <CuentaCorriente movimientos={movimientos} />
        )}
      </div>
    </Container>
  );
}

export default VistaCuenta;