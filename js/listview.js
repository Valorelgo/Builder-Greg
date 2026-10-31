/* =========================================================
   CONSULTATION D'UNE LISTE — lecture seule
   Armée (cartes des unités prises), règles, stratagèmes.
   Ouverte depuis l'accueil (clic sur une liste), les archives
   et l'écran de lancement de partie. Rien n'y est modifiable.
   ========================================================= */

const ListView = {
  // Contexte de calcul d'une liste enregistrée (copie : la liste n'est jamais modifiée ici)
  async ctxFor(app, l, opts = {}) {
    const entry = FactionCatalog.find(f => f.id === l.factionId);
    if (!entry) throw new Error("faction");
    const faction = await Loader.loadFaction(entry);
    const ctx = { faction, toast: m => app.toast(m),
                  state: { units: JSON.parse(JSON.stringify(opts.units || l.units || [])), points: l.points,
                           detachments: [...(l.detachments || [])], disposition: opts.disposition || l.disposition } };
    await Loader.loadExtras(ctx);
    document.documentElement.style.setProperty("--accent", entry.color);
    return ctx;
  },

  armyHtml(ctx, cardUid) {
    const order = UnitCategories.map(c => c.id);
    const tops = ctx.state.units.filter(e => Builder.unit(ctx, e.unitId) && Army.isTop(ctx, e))
      .sort((a, b) => order.indexOf(Builder.unit(ctx, a.unitId).category) - order.indexOf(Builder.unit(ctx, b.unitId).category));
    const all = tops.flatMap(e => [e, ...Army.attached(ctx, e)]);
    if (!all.length) return `<p class="hint">Cette liste n'a pas encore d'unité.</p>`;
    const sel = Builder.entry(ctx, cardUid) || all[0];
    const rows = tops.map(e => [e, ...Army.attached(ctx, e)].map((x, i) => {
      const inT = i === 0 && x.embarkedIn && Builder.entry(ctx, x.embarkedIn);
      return `<button class="cx-item ${x.uid === sel.uid ? "is-on" : ""}" data-action="listViewCard" data-arg="${x.uid}">
        ${i ? "↳ " : ""}${UI.esc(Builder.label(ctx, x))}${x.warlord ? ' <span class="aw-tag">SdG</span>' : ""}
        <span>${Builder.entryCost(ctx, x)}</span>
        ${inT ? `<small>dans ${UI.esc(Builder.label(ctx, inT))}</small>` : ""}</button>`;
    }).join("")).join("");
    return `<div class="li-split"><aside class="cx-list li-list" data-pane="li-list">${rows}</aside>
      <div class="li-card" data-pane="li-card">${Companion.unitCard(ctx, sel)}</div></div>`;
  },

  // Stratagèmes de la liste : ceux des détachements joués, puis ceux de base
  stratsHtml(ctx) {
    const groups = Setup.selected(ctx).map(d => ({ name: d.name, list: d.stratagems || [] }))
      .concat([{ name: "Stratagèmes de base", list: CoreStratagems }]);
    return groups.map(g => `<h3 class="prep-h">${UI.esc(g.name)}</h3>
      <div class="card-grid strat-grid">${g.list.map(UI.stratagem).join("")}</div>`).join("");
  }
};

Overlays.listView = function (app) {
  const V = app.state.listView;
  if (!V) return "";
  const ctx = V.ctx, l = Store.getList(V.listId);
  const tabs = [["army", "Armée"], ["rules", "Règles"], ["strat", "Stratagèmes"]].map(([id, label]) =>
    `<button class="${V.tab === id ? "is-on" : ""}" data-action="listViewTab" data-arg="${id}">${label}</button>`).join("");
  const body = V.tab === "army" ? ListView.armyHtml(ctx, V.card)
    : V.tab === "rules" ? `<div class="li-body rw-body" data-pane="li-body">${Companion.rulesHtml(ctx)}</div>`
    : `<div class="li-body" data-pane="li-body">${ListView.stratsHtml(ctx)}</div>`;
  const dets = Setup.selected(ctx).map(d => d.name).join(", ");
  // Hors lancement de partie : export et archivage (aucune modification du contenu de la liste)
  // Modifier la liste ouvre le builder (détachements puis unités), comme avant
  const extra = V.fromLaunch || !l ? "" : `
      <button class="btn btn-s btn-primary" data-action="openList" data-arg="${l.id}">Modifier la liste</button>
      <button class="btn btn-s" data-action="exportList" data-arg="${l.id}">Exporter / imprimer</button>
      <button class="btn btn-s ${V.more ? "is-on" : ""}" data-action="listViewMore" aria-expanded="${!!V.more}">Plus…</button>`;
  const more = V.more && l && !V.fromLaunch ? `<div class="lv-more">
      <button class="btn btn-s" data-action="duplicateList" data-arg="${l.id}">Dupliquer</button>
      <button class="btn btn-s" data-action="renameList" data-arg="${l.id}">Renommer</button>
      <button class="btn btn-s" data-action="${l.archived ? "unarchiveList" : "archiveList"}" data-arg="${l.id}">${l.archived ? "Sortir des archives" : "Archiver"}</button>
      <button class="btn btn-s btn-danger" data-action="deleteList" data-arg="${l.id}">Supprimer</button></div>` : "";
  return this.wrap(`
    <div class="ov-head lv-head">
      <div class="lv-title"><h2>${UI.esc(l ? l.name : "Ma liste")}</h2>
        <span class="muted">${UI.esc(ctx.faction.name)} · ${Builder.total(ctx)} / ${ctx.state.points} pts${dets ? ` · ${UI.esc(dets)}` : ""}${l && l.archived ? " · archivée" : ""}</span></div>
      <div class="seg">${tabs}</div>
      <span class="spacer"></span>${extra}
      <button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${more}${body}`, "ov-full");
};

const ListViewActions = {
  // opts : { units, disposition } (version modifiée pour une partie), tab
  async openListView(listId, opts = {}) {
    const l = Store.getList(listId);
    if (!l) return;
    let ctx;
    try { ctx = await ListView.ctxFor(this, l, opts); }
    catch (e) { this.toast("Impossible de charger la faction de cette liste."); return; }
    this.state.listView = { listId, ctx, tab: opts.tab || "army", card: null, fromLaunch: this.state.screen === "launch" };
    this.state.overlay = "listView";
    this.render();
  },
  viewList(id) { ListViewActions.openListView.call(this, id); },
  listViewMore() { this.state.listView.more = !this.state.listView.more; this.render(); },
  listViewTab(t) { this.state.listView.tab = t; this.render({ resetPane: "li-body" }); },
  listViewCard(uid) { this.state.listView.card = uid; this.render(); }
};
