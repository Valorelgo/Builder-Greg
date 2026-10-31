/* =========================================================
   YNNARI — unités du culte d'Ynnead
   Fichier auxiliaire : chargé seulement quand un détachement le
   débloque (Dévots d'Ynnead pour les Aeldari), comme les démons
   des Emperor's Children.
   Les règles d'armée Transe Guerrière et Chemins Disparates sont
   définies dans aeldari.js.
   exclusiveEpic (Servant/Avatar of the Whispering God) : js/regles-etendues.js.
   ========================================================= */

Factions.register({
  id: "ynnari",
  name: "Ynnari",
  keyword: "Ynnari",
  auxiliary: true,

  armyRules: [],

  units: [
    /* ---------- Héros d'infanterie épiques ---------- */

    {
      id: "the-visarch",
      name: "The Visarch",
      category: "epic-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "The Visarch", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 80 }] }],
      exclusiveEpic: "Ynnari",                     // Servant of the Whispering God
      leader: { type: "support", canLead: ["Corsair Voidreavers", "Corsair Voidscarred", "Guardian Defenders", "Storm Guardians", "Ynnari Kabalite Warriors", "Ynnari Wyches"] },
      coreAbilities: ["support"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "asu-var", name: "Asu-var", type: "melee",
          profiles: [
            { name: "quicksilver stance", range: "Mêlée", A: "8", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:2"] },
            { name: "duellist stance",    range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "2", abilities: ["devastating-wounds", "precision"] },
            { name: "mythic stance",      range: "Mêlée", A: "4", skill: "2+", S: "3", AP: "-4", D: "3", abilities: ["anti:Héros Épique 2+", "precision"] }
          ] }
      ],
      loadout: ["asu-var"],
      abilities: [
        { name: "Servant of the Whispering God",
          text: "Si votre armée inclut THE VISARCH, elle ne peut inclure aucune unité EPIC HERO (sauf unités YNNARI). Si votre armée inclut des unités EPIC HERO (sauf unités YNNARI), elle ne peut pas inclure THE VISARCH." },
        { name: "Way of the Blade", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les figurines de cette unité ont l'aptitude Combat en Premier." },
        { name: "Yvraine's Champion", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les autres figurines CHARACTER rattachées à cette unité ont l'aptitude Insensible à la Douleur 4+." },
        { name: "Unité rattachée",
          text: "Cette figurine peut être rattachée à l'une de ces unités même si YVRAINE y est déjà rattachée. Dans ce cas, si l'unité de gardes du corps est détruite, les Leaders rattachés redeviennent des unités séparées, avec leur effectif initial." }
      ],
      composition: "1 The Visarch"
    },

    {
      id: "yvraine",
      name: "Yvraine",
      category: "epic-infantry",
      base: "75 x 42mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Psyker", "Yvraine", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      exclusiveEpic: "Ynnari",                     // Servant of the Whispering God
      leader: { canLead: ["Corsair Voidreavers", "Corsair Voidscarred", "Guardian Defenders", "Storm Guardians", "Ynnari Incubi", "Ynnari Kabalite Warriors", "Ynnari Wyches"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "storm-of-whispers", name: "Storm of Whispers", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "2+", S: "2", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "devastating-wounds", "psychic"] }] },
        { id: "kha-vir", name: "Kha-vir", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "4", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["storm-of-whispers", "kha-vir"],
      abilities: [
        { name: "Servant of the Whispering God",
          text: "Si votre armée inclut YVRAINE, elle ne peut inclure aucune unité EPIC HERO (sauf unités YNNARI). Si votre armée inclut des unités EPIC HERO (sauf unités YNNARI), elle ne peut pas inclure YVRAINE." },
        { name: "Word of the Phoenix (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à votre phase de Commandement, lancez 1D6 : sur 2+, D3+1 figurines de gardes du corps détruites (sauf SUPPORT WEAPON) sont ramenées dans cette unité avec tous leurs PV." },
        { name: "Herald of Ynnead",
          text: "Au début de la phase de Combat, choisissez 1 unité ennemie à portée d'engagement de cette figurine. Jusqu'à la fin de la phase, chaque fois qu'une figurine AELDARI amie attaque cette unité, vous pouvez relancer un jet de blessure de 1." }
      ],
      composition: "1 Yvraine"
    },

    /* ---------- Héros monstres épiques ---------- */

    {
      id: "the-yncarne",
      name: "The Yncarne",
      category: "epic-monster",
      base: "80mm",
      keywords: ["Monster", "Character", "Epic Hero", "Aeldari", "Fly", "Psyker", "Daemon", "The Yncarne", "Ynnari"],
      stats: { M: "10\"", T: 10, Sv: "2+", W: 12, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 230 }] }],
      exclusiveEpic: "Ynnari",                     // Avatar of the Whispering God
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "swirling-soul-energy", name: "Swirling soul energy", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "7", AP: "-1", D: "D3", abilities: ["ignores-cover", "psychic", "torrent"] }] },
        { id: "vilith-zhar", name: "Vilith-zhar", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "2+", S: "12", AP: "-4", D: "D6+1", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "10", skill: "2+", S: "6",  AP: "-4", D: "1",    abilities: [] }
          ] }
      ],
      loadout: ["swirling-soul-energy", "vilith-zhar"],
      abilities: [
        { name: "Avatar of the Whispering God",
          text: "Si votre armée inclut THE YNCARNE, elle ne peut inclure aucune unité EPIC HERO (sauf unités YNNARI). Si votre armée inclut des unités EPIC HERO (sauf unités YNNARI), elle ne peut pas inclure THE YNCARNE." },
        { name: "Inevitable Death", usage: "une-fois-par-tour",
          text: "Une fois à chaque tour adverse, si cette figurine est sur le champ de bataille quand une autre unité AELDARI amie est détruite, juste après le retrait de la dernière figurine de cette unité, vous pouvez retirer cette figurine du champ de bataille et la replacer aussi près que possible de l'endroit où cette dernière figurine a été détruite, hors de portée d'engagement de toute unité ennemie. Cela ne l'empêche pas d'être éligible pour se déplacer." },
        { name: "Ethereal Form",
          text: "Chaque fois que cette figurine détruit une unité ennemie, elle récupère jusqu'à D3 PV perdus." }
      ],
      composition: "1 The Yncarne"
    },

    /* ---------- Personnages d'infanterie ---------- */

    {
      id: "ynnari-archon",
      name: "Ynnari Archon",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Aeldari", "Archon", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "4+", W: 4, Ld: "6+", OC: 1, InSv: "2+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 85 }] }],
      leader: { canLead: ["Ynnari Incubi", "Ynnari Kabalite Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "blast-pistol", name: "Blast pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "D3", abilities: ["pistol"] }] },
        { id: "splinter-pistol", name: "Splinter pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "pistol"] }] },
        { id: "huskblade", name: "Huskblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "3", AP: "-2", D: "2", abilities: ["anti:Infanterie 3+"] }] }
      ],
      wargear: [{ id: "shadow-field", name: "Shadow field" }],
      loadout: ["splinter-pistol", "huskblade", "shadow-field"],
      options: [
        { id: "remplace-pistol", text: "Le splinter pistol peut être remplacé par 1 blast pistol.",
          replaces: ["splinter-pistol"], choices: [["blast-pistol"]] }
      ],
      abilities: [
        { name: "Overlord", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité attaque, relancez un jet de blessure de 1. Tant que cette unité est en dessous de son effectif initial, vous pouvez relancer le jet de blessure à la place." },
        { name: "Reborn Mastermind", usage: "une-fois-par-round",
          text: "Une fois par round, une figurine de votre armée qui a cette aptitude peut l'utiliser quand son unité est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Shadow Field", requiresWargear: "shadow-field",
          text: "Vous ne pouvez pas relancer les sauvegardes invulnérables du porteur. La première fois qu'une sauvegarde invulnérable du porteur est ratée, il n'a plus de sauvegarde invulnérable jusqu'à la fin de la bataille." }
      ],
      composition: "1 Archon"
    },

    {
      id: "ynnari-succubus",
      name: "Ynnari Succubus",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Succubus", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 45 }] }],
      leader: { canLead: ["Ynnari Wyches"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "blast-pistol", name: "Blast pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "D3", abilities: ["pistol"] }] },
        { id: "splinter-pistol", name: "Splinter pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "pistol"] }] },
        { id: "succubus-weapons", name: "Succubus weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "3", AP: "-2", D: "1", abilities: ["anti:Infanterie 3+"] }] }
      ],
      loadout: ["succubus-weapons"],
      options: [
        { id: "pistolet", text: "Cette figurine peut être équipée de 1 blast pistol ou de 1 splinter pistol.",
          choices: [["blast-pistol"], ["splinter-pistol"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Storm of Blades", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes de mêlée des figurines de cette unité ont [TOUCHES SOUTENUES 1]." },
        { name: "Empowered by Death",
          text: "Au début de la phase de Combat, si l'unité de cette figurine est en dessous de son effectif initial, jusqu'à la fin de la phase, ses figurines ont l'aptitude Combat en Premier." }
      ],
      composition: "1 Succubus"
    },

    /* ---------- Ligne ---------- */

    {
      id: "ynnari-kabalite-warriors",
      name: "Ynnari Kabalite Warriors",
      category: "battleline",
      base: "25mm",
      keywords: ["Infantry", "Battleline", "Aeldari", "Kabalite Warriors", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 2, InSv: "6+" },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 110 }] }],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "blast-pistol", name: "Blast pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "D3", abilities: ["pistol"] }] },
        { id: "blaster", name: "Blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6+1", abilities: ["assault"] }] },
        { id: "dark-lance", name: "Dark lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+2", abilities: ["heavy"] }] },
        { id: "shredder", name: "Shredder", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "N/A", S: "6", AP: "0", D: "1", abilities: ["assault", "torrent"] }] },
        { id: "splinter-cannon", name: "Splinter cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "3", AP: "-1", D: "2", abilities: ["anti:Infanterie 3+", "heavy", "sustained-hits:1"] }] },
        { id: "splinter-pistol", name: "Splinter pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "pistol"] }] },
        { id: "splinter-rifle", name: "Splinter rifle", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "sybarite-weapon", name: "Sybarite weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "-1", D: "1", abilities: ["anti:Infanterie 3+"] }] }
      ],
      wargear: [{ id: "phantasm-grenade-launcher", name: "Phantasm grenade launcher" }],
      models: [
        { id: "sybarite",         name: "Sybarite",         count: 1,       loadout: ["splinter-rifle", "close-combat-weapon"] },
        { id: "kabalite-warrior", name: "Kabalite Warrior", count: "reste", loadout: ["splinter-rifle", "close-combat-weapon"] }
      ],
      options: [
        { id: "syb-melee", model: "sybarite", text: "La close combat weapon du Sybarite peut être remplacée par 1 Sybarite weapon.",
          replaces: ["close-combat-weapon"], choices: [["sybarite-weapon"]] },
        { id: "syb-phantasm", model: "sybarite", text: "Le Sybarite peut être équipé de 1 phantasm grenade launcher.",
          choices: [["phantasm-grenade-launcher"]], max: { count: 1 } },
        { id: "syb-rifle", model: "sybarite", text: "Le splinter rifle du Sybarite peut être remplacé par 1 blast pistol ou 1 splinter pistol.",
          replaces: ["splinter-rifle"], choices: [["blast-pistol"], ["splinter-pistol"]] },
        { id: "blaster", model: "kabalite-warrior", text: "Le splinter rifle d'1 Kabalite Warrior peut être remplacé par 1 blaster.",
          replaces: ["splinter-rifle"], choices: [["blaster"]], max: { count: 1 } },
        { id: "dark-lance", model: "kabalite-warrior", text: "Le splinter rifle d'1 Kabalite Warrior peut être remplacé par 1 dark lance.",
          replaces: ["splinter-rifle"], choices: [["dark-lance"]], max: { count: 1 } },
        { id: "shredder", model: "kabalite-warrior", text: "Le splinter rifle d'1 Kabalite Warrior peut être remplacé par 1 shredder.",
          replaces: ["splinter-rifle"], choices: [["shredder"]], max: { count: 1 } },
        { id: "splinter-cannon", model: "kabalite-warrior", text: "Le splinter rifle d'1 Kabalite Warrior peut être remplacé par 1 splinter cannon.",
          replaces: ["splinter-rifle"], choices: [["splinter-cannon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Sadistic Raiders",
          text: "À la fin de votre phase de Commandement, si vous contrôlez un pion objectif à portée duquel se trouve cette unité (ou un TRANSPORT dans lequel elle est embarquée), ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Phantasm Grenade Launcher", requiresWargear: "phantasm-grenade-launcher",
          text: "L'unité du porteur a le mot-clé GRENADES." }
      ],
      composition: "1 Sybarite et 9 Kabalite Warriors"
    },

    {
      id: "ynnari-wyches",
      name: "Ynnari Wyches",
      category: "battleline",
      base: "25mm",
      keywords: ["Infantry", "Battleline", "Aeldari", "Grenades", "Wyches", "Ynnari"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 1, Ld: "6+", OC: 2, InSv: "6+" },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 90 }] }],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "blast-pistol", name: "Blast pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D3", abilities: ["pistol"] }] },
        { id: "splinter-pistol", name: "Splinter pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "pistol"] }] },
        { id: "hekatarii-blade", name: "Hekatarii blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "-1", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "hekatrix", name: "Hekatrix", count: 1,       loadout: ["splinter-pistol", "hekatarii-blade"] },
        { id: "wych",     name: "Wych",     count: "reste", loadout: ["splinter-pistol", "hekatarii-blade"] }
      ],
      options: [
        { id: "hek-pistol", model: "hekatrix", text: "Le splinter pistol de l'Hekatrix peut être remplacé par 1 blast pistol.",
          replaces: ["splinter-pistol"], choices: [["blast-pistol"]] }
      ],
      abilities: [
        { name: "Sauvegarde invulnérable",
          text: "La sauvegarde invulnérable de ces figurines est de 6+, et de 4+ contre les attaques de mêlée." },
        { name: "No Escape",
          text: "Chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) à portée d'engagement d'une ou plusieurs unités de votre armée avec cette aptitude est choisie pour Battre en Retraite, toutes ses figurines doivent faire un test de Fuite Désespérée, en soustrayant 1 au résultat si cette unité ennemie est Ébranlée." }
      ],
      composition: "1 Hekatrix et 9 Wyches"
    },
    /* ---------- Infanterie ---------- */

    {
      id: "ynnari-incubi",
      name: "Ynnari Incubi",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Incubi", "Ynnari"],
      stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Incubi",  stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Klaivex", stats: { M: "7\"", T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 80 },  { from: 3, pts: 90 }] },
        { models: 10, costs: [{ from: 1, pts: 160 }, { from: 3, pts: 170 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "demiklaives", name: "Demiklaives", type: "melee",
          profiles: [
            { name: "single blade", range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-2", D: "2", abilities: [] },
            { name: "dual blades",  range: "Mêlée", A: "6", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["twin-linked"] }
          ] },
        { id: "klaive", name: "Klaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "klaivex", name: "Klaivex", count: 1,       loadout: ["klaive"] },
        { id: "incubi",  name: "Incubi",  count: "reste", loadout: ["klaive"] }
      ],
      options: [
        { id: "klaivex", model: "klaivex", text: "Le klaive du Klaivex peut être remplacé par 1 demiklaives.",
          replaces: ["klaive"], choices: [["demiklaives"]] }
      ],
      abilities: [
        { name: "Tormentors",
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement d'une ou plusieurs unités de votre armée ayant cette aptitude doit faire un test d'Ébranlement." }
      ],
      composition: "1 Klaivex et 4 à 9 Incubi"
    },
    /* ---------- Montés ---------- */

    {
      id: "ynnari-reavers",
      name: "Ynnari Reavers",
      category: "mounted",
      base: "32mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Reavers", "Ynnari"],
      stats: { M: "16\"", T: 4, Sv: "4+", W: 2, Ld: "6+", OC: 2, InSv: "6+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 65 }] },
        { models: 6, costs: [{ from: 1, pts: 120 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "blaster", name: "Blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6+1", abilities: ["assault"] }] },
        { id: "heat-lance", name: "Heat lance", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "14", AP: "-4", D: "D6", abilities: ["assault", "melta:3"] }] },
        { id: "splinter-pistol", name: "Splinter pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "pistol"] }] },
        { id: "splinter-rifle", name: "Splinter rifle", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault"] }] },
        { id: "agoniser", name: "Agoniser", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "3", AP: "-1", D: "1", abilities: ["anti:Infanterie 3+"] }] },
        { id: "bladevanes", name: "Bladevanes", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      wargear: [
        { id: "grav-talon", name: "Grav-talon" },
        { id: "cluster-caltrops", name: "Cluster caltrops" }
      ],
      models: [
        { id: "arena-champion", name: "Arena Champion", count: 1,       loadout: ["splinter-pistol", "splinter-rifle", "bladevanes"] },
        { id: "reaver",         name: "Reaver",         count: "reste", loadout: ["splinter-pistol", "splinter-rifle", "bladevanes"] }
      ],
      options: [
        { id: "agoniser", model: "arena-champion", text: "L'Arena Champion peut être équipé de 1 agoniser.",
          choices: [["agoniser"]], max: { count: 1 } },
        { id: "special", text: "Pour chaque tranche de 3 figurines, le splinter rifle d'1 figurine peut être remplacé par 1 blaster ou 1 heat lance.",
          replaces: ["splinter-rifle"], choices: [["blaster"], ["heat-lance"]], max: { per: 3, count: 1 } },
        { id: "equipement", text: "Pour chaque tranche de 3 figurines, 1 figurine peut être équipée de 1 grav-talon ou 1 cluster caltrops.",
          choices: [["grav-talon"], ["cluster-caltrops"]], max: { per: 3, count: 1 } }
      ],
      abilities: [
        { name: "Eviscerating Fly-by",
          text: "Chaque fois que cette unité finit un Mouvement Normal, vous pouvez choisir 1 unité ennemie (sauf MONSTER et VEHICLE) qu'elle a survolée pendant ce mouvement, puis lancer 1D6 par figurine de cette unité : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle." },
        { name: "Cluster Caltrops", requiresWargear: "cluster-caltrops",
          text: "Chaque fois que vous lancez les dés de l'aptitude Eviscerating Fly-by de cette unité, vous pouvez relancer 1D6 par figurine de l'unité équipée de cluster caltrops." },
        { name: "Grav-talon", requiresWargear: "grav-talon",
          text: "Les armes de mêlée du porteur ont [LANCE]." }
      ],
      composition: "1 Arena Champion et 2 à 5 Reavers"
    },

    /* ---------- Transports assignés ---------- */

    {
      id: "ynnari-raider",
      name: "Ynnari Raider",
      category: "dedicated-transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Transport", "Dedicated Transport", "Fly", "Frame", "Raider", "Ynnari"],
      stats: { M: "14\"", T: 8, Sv: "4+", W: 10, Ld: "6+", OC: 2, InSv: "6+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }, { from: 4, pts: 80 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike", "firing-deck:11"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "dark-lance", name: "Dark lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "disintegrator-cannon", name: "Disintegrator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "bladevanes", name: "Bladevanes", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["dark-lance", "bladevanes"],
      options: [
        { id: "remplace-lance", text: "La dark lance peut être remplacée par 1 disintegrator cannon.",
          replaces: ["dark-lance"], choices: [["disintegrator-cannon"]] }
      ],
      transport: {
        capacity: 11,
        allowed: [["The Visarch"], ["Ynnari Archon"], ["Ynnari Incubi"], ["Ynnari Kabalite Warriors"], ["Ynnari Succubus"], ["Ynnari Wyches"], ["Yvraine"]],
        text: "Capacité de transport de 11 figurines des unités suivantes : THE VISARCH, YNNARI ARCHON, YNNARI INCUBI, YNNARI KABALITE WARRIORS, YNNARI SUCCUBUS, YNNARI WYCHES, YVRAINE."
      },
      abilities: [
        { name: "Aethersails",
          text: "Chaque fois que cette figurine Avance, ne faites pas de jet d'Avance : jusqu'à la fin de la phase, ajoutez 6\" à son Mouvement." }
      ],
      composition: "1 Raider"
    },

    {
      id: "ynnari-venom",
      name: "Ynnari Venom",
      category: "dedicated-transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Transport", "Dedicated Transport", "Fly", "Frame", "Venom", "Ynnari"],
      stats: { M: "14\"", T: 6, Sv: "4+", W: 6, Ld: "6+", OC: 1, InSv: "6+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }, { from: 4, pts: 75 }] }],
      coreAbilities: ["deadly-demise:1", "deep-strike", "firing-deck:6", "stealth"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "splinter-cannon", name: "Splinter cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "3", AP: "-1", D: "2", abilities: ["anti:Infanterie 3+", "sustained-hits:1"] }] },
        { id: "twin-splinter-rifle", name: "Twin splinter rifle", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "2", AP: "0", D: "1", abilities: ["anti:Infanterie 3+", "assault", "rapid-fire:1", "twin-linked"] }] },
        { id: "bladevanes", name: "Bladevanes", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["splinter-cannon", "twin-splinter-rifle", "bladevanes"],
      options: [
        { id: "remplace-rifle", text: "Le twin splinter rifle peut être remplacé par 1 splinter cannon.",
          replaces: ["twin-splinter-rifle"], choices: [["splinter-cannon"]] }
      ],
      transport: {
        capacity: 6,
        allowed: [["The Visarch"], ["Ynnari Archon"], ["Ynnari Incubi"], ["Ynnari Kabalite Warriors"], ["Ynnari Succubus"], ["Ynnari Wyches"], ["Yvraine"]],
        text: "Capacité de transport de 6 figurines des unités suivantes : THE VISARCH, YNNARI ARCHON, YNNARI INCUBI, YNNARI KABALITE WARRIORS, YNNARI SUCCUBUS, YNNARI WYCHES, YVRAINE."
      },
      abilities: [
        { name: "Lithe Embarkation",
          text: "À la fin de la phase de Combat, si aucune figurine n'est embarquée dans ce TRANSPORT, vous pouvez choisir 1 unité YNNARI INFANTRY amie de 6 figurines ou moins, composée uniquement de figurines des unités listées dans sa capacité de transport, et entièrement à 6\" ou moins de lui. Sauf si elle est à portée d'engagement d'une ou plusieurs unités ennemies, elle peut embarquer dans ce TRANSPORT, même à un tour où elle en a débarqué." },
        { name: "Unité scindée",
          text: "Avant la bataille, au début de l'étape de Déclaration des Formations de Bataille, vous pouvez choisir 1 unité YNNARI KABALITE WARRIORS ou YNNARI WYCHES de votre armée qui n'a pas déjà été scindée. Elle est scindée en deux unités d'effectifs aussi égaux que possible (notez quelles figurines forment chaque unité). L'une doit commencer la bataille embarquée dans ce TRANSPORT ; l'autre peut commencer embarquée dans un autre TRANSPORT, ou être déployée comme une unité séparée." }
      ],
      composition: "1 Venom"
    }
  ]
});
