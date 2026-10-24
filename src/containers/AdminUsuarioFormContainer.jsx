// Container del formulario de usuario: carga el perfil (si se edita), valida,
// guarda y mantiene la sesión al día si la persona edita su propio perfil.
// Solo renderiza FormularioUsuarioAdmin o el aviso de usuario no encontrado.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '../components/organisms/AvisoNoEncontradoAdmin.jsx';
import FormularioUsuarioAdmin from '../components/organisms/FormularioUsuarioAdmin.jsx';
import { comunasPorRegion } from '../data/regiones.js';
import { useSesion } from '../hooks/useSesion.js';
import { clavesDatos, guardarRegistro, obtenerUsuarios } from '../services/almacenamiento.js';
import { normalizarRun } from '../utils/run.js';
import { validarUsuario } from '../utils/validaciones/usuarios.js';

const roles = ['Administrador', 'Vendedor', 'Cliente'];
const regionUnica = 'Región de Coquimbo';
const vacio = { run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', tipoUsuario: '', region: regionUnica, comuna: '', direccion: '' };

function AdminUsuarioFormContainer({ modo }) {
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

  if (modo === 'editar' && !usuarioOriginal) {
    return (
      <AvisoNoEncontradoAdmin
        titulo="Usuario no encontrado"
        texto="No se encontró el usuario solicitado."
        ruta="/admin/usuarios"
        etiquetaRuta="Volver al listado"
      />
    );
  }

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setMensaje('');
  }

  function cambiarRegion(region) {
    setDatos((previos) => ({ ...previos, region, comuna: '' }));
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

  return (
    <FormularioUsuarioAdmin
      modo={modo}
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      roles={roles}
      regiones={Object.keys(comunasPorRegion)}
      comunas={comunasPorRegion[datos.region] || []}
      rutaCancelar={usuarioOriginal ? `/admin/usuarios/${encodeURIComponent(usuarioOriginal.run)}` : '/admin/usuarios'}
      onCambiar={actualizar}
      onCambiarRegion={cambiarRegion}
      onNormalizarRun={() => actualizar('run', normalizarRun(datos.run))}
      onEnviar={alEnviar}
    />
  );
}

export default AdminUsuarioFormContainer;