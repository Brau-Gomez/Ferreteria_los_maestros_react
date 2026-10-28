// Container del ingreso: concentra el estado del formulario, la validación,
// el inicio de sesión y la redirección según el rol.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioIngreso from '@/components/organisms/registro/FormularioIngreso.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { validarClave, validarCorreo } from '@/utils/validaciones/comunes.js';

const cuentasDemo = [
  { tipo: 'Administrador', correo: 'admin@duoc.cl' },
  { tipo: 'Vendedor', correo: 'vendedor@profesor.duoc.cl' },
  { tipo: 'Contratista demo', correo: 'cliente@gmail.com' },
];

function validar(valores) {
  return {
    correo: validarCorreo(valores.correo),
    clave: validarClave(valores.clave),
  };
}

function IngresoContainer() {
  const { entrar } = useSesion();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ correo: '', clave: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

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

  async function enviar(evento) {
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

    // Cliente → su cuenta; Administrador y Vendedor → panel.
    const destino = resultado.usuario.tipoUsuario === 'Cliente'
      ? '/cuenta'
      : '/admin';
    navigate(destino, { replace: true });
  }

  return (
    <FormularioIngreso
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      enviando={enviando}
      cuentasDemo={cuentasDemo}
      onCambio={actualizar}
      onSeleccionarDemo={seleccionarDemo}
      onEnviar={enviar}
    />
  );
}

export default IngresoContainer;