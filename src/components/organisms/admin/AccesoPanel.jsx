// Tarjeta de acceso al panel de administración (Administrador y Vendedor).
// Presentacional: el texto cambia según el tipo de usuario.
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function AccesoPanel({ tipoUsuario }) {
  return (
    <Card className="tarjeta-cuenta h-100">
      <Card.Body>
        <h2 className="h5">Acceso de {tipoUsuario.toLowerCase()}</h2>
        <p className="cuenta-descripcion">
          {tipoUsuario === 'Administrador'
            ? 'Tienes acceso completo a la administración de productos y usuarios.'
            : 'Puedes gestionar el catálogo de productos y revisar el stock.'}
        </p>
        <Button as={Link} to="/admin" variant="warning">
          Ir al panel de administración
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AccesoPanel;