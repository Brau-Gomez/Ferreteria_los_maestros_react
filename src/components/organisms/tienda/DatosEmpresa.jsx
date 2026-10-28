// Tarjeta "Datos de la empresa" de Mi cuenta (solo contratistas).
// Presentacional: recibe el objeto empresa del usuario.
import Card from 'react-bootstrap/Card';

function DatosEmpresa({ empresa }) {
  return (
    <Card className="tarjeta-cuenta h-100">
      <Card.Body>
        <h2 className="h5">Datos de la empresa</h2>
        <dl className="perfil-datos mb-0">
          <div className="perfil-fila"><dt>Razón social</dt><dd>{empresa.razonSocial}</dd></div>
          <div className="perfil-fila"><dt>RUT</dt><dd>{empresa.rut}</dd></div>
          <div className="perfil-fila"><dt>Dirección</dt><dd>{empresa.direccion}</dd></div>
        </dl>
      </Card.Body>
    </Card>
  );
}

export default DatosEmpresa;