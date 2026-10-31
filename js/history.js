/* =========================================================
   HISTORIQUE — filtres cumulables, bilan, fiche de partie
   ========================================================= */

const History = {

  // Filtres de la session (non enregistrés)
  filters(app) {
    return app.state.hist || (app.state.hist = { myFaction: "", oppFaction: "", results: [], myDispos: [], oppDispos: [],
                                                 opp: "", roles: [], list: "", from: "", to: "" });
  },

  active(f) {
    return Object.values(f).some(v => Array.isArray(v) ? v.length : !!v);
  },

  day(iso) { return (iso || "").slice(0, 10); },

  apply(app) {
    const f = this.filters(app);
    return [...Store.data.games]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .filter(g =>
        (!f.myFaction || g.myFaction === f.myFaction) &&
        (!f.oppFaction || g.oppFaction === f.oppFaction) &&
        (!f.results.length || f.results.includes(g.result || "en-cours")) &&
        (!f.myDispos.length || f.myDispos.includes(g.myDisposition)) &&
        (!f.oppDispos.length || f.oppDispos.includes(g.oppDisposition)) &&
        (!f.opp || (g.oppName || "") === f.opp) &&
        (!f.roles.length || f.roles.includes(g.role)) &&
        (!f.list || g.listId === f.list) &&
        (!f.from || this.day(g.date) >= f.from) &&
        (!f.to || this.day(g.date) <= f.to));
  },

  // Bilan d'un ensemble de parties terminées
  record(games) {
    const done = games.filter(g => g.result);
    const n = r => done.filter(g => g.result === r).length;
    const v = n("victoire"), d = n("defaite"), e = n("egalite"), t = done.length;
    const pct = x => t ? Math.round(x / t * 100) : 0;
    const scored = done.filter(g => g.score);
    const avg = k => scored.length ? Math.round(scored.reduce((s, g) => s + g.score[k], 0) / scored.length) : null;
    return { t, v, d, e, pv: pct(v), pd: pct(d), pe: pct(e), me: avg("me"), opp: avg("opp") };
  },

  // Bilan par valeur d'un champ (faction adverse, adversaire…)
  breakdown(games, key, label) {
    const groups = {};
    games.filter(g => g.result).forEach(g => {
      const k = key(g) || "Non renseigné";
      (groups[k] = groups[k] || []).push(g);
    });
    return Object.entries(groups).map(([k, gs]) => ({ k, label: label ? label(k) : k, r: this.record(gs) }))
      .sort((a, b) => b.r.t - a.r.t || b.r.pv - a.r.pv);
  },

  // Mes secondaires : piochées, réalisées, échangées, points moyens
  secondaryStats(games) {
    const m = {};
    const row = n => m[n] || (m[n] = { name: n, drawn: 0, done: 0, swapped: 0, sacrificed: 0, pts: 0 });
    games.filter(g => g.play && g.result).forEach(g => {
      const S = g.play.sec.me;
      S.drawn.forEach(n => row(n).drawn++);
      S.done.forEach(d => { row(d.name).done++; row(d.name).pts += d.pts; });
      (S.swapped || []).forEach(n => row(n).swapped++);
      (S.sacrificed || []).forEach(n => row(n).sacrificed++);
    });
    return Object.values(m).sort((a, b) => b.done - a.done || b.drawn - a.drawn);
  },

  // Mes missions primaires : parties, points moyens, % victoires
  primaryStats(games) {
    const m = {};
    games.filter(g => g.result && g.myMission).forEach(g => {
      const r = m[g.myMission] || (m[g.myMission] = { name: g.myMission, games: [], pts: [] });
      r.games.push(g);
      if (g.play) r.pts.push(Companion.totals({ state: { gameId: g.id } }, "me").prim);
    });
    return Object.values(m).map(r => ({ ...r, r: this.record(r.games),
      avg: r.pts.length ? Math.round(r.pts.reduce((a, b) => a + b, 0) / r.pts.length) : null }))
      .sort((a, b) => b.r.t - a.r.t);
  },

  secTable(rows) {
    if (!rows.length) return "";
    return `<div class="hb"><h3>Mes secondaires</h3><table class="htab">
      <thead><tr><th></th><th>Piochée</th><th>Réalisée</th><th>Échangée</th><th>Sacrifiée</th><th>Réussite</th><th>PdV moyens</th></tr></thead>
      <tbody>${rows.map(x => `<tr><td>${UI.esc(x.name)}</td><td>${x.drawn}</td><td class="v">${x.done}</td><td>${x.swapped}</td><td>${x.sacrificed}</td>
        <td>${x.drawn ? Math.round(x.done / x.drawn * 100) : 0} %</td><td>${x.done ? (x.pts / x.done).toFixed(1).replace(".0", "") : "—"}</td></tr>`).join("")}</tbody></table></div>`;
  },

  primTable(rows) {
    if (!rows.length) return "";
    return `<div class="hb"><h3>Mes missions primaires</h3><table class="htab">
      <thead><tr><th></th><th>Parties</th><th>Primaire moyen</th><th>% victoires</th></tr></thead>
      <tbody>${rows.map(x => `<tr><td>${UI.esc(x.name)}</td><td>${x.r.t}</td><td>${x.avg != null ? x.avg : "—"}</td>
        <td><div class="htab-pct"><b>${x.r.pv} %</b>${this.bar(x.r)}</div></td></tr>`).join("")}</tbody></table></div>`;
  },

  uniq(arr) { return [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b)); },

  /* ---------- Rendu ---------- */

  chips(field, options, f) {
    return `<div class="hf-chips">${options.map(([id, label, color]) => {
      const on = f[field].includes(id);
      return `<button class="hf-chip ${on ? "is-on" : ""}" ${color ? `style="--c:${color}"` : ""}
        data-action="histToggle" data-arg="${field}|${id}" aria-pressed="${on}">${UI.esc(label)}</button>`;
    }).join("")}</div>`;
  },

  select(field, options, f, empty) {
    return `<select class="hf-sel" data-change="histSet" data-field="${field}">
      <option value="">${empty}</option>
      ${options.map(([v, l]) => `<option value="${UI.esc(v)}" ${f[field] === v ? "selected" : ""}>${UI.esc(l)}</option>`).join("")}</select>`;
  },

  filtersPanel(app) {
    const f = this.filters(app), all = Store.data.games;
    const myF = this.uniq(all.map(g => g.myFaction)).map(id => [id, (Home.factionOf(id) || { name: id }).name]);
    const oppF = this.uniq(all.map(g => g.oppFaction)).map(n => [n, n]);
    const opps = this.uniq(all.map(g => g.oppName)).map(n => [n, n]);
    const lists = this.uniq(all.map(g => g.listId)).map(id => {
      const g = all.find(x => x.listId === id);
      return [id, g.listName || "Liste supprimée"];
    });
    const dispo = DispositionOrder.map(id => [id, Dispositions[id].name, Dispositions[id].color]);
    const quick = [["30", "30 derniers jours"], ["90", "3 derniers mois"], ["year", "Cette année"]];
    return `<aside class="hist-filters" data-pane="hf">
      <div class="hf-top"><h2>Filtres</h2>
        ${this.active(f) ? `<button class="btn btn-s" data-action="histClear">Effacer les filtres</button>` : ""}</div>
      <label class="hf"><span>Ma faction</span>${this.select("myFaction", myF, f, "Toutes")}</label>
      <label class="hf"><span>Faction adverse</span>${this.select("oppFaction", oppF, f, "Toutes")}</label>
      <label class="hf"><span>Adversaire</span>${this.select("opp", opps, f, "Tous")}</label>
      <label class="hf"><span>Liste jouée</span>${this.select("list", lists, f, "Toutes")}</label>
      <div class="hf"><span>Résultat</span>${this.chips("results", [["victoire", "Victoire"], ["defaite", "Défaite"], ["egalite", "Égalité"], ["en-cours", "En cours"]], f)}</div>
      <div class="hf"><span>Mon rôle</span>${this.chips("roles", [["attaquant", "Attaquant"], ["defenseur", "Défenseur"]], f)}</div>
      <div class="hf"><span>Ma disposition</span>${this.chips("myDispos", dispo, f)}</div>
      <div class="hf"><span>Disposition adverse</span>${this.chips("oppDispos", dispo, f)}</div>
      <div class="hf"><span>Période</span>
        <div class="hf-dates"><input type="date" value="${f.from}" data-change="histSet" data-field="from" aria-label="Du">
          <span>au</span><input type="date" value="${f.to}" data-change="histSet" data-field="to" aria-label="Au"></div>
        <div class="hf-chips">${quick.map(([k, l]) => `<button class="hf-chip" data-action="histPeriod" data-arg="${k}">${l}</button>`).join("")}</div></div>
    </aside>`;
  },

  recordBox(r, title) {
    if (!r.t) return `<div class="hb"><h3>${title}</h3><p class="hint">Aucune partie terminée dans cette sélection.</p></div>`;
    return `<div class="hb"><h3>${title}</h3>
      <div class="hb-row">
        <div class="hb-big"><b>${r.t}</b><span>partie${r.t > 1 ? "s" : ""}</span></div>
        <div class="hb-big hb-v"><b>${r.pv} %</b><span>${r.v} victoire${r.v > 1 ? "s" : ""}</span></div>
        <div class="hb-big hb-d"><b>${r.pd} %</b><span>${r.d} défaite${r.d > 1 ? "s" : ""}</span></div>
        <div class="hb-big hb-e"><b>${r.pe} %</b><span>${r.e} égalité${r.e > 1 ? "s" : ""}</span></div>
        ${r.me != null ? `<div class="hb-big"><b>${r.me} – ${r.opp}</b><span>score moyen</span></div>` : ""}
      </div>${this.bar(r)}</div>`;
  },

  bar(r) {
    return `<div class="hbar" title="${r.v} V · ${r.e} N · ${r.d} D"><span class="v" style="flex:${r.v}"></span><span class="e" style="flex:${r.e}"></span><span class="d" style="flex:${r.d}"></span></div>`;
  },

  table(title, rows, chip) {
    if (!rows.length) return "";
    return `<div class="hb"><h3>${title}</h3><table class="htab">
      <thead><tr><th></th><th>Parties</th><th>V</th><th>N</th><th>D</th><th>% victoires</th></tr></thead>
      <tbody>${rows.map(x => `<tr><td>${chip ? chip(x.k) : UI.esc(x.label)}</td><td>${x.r.t}</td><td class="v">${x.r.v}</td>
        <td>${x.r.e}</td><td class="d">${x.r.d}</td><td><div class="htab-pct"><b>${x.r.pv} %</b>${this.bar(x.r)}</div></td></tr>`).join("")}</tbody></table></div>`;
  },

  /* ---------- Fiche d'une partie ---------- */

  detail(g) {
    const fake = { state: { gameId: g.id } };
    const t = side => g.play ? Companion.totals(fake, side) : null;
    const me = t("me"), op = t("opp");
    const labels = { victoire: "Victoire", defaite: "Défaite", egalite: "Égalité" };
    const role = g.role === "attaquant" ? "Attaquant" : g.role === "defenseur" ? "Défenseur" : "Non renseigné";
    const secs = side => g.play && g.play.sec[side].done.length
      ? g.play.sec[side].done.map(d => `${UI.esc(d.name)} <small>(${d.pts} PdV, round ${d.round})</small>`).join("<br>") : "—";
    return `<div class="gd">
      <div class="gd-head res-${g.result || "en-cours"}"><span class="g-res">${g.result ? labels[g.result] : "En cours"}</span>
        <span class="gd-score">${g.score ? `${g.score.me} – ${g.score.opp}` : ""}</span></div>
      <dl class="summary">
        <dt>Date</dt><dd>${Home.date(g.date)}</dd>
        <dt>Adversaire</dt><dd>${UI.esc(g.oppName || "Non renseigné")}</dd>
        <dt>Armées</dt><dd>${Home.factionChip(g.myFaction)} <span class="muted">contre</span> ${Home.factionChip(g.oppFaction)}</dd>
        <dt>Ma liste</dt><dd>${UI.esc(g.listName || "")} · ${g.points || ""} pts</dd>
        <dt>Dispositions</dt><dd>${UI.dispoChip(g.myDisposition)} <span class="muted">contre</span> ${UI.dispoChip(g.oppDisposition)}</dd>
        <dt>Mon rôle</dt><dd>${role}</dd>
        <dt>Missions</dt><dd>${UI.esc(g.myMission || "?")} <span class="muted">/</span> ${UI.esc(g.oppMission || "?")}</dd>
        ${g.deployment ? `<dt>Mise en place</dt><dd>${UI.esc(Deployments.name(g.myDisposition, g.oppDisposition, g.deployment))}</dd>` : ""}
        ${me ? `<dt>Mon score</dt><dd>${me.prim} primaire · ${me.sec} secondaire${me.paint ? ` · ${me.paint} peinture` : ""}</dd>
          <dt>Son score</dt><dd>${op.prim} primaire · ${op.sec} secondaire${op.paint ? ` · ${op.paint} peinture` : ""}</dd>` : ""}
        <dt>Mes secondaires</dt><dd>${secs("me")}</dd>
        <dt>Ses secondaires</dt><dd>${secs("opp")}</dd>
      </dl>
      ${g.notes ? `<h3 class="prep-h">Notes de partie</h3><p class="gd-note">${UI.esc(g.notes)}</p>` : ""}
      ${g.debrief ? `<h3 class="prep-h">Bilan à chaud</h3><p class="gd-note">${UI.esc(g.debrief)}</p>` : ""}
      <h3 class="prep-h">${g.debrief ? "Modifier le bilan" : "Ajouter un bilan"}</h3>
      <textarea class="gnote" data-input="histNote" data-id="${g.id}" placeholder="Ce qui a marché, ce qui a raté…">${UI.esc(g.debrief || "")}</textarea></div>`;
  }
};

