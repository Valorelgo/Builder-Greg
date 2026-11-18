/* =========================================================
   MANŒUVRES À PIONS — compagnon de jeu
   Chargé après regles-etendues.js. Une règle d'armée peut décrire
   des capacités payées avec des pions (ex. Transe Guerrière des
   Aeldari) : elles s'affichent sous les stratagèmes, triées par
   phase, avec leur propre compteur de pions.

   Données (dans faction.armyRules[]) :
     maneuvers: {
       tracker: "pions-transe",        suivi faction.trackers (type "reserve")
                                       qui fournit les pions (format, bonus)
       title, unit ("pion"),
       onSpend: [{ ability | enhancement, text }]
                                       rappels quand un pion est dépensé
                                       (ex. relancer pour regagner un pion)
       items: [{ id, name, nameEn, moments: [{ tour, phase }],
                 repeatable: true,     plusieurs fois par phase
                 free: { abilities: [...], enhancements: [...] },
                                       sans pion pour ces unités
                 trigger, effect }]
     }
   Détachements :
     maneuverMods: [{ id?, text }]     précision affichée sur une manœuvre
                                       (sans id : sur toutes)
   ========================================================= */

(() => {

const css = `
.mv { margin-top: 14px; }
.mv-cnt { display: flex; align-items: center; gap: 8px; padding: 6px 10px; margin-bottom: 8px;
  border: 1px solid var(--accent); border-radius: 10px; background: color-mix(in srgb, var(--accent) 14%, transparent); }
.mv-cnt .mv-l { flex: 1; font-weight: 700; font-size: 14px; }
.mv-cnt .mv-l small { display: block; font-weight: 400; color: var(--muted); font-size: 12.5px; }
.mv-cnt b { font-size: 20px; min-width: 1.4em; text-align: center; }
.mv-cnt button { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--line); background: transparent; color: var(--text); font-size: 17px; }
.mv .sr-cp { color: var(--accent-light, var(--accent)); }
.mv-free { min-height: 34px; padding: 0 8px; border-radius: 8px; border: 1px dashed var(--line); background: transparent; color: var(--muted); font: inherit; font-size: 12.5px; }
.mv-mod { display: block; font-size: 12.5px; color: var(--muted); }
.mv-none { color: var(--muted); font-size: 13.5px; margin: 4px 2px 8px; }
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const tourOf = p => p.active === "me" ? "vous" : "adversaire";
const fits = (m, tour) => m.tour === tour || m.tour === "les-deux";

const Maneuvers = {

  // Règle d'armée active qui décrit des manœuvres (une seule par armée)
  rule(ctx) {
    if (!ctx || !ctx.faction) return null;
    return (ctx.faction.armyRules || []).find(r => r.maneuvers && Builder.ruleActive(ctx, r.id)) || null;
  },

  tracker(ctx, M) { return (ctx.faction.trackers || []).find(t => t.id === M.tracker); },

  /* ---------- Pions (mêmes clés que les réserves de regles-etendues.js) ---------- */

  pointsValue(table, points) {
    let v = 0;
    (table || []).forEach(([min, n]) => { if (points >= min) v = n; });
    return v;
  },

  // Valeur de départ et sources des pions en plus
  base(ctx, p, t) {
    let v = this.pointsValue(t.perPoints, ctx.state.points);
    const extra = [];
    const sel = Setup.selected(ctx);
    (t.bonus || []).forEach(b => {
      if (b.rounds && !b.rounds.includes(p.round)) return;
      let from = null;
      if (b.detachment) {
        const d = sel.find(x => x.id === b.detachment);
        if (!d) return;
        from = d.name;
      }
      if (b.enhancement) {
        const e = ctx.state.units.find(x => x.enhancement === b.enhancement);
        if (!e || p.destroyed[e.uid]) return;
        const en = Builder.enh(ctx, b.enhancement);
        from = `${en ? en.enh.name : "Optimisation"} (${Builder.label(ctx, e)})`;
      }
      v += b.add;
      extra.push(`+${b.add} ${from || ""}`.trim());
    });
    return { v, extra };
  },

  key(p, t) { return t.refill === "round" ? `${t.id}|R${p.round}` : t.id; },

  value(ctx, p, t) {
    const store = p.tracker.reserves || {};
    const k = this.key(p, t);
    return store[k] != null ? store[k] : this.base(ctx, p, t).v;
  },

  set(ctx, p, t, v) {
    (p.tracker.reserves = p.tracker.reserves || {})[this.key(p, t)] = Math.max(0, v);
  },

  /* ---------- Manœuvres ---------- */

  usedKey(p, it, ph) { return `${p.round}|${p.active}|${p.phase || ph}|${it.id}`; },
  usedCount(p, it, ph) { return ((p.mvUsed || {})[this.usedKey(p, it, ph)]) || 0; },

  // Précisions des détachements joués
  mods(ctx, it) {
    return Setup.selected(ctx).flatMap(d => (d.maneuverMods || [])
      .filter(m => !m.id || m.id === it.id).map(m => ({ text: m.text, from: d.name })));
  },

  // Unités en vie qui ont l'aptitude, ou entrées qui portent l'optimisation
  holders(ctx, p, spec) {
    if (!spec) return [];
    return ctx.state.units.filter(e => {
      if (p.destroyed[e.uid]) return false;
      const u = Builder.unit(ctx, e.unitId);
      if (!u) return false;
      if ((spec.enhancements || []).includes(e.enhancement)) return true;
      return (spec.abilities || []).length && PlayAbilities.of(ctx, e).some(a => spec.abilities.includes(a.name));
    });
  },

  // Rappels à la dépense d'un pion (ex. sur 3+, regagner un pion)
  spendNotes(ctx, p, M) {
    return (M.onSpend || []).map(n => {
      const who = this.holders(ctx, p, n.ability ? { abilities: [n.ability] } : { enhancements: [n.enhancement] });
      return who.length ? `${who.map(e => Builder.label(ctx, e)).join(", ")} : ${n.text}` : null;
    }).filter(Boolean);
  },

  // Manœuvres de ce tour, et leur phase
  now(ctx, p, M) {
    const tour = tourOf(p);
    return M.items.map(it => {
      const phases = [...new Set((it.moments || []).filter(m => fits(m, tour)).map(m => m.phase))];
      return { it, phases };
    }).filter(x => x.phases.length && (!p.phase || x.phases.includes(p.phase)));
  },

  counter(ctx, p, M, t) {
    const v = this.value(ctx, p, t), b = this.base(ctx, p, t);
    const unit = M.unit || "pion";
    const src = b.extra.length ? ` (${b.extra.join(", ")})` : "";
    return `<div class="mv-cnt"><span class="mv-l">${UI.esc(t.label)}
        <small>${t.refill === "round" ? `${b.v} au début du round${src}, perdus en fin de round.`
          : `${b.v} au début de la bataille${src}.`}</small></span>
      <button data-action="mvAdj" data-arg="-1" ${v ? "" : "disabled"} aria-label="Retirer 1 ${unit}">−</button><b>${v}</b>
      <button data-action="mvAdj" data-arg="1" aria-label="Ajouter 1 ${unit}">+</button></div>`;
  },

  html(app) {
    const ctx = Companion.ctx(app), g = Companion.game(app);
    const R = this.rule(ctx);
    if (!R || !g) return "";
    const p = g.play, M = R.maneuvers, t = this.tracker(ctx, M);
    if (!t) return "";
    const title = M.title || R.name;

    // Avant la bataille : consultation
    if (!p.active) {
      const when = it => [...new Set((it.moments || []).map(m => `${m.tour === "vous" ? "ton tour" : m.tour === "adversaire" ? "tour adverse" : "les deux tours"} · ${Labels.phase[m.phase]}`))].join(", ");
      return `<section class="mv"><h2 class="mx-h">${UI.esc(title)} <small>consultation</small></h2>
        ${M.items.map(it => `<div class="sr"><button class="sr-name" data-action="openManeuver" data-arg="${UI.esc(it.id)}">${UI.esc(it.name)}<small class="sr-when">${UI.esc(when(it))}</small></button>
          <span class="sr-cp">1</span></div>`).join("")}</section>`;
    }

    const v = this.value(ctx, p, t);
    const list = this.now(ctx, p, M);
    const rows = list.map(({ it, phases }) => {
      const ph = p.phase || phases[0];
      const n = this.usedCount(p, it, ph);
      const done = n > 0 && !it.repeatable;
      const free = this.holders(ctx, p, it.free);
      const mods = this.mods(ctx, it);
      return `<div class="sr ${done ? "is-used" : ""} ${v < 1 ? "is-poor" : ""}">
        <button class="sr-name" data-action="openManeuver" data-arg="${UI.esc(it.id)}">${UI.esc(it.name)}${n ? ` <span class='sr-ok'>✓${n > 1 ? `×${n}` : ""}</span>` : ""}
          ${p.phase ? "" : `<small class="sr-when">${phases.map(x => Labels.phase[x]).join(", ")}</small>`}
          ${mods.map(m => `<span class="mv-mod">${UI.fmt(m.text)}</span>`).join("")}</button>
        ${free.length ? `<button class="mv-free" data-action="useManeuver" data-arg="${UI.esc(it.id)}|${ph}|free" title="Sans pion : ${UI.esc(free.map(e => Builder.label(ctx, e)).join(", "))}">Gratuit</button>` : ""}
        <span class="sr-cp">1</span>
        <button class="sr-go" data-action="useManeuver" data-arg="${UI.esc(it.id)}|${ph}" ${done ? "disabled" : ""} aria-label="Utiliser ${UI.esc(it.name)}">▸</button></div>`;
    }).join("");
    const head = p.phase ? `${Labels.phase[p.phase]}` : (p.active === "me" ? "ton tour" : "tour adverse");
    return `<section class="mv"><h2 class="mx-h">${UI.esc(title)} <small>${UI.esc(head)}</small></h2>
      ${this.counter(ctx, p, M, t)}
      ${rows ? `<section class="sg is-current" style="--ph:${PhaseColors[p.phase] || PhaseColors.toutes}"><div class="sg-b">${rows}</div></section>`
        : `<p class="mv-none">Aucune manœuvre à ${p.phase ? "cette phase" : "ce tour"}.</p>`}</section>`;
  }
};

/* ---------- Colonne de gauche : sous les stratagèmes ---------- */

const baseStratColumn = Companion.stratColumn;
Companion.stratColumn = function (app) {
  return baseStratColumn.call(this, app) + Maneuvers.html(app);
};

// Le compteur des pions de manœuvre passe sous les stratagèmes : on ne le répète pas en haut
const baseTrackerBox = Companion.trackerBox;
Companion.trackerBox = function (app) {
  const ctx = this.ctx(app), R = Maneuvers.rule(ctx);
  if (!R) return baseTrackerBox.call(this, app);
  const f = ctx.faction, all = f.trackers;
  f.trackers = (all || []).filter(t => t.id !== R.maneuvers.tracker);
  try { return baseTrackerBox.call(this, app); } finally { f.trackers = all; }
};

/* ---------- Fiche d'une manœuvre ---------- */

Overlays.maneuver = function (app) {
  const ctx = Companion.ctx(app), R = Maneuvers.rule(ctx);
  const it = R && R.maneuvers.items.find(x => x.id === app.state.maneuverView);
  if (!it) return "";
  const p = Companion.game(app).play;
  const free = Maneuvers.holders(ctx, p, it.free), mods = Maneuvers.mods(ctx, it);
  const notes = Maneuvers.spendNotes(ctx, p, R.maneuvers);
  const when = [...new Set((it.moments || []).map(m => `${m.tour === "vous" ? "ton tour" : m.tour === "adversaire" ? "tour adverse" : "les deux tours"}, phase de ${Labels.phase[m.phase]}`))].join(" ; ");
  return this.wrap(`
    <div class="ov-head"><span class="muted">${UI.esc(R.name)} · 1 pion</span><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <h2>${UI.esc(it.name)}${it.nameEn ? ` <small class="muted">${UI.esc(it.nameEn)}</small>` : ""}</h2>
    <p class="muted">${UI.esc(when)}${it.repeatable ? " · plusieurs fois par phase (unités différentes)" : " · une fois par phase"}</p>
    <p><b>Déclencheur :</b> ${UI.fmt(it.trigger)}</p>
    <p><b>Effet :</b> ${UI.fmt(it.effect)}</p>
    ${mods.map(m => `<p><b>${UI.esc(m.from)} :</b> ${UI.fmt(m.text)}</p>`).join("")}
    ${free.length ? `<p><b>Sans pion :</b> ${UI.esc(free.map(e => Builder.label(ctx, e)).join(", "))}.</p>` : ""}
    ${notes.length ? `<p class="hint">${notes.map(n => UI.fmt(n)).join("<br>")}</p>` : ""}
    <p class="hint">Une unité ne fait qu'une manœuvre agile par phase.</p>`, "ov-narrow");
};

/* ---------- Actions ---------- */

const ManeuverActions = {
  openManeuver(id) { this.state.maneuverView = id; this.state.overlay = "maneuver"; this.render(); },

  mvAdj(d) {
    const ctx = Companion.ctx(this), R = Maneuvers.rule(ctx);
    const t = R && Maneuvers.tracker(ctx, R.maneuvers);
    if (!t) return;
    Companion.mutate(this, p => {
      Maneuvers.set(ctx, p, t, Maneuvers.value(ctx, p, t) + Number(d));
      Companion.log(p, "trk", `${t.label} : ${Maneuvers.value(ctx, p, t)}`);
    });
  },

  useManeuver(arg) {
    const [id, ph, how] = arg.split("|");
    const ctx = Companion.ctx(this), R = Maneuvers.rule(ctx);
    if (!R) return;
    const M = R.maneuvers, it = M.items.find(x => x.id === id), t = Maneuvers.tracker(ctx, M);
    const p0 = Companion.game(this).play;
    if (!it || !t) return;
    const free = how === "free";
    if (!free && Maneuvers.value(ctx, p0, t) < 1 && !confirm(`Plus de ${t.label.toLowerCase()}. L'utiliser quand même ?`)) return;
    this.state.overlay = null;
    const notes = free ? [] : Maneuvers.spendNotes(ctx, p0, M);
    Companion.mutate(this, p => {
      if (!free) Maneuvers.set(ctx, p, t, Maneuvers.value(ctx, p, t) - 1);
      // Gratuit : ne compte pas dans la limite d'une fois par phase
      if (!free) { const k = Maneuvers.usedKey(p, it, ph); (p.mvUsed = p.mvUsed || {})[k] = ((p.mvUsed || {})[k] || 0) + 1; }
      Companion.log(p, "strat", `${it.name}${free ? " (sans pion)" : ` : −1 ${M.unit || "pion"}`}`);
    });
    this.toast(`${it.name}${free ? " : sans pion" : ` : −1 ${M.unit || "pion"}`}${notes.length ? ` · ${notes.join(" · ")}` : ""}`);
  }
};
Object.assign(CompanionActions, ManeuverActions);
if (typeof App !== "undefined") Object.assign(App.actions, ManeuverActions);

window.Maneuvers = Maneuvers;

})();
