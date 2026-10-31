/* =========================================================
   ARMÉE — rattachements des personnages et embarquement
   Utilisé par le builder (préconfiguration de la liste) et par
   le panneau « Modifier » du lancement de partie.
   « ctx » = un objet { faction, state: { units, points, detachments } }
   (l'appli elle-même dans le builder, une copie au lancement).
   Une entrée peut porter : attachedTo (uid de l'unité menée)
                            embarkedIn (uid du transport)
   ========================================================= */

const Army = {

  /* ---------- Rattachements ---------- */

  // « leader » (peut se rattacher) ou « support » (doit se rattacher)
  charType(u) { return (u && u.leader && u.leader.type) || "leader"; },

  // Unité principale : pas rattachée à une autre entrée existante
  isTop(ctx, e) { return !e.attachedTo || !Builder.entry(ctx, e.attachedTo); },

  // Personnages rattachés à cette unité
  attached(ctx, t) { return ctx.state.units.filter(x => x.attachedTo === t.uid); },

  // Pourquoi ce personnage ne peut pas rejoindre cette unité (null si possible)
  // Règle : un leader et un support au maximum, jamais deux du même type
  attachBlock(ctx, e, t) {
    const type = this.charType(Builder.unit(ctx, e.unitId));
    const other = this.attached(ctx, t).find(x => x.uid !== e.uid &&
      this.charType(Builder.unit(ctx, x.unitId)) === type);
    if (other) return `déjà un ${type} : ${Builder.label(ctx, other)}`;
    return Builder.sameMarkRule(ctx, "leader") ? this.markClash(ctx, e, t) : null;
  },

  // Marques différentes (Zélotes Pactisants : même marque pour mener ou embarquer)
  markClash(ctx, a, b) {
    const ma = Builder.markOf(ctx, Builder.unit(ctx, a.unitId), a);
    const mb = Builder.markOf(ctx, Builder.unit(ctx, b.unitId), b);
    return ma && mb && ma !== mb ? `marque différente (${UI.mark(ma)} / ${UI.mark(mb)})` : null;
  },

  attachTargets(ctx, e) {
    const names = Builder.canLead(ctx, e);
    return ctx.state.units.filter(t => t.uid !== e.uid && names.includes(Builder.unit(ctx, t.unitId).name));
  },

  setAttach(ctx, uid, target) {
    const e = Builder.entry(ctx, uid);
    if (!e) return;
    e.attachedTo = target || null;
    if (e.attachedTo) e.embarkedIn = null;   // il embarque avec son unité
  },

  /* ---------- Bonus entre personnages et unités ----------
     Dans les données d'une aptitude :
       grants: "unite-menee"          → s'applique à l'unité menée (tant qu'il la mène)
       grants: "son-unite"            → concerne toute son unité (lui seul s'il ne mène personne)
       condition: { leading: [[kw…]] } → active seulement s'il mène une unité ayant ces mots-clés
       condition: { notLeading: true } → active seulement s'il ne mène pas d'unité
     Optimisations : celles qui parlent de « l'unité du porteur » profitent à toute l'unité
     (forçable avec affectsUnit: true/false dans les données). */

  ledUnit(ctx, e) { return (e.attachedTo && Builder.entry(ctx, e.attachedTo)) || null; },

  conditionMet(ctx, e, ab) {
    const led = this.ledUnit(ctx, e);
    if (ab.grants === "unite-menee" && !led) return false;
    const c = ab.condition;
    if (!c) return true;
    if (c.notLeading) return !led;
    if (c.leading) {
      if (!led) return false;
      const lu = Builder.unit(ctx, led.unitId);
      return c.leading.some(alt => alt.every(k => Builder.has(ctx, lu, k)));
    }
    return true;
  },

  conditionText(ab) {
    const c = ab.condition || {};
    if (c.notLeading) return "s'il ne mène pas d'unité";
    if (c.leading) return `s'il mène une unité ${c.leading.map(alt => alt.map(UI.kw).join(" ")).join(" ou ")}`;
    if (ab.grants === "unite-menee") return "tant qu'il mène une unité";
    return "";
  },

  enhAffectsUnit(en) {
    return en.affectsUnit != null ? en.affectsUnit : /unité du porteur|son unité/i.test(en.text || "");
  },

  // Ce que les personnages rattachés apportent à cette unité
  bonusesFor(ctx, t) {
    const out = [];
    this.attached(ctx, t).forEach(c => {
      const cu = Builder.unit(ctx, c.unitId), from = Builder.label(ctx, c);
      (cu.abilities || []).forEach(ab => {
        if (ab.grants && this.conditionMet(ctx, c, ab))
          out.push({ from, kind: "Aptitude", name: ab.name, text: ab.text });
      });
      const en = c.enhancement && Builder.enh(ctx, c.enhancement);
      if (en && this.enhAffectsUnit(en.enh)) out.push({ from, kind: "Optimisation", name: en.enh.name, text: en.enh.text });
    });
    return out;
  },

  // Aptitudes du personnage qui dépendent de son rattachement
  conditionals(ctx, e) {
    const u = Builder.unit(ctx, e.unitId);
    return (u.abilities || []).filter(ab => ab.grants === "unite-menee" || ab.condition)
      .map(ab => ({ name: ab.name, active: this.conditionMet(ctx, e, ab), when: this.conditionText(ab), grants: !!ab.grants }));
  },

  // Règles de l'unité menée qui profitent aussi au personnage qui la rejoint
  // (« cette unité », « chaque fois qu'une figurine de cette unité », équipement de l'unité…)
  unitWide(text) {
    return /cette unité|figurines? de cette unité|l'unité de cette figurine|unité du porteur|son unité/i.test(text || "");
  },

  bonusesFromUnit(ctx, e) {
    const t = this.ledUnit(ctx, e);
    if (!t) return [];
    const u = Builder.unit(ctx, t.unitId);
    const { counts } = Builder.loadout(ctx, u, t);
    const from = Builder.label(ctx, t);
    const out = (u.abilities || [])
      .filter(a => (!a.requiresWargear || counts[a.requiresWargear]) && !a.grants && this.unitWide(a.text))
      .map(a => ({ from, kind: a.requiresWargear ? "Équipement" : "Aptitude", name: a.name, text: a.text }));
    const en = t.enhancement && Builder.enh(ctx, t.enhancement);
    if (en && this.unitWide(en.enh.text)) out.push({ from, kind: "Amélioration", name: en.enh.name, text: en.enh.text });
    return out;
  },

  bonusBox(ctx, e) {
    const parts = [];
    const fromUnit = this.bonusesFromUnit(ctx, e);
    if (fromUnit.length) parts.push(`<div class="bonus-box"><span class="cfg-l">Grâce à son unité (${UI.esc(fromUnit[0].from)})</span>
      ${fromUnit.map(b => `<p><b>${UI.esc(b.name)}</b> <small>${b.kind}</small><br>${UI.fmt(b.text)}</p>`).join("")}</div>`);
    const got = this.bonusesFor(ctx, e);
    if (got.length) parts.push(`<div class="bonus-box"><span class="cfg-l">Bonus de ses personnages</span>
      ${got.map(b => `<p><b>${UI.esc(b.name)}</b> <small>${b.kind} de ${UI.esc(b.from)}</small><br>${UI.fmt(b.text)}</p>`).join("")}</div>`);
    const cond = this.conditionals(ctx, e);
    if (cond.length) parts.push(`<div class="bonus-box"><span class="cfg-l">Selon son rattachement</span>
      ${cond.map(c => `<p class="${c.active ? "is-active" : "is-off"}"><b>${UI.esc(c.name)}</b> :
        ${c.active ? "active" : "inactive"} <small>(${UI.esc(c.when)}${c.grants ? ", pour toute l'unité" : ""})</small></p>`).join("")}</div>`);
    return parts.join("");
  },

  /* ---------- Transports ---------- */

  isTransport(ctx, e) { const u = Builder.unit(ctx, e.unitId); return !!(u && u.transport); },
  transports(ctx) { return ctx.state.units.filter(e => this.isTransport(ctx, e)); },

  // Une unité et ses personnages
  group(ctx, e) { return [e, ...this.attached(ctx, e)]; },

  memberOk(ctx, tr, u) {
    if (u.transport || u.keywords.includes("Vehicle") || u.keywords.includes("Monster")) return false;
    const okAllowed = !tr.allowed || tr.allowed.some(alt => alt.every(k => Builder.has(ctx, u, k)));
    const excluded = (tr.excluded || []).some(k => Builder.has(ctx, u, k));
    return okAllowed && !excluded;
  },

  eligible(ctx, t, e) {
    const tr = Builder.unit(ctx, t.unitId).transport;
    if (Builder.sameMarkRule(ctx, "transport") && this.group(ctx, e).some(x => this.markClash(ctx, x, t))) return false;
    return this.group(ctx, e).every(x => this.memberOk(ctx, tr, Builder.unit(ctx, x.unitId)));
  },

  // Places occupées par une unité et ses personnages
  seats(ctx, t, e) {
    const tr = Builder.unit(ctx, t.unitId).transport;
    return this.group(ctx, e).reduce((sum, x) => {
      const u = Builder.unit(ctx, x.unitId);
      const per = (tr.double || []).some(k => Builder.has(ctx, u, k)) ? 2 : 1;
      return sum + Builder.size(u, x).models * per;
    }, 0);
  },

  passengers(ctx, t) { return ctx.state.units.filter(e => e.embarkedIn === t.uid && this.isTop(ctx, e)); },
  used(ctx, t) { return this.passengers(ctx, t).reduce((s, e) => s + this.seats(ctx, t, e), 0); },
  capacity(ctx, t) { return Builder.unit(ctx, t.unitId).transport.capacity; },

  // Unités qui pourraient monter dans ce transport
  candidates(ctx, t) {
    return ctx.state.units.filter(e => this.isTop(ctx, e) && !this.isTransport(ctx, e) && this.eligible(ctx, t, e));
  },

  toggleEmbark(ctx, tUid, uid) {
    const t = Builder.entry(ctx, tUid), e = Builder.entry(ctx, uid);
    if (!t || !e) return null;
    if (e.embarkedIn === tUid) { e.embarkedIn = null; return null; }
    const free = this.capacity(ctx, t) - this.used(ctx, t);
    if (this.seats(ctx, t, e) > free) return `Pas assez de place : ${Builder.label(ctx, e)} demande ${this.seats(ctx, t, e)} places, il en reste ${free}.`;
    e.embarkedIn = tUid;
    return null;
  },

  // Nettoyage après suppression d'une entrée
  forget(ctx, uid) {
    ctx.state.units.forEach(x => {
      if (x.attachedTo === uid) x.attachedTo = null;
      if (x.embarkedIn === uid) x.embarkedIn = null;
    });
  },

  /* ---------- Vérifications ---------- */

  issues(ctx) {
    const out = [];
    const push = (msg, uid) => out.push({ msg, uid });
    ctx.state.units.forEach(e => {
      const u = Builder.unit(ctx, e.unitId);
      if (!u) return;
      const name = Builder.label(ctx, e);
      if (e.attachedTo) {
        const t = Builder.entry(ctx, e.attachedTo);
        const block = t && this.attachBlock(ctx, e, t);
        if (t && !Builder.canLead(ctx, e).includes(Builder.unit(ctx, t.unitId).name)) push(`${name} ne peut pas mener cette unité.`, e.uid);
        else if (block) push(`${name} ne peut pas mener ${Builder.label(ctx, t)} : ${block}.`, e.uid);
      }
      if (u.leader && this.charType(u) === "support" && !(e.attachedTo && Builder.entry(ctx, e.attachedTo)))
        push(`${name} doit être rattaché à une unité.`, e.uid);
      if (e.embarkedIn && this.isTop(ctx, e)) {
        const t = Builder.entry(ctx, e.embarkedIn);
        if (t && !this.eligible(ctx, t, e)) {
          const mk = Builder.sameMarkRule(ctx, "transport") && this.group(ctx, e).map(x => this.markClash(ctx, x, t)).find(Boolean);
          push(`${name} ne peut pas embarquer dans ${Builder.label(ctx, t)}${mk ? ` : ${mk}` : ""}.`, e.uid);
        }
      }
    });
    this.transports(ctx).forEach(t => {
      const used = this.used(ctx, t), cap = this.capacity(ctx, t);
      if (used > cap) push(`${Builder.label(ctx, t)} : ${used} places occupées pour ${cap}.`, t.uid);
    });
    return out;
  },

  /* ---------- Morceaux d'interface (communs builder / lancement) ---------- */

  attachControl(ctx, e, scope) {
    const targets = this.attachTargets(ctx, e);
    const type = this.charType(Builder.unit(ctx, e.unitId));
    const opts = targets.map(t => {
      const block = this.attachBlock(ctx, e, t);
      return `<option value="${t.uid}" ${e.attachedTo === t.uid ? "selected" : ""} ${block ? "disabled" : ""}>
        ${UI.esc(Builder.label(ctx, t))}${block ? ` (${UI.esc(block)})` : ""}</option>`;
    }).join("");
    return `<label class="cfg-row"><span class="cfg-l">${type === "support" ? "Soutient" : "Rattaché à"}</span>
        <select data-change="armyAttach" data-uid="${e.uid}" data-scope="${scope}">
          <option value="">${type === "support" ? "À choisir" : "Aucune unité"}</option>${opts}</select></label>
      ${!targets.length ? `<p class="hint">Aucune unité qu'il peut mener dans la liste : ${UI.esc(Builder.canLead(ctx, e).join(", "))}.</p>` : ""}`;
  },

  transportControl(ctx, t, scope) {
    const cap = this.capacity(ctx, t), used = this.used(ctx, t);
    const cands = this.candidates(ctx, t);
    const rows = cands.map(e => {
      const on = e.embarkedIn === t.uid;
      const elsewhere = !on && e.embarkedIn && Builder.entry(ctx, e.embarkedIn);
      const seats = this.seats(ctx, t, e);
      const tooBig = !on && seats > cap - used;
      const chars = this.attached(ctx, e).map(x => Builder.label(ctx, x));
      return `<button class="emb-row ${on ? "is-on" : ""}" data-action="armyEmbark" data-arg="${t.uid}|${e.uid}"
          data-scope="${scope}" aria-pressed="${on}" ${tooBig ? "disabled" : ""}>
        <span class="emb-box" aria-hidden="true"></span>
        <span class="emb-name">${UI.esc(Builder.label(ctx, e))}${chars.length ? `<small> + ${UI.esc(chars.join(", "))}</small>` : ""}
          ${elsewhere ? `<small class="emb-where">dans ${UI.esc(Builder.label(ctx, elsewhere))}</small>` : ""}</span>
        <span class="emb-seats">${seats} pl.</span></button>`;
    }).join("");
    return `<div class="emb">
      <div class="emb-head"><span class="cfg-l">Embarqués</span>
        <span class="emb-cap ${used > cap ? "is-over" : ""}">${used} / ${cap} places</span></div>
      ${rows || `<p class="hint">Aucune unité de la liste ne peut embarquer dans ce transport.</p>`}
      ${Builder.sameMarkRule(ctx, "transport") ? `<p class="hint">Seules les unités de même marque que ce transport peuvent embarquer.</p>` : ""}
    </div>`;
  },

  // Résumé pour l'écran de lancement
  summary(units) {
    const chars = units.filter(e => e.attachedTo && units.some(t => t.uid === e.attachedTo)).length;
    const trs = new Set(units.filter(e => e.embarkedIn && units.some(t => t.uid === e.embarkedIn)).map(e => e.embarkedIn)).size;
    const p = (n, s, pl) => `${n} ${n > 1 ? pl : s}`;
    return [chars ? `${p(chars, "personnage rattaché", "personnages rattachés")}` : "aucun personnage rattaché",
            trs ? `${p(trs, "transport occupé", "transports occupés")}` : "aucun transport occupé"];
  }
};

/* ---------- Actions (builder : scope "list" ; lancement : scope "prep") ---------- */

const ArmyActions = {
  _armyCtx(el) { return el.dataset.scope === "prep" ? this.state.launch.prep : this; },

  armyAttach(value, el) {
    const ctx = ArmyActions._armyCtx.call(this, el);
    Army.setAttach(ctx, el.dataset.uid, value);
    if (ctx === this) this.state.dirty = true;
    this.render();
  },

  armyEmbark(arg, el) {
    const ctx = ArmyActions._armyCtx.call(this, el);
    const [t, uid] = arg.split("|");
    const err = Army.toggleEmbark(ctx, t, uid);
    if (err) this.toast(err);
    if (ctx === this) this.state.dirty = true;
    this.render();
  }
};
