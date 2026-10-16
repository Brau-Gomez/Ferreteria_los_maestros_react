// Container del formulario de contacto: concentra estado y lógica.
// No tiene markup propio: solo renderiza el organismo presentacional.
import { useState } from 'react';
import FormularioContacto from '../components/organisms/FormularioContacto.jsx';
import { validarContacto } from '../utils/validaciones/contacto.js';

const datosIniciales = { nombre: '', correo: '', comentario: '' };

function ContactoContainer() {
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  // Cada vez que el usuario escribe: guarda el valor y revisa solo ese campo.
  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    setErrores((previos) => ({
      ...previos,
      [campo]: validarContacto(siguientes)[campo],
    }));
    setMensaje('');
  }

  // Al enviar: revisa todos los campos; si hay errores, no continúa.
  function enviar(evento) {
    evento.preventDefault();
    const actuales = validarContacto(datos);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setMensaje(
      'Consulta registrada para esta demostración. No se envía a un servidor.',
    );
    setDatos(datosIniciales);
    setErrores({});
  }

  return (
    <FormularioContacto
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      onCambio={cambiar}
      onEnviar={enviar}
    />
  );
}

export default ContactoContainer;