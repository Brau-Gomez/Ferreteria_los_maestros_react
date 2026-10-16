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
| **oxlint** | Lint, con las reglas de hooks de React activadas |
| **Node** | Pruebas de humo ejecutables (`scripts/smoke-test.mjs`) |

## 🚀 Puesta en marcha

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo → http://localhost:5173
```

Otros comandos:

```bash
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
├── components/           # Header, Footer, ProtectedRoute, ScrollManager
├── context/              # Contextos y providers de sesión y carrito
├── data/                 # Datos estáticos: productos.json, regiones, categorías, blog
├── hooks/                # Hooks custom: useSesion, useCarrito, useProductos
├── pages/                # Vistas de cada ruta
├── services/             # Capa de persistencia (almacenamiento.js)
└── utils/                # Dinero, RUN, claves PBKDF2, imágenes y validaciones
scripts/
└── smoke-test.mjs        # Pruebas de humo ejecutables con Node
```

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
| 5 | Carrito y panel lateral de compra | 🔜 Pendiente |
| 6 | Ingreso y Registro con validaciones | 🔜 Pendiente |
| 7 | Mi cuenta (perfil, pedidos, cuenta corriente) | 🔜 Pendiente |
| 8 | Contacto, artículos de blog y pulido final | 🔜 Pendiente |
| B | Panel de administración con roles (Administrador/Vendedor) | 🔜 Pendiente |
| — | Vistas nuevas de la EP2 (checkout, categorías, ofertas): desarrollo propio del equipo como práctica del framework | 🧑‍💻 Al final de la migración |
| — | Pruebas unitarias de componentes (Jasmine) + ERS V2 + documento de cobertura | 🔜 Pendiente |

## 🧪 Calidad

- `npm run lint`: oxlint sin advertencias sobre el código fuente.
- `node scripts/smoke-test.mjs`: 53 pruebas de la lógica pura portada del original
  (formato de RUN módulo 11, dinero en pesos, huella de claves PBKDF2, validaciones
  de usuarios/productos/contacto, región y comunas, datos del blog).

---

*Proyecto académico — DSY1104 Desarrollo Fullstack II, Evaluación Parcial 2.*

**Integrantes (Grupo 6): Alejandro Maturana - Braulio Gomez** 
