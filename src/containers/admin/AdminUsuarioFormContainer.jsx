// Container del formulario de usuario: carga el perfil (si se edita), valida,
// guarda y mantiene la sesión al día si la persona edita su propio perfil via API.
// Solo renderiza FormularioUsuarioAdmin o el aviso de usuario no encontrado.
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';
import FormularioUsuarioAdmin from '@/components/organisms/admin/FormularioUsuarioAdmin.jsx';
import { useSesion } from '@/hooks/useSesion.js';
import { useUsuarios } from '@/hooks/useUsuarios.js';
import { useRegiones, useComunas } from '@/hooks/useCatalogo.js';
import { normalizarRun } from '@/utils/run.js';
import { validarUsuario } from '@/utils/validaciones/usuarios.js';
import { useCrearUsuario, useActualizarUsuario } from '@/hooks/useUsuarios.js';

const roles = ['Administrador', 'Vendedor', 'Cliente'];
const vacio = { run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', tipoUsuario: '', region: '', comuna: '', direccion: '' };

function AdminUsuarioFormContainer({ modo }) {
  const { run } = useParams();
  const navigate = useNavigate();
  const { usuario: usuarioSesion, actualizarSesion, loading: authLoading } = useSesion();
  
  const { usuarios, isLoading: usuariosLoading, refetch: refetchUsuarios } = useUsuarios();
  const { regiones, isLoading: regionesLoading } = useRegiones();
  const { comunas, isLoading: comunasLoading } = useComunas(1); // Región de Coquimbo
  const crearUsuarioMutation = useCrearUsuario();
  const actualizarUsuarioMutation = useActualizarUsuario();
  
  const runOriginal = modo === 'editar' ? normalizarRun(run || '') : '';
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

  const loading = authLoading || usuariosLoading || regionesLoading || comunasLoading ||
    crearUsuarioMutation.isPending || actualizarUsuarioMutation.isPending;

  // Sincronizar datos cuando cambia el usuario
  useEffect(() => {
    if (modo === 'editar' && usuarioOriginal) {
      setDatos({
        run: usuarioOriginal.run,
        nombre: usuarioOriginal.nombre,
        apellidos: usuarioOriginal.apellidos,
        correo: usuarioOriginal.correo,
        fechaNacimiento: usuarioOriginal.fechaNacimiento || '',
        tipoUsuario: usuarioOriginal.tipoUsuario,
        region: usuarioOriginal.region,
        comuna: usuarioOriginal.comuna,
        direccion: usuarioOriginal.direccion,
      });
    }
  }, [usuarioOriginal, modo]);

  if (modo === 'editar' && !usuarioOriginal && !usuariosLoading) {
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

  async function alEnviar(evento) {
    evento.preventDefault();
    const normalizados = {
      ...datos,
      run: normalizarRun(datos.run),
      correo: datos.correo.trim().toLowerCase(),
    };
    const actuales = validarUsuario(normalizados, usuarios, runOriginal);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    const actualizado = {
      ...(usuarioOriginal || {}),
      ...normalizados,
      activo: usuarioOriginal ? usuarioOriginal.activo : true,
    };
    
    try {
      setMensaje('');
      if (modo === 'editar') {
        await actualizarUsuarioMutation.mutateAsync({ run: runOriginal, usuario: actualizado });
      } else {
        await crearUsuarioMutation.mutateAsync(actualizado);
      }
      
      await refetchUsuarios();
      
      // Actualizar sesión si es el propio usuario
      if (usuarioOriginal && usuarioSesion && usuarioOriginal.run === usuarioSesion.run) {
        const ok = actualizarSesion(runOriginal, actualizado);
        if (!ok) {
          setMensaje('El perfil se guardó, pero no se pudo actualizar la sesión. Cierra sesión y vuelve a ingresar.');
          return;
        }
      }
      
      navigate(`/admin/usuarios/${encodeURIComponent(actualizado.run)}`);
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'No fue posible guardar el usuario. Puedes reintentarlo.';
      setMensaje(msg);
    }
  }

  return (
    <FormularioUsuarioAdmin
      modo={modo}
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      guardando={loading}
      roles={roles}
      regiones={regiones.map(r => r.nombre)}
      comunas={comunas.map(c => c.nombre)}
      rutaCancelar={usuarioOriginal ? `/admin/usuarios/${encodeURIComponent(usuarioOriginal.run)}` : '/admin/usuarios'}
      onCambiar={actualizar}
      onCambiarRegion={cambiarRegion}
      onNormalizarRun={() => actualizar('run', normalizarRun(datos.run))}
      onEnviar={alEnviar}
    />
  );
}

export default AdminUsuarioFormContainer;