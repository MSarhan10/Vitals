const CACHE_NAME = 'mirimate-v57'; // <-- Remember to bump this on every update!

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
    './ddx.js', 
    './install-instructions1.jpg',
    './install-instructions2.jpg', 
    './install-instructions3.jpg', 
    'insta.png'
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

// Fetch — Cache First, Fallback to Network
self.addEventListener('fetch', event => {
    // CRITICAL: Only cache GET requests. Let POST/PUT/DELETE pass right through.
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    event.respondWith(
        // Use { ignoreSearch: true } so URLs like /?source=pwa still load offline
        caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
            
            if (cachedResponse) {
                // 1. Serve immediately from cache. 
                // NO background fetch. Let the SW installation handle updates.
                return cachedResponse;
            }

            // 2. If not in cache, fetch from network
            return fetch(event.request).then(networkResponse => {
                // Only cache dynamic network responses if they are valid 200s.
                // (Optional depending on if you want files not in ASSETS_TO_CACHE to be saved)
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // 3. OFFLINE FALLBACK
                // If the network fails entirely and it's a page navigation, 
                // force the cached index.html to load to keep the app shell alive.
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
