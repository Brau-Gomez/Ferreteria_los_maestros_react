// Normalización y validación del RUN chileno.
// Portado desde js/validaciones/usuarios.js del proyecto HTML5: se separa
// en su propio módulo porque también lo usan el AuthContext y las
// validaciones de usuario.

// Quita puntos, guiones y espacios, y pasa la K a mayúscula.
export function normalizarRun(run) {
  return String(run)
    .replace(/[.\-\s]/g, '')
    .toUpperCase();
}

// Verifica el dígito verificador con el algoritmo módulo 11.
export function runValido(run) {
  const limpio = normalizarRun(run);
  if (!/^\d{6,8}[\dK]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador++;
    if (multiplicador > 7) multiplicador = 2;
  }
  const resto = 11 - (suma % 11);
  let esperado = String(resto);
  if (resto === 11) esperado = '0';
  if (resto === 10) esperado = 'K';
  return limpio.slice(-1) === esperado;
}
