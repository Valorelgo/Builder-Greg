/* =========================================================
   ARMÉES — toutes les armées du jeu, consultables avant et
   pendant une partie (détachements, optimisations, stratagèmes).
   Complément du moteur, chargé après app.js.

   Trois niveaux d'armée :
   - « complete » : faction jouable (FactionCatalog), unités comprises ;
   - « regles »   : armée consultable seulement (RefCatalog, dans
                    factions/catalog.js) : règles d'armée et détachements ;
   - « vide »     : armée du jeu pas encore saisie (AllFactions, js/config.js).

   Fichier d'une armée « règles seules » : factions/<file>.js, même format
   qu'une faction complète, sans les unités :
     Factions.register({
       id: "space-marines", name: "Space Marines", keyword: "Adeptus Astartes",
       armyRules:   [{ id, name, nameEn, text: [...] }],
       detachments: [{ id, name, cost, dispositions: [...],
                       rule: { name, text: [...] },
                       enhancements: [...], stratagems: [...] }]
     });
   puis une ligne dans RefCatalog : { id, name, file, color }.
   Quand l'armée reçoit ses fiches d'unités, sa ligne passe dans FactionCatalog.

   Favoris : Store.data.settings.armyFavs (ids, dans l'ordre choisi).
   Ils passent en tête de la consultation et du choix de l'armée adverse.

   Détachements adverses : oppDets (liste d'ids), gardés avec la partie
   à lancer puis avec la partie. Au lancement, ils fixent la disposition
   adverse (donc les missions) ; en partie, seuls leurs stratagèmes sont
   montrés. Budget : points de détachement du format de la partie.
   ========================================================= */

