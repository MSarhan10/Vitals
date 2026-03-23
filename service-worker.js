// ============================================================
//  CACHE NAMES
//  • APP_CACHE    → bump on every release (JS, HTML, manifest)
//  • STATIC_CACHE → only bump when images actually change
// ============================================================
const APP_CACHE    = 'mirimate-v65';       // ← bump every release
const STATIC_CACHE = 'mirimate-static-v1'; // ← only bump when icons/images change

// How long to wait for the network before falling back to cache
const NETWORK_TIMEOUT_MS = 15000;

// Core app files — re-fetched fresh on every update
const APP_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './news.js',
    './labs.js',
    './ddx.js',
];

// Static assets — only re-fetched when STATIC_CACHE version is bumped
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

// Cache a list of URLs into a named cache, failing gracefully per asset.
// Uses `allSettled` so one slow/failed request never aborts the whole batch.
async function cacheAssets(cacheName, urls, forceRevalidate = false) {
    const cache = await caches.open(cacheName);
    await Promise.allSettled(
        urls.map(url => {
            const request = new Request(url, forceRevalidate ? { cache: 'no-cache' } : {});
            return fetch(request)
                .then(response => {
                    if (response && response.ok) {
                        return cache.put(url, response);
                    }
                })
                .catch(() => {
                    console.warn(`[SW] Failed to cache: ${url}`);
                });
        })
    );
}

// Returns true if a given cache contains a specific URL (used as a health check)
async function cacheHas(cacheName, url) {
    const match = await caches.match(url);
    return !!match;
}

// ============================================================
//  INSTALL
//  • App assets: always force-revalidate (no-cache) so updates land immediately
//  • Static assets: skip if STATIC_CACHE already exists — no need to re-download
//    unchanged images. New users will still get them on first install.
// ============================================================
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            // Always re-fetch app assets fresh
            await cacheAssets(APP_CACHE, APP_ASSETS, true);

            // Only cache static assets if this static cache version doesn't exist yet
            const existingCaches = await caches.keys();
            if (!existingCaches.includes(STATIC_CACHE)) {
                console.log('[SW] First time seeing this static cache version — caching images.');
                await cacheAssets(STATIC_CACHE, STATIC_ASSETS, false);
            } else {
                console.log('[SW] Static cache already up to date — skipping image download.');
            }
        })()
    );
    self.skipWaiting();
});

// ============================================================
//  ACTIVATE
//  • Delete old APP_CACHE versions (mirimate-v*) but only if the new one is healthy
//  • Delete old STATIC_CACHE versions (mirimate-static-v*) if we have a new one
//  • Never touch a cache that belongs to the current version
// ============================================================
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const newAppCacheHealthy = await cacheHas(APP_CACHE, './index.html');

            if (!newAppCacheHealthy) {
                // New app cache is incomplete (bad connection during install).
                // Keep old caches alive and don't notify clients to reload.
                console.warn('[SW] Activate: new app cache is incomplete — preserving old caches.');
                await self.clients.claim();
                return;
            }

            const allKeys = await caches.keys();
            await Promise.all(
                allKeys
                    .filter(key => {
                        // Delete old app cache versions
                        if (key.startsWith('mirimate-v') && !key.startsWith('mirimate-static-') && key !== APP_CACHE) return true;
                        // Delete old static cache versions
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
//  Strategy: Network-first with timeout, cache fallback.
//
//  If we have a cached version:
//    • Race the network against NETWORK_TIMEOUT_MS
//    • Network wins  → serve fresh, update cache in background
//    • Timeout wins  → serve cache NOW, network keeps running to update cache
//    • Network error → serve cache
//
//  If nothing cached:
//    • Wait for network with no timeout (nothing to fall back to)
//    • Network fails + navigation → last resort: serve cached index.html
// ============================================================
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    event.respondWith(
        (async () => {
            // Check both caches — static assets might live in STATIC_CACHE
            const cachedResponse =
                await caches.match(event.request, { ignoreSearch: true });

            // Build a network fetch that also updates whichever cache the asset belongs to
            const networkFetch = fetch(event.request.clone())
                .then(async networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const isStatic = STATIC_ASSETS.some(a =>
                            event.request.url.endsWith(a.replace('./', '/'))
                            || event.request.url.includes(a.replace('./', ''))
                        );
                        const targetCache = isStatic ? STATIC_CACHE : APP_CACHE;
                        const cache = await caches.open(targetCache);
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });

            if (cachedResponse) {
                // Race: network vs timeout
                const timeout = new Promise(resolve =>
                    setTimeout(() => resolve('TIMEOUT'), NETWORK_TIMEOUT_MS)
                );

                try {
                    const result = await Promise.race([networkFetch, timeout]);

                    if (result === 'TIMEOUT' || !result) {
                        console.log('[SW] Network too slow — serving from cache, updating in background.');
                        networkFetch.catch(() => {}); // let it finish silently
                        return cachedResponse;
                    }
                    return result;
                } catch {
                    console.log('[SW] Network error — falling back to cache.');
                    return cachedResponse;
                }

            } else {
                // Nothing in cache — just wait for the network
                try {
                    return await networkFetch;
                } catch {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                }
            }
        })()
    );
});
