/* =========================================================
   SETUP — écrans de création de liste
   1. Faction  2. Format  3. Détachements  4. Unités (à venir)
   ========================================================= */

/* ---------- Calculs liés aux détachements ---------- */

const Setup = {
  selected(app) {
    return app.faction.detachments.filter(d => app.state.detachments.includes(d.id));
  },

  usedPoints(app) {
    return Setup.selected(app).reduce((sum, d) => sum + d.cost, 0);
  },

  // Dispositions offertes par les détachements cochés, sans doublon
  availableDispositions(app) {
    const out = [];
    Setup.selected(app).forEach(d => d.dispositions.forEach(id => {
      if (!out.includes(id)) out.push(id);
    }));
    return out;
  },

  syncDisposition(app) {
    const avail = Setup.availableDispositions(app);
    if (!avail.includes(app.state.disposition)) app.state.disposition = null;
    // Toujours une disposition par défaut : la première possible si rien n'est choisi
    if (!app.state.disposition && avail.length) app.state.disposition = avail[0];
  },

  // Si le format a baissé, la sélection peut dépasser le budget
  checkBudget(app) {
    if (!app.faction) return;
    const max = Rules.forPoints(app.state.points).detachmentPoints;
    if (Setup.usedPoints(app) > max) {
      app.state.detachments = [];
      app.state.disposition = null;
      app.toast(`Tes détachements dépassaient les ${max} points du format choisi : la sélection a été vidée.`);
    }
  },

  // Détachement déjà pris qui empêche celui-ci (même étiquette, ex. Cauchemar)
  conflict(app, d) {
    if (!d.exclusiveGroup) return null;
    return Setup.selected(app).find(x => x.id !== d.id && x.exclusiveGroup === d.exclusiveGroup) || null;
  },

  isReady(app) {
    return app.state.detachments.length > 0;
  }
};

/* ---------- Écrans ---------- */

const Screens = {

  /* 1. FACTION */
  faction: {
    body(app) {
      const cards = FactionCatalog.map(f => {
        const style = `style="--card-accent:${f.color}"`;
        if (!f.available) {
          return `<div class="faction-card is-soon" ${style}>
                    <span class="faction-name">${UI.esc(f.name)}</span>
                    <span class="faction-sub">Bientôt disponible</span>
                  </div>`;
        }
        const current = app.state.factionId === f.id ? "is-current" : "";
        return `<button class="faction-card ${current}" ${style} data-action="pickFaction" data-arg="${f.id}">
                  <span class="faction-name">${UI.esc(f.name)}</span>
                  <span class="faction-sub">${UI.esc(f.subtitle)}</span>
                </button>`;
      }).join("");

      return `<section class="screen screen-faction">
                <h1 class="screen-title">Quelle armée mènes-tu ?</h1>
                <div class="faction-grid">${cards}</div>
              </section>`;
    },
    actions() { return ""; }
  },

  /* 2. FORMAT */
  format: {
    body(app) {
      const p = app.state.points;
      const r = Rules.forPoints(p);
      const options = Rules.formatOptions.map(v =>
        `<option value="${v}" ${v === p ? "selected" : ""}>${v} points</option>`).join("");

      return `<section class="screen screen-format">
                <div class="format-pick">
                  <h1 class="screen-title">Format de la partie</h1>
                  <label class="field">
                    <span class="field-label">Taille de l'armée</span>
                    <select class="big-select" data-change="setPoints">${options}</select>
                  </label>
                </div>
                <div class="format-rules">
                  <h2>Construction à ${p} points</h2>
                  <dl class="rule-grid">
                    <div><dt>Points de détachement</dt><dd>${r.detachmentPoints}</dd></div>
                    <div><dt>Optimisations dans l'armée</dt><dd>${r.maxOptimisations}</dd></div>
                    <div><dt>Exemplaires d'une même unité</dt><dd>${r.maxCopies}</dd></div>
                    <div><dt>Lignes et transports assignés</dt><dd>${r.maxBattleline}</dd></div>
                  </dl>
                </div>
              </section>`;
    },
    actions() { return ""; },
    next() { return { label: "Choisir les détachements", action: "goStep", arg: "detachments" }; }
  },

  /* 3. DÉTACHEMENTS */
  detachments: {
    body(app) {
      const f = app.faction;
      const st = app.state;
      const max = Rules.forPoints(st.points).detachmentPoints;
      const used = Setup.usedPoints(app);
      if (!st.focusDetachment) st.focusDetachment = f.detachments[0].id;
      const focus = f.detachments.find(d => d.id === st.focusDetachment) || f.detachments[0];

      const rows = f.detachments.map(d => {
        const checked = st.detachments.includes(d.id);
        const clash = !checked && Setup.conflict(app, d);
        const locked = !checked && (used + d.cost > max || !!clash);
        const cls = [checked && "is-checked", locked && "is-locked", focus.id === d.id && "is-focused"]
          .filter(Boolean).join(" ");
        return `<div class="det-row ${cls}">
                  <label class="det-check">
                    <input type="checkbox" value="${d.id}" data-change="toggleDet"
                           aria-label="Prendre ${UI.esc(d.name)}"
                           ${checked ? "checked" : ""} ${locked ? "disabled" : ""}>
                    <span class="box"></span>
                  </label>
                  <button class="det-name" data-action="focusDet" data-arg="${d.id}">
                    <span class="det-title">${UI.esc(d.name)}</span>
                    <span class="det-dispos">${d.dispositions.map(UI.dot).join("")}</span>
                    ${clash ? `<span class="det-why">Incompatible avec ${UI.esc(clash.name)}</span>` : ""}
                  </button>
                  <span class="det-cost" title="${d.cost} point(s) de détachement">${d.cost}</span>
                </div>`;
      }).join("");

      const avail = Setup.availableDispositions(app);


      return `<section class="screen screen-det">
                <aside class="det-side">
                  <div class="dp-counter">
                    ${UI.pips(used, max)}
                    <span><strong>${used} / ${max}</strong> points de détachement</span>
                  </div>
                  <div class="det-list" data-pane="list">${rows}</div>
                  <div class="dispo-box">
                    <h3>Disposition par défaut</h3>
                    ${avail.length ? `<div class="dispo-options">${avail.map(id => {
                        const d = Dispositions[id], on = app.state.disposition === id;
                        return `<button class="dispo-btn ${on ? "is-selected" : ""}" style="--dispo:${d.color}"
                          data-action="pickDispo" data-arg="${id}" aria-pressed="${on}">${UI.esc(d.name)}</button>`;
                      }).join("")}</div>
                      <p class="hint">${avail.length > 1 ? "Tu pourras en changer au lancement d'une partie." : "La seule possible avec ces détachements."}</p>`
                    : `<p class="hint">Coche au moins un détachement.</p>`}
                  </div>
                </aside>
                <article class="det-detail" data-pane="detail">
                  ${UI.detachmentDetail(focus, f, app)}
                </article>
              </section>`;
    },
    actions() { return ""; },
    next(app) {
      let hint = "";
      if (!app.state.detachments.length) hint = "Coche au moins un détachement.";
      return { label: "Choisir les unités", action: "goStep", arg: "units", disabled: !Setup.isReady(app), hint };
    }
  }
};

