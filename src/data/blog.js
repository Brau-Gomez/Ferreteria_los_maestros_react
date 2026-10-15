// Artículos de blog que aparecen en la portada.
// Portado desde la sección #blog del index.html original.
//
// El destacado de acero solo existe en la portada (el HTML original no
// tenía artículo completo para él); pintura y taladro tienen página
// propia que se implementa en la Fase 8 con estos mismos datos.
//
// slug: ruta del artículo (/blog/:slug). Solo los artículos con slug
// muestran el enlace "Leer más" en la portada, como en el original.
export const articulosBlog = [
  {
    slug: null,
    destacado: true,
    categoria: 'Materiales & Estructuras',
    titulo:
      '¿Es confiable el acero importado? Lo que debes saber antes de comprar',
    parrafos: [
      'Buena parte del fierro que circula hoy en el mercado chileno es importado y su calidad puede variar bastante entre un proveedor y otro. Antes de comprar, revisa que las barras vengan marcadas con el sello de la norma NCh204 y exige el certificado de calidad al vendedor.',
      'En Los Maestros trabajamos solo con acero certificado y guardamos la documentación de cada partida, para que puedas respaldar tus obras y cierres perimetrales sin sorpresas.',
    ],
    imagen: '/assets/img/productos/img_portada/barra_aceros.png',
    alt: 'Barras de acero para construcción apiladas',
  },
  {
    slug: 'pintura',
    destacado: false,
    categoria: 'Consejos de Pintura',
    titulo:
      'Humedad y pintura: cómo preparar muros de concreto en temporadas frías',
    parrafos: [
      'Pintar sobre una superficie fría o húmeda destruye cualquier acabado en pocos meses. Descubre el paso a paso para aplicar selladores de superficie, la importancia del medidor de humedad y qué tipo de esmalte al agua o óleo conviene usar según el exterior de tu casa.',
    ],
    imagen: '/assets/img/productos/img_portada/muro_pintura.png',
    alt: 'Pared de concreto lista para pintar',
  },
  {
    slug: 'taladro',
    destacado: false,
    categoria: 'Herramientas',
    titulo:
      '¿Taladro inalámbrico o con cable? Cómo elegir la herramienta correcta para tu taller',
    parrafos: [
      'No siempre la opción inalámbrica es la mejor para todo tipo de trabajo. Analizamos el torque, el peso y la autonomía de las baterías de litio frente a la potencia continua del cable para que no gastes de más en tu próxima compra.',
    ],
    imagen: '/assets/img/productos/img_portada/talabro_trabajo.png',
    alt: 'Taladro inalámbrico sobre una mesa de trabajo',
  },
];
