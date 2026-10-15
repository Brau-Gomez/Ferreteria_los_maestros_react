// Huella digital de la contraseña con PBKDF2.
// Portado desde huellaClave() del js/compartido/utilidades.js original.
// No se guarda el texto de la clave: solo su huella, calculada con una
// "sal" individual por usuario. El navegador hace el cálculo y el original
// devolvía una promesa; aquí usamos async/await, que es lo mismo.
//
// Ojo: crypto.subtle solo existe en contextos seguros (https o localhost),
// igual que en el proyecto HTML5 (por eso pedían usar Live Server).
export async function huellaClave(clave, sal) {
  const codificador = new TextEncoder();
  const llave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(clave),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const resultado = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: codificador.encode(sal),
      iterations: 100000,
      hash: 'SHA-256',
    },
    llave,
    256,
  );
  const numeros = new Uint8Array(resultado);
  let texto = '';
  for (let i = 0; i < numeros.length; i++) {
    texto += numeros[i].toString(16).padStart(2, '0');
  }
  return texto;
}
