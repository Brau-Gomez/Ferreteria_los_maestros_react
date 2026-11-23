// Datos de cobertura de despacho para el mapa (presentacional).
// Sincronizado con la API (catalogoApi.obtenerCobertura).
// La API es la fuente de verdad; esto es solo para renderizado inmediato del mapa.
export const ubicacionTienda = {
  nombre: 'Ferretería Los Maestros',
  direccion: 'Av. del Mar 1234, La Serena',
  posicion: [-29.9045, -71.2519], // [lat, lng] La Serena
};

export const comunasCobertura = [
  {
    comuna: 'La Serena',
    posicion: [-29.9045, -71.2519],
    radio: 15000, // 15 km
  },
  {
    comuna: 'Coquimbo',
    posicion: [-29.9533, -71.3395],
    radio: 15000,
  },
  {
    comuna: 'Ovalle',
    posicion: [-30.6011, -71.1990],
    radio: 10000,
  },
];