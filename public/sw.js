const CACHE_NAME = 'benx-visionx-pwa-v2';
const PRECACHE_ASSETS = [
    '/offline.html',
    '/faceapk.png',
    '/loading.webm',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).catch(() => {})
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                        return null;
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() =>
                caches.match('/offline.html').then((offlinePage) => offlinePage || caches.match(request))
            )
        );
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (
                    response &&
                    response.status === 200 &&
                    response.type === 'basic' &&
                    !request.url.includes('/api/')
                ) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone).catch(() => {});
                    });
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