const Armies = {

  slug(name) {
    return String(name || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  },

  refs() { return typeof RefCatalog !== "undefined" && Array.isArray(RefCatalog) ? RefCatalog : []; },

  // Toutes les armées connues, chacune une seule fois
  all() {
    const out = [], seen = new Set();
    const add = (a) => { if (!a.id || seen.has(a.id)) return; seen.add(a.id); out.push(a); };
    const colorOf = name => (AllFactions.find(x => x.name.toLowerCase() === String(name).toLowerCase()) || {}).color || "#7d7286";
    FactionCatalog.filter(f => f.available !== false).forEach(f =>
      add({ id: f.id, name: f.name, color: f.color, file: f.file, level: "complete", entry: f }));
    this.refs().forEach(f =>
      add({ id: f.id, name: f.name, color: f.color || colorOf(f.name), file: f.file || f.id, level: "regles", entry: f }));
    AllFactions.forEach(x => add({ id: this.slug(x.name), name: x.name, color: x.color, level: "vide" }));
    return out;
  },

  get(id) { return id ? this.all().find(a => a.id === id) || null : null; },

  // Armée d'après un nom libre (armée adverse enregistrée avec une partie)
  byName(name) {
    if (!name) return null;
    const s = this.slug(name);
    return this.all().find(a => a.id === s || this.slug(a.name) === s) || null;
  },

  /* ---------- Favoris et ordre ---------- */

  favs() {
    const s = Store.data.settings;
    if (!Array.isArray(s.armyFavs)) s.armyFavs = [];
    return s.armyFavs;
  },

  isFav(id) { return this.favs().includes(id); },

  // Favorites dans l'ordre choisi, puis les autres par ordre alphabétique
  ordered() {
    const all = this.all();
    const favs = this.favs().map(id => all.find(a => a.id === id)).filter(Boolean);
    const rest = all.filter(a => !this.isFav(a.id)).sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return favs.concat(rest);
  },

  toggleFav(id) {
    const f = this.favs(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    Store.save();
  },

  move(id, d) {
    const f = this.favs(), i = f.indexOf(id), j = i + d;
    if (i < 0 || j < 0 || j >= f.length) return;
    [f[i], f[j]] = [f[j], f[i]];
    Store.save();
  },

  levelLabel(a) {
    return a.level === "complete" ? "unités et détachements" : a.level === "regles" ? "détachements et stratagèmes" : "pas encore saisie";
  },

  /* ---------- Chargement ---------- */

  // Données d'une armée (complète ou règles seules), complétées pour l'affichage.
  // theme: true applique aussi ses couleurs (consultation) ; jamais pendant une partie.
  async load(id, opts = {}) {
    const a = this.get(id);
    if (!a || a.level === "vide") throw new Error(id);
    let data;
    if (opts.theme) data = await Loader.loadFaction({ id: a.id, file: a.file });
    else {
      if (!Factions.get(a.id)) await Loader.loadScript(a.file);
      data = Factions.get(a.id);
    }
    if (!data) throw new Error(a.file);
    data.units = data.units || [];
    data.armyRules = data.armyRules || [];
    data.detachments = data.detachments || [];
    data.keyword = data.keyword || data.name;
    data._armyReady = true;
    data.detachments.forEach(d => {
      d.dispositions = d.dispositions || [];
      d.enhancements = d.enhancements || [];
      d.stratagems = d.stratagems || [];
      d.rule = d.rule || { name: null, text: [] };
      d.rule.text = d.rule.text || [];
    });
    return data;
  },

  // Données déjà chargées et complétées (sinon null)
  loaded(id) {
    const d = id && Factions.get(id);
    return d && d._armyReady ? d : null;
  },

  /* ---------- Détachements adverses ---------- */

  // Détachements choisis (anciennes parties : un seul, dans oppDet)
  oppDets(obj) {
    if (!Array.isArray(obj.oppDets)) obj.oppDets = obj.oppDet ? [obj.oppDet] : [];
    delete obj.oppDet;
    return obj.oppDets;
  },

  // Points de la partie (lancement : ceux de la liste choisie)
  pointsOf(src) {
    if (!src) return 2000;
    if (src.kind === "game") return src.obj.points || 2000;
    const l = Store.getList(src.obj.listId);
    return (l && l.points) || 2000;
  },

  detState(f, chosen, points) {
    const max = Rules.forPoints(points).detachmentPoints;
    const sel = f.detachments.filter(d => chosen.includes(d.id));
    const used = sel.reduce((n, d) => n + (d.cost || 0), 0);
    const rows = f.detachments.map(d => {
      const on = chosen.includes(d.id);
      const clash = !on && d.exclusiveGroup ? sel.find(x => x.exclusiveGroup === d.exclusiveGroup) : null;
      const over = !on && used + (d.cost || 0) > max;
      return { d, on, clash, over };
    });
    return { max, used, sel, rows };
  },

  dispositionsOf(dets) {
    const out = [];
    dets.forEach(d => (d.dispositions || []).forEach(id => { if (!out.includes(id)) out.push(id); }));
    return out;
  },

  // Cases à cocher des détachements (formulaire de lancement et panneau adverse)
  detChips(f, chosen, points) {
    const st = this.detState(f, chosen, points);
    return `<div class="od-head">${UI.pips(st.used, st.max)}<span><b>${st.used} / ${st.max}</b> points de détachement</span></div>
      <div class="od-chips">${st.rows.map(({ d, on, clash, over }) => {
        const why = clash ? `Incompatible avec ${clash.name}` : over ? "Dépasse les points de détachement" : "";
        return `<button class="od-chip ${on ? "is-on" : ""}" data-action="oppDetToggle" data-arg="${d.id}" aria-pressed="${on}"
          ${why ? `disabled title="${UI.esc(why)}"` : ""}><span class="od-box"></span><span class="od-name">${UI.esc(d.name)}</span>
          <span class="od-meta">${(d.dispositions || []).map(UI.dot).join("")}${d.cost != null ? `<b>${d.cost}</b>` : ""}</span></button>`;
      }).join("")}</div>`;
  },

  /* ---------- Affichage ---------- */

  rulesHtml(f) {
    const rules = f.armyRules || [];
    if (!rules.length) return `<p class="hint">Pas de règle d'armée saisie.</p>`;
    return `<header class="dd-head"><h1 class="dd-title">Règles d'armée</h1></header>` +
      rules.map(r => `<section class="rw-sec am-rule"><h3>${UI.esc(r.name)}${r.nameEn && r.nameEn !== r.name ? `<small>${UI.esc(r.nameEn)}</small>` : ""}</h3>
        ${(r.text || []).map(t => `<p>${UI.fmt(t)}</p>`).join("")}</section>`).join("");
  },

  // Tous les stratagèmes de l'armée, détachement par détachement
  allStratsHtml(f) {
    return `<header class="dd-head"><h1 class="dd-title">Tous les stratagèmes</h1></header>` +
      f.detachments.filter(d => d.stratagems.length).map(d => `<h3 class="prep-h">${UI.esc(d.name)}</h3>
        <div class="card-grid strat-grid">${d.stratagems.map(UI.stratagem).join("")}</div>`).join("");
  },

  // Stratagème avec le nom de son détachement au-dessus (vues qui mélangent les détachements)
  stratCard(s, detName) {
    return `<div class="am-strat">${detName ? `<span class="am-det">${UI.esc(detName)}</span>` : ""}${UI.stratagem(s)}</div>`;
  },

  /* ---------- Armée adverse (lancement et partie) ---------- */

  // Partie en cours, ou écran de lancement
  oppSource(app) {
    if (app.state.screen === "game") {
      const g = Companion.game(app);
      return g ? { kind: "game", obj: g, name: g.oppFaction, who: g.oppName } : null;
    }
    if (app.state.screen === "launch" && app.state.launch) {
      const L = app.state.launch;
      return { kind: "launch", obj: L, name: L.oppFaction, who: L.oppName };
    }
    return null;
  },

  oppArmy(src) {
    if (!src) return null;
    return this.get(src.obj.oppArmyId) || this.byName(src.name);
  },

  // Côté de l'adversaire : quels stratagèmes peut-il jouer maintenant ?
  usableNow(s, p) {
    if (!p || !p.active) return true;
    const tour = p.active === "opp" ? "vous" : "adversaire";
    return (s.moments || []).some(m => (m.tour === tour || m.tour === "les-deux") &&
      (!p.phase || m.phase === p.phase || m.phase === "toutes"));
  }
};

/* ---------- Panneau : choisir une armée (favorites, ordre) ---------- */

Overlays.armyPicker = function (app) {
  const P = app.state.armyPick || {};
  const all = Armies.ordered();
  const cur = P.current;
  const favs = all.filter(a => Armies.isFav(a.id));
  const rest = all.filter(a => !Armies.isFav(a.id));
  const row = (a, i, n) => {
    const fav = Armies.isFav(a.id), empty = a.level === "vide";
    return `<div class="ap-row ${a.id === cur ? "is-on" : ""} ${empty ? "is-empty" : ""}" style="--fc:${a.color}">
      <button class="ap-name" data-action="armyPick" data-arg="${a.id}" ${empty ? "disabled" : ""}>
        <span class="ap-dot"></span><b>${UI.esc(a.name)}</b><small>${Armies.levelLabel(a)}</small></button>
      ${fav ? `<button class="ap-mv" data-action="armyMove" data-arg="${a.id}|-1" ${i === 0 ? "disabled" : ""} aria-label="Monter ${UI.esc(a.name)}">▲</button>
        <button class="ap-mv" data-action="armyMove" data-arg="${a.id}|1" ${i === n - 1 ? "disabled" : ""} aria-label="Descendre ${UI.esc(a.name)}">▼</button>` : ""}
      <button class="ap-star ${fav ? "is-on" : ""}" data-action="armyFav" data-arg="${a.id}" aria-pressed="${fav}"
        title="${fav ? "Retirer des favorites" : "Mettre en favorite (en tête de liste)"}">${fav ? "★" : "☆"}</button></div>`;
  };
  return this.wrap(`
    <div class="ov-head"><h2>${P.for === "opp" ? "Armée adverse" : "Choisir une armée"}</h2>
      <button class="btn btn-s" data-action="${P.for === "opp" ? "openOppArmy" : "closeOverlay"}">${P.for === "opp" ? "Retour" : "Fermer"}</button></div>
    <div class="ap-body" data-pane="ap-body">
      <h3 class="prep-h">Mes armées favorites</h3>
      ${favs.length ? favs.map((a, i) => row(a, i, favs.length)).join("")
        : `<p class="hint">Touche ☆ pour mettre en tête les armées que tu joues ou que tu affrontes souvent. ▲ ▼ règlent ensuite leur ordre.</p>`}
      <h3 class="prep-h">Toutes les armées</h3>
      ${rest.map(a => row(a)).join("")}
    </div>`, "ov-narrow ap-ov");
};

/* ---------- Panneau : armée adverse ---------- */

Overlays.oppArmy = function (app) {
  const V = app.state.oppView;
  const src = Armies.oppSource(app);
  if (!V || !src) return "";
  const a = Armies.get(V.armyId);
  const who = src.who ? `Armée de ${UI.esc(src.who)}` : "Armée adverse";
  const head = `<div class="ov-head am-head" style="--fc:${a ? a.color : "#7d7286"}">
      <div class="lv-title"><h2>${a ? UI.esc(a.name) : UI.esc(src.name || "Armée inconnue")}</h2><span class="muted">${who}</span></div>
      <button class="btn btn-s" data-action="openArmyPicker" data-arg="opp">Changer d'armée</button>
      <span class="spacer"></span><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>`;
  if (!V.data) {
    return this.wrap(`${head}<div class="li-body"><div class="empty">
      <p>${a ? `Les détachements et stratagèmes de <b>${UI.esc(a.name)}</b> ne sont pas encore saisis.`
        : `L'armée « ${UI.esc(src.name || "inconnue")} » n'est pas dans la liste des armées.`}</p>
      <p class="hint">Choisis une autre armée si besoin : le choix est gardé pour cette partie.</p></div></div>`, "ov-full");
  }
  const f = V.data;
  const p = src.kind === "game" && src.obj.play;
  const live = !!(p && p.active);
  const chosen = Armies.oppDets(src.obj).filter(id => f.detachments.some(d => d.id === id));
  const mine = f.detachments.filter(d => chosen.includes(d.id));
  const dets = mine.length ? mine : f.detachments;
  const filter = V.filter === "now" && live;
  const strats = dets.flatMap(d => d.stratagems.map(s => ({ s, d }))).filter(x => !filter || Armies.usableNow(x.s, p));
  const nowLabel = live ? `${p.active === "opp" ? "Son tour" : "Ton tour"}${p.phase ? ` · ${Labels.phase[p.phase]}` : ""}` : "";
  const filterBar = live ? `<div class="seg am-filter">
      <button class="${filter ? "is-on" : ""}" data-action="oppFilter" data-arg="now" title="Stratagèmes qu'il peut jouer à ce moment">Jouables maintenant <small>${UI.esc(nowLabel)}</small></button>
      <button class="${!filter ? "is-on" : ""}" data-action="oppFilter" data-arg="all">Tous</button></div>` : "";
  const sec = (key, title, body, n) => `<section class="am-sec ${V.closed[key] ? "is-closed" : ""}">
      <button class="am-sec-h" data-action="oppFold" data-arg="${key}" aria-expanded="${!V.closed[key]}">
        <span class="chev-r">${V.closed[key] ? "▸" : "▾"}</span>${title}${n != null ? `<span class="pill">${n}</span>` : ""}</button>
      ${V.closed[key] ? "" : `<div class="am-sec-b">${body}</div>`}</section>`;
  const pick = sec("pick", mine.length ? `Ses détachements : ${UI.esc(mine.map(d => d.name).join(", "))}` : "Ses détachements : à choisir",
    `${Armies.detChips(f, chosen, Armies.pointsOf(src))}
     <p class="hint">${mine.length ? "Seuls les stratagèmes et optimisations de ces détachements sont affichés." : "Tant qu'aucun détachement n'est coché, ceux de toute l'armée sont affichés."}${src.kind === "game" ? "" : " Ses détachements fixent aussi sa disposition."}</p>`);
  const rules = f.armyRules.length ? sec("rules", "Règles d'armée",
    f.armyRules.map(r => `<div class="rw-sec"><h3>${UI.esc(r.name)}</h3>${(r.text || []).map(t => `<p>${UI.fmt(t)}</p>`).join("")}</div>`).join(""), f.armyRules.length) : "";
  const detRule = mine.length ? sec("det", mine.length > 1 ? "Règles de ses détachements" : "Règle de son détachement",
    mine.map(d => `<div class="rw-sec"><h3>${UI.esc(d.name)}${d.rule.name ? `<small>${UI.esc(d.rule.name)}</small>` : ""}</h3>
      ${d.rule.text.map(t => `<p>${UI.fmt(t)}</p>`).join("")}${UI.tracker(d.tracker)}</div>`).join("")) : "";
  const stratBody = strats.length
    ? `<div class="card-grid strat-grid">${strats.map(x => Armies.stratCard(x.s, dets.length > 1 ? x.d.name : null)).join("")}</div>`
    : `<p class="hint">${filter ? "Aucun stratagème jouable par ton adversaire à ce moment." : "Aucun stratagème saisi."}</p>`;
  const strat = sec("strat", filter ? "Stratagèmes jouables maintenant" : "Stratagèmes", stratBody, strats.length);
  const enhs = dets.flatMap(d => d.enhancements.map(e => ({ e, d })));
  const enh = enhs.length ? sec("enh", "Optimisations",
    `<div class="card-grid enh-grid">${enhs.map(x => UI.enhancement(x.e, f)).join("")}</div>`, enhs.length) : "";
  return this.wrap(`${head}
    ${filterBar ? `<div class="am-tools">${filterBar}</div>` : ""}
    <div class="li-body am-body" data-pane="am-body">${pick}${rules}${detRule}${strat}${enh}</div>`, "ov-full");
};

/* ---------- Actions ---------- */

const ArmyRefActions = {
  openArmyPicker(forWhat) {
    const cur = forWhat === "codex" ? this.state.codex && this.state.codex.factionId
      : this.state.oppView && this.state.oppView.armyId;
    this.state.armyPick = { for: forWhat || "codex", current: cur };
    this.state.overlay = "armyPicker";
    this.render({ resetPane: "ap-body" });
  },

  async armyPick(id) {
    const P = this.state.armyPick || {};
    if (P.for === "opp") {
      const src = Armies.oppSource(this);
      if (!src) return;
      const a = Armies.get(id);
      src.obj.oppArmyId = id;
      src.obj.oppDets = [];
      delete src.obj.oppDet;
      if (a) { src.obj.oppFaction = a.name; if (src.kind === "launch") src.obj.otherArmy = false; }
      if (src.kind === "game") Store.save();
      await ArmyRefActions.openOppArmy.call(this);
      return;
    }
    this.state.overlay = null;
    await CodexActions.codexFaction.call(this, id);
  },

  armyFav(id) { Armies.toggleFav(id); this.render(); },

  armyMove(arg) {
    const [id, d] = arg.split("|");
    Armies.move(id, Number(d));
    this.render();
  },

  async openOppArmy() {
    const src = Armies.oppSource(this);
    if (!src) return;
    const a = Armies.oppArmy(src);
    let data = null;
    if (a && a.level !== "vide") {
      try { data = await Armies.load(a.id); }
      catch (e) { this.toast(`Le fichier factions/${a.file}.js est introuvable ou contient une erreur.`); }
    }
    const prev = this.state.oppView;
    const same = prev && a && prev.armyId === a.id;
    const chosen = Armies.oppDets(src.obj);
    this.state.oppView = {
      armyId: a ? a.id : null, data,
      filter: same ? prev.filter : "now",
      closed: same ? prev.closed : { enh: true, pick: chosen.length > 0 }
    };
    this.state.overlay = "oppArmy";
    this.render({ resetPane: "am-body" });
  },

  // Détachements adverses (plusieurs possibles) : gardés avec la partie, ou pour la partie à lancer.
  // Au lancement, ils fixent la disposition adverse quand elle n'a qu'une possibilité.
  oppDetToggle(id) {
    const src = Armies.oppSource(this);
    const a = Armies.oppArmy(src);
    const f = a && Armies.loaded(a.id);
    if (!f) return;
    const d = f.detachments.find(x => x.id === id);
    const chosen = Armies.oppDets(src.obj);
    if (!d) return;
    if (chosen.includes(id)) src.obj.oppDets = chosen.filter(x => x !== id);
    else {
      const st = Armies.detState(f, chosen, Armies.pointsOf(src));
      const row = st.rows.find(r => r.d.id === id);
      if (row.clash) { this.toast(`${d.name} ne peut pas être pris avec ${row.clash.name}.`); return; }
      if (row.over) { this.toast(`${d.name} dépasse les ${st.max} points de détachement.`); return; }
      chosen.push(id);
    }
    if (src.kind === "launch") {
      const L = src.obj;
      const avail = Armies.dispositionsOf(f.detachments.filter(x => L.oppDets.includes(x.id)));
      if (avail.length) {
        const next = avail.length === 1 ? avail[0] : (avail.includes(L.oppDisposition) ? L.oppDisposition : null);
        if (next !== L.oppDisposition) { L.oppDisposition = next; L.deployment = null; }
      }
    } else {
      src.obj.oppDetNames = f.detachments.filter(x => src.obj.oppDets.includes(x.id)).map(x => x.name);
      Store.save();
    }
    this.render(this.state.overlay === "oppArmy" ? { resetPane: "am-body" } : {});
  },

  oppFilter(m) { this.state.oppView.filter = m; this.render({ resetPane: "am-body" }); },

  oppFold(k) {
    const c = this.state.oppView.closed;
    c[k] = !c[k];
    this.render();
  }
};

Object.assign(CodexActions, ArmyRefActions);
if (typeof App !== "undefined") Object.assign(App.actions, ArmyRefActions);

/* ---------- Branchements dans les écrans existants ---------- */

(() => {
  // Partie : bouton « Adversaire » dans la barre du haut, à côté du journal
  const baseTopbar = Companion.topbar;
  Companion.topbar = function (app) {
    const html = baseTopbar.call(this, app);
    const btn = `<button class="btn ${app.state.overlay === "oppArmy" ? "is-on" : ""}" data-action="openOppArmy" title="Règles et stratagèmes de l'armée adverse">Adversaire</button>`;
    const anchor = `<button class="btn" data-action="openOverlay" data-arg="journal">`;
    return html.includes(anchor) ? html.replace(anchor, btn + anchor) : html;
  };

  // Lancement : bouton « Son armée » dans la barre du haut, une fois son armée indiquée
  const baseUiTopbar = UI.topbar;
  UI.topbar = function (app) {
    const html = baseUiTopbar.call(this, app);
    const L = app.state.launch;
    if (app.state.screen !== "launch" || !L || !(L.oppFaction || L.oppArmyId)) return html;
    const anchor = `data-arg="army">Ma liste : armée, règles, stratagèmes</button>`;
    const btn = `<button class="btn tb-codex" data-action="openOppArmy">Son armée : stratagèmes</button>`;
    return html.includes(anchor) ? html.replace(anchor, anchor + btn) : html;
  };

  // Lancement : armées favorites en tête du choix « Son armée »,
  // puis ses détachements (s'ils sont saisis), qui fixent sa disposition
  const baseLaunch = Screens.launch.body;
  Screens.launch.body = function (app) {
    const saved = AllFactions.slice();
    const rank = new Map(Armies.favs().map((id, i) => [id, i]));
    const r = x => rank.has(Armies.slug(x.name)) ? rank.get(Armies.slug(x.name)) : Infinity;
    AllFactions.sort((a, b) => (r(a) - r(b)) || a.name.localeCompare(b.name, "fr"));
    let html;
    try { html = baseLaunch.call(this, app); }
    finally { AllFactions.splice(0, AllFactions.length, ...saved); }
    const L = app.state.launch;
    if (!L) return html;
    const src = { kind: "launch", obj: L, name: L.oppFaction };
    const a = L.otherArmy ? null : Armies.oppArmy(src);
    let block = "";
    let avail = null;
    if (a && a.level === "vide") {
      block = `<p class="hint od-hint">Détachements de ${UI.esc(a.name)} pas encore saisis : choisis sa disposition à la main.</p>`;
    } else if (a) {
      const f = Armies.loaded(a.id);
      if (!f) {
        if (L._loadingArmy !== a.id) {
          L._loadingArmy = a.id;
          Armies.load(a.id).then(() => { if (App.state.screen === "launch") App.render(); })
            .catch(() => App.toast(`Le fichier factions/${a.file}.js est introuvable ou contient une erreur.`));
        }
        block = `<p class="hint od-hint">Chargement des détachements…</p>`;
      } else if (f.detachments.length) {
        const chosen = Armies.oppDets(L).filter(id => f.detachments.some(d => d.id === id));
        L.oppDets = chosen;
        const sel = f.detachments.filter(d => chosen.includes(d.id));
        if (sel.length) avail = Armies.dispositionsOf(sel);
        block = `<div class="field od-field"><span class="field-label">Ses détachements <small class="muted">plusieurs possibles</small></span>
          ${Armies.detChips(f, chosen, Armies.pointsOf(src))}</div>`;
      }
    }
    const anchor = `<div class="field"><span class="field-label">Sa disposition</span>`;
    if (block && html.includes(anchor)) html = html.replace(anchor, block + anchor);
    // Dispositions impossibles avec ses détachements : grisées
    if (avail && avail.length) {
      Object.keys(Dispositions).filter(id => !avail.includes(id)).forEach(id => {
        html = html.replace(`data-action="setOppDispo" data-arg="${id}"`,
          `data-action="setOppDispo" data-arg="${id}" disabled title="Impossible avec ses détachements"`);
      });
      if (avail.length === 1) html = html.replace(`<span class="field-label">Sa disposition</span>`,
        `<span class="field-label">Sa disposition <small class="muted">fixée par ses détachements</small></span>`);
    }
    return html;
  };

  // Changer d'armée adverse au lancement : l'ancien choix de détachements ne vaut plus
  const baseSetOpp = LaunchActions.setOppArmy;
  LaunchActions.setOppArmy = function (value) {
    const L = this.state.launch;
    if (L) { L.oppArmyId = null; L.oppDets = []; }
    return baseSetOpp.call(this, value);
  };

  // « Tout effacer » efface aussi ses détachements
  const baseReset = LaunchActions.resetOpp;
  LaunchActions.resetOpp = function () {
    const L = this.state.launch;
    if (L) { L.oppArmyId = null; L.oppDets = []; }
    return baseReset.call(this);
  };

  // Nouvelle partie : l'adversaire précédent est repris, ses détachements aussi (s'ils tiennent dans le format)
  const basePick = LaunchActions.pickListForGame;
  LaunchActions.pickListForGame = function (id) {
    const prev = this.state.launch;
    const res = basePick.call(this, id);
    const L = this.state.launch;
    if (prev && L && L !== prev && L.oppFaction === prev.oppFaction) {
      L.oppArmyId = prev.oppArmyId || null;
      const a = Armies.oppArmy({ obj: L, name: L.oppFaction });
      const f = a && Armies.loaded(a.id);
      const dets = Array.isArray(prev.oppDets) ? prev.oppDets.slice() : [];
      L.oppDets = f && dets.length && Armies.detState(f, dets, Armies.pointsOf({ kind: "launch", obj: L })).used >
        Rules.forPoints(Armies.pointsOf({ kind: "launch", obj: L })).detachmentPoints ? [] : dets;
      if (this.state.screen === "launch") this.render();
    }
    return res;
  };

  // Les détachements adverses choisis au lancement suivent la partie
  const baseStart = LaunchActions.startMatch;
  LaunchActions.startMatch = function () {
    const L = this.state.launch;
    let keep = null;
    if (L) {
      const a = L.otherArmy ? null : Armies.oppArmy({ obj: L, name: L.oppFaction });
      const f = a && Armies.loaded(a.id);
      const dets = Array.isArray(L.oppDets) ? L.oppDets.slice() : [];
      keep = { oppArmyId: L.oppArmyId || null, oppDets: dets,
               oppDetNames: f ? f.detachments.filter(d => dets.includes(d.id)).map(d => d.name) : [] };
    }
    const n = Store.data.games.length;
    const res = baseStart.call(this);
    const g = Store.data.games.length > n ? Store.data.games[Store.data.games.length - 1] : null;
    if (g && keep && (keep.oppArmyId || keep.oppDets.length)) { Object.assign(g, keep); Store.save(); }
    return res;
  };
  if (typeof App !== "undefined") Object.assign(App.actions, {
    setOppArmy: LaunchActions.setOppArmy, startMatch: LaunchActions.startMatch,
    resetOpp: LaunchActions.resetOpp, pickListForGame: LaunchActions.pickListForGame });

  // Historique : détachements adverses sous la ligne d'une partie
  const baseGameRow = Home.gameRow;
  Home.gameRow = function (g) {
    const html = baseGameRow.call(this, g);
    if (!g.oppDetNames || !g.oppDetNames.length) return html;
    return html.replace(`<div class="g-meta">`, `<div class="g-meta"><span class="g-odets">${UI.esc(g.oppDetNames.join(", "))}</span>`);
  };

  // Accueil : le bouton de consultation mentionne les armées
  const baseUi2 = UI.topbar;
  UI.topbar = function (app) {
    return baseUi2.call(this, app).replace(">Consulter unités, détachements, missions</button>", ">Consulter armées, détachements, missions</button>");
  };
})();
