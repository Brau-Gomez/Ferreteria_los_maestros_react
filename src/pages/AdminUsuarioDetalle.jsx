// Detalle de perfil del administrador, con edición y eliminación protegida.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useSesion } from '../hooks/useSesion.js';
import { clavesDatos, eliminarRegistro, leerListaGuardada, obtenerUsuarios } from '../services/almacenamiento.js';

function AdminUsuarioDetalle() {
  const { run } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion } = useSesion();
  const [error, setError] = useState('');
  const runBuscado = (run || '').replace(/[.\-\s]/g, '').toUpperCase();
  const [usuarios] = useState(() => obtenerUsuarios());
  const usuario = usuarios.find((item) => item.run === runBuscado);

  function eliminar() {
    if (usuario.run === sesion.run) {
      setError('No puedes eliminar el perfil con el que tienes iniciada la sesión.');
      return;
    }
    if (usuario.tipoUsuario === 'Administrador' && usuarios.filter((item) => item.tipoUsuario === 'Administrador').length <= 1) {
      setError('Debe existir al menos un perfil Administrador.');
      return;
    }
    if (!window.confirm(`¿Eliminar el perfil de ${usuario.nombre} ${usuario.apellidos}?`)) return;
    const lista = leerListaGuardada(clavesDatos.usuarios) || obtenerUsuarios();
    if (!eliminarRegistro(clavesDatos.usuarios, lista, 'run', usuario.run)) {
      setError('No fue posible eliminar el usuario. Puedes reintentarlo.');
      return;
    }
    navigate('/admin/usuarios');
  }

  if (!usuario) return <Alert variant="warning"><h1>Usuario no encontrado</h1><p>Selecciona un perfil existente desde el listado.</p><Link to="/admin/usuarios">Volver a usuarios</Link></Alert>;

  const campos = [
    ['RUN', usuario.run], ['Nombre', usuario.nombre], ['Apellidos', usuario.apellidos],
    ['Correo', usuario.correo], ['Fecha de nacimiento', usuario.fechaNacimiento],
    ['Perfil', usuario.tipoUsuario], ['Región', usuario.region], ['Comuna', usuario.comuna],
    ['Dirección', usuario.direccion],
  ];

  return (
    <>
      <header className="admin-page-heading">
        <div><p className="admin-kicker"><Link to="/admin/usuarios">Usuarios</Link> / {usuario.run}</p><h1>{usuario.nombre} {usuario.apellidos}</h1><p>Información obtenida de los perfiles persistentes mediante su RUN.</p></div>
        <div className="admin-actions"><Button as={Link} to="/admin/usuarios" variant="outline-primary">Volver</Button><Button as={Link} to={`/admin/usuarios/${encodeURIComponent(usuario.run)}/editar`}>Editar usuario</Button><Button variant="outline-danger" onClick={eliminar}>Eliminar usuario</Button></div>
      </header>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <section className="admin-panel"><dl className="admin-details mb-0">
        {campos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor || 'No informado'}</dd></div>)}
        <div><dt>Estado</dt><dd><Badge bg={usuario.activo ? 'success' : 'secondary'}>{usuario.activo ? 'Activo' : 'Inactivo'}</Badge></dd></div>
      </dl></section>
    </>
  );
}

export default AdminUsuarioDetalle;
