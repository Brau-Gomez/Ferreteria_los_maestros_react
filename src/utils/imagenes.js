// Resuelve la ruta pública de una imagen.
// Adaptado de rutaImagen() del js/compartido/utilidades.js original.
//
// Diferencia con el original: allí cada página declaraba data-raiz y
// rutaFrontend() armaba la ruta según la carpeta del HTML. En la SPA no
// hay carpetas: los assets viven en public/assets y se sirven desde la
// raíz del sitio, así que convertimos "assets/..." en "/assets/...".
//
// Reglas que se conservan tal cual:
// - Las imágenes subidas por el admin (dataURL) pasan sin cambios.
// - Se remapean carpetas legadas del proyecto anterior.
// - Se bloquea cualquier ruta que no parta en assets/ (seguridad básica).
export function resolverImagen(imagen) {
  if (!imagen) return '';
  if (imagen.startsWith('data:image/')) return imagen;
  let ruta = imagen.replace(
    'assets/img/img_corregidas/',
    'assets/img/productos/',
  );
  ruta = ruta.replace(
    'assets/img/imagenes_sin_formato/',
    'assets/img/productos/originales/',
  );
  if (!ruta.startsWith('assets/')) return '';
  return '/' + ruta;
}
