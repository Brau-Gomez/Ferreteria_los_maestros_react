// Container del formulario de producto: carga el producto (si se edita),
// valida, lee la imagen y guarda en el catálogo.
// Solo renderiza FormularioProductoAdmin o el aviso de producto no encontrado.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';
import FormularioProductoAdmin from '@/components/organisms/admin/FormularioProductoAdmin.jsx';
import { clavesDatos, guardarRegistro, obtenerProductos } from '@/services/almacenamiento.js';
import { obtenerCategorias } from '@/services/categorias.js';
import { validarProducto } from '@/utils/validaciones/productos.js';

const vacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockCritico: '',
  categoria: '',
};

function leerImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    lector.readAsDataURL(archivo);
  });
}

function AdminProductoFormContainer({ modo }) {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [productos] = useState(() => obtenerProductos());
  const [categorias] = useState(() => obtenerCategorias());
  const codigoOriginal = modo === 'editar' ? (codigo || '').toUpperCase() : '';
  const producto = productos.find((item) => item.codigo === codigoOriginal);
  const [datos, setDatos] = useState(() => producto ? {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: String(producto.precioVenta),
    stock: String(producto.stock),
    stockCritico: String(producto.stockMinimo),
    categoria: producto.categoria || '',
  } : vacio);
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  if (modo === 'editar' && !producto) {
    return (
      <AvisoNoEncontradoAdmin
        titulo="Producto no encontrado"
        texto="No se encontró el producto solicitado."
        ruta="/admin/productos"
        etiquetaRuta="Volver al listado"
      />
    );
  }

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setMensaje('');
  }

  function elegirArchivo(nuevo) {
    setArchivo(nuevo);
    setMensaje('');
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    const normalizados = { ...datos, codigo: datos.codigo.trim().toUpperCase() };
    const actuales = validarProducto(normalizados, obtenerProductos(), codigoOriginal, archivo, categorias);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setGuardando(true);
    setMensaje('');
    try {
      const imagen = archivo ? await leerImagen(archivo) : producto?.imagen || '';
      const listaFinal = obtenerProductos();
      const erroresFinales = validarProducto(normalizados, listaFinal, codigoOriginal, archivo, categorias);
      setErrores(erroresFinales);
      if (Object.values(erroresFinales).some(Boolean)) {
        setMensaje('Revisa los campos antes de guardar.');
        return;
      }
      const actualizado = {
        ...(producto || {}),
        codigo: normalizados.codigo,
        nombre: normalizados.nombre.trim(),
        descripcion: normalizados.descripcion.trim(),
        precioVenta: Number(normalizados.precio),
        stock: Number(normalizados.stock),
        stockMinimo: normalizados.stockCritico === '' ? 0 : Number(normalizados.stockCritico),
        categoria: normalizados.categoria,
        subcategoria: producto?.subcategoria || '',
        marca: producto?.marca || '',
        unidad: producto?.unidad || '',
        imagen,
      };
      if (!guardarRegistro(clavesDatos.productos, listaFinal, 'codigo', codigoOriginal, actualizado)) {
        setMensaje('No fue posible guardar el producto. Puedes reintentarlo.');
        return;
      }
      navigate(`/admin/productos/${encodeURIComponent(actualizado.codigo)}`);
    } catch (error) {
      setMensaje(error.message || 'No fue posible guardar el producto. Puedes reintentarlo.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <FormularioProductoAdmin
      modo={modo}
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      guardando={guardando}
      categorias={categorias}
      tieneImagen={Boolean(producto?.imagen)}
      rutaCancelar={producto ? `/admin/productos/${encodeURIComponent(producto.codigo)}` : '/admin/productos'}
      onCambiar={actualizar}
      onArchivo={elegirArchivo}
      onEnviar={alEnviar}
    />
  );
}

export default AdminProductoFormContainer;