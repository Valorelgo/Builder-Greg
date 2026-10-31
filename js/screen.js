/* =========================================================
   ÉCRAN — rester allumé pendant une partie, plein écran
   ========================================================= */

const ScreenCtl = {
  lock: null,
  wanted: false,

  async keepAwake(on) {
    this.wanted = on;
    if (!("wakeLock" in navigator)) return;
    try {
      if (on && !this.lock) {
        this.lock = await navigator.wakeLock.request("screen");
        this.lock.addEventListener("release", () => { this.lock = null; });
      } else if (!on && this.lock) {
        await this.lock.release();
        this.lock = null;
      }
    } catch (e) { this.lock = null; }
  },

  isFull() { return !!document.fullscreenElement; },

  toggleFull() {
    if (this.isFull()) document.exitFullscreen && document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
  },

  button() {
    return `<button class="btn fs-btn" data-action="toggleFullscreen" title="${this.isFull() ? "Quitter le plein écran" : "Plein écran"}"
      aria-label="Plein écran">${this.isFull() ? "⤡" : "⤢"}</button>`;
  },

  init(app) {
    // Le verrou saute quand l'onglet passe en arrière-plan : on le reprend au retour
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && this.wanted) this.keepAwake(true);
    });
    document.addEventListener("fullscreenchange", () => app.render());
  }
};
