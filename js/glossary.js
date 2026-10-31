/* =========================================================
   GLOSSAIRE — mots-clés de règles communs à toutes les factions
   - fr / en : noms affichés ({x} = valeur variable, ex. Touches Soutenues 1)
   - aliases : formes repérées automatiquement dans les textes
   - text    : définition (vide = à compléter)
   - link    : false = terme mis en gras, sans bulle
   - stratagem : id d'un stratagème de base, affiché en entier dans la bulle
   Référence dans les données : "id" ou "id:valeur" (ex. "sustained-hits:1")
   ========================================================= */

const Glossary = {

  entries: {
    /* ---------- Aptitudes d'armes ---------- */
    "sustained-hits":     { fr: "Touches Soutenues {x}", en: "Sustained Hits {x}", text: "Les Touches Critiques avec cette arme infligent X touches supplémentaires." },
    "lethal-hits":        { fr: "Touches Fatales", en: "Lethal Hits", text: "Les Touches Critiques avec cette arme peuvent blesser automatiquement, si vous le souhaitez." },
    "devastating-wounds": { fr: "Blessures Dévastatrices", en: "Devastating Wounds", text: "Chaque attaque qui inflige une Blessure Critique se termine, et la cible subit autant de blessures mortelles que la caractéristique de Dégâts de l'arme. Ces blessures mortelles sont résolues après les dégâts normaux de l'attaque." },
    "precision":          { fr: "Précision", en: "Precision", text: "Quand on attaque une unité qui contient un Personnage, on peut allouer en priorité les touches à ce Personnage." },
    "hazardous":          { fr: "À Risque", en: "Hazardous", text: "Après avoir résolu toutes les attaques, faites autant de jets de risque que d'armes ayant cette aptitude. Jet de risque : lancez 1D6 ; sur 1 ou 2, l'unité subit 1 blessure mortelle (3 si c'est un Monstre ou un Véhicule)." },
    "ignores-cover":      { fr: "Ignore le Couvert", en: "Ignores Cover", text: "Les attaques ignorent les bonus de couvert, même si la cible a Discrétion." },
    "extra-attacks":      { fr: "Attaques Bonus", en: "Extra Attacks", text: "Quand la figurine combat, elle fait les attaques de cette arme en plus de celles de son arme principale. On peut attaquer avec plusieurs armes ayant cette aptitude." },
    "pistol":             { fr: "Pistolet", en: "Pistol", text: "Suit les règles du Combat rapproché : l'unité peut tirer avec cette arme tout en étant engagée." },
    "melta":              { fr: "Fusion {x}", en: "Melta {x}", text: "Si la cible est à mi-portée ou moins, ajoutez X à la caractéristique de Dégâts de l'arme." },
    "rapid-fire":         { fr: "Tir Rapide {x}", en: "Rapid Fire {x}", text: "Si la cible est à mi-portée ou moins, ajoutez X dés d'attaque." },
    "anti":               { fr: "Anti-{x}", en: "Anti-{x}", text: "Pour Anti-X Y+ : chaque fois qu'une attaque de cette arme cible une unité ayant le mot-clé X, un jet de blessure non modifié de Y+ est une Blessure Critique." },
    "blast":              { fr: "Déflagration {x}", en: "Blast", text: "Chaque fois que l'on rassemble les dés d'attaque, ajoutez 1 dé par tranche de 5 figurines dans l'unité ciblée (arrondi à l'inférieur). Pour Déflagration X, ajoutez X dés par tranche de 5 figurines." },
    "torrent":            { fr: "Torrent", en: "Torrent", text: "Les attaques de tir avec cette arme touchent automatiquement." },
    "twin-linked":        { fr: "Jumelé", en: "Twin-linked", text: "Vous pouvez relancer les jets de blessure de cette arme." },
    "lance":              { fr: "Lance", en: "Lance", text: "Si le porteur a chargé à ce tour, ajoutez 1 aux jets de blessure de cette arme." },
    "assault":            { fr: "Assaut", en: "Assault", text: "L'unité peut faire des tirs d'assaut : elle peut tirer avec cette arme même si elle a Avancé, mais ne peut alors ni entreprendre d'action ni charger." },
    "heavy":              { fr: "Lourd", en: "Heavy", text: "À la phase de Tir, +1 pour toucher si l'unité n'est pas engagée, n'est pas arrivée sur le champ de bataille à ce tour et ne s'est pas déplacée de plus de 3\" à ce tour." },
    "indirect-fire":      { fr: "Tir Indirect", en: "Indirect Fire", text: "L'arme peut cibler une unité non visible. La cible a alors toujours le Bénéfice du Couvert, le jet de touche ne peut pas être relancé et les jets de touche de 1 à 5 échouent toujours, sauf si le tireur est Resté Immobile et qu'une unité amie voit la cible : la touche se fait alors sur 4+." },
    "one-shot":           { fr: "Tir Unique", en: "One Shot", text: "L'arme ne peut tirer qu'une seule fois par bataille, même si le porteur a été détruit puis est revenu en jeu." },
    "cleave":             { fr: "Abattage {x}", en: "Cleave {x}", text: "Chaque fois que l'on rassemble les dés d'attaque, ajoutez X dés par tranche de 5 figurines dans l'unité ciblée (arrondi à l'inférieur)." },
    "psychic":            { fr: "Psychique", en: "Psychic", text: "Chaque attaque faite avec cette arme peut ignorer tout ou partie des malus au tir ou au corps à corps." },

    /* ---------- Aptitudes de base ---------- */
    "feel-no-pain":   { fr: "Insensible à la Douleur {x}", en: "Feel No Pain {x}", text: "Chaque fois que la figurine devrait perdre un PV, lancez 1D6 : sur X+, ce PV n'est pas perdu." },
    "deep-strike":    { fr: "Frappe en Profondeur", en: "Deep Strike", text: "Chaque fois que cette unité fait un mouvement d'arrivée, elle peut être placée n'importe où sur le champ de bataille, à plus de 8\" de toute unité ennemie." },
    "fights-first":   { fr: "Combat en Premier", en: "Fights First", text: "Les attaques de cette unité sont résolues en même temps que celles des unités qui combattent en premier (notamment les unités qui ont chargé)." },
    "leader":         { fr: "Leader", en: "Leader", text: "Personnage qui peut soit rester indépendant, soit être rattaché à une unité (contrairement au Support, qui doit être rattaché). L'unité qu'il rejoint devient une unité de gardes du corps." },
    "support":        { fr: "Support", en: "Support", text: "Personnage qui doit obligatoirement être rattaché à une unité (contrairement au Leader, qui peut rester indépendant). L'unité qu'il rejoint devient une unité de gardes du corps.",
                        aliases: ["personnages support", "personnage support"] },
    "bodyguard":      { fr: "Gardes du corps", en: "Bodyguard", text: "Unité rejointe par un personnage Leader ou Support.",
                        aliases: ["unités de gardes du corps", "unité de gardes du corps", "gardes du corps", "garde du corps"] },
    "lone-operative": { fr: "Agent Solitaire", en: "Lone Operative", text: "Tant qu'elle n'est pas rattachée à une unité, la figurine n'est pas visible à plus de 12\" et ne peut pas être ciblée par des tirs indirects, sauf si elle est visible du tireur. Pour Agent Solitaire X, la figurine n'est pas visible au-delà de X\"." },
    "deadly-demise":  { fr: "Destruction Néfaste {x}", en: "Deadly Demise {x}", text: "Quand cette figurine est détruite, après le débarquement d'urgence des unités embarquées, lancez 1D6 : sur 6, chaque unité à 6\" ou moins subit X blessures mortelles." },
    "firing-deck":    { fr: "Pont de Tir {x}", en: "Firing Deck {x}", text: "Quand des unités sont embarquées dans ce transport, X figurines embarquées peuvent tirer depuis le transport." },
    "hover":          { fr: "Stationnaire", en: "Hover", text: "Chaque fois que cette unité décolle, on ne soustrait pas 2\" à son Mouvement." },
    "stealth":        { fr: "Discrétion", en: "Stealth", text: "L'unité a le Bénéfice du Couvert contre les attaques de tir." },
    "super-heavy-walker": { fr: "Marcheur Super-lourd", en: "Super-heavy Walker", text: "Quand elle se déplace, cette figurine peut traverser les figurines et les éléments de terrain de moins de 4\" de haut. Elle peut aussi gagner la règle Mobile, mais lance alors 1D6 à la fin de son mouvement : sur 1, elle est Ébranlée." },
    "close-quarters":  { fr: "Combat Rapproché", en: "Close Quarters", text: "Les unités peuvent tirer avec leurs armes de tir en étant engagées au corps à corps." },
    "infiltrators":   { fr: "Infiltrateurs", en: "Infiltrators", text: "Pendant le déploiement, cette unité peut être placée n'importe où sur le champ de bataille, à plus de 8\" de la zone de déploiement ennemie et de toute unité ennemie." },
    "scouts":         { fr: "Éclaireurs {x}", en: "Scouts {x}", text: "Lors de l'étape des aptitudes d'avant-bataille, choisissez une option : si l'unité est en Réserves Stratégiques, elle peut être placée n'importe où dans votre zone de déploiement ; si elle est entièrement dans votre zone de déploiement, elle peut faire un mouvement d'éclaireur de X\" maximum, et doit le finir à plus de 8\" de toute unité ennemie ; si elle est embarquée dans un transport assigné entièrement dans votre zone de déploiement et que toutes les figurines embarquées ont cette aptitude, le transport peut faire ce mouvement d'éclaireur.",
                        aliases: ["Éclaireurs"] },

    /* ---------- Termes de règles ---------- */
    "advance":      { fr: "Avancer", en: "Advance", text: "Lors de la phase de Mouvement, la figurine se déplace de sa caractéristique de Mouvement + 1D6\".",
                      aliases: ["mouvement d'Avance", "Avancer", "Avancé", "Avances", "Avance"] },
    "normal-move":  { fr: "Mouvement Normal", en: "Normal move", link: false,
                      aliases: ["Mouvements Normaux", "Mouvement Normal"] },
    "fall-back":    { fr: "Battre en Retraite", en: "Fall Back", text: "Mouvement de retraite d'une unité engagée. Si elle n'est pas Ébranlée, elle se déplace normalement de sa caractéristique de Mouvement. Si elle est Ébranlée, c'est une Fuite Désespérée. Dans les deux cas, l'unité doit finir son mouvement non engagée, et elle ne peut ni tirer ni charger à ce tour.",
                      aliases: ["Battre en Retraite", "Battu en Retraite", "Bat en Retraite", "Retraite"] },
    "remain-stationary":   { fr: "Rester Immobile", en: "Remain Stationary",
                             text: "L'unité ne bouge pas et ne déclenche aucun effet de début ou de fin de déplacement.",
                             aliases: ["Rester Immobile", "Reste Immobile", "Resté Immobile", "Rester Stationnaire"] },
    "take-off":            { fr: "Décoller", en: "Take off",
                             text: "Pour les figurines avec le mot-clé FLY (Vol). On soustrait 2\" à leur Mouvement, puis elles ignorent les distances verticales, les figurines amies et ennemies et tous les éléments de terrain.",
                             aliases: ["Décoller", "décolle", "Décolle"] },
    "embark":              { fr: "Embarquer", en: "Embark",
                             text: "Une unité qui a fait un Mouvement Normal, une Avance ou une Retraite peut embarquer dans un transport si toute l'unité est à 3\" ou moins de celui-ci, qu'elle n'a pas été placée sur le champ de bataille à ce tour, qu'elle est éligible pour ce transport et qu'il reste de la place à bord.",
                             aliases: ["Embarquer", "embarquer"] },
    "disembark":           { fr: "Mouvement de débarquement", en: "Disembark move",
                             text: "Distance : 3\" en mode rapide ou tactique, 6\" en mode de combat. Possible si l'unité n'a pas embarqué pendant cette phase et si le transport n'a ni Avancé ni Battu en Retraite pendant cette phase.\nLe mode est imposé par ce qu'a fait le transport :\n• Rapide : le transport a fait un Mouvement Normal ou un mouvement d'arrivée. L'unité ne peut pas charger à ce tour. Après une arrivée, les figurines suivent les mêmes contraintes que le transport (par exemple, plus de 8\" des ennemis).\n• Tactique : le transport n'a pas encore bougé ou est Resté Immobile. L'unité peut ensuite faire un Mouvement Normal ou une Avance.\n• De combat : dans les autres cas, ou si l'unité ne peut pas être placée à 3\". Jet de risque pour chaque figurine ; elles peuvent être placées engagées avec les ennemis engagés avec le transport. L'unité est Ébranlée et ne peut pas charger à ce tour.",
                             aliases: ["Mouvement de débarquement", "mouvement de débarquement", "débarquement rapide", "débarquement tactique", "débarquement de combat"] },
    "battle-shock":        { fr: "Ébranlement", en: "Battle-shock", text: "Test de Commandement à faire pendant la phase de Commandement pour chaque unité déjà Ébranlée, ou à la moitié de son effectif ou en dessous. S'il est raté, l'unité est Ébranlée jusqu'à votre prochaine phase de Commandement :\n• sa caractéristique de CO tombe à 0 ;\n• elle ne peut pas être ciblée par un stratagème ;\n• elle ne peut pas entreprendre d'action.",
                             aliases: ["test d'Ébranlement", "tests d'Ébranlement", "Ébranlée", "Ébranlé", "Ébranlement"] },
    "desperate-escape":    { fr: "Fuite Désespérée", en: "Desperate Escape", text: "Retraite d'une unité Ébranlée : elle peut traverser les figurines ennemies, mais doit faire un jet de risque pour chaque figurine. Si l'unité n'était pas Ébranlée, elle doit faire un test d'Ébranlement.",
                             aliases: ["tests de Fuite Désespérée", "test de Fuite Désespérée", "Fuite Désespérée"] },
    "fire-overwatch":      { fr: "Tir en État d'Alerte", en: "Fire Overwatch", stratagem: "tir-en-etat-d-alerte",
                             aliases: ["Tir en État d'Alerte", "Tirs en Alerte", "Tir en Alerte"] },
    "snap-shooting":       { fr: "Tir au Jugé", en: "Snap Shooting",
                             text: "Type de tir permis par certaines règles (comme Tir en État d'Alerte) : une seule unité ennemie visible et éligible à 24\" ou moins peut être ciblée, chaque attaque ne touche que sur un 6 non modifié, quels que soient la CT et les modificateurs, et les jets de touche ne peuvent pas être relancés. Ensuite, jusqu'à la fin de la phase, l'unité ne peut pas entreprendre d'action.",
                             aliases: ["tir au jugé", "Tir au Jugé"] },
    "charge-move":         { fr: "Mouvement de Charge", en: "Charge move", link: false,
                             aliases: ["mouvements de Charge", "mouvement de Charge"] },
    "shock-disembark": { fr: "Mouvement de débarquement de choc", en: "Shock disembark move", text: "Débarquement spécial donné par certaines aptitudes de transport. Distance : 3\". Possible même si le transport a Avancé ou Battu en Retraite, tant que l'unité n'a pas embarqué pendant cette phase. Ensuite, les figurines qui étaient engagées doivent le rester, et chaque unité ennemie engagée avec l'unité qui n'a pas encore combattu à cette phase est choisie pour combattre, l'une après l'autre.",
                         aliases: ["mouvement de débarquement de choc"] },
    "assault-disembark": { fr: "Mouvement de débarquement d'assaut", en: "Assault disembark move", text: "Débarquement spécial donné par certaines aptitudes de transport. Distance : 3\". Mêmes conditions que le débarquement normal (pas d'embarquement pendant cette phase, transport qui n'a ni Avancé ni Battu en Retraite), mais sans aucune pénalité ensuite : l'unité peut notamment charger.",
                           aliases: ["mouvement de débarquement d'assaut"] },
    "emergency-disembark": { fr: "Débarquement d'urgence", en: "Emergency disembark move",
                             text: "Quand le transport est détruit. Faire un jet de risque pour chaque figurine, puis placer chacune à 6\" ou moins du transport et aussi près que possible. Si elle ne peut pas être placée non engagée, elle est placée engagée ; si c'est impossible, elle est détruite. L'unité est ensuite Ébranlée et ne peut pas charger à ce tour.",
                             aliases: ["débarquement d'urgence"] },
    "transport-capacity": { fr: "Capacité de transport", en: "Transport capacity", text: "Indique le type et le nombre de figurines qui peuvent embarquer dans un transport.",
                            aliases: ["Capacité de transport"] },
    "repositioned":        { fr: "Unité repositionnée", en: "Redeployed unit",
                             text: "Certaines aptitudes ou certains stratagèmes permettent de replacer une unité en Réserves Stratégiques en cours de partie, à des moments qui varient selon la règle. Une unité repositionnée n'est pas détruite si elle est encore en réserve après le 3e round.",
                             aliases: ["repositionnées", "repositionnée", "repositionné", "repositionner"] },
    "heroic-intervention": { fr: "Intervention Héroïque", en: "Heroic Intervention", stratagem: "intervention-heroique" },
    "strategic-reserves":  { fr: "Réserves Stratégiques", en: "Strategic Reserves", text: "Au lieu de les déployer normalement, vous pouvez placer en Réserves Stratégiques des unités représentant jusqu'à 50 % des points de l'armée.\n• Arrivée : à partir du 2e round, entièrement à 6\" ou moins d'un bord du champ de bataille et à plus de 8\" de toute unité ennemie. Pas le long du bord de la zone de déploiement adverse avant le 3e round.\n• Après ce mouvement d'arrivée, l'unité ne peut plus se déplacer avant la phase de Charge.\n• Une unité encore en réserve à la fin du 3e round est détruite, sauf si elle a été repositionnée." },
    "engagement-range":    { fr: "Portée d'engagement", en: "Engagement Range", text: "2\". Toute figurine à portée d'engagement d'une figurine ennemie est éligible pour combattre au corps à corps.",
                             aliases: ["portée d'engagement"] },
    // link: false -> mis en gras, sans bulle de définition
    "hit-roll":      { fr: "Jet de touche", en: "Hit roll", link: false,
                       aliases: ["jets de touche", "jet de touche"] },
    "wound-roll":    { fr: "Jet de blessure", en: "Wound roll", link: false,
                       aliases: ["jets de blessure", "jet de blessure"] },
    "charge-roll":   { fr: "Jet de Charge", en: "Charge roll", link: false,
                       aliases: ["jets de Charge", "jet de Charge"] },
    "benefit-of-cover": { fr: "Bénéfice du Couvert", en: "Benefit of Cover", text: "Les attaques de tir ont -1 pour toucher l'unité." },
    "critical-hit":  { fr: "Touche Critique", en: "Critical Hit", text: "Un jet de touche non modifié de 6 (ce seuil peut être abaissé par certaines aptitudes). Une Touche Critique est toujours réussie.",
                       aliases: ["Touches Critiques", "Touche Critique"] },
    "critical-wound": { fr: "Blessure Critique", en: "Critical Wound", text: "Un jet de blessure non modifié de 6 (ce seuil peut être abaissé par certaines aptitudes). Une Blessure Critique est toujours réussie.",
                        aliases: ["Blessures Critiques", "Blessure Critique"] },
    "starting-strength": { fr: "Effectif initial", en: "Starting Strength", link: false,
                           aliases: ["effectif initial"] },
    "half-strength":  { fr: "Moitié de l'effectif", en: "Below Half-strength", link: false,
                        aliases: ["moitié de son effectif", "moitié de leur effectif"] },
    "terrain-features": { fr: "Éléments de terrain", en: "Terrain features", link: false,
                          aliases: ["éléments de terrain"] },
    "mortal-wounds": { fr: "Blessures mortelles", en: "Mortal wounds", text: "Blessure qui ne peut en aucun cas être sauvegardée, pas même avec une sauvegarde invulnérable.",
                       aliases: ["blessures mortelles", "blessure mortelle"] },
    "leadership-test": { fr: "Test de Commandement", en: "Leadership test", text: "Lancez 2D6 : le test est réussi si le résultat atteint la caractéristique de Commandement (Cd) de l'unité. Par exemple, avec Cd 6+, il faut 6 ou plus.",
                         aliases: ["tests de Commandement", "test de Commandement"] }
  },

  /* ---------- Lecture des références ---------- */

  parse(ref) {
    const i = ref.indexOf(":");
    return i < 0 ? { id: ref, value: "" } : { id: ref.slice(0, i), value: ref.slice(i + 1) };
  },

  name(entry, lang, value) {
    return entry[lang].replace("{x}", value || "").replace(/\s+$/, "");
  },

  // Affiche une référence ("sustained-hits:1") sous forme de mot cliquable
  tag(ref) {
    const { id, value } = Glossary.parse(ref);
    const e = Glossary.entries[id];
    if (!e) return UI.esc(ref);
    return Glossary.wrap(id, UI.esc(Glossary.name(e, "fr", value)));
  },

  wrap(id, html) {
    if (this.entries[id] && this.entries[id].link === false) return `<strong class="term">${html}</strong>`;
    return `<span class="gl" role="button" tabindex="0" data-action="glossary" data-arg="${id}">${html}</span>`;
  },

  /* ---------- Repérage automatique dans les textes ---------- */

  _bracketIndex: null,
  _aliasRegex: null,
  _aliasIndex: null,

  build() {
    // [APTITUDE X] -> id, à partir du nom français sans valeur
    this._bracketIndex = {};
    this._aliasIndex = {};
    const aliases = [];
    for (const [id, e] of Object.entries(this.entries)) {
      const base = e.fr.replace("{x}", "").trim().toLowerCase();
      this._bracketIndex[base] = id;
      const list = e.aliases || [e.fr.replace("{x}", "").trim()];
      list.forEach(a => { this._aliasIndex[a.toLowerCase()] = id; aliases.push(a); });
    }
    aliases.sort((a, b) => b.length - a.length);
    const escaped = aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    this._aliasRegex = new RegExp(`(^|[^\\p{L}])(${escaped.join("|")})(?![\\p{L}])`, "giu");
  },

  // Texte brut -> HTML échappé avec les mots-clés cliquables
  markup(text) {
    if (!this._aliasRegex) this.build();
    const parts = String(text ?? "").split(/(\[[^\]]+\])/);
    return parts.map(part => {
      const m = part.match(/^\[([^\]]+)\]$/);
      if (m) {
        const inner = m[1].trim();
        const vm = inner.match(/^(.*?)\s*(\d+\+?|D\d+(?:\+\d+)?)?$/);
        const id = this._bracketIndex[(vm ? vm[1] : inner).toLowerCase()];
        const label = `<span class="kw">${UI.esc(inner)}</span>`;
        return id ? this.wrap(id, label) : label;
      }
      return UI.esc(part).replace(this._aliasRegex, (all, pre, word) => {
        const id = this._aliasIndex[word.toLowerCase()];
        return id ? pre + this.wrap(id, word) : all;
      });
    }).join("").replace(/__(.+?)__/g, '<strong class="emph">$1</strong>');
  },

  /* ---------- Bulle de définition ---------- */

  pop: null,
  current: null,

  init() {
    this.pop = document.createElement("div");
    this.pop.className = "gl-pop";
    this.pop.setAttribute("role", "dialog");
    document.body.appendChild(this.pop);

    // Fermeture : toucher ailleurs ou Échap
    document.addEventListener("click", e => {
      if (!e.target.closest(".gl") && !e.target.closest(".gl-pop")) this.hide();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") this.hide();
      if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("gl")) {
        e.preventDefault(); this.show(e.target);
      }
    });
    // Survol à la souris, seulement sur les appareils qui le permettent
    if (window.matchMedia("(hover: hover)").matches) {
      document.addEventListener("mouseover", e => {
        const el = e.target.closest(".gl");
        if (el) this.show(el);
      });
      document.addEventListener("mouseout", e => {
        const el = e.target.closest(".gl");
        if (el && !el.contains(e.relatedTarget)) this.hide();
      });
    }
    document.addEventListener("scroll", () => this.hide(), true);
  },

  show(el) {
    const e = this.entries[el.dataset.arg];
    if (!e) return;
    if (this.current === el && this.pop.classList.contains("is-visible")) return;
    this.current = el;
    const fr = e.fr.replace("{x}", "X");
    const en = e.en.replace("{x}", "X");
    const strat = e.stratagem && typeof CoreStratagems !== "undefined" &&
      CoreStratagems.find(x => x.id === e.stratagem);
    if (strat) {
      this.pop.innerHTML = UI.stratagem(strat);
      this.pop.classList.add("is-visible", "gl-strat");
      return this.place(el);
    }
    this.pop.classList.remove("gl-strat");
    this.pop.innerHTML = `
      <div class="gl-name">${UI.esc(fr)}</div>
      ${en !== fr ? `<div class="gl-en">${UI.esc(en)}</div>` : ""}
      <p class="gl-text">${e.text ? UI.esc(e.text).replace(/\n/g, "<br>") : '<span class="gl-empty">Définition à compléter.</span>'}</p>`;
    this.pop.classList.add("is-visible");
    this.place(el);
  },

  place(el) {
    // Placement sous le mot, ou au-dessus s'il n'y a pas la place
    const r = el.getBoundingClientRect();
    const p = this.pop.getBoundingClientRect();
    let left = Math.min(Math.max(8, r.left), window.innerWidth - p.width - 8);
    let top = r.bottom + 8;
    if (top + p.height > window.innerHeight - 8) top = r.top - p.height - 8;
    this.pop.style.left = `${left}px`;
    this.pop.style.top = `${Math.max(8, top)}px`;
  },

  hide() {
    if (!this.pop) return;
    this.pop.classList.remove("is-visible");
    this.current = null;
  }
};
