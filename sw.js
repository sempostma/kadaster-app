var STATIC_CACHE = 'static-cache-v2'

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
    var cacheWhitelist = [STATIC_CACHE];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(function (cache) {
            return cache.addAll(
                [
                    "./",
                    "./index.html",
                    "./css/lib/onsen/css/onsenui.min.css",
                    "./css/lib/onsen/css/onsen-css-components.min.css",
                    "./css/style.min.css",
                    "./cordova.js",
                    "./js/app.min.js",
                    "https://cdn.polyfill.io/v2/polyfill.min.js",
                    "./manifest.json",
                    "./css/lib/onsen/css/ionicons/css/ionicons.min.css",
                    "./css/lib/onsen/css/material-design-iconic-font/css/material-design-iconic-font.min.css",
                    "./css/lib/onsen/css/font_awesome/css/font-awesome.min.css",
                    "./cordova_plugins.js",
                    "./plugins/cordova-plugin-admobpro/www/AdMob.js",
                    "./plugins/cordova-plugin-device/www/device.js",
                    "./plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
                    "./plugins/cordova-plugin-dialogs/www/notification.js",
                    "./plugins/cordova-plugin-dialogs/www/browser/notification.js",
                    "./data/gemeente-codes.json",
                    "./views/splitter.html",
                    "./images/meta-icons/favicon-32x32.png",
                    "./images/meta-icons/android-chrome-144x144.png",
                    "./js/browser.js",
                    "./images/meta-icons/favicon-16x16.png",
                    "./views/map.html",
                    "./views/map.html",
                    "./images/meta-icons/android-chrome-192x192.png",
                    "./css/lib/onsen/css/material-design-iconic-font/fonts/Material-Design-Iconic-Font.woff2",
                    "./views/about.html",
                    "./images/screenshot1.png",
                    "./images/screenshot2.png",
                    "./images/screenshot3.png",
                    "./images/screenshot4.png",
                    "./images/screenshot5.png",
                    "./views/search.html",
                    "./views/details.html",
                    "./views/details-general.html",
                    "./views/details-panden.html",
                    "./views/details-verblijfplaatsen.html",
                    "./views/details-misc.html",
                    "./views/details-verblijfobject-detail.html"
                ]
            );
        })
    );
});