/* ---------- Écran ---------- */

Screens.history = {
  body(app) {
    const games = History.apply(app);
    const f = History.filters(app);
    const r = History.record(games);
    const byFaction = History.breakdown(games, g => g.oppFaction);
    const byOpp = History.breakdown(games, g => g.oppName);
    const byMine = History.breakdown(games, g => g.myFaction);
    return `<section class="screen screen-history">
      ${History.filtersPanel(app)}
      <div class="hist-main" data-pane="hm">
        ${History.recordBox(r, History.active(f) ? "Bilan de la sélection" : "Bilan global")}
        <div class="hb-grid">
          ${History.table("Contre chaque faction", byFaction, k => Home.factionChip(k))}
          ${History.table("Contre chaque joueur", byOpp)}
          ${byMine.length > 1 ? History.table("Avec chacune de mes factions", byMine, k => Home.factionChip(k)) : ""}
          ${History.table("Dispositions : la mienne contre la sienne", History.breakdown(games, g => g.myDisposition && g.oppDisposition ? `${g.myDisposition}|${g.oppDisposition}` : null),
              k => k.includes("|") ? `${UI.dispoChip(k.split("|")[0])} <span class="muted">vs</span> ${UI.dispoChip(k.split("|")[1])}` : UI.esc(k))}
          ${History.primTable(History.primaryStats(games))}
        </div>
        ${History.secTable(History.secondaryStats(games))}
        <h3 class="hist-h">${games.length} partie${games.length > 1 ? "s" : ""}</h3>
        ${games.map(g => Home.gameRow(g)).join("") || `<p class="hint">Aucune partie ne correspond à ces filtres.</p>`}
      </div>
    </section>`;
  },
  actions() { return ""; },
  back() { return { label: "Retour à l'accueil", action: "goHome" }; }
};

