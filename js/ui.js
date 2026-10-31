/* =========================================================
   UI — fonctions d'affichage réutilisables
   ========================================================= */

const UI = {

  esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },

  // Texte de règle : échappe, met en valeur les [APTITUDES]
  // et rend cliquables les mots-clés du glossaire
  fmt(str) {
    return Glossary.markup(str);
  },

  cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; },

  kw(word) {
    return Labels.keyword[word] || word;
  },

  mark(m) { return (Labels.mark && Labels.mark[m]) || m; },

  /* ---------- Barre du haut ---------- */

  topbar(app) {
    if (app.state.screen === "game") return Companion.topbar(app);
    const brand = `<button class="brand" data-action="goHome" title="Accueil">Builder 40K</button>`;
    if (!STEPS.some(s => s.id === app.state.screen)) {
      const titles = { home: "Accueil", lists: app.state.listsMode === "pick" ? "Lancer une partie" : app.state.listsMode === "archive" ? "Archives" : "Mes listes",
                       launch: "Lancer une partie", game: "Partie", history: "Historique", collection: "Ma collection", games: "Mes parties", codex: "Consulter" };
      const v = Screens[app.state.screen];
      const n = v.next ? v.next(app) : null;
      const bk = v.back ? v.back(app) : null;
      const nb = (bk ? `<button class="btn tb-back" data-action="${bk.action}">${bk.label}</button>` : "") +
        (n ? `<button class="btn btn-primary tb-next" data-action="${n.action}" data-arg="${n.arg || ""}"
          ${n.disabled ? "disabled" : ""} title="${UI.esc(n.hint || "")}">${n.label}</button>` : "");
      const codex = app.state.screen === "home" ? `<button class="btn tb-codex" data-action="openCodex">Consulter unités, détachements, missions</button>`
        : app.state.screen === "launch" ? `<button class="btn tb-codex" data-action="openLaunchInfo" data-arg="army">Ma liste : armée, règles, stratagèmes</button>` : "";
      return `${brand}<span class="tb-title">${titles[app.state.screen] || ""}</span><div class="tb-info">${codex}${nb}${ScreenCtl.button()}</div>`;
    }
    const steps = STEPS.map((s, i) => {
      const current = app.state.screen === s.id;
      const reachable = UI.stepReachable(app, s.id);
      const attrs = current ? 'aria-current="step"'
        : reachable ? `data-action="goStep" data-arg="${s.id}"`
        : "disabled";
      return `<button class="step ${current ? "is-current" : ""}" ${attrs}>
                <span class="step-num">${i + 1}</span>${s.label}
              </button>`;
    }).join('<span class="step-sep" aria-hidden="true"></span>');

    let info = "";
    if (app.faction) {
      info += `<span class="tb-faction">${UI.esc(app.faction.name)}</span>`;
      if (app.maxStep >= 1) info += `<span class="tb-points">${app.state.points} pts</span>`;
    }
    if (app.state.listName) info = `<span class="tb-list">${UI.esc(app.state.listName)}</span>` + info;
    if (app.state.screen === "units") info = BuilderUI.status(app);
    const view = Screens[app.state.screen];
    const n = view.next ? view.next(app) : null;
    const next = n ? `<button class="btn btn-primary tb-next" data-action="${n.action}" data-arg="${n.arg || ""}"
        ${n.disabled ? "disabled" : ""} title="${UI.esc(n.hint || "")}">${n.label}</button>` : "";
    return `${brand}
            <nav class="steps">${steps}</nav>
            <div class="tb-info">${info}${next}${ScreenCtl.button()}</div>`;
  },

  // Une étape est accessible dès que les précédentes sont remplies
  stepReachable(app, id) {
    if (id === "faction") return true;
    if (!app.faction) return false;
    if (id === "units") return Setup.isReady(app);
    return true;
  },

  /* ---------- Sections repliables ----------
     key = "groupe:identifiant" ; tout est déplié à chaque arrivée sur un écran */

  isCollapsed(app, key) { return !!app.state.collapsed[key]; },

  section(app, key, titleHtml, bodyHtml, opts = {}) {
    const closed = UI.isCollapsed(app, key);
    const tag = opts.tag || "h2";
    return `<section class="fold ${opts.cls || ""} ${closed ? "is-closed" : ""}" data-sec="${key}"${opts.style ? ` style="--fc:${opts.style}"` : ""}>
      <${tag} class="fold-h"><button class="fold-btn" data-action="toggleSection" data-arg="${key}"
          aria-expanded="${!closed}"><span class="chev" aria-hidden="true"></span>${titleHtml}
          ${opts.aside ? `<span class="fold-aside">${opts.aside}</span>` : ""}</button></${tag}>
      ${closed ? "" : `<div class="fold-b">${bodyHtml}</div>`}
    </section>`;
  },

  // Bouton « Tout replier / Tout déplier » d'un groupe de sections
  foldAll(app, group) {
    const anyClosed = Object.keys(app.state.collapsed).some(k => k.startsWith(group + ":"));
    return `<button class="fold-all" data-action="${anyClosed ? "expandAll" : "collapseAll"}" data-arg="${group}">
      ${anyClosed ? "Tout déplier" : "Tout replier"}</button>`;
  },

  /* ---------- Petits éléments ---------- */

  pips(used, max) {
    let out = "";
    for (let i = 0; i < max; i++) out += `<span class="pip ${i < used ? "is-full" : ""}"></span>`;
    return `<span class="pips" aria-hidden="true">${out}</span>`;
  },

  dot(id) {
    const d = Dispositions[id];
    return d ? `<span class="dot" style="--dispo:${d.color}" title="${UI.esc(d.name)}"></span>` : "";
  },

  dispoChip(id) {
    const d = Dispositions[id];
    return d ? `<span class="dispo" style="--dispo:${d.color}">${UI.esc(d.name)}</span>` : "";
  },

  /* ---------- Fiche de détachement ---------- */

  detachmentDetail(d, faction, app) {
    const plural = d.cost > 1 ? "s" : "";
    const head = `
      <header class="dd-head">
        <div class="dd-top"><h1 class="dd-title">${UI.esc(d.name)}</h1>${UI.foldAll(app, "det")}</div>
        <div class="dd-meta">
          <span class="dd-cost">${d.cost} point${plural} de détachement</span>
          ${d.dispositions.map(UI.dispoChip).join("")}
        </div>
      </header>`;

    const rule = UI.section(app, "det:rule", "Règle du détachement", `
        ${d.rule.name ? `<h3 class="rule-name">${UI.esc(d.rule.name)}</h3>` : ""}
        <div class="rule-text">${d.rule.text.map(t => `<p>${UI.fmt(t)}</p>`).join("")}</div>
        ${UI.tracker(d.tracker)}`, { cls: "dd-section" });

    const enh = UI.section(app, "det:enh", "Optimisations",
      `<div class="card-grid enh-grid">${d.enhancements.map(e => UI.enhancement(e, faction)).join("")}</div>`,
      { cls: "dd-section", aside: `<span class="pill">${d.enhancements.length}</span>` });

    const strat = UI.section(app, "det:strat", "Stratagèmes",
      `<div class="card-grid strat-grid">${d.stratagems.map(UI.stratagem).join("")}</div>`,
      { cls: "dd-section", aside: `<span class="pill">${d.stratagems.length}</span>` });

    return head + UI.composition(d, app, faction) + rule + enh + strat;
  },

  composition(d, app, faction) {
    const items = [];
    (d.unlocks || []).forEach(k => items.push(`Donne accès aux unités ${UI.esc(k)}.`));
    if (d.exclusiveGroup) {
      const others = ((faction && faction.detachments) || []).filter(x => x.id !== d.id && x.exclusiveGroup === d.exclusiveGroup);
      items.push(`Unique : ${UI.esc(UI.cap(d.exclusiveGroup))}. Ne peut pas être pris avec ${others.length ? others.map(x => `<b>${UI.esc(x.name)}</b>`).join(", ") : "un autre détachement de ce type"}.`);
    }
    if (d.removesArmyRules && d.removesArmyRules.length) {
      const names = d.removesArmyRules.map(id => { const r = ((faction && faction.armyRules) || []).find(x => x.id === id); return r ? r.name : id; });
      const banned = ((faction && faction.units) || []).filter(u => d.removesArmyRules.includes(u.requiresArmyRule)).map(u => u.name);
      items.push(`Retire les règles d'armée : ${UI.esc(names.join(", "))}.${banned.length ? ` Unités interdites : ${UI.esc(banned.join(", "))}.` : ""}`);
    }
    (d.weaponAbilities || []).forEach(wa => items.push(`Les armes ${wa.type === "melee" ? "de mêlée" : wa.type === "ranged" ? "de tir" : ""} des unités ${UI.esc(faction ? faction.keyword.toUpperCase() : "")} gagnent ${Glossary.tag(wa.ability)} (ajouté sur les fiches).`));
    (d.grantsKeywords || []).forEach(g => items.push(`Mots-clés ${UI.esc(g.keywords.map(k => k.toUpperCase()).join(", "))} ajoutés aux unités ${UI.esc(g.to.map(alt => alt.join(" ").toUpperCase()).join(" ou "))}.`));
    if (d.markChoice) items.push(`Chaque unité concernée choisit sa marque sur sa fiche (${UI.esc(d.markChoice.options.map(UI.mark).join(", "))}).`);
    (d.constraints || []).forEach(c => {
      if (c.type === "maxPointsPercent")
        items.push(`Unités ${UI.esc(c.keyword)} : ${c.percent} % des points de l'armée au maximum.`);
      if (c.type === "noWarlord")
        items.push(`Une unité ${UI.esc(c.keyword)} ne peut pas être ton Seigneur de Guerre.`);
    });
    if (!items.length) return "";
    return UI.section(app, "det:compo", "Composition d'armée",
      `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`, { cls: "dd-compo" });
  },

  tracker(t) {
    if (!t) return "";
    let inner = "";
    if (t.type === "designation") {
      inner = `<p>${UI.fmt(t.rappel)}</p><p><strong>Bonus :</strong> ${UI.fmt(t.bonus)}</p>`;
    } else if (t.type === "cible") {
      inner = `<p>${UI.fmt(t.debutRound)}</p><p><strong>Bonus :</strong> ${UI.fmt(t.bonus)}</p>
        <p class="muted">Dans le compagnon : la cible se note dans le cadre « ${UI.esc(t.label)} ».</p>`;
    } else if (t.type === "choix") {
      inner = `<p>${UI.fmt(t.moment)}</p>
        <ol class="paliers">${t.options.map(o => `<li><span class="palier-min">${o.n}</span><span>${UI.fmt(o.short)}</span></li>`).join("")}</ol>
        ${t.concerne ? `<p class="muted">${UI.fmt(t.concerne)}</p>` : ""}`;
    } else {
      if (t.debutRound) inner += `<p><strong>Début du round :</strong> ${UI.fmt(t.debutRound)}</p>`;
      if (t.finRound)   inner += `<p><strong>Fin du round :</strong> ${UI.fmt(t.finRound)}</p>`;
      if (t.paliers) {
        inner += `<ol class="paliers">${t.paliers.map(p =>
          `<li><span class="palier-min">${p.min}+</span><span>${UI.fmt(p.text)}</span></li>`).join("")}</ol>`;
      }
    }
    return `<div class="tracker"><h3>Suivi en partie : ${UI.esc(t.label)}</h3>${inner}</div>`;
  },

  requirement(e, faction) {
    const parts = [];
    const req = e.requires || [];
    const onlyFaction = req.length === 1 && req[0].length === 1 && req[0][0] === faction.keyword;
    if (req.length && !onlyFaction) {
      parts.push(req.map(alt => alt.map(UI.kw).join(" ")).join(" ou "));
    }
    if (e.excludes && e.excludes.length) parts.push(`hors ${e.excludes.map(UI.kw).join(", ")}`);
    if (e.requiresAttachedTo && e.requiresAttachedTo.length)
      parts.push(`rattaché à des ${e.requiresAttachedTo.join(" ou ")}`);
    if (e.requiresCore && e.requiresCore.length)
      parts.push(`avec ${e.requiresCore.map(c => { const g = Glossary.entries[Glossary.parse(c).id]; return g ? Glossary.name(g, "fr", Glossary.parse(c).value) : c; }).join(", ")}`);
    return parts.length ? `Réservé à : ${UI.esc(parts.join(", "))}` : "";
  },

  enhancement(e, faction) {
    const badges = [];
    if (e.kind === "amelioration") badges.push('<span class="badge badge-upgrade">Amélioration</span>');
    if (e.usage) badges.push(`<span class="badge">${Labels.usage[e.usage] || e.usage}</span>`);
    const req = UI.requirement(e, faction);
    return `
      <div class="card enh">
        <div class="card-head">
          <span class="card-name">${UI.esc(e.name)}</span>
          <span class="enh-cost">${e.cost} pts</span>
        </div>
        ${badges.length ? `<div class="badges">${badges.join("")}</div>` : ""}
        ${req ? `<p class="enh-req">${req}</p>` : ""}
        <p class="enh-text">${UI.fmt(e.text)}</p>
      </div>`;
  },

  stratagem(s) {
    const moments = s.moments.map(m =>
      `<span class="moment">${Labels.phase[m.phase] || m.phase}<small>${Labels.tour[m.tour] || ""}</small></span>`
    ).join("");
    const badges = [s.type, s.limite && Labels.usage[s.limite]]
      .filter(Boolean).map(b => `<span class="badge">${UI.esc(b)}</span>`).join("");
    return `
      <div class="card strat">
        <div class="card-head">
          <span class="card-name">${UI.esc(s.name)}</span>
          <span class="strat-cp">${s.cp} PC</span>
        </div>
        <div class="moments">${moments}${badges}</div>
        <dl class="strat-body">
          <dt>Quand</dt><dd>${UI.fmt(s.quand)}</dd>
          <dt>Cible</dt><dd>${UI.fmt(s.cible)}</dd>
          <dt>Effet</dt><dd>${UI.fmt(s.effet).replace(/\n/g, "<br>")}</dd>
          ${s.restrictions ? `<dt>Restrictions</dt><dd>${UI.fmt(s.restrictions)}</dd>` : ""}
        </dl>
      </div>`;
  }
};
