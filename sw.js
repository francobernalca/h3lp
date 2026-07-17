/* h3lp service worker — cache the hub so it opens even with no signal.
   Stale-while-revalidate: serve from cache instantly, refresh in the background.
   Stores page files on the device only. Nothing about the visitor is recorded. */
var CACHE = "h3lp-v2";
var CORE = [
  "./",
  "index.html",
  "site.css",
  "site.js",
  "manifest.webmanifest",
  "assets/h3lp-logo-transparent.png",
  "assets/fonts/fraunces-400.woff2",
  "assets/fonts/fraunces-500.woff2",
  "assets/fonts/fraunces-600.woff2",
  "assets/fonts/fraunces-400-italic.woff2",
  "assets/fonts/fraunces-500-italic.woff2"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      var refresh = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (hit) return hit;
        if (req.mode === "navigate") return caches.match("index.html");
        return undefined;
      });
      return hit || refresh;
    })
  );
});
