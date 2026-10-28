// Tarjeta "Dirección de despacho" de Mi cuenta.
// Presentacional: muestra la dirección del usuario o un aviso si no hay.
import Card from 'react-bootstrap/Card';

function DireccionDespacho({ usuario }) {
  return (
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
  );
}

export default DireccionDespacho;