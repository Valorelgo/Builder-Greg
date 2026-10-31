/* =========================================================
   HOME — accueil, mes listes, historique des parties
   ========================================================= */

const Home = {
  factionOf(id) {
    return FactionCatalog.find(f => f.id === id) || null;
  },

  // Couleur d'une faction, connue par son id ou par son nom (armée adverse)
  colorOf(idOrName) {
    const key = String(idOrName || "").toLowerCase();
    const f = FactionCatalog.find(x => x.id === idOrName || x.name.toLowerCase() === key) ||
      AllFactions.find(x => x.name.toLowerCase() === key);
    return f ? f.color : "#7d7286";
  },

  factionChip(idOrName, label) {
    const f = this.factionOf(idOrName);
    const text = label || (f ? f.name : idOrName) || "Inconnue";
    return `<span class="fchip" style="--fc:${this.colorOf(idOrName)}">${UI.esc(text)}</span>`;
  },

  // Dispositions jouables avec une liste (anciennes listes : leur disposition unique)
  dispos(l) {
    if (l.dispositions && l.dispositions.length) return l.dispositions;
    return l.disposition ? [l.disposition] : [];
  },

  // Noms des détachements d'une liste (anciennes listes : déduits de l'identifiant)
  detNames(l) {
    if (l.detachmentNames && l.detachmentNames.length) return l.detachmentNames;
    const f = Factions.get(l.factionId);
    return (l.detachments || []).map(id => {
      const d = f && f.detachments.find(x => x.id === id);
      return d ? d.name : id.split("-").map(w => /^(of|the|and)$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    });
  },

  // Part peinte d'une liste, d'après la collection (null si pas de collection pour cette faction)
  // Part des points aussi, si les données de la faction sont chargées : { pct, ptsPct }
  paintedPct(l) {
    if (!Collection.has(l.factionId)) return null;
    const need = {};
    (l.units || []).forEach(e => { need[e.unitId] = (need[e.unitId] || 0) + (e.size || 1); });
    let total = 0, painted = 0;
    Object.entries(need).forEach(([id, n]) => { total += n; painted += Math.min(n, Collection.get(l.factionId, id).painted); });
    if (!total) return null;
    let ptsPct = null;
    const faction = Factions.get(l.factionId);
    if (faction) {
      try {
        const ctx = { faction, state: { units: l.units || [], points: l.points, detachments: l.detachments || [] } };
        ptsPct = Collection.listPaint(ctx, l.factionId).ptsPct;
      } catch (e) { ptsPct = null; }
    }
    return { pct: Math.round(painted / total * 100), ptsPct };
  },

  // Petite ligne sous le nom : détachements · % peint (figurines, puis points en plus petit)
  listSub(l) {
    const p = this.paintedPct(l);
    const dets = this.detNames(l).join(", ");
    return `<span class="lr-sub">${UI.esc(dets)}${p ? `<span class="lr-paint" title="Figurines de la liste déjà peintes">${p.pct} % peinte${p.ptsPct != null ? ` ${Collection.ptsTag(p.ptsPct, "Points de la liste déjà peints")}` : ""}</span>` : ""}</span>`;
  },

  // Résumé de la collection, par faction (points si la faction est chargée)
  collPanel() {
    Collection.ensureLoaded(App);
    const fids = FactionCatalog.filter(f => Collection.has(f.id));
    if (!fids.length) return `<div class="empty"><p>Note les figurines que tu possèdes et ce qui est peint.</p>
      <button class="btn btn-primary" data-action="openCollection">Saisir ma collection</button></div>`;
    return fids.map(f => {
      const units = Collection.unitsOf(f.id);
      const s = units ? Collection.summary(units, f.id) : Collection.rawTotals(f.id);
      return `<button class="hc-card" style="--fc:${f.color}" data-action="openCollection" data-arg="${f.id}">
        <span class="hc-name">${UI.esc(f.name)}</span>
        <span class="hc-pct"><b>${s.pct} %</b> peinte${units ? ` ${Collection.ptsTag(s.ptsPct)}` : ""}</span>
        <span class="co-bar"><span style="width:${s.pct}%"></span></span>
        <span class="hc-sub">${s.painted} / ${s.owned} figurines${units ? ` · ${s.ptsPainted} / ${s.ptsOwned} pts` : ""}</span>
      </button>`;
    }).join("") + `<button class="btn btn-s hc-more" data-action="openCollection">Gérer ma collection</button>`;
  },

  // Sous-titre du bouton « Ma collection » : part peinte, toutes factions confondues
  collSub() {
    const f = Collection.data().factions;
    let o = 0, p = 0;
    Object.values(f).forEach(us => Object.values(us).forEach(r => { o += r.owned; p += r.painted; }));
    return o ? `${p} / ${o} figurines peintes · ${Math.round(p / o * 100)} %` : "Figurines possédées et peintes";
  },

  // Rappel quand la dernière sauvegarde exportée date de plus de 30 jours
  backupWarn() {
    const d = Store.data;
    if (!d.lists.length && !d.games.length) return "";
    const last = d.settings.lastExport;
    const days = last ? Math.floor((Date.now() - new Date(last)) / 86400000) : null;
    if (days != null && days < 30) return `<p class="muted">Dernière sauvegarde exportée : ${days === 0 ? "aujourd'hui" : `il y a ${days} jour${days > 1 ? "s" : ""}`}.</p>`;
    return `<p class="warn">${last ? `Ta dernière sauvegarde exportée date de ${days} jours.` : "Tu n'as encore jamais exporté de sauvegarde."} Pense à en faire une.</p>`;
  },

  date(iso) {
    return iso ? new Date(iso).toLocaleDateString("fr-FR") : "";
  },

  // Listes regroupées par faction, dans l'ordre du catalogue (archived : les listes archivées seulement)
  grouped(archived = false) {
    const lists = Store.data.lists.filter(l => !!l.archived === archived).sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
    const groups = FactionCatalog.map(f => ({ faction: f, lists: lists.filter(l => l.factionId === f.id) }))
      .filter(g => g.lists.length);
    const orphans = lists.filter(l => !this.factionOf(l.factionId));
    if (orphans.length) groups.push({ faction: { id: "?", name: "Autres", color: "#7d7286" }, lists: orphans });
    return groups;
  },

  stats() {
    const done = Store.data.games.filter(g => g.result);
    const count = r => done.filter(g => g.result === r).length;
    return { v: count("victoire"), d: count("defaite"), n: count("egalite"), total: done.length };
  },

  archivedCount() { return Store.data.lists.filter(l => l.archived).length; },

  // mode : "pick" (choisir pour jouer), "edit" (modifier), "archive" (écran des archives)
  listRow(l, mode) {
    const dispos = Home.dispos(l);
    const arch = l.archived
      ? `<button class="btn btn-s" data-action="unarchiveList" data-arg="${l.id}" title="Remettre la liste dans l'accueil">Sortir des archives</button>`
      : `<button class="btn btn-s" data-action="archiveList" data-arg="${l.id}" title="Ne plus l'afficher dans l'accueil">Archiver</button>`;
    const view = `<button class="btn btn-s" data-action="viewList" data-arg="${l.id}">Consulter</button>`;
    const actions = mode === "pick"
      ? `${view}<button class="btn btn-primary btn-s" data-action="pickListForGame" data-arg="${l.id}">Choisir</button>`
      : mode === "archive"
      ? `${view}<button class="btn btn-s" data-action="openList" data-arg="${l.id}">Modifier</button>${arch}
         <button class="btn btn-s btn-danger" data-action="deleteList" data-arg="${l.id}" aria-label="Supprimer">Supprimer</button>`
      : `<button class="btn btn-s" data-action="openList" data-arg="${l.id}">Modifier</button>
         <button class="btn btn-s" data-action="duplicateList" data-arg="${l.id}">Dupliquer</button>
         <button class="btn btn-s" data-action="renameList" data-arg="${l.id}">Renommer</button>
         <button class="btn btn-s" data-action="exportList" data-arg="${l.id}">Exporter</button>
         ${arch}
         <button class="btn btn-s btn-danger" data-action="deleteList" data-arg="${l.id}" aria-label="Supprimer">Supprimer</button>`;
    return `<div class="list-row" style="--fc:${this.colorOf(l.factionId)}">
              <div class="lr-main">
                <span class="lr-name">${UI.esc(l.name)}</span>
                ${Home.listSub(l)}
                <span class="lr-meta">
                  <span class="lr-pts">${l.points} pts</span>
                  <span class="lr-dots">${dispos.map(UI.dot).join("")}</span>
                  <span class="muted">${this.date(l.updated)}</span>
                </span>
              </div>
              <div class="lr-actions">${actions}</div>
            </div>`;
  },

  gameRow(g) {
    const labels = { victoire: "Victoire", defaite: "Défaite", egalite: "Égalité" };
    const res = g.result ? labels[g.result] : "En cours";
    const role = g.role === "attaquant" ? "Attaquant" : g.role === "defenseur" ? "Défenseur" : "";
    const score = g.score ? `${g.score.me} – ${g.score.opp}` : "";
    // En cours : reprendre la partie ; terminée : ouvrir sa fiche
    const open = ` role="button" tabindex="0" data-action="${g.result ? "openGameDetail" : "openGame"}" data-arg="${g.id}"`;
    return `<div class="game-row res-${g.result || "en-cours"}"${open}>
              <span class="g-res">${res}</span>
              <div class="g-main">
                <div class="g-vs">${this.factionChip(g.myFaction)}<span class="muted">contre</span>${this.factionChip(g.oppFaction)}</div>
                <div class="g-meta">
                  <span>${this.date(g.date)}</span>
                  ${g.oppName ? `<span>face à ${UI.esc(g.oppName)}</span>` : ""}
                  ${role ? `<span>${role}</span>` : ""}
                </div>
              </div>
              <span class="g-score">${score}</span>
            </div>`;
  }
};

/* ---------- Écrans ---------- */

Screens.home = {
  body() {
    const groups = Home.grouped();
    const s = Home.stats();
    const games = [...Store.data.games].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    const lists = groups.length
      ? `<div class="side-tools">${UI.foldAll(App, "hl")}</div>` + groups.map(g => UI.section(App, `hl:${g.faction.id}`,
            UI.esc(g.faction.name), `
            ${g.lists.map(l => `
              <button class="list-mini" style="--fc:${g.faction.color}" data-action="viewList" data-arg="${l.id}" title="Consulter la liste">
                <span class="lr-left"><span class="lr-name">${UI.esc(l.name)}</span>${Home.listSub(l)}</span>
                <span class="lr-meta"><span class="lr-pts">${l.points} pts</span><span class="lr-dots">${Home.dispos(l).map(UI.dot).join("")}</span></span>
              </button>`).join("")}`,
            { tag: "h3", cls: "fgroup", style: g.faction.color, aside: `<span class="pill">${g.lists.length}</span>` })).join("")
      : Home.archivedCount() ? `<p class="hint">Toutes tes listes sont archivées.</p>`
      : `<div class="empty"><p>Tu n'as pas encore de liste.</p>
           <button class="btn btn-primary" data-action="newList">Créer ma première liste</button></div>`;
    const nArch = Home.archivedCount();
    const archBtn = nArch ? `<button class="btn btn-s hc-more" data-action="goArchives">Consulter les archives (${nArch})</button>` : "";

    // Les 3 dernières parties, les plus anciennes dans un bloc repliable (replié par défaut)
    const old = games.slice(3), open = !!App.state.homeOld;
    const history = games.length
      ? `<button class="btn hist-more" data-action="goScreen" data-arg="history">Historique complet, filtres et statistiques</button>` +
        games.slice(0, 3).map(g => Home.gameRow(g)).join("") +
        (old.length ? `<button class="aw-sep hg-fold" data-action="toggleHomeOld" aria-expanded="${open}">
            <span class="chev-r">${open ? "▾" : "▸"}</span> Parties plus anciennes (${old.length})</button>
          ${open ? old.map(g => Home.gameRow(g)).join("") : ""}
          <button class="btn btn-s hc-more" data-action="goScreen" data-arg="games">Toutes mes parties (${games.length})</button>` : "")
      : `<div class="empty"><p>Tes parties apparaîtront ici, avec le résultat, l'adversaire et le score.</p></div>`;

    const storageWarn = (Store.available ? "" :
      `<p class="warn">La sauvegarde automatique ne fonctionne pas dans ce navigateur. Exporte tes données régulièrement.</p>`) + Home.backupWarn();

    return `<section class="screen screen-home">
      <div class="home-actions">
        <button class="home-btn" data-action="newList">
          <span class="hb-title">Créer une liste</span>
          <span class="hb-sub">Faction, format, détachements, unités</span>
        </button>
        <button class="home-btn home-btn-main" data-action="startGame">
          <span class="hb-title">Lancer une partie</span>
          <span class="hb-sub">Choisis une de tes listes</span>
        </button>
        <div class="data-box set-box">
          <h3>Suivi des phases en partie</h3>
          <p class="muted">Barre Commandement → Combat et stratagèmes de la phase en cours. Réglage gardé pour toutes les parties.</p>
          <div class="data-btns">
            <button class="toggle ${Companion.settings().trackPhases.me ? "is-on" : ""}" data-action="togglePhases" data-arg="me">Mon tour</button>
            <button class="toggle ${Companion.settings().trackPhases.opp ? "is-on" : ""}" data-action="togglePhases" data-arg="opp">Tour adverse</button>
          </div>
        </div>
        <div class="data-box">
          <h3>Mes données</h3>
          ${storageWarn}
          <div class="data-btns">
            <button class="btn btn-s" data-action="exportData">Exporter</button>
            <button class="btn btn-s" data-action="pickImport">Importer</button>
            <input type="file" id="import-file" accept=".json,application/json" data-change="importData" hidden>
          </div>
        </div>
      </div>

      <div class="home-panel" data-pane="home-lists">
        <h2 class="panel-title">Mes listes</h2>
        ${lists}${archBtn}
      </div>

      <div class="home-panel" data-pane="home-coll">
        <h2 class="panel-title">Ma collection</h2>
        ${Home.collPanel()}
      </div>

      <div class="home-panel" data-pane="home-games">
        <h2 class="panel-title">Historique des parties</h2>
        ${s.total ? `<div class="stats">
            <div class="st st-v"><b>${s.v}</b><span>Victoire${s.v > 1 ? "s" : ""} · ${Math.round(s.v / s.total * 100)} %</span></div>
            <div class="st st-d"><b>${s.d}</b><span>Défaite${s.d > 1 ? "s" : ""} · ${Math.round(s.d / s.total * 100)} %</span></div>
            <div class="st st-n"><b>${s.n}</b><span>Égalité${s.n > 1 ? "s" : ""} · ${Math.round(s.n / s.total * 100)} %</span></div>
          </div>` : ""}
        ${history}
      </div>
    </section>`;
  },
  actions() { return ""; }
};

/* Toutes les parties, au même format que l'accueil, regroupées par mois ; un clic ouvre la fiche */
Screens.games = {
  body() {
    const games = [...Store.data.games].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const months = [];
    games.forEach(g => {
      const d = g.date ? new Date(g.date) : null;
      const key = d ? d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "Sans date";
      let m = months.find(x => x.key === key);
      if (!m) months.push(m = { key, games: [] });
      m.games.push(g);
    });
    const content = months.map(m => `<h2 class="gm-h">${UI.esc(UI.cap(m.key))} <span class="pill">${m.games.length}</span></h2>
      <div class="gm-grid">${m.games.map(g => Home.gameRow(g)).join("")}</div>`).join("");
    return `<section class="screen screen-lists" data-pane="games">
      <h1 class="screen-title">Mes parties</h1>
      ${content || `<div class="empty"><p>Aucune partie pour l'instant.</p></div>`}</section>`;
  },
  actions() { return ""; },
  back() { return { label: "Retour à l'accueil", action: "goHome" }; },
  next() { return { label: "Historique et statistiques", action: "goScreen", arg: "history" }; }
};

Screens.lists = {
  body(app) {
    const mode = app.state.listsMode || "edit", pick = mode === "pick", archive = mode === "archive";
    const block = (groups, prefix, rowMode) => `<div class="side-tools">${UI.foldAll(app, prefix)}</div>` +
      groups.map(g => UI.section(app, `${prefix}:${g.faction.id}`, UI.esc(g.faction.name),
        g.lists.map(l => Home.listRow(l, rowMode)).join(""),
        { tag: "h3", cls: "fgroup", style: g.faction.color, aside: `<span class="pill">${g.lists.length}</span>` })).join("");
    const groups = Home.grouped(archive);
    let content = groups.length ? block(groups, "ml", mode)
      : archive ? `<div class="empty"><p>Aucune liste archivée.</p></div>`
      : `<div class="empty"><p>Aucune liste active pour l'instant.</p>
           <button class="btn btn-primary" data-action="newList">Créer une liste</button></div>`;
    // Modifier une liste / lancer une partie : les archives restent accessibles, repliées par défaut
    const nArch = Home.archivedCount();
    if (!archive && nArch) {
      content += `<div class="arch-box"><button class="btn arch-toggle" data-action="toggleArchives" aria-expanded="${!!app.state.showArch}">
          ${app.state.showArch ? "Masquer" : "Afficher"} les listes archivées (${nArch})</button>
        ${app.state.showArch ? block(Home.grouped(true), "ma", mode) : ""}</div>`;
    }
    const title = pick ? "Avec quelle liste joues-tu ?" : archive ? "Listes archivées" : "Mes listes";
    return `<section class="screen screen-lists" data-pane="lists">
              <h1 class="screen-title">${title}</h1>
              ${archive ? `<p class="hint">Les listes archivées n'apparaissent plus dans l'accueil. Tu peux toujours les consulter, les modifier ou jouer avec, et les sortir des archives.</p>` : ""}
              ${content}
            </section>`;
  },
  actions(app) {
    return `<button class="btn" data-action="goHome">Retour à l'accueil</button>
            <span class="spacer"></span>
            ${app.state.listsMode === "archive" ? "" : `<button class="btn btn-primary" data-action="newList">Créer une liste</button>`}`;
  }
};

/* ---------- Actions ---------- */

const HomeActions = {

  goHome() {
    if (this.state.dirty && !confirm("Quitter sans enregistrer les modifications de ta liste ?")) return;
    this.resetList();
    this.state.screen = "home";
    this.render({ resetScroll: true });
  },

  goArchives() {
    this.state.listsMode = "archive";
    this.state.screen = "lists";
    this.render({ resetScroll: true });
  },

  toggleHomeOld() { this.state.homeOld = !this.state.homeOld; this.render(); },

  toggleArchives() { this.state.showArch = !this.state.showArch; this.render(); },

  archiveList(id) { HomeActions._setArchived.call(this, id, true); },
  unarchiveList(id) { HomeActions._setArchived.call(this, id, false); },

  _setArchived(id, on) {
    const l = Store.getList(id);
    if (!l) return;
    // Pas de changement de date : l'ordre des listes reste le même
    l.archived = on;
    Store.save();
    this.render();
    this.toast(on ? `« ${l.name} » archivée.` : `« ${l.name} » de retour dans l'accueil.`, () => {
      l.archived = !on; Store.save(); this.render();
    });
  },

  goScreen(id) {
    this.state.listsMode = "edit";
    this.state.screen = id;
    this.render({ resetScroll: true });
  },

  newList() {
    this.resetList();
    this.go("faction");
  },

  async openList(id) {
    const l = Store.getList(id);
    if (!l) return;
    const entry = FactionCatalog.find(f => f.id === l.factionId);
    if (!entry) { this.toast("La faction de cette liste n'est plus disponible."); return; }
    try {
      this.faction = await Loader.loadFaction(entry);
    } catch (e) {
      this.toast(`Le fichier factions/${entry.file}.js est introuvable ou contient une erreur.`);
      return;
    }
    Object.assign(this.state, {
      factionId: l.factionId, points: l.points,
      detachments: [...(l.detachments || [])], disposition: l.disposition || null,
      units: JSON.parse(JSON.stringify(l.units || [])),
      focusDetachment: null, listId: l.id, listName: l.name, dirty: false, saved: false,
      sel: null, overlay: null
    });
    await Loader.loadExtras(this);
    Setup.syncDisposition(this);
    document.documentElement.style.setProperty("--accent", entry.color);
    this.maxStep = STEPS.length - 1;
    this.go("detachments");
  },

  duplicateList(id) {
    const copy = Store.duplicateList(id);
    this.toast("Liste dupliquée.");
    // Depuis la consultation : on montre la copie
    if (copy && this.state.overlay === "listView") { ListViewActions.openListView.call(this, copy); return; }
    this.render();
  },

  renameList(id) {
    const l = Store.getList(id);
    const name = prompt("Nouveau nom de la liste :", l.name);
    if (name && name.trim()) {
      Store.upsertList({ id, name: name.trim() });
      this.render();
    }
  },

  deleteList(id) {
    const l = Store.getList(id);
    if (!confirm(`Supprimer définitivement la liste « ${l.name} » ? Les parties déjà jouées avec elle sont conservées.`)) return;
    Store.deleteList(id);
    if (this.state.overlay === "listView") this.state.overlay = null;
    this.toast("Liste supprimée.");
    this.render();
  },

  startGame() {
    if (!Store.data.lists.length) { this.toast("Crée d'abord une liste pour lancer une partie."); return; }
    this.state.listsMode = "pick";
    this.state.launchFrom = null;
    this.state.screen = "lists";
    this.render({ resetScroll: true });
  },

  pickListForGame() {
    this.state.overlay = null;
    this.render();
    this.toast("L'écran de lancement de partie arrive à la prochaine étape.");
  },

  exportData() {
    Store.data.settings.lastExport = new Date().toISOString();
    Store.save();
    Store.exportFile();
    if (this.state.overlay === "backup") this.state.overlay = null;
    this.render();
    this.toast("Sauvegarde exportée.");
  },

  pickImport() {
    document.getElementById("import-file").click();
  },

  async importData(value, el) {
    const file = el.files && el.files[0];
    el.value = "";
    if (!file) return;
    try {
      const d = await Store.readFile(file);
      const msg = `Remplacer toutes tes données actuelles par cette sauvegarde ?\n` +
        `${d.lists.length} liste(s), ${d.games.length} partie(s)` +
        (d.collection ? `, ta collection (${Object.values(d.collection.factions || {}).reduce((n, f) => n + Object.values(f).reduce((m, r) => m + r.owned, 0), 0)} figurines)` : "") +
        ` et tes réglages seront importés.`;
      if (!confirm(msg)) return;
      Store.replaceAll(d);
      this.toast("Sauvegarde importée.");
      this.render();
    } catch (e) {
      this.toast("Ce fichier n'est pas une sauvegarde valide du Builder 40K.");
    }
  }
};
