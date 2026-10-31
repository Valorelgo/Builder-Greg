/* =========================================================
   LEGIONS OF EXCESS — démons de Slaanesh
   Fichier auxiliaire : chargé seulement quand un détachement
   le débloque (Carnival of Excess pour les Emperor's Children).
   Noms en anglais, textes en français.
   ========================================================= */

Factions.register({
  id: "legions-of-excess",
  name: "Legions of Excess",
  keyword: "Legions of Excess",
  auxiliary: true,

  armyRules: [
    {
      id: "pact-of-excess",
      name: "Pact of Excess",
      nameEn: "Pact of Excess",
      text: ["Les unités LEGIONS OF EXCESS ne peuvent pas constituer une faction d'armée à elles seules : elles s'ajoutent à une armée dont la faction reste EMPEROR'S CHILDREN, grâce au détachement qui les débloque."]
    }
  ],

  units: [

    /* ---------- Héros monstres épiques ---------- */
    {
      id: "shalaxi-helbane",
      name: "Shalaxi Helbane",
      category: "epic-monster",
      base: "100mm",
      keywords: ["Monster", "Character", "Epic Hero", "Psyker", "Chaos", "Daemon", "Summoned", "Slaanesh", "Shalaxi Helbane"],
      stats: { M: "14\"", T: 10, Sv: "3+", W: 20, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 315 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["pact-of-excess"],
      weapons: [
        { id: "lash-of-slaanesh", name: "Lash of Slaanesh", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "6", AP: "-1", D: "2", abilities: ["assault"] }] },
        { id: "pavane-of-slaanesh", name: "Pavane of Slaanesh", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "18\"", A: "D6", skill: "2+", S: "9", AP: "-1", D: "D3", abilities: ["devastating-wounds", "psychic"] },
            { name: "focused witchfire", range: "18\"", A: "D6", skill: "2+", S: "9", AP: "-2", D: "D3", abilities: ["hazardous", "devastating-wounds", "psychic", "sustained-hits:3"] }
          ] },
        { id: "snapping-claws", name: "Snapping claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-2", D: "3", abilities: ["devastating-wounds", "extra-attacks"] }] },
        { id: "soulpiercer", name: "Soulpiercer", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "12", AP: "-3", D: "D6+2", abilities: ["precision"] }] }
      ],
      loadout: ["lash-of-slaanesh", "pavane-of-slaanesh", "snapping-claws", "soulpiercer"],
      abilities: [
        { name: "No Prey Can Evade",
          text: "Vous pouvez relancer les jets d'Avance et de Charge de cette figurine." },
        { name: "Monarch of the Hunt",
          text: "Au début du premier round de bataille, choisissez 1 unité ennemie : c'est la proie de cette figurine. Chaque fois que cette figurine fait une attaque de mêlée qui cible sa proie, vous pouvez relancer le jet de touche et le jet de blessure. Chaque fois que sa proie est détruite, choisissez une nouvelle unité ennemie comme proie." }
      ],
      damaged: { range: "1-7", text: "Tant que cette figurine a 1 à 7 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Shalaxi Helbane"
    },

    /* ---------- Personnages monstres ---------- */
    {
      id: "keeper-of-secrets",
      name: "Keeper of Secrets",
      category: "char-monster",
      base: "100mm",
      keywords: ["Monster", "Character", "Psyker", "Chaos", "Daemon", "Summoned", "Slaanesh", "Keeper of Secrets"],
      stats: { M: "14\"", T: 10, Sv: "5+", W: 18, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 265 }, { from: 3, pts: 280 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["pact-of-excess"],
      weapons: [
        { id: "living-whip", name: "Living whip", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "6", AP: "-1", D: "2", abilities: ["assault"] }] },
        { id: "phantasmagoria", name: "Phantasmagoria", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "18\"", A: "6", skill: "2+", S: "6", AP: "-2", D: "1", abilities: ["devastating-wounds", "psychic"] },
            { name: "focused witchfire", range: "18\"", A: "9", skill: "2+", S: "6", AP: "-2", D: "1", abilities: ["devastating-wounds", "hazardous", "psychic"] }
          ] },
        { id: "ritual-knife", name: "Ritual knife", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["extra-attacks"] }] },
        { id: "snapping-claws", name: "Snapping claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-2", D: "3", abilities: ["devastating-wounds", "extra-attacks"] }] },
        { id: "witstealer-sword", name: "Witstealer sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "8", AP: "-2", D: "3", abilities: [] }] }
      ],
      wargear: [{ id: "shining-aegis", name: "Shining aegis" }],
      loadout: ["phantasmagoria", "snapping-claws", "witstealer-sword"],
      options: [
        { id: "equipement", text: "Cette figurine peut être équipée d'un des éléments suivants : living whip, ritual knife ou shining aegis.",
          choices: [["living-whip"], ["ritual-knife"], ["shining-aegis"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Daemon Lord of Slaanesh (Aura)",
          text: "Tant qu'une unité LEGIONS OF EXCESS amie est à 6\" ou moins de cette figurine, améliorez de 1 la Pénétration d'Armure des armes de mêlée de ses figurines." },
        { name: "Mesmerising Form",
          text: "Chaque fois qu'une attaque cible cette figurine, soustrayez 1 au jet de touche." },
        { name: "Shining Aegis", requiresWargear: "shining-aegis",
          text: "Le porteur a une caractéristique de Sauvegarde de 3+." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Keeper of Secrets"
    },

    /* ---------- Ligne ---------- */
    {
      id: "daemonettes",
      name: "Daemonettes",
      category: "battleline",
      base: "25mm",
      keywords: ["Infantry", "Battleline", "Chaos", "Daemon", "Summoned", "Slaanesh", "Daemonettes"],
      stats: { M: "9\"", T: 3, Sv: "7+", W: 1, Ld: "7+", OC: 1, InSv: "5+" },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 100 }] }],
      coreAbilities: ["deep-strike", "fights-first"],
      armyRules: ["pact-of-excess"],
      weapons: [
        { id: "slashing-claws", name: "Slashing claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [
        { id: "instrument-of-chaos", name: "Instrument of Chaos" },
        { id: "daemonic-icon", name: "Daemonic icon" }
      ],
      models: [
        { id: "alluress",   name: "Alluress",   count: 1,       loadout: ["slashing-claws"] },
        { id: "daemonette", name: "Daemonette", count: "reste", loadout: ["slashing-claws"] }
      ],
      options: [
        { id: "instrument", model: "daemonette", text: "1 Daemonette sans daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "daemonette", text: "1 Daemonette sans instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Horrifying Beauty",
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement d'une ou plusieurs unités de votre armée ayant cette aptitude doit faire un test d'Ébranlement, en soustrayant 1 au résultat si elle est en dessous de la moitié de son effectif." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Alluress et 9 Daemonettes"
    },

    /* ---------- Bêtes ---------- */
    {
      id: "fiends",
      name: "Fiends",
      category: "beasts",
      base: "75 x 42mm",
      keywords: ["Beast", "Chaos", "Daemon", "Summoned", "Slaanesh", "Fiends"],
      stats: { M: "12\"", T: 5, Sv: "7+", W: 4, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 90 }] },
        { models: 6, costs: [{ from: 1, pts: 190 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["pact-of-excess"],
      weapons: [
        { id: "barbed-tail-and-dissecting-claws", name: "Barbed tail and dissecting claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["barbed-tail-and-dissecting-claws"],
      abilities: [
        { name: "Soporific Musk",
          text: "Chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) à portée d'engagement d'une ou plusieurs unités de votre armée ayant cette aptitude Bat en Retraite, ses figurines doivent faire des tests de Fuite Désespérée. Si cette unité ennemie est aussi Ébranlée, soustrayez 1 à chacun de ces tests." }
      ],
      composition: "1 Blissbringer et 2 à 5 Fiends"
    },

    /* ---------- Montés ---------- */
    {
      id: "seekers",
      name: "Seekers",
      category: "mounted",
      base: "60 x 35,5mm",
      keywords: ["Mounted", "Chaos", "Daemon", "Summoned", "Slaanesh", "Seekers"],
      stats: { M: "14\"", T: 4, Sv: "7+", W: 2, Ld: "7+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 85 }] },
        { models: 10, costs: [{ from: 1, pts: 155 }] }
      ],
      coreAbilities: ["deep-strike", "scouts:9\""],
      armyRules: ["pact-of-excess"],
      weapons: [
        { id: "lashing-tongue", name: "Lashing tongue", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["extra-attacks", "lethal-hits"] }] },
        { id: "slashing-claws", name: "Slashing claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [
        { id: "instrument-of-chaos", name: "Instrument of Chaos" },
        { id: "daemonic-icon", name: "Daemonic icon" }
      ],
      models: [
        { id: "heartseeker", name: "Heartseeker", count: 1,       loadout: ["lashing-tongue", "slashing-claws"] },
        { id: "seeker",      name: "Seeker",      count: "reste", loadout: ["lashing-tongue", "slashing-claws"] }
      ],
      options: [
        { id: "instrument", model: "seeker", text: "1 Seeker sans daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "seeker", text: "1 Seeker sans instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Unholy Speed",
          text: "Vous pouvez relancer les jets d'Avance et de Charge de cette unité." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Heartseeker et 4 à 9 Seekers"
    }
  ]
});
