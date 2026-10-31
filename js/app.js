/* =========================================================
   APP — état global, navigation et rendu
   ========================================================= */

const App = {
  state: {
    screen: "home",
    factionId: null,
    points: 2000,
    detachments: [],
    disposition: null,
    units: [],
    focusDetachment: null,
    listId: null,      // liste en cours de modification (null = nouvelle)
    listName: "",
    dirty: false,      // modifications non enregistrées
    saved: false,
    listsMode: "edit", // "edit" ou "pick" (choix d'une liste pour jouer)
    sel: null,         // élément affiché dans le builder : { type: "unit"|"entry", id }
    overlay: null,     // panneau ouvert : "list", "issues", "save", "saved"
    collapsed: {}      // sections repliées sur l'écran en cours
  },
  faction: null,   // données complètes de la faction chargée
  maxStep: 0,      // étape la plus avancée atteinte (pour la barre d'étapes)
  actions: {},

  init() {
    this.el = {
      topbar: document.getElementById("topbar"),
      screen: document.getElementById("screen"),
      actionbar: document.getElementById("actionbar"),
      toast: document.getElementById("toast"),
      overlay: document.getElementById("overlay")
    };
    window.addEventListener("resize", () => { Builder.fit(); MissionCard.fit(); });
    Store.load();
    Object.assign(this.actions, SetupActions, HomeActions, BuilderActions, FoldActions, LaunchActions, ArmyActions, CompanionActions, HistoryActions, ExportActions, PlayAbilityActions, CollectionActions, CodexActions, ListViewActions);
    this.actions.glossary = (id, el) => Glossary.show(el);
    this.actions.toggleFullscreen = () => ScreenCtl.toggleFull();
    ScreenCtl.init(this);
    Glossary.init();

    // Délégation d'événements : data-action (clic) et data-change (changement)
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-action]");
      if (!el || el.disabled) return;
      const fn = this.actions[el.dataset.action];
      if (fn) fn.call(this, el.dataset.arg, el, e);
    });
    // Saisie de texte : met à jour l'état sans redessiner (le curseur reste en place)
    document.addEventListener("input", e => {
      const el = e.target.closest("[data-input]");
      if (!el) return;
      const fn = this.actions[el.dataset.input];
      if (fn) fn.call(this, el.value, el, e);
    });
    document.addEventListener("change", e => {
      const el = e.target.closest("[data-change]");
      if (!el) return;
      const fn = this.actions[el.dataset.change];
      if (fn) fn.call(this, el.value, el, e);
    });

    this.render();
  },

  // Repart d'une liste vierge
  resetList() {
    Object.assign(this.state, {
      factionId: null, points: 2000, detachments: [], disposition: null, units: [],
      focusDetachment: null, listId: null, listName: "", dirty: false, saved: false,
      sel: null, overlay: null
    });
    this.faction = null;
    this.maxStep = 0;
  },

  go(screen) {
    this.state.screen = screen;
    const idx = STEPS.findIndex(s => s.id === screen);
    if (idx >= 0) this.maxStep = Math.max(this.maxStep, idx);
    this.render({ resetScroll: true });
  },

  render(opts = {}) {
    // Tout est déplié à chaque arrivée sur un écran
    if (this._lastScreen !== this.state.screen) {
      this.state.collapsed = {};
      this._lastScreen = this.state.screen;
    }
    // Conserve la position de défilement des panneaux entre deux rendus
    const scrolls = {};
    if (!opts.resetScroll) {
      document.querySelectorAll("[data-pane]").forEach(p => { scrolls[p.dataset.pane] = p.scrollTop; });
    }

    const view = Screens[this.state.screen];
    this.el.topbar.innerHTML = UI.topbar(this);
    this.el.screen.innerHTML = view.body(this);
    this.el.actionbar.innerHTML = view.actions(this);
    this.el.actionbar.hidden = !this.el.actionbar.innerHTML.trim();
    const ov = this.state.overlay && Overlays[this.state.overlay];
    this.el.overlay.innerHTML = ov ? ov.call(Overlays, this) : "";

    document.querySelectorAll("[data-pane]").forEach(p => {
      if (opts.resetPane === p.dataset.pane) return;
      if (scrolls[p.dataset.pane] != null) p.scrollTop = scrolls[p.dataset.pane];
    });
    if (this.state.screen === "units" || (this.state.screen === "codex" && this.state.codex && this.state.codex.tab === "units")) Builder.fit();
    if (this.state.screen === "launch" || this.state.overlay === "missionCard") MissionCard.fit();
    ScreenCtl.keepAwake(this.state.screen === "game");
    if (this.state.screen === "game") { Companion.bind(this); if (this.state.match && this.state.match.armyCard) Builder.fit(); }
  },

  setLoading(on) {
    document.body.classList.toggle("is-loading", on);
  },

  // Message temporaire, avec un bouton « Annuler » si undo est fourni
  toast(message, undo) {
    const t = this.el.toast;
    t.innerHTML = `<span>${UI.esc(message)}</span>${undo ? '<button class="toast-undo">Annuler</button>' : ""}`;
    t.classList.toggle("has-action", !!undo);
    if (undo) t.querySelector(".toast-undo").onclick = () => { t.classList.remove("is-visible"); undo(); };
    t.classList.add("is-visible");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove("is-visible"), undo ? 6000 : 4000);
  }
};

/* ---------- Sections repliables ---------- */

const FoldActions = {
  toggleSection(key) {
    const c = this.state.collapsed;
    if (c[key]) delete c[key]; else c[key] = true;
    this.render();
  },
  collapseAll(group) {
    document.querySelectorAll(`[data-sec^="${group}:"]`).forEach(el => { this.state.collapsed[el.dataset.sec] = true; });
    this.render();
  },
  expandAll(group) {
    Object.keys(this.state.collapsed).forEach(k => { if (k.startsWith(group + ":")) delete this.state.collapsed[k]; });
    this.render();
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
