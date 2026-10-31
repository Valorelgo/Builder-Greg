/* =========================================================
   SERVICE WORKER — appli utilisable hors connexion
   Fichier généré par outils/maj-sw.py (ne pas modifier la liste à la main).
   Stratégie : le réseau d'abord (mises à jour automatiques quand le site
   change), la copie locale si pas de réseau ou réseau trop lent.
   Les listes et parties ne sont PAS ici : elles restent dans la mémoire
   du navigateur (localStorage) et ne sont jamais envoyées sur GitHub.
   ========================================================= */

const VERSION = "__VERSION__";
const CACHE = `builder40k-${VERSION}`;
const FILES = __FILES__;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Fichier par fichier : un échec isolé ne bloque pas l'installation
    await Promise.all(FILES.map(f => cache.add(new Request(f, { cache: "reload" })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("builder40k-") && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const fromNet = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    });
    // Réseau lent (club, salle de jeu) : la copie locale après 3 secondes
    const timeout = new Promise(resolve => setTimeout(resolve, 3000));
    try {
      const res = await Promise.race([fromNet, timeout]);
      if (res) return res;
    } catch (e) { /* hors connexion */ }
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    return fromNet.catch(() => (req.mode === "navigate" ? cache.match("index.html") : Response.error()));
  })());
});
