// Formatea un monto en pesos chilenos.
// Portado desde formatearDinero() del js/compartido/utilidades.js original.
export function formatearDinero(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 2,
  }).format(valor);
}
