// Registro portado desde tienda/registro.html y js/tienda/registro.js.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { comunasPorRegion } from '../data/regiones.js';
import {
  guardarRegistro,
  obtenerUsuarios,
  clavesDatos,
} from '../services/almacenamiento.js';
import { huellaClave } from '../utils/claves.js';
import { normalizarRun, runValido } from '../utils/run.js';
import { validarClave, validarTexto } from '../utils/validaciones/comunes.js';
import { validarUsuario } from '../utils/validaciones/usuarios.js';

const regionUnica = 'Región de Coquimbo';
const formularioInicial = {
  nombre: '',
  apellidos: '',
  run: '',
  fechaNacimiento: '',
  comuna: '',
  direccion: '',
  tipoCuenta: 'Cliente',
  empresaRut: '',
  empresaRazon: '',
  empresaDireccion: '',
  telefono: '',
  correo: '',
  clave: '',
  confirmacion: '',
};

function Registro() {
  const [datos, setDatos] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const esContratista = datos.tipoCuenta === 'Contratista';
  const comunas = comunasPorRegion[regionUnica];

  function validar(valores) {
    const normalizados = {
      ...valores,
      run: normalizarRun(valores.run),
      correo: valores.correo.trim().toLowerCase(),
      tipoUsuario: 'Cliente',
      region: regionUnica,
    };
    const actuales = validarUsuario(normalizados, obtenerUsuarios(), '');
    actuales.clave = validarClave(valores.clave);
    actuales.confirmacion = valores.clave === valores.confirmacion
      ? ''
      : 'Las contraseñas deben coincidir.';
    const telefono = valores.telefono.replace(/[\s.-]/g, '');
    actuales.telefono = telefono && !/^\+?\d{8,12}$/.test(telefono)
      ? 'Ingresa un teléfono válido, entre 8 y 12 dígitos.'
      : '';
    if (valores.tipoCuenta === 'Contratista') {
      actuales.empresaRut = runValido(valores.empresaRut)
        ? ''
        : 'Ingresa un RUT de empresa válido.';
      actuales.empresaRazon = validarTexto(
        valores.empresaRazon,
        'La razón social',
        100,
        true,
      );
      actuales.empresaDireccion = validarTexto(
        valores.empresaDireccion,
        'La dirección de la empresa',
        300,
        true,
      );
    } else {
      actuales.empresaRut = '';
      actuales.empresaRazon = '';
      actuales.empresaDireccion = '';
    }
    return actuales;
  }

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    setErrores(validar(siguientes));
    setMensaje('');
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    const actuales = validar(datos);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setEnviando(true);
    try {
      const run = normalizarRun(datos.run);
      const usuario = {
        run,
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim().toLowerCase(),
        fechaNacimiento: datos.fechaNacimiento,
        tipoUsuario: 'Cliente',
        region: regionUnica,
        comuna: datos.comuna,
        direccion: datos.direccion.trim(),
        activo: true,
        sal: crypto.randomUUID(),
        telefono: datos.telefono.trim(),
        esContratista,
      };
      if (esContratista) {
        usuario.empresa = {
          rut: normalizarRun(datos.empresaRut),
          razonSocial: datos.empresaRazon.trim(),
          direccion: datos.empresaDireccion.trim(),
        };
      }
      usuario.claveHuella = await huellaClave(datos.clave, usuario.sal);

      // Revalida antes de persistir para no aceptar duplicados creados durante el cálculo PBKDF2.
      const erroresFinales = validarUsuario(usuario, obtenerUsuarios(), '');
      if (Object.values(erroresFinales).some(Boolean)) {
        setErrores(erroresFinales);
        setEnviando(false);
        return;
      }
      if (!guardarRegistro(clavesDatos.usuarios, obtenerUsuarios(), 'run', '', usuario)) {
        setMensaje('No se pudo guardar tu cuenta. Puedes reintentarlo.');
        setExito(false);
        return;
      }
      setDatos(formularioInicial);
      setErrores({});
      setMensaje('Cuenta creada en este navegador. Ya puedes iniciar sesión.');
      setExito(true);
    } catch {
      setMensaje('No se pudo crear la cuenta. Abre el proyecto con Live Server.');
      setExito(false);
    } finally {
      setEnviando(false);
    }
  }

  function campo(campoNombre, etiqueta, opciones = {}) {
    const { tipo = 'text', maxLength, requerido = true, ayuda, ...props } = opciones;
    return (
      <Form.Group className="mb-3" controlId={`registro-${campoNombre}`}>
        <Form.Label>{etiqueta}{requerido ? ' *' : ''}</Form.Label>
        <Form.Control
          as={tipo === 'textarea' ? 'textarea' : undefined}
          type={tipo === 'textarea' ? undefined : tipo}
          maxLength={maxLength}
          required={requerido}
          value={datos[campoNombre]}
          isInvalid={Boolean(errores[campoNombre])}
          onChange={(evento) => actualizar(campoNombre, evento.target.value)}
          {...props}
        />
        {ayuda && <Form.Text>{ayuda}</Form.Text>}
        <Form.Control.Feedback type="invalid">
          {errores[campoNombre]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <Container className="py-5">
      <div className="pagina-angosta mx-auto">
        <h1>Crear una cuenta</h1>
        <p>Registro de cliente para esta demostración local.</p>
        <Card className="auth-card">
          <Card.Body className="p-4 p-md-5">
            <Form noValidate onSubmit={alEnviar}>
              <fieldset className="registro-bloque mb-4">
                <legend>Datos personales</legend>
                <div className="row">
                  <div className="col-md-6">{campo('nombre', 'Nombre', { maxLength: 50 })}</div>
                  <div className="col-md-6">{campo('apellidos', 'Apellidos', { maxLength: 100 })}</div>
                  <div className="col-md-6">{campo('run', 'RUN', { minLength: 7, maxLength: 9, placeholder: '123456785', ayuda: 'Sin puntos ni guion.' })}</div>
                  <div className="col-md-6">{campo('fechaNacimiento', 'Fecha de nacimiento', { tipo: 'date', requerido: false })}</div>
                  <div className="col-md-6">
                    <Form.Label>Región</Form.Label>
                    <Form.Control value={regionUnica} readOnly aria-label="Región de residencia" />
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="registro-comuna">
                      <Form.Label>Comuna *</Form.Label>
                      <Form.Select value={datos.comuna} isInvalid={Boolean(errores.comuna)} onChange={(evento) => actualizar('comuna', evento.target.value)}>
                        <option value="">Selecciona una comuna</option>
                        {comunas.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-12">{campo('direccion', 'Dirección', { tipo: 'textarea', maxLength: 300, ayuda: 'Se usará como dirección de despacho.' })}</div>
                </div>
              </fieldset>

              <fieldset className="registro-bloque mb-4">
                <legend>Tipo de cuenta</legend>
                <Form.Group controlId="registro-tipo-cuenta">
                  <Form.Label>¿Cómo vas a comprar? *</Form.Label>
                  <Form.Select value={datos.tipoCuenta} onChange={(evento) => actualizar('tipoCuenta', evento.target.value)}>
                    <option value="Cliente">Cliente particular</option>
                    <option value="Contratista">Contratista o empresa (con cuenta corriente)</option>
                  </Form.Select>
                  <Form.Text>Los contratistas cargan sus compras a una cuenta corriente que se paga al cierre de cada mes.</Form.Text>
                </Form.Group>
              </fieldset>

              {esContratista && (
                <fieldset className="registro-bloque mb-4">
                  <legend>Datos de la empresa</legend>
                  <div className="row">
                    <div className="col-md-6">{campo('empresaRut', 'RUT de la empresa', { minLength: 7, maxLength: 9, placeholder: '761234567', ayuda: 'Sin puntos ni guion.' })}</div>
                    <div className="col-md-6">{campo('empresaRazon', 'Razón social', { maxLength: 100 })}</div>
                    <div className="col-12">{campo('empresaDireccion', 'Dirección de la empresa', { tipo: 'textarea', maxLength: 300 })}</div>
                  </div>
                </fieldset>
              )}

              <fieldset className="registro-bloque mb-4">
                <legend>Datos de acceso</legend>
                <div className="row">
                  <div className="col-md-6">{campo('telefono', 'Teléfono', { tipo: 'tel', maxLength: 15, requerido: false, placeholder: '+56912345678', ayuda: 'Opcional, para coordinar despachos.' })}</div>
                  <div className="col-md-6">{campo('correo', 'Correo', { tipo: 'email', maxLength: 100, autoComplete: 'email' })}</div>
                  <div className="col-md-6">{campo('clave', 'Contraseña', { tipo: 'password', minLength: 4, maxLength: 10, autoComplete: 'new-password' })}</div>
                  <div className="col-md-6">{campo('confirmacion', 'Confirmar contraseña', { tipo: 'password', minLength: 4, maxLength: 10, autoComplete: 'new-password' })}</div>
                </div>
              </fieldset>

              {mensaje && <Alert variant={exito ? 'success' : 'danger'} role={exito ? 'status' : 'alert'}>{mensaje}</Alert>}
              <div className="d-flex flex-wrap gap-2">
                <Button variant="warning" type="submit" disabled={enviando}>
                  {enviando ? 'Creando cuenta…' : 'Registrarme'}
                </Button>
                <Button as={Link} to="/ingreso" variant="outline-primary">Iniciar sesión</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Registro;
