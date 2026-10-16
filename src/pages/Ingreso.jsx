// Ingreso portado desde tienda/inicio-sesion.html y js/tienda/inicio-sesion.js.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { useSesion } from '../hooks/useSesion.js';
import { validarClave, validarCorreo } from '../utils/validaciones/comunes.js';

const cuentasDemo = [
  { tipo: 'Administrador', correo: 'admin@duoc.cl' },
  { tipo: 'Vendedor', correo: 'vendedor@profesor.duoc.cl' },
  { tipo: 'Contratista demo', correo: 'cliente@gmail.com' },
];

function Ingreso() {
  const { entrar } = useSesion();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ correo: '', clave: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  function validar(valores) {
    return {
      correo: validarCorreo(valores.correo),
      clave: validarClave(valores.clave),
    };
  }

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    setErrores(validar(siguientes));
    setMensaje('');
  }

  function seleccionarDemo(correo) {
    const siguientes = { correo, clave: 'demo123' };
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
    const resultado = await entrar(datos.correo, datos.clave);
    setEnviando(false);
    if (!resultado.ok) {
      setMensaje(resultado.mensaje);
      return;
    }

    const destino = resultado.usuario.tipoUsuario === 'Cliente'
      ? '/cuenta'
      : '/admin';
    navigate(destino, { replace: true });
  }

  return (
    <Container className="pagina-angosta py-5">
      <Card className="auth-card">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow mb-2">Acceso de demostración</p>
          <h1 className="mb-3">Iniciar sesión</h1>
          <p>
            Selecciona un perfil para revisar el flujo visual. Los datos se
            guardan sólo en este navegador.
          </p>
          <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
            {cuentasDemo.map((cuenta) => (
              <Button
                key={cuenta.correo}
                type="button"
                variant="outline-primary"
                onClick={() => seleccionarDemo(cuenta.correo)}
              >
                {cuenta.tipo}
              </Button>
            ))}
          </Stack>
          <Form noValidate onSubmit={alEnviar}>
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                maxLength={100}
                autoComplete="email"
                value={datos.correo}
                isInvalid={Boolean(errores.correo)}
                onChange={(evento) => actualizar('correo', evento.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.correo}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                minLength={4}
                maxLength={10}
                autoComplete="current-password"
                value={datos.clave}
                isInvalid={Boolean(errores.clave)}
                onChange={(evento) => actualizar('clave', evento.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.clave}
              </Form.Control.Feedback>
            </Form.Group>
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
    </Container>
  );
}

export default Ingreso;
