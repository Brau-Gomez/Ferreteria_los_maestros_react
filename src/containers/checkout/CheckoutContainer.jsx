// Container del checkout: guarda los datos del formulario (precargados con
// la sesión), valida y confirma el pedido (el backend simula el pago y devuelve la boleta).
// Solo renderiza VistaCheckout.
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import VistaCheckout from '@/components/organisms/checkout/VistaCheckout.jsx';
import { useCarritoQuery, useVaciarCarrito } from '@/hooks/useCarrito.js';
import { useSesion } from '@/hooks/useSesion.js';
import { useCrearOrden } from '@/hooks/useOrdenes.js';
import { useRegiones, useComunas } from '@/hooks/useCatalogo.js';
import { hayErrores, validarCheckout } from '@/utils/validaciones/checkout.js';
import { simularPago } from '@/api/pagosApi.js';

const REGION = 'Región de Coquimbo';
const sinErrores = {};

function CheckoutContainer() {
  const { items, total, isLoading: carritoLoading, refetch: refetchCarrito } = useCarritoQuery();
  const { usuario } = useSesion();
  const { regiones, isLoading: regionesLoading } = useRegiones();
  const { comunas, isLoading: comunasLoading } = useComunas(1); // ID de Región de Coquimbo
  const crearOrdenMutation = useCrearOrden();
  const vaciarCarritoMutation = useVaciarCarrito();

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre || '',
    apellidos: usuario?.apellidos || '',
    correo: usuario?.correo || '',
    entrega: 'Retiro en tienda',
    direccion: usuario?.direccion || '',
    comuna: usuario?.comuna || '',
    tarjeta: '',
  });
  const [errores, setErrores] = useState(sinErrores);
  // 'formulario' | 'exito' | 'error'
  const [estado, setEstado] = useState('formulario');
  const [mensajeError, setMensajeError] = useState('');
  const [pedido, setPedido] = useState(null);

  // Precargar datos del usuario cuando cambia la sesión
  useEffect(() => {
    if (usuario) {
      setDatos((anteriores) => ({
        ...anteriores,
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        direccion: usuario.direccion || '',
        comuna: usuario.comuna || '',
      }));
    }
  }, [usuario]);

  const loading = carritoLoading || regionesLoading || comunasLoading ||
    crearOrdenMutation.isPending || vaciarCarritoMutation.isPending;

  function cambiar(campo, valor) {
    setDatos((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const despacho =
      datos.entrega === 'Despacho'
        ? { 
            direccion: datos.direccion.trim(), 
            comuna: datos.comuna, 
            comunaId: comunas.find((comuna) => comuna.nombre === datos.comuna)?.id,
            region: REGION,
            regionId: 1 
          }
        : undefined;

    const orden = {
      items: items.map(item => ({
        codigo: item.codigo,
        cantidad: item.cantidad,
        precioUnitario: item.precioVenta,
      })),
      entrega: datos.entrega,
      despacho,
      total: total,
    };

    try {
      setMensajeError('');
      // Primero el banco simulado aprueba o rechaza la tarjeta; solo con el pago
      // aprobado se crea la orden (así una tarjeta rechazada no genera pedido).
      const pago = await simularPago({ numeroTarjeta: datos.tarjeta, monto: total, moneda: 'CLP' });
      if (!pago?.aprobado) {
        setMensajeError(pago?.mensaje || 'El banco rechazó la tarjeta.');
        setEstado('error');
        return;
      }
      // Generar idempotency key para evitar duplicados
      const idempotencyKey = uuidv4();
      // El backend simula el pago al crear la orden y devuelve la boleta.
      const resultado = await crearOrdenMutation.mutateAsync({ orden, idempotencyKey });

      // Vaciar carrito tras éxito
      await vaciarCarritoMutation.mutateAsync();
      await refetchCarrito();

      setPedido({
        id: resultado.id,
        total: resultado.total ?? total,
        entrega: datos.entrega,
        correo: datos.correo.trim(),
        boleta: resultado.boleta,
      });
      setEstado('exito');
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'No se pudo procesar el pedido.';
      setMensajeError(msg);
      setEstado('error');
    }
  }

  function reintentar() {
    setMensajeError('');
    setDatos((anteriores) => ({ ...anteriores, tarjeta: '' }));
    setEstado('formulario');
  }

  // Obtener lista de comunas para la región
  const listaComunas = comunas.map(c => c.nombre) || [];

  return (
    <VistaCheckout
      estado={estado}
      items={items}
      total={total}
      datos={datos}
      errores={errores}
      comunas={listaComunas}
      mensajeError={mensajeError}
      pedido={pedido}
      onCambio={cambiar}
      onEnviar={enviar}
      onReintentar={reintentar}
      loading={loading}
    />
  );
}

export default CheckoutContainer;