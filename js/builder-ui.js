/* =========================================================
   BUILDER — écran de choix des unités
   Catalogue à gauche, fiche à droite, panneaux par-dessus
   ========================================================= */

const BuilderUI = {

  /* ---------- Barre du haut : points, problèmes, liste ---------- */

  status(app) {
    const total = Builder.total(app);
    const left = app.state.points - total;
    const issues = Builder.validate(app);
    const ok = !issues.length;
    return `<div class="tb-build">
      <div class="pts ${left < 0 ? "is-over" : ""}">
        <b>${total} / ${app.state.points} pts</b>
        <small>${left >= 0 ? `${left} restants` : `${-left} en trop`}</small>
      </div>
      <button class="issues ${ok ? "is-ok" : ""}" data-action="openOverlay" data-arg="issues"
              aria-label="${ok ? "Liste valide" : `${issues.length} problème(s)`}">${ok ? "✓" : `! ${issues.length}`}</button>
      <button class="btn btn-s" data-action="openOverlay" data-arg="list">Voir la liste</button>
    </div>`;
  },

  /* ---------- Catalogue ---------- */

  // Catalogue : unités de la faction, puis chaque groupe auxiliaire débloqué (ex. démons)
  catalog(app, issues) {
    let html = this.catalogGroup(app, issues, app.faction.units, "cat");
    const unlocked = Builder.unlocked(app);
    Builder.extras(app).forEach(x => {
      const used = app.state.units.some(e => x.units.some(u => u.id === e.unitId));
      if (!unlocked.has(x.keyword) && !used) return;
      Builder.allUnits(app);   // marque les unités auxiliaires
      const warn = unlocked.has(x.keyword) ? "" :
        `<p class="cat-warn">Non autorisées : coche le détachement qui les débloque.</p>`;
      html += `<div class="cat-extra"><h2 class="cat-extra-h">${UI.esc(x.name)}</h2>${warn}
        ${this.catalogGroup(app, issues, x.units, `cat:${x.id}`, !unlocked.has(x.keyword))}</div>`;
    });
    return html;
  },

  catalogGroup(app, issues, list, prefix, locked) {
    const st = app.state;
    const bad = new Set(issues.map(i => i.uid).filter(Boolean));
    return UnitCategories.map(cat => {
      const units = list.filter(u => u.category === cat.id);
      if (!units.length) return "";
      const rows = units.map(u => {
        const copies = Builder.copies(app, u.id);
        const why = !locked && !u._faction ? Builder.disallowed(app, u) : null;
        const full = locked || !!why || copies.length >= Builder.maxCopies(app, u);
        const selU = st.sel && st.sel.type === "unit" && st.sel.id === u.id ? "is-sel" : "";
        const subs = copies.map(e => {
          const selE = st.sel && st.sel.type === "entry" && st.sel.id === e.uid ? "is-sel" : "";
          const tags = [];
          if (u.sizes.length > 1 || e.size > 1) tags.push(`${e.size} fig.`);
          if (e.warlord) tags.push("SdG");
          const mk = Builder.markSource(app, u) && Builder.markOf(app, u, e);
          if (mk) tags.push(UI.mark(mk));
          const en = e.enhancement && Builder.enh(app, e.enhancement);
          if (en) tags.push(en.enh.name);
          const t = e.attachedTo && Builder.entry(app, e.attachedTo);
          if (t) tags.push(`avec ${Builder.label(app, t)}`);
          Builder.leadersOf(app, e).forEach(l => tags.push(`+ ${Builder.label(app, l)}`));
          return `<button class="ce-row ${selE} ${bad.has(e.uid) ? "has-issue" : ""}" data-action="selEntry" data-arg="${e.uid}">
                    <span class="ce-n">#${Builder.copyIndex(app, e)}</span>
                    <span class="ce-tags">${UI.esc(tags.join(" · ")) || "&nbsp;"}</span>
                    <span class="ce-cost">${Builder.entryCost(app, e)}</span>
                  </button>`;
        }).join("");
        return `<div class="cu-row ${selU}">
                  <button class="cu-name" data-action="selUnit" data-arg="${u.id}">
                    ${UI.esc(u.name)}${copies.length ? `<span class="cu-count">×${copies.length}</span>` : ""}
                    ${why ? `<span class="cu-why">${UI.esc(UI.cap(why))}</span>` : ""}
                  </button>
                  <span class="cu-cost">${full ? "" : Builder.nextCost(app, u)}</span>
                  <button class="cu-add" data-action="addUnit" data-arg="${u.id}" ${full ? "disabled" : ""}
                          aria-label="Ajouter ${UI.esc(u.name)}">+</button>
                </div>${subs}`;
      }).join("");
      const inList = st.units.filter(e => units.some(u => u.id === e.unitId)).length;
      return UI.section(app, `${prefix}:${cat.id}`, cat.label, rows,
        { tag: "h3", cls: "cat-fold", aside: inList ? `<span class="pill" title="${inList} dans la liste">${inList}</span>` : "" });
    }).join("");
  },

  /* ---------- Fiche d'unité ---------- */

  // readonly : consultation (écran « Consulter ») — pas de bouton d'ajout, coûts par effectif
  card(app, u, e, readonly) {
    const { counts } = Builder.loadout(app, u, e);
    const size = Builder.size(u, e);
    const cost = e ? Builder.entryCost(app, e) : Builder.nextCost(app, u);
    const badges = [];
    if (Builder.isEpic(u)) badges.push("Héros épique");
    if (e && e.warlord) badges.push("Seigneur de guerre");
    const v = Builder.view(app, u, e);
    const stats = this.statsHtml(v);

    const meta = [u.base ? `Socle ${UI.esc(u.base)}` : "Socle : la figurine", `${size.models} figurine${size.models > 1 ? "s" : ""}`];

    return `<div class="ucard">
      <header class="uc-head">
        <div class="uc-title">
          <h1>${UI.esc(e ? Builder.label(app, e) : u.name)}</h1>
          ${badges.map(b => `<span class="uc-badge">${b}</span>`).join("")}
          <span class="uc-cost">${cost} pts</span>
        </div>
        <div class="uc-stats">${stats}<div class="uc-meta">${meta.map(m => `<span>${m}</span>`).join("")}</div></div>
      </header>
      <div class="uc-body">
        <div class="uc-col">
          ${this.weaponTable(v, counts, "ranged")}
          ${this.weaponTable(v, counts, "melee")}
          ${this.wargear(u, counts)}
        </div>
        <div class="uc-col">
          ${e ? this.config(app, u, e) : readonly ? this.costBox(u) : this.addBox(app, u)}
          ${this.options(app, u, e, counts)}
          ${e ? this.enhBox(app, e) : ""}
          ${this.abilities(app, v, counts, e)}
        </div>
      </div>
      ${this.keywords(app, v)}
    </div>`;
  },

  // Caractéristiques : une ligne, ou une ligne par profil (statLines) ; valeurs modifiées en surbrillance
  statsHtml(v) {
    const boxes = (s, mods = {}) => [["M", "M"], ["E", "T"], ["Sv", "Sv"], ["PV", "W"], ["Cd", "Ld"], ["CO", "OC"]]
      .map(([k, f]) => `<div class="st-box ${mods[f] ? "is-mod" : ""}"><small>${k}</small><b>${s[f]}</b></div>`).join("") +
      (s.InSv ? `<div class="st-box st-inv"><small>Invu</small><b>${s.InSv}</b></div>` : "");
    if (!v.statLines || !v.statLines.length) return boxes(v.stats, v._mods);
    return `<div class="uc-statlines">${v.statLines.map(l => `<div class="uc-sl"><span class="uc-sl-l">${UI.esc(l.label)}</span>${boxes(l.stats)}</div>`).join("")}</div>`;
  },

  // Mots-clés en pied de carte, comme sur les fiches officielles (+ mots-clés gagnés dans cette armée)
  keywords(app, u) {
    const fk = Builder.factionKw(app, u);
    const extra = (u._extraKw || []).map(x => `<span class="uc-kw-add" title="${UI.esc(x.from)}">${UI.esc(x.k.toUpperCase())}</span>`);
    return `<footer class="uc-kw"><span class="uc-kw-l">Mots-clés</span>
      <span class="uc-kw-v">${u.keywords.map(k => UI.esc(k.toUpperCase())).concat(extra).join(", ")}</span>
      <span class="uc-kw-l">Faction</span><span class="uc-kw-v">${UI.esc(String(fk).toUpperCase())}</span>
      ${u.keywordsNote ? `<span class="uc-kw-note">${UI.esc(u.keywordsNote)}</span>` : ""}</footer>`;
  },

  weaponTable(u, counts, type) {
    const ws = u.weapons.filter(w => w.type === type);
    if (!ws.length) return "";
    const md = (p, k) => `<td${p.modded && p.modded[k] ? ' class="is-mod"' : ""}>${p[k]}</td>`;
    const row = (nameHtml, p, cls) => `
      <tr class="${cls}">
        <td class="wn">${nameHtml}${p.abilities.length ? `<span class="wabs">${p.abilities.map(a => {
          const gained = (p.gained || []).includes(a);
          return `<span class="wab ${gained ? "is-gained" : ""}"${gained ? ' title="Donnée par le détachement"' : ""}>${Glossary.tag(a)}</span>`;
        }).join("")}</span>` : ""}</td>
        <td>${UI.esc(p.range)}</td>${md(p, "A")}<td>${p.skill}</td>${md(p, "S")}${md(p, "AP")}${md(p, "D")}
      </tr>`;
    const rows = ws.map(w => {
      const n = counts[w.id] || 0;
      const off = n === 0 ? "off" : "";
      const cnt = n > 1 ? `<span class="wcount">${n}×</span>` : "";
      const extra = w.cost ? ` <span class="wcost">+${w.cost} pts</span>` : "";
      if (w.profiles.length === 1) return row(`${cnt}${UI.esc(w.name)}${extra}`, w.profiles[0], off);
      return `<tr class="wgroup ${off}"><td colspan="7">${cnt}${UI.esc(w.name)}${extra}</td></tr>` +
        w.profiles.map(p => row(`<span class="wprof">${UI.esc(p.name)}</span>`, p, `wsub ${off}`)).join("");
    }).join("");
    return `<table class="wtable">
      <thead><tr><th>${type === "ranged" ? "Armes de tir" : "Armes de mêlée"}</th><th>Portée</th><th>A</th><th>${type === "ranged" ? "CT" : "CC"}</th><th>F</th><th>PA</th><th>D</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
  },

  wargear(u, counts) {
    if (!u.wargear || !u.wargear.length) return "";
    return `<p class="wgear">Équipement : ${u.wargear.map(w =>
      `<span class="${counts[w.id] ? "" : "off"}">${UI.esc(w.name)}</span>`).join(", ")}</p>`;
  },

  choiceLabel(u, choice) {
    const all = [...u.weapons, ...(u.wargear || [])];
    const names = choice.map(id => (all.find(w => w.id === id) || { name: id }).name);
    const cost = choice.reduce((s, id) => s + ((all.find(w => w.id === id) || {}).cost || 0), 0);
    return UI.esc(names.join(" + ")) + (cost ? ` <span class="wcost">+${cost} pts</span>` : "");
  },

  // Libellé court : « Remplace X » ou « En plus », le texte complet reste en info-bulle
  optLabel(u, opt) {
    const all = [...u.weapons, ...(u.wargear || [])];
    const model = opt.model && u.models ? (u.models.find(m => m.id === opt.model) || {}).name : "";
    if (!opt.replaces || !opt.replaces.length) return `En plus${model ? ` (${UI.esc(model)})` : ""}`;
    const n = {};
    opt.replaces.forEach(id => { n[id] = (n[id] || 0) + 1; });
    const names = Object.entries(n).map(([id, k]) => `${k > 1 ? k + " " : ""}${(all.find(w => w.id === id) || { name: id }).name}`);
    return `Remplace ${UI.esc(names.join(" + "))}${model ? ` (${UI.esc(model)})` : ""}`;
  },

  options(app, u, e) {
    if (!u.options || !u.options.length) return "";
    if (!e) {
      return `<div class="opts"><h3>Options</h3>
        ${u.options.map(o => `<p class="opt-text">${UI.esc(o.text)}</p>`).join("")}
        <p class="hint">Ajoute l'unité à ta liste pour choisir ses options.</p></div>`;
    }
    const sm = Builder.size(u, e).models;
    const html = u.options.map(opt => {
      const c = Builder.optCounts(e, opt);
      const staticLim = Builder.optLimit(u, opt, sm);
      const lim = Builder.optLimit(u, opt, sm, e);
      const groupBusy = opt.group && u.options.some(o => o !== opt && o.group === opt.group &&
        Builder.optCounts(e, o).some(n => n));
      let ctrl;
      if (staticLim <= 1) {
        const none = c.every(n => !n);
        ctrl = `<div class="seg">
          <button class="${none ? "is-on" : ""}" data-action="setOpt" data-arg="${e.uid}|${opt.id}|-1">Non</button>
          ${opt.choices.map((ch, i) => `<button class="${c[i] ? "is-on" : ""}" data-action="setOpt"
              data-arg="${e.uid}|${opt.id}|${i}" ${groupBusy || (lim < 1 && none) ? "disabled" : ""}>${this.choiceLabel(u, ch)}</button>`).join("")}
        </div>${opt.requiresWeapon && staticLim > lim ? `<span class="opt-max">${this.reqLabel(u, opt)}</span>` : ""}`;
      } else {
        const sum = c.reduce((a, b) => a + b, 0);
        ctrl = opt.choices.map((ch, i) => `<div class="stepper">
            <span class="st-label">${this.choiceLabel(u, ch)}</span>
            <button data-action="stepOpt" data-arg="${e.uid}|${opt.id}|${i}|-1" ${c[i] ? "" : "disabled"} aria-label="Moins">−</button>
            <b>${c[i]}</b>
            <button data-action="stepOpt" data-arg="${e.uid}|${opt.id}|${i}|1" ${sum < lim && !(opt.noDuplicates && c[i] >= 1) ? "" : "disabled"} aria-label="Plus">+</button>
          </div>`).join("") + `<span class="opt-max">${lim} au maximum${opt.noDuplicates ? ", sans doublon" : ""}${opt.sharedMax ? " (maximum commun avec l'option voisine)" : ""}${opt.requiresWeapon ? ` · ${this.reqLabel(u, opt)}` : ""}</span>`;
      }
      return `<div class="opt" title="${UI.esc(opt.text)}"><span class="opt-l">${this.optLabel(u, opt)}</span>${ctrl}</div>`;
    }).join("");
    return `<div class="opts"><h3>Options</h3>${html}</div>`;
  },

  // « 1 par Helbrute fist » : option limitée par une arme portée
  reqLabel(u, opt) {
    const w = [...u.weapons, ...(u.wargear || [])].find(x => x.id === opt.requiresWeapon);
    return `1 par ${w ? w.name : opt.requiresWeapon}${opt.model ? "" : " portée"}`;
  },

  costBox(u) {
    return `<div class="uc-config"><p class="cost-tiers">${u.sizes.map(s => `<b>${s.models} fig.</b> : ${s.costs.map((c, i) =>
      `${c.pts} pts${s.costs.length > 1 ? (i === 0 ? (s.costs[1].from === 2 ? " (1er exemplaire)" : ` (exemplaires 1 à ${s.costs[1].from - 1})`) : ` (à partir du ${c.from}e)`) : ""}`).join(", ")}`).join("<br>")}</p></div>`;
  },

  addBox(app, u) {
    const why = Builder.disallowed(app, u);
    const full = Builder.copies(app, u.id).length >= Builder.maxCopies(app, u);
    return `<div class="uc-config">
      <button class="btn btn-primary" data-action="addUnit" data-arg="${u.id}" ${full || why ? "disabled" : ""}>
        Ajouter à la liste · ${Builder.nextCost(app, u)} pts</button>
      ${why ? `<p class="hint">${UI.esc(UI.cap(why))}.</p>` : full ? `<p class="hint">Nombre maximum d'exemplaires atteint (${Builder.maxCopies(app, u)}).</p>` : ""}
    </div>`;
  },

  // Choix de la marque du Chaos ou de l'allégeance
  markControl(app, u, e) {
    const src = Builder.markSource(app, u);
    if (!src) return "";
    const cur = Builder.markOf(app, u, e);
    return `<div class="cfg-row"><span class="cfg-l">${UI.esc(src.unit ? src.name : "Marque")}</span><div class="seg">
      ${src.options.map(o => `<button class="${cur === o.mark ? "is-on" : ""}" data-action="setMark"
        data-arg="${e.uid}|${UI.esc(o.mark)}">${UI.esc(UI.mark(o.mark))}</button>`).join("")}</div>
      ${cur ? "" : `<span class="hint">À choisir${src.det ? ` (${UI.esc(src.det)})` : ""}</span>`}</div>`;
  },

  config(app, u, e) {
    const rows = [];
    if (u.sizes.length > 1) {
      rows.push(`<div class="cfg-row"><span class="cfg-l">Effectif</span><div class="seg">
        ${u.sizes.map(s => `<button class="${s.models === e.size ? "is-on" : ""}" data-action="setSize"
          data-arg="${e.uid}|${s.models}">${s.models} fig. · ${Builder.tierCost(s, Builder.copyIndex(app, e))} pts</button>`).join("")}
      </div></div>`);
    }
    if (Builder.isChar(u)) {
      rows.push(`<div class="cfg-row"><button class="toggle ${e.warlord ? "is-on" : ""}" data-action="toggleWarlord"
        data-arg="${e.uid}" ${u.mustBeWarlord ? "disabled" : ""}>Seigneur de guerre</button>
        ${u.mustBeWarlord ? `<span class="hint">Obligatoire pour cette unité</span>` : ""}</div>`);
    }
    const mk = this.markControl(app, u, e);
    if (mk) rows.push(mk);
    if (Builder.canLead(app, e).length) rows.push(Army.attachControl(app, e, "list"));
    const leaders = Builder.leadersOf(app, e);
    if (leaders.length) rows.push(`<p class="cfg-led">Menée par ${leaders.map(l => `<button class="cfg-link" data-action="selEntry" data-arg="${l.uid}">${UI.esc(Builder.label(app, l))} ›</button>`).join(" ")}</p>`);
    const ledBy = e.attachedTo && Builder.entry(app, e.attachedTo);
    if (ledBy) rows.push(`<p class="cfg-led">Voir la carte : <button class="cfg-link" data-action="selEntry" data-arg="${ledBy.uid}">${UI.esc(Builder.label(app, ledBy))} ›</button></p>`);
    rows.push(Army.bonusBox(app, e));
    // Collection (builder seulement) : figurines possédées et peintes pour cette unité
    if (Collection.has(app.faction.id)) {
      const r = Collection.get(app.faction.id, u.id), need = Collection.needed(app)[u.id] || 0;
      rows.push(`<p class="cfg-coll ${r.owned < need ? "is-short" : ""}">Collection : ${r.owned} fig.${r.owned ? ` dont ${r.painted} peinte${r.painted > 1 ? "s" : ""}` : ""}
        · la liste en utilise ${need}${r.owned < need ? ` — il en manque ${need - r.owned}` : ""}</p>`);
    }
    if (u.transport) rows.push(Army.transportControl(app, e, "list"));
    const inT = e.embarkedIn && Army.isTop(app, e) && Builder.entry(app, e.embarkedIn);
    if (inT) rows.push(`<p class="cfg-led">Embarquée dans ${UI.esc(Builder.label(app, inT))}</p>`);
    rows.push(this.enhancementControl(app, u, e));
    const full = Builder.copies(app, u.id).length >= Builder.maxCopies(app, u);
    rows.push(`<div class="cfg-row cfg-end">
      <button class="btn btn-s" data-action="duplicateEntry" data-arg="${e.uid}" ${full ? "disabled" : ""}
        title="${full ? "Nombre maximum d'exemplaires atteint" : "Ajoute un exemplaire avec le même équipement"}">Dupliquer</button>
      <button class="btn btn-s btn-danger" data-action="removeEntry" data-arg="${e.uid}">Retirer de la liste</button></div>`);
    return `<div class="uc-config">${rows.join("")}</div>`;
  },

  // Optimisations proposées à cette unité, avec la raison si elles sont indisponibles
  enhChoices(app, u, e) {
    const r = Builder.rules(app);
    const usage = Builder.enhUsage(app);
    const slotsFull = Builder.enhSlotsUsed(app) >= r.maxOptimisations;
    return Builder.detEnhancements(app).filter(x => Builder.enhEligible(app, u, x.enh, e)).map(({ enh, det }) => {
      const mine = e.enhancement === enh.id;
      const usedElsewhere = (usage[enh.id] || 0) - (mine ? 1 : 0);
      const lim = enh.kind === "amelioration" ? r.maxUpgradeCopies : 1;
      let reason = "";
      if (!mine && usedElsewhere >= lim) reason = "Déjà prise dans l'armée";
      else if (!mine && !usage[enh.id] && slotsFull) reason = `Limite de ${r.maxOptimisations} optimisations atteinte`;
      return { enh, det, mine, reason };
    });
  },

  enhancementControl(app, u, e) {
    if (Builder.isEpic(u)) return `<p class="hint">Héros épique : pas d'optimisation.</p>`;
    const list = this.enhChoices(app, u, e);
    if (!list.length && !e.enhancement) return "";
    const label = Builder.isChar(u) ? "Optimisation" : "Amélioration";
    const cur = e.enhancement && Builder.enh(app, e.enhancement);
    return `<div class="cfg-row"><span class="cfg-l">${label}</span>
        <button class="enh-pick" data-action="openEnh" data-arg="${e.uid}">
          ${cur ? `<b>${UI.esc(cur.enh.name)}</b><span class="wcost">+${cur.enh.cost} pts</span>` : `<span class="muted">Aucune · ${list.length} disponible${list.length > 1 ? "s" : ""}</span>`}
          <span class="chev-r" aria-hidden="true">›</span></button></div>`;
  },


  // Optimisation / amélioration prise : encadrée avec les aptitudes, comme en partie
  enhBox(app, e) {
    const cur = e.enhancement && Builder.enh(app, e.enhancement);
    if (!cur) return "";
    const unitWide = Army.enhAffectsUnit(cur.enh) && Builder.isChar(Builder.unit(app, e.unitId));
    return `<div class="bonus-box enh-box"><span class="cfg-l">${cur.enh.kind === "amelioration" ? "Amélioration" : "Optimisation"}${unitWide ? " · profite à toute son unité" : ""}</span>
      <p><b>${UI.esc(cur.enh.name)}</b> : ${UI.fmt(cur.enh.text)}</p></div>`;
  },

  abilities(app, u, counts, e) {
    const out = [];
    if (u.coreAbilities && u.coreAbilities.length)
      out.push(`<div class="ab-chips"><span class="ab-h">Aptitudes de base</span>${u.coreAbilities.map(a => `<span class="chip">${Glossary.tag(a)}</span>`).join("")}</div>`);
    if (u.armyRules && u.armyRules.length)
      out.push(`<div class="ab-chips"><span class="ab-h">Règle d'armée</span>${u.armyRules.map(a => Builder.ruleActive(app, a)
        ? `<span class="chip">${Glossary.tag(a)}</span>`
        : `<span class="chip is-lost" title="Perdue avec ton détachement">${Glossary.tag(a)}</span>`).join("")}</div>`);
    const dets = app && app.faction && !app.isCodex ? Setup.selected(app).filter(d => d.rule) : [];
    if (dets.length)
      out.push(`<div class="ab-chips"><span class="ab-h">Détachement</span>${dets.map(d => `<span class="chip">${Glossary.tag(`det-${d.id}`)}</span>`).join("")}</div>`);
    (u.abilities || []).forEach(a => {
      const off = (a.requiresWargear && !counts[a.requiresWargear]) || a.inactive ? "off" : "";
      const usage = a.usage ? ` <span class="badge">${Labels.usage[a.usage]}</span>` : "";
      const ina = a.inactive ? ` <span class="badge badge-off">Inactive dans cette armée</span>` : "";
      out.push(`<p class="ab ${off}"><b>${UI.esc(a.name)}</b>${usage}${ina} : ${UI.fmt(a.text)}</p>`);
    });
    if (u.markChoice && u.markChoice.options.some(o => o.text)) {
      const cur = e && Builder.markOf(app, u, e);
      const o = cur && u.markChoice.options.find(x => x.mark === cur);
      out.push(o ? `<p class="ab ab-mark"><b>${UI.esc(u.markChoice.name)} : ${UI.esc(UI.mark(o.mark))}</b> : ${UI.fmt(o.text)}</p>`
        : `<div class="ab-choice"><b>${UI.esc(u.markChoice.name)}</b>, au choix :
          ${u.markChoice.options.map(x => `<p class="ab"><b>${UI.esc(UI.mark(x.mark))}</b> : ${UI.fmt(x.text)}</p>`).join("")}</div>`);
    }
    if (u.abilityChoices) {
      out.push(`<div class="ab-choice"><b>${UI.esc(u.abilityChoices.name)}</b>, au choix :
        ${u.abilityChoices.options.map(o => `<p class="ab"><b>${UI.esc(o.name)}</b> : ${UI.fmt(o.text)}</p>`).join("")}</div>`);
    }
    if (u.damaged) out.push(`<p class="ab ab-dmg"><b>Endommagé (${u.damaged.range} PV)</b> : ${UI.fmt(u.damaged.text)}</p>`);
    if (u.leader && u.leader.canLead) out.push(`<p class="ab"><b>Leader</b> : peut mener ${UI.esc(u.leader.canLead.join(", "))}.</p>`);
    if (u.transport) out.push(`<p class="ab"><b>Transport</b> : ${UI.fmt(u.transport.text)}</p>`);
    return `<div class="uc-abilities">${out.join("")}</div>`;
  }
};