Overlays.gameDetail = function (app) {
  const g = Store.data.games.find(x => x.id === app.state.gameDetail);
  if (!g) return "";
  return this.wrap(`
    <div class="ov-head"><h2>Partie du ${Home.date(g.date)}</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${History.detail(g)}
    <div class="ov-btns"><button class="btn btn-danger" data-action="deleteGame" data-arg="${g.id}">Supprimer de l'historique</button></div>`, "ov-narrow");
};

/* ---------- Actions ---------- */

const HistoryActions = {
  histSet(value, el) { History.filters(this)[el.dataset.field] = value; this.render(); },

  histToggle(arg) {
    const [field, id] = arg.split("|");
    const a = History.filters(this)[field];
    const i = a.indexOf(id);
    if (i >= 0) a.splice(i, 1); else a.push(id);
    this.render();
  },

  histPeriod(k) {
    const f = History.filters(this), now = new Date();
    const iso = d => d.toISOString().slice(0, 10);
    if (k === "year") f.from = `${now.getFullYear()}-01-01`;
    else { const d = new Date(now); d.setDate(d.getDate() - Number(k)); f.from = iso(d); }
    f.to = iso(now);
    this.render();
  },

  histNote(value, el) {
    const g = Store.data.games.find(x => x.id === el.dataset.id);
    if (g) { g.debrief = value; Store.save(); }
  },

  histClear() { this.state.hist = null; this.render(); },

  openGameDetail(id) { this.state.gameDetail = id; this.state.overlay = "gameDetail"; this.render(); },

  deleteGame(id) {
    const i = Store.data.games.findIndex(g => g.id === id);
    if (i < 0 || !confirm("Supprimer cette partie de ton historique ?")) return;
    const [g] = Store.data.games.splice(i, 1);
    Store.save();
    this.state.overlay = null;
    this.render();
    this.toast("Partie supprimée.", () => { Store.data.games.splice(i, 0, g); Store.save(); this.render(); });
  }
};
