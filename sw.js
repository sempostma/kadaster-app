var DYNAMIC_CACHE = 'dynamic-cache-v1';
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
                    if (!networkResponse || (networkResponse.status !== 200 && !networkResponse.ok)) {
                        return caches.open(DYNAMIC_CACHE).then(function (dynCache) {
                            return dynCache.match(event.request);
                        }).then(function (dynResponse) {
                            if (dynResponse) return dynResponse;
                            else return networkResponse;
                        });
                    }
                    var cachedResponse = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then(function (dynCache) {
                        dynCache.put(event.request, cachedResponse);
                    });
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
                    './',
                    './index.html',
                    './lib/onsen/css/onsenui.css',
                    './lib/onsen/css/onsen-css-components.min.css',
                    './css/index.css',
                    './lib/onsen/js/onsenui.min.js',
                    './js/admob.js',
                    './cordova.js',
                    './js/core.js',
                    './js/index.js',
                    './js/interactivity.js',
                    './lib/onsen/css/font_awesome/css/font-awesome.min.css',
                    './lib/onsen/css/ionicons/css/ionicons.min.css',
                    './lib/onsen/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
                    './lib/onsen/css/ionicons/fonts/ionicons.ttf',
                    './cordova_plugins.js',
                    './plugins/cordova-plugin-admobpro/www/AdMob.js',
                    './plugins/cordova-plugin-device/www/device.js',
                    './plugins/cordova-plugin-device/src/browser/DeviceProxy.js',
                    './plugins/cordova-plugin-dialogs/www/notification.js',
                    './plugins/cordova-plugin-dialogs/www/browser/notification.js',
                    './js/browser.js',
                ]
            );
        })
    );
});