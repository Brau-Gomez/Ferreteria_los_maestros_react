// Container del registro: concentra el estado del formulario, la validación
// y el guardado de la cuenta via API (backend hashea con BCrypt).
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormularioRegistro from '@/components/organisms/registro/FormularioRegistro.jsx';
import { useRegiones, useComunas } from '@/hooks/useCatalogo.js';
import { register as apiRegister } from '@/api/authApi.js';
import { normalizarRun, runValido } from '@/utils/run.js';
import { validarClave, validarTexto } from '@/utils/validaciones/comunes.js';
import { validarUsuario } from '@/utils/validaciones/usuarios.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';

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
function validar(valores, usuarios, regiones) {
  const normalizados = {
    ...valores,
    run: normalizarRun(valores.run),
    correo: valores.correo.trim().toLowerCase(),
    tipoUsuario: 'Cliente',
    region: regiones[0]?.nombre || 'Región de Coquimbo',
  };
  const actuales = validarUsuario(normalizados, usuarios, '');
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
  const navigate = useNavigate();
  const { usuarios, isLoading: usuariosLoading } = useUsuarios();
  const { regiones, isLoading: regionesLoading } = useRegiones();
  const { comunas, isLoading: comunasLoading } = useComunas(1);
  
  const [datos, setDatos] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const esContratista = datos.tipoCuenta === 'Contratista';

  const loading = usuariosLoading || regionesLoading || comunasLoading;

  function actualizar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor };
    setDatos(siguientes);
    setErrores(validar(siguientes, usuarios, regiones));
    setMensaje('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    const actuales = validar(datos, usuarios, regiones);
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
        region: regiones[0]?.nombre || 'Región de Coquimbo',
        comuna: datos.comuna,
        direccion: datos.direccion.trim(),
        activo: true,
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

      // El backend hashea la contraseña con BCrypt
      await apiRegister(usuario, datos.clave);
      
      setDatos(formularioInicial);
      setErrores({});
      setMensaje('Cuenta creada. Ya puedes iniciar sesión.');
      setExito(true);
      
      // Redirigir a login tras 2 segundos
      setTimeout(() => navigate('/ingreso'), 2000);
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'No se pudo crear la cuenta.';
      setMensaje(msg);
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
      loading={loading}
      region={regiones[0]?.nombre || 'Región de Coquimbo'}
      comunas={comunas.map(c => c.nombre)}
      onCambio={actualizar}
      onEnviar={enviar}
    />
  );
}

export default RegistroContainer;