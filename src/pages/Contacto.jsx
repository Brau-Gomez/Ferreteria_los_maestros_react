// Formulario de contacto (stub temporal).
// El formulario con validación en vivo se implementa en la Fase 8.
import Container from 'react-bootstrap/Container';

function Contacto() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    if (intentoEnviar) setErrores(validarContacto(siguientes));
    setMensaje('');
  }

  function alEnviar(evento) {
    evento.preventDefault();
    const actuales = validarContacto(datos);
    setIntentoEnviar(true);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setDatos(inicial);
    setErrores({});
    setMensaje('Consulta registrada para esta demostración. No se envía a un servidor.');
    setIntentoEnviar(false);
  }

  return (
    <Container className="py-5">
      <h1 className="mb-3">Contacto</h1>
      <p className="text-muted mb-0">
        Contacto en migración: el formulario con validación se implementa
        en la Fase 8 del plan.
      </p>
    </Container>
  );
}

export default Contacto;