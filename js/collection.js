/* =========================================================
   COLLECTION — figurines possédées et peintes, par faction
   Store.data.collection = {
     factions: { [factionId]: { [unitId]: { owned, painted } } },
     log: [ { id, date, factionId, text, auto } ],  ← journal de peinture
     favs: [ factionId… ],                            ← factions jouées en priorité, dans l'ordre choisi
     shopping: [ { id, date, factionId, unitId, text, qty } ]  ← achats à faire ; l'ordre du tableau
                                                                 donne la priorité au sein de chaque faction
   }
   Affichée sur l'écran « Ma collection » et dans le builder (jamais en partie).
   ========================================================= */

const Collection = {

  data() {
    const d = Store.data;
    if (!d.collection) d.collection = { factions: {}, log: [] };
    const c = d.collection;
    if (!Array.isArray(c.favs)) c.favs = [];
    if (!Array.isArray(c.shopping)) c.shopping = [];
    return c;
  },

  /* ---------- Factions favorites ---------- */

  favs() { return this.data().favs.filter(id => FactionCatalog.some(f => f.id === id)); },
  isFav(id) { return this.data().favs.includes(id); },
  toggleFav(id) {
    const f = this.data().favs, i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
  },
  // Déplace une favorite d'un cran (d = -1 vers le haut, +1 vers le bas)
  moveFav(id, d) {
    const f = this.data().favs, i = f.indexOf(id), j = i + d;
    if (i < 0 || j < 0 || j >= f.length) return;
    [f[i], f[j]] = [f[j], f[i]];
  },
  // Catalogue des factions : favorites d'abord (dans leur ordre), puis les autres
  ordered() {
    const favs = this.favs();
    return favs.map(id => FactionCatalog.find(f => f.id === id))
      .concat(FactionCatalog.filter(f => !favs.includes(f.id)));
  },

  /* ---------- Shopping ---------- */

  shopping() { return this.data().shopping; },
  shopFor(fid) { return this.shopping().filter(x => x.factionId === fid); },
  shopOf(fid, unitId) { return this.shopping().filter(x => x.factionId === fid && x.unitId === unitId); },
  shopQty(fid, unitId) { return this.shopOf(fid, unitId).reduce((n, x) => n + (x.qty || 0), 0); },
  shopAdd(fid, unitId, qty, text) {
    const item = { id: Store.newId("s"), date: new Date().toISOString(), factionId: fid, unitId: unitId || null,
                   qty: unitId ? Math.max(1, qty || 1) : 0, text: text || "" };
    this.shopping().push(item);
    return item;
  },
  // Monte ou descend une entrée d'un cran parmi celles de sa faction
  moveShop(id, d) {
    const l = this.shopping(), i = l.findIndex(x => x.id === id);
    if (i < 0) return;
    let j = i + d;
    while (j >= 0 && j < l.length && l[j].factionId !== l[i].factionId) j += d;
    if (j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]];
  },
  // Des figurines de cette unité viennent d'entrer dans la collection : on les déduit du shopping,
  // en commençant par l'entrée la plus prioritaire. Renvoie les noms des entrées soldées.
  shopReceive(fid, unitId, n) {
    const done = [];
    if (n <= 0) return done;
    const l = this.shopping();
    for (const x of l.slice()) {
      if (n <= 0) break;
      if (x.factionId !== fid || x.unitId !== unitId) continue;
      const take = Math.min(n, x.qty);
      x.qty -= take; n -= take;
      if (x.qty <= 0) { l.splice(l.indexOf(x), 1); done.push(x); }
    }
    return done;
  },
  shopLabel(x) {
    if (!x.unitId) return x.text;
    const fu = this.unitsOf(x.factionId);
    const u = fu && fu.find(v => v.id === x.unitId);
    return u ? u.name : x.unitId;
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
    const ids = new Set(Object.keys(this.data().factions));
    this.shopping().forEach(x => { if (x.unitId) ids.add(x.factionId); });
    const todo = [...ids].filter(fid => !Factions.get(fid) && FactionCatalog.some(f => f.id === fid));
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
    app.state.coll = { factionId: entry.id, ctx, tab: app._collTab || (app.state.coll && app.state.coll.tab) || "units" };
    app._collTab = null;
    document.documentElement.style.setProperty("--accent", entry.color);
  },

  // Onglet « Shopping » de la faction ouverte, par ordre de priorité
  shopPane(app, units) {
    const c = app.state.coll, fid = c.factionId;
    const list = Collection.shopFor(fid);
    const opts = UnitCategories.map(cat => {
      const us = units.filter(u => u.category === cat.id);
      return us.length ? `<optgroup label="${UI.esc(cat.label)}">${us.map(u =>
        `<option value="${u.id}" data-step="${Collection.step(u)}">${UI.esc(u.name)}</option>`).join("")}</optgroup>` : "";
    }).join("");
    const form = `<div class="co-shopadd">
        <select id="shop-unit" data-change="collShopPick" aria-label="Unité">
          <option value="">— Autre achat (texte libre) —</option>${opts}</select>
        <label class="co-shopqty">Fig. <input id="shop-qty" type="number" min="1" inputmode="numeric" value="1"></label>
        <input id="shop-text" type="text" placeholder="Note (boîte, peinture, décor…)" maxlength="120">
        <button class="btn btn-primary btn-s" data-action="collShopAdd">Ajouter</button>
      </div>
      <p class="hint co-shophint">Quand tu ajoutes des figurines possédées, elles sont retirées d'ici automatiquement (en commençant par l'entrée la plus prioritaire).</p>`;
    if (!list.length) return form + `<div class="empty"><p>Rien à acheter pour cette faction pour l'instant.</p></div>`;
    const items = list.map((x, i) => {
      const f = FactionCatalog.find(v => v.id === x.factionId) || { color: "var(--line)" };
      const label = Collection.shopLabel(x);
      const own = x.unitId ? Collection.get(x.factionId, x.unitId).owned : 0;
      const sub = [x.unitId ? `déjà ${own} possédée${own > 1 ? "s" : ""}` : "", x.unitId && x.text ? UI.esc(x.text) : ""].filter(Boolean).join(" · ");
      return `<li class="co-shop" style="--fc:${f.color}">
        <span class="co-rank">${i + 1}</span>
        <span class="co-shopmain">${x.unitId && Builder.unit(c.ctx, x.unitId)
            ? `<button class="co-uname" data-action="collCard" data-arg="${x.unitId}" title="Voir la fiche">${UI.esc(label)}</button>`
            : `<b>${UI.esc(label)}</b>`}
          ${sub ? `<small>${sub}</small>` : ""}</span>
        ${x.unitId ? `<span class="co-step co-shopn">
            <button data-action="collShopQty" data-arg="${x.id}|-1" ${x.qty <= 1 ? "disabled" : ""} aria-label="Moins">−</button>
            <b>${x.qty}</b>
            <button data-action="collShopQty" data-arg="${x.id}|1" aria-label="Plus">+</button></span>` : `<span></span>`}
        <span class="co-shoptools">
          <button class="co-mv" data-action="collShopMove" data-arg="${x.id}|-1" ${i === 0 ? "disabled" : ""} aria-label="Plus prioritaire">▲</button>
          <button class="co-mv" data-action="collShopMove" data-arg="${x.id}|1" ${i === list.length - 1 ? "disabled" : ""} aria-label="Moins prioritaire">▼</button>
          ${x.unitId ? `<button class="co-mv co-got" data-action="collShopGot" data-arg="${x.id}" title="Acheté : ajouter à la collection">✓</button>` : ""}
          <button class="co-mv" data-action="collShopDel" data-arg="${x.id}" aria-label="Supprimer">✕</button>
        </span></li>`;
    }).join("");
    return form + `<ol class="co-shoplist">${items}</ol>`;
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
    const favs = Collection.favs();
    const facCards = Collection.ordered().map(f => {
      const open = f.id === fid, avail = f.available !== false;
      const fi = favs.indexOf(f.id), fav = fi >= 0;
      const fu = Collection.unitsOf(f.id);
      const t = fu ? Collection.summary(fu, f.id) : Collection.rawTotals(f.id);
      const nShop = Collection.shopFor(f.id).length;
      const head = `<button class="co-fcard ${open ? "is-open" : ""}" style="--fc:${f.color}" ${avail ? `data-action="collFaction" data-arg="${f.id}"` : "disabled"}>
          <span class="co-fname">${UI.esc(f.name)}</span>
          <span class="co-fsub">${!avail ? "Bientôt disponible" : t.owned ? `${t.pct} % peinte · ${t.painted}/${t.owned} fig.${fu ? ` ${Collection.ptsTag(t.ptsPct)}` : ""}` : "Aucune figurine saisie"}</span>
          ${t.owned ? `<span class="co-bar"><span style="width:${t.pct}%"></span></span>` : ""}
          ${nShop ? `<span class="co-fshop">🛒 ${nShop} achat${nShop > 1 ? "s" : ""} prévu${nShop > 1 ? "s" : ""}</span>` : ""}</button>`;
      const tools = `<span class="co-ftools">
          <button class="co-star ${fav ? "is-on" : ""}" data-action="collFav" data-arg="${f.id}" aria-pressed="${fav}"
            title="${fav ? "Retirer des favorites" : "Mettre en favorite (en tête de liste)"}">${fav ? "★" : "☆"}</button>
          ${fav ? `<button class="co-mv" data-action="collFavMove" data-arg="${f.id}|-1" ${fi === 0 ? "disabled" : ""} aria-label="Monter">▲</button>
            <button class="co-mv" data-action="collFavMove" data-arg="${f.id}|1" ${fi === favs.length - 1 ? "disabled" : ""} aria-label="Descendre">▼</button>` : ""}
        </span>`;
      const sep = favs.length && fi === favs.length - 1 ? " is-last-fav" : "";
      const card = `<div class="co-fwrap${fav ? " is-fav" : ""}${open ? "" : sep}">${head}${tools}</div>`;
      if (!open) return card;
      return card + `<div class="co-fdetail${sep}">
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

    // Unités possédées en haut, par catégorie ; les autres en bas, dans un bloc « Non possédées »
    // (une catégorie peut donc apparaître deux fois ; le bloc disparaît quand tout est possédé)
    const row = u => {
        const r = Collection.get(fid, u.id);
        const pts = Collection.points(u, r.owned);
        const n = Collection.step(u), max = Collection.maxOwned(u);
        const epic = max === 1;
        const inShop = Collection.shopQty(fid, u.id);
        const btn = (field, d, dis, label) => `<button data-action="collStep" data-arg="${u.id}|${field}|${d}" ${dis ? "disabled" : ""}>${label}</button>`;
        const input = field => `<input type="number" min="0" inputmode="numeric" value="${r[field]}" data-change="collSet" data-unit="${u.id}" data-field="${field}">`;
        const owned = `<span class="co-step">${btn("owned", -n, r.owned < 1, n > 1 ? `−${n}` : "−")}${input("owned")}${btn("owned", n, r.owned + n > max, n > 1 ? `+${n}` : "+")}</span>`;
        const painted = `<span class="co-step">${btn("painted", -1, !r.painted, "−")}${input("painted")}${btn("painted", 1, r.painted >= r.owned, "+")}
          ${n > 1 ? btn("painted", n, r.painted >= r.owned, `+${n}`) : ""}</span>`;
        return `<div class="co-row ${r.owned ? "" : "is-none"}">
          <div class="co-name"><button class="co-uname" data-action="collCard" data-arg="${u.id}" title="Voir la fiche">${UI.esc(u.name)}</button><small>${epic ? "Héros épique · 1 exemplaire" : `par ${u.sizes.map(x => x.models).join(" ou ")} fig.`}${u._faction ? ` · ${UI.esc(u._faction)}` : ""}</small>
            <span class="co-shopline">${inShop ? `<span class="co-inshop">🛒 ${inShop} à acheter</span>` : ""}
              ${epic && (r.owned || inShop) ? "" : `<button class="co-addshop" data-action="collShopQuick" data-arg="${u.id}" title="Ajouter ${n} figurine${n > 1 ? "s" : ""} au shopping">+ shopping</button>`}</span></div>
          <div class="co-col"><span class="co-l">Possédées</span>${owned}</div>
          <div class="co-col"><span class="co-l">Peintes</span>${painted}</div>
          <div class="co-pts">${pts ? `${pts} pts` : "—"}${r.owned ? `<div class="co-bar"><span style="width:${Math.round(r.painted / r.owned * 100)}%"></span></div>` : ""}</div>
        </div>`;
    };
    const byCat = list => UnitCategories.map(cat => {
      const us = list.filter(u => u.category === cat.id);
      return us.length ? `<h3 class="co-cat">${UI.esc(cat.label)}</h3>` + us.map(row).join("") : "";
    }).join("");
    const mine = units.filter(u => Collection.get(fid, u.id).owned > 0);
    const others = units.filter(u => !(Collection.get(fid, u.id).owned > 0));
    const rows = (mine.length ? byCat(mine)
        : `<p class="hint co-none">Aucune figurine saisie pour cette faction : augmente « Possédées » sur une unité ci-dessous pour la faire remonter ici.</p>`) +
      (others.length ? `<div class="co-unowned"><h2 class="co-unowned-h">Non possédées <span class="pill">${others.length}</span></h2>${byCat(others)}</div>` : "");

    return `<section class="screen screen-coll">
      <aside class="co-side" data-pane="co-side">${facCards}
        <p class="hint co-help">Les points comptent la meilleure combinaison d'effectifs possible avec tes figurines, sans équipement payant.</p></aside>
      <div class="co-main" data-pane="co-main">
        <div class="co-head"><h2 class="co-title" style="--fc:${(FactionCatalog.find(f => f.id === fid) || {}).color}">${UI.esc(ctx.faction.name)}</h2>
          <div class="co-tabs" role="tablist">
            <button role="tab" class="${c.tab !== "shop" ? "is-on" : ""}" aria-selected="${c.tab !== "shop"}" data-action="collTab" data-arg="units">Figurines</button>
            <button role="tab" class="${c.tab === "shop" ? "is-on" : ""}" aria-selected="${c.tab === "shop"}" data-action="collTab" data-arg="shop">Shopping${Collection.shopFor(fid).length ? ` <span class="co-count">${Collection.shopFor(fid).length}</span>` : ""}</button>
          </div></div>
        ${c.tab === "shop" ? CollectionScreen.shopPane(app, units) : rows}</div>
    </section>`;
  },
  actions() { return ""; },
  back() { return { label: "Retour à l'accueil", action: "goHome" }; }
};

/* Fiche d'une unité, consultée depuis la collection ou le shopping (lecture seule) */
Overlays.collCard = function (app) {
  const c = app.state.coll, u = c && c.cardId && Builder.unit(c.ctx, c.cardId);
  if (!u) return "";
  const r = Collection.get(c.factionId, u.id), inShop = Collection.shopQty(c.factionId, u.id);
  const info = [`${r.owned} possédée${r.owned > 1 ? "s" : ""}`, r.owned ? `${r.painted} peinte${r.painted > 1 ? "s" : ""}` : "",
                inShop ? `🛒 ${inShop} à acheter` : ""].filter(Boolean).join(" · ");
  return this.wrap(`
    <div class="ov-head"><div class="lv-title"><h2>${UI.esc(u.name)}</h2><span class="muted">${UI.esc(c.ctx.faction.name)} · ${info}</span></div>
      <span class="spacer"></span><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <div class="li-card co-card">${BuilderUI.card(c.ctx, u, null, true)}</div>`, "ov-full");
};

const CollectionActions = {
  collCard(unitId) {
    this.state.coll.cardId = unitId;
    this.state.overlay = "collCard";
    this.render();
  },

  async openCollection(arg) {
    const fid = arg || (this.state.coll && this.state.coll.factionId) || (Store.data.lists[0] && Store.data.lists[0].factionId) || "emperors-children";
    try { await CollectionScreen.load(this, fid); }
    catch (e) { this.toast("Impossible de charger la faction."); return; }
    this.state.screen = "collection";
    this.render({ resetScroll: true });
  },

  // Depuis l'accueil : ouvre directement l'onglet Shopping de la faction
  openCollShop(fid) {
    this._collTab = "shop";
    return CollectionActions.openCollection.call(this, fid);
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
    const before = r.painted, ownedBefore = r.owned;
    if (field === "owned") Collection.set(fid, unitId, Math.min(value, Collection.maxOwned(u)), r.painted);
    else Collection.set(fid, unitId, r.owned, value);
    const now = Collection.get(fid, unitId);
    Collection.logPainted(fid, u, now.painted - before);
    const done = Collection.shopReceive(fid, unitId, now.owned - ownedBefore);
    Store.save();
    this.render();
    if (done.length) this.toast(`${u.name} retiré du shopping.`);
  },

  collTab(tab) {
    this.state.coll.tab = tab === "shop" ? "shop" : "units";
    this.render({ resetScroll: true });
  },

  collFav(id) {
    Collection.toggleFav(id);
    Store.save();
    this.render();
  },

  collFavMove(arg) {
    const [id, d] = arg.split("|");
    Collection.moveFav(id, Number(d));
    Store.save();
    this.render();
  },

  // Choix d'une unité dans le formulaire : la quantité proposée est la taille d'achat de l'unité
  collShopPick(value, el) {
    const opt = el.selectedOptions[0], q = document.getElementById("shop-qty");
    if (q) q.value = value && opt ? opt.dataset.step : 1;
  },

  collShopAdd() {
    const sel = document.getElementById("shop-unit"), q = document.getElementById("shop-qty"), t = document.getElementById("shop-text");
    const unitId = sel ? sel.value : "", text = t ? t.value.trim() : "";
    if (!unitId && !text) { this.toast("Choisis une unité ou écris ce qu'il faut acheter."); return; }
    Collection.shopAdd(this.state.coll.factionId, unitId, parseInt(q && q.value, 10) || 1, text);
    Store.save();
    this.render();
  },

  // « + shopping » sur une ligne de figurines : ajoute une tranche d'achat (ou complète l'entrée existante)
  collShopQuick(unitId) {
    const fid = this.state.coll.factionId, u = Builder.unit(this.state.coll.ctx, unitId);
    const n = Collection.step(u), ex = Collection.shopOf(fid, unitId)[0];
    if (ex) ex.qty += n; else Collection.shopAdd(fid, unitId, n, "");
    Store.save();
    this.render();
    this.toast(`${u.name} : ${Collection.shopQty(fid, unitId)} figurine${Collection.shopQty(fid, unitId) > 1 ? "s" : ""} dans le shopping.`);
  },

  collShopQty(arg) {
    const [id, d] = arg.split("|");
    const x = Collection.shopping().find(v => v.id === id);
    if (!x) return;
    x.qty = Math.max(1, x.qty + Number(d));
    Store.save();
    this.render();
  },

  collShopMove(arg) {
    const [id, d] = arg.split("|");
    Collection.moveShop(id, Number(d));
    Store.save();
    this.render();
  },

  collShopDel(id) {
    const l = Collection.shopping(), i = l.findIndex(x => x.id === id);
    if (i < 0) return;
    const [x] = l.splice(i, 1);
    Store.save();
    this.render();
    this.toast("Retiré du shopping.", () => { l.splice(i, 0, x); Store.save(); this.render(); });
  },

  // « Acheté » : les figurines passent dans la collection (ce qui solde l'entrée du shopping)
  collShopGot(id) {
    const x = Collection.shopping().find(v => v.id === id);
    if (!x || !x.unitId) return;
    const units = Collection.unitsOf(x.factionId);
    const u = units && units.find(v => v.id === x.unitId);
    if (!u) return;
    const r = Collection.get(x.factionId, x.unitId);
    const owned = Math.min(r.owned + x.qty, Collection.maxOwned(u));
    Collection.set(x.factionId, x.unitId, owned, r.painted);
    const l = Collection.shopping();
    l.splice(l.indexOf(x), 1);
    Store.save();
    this.render();
    this.toast(`${u.name} : ${owned} possédée${owned > 1 ? "s" : ""}.`);
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
