/* =========================================================
   RÈGLES ÉTENDUES — compléments du moteur, chargés en dernier
   (après app.js). Ils remplacent ou complètent quelques méthodes
   de Builder, BuilderUI, UI et Companion, sans toucher aux fichiers
   d'origine. Ajoutés pour les Aeldari, utilisables par toute faction.

   Données reconnues :
   ---------------------------------------------------------------
   Unités
     travellingPlayers : true   1 exemplaire (ou d.travellingPlayersMax
                                si un détachement choisi le prévoit)
     cannotBeWarlord   : true   ne peut pas être Seigneur de Guerre
     exclusiveEpic     : "Kw"   avec cette unité, aucun EPIC HERO sans
                                le mot-clé Kw (et inversement)
     retinue: { ledBy: [[kw…]], label }
                                escorte : peut rejoindre une unité déjà
                                menée par un personnage ayant ces mots-clés
                                (une seule escorte par unité, toutes
                                escortes confondues)
     retinue: { joins: [[kw…]], label }
                                variante : rejoint directement une unité
                                ayant ces mots-clés, menée ou non
                                (ex. Support Artillery des Aeldari)
   Détachements
     grantsKeywords → BATTLELINE   compte désormais pour le nombre
                                   d'exemplaires (Lignes)
     weaponAbilities[].to          [[mots-clés]] : unités concernées
     weaponMods[]                  { to: [[mots-clés]], type?, A?, S?, AP?, D? } :
                                   caractéristiques d'armes modifiées pour
                                   les unités concernées (mots-clés gagnés
                                   par optimisation compris)
     travellingPlayersMax          nombre d'exemplaires permis
     constraints: { type: "warlordOneOf", names: [...] }
   Options d'équipement
     allModels: true    tout ou rien : un seul choix (Non / l'arme),
                        appliqué à toutes les figurines concernées
                        (celles du type opt.model, sinon toute l'unité)
   Optimisations
     kind: "corsaire"   posée sur une unité (personnage ou non),
                        unique dans l'armée, compte dans la limite
                        d'optimisations
     allowEpic: true    autorisée sur un EPIC HERO
   Suivis en partie (faction.trackers ou detachment.tracker)
     type: "reserve"    stock de pions : perPoints, refill
                        ("round" ou "bataille"), bonus
     type: "unitTokens" pions par unité : ability + per, ou wargear
   ========================================================= */

