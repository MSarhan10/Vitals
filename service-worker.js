// ============================================================
//  CACHE NAMES
// ============================================================
const APP_CACHE    = 'mirimate-v90';
const STATIC_CACHE = 'mirimate-static-v1';
const TEMP_CACHE   = 'mirimate-temp';      // ← permanent name, never deleted

const NETWORK_TIMEOUT_MS = 15000;

const APP_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './news.js',
    './labs.js',
    './ddx.js',
];

const STATIC_ASSETS = [
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-192.png',
    './icon-maskable-512.png',
    './install-instructions1.jpg',
    './install-instructions2.jpg',
    './install-instructions3.jpg',
    './insta.png',
];

// ============================================================
//  HELPERS
// ============================================================
async function cacheAssets(cacheName, urls, forceRevalidate = false) {
    const cache = await caches.open(cacheName);
    await Promise.allSettled(
        urls.map(url => {
            const request = new Request(url, forceRevalidate ? { cache: 'no-cache' } : {});
            return fetch(request)
                .then(response => {
                    if (response && response.ok) return cache.put(url, response);
                })
                .catch(() => console.warn(`[SW] Failed to cache: ${url}`));
        })
    );
}

async function cacheHas(cacheName, url) {
    const match = await caches.match(url);
    return !!match;
}

// ============================================================
//  TEMP INDEX HELPERS
//  The temp cache holds a single entry: a ready-to-serve copy
//  of index.html. It is written on first install and refreshed
//  silently every time a background update succeeds.
// ============================================================

/** Write (or overwrite) the temp index from a Response object */
async function writeTempIndex(response) {
    const cache = await caches.open(TEMP_CACHE);
    await cache.put('./index.html', response.clone());
    console.log('[SW] Temp index updated.');
}

/** Return the temp index if it exists, otherwise fall back to APP_CACHE */
async function getTempIndex() {
    const tempCache = await caches.open(TEMP_CACHE);
    const temp = await tempCache.match('./index.html');
    if (temp) return temp;
    // First ever launch before temp is written — fall back to app cache
    return caches.match('./index.html');
}

/** 
 * Background update for index.html.
 * Tries to fetch a fresh copy; on success updates both APP_CACHE and TEMP_CACHE.
 * Totally silent on failure — the existing temp copy keeps working.
 */
async function backgroundUpdateIndex() {
    try {
        const response = await fetch('./index.html', { cache: 'no-cache' });
        if (!response || !response.ok) return;

        // Update the versioned app cache
        const appCache = await caches.open(APP_CACHE);
        await appCache.put('./index.html', response.clone());

        // Update the permanent temp copy
        await writeTempIndex(response);

        console.log('[SW] Background index update succeeded.');
    } catch {
        console.log('[SW] Background index update failed — temp copy still in use.');
    }
}

// ============================================================
//  INSTALL
// ============================================================
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            await cacheAssets(APP_CACHE, APP_ASSETS, true);

            // Seed the temp index from the freshly cached response
            const freshIndex = await caches.match('./index.html');
            if (freshIndex) {
                await writeTempIndex(freshIndex);
            }

            const existingCaches = await caches.keys();
            if (!existingCaches.includes(STATIC_CACHE)) {
                console.log('[SW] Caching static assets for the first time.');
                await cacheAssets(STATIC_CACHE, STATIC_ASSETS, false);
            } else {
                console.log('[SW] Static cache already up to date — skipping.');
            }
        })()
    );
    self.skipWaiting();
});

// ============================================================
//  ACTIVATE
//  TEMP_CACHE is intentionally excluded from deletion — it is
//  permanent and version-independent.
// ============================================================
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const newAppCacheHealthy = await cacheHas(APP_CACHE, './index.html');

            if (!newAppCacheHealthy) {
                console.warn('[SW] Activate: new app cache incomplete — preserving old caches.');
                await self.clients.claim();
                return;
            }

            const allKeys = await caches.keys();
            await Promise.all(
                allKeys
                    .filter(key => {
                        if (key === TEMP_CACHE) return false; // ← never delete temp
                        if (key.startsWith('mirimate-v') && !key.startsWith('mirimate-static-') && key !== APP_CACHE) return true;
                        if (key.startsWith('mirimate-static-') && key !== STATIC_CACHE) return true;
                        return false;
                    })
                    .map(key => {
                        console.log(`[SW] Deleting old cache: ${key}`);
                        return caches.delete(key);
                    })
            );

            await self.clients.claim();

            const clients = await self.clients.matchAll();
            clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        })()
    );
});

// ============================================================
//  FETCH
//
//  NAVIGATION REQUESTS (loading the app itself):
//    1. Serve the temp index IMMEDIATELY — zero wait, works offline.
//    2. Fire a background update. If it succeeds, both the app
//       cache and temp cache are refreshed for the next load.
//
//  ALL OTHER REQUESTS (JS, images, etc.):
//    Network-first with timeout → cache fallback (unchanged).
// ============================================================
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    // ── Navigation: instant temp + silent background update ──
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const tempResponse = await getTempIndex();

                if (tempResponse) {
                    // Serve immediately, update silently in background
                    event.waitUntil(backgroundUpdateIndex());
                    return tempResponse;
                }

                // No temp or cached copy at all — must wait for network
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.ok) {
                        await writeTempIndex(networkResponse);
                    }
                    return networkResponse;
                } catch {
                    // Absolute last resort (should never reach here after first load)
                    return new Response('<h1>App unavailable offline</h1>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
            })()
        );
        return;
    }

    // ── All other assets: network-first with timeout ──
    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request, { ignoreSearch: true });

            const networkFetch = fetch(event.request.clone())
                .then(async networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const isStatic = STATIC_ASSETS.some(a =>
                            event.request.url.endsWith(a.replace('./', '/')) ||
                            event.request.url.includes(a.replace('./', ''))
                        );
                        const targetCache = isStatic ? STATIC_CACHE : APP_CACHE;
                        const cache = await caches.open(targetCache);
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });

            if (cachedResponse) {
                const timeout = new Promise(resolve =>
                    setTimeout(() => resolve('TIMEOUT'), NETWORK_TIMEOUT_MS)
                );
                try {
                    const result = await Promise.race([networkFetch, timeout]);
                    if (result === 'TIMEOUT' || !result) {
                        networkFetch.catch(() => {});
                        return cachedResponse;
                    }
                    return result;
                } catch {
                    return cachedResponse;
                }
            } else {
                try {
                    return await networkFetch;
                } catch {
                    if (event.request.mode === 'navigate') {
                        return getTempIndex();
                    }
                }
            }
        })()
    );
});
