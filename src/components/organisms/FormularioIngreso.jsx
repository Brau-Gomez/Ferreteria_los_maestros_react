// Tarjeta de inicio de sesión: accesos demo, campos, aviso y botón.
// Presentacional: recibe datos y errores; avisa cada cambio y el envío.
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import AccesosDemo from '../molecules/AccesosDemo.jsx';
import CampoFormulario from '../molecules/CampoFormulario.jsx';

function FormularioIngreso({
  datos,
  errores,
  mensaje,
  enviando,
  cuentasDemo,
  onCambio,
  onSeleccionarDemo,
  onEnviar,
}) {
  return (
    <Card className="auth-card">
      <Card.Body className="p-4 p-md-5">
        <p className="eyebrow mb-2">Acceso de demostración</p>
        <h1 className="mb-3">Iniciar sesión</h1>
        <p>
          Selecciona un perfil para revisar el flujo visual. Los datos se
          guardan sólo en este navegador.
        </p>
        <AccesosDemo cuentas={cuentasDemo} onSeleccionar={onSeleccionarDemo} />
        <Form noValidate onSubmit={onEnviar}>
          <CampoFormulario
            id="login-email"
            etiqueta="Correo electrónico"
            error={errores.correo}
            type="email"
            maxLength={100}
            autoComplete="email"
            value={datos.correo}
            onChange={(evento) => onCambio('correo', evento.target.value)}
          />
          <CampoFormulario
            id="login-password"
            etiqueta="Contraseña"
            error={errores.clave}
            type="password"
            minLength={4}
            maxLength={10}
            autoComplete="current-password"
            value={datos.clave}
            onChange={(evento) => onCambio('clave', evento.target.value)}
          />
          {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
          <Button className="w-100" variant="warning" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Entrar'}
          </Button>
        </Form>
        <p className="form-text mt-3">Clave demo: <strong>demo123</strong></p>
        <p className="mb-0">
          ¿Cliente nuevo? <Link to="/registro">Crear una cuenta</Link>
        </p>
      </Card.Body>
    </Card>
  );
}

export default FormularioIngreso;