/* ---------- Actions déclenchées par l'interface ---------- */

const SetupActions = {

  async pickFaction(id) {
    const entry = FactionCatalog.find(f => f.id === id);
    if (!entry || !entry.available) return;

    if (this.state.factionId !== id) {
      Object.assign(this.state, { factionId: id, detachments: [], disposition: null, units: [], focusDetachment: null, dirty: true });
      this.faction = null;
      this.maxStep = 0;
    }
    this.setLoading(true);
    try {
      this.faction = await Loader.loadFaction(entry);
    } catch (err) {
      this.state.factionId = null;
      this.toast(`Le fichier factions/${entry.file}.js est introuvable ou contient une erreur.`);
      return;
    } finally {
      this.setLoading(false);
    }
    document.documentElement.style.setProperty("--accent", entry.color);
    this.go("format");
  },

  setPoints(value) {
    this.state.points = Number(value);
    this.state.dirty = true;
    this.render();
  },

  async goStep(id) {
    if (id === "detachments") Setup.checkBudget(this);
    if (id === "units") {
      if (!Setup.isReady(this)) return;
      await Loader.loadExtras(this);
    }
    this.go(id);
  },

  toggleDet(id, el) {
    const st = this.state;
    const d = this.faction.detachments.find(x => x.id === id);
    if (el.checked) {
      const max = Rules.forPoints(st.points).detachmentPoints;
      if (Setup.usedPoints(this) + d.cost > max) { el.checked = false; return; }
      const clash = Setup.conflict(this, d);
      if (clash) { el.checked = false; this.toast(`${d.name} ne peut pas être pris avec ${clash.name}.`); return; }
      st.detachments.push(id);
    } else {
      st.detachments = st.detachments.filter(x => x !== id);
    }
    Setup.syncDisposition(this);
    st.dirty = true;
    const focusChanged = st.focusDetachment !== id;
    st.focusDetachment = id;
    this.render(focusChanged ? { resetPane: "detail" } : {});
  },

  focusDet(id) {
    if (this.state.focusDetachment === id) return;
    this.state.focusDetachment = id;
    this.render({ resetPane: "detail" });
  },

  pickDispo(id) {
    this.state.disposition = id;
    this.state.dirty = true;
    this.render();
  }
};
