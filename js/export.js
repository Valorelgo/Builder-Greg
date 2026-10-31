/* =========================================================
   EXPORT D'UNE LISTE — texte à copier, feuille d'armée imprimable
   Fonctionne depuis le builder (liste en cours) ou depuis « Mes listes ».
   ========================================================= */

const ListExport = {

  // Contexte de calcul pour une liste enregistrée (faction chargée à la demande)
  async ctxFor(app, listId) {
    if (!listId) return { ctx: app, name: app.state.listName || "Ma liste" };
    const l = Store.getList(listId);
    const entry = FactionCatalog.find(f => f.id === l.factionId);
    const faction = await Loader.loadFaction(entry);
    const ctx = { faction, toast: m => app.toast(m),
                  state: { units: JSON.parse(JSON.stringify(l.units || [])), points: l.points,
                           detachments: [...(l.detachments || [])], disposition: l.disposition } };
    await Loader.loadExtras(ctx);
    return { ctx, name: l.name };
  },

  // Unités dans l'ordre des catégories ; les personnages juste après l'unité qu'ils mènent
  ordered(ctx) {
    const order = UnitCategories.map(c => c.id);
    const cat = e => order.indexOf(Builder.unit(ctx, e.unitId).category);
    return ctx.state.units.filter(e => Builder.unit(ctx, e.unitId)).sort((a, b) => cat(a) - cat(b));
  },

  gear(ctx, e) {
    const u = Builder.unit(ctx, e.unitId);
    const { counts } = Builder.loadout(ctx, u, e);
    const size = Builder.size(u, e).models;
    return [...u.weapons, ...(u.wargear || [])].filter(w => counts[w.id] > 0)
      .map(w => `${size > 1 || counts[w.id] > 1 ? `${counts[w.id]}× ` : ""}${w.name}`);
  },

  text(ctx, name) {
    const st = ctx.state, out = [];
    const total = Builder.total(ctx);
    const dets = Setup.selected(ctx).map(d => d.name).join(", ");
    const wl = st.units.find(e => e.warlord);
    out.push(`${name} — ${total}/${st.points} pts`);
    out.push(`${ctx.faction.name} · ${dets}`);
    if (st.disposition) out.push(`Disposition : ${Dispositions[st.disposition].name}`);
    if (wl) out.push(`Seigneur de guerre : ${Builder.label(ctx, wl)}`);
    let lastCat = null;
    this.ordered(ctx).forEach(e => {
      const u = Builder.unit(ctx, e.unitId);
      if (u.category !== lastCat) {
        lastCat = u.category;
        const c = UnitCategories.find(x => x.id === u.category);
        out.push("", (c ? c.label : u.category).toUpperCase());
      }
      const size = Builder.size(u, e).models;
      out.push(`${Builder.label(ctx, e)}${size > 1 ? ` — ${size} figurines` : ""} (${Builder.entryCost(ctx, e)} pts)`);
      const en = e.enhancement && Builder.enh(ctx, e.enhancement);
      if (e.warlord) out.push("  • Seigneur de guerre");
      const mk = Builder.markSource(ctx, u) && Builder.markOf(ctx, u, e);
      if (mk) out.push(`  • ${(Builder.markSource(ctx, u) || {}).unit ? u.markChoice.name : "Marque"} : ${UI.mark(mk)}`);
      if (en) out.push(`  • ${en.enh.kind === "amelioration" ? "Amélioration" : "Optimisation"} : ${en.enh.name}`);
      const g = this.gear(ctx, e);
      if (g.length) out.push(`  • ${g.join(", ")}`);
      const led = e.attachedTo && Builder.entry(ctx, e.attachedTo);
      if (led) out.push(`  • Mène : ${Builder.label(ctx, led)}`);
      const inT = e.embarkedIn && Army.isTop(ctx, e) && Builder.entry(ctx, e.embarkedIn);
      if (inT) out.push(`  • Embarquée dans : ${Builder.label(ctx, inT)}`);
    });
    return out.join("\n");
  },

  // Feuille imprimable : règles des détachements, optimisations prises, puis une carte par unité
  printHtml(ctx, name) {
    const st = ctx.state;
    const dets = Setup.selected(ctx);
    const taken = st.units.filter(e => e.enhancement).map(e => ({ e, en: Builder.enh(ctx, e.enhancement) })).filter(x => x.en);
    const detHtml = dets.map(d => `<section class="pr-det">
        <h2>${UI.esc(d.name)}</h2>
        ${d.rule.name ? `<h3>${UI.esc(d.rule.name)}</h3>` : ""}${d.rule.text.map(t => `<p>${UI.fmt(t)}</p>`).join("")}
        <div class="pr-strats">${d.stratagems.map(UI.stratagem).join("")}</div></section>`).join("");
    const enhHtml = taken.length ? `<section class="pr-det"><h2>Optimisations et améliorations</h2>${taken.map(({ e, en }) =>
        `<p><b>${UI.esc(en.enh.name)}</b> (${UI.esc(Builder.label(ctx, e))}) : ${UI.fmt(en.enh.text)}</p>`).join("")}</section>` : "";
    const cards = this.ordered(ctx).map(e => Companion.unitCard(ctx, e)).join("");
    return `<header class="pr-head"><h1>${UI.esc(name)}</h1>
        <p>${UI.esc(ctx.faction.name)} · ${Builder.total(ctx)}/${st.points} pts · ${UI.esc(dets.map(d => d.name).join(", "))}</p></header>
      ${detHtml}${enhHtml}<div class="pr-cards">${cards}</div>`;
  },

  print(ctx, name) {
    let area = document.getElementById("print-area");
    if (!area) { area = document.createElement("div"); area.id = "print-area"; document.body.appendChild(area); }
    area.innerHTML = this.printHtml(ctx, name);
    document.body.classList.add("is-printing");
    const done = () => { document.body.classList.remove("is-printing"); area.innerHTML = ""; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    setTimeout(() => window.print(), 50);
  }
};

Overlays.listText = function (app) {
  const x = app.state.exportView;
  if (!x) return "";
  return this.wrap(`
    <div class="ov-head"><h2>Exporter la liste</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <p class="hint">Texte à copier pour l'envoyer à ton adversaire ou à un organisateur.</p>
    <textarea class="lt-text" id="list-text" readonly>${UI.esc(x.text)}</textarea>
    <div class="ov-btns">
      <button class="btn" data-action="printList">Imprimer la feuille d'armée</button>
      <button class="btn btn-primary" data-action="copyListText">Copier le texte</button></div>`, "ov-narrow");
};

const ExportActions = {
  // arg vide = liste ouverte dans le builder ; sinon id d'une liste enregistrée
  async exportList(listId) {
    try {
      const { ctx, name } = await ListExport.ctxFor(this, listId);
      this.state.exportView = { listId: listId || null, name, text: ListExport.text(ctx, name) };
      this.state.overlay = "listText";
      this.render();
    } catch (e) { this.toast("Impossible de charger cette liste."); }
  },

  async copyListText() {
    const text = this.state.exportView.text;
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.getElementById("list-text");
      ta.select(); document.execCommand("copy");
    }
    this.toast("Liste copiée.");
  },

  async printList() {
    const { ctx, name } = await ListExport.ctxFor(this, this.state.exportView.listId);
    ListExport.print(ctx, name);
  }
};
