# 🔨 Ferretería Los Maestros — Frontend React

Tienda online de la Ferretería Los Maestros (La Serena, Región de Coquimbo),
reescrita como **SPA con React + Bootstrap**. Es la **Evaluación Parcial 2** del
curso **DSY1104 — Desarrollo Fullstack II** (Grupo 6): la migración del sitio
HTML5 original a componentes React reutilizables, conservando el *look & feel*
del proyecto original pero rediseñado desde cero con Bootstrap.

## Stack tecnológico

| Herramienta | Uso |
|---|---|
| **React 19 + Vite 8** | SPA con componentes funcionales y hooks |
| **Bootstrap 5.3 + react-bootstrap 2.10** | Diseño responsivo. No se migró el CSS original: la paleta se mapeó a variables de Bootstrap en `src/theme.css` |
| **React Router 7** | Navegación entre vistas y rutas protegidas por sesión y perfil |
| **Leaflet + react-leaflet** | Mapa de ubicación de la tienda y cobertura de despacho |
| **localStorage** | Persistencia simulada (catálogo, categorías, usuarios, carrito, pedidos y sesión) |
| **Vitest + Testing Library** | Pruebas unitarias de utilidades, componentes y containers (entorno jsdom) y cobertura con `@vitest/coverage-v8` |
| **oxlint** | Lint, con las reglas de hooks de React activadas |
| **Node** | Pruebas de humo ejecutables (`scripts/smoke-test.mjs`) |

> Por indicación docente, las pruebas se implementan con **Vitest** en lugar de
> Jasmine/Karma.

## Puesta en marcha

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo → http://localhost:5173
```

Otros comandos:

```bash
npm run test                 # pruebas unitarias con Vitest
npm run test:coverage        # pruebas + reporte de cobertura (carpeta coverage/)
npm run build                # build de producción
npm run preview              # servir el build generado
npm run lint                 # linter
node scripts/smoke-test.mjs  # 63 pruebas de humo de la lógica pura
```

## Funcionalidades

**Tienda (cliente)**
- Portada con hero, sección Nosotros y blog con artículos completos.
- Catálogo de 85 productos con filtros y búsqueda desde el encabezado.
- Categorías (dinámicas, administrables) y página de ofertas con precio rebajado.
- Detalle de producto y carrito, con panel lateral que se abre al agregar.
- Checkout con elección de retiro en tienda o despacho, pago simulado (aprobado o
  rechazado) y mapa de cobertura de despacho.
- Ingreso y registro con validaciones (RUN módulo 11, dominios de correo, región y comuna).
- Mi cuenta: perfil, historial de pedidos y cuenta corriente de contratistas.
- Contacto con formulario y mapa de ubicación de la tienda.

**Panel de administración (Administrador y Vendedor)**
- Inicio con resumen, productos con stock crítico y CRUD de productos.
- Órdenes con estado, detalle y boleta imprimible.
- Reportes: resumen de ventas, productos más vendidos y ventas por categoría.
- Gestión de categorías (renombrar actualiza los productos; no se puede borrar una
  categoría en uso).
- Gestión de usuarios con historial de compras, y perfil del usuario interno.

**Zona de despacho.** El despacho cubre solo la **Región de Coquimbo** (La Serena,
Coquimbo y Ovalle), por decisión del equipo según el alcance del negocio.

## Estructura del proyecto

```
src/
├── App.jsx               # Router + proveedores (sesión, carrito) + layout
├── main.jsx              # CSS de Bootstrap + theme.css + montaje de la app
├── theme.css             # Paleta del sitio original mapeada a variables Bootstrap
├── setupTests.js         # Configuración de Vitest (jest-dom)
├── components/           # Componentes presentacionales, organizados por Atomic Design
│   ├── atoms/            #   Piezas mínimas (ImagenProducto, PrecioProducto, InsigniaEstado)
│   ├── molecules/        #   Combinaciones simples (CampoFormulario, TarjetaProducto, TarjetaBlog…)
│   ├── organisms/        #   Secciones completas, agrupadas por dominio
│   │   ├── admin/        #     Panel (AdminLayout con control de acceso por perfil…)
│   │   ├── blog/         #     Sección y detalle de artículos
│   │   ├── carrito/      #     PanelCarrito, VistaCarrito, ListaCarrito
│   │   ├── catalogo/     #     Grilla, filtros, ficha, categorías y ofertas
│   │   ├── checkout/     #     Formulario, resumen, pago y mapa de despacho
│   │   ├── cuenta/       #     Perfil, historial y cuenta corriente
│   │   ├── registro/     #     Formularios de ingreso y registro
│   │   └── tienda/       #     Header, Footer, Hero, Nosotros, Contacto
│   ├── ProtectedRoute.jsx#   Ruta que exige sesión activa
│   └── ScrollManager.jsx #   Scroll al cambiar de ruta y soporte de anclas (#nosotros, #blog)
├── containers/           # Containers: estado, efectos, hooks y persistencia de cada vista,
│                         # agrupados por dominio (admin, auth, blog, carrito, catalogo,
│                         # checkout, contacto, cuenta, layout)
├── context/              # Contextos y providers de sesión y carrito
├── data/                 # Datos estáticos: productos.json, regiones, categorías, cobertura, blog
├── hooks/                # Hooks custom: useSesion, useCarrito, useProductos
├── pages/                # Plantillas por dominio (delgadas: delegan en un container)
├── services/             # Capa de persistencia (almacenamiento.js, categorias.js)
└── utils/                # Dinero, RUN, claves PBKDF2, carrito, reportes, estado de pedidos
                          # y validaciones/ (subcarpeta)
