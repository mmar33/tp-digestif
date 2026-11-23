/* Hors connexion : garde l'appli Expédition Muséum sur le téléphone (portée limitée à ce dossier) */
const V = "expedition-museum-v2";
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(["./", "./index.html", "./config.js"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.indexOf("expedition-museum") === 0 && x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url); if (u.origin !== location.origin || u.pathname.indexOf("/expedition-museum/") < 0) return;
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(x => x || (r.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
});
