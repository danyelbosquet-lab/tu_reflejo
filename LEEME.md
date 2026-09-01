# Tu reflejo — el camino de tus números

Guía de publicación.

## Qué subir

Subí **el contenido de esta carpeta**, no la carpeta en sí:

```
index.html
manifest.webmanifest
sw.js
icons/  (5 archivos)
```

Todo tiene que quedar en el mismo nivel: `sw.js` debe estar en la raíz del sitio
o la app no va a poder controlar las páginas de abajo.

## Publicar en GitHub Pages, paso a paso

1. Creá un repositorio **público** (el plan gratuito no publica repos privados).
2. Subí los archivos **al raíz del repositorio**, no dentro de una carpeta.
   Tiene que verse `index.html` en la primera pantalla del repo.
   El archivo oculto `.nojekyll` va también: evita que GitHub procese el sitio
   con Jekyll y se coma archivos.
3. Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
4. Esperá un minuto. Tu dirección va a ser:
   `https://TUUSUARIO.github.io/NOMBRE-DEL-REPO/`
5. En esa misma pantalla, dejá tildado "Enforce HTTPS".

El nombre del repositorio va a quedar a la vista en la dirección, así que elegilo
pensando en eso.

## Comprobaciones al terminar

- Abrí la dirección en el celular y fijate que aparezca la barra para instalar
  (en iPhone: Compartir → Agregar a pantalla de inicio).
## Si no aparece la opción de instalar

Abrí la app, andá al panel **Tus datos** y mirá la línea de diagnóstico. Te dice
cuál de las cuatro condiciones falla:

- **https ✗** → activá "Enforce HTTPS" en Settings → Pages.
- **manifiesto ✗** → el archivo no se subió o quedó en otra carpeta. Probá
  entrando a `tudireccion/manifest.json`: tenés que ver el texto, no un error 404.
- **modo offline ✗** → `sw.js` no está en la misma carpeta que `index.html`.
- **el navegador todavía no ofrece instalar** → suele ser el navegador y no la app:
  en iPhone nunca hay botón automático (va por Compartir → Agregar a pantalla de
  inicio) y dentro de Instagram, Facebook o WhatsApp tampoco aparece. Abrila en
  Chrome o Safari directo.

## Al publicar una versión nueva

1. Reemplazá `index.html`.
2. Abrí `sw.js` y subí el número: `const VERSION = "v2";`

Ese segundo paso es el importante. Sin él, quien ya tenga la app instalada
puede seguir viendo la versión vieja. Con él, al entrar le aparece la barra
"hay una versión nueva" y actualiza de un toque.

## Antes de largarlo a la gente

- **Ojo con el dominio compartido.** En `TUUSUARIO.github.io` todos tus proyectos
  comparten el mismo origen, así que comparten el almacenamiento del navegador.
  Con una sola app no hay problema; si publicás otra en la misma cuenta, usá
  claves distintas para no pisarte los datos.
- **Elegí el dominio definitivo primero.** Las passkeys quedan atadas al dominio:
  si después te mudás, las huellas registradas dejan de abrir los datos y cada
  usuario va a necesitar su código de recuperación.
- **Descargá las fuentes.** Hoy `index.html` las pide a Google, que es la única
  conexión externa que queda. Bajá los archivos, ponelos en `fonts/` y cambiá el
  `<link>` por un `@font-face` propio.

## Cómo probar que quedó bien

En Chrome, con la app abierta: F12 → Application. Ahí tenés que ver el
manifiesto sin errores, el service worker activo, y en Network podés tildar
"Offline" y recargar: la app tiene que abrir igual.
