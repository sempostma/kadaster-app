var STATIC_CACHE = 'static-cache-v1'

// listen for outgoing network request
self.addEventListener('fetch', function(event) {
    // try to find response object in the cache
    // associated with current request
    event.respondWith(
        caches.open(STATIC_CACHE).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                if (response) return response;

                return fetch(event.request).then(function (networkResponse) {
                    return networkResponse;
                });
            });
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('service worker activate');
});

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(function (cache) {
            return cache.addAll(
                [
                    
                ]
            );
        })
    );
});