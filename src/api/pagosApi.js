// Contrato HTTP con la simulacion de la pasarela de pagos.
// El backend devuelve mensajes y estados deterministas; el frontend solo los presenta.
import apiClient from './apiClient.js';

export async function simularPago(pago) {
  // El backend expone /api/payments/simular (no /pagos), y exige JWT.
  const { data } = await apiClient.post('/payments/simular', pago);
  return data;
}
