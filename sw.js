/* h3lp service worker: h3lp keeps working with no signal after the first visit.
   Pages, data and scripts are network first (a corrected phone number reaches people on
   their next visit, never a visit later), with the cached copy as the offline fallback.
   Fonts and images under /assets are immutable, so they are served from the cache.
   Only the site's own files are cached. Nothing about the visitor is stored. */
var CACHE = "h3lp-v4-2026-10";
var CORE = [
  "./", "index.html", "site.css", "nojs.css", "data.js", "intent.js", "sky.js", "site.js", "manifest.webmanifest",
  "assets/fonts/atkinson-next-v1.woff2", "assets/fonts/fraunces-500.woff2",
  "assets/img/favicon-48-v1.png", "assets/img/apple-touch-180-v1.png", "assets/img/icon-192-v1.png",
  "assets/img/h3lp-logo-160-v1.webp", "assets/img/h3lp-logo-320-v1.webp"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function fromNetwork(req) {
  /* weak data: give the network 4 seconds, then fall back to the saved copy */
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; reject(new Error("slow")); } }, 4000);
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {});
      }
      if (!done) { done = true; clearTimeout(timer); resolve(res); }
    }, function (err) { if (!done) { done = true; clearTimeout(timer); reject(err); } });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.has("range")) return;
  if (url.pathname.indexOf("/assets/") > -1) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {}); }
        return res;
      });
    }));
    return;
  }
  e.respondWith(fromNetwork(req).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("index.html");
      return new Response("", { status: 504, statusText: "offline" });
    });
  }));
});
