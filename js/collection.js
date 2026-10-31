/* =========================================================
   COLLECTION — figurines possédées et peintes, par faction
   Store.data.collection = {
     factions: { [factionId]: { [unitId]: { owned, painted } } },
     log: [ { id, date, factionId, text, auto } ]   ← journal de peinture
   }
   Affichée sur l'écran « Ma collection » et dans le builder (jamais en partie).
   ========================================================= */

const Collection = {

  data() {
    const d = Store.data;
    if (!d.collection) d.collection = { factions: {}, log: [] };
    return d.collection;
  },

  of(factionId) { return this.data().factions[factionId] || {}; },
  has(factionId) { return Object.values(this.of(factionId)).some(r => r.owned > 0); },
  get(factionId, unitId) { return this.of(factionId)[unitId] || { owned: 0, painted: 0 }; },

  set(factionId, unitId, owned, painted) {
    const f = this.data().factions[factionId] || (this.data().factions[factionId] = {});
    owned = Math.max(0, owned);
    painted = Math.max(0, Math.min(painted, owned));
    if (!owned) delete f[unitId]; else f[unitId] = { owned, painted };
  },

  // Points sans option : meilleure combinaison d'effectifs réglementaires avec ces figurines
  points(u, n) {
    if (!n || !u.sizes || !u.sizes.length) return 0;
    const sizes = u.sizes;
    let best = 0;
    const walk = (i, left, counts) => {
      if (i === sizes.length) {
        // Coût selon l'ordre des exemplaires (les plus chers d'abord pour un total maximal réaliste)
        const units = counts.flatMap((c, k) => Array(c).fill(sizes[k]));
        const pts = units.reduce((s, sz, idx) => s + Builder.tierCost(sz, idx + 1), 0);
        if (pts > best) best = pts;
        return;
      }
      const m = sizes[i].models;
      for (let c = 0; c * m <= left && c <= 12; c++) walk(i + 1, left - c * m, [...counts, c]);
    };
    walk(0, n, []);
    return best;
  },

  // Bilan d'une faction (unités du catalogue fourni)
  summary(units, factionId) {
    let owned = 0, painted = 0, ptsOwned = 0, ptsPainted = 0, kinds = 0;
    units.forEach(u => {
      const r = this.get(factionId, u.id);
      if (!r.owned) return;
      kinds++;
      owned += r.owned; painted += r.painted;
      ptsOwned += this.points(u, r.owned);
      ptsPainted += this.points(u, r.painted);
    });
    return { owned, painted, ptsOwned, ptsPainted, kinds, pct: owned ? Math.round(painted / owned * 100) : 0,
             ptsPct: ptsOwned ? Math.round(ptsPainted / ptsOwned * 100) : 0 };
  },

  // Part peinte d'une liste, en figurines et en points (coût réel de chaque unité de la liste).
  // Les figurines peintes d'une unité sont réparties sur ses exemplaires, dans l'ordre de la liste.
  listPaint(ctx, fid) {
    const left = {};
    let total = 0, painted = 0, pts = 0, ptsPainted = 0;
    ctx.state.units.forEach(e => {
      const u = Builder.unit(ctx, e.unitId);
      if (!u) return;
      const n = Builder.size(u, e).models;
      if (left[u.id] == null) left[u.id] = this.get(fid, u.id).painted;
      const p = Math.min(n, left[u.id]);
      left[u.id] -= p;
      let cost = 0;
      try { cost = Builder.entryCost(ctx, e); } catch (err) { /* données incomplètes : compté à 0 */ }
      total += n; painted += p;
      pts += cost; ptsPainted += cost * p / n;
    });
    ptsPainted = Math.round(ptsPainted);
    return { total, painted, pct: total ? Math.round(painted / total * 100) : 0,
             pts, ptsPainted, ptsPct: pts ? Math.round(ptsPainted / pts * 100) : 0 };
  },

  // Petit complément « · 58 % des points » affiché à côté du pourcentage de figurines
  ptsTag(ptsPct, title) {
    return ptsPct == null ? "" : `<small class="pct-pts" title="${UI.esc(title || "Part des points peinte")}">${ptsPct} % des points</small>`;
  },

  logText(u, n) { return `${u.name} : ${n} figurine${n > 1 ? "s" : ""} peinte${n > 1 ? "s" : ""}`; },

  // Journal : une entrée automatique par unité et par jour quand des figurines passent « peintes »
  logPainted(factionId, u, delta) {
    if (!delta) return;
    const log = this.data().log, day = new Date().toISOString().slice(0, 10);
    const last = log.find(x => x.auto && x.factionId === factionId && x.unitId === u.id && x.date.slice(0, 10) === day);
    if (last) {
      last.count += delta;
      if (last.count <= 0) log.splice(log.indexOf(last), 1);
      else last.text = Collection.logText(u, last.count);
      return;
    }
    if (delta < 0) return;
    log.unshift({ id: Store.newId("p"), date: new Date().toISOString(), factionId, unitId: u.id, count: delta, auto: true,
                  text: this.logText(u, delta) });
  },

  // Héros épique : un seul exemplaire possible
  maxOwned(u) { return u.keywords && u.keywords.includes("Epic Hero") ? 1 : Infinity; },
  // Tranche d'achat : l'effectif minimum de l'unité (les boîtes sont vendues ainsi)
  step(u) { return Math.min(...(u.sizes || [{ models: 1 }]).map(x => x.models)); },

  // Totaux bruts d'une faction, sans données de faction (figurines seulement)
  rawTotals(fid) {
    let owned = 0, painted = 0;
    Object.values(this.of(fid)).forEach(r => { owned += r.owned; painted += r.painted; });
    return { owned, painted, pct: owned ? Math.round(painted / owned * 100) : 0 };
  },

  // Unités d'une faction déjà chargée (avec les fichiers auxiliaires), sinon null
  unitsOf(fid) {
    const f = Factions.get(fid);
    if (!f) return null;
    const extra = new Set();
    f.detachments.forEach(d => (d.extraFiles || []).forEach(x => extra.add(x)));
    const ext = [...extra].map(x => Factions.get(x)).filter(Boolean)
      .flatMap(x => x.units.map(u => (u._faction ? u : Object.assign(u, { _faction: x.keyword }))));
    return f.units.concat(ext);
  },

  // Charge en arrière-plan les factions de la collection (pour les points), puis redessine
  ensureLoaded(app) {
    if (this._loading) return;
    const todo = Object.keys(this.data().factions).filter(fid => !Factions.get(fid) && FactionCatalog.some(f => f.id === fid));
    if (!todo.length) return;
    this._loading = true;
    Promise.all(todo.map(async fid => {
      try {
        const faction = await Loader.loadFaction(FactionCatalog.find(f => f.id === fid));
        await Loader.loadExtras({ faction, toast: () => {}, state: { detachments: faction.detachments.map(d => d.id) } });
      } catch (e) { /* faction indisponible : on garde les totaux bruts */ }
    })).then(() => { this._loading = false; app.render(); });
  },

  /* ---------- Pour le builder ---------- */

  // Figurines demandées par la liste, par unité
  needed(app) {
    const m = {};
    app.state.units.forEach(e => {
      const u = Builder.unit(app, e.unitId);
      if (u) m[u.id] = (m[u.id] || 0) + Builder.size(u, e).models;
    });
    return m;
  },

  // Manques et part peinte de la liste en cours (null si aucune collection pour cette faction)
  listCheck(app) {
    const fid = app.faction && app.faction.id;
    if (!fid || !this.has(fid)) return null;
    const need = this.needed(app);
    const missing = [];
    Object.entries(need).forEach(([id, n]) => {
      const r = this.get(fid, id), u = Builder.unit(app, id);
      if (r.owned < n) missing.push({ u, need: n, owned: r.owned });
    });
    return Object.assign(this.listPaint(app, fid), { missing });
  }
};

