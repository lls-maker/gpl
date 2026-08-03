const CACHE_NAME = 'gpl-2026-cache-v1';
const ASSETS = [
    './',
    './index.html',
    'https://flaticon.com'
];

// Instalação do Service Worker e armazenamento do layout em cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Intercepta as requisições para fazer o site carregar offline instantaneamente
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});
