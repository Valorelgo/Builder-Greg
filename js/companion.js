/* =========================================================
   COMPAGNON DE JEU
   Trois colonnes : stratagèmes | mes missions | missions adverses
   + fenêtre mobile « Mon armée ».
   L'état de la partie est enregistré dans la partie (game.play)
   après chaque action ; « Annuler » revient en arrière action par action.
   ========================================================= */

const PhaseOrder = ["commandement", "mouvement", "tir", "charge", "combat"];
const PhaseColors = {
  commandement: "#c9a227", mouvement: "#3f8fd2", tir: "#d2643f",
  charge: "#c0398f", combat: "#b83a3a", toutes: "#7d7286"
};
const MaxPerRound = 15, MaxPerGame = 45;
// Armée peinte (« Battle Ready ») : chaque joueur commence la partie avec 10 PdV
const BattleReady = 10;

const Companion = {

  game(app) { return Store.data.games.find(g => g.id === app.state.gameId); },
  ctx(app) { return app.state.match && app.state.match.ctx; },
  other(side) { return side === "me" ? "opp" : "me"; },

  settings() {
    const s = Store.data.settings;
    if (!s.trackPhases) s.trackPhases = { me: true, opp: true };
    return s;
  },

  newPlay() {
    const sec = () => ({ hand: [], drawn: [], done: [], swapUsed: false, pendingDraw: 0 });
    return { first: null, round: 1, active: null, phase: null, cp: { me: 0, opp: 0 },
             prim: { me: {}, opp: {} }, sec: { me: sec(), opp: sec() },
             strat: {}, battleUsed: {}, destroyed: {}, tracker: { value: 0, gage: 0, designation: null },
             finished: false, battleReady: true };
  },

  // Charge la faction de la partie (stratagèmes, cartes d'unités)
  async open(app, id) {
    const g = Store.data.games.find(x => x.id === id);
    if (!g) return;
    if (!g.play) g.play = this.newPlay();
    // Parties commencées avant l'ajout des PdV de peinture : comptés aussi tant qu'elles ne sont pas finies
    if (!g.play.finished && g.play.battleReady == null) g.play.battleReady = true;
    const entry = FactionCatalog.find(f => f.id === g.myFaction);
    let ctx = null;
    if (entry) {
      try {
        const faction = await Loader.loadFaction(entry);
        ctx = { faction, toast: m => app.toast(m),
                state: { units: g.army.units, detachments: g.army.detachments, points: g.points } };
        await Loader.loadExtras(ctx);
        document.documentElement.style.setProperty("--accent", entry.color);
      } catch (e) { app.toast(`Le fichier de faction est introuvable : ${entry.file}.js`); }
    }
    app.state.gameId = id;
    app.state.match = { ctx, undo: [], stratOpen: {}, armyOpen: false, armyCard: null };
    // Avant la bataille : bandeau « qui joue en premier » (non bloquant), le reste reste consultable
    app.state.overlay = null;
    app.state.screen = "game";
    app.render({ resetScroll: true });
  },

  /* ---------- Modifications (avec annulation) ---------- */

  mutate(app, fn) {
    const g = this.game(app);
    const m = app.state.match;
    m.undo.push(JSON.stringify(g.play));
    if (m.undo.length > 80) m.undo.shift();
    fn(g.play, g);
    Store.save();
    app.render();
  },

  startTurn(p, side) {
    p.active = side;
    p.cp.me += 1; p.cp.opp += 1;
    p.phase = null;
    this.log(p, "cp", "Début du tour : +1 PC pour chaque joueur");
    p.sec[side].pendingDraw += 2;
    p.phase = this.settings().trackPhases[side] ? "commandement" : null;
  },

  turnLabel(app, p) {
    const g = this.game(app);
    return p.active === "me" ? "Ton tour" : `Tour de ${g.oppName || "l'adversaire"}`;
  },

  /* ---------- Missions : lignes et points ---------- */

  blockApplies(r, round) {
    if (r === "tous") return true;
    if (r === "fin") return round === 5;
    let m = String(r).match(/^(\d)\+$/);
    if (m) return round >= Number(m[1]);
    m = String(r).match(/^(\d)-(\d)$/);
    if (m) return round >= Number(m[1]) && round <= Number(m[2]);
    return Number(r) === round;
  },

  // Blocs « persistent » : la sélection du round précédent est reportée au nouveau round
  carry(p, g, sides = ["me", "opp"]) {
    sides.forEach(side => {
      const m = this.mission(g, side);
      if (!m) return;
      m.scoring.forEach((b, bi) => {
        if (!b.persistent || !this.blockApplies(b.round, p.round)) return;
        b.lines.forEach((l, li) => {
          const prev = p.prim[side][`${p.round - 1}|${bi}|${li}`], k = `${p.round}|${bi}|${li}`;
          if (prev && p.prim[side][k] == null) p.prim[side][k] = prev;
        });
      });
    });
  },

  lineValue(l, v) { return l.per ? (v || 0) * l.pts : (v ? l.pts : 0); },

  // Points de mission primaire d'un camp pour un round (avant plafond)
  primRaw(app, side, round) {
    const g = this.game(app), p = g.play;
    const m = this.mission(g, side);
    if (!m) return 0;
    let sum = 0;
    Object.entries(p.prim[side]).forEach(([k, v]) => {
      const [r, bi, li] = k.split("|").map(Number);
      if (r !== round) return;
      const l = m.scoring[bi] && m.scoring[bi].lines[li];
      if (l) sum += this.lineValue(l, v);
    });
    return sum;
  },
  secRaw(app, side, round) {
    return this.game(app).play.sec[side].done.filter(d => d.round === round).reduce((s, d) => s + d.pts, 0);
  },

  totals(app, side) {
    const p = this.game(app).play;
    let prim = 0, sec = 0;
    for (let r = 1; r <= 5; r++) {
      prim += Math.min(this.primRaw(app, side, r), MaxPerRound);
      sec += Math.min(this.secRaw(app, side, r), MaxPerRound);
    }
    prim = Math.min(prim, MaxPerGame); sec = Math.min(sec, MaxPerGame);
    const paint = p.battleReady ? BattleReady : 0;
    const round = { prim: this.primRaw(app, side, p.round), sec: this.secRaw(app, side, p.round) };
    return { prim, sec, paint, total: prim + sec + paint, round };
  },

  mission(g, side) {
    const name = side === "me" ? g.myMission : g.oppMission;
    const data = g.missionsData && (side === "me" ? g.missionsData.mine : g.missionsData.opp);
    return data || Missions[name] || null;
  },

  /* ---------- Stratagèmes ---------- */

  stratagems(app) {
    const ctx = this.ctx(app);
    const det = ctx ? Setup.selected(ctx).flatMap(d => (d.stratagems || []).map(s => Object.assign({ _det: d.name }, s))) : [];
    return det.concat(CoreStratagems.map(s => Object.assign({ _det: "Base" }, s)));
  },

  sid(s) { return s.id || s.name; },

  // Groupes de phase pour le tour en cours (mes stratagèmes au tour adverse = « adversaire »)
  stratGroups(app) {
    const p = this.game(app).play;
    const tour = p.active === "me" ? "vous" : "adversaire";
    const groups = {};
    this.stratagems(app).forEach(s => {
      (s.moments || []).forEach(m => {
        if (m.tour !== tour && m.tour !== "les-deux") return;
        (groups[m.phase] = groups[m.phase] || []);
        if (!groups[m.phase].includes(s)) groups[m.phase].push(s);
      });
    });
    return groups;
  },

  // Phase réelle si elle est suivie (un stratagème « Toute phase » reste utilisable aux autres phases)
  stratKey(p, phase, s) { return `${p.round}|${p.active}|${p.phase || phase}|${this.sid(s)}`; },

  // Clé de la limite propre au stratagème (1 fois par bataille, par round, par tour)
  limitKey(p, s) {
    const id = this.sid(s);
    if (s.limite === "une-fois-par-bataille") return `B|${id}`;
    if (s.limite === "une-fois-par-round") return `R${p.round}|${id}`;
    if (s.limite === "une-fois-par-tour") return `T${p.round}${p.active}|${id}`;
    return null;
  },

  limitUsed(p, s) {
    const k = this.limitKey(p, s);
    return !!(k && ((p.stratLimit || {})[k] || (s.limite === "une-fois-par-bataille" && p.battleUsed[this.sid(s)])));
  },

  stratUsed(p, phase, s) { return !!p.strat[this.stratKey(p, phase, s)] || this.limitUsed(p, s); },

  // Masqué : limite atteinte, ou déjà joué à cette phase (quand les phases sont suivies)
  stratHidden(p, phase, s) { return this.limitUsed(p, s) || (!!p.phase && !!p.strat[this.stratKey(p, phase, s)]); },

  /* ---------- Rendu : barre du haut ---------- */

  topbar(app) {
    const g = this.game(app);
    if (!g) return `<button class="brand" data-action="goHome">Builder 40K</button>`;
    const p = g.play, t = this.totals(app, "me"), o = this.totals(app, "opp");
    const m = app.state.match || {};
    const cp = side => `<div class="mt-cp ${side}">
        <span class="mt-cp-l">${side === "me" ? "Moi" : UI.esc(g.oppName || "Adv.")}</span>
        <button data-action="cpAdj" data-arg="${side}|-1" aria-label="Retirer 1 PC">−</button>
        <b>${p.cp[side]}</b><small>PC</small>
        <button data-action="cpAdj" data-arg="${side}|1" aria-label="Ajouter 1 PC">+</button></div>`;
    return `<button class="brand" data-action="goHome" title="Accueil">40K</button>
      <div class="mt-turn ${p.active === "opp" ? "is-opp" : ""}">
        <span class="mt-round">Round ${p.round}/5</span><b>${p.active ? UI.esc(this.turnLabel(app, p)) : "Avant la bataille"}</b></div>
      ${cp("me")}${cp("opp")}
      <div class="mt-score" title="Primaire + secondaire"><b>${t.total}</b><span>–</span><b>${o.total}</b></div>
      <div class="mt-acts">
        <button class="btn ${m.armyOpen ? "is-on" : ""}" data-action="armyToggle">Armée</button>
        <button class="btn ${m.rulesOpen ? "is-on" : ""}" data-action="rulesToggle">Règles</button>
        <button class="btn" data-action="openOverlay" data-arg="allStrats" title="Tous les stratagèmes de la liste">Stratagèmes</button>
        <button class="btn" data-action="openOverlay" data-arg="journal">Journal</button>
        <button class="btn" data-action="matchUndo" ${m.undo && m.undo.length ? "" : "disabled"} title="Annuler la dernière action">↶</button>
        <button class="btn" data-action="openOverlay" data-arg="matchMenu" aria-label="Menu">⋯</button>
        <button class="btn btn-primary" data-action="endTurn" ${p.active && !p.finished ? "" : "disabled"}>Fin du tour ▸</button>
      </div>`;
  },

  /* ---------- Rendu : écran ---------- */

  body(app) {
    const g = this.game(app);
    if (!g) return `<section class="screen"><p class="hint">Partie introuvable.</p></section>`;
    const p = g.play;
    const tracked = p.active && this.settings().trackPhases[p.active];
    const phaseBar = tracked ? `<nav class="phase-bar">${PhaseOrder.map(ph => `<button class="ph ${p.phase === ph ? "is-on" : ""}"
        style="--ph:${PhaseColors[ph]}" data-action="setPhase" data-arg="${ph}">${Labels.phase[ph]}</button>`).join("")}</nav>` : "";
    const pre = !p.first ? `<div class="pre-bar"><span class="pre-t">Avant la bataille</span>
        <span class="pre-h">Qui joue en premier ?</span>
        <button class="btn btn-primary" data-action="setFirst" data-arg="me">Moi</button>
        <button class="btn btn-primary" data-action="setFirst" data-arg="opp">${UI.esc(g.oppName || "Mon adversaire")}</button>
        <span class="pre-hint">Armée, règles, carte et stratagèmes restent consultables en attendant.</span></div>` : "";
    return `<section class="screen screen-match ${tracked ? "has-phases" : ""}">
      ${pre}${phaseBar}
      <div class="mx-cols">
        <aside class="mx-col mx-strat" data-pane="strat">${this.trackerBox(app)}${PlayAbilities.box(app)}${this.stratColumn(app)}</aside>
        <main class="mx-col mx-mine" data-pane="mine">${this.missionColumn(app, "me")}</main>
        <aside class="mx-col mx-opp" data-pane="opp">${this.missionColumn(app, "opp")}</aside>
      </div>
      ${this.armyWindow(app)}
      ${this.rulesWindow(app)}
    </section>`;
  },

  /* ---------- Colonne : stratagèmes ---------- */

  stratColumn(app) {
    const p = this.game(app).play;
    if (!p.active) return this.stratPreview(app);
    const groups = this.stratGroups(app);
    Object.keys(groups).forEach(ph => {
      groups[ph] = groups[ph].filter(s => !this.stratHidden(p, ph, s));
      if (!groups[ph].length) delete groups[ph];
    });
    const tracked = !!p.phase;
    let order = PhaseOrder.concat("toutes").filter(ph => groups[ph]);
    if (tracked) order = [p.phase, "toutes"].filter(ph => groups[ph]).concat(order.filter(ph => ph !== p.phase && ph !== "toutes"));
    const open = app.state.match.stratOpen;
    return `<h2 class="mx-h">Stratagèmes <small>${p.active === "me" ? "ton tour" : "tour adverse"}</small></h2>` +
      order.map(ph => {
        const isOpen = !tracked || ph === p.phase || ph === "toutes" || open[ph];
        const rows = groups[ph].map(s => {
          const used = this.stratUsed(p, ph, s);
          const poor = p.cp.me < s.cp;
          // Stratagème à modes (ex. Intervention Héroïque) : coût variable, choix du mode dans sa fiche
          const extra = s.modes ? Math.max(...s.modes.map(m => m.cpExtra || 0)) : 0;
          return `<div class="sr ${used ? "is-used" : ""} ${poor ? "is-poor" : ""}">
            <button class="sr-name" data-action="openStrat" data-arg="${UI.esc(this.sid(s))}|${ph}">${UI.esc(s.name)}${used ? " <span class='sr-ok'>✓</span>" : ""}</button>
            <span class="sr-cp">${s.cp}${extra ? `–${s.cp + extra}` : ""} PC</span>
            <button class="sr-go" data-action="${s.modes ? "openStrat" : "useStrat"}" data-arg="${UI.esc(this.sid(s))}|${ph}" aria-label="Utiliser ${UI.esc(s.name)}">▸</button></div>`;
        }).join("");
        const cur = tracked && ph === p.phase;
        return `<section class="sg ${cur ? "is-current" : ""} ${isOpen ? "" : "is-closed"}" style="--ph:${PhaseColors[ph]}">
          <button class="sg-h" data-action="stratGroup" data-arg="${ph}" ${tracked && (ph === p.phase || ph === "toutes") ? "disabled" : ""}>
            <span class="sg-dot"></span>${Labels.phase[ph]}<span class="sg-n">${groups[ph].length}</span></button>
          ${isOpen ? `<div class="sg-b">${rows}</div>` : ""}</section>`;
      }).join("");
  },

  stratPreview(app) {
    const groups = {};
    this.stratagems(app).forEach(s => (s.moments || []).forEach(m => {
      const g = groups[m.phase] = groups[m.phase] || [];
      if (!g.includes(s)) g.push(s);
    }));
    const tourOf = s => {
      const t = new Set((s.moments || []).map(m => m.tour));
      return t.has("les-deux") || t.size > 1 ? "les deux tours" : t.has("vous") ? "ton tour" : "tour adverse";
    };
    return `<h2 class="mx-h">Stratagèmes <small>consultation</small></h2>` +
      PhaseOrder.concat("toutes").filter(ph => groups[ph]).map(ph => `<section class="sg" style="--ph:${PhaseColors[ph]}">
        <div class="sg-h"><span class="sg-dot"></span>${Labels.phase[ph]}<span class="sg-n">${groups[ph].length}</span></div>
        <div class="sg-b">${groups[ph].map(s => `<div class="sr">
          <button class="sr-name" data-action="openStrat" data-arg="${UI.esc(this.sid(s))}|${ph}">${UI.esc(s.name)}<small class="sr-when">${tourOf(s)}</small></button>
          <span class="sr-cp">${s.cp} PC</span></div>`).join("")}</div></section>`).join("");
  },

  trackerBox(app) {
    const ctx = this.ctx(app);
    if (!ctx) return "";
    const p = this.game(app).play;
    return Setup.selected(ctx).filter(d => d.tracker).map(d => {
      const t = d.tracker;
      if (t.type === "cible") {
        const v = (p.tracker.cibles || {})[t.id] || "";
        return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}</div>
          <input class="trk-in" type="text" maxlength="60" placeholder="Unité ennemie visée" value="${UI.esc(v)}"
            data-change="setTrackerCible" data-id="${UI.esc(t.id)}">
          <p class="trk-fx">${UI.fmt(t.bonus)}</p></div>`;
      }
      if (t.type === "choix") {
        const cur = (p.tracker.choix || {})[this.choixKey(p, t)] || [];
        const full = cur.length >= (t.max || 1);
        return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}${(t.max || 1) > 1 ? `<small class="trk-n">${cur.length}/${t.max}</small>` : ""}</div>
          <div class="trk-opts">${t.options.map(o => {
            const on = cur.includes(o.n);
            return `<button class="trk-opt ${on ? "is-on" : ""}" data-action="toggleTrackerChoix" data-arg="${UI.esc(t.id)}|${o.n}"
              aria-pressed="${on}" ${!on && full && (t.max || 1) > 1 ? "disabled" : ""}><span class="trk-num">${o.n}</span><span>${UI.fmt(o.short)}</span></button>`;
          }).join("")}</div>
          ${cur.length ? "" : `<p class="trk-hint">${UI.fmt(t.moment)}</p>`}
          ${t.concerne ? `<p class="trk-hint">${UI.fmt(t.concerne)}</p>` : ""}</div>`;
      }
      if (t.type === "designation") {
        const opts = ctx.state.units.filter(e => {
          const u = Builder.unit(ctx, e.unitId);
          return u && (t.eligible || [[]]).some(alt => alt.every(k => Builder.has(ctx, u, k)));
        });
        const cur = p.tracker.designation || (ctx.state.units.find(e => e.warlord) || {}).uid;
        return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}
          <select data-change="setDesignation">${opts.map(e => `<option value="${e.uid}" ${e.uid === cur ? "selected" : ""}>${UI.esc(Builder.label(ctx, e))}</option>`).join("")}</select></div>
          <p class="trk-fx">${UI.fmt(t.bonus)}</p></div>`;
      }
      // Compteur : seulement la valeur et l'effet du palier atteint
      const v = p.tracker.value;
      // Les paliers s'additionnent : on liste tous ceux atteints, en version courte
      // « replaces » : ce palier fusionne avec un palier précédent (texte « combined »)
      const got = [];
      (t.paliers || []).filter(pl => v >= pl.min).forEach(pl => {
        const i = pl.replaces != null ? got.findIndex(x => x.min === pl.replaces) : -1;
        if (i >= 0) got.splice(i, 1, { min: pl.min, short: pl.combined }); else got.push(pl);
      });
      const next = (t.paliers || []).find(pl => v < pl.min);
      return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}
          <span class="trk-ctl"><button data-action="trackerAdj" data-arg="-1" ${v ? "" : "disabled"} aria-label="Retirer 1">−</button><b>${v}</b><button data-action="trackerAdj" data-arg="1" aria-label="Ajouter 1">+</button></span></div>
        ${got.length ? `<ul class="trk-fx">${got.map(pl => `<li>${UI.fmt(pl.short || pl.text)}</li>`).join("")}</ul>`
          : `<p class="trk-fx"><span class="muted">Aucun effet${next ? ` (premier palier à ${next.min})` : ""}</span></p>`}</div>`;
    }).join("");
  },

  // Clé d'un suivi « choix » : renouvelé à ta phase de Commandement, il vaut pour ton tour
  // et le tour adverse qui suit (avant ton tour s'il joue en premier : choix du round précédent)
  choixKey(p, t) {
    if (t.renouveler !== "commandement") return t.id;
    const r = p.active === "opp" && p.first === "opp" ? p.round - 1 : p.round;
    return `${t.id}|R${r}`;
  },

  /* ---------- Colonnes : missions ---------- */

  missionColumn(app, side) {
    const g = this.game(app), p = g.play;
    const m = this.mission(g, side);
    const name = side === "me" ? g.myMission : g.oppMission;
    const t = this.totals(app, side);
    const compact = side === "opp";
    const who = side === "me" ? "Mes missions" : `Missions de ${UI.esc(g.oppName || "l'adversaire")}`;
    const bar = (v, max, label) => `<div class="sc-bar ${v > max ? "is-over" : ""}"><span>${label}</span>
      <b>${Math.min(v, max)}</b><small>/${max}</small></div>`;
    const head = `<header class="mx-mh" style="--dispo:${m ? Dispositions[m.disposition].color : "#555"}">
        <span class="mx-who">${who}</span>
        <div class="sc-row">${bar(t.round.prim, MaxPerRound, "Primaire ce round")}${bar(t.round.sec, MaxPerRound, "Secondaire ce round")}
          <div class="sc-tot">Partie : <b>${t.prim}</b>/45 · <b>${t.sec}</b>/45${t.paint ? ` · peinture <b>${t.paint}</b>` : ""}</div></div></header>`;
    const prim = m ? this.primary(app, side, m, name, compact) : `<p class="hint">Mission inconnue.</p>`;
    return head + prim + this.secondaries(app, side, compact);
  },

  primary(app, side, m, name, compact) {
    const p = this.game(app).play;
    const blocks = m.scoring.map((b, bi) => {
      const on = p.active && this.blockApplies(b.round, p.round);
      if (compact && !on) return "";
      const lines = b.lines.map((l, li) => {
        const k = `${p.round}|${bi}|${li}`, v = p.prim[side][k];
        const ctl = !on ? "" : l.per
          ? `<span class="pl-step"><button data-action="primStep" data-arg="${side}|${bi}|${li}|-1" ${v ? "" : "disabled"}>−</button><b>${v || 0}</b><button data-action="primStep" data-arg="${side}|${bi}|${li}|1">+</button></span>`
          : `<button class="pl-box ${v ? "is-on" : ""}" data-action="primToggle" data-arg="${side}|${bi}|${li}" aria-pressed="${!!v}"></button>`;
        const got = on && v ? `<span class="pl-got">${this.lineValue(l, v)}</span>` : "";
        return `<div class="pl ${l.bonus ? "is-bonus" : ""} ${l.or ? "is-or" : ""}">
          ${ctl}${l.or ? '<span class="mc-tag">ou</span>' : l.bonus ? '<span class="mc-tag">+</span>' : ""}
          <span class="pl-text">${UI.fmt(l.text)}</span>
          <span class="pl-pts">${l.bonus ? "+" : ""}${l.pts}${l.per ? "<small>/u.</small>" : ""}</span>${got}</div>`;
      }).join("");
      return `<div class="pb ${on ? "" : "is-off"}">
        <div class="pb-h"><span>${MissionCard.roundLabel(b.round)}${b.persistent ? ' <em class="pb-keep">acquis : reporté au round suivant</em>' : ""}</span><small>${UI.esc(b.quand)}</small></div>${lines}</div>`;
    }).join("");
    const notes = [];
    if (!compact) {
      if (m.setup) notes.push(`<p class="pm-note"><b>Au début de la bataille :</b> ${UI.fmt(m.setup)}</p>`);
      if (m.startTurn) notes.push(`<p class="pm-note"><b>Au début de votre tour :</b> ${UI.fmt(m.startTurn)}</p>`);
      if (m.rule) notes.push(`<p class="pm-note">${UI.fmt(m.rule)}</p>`);
    }
    const a = m.action;
    const action = a ? (compact
      ? `<p class="pm-act"><b>Action : ${UI.esc(a.name)}</b> — ${UI.fmt(a.start)} ${UI.fmt(a.complete)}</p>`
      : `<details class="pm-action"><summary>Action d'objectif : ${UI.esc(a.name)}</summary><dl>
          <dt>S'entreprend</dt><dd>${UI.fmt(a.start)}</dd><dt>Unités</dt><dd>${UI.fmt(a.units)}</dd>
          <dt>Limite</dt><dd>${UI.fmt(a.limit)}</dd><dt>S'accomplit</dt><dd>${UI.fmt(a.complete)}</dd>
          <dt>Effet</dt><dd>${UI.fmt(a.effect)}</dd></dl></details>`) : "";
    return `<section class="pm ${compact ? "is-compact" : ""}">
      <button class="pm-name" data-action="openMission" data-arg="${side}">Primaire : ${UI.esc(name)}<span>voir la carte</span></button>
      ${notes.join("")}${blocks || `<p class="hint">Rien à marquer ce round.</p>`}${action}</section>`;
  },

  /* ---------- Secondaires ---------- */

  // Valeur tactique d'un nombre ou d'un objet { fixe, tactique }
  tac(v) { return v != null && typeof v === "object" ? v.tactique : v; },

  // Lignes utilisables (mode tactique), avec leur position d'origine
  secLines(s) {
    return s.scoring.map((b, bi) => ({ b, bi, lines: b.lines.map((l, li) => ({ l, li, pts: this.tac(l.pts) }))
      .filter(x => x.pts != null) })).filter(x => x.lines.length);
  },

  // Formulaire en cours (non enregistré tant qu'on n'a pas validé)
  secForm(app, side, name) {
    const f = app.state.match.secForms || (app.state.match.secForms = {});
    return f[`${side}|${name}`] || (f[`${side}|${name}`] = {});
  },

  // Points du formulaire : « ou » exclusifs, bonus seulement avec leur ligne de base, plafond max
  secPoints(app, side, s) {
    const f = this.secForm(app, side, s.name);
    let total = 0;
    this.secLines(s).forEach(({ bi, lines }) => {
      lines.forEach(({ l, li, pts }, i) => {
        const v = f[`${bi}.${li}`];
        if (!v) return;
        if (l.bonus) {
          const base = lines[i - 1];
          if (!base || !f[`${bi}.${base.li}`]) return;
        }
        total += l.per ? v * pts : pts;
      });
    });
    const max = this.tac(s.scoring.flatMap(b => b.lines).map(l => l.max).find(m => m != null));
    return max != null ? Math.min(total, max) : total;
  },

  // Missions encore piochables, par ordre alphabétique : ni déjà piochées, ni retirées pour la partie,
  // ni celle qu'on vient de remettre dans la pile ; une repioche obligatoire au 1er round (Défendre le bastion) est exclue à ce round
  drawPool(p, side, forList) {
    const S = p.sec[side];
    return (Season.secondaries || []).filter(s => !S.drawn.includes(s.name) && (forList || s.name !== S.justReturned) &&
      !(p.round === 1 && s.redraw && s.redraw.mandatory)).sort((a, b) => a.name.localeCompare(b.name, "fr"));
  },

  redrawOk(p, side, s) {
    const r = s.redraw;
    if (!r) return false;
    if (r.type === "round1") return p.round === 1;
    if (r.type === "with") return p.sec[side].hand.includes(r.other);
    return true;
  },

  secondaries(app, side, compact) {
    const p = this.game(app).play, S = p.sec[side];
    const all = Season.secondaries || [];
    let draw = "";
    if (S.pendingDraw > 0) {
      // Déjà piochées (ou défaussées) exclues ; une repioche obligatoire au 1er round n'est pas proposée à ce round
      const left = this.drawPool(p, side, true);
      const n = Math.min(S.pendingDraw, this.drawPool(p, side).length);
      draw = `<div class="sd-draw"><span>Pioche ${side === "me" ? "de ton tour" : "adverse"} : ${S.pendingDraw} mission${S.pendingDraw > 1 ? "s" : ""} à indiquer</span>
        ${side === "me" && n ? `<button class="btn btn-primary btn-s sd-rand" data-action="randomSec" title="Tirage parmi les missions encore dans ta pile">🎲 Tirer ${n} mission${n > 1 ? "s" : ""} au hasard</button>` : ""}
        <select data-change="drawSec" data-side="${side}"><option value="">${side === "me" ? "Ou choisir…" : "Choisir…"}</option>
          ${left.map(s => `<option>${UI.esc(s.name)}</option>`).join("")}</select>
        <button class="btn btn-s" data-action="skipDraw" data-arg="${side}">Plus tard</button></div>`;
    }
    const cards = S.hand.map(n => {
      const s = all.find(x => x.name === n);
      return s ? this.secCard(app, side, s, compact) : "";
    }).join("");
    const done = S.done.length ? `<p class="sd-done">Réalisées : ${S.done.map(d => `${UI.esc(d.name)} (${d.pts}, R${d.round})`).join(", ")}</p>` : "";
    return `<section class="sec"><h3 class="mx-h3">Secondaires <small>${S.hand.length} en main</small></h3>
      ${draw}${cards || (S.pendingDraw ? "" : `<p class="hint">Aucune mission en main.</p>`)}${done}</section>`;
  },

  secCard(app, side, s, compact) {
    const p = this.game(app).play, S = p.sec[side];
    const f = this.secForm(app, side, s.name);
    const key = `${side}|${s.name}`;
    const max = this.tac(s.scoring.flatMap(b => b.lines).map(l => l.max).find(m => m != null));
    const blocks = this.secLines(s).map(({ b, bi, lines }) => {
      const rows = lines.map(({ l, li, pts }, i) => {
        const k = `${bi}.${li}`, v = f[k] || 0;
        const baseOff = l.bonus && !(lines[i - 1] && f[`${bi}.${lines[i - 1].li}`]);
        const ctl = l.per
          ? `<span class="pl-step"><button data-action="secStep" data-arg="${UI.esc(key)}|${k}|-1" ${v ? "" : "disabled"}>−</button><b>${v}</b><button data-action="secStep" data-arg="${UI.esc(key)}|${k}|1">+</button></span>`
          : `<button class="pl-box ${v ? "is-on" : ""}" data-action="secToggle" data-arg="${UI.esc(key)}|${k}" ${baseOff ? "disabled" : ""} aria-pressed="${!!v}"></button>`;
        return `<div class="pl ${l.bonus ? "is-bonus" : ""} ${l.or ? "is-or" : ""}">
          ${ctl}${l.or ? '<span class="mc-tag">ou</span>' : l.bonus ? '<span class="mc-tag">+</span>' : ""}
          <span class="pl-text">${UI.fmt(l.text)}</span>
          <span class="pl-pts">${l.bonus ? "+" : ""}${pts}${l.per ? "<small>/chaque</small>" : ""}</span></div>`;
      }).join("");
      return `<div class="sd-blk"><div class="sd-when">${UI.esc(b.quand)}</div>${rows}</div>`;
    }).join("");
    const pts = this.secPoints(app, side, s);
    const r = s.redraw, canRedraw = this.redrawOk(p, side, s);
    const redrawTip = r ? (r.type === "round1" ? (r.mandatory ? "À repiocher obligatoirement au 1er round" : "Repioche possible au 1er round")
      : r.type === "with" ? `Repioche possible si ${r.other} est en main` : "Si la mission est irréalisable : la retirer pour cette partie et en piocher une autre") : "";
    return `<div class="sd ${r && r.mandatory && canRedraw ? "is-alert" : ""}">
      <div class="sd-h"><button class="sd-name" data-action="openSec" data-arg="${UI.esc(s.name)}">${UI.esc(s.name)}
          ${r ? `<span class="sd-redraw" title="${UI.esc(redrawTip)}">↻</span>` : ""}</button>
        ${r && canRedraw ? `<button class="btn btn-s ${r.mandatory ? "btn-primary" : ""}" data-action="redrawSec" data-arg="${side}|${UI.esc(s.name)}" title="${UI.esc(redrawTip)}">${r.type === "condition" ? "Irréalisable · retirer" : "Repiocher"}</button>` : ""}
        ${S.swapUsed ? "" : `<button class="btn btn-s" data-action="swapSec" data-arg="${side}|${UI.esc(s.name)}" title="Une fois par partie, 1 PC">Échanger · 1 PC</button>`}
        <button class="btn btn-s" data-action="sacrificeSec" data-arg="${side}|${UI.esc(s.name)}" title="Défausser sans la remplacer, en échange d'1 PC">Sacrifier · +1 PC</button></div>
      ${s.rule && !compact ? `<p class="sd-rule">${UI.fmt(s.rule)}</p>` : ""}
      ${r && canRedraw ? `<p class="sd-rule sd-rd">↻ ${UI.esc(redrawTip)}.</p>` : ""}
      ${blocks}
      <div class="sd-foot">${max != null ? `<span class="muted">Maximum ${max} PdV</span>` : ""}
        <button class="btn btn-primary btn-s" data-action="scoreSec" data-arg="${side}|${UI.esc(s.name)}" ${pts ? "" : "disabled"}>Valider · ${pts} PdV</button></div>
    </div>`;
  },

  /* ---------- Fenêtre « Règles » : règle d'armée puis règles des détachements joués ---------- */

  rulesWindow(app) {
    const m = app.state.match, ctx = this.ctx(app);
    if (!m || !m.rulesOpen || !ctx) return "";
    const pos = this.settings().rulesPos || { x: 340, y: 24 };
    return `<div class="army-win rules-win" style="left:${pos.x}px;top:${pos.y}px">
      <div class="aw-bar" data-drag="rules"><span class="aw-grip">⋮⋮</span><span class="aw-t">Règles de la liste</span>
        <button class="btn btn-s" data-action="rulesToggle">✕</button></div>
      <div class="aw-list rw-body">${this.rulesHtml(ctx)}</div></div>`;
  },

  // Règle d'armée puis règles des détachements joués (fenêtre « Règles » et consultation au lancement)
  rulesHtml(ctx) {
    // Règles d'armée : la faction, plus les fichiers auxiliaires dont des unités sont dans l'armée
    const used = new Set(ctx.state.units.map(e => (Builder.unit(ctx, e.unitId) || {})._faction).filter(Boolean));
    const sources = [ctx.faction, ...Builder.extras(ctx).filter(x => used.has(x.keyword))];
    const army = sources.flatMap(f => (f.armyRules || []).filter(r => Builder.ruleActive(ctx, r.id)).map(r => `<section class="rw-sec">
        <h3>${UI.esc(r.name)}<small>Règle d'armée${sources.length > 1 ? ` · ${UI.esc(f.name)}` : ""}</small></h3>
        ${(r.text || []).map(t => `<p>${UI.fmt(t)}</p>`).join("")}</section>`)).join("");
    const dets = Setup.selected(ctx).map(d => `<section class="rw-sec">
        <h3>${UI.esc(d.name)}<small>Détachement${d.rule && d.rule.name ? ` · ${UI.esc(d.rule.name)}` : ""}</small></h3>
        ${d.rule ? d.rule.text.map(t => `<p>${UI.fmt(t)}</p>`).join("") : ""}</section>`).join("");
    return army + dets;
  },

  /* ---------- Journal de la partie ---------- */

  logPrim(p, g, side, bi, li, on, delta) {
    const l = this.mission(g, side).scoring[bi].lines[li];
    const pts = l.per ? Math.abs(delta || 1) * l.pts : l.pts;
    const who = side === "me" ? "Moi" : (g.oppName || "Adversaire");
    const short = l.text.length > 60 ? l.text.slice(0, 57) + "…" : l.text;
    this.log(p, "pts", `Primaire (${who}) : ${on ? "+" : "−"}${pts} PdV — ${short}`);
  },

  log(p, kind, text) {
    (p.log = p.log || []).push({ r: p.round, t: p.active, ph: p.phase, kind, text });
  },

  /* ---------- Fenêtre « Mon armée » ---------- */

  armyWindow(app) {
    const m = app.state.match, ctx = this.ctx(app);
    if (!m || !m.armyOpen || !ctx) return "";
    const p = this.game(app).play;
    const pos = this.settings().armyPos || { x: 24, y: 24 };
    if (m.armyCard) {
      const e = Builder.entry(ctx, m.armyCard);
      // Personnage et unité rattachés : onglets pour passer de l'un à l'autre (personnages en premier)
      const top = e && (Army.ledUnit(ctx, e) || e);
      const group = top ? [...Army.attached(ctx, top), top] : [];
      const tabs = group.length > 1 ? `<div class="seg aw-tabs">${group.map(x => `<button class="${x.uid === e.uid ? "is-on" : ""}"
          data-action="armyCard" data-arg="${x.uid}">${UI.esc(Builder.label(ctx, x))}</button>`).join("")}</div>` : `<span class="aw-t">${e ? UI.esc(Builder.label(ctx, e)) : ""}</span>`;
      return `<div class="army-win is-card">
        <div class="aw-bar">${tabs}
          <button class="btn btn-s" data-action="armyCard" data-arg="" title="Revenir à la liste des unités">← Retour</button></div>
        <div class="aw-card">${e ? this.unitCard(ctx, e) : ""}</div></div>`;
    }
    const order = UnitCategories.map(c => c.id);
    const tops = ctx.state.units.filter(e => Army.isTop(ctx, e))
      .sort((a, b) => order.indexOf(Builder.unit(ctx, a.unitId).category) - order.indexOf(Builder.unit(ctx, b.unitId).category));
    const row = (e, sub) => {
      const dead = !!p.destroyed[e.uid];
      const inT = !sub && e.embarkedIn && Builder.entry(ctx, e.embarkedIn);
      return `<div class="aw-row ${sub ? "is-sub" : ""} ${dead ? "is-dead" : ""}">
        <button class="aw-name" data-action="armyCard" data-arg="${e.uid}">${sub ? "↳ " : ""}${UI.esc(Builder.label(ctx, e))}
          ${e.warlord ? '<span class="aw-tag">SdG</span>' : ""}${inT ? `<small>dans ${UI.esc(Builder.label(ctx, inT))}</small>` : ""}</button>
        <button class="aw-kill" data-action="toggleDead" data-arg="${e.uid}" title="${dead ? "Remettre en jeu" : "Marquer détruite"}">${dead ? "↺" : "✕"}</button></div>`;
    };
    const alive = [], dead = [];
    tops.forEach(e => {
      [e, ...Army.attached(ctx, e)].forEach((x, i) => (p.destroyed[x.uid] ? dead : alive).push(row(x, i > 0 && !p.destroyed[x.uid])));
    });
    return `<div class="army-win ${m.armyMin ? "is-min" : ""}" style="left:${pos.x}px;top:${pos.y}px">
      <div class="aw-bar" data-drag="army"><span class="aw-grip">⋮⋮</span><span class="aw-t">Mon armée</span>
        <button class="btn btn-s aw-min" data-action="armyMin" aria-expanded="${!m.armyMin}"
          title="${m.armyMin ? "Déplier" : "Replier (la fenêtre se ferme avec le bouton Armée du haut)"}">${m.armyMin ? "▸" : "▾"}</button></div>
      ${m.armyMin ? "" : `<div class="aw-list">${alive.join("")}${dead.length ? `<button class="aw-sep" data-action="toggleDeadList" aria-expanded="${!!m.deadOpen}">
        <span class="chev-r">${m.deadOpen ? "▾" : "▸"}</span> Détruites (${dead.length})</button>${m.deadOpen ? dead.join("") : ""}` : ""}</div>`}</div>`;
  },

  // Carte d'unité en partie : seulement ce qui a été pris, avec les bonus actifs
  unitCard(ctx, e) {
    const u = Builder.unit(ctx, e.unitId);
    const { counts } = Builder.loadout(ctx, u, e);
    const v = Builder.view(ctx, u, e);
    const shown = Object.assign({}, v, {
      weapons: v.weapons.filter(w => counts[w.id] > 0),
      wargear: (u.wargear || []).filter(w => counts[w.id] > 0),
      abilities: (u.abilities || []).filter(a => (!a.requiresWargear || counts[a.requiresWargear]) &&
        (!(a.condition || a.grants === "unite-menee") || Army.conditionMet(ctx, e, a))),
      leader: null
    });
    const size = Builder.size(u, e);
    const stats = BuilderUI.statsHtml(v);
    const mark = Builder.markSource(ctx, u) && Builder.markOf(ctx, u, e);
    const extra = [];
    const en = e.enhancement && Builder.enh(ctx, e.enhancement);
    if (en) extra.push(`<div class="bonus-box"><span class="cfg-l">${en.enh.kind === "amelioration" ? "Amélioration" : "Optimisation"}${Army.enhAffectsUnit(en.enh) && Army.ledUnit(ctx, e) ? " · profite à toute son unité" : ""}</span>
      <p><b>${UI.esc(en.enh.name)}</b> : ${UI.fmt(en.enh.text)}</p></div>`);
    const fromUnit = Army.bonusesFromUnit(ctx, e);
    if (fromUnit.length) extra.push(`<div class="bonus-box"><span class="cfg-l">Grâce à son unité (${UI.esc(fromUnit[0].from)})</span>
      ${fromUnit.map(b => `<p><b>${UI.esc(b.name)}</b> <small>${b.kind}</small> : ${UI.fmt(b.text)}</p>`).join("")}</div>`);
    const got = Army.bonusesFor(ctx, e);
    if (got.length) extra.push(`<div class="bonus-box"><span class="cfg-l">Grâce à ses personnages</span>
      ${got.map(b => `<p><b>${UI.esc(b.name)}</b> <small>${UI.esc(b.from)}</small> : ${UI.fmt(b.text)}</p>`).join("")}</div>`);
    const led = Army.ledUnit(ctx, e);
    if (led) extra.push(`<p class="cfg-led">Mène ${UI.esc(Builder.label(ctx, led))}</p>`);
    const inT = e.embarkedIn && Builder.entry(ctx, e.embarkedIn);
    if (inT) extra.push(`<p class="cfg-led">Embarquée dans ${UI.esc(Builder.label(ctx, inT))}</p>`);
    if (u.transport) {
      const pas = Army.passengers(ctx, e);
      extra.push(`<p class="cfg-led">À bord : ${pas.length ? pas.map(x => UI.esc(Builder.label(ctx, x))).join(", ") : "personne"}</p>`);
    }
    return `<div class="ucard uc-play">
      <header class="uc-head">
        <div class="uc-title"><h1>${UI.esc(Builder.label(ctx, e))}</h1>
          ${e.warlord ? '<span class="uc-badge">Seigneur de guerre</span>' : ""}
          ${mark ? `<span class="uc-badge uc-mark">${UI.esc(UI.mark(mark))}</span>` : ""}</div>
        <div class="uc-stats">${stats}<div class="uc-meta"><span>${size.models} figurine${size.models > 1 ? "s" : ""}</span></div></div>
      </header>
      <div class="uc-body">
        <div class="uc-col">${BuilderUI.weaponTable(shown, counts, "ranged")}${BuilderUI.weaponTable(shown, counts, "melee")}${BuilderUI.wargear(shown, counts)}</div>
        <div class="uc-col">${extra.join("")}${BuilderUI.abilities(ctx, shown, counts, e)}</div>
      </div>${BuilderUI.keywords(ctx, v)}</div>`;
  },

  // Déplacement de la fenêtre (doigt, stylet ou souris)
  bind(app) {
    document.querySelectorAll("[data-drag]").forEach(bar => this.bindDrag(bar));
  },

  bindDrag(bar) {
    const win = bar.parentElement, key = `${bar.dataset.drag}Pos`;
    bar.addEventListener("pointerdown", ev => {
      if (ev.target.closest("button")) return;
      ev.preventDefault();
      const r = win.getBoundingClientRect(), host = win.offsetParent.getBoundingClientRect();
      const dx = ev.clientX - r.left, dy = ev.clientY - r.top;
      bar.setPointerCapture(ev.pointerId);
      const move = e => {
        const x = Math.max(0, Math.min(host.width - r.width, e.clientX - host.left - dx));
        const y = Math.max(0, Math.min(host.height - 60, e.clientY - host.top - dy));
        win.style.left = `${x}px`; win.style.top = `${y}px`;
      };
      const up = () => {
        bar.removeEventListener("pointermove", move);
        Companion.settings()[key] = { x: parseInt(win.style.left, 10), y: parseInt(win.style.top, 10) };
        Store.save();
      };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up, { once: true });
    });
  }
};

