// Listado de usuarios del panel admin. Presentacional.
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

function ListadoUsuariosAdmin({ usuarios }) {
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker">Personas y accesos</p>
          <h1>Usuarios</h1>
          <p>Perfiles registrados para el sistema.</p>
        </div>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="warning">Nuevo usuario</Button>
      </header>
      <section className="admin-panel" aria-labelledby="titulo-tabla-usuarios">
        <div className="admin-panel-header">
          <div>
            <h2 id="titulo-tabla-usuarios">Usuarios registrados</h2>
            <p>{usuarios.length} perfiles guardados en este navegador.</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead>
              <tr>
                <th scope="col">RUN</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Perfil</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.run}>
                  <td>{usuario.run}</td>
                  <td>{usuario.nombre} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.tipoUsuario}</td>
                  <td>
                    <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/admin/usuarios/${encodeURIComponent(usuario.run)}`}>Ver</Link>
                    {' · '}
                    <Link to={`/admin/usuarios/${encodeURIComponent(usuario.run)}/editar`}>Editar</Link>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan="6">No hay usuarios guardados.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default ListadoUsuariosAdmin;