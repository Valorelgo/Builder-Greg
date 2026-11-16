/* =========================================================
   CONSULTER — cartes d'unités, détachements, missions et
   stratagèmes, sans créer de liste ni lancer de partie.
   Les armées viennent de js/armees.js : factions complètes
   (unités + détachements) et armées « règles seules »
   (détachements, optimisations, stratagèmes), favorites en tête.
   ========================================================= */

const CodexTabs = [
  { id: "units", label: "Unités" },
  { id: "dets", label: "Détachements" },
  { id: "prim", label: "Missions primaires" },
  { id: "sec", label: "Missions secondaires" },
  { id: "core", label: "Stratagèmes de base" }
];

const Codex = {
  async load(app, factionId) {
    // Armée demandée si elle a des données, sinon la première de la liste (favorites en tête)
    const army = [Armies.get(factionId)].concat(Armies.ordered()).find(a => a && a.level !== "vide");
    const faction = await Armies.load(army.id, { theme: true });
    const ctx = { faction, isCodex: true, toast: m => app.toast(m),
                  state: { units: [], points: 2000, detachments: faction.detachments.map(d => d.id), collapsed: {} } };
    await Loader.loadExtras(ctx);
    const prev = app.state.codex || {};
    // Armée sans fiches d'unités : on ouvre ses détachements
    const tab = prev.tab === "units" && army.level !== "complete" ? "dets" : (prev.tab || "units");
    app.state.codex = { tab, factionId: army.id, ctx, unit: null, det: null };
    document.documentElement.style.setProperty("--accent", army.color);
  },

  tabsBar(c) {
    const a = Armies.get(c.factionId);
    const pick = (c.tab === "units" || c.tab === "dets") && a
      ? `<button class="btn cx-fac-btn" style="--fc:${a.color}" data-action="openArmyPicker" data-arg="codex" title="Changer d'armée">
          <span class="ap-dot"></span><span class="cx-fac-name">${UI.esc(a.name)}</span>${Armies.isFav(a.id) ? '<span class="ap-star-s">★</span>' : ""}<span class="chev-r">▾</span></button>` : "";
    return `<div class="cx-bar">
      <div class="seg cx-tabs">${CodexTabs.map(t => `<button class="${c.tab === t.id ? "is-on" : ""}" data-action="codexTab" data-arg="${t.id}">${t.label}</button>`).join("")}</div>
      ${pick}
    </div>`;
  },

  unitsTab(app, c) {
    const ctx = c.ctx;
    const units = Builder.allUnits(ctx);
    if (!units.length) {
      const a = Armies.get(c.factionId);
      return `<div class="cx-scroll"><div class="empty">
        <p>${UI.esc(a ? a.name : "Cette armée")} : pas encore de fiches d'unités, seulement ses détachements et stratagèmes.</p>
        <div class="data-btns"><button class="btn btn-primary" data-action="codexTab" data-arg="dets">Voir ses détachements</button>
        <button class="btn" data-action="openArmyPicker" data-arg="codex">Choisir une autre armée</button></div></div></div>`;
    }
    const sel = Builder.unit(ctx, c.unit) || units[0];
    c.unit = sel.id;
    const list = UnitCategories.map(cat => {
      const us = units.filter(u => u.category === cat.id);
      if (!us.length) return "";
      return `<h3 class="cx-cat">${UI.esc(cat.label)}</h3>` + us.map(u => `<button class="cx-item ${u.id === sel.id ? "is-on" : ""}"
        data-action="codexUnit" data-arg="${u.id}">${UI.esc(u.name)}${u._faction ? `<small>${UI.esc(u._faction)}</small>` : ""}<span>${u.sizes[0].costs[0].pts}</span></button>`).join("");
    }).join("");
    return `<div class="cx-split"><aside class="cx-list" data-pane="cx-list">${list}</aside>
      <article class="b-detail cx-detail">${BuilderUI.card(ctx, sel, null, true)}</article></div>`;
  },

  // Liste à gauche : règles d'armée, tous les stratagèmes, puis chaque détachement
  detsTab(app, c) {
    const f = c.ctx.faction, ds = f.detachments;
    const hasRules = (f.armyRules || []).length > 0;
    const extra = [hasRules && "__rules", ds.length > 1 && "__strats"].filter(Boolean);
    if (!ds.length && !hasRules) return `<div class="cx-scroll"><p class="hint">Aucun détachement saisi pour cette armée.</p></div>`;
    const ids = extra.concat(ds.map(d => d.id));
    if (!ids.includes(c.det)) c.det = ds.length ? ds[0].id : extra[0];
    const item = (id, label, aside) => `<button class="cx-item ${c.det === id ? "is-on" : ""}" data-action="codexDet" data-arg="${id}">${label}${aside ? `<span>${aside}</span>` : ""}</button>`;
    const nStrats = ds.reduce((n, d) => n + (d.stratagems || []).length, 0);
    const list = (hasRules ? item("__rules", "Règles d'armée", (f.armyRules || []).length) : "") +
      (ds.length > 1 ? item("__strats", "Tous les stratagèmes", nStrats) : "") +
      (extra.length ? `<h3 class="cx-cat">Détachements</h3>` : "") +
      ds.map(d => item(d.id, UI.esc(d.name), `${(d.dispositions || []).map(UI.dot).join("")} ${d.cost != null ? `${d.cost} pt${d.cost > 1 ? "s" : ""}` : ""}`)).join("");
    let detail;
    if (c.det === "__rules") detail = Armies.rulesHtml(f);
    else if (c.det === "__strats") detail = Armies.allStratsHtml(f);
    else detail = UI.detachmentDetail(ds.find(d => d.id === c.det), f, app);
    return `<div class="cx-split"><aside class="cx-list" data-pane="cx-list">${list}</aside>
      <article class="det-detail cx-detail" data-pane="cx-det">${detail}</article></div>`;
  },

  primTab() {
    return `<div class="cx-scroll" data-pane="cx-prim">${DispositionOrder.map(d => `<section class="cx-group">
        <h2>${UI.dispoChip(d)} <span class="muted">ma disposition</span></h2>
        <div class="cx-grid">${Object.keys(Missions).filter(n => Missions[n].disposition === d)
          .map(n => `<div class="cx-mcard">${MissionCard.render(n, { who: `contre ${Dispositions[Missions[n].opponent].name}` })}</div>`).join("")}</div>
      </section>`).join("")}</div>`;
  },

  secTab() {
    const tac = v => v != null && typeof v === "object" ? v.tactique : v;
    return `<div class="cx-scroll" data-pane="cx-sec"><div class="cx-grid">${(Season.secondaries || []).map(s => {
      const blocks = s.scoring.map(b => {
        const lines = b.lines.filter(l => tac(l.pts) != null);
        if (!lines.length) return "";
        return `<div class="mc-block"><div class="mc-round">${MissionCard.roundLabel(b.round)}</div>
          <div class="mc-when"><b>Quand :</b> ${UI.esc(b.quand)}</div>
          ${lines.map(l => `<div class="mc-line ${l.or ? "is-or" : ""} ${l.bonus ? "is-bonus" : ""}">${l.or ? '<span class="mc-tag">ou</span>' : l.bonus ? '<span class="mc-tag">+</span>' : ""}
            <span class="mc-text">${UI.fmt(l.text)}</span><span class="mc-pts">${l.bonus ? "+" : ""}${tac(l.pts)} PdV${l.per ? "<small>chacune</small>" : ""}</span></div>`).join("")}</div>`;
      }).join("");
      const max = tac(s.scoring.flatMap(b => b.lines).map(l => l.max).find(m => m != null));
      const a = s.action;
      return `<div class="mcard cx-sec"><header class="mc-head"><h2>${UI.esc(s.name)}</h2>${max != null ? `<div class="mc-sub muted">Maximum ${max} PdV</div>` : ""}</header>
        <div class="mc-body">${s.onDraw ? `<div class="mc-note"><b>À la pioche :</b> ${UI.fmt(s.onDraw)}</div>` : ""}
          ${s.rule ? `<div class="mc-note">${UI.fmt(s.rule)}</div>` : ""}${s.note ? `<div class="mc-note">${UI.fmt(s.note)}</div>` : ""}${blocks}
          ${a ? `<div class="mc-action"><div class="mc-action-h">Action : ${UI.esc(a.name)}</div><dl>
            <dt>S'entreprend</dt><dd>${UI.fmt(a.start)}</dd><dt>Unités</dt><dd>${UI.fmt(a.units)}</dd>
            <dt>S'accomplit</dt><dd>${UI.fmt(a.complete)}</dd><dt>Effet</dt><dd>${UI.fmt(a.effect)}</dd></dl></div>` : ""}</div></div>`;
    }).join("")}</div></div>`;
  },

  coreTab() {
    return `<div class="cx-scroll" data-pane="cx-core"><div class="card-grid strat-grid">${CoreStratagems.map(UI.stratagem).join("")}</div></div>`;
  }
};