/* ---------- Écran ---------- */

Screens.game = {
  body(app) { return Companion.body(app); },
  actions() { return ""; }
};

/* ---------- Panneaux ---------- */

Overlays.whoFirst = function (app) {
  const g = Companion.game(app);
  return this.wrap(`
    <div class="ov-head"><h2>Qui joue en premier ?</h2></div>
    <p class="hint">Ce joueur commence chaque round, toute la partie.</p>
    <div class="seg-big wf">
      <button class="role-btn" data-action="setFirst" data-arg="me">Moi</button>
      <button class="role-btn" data-action="setFirst" data-arg="opp">${UI.esc(g.oppName || "Mon adversaire")}</button>
    </div>`, "ov-narrow");
};

Overlays.strat = function (app) {
  const [id, ph] = app.state.stratView || [];
  const s = Companion.stratagems(app).find(x => Companion.sid(x) === id);
  if (!s) return "";
  const p = Companion.game(app).play;
  const used = Companion.stratUsed(p, ph, s);
  return this.wrap(`
    <div class="ov-head"><span class="muted">${UI.esc(s._det)}</span><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${UI.stratagem(s)}
    ${!p.active ? `<div class="ov-btns"><span class="hint">Utilisable une fois la bataille commencée.</span></div>` : `<div class="ov-btns">${used ? `<span class="hint">Déjà utilisé à cette phase.</span>` : ""}
      ${s.modes ? s.modes.map((m, i) => `<button class="btn btn-primary" data-action="useStrat" data-arg="${UI.esc(id)}|${ph}|${i}">${UI.esc(m.name)} · ${s.cp + (m.cpExtra || 0)} PC</button>`).join("")
        : `<button class="btn btn-primary" data-action="useStrat" data-arg="${UI.esc(id)}|${ph}">Utiliser · ${s.cp} PC</button>`}</div>`}`, "ov-narrow");
};

