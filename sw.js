/* Service worker de "Tu reflejo".
   Estrategia deliberada:
   - la app (index.html) se pide primero a la red, para que una versión nueva llegue
     siempre que haya señal, y se cae al caché cuando no hay;
   - el resto de lo propio (íconos, manifiesto) se sirve del caché;
   - nada de terceros se guarda: las fuentes, si no hay red, caen a las del sistema.
   Cambiar VERSION en cada publicación: eso borra el caché viejo y evita
   que alguien quede clavado en una versión anterior. */
const VERSION = "v5";
const CACHE = `tu-reflejo-${VERSION}`;
const PRECARGA = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

/* Se cachea archivo por archivo a propósito: con addAll, un solo archivo que
   falte cancela la instalación entera y el service worker nunca se activa.
   Así, si falta un ícono, la app igual funciona offline. */
self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(PRECARGA.map(u => c.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* el aviso "hay una versión nueva" dispara esto */
self.addEventListener("message", e => {
  if (e.data === "actualizar") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // fuentes y terceros: sin tocar

  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const fresca = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("./index.html", fresca.clone());
        return fresca;
      } catch (err) {
        const c = await caches.open(CACHE);
        return (await c.match("./index.html")) || (await c.match("./")) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const guardada = await c.match(req);
    if (guardada) return guardada;
    try {
      const fresca = await fetch(req);
      if (fresca && fresca.status === 200 && fresca.type === "basic") c.put(req, fresca.clone());
      return fresca;
    } catch (err) {
      return Response.error();
    }
  })());
});
