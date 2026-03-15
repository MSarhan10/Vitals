const CACHE_NAME = 'mirimate-v40'; // <-- Remember to bump this on every update!

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

// Install — cache all app files, explicitly bypassing the browser's HTTP cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Map strings to Request objects with 'no-cache' to force a true network fetch
            const requests = ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'no-cache' }));
            return cache.addAll(requests);
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
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
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
    // CRITICAL: Only cache GET requests. Let POST/PUT/DELETE pass right through to the network.
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return from cache immediately, fetch in the background to keep it fresh
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
