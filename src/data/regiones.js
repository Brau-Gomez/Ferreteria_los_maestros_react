// Región y comunas consideradas por el sitio.
//
// Ajuste acordado con el equipo (Fase 1 del plan de migración): la
// Ferretería Los Maestros atiende y despacha solamente en la Cuarta
// Región de Chile (Región de Coquimbo), así que se descartan las demás
// regiones que traía el proyecto HTML5.
//
// Se conserva la forma de datos del original (objeto por región) para que
// las validaciones y los formularios sigan funcionando igual, y por si el
// negocio se expande más adelante.
//
// Las 15 comunas oficiales, ordenadas alfabéticamente:
//   Elqui:  Andacollo, Coquimbo, La Higuera, La Serena, Paihuano, Vicuña
//   Limarí: Combarbalá, Monte Patria, Ovalle, Punitaqui, Río Hurtado
//   Choapa: Canela, Illapel, Los Vilos, Salamanca
export const comunasPorRegion = {
  'Región de Coquimbo': [
    'Andacollo',
    'Canela',
    'Combarbalá',
    'Coquimbo',
    'Illapel',
    'La Higuera',
    'La Serena',
    'Los Vilos',
    'Monte Patria',
    'Ovalle',
    'Paihuano',
    'Punitaqui',
    'Río Hurtado',
    'Salamanca',
    'Vicuña',
  ],
};
