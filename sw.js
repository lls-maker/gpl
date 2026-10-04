self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('gpl-store-v1').then((cache) => {
      return cache.addAll([
        './index.html',
        './manifest.json',
        './logo.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
