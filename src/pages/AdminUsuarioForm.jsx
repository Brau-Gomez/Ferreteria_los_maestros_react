// Formulario de creación/edición de perfiles de administración.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { comunasPorRegion } from '../data/regiones.js';
import { useSesion } from '../hooks/useSesion.js';
import { clavesDatos, guardarRegistro, obtenerUsuarios } from '../services/almacenamiento.js';
import { normalizarRun } from '../utils/run.js';
import { validarUsuario } from '../utils/validaciones/usuarios.js';

const roles = ['Administrador', 'Vendedor', 'Cliente'];
const regionUnica = 'Región de Coquimbo';
const vacio = { run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', tipoUsuario: '', region: regionUnica, comuna: '', direccion: '' };

function AdminUsuarioForm({ modo }) {
  const { run } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioSesion, actualizarSesion } = useSesion();
  const runOriginal = modo === 'editar' ? normalizarRun(run || '') : '';
  const [usuarios] = useState(() => obtenerUsuarios());
  const usuarioOriginal = usuarios.find((item) => item.run === runOriginal);
  const [datos, setDatos] = useState(() => usuarioOriginal ? {
    run: usuarioOriginal.run,
    nombre: usuarioOriginal.nombre,
    apellidos: usuarioOriginal.apellidos,
    correo: usuarioOriginal.correo,
    fechaNacimiento: usuarioOriginal.fechaNacimiento || '',
    tipoUsuario: usuarioOriginal.tipoUsuario,
    region: usuarioOriginal.region,
    comuna: usuarioOriginal.comuna,
    direccion: usuarioOriginal.direccion,
  } : vacio);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const comunas = comunasPorRegion[datos.region] || [];

  if (modo === 'editar' && !usuarioOriginal) {
    return <Alert variant="warning"><h1>Usuario no encontrado</h1><p>No se encontró el usuario solicitado.</p><Link to="/admin/usuarios">Volver al listado</Link></Alert>;
  }

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setMensaje('');
  }

  function alEnviar(evento) {
    evento.preventDefault();
    const normalizados = {
      ...datos,
      run: normalizarRun(datos.run),
      correo: datos.correo.trim().toLowerCase(),
    };
    const lista = obtenerUsuarios();
    const actuales = validarUsuario(normalizados, lista, runOriginal);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    const actualizado = {
      ...(usuarioOriginal || {}),
      ...normalizados,
      activo: usuarioOriginal ? usuarioOriginal.activo : true,
    };
    if (!guardarRegistro(clavesDatos.usuarios, lista, 'run', runOriginal, actualizado)) {
      setMensaje('No fue posible guardar el usuario. Puedes reintentarlo.');
      return;
    }
    if (usuarioOriginal && usuarioOriginal.run === usuarioSesion.run && !actualizarSesion(runOriginal, actualizado)) {
      setMensaje('El perfil se guardó, pero no se pudo actualizar la sesión. Cierra sesión y vuelve a ingresar.');
      return;
    }
    navigate(`/admin/usuarios/${encodeURIComponent(actualizado.run)}`);
  }

  function campo(nombre, etiqueta, opciones = {}) {
    return (
      <Form.Group className="mb-3" controlId={`admin-usuario-${nombre}`}>
        <Form.Label>{etiqueta}</Form.Label>
        <Form.Control
          value={datos[nombre]}
          isInvalid={Boolean(errores[nombre])}
          onChange={(evento) => actualizar(nombre, evento.target.value)}
          {...opciones}
        />
        <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <>
      <header className="admin-page-heading"><div><p className="admin-kicker"><Link to="/admin/usuarios">Usuarios</Link> / {modo === 'editar' ? 'Editar' : 'Nuevo'}</p><h1>{modo === 'editar' ? 'Editar usuario' : 'Nuevo usuario'}</h1><p>Los perfiles se guardan en este navegador y pueden ingresar con la clave demo123.</p></div></header>
      <Card className="admin-panel"><Card.Body>
        <Form noValidate onSubmit={alEnviar}>
          <Row>
            <Col md={6}>{campo('run', 'RUN *', { required: true, minLength: 7, maxLength: 9, placeholder: '123456785', onBlur: () => actualizar('run', normalizarRun(datos.run)) })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-tipoUsuario"><Form.Label>Tipo de usuario *</Form.Label><Form.Select value={datos.tipoUsuario} isInvalid={Boolean(errores.tipoUsuario)} onChange={(evento) => actualizar('tipoUsuario', evento.target.value)}><option value="">Selecciona un perfil</option>{roles.map((rol) => <option key={rol}>{rol}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errores.tipoUsuario}</Form.Control.Feedback></Form.Group>
            </Col>
            <Col md={6}>{campo('nombre', 'Nombre *', { required: true, maxLength: 50 })}</Col>
            <Col md={6}>{campo('apellidos', 'Apellidos *', { required: true, maxLength: 100 })}</Col>
            <Col md={6}>{campo('correo', 'Correo *', { type: 'email', required: true, maxLength: 100 })}</Col>
            <Col md={6}>{campo('fechaNacimiento', 'Fecha de nacimiento', { type: 'date' })}</Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-region"><Form.Label>Región *</Form.Label><Form.Select value={datos.region} isInvalid={Boolean(errores.region)} onChange={(evento) => setDatos((previos) => ({ ...previos, region: evento.target.value, comuna: '' }))}>{Object.keys(comunasPorRegion).map((region) => <option key={region}>{region}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback></Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="admin-usuario-comuna"><Form.Label>Comuna *</Form.Label><Form.Select value={datos.comuna} isInvalid={Boolean(errores.comuna)} onChange={(evento) => actualizar('comuna', evento.target.value)}><option value="">Selecciona una comuna</option>{comunas.map((comuna) => <option key={comuna}>{comuna}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback></Form.Group>
            </Col>
            <Col xs={12}>{campo('direccion', 'Dirección *', { as: 'textarea', rows: 2, required: true, maxLength: 300 })}</Col>
          </Row>
          {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
          <div className="admin-form-footer"><Button type="submit">{modo === 'editar' ? 'Guardar cambios' : 'Guardar usuario'}</Button><Button as={Link} to={usuarioOriginal ? `/admin/usuarios/${encodeURIComponent(usuarioOriginal.run)}` : '/admin/usuarios'} variant="outline-primary">Cancelar</Button></div>
        </Form>
      </Card.Body></Card>
    </>
  );
}

export default AdminUsuarioForm;
