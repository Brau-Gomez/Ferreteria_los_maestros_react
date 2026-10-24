// Container del checkout: guarda los datos del formulario (precargados con
// la sesión), valida, simula el pago y confirma el pedido. Solo renderiza
// VistaCheckout.
import { useState } from 'react';
import VistaCheckout from '../components/organisms/VistaCheckout.jsx';
import { comunasPorRegion } from '../data/regiones.js';
import { useCarrito } from '../hooks/useCarrito.js';
import { useSesion } from '../hooks/useSesion.js';
import { procesarPago } from '../utils/pago.js';
import { hayErrores, validarCheckout } from '../utils/validaciones/checkout.js';

const REGION = 'Región de Coquimbo';
const sinErrores = {};

function CheckoutContainer() {
  const { items, total, confirmarPedido } = useCarrito();
  const { usuario } = useSesion();

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

  function cambiar(campo, valor) {
    setDatos((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const pago = procesarPago(datos.tarjeta);
    if (!pago.ok) {
      setMensajeError(pago.mensaje);
      setEstado('error');
      return;
    }

    const despacho =
      datos.entrega === 'Despacho'
        ? { direccion: datos.direccion.trim(), comuna: datos.comuna, region: REGION }
        : undefined;
    const totalPagado = total;
    const resultado = confirmarPedido(usuario, datos.entrega, despacho);
    if (!resultado.ok) {
      setMensajeError(resultado.mensaje);
      setEstado('error');
      return;
    }
    setPedido({
      id: resultado.pedidoId,
      total: totalPagado,
      entrega: datos.entrega,
      correo: datos.correo.trim(),
    });
    setEstado('exito');
  }

  function reintentar() {
    setMensajeError('');
    setDatos((anteriores) => ({ ...anteriores, tarjeta: '' }));
    setEstado('formulario');
  }

  return (
    <VistaCheckout
      estado={estado}
      items={items}
      total={total}
      datos={datos}
      errores={errores}
      comunas={comunasPorRegion[REGION]}
      mensajeError={mensajeError}
      pedido={pedido}
      onCambio={cambiar}
      onEnviar={enviar}
      onReintentar={reintentar}
    />
  );
}

export default CheckoutContainer;