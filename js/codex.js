/* =========================================================
   CONSULTER — cartes d'unités, détachements, missions et
   stratagèmes, sans créer de liste ni lancer de partie.
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
    const entry = FactionCatalog.find(f => f.id === factionId && f.available !== false) || FactionCatalog.find(f => f.available !== false);
    const faction = await Loader.loadFaction(entry);
    const ctx = { faction, isCodex: true, toast: m => app.toast(m),
                  state: { units: [], points: 2000, detachments: faction.detachments.map(d => d.id), collapsed: {} } };
    await Loader.loadExtras(ctx);
    const prev = app.state.codex || {};
    app.state.codex = { tab: prev.tab || "units", factionId: entry.id, ctx, unit: null, det: null };
    document.documentElement.style.setProperty("--accent", entry.color);
  },

  tabsBar(c) {
    const facs = FactionCatalog.filter(f => f.available !== false);
    return `<div class="cx-bar">
      <div class="seg cx-tabs">${CodexTabs.map(t => `<button class="${c.tab === t.id ? "is-on" : ""}" data-action="codexTab" data-arg="${t.id}">${t.label}</button>`).join("")}</div>
      ${(c.tab === "units" || c.tab === "dets") && facs.length > 1 ? `<select class="hf-sel cx-fac" data-change="codexFaction">${facs.map(f =>
        `<option value="${f.id}" ${f.id === c.factionId ? "selected" : ""}>${UI.esc(f.name)}</option>`).join("")}</select>` : ""}
    </div>`;
  },

  unitsTab(app, c) {
    const ctx = c.ctx;
    const units = Builder.allUnits(ctx);
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

  detsTab(app, c) {
    const ds = c.ctx.faction.detachments;
    const sel = ds.find(d => d.id === c.det) || ds[0];
    c.det = sel.id;
    const list = ds.map(d => `<button class="cx-item ${d.id === sel.id ? "is-on" : ""}" data-action="codexDet" data-arg="${d.id}">
      ${UI.esc(d.name)}<span>${d.dispositions.map(UI.dot).join("")} ${d.cost} pt${d.cost > 1 ? "s" : ""}</span></button>`).join("");
    return `<div class="cx-split"><aside class="cx-list" data-pane="cx-list">${list}</aside>
      <article class="det-detail cx-detail" data-pane="cx-det">${UI.detachmentDetail(sel, c.ctx.faction, app)}</article></div>`;
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
    const fid = (this.state.codex && this.state.codex.factionId) || (Store.data.lists[0] && Store.data.lists[0].factionId) || "emperors-children";
    try { await Codex.load(this, fid); } catch (e) { this.toast("Impossible de charger la faction."); return; }
    this.state.screen = "codex";
    this.render({ resetScroll: true });
  },
  codexTab(id) { this.state.codex.tab = id; this.render({ resetScroll: true }); },
  async codexFaction(id) { await Codex.load(this, id); this.render({ resetScroll: true }); },
  codexUnit(id) { this.state.codex.unit = id; this.render(); },
  codexDet(id) { this.state.codex.det = id; this.render({ resetPane: "cx-det" }); }
};
