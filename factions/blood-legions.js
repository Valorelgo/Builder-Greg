/* =========================================================
   BLOOD LEGIONS — démons de Khorne
   Fichier auxiliaire : chargé seulement quand un détachement
   le débloque (Démoniaux de Khorne pour les World Eaters).
   Même principe que legions-of-excess.js (Emperor's Children).
   Noms en anglais, textes en français.
   ========================================================= */

Factions.register({
  id: "blood-legions",
  name: "Blood Legions",
  keyword: "Blood Legions",
  auxiliary: true,

  armyRules: [
    {
      id: "pacte-de-sang",
      name: "Pacte de Sang",
      nameEn: "Pact of Blood",
      text: [
        "Par des actes de violence frénétique et de sauvagerie sans frein, les World Eaters peuvent ouvrir une déchirure dans la réalité, laissant les démons de Khorne se déverser de ce domaine infernal.",
        "Quand vous rassemblez votre armée, sauf mention contraire, vous ne pouvez pas choisir BLOOD LEGIONS comme Faction d'Armée : ces unités s'ajoutent à une armée WORLD EATERS grâce au détachement qui les débloque."
      ]
    }
  ],

  units: [

    /* ---------- Héros monstres épiques ---------- */
    {
      id: "skarbrand",
      name: "Skarbrand",
      category: "epic-monster",
      base: "100mm",
      keywords: ["Monster", "Character", "Epic Hero", "Chaos", "Khorne", "Daemon", "Summoned", "Skarbrand"],
      stats: { M: "10\"", T: 11, Sv: "3+", W: 20, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 315 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["pacte-de-sang"],
      weapons: [
        { id: "bellow-of-endless-fury", name: "Bellow of endless fury", type: "ranged",
          profiles: [{ range: "12\"", A: "2D6", skill: "N/A", S: "8", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "slaughter-and-carnage", name: "Slaughter and Carnage", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "8",  skill: "2+", S: "16", AP: "-4", D: "6", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "16", skill: "2+", S: "8",  AP: "-2", D: "2", abilities: [] }
          ] }
      ],
      loadout: ["bellow-of-endless-fury", "slaughter-and-carnage"],
      abilities: [
        { name: "Rage Embodied (Aura)",
          text: "Tant qu'une unité BLOOD LEGIONS amie est à 6\" ou moins de cette figurine, ajoutez 1 à la caractéristique d'Attaques des armes de mêlée de ses figurines." },
        { name: "Murderlust",
          text: "Cette unité est éligible pour déclarer une charge à un tour où elle a Avancé." }
      ],
      damaged: { range: "1-7", text: "Tant que cette figurine a 1 à 7 PV restants, ajoutez 2 à la caractéristique d'Attaques de ses armes de mêlée." },
      composition: "1 Skarbrand"
    },

    /* ---------- Personnages monstres ---------- */
    {
      id: "bloodthirster",
      name: "Bloodthirster",
      category: "char-monster",
      base: "120 x 92mm",
      keywords: ["Monster", "Character", "Fly", "Chaos", "Daemon", "Khorne", "Summoned", "Bloodthirster"],
      stats: { M: "12\"", T: 11, Sv: "3+", W: 18, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 320 }, { from: 3, pts: 335 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["pacte-de-sang"],
      weapons: [
        { id: "bloodflail", name: "Bloodflail", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "16", AP: "-3", D: "D6+1", abilities: ["devastating-wounds"] }] },
        { id: "hellfire-breath", name: "Hellfire breath", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "lash-of-khorne", name: "Lash of Khorne", type: "ranged",
          profiles: [{ range: "12\"", A: "9", skill: "2+", S: "8", AP: "-1", D: "2", abilities: [] }] },
        { id: "axe-of-khorne", name: "Axe of Khorne", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "8",  skill: "2+", S: "14", AP: "-4", D: "D3+1", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "16", skill: "2+", S: "8",  AP: "-2", D: "1",    abilities: [] }
          ] },
        { id: "great-axe-of-khorne", name: "Great axe of Khorne", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "7",  skill: "2+", S: "16", AP: "-4", D: "D6+2", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "10", AP: "-2", D: "2",    abilities: [] }
          ] }
      ],
      loadout: ["hellfire-breath", "great-axe-of-khorne"],
      options: [
        { id: "hache", text: "La great axe of Khorne peut être remplacée par 1 axe of Khorne et 1 bloodflail, ou par 1 axe of Khorne et 1 lash of Khorne.",
          replaces: ["great-axe-of-khorne"], choices: [["axe-of-khorne", "bloodflail"], ["axe-of-khorne", "lash-of-khorne"]] }
      ],
      abilities: [
        { name: "Daemon Lord of Khorne (Aura)",
          text: "Tant qu'une unité BLOOD LEGIONS amie est à 6\" ou moins de cette figurine, chaque fois qu'une de ses figurines fait une attaque de mêlée, ajoutez 1 au jet de touche." },
        { name: "Relentless Carnage",
          text: "À la fin de la phase de Combat, vous pouvez choisir 1 unité ennemie à portée d'engagement de cette figurine et lancer huit D6 : pour chaque 4+, cette unité subit 1 blessure mortelle." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Bloodthirster"
    },

    /* ---------- Ligne ---------- */
    {
      id: "bloodletters",
      name: "Bloodletters",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Chaos", "Daemon", "Khorne", "Summoned", "Bloodletters"],
      stats: { M: "8\"", T: 4, Sv: "7+", W: 1, Ld: "7+", OC: 1, InSv: "5+" },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 90 }] }],
      coreAbilities: ["deep-strike"],
      armyRules: ["pacte-de-sang"],
      weapons: [
        { id: "hellblade", name: "Hellblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [
        { id: "instrument-of-chaos", name: "Instrument of Chaos" },
        { id: "daemonic-icon", name: "Daemonic icon" }
      ],
      models: [
        { id: "bloodreaper",  name: "Bloodreaper",  count: 1,       loadout: ["hellblade"] },
        { id: "bloodletter",  name: "Bloodletter",  count: "reste", loadout: ["hellblade"] }
      ],
      options: [
        { id: "instrument", model: "bloodletter", text: "1 Bloodletter sans daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "bloodletter", text: "1 Bloodletter sans instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Bane of Cowards",
          text: "Chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) à portée d'engagement d'une ou plusieurs unités de votre armée ayant cette aptitude Bat en Retraite, ses figurines doivent faire des tests de Fuite Désespérée. Si cette unité ennemie est aussi Ébranlée, soustrayez 1 à chacun de ces tests." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Bloodreaper et 9 Bloodletters"
    },

    /* ---------- Bêtes ---------- */
    {
      id: "flesh-hounds",
      name: "Flesh Hounds",
      category: "beasts",
      base: "60 x 35,5mm",
      keywords: ["Beast", "Chaos", "Daemon", "Khorne", "Summoned", "Flesh Hounds"],
      stats: { M: "12\"", T: 4, Sv: "7+", W: 2, Ld: "7+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 75 }] },
        { models: 10, costs: [{ from: 1, pts: 150 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["pacte-de-sang"],
      weapons: [
        { id: "burning-roar", name: "Burning roar", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "gore-drenched-fangs", name: "Gore-drenched fangs", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "collar-of-khorne", name: "Collar of Khorne" }],
      models: [
        { id: "gore-hound",  name: "Gore Hound",  count: 1,       loadout: ["burning-roar", "gore-drenched-fangs", "collar-of-khorne"] },
        { id: "flesh-hound", name: "Flesh Hound", count: "reste", loadout: ["gore-drenched-fangs", "collar-of-khorne"] }
      ],
      abilities: [
        { name: "Hunters from the Warp",
          text: "À la fin du tour adverse, si cette unité n'est pas à portée d'engagement d'une ou plusieurs unités ennemies, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques." },
        { name: "Collar of Khorne", requiresWargear: "collar-of-khorne",
          text: "Le porteur a l'aptitude Insensible à la Douleur 3+ contre les Attaques Psychiques." }
      ],
      composition: "1 Gore Hound et 4 à 9 Flesh Hounds"
    },

    /* ---------- Montés ---------- */
    {
      id: "bloodcrushers",
      name: "Bloodcrushers",
      category: "mounted",
      base: "90 x 52mm",
      keywords: ["Mounted", "Chaos", "Daemon", "Khorne", "Summoned", "Bloodcrushers"],
      stats: { M: "10\"", T: 7, Sv: "3+", W: 4, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 95 },  { from: 3, pts: 115 }] },
        { models: 6, costs: [{ from: 1, pts: 190 }, { from: 3, pts: 210 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["pacte-de-sang"],
      weapons: [
        { id: "hellblade", name: "Hellblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "bladed-horn", name: "Juggernaut's bladed horn", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "6", AP: "-1", D: "1", abilities: ["extra-attacks", "lance"] }] }
      ],
      wargear: [
        { id: "instrument-of-chaos", name: "Instrument of Chaos" },
        { id: "daemonic-icon", name: "Daemonic icon" }
      ],
      models: [
        { id: "bloodhunter",  name: "Bloodhunter",  count: 1,       loadout: ["hellblade", "bladed-horn"] },
        { id: "bloodcrusher", name: "Bloodcrusher", count: "reste", loadout: ["hellblade", "bladed-horn"] }
      ],
      options: [
        { id: "instrument", model: "bloodcrusher", text: "1 Bloodcrusher sans daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "bloodcrusher", text: "1 Bloodcrusher sans instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Brass Stampede",
          text: "Chaque fois que cette unité finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 par figurine de cette unité : pour chaque 4+, cette unité ennemie subit D3 blessures mortelles." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Bloodhunter et 2 à 5 Bloodcrushers"
    }
  ]
});
