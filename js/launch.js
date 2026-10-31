/* =========================================================
   LANCEMENT DE PARTIE
   Ma mission à gauche, les informations au centre,
   la mission adverse à droite.
   ========================================================= */

const MissionCard = {

  ordinal: { 1: "premier", 2: "deuxième", 3: "troisième", 4: "quatrième", 5: "cinquième" },

  // Libellé d'un bloc de décompte, comme sur la carte
  roundLabel(r) {
    const o = this.ordinal;
    if (r === "tous") return "N'importe quel round de bataille";
    if (r === "fin") return "Fin de la bataille";
    let m = r.match(/^(\d)\+$/);
    if (m) return `À partir du ${o[m[1]]} round de bataille`;
    m = r.match(/^(\d)-(\d)$/);
    if (m) {
      const [a, b] = [Number(m[1]), Number(m[2])];
      if (b === a + 1) return `${UI.cap(o[a])} et ${o[b]} rounds de bataille`;
      return `Du ${o[a]} au ${o[b]} round de bataille`;
    }
    return `${UI.cap(o[r] || r)} round de bataille`;
  },

  // data : copie de la mission enregistrée avec une partie (sinon, saison en cours)
  render(name, opts = {}) {
    const m = opts.data || Missions[name];
    const dispo = m && Dispositions[m.disposition];
    if (!m) {
      return `<div class="mcard mcard-empty"><p class="hint">${UI.esc(opts.empty || "Mission inconnue.")}</p></div>`;
    }
    const opp = Dispositions[m.opponent];
    const extra = [];
    if (m.setup) extra.push(`<div class="mc-note"><b>Au début de la bataille :</b> ${UI.fmt(m.setup)}</div>`);
    if (m.startTurn) extra.push(`<div class="mc-note"><b>Au début de votre tour :</b> ${UI.fmt(m.startTurn)}</div>`);
    if (m.rule) extra.push(`<div class="mc-note">${UI.fmt(m.rule)}</div>`);

    const blocks = m.scoring.map(b => `
      <div class="mc-block">
        <div class="mc-round">${this.roundLabel(b.round)}</div>
        <div class="mc-when"><b>Quand :</b> ${UI.esc(b.quand.replace(/^À/, "à").replace(/^à/, "À"))}</div>
        ${b.lines.map(l => `
          <div class="mc-line ${l.bonus ? "is-bonus" : ""} ${l.or ? "is-or" : ""}">
            ${l.bonus ? '<span class="mc-tag">+</span>' : l.or ? '<span class="mc-tag">ou</span>' : ""}
            <span class="mc-text">${UI.fmt(l.text)}</span>
            <span class="mc-pts">${l.bonus ? "+" : ""}${l.pts} PdV${l.bonus ? "<small>cumulatif</small>" : ""}</span>
          </div>`).join("")}
      </div>`).join("");

    const a = m.action;
    const action = a ? `
      <div class="mc-action">
        <div class="mc-action-h">Action d'objectif : ${UI.esc(a.name)}</div>
        <dl>
          <dt>S'entreprend</dt><dd>${UI.fmt(a.start)}</dd>
          <dt>Unités</dt><dd>${UI.fmt(a.units)}</dd>
          <dt>Limite</dt><dd>${UI.fmt(a.limit)}</dd>
          <dt>S'accomplit</dt><dd>${UI.fmt(a.complete)}</dd>
          <dt>Effet</dt><dd>${UI.fmt(a.effect)}</dd>
          ${a.restrictions ? `<dt>Restrictions</dt><dd>${UI.fmt(a.restrictions)}</dd>` : ""}
        </dl>
      </div>` : "";

    return `<div class="mcard" style="--dispo:${dispo.color}">
      <header class="mc-head">
        <span class="mc-who">${UI.esc(opts.who || "")}</span>
        <h2>${UI.esc(name)}</h2>
        <div class="mc-sub">${UI.dispoChip(m.disposition)}<span class="muted">contre</span>${UI.dispoChip(m.opponent)}</div>
      </header>
      <div class="mc-body">${extra.join("")}${blocks}${action}</div>
    </div>`;
  },

  // Réduit le texte des cartes pour qu'elles tiennent dans leur colonne
  fit() {
    document.querySelectorAll(".mcard").forEach(card => {
      const box = card.parentElement;
      let fs = 16;
      card.style.setProperty("--fs", `${fs}px`);
      while (box.scrollHeight > box.clientHeight + 1 && fs > 12.5) {
        fs -= 0.5;
        card.style.setProperty("--fs", `${fs}px`);
      }
    });
  }
};

