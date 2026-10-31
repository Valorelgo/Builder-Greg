/* =========================================================
   BUILDER — calculs de la liste
   Une entrée de liste : { uid, unitId, size, options, enhancement,
                           warlord, attachedTo }
   options = { idOption: [nombre pris pour chaque choix] }
   ========================================================= */

const Builder = {

  /* ---------- Accès aux données ---------- */

  // Jeux de données auxiliaires chargés pour cette faction (ex. démons)
  extras(app) {
    const ids = new Set();
    app.faction.detachments.forEach(d => (d.extraFiles || []).forEach(f => ids.add(f)));
    return [...ids].map(id => Factions.get(id)).filter(Boolean);
  },

  // Mots-clés débloqués par les détachements choisis
  unlocked(app) {
    return new Set(Setup.selected(app).flatMap(d => d.unlocks || []));
  },

  // Toutes les unités connues : faction + auxiliaires (avec leur mot-clé de faction)
  allUnits(app) {
    const own = app.faction.units.map(u => u);
    const ext = this.extras(app).flatMap(x => x.units.map(u => (u._faction ? u : Object.assign(u, { _faction: x.keyword }))));
    return own.concat(ext);
  },

  factionKw(app, u) { return u._faction || app.faction.keyword; },

  // L'unité peut-elle faire partie de l'armée avec les détachements actuels ?
  allowed(app, u) { return !this.disallowed(app, u); },

  // Raison pour laquelle l'unité est interdite (null si elle est autorisée)
  disallowed(app, u) {
    if (u._faction && !this.unlocked(app).has(u._faction))
      return `unités ${u._faction} non autorisées sans le détachement qui les débloque`;
    if (u.requiresArmyRule && !this.ruleActive(app, u.requiresArmyRule)) {
      const by = Setup.selected(app).find(d => (d.removesArmyRules || []).includes(u.requiresArmyRule));
      return `interdite avec ${by ? by.name : "tes détachements"}`;
    }
    return null;
  },

  /* ---------- Règles d'armée retirées par un détachement ---------- */

  removedRules(app) {
    if (!app || app.isCodex || !app.state || !app.faction) return new Set();
    return new Set(Setup.selected(app).flatMap(d => d.removesArmyRules || []));
  },
  ruleActive(app, id) { return !this.removedRules(app).has(id); },

  /* ---------- Marques du Chaos ----------
     Marque innée (mot-clé de la fiche), allégeance de la fiche (markChoice d'unité)
     ou marque choisie grâce à un détachement (markChoice de détachement). */

  marks: ["Khorne", "Tzeentch", "Nurgle", "Slaanesh", "Chaos Undivided"],

  innateMark(u) { return this.marks.find(m => u.keywords.includes(m)) || null; },

  markSource(app, u) {
    if (this.innateMark(u)) return null;
    if (u.markChoice) return { unit: true, required: !!u.markChoice.required, name: u.markChoice.name || "Marque",
                               options: u.markChoice.options.map(o => typeof o === "string" ? { mark: o } : o) };
    if (!app || app.isCodex || !app.state || !app.faction) return null;
    const d = Setup.selected(app).find(x => x.markChoice);
    if (!d || u._faction) return null;
    const base = this.baseKw(app, u);
    if (!base.has(app.faction.keyword) || (d.markChoice.excludes || []).some(k => base.has(k))) return null;
    return { unit: false, required: true, name: "Marque du Chaos", det: d.name,
             options: d.markChoice.options.map(o => typeof o === "string" ? { mark: o } : o) };
  },

  markOf(app, u, e) {
    const inn = this.innateMark(u);
    if (inn) return inn;
    const src = e && this.markSource(app, u);
    return src && e.mark && src.options.some(o => o.mark === e.mark) ? e.mark : null;
  },

  // Détachement qui impose la même marque (kind : "transport" ou "leader")
  sameMarkRule(app, kind) {
    if (!app || app.isCodex || !app.state) return false;
    return Setup.selected(app).some(d => d.markChoice && (d.markChoice.sameMarkFor || []).includes(kind));
  },

  /* ---------- Fiche effective dans cette armée ----------
     Aptitudes d'armes données par les détachements, modificateurs d'allégeance,
     mots-clés gagnés (affichés en pied de carte). La fiche d'origine n'est pas modifiée. */

  view(app, u, e) {
    if (!app || !app.faction || app.isCodex || !app.state) return u;
    const base = this.baseKw(app, u);
    const v = Object.assign({}, u, {
      stats: Object.assign({}, u.stats),
      weapons: u.weapons.map(w => Object.assign({}, w, { profiles: w.profiles.map(p => Object.assign({}, p, { abilities: [...p.abilities] })) })),
      _mods: {}
    });
    if (!u._faction && base.has(app.faction.keyword)) {
      Setup.selected(app).forEach(d => (d.weaponAbilities || []).forEach(wa => v.weapons.forEach(w => {
        if (wa.type && w.type !== wa.type) return;
        w.profiles.forEach(p => {
          if (p.abilities.some(a => a === wa.ability || a.startsWith(wa.ability + ":"))) return;
          p.abilities.push(wa.ability);
          (p.gained = p.gained || []).push(wa.ability);
        });
      })));
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
  },

  // Ajoute n à la valeur numérique en tête (« 8" » → « 10" ») ; laisse les valeurs aléatoires
  bump(val, n) { return String(val).replace(/^-?\d+/, x => String(Number(x) + n)); },

  unit(app, id) { return this.allUnits(app).find(u => u.id === id) || null; },
  entry(app, uid) { return app.state.units.find(e => e.uid === uid) || null; },

  baseKw(app, u) { return new Set([...u.keywords, u.name, this.factionKw(app, u)]); },

  // Mots-clés de la fiche + ceux gagnés (détachement, marque, optimisations si withEnh)
  kwSet(app, u, e, withEnh = true) {
    const s = this.baseKw(app, u);
    this.extraKeywords(app, u, e, withEnh).forEach(x => s.add(x.k));
    return s;
  },
  has(app, u, k, e) { return this.kwSet(app, u, e).has(k); },

  // Mots-clés gagnés : [{ k, from }]
  extraKeywords(app, u, e, withEnh = true) {
    const out = [];
    if (!app || !app.faction || app.isCodex || !app.state) return out;
    const base = this.baseKw(app, u);
    const push = (k, from) => { if (!base.has(k) && !out.some(x => x.k === k)) out.push({ k, from }); };
    Setup.selected(app).forEach(d => (d.grantsKeywords || []).forEach(g => {
      if (!u._faction && g.to.some(alt => alt.every(k => base.has(k)))) g.keywords.forEach(k => push(k, d.name));
    }));
    if (!e) return out;
    const m = this.markOf(app, u, e);
    if (m) push(m, "marque choisie");
    if (withEnh) {
      const en = e.enhancement && this.enh(app, e.enhancement);
      if (en) (en.enh.grantsKeywords || []).forEach(k => push(k, en.enh.name));
      // Optimisation d'un personnage rattaché qui profite à toute son unité
      app.state.units.filter(x => x.attachedTo === e.uid).forEach(c => {
        const ce = c.enhancement && this.enh(app, c.enhancement);
        if (ce && ce.enh.affectsUnit) (ce.enh.grantsKeywords || []).forEach(k => push(k, ce.enh.name));
      });
    }
    return out;
  },
  isChar(u) { return u.keywords.includes("Character"); },
  isEpic(u) { return u.keywords.includes("Epic Hero"); },
  rules(app) { return Rules.forPoints(app.state.points); },

  maxCopies(app, u) {
    if (this.isEpic(u)) return 1;
    const r = this.rules(app);
    if (u.keywords.includes("Battleline") || u.keywords.includes("Dedicated Transport")) return r.maxBattleline;
    return r.maxCopies;
  },

  copies(app, unitId) { return app.state.units.filter(e => e.unitId === unitId); },
  copyIndex(app, e) { return this.copies(app, e.unitId).indexOf(e) + 1; },

  label(app, e) {
    const u = this.unit(app, e.unitId);
    return this.copies(app, e.unitId).length > 1 ? `${u.name} #${this.copyIndex(app, e)}` : u.name;
  },

  /* ---------- Effectif et coûts ---------- */

  size(u, e) { return u.sizes.find(s => s.models === (e && e.size)) || u.sizes[0]; },

  tierCost(size, n) {
    let pts = size.costs[0].pts;
    size.costs.forEach(c => { if (n >= c.from) pts = c.pts; });
    return pts;
  },

  // Types de figurines avec leur nombre pour un effectif donné
  // countBySize : nombre de figurines de ce type selon l'effectif choisi
  models(u, sizeModels) {
    if (!u.models) return [{ id: "_", name: u.name, count: sizeModels, loadout: u.loadout || [] }];
    const cnt = m => (m.countBySize && m.countBySize[sizeModels] != null ? m.countBySize[sizeModels] : m.count);
    const fixed = u.models.filter(m => m.count !== "reste").reduce((s, m) => s + cnt(m), 0);
    return u.models.map(m => ({ ...m, count: m.count === "reste" ? Math.max(0, sizeModels - fixed) : cnt(m) }));
  },

  // Nombre maximum d'options prises (tous choix confondus)
  // Avec l'entrée e : tient compte du maximum partagé (sharedMax)
  // et de l'arme exigée (requiresWeapon : une option par exemplaire de cette arme)
  optLimit(u, opt, sizeModels, e) {
    const ms = this.models(u, sizeModels);
    const eligible = opt.model
      ? (ms.find(m => m.id === opt.model) || { count: 0 }).count
      : ms.reduce((s, m) => s + m.count, 0);
    let lim = eligible;
    if (opt.max) lim = opt.max.per ? Math.floor(sizeModels / opt.max.per) * opt.max.count : opt.max.count;
    // Option « pour chaque arme X » : limitée par cette arme, pas par le nombre de figurines
    if (!opt.requiresWeapon) lim = Math.min(lim, eligible);
    if (e && opt.sharedMax) {
      const others = (u.options || []).filter(o => o !== opt && o.sharedMax === opt.sharedMax)
        .reduce((s, o) => s + this.optCounts(e, o).reduce((a, b) => a + b, 0), 0);
      lim = Math.max(0, Math.min(lim, (opt.max ? opt.max.count : lim) - others));
    }
    if (e && opt.requiresWeapon) lim = Math.min(lim, this.weaponAvail(u, e, opt));
    return lim;
  },

  // Exemplaires de l'arme exigée par une option (sur le type de figurine visé s'il y en a un)
  weaponAvail(u, e, opt) {
    const { counts, pools } = this.loadout(null, u, e);
    const pool = opt.model && pools[opt.model];
    return (pool ? pool[opt.requiresWeapon] : counts[opt.requiresWeapon]) || 0;
  },

  optCounts(e, opt) {
    const v = e && e.options ? e.options[opt.id] : null;
    return opt.choices.map((_, i) => (v && v[i]) || 0);
  },

  // Équipement réellement porté : { counts: {arme: nombre}, pools: {type de figurine: {arme: nombre}}, problems: [...] }
  loadout(app, u, e) {
    const sm = this.size(u, e).models;
    const counts = {}, pools = {};
    const ms = this.models(u, sm);
    const add = (pool, id, n) => { counts[id] = (counts[id] || 0) + n; pool[id] = (pool[id] || 0) + n; };
    ms.forEach(m => { pools[m.id] = {}; m.loadout.forEach(w => add(pools[m.id], w, m.count)); });
    const problems = [];
    const flag = id => { if (!problems.includes(id)) problems.push(id); };
    (u.options || []).forEach(opt => {
      const own = opt.model && pools[opt.model];
      const oc = this.optCounts(e, opt);
      if (opt.noDuplicates && oc.some(n => n > 1)) flag(opt.id);
      oc.forEach((n, i) => {
        for (let k = 0; k < n; k++) {
          let pool = own || null;
          (opt.replaces || []).forEach(r => {
            const p = pool && pool[r] > 0 ? pool : (!own ? Object.values(pools).find(x => x[r] > 0) : null);
            if (p) { p[r]--; counts[r]--; if (!pool) pool = p; }
            else flag(opt.id);
          });
          const target = pool || pools[ms[0].id];
          opt.choices[i].forEach(w => add(target, w, 1));
        }
      });
    });
    // Arme exigée : pas plus d'options que d'exemplaires de cette arme
    (u.options || []).filter(o => o.requiresWeapon).forEach(opt => {
      const pool = opt.model && pools[opt.model];
      const avail = (pool ? pool[opt.requiresWeapon] : counts[opt.requiresWeapon]) || 0;
      if (this.optCounts(e, opt).reduce((a, b) => a + b, 0) > avail) flag(opt.id);
    });
    // Maximum d'une arme par figurine
    if (u.maxPerModel) {
      for (const [w, max] of Object.entries(u.maxPerModel)) {
        if (ms.some(m => (pools[m.id][w] || 0) > max * Math.max(1, m.count))) flag(`max:${w}`);
      }
    }
    return { counts, pools, problems };
  },

  weaponCost(u, counts) {
    return u.weapons.reduce((s, w) => s + (w.cost ? w.cost * (counts[w.id] || 0) : 0), 0);
  },

  enh(app, id) {
    for (const d of app.faction.detachments) {
      const x = d.enhancements.find(z => z.id === id);
      if (x) return { enh: x, det: d };
    }
    return null;
  },

  entryCost(app, e) {
    const u = this.unit(app, e.unitId);
    const base = this.tierCost(this.size(u, e), this.copyIndex(app, e));
    const { counts } = this.loadout(app, u, e);
    const en = e.enhancement ? this.enh(app, e.enhancement) : null;
    return base + this.weaponCost(u, counts) + (en ? en.enh.cost : 0);
  },

  total(app) { return app.state.units.reduce((s, e) => s + this.entryCost(app, e), 0); },

  nextCost(app, u) { return this.tierCost(u.sizes[0], this.copies(app, u.id).length + 1); },

  /* ---------- Optimisations et améliorations ---------- */

  detEnhancements(app) {
    return Setup.selected(app).flatMap(d => d.enhancements.map(enh => ({ enh, det: d })));
  },

  // e : entrée concernée (marque choisie, mots-clés de détachement)
  enhEligible(app, u, enh, e) {
    if (this.isEpic(u)) return false;
    if (enh.kind !== "amelioration" && !this.isChar(u)) return false;
    if ((enh.requiresCore || []).some(c => !(u.coreAbilities || []).some(a => a === c || a.startsWith(c + ":")))) return false;
    const ks = this.kwSet(app, u, e, false);
    const req = enh.requires || [];
    if (req.length && !req.some(alt => alt.every(k => ks.has(k)))) return false;
    if ((enh.excludes || []).some(k => ks.has(k))) return false;
    return true;
  },

  enhUsage(app) {
    const m = {};
    app.state.units.forEach(e => { if (e.enhancement) m[e.enhancement] = (m[e.enhancement] || 0) + 1; });
    return m;
  },

  // Chaque optimisation compte 1 ; une amélioration ne compte que pour son 1er exemplaire
  enhSlotsUsed(app) { return Object.keys(this.enhUsage(app)).length; },

  /* ---------- Rattachements ---------- */

  canLead(app, e) {
    const u = this.unit(app, e.unitId);
    const list = [...((u.leader && u.leader.canLead) || [])];
    const en = e.enhancement && this.enh(app, e.enhancement);
    if (en && en.enh.grantsLeaderOf) list.push(...en.enh.grantsLeaderOf);
    return list;
  },

  leadersOf(app, target) { return app.state.units.filter(x => x.attachedTo === target.uid); },

  /* ---------- Vérifications de la liste ---------- */

  validate(app) {
    const st = app.state, r = this.rules(app), out = [];
    const push = (msg, uid) => out.push({ msg, uid });

    const total = this.total(app);
    if (total > st.points) push(`Ta liste dépasse le format de ${total - st.points} points.`);
    if (st.units.length && !st.units.some(e => e.warlord)) push("Choisis un Seigneur de Guerre parmi tes personnages.");

    // Détachements incompatibles (même étiquette, ex. Cauchemar)
    const dets = Setup.selected(app);
    dets.forEach((d, i) => {
      const other = d.exclusiveGroup && dets.slice(i + 1).find(x => x.exclusiveGroup === d.exclusiveGroup);
      if (other) push(`${d.name} et ${other.name} ne peuvent pas être pris ensemble (${UI.cap(d.exclusiveGroup)}).`);
    });

    const seen = new Set();
    st.units.forEach(e => {
      if (seen.has(e.unitId)) return;
      seen.add(e.unitId);
      const u = this.unit(app, e.unitId);
      const n = this.copies(app, e.unitId).length, max = this.maxCopies(app, u);
      if (n > max) push(`${u.name} : ${n} exemplaires pour ${max} autorisés.`, e.uid);
    });

    const usage = this.enhUsage(app);
    const detIds = new Set(this.detEnhancements(app).map(x => x.enh.id));
    const slots = this.enhSlotsUsed(app);
    if (slots > r.maxOptimisations) push(`Trop d'optimisations : ${slots} pour ${r.maxOptimisations} autorisées.`);

    st.units.forEach(e => {
      const u = this.unit(app, e.unitId), name = this.label(app, e);
      const { problems } = this.loadout(app, u, e);
      const groups = {};
      (u.options || []).forEach(opt => {
        const counts = this.optCounts(e, opt);
        const sum = counts.reduce((a, b) => a + b, 0);
        if (sum > this.optLimit(u, opt, this.size(u, e).models, e)) problems.push(opt.id);
        if (opt.group && sum) groups[opt.group] = (groups[opt.group] || 0) + 1;
      });
      if (Object.values(groups).some(n => n > 1)) problems.push("group");
      if (problems.length) push(`${name} : options d'équipement incompatibles ou trop nombreuses.`, e.uid);

      if (e.enhancement) {
        const x = this.enh(app, e.enhancement);
        if (!x || !detIds.has(e.enhancement)) {
          push(`${name} : ${x ? x.enh.name : "cette optimisation"} ne fait plus partie de tes détachements.`, e.uid);
        } else {
          if (!this.enhEligible(app, u, x.enh, e)) push(`${name} ne peut pas recevoir ${x.enh.name}.`, e.uid);
          const lim = x.enh.kind === "amelioration" ? r.maxUpgradeCopies : 1;
          if (usage[e.enhancement] > lim) push(`${x.enh.name} est prise ${usage[e.enhancement]} fois (${lim} au maximum).`, e.uid);
          if (x.enh.requiresAttachedTo) {
            const t = e.attachedTo && this.entry(app, e.attachedTo);
            const tu = t && this.unit(app, t.unitId);
            if (!tu || !x.enh.requiresAttachedTo.includes(tu.name))
              push(`${name} : ${x.enh.name} demande d'être rattaché à des ${x.enh.requiresAttachedTo.join(" ou ")}.`, e.uid);
          }
        }
      }

      if (u.mustBeWarlord && !e.warlord) push(`${u.name} doit être ton Seigneur de Guerre.`, e.uid);

      const src = this.markSource(app, u);
      if (src && src.required && !this.markOf(app, u, e))
        push(`${name} : choisis ${src.unit ? `son ${src.name}` : "sa marque du Chaos"}.`, e.uid);
    });

    Army.issues(app).forEach(x => out.push(x));

    const wl = st.units.find(e => e.warlord);
    Setup.selected(app).forEach(d => (d.constraints || []).forEach(c => {
      if (c.type === "noWarlord" && wl && this.has(app, this.unit(app, wl.unitId), c.keyword))
        push(`Une unité ${c.keyword} ne peut pas être ton Seigneur de Guerre.`, wl.uid);
      if (c.type === "maxPointsPercent") {
        const max = Math.floor(st.points * c.percent / 100);
        const pts = st.units.filter(e => this.has(app, this.unit(app, e.unitId), c.keyword))
          .reduce((s, e) => s + this.entryCost(app, e), 0);
        if (pts > max) push(`Unités ${c.keyword} : ${pts} pts pour ${max} autorisés.`);
      }
    }));

    const seenNA = new Set();
    st.units.forEach(e => {
      const u = this.unit(app, e.unitId);
      if (!u) push("Une unité de cette liste n'existe plus dans les données.", e.uid);
      else if (!this.allowed(app, u) && !seenNA.has(u.id)) {
        seenNA.add(u.id);
        push(`${u.name} : ${this.disallowed(app, u)}.`, e.uid);
      }
    });

    const unique = new Map();
    out.forEach(o => { if (!unique.has(o.msg)) unique.set(o.msg, o); });
    return [...unique.values()];
  },

  /* ---------- Ajustement de la police des fiches ---------- */

  fit() {
    const card = document.querySelector(".ucard");
    if (!card) return;
    card.classList.remove("uc-scroll");
    let fs = 17;
    card.style.setProperty("--fs", `${fs}px`);

    // Équilibre les colonnes : les premières aptitudes passent sous les armes,
    // une par une, tant que ça raccourcit la fiche
    const [left, right] = card.querySelectorAll(".uc-col");
    const abRight = card.querySelector(".uc-col:last-child .uc-abilities");
    const balance = () => {
      if (!left || !right || !abRight) return;
      let abLeft = left.querySelector(".uc-abilities");
      if (abLeft) { [...abLeft.children].reverse().forEach(c => abRight.prepend(c)); abLeft.remove(); }
      abLeft = document.createElement("div");
      abLeft.className = "uc-abilities";
      left.appendChild(abLeft);
      while (abRight.firstElementChild) {
        const item = abRight.firstElementChild;
        const before = Math.max(left.scrollHeight, right.scrollHeight);
        abLeft.appendChild(item);
        if (Math.max(left.scrollHeight, right.scrollHeight) >= before) { abRight.prepend(item); break; }
      }
    };
    left && (left.style.alignSelf = right.style.alignSelf = "start");
    balance();

    while (card.scrollHeight > card.clientHeight + 1 && fs > 13) {
      fs -= 0.5;
      card.style.setProperty("--fs", `${fs}px`);
      balance();
    }
    if (card.scrollHeight > card.clientHeight + 1) card.classList.add("uc-scroll");
  }
};
