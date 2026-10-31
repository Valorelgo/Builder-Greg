/* =========================================================
   STORAGE — une seule sauvegarde pour tout :
   listes, parties jouées et réglages (scénarios…)
   Enregistrée dans la mémoire du navigateur, exportable en fichier.
   ========================================================= */

const Store = {
  KEY: "builder40k.data",
  VERSION: 1,
  data: null,
  available: true,

  empty() {
    return { version: this.VERSION, lists: [], games: [], settings: { scenarios: {} } };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.data = raw ? this.normalize(JSON.parse(raw)) : this.empty();
    } catch (e) {
      this.available = false;
      this.data = this.empty();
    }
    return this.data;
  },

  save() {
    try {
      this.data.savedAt = new Date().toISOString();
      localStorage.setItem(this.KEY, JSON.stringify(this.data));
      return true;
    } catch (e) {
      this.available = false;
      return false;
    }
  },

  // Complète une sauvegarde ancienne ou partielle
  normalize(d) {
    const base = this.empty();
    return {
      ...base, ...d,
      lists: Array.isArray(d.lists) ? d.lists : [],
      games: Array.isArray(d.games) ? d.games : [],
      settings: { ...base.settings, ...(d.settings || {}) }
    };
  },

  newId(prefix) {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  },

  /* ---------- Listes ---------- */

  getList(id) { return this.data.lists.find(l => l.id === id) || null; },

  upsertList(list) {
    const now = new Date().toISOString();
    const id = list.id || this.newId("l");
    const i = this.data.lists.findIndex(l => l.id === id);
    if (i >= 0) this.data.lists[i] = { ...this.data.lists[i], ...list, id, updated: now };
    else this.data.lists.push({ ...list, id, created: now, updated: now });
    this.save();
    return id;
  },

  deleteList(id) {
    this.data.lists = this.data.lists.filter(l => l.id !== id);
    this.save();
  },

  duplicateList(id) {
    const src = this.getList(id);
    if (!src) return null;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = this.newId("l");
    copy.name = `${src.name} (copie)`;
    copy.created = copy.updated = new Date().toISOString();
    this.data.lists.push(copy);
    this.save();
    return copy.id;
  },

  /* ---------- Export / import ---------- */

  exportFile() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = `builder40k-sauvegarde-${date}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  },

  // Renvoie une promesse avec la sauvegarde lue, sans l'appliquer
  readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        try {
          const d = JSON.parse(r.result);
          if (!d || !Array.isArray(d.lists) || !Array.isArray(d.games)) throw new Error("format");
          resolve(this.normalize(d));
        } catch (e) { reject(e); }
      };
      r.onerror = () => reject(r.error);
      r.readAsText(file);
    });
  },

  replaceAll(d) {
    this.data = this.normalize(d);
    this.save();
  }
};
