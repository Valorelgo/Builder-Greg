/* =========================================================
   LOADER — chargement des factions à la demande
   Injection de <script> : fonctionne aussi en fichier local
   (file://), contrairement à fetch().
   ========================================================= */

const Factions = {
  _registry: {},
  register(data) { this._registry[data.id] = data; },
  get(id) { return this._registry[id] || null; }
};

const Loader = {
  _loaded: new Set(),

  loadScript(file) {
    if (this._loaded.has(file)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `factions/${file}.js`;
      s.onload = () => { this._loaded.add(file); resolve(); };
      s.onerror = () => { s.remove(); reject(new Error(file)); };
      document.head.appendChild(s);
    });
  },

  registerRules(data) {
    (data.armyRules || []).forEach(r => {
      Glossary.entries[r.id] = { fr: r.name, en: r.nameEn || r.name, text: (r.text || []).join("\n") };
    });
    // Règles de détachement : bulle consultable depuis les cartes (sans lien automatique dans les textes)
    (data.detachments || []).forEach(d => {
      if (!d.rule) return;
      Glossary.entries[`det-${d.id}`] = { fr: d.rule.name || d.name, en: d.name, aliases: [],
        text: `${d.rule.name ? `${d.name} — ` : ""}${(d.rule.text || []).join("\n")}` };
    });
    Glossary._aliasRegex = null;
  },

  // Charge les fichiers auxiliaires (ex. démons) des détachements choisis
  async loadExtras(app) {
    const files = new Set();
    Setup.selected(app).forEach(d => (d.extraFiles || []).forEach(f => files.add(f)));
    // ainsi que ceux déjà utilisés par des unités de la liste
    app.faction.detachments.forEach(d => (d.extraFiles || []).forEach(f => {
      if (Factions.get(f)) files.add(f);
    }));
    for (const f of files) {
      try {
        await this.loadScript(f);
        const data = Factions.get(f);
        if (data) this.registerRules(data);
      } catch (e) {
        app.toast(`Le fichier factions/${f}.js est introuvable ou contient une erreur.`);
      }
    }
  },

  async loadFaction(entry) {
    if (!Factions.get(entry.id)) await this.loadScript(entry.file);
    const data = Factions.get(entry.id);
    if (!data) throw new Error(entry.file);
    // Règles d'armée consultables par bulle, comme les mots-clés
    this.registerRules(data);
    // Thème de la faction (css/themes.css) : couleurs de fond et police des titres
    document.documentElement.dataset.faction = entry.id;
    return data;
  }
};