/* ---------- Écran « Ma collection » ---------- */

const CollectionScreen = {
  // Contexte de faction : toutes les unités, y compris celles des fichiers auxiliaires (démons…)
  async load(app, factionId) {
    const entry = FactionCatalog.find(f => f.id === factionId && f.available !== false) ||
      FactionCatalog.find(f => f.available !== false);
    const faction = await Loader.loadFaction(entry);
    const ctx = { faction, toast: m => app.toast(m),
                  state: { units: [], points: 2000, detachments: faction.detachments.map(d => d.id) } };
    await Loader.loadExtras(ctx);
    app.state.coll = { factionId: entry.id, ctx };
    document.documentElement.style.setProperty("--accent", entry.color);
  },

  units(ctx) {
    const order = UnitCategories.map(c => c.id);
    return Builder.allUnits(ctx).slice().sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name));
  }
};

Screens.collection = {
  body(app) {
    const c = app.state.coll;
    if (!c) return `<section class="screen"><p class="hint">Chargement…</p></section>`;
    const ctx = c.ctx, fid = c.factionId;
    const units = CollectionScreen.units(ctx);
    const s = Collection.summary(units, fid);
    const log = Collection.data().log.filter(x => x.factionId === fid);

    // Colonne de gauche : une carte par faction ; celle ouverte montre son bilan et son journal
    Collection.ensureLoaded(app);
    const facCards = FactionCatalog.map(f => {
      const open = f.id === fid, avail = f.available !== false;
      const fu = Collection.unitsOf(f.id);
      const t = fu ? Collection.summary(fu, f.id) : Collection.rawTotals(f.id);
      const head = `<button class="co-fcard ${open ? "is-open" : ""}" style="--fc:${f.color}" ${avail ? `data-action="collFaction" data-arg="${f.id}"` : "disabled"}>
          <span class="co-fname">${UI.esc(f.name)}</span>
          <span class="co-fsub">${!avail ? "Bientôt disponible" : t.owned ? `${t.pct} % peinte · ${t.painted}/${t.owned} fig.${fu ? ` ${Collection.ptsTag(t.ptsPct)}` : ""}` : "Aucune figurine saisie"}</span>
          ${t.owned ? `<span class="co-bar"><span style="width:${t.pct}%"></span></span>` : ""}</button>`;
      if (!open) return head;
      return head + `<div class="co-fdetail">
        <div class="co-big"><b>${s.pct} %</b><span>des figurines peintes</span></div>
        <div class="co-big co-big-pts"><b>${s.ptsPct} %</b><span>des points peints</span></div>
        <dl class="co-sum">
          <dt>Figurines</dt><dd>${s.painted} peintes sur ${s.owned}</dd>
          <dt>Points (sans option)</dt><dd>${s.ptsPainted} peints sur ${s.ptsOwned}</dd>
          <dt>Types d'unités</dt><dd>${s.kinds}</dd>
        </dl>
        <h3 class="co-h">Journal de peinture</h3>
        <div class="co-note"><textarea id="coll-note" placeholder="Une étape, une idée de schéma, un projet…"></textarea>
          <button class="btn btn-s" data-action="collNote">Ajouter</button></div>
        ${log.length ? `<ul class="co-log">${log.map(x => `<li class="${x.auto ? "is-auto" : ""}">
            <span class="co-date">${Home.date(x.date)}</span><span>${UI.esc(x.text)}</span>
            <button class="co-del" data-action="collDelLog" data-arg="${x.id}" aria-label="Supprimer">✕</button></li>`).join("")}</ul>`
          : `<p class="hint">Les figurines que tu passes en « peintes » s'inscrivent ici automatiquement, avec la date.</p>`}
      </div>`;
    }).join("");

    const rows = UnitCategories.map(cat => {
      const us = units.filter(u => u.category === cat.id);
      if (!us.length) return "";
      return `<h3 class="co-cat">${UI.esc(cat.label)}</h3>` + us.map(u => {
        const r = Collection.get(fid, u.id);
        const pts = Collection.points(u, r.owned);
        const n = Collection.step(u), max = Collection.maxOwned(u);
        const epic = max === 1;
        const btn = (field, d, dis, label) => `<button data-action="collStep" data-arg="${u.id}|${field}|${d}" ${dis ? "disabled" : ""}>${label}</button>`;
        const input = field => `<input type="number" min="0" inputmode="numeric" value="${r[field]}" data-change="collSet" data-unit="${u.id}" data-field="${field}">`;
        const owned = `<span class="co-step">${btn("owned", -n, r.owned < 1, n > 1 ? `−${n}` : "−")}${input("owned")}${btn("owned", n, r.owned + n > max, n > 1 ? `+${n}` : "+")}</span>`;
        const painted = `<span class="co-step">${btn("painted", -1, !r.painted, "−")}${input("painted")}${btn("painted", 1, r.painted >= r.owned, "+")}
          ${n > 1 ? btn("painted", n, r.painted >= r.owned, `+${n}`) : ""}</span>`;
        return `<div class="co-row ${r.owned ? "" : "is-none"}">
          <div class="co-name"><b>${UI.esc(u.name)}</b><small>${epic ? "Héros épique · 1 exemplaire" : `par ${u.sizes.map(x => x.models).join(" ou ")} fig.`}${u._faction ? ` · ${UI.esc(u._faction)}` : ""}</small></div>
          <div class="co-col"><span class="co-l">Possédées</span>${owned}</div>
          <div class="co-col"><span class="co-l">Peintes</span>${painted}</div>
          <div class="co-pts">${pts ? `${pts} pts` : "—"}${r.owned ? `<div class="co-bar"><span style="width:${Math.round(r.painted / r.owned * 100)}%"></span></div>` : ""}</div>
        </div>`;
      }).join("");
    }).join("");

    return `<section class="screen screen-coll">
      <aside class="co-side" data-pane="co-side">${facCards}
        <p class="hint co-help">Les points comptent la meilleure combinaison d'effectifs possible avec tes figurines, sans équipement payant.</p></aside>
      <div class="co-main" data-pane="co-main"><h2 class="co-title" style="--fc:${(FactionCatalog.find(f => f.id === fid) || {}).color}">${UI.esc(ctx.faction.name)}</h2>${rows}</div>
    </section>`;
  },
  actions() { return ""; },
  back() { return { label: "Retour à l'accueil", action: "goHome" }; }
};

const CollectionActions = {
  async openCollection(arg) {
    const fid = arg || (this.state.coll && this.state.coll.factionId) || (Store.data.lists[0] && Store.data.lists[0].factionId) || "emperors-children";
    try { await CollectionScreen.load(this, fid); }
    catch (e) { this.toast("Impossible de charger la faction."); return; }
    this.state.screen = "collection";
    this.render({ resetScroll: true });
  },

  async collFaction(id) {
    if (this.state.coll && this.state.coll.factionId === id) return;
    try { await CollectionScreen.load(this, id); }
    catch (e) { this.toast("Cette faction n'est pas encore disponible."); return; }
    this.render({ resetScroll: true });
  },

  _collApply(unitId, field, value) {
    const c = this.state.coll, fid = c.factionId;
    const u = Builder.unit(c.ctx, unitId);
    const r = Collection.get(fid, unitId);
    const before = r.painted;
    if (field === "owned") Collection.set(fid, unitId, Math.min(value, Collection.maxOwned(u)), r.painted);
    else Collection.set(fid, unitId, r.owned, value);
    const after = Collection.get(fid, unitId).painted;
    Collection.logPainted(fid, u, after - before);
    Store.save();
    this.render();
  },

  collStep(arg) {
    const [unitId, field, d] = arg.split("|");
    const r = Collection.get(this.state.coll.factionId, unitId);
    CollectionActions._collApply.call(this, unitId, field, r[field] + Number(d));
  },

  collSet(value, el) {
    CollectionActions._collApply.call(this, el.dataset.unit, el.dataset.field, Math.max(0, parseInt(value, 10) || 0));
  },

  collNote() {
    const ta = document.getElementById("coll-note");
    const text = ta && ta.value.trim();
    if (!text) return;
    Collection.data().log.unshift({ id: Store.newId("p"), date: new Date().toISOString(), factionId: this.state.coll.factionId, text, auto: false });
    Store.save();
    this.render();
  },

  collDelLog(id) {
    const log = Collection.data().log;
    const i = log.findIndex(x => x.id === id);
    if (i < 0) return;
    const [x] = log.splice(i, 1);
    Store.save();
    this.render();
    this.toast("Entrée supprimée.", () => { log.splice(i, 0, x); Store.save(); this.render(); });
  }
};
