// Artículos de blog que aparecen en la portada.
// Portado desde la sección #blog del index.html original.
//
// El destacado de acero solo existe en la portada (el HTML original no
// tenía artículo completo para él); pintura y taladro tienen página
// propia que reutiliza estos mismos datos.
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
    bajada: 'Pintar sobre una superficie fría o húmeda destruye cualquier acabado en pocos meses. Esto es lo que hay que revisar antes de abrir el tarro.',
    detalleAlt: 'Rodillo aplicando pintura sobre un muro de concreto',
    secciones: [
      {
        titulo: 'Por qué la humedad arruina el acabado',
        parrafos: [
          'El concreto es un material poroso: absorbe agua desde el terreno, desde la lluvia y desde el aire cuando la humedad ambiental es alta. Si aplicas pintura sobre un muro que todavía retiene esa humedad, el agua queda atrapada bajo la película y busca salida. El resultado son las burbujas, el descascarado y esas manchas blancas que aparecen a los pocos meses.',
          'En La Serena el problema se agrava en invierno y en las construcciones cercanas al borde costero, donde la humedad relativa se mantiene alta durante buena parte del día.',
        ],
      },
      {
        titulo: 'Mide antes de pintar',
        parrafos: [
          'Un medidor de humedad de superficie cuesta bastante menos que repintar una fachada completa. Como referencia general, el muro debería estar bajo el 5% de humedad antes de aplicar cualquier producto. Si no tienes medidor, existe una prueba casera: pega un trozo de plástico transparente sobre el muro con cinta adhesiva por los cuatro lados y déjalo 24 horas. Si aparecen gotas en la cara interna, el muro todavía está liberando humedad.',
          'En obra nueva, la regla práctica es esperar al menos 28 días desde el vaciado del concreto antes de pintar.',
        ],
      },
      {
        titulo: 'Paso a paso de la preparación',
        ordenada: true,
        lista: [
          'Limpia la superficie.| Retira polvo, restos de pintura suelta y cualquier eflorescencia (ese polvo blanco salino) con espátula y escobilla de acero.',
          'Repara las fisuras.| Rellena grietas con empaste o mortero de reparación y espera su tiempo de secado.',
          'Aplica el sellador.| Un sellador acrílico penetra el poro del concreto, uniforma la absorción y mejora el anclaje de la pintura. En muros con historial de humedad conviene un sellador con impermeabilizante.',
          'Espera el secado del sellador.| Entre 4 y 6 horas en condiciones normales; más si la temperatura es baja.',
          'Pinta en dos manos.| Respeta el tiempo entre manos indicado por el fabricante. Dos manos delgadas duran más que una gruesa.',
        ],
      },
      {
        titulo: '¿Esmalte al agua o al óleo?',
        parrafos: [
          'Para exteriores de concreto, el látex acrílico es la opción más recomendable: permite que el muro respire, deja salir la humedad interna y resiste bien la radiación solar. El esmalte al óleo forma una película más impermeable y de mayor dureza, pero precisamente por eso atrapa la humedad y tiende a descascararse en muros que la retienen. Reserva el óleo para carpintería metálica, rejas y portones.',
          'El esmalte al agua es un punto intermedio: da terminación similar al óleo, seca más rápido y se limpia con agua, pero no reemplaza al látex en superficies de concreto expuestas.',
        ],
      },
      {
        titulo: 'Cuándo no pintar',
        parrafos: [
          'Evita pintar bajo 10 °C, sobre 30 °C, con lluvia pronosticada dentro de las 24 horas siguientes o con viento fuerte. En días fríos, la mejor ventana es entre las 11:00 y las 16:00, cuando el muro ya tomó temperatura.',
        ],
      },
    ],
    cierre: '¿Dudas con tu proyecto? Pásate por el local y te ayudamos a elegir el sellador y la pintura según el tipo de muro y su exposición.',
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
    bajada: 'Torque, autonomía y peso: los tres factores que deciden cuál de los dos te conviene según el trabajo que hagas.',
    detalleAlt: 'Taladro inalámbrico perforando una pieza de madera',
    secciones: [
      {
        titulo: 'La pregunta correcta no es cuál es mejor',
        parrafos: [
          'Es para qué la vas a usar. Un taladro inalámbrico y uno con cable resuelven problemas distintos, y la elección equivocada significa o gastar de más o quedarse corto en plena obra.',
        ],
      },
      {
        titulo: 'Torque: la fuerza de giro',
        parrafos: [
          'El torque se mide en newton metro (Nm) e indica la fuerza con que la herramienta hace girar la broca. Para trabajos domésticos —colgar repisas, armar muebles, perforar madera y tabiquería— un taladro de 30 a 45 Nm sobra. Para perforar concreto, ladrillo o atornillar en madera dura de forma continua, conviene buscar sobre 60 Nm y función percutora.',
          'Los modelos con cable entregan ese torque de manera constante todo el día. Los inalámbricos alcanzan cifras similares en su punto máximo, pero la entrega baja a medida que se descarga la batería.',
        ],
      },
      {
        titulo: 'Autonomía: qué significan los amperios hora',
        parrafos: [
          'En las baterías de litio verás dos números: los voltios (V) y los amperios hora (Ah). Los voltios se relacionan con la potencia disponible; los amperios hora, con cuánto dura antes de recargar.',
        ],
        lista: [
          '12V con 2.0Ah:| liviano y cómodo para trabajos breves y espacios reducidos. Ideal para instaladores y mueblistas.',
          '18V con 4.0Ah o más:| el estándar de obra. Aguanta una jornada de trabajo intermitente sin recargar.',
        ],
      },
      {
        titulo: 'Consejo para ahorrar en baterías',
        parrafos: [
          'Un consejo que ahorra dinero: al comprar inalámbrico, quédate dentro de una misma plataforma de baterías. Así la segunda herramienta la puedes comprar sin batería y compartir las que ya tienes.',
        ],
      },
      {
        titulo: 'Peso y fatiga',
        parrafos: [
          'Aquí el cable gana. Un taladro con cable pesa entre 1,5 y 2 kg; uno inalámbrico con batería de 4.0Ah puede llegar a 2,5 kg. La diferencia no parece mucha hasta que llevas dos horas perforando sobre la cabeza para instalar un cielo falso.',
        ],
      },
      {
        titulo: 'Entonces, ¿cuál te conviene?',
        parrafos: [
          'Elige inalámbrico si te mueves entre distintos puntos de la obra, trabajas en altura o en lugares sin enchufe cercano, o haces reparaciones y visitas a domicilio. La libertad de movimiento compensa el precio mayor.',
          'Elige con cable si trabajas en un banco fijo, necesitas potencia constante durante horas, perforas concreto de forma habitual, o quieres el máximo rendimiento por el precio. Un taladro con cable de gama media rinde como uno inalámbrico bastante más caro.',
          'Si el presupuesto alcanza para uno solo y tu trabajo es variado, el inalámbrico de 18V es la apuesta más versátil. Si ya tienes uno y vas a sumar el segundo, el percutor con cable es el complemento natural.',
        ],
      },
    ],
    cierre: 'En el local puedes probar el peso y el agarre de cada modelo antes de decidir. Te mostramos las diferencias en la mano, que es donde de verdad se notan.',
  },
];
