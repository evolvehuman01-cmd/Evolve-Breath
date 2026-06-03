/* Evolve:Breath — Service Worker
   Cache version: bump CACHE_VERSION by 1 every time you deploy an update.
   This forces users to receive the latest version of the app.
*/

var CACHE_VERSION = 3;
var CACHE_NAME = 'evolve-breath-v' + CACHE_VERSION;

/* Install: cache all core assets */
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(['./index.html', './manifest.json'])
        .then(function() {
          return cache.add('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Poppins:wght@300;400;500&display=swap')
            .catch(function() { /* fonts unavailable offline — graceful degradation */ });
        });
    })
  );
});

/* Activate: delete all old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key)   { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Fetch: cache-first, fall back to network */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
