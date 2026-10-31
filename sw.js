/* =========================================================
   SERVICE WORKER — appli utilisable hors connexion
   Fichier généré par outils/maj-sw.py (ne pas modifier la liste à la main).
   Stratégie : le réseau d'abord (mises à jour automatiques quand le site
   change), la copie locale si pas de réseau ou réseau trop lent.
   Les listes et parties ne sont PAS ici : elles restent dans la mémoire
   du navigateur (localStorage) et ne sont jamais envoyées sur GitHub.
   ========================================================= */

const VERSION = "20261101-0028";
const CACHE = `builder40k-${VERSION}`;
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "css/themes.css",
  "factions/aeldari.js",
  "factions/catalog.js",
  "factions/chaos-space-marines.js",
  "factions/emperors-children.js",
  "factions/legions-of-excess.js",
  "factions/ynnari.js",
  "fonts/AlegreyaSans-Bold.ttf",
  "fonts/AlegreyaSans-Italic.ttf",
  "fonts/AlegreyaSans-Medium.ttf",
  "fonts/AlegreyaSans-Regular.ttf",
  "fonts/BigShoulders-Bold.ttf",
  "fonts/Cinzel-VariableFont_wght.ttf",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "js/app.js",
  "js/army.js",
  "js/builder-ui.js",
  "js/builder.js",
  "js/codex.js",
  "js/collection.js",
  "js/companion.js",
  "js/config.js",
  "js/export.js",
  "js/glossary.js",
  "js/history.js",
  "js/home.js",
  "js/launch.js",
  "js/listview.js",
  "js/loader.js",
  "js/pwa.js",
  "js/regles-etendues.js",
  "js/scenarios.js",
  "js/screen.js",
  "js/setup.js",
  "js/storage.js",
  "js/ui.js",
  "regles/stratagemes-communs.js",
  "saisons/saison-2026.js",
  "saisons/2026/mises-en-place/RapidIngress-didia.png",
  "saisons/2026/mises-en-place/RapidIngress-didib.png",
  "saisons/2026/mises-en-place/RapidIngress-didic.png",
  "saisons/2026/mises-en-place/RapidIngress-dipaa.png",
  "saisons/2026/mises-en-place/RapidIngress-dipab.png",
  "saisons/2026/mises-en-place/RapidIngress-dipac.png",
  "saisons/2026/mises-en-place/RapidIngress-dipfa.png",
  "saisons/2026/mises-en-place/RapidIngress-dipfb.png",
  "saisons/2026/mises-en-place/RapidIngress-dipfc.png",
  "saisons/2026/mises-en-place/RapidIngress-direa.png",
  "saisons/2026/mises-en-place/RapidIngress-direb.png",
  "saisons/2026/mises-en-place/RapidIngress-direc.png",
  "saisons/2026/mises-en-place/RapidIngress-papaa.png",
  "saisons/2026/mises-en-place/RapidIngress-papab.png",
  "saisons/2026/mises-en-place/RapidIngress-papac.png",
  "saisons/2026/mises-en-place/RapidIngress-parea.png",
  "saisons/2026/mises-en-place/RapidIngress-pareb.png",
  "saisons/2026/mises-en-place/RapidIngress-parec.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpaa.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpab.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpac.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpfa.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpfb.png",
  "saisons/2026/mises-en-place/RapidIngress-pfpfc.png",
  "saisons/2026/mises-en-place/RapidIngress-pfrea.png",
  "saisons/2026/mises-en-place/RapidIngress-pfreb.png",
  "saisons/2026/mises-en-place/RapidIngress-pfrec.png",
  "saisons/2026/mises-en-place/RapidIngress-rerea.png",
  "saisons/2026/mises-en-place/RapidIngress-rereb.png",
  "saisons/2026/mises-en-place/RapidIngress-rerec.png",
  "saisons/2026/mises-en-place/RapidIngress-thdia.png",
  "saisons/2026/mises-en-place/RapidIngress-thdib.png",
  "saisons/2026/mises-en-place/RapidIngress-thdic.png",
  "saisons/2026/mises-en-place/RapidIngress-thpaa.png",
  "saisons/2026/mises-en-place/RapidIngress-thpab.png",
  "saisons/2026/mises-en-place/RapidIngress-thpac.png",
  "saisons/2026/mises-en-place/RapidIngress-thpfa.png",
  "saisons/2026/mises-en-place/RapidIngress-thpfb.png",
  "saisons/2026/mises-en-place/RapidIngress-thpfc.png",
  "saisons/2026/mises-en-place/RapidIngress-threa.png",
  "saisons/2026/mises-en-place/RapidIngress-threb.png",
  "saisons/2026/mises-en-place/RapidIngress-threc.png",
  "saisons/2026/mises-en-place/RapidIngress-ththa.png",
  "saisons/2026/mises-en-place/RapidIngress-ththb.png",
  "saisons/2026/mises-en-place/RapidIngress-ththc.png"
];

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
