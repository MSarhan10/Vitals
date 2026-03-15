const CACHE_NAME = 'mirimate-v34';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-192.png',
    './icon-maskable-512.png',
    './news.js',
    './labs.js',
    './ddx.js'
];

// Install — cache all app files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate — clean up old caches, claim clients, THEN notify
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key)) // Deletes old versions like v33
                );
            })
            .then(() => self.clients.claim())          // ← chained properly now
            .then(() => self.clients.matchAll())
            .then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'SW_UPDATED' }); // ← tell the page to reload
                });
            })
    );
});

// Fetch — serve from cache first, fall back to network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.origin !== location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return from cache immediately, but fetch in the background to update the cache
                fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            // If not in cache, fetch from network and add to cache
            return fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