Overlays.secCard = function (app) {
  const s = (Season.secondaries || []).find(x => x.name === app.state.secView);
  if (!s) return "";
  const blocks = s.scoring.map(b => `<div class="mc-block"><div class="mc-round">${MissionCard.roundLabel(b.round)}</div>
    <div class="mc-when"><b>Quand :</b> ${UI.esc(b.quand)}</div>
    ${b.lines.map(l => `<div class="mc-line ${l.or ? "is-or" : ""}">${l.or ? '<span class="mc-tag">ou</span>' : ""}<span class="mc-text">${UI.fmt(l.text)}</span><span class="mc-pts">${l.pts} PdV</span></div>`).join("")}</div>`).join("");
  const a = s.action;
  return this.wrap(`
    <div class="ov-head"><h2>${UI.esc(s.name)}</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <div class="mcard"><div class="mc-body">
      ${s.onDraw ? `<div class="mc-note"><b>À la pioche :</b> ${UI.fmt(s.onDraw)}</div>` : ""}
      ${s.note ? `<div class="mc-note">${UI.fmt(s.note)}</div>` : ""}${blocks}
      ${a ? `<div class="mc-action"><div class="mc-action-h">Action : ${UI.esc(a.name)}</div><dl>
        <dt>S'entreprend</dt><dd>${UI.fmt(a.start)}</dd><dt>Unités</dt><dd>${UI.fmt(a.units)}</dd>
        <dt>S'accomplit</dt><dd>${UI.fmt(a.complete)}</dd><dt>Effet</dt><dd>${UI.fmt(a.effect)}</dd></dl></div>` : ""}
    </div></div>`, "ov-narrow");
};

Overlays.missionCard = function (app) {
  const g = Companion.game(app), side = app.state.missionView;
  return this.wrap(`<div class="ov-head"><span></span><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${MissionCard.render(side === "me" ? g.myMission : g.oppMission, { who: side === "me" ? "Ta mission" : "Mission adverse", data: Companion.mission(g, side) })}`, "ov-narrow");
};

Overlays.matchMenu = function (app) {
  const g = Companion.game(app), t = Companion.settings().trackPhases;
  return this.wrap(`
    <div class="ov-head"><h2>Partie</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <h3 class="prep-h">Suivi des phases</h3>
    <p class="hint">Réglage gardé pour toutes les parties.</p>
    <div class="seg-big">
      <button class="toggle ${t.me ? "is-on" : ""}" data-action="togglePhases" data-arg="me">Pendant mon tour</button>
      <button class="toggle ${t.opp ? "is-on" : ""}" data-action="togglePhases" data-arg="opp">Pendant le tour adverse</button></div>
    <h3 class="prep-h">Affichage</h3>
    <button class="btn" data-action="toggleFullscreen">${ScreenCtl.isFull() ? "Quitter le plein écran" : "Plein écran"}</button>
    <h3 class="prep-h">Notes de partie</h3>
    <textarea class="gnote" data-input="setGameNote" data-field="notes" placeholder="Ce que tu veux retenir pendant la partie…">${UI.esc(g.notes || "")}</textarea>
    <h3 class="prep-h">Table</h3>
    ${g.deployment ? `<button class="btn" data-action="openMap">Carte : ${UI.esc(Deployments.name(g.myDisposition, g.oppDisposition, g.deployment))}</button>` : `<p class="hint">Pas de mise en place choisie.</p>`}
    <h3 class="prep-h">Terminer</h3>
    <div class="ov-btns" style="justify-content:flex-start">
      <button class="btn" data-action="openOverlay" data-arg="matchEnd">Terminer la partie maintenant</button>
      <button class="btn btn-danger" data-action="cancelGame" data-arg="${g.id}">Supprimer cette partie</button></div>`, "ov-narrow");
};

// Tous les stratagèmes de la liste (détachements joués + base), pour les lire en entier
Overlays.allStrats = function (app) {
  const ctx = Companion.ctx(app);
  return this.wrap(`<div class="ov-head"><h2>Stratagèmes de la liste</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <div class="li-body" data-pane="li-body">${ctx ? ListView.stratsHtml(ctx) : `<p class="hint">Faction introuvable.</p>`}</div>`, "ov-full");
};

Overlays.matchEnd = function (app) {
  const g = Companion.game(app);
  const me = Companion.totals(app, "me"), op = Companion.totals(app, "opp");
  const res = me.total > op.total ? "Victoire" : me.total < op.total ? "Défaite" : "Égalité";
  return this.wrap(`
    <div class="ov-head"><h2>Fin de partie</h2><button class="btn btn-s" data-action="closeOverlay">Retour</button></div>
    <div class="end-score"><div><span>Moi</span><b>${me.total}</b><small>${me.prim} primaire · ${me.sec} secondaire${me.paint ? ` · ${me.paint} peinture` : ""}</small></div>
      <div><span>${UI.esc(g.oppName || "Adversaire")}</span><b>${op.total}</b><small>${op.prim} primaire · ${op.sec} secondaire${op.paint ? ` · ${op.paint} peinture` : ""}</small></div></div>
    <p class="end-res">${res}</p>
    <h3 class="prep-h">Bilan à chaud</h3>
    <textarea class="gnote" data-input="setGameNote" data-field="debrief" placeholder="Ce qui a marché, ce qui a raté, à retenir pour la prochaine fois…">${UI.esc(g.debrief || "")}</textarea>
    <div class="ov-btns"><button class="btn btn-primary" data-action="finishGame">Enregistrer le résultat</button></div>`, "ov-narrow");
};

/* ---------- Actions ---------- */

const CompanionActions = {
  // Texte libre : enregistré sans redessiner (le curseur reste en place)
  setGameNote(value, el) {
    const g = Companion.game(this);
    g[el.dataset.field] = value;
    Store.save();
  },

  setFirst(side) {
    Companion.mutate(this, p => { p.first = side; p.round = 1; Companion.startTurn(p, side); });
    this.state.match.undo = [];
    this.state.overlay = "beforeBattle";
    this.render();
  },

  endTurn() {
    const g = Companion.game(this), p = g.play;
    if (p.sec[p.active].pendingDraw > 0 && !confirm("Des missions secondaires piochées n'ont pas été indiquées. Finir le tour quand même ?")) return;
    const last = p.active !== p.first && p.round === 5;
    if (last) { this.state.overlay = "matchEnd"; this.render(); return; }
    Companion.mutate(this, p => {
      p.sec[p.active].pendingDraw = 0;
      if (p.active === p.first) Companion.startTurn(p, Companion.other(p.first));
      else { p.round += 1; Companion.carry(p, Companion.game(this)); Companion.startTurn(p, p.first); }
    });
    this.state.match.stratOpen = {};
    this.render({ resetScroll: true });
  },

  cpAdj(arg) {
    const [side, d] = arg.split("|");
    const who = side === "me" ? "Moi" : (Companion.game(this).oppName || "Adversaire");
    Companion.mutate(this, p => {
      p.cp[side] = Math.max(0, p.cp[side] + Number(d));
      Companion.log(p, "cp", `PC ajustés (${who}) : ${Number(d) > 0 ? "+" : ""}${d} → ${p.cp[side]} PC`);
    });
  },

  setPhase(ph) {
    Companion.mutate(this, p => { p.phase = ph; });
    this.state.match.stratOpen = {};
  },

  stratGroup(ph) {
    const o = this.state.match.stratOpen;
    o[ph] = !o[ph];
    this.render();
  },

  openStrat(arg) {
    this.state.stratView = arg.split("|");
    this.state.overlay = "strat";
    this.render();
  },

  useStrat(arg) {
    const [id, ph, mi] = arg.split("|");
    const s = Companion.stratagems(this).find(x => Companion.sid(x) === id);
    const p = Companion.game(this).play;
    if (!s) return;
    const mode = s.modes && mi != null ? s.modes[Number(mi)] : null;
    const cost = s.cp + (mode ? mode.cpExtra || 0 : 0);
    if (p.cp.me < cost && !confirm(`Pas assez de PC (${p.cp.me} pour ${cost}). L'utiliser quand même ?`)) return;
    this.state.overlay = null;
    Companion.mutate(this, p => {
      p.cp.me = Math.max(0, p.cp.me - cost);
      Companion.log(p, "strat", `Stratagème ${s.name}${mode ? ` (${mode.name})` : ""} : −${cost} PC`);
      p.strat[Companion.stratKey(p, ph, s)] = true;
      const lk = Companion.limitKey(p, s);
      if (lk) (p.stratLimit = p.stratLimit || {})[lk] = true;
    });
    this.toast(`${s.name}${mode ? ` (${mode.name})` : ""} : −${cost} PC`);
  },

  primToggle(arg) {
    const [side, bi, li] = arg.split("|");
    Companion.mutate(this, (p, g) => {
      const m = Companion.mission(g, side), lines = m.scoring[bi].lines;
      const k = `${p.round}|${bi}|${li}`, on = !p.prim[side][k];
      // Lignes « ou » : une seule du groupe
      if (on) {
        let a = Number(li); while (a > 0 && lines[a].or) a--;
        let b = Number(li); while (b + 1 < lines.length && lines[b + 1].or) b++;
        if (lines[li].or || (lines[Number(li) + 1] && lines[Number(li) + 1].or))
          for (let i = a; i <= b; i++) delete p.prim[side][`${p.round}|${bi}|${i}`];
      }
      if (on) p.prim[side][k] = true; else delete p.prim[side][k];
      Companion.logPrim(p, g, side, Number(bi), Number(li), on);
    });
  },

  primStep(arg) {
    const [side, bi, li, d] = arg.split("|");
    Companion.mutate(this, p => {
      const k = `${p.round}|${bi}|${li}`;
      const v = Math.max(0, (p.prim[side][k] || 0) + Number(d));
      const before = p.prim[side][k] || 0;
      if (v) p.prim[side][k] = v; else delete p.prim[side][k];
      if (v !== before) Companion.logPrim(p, Companion.game(this), side, Number(bi), Number(li), v > before, v - before);
    });
  },

  drawSec(value, el) {
    if (!value) return;
    const side = el.dataset.side;
    Companion.mutate(this, p => {
      const S = p.sec[side];
      S.hand.push(value); S.drawn.push(value); S.justReturned = null;
      Companion.log(p, "sec", `Secondaire piochée (${side === "me" ? "Moi" : (Companion.game(this).oppName || "Adversaire")}) : ${value}`);
      S.pendingDraw = Math.max(0, S.pendingDraw - 1);
    });
  },

  // Tirage au hasard des missions à piocher (mes secondaires)
  randomSec() {
    const p = Companion.game(this).play, S = p.sec.me;
    const pool = Companion.drawPool(p, "me");
    const n = Math.min(S.pendingDraw, pool.length);
    if (!n) { this.toast("Plus aucune mission dans ta pile."); return; }
    const picked = [];
    for (let i = 0; i < n; i++) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].name);
    Companion.mutate(this, p => {
      const S = p.sec.me;
      picked.forEach(name => {
        S.hand.push(name); S.drawn.push(name);
        Companion.log(p, "sec", `Secondaire tirée au hasard (Moi) : ${name}`);
      });
      S.justReturned = null;
      S.pendingDraw = Math.max(0, S.pendingDraw - n);
    });
    this.toast(`Tirage : ${picked.join(" et ")}`);
  },

  skipDraw(side) { Companion.mutate(this, p => { p.sec[side].pendingDraw = 0; }); },

  // Sacrifice : la mission est défaussée sans remplacement, en échange d'1 PC
  sacrificeSec(arg) {
    const [side, name] = arg.split("|");
    const who = side === "me" ? "Moi" : (Companion.game(this).oppName || "Adversaire");
    Companion.mutate(this, p => {
      const S = p.sec[side];
      S.hand = S.hand.filter(n => n !== name);
      (S.sacrificed = S.sacrificed || []).push(name);
      p.cp[side] += 1;
      Companion.log(p, "cp", `${name} sacrifiée (${who}) : +1 PC`);
    });
    this.toast(`${name} sacrifiée : +1 PC.`, () => CompanionActions.matchUndo.call(this));
  },

  swapSec(arg) {
    const [side, name] = arg.split("|");
    Companion.mutate(this, p => {
      const S = p.sec[side];
      S.hand = S.hand.filter(n => n !== name);
      S.swapUsed = true;
      (S.swapped = S.swapped || []).push(name);
      Companion.log(p, "cp", `${name} échangée (${side === "me" ? "Moi" : (Companion.game(this).oppName || "Adversaire")}) : −1 PC`);
      S.pendingDraw += 1;
      p.cp[side] = Math.max(0, p.cp[side] - 1);
    });
    this.toast(`${name} échangée : −1 PC. Indique la nouvelle mission piochée.`);
  },

  secToggle(arg) {
    const [side, name, k] = arg.split("|");
    const s = Season.secondaries.find(x => x.name === name);
    const f = Companion.secForm(this, side, name);
    const [bi, li] = k.split(".").map(Number);
    const lines = s.scoring[bi].lines;
    const on = !f[k];
    // « ou » : une seule ligne du groupe ; décocher une base retire son bonus
    if (on) {
      let a = li; while (a > 0 && lines[a].or) a--;
      let b = li; while (b + 1 < lines.length && lines[b + 1].or) b++;
      for (let i = a; i <= b; i++) if (i !== li) delete f[`${bi}.${i}`];
      f[k] = 1;
    } else {
      delete f[k];
      if (lines[li + 1] && lines[li + 1].bonus) delete f[`${bi}.${li + 1}`];
    }
    this.render();
  },

  secStep(arg) {
    const [side, name, k, d] = arg.split("|");
    const f = Companion.secForm(this, side, name);
    const v = Math.max(0, (f[k] || 0) + Number(d));
    if (v) f[k] = v; else delete f[k];
    this.render();
  },

  scoreSec(arg) {
    const [side, name] = arg.split("|");
    const s = Season.secondaries.find(x => x.name === name);
    const pts = Companion.secPoints(this, side, s);
    if (!pts) return;
    delete this.state.match.secForms[`${side}|${name}`];
    Companion.mutate(this, p => {
      const S = p.sec[side];
      S.hand = S.hand.filter(n => n !== name);
      S.done.push({ name, pts, round: p.round });
      Companion.log(p, "pts", `Secondaire ${name} (${side === "me" ? "Moi" : (Companion.game(this).oppName || "Adversaire")}) : +${pts} PdV`);
    });
    this.toast(`${name} : +${pts} PdV`);
  },

  // Repioche sous condition (gratuite) : la carte retourne dans la pile si la règle le dit
  redrawSec(arg) {
    const [side, name] = arg.split("|");
    const s = Season.secondaries.find(x => x.name === name);
    Companion.mutate(this, p => {
      const S = p.sec[side];
      const back = !!(s.redraw && s.redraw.reshuffle);
      S.hand = S.hand.filter(n => n !== name);
      if (back) { S.drawn = S.drawn.filter(n => n !== name); S.justReturned = name; }
      else (S.removed = S.removed || []).push(name);
      S.pendingDraw += 1;
      Companion.log(p, "sec", `${name} ${back ? "remélangée (repioche)" : "retirée pour la partie (irréalisable)"}`);
    });
    this.toast(`${name} ${s.redraw && s.redraw.reshuffle ? "remélangée dans la pile" : "retirée pour cette partie"}. ${side === "me" ? "Tire" : "Indique"} la nouvelle mission.`);
  },

  openSec(name) { this.state.secView = name; this.state.overlay = "secCard"; this.render(); },
  openMission(side) { this.state.missionView = side; this.state.overlay = "missionCard"; this.render(); },

  trackerAdj(d) {
    Companion.mutate(this, p => {
      p.tracker.value = Math.max(0, p.tracker.value + Number(d));
      const t = Setup.selected(Companion.ctx(this)).find(x => x.tracker && !x.tracker.type);
      Companion.log(p, "trk", `${t ? t.tracker.label : "Compteur"} : ${p.tracker.value}`);
    });
  },
  setDesignation(uid) { Companion.mutate(this, p => { p.tracker.designation = uid; }); },

  setTrackerCible(value, el) {
    const id = el.dataset.id, t = Setup.selected(Companion.ctx(this)).map(d => d.tracker).find(x => x && x.id === id);
    Companion.mutate(this, p => {
      (p.tracker.cibles = p.tracker.cibles || {})[id] = value.trim();
      Companion.log(p, "trk", `${t ? t.label : "Cible"} : ${value.trim() || "aucune"}`);
    });
  },

  toggleTrackerChoix(arg) {
    const [id, n] = arg.split("|");
    const t = Setup.selected(Companion.ctx(this)).map(d => d.tracker).find(x => x && x.id === id);
    if (!t) return;
    Companion.mutate(this, p => {
      const all = p.tracker.choix = p.tracker.choix || {};
      const key = Companion.choixKey(p, t), max = t.max || 1, v = Number(n);
      let cur = all[key] || [];
      if (cur.includes(v)) cur = cur.filter(x => x !== v);
      else if (max === 1) cur = [v];
      else if (cur.length < max) cur = [...cur, v];
      all[key] = cur;
      Companion.log(p, "trk", `${t.label} : ${cur.length ? cur.map(x => (t.options.find(y => y.n === x) || {}).short).join(", ") : "aucune"}`);
    });
  },

  togglePhases(side) {
    const t = Companion.settings().trackPhases;
    t[side] = !t[side];
    // Depuis l'accueil, il n'y a pas de partie ouverte : on enregistre seulement le réglage
    const g = this.state.screen === "game" && Companion.game(this);
    if (g && g.play.active === side) g.play.phase = t[side] ? (g.play.phase || "commandement") : null;
    Store.save();
    this.render();
  },

  // La fenêtre « Mon armée » ne se ferme que par le bouton Armée du haut ; sinon on la replie
  armyToggle() {
    const m = this.state.match;
    m.armyOpen = !m.armyOpen;
    m.armyCard = null;
    m.armyMin = false;
    this.render();
  },

  armyMin() { const m = this.state.match; m.armyMin = !m.armyMin; this.render(); },

  toggleDeadList() { this.state.match.deadOpen = !this.state.match.deadOpen; this.render(); },

  armyCard(uid) { this.state.match.armyCard = uid || null; this.render(); },

  toggleDead(uid) {
    const ctx = Companion.ctx(this), e = ctx && Builder.entry(ctx, uid), name = e ? Builder.label(ctx, e) : "Unité";
    Companion.mutate(this, p => {
      if (p.destroyed[uid]) { delete p.destroyed[uid]; Companion.log(p, "unit", `Unité remise en jeu : ${name}`); }
      else { p.destroyed[uid] = true; Companion.log(p, "unit", `Unité détruite : ${name}`); }
    });
  },

  rulesToggle() { const m = this.state.match; m.rulesOpen = !m.rulesOpen; this.render(); },

  openMap() {
    const g = Companion.game(this);
    if (!g.deployment) return;
    if (this.state.overlay) { this.state.overlay = null; this.render(); }
    DeployViewer.open(Deployments.file(g.myDisposition, g.oppDisposition, g.deployment),
      `${Dispositions[g.myDisposition].name} / ${Dispositions[g.oppDisposition].name} — ${Deployments.name(g.myDisposition, g.oppDisposition, g.deployment)}`,
      Deployments.altFile(g.myDisposition, g.oppDisposition, g.deployment));
  },

  matchUndo() {
    const m = this.state.match, g = Companion.game(this);
    if (!m.undo.length) return;
    g.play = JSON.parse(m.undo.pop());
    Store.save();
    this.render();
    this.toast("Action annulée.");
  },

  finishGame() {
    const g = Companion.game(this);
    const me = Companion.totals(this, "me").total, op = Companion.totals(this, "opp").total;
    g.score = { me, opp: op };
    g.result = me > op ? "victoire" : me < op ? "defaite" : "egalite";
    g.play.finished = true;
    Store.save();
    this.state.screen = "home";
    this.state.overlay = "backup";
    this.render({ resetScroll: true });
  }
};

