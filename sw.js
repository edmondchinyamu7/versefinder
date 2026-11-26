const CACHE_NAME = "versefinder-v3-5-phase-3";
const APP_SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./v3.js", "./study.js", "./platform.js", "./manifest.webmanifest", "./icon.svg"];
const APP_SHELL_URL = new URL("./index.html", self.registration.scope).href;
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL.map(path => new URL(path, self.registration.scope).href))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("versefinder-") && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  const isAppShell = request.mode === "navigate" || /\.(?:html|js|css)$/.test(url.pathname);
  if (isAppShell) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || (request.mode === "navigate" ? caches.match(APP_SHELL_URL) : Response.error()))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(() => request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
