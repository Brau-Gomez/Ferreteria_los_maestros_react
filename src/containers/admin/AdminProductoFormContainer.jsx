// Container del formulario de producto: carga el producto (si se edita),
// valida, sube la imagen y guarda en el catálogo via API.
// Solo renderiza FormularioProductoAdmin o el aviso de producto no encontrado.
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvisoNoEncontradoAdmin from '@/components/organisms/admin/AvisoNoEncontradoAdmin.jsx';
import FormularioProductoAdmin from '@/components/organisms/admin/FormularioProductoAdmin.jsx';
import { 
  useProductos, 
  useCategorias, 
  useCrearProducto, 
  useActualizarProducto, 
  useSubirImagen 
} from '@/hooks/useProductos.js';
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

function AdminProductoFormContainer({ modo }) {
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  // Usar hooks de TanStack Query
  const { productos, isLoading: productosLoading } = useProductos();
  const { categorias, isLoading: categoriasLoading } = useCategorias();
  const crearProductoMutation = useCrearProducto();
  const actualizarProductoMutation = useActualizarProducto();
  const subirImagenMutation = useSubirImagen();
  
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

  // Loading combinado
  const loading = productosLoading || categoriasLoading || 
    crearProductoMutation.isPending || 
    actualizarProductoMutation.isPending || 
    subirImagenMutation.isPending;

  // Sincronizar datos cuando cambia el producto (ej. tras refetch)
  useEffect(() => {
    if (modo === 'editar' && producto) {
      setDatos({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: String(producto.precioVenta),
        stock: String(producto.stock),
        stockCritico: String(producto.stockMinimo),
        categoria: producto.categoria || '',
      });
    }
  }, [producto, modo]);

  if (modo === 'editar' && !producto && !productosLoading) {
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
    const actuales = validarProducto(normalizados, productos, codigoOriginal, archivo, categorias);
    setErrores(actuales);
    if (Object.values(actuales).some(Boolean)) return;

    setMensaje('');
    try {
      let imagen = producto?.imagen || '';
      if (archivo) {
        const resultado = await subirImagenMutation.mutateAsync({ 
          codigo: normalizados.codigo, 
          archivo 
        });
        imagen = resultado.url || resultado.imagen || '';
      }

      const payload = {
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

      if (modo === 'editar') {
        await actualizarProductoMutation.mutateAsync({ 
          codigo: codigoOriginal, 
          producto: payload 
        });
      } else {
        await crearProductoMutation.mutateAsync(payload);
      }

      // Refrescar lista y navegar
      await refetchProductos();
      navigate(`/admin/productos/${encodeURIComponent(normalizados.codigo)}`);
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'No fue posible guardar el producto.';
      setMensaje(msg);
    }
  }

  return (
    <FormularioProductoAdmin
      modo={modo}
      datos={datos}
      errores={errores}
      mensaje={mensaje}
      guardando={loading}
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