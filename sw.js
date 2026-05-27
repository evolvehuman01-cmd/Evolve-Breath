/* Evolve:Breath — Service Worker
   Caches the app shell for full offline use.
   Uses a cache-first strategy so the app loads instantly.
*/

var CACHE_NAME = 'evolve-breath-v1';

var ASSETS = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap'
];

/* Install: cache all core assets */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      /* Cache local assets reliably; Google Fonts may fail offline — that's ok */
      return cache.addAll(['./index.html', './manifest.json'])
        .then(function() {
          return cache.add('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap')
            .catch(function() { /* fonts unavailable offline — graceful degradation */ });
        });
    })
  );
});

/* Activate: clean up old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key)   { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Fetch: cache-first, fall back to network */
self.addEventListener('fetch', function(event) {
  /* Only handle GET requests */
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      /* Not in cache — fetch from network and cache for next time */
      return fetch(event.request).then(function(response) {
        /* Only cache valid responses */
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        /* Offline and not cached — return offline fallback for HTML requests */
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