(() => {

/* ---------- Petites aides ---------- */

const hasAll = (set, alt) => alt.every(k => set.has(k));
const enhLimit = (enh, r) => enh.kind === "amelioration" ? r.maxUpgradeCopies : 1;
const enhLabel = (enh, u) => enh.kind === "amelioration" ? "Amélioration"
  : enh.kind === "corsaire" ? "Optimisation de Corsaire"
  : (u && !Builder.isChar(u) ? "Amélioration" : "Optimisation");

/* =========================================================
   BUILDER
   ========================================================= */

// Exemplaires : Ligne gagnée par détachement, Travelling Players
Builder.maxCopies = function (app, u) {
  if (this.isEpic(u)) return 1;
  const r = this.rules(app);
  if (u.travellingPlayers) {
    const d = app && app.state && app.faction && !app.isCodex && Setup.selected(app).find(x => x.travellingPlayersMax);
    return d ? d.travellingPlayersMax : 1;
  }
  const kw = app && app.faction ? this.kwSet(app, u, null, false) : new Set(u.keywords);
  if (kw.has("Battleline") || kw.has("Dedicated Transport")) return r.maxBattleline;
  return r.maxCopies;
};

// Optimisations de Corsaire (unités) et optimisations permises à un héros épique
Builder.enhEligible = function (app, u, enh, e) {
  if (this.isEpic(u) && !enh.allowEpic) return false;
  if (enh.kind !== "amelioration" && enh.kind !== "corsaire" && !this.isChar(u)) return false;
  if ((enh.requiresCore || []).some(c => !(u.coreAbilities || []).some(a => a === c || a.startsWith(c + ":")))) return false;
  const ks = this.kwSet(app, u, e, false);
  const req = enh.requires || [];
  if (req.length && !req.some(alt => hasAll(ks, alt))) return false;
  if ((enh.excludes || []).some(k => ks.has(k))) return false;
  return true;
};

// Fiche effective : aptitudes d'armes limitées à certaines unités (weaponAbilities[].to)
// et caractéristiques d'armes modifiées par un détachement (weaponMods)
Builder.view = function (app, u, e) {
  if (!app || !app.faction || app.isCodex || !app.state) return u;
  const base = this.baseKw(app, u);
  const v = Object.assign({}, u, {
    stats: Object.assign({}, u.stats),
    weapons: u.weapons.map(w => Object.assign({}, w, { profiles: w.profiles.map(p => Object.assign({}, p, { abilities: [...p.abilities] })) })),
    _mods: {}
  });
  if (!u._faction && base.has(app.faction.keyword)) {
    Setup.selected(app).forEach(d => (d.weaponAbilities || []).forEach(wa => {
      if (wa.to && !wa.to.some(alt => hasAll(base, alt))) return;
      v.weapons.forEach(w => {
        if (wa.type && w.type !== wa.type) return;
        w.profiles.forEach(p => {
          if (p.abilities.some(a => a === wa.ability || a.startsWith(wa.ability.split(":")[0] + ":"))) return;
          p.abilities.push(wa.ability);
          (p.gained = p.gained || []).push(wa.ability);
        });
      });
    }));
    // Mots-clés gagnés par optimisation compris (ex. Destroyer Cult par l'Ankh de Destroyer)
    const ks = this.kwSet(app, u, e);
    Setup.selected(app).forEach(d => (d.weaponMods || []).forEach(wm => {
      if (wm.to && !wm.to.some(alt => hasAll(ks, alt))) return;
      v.weapons.forEach(w => {
        if (wm.type && w.type !== wm.type) return;
        w.profiles.forEach(p => ["A", "S", "AP", "D"].forEach(k => {
          if (wm[k]) { p[k] = this.bump(p[k], wm[k]); (p.modded = p.modded || {})[k] = true; }
        }));
      });
    }));
  }
  const src = e && this.markSource(app, u);
  const mark = src && this.markOf(app, u, e);
  const opt = mark && src.options.find(o => o.mark === mark);
  ((opt && opt.mods) || []).forEach(m => {
    if (m.stat) { v.stats[m.stat] = this.bump(v.stats[m.stat], m.add); v._mods[m.stat] = true; }
    if (m.weapon) {
      const w = v.weapons.find(x => x.id === m.weapon);
      if (w) w.profiles.forEach(p => ["A", "S", "AP", "D"].forEach(k => {
        if (m[k]) { p[k] = this.bump(p[k], m[k]); (p.modded = p.modded || {})[k] = true; }
      }));
    }
  });
  v._extraKw = this.extraKeywords(app, u, e);
  return v;
};

// Options « tout ou rien » (allModels) : choisies une fois, appliquées à toutes les figurines
const baseOptLimit = Builder.optLimit;
Builder.optLimit = function (u, opt, sizeModels, e) {
  if (opt.allModels) return 1;
  return baseOptLimit.call(this, u, opt, sizeModels, e);
};

const baseLoadout = Builder.loadout;
Builder.loadout = function (app, u, e) {
  const all = (u.options || []).filter(o => o.allModels);
  if (!e || !e.options || !all.length) return baseLoadout.call(this, app, u, e);
  const ms = this.models(u, this.size(u, e).models);
  const opts = Object.assign({}, e.options);
  all.forEach(o => {
    const v = e.options[o.id];
    if (!v) return;
    const n = o.model ? (ms.find(m => m.id === o.model) || { count: 0 }).count : ms.reduce((s, m) => s + m.count, 0);
    opts[o.id] = v.map(x => (x ? n : 0));
  });
  return baseLoadout.call(this, app, u, Object.assign({}, e, { options: opts }));
};

/* ---------- Escortes (retinue) ----------
   Unité non-personnage qui rejoint une unité déjà menée par un personnage
   donné (ex. Tomb Crawlers et Cryptothralls avec un Cryptek), ou, avec
   retinue.joins, directement une unité donnée (ex. Support Artillery des
   Aeldari avec des Guardian Defenders). Elle utilise le rattachement
   existant (attachedTo) avec un 3e type, « escorte ». */

const isRetinue = u => !!(u && u.retinue);

// L'unité t convient-elle à cette escorte ? (renvoie l'hôte, ou rien)
const retinueHost = (ctx, ret, t) => {
  if (ret.joins) {
    const tu = Builder.unit(ctx, t.unitId);
    return tu && !isRetinue(tu) && ret.joins.some(alt => alt.every(k => Builder.has(ctx, tu, k, t))) ? t : null;
  }
  return Army.attached(ctx, t).find(c => {
    const cu = Builder.unit(ctx, c.unitId);
    return cu && !isRetinue(cu) && ret.ledBy.some(alt => alt.every(k => Builder.has(ctx, cu, k, c)));
  });
};
// « unité menée par un Cryptek » ou « unité Guardian Defenders »
const retinueNeed = ret => ret.joins ? `unité ${ret.label}` : `unité menée par un ${ret.label}`;

const retinueTargets = (ctx, e) => {
  const u = Builder.unit(ctx, e.unitId);
  return ctx.state.units.filter(t => t.uid !== e.uid && Army.isTop(ctx, t) &&
    !isRetinue(Builder.unit(ctx, t.unitId)) && retinueHost(ctx, u.retinue, t));
};

const baseCharType = Army.charType;
Army.charType = function (u) { return isRetinue(u) ? "escorte" : baseCharType.call(this, u); };

// Noms des unités possibles (non vide, pour que le menu de rattachement s'affiche)
const baseCanLead = Builder.canLead;
Builder.canLead = function (app, e) {
  const u = this.unit(app, e.unitId);
  if (!isRetinue(u)) return baseCanLead.call(this, app, e);
  const names = [...new Set(retinueTargets(app, e).map(t => this.unit(app, t.unitId).name))];
  return names.length ? names : [retinueNeed(u.retinue)];
};

const baseAttachTargets = Army.attachTargets;
Army.attachTargets = function (ctx, e) {
  if (!isRetinue(Builder.unit(ctx, e.unitId))) return baseAttachTargets.call(this, ctx, e);
  const list = retinueTargets(ctx, e);
  const cur = e.attachedTo && Builder.entry(ctx, e.attachedTo);
  return cur && !list.includes(cur) ? [cur, ...list] : list;
};

const baseAttachBlock = Army.attachBlock;
Army.attachBlock = function (ctx, e, t) {
  const u = Builder.unit(ctx, e.unitId);
  if (!isRetinue(u)) return baseAttachBlock.call(this, ctx, e, t);
  if (!retinueHost(ctx, u.retinue, t)) return u.retinue.joins ? `pas une unité ${u.retinue.label}` : `pas menée par un ${u.retinue.label}`;
  const other = this.attached(ctx, t).find(x => x.uid !== e.uid && isRetinue(Builder.unit(ctx, x.unitId)));
  return other ? `déjà une escorte : ${Builder.label(ctx, other)}` : null;
};

const baseAttachControl = Army.attachControl;
Army.attachControl = function (ctx, e, scope) {
  const u = Builder.unit(ctx, e.unitId);
  if (!isRetinue(u)) return baseAttachControl.call(this, ctx, e, scope);
  const targets = this.attachTargets(ctx, e);
  const opts = targets.map(t => {
    const block = this.attachBlock(ctx, e, t);
    const on = e.attachedTo === t.uid;
    return `<option value="${t.uid}" ${on ? "selected" : ""} ${block && !on ? "disabled" : ""}>
      ${UI.esc(Builder.label(ctx, t))}${block ? ` (${UI.esc(block)})` : ""}</option>`;
  }).join("");
  return `<label class="cfg-row"><span class="cfg-l">Rejoint</span>
      <select data-change="armyAttach" data-uid="${e.uid}" data-scope="${scope}">
        <option value="">Aucune unité</option>${opts}</select></label>
    ${!targets.length ? `<p class="hint">Aucune ${UI.esc(retinueNeed(u.retinue))} dans la liste.</p>` : ""}`;
};

// Problèmes propres aux escortes (remplacent les messages de rattachement d'origine)
const retinueIssues = ctx => {
  const out = [];
  ctx.state.units.forEach(e => {
    const u = Builder.unit(ctx, e.unitId);
    const t = e.attachedTo && Builder.entry(ctx, e.attachedTo);
    if (!isRetinue(u) || !t) return;
    const block = Army.attachBlock(ctx, e, t);
    if (block) out.push({ msg: `${Builder.label(ctx, e)} ne peut pas rejoindre ${Builder.label(ctx, t)} : ${block}.`, uid: e.uid });
  });
  return out;
};

const baseIssues = Army.issues;
Army.issues = function (ctx) {
  const ret = new Set(ctx.state.units.filter(e => isRetinue(Builder.unit(ctx, e.unitId))).map(e => e.uid));
  return baseIssues.call(this, ctx).filter(i => !(ret.has(i.uid) && !/embarquer/.test(i.msg))).concat(retinueIssues(ctx));
};

// « Menée par » : seulement les personnages ; l'escorte est signalée à part
const baseLeadersOf = Builder.leadersOf;
Builder.leadersOf = function (app, target) {
  return baseLeadersOf.call(this, app, target).filter(x => !isRetinue(this.unit(app, x.unitId)));
};

const baseBonusBox = Army.bonusBox;
Army.bonusBox = function (ctx, e) {
  const esc = this.attached(ctx, e).filter(x => isRetinue(Builder.unit(ctx, x.unitId)));
  const line = esc.length ? `<p class="cfg-led">Escortée par ${esc.map(x => `<button class="cfg-link" data-action="selEntry" data-arg="${x.uid}">${UI.esc(Builder.label(ctx, x))} ›</button>`).join(" ")}</p>` : "";
  return line + baseBonusBox.call(this, ctx, e);
};

// Vérifications supplémentaires de la liste
const baseValidate = Builder.validate;
Builder.validate = function (app) {
  const out = baseValidate.call(this, app);
  const push = (msg, uid) => { if (!out.some(o => o.msg === msg)) out.push({ msg, uid }); };
  const st = app.state;
  const entries = st.units.map(e => ({ e, u: this.unit(app, e.unitId) })).filter(x => x.u);
  const wl = st.units.find(e => e.warlord);
  const wlu = wl && this.unit(app, wl.unitId);

  // Seigneur de Guerre interdit
  if (wlu && wlu.cannotBeWarlord) push(`${wlu.name} ne peut pas être ton Seigneur de Guerre.`, wl.uid);

  // Seigneur de Guerre imposé par un détachement
  Setup.selected(app).forEach(d => (d.constraints || []).forEach(c => {
    if (c.type !== "warlordOneOf" || !st.units.length) return;
    if (!wlu || !c.names.includes(wlu.name))
      push(`${d.name} : ton Seigneur de Guerre doit être ${c.names.join(" ou ")}.`, wl && wl.uid);
  }));

  // Héros épiques exclusifs (Servant / Avatar of the Whispering God)
  entries.filter(x => x.u.exclusiveEpic).forEach(({ e, u }) => {
    // Mot-clé d'origine de la fiche : celui gagné par détachement (Dévots d'Ynnead) ne compte pas
    const bad = entries.find(y => y.e !== e && this.isEpic(y.u) && !this.baseKw(app, y.u).has(u.exclusiveEpic));
    if (bad) push(`${u.name} ne peut pas être dans la même armée que ${bad.u.name} (héros épique non ${u.exclusiveEpic.toUpperCase()}).`, e.uid);
  });

  // Escortes : rattachement encore valable ?
  retinueIssues(app).forEach(i => push(i.msg, i.uid));

  return out;
};

/* =========================================================
   INTERFACE DU BUILDER
   ========================================================= */

BuilderUI.enhChoices = function (app, u, e) {
  const r = Builder.rules(app);
  const usage = Builder.enhUsage(app);
  const slotsFull = Builder.enhSlotsUsed(app) >= r.maxOptimisations;
  return Builder.detEnhancements(app).filter(x => Builder.enhEligible(app, u, x.enh, e)).map(({ enh, det }) => {
    const mine = e.enhancement === enh.id;
    const usedElsewhere = (usage[enh.id] || 0) - (mine ? 1 : 0);
    let reason = "";
    if (!mine && usedElsewhere >= enhLimit(enh, r)) reason = "Déjà prise dans l'armée";
    else if (!mine && !usage[enh.id] && slotsFull) reason = `Limite de ${r.maxOptimisations} optimisations atteinte`;
    return { enh, det, mine, reason };
  });
};

BuilderUI.enhancementControl = function (app, u, e) {
  const list = this.enhChoices(app, u, e);
  if (Builder.isEpic(u) && !list.length && !e.enhancement) return `<p class="hint">Héros épique : pas d'optimisation.</p>`;
  if (!list.length && !e.enhancement) return "";
  const cur = e.enhancement && Builder.enh(app, e.enhancement);
  const label = list.some(x => x.enh.kind === "corsaire") && !Builder.isChar(u) ? "Optimisation de Corsaire"
    : Builder.isChar(u) ? "Optimisation" : "Amélioration";
  return `<div class="cfg-row"><span class="cfg-l">${label}</span>
      <button class="enh-pick" data-action="openEnh" data-arg="${e.uid}">
        ${cur ? `<b>${UI.esc(cur.enh.name)}</b><span class="wcost">+${cur.enh.cost} pts</span>` : `<span class="muted">Aucune · ${list.length} disponible${list.length > 1 ? "s" : ""}</span>`}
        <span class="chev-r" aria-hidden="true">›</span></button></div>`;
};

BuilderUI.enhBox = function (app, e) {
  const cur = e.enhancement && Builder.enh(app, e.enhancement);
  if (!cur) return "";
  const u = Builder.unit(app, e.unitId);
  const unitWide = Army.enhAffectsUnit(cur.enh) && Builder.isChar(u);
  return `<div class="bonus-box enh-box"><span class="cfg-l">${enhLabel(cur.enh, u)}${unitWide ? " · profite à toute son unité" : ""}</span>
    <p><b>${UI.esc(cur.enh.name)}</b> : ${UI.fmt(cur.enh.text)}</p></div>`;
};

const baseEnhCard = UI.enhancement;
UI.enhancement = function (e, faction) {
  if (e.kind !== "corsaire") return baseEnhCard.call(this, e, faction);
  const html = baseEnhCard.call(this, Object.assign({}, e, { kind: "optimisation" }), faction);
  // Badge inséré juste après l'en-tête de la carte
  return html.replace("</div>", '</div><div class="badges"><span class="badge badge-upgrade">Optimisation de Corsaire</span></div>');
};

/* =========================================================
   COMPAGNON : réserves de pions
   ========================================================= */

const Reserves = {
  // Suivis actifs : ceux de la faction, puis ceux des détachements choisis
  list(ctx) {
    const sel = Setup.selected(ctx);
    const fromFaction = (ctx.faction.trackers || []).filter(t => !t.detachment || sel.some(d => d.id === t.detachment));
    const fromDets = sel.map(d => d.tracker).filter(t => t && (t.type === "reserve" || t.type === "unitTokens"));
    return fromFaction.concat(fromDets);
  },

  pointsValue(table, points) {
    let v = 0;
    (table || []).forEach(([min, n]) => { if (points >= min) v = n; });
    return v;
  },

  // Valeur de départ (au début du round, ou au début de la bataille)
  base(ctx, p, t) {
    let v = this.pointsValue(t.perPoints, ctx.state.points);
    const sel = Setup.selected(ctx);
    (t.bonus || []).forEach(b => {
      if (b.rounds && !b.rounds.includes(p.round)) return;
      if (b.detachment && !sel.some(d => d.id === b.detachment)) return;
      if (b.enhancement) {
        const e = ctx.state.units.find(x => x.enhancement === b.enhancement);
        if (!e || p.destroyed[e.uid]) return;
      }
      v += b.add;
    });
    return v;
  },

  key(p, t) { return t.refill === "round" ? `${t.id}|R${p.round}` : t.id; },

  value(ctx, p, t) {
    const store = (p.tracker.reserves || {});
    const k = this.key(p, t);
    return store[k] != null ? store[k] : this.base(ctx, p, t);
  },

  // Unités qui ont des pions (aptitude par tranche de N figurines, ou équipement)
  tokenUnits(ctx, t) {
    return ctx.state.units.map(e => {
      const u = Builder.unit(ctx, e.unitId);
      if (!u) return null;
      let n = 0;
      if (t.ability && (u.abilities || []).some(a => a.name === t.ability)) n = Math.floor(Builder.size(u, e).models / (t.per || 1));
      if (t.wargear) n = Builder.loadout(ctx, u, e).counts[t.wargear] || 0;
      return n ? { e, n } : null;
    }).filter(Boolean);
  },

  html(ctx, p, t) {
    if (t.type === "unitTokens") {
      const units = this.tokenUnits(ctx, t);
      if (!units.length) return "";
      const store = p.tracker.tokens || {};
      return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}</div>
        ${units.map(({ e, n }) => {
          const k = `${t.id}|${e.uid}`, v = store[k] != null ? store[k] : n;
          const dead = p.destroyed[e.uid];
          return `<div class="trk-h" style="font-weight:400${dead ? ";opacity:.5" : ""}"><span>${UI.esc(Builder.label(ctx, e))}</span>
            <span class="trk-ctl"><button data-action="tokenAdj" data-arg="${UI.esc(k)}|-1|${n}" ${v ? "" : "disabled"} aria-label="Utiliser un pion">−</button><b>${v}</b><small>/${n}</small>
            <button data-action="tokenAdj" data-arg="${UI.esc(k)}|1|${n}" ${v < n ? "" : "disabled"} aria-label="Rendre un pion">+</button></span></div>`;
        }).join("")}
        ${t.hint ? `<p class="trk-hint">${UI.fmt(t.hint)}</p>` : ""}</div>`;
    }
    const v = this.value(ctx, p, t), b = this.base(ctx, p, t);
    return `<div class="trk"><div class="trk-h">${UI.esc(t.label)}
        <span class="trk-ctl"><button data-action="reserveAdj" data-arg="${UI.esc(t.id)}|-1" ${v ? "" : "disabled"} aria-label="Dépenser 1">−</button><b>${v}</b>
        <button data-action="reserveAdj" data-arg="${UI.esc(t.id)}|1" aria-label="Ajouter 1">+</button></span></div>
      <p class="trk-hint">${t.refill === "round" ? `${b} au début de ce round.` : `${b} au début de la bataille.`}${t.hint ? ` ${UI.fmt(t.hint)}` : ""}</p></div>`;
  }
};

const baseTrackerBox = Companion.trackerBox;
Companion.trackerBox = function (app) {
  const ctx = this.ctx(app);
  if (!ctx) return "";
  const p = this.game(app).play;
  const extra = Reserves.list(ctx).map(t => Reserves.html(ctx, p, t)).join("");
  // Les suivis « reserve » / « unitTokens » d'un détachement ne passent pas par l'affichage d'origine
  const sel = Setup.selected;
  Setup.selected = c => sel(c).filter(d => !(d.tracker && (d.tracker.type === "reserve" || d.tracker.type === "unitTokens")));
  let base = "";
  try { base = baseTrackerBox.call(this, app); } finally { Setup.selected = sel; }
  return extra + base;
};

const ReserveActions = {
  reserveAdj(arg) {
    const [id, d] = arg.split("|");
    const ctx = Companion.ctx(this);
    const t = ctx && Reserves.list(ctx).find(x => x.id === id);
    if (!t) return;
    Companion.mutate(this, p => {
      const store = p.tracker.reserves = p.tracker.reserves || {};
      const v = Math.max(0, Reserves.value(ctx, p, t) + Number(d));
      store[Reserves.key(p, t)] = v;
      Companion.log(p, "trk", `${t.label} : ${v}`);
    });
  },
  tokenAdj(arg) {
    const [tid, uid, d, max] = arg.split("|");
    const ctx = Companion.ctx(this);
    const t = ctx && Reserves.list(ctx).find(x => x.id === tid);
    const e = ctx && Builder.entry(ctx, uid);
    Companion.mutate(this, p => {
      const store = p.tracker.tokens = p.tracker.tokens || {};
      const k = `${tid}|${uid}`;
      const cur = store[k] != null ? store[k] : Number(max);
      store[k] = Math.max(0, Math.min(Number(max), cur + Number(d)));
      Companion.log(p, "trk", `${t ? t.label : "Pions"} (${e ? Builder.label(ctx, e) : "unité"}) : ${store[k]}`);
    });
  }
};
Object.assign(CompanionActions, ReserveActions);
if (typeof App !== "undefined") Object.assign(App.actions, ReserveActions);

})();
