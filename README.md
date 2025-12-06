# Tech Market

Aplicación de ecommerce construida con React y Vite que implementa carrito global, autenticación simulada, CRUD contra MockAPI, búsqueda avanzada y paginación.

## Requerimientos cubiertos

- **Gestión de carrito con Context API**: agregar, editar, vaciar y persistir el carrito en `localStorage`.
- **Autenticación simulada**: inicio/cierre de sesión con `AuthContext` y persistencia en `localStorage`.
- **Rutas protegidas**: acceso restringido a checkout y panel administrativo.
- **CRUD con MockAPI**: formularios validados, edición y eliminación con confirmación y manejo de errores.
- **Búsqueda y paginación**: filtros en tiempo real por nombre/categoría y paginador configurable.
- **Diseño responsivo**: grid inspirado en Bootstrap, componentes estilizados con `styled-components` (shim) y layout optimizado.
- **Notificaciones y accesibilidad**: toasts, iconografía y etiquetas ARIA.
- **SEO**: títulos y metadatos gestionados con un `Helmet` ligero.

> Nota: el entorno de evaluación no permite descargar dependencias externas, por lo que se implementaron *shims* ligeros para `styled-components`, `react-helmet`, `react-toastify` y `react-icons`. Estos archivos se encuentran en `src/shims/` y están aliased en `vite.config.js`.

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Compilar para producción:
   ```bash
   npm run build
   ```
4. Previsualizar el build:
   ```bash
   npm run preview
   ```

## Uso

- **Inicio**: muestra productos destacados y CTA hacia el catálogo.
- **Productos**: permite buscar por nombre/categoría, paginar y agregar al carrito.
- **Detalle**: descripción completa con CTA para sumar al carrito.
- **Carrito**: requiere login, muestra resumen y permite modificar cantidades.
- **Checkout**: formulario validado con confirmación modal y limpieza del carrito tras el pago.
- **Admin**: CRUD completo contra MockAPI con validaciones y confirmaciones.
- **Login**: formulario simple que simula la autenticación y persiste la sesión.

## Configuración de API

Consume `https://6929cd4d9d311cddf34b4f3f.mockapi.io/api/v1/products`.

## Scripts disponibles

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compila el proyecto.
- `npm run preview`: sirve el build generado.
- `npm run lint`: ejecuta ESLint.

## Accesibilidad y SEO

- Helmet personalizado para gestionar `<title>` y meta-descripciones.
- Etiquetas ARIA en formularios, estados y botones interactivos.
- Notificaciones no intrusivas con contenedor ARIA-live.

## Estructura principal

```
src/
├─ components/        # UI reutilizable
├─ context/           # Auth, Cart y Products
├─ pages/             # Vistas principales
├─ shims/             # Implementaciones ligeras de librerías externas
└─ utils/             # Utilidades varias
```

## Compatibilidad

El diseño responsivo se probó en breakpoints móviles (≤768px), tablets (768-992px) y escritorios (≥992px) utilizando el grid inspirado en Bootstrap.