/* ---------- Écran ---------- */

Screens.units = {
  body(app) {
    const st = app.state;
    const valid = st.sel && (st.sel.type === "unit" ? Builder.unit(app, st.sel.id) : Builder.entry(app, st.sel.id));
    if (!valid) {
      st.sel = st.units.length ? { type: "entry", id: st.units[0].uid } : { type: "unit", id: app.faction.units[0].id };
    }
    const issues = Builder.validate(app);
    let card;
    if (st.sel.type === "entry") {
      const e = Builder.entry(app, st.sel.id);
      card = BuilderUI.card(app, Builder.unit(app, e.unitId), e);
    } else {
      card = BuilderUI.card(app, Builder.unit(app, st.sel.id), null);
    }
    return `<section class="screen screen-build">
      <aside class="b-side" data-pane="catalog">
        <div class="side-tools">${UI.foldAll(app, "cat")}</div>
        ${BuilderUI.catalog(app, issues)}</aside>
      <article class="b-detail">${card}</article>
    </section>`;
  },
  actions() { return ""; },
  next() { return { label: "Valider la liste", action: "openOverlay", arg: "save" }; }
};

/* ---------- Panneaux par-dessus l'écran ---------- */

const Overlays = {
  wrap(inner, cls = "") {
    return `<div class="ov-back ${cls}" data-action="closeOverlay">
      <div class="ov-panel" data-action="noop" role="dialog">${inner}</div></div>`;
  },

  list(app) {
    const st = app.state;
    const line = (e, sub) => {
      const u = Builder.unit(app, e.unitId);
      const tags = [];
      if (u.sizes.length > 1 || e.size > 1) tags.push(`${e.size} fig.`);
      if (e.warlord) tags.push("Seigneur de guerre");
      const mk = Builder.markSource(app, u) && Builder.markOf(app, u, e);
      if (mk) tags.push(UI.mark(mk));
      const en = e.enhancement && Builder.enh(app, e.enhancement);
      if (en) tags.push(en.enh.name);
      const inT = !sub && e.embarkedIn && Builder.entry(app, e.embarkedIn);
      if (inT) tags.push(`dans ${Builder.label(app, inT)}`);
      const full = Builder.copies(app, u.id).length >= Builder.maxCopies(app, u);
      return `<div class="ol-row ${sub ? "ol-sub" : ""}">
        <button class="ol-main" data-action="selEntry" data-arg="${e.uid}" title="Modifier cette unité">
          <span class="ol-name">${sub ? "avec " : ""}${UI.esc(Builder.label(app, e))}</span>
          <span class="ol-tags">${UI.esc(tags.join(" · "))}</span>
          <span class="ol-cost">${Builder.entryCost(app, e)}</span></button>
        <button class="ol-act" data-action="duplicateEntry" data-arg="${e.uid}" ${full ? "disabled" : ""}
          aria-label="Dupliquer" title="Dupliquer">⧉</button>
        <button class="ol-act ol-del" data-action="removeEntry" data-arg="${e.uid}"
          aria-label="Supprimer" title="Supprimer">✕</button></div>`;
    };
    const order = UnitCategories.map(c => c.id);
    const tops = st.units.filter(e => !e.attachedTo || !Builder.entry(app, e.attachedTo))
      .sort((a, b) => order.indexOf(Builder.unit(app, a.unitId).category) - order.indexOf(Builder.unit(app, b.unitId).category));
    const rows = tops.map(e => line(e, false) + Builder.leadersOf(app, e).map(l => line(l, true)).join("")).join("");
    const dets = Setup.selected(app).map(d => UI.esc(d.name)).join(", ");
    const cc = Collection.listCheck(app);
    const coll = cc ? `<div class="ol-coll ${cc.missing.length ? "is-short" : ""}">
        <b>${cc.pct} % peinte</b> (${cc.painted}/${cc.total} figurines) ${Collection.ptsTag(cc.ptsPct, `${cc.ptsPainted} / ${cc.pts} pts peints`)}
        ${cc.missing.length ? `<br>Figurines manquantes : ${cc.missing.map(m => `${UI.esc(m.u.name)} (${m.owned}/${m.need})`).join(", ")}` : " · tu as toutes les figurines"}</div>` : "";
    return this.wrap(`
      <div class="ov-head"><h2>${UI.esc(st.listName || "Ma liste")}</h2>
        <button class="btn btn-s" data-action="exportList" data-arg="">Exporter / imprimer</button>
        <button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
      <p class="ol-sum"><b>${Builder.total(app)} / ${st.points} pts</b> ${st.disposition ? UI.dispoChip(st.disposition) : ""}<br><span class="muted">${dets}</span></p>${coll}
      ${rows || `<p class="hint">Ta liste est vide. Touche + à côté d'une unité pour l'ajouter.</p>`}`, "ov-side");
  },

  enh(app) {
    const e = Builder.entry(app, app.state.enhFor);
    if (!e) return "";
    const u = Builder.unit(app, e.unitId);
    const list = BuilderUI.enhChoices(app, u, e);
    const label = Builder.isChar(u) ? "optimisation" : "amélioration";
    const cards = list.map(({ enh, det, mine, reason }) => `
      <button class="enh-card ${mine ? "is-on" : ""}" data-action="pickEnh" data-arg="${enh.id}" ${reason ? "disabled" : ""}>
        <span class="card-head"><span class="card-name">${UI.esc(enh.name)}</span><span class="enh-cost">${enh.cost} pts</span></span>
        <span class="enh-meta">${UI.esc(det.name)}${enh.kind === "amelioration" ? " · Amélioration" : ""}${enh.usage ? " · " + Labels.usage[enh.usage] : ""}</span>
        ${reason ? `<span class="enh-why">${UI.esc(reason)}</span>` : ""}
        <span class="enh-text">${UI.fmt(enh.text)}</span>
      </button>`).join("");
    return this.wrap(`
      <div class="ov-head"><h2>Choisir une ${label}</h2>
        <button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
      <p class="ol-sum"><b>${UI.esc(Builder.label(app, e))}</b></p>
      <button class="enh-card enh-none ${!e.enhancement ? "is-on" : ""}" data-action="pickEnh" data-arg="">
        <span class="card-name">Aucune ${label}</span></button>
      <div class="enh-list">${cards}</div>`, "ov-wide");
  },

  issues(app) {
    const issues = Builder.validate(app);
    const rows = issues.map(i => i.uid
      ? `<button class="is-row" data-action="selEntry" data-arg="${i.uid}">${UI.esc(i.msg)}</button>`
      : `<div class="is-row">${UI.esc(i.msg)}</div>`).join("");
    return this.wrap(`
      <div class="ov-head"><h2>${issues.length ? "À corriger" : "Liste valide"}</h2>
        <button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
      ${rows || `<p class="ok">Tout est en ordre, ta liste respecte les règles de construction.</p>`}`);
  },

  save(app) {
    const st = app.state;
    const issues = Builder.validate(app);
    const name = st.listName || `${app.faction.name} ${st.points}`;
    return this.wrap(`
      <div class="ov-head"><h2>Valider la liste</h2></div>
      <label class="field"><span class="field-label">Nom de la liste</span>
        <input type="text" id="save-name" class="big-input" maxlength="60" value="${UI.esc(name)}"></label>
      <p class="ol-sum"><b>${Builder.total(app)} / ${st.points} pts</b> ${st.disposition ? UI.dispoChip(st.disposition) : ""} <span class="muted">${st.units.length} unité(s)</span></p>
      ${issues.length ? `<p class="warn">Ta liste a encore ${issues.length} problème(s). Tu peux l'enregistrer quand même et la corriger plus tard.</p>` : `<p class="ok">Ta liste est valide.</p>`}
      <div class="ov-btns"><button class="btn" data-action="closeOverlay">Annuler</button>
        <button class="btn btn-primary" data-action="saveList">Enregistrer</button></div>`);
  },

  saved(app) {
    return this.wrap(`
      <div class="ov-head"><h2>Liste enregistrée</h2></div>
      <p>« ${UI.esc(app.state.listName)} » est enregistrée dans tes listes.</p>
      <div class="ov-btns">
        <button class="btn" data-action="closeOverlay">Continuer à modifier</button>
        <button class="btn" data-action="exportList" data-arg="">Exporter / imprimer</button>
        <button class="btn" data-action="goHome">Retour à l'accueil</button>
        <button class="btn btn-primary" data-action="pickListForGame">Lancer une partie</button></div>`);
  }
};

/* ---------- Actions ---------- */

const BuilderActions = {
  noop() {},

  openOverlay(id) { this.state.overlay = id; this.render(); },
  closeOverlay() { this.state.overlay = null; this.render(); },

  selUnit(id) {
    this.state.sel = { type: "unit", id };
    this.render();
  },

  selEntry(uid) {
    this.state.sel = { type: "entry", id: uid };
    this.state.overlay = null;
    this.render();
  },

  addUnit(id) {
    const u = Builder.unit(this, id);
    if (Builder.copies(this, id).length >= Builder.maxCopies(this, u)) return;
    const why = Builder.disallowed(this, u);
    if (why && !u._faction) { this.toast(`${u.name} : ${why}.`); return; }
    const e = { uid: Store.newId("u"), unitId: id, size: u.sizes[0].models, options: {},
                enhancement: null, warlord: false, attachedTo: null };
    if (u.mustBeWarlord) { this.state.units.forEach(x => { x.warlord = false; }); e.warlord = true; }
    this.state.units.push(e);
    this.state.sel = { type: "entry", id: e.uid };
    this.state.dirty = true;
    this.render();
  },

  removeEntry(uid) {
    const st = this.state;
    const e = Builder.entry(this, uid);
    if (!e) return;
    const snapshot = JSON.parse(JSON.stringify(st.units));
    const label = Builder.label(this, e);
    st.units = st.units.filter(x => x.uid !== uid);
    Army.forget(this, uid);
    if (st.sel && st.sel.id === uid) st.sel = { type: "unit", id: e.unitId };
    st.dirty = true;
    this.render();
    this.toast(`${label} retiré de la liste.`, () => {
      st.units = snapshot;
      st.dirty = true;
      this.render();
    });
  },

  // Nouvel exemplaire avec le même effectif et le même équipement
  duplicateEntry(uid) {
    const st = this.state;
    const e = Builder.entry(this, uid);
    if (!e) return;
    const u = Builder.unit(this, e.unitId);
    if (Builder.copies(this, e.unitId).length >= Builder.maxCopies(this, u)) {
      this.toast(`Nombre maximum de ${u.name} atteint.`);
      return;
    }
    const copy = { ...JSON.parse(JSON.stringify(e)), uid: Store.newId("u"), warlord: false, attachedTo: null, embarkedIn: null, enhancement: null };
    // Une amélioration se recopie si la limite le permet ; une optimisation est unique
    const en = e.enhancement && Builder.enh(this, e.enhancement);
    if (en && en.enh.kind === "amelioration" &&
        (Builder.enhUsage(this)[e.enhancement] || 0) < Builder.rules(this).maxUpgradeCopies) {
      copy.enhancement = e.enhancement;
    }
    st.units.splice(st.units.indexOf(e) + 1, 0, copy);
    if (!st.overlay) st.sel = { type: "entry", id: copy.uid };
    st.dirty = true;
    this.render();
    this.toast(`${u.name} dupliqué.`);
  },

  setSize(arg) {
    const [uid, n] = arg.split("|");
    Builder.entry(this, uid).size = Number(n);
    this.state.dirty = true;
    this.render();
  },

  // Applique un changement d'options, et l'annule s'il crée une incohérence
  _applyOpt(e, optId, counts) {
    const u = Builder.unit(this, e.unitId);
    const before = Builder.loadout(this, u, e).problems.length;
    const prev = e.options[optId];
    e.options = { ...e.options, [optId]: counts };
    if (Builder.loadout(this, u, e).problems.length > before) {
      e.options = { ...e.options, [optId]: prev };
      this.toast("Cette combinaison d'équipement n'est pas autorisée.");
      return;
    }
    this.state.dirty = true;
    this.render();
  },

  setOpt(arg) {
    const [uid, optId, i] = arg.split("|");
    const e = Builder.entry(this, uid);
    const opt = Builder.unit(this, e.unitId).options.find(o => o.id === optId);
    const counts = opt.choices.map(() => 0);
    if (Number(i) >= 0) counts[Number(i)] = 1;
    BuilderActions._applyOpt.call(this, e, optId, counts);
  },

  stepOpt(arg) {
    const [uid, optId, i, d] = arg.split("|");
    const e = Builder.entry(this, uid);
    const u = Builder.unit(this, e.unitId);
    const opt = u.options.find(o => o.id === optId);
    const counts = Builder.optCounts(e, opt);
    counts[Number(i)] = Math.max(0, counts[Number(i)] + Number(d));
    if (counts.reduce((a, b) => a + b, 0) > Builder.optLimit(u, opt, Builder.size(u, e).models, e)) return;
    if (opt.noDuplicates && counts[Number(i)] > 1) return;
    BuilderActions._applyOpt.call(this, e, optId, counts);
  },

  setMark(arg) {
    const i = arg.indexOf("|");
    const e = Builder.entry(this, arg.slice(0, i));
    if (!e) return;
    e.mark = arg.slice(i + 1);
    this.state.dirty = true;
    this.render();
  },

  toggleWarlord(uid) {
    const e = Builder.entry(this, uid);
    if (Builder.unit(this, e.unitId).mustBeWarlord) return;
    const on = !e.warlord;
    this.state.units.forEach(x => { x.warlord = false; });
    e.warlord = on;
    this.state.dirty = true;
    this.render();
  },

  setAttach(value, el) {
    Builder.entry(this, el.dataset.uid).attachedTo = value || null;
    this.state.dirty = true;
    this.render();
  },

  openEnh(uid) {
    this.state.enhFor = uid;
    this.state.overlay = "enh";
    this.render();
  },

  pickEnh(id) {
    const e = Builder.entry(this, this.state.enhFor);
    if (e) e.enhancement = id || null;
    this.state.overlay = null;
    this.state.dirty = true;
    this.render();
  },

  setEnh(value, el) {
    Builder.entry(this, el.dataset.uid).enhancement = value || null;
    this.state.dirty = true;
    this.render();
  },

  saveList() {
    const st = this.state;
    const input = document.getElementById("save-name");
    const name = (input && input.value.trim()) || `${this.faction.name} ${st.points}`;
    st.listId = Store.upsertList({
      id: st.listId || undefined,
      name, factionId: st.factionId, points: st.points, spent: Builder.total(this),
      detachments: [...st.detachments], detachmentNames: Setup.selected(this).map(d => d.name),
      dispositions: Setup.availableDispositions(this), disposition: st.disposition,
      units: JSON.parse(JSON.stringify(st.units))
    });
    st.listName = name;
    st.dirty = false;
    st.overlay = "saved";
    if (!Store.available) this.toast("Sauvegarde automatique indisponible : exporte tes données pour ne pas perdre ta liste.");
    this.render();
  }
};