Overlays.backup = function () {
  return this.wrap(`
    <div class="ov-head"><h2>Résultat enregistré</h2></div>
    <p>La partie est dans ton historique. Tes données ne sont gardées que dans ce navigateur :
      exporter une sauvegarde maintenant te protège si l'historique du navigateur est effacé.</p>
    <div class="ov-btns"><button class="btn" data-action="closeOverlay">Plus tard</button>
      <button class="btn btn-primary" data-action="exportData">Exporter une sauvegarde</button></div>`, "ov-narrow");
};

/* =========================================================
   APTITUDES EN JEU — rappels par phase et étape « Avant la bataille »
   ========================================================= */

const PlayAbilities = {
  phaseWords: { commandement: "Commandement", mouvement: "Mouvement", tir: "Tir", charge: "Charge", combat: "Combat" },

  // Aptitudes réellement actives d'une entrée (équipement pris, condition remplie) + son optimisation
  of(ctx, e) {
    const u = Builder.unit(ctx, e.unitId);
    if (!u) return [];
    const { counts } = Builder.loadout(ctx, u, e);
    const out = (u.abilities || []).filter(a => !a.inactive && (!a.requiresWargear || counts[a.requiresWargear]) &&
      (!(a.condition || a.grants === "unite-menee") || Army.conditionMet(ctx, e, a)))
      .map(a => ({ name: a.name, text: a.text, usage: a.usage }));
    const en = e.enhancement && Builder.enh(ctx, e.enhancement);
    if (en) out.push({ name: en.enh.name, text: en.enh.text, usage: en.enh.usage, gameChoice: en.enh.gameChoice });
    return out;
  },

  // Moments (phase + tour) repérés dans le texte : « votre phase de Tir », « phase de Combat adverse »…
  moments(text) {
    const out = [];
    Object.entries(this.phaseWords).forEach(([id, w]) => {
      const re = new RegExp(`(votre |la |de la |chaque )?phase de ${w}( adverse)?`, "gi");
      let m;
      while ((m = re.exec(text))) {
        const turn = m[2] ? "opp" : /votre/i.test(m[1] || "") ? "me" : "both";
        if (!out.some(x => x.phase === id && x.turn === turn)) out.push({ phase: id, turn });
      }
    });
    return out;
  },

  // Rappels pour le tour (et la phase) en cours
  forNow(app) {
    const ctx = Companion.ctx(app), p = Companion.game(app).play;
    if (!ctx || !p.active) return [];
    const res = [];
    ctx.state.units.forEach(e => {
      if (p.destroyed[e.uid]) return;
      this.of(ctx, e).forEach(a => {
        const ms = this.moments(a.text || "").filter(m => m.turn === "both" || m.turn === p.active);
        const hit = p.phase ? ms.filter(m => m.phase === p.phase) : ms;
        if (hit.length) res.push({ e, a, phases: [...new Set(hit.map(m => m.phase))] });
      });
    });
    return res;
  },

  usageKey(p, e, a) {
    const scope = a.usage === "une-fois-par-bataille" ? "B" : a.usage === "une-fois-par-round" ? `R${p.round}` : `R${p.round}${p.active}`;
    return `${e.uid}|${a.name}|${scope}`;
  },

  box(app) {
    const ctx = Companion.ctx(app), p = Companion.game(app) && Companion.game(app).play;
    if (!p) return "";
    p.abUsed = p.abUsed || {};
    const items = this.forNow(app).filter(it => !(it.a.usage && p.abUsed[this.usageKey(p, it.e, it.a)]));
    if (!items.length) return "";
    const title = p.phase ? `Aptitudes · ${Labels.phase[p.phase]}` : "Aptitudes de ce tour";
    // Sans usage limité, une aptitude partagée par plusieurs unités n'apparaît qu'une fois
    const rows = [];
    // Une aptitude limitée déjà utilisée disparaît (elle revient au tour ou au round suivant si sa limite le permet)
    items.filter(it => !(it.a.usage && p.abUsed[this.usageKey(p, it.e, it.a)])).forEach(it => {
      const same = !it.a.usage && rows.find(r => !r.a.usage && r.a.name === it.a.name);
      if (same) { same.units.push(it.e); it.phases.forEach(x => { if (!same.phases.includes(x)) same.phases.push(x); }); }
      else rows.push({ ...it, units: [it.e] });
    });
    return `<div class="abr"><div class="abr-h">${title}</div>${rows.map(({ e, a, phases, units }) => {
      const k = this.usageKey(p, e, a), used = !!p.abUsed[k];
      return `<div class="abr-row ${used ? "is-used" : ""}">
        <button class="abr-name" data-action="openAbility" data-arg="${UI.esc(e.uid)}|${UI.esc(a.name)}">
          <b>${UI.esc(a.name)}</b><small>${UI.esc(units.map(x => Builder.label(ctx, x)).join(", "))}${p.phase ? "" : ` · ${phases.map(x => Labels.phase[x]).join(", ")}`}</small></button>
        ${a.usage ? `<button class="abr-use ${used ? "is-on" : ""}" data-action="useAbility" data-arg="${UI.esc(k)}"
          title="Marquer comme utilisée">${Labels.usage[a.usage]} · utiliser</button>` : ""}</div>`;
    }).join("")}</div>`;
  },

  /* ---------- Avant la bataille ---------- */

  checklist(app) {
    const g = Companion.game(app), ctx = Companion.ctx(app);
    const items = [];
    const add = (sec, text) => items.push({ sec, text });
    if (g.deployment) add("Table", `Mise en place : <b>${UI.esc(Deployments.name(g.myDisposition, g.oppDisposition, g.deployment))}</b>.`);
    const mine = Companion.mission(g, "me"), opp = Companion.mission(g, "opp");
    if (mine && mine.setup) add("Missions", `<b>Ta primaire :</b> ${UI.fmt(mine.setup)}`);
    if (opp && opp.setup) add("Missions", `<b>Primaire adverse :</b> ${UI.fmt(opp.setup)}`);
    if (ctx) {
      Setup.selected(ctx).forEach(d => {
        const t = d.tracker;
        if (t && t.debutRound) add("Détachement", `<b>${UI.esc(t.label)} :</b> ${UI.fmt(t.debutRound)}`);
        if (t && t.type === "designation") add("Détachement", `<b>${UI.esc(t.label)} :</b> ton Seigneur de Guerre au début de la bataille.`);
        if (t && t.type === "choix" && !t.renouveler) add("Détachement", `<b>${UI.esc(t.label)} :</b> ${UI.fmt(t.moment)} À cocher dans la colonne des stratagèmes.`);
      });
      const marked = ctx.state.units.map(e => {
        const u = Builder.unit(ctx, e.unitId);
        const m = u && Builder.markSource(ctx, u) && Builder.markOf(ctx, u, e);
        return m ? `${UI.esc(Builder.label(ctx, e))} : ${UI.esc(UI.mark(m))}` : null;
      }).filter(Boolean);
      if (marked.length) add("Formations de bataille", `<b>Marques choisies</b> — ${marked.join(" · ")}.`);
      ctx.state.units.forEach(e => {
        const led = Army.ledUnit(ctx, e);
        if (led) add("Formations de bataille", `${UI.esc(Builder.label(ctx, e))} mène <b>${UI.esc(Builder.label(ctx, led))}</b>.`);
      });
      Army.transports(ctx).forEach(t => {
        const pas = Army.passengers(ctx, t);
        if (pas.length) add("Formations de bataille", `<b>${UI.esc(Builder.label(ctx, t))}</b> transporte ${pas.map(x =>
          UI.esc([x, ...Army.attached(ctx, x)].map(y => Builder.label(ctx, y)).join(" + "))).join(", ")}.`);
      });
      const core = id => ctx.state.units.filter(e => {
        const u = Builder.unit(ctx, e.unitId);
        return u && (u.coreAbilities || []).some(c => c === id || c.startsWith(id + ":"));
      });
      const names = es => es.map(e => UI.esc(Builder.label(ctx, e))).join(", ");
      const ds = core("deep-strike");
      if (ds.length) add("Déploiement", `<b>Frappe en Profondeur</b> possible (réserves) : ${names(ds)}.`);
      const inf = core("infiltrators");
      if (inf.length) add("Déploiement", `<b>Infiltrateurs</b> : ${names(inf)}.`);
      const sc = core("scouts");
      if (sc.length) add("Avant la bataille", `<b>Éclaireurs</b> : ${names(sc)}.`);
      ctx.state.units.forEach(e => this.of(ctx, e).forEach(a => {
        const lbl = UI.esc(Builder.label(ctx, e));
        if (a.gameChoice) add("Avant la bataille", `<b>${UI.esc(a.name)}</b> (${lbl}) : ${UI.fmt(a.gameChoice)}`);
        else if (/début de la bataille|avant-bataille|Formations de Bataille|après le déploiement/i.test(a.text || ""))
          add("Avant la bataille", `<b>${UI.esc(a.name)}</b> (${lbl}) : ${UI.fmt(a.text)}`);
      }));
    }
    return items;
  }
};

