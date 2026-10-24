// Detalle de un perfil en el panel admin: datos, acciones e historial de
// compras. Presentacional: recibe el usuario (o null), el error y las
// compras ya preparadas por el container.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import InsigniaEstado from '../atoms/InsigniaEstado.jsx';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { formatearDinero } from '../../utils/dinero.js';

function DetalleUsuarioAdmin({ usuario, error, compras, totalComprado, onEliminar }) {
  if (!usuario) {
    return (
      <Alert variant="warning">
        <h1>Usuario no encontrado</h1>
        <p>Selecciona un perfil existente desde el listado.</p>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </Alert>
    );
  }

  const campos = [
    ['RUN', usuario.run],
    ['Nombre', usuario.nombre],
    ['Apellidos', usuario.apellidos],
    ['Correo', usuario.correo],
    ['Fecha de nacimiento', usuario.fechaNacimiento],
    ['Perfil', usuario.tipoUsuario],
    ['Región', usuario.region],
    ['Comuna', usuario.comuna],
    ['Dirección', usuario.direccion],
  ];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="admin-kicker"><Link to="/admin/usuarios">Usuarios</Link> / {usuario.run}</p>
          <h1>{usuario.nombre} {usuario.apellidos}</h1>
          <p>Información obtenida de los perfiles persistentes mediante su RUN.</p>
        </div>
        <div className="admin-actions">
          <Button as={Link} to="/admin/usuarios" variant="outline-primary">Volver</Button>
          <Button as={Link} to={`/admin/usuarios/${encodeURIComponent(usuario.run)}/editar`}>Editar usuario</Button>
          <Button variant="outline-danger" onClick={onEliminar}>Eliminar usuario</Button>
        </div>
      </header>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <section className="admin-panel">
        <dl className="admin-details mb-0">
          {campos.map(([etiqueta, valor]) => (
            <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor || 'No informado'}</dd></div>
          ))}
          <div>
            <dt>Estado</dt>
            <dd>
              <InsigniaEstado variante={usuario.activo ? 'success' : 'secondary'}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </InsigniaEstado>
            </dd>
          </div>
        </dl>
      </section>
      <section className="admin-panel mt-4" aria-labelledby="titulo-historial-compras">
        <div className="admin-panel-header">
          <div>
            <h2 id="titulo-historial-compras">Historial de compras</h2>
            <p>
              {compras.length} compras · Total comprado{' '}
              <strong>{formatearDinero(totalComprado)}</strong>
            </p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <Table responsive hover className="admin-table mb-0">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Entrega</th>
                <th scope="col">Total</th>
                <th scope="col">Boleta</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{compra.fecha}</td>
                  <td>{compra.entrega}</td>
                  <td>{formatearDinero(compra.total)}</td>
                  <td>
                    <Link to={`/admin/ordenes/${encodeURIComponent(compra.id)}`}>Ver boleta</Link>
                  </td>
                </tr>
              ))}
              {compras.length === 0 && (
                <tr><td colSpan="5">Este usuario todavía no tiene compras.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default DetalleUsuarioAdmin;