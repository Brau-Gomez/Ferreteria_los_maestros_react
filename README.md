# 🔨 Ferretería Los Maestros — Frontend React

Tienda online de la Ferretería Los Maestros (La Serena, Región de Coquimbo),
reescrita como **SPA con React + Bootstrap**. Es la **Evaluación Parcial 2** del
curso **DSY1104 — Desarrollo Fullstack II** (Grupo 6): la migración del sitio
HTML5 original a componentes React reutilizables, conservando el *look & feel* del proyecto original pero
rediseñado desde cero con Bootstrap.

## 🧰 Stack tecnológico

| Herramienta | Uso |
|---|---|
| **React 19 + Vite 8** | SPA con componentes funcionales y hooks |
| **Bootstrap 5.3 + react-bootstrap 2.10** | Diseño responsivo. No se migró el CSS original: la paleta se mapeó a variables de Bootstrap en `src/theme.css` |
| **React Router 7** | Navegación entre vistas |
| **localStorage** | Persistencia simulada (catálogo, usuarios, carrito, pedidos y sesión) |
| **Vitest + Testing Library** | Pruebas unitarias de utilidades, componentes y containers (entorno jsdom) |
| **oxlint** | Lint, con las reglas de hooks de React activadas |
| **Node** | Pruebas de humo ejecutables (`scripts/smoke-test.mjs`) |

## 🚀 Puesta en marcha

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo → http://localhost:5173
```

Otros comandos:

```bash
npm run test                 # pruebas unitarias con Vitest
npm run build                # build de producción
npm run preview              # servir el build generado
npm run lint                 # linter
node scripts/smoke-test.mjs  # 53 pruebas de humo de la lógica pura
```

## 🗂️ Estructura del proyecto

```
src/
├── App.jsx               # Router + proveedores (sesión, carrito) + layout
├── main.jsx              # CSS de Bootstrap + theme.css + montaje de la app
├── theme.css             # Paleta del sitio original mapeada a variables Bootstrap
├── setupTests.js         # Configuración de Vitest (jest-dom)
├── components/           # Componentes presentacionales, organizados por Atomic Design
│   ├── atoms/            #   Piezas mínimas (ImagenProducto)
│   ├── molecules/        #   Combinaciones simples (CampoFormulario, TarjetaProducto, FilaCarrito…)
│   ├── organisms/        #   Secciones completas (Header, Footer, FormularioIngreso, VistaCarrito…)
│   └── admin/            #   Componentes del panel de administración
├── containers/           # Containers: estado, efectos y lógica de cada vista
├── context/              # Contextos y providers de sesión y carrito
├── data/                 # Datos estáticos: productos.json, regiones, categorías, blog
├── hooks/                # Hooks custom: useSesion, useCarrito, useProductos
├── pages/                # Vistas de cada ruta (delgadas: delegan en un container)
├── services/             # Capa de persistencia (almacenamiento.js)
└── utils/                # Dinero, RUN, claves PBKDF2, imágenes y validaciones
scripts/
└── smoke-test.mjs        # Pruebas de humo ejecutables con Node
```

### Arquitectura de componentes

**Atomic Design.** Los componentes de `components/` se organizan en átomos,
moléculas y organismos; las páginas (`pages/`) actúan como plantillas de cada
ruta. Los imports solo fluyen hacia abajo: una página usa organismos, un organismo
usa moléculas y una molécula usa átomos. Átomos y moléculas nunca leen datos
ni usan contextos.

**Container/Presentational.** Cada vista con lógica se divide en dos capas:

- El **container** (`src/containers/`) guarda el estado, usa los hooks y contextos
  (`useCarrito`, `useSesion`, `useProductos`), valida y persiste. No tiene markup propio.
- Los **componentes presentacionales** (`src/components/`) reciben datos y
  callbacks por props y solo dibujan la interfaz.

Ejemplo: `pages/Carrito.jsx` → `CarritoContainer` (estado, sesión y confirmación del
pedido) → `VistaCarrito` → `ListaCarrito` y `ResumenPedido` (presentacionales).

Vistas separadas con este patrón: Contacto, Catálogo, Detalle de producto, Carrito,
Ingreso, Registro y Mi cuenta.

## 👥 Cuentas de demostración

Las tres cuentas usan la clave `demo123`.

| Perfil | Correo | Alcance |
|---|---|---|
| Administrador | `admin@duoc.cl` | Todo el panel de administración |
| Vendedor | `vendedor@profesor.duoc.cl` | Solo listado y detalle de productos del panel |
| Cliente | `cliente@gmail.com` | Compras, carrito y su cuenta |

## 💾 Persistencia

`services/almacenamiento.js` actúa como fuente de datos simulada (similar a una
base de datos) sobre `localStorage`, conservando las claves del proyecto original,
por lo que **el sitio HTML original y esta versión comparten los mismos datos**:

| Clave | Contenido |
|---|---|
| `ep1-products` | Catálogo de 85 productos (se siembra la primera vez) |
| `ep1-users` | Usuarios registrados + perfiles de demostración |
| `ep1-cart` | Carrito (producto completo + cantidad) |
| `ep1-orders` | Pedidos |
| `ep1-payments` | Abonos de la cuenta corriente de contratistas |
| `ep1-user` | Sesión activa (`{ run }`) |

## 📈 Estado del proyecto

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Setup React + Bootstrap, assets, Header/Footer | ✅ Listo |
| 1 | Módulos base: datos, utilidades, validaciones, persistencia | ✅ Listo |
| 2 | Contextos de sesión y carrito, hooks, rutas y layout reactivo | ✅ Listo |
| 3 | Portada: hero, Nosotros y blog | ✅ Listo |
| 4 | Catálogo con filtros + detalle de producto | ✅ Listo |
| 5 | Carrito y panel lateral de compra | ✅ Listo |
| 6 | Ingreso y Registro con validaciones | ✅ Listo |
| 7 | Mi cuenta (perfil, pedidos, cuenta corriente) | ✅ Listo |
| 8 | Contacto, artículos de blog y pulido final | ✅ Listo |
| B | Panel de administración con roles (Administrador/Vendedor) | ✅ Listo |
| — | Refactor a Atomic Design + Container/Presentational | ✅ Listo en las vistas de cliente |
| — | Pruebas unitarias con Vitest | ✅ 31 archivos, 119 pruebas |
| — | Vistas nuevas de la EP2 (checkout, categorías, ofertas): desarrollo propio del equipo como práctica del framework | 🧑‍💻 Al final de la migración |
| — | ERS V2 + documento de cobertura | 🔜 Pendiente |

## 🧪 Calidad

- `npm run test`: pruebas unitarias con **Vitest** y **Testing Library** (entorno jsdom).
  Cubren la lógica pura (`utils/`), las moléculas, los organismos y los containers
  (filtros del catálogo, carrito, validaciones de ingreso y registro, cuenta corriente).
- `npm run lint`: oxlint sin advertencias sobre el código fuente.
- `node scripts/smoke-test.mjs`: 53 pruebas de la lógica pura portada del original
  (formato de RUN módulo 11, dinero en pesos, huella de claves PBKDF2, validaciones
  de usuarios/productos/contacto, región y comunas, datos del blog).

---

*Proyecto académico — DSY1104 Desarrollo Fullstack II, Evaluación Parcial 2.*

**Integrantes (Grupo 6): Alejandro Maturana - Braulio Gomez**