Overlays.ability = function (app) {
  const [uid, name] = app.state.abilityView || [];
  const ctx = Companion.ctx(app), e = ctx && Builder.entry(ctx, uid);
  const a = e && PlayAbilities.of(ctx, e).find(x => x.name === name);
  if (!a) return "";
  return this.wrap(`<div class="ov-head"><h2>${UI.esc(a.name)}</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <p class="muted">${UI.esc(Builder.label(ctx, e))}${a.usage ? ` · ${Labels.usage[a.usage]}` : ""}</p><p>${UI.fmt(a.text)}</p>`, "ov-narrow");
};

Overlays.beforeBattle = function (app) {
  const g = Companion.game(app), items = PlayAbilities.checklist(app);
  const done = g.play.prepDone || {};
  const nDone = items.filter((it, i) => done[i]).length;
  const showAll = app.state.bbAll;
  const shown = items.map((it, i) => ({ ...it, i })).filter(it => showAll || !done[it.i]);
  const secs = [...new Set(shown.map(i => i.sec))];
  return this.wrap(`
    <div class="ov-head"><h2>Avant la bataille</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${!items.length ? `<p class="hint">Rien de particulier à préparer avec cette armée.</p>`
      : !shown.length ? `<p class="hint">Tout est prêt.</p>`
      : secs.map(sec => `<h3 class="prep-h">${sec}</h3>${shown.filter(it => it.sec === sec).map(it =>
      `<button class="bb-row ${done[it.i] ? "is-on" : ""}" data-action="bbCheck" data-arg="${it.i}"><span class="emb-box"></span><span>${it.text}</span></button>`).join("")}`).join("")}
    ${nDone ? `<button class="btn btn-s" data-action="bbShowAll">${showAll ? "Masquer les étapes faites" : `Afficher les étapes faites (${nDone})`}</button>` : ""}
    <div class="ov-btns"><button class="btn btn-primary" data-action="closeOverlay">C'est parti !</button></div>`, "ov-narrow");
};

