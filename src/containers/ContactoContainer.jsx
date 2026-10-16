// Container del formulario de contacto: concentra estado y lógica.
// No tiene markup propio: solo renderiza el organismo presentacional.
import { useState } from 'react';
import FormularioContacto from '../components/organisms/FormularioContacto.jsx';
import { validarContacto } from '../utils/validaciones/contacto.js';

const inicial = { nombre: '', correo: '', comentario: '' };

function ContactoContainer() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  // Los errores aparecen solo después del primer intento de envío; luego
  // se revisan en vivo con cada tecla.
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
    setMensaje(
      'Consulta registrada para esta demostración. No se envía a un servidor.',
    );
    setIntentoEnviar(false);
  }

  return (
    <FormularioContacto
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      onCambio={actualizar}
      onEnviar={alEnviar}
    />
  );
}

export default ContactoContainer;