Screens.codex = {
  body(app) {
    const c = app.state.codex;
    if (!c) return `<section class="screen"><p class="hint">Chargement…</p></section>`;
    const tab = { units: Codex.unitsTab, dets: Codex.detsTab, prim: Codex.primTab, sec: Codex.secTab, core: Codex.coreTab }[c.tab];
    return `<section class="screen screen-codex">${Codex.tabsBar(c)}${tab.call(Codex, app, c)}</section>`;
  },
  actions() { return ""; },
  back() { return { label: "Retour à l'accueil", action: "goHome" }; }
};

const CodexActions = {
  async openCodex() {
    // Dernière armée consultée, sinon la 1re favorite, sinon la faction de la dernière liste
    const fav = Armies.ordered().find(a => Armies.isFav(a.id) && a.level !== "vide");
    const fid = (this.state.codex && this.state.codex.factionId) || (fav && fav.id) ||
      (Store.data.lists[0] && Store.data.lists[0].factionId) || "emperors-children";
    try { await Codex.load(this, fid); } catch (e) { this.toast("Impossible de charger la faction."); return; }
    this.state.screen = "codex";
    this.render({ resetScroll: true });
  },
  codexTab(id) { this.state.codex.tab = id; this.render({ resetScroll: true }); },
  async codexFaction(id) {
    try { await Codex.load(this, id); }
    catch (e) { this.toast(`Le fichier de l'armée est introuvable ou contient une erreur.`); return; }
    this.render({ resetScroll: true });
  },
  codexUnit(id) { this.state.codex.unit = id; this.render(); },
  codexDet(id) { this.state.codex.det = id; this.render({ resetPane: "cx-det" }); }
};