scripts/
└── smoke-test.mjs        # Pruebas de humo ejecutables con Node
```

### Arquitectura de componentes

**Atomic Design.** Los componentes de `components/` se organizan en átomos,
moléculas y organismos; las páginas (`pages/`) actúan como plantillas de cada
ruta. Los imports solo fluyen hacia abajo: una página usa organismos, un organismo
usa moléculas y una molécula usa átomos. Átomos y moléculas nunca leen datos
ni usan contextos.

**Alias de imports.** Los módulos se importan con el alias `@` → `src/`
(configurado en `vite.config.js` y `jsconfig.json`), por ejemplo
`import { useCarrito } from '@/hooks/useCarrito'`.

**Container/Presentational.** Cada vista con lógica se divide en dos capas:

- El **container** (`src/containers/`) guarda el estado, usa los hooks y contextos
  (`useCarrito`, `useSesion`, `useProductos`), consulta los servicios, valida y
  persiste. No tiene markup propio.
- Los **componentes presentacionales** (`src/components/`) reciben datos y
  callbacks por props y solo dibujan la interfaz.

Ejemplos:

- `pages/Carrito.jsx` → `CarritoContainer` (estado, sesión y confirmación del
  pedido) → `VistaCarrito` → `ListaCarrito` y `ResumenPedido`.
- El encabezado y el panel lateral del carrito también siguen el patrón:
  `HeaderContainer` → `Header` y `PanelCarritoContainer` → `PanelCarrito`.
- La portada (`pages/Home.jsx`) solo ordena sus secciones:
  `HeroPortada`, `SeccionNosotros` y `SeccionBlog` (que usa la molécula `TarjetaBlog`).

Todas las vistas de cliente y de administración siguen este patrón.

## Cuentas de demostración

Las tres cuentas usan la clave `demo123`.

| Perfil | Correo | Alcance |
|---|---|---|
| Administrador | `admin@duoc.cl` | Todo el panel de administración |
| Vendedor | `vendedor@profesor.duoc.cl` | Listado y detalle de productos (solo lectura), órdenes y su perfil |
| Cliente | `cliente@gmail.com` | Compras, carrito y su cuenta |

## Persistencia

`services/almacenamiento.js` actúa como fuente de datos simulada (similar a una
base de datos) sobre `localStorage`, conservando las claves del proyecto original,
por lo que **el sitio HTML original y esta versión comparten los mismos datos**:

| Clave | Contenido |
|---|---|
| `ep1-products` | Catálogo de 85 productos (se siembra la primera vez) |
| `ep1-categories` | Categorías del catálogo (administrables desde el panel) |
| `ep1-users` | Usuarios registrados + perfiles de demostración |
| `ep1-cart` | Carrito (producto completo + cantidad) |
| `ep1-orders` | Pedidos |
| `ep1-payments` | Abonos de la cuenta corriente de contratistas |
| `ep1-user` | Sesión activa (`{ run }`) |

## Estado del proyecto

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
| 9 | Checkout con pago simulado, categorías y ofertas | ✅ Listo |
| 10 | Mapa de ubicación y cobertura de despacho (Leaflet) | ✅ Listo |
| B | Panel de administración con roles: productos, órdenes, reportes, categorías, usuarios y perfil | ✅ Listo |
| — | Atomic Design + Container/Presentational en todas las vistas | ✅ Listo |
| — | Pruebas unitarias con Vitest | ✅ 115 archivos, 433 pruebas |
| — | ERS V2 + documento de cobertura | ✅ Entregables del equipo |

## Calidad

- `npm run test`: **115 archivos y 433 pruebas** con **Vitest** y **Testing Library**
  (entorno jsdom). Cubren la lógica pura (`utils/`), los servicios, los hooks, los
  contextos, los átomos, moléculas y organismos, los containers y las páginas.
- **Mocks:** se simulan módulos y funciones del navegador con `vi.mock` y `vi.spyOn`
  (por ejemplo `react-leaflet`, el hook `useCarrito`, el módulo de pago,
  `window.confirm`, `window.print` y `Storage.prototype.setItem`).
- `npm run test:coverage`: reporte de cobertura con `@vitest/coverage-v8`.
  Resultado global: **92,63 % sentencias, 83,68 % ramas, 94,76 % funciones y
  93,99 % líneas**. Hooks, datos, páginas y `App.jsx` están al 100 %.
- `npm run lint`: oxlint, sin errores.
- `node scripts/smoke-test.mjs`: 63 pruebas de la lógica pura portada del original
  (formato de RUN módulo 11, dinero en pesos, huella de claves PBKDF2, validaciones
  de usuarios/productos/contacto, región y comunas, datos del blog).

---

*Proyecto académico — DSY1104 Desarrollo Fullstack II, Evaluación Parcial 2.*

**Integrantes (Grupo 6): Alejandro Maturana - Braulio Gomez**