const CACHE_NAME = 'gpl-v2';

// Arquivos locais essenciais e CDNs externas vitais para o app rodar
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    // CDNs externas essenciais para gráficos e banco de dados
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
];

// Instalação: armazena os recursos essenciais em cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Ativação: assume o controle imediatamente e limpa versões antigas de cache
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptação com Cache Dinâmico e Fallback Offline
self.addEventListener('fetch', (event) => {
    // Ignora requisições que não sejam GET (como gravações do Firestore)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            // Se não está no cache, busca na rede e salva no cache dinamicamente
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Se a rede falhar e for navegação de página, retorna o index.html do cache
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