/* ---------- Écran ---------- */

const Launch = {
  list(app) { return Store.getList(app.state.launch.listId); },

  // Suggestions tirées des parties précédentes
  suggestions(field) {
    return [...new Set(Store.data.games.map(g => g[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  },

  myMission(app) {
    const L = app.state.launch;
    return L.myDisposition && L.oppDisposition ? Scenarios.get(L.myDisposition, L.oppDisposition) : null;
  },

  oppMission(app) {
    const L = app.state.launch;
    return L.myDisposition && L.oppDisposition ? Scenarios.get(L.oppDisposition, L.myDisposition) : null;
  }
};

Screens.launch = {
  body(app) {
    const L = app.state.launch;
    const l = Launch.list(app);
    if (!l) return `<section class="screen"><p class="hint">Cette liste n'existe plus.</p></section>`;
    const f = Home.factionOf(l.factionId);

    const known = AllFactions.map(x => x.name);
    const isOther = L.oppFaction && !known.includes(L.oppFaction);
    const armyOpts = known.map(n => `<option ${n === L.oppFaction ? "selected" : ""}>${UI.esc(n)}</option>`).join("");
    const roleBtns = [["attaquant", "Attaquant"], ["defenseur", "Défenseur"]].map(([id, label]) =>
      `<button class="role-btn ${L.role === id ? "is-on" : ""}" data-action="setRole" data-arg="${id}" aria-pressed="${L.role === id}">${label}</button>`).join("");
    const deploy = L.myDisposition && L.oppDisposition ? `
        <div class="field"><span class="field-label">Mise en place de la table</span>
          <div class="seg-big dp-row">${Deployments.configs().map((c, i) => { const n = i + 1; return `<button class="role-btn ${L.deployment === n ? "is-on" : ""}"
            data-action="openDeploy" data-arg="${n}">${UI.esc(Deployments.name(L.myDisposition, L.oppDisposition, n))}${L.deployment === n ? " ✓" : ""}</button>`; }).join("")}
            <button class="role-btn dp-dice" data-action="drawDeploy" title="Tirer une configuration au hasard">🎲 Au hasard</button></div></div>` : "";
    const dispoBtns = DispositionOrder.map(id => {
      const d = Dispositions[id];
      const on = L.oppDisposition === id;
      return `<button class="dispo-btn ${on ? "is-selected" : ""}" style="--dispo:${d.color}"
        data-action="setOppDispo" data-arg="${id}" aria-pressed="${on}">${UI.esc(d.name)}</button>`;
    }).join("");

    const mine = Launch.myMission(app), theirs = Launch.oppMission(app);

    return `<section class="screen screen-launch">
      <div class="lc-col lc-mission">${MissionCard.render(mine, {
        who: "Ta mission", empty: "Ta mission s'affichera dès que tu auras choisi la disposition de ton adversaire." })}</div>

      <div class="lc-col lc-form">
        <div class="lc-list" style="--fc:${f ? f.color : "#7d7286"}">
          <span class="lr-name">${UI.esc(l.name)}</span>
          <span class="lr-meta">${Home.factionChip(l.factionId)}<span class="lr-pts">${l.points} pts</span></span>
          <button class="btn btn-s" data-action="startGame">Changer</button>
          <div class="lc-prep">
            <span class="lc-prep-txt">${L.myDisposition ? UI.dispoChip(L.myDisposition) : `<span class="warn-txt">Disposition à choisir</span>`}
              <span class="muted">${UI.esc(Army.summary(L.units || l.units || []).join(" · "))}${L.units ? " · modifié pour cette partie" : ""}</span></span>
            <button class="btn btn-s" data-action="openPrep">Modifier</button>
          </div>
        </div>

        <div class="lc-pair">
          <label class="field"><span class="field-label">Date</span>
            <input type="date" class="big-input" value="${UI.esc(L.date)}" data-input="setLaunch" data-field="date"></label>
          <label class="field"><span class="field-label lc-lab">Adversaire
            ${L.oppName || L.oppFaction || L.oppDisposition || L.role || L.deployment || L.otherArmy
              ? `<button type="button" class="lc-reset" data-action="resetOpp" title="Effacer le nom, l'armée, la disposition adverse, la mise en place et ton rôle">Tout effacer</button>` : ""}</span>
            <input type="text" class="big-input" list="opp-names" maxlength="40" placeholder="Marc"
                   value="${UI.esc(L.oppName)}" data-input="setLaunch" data-field="oppName"></label>
        </div>
        <datalist id="opp-names">${Launch.suggestions("oppName").map(n => `<option value="${UI.esc(n)}">`).join("")}</datalist>

        <label class="field"><span class="field-label">Son armée</span>
          <select class="big-select" data-change="setOppArmy">
            <option value="" ${!L.oppFaction ? "selected" : ""}>Choisir une armée</option>
            ${armyOpts}
            <option value="__autre" ${isOther || L.otherArmy ? "selected" : ""}>Autre…</option>
          </select></label>
        ${isOther || L.otherArmy ? `<input type="text" class="big-input" maxlength="40" placeholder="Nom de l'armée"
            value="${isOther ? UI.esc(L.oppFaction) : ""}" data-input="setLaunch" data-field="oppFaction">` : ""}

        <div class="field"><span class="field-label">Sa disposition</span>
          <div class="dispo-options lc-dispos">${dispoBtns}</div></div>

        ${deploy}

        <div class="field"><span class="field-label">Ton rôle</span>
          <div class="seg-big">${roleBtns}</div></div>
      </div>

      <div class="lc-col lc-mission">${MissionCard.render(theirs, {
        who: "Mission adverse", empty: "La mission de ton adversaire s'affichera ici." })}</div>
    </section>`;
  },
  actions() { return ""; },
  next(app) {
    const L = app.state.launch;
    let hint = "";
    if (!L.myDisposition) hint = "Choisis ta disposition.";
    else if (!L.oppDisposition) hint = "Choisis la disposition de ton adversaire.";
    else if (!L.role) hint = "Indique si tu es attaquant ou défenseur.";
    return { label: "Commencer la partie", action: "startMatch", disabled: !!hint, hint };
  },
  back() { return { label: "Annuler", action: "cancelLaunch" }; }
};

/* ---------- Actions ---------- */

const LaunchActions = {

  // Depuis « Mes listes » (arg = id de liste) ou depuis le builder (liste en cours)
  pickListForGame(id) {
    const listId = id || this.state.listId;
    if (!Store.getList(listId)) { this.toast("Enregistre d'abord ta liste."); return; }
    if (!id && this.state.dirty && !confirm("Ta liste a des modifications non enregistrées. Lancer quand même la partie avec la version enregistrée ?")) return;
    const prev = this.state.launch || {};
    // Écran où revenir en cas d'annulation
    this.state.launchFrom = this.state.screen === "lists" ? "lists" : this.state.screen === "units" ? "units" : "home";
    this.state.launch = {
      listId,
      date: new Date().toISOString().slice(0, 10),
      oppName: prev.oppName || "",
      oppFaction: prev.oppFaction || "",
      oppDisposition: prev.oppDisposition || null,
      myDisposition: null,
      units: null,        // rattachements/transports modifiés pour cette partie (null = ceux de la liste)
      deployment: null,
      role: prev.role || null,
      otherArmy: false
    };
    // Configuration de base de la liste : sa disposition par défaut
    const lst = Store.getList(listId), dl = Home.dispos(lst);
    this.state.launch.myDisposition = dl.includes(lst.disposition) ? lst.disposition : (dl[0] || null);
    this.state.overlay = null;
    this.state.screen = "launch";
    this.render({ resetScroll: true });
  },

  setLaunch(value, el) {
    this.state.launch[el.dataset.field] = value;
  },

  // Les infos de la partie précédente sont reprises par défaut : ce bouton les efface
  resetOpp() {
    Object.assign(this.state.launch, { oppName: "", oppFaction: "", oppDisposition: null, deployment: null, role: null, otherArmy: false });
    this.render();
    this.toast("Infos de l'adversaire effacées.");
  },

  setOppArmy(value) {
    const L = this.state.launch;
    L.otherArmy = value === "__autre";
    L.oppFaction = L.otherArmy ? "" : value;
    this.render();
  },

  setRole(id) {
    this.state.launch.role = id;
    this.render();
  },

  cancelLaunch() {
    const to = this.state.launchFrom || "home";
    this.state.screen = to;
    if (to === "lists") this.state.listsMode = "pick";
    this.render({ resetScroll: true });
  },

  cancelGame(id) {
    const g = Store.data.games.find(x => x.id === id);
    if (!g || !confirm("Annuler cette partie ? Elle sera retirée de ton historique.")) return;
    Store.data.games = Store.data.games.filter(x => x.id !== id);
    Store.save();
    // Le menu « Partie » était ouvert : on le ferme avec la partie
    this.state.overlay = null;
    this.state.match = null;
    this.state.gameId = null;
    this.state.screen = "home";
    this.render({ resetScroll: true });
    this.toast("Partie annulée.");
  },

  setMyDispo(id) {
    this.state.launch.myDisposition = id;
    this.state.launch.deployment = null;
    this.render();
  },

  openDeploy(n) {
    this.state.deployView = Number(n);
    this.state.overlay = "deploy";
    this.render();
  },

  // Tirage au sort, comme l'appli officielle : on choisit et on affiche la configuration tirée
  drawDeploy() {
    const n = Deployments.random();
    this.state.launch.deployment = n;
    this.state.deployView = n;
    this.state.overlay = "deploy";
    this.render();
    this.toast(`Tirage : ${Deployments.name(this.state.launch.myDisposition, this.state.launch.oppDisposition, n)}`);
  },

  fullDeploy() {
    const L = this.state.screen === "game" ? Store.data.games.find(x => x.id === this.state.gameId) : this.state.launch;
    const n = this.state.deployView || 1;
    DeployViewer.open(Deployments.file(L.myDisposition, L.oppDisposition, n),
      `${Dispositions[L.myDisposition].name} / ${Dispositions[L.oppDisposition].name} — ${Deployments.name(L.myDisposition, L.oppDisposition, n)}`,
      Deployments.altFile(L.myDisposition, L.oppDisposition, n));
  },

  pickDeploy() {
    const n = this.state.deployView;
    if (this.state.screen === "launch") this.state.launch.deployment = n;
    this.state.overlay = null;
    this.render();
  },

  setOppDispo(id) {
    this.state.launch.oppDisposition = id;
    this.state.launch.deployment = null;
    this.render();
  },

  startMatch() {
    const L = this.state.launch;
    const l = Store.getList(L.listId);
    if (!l || !L.oppDisposition) return;
    const g = {
      id: Store.newId("g"),
      date: L.date ? new Date(`${L.date}T12:00:00`).toISOString() : new Date().toISOString(),
      listId: l.id, listName: l.name, points: l.points,
      myFaction: l.factionId, myDisposition: L.myDisposition, deployment: L.deployment,
      oppName: L.oppName.trim(), oppFaction: L.oppFaction.trim() || "Inconnue",
      oppDisposition: L.oppDisposition,
      role: L.role,
      myMission: Scenarios.get(L.myDisposition, L.oppDisposition),
      oppMission: Scenarios.get(L.oppDisposition, L.myDisposition),
      season: Season.id,
      score: null, result: null,
      // Copie figée de la liste : la modifier ensuite ne touche pas à la partie
      army: JSON.parse(JSON.stringify({ detachments: l.detachments, units: L.units || l.units }))
    };
    // Copie figée des deux cartes : elles restent lisibles même après un changement de saison
    g.missionsData = JSON.parse(JSON.stringify({ mine: Missions[g.myMission] || null, opp: Missions[g.oppMission] || null }));
    Store.data.games.push(g);
    Store.save();
    Companion.open(this, g.id);
    this.toast("Partie enregistrée. Bonne bataille !");
  },

  /* ---------- Préparation de l'armée (disposition, rattachements, transports) ---------- */

  async openPrep() {
    const L = this.state.launch, l = Store.getList(L.listId);
    const entry = FactionCatalog.find(f => f.id === l.factionId);
    let faction;
    try { faction = await Loader.loadFaction(entry); }
    catch (e) { this.toast(`Le fichier factions/${entry.file}.js est introuvable ou contient une erreur.`); return; }
    const prep = {
      faction, toast: m => this.toast(m),
      dispositions: Home.dispos(l),
      saveToList: false,
      state: { units: JSON.parse(JSON.stringify(L.units || l.units || [])), points: l.points,
               detachments: [...(l.detachments || [])], disposition: L.myDisposition }
    };
    await Loader.loadExtras(prep);
    L.prep = prep;
    this.state.overlay = "prep";
    this.render();
  },

  prepDispo(id) { this.state.launch.prep.state.disposition = id; this.render(); },

  prepSave() { const p = this.state.launch.prep; p.saveToList = !p.saveToList; this.render(); },

  prepCancel() { this.state.launch.prep = null; this.state.overlay = null; this.render(); },

  prepApply() {
    const L = this.state.launch, p = L.prep, l = Store.getList(L.listId);
    if (p.state.disposition !== L.myDisposition) L.deployment = null;
    L.myDisposition = p.state.disposition;
    const same = JSON.stringify(p.state.units) === JSON.stringify(l.units || []);
    L.units = same ? null : p.state.units;
    if (p.saveToList) {
      Store.upsertList({ id: l.id, units: JSON.parse(JSON.stringify(p.state.units)), disposition: p.state.disposition });
      L.units = null;
      // Liste ouverte dans le builder : on la garde à jour
      if (this.state.listId === l.id) { this.state.units = JSON.parse(JSON.stringify(p.state.units)); this.state.disposition = p.state.disposition; }
      this.toast("Liste mise à jour.");
    }
    L.prep = null;
    this.state.overlay = null;
    this.render();
  },

  openGame(id) { Companion.open(this, id); },

  // Consultation de la liste pendant la saisie (armée, règles, stratagèmes) : voir js/listview.js
  openLaunchInfo(tab) {
    const L = this.state.launch;
    ListViewActions.openListView.call(this, L.listId, { units: L.units, disposition: L.myDisposition, tab });
  }
};

/* ---------- Panneau : mises en place de la table ---------- */

Overlays.deploy = function (app) {
  let a, b, chosen;
  if (app.state.screen === "game") {
    const g = Store.data.games.find(x => x.id === app.state.gameId);
    a = g.myDisposition; b = g.oppDisposition; chosen = g.deployment;
  } else {
    a = app.state.launch.myDisposition; b = app.state.launch.oppDisposition; chosen = app.state.launch.deployment;
  }
  const n = app.state.deployView || 1;
  const file = Deployments.file(a, b, n);
  const tabs = Deployments.configs().map((c, i) => { const k = i + 1; return `<button class="role-btn ${k === n ? "is-on" : ""}" data-action="openDeploy" data-arg="${k}">
      ${UI.esc(Deployments.name(a, b, k))}${k === chosen ? " ✓" : ""}</button>`; }).join("");
  const pick = app.state.screen === "launch"
    ? `<button class="btn btn-primary" data-action="pickDeploy">${chosen === n ? "Configuration choisie" : "Jouer cette configuration"}</button>` : "";
  const png = Deployments.altFile(a, b, n);
  return this.wrap(`
    <div class="ov-head"><h2>${UI.dispoChip(a)} <span class="muted">et</span> ${UI.dispoChip(b)}</h2>
      <button class="btn btn-s" data-action="closeOverlay">Fermer</button></div>
    <div class="seg-big dp-tabs">${tabs}</div>
    <div class="dp-img">
      <img src="${UI.esc(file)}" alt="${UI.esc(Deployments.name(a, b, n))}" data-action="fullDeploy" title="Ouvrir en grand"
           onerror="if(!this.dataset.png){this.dataset.png=1;this.src='${UI.esc(png)}'}else{this.hidden=true;this.nextElementSibling.hidden=false}">
      <p class="dp-missing" hidden>Image introuvable. Place le fichier <b>${UI.esc(file)}</b> dans le dossier de l'appli.</p>
    </div>
    <div class="ov-btns"><span class="hint">Touche l'image pour l'ouvrir en grand.</span><button class="btn" data-action="fullDeploy">Plein écran</button>${pick}</div>`, "ov-wide");
};

/* ---------- Panneau : préparation de l'armée pour cette partie ---------- */

Overlays.prep = function (app) {
  const p = app.state.launch.prep;
  if (!p) return "";
  const units = p.state.units;
  const dispo = p.dispositions.length > 1
    ? `<div class="dispo-options">${p.dispositions.map(id => {
        const d = Dispositions[id], on = p.state.disposition === id;
        return `<button class="dispo-btn ${on ? "is-selected" : ""}" style="--dispo:${d.color}" data-action="prepDispo"
          data-arg="${id}" aria-pressed="${on}">${UI.esc(d.name)}</button>`; }).join("")}</div>`
    : `<p>${UI.dispoChip(p.state.disposition)} <span class="muted">Seule disposition possible avec tes détachements.</span></p>`;
  const chars = units.filter(e => Builder.canLead(p, e).length);
  const attach = chars.length ? `<div class="prep-grid">${chars.map(e =>
      `<div class="prep-card"><h4>${UI.esc(Builder.label(p, e))}</h4>${Army.attachControl(p, e, "prep")}</div>`).join("")}</div>`
    : `<p class="hint">Aucun personnage ne peut mener d'unité dans cette liste.</p>`;
  const trs = Army.transports(p);
  const transp = trs.length ? `<div class="prep-grid">${trs.map(t =>
      `<div class="prep-card"><h4>${UI.esc(Builder.label(p, t))}</h4>${Army.transportControl(p, t, "prep")}</div>`).join("")}</div>`
    : `<p class="hint">Pas de transport dans cette liste.</p>`;
  const issues = Army.issues(p);
  return this.wrap(`
    <div class="ov-head"><h2>Préparation de l'armée</h2>
      <button class="btn btn-s" data-action="prepCancel">Annuler</button></div>
    <div class="prep-body">
      <h3 class="prep-h">Disposition</h3>${dispo}
      <h3 class="prep-h">Rattachements</h3>${attach}
      <h3 class="prep-h">Transports</h3>${transp}
    </div>
    ${issues.length ? `<ul class="prep-issues">${issues.map(i => `<li>${UI.esc(i.msg)}</li>`).join("")}</ul>` : ""}
    <div class="ov-btns">
      <button class="toggle ${p.saveToList ? "is-on" : ""}" data-action="prepSave" aria-pressed="${p.saveToList}">Enregistrer aussi dans la liste</button>
      <button class="btn btn-primary" data-action="prepApply">Valider</button>
    </div>`, "ov-wide");
};
