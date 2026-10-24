// Ubicación de la ferretería y zona de cobertura de despacho (RF-10 del ERS).
// El despacho se limita a la Región de Coquimbo (ver data/regiones.js).
export const ubicacionTienda = {
  nombre: 'Ferretería Los Maestros',
  direccion: 'Av. Francisco de Aguirre 1234, La Serena',
  posicion: [-29.9027, -71.252],
};

// Cada comuna con cobertura: centro y radio aproximado en metros.
export const comunasCobertura = [
  { comuna: 'La Serena', posicion: [-29.9027, -71.252], radio: 7000 },
  { comuna: 'Coquimbo', posicion: [-29.9533, -71.3436], radio: 7000 },
  { comuna: 'Ovalle', posicion: [-30.5983, -71.2003], radio: 9000 },
];