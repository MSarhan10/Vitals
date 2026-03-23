const CACHE_NAME = 'mirimate-v65'; // <-- Remember to bump this on every update!

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

// How long to wait for the network before falling back to cache (ms)
const NETWORK_TIMEOUT_MS = 15000;

// --- Install ---
// Cache assets individually so one slow/failed request doesn't wipe out the whole cache.
// If we're on a terrible connection, we'd rather have a partial new cache (or none)
// than lose the existing good cache — activate handles that check.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => {
                    const request = new Request(url, { cache: 'no-cache' });
                    return fetch(request)
                        .then(response => {
                            if (response && response.ok) {
                                return cache.put(url, response);
                            }
                        })
                        .catch(() => {
                            // One asset failed — log it but don't abort the whole install
                            console.warn(`[SW] Install: failed to cache ${url}`);
                        });
                })
            );
        })
    );
    self.skipWaiting();
});

// --- Activate ---
// Before nuking old caches, verify the new cache actually has the most critical
// asset (index.html). If it doesn't (e.g. install ran offline), keep the old cache alive.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.match('./index.html').then(hasIndex => {
            // Only clean up old caches if the new one has the app shell
            const shouldClean = !!hasIndex;

            return caches.keys()
                .then(keys => {
                    if (!shouldClean) {
                        console.warn('[SW] Activate: new cache is incomplete, keeping old caches.');
                        return Promise.resolve();
                    }
                    return Promise.all(
                        keys
                            .filter(key => key !== CACHE_NAME)
                            .map(key => caches.delete(key))
                    );
                })
                .then(() => self.clients.claim())
                .then(() => self.clients.matchAll())
                .then(clients => {
                    if (shouldClean) {
                        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
                    }
                });
        })
    );
});

// --- Fetch ---
// Strategy: Network-first with timeout, falling back to cache.
//
// • If we have a cached version: race the network against a 15s timer.
//     - Network wins  → return fresh response, update cache, done.
//     - Timer wins    → return cache immediately, let the network request
//                       continue in the background to update the cache for
//                       next time.
//     - Network error → return cache immediately.
//
// • If no cached version: wait for network (no point timing out with nothing to show).
//     - If that also fails and it's a navigation, serve index.html as last resort.
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {

            // Shared network fetch — also updates the cache on success
            const networkFetch = fetch(event.request.clone())
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return networkResponse;
                });

            if (cachedResponse) {
                // We have something to show — race network vs timeout
                const timeoutRace = new Promise(resolve =>
                    setTimeout(() => resolve('TIMEOUT'), NETWORK_TIMEOUT_MS)
                );

                return Promise.race([networkFetch, timeoutRace])
                    .then(result => {
                        if (result === 'TIMEOUT' || !result) {
                            // Slow connection: serve cache now, network will update it in bg
                            console.log('[SW] Network too slow, serving from cache.');
                            // Let networkFetch keep running silently in the background
                            networkFetch.catch(() => {});
                            return cachedResponse;
                        }
                        // Network was fast enough
                        return result;
                    })
                    .catch(() => {
                        // Network error: serve from cache
                        console.log('[SW] Network error, falling back to cache.');
                        return cachedResponse;
                    });

            } else {
                // Nothing cached — just wait for the network
                return networkFetch.catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            }
        })
    );
});
