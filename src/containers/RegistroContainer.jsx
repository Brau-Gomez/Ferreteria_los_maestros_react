// Container del registro: concentra el estado del formulario, la validación
// y el guardado de la cuenta (con la huella PBKDF2 de la contraseña).
import { useState } from 'react';
import FormularioRegistro from '../components/organisms/FormularioRegistro.jsx';
import { comunasPorRegion } from '../data/regiones.js';
import {
  clavesDatos,
  guardarRegistro,
  obtenerUsuarios,
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

// Devuelve un mensaje por campo con error; los válidos quedan en ''.
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
    actuales.empresaRazon = validarTexto(valores.empresaRazon, 'La razón social', 100, true);
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

function RegistroContainer() {
  const [datos, setDatos] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const esContratista = datos.tipoCuenta === 'Contratista';

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    setErrores(validar(siguientes));
    setMensaje('');
  }

  async function enviar(evento) {
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

  return (
    <FormularioRegistro
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      exito={exito}
      enviando={enviando}
      region={regionUnica}
      comunas={comunasPorRegion[regionUnica]}
      onCambio={actualizar}
      onEnviar={enviar}
    />
  );
}

export default RegistroContainer;