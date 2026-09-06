/**
 * WEBXHERE STUDIO — Service Worker for High-Speed Device Caching
 * Caches core website assets locally on the user's device so repeat
 * visits load instantly without redundant server/backend requests.
 */

const CACHE_NAME = 'webxhere-cache-v2.1';
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css?v=7.1',
    './app.js?v=2.6',
    './assets/logo.png'
];

// 1. Install: Pre-cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn('[SW] Pre-caching non-fatal issue:', err);
            });
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// 2. Activate: Clean up older cache versions
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
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// 3. Fetch: Cache-First for static assets, Stale-While-Revalidate for navigation
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Only handle GET requests and http/https schemes
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // Bypass caching for analytics or external APIs if needed
    if (url.hostname.includes('calendly.com') || url.hostname.includes('api.web3forms.com')) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version immediately from device (0ms delay)
                // Fetch fresh version in background to update cache (Stale-While-Revalidate)
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, networkResponse.clone());
                        });
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            // If not in cache, fetch from network and cache for future visits
            return fetch(request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // If offline and request is navigation, return cached index
                if (request.mode === 'navigate') {
                    return caches.match('./index.html') || caches.match('./');
                }
            });
        })
    );
});