const PlayAbilityActions = {
  openAbility(arg) { this.state.abilityView = arg.split("|"); this.state.overlay = "ability"; this.render(); },
  useAbility(k) {
    Companion.mutate(this, p => {
      p.abUsed = p.abUsed || {};
      if (p.abUsed[k]) delete p.abUsed[k];
      else { p.abUsed[k] = true; Companion.log(p, "ab", `Aptitude utilisée : ${k.split("|")[1]}`); }
    });
  },
  bbShowAll() { this.state.bbAll = !this.state.bbAll; this.render(); },
  bbCheck(i) { const p = Companion.game(this).play; p.prepDone = p.prepDone || {}; p.prepDone[i] = !p.prepDone[i]; Store.save(); this.render(); }
};

Overlays.journal = function (app) {
  const g = Companion.game(app), log = (g.play.log || []).slice().reverse();
  const who = t => t === "me" ? "ton tour" : t === "opp" ? `tour de ${g.oppName || "l'adversaire"}` : "avant la bataille";
  let last = null;
  const rows = log.map(x => {
    const head = `${x.r}|${x.t}`;
    const h = head !== last ? `<h3 class="jr-h">Round ${x.r} · ${UI.esc(who(x.t))}</h3>` : "";
    last = head;
    return `${h}<div class="jr-row jr-${x.kind}">${x.ph ? `<span class="jr-ph" style="--ph:${PhaseColors[x.ph]}">${Labels.phase[x.ph]}</span>` : ""}<span>${UI.esc(x.text)}</span></div>`;
  }).join("");
  return this.wrap(`
    <div class="ov-head"><h2>Journal de la partie</h2><button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    ${rows || `<p class="hint">Rien pour l'instant : les points, les PC et les stratagèmes s'inscriront ici au fil de la partie.</p>`}`, "ov-narrow");
};
