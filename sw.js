// Horizonte: guarda o jogo e as imagens já abertas no aparelho para jogar sem internet.
const CACHE = 'horizonte-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'fotos/amsterda-mini.jpg', 'fotos/dubai-mini.jpg', 'fotos/edimburgo-mini.jpg', 'fotos/fuji-lago-mini.jpg', 'fotos/fuji-pagode-mini.jpg', 'fotos/golden-gate-mini.jpg', 'fotos/grand-canyon-mini.jpg', 'fotos/havana-mini.jpg', 'fotos/islandia-mini.jpg', 'fotos/lisboa-mini.jpg', 'fotos/londres-mini.jpg', 'fotos/londres-nevoa-mini.jpg', 'fotos/machu-lhamas-mini.jpg', 'fotos/machu-picchu-mini.jpg', 'fotos/paris-mini.jpg', 'fotos/piramides-mini.jpg', 'fotos/rio-alto-mini.jpg', 'fotos/rio-mini.jpg', 'fotos/santorini-escadas-mini.jpg', 'fotos/santorini-mini.jpg', 'fotos/veneza-mini.jpg', 'fotos/veneza-tarde-mini.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !fonts) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
    return r;
  })));
});
