// Perfil de la persona que inició sesión en el panel. Presentacional:
// muestra sus datos y los permisos que le da su perfil.
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const permisosPorPerfil = {
  Administrador: [
    'Gestionar productos, usuarios y órdenes',
    'Ver reportes de ventas y productos críticos',
    'Crear, editar y eliminar perfiles',
  ],
  Vendedor: [
    'Consultar el catálogo de productos',
    'Ver el detalle de cada producto',
    'Consultar la lista y el detalle de las órdenes',
  ],
};

function PerfilAdmin({ usuario }) {
  const campos = [
    ['RUN', usuario.run],
    ['Correo', usuario.correo],
    ['Región', usuario.region],
    ['Comuna', usuario.comuna],
    ['Dirección', usuario.direccion],
  ];
  const permisos = permisosPorPerfil[usuario.tipoUsuario] || [];
  const esAdmin = usuario.tipoUsuario === 'Administrador';

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Mi cuenta</p>
          <h1>{usuario.nombre} {usuario.apellidos}</h1>
          <p>Datos del perfil con el que iniciaste sesión.</p>
        </div>
        {esAdmin && (
          <Button as={Link} to={`/admin/usuarios/${encodeURIComponent(usuario.run)}/editar`}>
            Editar mi perfil
          </Button>
        )}
      </header>
      <section className="admin-panel">
        <dl className="admin-details mb-0">
          {campos.map(([etiqueta, valor]) => (
            <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor || 'No informado'}</dd></div>
          ))}
          <div><dt>Perfil</dt><dd><Badge bg="primary">{usuario.tipoUsuario}</Badge></dd></div>
        </dl>
      </section>
      <section className="admin-panel mt-4" aria-labelledby="titulo-permisos">
        <div className="admin-panel-header"><div><h2 id="titulo-permisos">Permisos de tu perfil</h2></div></div>
        <ul className="mb-0">
          {permisos.map((permiso) => <li key={permiso}>{permiso}</li>)}
        </ul>
      </section>
    </>
  );
}

export default PerfilAdmin;