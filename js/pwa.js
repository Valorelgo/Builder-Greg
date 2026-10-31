/* =========================================================
   PWA — installation sur iPad / iPhone (et autres tablettes)
   Chargé en dernier, après app.js. Ne touche pas aux autres
   fichiers : remplace seulement l'export de la sauvegarde.

   - Enregistre le service worker (sw.js) : l'appli marche hors
     connexion une fois ouverte, et se met à jour quand le site change.
   - Demande au navigateur de garder les données (stockage persistant).
   - Sur iPad / iPhone, l'export passe par la feuille de partage
     (Enregistrer dans Fichiers, iCloud Drive, AirDrop, mail…).
   - Rappel d'ajouter l'appli à l'écran d'accueil si elle est ouverte
     dans Safari : c'est là que les données sont le mieux protégées.
   ========================================================= */

(() => {

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform || navigator.userAgent));
const isStandalone = window.navigator.standalone === true ||
  (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
const isHttp = /^https?:$/.test(location.protocol);

/* ---------- Service worker et stockage persistant ---------- */

if (isHttp && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

/* ---------- Export de la sauvegarde ---------- */

const download = (blob, name) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
};

// Renvoie une promesse : true si le fichier a été enregistré ou partagé, false si annulé
Store.exportFile = function () {
  const date = new Date().toISOString().slice(0, 10);
  const name = `builder40k-sauvegarde-${date}.json`;
  const text = JSON.stringify(this.data, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  if (isIOS && typeof File !== "undefined" && navigator.canShare) {
    const file = new File([text], name, { type: "application/json" });
    if (navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], title: "Sauvegarde Builder 40K" })
        .then(() => true)
        .catch(e => {
          if (e && e.name === "AbortError") return false;
          download(blob, name);
          return true;
        });
    }
  }
  download(blob, name);
  return Promise.resolve(true);
};

// L'export n'est noté comme fait que s'il n'a pas été annulé
HomeActions.exportData = async function () {
  const prev = Store.data.settings.lastExport;
  Store.data.settings.lastExport = new Date().toISOString();
  Store.save();
  const ok = await Store.exportFile();
  if (!ok) {
    if (prev) Store.data.settings.lastExport = prev; else delete Store.data.settings.lastExport;
    Store.save();
    this.render();
    this.toast("Export annulé : la sauvegarde n'a pas été enregistrée.");
    return;
  }
  if (this.state.overlay === "backup") this.state.overlay = null;
  this.render();
  this.toast(isIOS ? "Sauvegarde exportée. Garde-la dans Fichiers ou iCloud Drive." : "Sauvegarde exportée.");
};
if (typeof App !== "undefined") App.actions.exportData = HomeActions.exportData;

/* ---------- Rappel : installer sur l'écran d'accueil ---------- */

if (isIOS && isHttp && !isStandalone) {
  document.addEventListener("DOMContentLoaded", () => setTimeout(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("builder40k.installHint") === "1"; sessionStorage.setItem("builder40k.installHint", "1"); } catch (e) {}
    if (!seen && typeof App !== "undefined" && App.toast)
      App.toast("Pour garder tes listes, ajoute le builder à l'écran d'accueil : bouton Partager › Sur l'écran d'accueil.");
  }, 800));
}

})();
