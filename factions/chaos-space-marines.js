/* =========================================================
   CHAOS SPACE MARINES — Données de faction
   Tous les noms et textes en français (choix propre à cette faction).
   Les mots-clés internes restent en anglais (vérifications du moteur).

   ÉTAT
   - Règle d'armée Sombres Pactes : complète.
   - Règle d'armée Cultes des Dieux Sombres : complète (liste des unités de culte).
   - 17 détachements : complets (règles, optimisations, stratagèmes).
   - Unités : les 56 fiches (héros épiques, personnages, Ligne, infanterie, montés,
     transports, bêtes, marcheurs et véhicules).
   - Moteur : tous les champs ci-dessous sont pris en charge (builder, compagnon, export).

   Champs propres à cette faction :
     exclusiveGroup   : deux détachements du même groupe ne peuvent pas être pris ensemble
     removesArmyRules : règles d'armée retirées par le détachement
                        (les unités avec requiresArmyRule correspondant deviennent interdites)
     weaponAbilities  : aptitude ajoutée à un type d'armes de toute l'armée
     grantsKeywords   : mots-clés ajoutés par un détachement ou une optimisation
     requiresCore     : aptitude de base exigée du porteur d'une optimisation
     markChoice       : choix d'une marque du Chaos par unité (Zélotes Pactisants)
     tracker.type "cible" : cible ennemie notée à la main dans le compagnon
     tracker.type "choix" : options cochées en partie (augmentations, aptitude de Huron)
     Unités : statLines, keywordsNote, countBySize, noDuplicates, sharedMax,
              requiresWeapon, requiresArmyRule, inactive, markChoice (allégeance)
   ========================================================= */

(() => {

Factions.register({
  id: "chaos-space-marines",
  name: "Chaos Space Marines",
  keyword: "Heretic Astartes",   // mot-clé requis par défaut pour toute unité

  // Règles d'armée (textes à saisir)
  armyRules: [
    {
      id: "sombres-pactes",
      name: "Sombres Pactes",
      text: [
        "Si la Faction d'Armée de votre armée est HERETIC ASTARTES, chaque fois qu'une unité avec cette aptitude est choisie pour tirer ou combattre, elle peut faire un Sombre Pacte. Dans ce cas, choisissez l'une des aptitudes suivantes : les armes de cette unité la gagnent jusqu'à la fin de la phase.",
        "• [TOUCHES FATALES]",
        "• [TOUCHES SOUTENUES 1]",
        "Chaque fois qu'une unité fait un Sombre Pacte, avant de résoudre ses attaques, elle doit faire un test de Commandement. S'il est raté, elle subit D3 blessures mortelles."
      ]
    },
    {
      // Pas de règle de jeu : elle autorise seulement les unités de culte.
      // Ces unités porteront requiresArmyRule: "cultes-des-dieux-sombres"
      // (bloquées par la Bande de Renégats, qui retire cette règle).
      id: "cultes-des-dieux-sombres",
      name: "Cultes des Dieux Sombres",
      cultUnits: ["Khorne Berzerkers", "Plague Marines", "Rubric Marines", "Noise Marines"],
      text: [
        "Votre armée peut inclure les unités dédiées à un dieu du Chaos : KHORNE BERZERKERS (Khorne), PLAGUE MARINES (Nurgle), RUBRIC MARINES (Tzeentch) et NOISE MARINES (Slaanesh)."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       BANDE DE RENÉGATS
       ------------------------------------------------------- */
    {
      id: "bande-de-renegats",
      name: "Bande de Renégats",
      cost: 2,
      dispositions: ["priority-assets"],

      // Pas de Cultes des Dieux Sombres (donc pas de Berzerkers, Noise Marines…)
      // et perte de Sombres Pactes
      removesArmyRules: ["sombres-pactes", "cultes-des-dieux-sombres"],
      weaponAbilities: [{ type: "ranged", ability: "assault" }],

      rule: {
        name: null,
        text: [
          "__Esclaves de Personne__ : les figurines HERETIC ASTARTES de votre armée perdent l'aptitude Sombres Pactes, mais leurs armes de tir gagnent l'aptitude [ASSAUT]. Vous ne pouvez pas utiliser la règle Cultes des Dieux Sombres pour inclure des unités de culte (Berzerkers, Rubricae, Plague Marines, Noise Marines…).",
          "__Vendetta__ : au début de votre phase de Commandement, choisissez 1 unité ennemie. Jusqu'à votre tour suivant, c'est votre cible de Vendetta. Chaque fois qu'une figurine HERETIC ASTARTES de votre armée (sauf DAMNED) attaque cette unité, vous pouvez relancer le jet de touche.",
          "__Doctrine Dévoyée__ : à votre phase de Mouvement, quand vous choisissez de déplacer une unité HERETIC ASTARTES non Ébranlée, elle peut suivre la doctrine. Elle doit alors faire immédiatement un test d'Ébranlement, puis, qu'il soit réussi ou raté, choisissez l'un de ces bonus jusqu'à la fin du tour :",
          "• elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite ;",
          "• elle est éligible pour déclarer une charge à un tour où elle a Avancé."
        ]
      },

      // Cible ennemie notée dans le compagnon
      tracker: {
        id: "cible-vendetta",
        type: "cible",
        label: "Cible de Vendetta",
        debutRound: "Au début de ta phase de Commandement : choisis ta cible de Vendetta.",
        bonus: "Relance des jets de touche contre elle (sauf DAMNED)."
      },

      enhancements: [
        {
          id: "la-haine-est-une-arme",
          name: "La Haine est une Arme",
          cost: 35,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          usage: "une-fois-par-round",
          text: "Une fois par round, après que votre cible de Vendetta est détruite, si le porteur est sur le champ de bataille, vous pouvez choisir 1 unité ennemie visible du porteur : elle devient votre cible de Vendetta jusqu'à ce que vous en choisissiez une nouvelle."
        },
        {
          id: "les-yeux-du-chasseur",
          name: "Les Yeux du Chasseur",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Les armes de tir des figurines de l'unité du porteur ont [IGNORE LE COUVERT]."
        },
        {
          id: "symbiote-empyreen",
          name: "Symbiote Empyréen",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Ajoutez 1 aux jets d'Avance et de Charge de l'unité du porteur."
        },
        {
          id: "trophees-fratricides",
          name: "Trophées Fratricides",
          cost: 5,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Terminator"]],
          text: "À un tour où l'unité du porteur choisit une Doctrine Dévoyée, jusqu'à la fin du tour, chaque fois qu'une figurine de cette unité attaque, vous pouvez relancer le jet de touche."
        }
      ],

      stratagems: [
        {
          id: "destruction-vengeresse",
          name: "Destruction Vengeresse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES INFANTRY (sauf DAMNED) ou MOUNTED de votre armée qui n'a pas encore été choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'elle attaque votre cible de Vendetta, ajoutez 1 au jet de blessure."
        },
        {
          id: "haine-imperissable",
          name: "Haine Impérissable",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible d'une ou plusieurs attaques de cette unité.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "jamais-a-court-d-armes",
          name: "Jamais à Court d'Armes",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée qui vient d'être choisie pour tirer ou combattre.",
          effet: "Choisissez [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1] : jusqu'à la fin de la phase, les armes de ses figurines ont cette aptitude."
        },
        {
          id: "munitions-corrompues",
          name: "Munitions Corrompues",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES de votre armée qui vient d'être choisie pour tirer.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses attaques de tir."
        },
        {
          id: "prise-de-position-renegate",
          name: "Prise de Position Renégate",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES de votre armée à portée d'un pion objectif que vous contrôlez.",
          effet: "Ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        },
        {
          id: "reactions-d-ecumeurs",
          name: "Réactions d'Écumeurs",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf MONSTER et VEHICLE) touchée par une ou plusieurs de ces attaques.",
          effet: "Elle peut faire un Mouvement Normal de D6\" maximum."
        }
      ]
    },

    /* -------------------------------------------------------
       DÉTACHEMENTS À COMPLÉTER (coûts saisis d'après le récapitulatif)
       ------------------------------------------------------- */
    /* -------------------------------------------------------
       CABALE DU CHAOS
       ------------------------------------------------------- */
    {
      id: "cabale-du-chaos",
      name: "Cabale du Chaos",
      cost: 1,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "À votre phase de Tir, quand une unité HERETIC ASTARTES PSYKER de votre armée (sauf DAEMON) est choisie pour tirer, si elle fait un Sombre Pacte, ses attaques de tir ont +1 en Force.",
          "À la phase de Combat, quand une unité HERETIC ASTARTES DAEMON PRINCE ou DAEMON PRINCE WITH WINGS de votre armée (sauf KHORNE) est choisie pour combattre, si elle fait un Sombre Pacte, ses attaques de mêlée ont +2 en Force et +1 en Pénétration d'Armure."
        ]
      },

      enhancements: [
        {
          id: "touche-par-le-warp",
          name: "Touché par le Warp",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Khorne"],
          grantsKeywords: ["Psyker"],          // le porteur devient PSYKER
          text: "Le porteur a le mot-clé PSYKER, et ses armes ont [PSYCHIQUE]."
        },
        {
          id: "vaisseau-du-chaos",
          name: "Vaisseau du Chaos",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Daemon"]],
          excludes: ["Khorne"],
          text: "Les attaques de mêlée du porteur ont [LANCE]."
        }
      ],

      stratagems: [
        {
          id: "baigne-de-flammes-warp",
          name: "Baigné de Flammes Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité HERETIC ASTARTES PSYKER de votre armée est choisie pour tirer.",
          cible: "Cette unité.",
          effet: "Ses attaques de tir ont [IGNORE LE COUVERT]."
        },
        {
          id: "malediction-de-la-chair",
          name: "Malédiction de la Chair",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Début de votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES PSYKER de votre armée.",
          effet: "Choisissez 1 unité ennemie visible et à 12\" ou moins d'elle, puis lancez 1D6 : sur 1, elle subit 1 blessure mortelle ; sur 2-4, D3 blessures mortelles ; sur 5-6, 2D3 blessures mortelles. Ces blessures mortelles sont infligées par une attaque psychique."
        },
        {
          id: "vigueur-infernale",
          name: "Vigueur Infernale",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES PSYKER ou DAEMON de votre armée (sauf KHORNE).",
          effet: "Elle récupère jusqu'à D3+1 PV perdus."
        }
      ]
    },

    /* -------------------------------------------------------
       CULTE DU CHAOS
       « Dark Apostle » = Apôtre Noir, « Damned » = Damnés
       ------------------------------------------------------- */
    {
      id: "culte-du-chaos",
      name: "Culte du Chaos",
      cost: 2,
      dispositions: ["priority-assets"],

      rule: {
        name: "Pacte Désespéré",
        text: [
          "Chaque fois qu'une unité DAMNED avec l'aptitude Sombres Pactes fait un Mouvement Normal, une Avance ou déclare une charge (sauf si elle est arrivée des Réserves à ce tour), elle peut faire un Pacte Désespéré : elle a +2\" en Mouvement et +2 à son jet de Charge, mais elle doit faire un test de Commandement et subit D3 blessures mortelles si elle le rate."
        ]
      },

      enhancements: [
        {
          id: "aiguillon-incendiaire",
          name: "Aiguillon Incendiaire",
          cost: 25,
          kind: "optimisation",
          requires: [["Dark Apostle"], ["Damned"]],
          text: "Tant que l'unité du porteur est en dessous de son effectif initial, les figurines DAMNED de cette unité ont +1 en Force en mêlée. Si elle est aussi en dessous de la moitié de son effectif, elles ont également +1 en Attaques."
        },
        {
          id: "amulette-de-vigueur-impie",
          name: "Amulette de Vigueur Impie",
          cost: 20,
          kind: "optimisation",
          requires: [["Dark Apostle"]],
          text: "À votre phase de Commandement, vous pouvez ramener jusqu'à D3 figurines détruites (sauf CHARACTER) dans l'unité du porteur."
        },
        {
          id: "marque-du-cultiste",
          name: "Marque du Cultiste",
          cost: 30,
          kind: "optimisation",
          requires: [["Dark Apostle"], ["Damned"]],
          text: "Si toutes les autres figurines de l'unité du porteur (sauf les Sombres Disciples) sont DAMNED, l'unité du porteur peut relancer ses jets d'Avance et de Charge."
        },
        {
          id: "prescience-du-warp",
          name: "Prescience du Warp",
          cost: 10,
          kind: "optimisation",
          requires: [["Dark Apostle"], ["Damned"]],
          text: "Si le porteur mène une unité qui a l'aptitude Éclaireurs 6\", le porteur l'a aussi."
        }
      ],

      stratagems: [
        {
          id: "concentration-derangee",
          name: "Concentration Dérangée",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité DAMNED de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Elle peut faire un Pacte Désespéré. Dans ce cas, jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses armes, et ajoutez 1 à leur Force si le test du Pacte est réussi."
        },
        {
          id: "esclaves-mortels",
          name: "Esclaves Mortels",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible, avec une unité DAMNED amie à 3\" ou moins d'elle et visible à la fois d'elle et de l'unité attaquante.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque devrait faire un jet de blessure contre votre unité, s'il reste une figurine de l'unité DAMNED visible de l'attaquant et pouvant être ciblée, ne faites pas le jet : l'unité DAMNED subit à la place un nombre de blessures mortelles égal aux Dégâts de l'attaque."
        },
        {
          id: "hate-inconsciente",
          name: "Hâte Inconsciente",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité DAMNED de votre armée.",
          effet: "Elle est éligible pour déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "promis-a-la-gloire",
          name: "Promis à la Gloire",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité DAMNED de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Elle peut faire un Pacte Désespéré. Dans ce cas, jusqu'à la fin de la phase, elle peut relancer ses jets de touche ; si le test de Commandement du Pacte est réussi, elle peut aussi relancer ses jets de blessure."
        },
        {
          id: "sacrifice-infernal",
          name: "Sacrifice Infernal",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité DAMNED de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Elle peut faire un Pacte Désespéré. Dans ce cas, elle subit D3 blessures mortelles (en plus de celles d'un test du Pacte raté) et, jusqu'à la fin de la phase, ses armes de mêlée ont +1 en Attaques, et +1 en Force si le test du Pacte est réussi."
        },
        {
          id: "trepas-altruiste",
          name: "Trépas Altruiste",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité DAMNED de votre armée choisie pour cible.",
          effet: "Jusqu'à ce que l'unité attaquante ait fini ses attaques, chaque fois qu'une figurine de votre unité est détruite, lancez 1D6 : sur 6, l'unité attaquante subit 1 blessure mortelle."
        }
      ]
    },

    /* -------------------------------------------------------
       CRÉATIONS DE BILE
       tracker.type "choix" : augmentations choisies en début de bataille
       (cases à cocher dans le compagnon)
       ------------------------------------------------------- */
    {
      id: "creations-de-bile",
      name: "Créations de Bile",
      cost: 3,
      dispositions: ["take-and-hold", "purge-the-foe"],

      rule: {
        name: "Augmentations Expérimentales",
        text: [
          "Au début de la bataille, choisissez quelles augmentations sont actives pour les figurines HERETIC ASTARTES INFANTRY de votre armée (sauf DAMNED) jusqu'à la fin de la bataille : choisissez-en 1 dans la liste suivante, ou désignez-en 2 au hasard en lançant 2D6 (vous pouvez relancer un ou deux dés si FABIUS BILE est votre Seigneur de Guerre). Les résultats identiques n'ont pas d'effet supplémentaire.",
          "1 : +1 en Attaques des armes de mêlée.",
          "2 : +2\" en Mouvement.",
          "3 : +1 en CC (jets de touche de mêlée).",
          "4 : +1 en Endurance.",
          "5 : +1 en Force des armes de mêlée.",
          "6 : +1 en CT (jets de touche de tir)."
        ]
      },

      tracker: {
        id: "augmentations",
        type: "choix",
        label: "Augmentations Expérimentales",
        moment: "Début de la bataille : 1 augmentation au choix, ou 2 au hasard (2D6).",
        max: 2,
        options: [
          { n: 1, short: "+1 A en mêlée" },
          { n: 2, short: "+2\" en Mouvement" },
          { n: 3, short: "+1 CC" },
          { n: 4, short: "+1 Endurance" },
          { n: 5, short: "+1 F en mêlée" },
          { n: 6, short: "+1 CT" }
        ],
        concerne: "Figurines HERETIC ASTARTES INFANTRY (sauf DAMNED)."
      },

      enhancements: [
        {
          id: "carapace-vivante",
          name: "Carapace Vivante",
          cost: 15,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          text: "Ajoutez 1 aux PV du porteur. Le porteur a l'aptitude Insensible à la Douleur 5+."
        },
        {
          id: "cobaye-de-premier-choix",
          name: "Cobaye de Premier Choix",
          cost: 35,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          excludes: ["Damned"],
          text: "Ajoutez 1 aux Dégâts des armes de mêlée du porteur. Chaque fois que le porteur fait une attaque de mêlée, vous pouvez relancer le jet de touche."
        },
        {
          id: "heaume-d-omniscience",
          name: "Heaume d'Omniscience",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          excludes: ["Damned"],
          text: "Les unités ennemies placées sur le champ de bataille depuis les Réserves ne peuvent pas être placées à 12\" ou moins du porteur."
        },
        {
          id: "precision-chirurgicale",
          name: "Précision Chirurgicale",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Les armes de mêlée du porteur ont [PRÉCISION]."
        }
      ],

      stratagems: [
        {
          id: "autostimulants",
          name: "Autostimulants",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Début de votre phase de Charge.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "le-maitre-nous-observe",
          name: "Le Maître nous Observe",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 (−1 au résultat pour une unité DAMNED) : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "mutations-differees",
          name: "Mutations Différées",
          cp: 2,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée (sauf DAMNED).",
          effet: "Elle subit D3 blessures mortelles. Choisissez ensuite 1 Augmentation Expérimentale : jusqu'au début de votre prochaine phase de Commandement, ses figurines l'ont en plus de celles qu'elles ont déjà."
        },
        {
          id: "regeneration-diabolique",
          name: "Régénération Diabolique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée (sauf DAMNED).",
          effet: "1 figurine détruite (sauf CHARACTER) est ramenée dans l'unité. Si c'est une unité BATTLELINE, ramenez à la place D3 figurines détruites (sauf CHARACTER)."
        },
        {
          id: "specimens-pour-l-araignee",
          name: "Spécimens pour l'Araignée",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle relance ses jets de blessure contre les unités CHARACTER. Après qu'elle a combattu, si une ou plusieurs figurines CHARACTER ennemies ont été détruites par ces attaques, choisissez 1 unité ennemie à 6\" ou moins d'elle : elle doit faire un test d'Ébranlement. Si c'est le Seigneur de Guerre ennemi qui a été détruit, chaque unité ennemie à 6\" ou moins d'elle doit faire un test d'Ébranlement à la place."
        },
        {
          id: "visages-monstrueux",
          name: "Visages Monstrueux",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, soustrayez 1 au jet de touche."
        }
      ]
    },

    /* -------------------------------------------------------
       CULTE DE L'ARKIFANE
       grantsKeywords : mots-clés ajoutés à certaines unités par le détachement
       . « Soulforged » = Forge des Âmes,
       « Warpsmith » = Techmancien.
       ------------------------------------------------------- */
    {
      id: "culte-de-l-arkifane",
      name: "Culte de l'Arkifane",
      cost: 2,
      dispositions: ["priority-assets"],

      grantsKeywords: [
        { to: [["Heretic Astartes", "Vehicle"]], keywords: ["Daemon", "Soulforged"] },
        { to: [["Lord Discordant"], ["Vashtorr the Arkifane"]], keywords: ["Soulforged"] }
      ],

      rule: {
        name: null,
        text: [
          "Les unités HERETIC ASTARTES VEHICLE de votre armée gagnent le mot-clé DAEMON.",
          "Les unités HERETIC ASTARTES VEHICLE, LORD DISCORDANT et VASHTORR THE ARKIFANE de votre armée gagnent le mot-clé FORGE DES ÂMES.",
          "Les unités FORGE DES ÂMES de votre armée ont une sauvegarde invulnérable de 5+."
        ]
      },

      enhancements: [
        {
          id: "couronne-de-vrilles",
          name: "Couronne de Vrilles",
          cost: 15,
          kind: "optimisation",
          requires: [["Warpsmith"]],
          text: "Ajoutez 3\" à la portée des aptitudes Techmancien, Maître des Mécanismes et Outrager l'Esprit de la Machine du porteur."
        },
        {
          id: "fibrodjinn",
          name: "Fibrodjinn",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Au début de votre phase de Commandement, si le porteur est sur le champ de bataille, lancez 1D6 (+1 si le porteur est à portée d'un pion objectif que vous contrôlez) : sur 4+, vous gagnez 1 PC."
        },
        {
          id: "marque-de-la-forge-des-ames",
          name: "Marque de la Forge des Âmes",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Chaque fois que le porteur attaque, un jet de touche non modifié de 5+ est une Touche Critique."
        },
        {
          id: "puits-cybinfernal",
          name: "Puits Cybinfernal",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          grantsKeywords: ["Soulforged"],      // toute l'unité du porteur
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont le mot-clé FORGE DES ÂMES."
        }
      ],

      stratagems: [
        {
          id: "bienfait-du-funestefeu",
          name: "Bienfait du Funestefeu",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité FORGE DES ÂMES de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure des attaques de ses figurines."
        },
        {
          id: "gerbe-de-feu-de-la-forge",
          name: "Gerbe de Feu de la Forge",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HERETIC ASTARTES de votre armée a Avancé.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer à un tour où elle a Avancé. Si elle a le mot-clé FORGE DES ÂMES, elle est à la place éligible pour tirer et déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "offrande-d-ames",
          name: "Offrande d'Âmes",
          cp: 2,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité FORGE DES ÂMES de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité attaque une unité CHARACTER, MONSTER ou VEHICLE, vous pouvez relancer le jet de blessure."
        },
        {
          id: "patte-de-l-arkifane",
          name: "Patte de l'Arkifane",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, si elle fait un Sombre Pacte, vous pouvez choisir les deux aptitudes : ses armes gagnent [TOUCHES FATALES] et [TOUCHES SOUTENUES 1]."
        },
        {
          id: "regeneration-biomecanoide",
          name: "Régénération Biomécanoïde",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED).",
          effet: "1 figurine de cette unité récupère jusqu'à D3 PV perdus. Si l'unité a le mot-clé FORGE DES ÂMES, elle récupère à la place jusqu'à 3 PV perdus."
        },
        {
          id: "vigueur-impie",
          name: "Vigueur Impie",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité FORGE DES ÂMES de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, ajoutez 1 à l'Endurance des figurines de votre unité."
        }
      ]
    },

    /* -------------------------------------------------------
       IMPOSTEURS
       « Legionaries » = Légionnaires, « Cultist Mob » = Bande de Cultistes,
       « Possessed » = Possédés
       ------------------------------------------------------- */
    {
      id: "imposteurs",
      name: "Imposteurs",
      cost: 2,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "À l'étape de Déclaration des Formations de Bataille, vous pouvez donner l'aptitude Infiltrateurs à un certain nombre d'unités LEGIONARIES et d'unités CULTIST MOB de votre armée, ainsi qu'aux personnages (sauf EPIC HERO) qui les mènent :",
          "• Incursion : jusqu'à 2 unités de chacun de ces deux types ;",
          "• Force de Frappe : jusqu'à 3 unités de chacun de ces deux types ;",
          "• Offensive : jusqu'à 4 unités de chacun de ces deux types."
        ]
      },

      enhancements: [
        {
          id: "croc-maudit",
          name: "Croc Maudit",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          text: "Améliorez de 1 la Pénétration d'Armure des armes de mêlée du porteur. Elles ont aussi [PRÉCISION]."
        },
        {
          id: "faussete",
          name: "Fausseté",
          cost: 10,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          excludes: ["Terminator", "Jump Pack"],
          text: "Si le porteur est en Réserves, à l'étape des Renforts de l'une de vos phases de Mouvement, vous pouvez détruire 1 figurine POSSESSED ou LEGIONARIES d'une unité qui en compte encore au moins 2, et placer le porteur aussi près que possible de sa position (à portée d'engagement seulement si cette figurine l'était). Le porteur mène alors cette unité."
        },
        {
          id: "lien-entre-les-ames",
          name: "Lien Entre les Âmes",
          cost: 5,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          text: "À votre phase de Commandement, vous pouvez choisir un autre personnage HERETIC ASTARTES INFANTRY de votre armée (sauf EPIC HERO). Jusqu'à votre prochaine phase de Commandement, le porteur a le mot-clé PSYKER, ainsi que les caractéristiques et les aptitudes de ce personnage."
        },
        {
          id: "voile-d-obscurite",
          name: "Voile d'Obscurité",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          text: "Le porteur a les aptitudes Discrétion et Agent Solitaire."
        }
      ],

      stratagems: [
        {
          id: "coordonnees-brouillees",
          name: "Coordonnées Brouillées",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Début de l'étape des Renforts de la phase de Mouvement adverse.",
          cible: "1 unité HERETIC ASTARTES de votre armée.",
          effet: "Jusqu'à la fin de la phase, les unités ennemies arrivant des Réserves ne peuvent pas être placées à 12\" ou moins horizontalement d'elle."
        },
        {
          id: "detonateur",
          name: "Détonateur",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une figurine ennemie (sauf TITANIC) avec l'aptitude Destruction Fatale a été détruite.",
          cible: "1 unité HERETIC ASTARTES CHARACTER de votre armée à 18\" ou moins de cette figurine.",
          effet: "Ne lancez pas le D6 : la figurine détruite explose automatiquement."
        },
        {
          id: "de-tous-cotes",
          name: "De Tous Côtés",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Début de votre phase de Charge.",
          cible: "1 unité HERETIC ASTARTES de votre armée.",
          effet: "Jusqu'à la fin de la phase, ajoutez 1 à ses jets de Charge pour chaque autre unité HERETIC ASTARTES de votre armée qui a fait un mouvement de Charge à cette phase (+3 au maximum)."
        },
        {
          id: "eliminez-les",
          name: "Éliminez-les",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité en dessous de son effectif initial, elle peut relancer le jet de touche ; si la cible est aussi en dessous de la moitié de son effectif, elle peut également relancer le jet de blessure."
        },
        {
          id: "meandres-d-imposture",
          name: "Méandres d'Imposture",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HERETIC ASTARTES de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer à un tour où elle a Battu en Retraite."
        },
        {
          id: "poursuite-acharnee",
          name: "Poursuite Acharnée",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité HERETIC ASTARTES INFANTRY ou MOUNTED non engagée de votre armée.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        }
      ]
    },

    /* -------------------------------------------------------
       DÉVOTS DE LA DESTRUCTION
       ------------------------------------------------------- */
    {
      id: "devots-de-la-destruction",
      name: "Dévots de la Destruction",
      cost: 1,
      dispositions: ["priority-assets"],

      rule: {
        name: null,
        text: [
          "Les attaques de tir des unités HAVOCS et OBLITERATORS de votre armée ont [LOURD]."
        ]
      },

      enhancements: [
        {
          id: "l-oeil-de-l-oubli",
          name: "L'Œil de l'Oubli",
          cost: 20,
          kind: "optimisation",
          requires: [["Warpsmith"]],
          text: "Quand l'unité du porteur est choisie pour tirer, choisissez 1 unité ennemie à 24\" ou moins d'elle : elle a +6\" en portée de détection jusqu'à ce que l'unité du porteur ait fini de tirer."
        },
        {
          id: "pacte-de-destruction",
          name: "Pacte de Destruction",
          cost: 15,
          kind: "optimisation",
          requires: [["Warpsmith"]],
          text: "Quand l'unité du porteur fait un Sombre Pacte, elle peut relancer le test de Commandement. À votre phase de Tir, après qu'elle a tiré, si elle a fait un Sombre Pacte et que ces attaques ont détruit une ou plusieurs figurines ennemies, elle récupère jusqu'à 3 PV perdus."
        }
      ],

      stratagems: [
        {
          id: "collet-de-flammes",
          name: "Collet de Flammes",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité HAVOCS non engagée de votre armée.",
          cible: "Cette unité HAVOCS.",
          effet: "Elle peut faire un Mouvement Normal de D3+3\" maximum."
        },
        {
          id: "haine-imperissable-devots",      // même nom que dans la Bande de Renégats, effet différent
          name: "Haine Impérissable",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, quand une unité ennemie cible une unité HAVOCS ou OBLITERATORS de votre armée.",
          cible: "Cette unité.",
          effet: "Chaque fois qu'une attaque la cible, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."
        },
        {
          id: "prime-de-la-ruine",
          name: "Prime de la Ruine",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité HAVOCS ou OBLITERATORS de votre armée est choisie pour tirer.",
          cible: "Cette unité.",
          effet: "Si elle fait un Sombre Pacte, ses attaques de tir ont à la fois [TOUCHES FATALES] et [TOUCHES SOUTENUES 1]."
        }
      ]
    },

    /* -------------------------------------------------------
       SERRES DE LA TERREUR
       ------------------------------------------------------- */
    {
      id: "serres-de-la-terreur",
      name: "Serres de la Terreur",
      cost: 2,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "À la phase de Commandement adverse, chaque unité ennemie en dessous de son effectif initial et à 12\" ou moins d'une ou plusieurs unités de votre armée doit faire un test d'Ébranlement (un seul test par unité et par phase).",
          "Chaque fois qu'une unité ennemie à 12\" ou moins d'une ou plusieurs unités de votre armée fait un test d'Ébranlement, soustrayez 1 au résultat."
        ]
      },

      enhancements: [
        {
          id: "briseur-de-volonte",
          name: "Briseur de Volonté",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "À la phase de Combat, après que le porteur a combattu, choisissez 1 unité ennemie touchée par une ou plusieurs de ses attaques : elle doit faire un test d'Ébranlement."
        },
        {
          id: "mange-peur",
          name: "Mange-peur",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Au début de votre phase de Commandement, si le porteur est sur le champ de bataille, lancez 1D6 en ajoutant 1 pour chaque unité ennemie Ébranlée sur le champ de bataille : sur 5+, vous gagnez 1 PC."
        },
        {
          id: "propulseurs-a-energie-warp-serres",
          name: "Propulseurs à Énergie Warp",
          cost: 20,
          kind: "optimisation",
          requires: [["Chaos Lord with Jump Pack"]],
          text: "À la fin du tour adverse, si l'unité du porteur n'est pas engagée, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques."
        },
        {
          id: "suaire-de-la-nuit",
          name: "Suaire de la Nuit",
          cost: 10,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          excludes: ["Terminator"],
          text: "Les figurines de l'unité du porteur ont l'aptitude Discrétion."
        }
      ],

      stratagems: [
        {
          id: "chasseurs-impitoyables",
          name: "Chasseurs Impitoyables",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité Ébranlée ou en dessous de la moitié de son effectif, elle peut relancer les jets de touche et de blessure."
        },
        {
          id: "cruaute-insondable",
          name: "Cruauté Insondable",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité Ébranlée ou en dessous de la moitié de son effectif, améliorez de 1 la Pénétration d'Armure de l'attaque."
        },
        {
          id: "descente-hurlante",
          name: "Descente Hurlante",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Étape des Renforts de votre phase de Mouvement, à partir du 2e round.",
          cible: "1 unité HERETIC ASTARTES JUMP PACK de votre armée en Réserves.",
          effet: "Elle peut être placée à plus de 6\" horizontalement de toute unité ennemie (au lieu de 9\"), mais ne peut pas déclarer de charge à ce tour. Choisissez ensuite 1 unité ennemie INFANTRY ou MOUNTED visible et à 9\" ou moins d'elle : elle doit faire un test d'Ébranlement."
        },
        {
          id: "exemple-sanglant",
          name: "Exemple Sanglant",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité HERETIC ASTARTES CHARACTER de votre armée a détruit une unité CHARACTER ennemie.",
          cible: "Cette unité.",
          effet: "Chaque unité ennemie à 12\" ou moins d'elle doit faire un test d'Ébranlement."
        },
        {
          id: "poursuite-sans-repit",
          name: "Poursuite sans Répit",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Fin de la phase de Mouvement adverse.",
          cible: "1 unité HERETIC ASTARTES INFANTRY non engagée de votre armée, et 1 unité ennemie qui a Battu en Retraite et se trouve à 6\" ou moins d'elle.",
          effet: "Votre unité peut déclarer une charge contre cette unité ennemie comme si c'était votre phase de Charge, mais sans recevoir les bonus de charge."
        },
        {
          id: "terreur-implacable-serres",     // même nom que dans la Chasse Cauchemardesque
          name: "Terreur Implacable",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HERETIC ASTARTES INFANTRY de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Battu en Retraite."
        }
      ]
    },

    /* -------------------------------------------------------
       OST DE SIÈGE AFFREMARTEL
       ------------------------------------------------------- */
    {
      id: "ost-de-siege-affremartel",
      name: "Ost de Siège Affremartel",
      cost: 2,
      dispositions: ["take-and-hold"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une attaque de tir cible une unité HERETIC ASTARTES de votre armée (sauf DAMNED), si la Force de l'attaque est supérieure à l'Endurance de la cible, soustrayez 1 au jet de blessure."
        ]
      },

      enhancements: [
        {
          id: "artifice-de-fer",
          name: "Artifice de Fer",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Infantry"]],
          text: "Les armes du porteur ont [ANTI-VÉHICULE 4+] et [ANTI-FORTIFICATION 4+]."
        },
        {
          id: "hostilite-forgee",
          name: "Hostilité Forgée",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Tant que le porteur est à portée d'un pion objectif, ajoutez 1 à ses jets de blessure."
        },
        {
          id: "la-plate-du-bastion",
          name: "La Plate du Bastion",
          cost: 10,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          excludes: ["Jump Pack"],
          usage: "une-fois-par-round",
          text: "Une fois par round, quand un jet de sauvegarde est raté pour une figurine de l'unité du porteur, vous pouvez réduire à 0 les Dégâts de cette attaque."
        },
        {
          id: "traceur-warp",
          name: "Traceur Warp",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "À votre phase de Tir, après que le porteur a tiré, choisissez 1 unité ennemie touchée par ses attaques : jusqu'à la fin de la phase, elle ne peut pas avoir le Bénéfice du Couvert."
        }
      ],

      stratagems: [
        {
          id: "assaillants-perseverants",
          name: "Assaillants Persévérants",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible et qui n'a pas encore combattu à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle peut relancer ses jets de touche, et aussi ses jets de blessure si elle est en dessous de la moitié de son effectif."
        },
        {
          id: "attrition-brutale",
          name: "Attrition Brutale",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée (sauf DAMNED) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque de mêlée la cible, lancez 1D6 (6D6 au maximum par unité attaquante) : sur 4+, l'unité attaquante subit 1 blessure mortelle."
        },
        {
          id: "cannonade-sans-pitie",
          name: "Cannonade sans Pitié",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité en dessous de la moitié de son effectif, un jet de touche non modifié de 5+ est une Touche Critique."
        },
        {
          id: "destruction-a-bout-portant",
          name: "Destruction à Bout Portant",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES de votre armée engagée et pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, ses armes de tir (sauf celles avec [EXPLOSION]) ont [PISTOLET]."
        },
        {
          id: "determination-inflexible",
          name: "Détermination Inflexible",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, elle a l'aptitude Insensible à la Douleur 5+."
        },
        {
          id: "poliorcetique",
          name: "Poliorcétique",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "charge" }],
          quand: "Début de la phase de Charge adverse.",
          cible: "Votre armée.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une unité ennemie déclare une charge contre une ou plusieurs unités HERETIC ASTARTES de votre armée, soustrayez 2 à son jet de Charge (non cumulable)."
        }
      ]
    },

    /* -------------------------------------------------------
       MARAUDEURS DE HURON
       tracker.type "choix" (max 1), renouvelé à chaque phase de Commandement
       ------------------------------------------------------- */
    {
      id: "maraudeurs-de-huron",
      name: "Maraudeurs de Huron",
      cost: 3,
      dispositions: ["disruption", "purge-the-foe"],

      rule: {
        name: null,
        text: [
          "À votre phase de Commandement, choisissez l'une des aptitudes suivantes : jusqu'au début de votre prochaine phase de Commandement, chaque unité HERETIC ASTARTES INFANTRY de votre armée l'a. Au début de chaque phase, si une telle unité est visible d'une figurine HURON BLACKHEART de votre armée, elle a les deux aptitudes jusqu'à la fin de la phase.",
          "__Élite de Huron__ : chaque fois qu'une figurine de cette unité attaque, ajoutez 1 au jet de touche.",
          "__Maraudeurs Mobiles__ : cette unité est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."
        ]
      },

      tracker: {
        id: "aptitude-huron",
        type: "choix",
        label: "Aptitude des Maraudeurs",
        moment: "À ta phase de Commandement : choisis l'aptitude active jusqu'à ta prochaine phase de Commandement.",
        renouveler: "commandement",
        max: 1,
        options: [
          { n: 1, short: "Élite de Huron : +1 au jet de touche" },
          { n: 2, short: "Maraudeurs Mobiles : tir et charge après une Retraite" }
        ],
        concerne: "Unités HERETIC ASTARTES INFANTRY. Visibles de Huron Blackheart au début d'une phase : les deux aptitudes."
      },

      enhancements: [
        {
          id: "avide-de-verser-le-sang",
          name: "Avide de Verser le Sang",
          cost: 30,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Le porteur a l'aptitude Infiltrateurs."
        },
        {
          id: "chef-de-raid",
          name: "Chef de Raid",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Chaque fois que l'unité du porteur est placée après avoir débarqué d'un TRANSPORT qui a fait un Mouvement Normal à ce tour, elle reste éligible pour déclarer une charge."
        },
        {
          id: "la-voix-du-tyran",
          name: "La Voix du Tyran",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "L'unité du porteur a les deux aptitudes de la règle du détachement (Élite de Huron et Maraudeurs Mobiles)."
        },
        {
          id: "reputation-effroyable",
          name: "Réputation Effroyable",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Chaque fois que l'unité du porteur est placée sur le champ de bataille, chaque unité ennemie à 6\" ou moins d'elle (12\" si elle a été placée grâce à Frappe en Profondeur) doit faire un test d'Ébranlement."
        }
      ],

      stratagems: [
        {
          id: "deluge-de-fer-des-ecumeurs",
          name: "Déluge de Fer des Écumeurs",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "combat" }],
          quand: "Votre phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée qui a fait un mouvement de Charge à ce tour.",
          effet: "Jusqu'à la fin de la phase, ajoutez 1 aux Attaques des armes de mêlée de ses figurines."
        },
        {
          id: "elan-d-encerclement",
          name: "Élan d'Encerclement",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf MONSTER et VEHICLE) à 6\" ou moins d'un ou plusieurs bords du champ de bataille et hors de portée d'engagement de toute unité ennemie.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."
        },
        {
          id: "emparez-vous-du-tresor",
          name: "Emparez-vous du Trésor",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HERETIC ASTARTES de votre armée (sauf MONSTER et VEHICLE) a été choisie pour Avancer.",
          cible: "Cette unité.",
          effet: "Ne faites pas de jet d'Avance : jusqu'à la fin de la phase, ajoutez 6\" au Mouvement de ses figurines."
        },
        {
          id: "le-butin-aux-privilegies",
          name: "Le Butin aux Privilégiés",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          cible: "1 unité HERETIC ASTARTES de votre armée qui a perdu un ou plusieurs PV à cause de ces attaques.",
          effet: "Elle peut faire un mouvement d'Élan : lancez 1D6, ses figurines se déplacent d'autant de pouces au maximum et l'unité doit finir aussi près que possible de l'unité ennemie la plus proche (sauf AIRCRAFT). Ses figurines peuvent alors finir à portée d'engagement de cette unité ennemie."
        },
        {
          id: "sur-ordre-du-tyran",
          name: "Sur Ordre du Tyran",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf MONSTER et VEHICLE).",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "tueurs-endurcis",
          name: "Tueurs Endurcis",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité DAMNED de votre armée.",
          effet: "Choisissez un effet, actif jusqu'au début de votre prochain tour :\n• améliorez de 1 la CT de ses armes de tir ;\n• améliorez de 1 les Attaques de ses armes [TIR RAPIDE] ;\n• améliorez de 1 la Sauvegarde de ses figurines."
        }
      ]
    },

    /* -------------------------------------------------------
       PILLARDS DE MEURTRE-SERRE
       Unique : Cauchemar — exclusif avec Chasse Cauchemardesque
       « Warp Talons » = Serres du Warp
       ------------------------------------------------------- */
    {
      id: "pillards-de-meurtre-serre",
      name: "Pillards de Meurtre-Serre",
      cost: 1,
      dispositions: ["reconnaissance"],
      exclusiveGroup: "cauchemar",

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une figurine d'une unité HERETIC ASTARTES INFANTRY FLY de votre armée attaque une unité Ébranlée ou en dessous de la moitié de son effectif, vous pouvez relancer un jet de touche de 1.",
          "Chaque fois qu'une unité ennemie Ébranlée ou à la moitié de son effectif ou moins attaque une unité HERETIC ASTARTES INFANTRY FLY de votre armée, soustrayez 1 au jet de touche.",
          "Ce détachement a l'étiquette CAUCHEMAR : il ne peut pas être pris avec un autre détachement CAUCHEMAR."
        ]
      },

      enhancements: [
        {
          id: "pacte-des-remiges-maudites",
          name: "Pacte des Rémiges Maudites",
          cost: 20,
          kind: "optimisation",
          requires: [["Chaos Lord with Jump Pack"]],
          grantsKeywords: ["Daemon"],
          grantsLeaderOf: ["Warp Talons"],
          text: "Le porteur a le mot-clé DAEMON, et ses attaques de mêlée ont +1 en Attaques. Le porteur peut mener des Warp Talons."
        },
        {
          id: "talisman-de-capuche-d-ombre",
          name: "Talisman de Capuche d'Ombre",
          cost: 20,
          kind: "optimisation",
          requires: [["Chaos Lord with Jump Pack"]],
          text: "L'unité du porteur a une sauvegarde invulnérable de 5+."
        }
      ],

      stratagems: [
        {
          id: "ratissage-volant",
          name: "Ratissage Volant",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, quand une unité HERETIC ASTARTES INFANTRY FLY de votre armée est choisie pour Battre en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle reste éligible pour déclarer une charge à un tour où elle a Battu en Retraite."
        },
        {
          id: "serres-plongeantes",
          name: "Serres Plongeantes",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "combat" }],
          quand: "Phase de Combat, quand une unité HERETIC ASTARTES INFANTRY FLY de votre armée qui a fait un mouvement de Charge à ce tour est choisie pour combattre.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, ses attaques de mêlée ont [LANCE]."
        },
        {
          id: "terreurs-souillees-par-le-warp",
          name: "Terreurs Souillées par le Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, quand une unité WARP TALONS de votre armée finit un mouvement.",
          cible: "Cette unité.",
          effet: "Choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) visible et à 9\" ou moins d'elle : elle doit faire un test d'Ébranlement en soustrayant 1 au résultat."
        }
      ]
    },

    /* -------------------------------------------------------
       CHASSE CAUCHEMARDESQUE
       Unique : Cauchemar — exclusif avec Pillards de Meurtre-Serre
       Noms d'unités dans requires : à aligner sur les fiches d'unités
       (« Chaos Lord » = Seigneur du Chaos)
       ------------------------------------------------------- */
    {
      id: "chasse-cauchemardesque",
      name: "Chasse Cauchemardesque",
      cost: 2,
      dispositions: ["disruption"],
      exclusiveGroup: "cauchemar",

      rule: {
        name: null,
        text: [
          "À l'étape d'Ébranlement de la phase de Commandement adverse, chaque unité ennemie en dessous de son effectif initial et à 12\" ou moins d'une ou plusieurs unités HERETIC ASTARTES de votre armée doit faire un test d'Ébranlement en soustrayant 1 au résultat. Elle n'a pas d'autre test d'Ébranlement à faire à cette phase.",
          "Les figurines HERETIC ASTARTES de votre armée ont :",
          "• +1 au jet de touche contre les unités en dessous de la moitié de leur effectif ;",
          "• −1 au jet de touche des figurines Ébranlées qui les attaquent ;",
          "• +1 au jet de blessure contre les unités Ébranlées.",
          "Ce détachement a l'étiquette CAUCHEMAR : il ne peut pas être pris avec un autre détachement CAUCHEMAR."
        ]
      },

      enhancements: [
        {
          id: "malefice-du-voile-gris",
          name: "Maléfice du Voile Gris",
          cost: 25,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          text: "Les figurines de l'unité du porteur ont l'aptitude Discrétion. Tant que l'unité du porteur est à portée d'un ou plusieurs pions objectifs que vous contrôlez, elle ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins."
        },
        {
          id: "parasite-terrorisant",
          name: "Parasite Terrorisant",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement du porteur doit faire un test d'Ébranlement en soustrayant 1 au résultat."
        },
        {
          id: "propulseurs-a-energie-warp-chasse",
          name: "Propulseurs à Énergie Warp",
          cost: 20,
          kind: "optimisation",
          requires: [["Chaos Lord with Jump Pack"]],
          text: "À la fin de la phase de Combat adverse, si l'unité du porteur n'est à portée d'engagement d'aucune unité ennemie, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques."
        },
        {
          id: "vautour-de-l-affliction",
          name: "Vautour de l'Affliction",
          cost: 35,
          kind: "optimisation",
          requires: [["Chaos Lord with Jump Pack"]],
          grantsLeaderOf: ["Warp Talons"],
          text: "Les figurines de l'unité du porteur ont l'aptitude Éclaireurs 6\". Le porteur peut mener des Warp Talons."
        }
      ],

      stratagems: [
        {
          id: "acces-de-malfaisance",
          name: "Accès de Malfaisance",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée.",
          effet: "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "demonstration-de-sadisme",
          name: "Démonstration de Sadisme",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité HERETIC ASTARTES de votre armée a détruit une unité ennemie.",
          cible: "Cette unité.",
          effet: "Chaque unité ennemie (sauf MONSTER et VEHICLE) visible et à 6\" ou moins d'elle doit faire un test d'Ébranlement."
        },
        {
          id: "incursion-horrifique",
          name: "Incursion Horrifique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES de votre armée arrivée des Réserves à ce tour.",
          effet: "Choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) visible et à 12\" ou moins d'elle : elle doit faire un test d'Ébranlement en soustrayant 1 au résultat."
        },
        {
          id: "poursuivez-les-faibles",
          name: "Poursuivez les Faibles",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité attaque une unité Ébranlée ou en dessous de la moitié de son effectif, vous pouvez relancer le jet de touche."
        },
        {
          id: "serres-plantees-profondement",
          name: "Serres Plantées Profondément",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES INFANTRY de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité attaque une unité Ébranlée ou en dessous de la moitié de son effectif, améliorez de 1 la Pénétration d'Armure de l'attaque."
        },
        {
          id: "terreur-implacable",
          name: "Terreur Implacable",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HERETIC ASTARTES INFANTRY de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."
        }
      ]
    },

    /* -------------------------------------------------------
       ZÉLOTES PACTISANTS
       markChoice : chaque unité choisit une marque dans le builder
       (choix de marque sur la fiche d'unité, vérification « même marque »
       pour les transports et les rattachements)
       « Chaos Undivided » = Chaos Universel (mot-clé des fiches d'unités)
       ------------------------------------------------------- */
    {
      id: "zelotes-pactisants",
      name: "Zélotes Pactisants",
      cost: 3,
      dispositions: ["disruption", "priority-assets"],

      markChoice: {
        options: ["Khorne", "Tzeentch", "Nurgle", "Slaanesh", "Chaos Undivided"],
        excludes: ["Epic Hero"],        // et les unités qui ont déjà une marque
        sameMarkFor: ["transport", "leader"]
      },

      rule: {
        name: null,
        text: [
          "Chaque unité HERETIC ASTARTES de votre armée (sauf EPIC HERO et unités qui ont déjà une marque) choisit l'une des marques suivantes. Quand elle réussit un Sombre Pacte, elle gagne l'aptitude associée jusqu'à la fin de la phase :",
          "• __Khorne__ : si ses armes de mêlée ont [TOUCHES FATALES] grâce à ce Sombre Pacte, un jet de touche non modifié de 5+ est une Touche Critique.",
          "• __Tzeentch__ : si ses armes de tir ont [TOUCHES FATALES] grâce à ce Sombre Pacte, un jet de touche non modifié de 5+ est une Touche Critique.",
          "• __Nurgle__ : si ses armes de tir ont [TOUCHES SOUTENUES 1] grâce à ce Sombre Pacte, un jet de touche non modifié de 5+ est une Touche Critique.",
          "• __Slaanesh__ : si ses armes de mêlée ont [TOUCHES SOUTENUES 1] grâce à ce Sombre Pacte, un jet de touche non modifié de 5+ est une Touche Critique.",
          "• __Chaos Universel__ : relance des jets de touche de 1.",
          "Une unité ne peut embarquer dans un TRANSPORT (ou commencer la bataille embarquée) ou être menée par un personnage que si les deux unités ont la même marque."
        ]
      },

      enhancements: [
        {
          id: "elixir-enivrant",
          name: "Élixir Enivrant",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Slaanesh"]],
          text: "Le porteur a l'aptitude Insensible à la Douleur 5+. Chaque fois que le porteur tire ou combat, si son unité a fait un Sombre Pacte à cette phase, après qu'il a résolu ses attaques, choisissez 1 unité ennemie touchée par une ou plusieurs d'entre elles : elle doit faire un test d'Ébranlement."
        },
        {
          id: "l-oeil-de-tzeentch",
          name: "L'Œil de Tzeentch",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Tzeentch"]],
          text: "Chaque fois que l'unité du porteur fait un Sombre Pacte, faites un test de Commandement pour le porteur : s'il est réussi avec un résultat de 8+, vous gagnez 1 PC."
        },
        {
          id: "orbe-d-anti-vie",
          name: "Orbe d'Anti-vie",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Nurgle"]],
          text: "À la fin de la phase de Combat, lancez 1D6 pour chaque unité ennemie à 3\" ou moins du porteur (+1 si l'unité du porteur a fait un Sombre Pacte à cette phase) : sur 4+, cette unité subit D3 blessures mortelles."
        },
        {
          id: "talisman-du-sang-ardent",
          name: "Talisman du Sang Ardent",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes", "Khorne"]],
          text: "Ajoutez 1 aux Attaques et à la Force des armes de mêlée du porteur. Si l'unité du porteur a réussi un Sombre Pacte à cette phase, ajoutez D3 à la place."
        }
      ],

      stratagems: [
        {
          id: "changepeau",
          name: "Changepeau",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES de votre armée.",
          effet: "1 figurine de cette unité récupère jusqu'à 3 PV perdus. De plus, si c'est une unité TZEENTCH en dessous de son effectif initial, 1 figurine détruite (sauf CHARACTER) est ramenée dans l'unité avec tous ses PV."
        },
        {
          id: "haine-eternelle",
          name: "Haine Éternelle",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 (+1 si c'est une unité KHORNE) : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "l-oeil-des-dieux",
          name: "L'Œil des Dieux",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité HERETIC ASTARTES CHARACTER de votre armée (sauf DAMNED, DAEMON et EPIC HERO) a détruit une unité ennemie.",
          cible: "1 figurine CHARACTER de cette unité.",
          effet: "Jusqu'à la fin de la bataille, elle a +1\" en Mouvement, +1 en Endurance et +1 PV, et ses armes de mêlée ont +1 en Attaques, en Force et en Dégâts."
        },
        {
          id: "miasmes-pourrissants",
          name: "Miasmes Pourrissants",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, elle a l'aptitude Discrétion. De plus, si c'est une unité NURGLE, elle ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins."
        },
        {
          id: "refrain-de-torpeur",
          name: "Refrain de Torpeur",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES de votre armée.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Battu en Retraite. De plus, si c'est une unité SLAANESH, elle est aussi éligible pour tirer et déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "zele-profane",
          name: "Zèle Profane",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES CHAOS UNDIVIDED (Chaos Universel) de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle peut relancer ses jets de blessure."
        }
      ]
    },

    /* -------------------------------------------------------
       PILLARDS RENÉGATS
       ------------------------------------------------------- */
    {
      id: "pillards-renegats",
      name: "Pillards Renégats",
      cost: 3,
      dispositions: ["priority-assets", "reconnaissance"],

      weaponAbilities: [{ type: "ranged", ability: "assault" }],

      rule: {
        name: null,
        text: [
          "Les armes de tir des unités HERETIC ASTARTES de votre armée ont [ASSAUT].",
          "Chaque fois qu'une unité HERETIC ASTARTES de votre armée attaque une unité à portée d'un pion objectif, améliorez de 1 la Pénétration d'Armure de l'attaque."
        ]
      },

      enhancements: [
        {
          id: "conquete-du-despote",
          name: "Conquête du Despote",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "À votre phase de Commandement, si le porteur est sur le champ de bataille, lancez 1D6 (+1 si le porteur est entièrement à 12\" ou moins de la zone de déploiement ennemie) : sur 5+, vous gagnez 1 PC."
        },
        {
          id: "ecumeur-redoutable",
          name: "Écumeur Redoutable",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Tant que le porteur est entièrement à 12\" ou moins de la zone de déploiement ennemie, il peut relancer ses jets de touche et de blessure en mêlée."
        },
        {
          id: "fouet-du-tyran",
          name: "Fouet du Tyran",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "L'unité du porteur peut relancer ses jets d'Avance, et elle est éligible pour tirer à un tour où elle a Battu en Retraite."
        },
        {
          id: "marque-du-limier",
          name: "Marque du Limier",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Les figurines de l'unité du porteur ont l'aptitude Éclaireurs 6\"."
        }
      ],

      stratagems: [
        {
          id: "entetement-indefectible",
          name: "Entêtement Indéfectible",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée choisie pour cible.",
          effet: "Jusqu'à ce que l'unité attaquante ait fini ses attaques, dégradez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité."
        },
        {
          id: "haine-de-l-ecumeur",
          name: "Haine de l'Écumeur",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité HERETIC ASTARTES INFANTRY ou MOUNTED de votre armée.",
          effet: "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge à un tour où elle a Avancé. Si au moins une des cibles de sa charge est à portée d'un pion objectif, ajoutez 1 à son jet de Charge."
        },
        {
          id: "moteurs-a-energie-warp",
          name: "Moteurs à Énergie Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES TRANSPORT ou MOUNTED de votre armée.",
          effet: "Jusqu'à la fin de la phase, elle avance de 6\" au lieu de D6\"."
        },
        {
          id: "nettoyer-et-conquerir",
          name: "Nettoyer et Conquérir",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité à portée d'un pion objectif, ses attaques ont [PRÉCISION]."
        },
        {
          id: "pillards-opportunistes",
          name: "Pillards Opportunistes",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Fin de la phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée non engagée.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum (12\" si elle est MOUNTED), ou une Retraite. Elle ne peut pas embarquer dans un TRANSPORT dont elle a débarqué à ce tour."
        },
        {
          id: "raid-de-ruine",
          name: "Raid de Ruine",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée qui a débarqué d'un TRANSPORT à ce tour et pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand elle attaque une unité à portée d'un pion objectif, elle peut relancer les jets de touche et de blessure."
        }
      ]
    },

    /* -------------------------------------------------------
       MEUTE DE FORGE DES ÂMES
       « Vashtorr the Arkifane » = Vashtorr
       ------------------------------------------------------- */
    {
      id: "meute-de-forge-des-ames",
      name: "Meute de Forge des Âmes",
      cost: 2,
      dispositions: ["take-and-hold"],

      rule: {
        name: "Contrat",
        text: [
          "Chaque fois qu'une unité HERETIC ASTARTES VEHICLE DAEMON de votre armée fait un Sombre Pacte, elle peut passer un contrat. Dans ce cas, soustrayez 1 au test de Commandement du Sombre Pacte et, jusqu'à la fin de la phase, ajoutez 1 aux jets de blessure de ses attaques de tir et 2 aux Attaques de ses armes de mêlée."
        ]
      },

      enhancements: [
        {
          id: "addenda-tentant",
          name: "Addenda Tentant",
          cost: 40,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Chaque fois qu'une unité HERETIC ASTARTES VEHICLE de votre armée à 3\" ou moins du porteur passe un contrat, elle subit 1 blessure mortelle de plus si elle rate le test du Sombre Pacte et, jusqu'à la fin de la phase, elle peut relancer ses jets de touche."
        },
        {
          id: "benediction-de-la-forge",
          name: "Bénédiction de la Forge",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "À votre phase de Commandement, choisissez 1 unité HERETIC ASTARTES VEHICLE de votre armée à 12\" ou moins du porteur : jusqu'à votre prochaine phase de Commandement, elle a l'aptitude Insensible à la Douleur 6+."
        },
        {
          id: "mecavrilles-vigoureuses",
          name: "Mécavrilles Vigoureuses",
          cost: 15,
          kind: "optimisation",
          requires: [["Warpsmith"]],
          text: "Ajoutez 4\" au Mouvement du porteur."
        },
        {
          id: "moissonneur-d-ames",
          name: "Moissonneur d'Âmes",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          text: "Chaque fois qu'une unité ennemie est détruite à 12\" ou moins du porteur, lancez 1D6 : sur 5+, vous gagnez 1 PC."
        }
      ],

      stratagems: [
        {
          id: "frenesie-nourriciere",
          name: "Frénésie Nourricière",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse.",
          cible: "1 unité HERETIC ASTARTES VEHICLE DAEMON ou VASHTORR de votre armée.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) engagée avec votre unité est choisie pour Battre en Retraite, elle doit faire des tests de Fuite Désespérée, en soustrayant 1 au résultat."
        },
        {
          id: "possession-demoniaque",
          name: "Possession Démoniaque",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité HERETIC ASTARTES VEHICLE de votre armée (sauf DAEMON).",
          effet: "Elle gagne le mot-clé DAEMON jusqu'à la fin de la bataille."
        },
        {
          id: "poursuite-predatrice",
          name: "Poursuite Prédatrice",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité HERETIC ASTARTES VEHICLE ou VASHTORR non engagée de votre armée.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum, mais doit le finir aussi près que possible de cette unité ennemie."
        },
        {
          id: "ravages-irresistibles",
          name: "Ravages Irrésistibles",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }, { tour: "vous", phase: "charge" }],
          quand: "Votre phase de Mouvement ou phase de Charge.",
          cible: "1 unité HERETIC ASTARTES VEHICLE ou VASHTORR de votre armée qui fait un Mouvement Normal, une Avance ou un mouvement de Charge.",
          effet: "Pendant ce mouvement, elle peut traverser horizontalement les éléments de terrain comme s'ils n'étaient pas là."
        },
        {
          id: "supplique-desesperee",
          name: "Supplique Désespérée",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité HERETIC ASTARTES VEHICLE DAEMON de votre armée (sauf TITANIC) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses attaques."
        },
        {
          id: "surplus-d-ames",
          name: "Surplus d'Âmes",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité HERETIC ASTARTES VEHICLE DAEMON de votre armée pas encore choisie pour combattre, et qui passe un contrat à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'elle détruit une figurine ennemie, lancez 1D6 : sur 5+, elle récupère 1 PV perdu (6 PV au maximum à cette phase)."
        }
      ]
    },

    /* -------------------------------------------------------
       VÉTÉRANS DE LA LONGUE GUERRE
       ------------------------------------------------------- */
    {
      id: "veterans-of-the-long-war",
      name: "Vétérans de la Longue Guerre",
      cost: 2,
      dispositions: ["take-and-hold"],

      rule: {
        name: "Objet de Haine",
        text: [
          "À votre phase de Commandement, choisissez 1 unité ennemie : c'est votre Objet de Haine jusqu'à votre prochaine phase de Commandement. Chaque fois qu'une figurine HERETIC ASTARTES de votre armée (sauf DAMNED) attaque cette unité, vous pouvez relancer le jet de touche."
        ]
      },

      // Cible ennemie notée dans le compagnon
      tracker: {
        id: "objet-de-haine",
        type: "cible",
        label: "Objet de Haine",
        debutRound: "À ta phase de Commandement : choisis ton Objet de Haine.",
        bonus: "Relance des jets de touche contre elle (sauf DAMNED)."
      },

      enhancements: [
        {
          id: "ivre-de-vengeance",
          name: "Ivre de Vengeance",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "L'unité du porteur est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite. Si elle a Battu en Retraite à ce tour, ajoutez 1 à ses jets de touche contre votre Objet de Haine et à ses jets de Charge qui le ciblent."
        },
        {
          id: "l-oeil-d-abaddon",
          name: "L'Œil d'Abaddon",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          text: "Si le porteur est sur le champ de bataille quand votre Objet de Haine est détruit, lancez 1D6 : sur 4+, vous gagnez 1 PC."
        },
        {
          id: "legende-vivante",
          name: "Légende Vivante",
          cost: 10,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, le porteur peut relancer 1 jet de touche, 1 jet de blessure ou 1 jet de sauvegarde."
        },
        {
          id: "present-du-maitre-de-guerre",
          name: "Présent du Maître de Guerre",
          cost: 15,
          kind: "optimisation",
          requires: [["Chaos Lord"]],
          text: "Chaque fois que le porteur attaque votre Objet de Haine, un jet de blessure non modifié de 5+ est une Blessure Critique."
        }
      ],

      stratagems: [
        {
          id: "croisade-noire",
          name: "Croisade Noire",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES INFANTRY ou MOUNTED de votre armée (sauf DAMNED).",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer à un tour où elle a Avancé ou Battu en Retraite. De plus, ses bolt pistols, boltguns et combi-bolters ont [BLESSURES DÉVASTATRICES] jusqu'à ce qu'elle ait infligé 6 blessures grâce à cette aptitude."
        },
        {
          id: "experience-millenaire",
          name: "Expérience Millénaire",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité HERETIC ASTARTES INFANTRY ou MOUNTED (sauf DAMNED) non engagée de votre armée.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        },
        {
          id: "ire-sans-fin",
          name: "Ire sans Fin",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après que votre Objet de Haine a été détruit.",
          cible: "1 unité ennemie visible et à 12\" ou moins d'une unité HERETIC ASTARTES CHARACTER de votre armée (sauf DAMNED).",
          effet: "Jusqu'au début de votre prochaine phase de Commandement, cette unité ennemie est votre Objet de Haine."
        },
        {
          id: "mepris-manifeste",
          name: "Mépris Manifeste",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) choisie pour cible.",
          effet: "Jusqu'à ce que l'unité attaquante ait fini ses attaques, dégradez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité."
        },
        {
          id: "porteurs-de-desespoir",
          name: "Porteurs de Désespoir",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) à portée d'engagement de votre Objet de Haine.",
          effet: "Jusqu'à la fin de la phase, elle a l'aptitude Combat en Premier."
        },
        {
          id: "que-brule-la-galaxie",
          name: "Que Brûle la Galaxie",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, ses armes de tir ont [IGNORE LE COUVERT], et ses armes [TORRENT] ont une caractéristique d'Attaques de 6."
        }
      ]
    },

    /* -------------------------------------------------------
       CHAMPIONS DE FOUDREWARP
       requiresCore : aptitude de base exigée du porteur 
       ------------------------------------------------------- */
    {
      id: "champions-de-foudrewarp",
      name: "Champions de Foudrewarp",
      cost: 2,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "À la fin du tour adverse, vous pouvez choisir jusqu'à 2 unités HERETIC ASTARTES TERMINATOR, OBLITERATORS ou MUTILATORS de votre armée non engagées (1 en format Incursion, 3 en format Offensive) : retirez-les du champ de bataille et placez-les en Réserves Stratégiques."
        ]
      },

      enhancements: [
        {
          id: "fulgurite-infernal",
          name: "Fulgurite Infernal",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          excludes: ["Damned"],
          usage: "une-fois-par-bataille",
          text: "Une fois par bataille, vous pouvez cibler l'unité du porteur avec le stratagème Arrivée Précipitée pour 0 PC, même si vous avez déjà ciblé une autre unité avec ce stratagème à cette phase."
        },
        {
          id: "oeil-du-warp",
          name: "Œil du Warp",
          cost: 15,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          requiresCore: ["deep-strike"],
          text: "Chaque fois que l'unité du porteur est placée sur le champ de bataille, jusqu'à la fin du tour, vous pouvez relancer ses jets de Charge."
        },
        {
          id: "runes-d-ancrage-d-akshur",
          name: "Runes d'Ancrage d'Akshur",
          cost: 20,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          requiresCore: ["deep-strike"],
          text: "L'unité du porteur peut être placée grâce à Frappe en Profondeur à l'étape des Renforts de votre 1re, 2e ou 3e phase de Mouvement, quelles que soient les règles de la mission."
        },
        {
          id: "tzagulla",
          name: "Tzagulla",
          cost: 25,
          kind: "optimisation",
          requires: [["Heretic Astartes"]],
          requiresCore: ["deep-strike"],
          text: "Améliorez de 1 les Attaques, la Force et la Pénétration d'Armure des armes du porteur. De plus, chaque fois que l'unité du porteur est placée sur le champ de bataille depuis les Réserves, jusqu'à la fin du tour, améliorez de 1 les Dégâts des armes du porteur."
        }
      ],

      stratagems: [
        {
          id: "armure-de-corruption",
          name: "Armure de Corruption",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES TERMINATOR, OBLITERATORS ou MUTILATORS de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin du tour, chaque fois qu'une attaque cible une figurine de votre unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque.",
          restrictions: "Vous ne pouvez pas cibler la même unité avec Armure de Corruption et Dislocation Empyréenne à la même phase."
        },
        {
          id: "dislocation-empyreenne",
          name: "Dislocation Empyréenne",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HERETIC ASTARTES de votre armée (sauf DAMNED) choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, dégradez de 1 la Pénétration d'Armure de l'attaque.",
          restrictions: "Vous ne pouvez pas cibler la même unité avec Dislocation Empyréenne et Armure de Corruption à la même phase."
        },
        {
          id: "frappe-brise-siege",
          name: "Frappe Brise-siège",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "Jusqu'à 2 unités HERETIC ASTARTES de votre armée placées grâce à Frappe en Profondeur à ce tour et pas encore choisies pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de tir de leurs figurines ont [IGNORE LE COUVERT]."
        },
        {
          id: "portail-de-rancoeur",
          name: "Portail de Rancœur",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité HERETIC ASTARTES de votre armée placée grâce à Frappe en Profondeur à ce tour et qui n'a pas encore déclaré de charge à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'elle déclare une charge, si l'unité ennemie éligible la plus proche fait partie des cibles, ajoutez 2 au jet de Charge."
        },
        {
          id: "souille-par-le-warp",
          name: "Souillé par le Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES TERMINATOR, OBLITERATORS ou MUTILATORS de votre armée à portée d'un pion objectif que vous contrôlez.",
          effet: "Ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        },
        {
          id: "vacillement-warp",
          name: "Vacillement Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité HERETIC ASTARTES TERMINATOR, OBLITERATORS ou MUTILATORS de votre armée.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Avancé."
        }
      ]
    }
  ],

  /* =========================================================
     UNITÉS
     Noms, armes et mots-clés en anglais ; textes en français.
     category : voir UnitCategories dans config.js
     costs    : paliers par exemplaire (from = Nième exemplaire)
     statLines : plusieurs profils dans une même unité, affichés ligne par ligne
                 (stats reste le profil principal, utilisé pour les calculs)
     requiresArmyRule : unités de culte (bloquées par la Bande de Renégats)
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ---------- */
    {
      id: "abaddon-the-despoiler",
      name: "Abaddon the Despoiler",
      category: "epic-infantry",
      base: "60mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Terminator", "Chaos Undivided", "Chaos", "Abaddon the Despoiler"],
      stats: { M: "5\"", T: 6, Sv: "2+", W: 9, Ld: "5+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 300 }] }],
      mustBeWarlord: true,                          // Supreme Commander
      leader: { canLead: ["Chaos Terminator Squad", "Chosen"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "talon-of-horus", name: "Talon of Horus", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1"] }] },
        { id: "drachnyen", name: "Drach'nyen", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "14", AP: "-4", D: "3", abilities: ["devastating-wounds"] }] },
        { id: "talon-of-horus-melee", name: "Talon of Horus", type: "melee",
          profiles: [{ range: "Mêlée", A: "14", skill: "2+", S: "7", AP: "-3", D: "1", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["talon-of-horus", "drachnyen", "talon-of-horus-melee"],
      abilities: [
        { name: "The Warmaster",
          text: "À votre phase de Commandement, choisissez une aptitude Warmaster : jusqu'au début de votre prochaine phase de Commandement, cette figurine a cette aptitude." },
        { name: "Dark Destiny",
          text: "Chaque fois que l'unité de cette figurine fait un Sombre Pacte et réussit le test de Commandement qui en résulte, si le résultat est de 7 ou plus, vous gagnez 1 PC." },
        { name: "Supreme Commander",
          text: "Si cette figurine fait partie de votre armée, elle doit être votre Seigneur de Guerre." }
      ],
      // Aptitudes au choix, sélectionnées en partie dans le compagnon
      abilityChoices: {
        name: "Warmaster",
        when: "Votre phase de Commandement",
        options: [
          { name: "Paragon of Hatred (Aura)", text: "Tant qu'une unité HERETIC ASTARTES amie (sauf DAMNED) est à 6\" ou moins de cette figurine, chaque fois qu'une figurine de cette unité attaque, vous pouvez relancer le jet de touche." },
          { name: "Mark of Chaos Ascendant (Aura)", text: "Tant qu'une unité HERETIC ASTARTES INFANTRY ou HERETIC ASTARTES MOUNTED amie (sauf DAMNED) est à 6\" ou moins de cette figurine, les figurines de cette unité ont une sauvegarde invulnérable de 4+." },
          { name: "Lord of the Traitor Legions (Aura)", text: "Tant qu'une unité HERETIC ASTARTES amie (sauf DAMNED) est à 6\" ou moins de cette figurine, vous pouvez relancer ses tests de Commandement et d'Ébranlement." }
        ]
      },
      composition: "1 Abaddon the Despoiler"
    },

    {
      id: "cypher",
      name: "Cypher",
      category: "epic-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Chaos", "Fallen", "Cypher"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }] }],
      coreAbilities: ["lone-operative"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "cyphers-bolt-pistol", name: "Cypher's bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["assault", "pistol", "sustained-hits:1"] }] },
        { id: "cyphers-plasma-pistol", name: "Cypher's plasma pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["assault", "pistol", "sustained-hits:1"] }] },
        { id: "cyphers-bolt-pistol-melee", name: "Cypher's bolt pistol", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "cyphers-plasma-pistol-melee", name: "Cypher's plasma pistol", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["extra-attacks"] }] }
      ],
      loadout: ["cyphers-bolt-pistol", "cyphers-plasma-pistol", "cyphers-bolt-pistol-melee", "cyphers-plasma-pistol-melee"],
      abilities: [
        { name: "Agent of Discord", usage: "une-fois-par-tour",
          text: "Une fois par tour, quand votre adversaire cible avec un stratagème une unité de son armée à 12\" ou moins de cette figurine, vous pouvez utiliser cette aptitude : cette utilisation du stratagème coûte 1 PC de plus." },
        { name: "Guns Blazing", usage: "une-fois-par-tour",
          text: "Une fois par tour, à la phase de Tir adverse, quand une unité ennemie fait une attaque de tir qui cible une unité HERETIC ASTARTES amie à 3\" ou moins de cette figurine, après que cette unité ennemie a tiré, cette figurine peut tirer comme si c'était votre phase de Tir. Elle doit alors cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible." }
      ],
      composition: "1 Cypher"
    },

    {
      id: "fabius-bile",
      name: "Fabius Bile",
      category: "epic-infantry",
      base: "40mm (Surgeon Acolyte : 32mm)",
      keywords: ["Infantry", "Character", "Epic Hero", "Chaos", "Chaos Undivided", "Fabius Bile"],
      keywordsNote: "Character, Epic Hero et Fabius Bile : Fabius Bile seulement.",
      stats: { M: "6\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1 },
      statLines: [
        { label: "Fabius Bile",     stats: { M: "6\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1 } },
        { label: "Surgeon Acolyte", stats: { M: "6\"", T: 5, Sv: "6+", W: 1, Ld: "7+", OC: 1 } }
      ],
      sizes: [{ models: 2, costs: [{ from: 1, pts: 110 }] }],
      leader: { canLead: ["Accursed Cultists", "Chosen", "Cultist Mob", "Legionaries", "Red Corsairs Raiders"] },
      coreAbilities: ["feel-no-pain:5+", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "xyclos-needler", name: "Xyclos Needler", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "2+", S: "2", AP: "-1", D: "2", abilities: ["anti:Infanterie 2+", "pistol"] }] },
        { id: "chirurgeon", name: "Chirurgeon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "4", AP: "0", D: "1", abilities: ["extra-attacks"] }] },
        { id: "rod-of-torment", name: "Rod of Torment", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-1", D: "3", abilities: [] }] },
        { id: "surgeon-acolytes-tools", name: "Surgeon Acolyte's tools", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "5+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "fabius-bile",     name: "Fabius Bile",     count: 1, loadout: ["xyclos-needler", "chirurgeon", "rod-of-torment"] },
        { id: "surgeon-acolyte", name: "Surgeon Acolyte", count: 1, loadout: ["surgeon-acolytes-tools"] }
      ],
      abilities: [
        { name: "Enhanced Warriors", grants: "unite-menee",
          text: "Si cette unité est rattachée à une unité au début de la bataille, jusqu'à la fin de la bataille, ajoutez 1 à la Force des armes de mêlée des figurines de gardes du corps de cette unité, et ajoutez 1 à leur Endurance." },
        { name: "Surgeon Acolyte", usage: "une-fois-par-tour",
          text: "Une fois par tour, quand une attaque est allouée à une figurine de cette unité, si l'unité contient FABIUS BILE, vous pouvez réduire à 0 les Dégâts de cette attaque." },
        { name: "Chirurgeon", usage: "une-fois-par-bataille",
          text: "La première fois que FABIUS BILE est détruit, à la fin de la phase, lancez 1D6 : sur 2+, replacez-le sur le champ de bataille aussi près que possible de l'endroit où il a été détruit et hors de portée d'engagement de toute figurine ennemie, avec tous ses PV." }
      ],
      composition: "1 Fabius Bile et 1 Surgeon Acolyte"
    },

    {
      id: "haarken-worldclaimer",
      name: "Haarken Worldclaimer",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Fly", "Jump Pack", "Chaos", "Chaos Undivided", "Haarken Worldclaimer"],
      stats: { M: "12\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }] }],
      leader: { canLead: ["Raptors"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "helspear", name: "Helspear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "3", abilities: ["assault", "sustained-hits:D3"] }] },
        { id: "heralds-talon", name: "Herald's Talon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "2", abilities: ["precision"] }] },
        { id: "helspear-melee", name: "Helspear", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "2+", S: "8", AP: "-3", D: "3", abilities: ["extra-attacks", "lance", "sustained-hits:D3"] }] }
      ],
      loadout: ["helspear", "heralds-talon", "helspear-melee"],
      abilities: [
        { name: "Head Taker", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois que cette unité finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement et lancez 1D6 pour chaque figurine de cette unité à portée d'engagement de cette unité ennemie : pour chaque 4+, elle subit 1 blessure mortelle." },
        { name: "Herald of the Apocalypse (Aura)",
          text: "Tant qu'une unité ennemie est à 6\" ou moins de cette figurine, à l'étape d'Ébranlement de la phase de Commandement adverse, si elle est en dessous de son effectif initial, elle doit faire un test d'Ébranlement. Cette aptitude ne peut pas faire faire deux tests d'Ébranlement à une unité à la même phase." }
      ],
      composition: "1 Haarken Worldclaimer"
    },

    {
      id: "huron-blackheart",
      name: "Huron Blackheart",
      category: "epic-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Chaos", "Chaos Undivided", "Huron Blackheart"],
      stats: { M: "6\"", T: 6, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 135 }] }],
      leader: { canLead: ["Chaos Terminator Squad", "Chosen", "Legionaries", "Red Corsairs Raiders"] },
      coreAbilities: ["deep-strike", "feel-no-pain:5+", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "tyrants-claw-heavy-flamer", name: "Tyrant's Claw heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+2", skill: "N/A", S: "6", AP: "-1", D: "1", abilities: ["ignores-cover", "pistol", "torrent"] }] },
        { id: "tyrants-claw-and-exalted-power-weapon", name: "Tyrant's Claw and exalted power weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "8", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["tyrants-claw-heavy-flamer", "tyrants-claw-and-exalted-power-weapon"],
      abilities: [
        { name: "Lord of Badab (Aura)",
          text: "Tant qu'une unité HERETIC ASTARTES INFANTRY amie (sauf unités Ébranlées et DAMNED) est à 6\" ou moins de cette figurine, ajoutez 1 à la CO des figurines de cette unité." },
        { name: "Hamadrya's Knowledge (Psychic)", usage: "une-fois-par-round",
          text: "Une fois par round, quand une unité ennemie finit un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins de l'unité de cette figurine, si cette unité n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de D3+3\" maximum." }
      ],
      composition: "1 Huron Blackheart"
    },

    {
      id: "kravek-morne",
      name: "Kravek Morne",
      category: "epic-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Chaos", "Chaos Undivided", "Terminator", "Kravek Morne"],
      stats: { M: "5\"", T: 6, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }] }],
      leader: { canLead: ["Chaos Terminator Squad", "Mutilators", "Obliterators"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "baleflamer", name: "Baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-1", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "last-argument-and-power-fist", name: "Last Argument and power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "10", AP: "-2", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "servo-harness", name: "Servo-harness", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["extra-attacks", "anti:Véhicule 2+"] }] }
      ],
      loadout: ["baleflamer", "combi-bolter", "last-argument-and-power-fist", "servo-harness"],
      abilities: [
        { name: "Headlong Destruction", grants: "son-unite",
          text: "Chaque fois qu'une figurine de cette unité attaque l'unité ennemie éligible la plus proche, améliorez de 1 la Pénétration d'Armure de l'attaque." },
        { name: "Architect of Ruin",
          gameChoice: "Au début de la bataille, choisir l'ennemi juré de Kravek Morne.",
          text: "Au début de la bataille, choisissez 1 unité de l'armée adverse : c'est l'ennemi juré de cette figurine. Chaque fois que cette figurine attaque son ennemi juré, vous pouvez relancer le jet de blessure. Chaque fois que son ennemi juré est détruit, vous pouvez choisir une nouvelle unité de l'armée adverse comme ennemi juré." }
      ],
      composition: "1 Kravek Morne"
    },

    {
      id: "masters-of-the-maelstrom",
      name: "Masters of the Maelstrom",
      category: "epic-infantry",
      base: "40mm (The Enforcer : 32mm)",
      // Pas de mot-clé Character : unité Support, menée par aucun personnage
      keywords: ["Infantry", "Epic Hero", "Grenades", "Chaos", "Chaos Undivided", "Masters of the Maelstrom"],
      keywordsNote: "Psyker : Garlon Souleater seulement.",
      stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      statLines: [
        { label: "Garlon Souleater, Garreon the Corpsemaster, Katar Garrix", stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 } },
        { label: "Captain Sargotta, The Enforcer",                          stats: { M: "6\"", T: 3, Sv: "4+", W: 3, Ld: "6+", OC: 1 } }
      ],
      sizes: [{ models: 5, costs: [{ from: 1, pts: 150 }] }],
      leader: { type: "support", canLead: ["Chosen", "Legionaries", "Red Corsairs Raiders"] },
      coreAbilities: ["support"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "absolvor-bolt-pistol", name: "Absolvor bolt pistol", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["pistol"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "laspistol", name: "Laspistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "londaxi-maimer", name: "Londaxi maimer", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "mind-wrench", name: "Mind Wrench", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "6", AP: "-2", D: "D6+1", abilities: ["precision", "psychic"] }] },
        { id: "axe-of-ending", name: "Axe of Ending", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["anti:Personnage 2+", "precision"] }] },
        { id: "bionic-gauntlet", name: "Bionic gauntlet", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "2+", S: "6", AP: "-2", D: "2", abilities: [] }] },
        { id: "force-stave", name: "Force stave", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["psychic"] }] },
        { id: "power-sabre", name: "Power sabre", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] },
        { id: "reductor-array", name: "Reductor array", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "garreon",  name: "Garreon the Corpsemaster", count: 1, loadout: ["absolvor-bolt-pistol", "reductor-array"] },
        { id: "garlon",   name: "Garlon Souleater",         count: 1, loadout: ["mind-wrench", "force-stave"] },
        { id: "katar",    name: "Katar Garrix",             count: 1, loadout: ["bolt-pistol", "axe-of-ending"] },
        { id: "sargotta", name: "Captain Sargotta",         count: 1, loadout: ["laspistol", "power-sabre"] },
        { id: "enforcer", name: "The Enforcer",             count: 1, loadout: ["londaxi-maimer", "bionic-gauntlet"] }
      ],
      abilities: [
        { name: "Choice Samples",
          text: "Tant que Garreon the Corpsemaster de cette unité est sur le champ de bataille, à votre phase de Commandement, choisissez : soit vous ramenez 1 figurine détruite (sauf CHARACTER) dans cette unité, soit, si une ou plusieurs unités HERETIC ASTARTES INFANTRY de votre armée sont en dessous de leur effectif initial et à 3\" ou moins de cette unité, vous gagnez 1 PC." },
        { name: "Fleet Command",
          text: "Après le déploiement des deux armées, si cette unité est sur le champ de bataille (ou embarquée dans un TRANSPORT sur le champ de bataille), choisissez jusqu'à 3 unités HERETIC ASTARTES de votre armée et redéployez-les. Vous pouvez alors les placer en Réserves Stratégiques, quel que soit le nombre d'unités qui y sont déjà." },
        { name: "Plunder", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, après que cette unité a fini un Mouvement Normal, vous pouvez choisir 1 unité ennemie visible et à 12\" ou moins d'elle, puis lancer 1D6 : sur 2+, cette unité ennemie subit D3+1 blessures mortelles." }
      ],
      composition: "1 Garreon the Corpsemaster, 1 Garlon Souleater, 1 Katar Garrix, 1 Captain Sargotta et 1 The Enforcer (tous EPIC HERO)"
    },

    /* ---------- Héros monstres épiques ---------- */
    {
      id: "vashtorr-the-arkifane",
      name: "Vashtorr the Arkifane",
      category: "epic-monster",
      base: "80mm",
      keywords: ["Monster", "Character", "Epic Hero", "Fly", "Chaos", "Daemon", "Vashtorr the Arkifane"],
      stats: { M: "12\"", T: 10, Sv: "2+", W: 14, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 220 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "vashtorrs-claw", name: "Vashtorr's claw", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-2", D: "1", abilities: ["anti:Véhicule 4+", "torrent"] }] },
        { id: "vashtorrs-hammer", name: "Vashtorr's hammer", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "14", AP: "-3", D: "3", abilities: ["anti:Véhicule 4+", "devastating-wounds"] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "2+", S: "8",  AP: "-1", D: "2", abilities: ["anti:Véhicule 4+", "devastating-wounds"] }
          ] }
      ],
      loadout: ["vashtorrs-claw", "vashtorrs-hammer"],
      abilities: [
        { name: "Unholy Mechanisms (Aura)",
          text: "Tant qu'une unité DAEMON VEHICLE amie est à 6\" ou moins de cette figurine, ajoutez 2 à la Force des armes de ses figurines." },
        { name: "Reorder Reality",
          text: "Chaque fois qu'une unité ennemie à 18\" ou moins de cette figurine la cible, soustrayez 1 au jet de touche et, jusqu'à la fin de la phase, les armes de tir de cette unité ennemie ont [À RISQUE]." },
        { name: "Indentured Daemon Engines",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités DAEMON VEHICLE amies, elle a l'aptitude Agent Solitaire." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Vashtorr the Arkifane"
    },

    /* ---------- Personnages d'infanterie ---------- */
    {
      id: "chaos-lord",
      name: "Chaos Lord",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Chaos Lord"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }] }],
      leader: { canLead: ["Chosen", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainblade", name: "Astartes chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "daemon-hammer", name: "Daemon hammer", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "8", AP: "-2", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["plasma-pistol", "daemon-hammer"],
      options: [
        { id: "remplace-hammer", text: "Le daemon hammer peut être remplacé par 1 accursed weapon ou 1 Astartes chainblade.",
          replaces: ["daemon-hammer"], choices: [["accursed-weapon"], ["astartes-chainblade"]] },
        { id: "remplace-plasma", text: "Le plasma pistol peut être remplacé par 1 power fist.",
          replaces: ["plasma-pistol"], choices: [["power-fist"]] }
      ],
      abilities: [
        { name: "Lord of Chaos", usage: "une-fois-par-round",
          text: "Une fois par round, une unité de votre armée qui a cette aptitude peut l'utiliser quand elle est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Chance for Glory", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de la phase de Combat, cette figurine peut utiliser cette aptitude. Jusqu'à la fin de la phase, améliorez de 1 la Force, les Attaques, la Pénétration d'Armure et les Dégâts de ses armes de mêlée." }
      ],
      composition: "1 Chaos Lord"
    },

    {
      id: "chaos-lord-in-terminator-armour",
      name: "Chaos Lord in Terminator Armour",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Chaos Lord", "Terminator", "Chaos Lord in Terminator Armour"],
      stats: { M: "5\"", T: 6, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Chaos Terminator Squad"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "chainfist", name: "Chainfist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "8", AP: "-2", D: "2", abilities: ["anti:Véhicule 3+"] }] },
        { id: "exalted-weapon", name: "Exalted weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "paired-accursed-weapons", name: "Paired accursed weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["combi-bolter", "exalted-weapon"],
      options: [
        { id: "remplace-combi", text: "Le combi-bolter peut être remplacé par 1 combi-weapon.",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]] },
        { id: "remplace-exalted", text: "L'exalted weapon peut être remplacée par 1 chainfist ou 1 power fist.",
          replaces: ["exalted-weapon"], choices: [["chainfist"], ["power-fist"]] },
        { id: "paired", text: "Le combi-bolter et l'exalted weapon peuvent être remplacés par 1 paired accursed weapons.",
          replaces: ["combi-bolter", "exalted-weapon"], choices: [["paired-accursed-weapons"]] }
      ],
      abilities: [
        { name: "Lord of Chaos", usage: "une-fois-par-round",
          text: "Une fois par round, une unité de votre armée qui a cette aptitude peut l'utiliser quand elle est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Formidably Resilient",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, divisez par deux la caractéristique de Dégâts de cette attaque." }
      ],
      composition: "1 Chaos Lord in Terminator Armour"
    },

    {
      id: "chaos-lord-with-jump-pack",
      name: "Chaos Lord with Jump Pack",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Jump Pack", "Fly", "Grenades", "Chaos", "Chaos Lord"],
      stats: { M: "12\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 85 }] }],
      leader: { canLead: ["Raptors"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-2", D: "2", abilities: [] }] },
        { id: "twin-lightning-claws", name: "Twin lightning claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] }
      ],
      loadout: ["bolt-pistol", "accursed-weapon"],
      options: [
        { id: "remplace-pistol", text: "Le bolt pistol peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "remplace-accursed", text: "L'accursed weapon peut être remplacée par 1 power fist.",
          replaces: ["accursed-weapon"], choices: [["power-fist"]] },
        { id: "claws", text: "Le bolt pistol et l'accursed weapon peuvent être remplacés par 1 twin lightning claws.",
          replaces: ["bolt-pistol", "accursed-weapon"], choices: [["twin-lightning-claws"]] }
      ],
      abilities: [
        { name: "Lord of Chaos", usage: "une-fois-par-round",
          text: "Une fois par round, une unité de votre armée qui a cette aptitude peut l'utiliser quand elle est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Cruel Hunter", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois que cette unité fait un mouvement d'engagement ou de consolidation, chaque figurine de l'unité peut se déplacer de 6\" au lieu de 3\"." }
      ],
      composition: "1 Chaos Lord with Jump Pack"
    },

    {
      id: "cultist-firebrand",
      name: "Cultist Firebrand",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Damned", "Cultist Firebrand"],
      stats: { M: "6\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 45 }, { from: 3, pts: 50 }] }],
      leader: { canLead: ["Accursed Cultists", "Cultist Mob"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "balefire-pike", name: "Balefire pike", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["balefire-pike", "close-combat-weapon"],
      abilities: [
        { name: "Fiery Faith", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, vous pouvez relancer les tests de Commandement de cette unité." },
        { name: "Cursed Flames",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie INFANTRY touchée par une ou plusieurs de ces attaques : elle doit faire un test d'Ébranlement." }
      ],
      composition: "1 Cultist Firebrand"
    },

    {
      id: "dark-apostle",
      name: "Dark Apostle",
      category: "char-infantry",
      base: "40mm (Dark Disciples : 25mm)",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Dark Apostle"],
      keywordsNote: "Character et Dark Apostle : Dark Apostle seulement.",
      stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "5+", OC: 1, InSv: "4+" },
      statLines: [
        { label: "Dark Apostle",  stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "5+", OC: 1, InSv: "4+" } },
        { label: "Dark Disciple", stats: { M: "6\"", T: 5, Sv: "6+", W: 1, Ld: "7+", OC: 1, InSv: "4+" } }
      ],
      sizes: [{ models: 3, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Accursed Cultists", "Chosen", "Cultist Mob", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "accursed-crozius", name: "Accursed crozius", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "6", AP: "-1", D: "2", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "dark-apostle",  name: "Dark Apostle",  count: 1, loadout: ["bolt-pistol", "accursed-crozius"] },
        { id: "dark-disciple", name: "Dark Disciple", count: 2, loadout: ["close-combat-weapon"] }
      ],
      abilities: [
        { name: "Dark Zealotry", grants: "unite-menee",
          text: "Tant que cette unité mène une unité et contient la figurine DARK APOSTLE, chaque fois qu'une figurine de l'unité menée fait une attaque de mêlée, ajoutez 1 au jet de blessure." },
        { name: "Demagogue", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de n'importe quelle phase, vous pouvez choisir 1 unité HERETIC ASTARTES amie Ébranlée et à 12\" ou moins de la figurine DARK APOSTLE de cette unité : elle n'est plus Ébranlée." },
        { name: "Malign Sacrifice",
          text: "Au début de la phase de Combat, si cette unité contient une ou plusieurs figurines Dark Disciple, vous pouvez choisir l'une d'elles et 1 unité ennemie à portée d'engagement de cette unité, puis lancer 1D6 : sur 2-5, cette unité ennemie subit 1 blessure mortelle ; sur 6, elle subit D3 blessures mortelles. Ce Dark Disciple est ensuite détruit." }
      ],
      composition: "1 Dark Apostle et 2 Dark Disciples"
    },

    {
      id: "dark-commune",
      name: "Dark Commune",
      category: "char-infantry",
      base: "32mm (autres figurines : 28,5mm)",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Damned", "Dark Commune", "Cult Demagogue"],
      keywordsNote: "Character et Cult Demagogue : Cult Demagogue seulement. Psyker : Mindwitch seulement.",
      stats: { M: "6\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1 },
      statLines: [
        { label: "Cult Demagogue",  stats: { M: "6\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1 } },
        { label: "Autres figurines", stats: { M: "6\"", T: 3, Sv: "6+", W: 1, Ld: "7+", OC: 1 } }
      ],
      sizes: [{ models: 5, costs: [{ from: 1, pts: 90 }, { from: 3, pts: 100 }] }],
      leader: { canLead: ["Accursed Cultists", "Cultist Mob"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "autopistol", name: "Autopistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "warp-curse", name: "Warp Curse", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "18\"", A: "3", skill: "3+", S: "4", AP: "-1", D: "2", abilities: ["psychic"] },
            { name: "focused witchfire", range: "18\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["hazardous", "psychic", "sustained-hits:2"] }
          ] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "commune-blade", name: "Commune blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "-2", D: "1", abilities: [] }] },
        { id: "commune-stave", name: "Commune stave", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "3", AP: "0", D: "D3", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "chaos-icon", name: "Chaos icon" }],
      models: [
        { id: "cult-demagogue", name: "Cult Demagogue", count: 1, loadout: ["autopistol", "commune-stave"] },
        { id: "mindwitch",      name: "Mindwitch",      count: 1, loadout: ["warp-curse", "close-combat-weapon"] },
        { id: "iconarch",       name: "Iconarch",       count: 1, loadout: ["autopistol", "close-combat-weapon", "chaos-icon"] },
        { id: "blessed-blade",  name: "Blessed Blade",  count: 2, loadout: ["commune-blade"] }
      ],
      abilities: [
        { name: "Faithful Flock", grants: "unite-menee",
          text: "Tant que cette unité mène une unité et contient la figurine CULT DEMAGOGUE, les figurines de l'unité menée ont une sauvegarde invulnérable de 5+." },
        { name: "Dark Ritual", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, à votre phase de Commandement, si cette unité contient la figurine CULT DEMAGOGUE, elle peut utiliser cette aptitude. Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Avancé, et chaque fois qu'une de ses figurines attaque, ajoutez 1 au jet de touche et 1 au jet de blessure." },
        { name: "Chaos Icon", requiresWargear: "chaos-icon",
          text: "Chaque fois que l'unité du porteur fait un test de Commandement pour l'aptitude Sombres Pactes, vous pouvez relancer ce test." }
      ],
      composition: "1 Cult Demagogue, 1 Mindwitch, 1 Iconarch et 2 Blessed Blades"
    },

    {
      id: "master-of-executions",
      name: "Master of Executions",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Master of Executions"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      leader: { type: "support", canLead: ["Chosen", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["support"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "axe-of-dismemberment", name: "Axe of dismemberment", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "7", AP: "-2", D: "2", abilities: ["devastating-wounds", "precision"] }] }
      ],
      loadout: ["bolt-pistol", "axe-of-dismemberment"],
      abilities: [
        { name: "Warp-sighted Butcher", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque de mêlée contre une unité en dessous de son effectif initial, vous pouvez relancer le jet de touche. Si la cible est en dessous de la moitié de son effectif, vous pouvez aussi relancer le jet de blessure." },
        { name: "Trophy Taker",
          text: "Chaque fois que cette figurine détruit une figurine CHARACTER ennemie, vous gagnez 1 PC." }
      ],
      composition: "1 Master of Executions"
    },

    {
      id: "master-of-possession",
      name: "Master of Possession",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Psyker", "Chaos", "Master of Possession"],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { canLead: ["Chosen", "Legionaries", "Nemesis Claw", "Possessed", "Red Corsairs Raiders"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "rite-of-possession", name: "Rite of Possession", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "18\"", A: "2", skill: "3+", S: "4", AP: "-3", D: "2", abilities: ["anti:Psyker 2+", "pistol", "precision", "psychic"] },
            { name: "focused witchfire", range: "18\"", A: "2", skill: "3+", S: "6", AP: "-3", D: "3", abilities: ["anti:Psyker 2+", "hazardous", "pistol", "precision", "psychic"] }
          ] },
        { id: "staff-of-possession", name: "Staff of possession", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "D3", abilities: ["anti:Psyker 2+", "psychic"] }] }
      ],
      loadout: ["bolt-pistol", "rite-of-possession", "staff-of-possession"],
      abilities: [
        { name: "Daemonkin (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, ajoutez 1 aux jets d'Avance et de Charge de cette unité." },
        { name: "Sacrificial Dagger",
          text: "Une fois par phase, quand cette figurine est choisie pour tirer ou combattre, elle peut utiliser cette aptitude : son unité subit 1 blessure mortelle et, jusqu'à la fin de la phase, chaque fois que cette figurine fait une attaque psychique, ajoutez 1 au jet de touche et 1 au jet de blessure." }
      ],
      composition: "1 Master of Possession"
    },

    {
      id: "red-corsairs-reave-captain",
      name: "Red Corsairs Reave-Captain",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Red Corsairs Reave-Captain"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { canLead: ["Chosen", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["infiltrators", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "power-maul", name: "Power maul", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "5", AP: "-2", D: "1", abilities: ["sustained-hits:1"] }] }
      ],
      loadout: ["bolt-pistol", "power-sword"],
      options: [
        { id: "remplace-sword", text: "La power sword peut être remplacée par 1 power maul.",
          replaces: ["power-sword"], choices: [["power-maul"]] },
        { id: "ajout-plasma", text: "Cette figurine peut être équipée de 1 plasma pistol.",
          choices: [["plasma-pistol"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Brutal Raider",
          text: "Chaque fois que l'unité de cette figurine finit un mouvement de Charge, jusqu'à la fin du tour, ajoutez 1 à la Force des armes de mêlée de cette figurine et améliorez de 1 leur Pénétration d'Armure." },
        { name: "Raider's Due",
          text: "Quand cette unité déclare une charge, si une unité ennemie à portée d'un pion objectif est à 12\" ou moins d'elle, vous pouvez utiliser cette aptitude : cette unité peut relancer le jet de Charge, mais doit finir ce mouvement de Charge engagée avec une ou plusieurs de ces unités ennemies." }
      ],
      composition: "1 Red Corsairs Reave-Captain"
    },

    {
      id: "sorcerer-in-terminator-armour",
      name: "Sorcerer in Terminator Armour",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Psyker", "Chaos", "Terminator", "Sorcerer in Terminator Armour"],
      stats: { M: "5\"", T: 6, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 85 }] }],
      leader: { canLead: ["Chaos Terminator Squad"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "infernal-gaze", name: "Infernal Gaze", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "24\"", A: "D6", skill: "3+", S: "5", AP: "-1", D: "D3", abilities: ["psychic"] },
            { name: "focused witchfire", range: "24\"", A: "D6", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["devastating-wounds", "hazardous", "psychic"] }
          ] },
        { id: "force-weapon", name: "Force weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "D3", abilities: ["psychic"] }] }
      ],
      wargear: [{ id: "chaos-familiar", name: "Chaos familiar" }],
      loadout: ["combi-bolter", "infernal-gaze", "force-weapon"],
      options: [
        { id: "remplace-combi", text: "Le combi-bolter peut être remplacé par 1 combi-weapon.",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]] },
        { id: "familiar", text: "Cette figurine peut être équipée de 1 Chaos familiar.",
          choices: [["chaos-familiar"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Warptime (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, vous pouvez relancer les jets d'Avance et de Charge de cette unité." },
        { name: "Death Hex (Psychic)",
          text: "Au début de votre phase de Tir, un PSYKER qui a cette aptitude peut l'utiliser : choisissez 1 unité ennemie visible et à 12\" ou moins de lui, puis lancez 1D6. Sur 1, l'unité de ce PSYKER subit D3 blessures mortelles. Sur 2+, jusqu'au début de votre prochaine phase de Mouvement, chaque fois qu'une attaque cible cette unité ennemie, améliorez de 1 la Pénétration d'Armure de l'attaque." },
        { name: "Chaos Familiar", requiresWargear: "chaos-familiar", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, quand une attaque est allouée au porteur, vous pouvez réduire à 0 les Dégâts de cette attaque." }
      ],
      composition: "1 Sorcerer in Terminator Armour"
    },

    {
      id: "sorcerer",
      name: "Sorcerer",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Psyker", "Grenades", "Chaos", "Sorcerer"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { canLead: ["Chosen", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "infernal-gaze", name: "Infernal Gaze", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "24\"", A: "D6", skill: "3+", S: "5", AP: "-1", D: "D3", abilities: ["psychic"] },
            { name: "focused witchfire", range: "24\"", A: "D6", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["devastating-wounds", "hazardous", "psychic"] }
          ] },
        { id: "force-weapon", name: "Force weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "D3", abilities: ["psychic"] }] }
      ],
      loadout: ["bolt-pistol", "infernal-gaze", "force-weapon"],
      abilities: [
        { name: "Prescience (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une attaque cible cette unité, soustrayez 1 au jet de touche." },
        { name: "Gift of Chaos (Psychic)",
          text: "Chaque fois que cette figurine est choisie pour tirer ou combattre, après avoir résolu ses attaques, choisissez 1 unité ennemie touchée par une ou plusieurs de ses attaques [PSYCHIQUE] : elle doit faire un test de Commandement. S'il est raté, elle subit D3 blessures mortelles." }
      ],
      composition: "1 Sorcerer"
    },

    {
      id: "traitor-enforcer",
      name: "Traitor Enforcer",
      category: "char-infantry",
      base: "32mm (Traitor Ogryn : 40mm)",
      keywords: ["Infantry", "Character", "Chaos", "Grenades", "Damned", "Traitor Enforcer"],
      keywordsNote: "Character et Traitor Enforcer : Traitor Enforcer seulement.",
      stats: { M: "6\"", T: 3, Sv: "5+", W: 3, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Traitor Enforcer", stats: { M: "6\"", T: 3, Sv: "5+", W: 3, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Traitor Ogryn",    stats: { M: "6\"", T: 6, Sv: "5+", W: 4, Ld: "7+", OC: 1 } }
      ],
      sizes: [{ models: 2, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Traitor Guardsmen Squad"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "ogryn-weapons", name: "Ogryn weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "7", AP: "-1", D: "2", abilities: [] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "traitor-enforcer", name: "Traitor Enforcer", count: 1, loadout: ["bolt-pistol", "power-fist"] },
        { id: "traitor-ogryn",    name: "Traitor Ogryn",    count: 1, loadout: ["ogryn-weapons"] }
      ],
      abilities: [
        { name: "Brutal Example", usage: "une-fois-par-tour", grants: "unite-menee",
          text: "Une fois par tour, tant que cette unité mène une unité et contient la figurine TRAITOR ENFORCER, vous pouvez cibler cette unité avec le stratagème Tir en État d'Alerte pour 0 PC, même si vous avez déjà ciblé une autre unité de votre armée avec ce stratagème à ce tour. Chaque fois que vous utilisez cette aptitude, une figurine de gardes du corps de cette unité est détruite." },
        { name: "Mutated Bodyguard",
          text: "Tant que cette unité contient la figurine Traitor Ogryn, les figurines CHARACTER de cette unité ont l'aptitude Insensible à la Douleur 4+." }
      ],
      composition: "1 Traitor Enforcer et 1 Traitor Ogryn"
    },

    {
      id: "warpsmith",
      name: "Warpsmith",
      category: "char-infantry",
      base: "60 x 35,5mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Warpsmith"],
      stats: { M: "6\"", T: 5, Sv: "2+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { canLead: ["Chosen", "Havocs", "Legionaries", "Nemesis Claw", "Red Corsairs Raiders"] },
      coreAbilities: ["leader"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "flamer-tendril", name: "Flamer tendril", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "3", AP: "0", D: "1", abilities: ["ignores-cover", "pistol", "torrent"] }] },
        { id: "melta-tendril", name: "Melta tendril", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "8", AP: "-4", D: "D3", abilities: ["melta:2", "pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "forge-weapon", name: "Forge weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-2", D: "2", abilities: ["anti:Véhicule 4+"] }] }
      ],
      loadout: ["flamer-tendril", "melta-tendril", "plasma-pistol", "forge-weapon"],
      abilities: [
        { name: "Warpsmith",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités HERETIC ASTARTES VEHICLE amies, elle a l'aptitude Agent Solitaire." },
        { name: "Master of Mechanisms",
          text: "À votre phase de Commandement, choisissez 1 figurine HERETIC ASTARTES VEHICLE amie à 3\" ou moins de cette figurine : elle récupère jusqu'à D3 PV perdus et, jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'elle attaque, ajoutez 1 au jet de touche. Chaque figurine ne peut être choisie qu'une fois par phase de Commandement pour cette aptitude." },
        { name: "Enrage Machine Spirits",
          text: "À la fin de votre phase de Mouvement, choisissez 1 unité VEHICLE ennemie à 12\" ou moins de cette figurine : elle doit faire un test d'Ébranlement." }
      ],
      composition: "1 Warpsmith"
    },

    /* ---------- Personnages monstres ---------- */
    {
      id: "heretic-astartes-daemon-prince",
      name: "Heretic Astartes Daemon Prince",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Chaos", "Daemon", "Daemon Prince"],
      stats: { M: "8\"", T: 10, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 155 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      // Daemonic Allegiance : marque obligatoire choisie dans le builder ;
      // mods = modificateurs appliqués à la fiche (caractéristique ou arme)
      markChoice: {
        required: true,
        name: "Daemonic Allegiance",
        options: [
          { mark: "Khorne",   text: "Ajoutez 2 à la Force des hellforged weapons de cette figurine.", mods: [{ weapon: "hellforged-weapons", S: 2 }] },
          { mark: "Tzeentch", text: "Ajoutez 3 aux Attaques de son infernal cannon.",                 mods: [{ weapon: "infernal-cannon", A: 3 }] },
          { mark: "Nurgle",   text: "Ajoutez 1 à son Endurance.",                                     mods: [{ stat: "T", add: 1 }] },
          { mark: "Slaanesh", text: "Ajoutez 2\" à son Mouvement.",                                   mods: [{ stat: "M", add: 2 }] }
        ]
      },
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: [] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "6", AP: "0",  D: "1", abilities: [] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Dark Blessing (Aura)",
          text: "Tant qu'une unité HERETIC ASTARTES INFANTRY amie est à 6\" ou moins de cette figurine, chaque fois qu'une attaque de tir est allouée à une figurine de cette unité, cette figurine a le Bénéfice du Couvert contre cette attaque." },
        { name: "Ascended Daemon",
          text: "Chaque fois que cette figurine tire ou combat, pendant la résolution de ces attaques, vous pouvez relancer un jet de touche et un jet de blessure." },
        { name: "Lord of Chaos",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités HERETIC ASTARTES INFANTRY amies, elle a l'aptitude Agent Solitaire." },
        { name: "Daemonic Allegiance",
          text: "Quand vous incluez cette figurine dans votre armée, choisissez l'un des mots-clés KHORNE, TZEENTCH, NURGLE ou SLAANESH. Jusqu'à la fin de la bataille, elle a ce mot-clé et le modificateur associé (voir l'allégeance choisie)." }
      ],
      composition: "1 Heretic Astartes Daemon Prince"
    },

    {
      id: "heretic-astartes-daemon-prince-with-wings",
      name: "Heretic Astartes Daemon Prince with Wings",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Fly", "Character", "Chaos", "Daemon", "Daemon Prince with Wings"],
      stats: { M: "12\"", T: 9, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 170 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["sombres-pactes"],
      // Daemonic Allegiance : marque obligatoire choisie dans le builder ;
      // mods = modificateurs appliqués à la fiche (caractéristique ou arme)
      markChoice: {
        required: true,
        name: "Daemonic Allegiance",
        options: [
          { mark: "Khorne",   text: "Ajoutez 2 à la Force des hellforged weapons de cette figurine.", mods: [{ weapon: "hellforged-weapons", S: 2 }] },
          { mark: "Tzeentch", text: "Ajoutez 3 aux Attaques de son infernal cannon.",                 mods: [{ weapon: "infernal-cannon", A: 3 }] },
          { mark: "Nurgle",   text: "Ajoutez 1 à son Endurance.",                                     mods: [{ stat: "T", add: 1 }] },
          { mark: "Slaanesh", text: "Ajoutez 2\" à son Mouvement.",                                   mods: [{ stat: "M", add: 2 }] }
        ]
      },
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: [] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "6", AP: "0",  D: "1", abilities: [] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Daemonic Destruction",
          text: "Chaque fois que cette figurine finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement et lancez 1D6 par PV restant de cette figurine : pour chaque 4+, cette unité subit 1 blessure mortelle (6 blessures mortelles au maximum)." },
        { name: "Flying Horror",
          text: "Chaque fois que cette figurine finit un Mouvement Normal ou une Avance, choisissez 1 unité ennemie qu'elle a survolée pendant ce mouvement : elle doit faire un test d'Ébranlement." },
        { name: "Daemonic Allegiance",
          text: "Quand vous incluez cette figurine dans votre armée, choisissez l'un des mots-clés KHORNE, TZEENTCH, NURGLE ou SLAANESH. Jusqu'à la fin de la bataille, elle a ce mot-clé et le modificateur associé (voir l'allégeance choisie)." }
      ],
      composition: "1 Heretic Astartes Daemon Prince with Wings"
    },

    /* ---------- Personnages montés ----------
       Catégorie « char-mounted » ajoutée dans config.js */
    {
      id: "lord-discordant-on-helstalker",
      name: "Lord Discordant on Helstalker",
      category: "char-mounted",
      base: "120 x 92mm",
      keywords: ["Mounted", "Character", "Chaos", "Daemon", "Lord Discordant"],
      stats: { M: "14\"", T: 9, Sv: "2+", W: 10, Ld: "6+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 155 }] }],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "baleflamer", name: "Baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-1", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "helstalker-autocannon", name: "Helstalker autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "3", skill: "2+", S: "9", AP: "-1", D: "3", abilities: [] }] },
        { id: "magma-cutter", name: "Magma cutter", type: "ranged",
          profiles: [{ range: "6\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "bladed-limbs", name: "Bladed limbs", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["extra-attacks"] }] },
        { id: "impaler-chainglaive", name: "Impaler chainglaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-3", D: "3", abilities: ["lance"] }] },
        { id: "techno-virus-injector", name: "Techno-virus injector", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "3+", S: "3", AP: "-3", D: "2", abilities: ["anti:Véhicule 2+", "extra-attacks"] }] }
      ],
      loadout: ["bolt-pistol", "helstalker-autocannon", "techno-virus-injector", "bladed-limbs", "impaler-chainglaive"],
      options: [
        { id: "remplace-autocannon", text: "Le Helstalker autocannon peut être remplacé par 1 baleflamer.",
          replaces: ["helstalker-autocannon"], choices: [["baleflamer"]] },
        { id: "remplace-injector", text: "Le techno-virus injector peut être remplacé par 1 magma cutter.",
          replaces: ["techno-virus-injector"], choices: [["magma-cutter"]] }
      ],
      abilities: [
        { name: "Corrupt Machine Spirits",
          text: "Au début de votre phase de Tir, choisissez 1 unité VEHICLE ennemie visible et à 12\" ou moins de cette figurine, puis lancez 1D6 : sur 2-3, elle subit D3 blessures mortelles ; sur 4-5, elle subit 3 blessures mortelles ; sur 6, elle subit D3+3 blessures mortelles." },
        { name: "Spirit Thief",
          text: "Au début de votre phase de Tir, choisissez 1 unité VEHICLE ennemie visible. Jusqu'à la fin de la phase, chaque fois qu'une figurine HERETIC ASTARTES amie attaque cette unité, relancez un jet de blessure de 1." }
      ],
      composition: "1 Lord Discordant on Helstalker"
    },

    /* ---------- Ligne ---------- */
    {
      id: "cultist-mob",
      name: "Cultist Mob",
      category: "battleline",
      base: "25mm",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Damned", "Cultist Mob"],
      stats: { M: "6\"", T: 3, Sv: "6+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 50 }] },
        { models: 20, costs: [{ from: 1, pts: 90 }] }
      ],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "autopistol", name: "Autopistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "brutal-assault-weapon", name: "Brutal assault weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "cultist-champion", name: "Cultist Champion", count: 1,       loadout: ["autopistol", "brutal-assault-weapon"] },
        { id: "chaos-cultist",    name: "Chaos Cultist",    count: "reste", loadout: ["autopistol", "brutal-assault-weapon"] }
      ],
      options: [
        { id: "champ-pistol", model: "cultist-champion", text: "L'autopistol du Cultist Champion peut être remplacé par 1 bolt pistol.",
          replaces: ["autopistol"], choices: [["bolt-pistol"]] }
      ],
      abilities: [
        { name: "For the Dark Gods",
          text: "À la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle de votre adversaire sur ce pion soit supérieur au vôtre à la fin d'une phase." }
      ],
      composition: "1 Cultist Champion et 9 à 19 Chaos Cultists"
    },

    {
      id: "khorne-berzerkers",
      name: "Khorne Berzerkers",
      category: "battleline",
      base: "32mm",
      requiresArmyRule: "cultes-des-dieux-sombres",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Khorne", "Berzerkers", "World Eaters"],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 170 }] },
        { models: 20, costs: [{ from: 1, pts: 330 }] }
      ],
      coreAbilities: [],
      armyRules: [],                               // règle de son armée d'origine : sans effet chez les Chaos Space Marines
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "4+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "4+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "chainblade", name: "Chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "khornate-eviscerator", name: "Khornate eviscerator", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "icon-of-khorne", name: "Icon of Khorne" }],
      models: [
        { id: "berzerker-champion", name: "Khorne Berzerker Champion", count: 1,       loadout: ["bolt-pistol", "chainblade"] },
        { id: "berzerker",          name: "Khorne Berzerker",          count: "reste", loadout: ["bolt-pistol", "chainblade"] }
      ],
      options: [
        { id: "champ-plasma", model: "berzerker-champion", text: "Le bolt pistol du Khorne Berzerker Champion peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "plasma", model: "berzerker", text: "Pour chaque tranche de 5 figurines, le bolt pistol d'1 Khorne Berzerker peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]], max: { per: 5, count: 1 } },
        { id: "eviscerator", model: "berzerker", text: "Pour chaque tranche de 5 figurines, la chainblade d'1 Khorne Berzerker peut être remplacée par 1 Khornate eviscerator.",
          replaces: ["chainblade"], choices: [["khornate-eviscerator"]], max: { per: 5, count: 1 } },
        { id: "icon", text: "1 figurine peut être équipée de 1 Icon of Khorne.",
          choices: [["icon-of-khorne"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Blood Surge",
          text: "À la phase de Tir adverse, après qu'une unité ennemie a tiré, si une figurine de cette unité a été détruite par ces attaques, cette unité peut faire un mouvement d'Élan de D6+2\" maximum." },
        { name: "Murderous Charge",
          text: "Si cette unité a fait un mouvement de Charge à ce tour, ses attaques de mêlée ont +1 en Force." },
        { name: "Icon of Khorne", requiresWargear: "icon-of-khorne", inactive: true,
          text: "Si l'unité du porteur contient une ou plusieurs Icons of Khorne, chaque fois qu'elle détruit une unité ennemie, vous gagnez 1 point de Sang Versé. Chaque fois que vous faites un jet de Bénédictions de Khorne, lancez 1D6 supplémentaire par point de Sang Versé, puis vous perdez tous vos points de Sang Versé. (Sans effet dans une armée de Chaos Space Marines : la règle dont elle dépend ne s'applique que dans son armée d'origine.)" }
      ],
      composition: "1 Khorne Berzerker Champion et 9 à 19 Khorne Berzerkers"
    },

    {
      id: "legionaries",
      name: "Legionaries",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Chaos", "Grenades", "Legionaries"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 95 }] },
        { models: 10, costs: [{ from: 1, pts: 180 }] }
      ],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "balefire-tome", name: "Balefire tome", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["psychic"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "havoc-autocannon", name: "Havoc autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "4+", S: "9", AP: "-1", D: "3", abilities: [] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["heavy", "sustained-hits:1"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: ["heavy"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "4+", S: "4", AP: "0",  D: "1",  abilities: ["blast", "heavy"] },
            { name: "krak", range: "48\"", A: "1",  skill: "4+", S: "9", AP: "-2", D: "D6", abilities: ["heavy"] }
          ] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "reaper-chaincannon", name: "Reaper chaincannon", type: "ranged",
          profiles: [{ range: "24\"", A: "8", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["heavy"] }] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainsword", name: "Astartes chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "heavy-melee-weapon", name: "Heavy melee weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "chaos-icon", name: "Chaos icon" }],
      maxPerModel: { "plasma-pistol": 1 },       // 1 plasma pistol maximum par figurine
      models: [
        { id: "aspiring-champion", name: "Aspiring Champion", count: 1,       loadout: ["bolt-pistol", "boltgun", "close-combat-weapon"] },
        { id: "legionary",         name: "Legionary",         count: "reste", loadout: ["bolt-pistol", "boltgun", "close-combat-weapon"] }
      ],
      options: [
        { id: "champ-boltgun", model: "aspiring-champion", text: "Le boltgun de l'Aspiring Champion peut être remplacé par 1 plasma pistol, 1 accursed weapon, 1 Astartes chainsword ou 1 heavy melee weapon (1 plasma pistol maximum par figurine).",
          replaces: ["boltgun"], choices: [["plasma-pistol"], ["accursed-weapon"], ["astartes-chainsword"], ["heavy-melee-weapon"]] },
        { id: "champ-pistol", model: "aspiring-champion", text: "Le bolt pistol de l'Aspiring Champion peut être remplacé par 1 plasma pistol, 1 accursed weapon, 1 Astartes chainsword ou 1 heavy melee weapon (1 plasma pistol maximum par figurine).",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"], ["accursed-weapon"], ["astartes-chainsword"], ["heavy-melee-weapon"]] },
        { id: "icon", text: "1 figurine peut être équipée de 1 Chaos icon.",
          choices: [["chaos-icon"]], max: { count: 1 } },
        { id: "chainsword", model: "legionary", text: "N'importe quel nombre de Legionaries peuvent remplacer leur boltgun par 1 Astartes chainsword.",
          replaces: ["boltgun"], choices: [["astartes-chainsword"]] },
        { id: "heavy-melee", model: "legionary", text: "Le boltgun d'1 Legionary peut être remplacé par 1 heavy melee weapon.",
          replaces: ["boltgun"], choices: [["heavy-melee-weapon"]], max: { count: 1 } },
        { id: "tome", model: "legionary", text: "Le boltgun d'1 Legionary peut être remplacé par 1 balefire tome.",
          replaces: ["boltgun"], choices: [["balefire-tome"]], max: { count: 1 } },
        { id: "special", model: "legionary", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Legionary peut être remplacé par l'une des armes suivantes (pas de doublon) : 1 plasma pistol et 1 Astartes chainsword, 1 flamer, 1 havoc autocannon, 1 heavy bolter, 1 lascannon, 1 meltagun, 1 missile launcher, 1 plasma gun ou 1 reaper chaincannon.",
          replaces: ["boltgun"], noDuplicates: true, max: { per: 5, count: 1 },
          choices: [["plasma-pistol", "astartes-chainsword"], ["flamer"], ["havoc-autocannon"], ["heavy-bolter"], ["lascannon"], ["meltagun"], ["missile-launcher"], ["plasma-gun"], ["reaper-chaincannon"]] }
      ],
      abilities: [
        { name: "Veterans of the Long War",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée contre une unité ennemie, relancez un jet de blessure de 1. Si cette unité ennemie est à portée d'un pion objectif, vous pouvez relancer le jet de blessure à la place." },
        { name: "Chaos Icon", requiresWargear: "chaos-icon",
          text: "Chaque fois que l'unité du porteur fait un test de Commandement pour l'aptitude Sombres Pactes, vous pouvez relancer ce test." }
      ],
      composition: "1 Aspiring Champion et 4 à 9 Legionaries"
    },

    {
      id: "plague-marines",
      name: "Plague Marines",
      category: "battleline",
      base: "32mm",
      requiresArmyRule: "cultes-des-dieux-sombres",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Nurgle", "Plague Marines", "Death Guard"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 90 }] },
        { models: 7,  costs: [{ from: 1, pts: 125 }] },
        { models: 10, costs: [{ from: 1, pts: 175 }] }
      ],
      coreAbilities: [],
      armyRules: [],                               // règle de son armée d'origine : sans effet chez les Chaos Space Marines
      weapons: [
        { id: "blight-launcher", name: "Blight launcher", type: "ranged",
          profiles: [{ range: "24\"", A: "D3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["blast", "lethal-hits"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "pistol"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plague-belcher", name: "Plague belcher", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["anti:Infanterie 4+", "ignores-cover", "torrent"] }] },
        { id: "plague-spewer", name: "Plague spewer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "bubotic-weapons", name: "Bubotic weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["lethal-hits"] }] },
        { id: "heavy-plague-weapon", name: "Heavy plague weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "plague-knives", name: "Plague knives", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] }
      ],
      wargear: [{ id: "icon-of-despair", name: "Icon of despair" }],
      models: [
        { id: "plague-champion", name: "Plague Champion", count: 1,       loadout: ["boltgun", "plague-knives"] },
        { id: "plague-marine",   name: "Plague Marine",   count: "reste", loadout: ["boltgun", "plague-knives"] }
      ],
      options: [
        { id: "champ-boltgun", model: "plague-champion", text: "Le boltgun du Plague Champion peut être remplacé par 1 bolt pistol, 1 plasma gun ou 1 plasma pistol.",
          replaces: ["boltgun"], choices: [["bolt-pistol"], ["plasma-gun"], ["plasma-pistol"]] },
        { id: "champ-knives", model: "plague-champion", text: "Les plague knives du Plague Champion peuvent être remplacés par 1 bubotic weapons ou 1 power fist.",
          replaces: ["plague-knives"], choices: [["bubotic-weapons"], ["power-fist"]] },
        { id: "blight", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 blight launcher.",
          replaces: ["boltgun"], choices: [["blight-launcher"]], max: { per: 5, count: 1 } },
        { id: "spewer", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 plague spewer.",
          replaces: ["boltgun"], choices: [["plague-spewer"]], max: { per: 5, count: 1 } },
        { id: "special", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 meltagun, 1 plague belcher ou 1 plasma gun.",
          replaces: ["boltgun"], choices: [["meltagun"], ["plague-belcher"], ["plasma-gun"]], max: { per: 5, count: 1 } },
        { id: "bubotic", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Plague Marines peuvent remplacer leur boltgun par 1 bubotic weapons.",
          replaces: ["boltgun"], choices: [["bubotic-weapons"]], max: { per: 5, count: 2 } },
        { id: "heavy-plague", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Plague Marines peuvent remplacer leur boltgun par 1 heavy plague weapon.",
          replaces: ["boltgun"], choices: [["heavy-plague-weapon"]], max: { per: 5, count: 2 } },
        { id: "icon", model: "plague-marine", requiresWeapon: "boltgun", text: "1 Plague Marine équipé d'un boltgun peut être équipé de 1 icon of despair. Son boltgun ne peut alors pas être remplacé.",
          choices: [["icon-of-despair"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Infused with the Blessings of Nurgle", inactive: true,
          text: "À votre phase de Tir, chaque fois que cette unité est choisie pour tirer, après qu'elle a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques : jusqu'au début de votre prochain tour, cette unité ennemie est Affligée. (Sans effet dans une armée de Chaos Space Marines : la règle dont elle dépend ne s'applique que dans son armée d'origine.)" },
        { name: "Icon of Despair (Aura)", requiresWargear: "icon-of-despair",
          text: "Tant qu'une unité ennemie est à 6\" ou moins du porteur, dégradez de 1 la caractéristique de Commandement de ses figurines." }
      ],
      composition: "1 Plague Champion et 4 à 9 Plague Marines"
    },

    {
      id: "rubric-marines",
      name: "Rubric Marines",
      category: "battleline",
      base: "32mm",
      requiresArmyRule: "cultes-des-dieux-sombres",
      keywords: ["Infantry", "Battleline", "Chaos", "Tzeentch", "Rubricae", "Rubric Marines", "Thousand Sons"],
      keywordsNote: "Psyker : Aspiring Sorcerer seulement.",
      stats: { M: "6\"", T: 5, Sv: "3+", W: 2, Ld: "7+", OC: 2, InSv: "5+" },
      statLines: [
        { label: "Rubric Marine",     stats: { M: "6\"", T: 5, Sv: "3+", W: 2, Ld: "7+", OC: 2, InSv: "5+" } },
        { label: "Aspiring Sorcerer", stats: { M: "6\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 2, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 115 }, { from: 4, pts: 125 }] },
        { models: 10, costs: [{ from: 1, pts: 210 }, { from: 4, pts: 220 }] }
      ],
      coreAbilities: [],
      armyRules: [],                               // règle de son armée d'origine : sans effet chez les Chaos Space Marines
      weapons: [
        { id: "inferno-bolt-pistol", name: "Inferno bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["pistol"] }] },
        { id: "inferno-boltgun", name: "Inferno boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "malefic-curse", name: "Malefic Curse", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "4", AP: "-3", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "psychic"] }] },
        { id: "soulreaper-cannon", name: "Soulreaper cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "6", skill: "3+", S: "6", AP: "-2", D: "1", abilities: ["devastating-wounds"] }] },
        { id: "warpflame-pistol", name: "Warpflame pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "3", AP: "-1", D: "1", abilities: ["ignores-cover", "pistol", "torrent"] }] },
        { id: "warpflamer", name: "Warpflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "force-weapon", name: "Force weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-1", D: "D3", abilities: ["psychic"] }] }
      ],
      wargear: [{ id: "icon-of-flame", name: "Icon of flame" }],
      models: [
        { id: "aspiring-sorcerer", name: "Aspiring Sorcerer", count: 1,       loadout: ["inferno-bolt-pistol", "malefic-curse", "force-weapon"] },
        { id: "rubric-marine",     name: "Rubric Marine",     count: "reste", loadout: ["inferno-boltgun", "close-combat-weapon"] }
      ],
      options: [
        { id: "sorc-pistol", model: "aspiring-sorcerer", text: "L'inferno bolt pistol de l'Aspiring Sorcerer peut être remplacé par 1 warpflame pistol.",
          replaces: ["inferno-bolt-pistol"], choices: [["warpflame-pistol"]] },
        { id: "soulreaper", model: "rubric-marine", text: "L'inferno boltgun d'1 Rubric Marine peut être remplacé par 1 soulreaper cannon.",
          replaces: ["inferno-boltgun"], choices: [["soulreaper-cannon"]], max: { count: 1 } },
        { id: "warpflamer", model: "rubric-marine", text: "N'importe quel nombre de Rubric Marines peuvent remplacer leur inferno boltgun par 1 warpflamer.",
          replaces: ["inferno-boltgun"], choices: [["warpflamer"]] },
        { id: "icon", model: "rubric-marine", text: "1 Rubric Marine peut être équipé de 1 icon of flame.",
          choices: [["icon-of-flame"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Bringers of Change",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir, relancez un jet de blessure de 1. Si l'attaque cible une unité à portée d'un pion objectif que vous ne contrôlez pas, vous pouvez relancer le jet de blessure à la place." },
        { name: "Icon of Flame", requiresWargear: "icon-of-flame",
          text: "Les armes de tir des figurines de l'unité du porteur (sauf CHARACTER) ont [IGNORE LE COUVERT]." }
      ],
      composition: "1 Aspiring Sorcerer et 4 à 9 Rubric Marines"
    },

    /* ---------- Transports assignés ---------- */
    {
      id: "chaos-rhino",
      name: "Chaos Rhino",
      category: "dedicated-transport",
      base: null,                                   // socle : la figurine elle-même
      keywords: ["Vehicle", "Frame", "Transport", "Dedicated Transport", "Smoke", "Chaos", "Rhino"],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }, { from: 4, pts: 75 }] }],
      coreAbilities: ["deadly-demise:D3", "firing-deck:2"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["combi-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon supplémentaire.",
          choices: [["combi-bolter"], ["combi-weapon"]] },
        { id: "havoc-ajout", group: "havoc", text: "Peut être équipé de 1 havoc launcher…",
          choices: [["havoc-launcher"]] },
        { id: "havoc-remplace", group: "havoc", text: "…ou remplacer 1 combi-bolter par 1 havoc launcher.",
          replaces: ["combi-bolter"], choices: [["havoc-launcher"]] }
      ],
      transport: {
        capacity: 12,
        allowed: [["Heretic Astartes", "Infantry"]],
        excluded: ["Terminator", "Jump Pack", "Mutilators", "Obliterators", "Possessed"],
        text: "Capacité de transport de 12 figurines HERETIC ASTARTES INFANTRY. Il ne peut pas transporter de figurines TERMINATOR, JUMP PACK, MUTILATORS, OBLITERATORS ou POSSESSED."
      },
      abilities: [
        { name: "Self Repair",
          text: "Au début de votre phase de Commandement, cette figurine récupère 1 PV perdu." }
      ],
      composition: "1 Chaos Rhino"
    },

    /* ---------- Bêtes ---------- */
    {
      id: "chaos-spawn",
      name: "Chaos Spawn",
      category: "beasts",
      base: "50mm",
      keywords: ["Beast", "Chaos", "Chaos Spawn"],
      stats: { M: "8\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 0 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 60 }] }],
      coreAbilities: ["feel-no-pain:5+"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "D6+2", skill: "4+", S: "5", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["hideous-mutations"],
      abilities: [
        { name: "Mind-breaking Mutations (Aura)",
          text: "Tant qu'une unité ennemie (sauf VEHICLE) est à 3\" ou moins de cette unité, soustrayez 1 à la CO de ses figurines." }
      ],
      composition: "2 Chaos Spawn"
    },

    /* ---------- Infanterie ----------
       countBySize : nombre de figurines d'un type selon l'effectif choisi
                     (count = valeur du plus petit effectif)
       noDuplicates : pas deux fois le même choix dans l'unité */
    {
      id: "accursed-cultists",
      name: "Accursed Cultists",
      category: "infantry",
      base: "25mm (Torments : 40mm)",
      keywords: ["Infantry", "Chaos", "Damned", "Accursed Cultists"],
      stats: { M: "6\"", T: 4, Sv: "6+", W: 1, Ld: "7+", OC: 1 },
      statLines: [
        { label: "Mutant",  stats: { M: "6\"", T: 4, Sv: "6+", W: 1, Ld: "7+", OC: 1 } },
        { label: "Torment", stats: { M: "6\"", T: 4, Sv: "6+", W: 3, Ld: "7+", OC: 1 } }
      ],
      sizes: [
        { models: 8,  costs: [{ from: 1, pts: 90 },  { from: 3, pts: 110 }] },
        { models: 16, costs: [{ from: 1, pts: 185 }, { from: 3, pts: 205 }] }
      ],
      coreAbilities: ["feel-no-pain:6+", "scouts:6\""],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "blasphemous-appendages", name: "Blasphemous appendages", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "D6+2", skill: "4+", S: "5", AP: "-1", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "torment", name: "Torment", count: 3, countBySize: { 8: 3, 16: 6 }, loadout: ["hideous-mutations"] },
        { id: "mutant",  name: "Mutant",  count: "reste", loadout: ["blasphemous-appendages"] }
      ],
      abilities: [
        { name: "Accursed Horde",
          text: "À la phase de Tir adverse, après qu'une unité ennemie a tiré, si une figurine de cette unité a été détruite par ces attaques, cette unité peut faire un mouvement d'Élan de D6\" maximum." }
      ],
      composition: "3 à 6 Torments et 5 à 10 Mutants (8 figurines : 3 Torments et 5 Mutants ; 16 figurines : 6 Torments et 10 Mutants)"
    },

    {
      id: "chaos-terminator-squad",
      name: "Chaos Terminator Squad",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Terminator", "Chaos Terminator Squad"],
      stats: { M: "5\"", T: 6, Sv: "2+", W: 3, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 185 }, { from: 3, pts: 215 }] },
        { models: 10, costs: [{ from: 1, pts: 370 }, { from: 3, pts: 400 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "heavy-flamer", name: "Heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "reaper-autocannon", name: "Reaper autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "4", skill: "3+", S: "7", AP: "-1", D: "1", abilities: ["devastating-wounds", "sustained-hits:1"] }] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "chainfist", name: "Chainfist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "8", AP: "-2", D: "2", abilities: ["anti:Véhicule 3+"] }] },
        { id: "paired-accursed-weapons", name: "Paired accursed weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "terminator-champion", name: "Terminator Champion", count: 1,       loadout: ["combi-bolter", "accursed-weapon"] },
        { id: "chaos-terminator",    name: "Chaos Terminator",    count: "reste", loadout: ["combi-bolter", "accursed-weapon"] }
      ],
      options: [
        { id: "arme-lourde", model: "chaos-terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter d'1 Terminator peut être remplacé par 1 heavy flamer ou 1 reaper autocannon.",
          replaces: ["combi-bolter"], choices: [["heavy-flamer"], ["reaper-autocannon"]], max: { per: 5, count: 1 } },
        { id: "combi-weapon", text: "N'importe quel nombre de figurines peuvent remplacer leur combi-bolter par 1 combi-weapon.",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]] },
        { id: "paired", text: "Pour chaque tranche de 5 figurines, le combi-bolter et l'accursed weapon d'1 figurine peuvent être remplacés par 1 paired accursed weapons.",
          replaces: ["combi-bolter", "accursed-weapon"], choices: [["paired-accursed-weapons"]], max: { per: 5, count: 1 } },
        { id: "power-fist", text: "Pour chaque tranche de 5 figurines, jusqu'à 3 figurines peuvent remplacer leur accursed weapon par 1 power fist.",
          replaces: ["accursed-weapon"], choices: [["power-fist"]], max: { per: 5, count: 3 } },
        { id: "chainfist", text: "Pour chaque tranche de 5 figurines, l'accursed weapon d'1 figurine peut être remplacée par 1 chainfist.",
          replaces: ["accursed-weapon"], choices: [["chainfist"]], max: { per: 5, count: 1 } }
      ],
      abilities: [
        { name: "Despoilers",
          text: "Chaque fois que cette unité fait un Sombre Pacte, jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, vous pouvez relancer le jet de touche." }
      ],
      composition: "1 Terminator Champion et 4 à 9 Chaos Terminators"
    },

    {
      id: "chosen",
      name: "Chosen",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Chosen"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 140 }, { from: 3, pts: 150 }] },
        { models: 10, costs: [{ from: 1, pts: 280 }, { from: 3, pts: 290 }] }
      ],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "paired-accursed-weapons", name: "Paired accursed weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "chaos-icon", name: "Chaos icon" }],
      models: [
        { id: "chosen-champion", name: "Chosen Champion", count: 1,       loadout: ["boltgun", "bolt-pistol", "accursed-weapon"] },
        { id: "chosen",          name: "Chosen",          count: "reste", loadout: ["boltgun", "bolt-pistol", "accursed-weapon"] }
      ],
      options: [
        { id: "plasma", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 figurines peuvent remplacer leur bolt pistol par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]], max: { per: 5, count: 2 } },
        { id: "combi", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 figurines peuvent remplacer leur boltgun par 1 combi-weapon.",
          replaces: ["boltgun"], choices: [["combi-weapon"]], max: { per: 5, count: 2 } },
        { id: "paired", text: "Pour chaque tranche de 5 figurines, le boltgun et l'accursed weapon d'1 figurine peuvent être remplacés par 1 paired accursed weapons.",
          replaces: ["boltgun", "accursed-weapon"], choices: [["paired-accursed-weapons"]], max: { per: 5, count: 1 } },
        { id: "power-fist", text: "Pour chaque tranche de 5 figurines, 1 figurine équipée d'un boltgun peut remplacer son accursed weapon par 1 power fist. Son boltgun ne peut alors pas être remplacé.",
          replaces: ["accursed-weapon"], choices: [["power-fist"]], max: { per: 5, count: 1 } },
        { id: "icon", text: "1 figurine peut être équipée de 1 Chaos icon.",
          choices: [["chaos-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Chosen Marauders",
          text: "Cette unité est éligible pour tirer et déclarer une charge à un tour où elle a Avancé ou Battu en Retraite." },
        { name: "Chaos Icon", requiresWargear: "chaos-icon",
          text: "Chaque fois que l'unité du porteur fait un test de Commandement pour l'aptitude Sombres Pactes, vous pouvez relancer ce test." }
      ],
      composition: "1 Chosen Champion et 4 à 9 Chosen"
    },

    {
      id: "fellgor-beastmen",
      name: "Fellgor Beastmen",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Damned", "Fellgor Beastmen"],
      stats: { M: "6\"", T: 4, Sv: "5+", W: 1, Ld: "7+", OC: 1 },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 60 }] }],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "autopistol", name: "Autopistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "corrupted-stave", name: "Corrupted stave", type: "ranged",
          profiles: [{ range: "18\"", A: "D3", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["devastating-wounds", "psychic"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "4+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "4+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "chainsword", name: "Chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "corrupted-stave-melee", name: "Corrupted stave", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "-1", D: "D3", abilities: ["devastating-wounds", "psychic"] }] },
        { id: "great-weapon", name: "Great weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "5+", S: "8", AP: "-1", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "fellgor-champion", name: "Fellgor Champion", count: 1,       loadout: ["bolt-pistol", "chainsword"] },
        { id: "fellgor-beastman", name: "Fellgor Beastman", count: "reste", loadout: ["autopistol", "close-combat-weapon"] }
      ],
      options: [
        { id: "champ-plasma", model: "fellgor-champion", text: "Le bolt pistol du Fellgor Champion peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "great-weapon", model: "fellgor-beastman", text: "La close combat weapon d'1 Fellgor Beastman peut être remplacée par 1 great weapon.",
          replaces: ["close-combat-weapon"], choices: [["great-weapon"]], max: { count: 1 } },
        { id: "stave", model: "fellgor-beastman", text: "La close combat weapon d'1 Fellgor Beastman peut être remplacée par 1 corrupted stave.",
          replaces: ["close-combat-weapon"], choices: [["corrupted-stave", "corrupted-stave-melee"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Bestial Raiders",
          text: "Si cette unité commence la partie en Réserves Stratégiques, elle peut être placée à l'étape des Renforts de votre 1re, 2e ou 3e phase de Mouvement, quelles que soient les règles de la mission. Pour la placer sur le champ de bataille depuis les Réserves Stratégiques, considérez que le round en cours a un numéro de plus que le round réel." }
      ],
      composition: "1 Fellgor Champion et 9 Fellgor Beastmen"
    },

    {
      id: "havocs",
      name: "Havocs",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Havocs"],
      stats: { M: "5\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
      sizes: [{ models: 5, costs: [{ from: 1, pts: 135 }, { from: 3, pts: 145 }] }],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "havoc-autocannon", name: "Havoc autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "9", AP: "-1", D: "3", abilities: [] }] },
        { id: "havoc-heavy-bolter", name: "Havoc heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1"] }] },
        { id: "havoc-lascannon", name: "Havoc lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "havoc-missile-launcher", name: "Havoc missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "3+", S: "4", AP: "0",  D: "1",  abilities: ["blast"] },
            { name: "krak", range: "48\"", A: "1",  skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }
          ] },
        { id: "havoc-reaper-chaincannon", name: "Havoc reaper chaincannon", type: "ranged",
          profiles: [{ range: "24\"", A: "8", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainsword", name: "Astartes chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "havoc-champion", name: "Havoc Champion",                count: 1, loadout: ["flamer", "astartes-chainsword"] },
        { id: "havoc-ac",       name: "Havoc (Havoc autocannon)",      count: 2, loadout: ["havoc-autocannon", "close-combat-weapon"] },
        { id: "havoc-lc",       name: "Havoc (Havoc lascannon)",       count: 2, loadout: ["havoc-lascannon", "close-combat-weapon"] }
      ],
      options: [
        { id: "champ-melee", model: "havoc-champion", text: "L'Astartes chainsword du Havoc Champion peut être remplacée par 1 accursed weapon ou 1 power fist.",
          replaces: ["astartes-chainsword"], choices: [["accursed-weapon"], ["power-fist"]] },
        { id: "champ-flamer", model: "havoc-champion", text: "Le flamer du Havoc Champion peut être remplacé par 1 boltgun, 1 meltagun, 1 plasma gun, 1 plasma pistol, 1 accursed weapon ou 1 power fist.",
          replaces: ["flamer"], choices: [["boltgun"], ["meltagun"], ["plasma-gun"], ["plasma-pistol"], ["accursed-weapon"], ["power-fist"]] },
        { id: "heavy-ac", model: "havoc-ac", text: "N'importe quel nombre de Havocs peuvent remplacer leur Havoc autocannon par 1 Havoc heavy bolter, 1 Havoc lascannon, 1 Havoc missile launcher ou 1 Havoc reaper chaincannon.",
          replaces: ["havoc-autocannon"], choices: [["havoc-heavy-bolter"], ["havoc-lascannon"], ["havoc-missile-launcher"], ["havoc-reaper-chaincannon"]] },
        { id: "heavy-lc", model: "havoc-lc", text: "N'importe quel nombre de Havocs peuvent remplacer leur Havoc lascannon par 1 Havoc autocannon, 1 Havoc heavy bolter, 1 Havoc missile launcher ou 1 Havoc reaper chaincannon.",
          replaces: ["havoc-lascannon"], choices: [["havoc-autocannon"], ["havoc-heavy-bolter"], ["havoc-missile-launcher"], ["havoc-reaper-chaincannon"]] }
      ],
      abilities: [
        { name: "Stabilisation Talons",
          text: "Chaque fois qu'une figurine de cette unité attaque avec une arme de tir, vous pouvez ignorer tout ou partie des modificateurs au jet de touche et à la CT de cette arme." }
      ],
      composition: "1 Havoc Champion et 4 Havocs"
    },

    {
      id: "mutilators",
      name: "Mutilators",
      category: "infantry",
      base: "50mm",
      keywords: ["Infantry", "Chaos", "Daemon", "Mutilators"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 5, Ld: "6+", OC: 2, InSv: "5+" },
      sizes: [{ models: 3, costs: [{ from: 1, pts: 165 }, { from: 3, pts: 185 }] }],
      coreAbilities: ["deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "fleshmetal-weapons", name: "Fleshmetal weapons", type: "melee",
          profiles: [
            { name: "clawed sweeps",    range: "Mêlée", A: "6", skill: "3+", S: "6",  AP: "-2", D: "1",    abilities: [] },
            { name: "rending strikes",  range: "Mêlée", A: "4", skill: "3+", S: "9",  AP: "-3", D: "3",    abilities: [] },
            { name: "thunderous blows", range: "Mêlée", A: "2", skill: "3+", S: "12", AP: "-4", D: "D6+2", abilities: [] }
          ] }
      ],
      loadout: ["fleshmetal-weapons"],
      abilities: [
        { name: "Crushing Charge",
          text: "Vous pouvez relancer les jets de Charge de cette unité. Chaque fois qu'elle fait un mouvement de Charge, choisissez 1 unité ennemie et lancez 1D6 pour chaque figurine de cette unité à portée d'engagement de cette unité ennemie : pour chaque 4+, elle subit D3 blessures mortelles." }
      ],
      composition: "3 Mutilators"
    },

    {
      id: "nemesis-claw",
      name: "Nemesis Claw",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Psyker", "Chaos", "Grenades", "Nemesis Claw"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 105 }] },
        { models: 10, costs: [{ from: 1, pts: 190 }] }
      ],
      coreAbilities: ["stealth"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["heavy", "sustained-hits:1"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "4+", S: "4", AP: "0",  D: "1",  abilities: ["blast", "heavy"] },
            { name: "krak", range: "48\"", A: "1",  skill: "4+", S: "9", AP: "-2", D: "D6", abilities: ["heavy"] }
          ] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainsword", name: "Astartes chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "nostraman-chainblade", name: "Nostraman chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "nostraman-chainglaive", name: "Nostraman chainglaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "8", AP: "-2", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "paired-accursed-weapons", name: "Paired accursed weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "voice-eater", name: "Voice eater" }],
      models: [
        { id: "visionary", name: "Visionary", count: 1,       loadout: ["bolt-pistol", "nostraman-chainblade"] },
        { id: "legionary", name: "Legionary", count: "reste", loadout: ["bolt-pistol", "boltgun", "close-combat-weapon"] }
      ],
      options: [
        { id: "vis-pistol", model: "visionary", text: "Le bolt pistol du Visionary peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "vis-blade", model: "visionary", text: "La Nostraman chainblade du Visionary peut être remplacée par 1 accursed weapon ou 1 power fist.",
          replaces: ["nostraman-chainblade"], choices: [["accursed-weapon"], ["power-fist"]] },
        { id: "chainsword", model: "legionary", text: "N'importe quel nombre de Legionaries peuvent remplacer leur boltgun par 1 Astartes chainsword.",
          replaces: ["boltgun"], choices: [["astartes-chainsword"]] },
        { id: "heavy", model: "legionary", text: "Si l'unité compte 10 figurines, le boltgun d'1 Legionary peut être remplacé par 1 heavy bolter ou 1 missile launcher.",
          replaces: ["boltgun"], choices: [["heavy-bolter"], ["missile-launcher"]], max: { per: 10, count: 1 } },
        { id: "special", model: "legionary", text: "Le boltgun d'1 Legionary peut être remplacé par 1 flamer, 1 meltagun ou 1 plasma gun.",
          replaces: ["boltgun"], choices: [["flamer"], ["meltagun"], ["plasma-gun"]], max: { count: 1 } },
        { id: "melee", model: "legionary", text: "Jusqu'à 4 Legionaries peuvent remplacer leur boltgun par 1 accursed weapon, 1 Nostraman chainglaive, 1 paired accursed weapons, ou 1 voice eater et 1 Astartes chainsword (pas de doublon).",
          replaces: ["boltgun"], noDuplicates: true, max: { count: 4 },
          choices: [["accursed-weapon"], ["nostraman-chainglaive"], ["paired-accursed-weapons"], ["voice-eater", "astartes-chainsword"]] }
      ],
      abilities: [
        { name: "Visions of Suffering (Psychic)",
          text: "Chaque fois qu'une figurine de cette unité attaque une unité ennemie en dessous de son effectif initial, ajoutez 1 au jet de touche. Si cette unité ennemie est en dessous de la moitié de son effectif, ajoutez aussi 1 au jet de blessure." },
        { name: "Voice Eater", requiresWargear: "voice-eater",
          text: "Les unités ennemies (sauf MONSTER et VEHICLE) ne peuvent pas être ciblées par des stratagèmes tant qu'elles sont à portée d'engagement de l'unité du porteur." },
        { name: "Unité rattachée",
          text: "Si un personnage CHARACTER de votre armée avec l'aptitude Leader (sauf EPIC HERO) peut être rattaché à une unité LEGIONARIES, il peut être rattaché à cette unité à la place." }
      ],
      composition: "1 Visionary et 4 à 9 Legionaries"
    },

    {
      id: "noise-marines",
      name: "Noise Marines",
      category: "infantry",
      base: "40mm",
      requiresArmyRule: "cultes-des-dieux-sombres",
      keywords: ["Infantry", "Chaos", "Slaanesh", "Noise Marines", "Emperor's Children"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
      sizes: [{ models: 6, costs: [{ from: 1, pts: 160 }, { from: 3, pts: 175 }] }],
      coreAbilities: [],
      armyRules: [],                               // Thrill Seekers : règle de son armée d'origine, sans effet chez les Chaos Space Marines
      weapons: [
        { id: "blastmaster", name: "Blastmaster", type: "ranged",
          profiles: [
            { name: "single frequency", range: "18\"", A: "3", skill: "3+", S: "10", AP: "-2", D: "3", abilities: ["ignores-cover"] },
            { name: "varied frequency", range: "18\"", A: "6", skill: "3+", S: "6",  AP: "-2", D: "1", abilities: ["ignores-cover"] }
          ] },
        { id: "screamer-pistol", name: "Screamer pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["ignores-cover", "pistol"] }] },
        { id: "sonic-blaster", name: "Sonic blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["ignores-cover"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "disharmonist", name: "Disharmonist", count: 1, loadout: ["sonic-blaster", "close-combat-weapon"] },
        { id: "noise-marine", name: "Noise Marine", count: 5, loadout: ["sonic-blaster", "close-combat-weapon"] }
      ],
      options: [
        { id: "dish", model: "disharmonist", text: "Le sonic blaster du Disharmonist peut être remplacé par 1 screamer pistol et 1 power sword.",
          replaces: ["sonic-blaster"], choices: [["screamer-pistol", "power-sword"]] },
        { id: "blastmaster", model: "noise-marine", text: "Jusqu'à 2 Noise Marines peuvent remplacer leur sonic blaster par 1 blastmaster.",
          replaces: ["sonic-blaster"], choices: [["blastmaster"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Terrifying Crescendo",
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'au début de votre prochaine phase de Tir, chaque fois que cette unité ennemie fait un test d'Ébranlement ou de Commandement, soustrayez 1 au résultat." }
      ],
      composition: "1 Disharmonist et 5 Noise Marines"
    },

    {
      id: "obliterators",
      name: "Obliterators",
      category: "infantry",
      base: "50mm",
      keywords: ["Infantry", "Chaos", "Daemon", "Obliterators"],
      stats: { M: "4\"", T: 7, Sv: "2+", W: 5, Ld: "6+", OC: 2, InSv: "5+" },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 160 }, { from: 3, pts: 170 }] }],
      coreAbilities: ["deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "fleshmetal-guns", name: "Fleshmetal guns", type: "ranged",
          profiles: [
            { name: "focused malice", range: "18\"", A: "D3",   skill: "3+", S: "12", AP: "-3", D: "4", abilities: ["melta:2"] },
            { name: "ruinous salvo",  range: "24\"", A: "D6",   skill: "3+", S: "8",  AP: "-2", D: "2", abilities: ["blast"] },
            { name: "warp hail",      range: "24\"", A: "D6+3", skill: "3+", S: "5",  AP: "-1", D: "1", abilities: ["sustained-hits:1"] }
          ] },
        { id: "crushing-fists", name: "Crushing fists", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "9", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["fleshmetal-guns", "crushing-fists"],
      abilities: [
        { name: "Warp Rift Firepower", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, pendant la phase de Tir, cette unité peut utiliser cette aptitude. Jusqu'à la fin de la phase, les armes de tir de ses figurines ont [TIR INDIRECT]." }
      ],
      composition: "2 Obliterators"
    },

    {
      id: "possessed",
      name: "Possessed",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Daemon", "Possessed"],
      stats: { M: "9\"", T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 130 }, { from: 3, pts: 150 }] },
        { models: 10, costs: [{ from: 1, pts: 260 }, { from: 3, pts: 280 }] }
      ],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "chaos-icon", name: "Chaos icon" }],
      models: [
        { id: "possessed-champion", name: "Possessed Champion", count: 1,       loadout: ["hideous-mutations"] },
        { id: "possessed",          name: "Possessed",          count: "reste", loadout: ["hideous-mutations"] }
      ],
      options: [
        { id: "icon", text: "1 figurine peut être équipée de 1 Chaos icon.",
          choices: [["chaos-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Unholy Bloodshed", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, quand cette unité fait un Sombre Pacte, jusqu'à la fin de la phase, les armes de ses figurines ont [BLESSURES DÉVASTATRICES]." },
        { name: "Chaos Icon", requiresWargear: "chaos-icon",
          text: "Chaque fois que l'unité du porteur fait un test de Commandement pour l'aptitude Sombres Pactes, vous pouvez relancer ce test." }
      ],
      composition: "1 Possessed Champion et 4 à 9 Possessed"
    },

    {
      id: "raptors",
      name: "Raptors",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Fly", "Jump Pack", "Grenades", "Chaos", "Raptors"],
      stats: { M: "12\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 115 }, { from: 3, pts: 125 }] },
        { models: 10, costs: [{ from: 1, pts: 225 }, { from: 3, pts: 235 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainsword", name: "Astartes chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "heavy-melee-weapon", name: "Heavy melee weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] },
        { id: "mutations", name: "Mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "raptor-champion", name: "Raptor Champion", count: 1,       loadout: ["bolt-pistol", "astartes-chainsword"] },
        { id: "raptor",          name: "Raptor",          count: "reste", loadout: ["bolt-pistol", "astartes-chainsword"] }
      ],
      options: [
        { id: "champ-pistol", model: "raptor-champion", text: "Le bolt pistol du Raptor Champion peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "champ-melee", model: "raptor-champion", text: "L'Astartes chainsword du Raptor Champion peut être remplacée par 1 accursed weapon ou 1 heavy melee weapon.",
          replaces: ["astartes-chainsword"], choices: [["accursed-weapon"], ["heavy-melee-weapon"]] },
        { id: "plasma", model: "raptor", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Raptors peuvent remplacer leur bolt pistol par 1 plasma pistol (l'Astartes chainsword de ces figurines ne peut alors pas être remplacée).",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]], max: { per: 5, count: 2 } },
        { id: "heavy-melee", model: "raptor", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Raptors peuvent remplacer leur Astartes chainsword par 1 heavy melee weapon.",
          replaces: ["astartes-chainsword"], choices: [["heavy-melee-weapon"]], max: { per: 5, count: 2 } },
        { id: "mutations", model: "raptor", text: "Pour chaque tranche de 5 figurines, 1 Raptor peut remplacer son Astartes chainsword par 1 mutations.",
          replaces: ["astartes-chainsword"], choices: [["mutations"]], max: { per: 5, count: 1 } },
        { id: "special", model: "raptor", text: "Jusqu'à 2 Raptors (4 si l'unité compte 10 figurines) peuvent remplacer leur Astartes chainsword par 1 flamer et 1 close combat weapon, 1 meltagun et 1 close combat weapon, ou 1 plasma gun et 1 close combat weapon (chaque option au plus une fois par tranche de 5 figurines).",
          replaces: ["astartes-chainsword"], noDuplicates: true, max: { per: 5, count: 2 },
          choices: [["flamer", "close-combat-weapon"], ["meltagun", "close-combat-weapon"], ["plasma-gun", "close-combat-weapon"]] }
      ],
      abilities: [
        { name: "Fearsome (Aura)",
          text: "Tant qu'une unité ennemie est à 6\" ou moins de cette unité, chaque fois qu'elle fait un test d'Ébranlement ou de Commandement, soustrayez 1 au résultat." },
        { name: "Terrifying Assault",
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement d'une ou plusieurs unités ayant cette aptitude doit faire un test d'Ébranlement." }
      ],
      composition: "1 Raptor Champion et 4 à 9 Raptors"
    },

    {
      id: "red-corsairs-raiders",
      name: "Red Corsairs Raiders",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Red Corsairs Raiders"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 120 }, { from: 3, pts: 130 }] },
        { models: 10, costs: [{ from: 1, pts: 220 }, { from: 3, pts: 230 }] }
      ],
      coreAbilities: ["infiltrators"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "hand-flamer", name: "Hand flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "3", AP: "0", D: "1", abilities: ["ignores-cover", "pistol", "torrent"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] },
        { id: "reavers-blade", name: "Reaver's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "raider-champion", name: "Red Corsairs Raider Champion", count: 1,       loadout: ["boltgun", "bolt-pistol", "reavers-blade"] },
        { id: "raider",          name: "Red Corsairs Raider",          count: "reste", loadout: ["boltgun", "bolt-pistol", "reavers-blade"] }
      ],
      options: [
        { id: "champ-flamer", model: "raider-champion", text: "Le bolt pistol du Red Corsairs Raider Champion peut être remplacé par 1 hand flamer.",
          replaces: ["bolt-pistol"], choices: [["hand-flamer"]] },
        { id: "melta", model: "raider", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Red Corsairs Raider peut être remplacé par 1 meltagun.",
          replaces: ["boltgun"], choices: [["meltagun"]], max: { per: 5, count: 1 } },
        { id: "fist", model: "raider", text: "Pour chaque tranche de 5 figurines, le reaver's blade d'1 Red Corsairs Raider peut être remplacé par 1 power fist.",
          replaces: ["reavers-blade"], choices: [["power-fist"]], max: { per: 5, count: 1 } }
      ],
      abilities: [
        { name: "Trophy Takers",
          text: "La première fois que cette unité détruit une unité ennemie, jusqu'à la fin de la bataille, tant qu'elle n'est pas Ébranlée, ajoutez 1 à la CO de ses figurines." },
        { name: "Unité rattachée",
          text: "Si un personnage CHARACTER de votre armée avec l'aptitude Leader peut être rattaché à une unité LEGIONARIES, il peut être rattaché à cette unité à la place." }
      ],
      composition: "1 Red Corsairs Raider Champion et 4 à 9 Red Corsairs Raiders"
    },

    {
      id: "traitor-guardsmen-squad",
      name: "Traitor Guardsmen Squad",
      category: "infantry",
      base: "25mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Damned", "Traitor Guardsmen Squad"],
      stats: { M: "6\"", T: 3, Sv: "5+", W: 1, Ld: "7+", OC: 2 },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 65 }] }],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["rapid-fire:1"] }] },
        { id: "corrupted-pistol", name: "Corrupted pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "4", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "cultist-grenade-launcher", name: "Cultist grenade launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "24\"", A: "D3", skill: "4+", S: "4", AP: "0",  D: "1",  abilities: ["blast"] },
            { name: "krak", range: "24\"", A: "1",  skill: "4+", S: "9", AP: "-2", D: "D3", abilities: [] }
          ] },
        { id: "cultist-sniper-rifle", name: "Cultist sniper rifle", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "4+", S: "4", AP: "-2", D: "2", abilities: ["heavy", "precision"] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "lasgun", name: "Lasgun", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["rapid-fire:1"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "4+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "4+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "chainsword", name: "Chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "power-weapon", name: "Power weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "-2", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "traitor-sergeant",  name: "Traitor Sergeant",  count: 1,       loadout: ["corrupted-pistol", "close-combat-weapon"] },
        { id: "traitor-guardsman", name: "Traitor Guardsman", count: "reste", loadout: ["lasgun", "close-combat-weapon"] }
      ],
      options: [
        { id: "special", model: "traitor-guardsman", text: "Jusqu'à 3 Traitor Guardsmen peuvent remplacer leur lasgun par 1 Cultist grenade launcher, 1 flamer, 1 meltagun, 1 plasma gun ou 1 Cultist sniper rifle (pas de doublon).",
          replaces: ["lasgun"], noDuplicates: true, max: { count: 3 },
          choices: [["cultist-grenade-launcher"], ["flamer"], ["meltagun"], ["plasma-gun"], ["cultist-sniper-rifle"]] },
        { id: "sgt-melee", model: "traitor-sergeant", text: "La close combat weapon du Traitor Sergeant peut être remplacée par 1 chainsword ou 1 power weapon.",
          replaces: ["close-combat-weapon"], choices: [["chainsword"], ["power-weapon"]] },
        { id: "sgt-pistol", model: "traitor-sergeant", text: "Le corrupted pistol du Traitor Sergeant peut être remplacé par 1 boltgun.",
          replaces: ["corrupted-pistol"], choices: [["boltgun"]] }
      ],
      abilities: [
        { name: "Twisted Defence Force",
          text: "Tant que cette unité est à portée d'un pion objectif, elle a +1 à sa Sauvegarde contre les attaques de tir." }
      ],
      composition: "1 Traitor Sergeant et 9 Traitor Guardsmen"
    },

    {
      id: "warp-talons",
      name: "Warp Talons",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Fly", "Jump Pack", "Grenades", "Chaos", "Daemon", "Warp Talons"],
      stats: { M: "12\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 130 }, { from: 3, pts: 140 }] },
        { models: 10, costs: [{ from: 1, pts: 290 }, { from: 3, pts: 300 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "warp-claws", name: "Warp claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] }
      ],
      models: [
        { id: "warp-talon-champion", name: "Warp Talon Champion", count: 1,       loadout: ["warp-claws"] },
        { id: "warp-talon",          name: "Warp Talon",          count: "reste", loadout: ["warp-claws"] }
      ],
      abilities: [
        { name: "Warp Strike",
          text: "À la fin de la phase de Combat, si cette unité a détruit une ou plusieurs unités ennemies à cette phase et n'est à portée d'engagement d'aucune unité ennemie, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques." }
      ],
      composition: "1 Warp Talon Champion et 4 à 9 Warp Talons"
    },

    /* ---------- Montés ---------- */
    {
      id: "chaos-bikers",
      name: "Chaos Bikers",
      category: "mounted",
      base: "75 x 42mm",
      keywords: ["Mounted", "Grenades", "Chaos", "Chaos Bikers"],
      stats: { M: "12\"", T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 2 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 80 }] },
        { models: 6, costs: [{ from: 1, pts: 150 }] }
      ],
      coreAbilities: [],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "astartes-chainsword", name: "Astartes chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "chaos-icon", name: "Chaos icon" }],
      models: [
        { id: "biker-champion", name: "Biker Champion", count: 1,       loadout: ["bolt-pistol", "combi-bolter", "close-combat-weapon"] },
        { id: "chaos-biker",    name: "Chaos Biker",    count: "reste", loadout: ["bolt-pistol", "combi-bolter", "close-combat-weapon"] }
      ],
      options: [
        { id: "champ-pistol", model: "biker-champion", text: "Le bolt pistol du Biker Champion peut être remplacé par 1 plasma pistol, 1 accursed weapon, 1 Astartes chainsword ou 1 power fist.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"], ["accursed-weapon"], ["astartes-chainsword"], ["power-fist"]] },
        { id: "chainsword", model: "chaos-biker", text: "N'importe quel nombre de Chaos Bikers peuvent remplacer leur bolt pistol par 1 Astartes chainsword.",
          replaces: ["bolt-pistol"], choices: [["astartes-chainsword"]] },
        { id: "combi", model: "chaos-biker", sharedMax: "speciales", text: "Jusqu'à 2 Chaos Bikers (au total avec l'option suivante) peuvent remplacer leur combi-bolter par 1 combi-weapon…",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]], max: { count: 2 } },
        { id: "special", model: "chaos-biker", sharedMax: "speciales", text: "…ou être équipés en plus de 1 flamer, 1 meltagun ou 1 plasma gun.",
          choices: [["flamer"], ["meltagun"], ["plasma-gun"]], max: { count: 2 } },
        { id: "icon", text: "1 figurine peut être équipée de 1 Chaos icon.",
          choices: [["chaos-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Outmanoeuvre",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée, si cette unité a fait un mouvement de Charge à ce tour, améliorez de 1 la Force de l'attaque." },
        { name: "Chaos Icon", requiresWargear: "chaos-icon",
          text: "Chaque fois que l'unité du porteur fait un test de Commandement pour l'aptitude Sombres Pactes, vous pouvez relancer ce test." }
      ],
      composition: "1 Biker Champion et 2 à 5 Chaos Bikers"
    },

    /* ---------- Transports ---------- */
    {
      id: "chaos-land-raider",
      name: "Chaos Land Raider",
      category: "transport",
      base: null,
      keywords: ["Vehicle", "Transport", "Frame", "Smoke", "Chaos", "Land Raider"],
      stats: { M: "10\"", T: 12, Sv: "2+", W: 16, Ld: "6+", OC: 5 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 220 }, { from: 3, pts: 240 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "soulshatter-lascannon", name: "Soulshatter lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1", "twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "4+", S: "8", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["soulshatter-lascannon", "soulshatter-lascannon", "twin-heavy-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]] },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]] }
      ],
      transport: {
        capacity: 12,
        allowed: [["Heretic Astartes", "Infantry"]],
        excluded: ["Obliterators", "Jump Pack"],
        double: ["Possessed", "Mutilators", "Terminator"],    // comptent pour 2 places
        text: "Capacité de transport de 12 figurines HERETIC ASTARTES INFANTRY (sauf OBLITERATORS et JUMP PACK). Chaque figurine POSSESSED, MUTILATORS ou TERMINATOR compte pour 2 places."
      },
      abilities: [
        { name: "Assault Ramp",
          text: "Chaque fois qu'une unité débarque de ce véhicule après qu'il a fait un Mouvement Normal, elle fait un mouvement de débarquement d'assaut (Règles de Base, 18.06) pour ce débarquement." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Land Raider"
    },

    /* ---------- Marcheurs ----------
       cost sur une arme = surcoût en points par exemplaire pris
       maxPerModel = nombre max d'exemplaires d'une arme
       requiresWeapon (option) : nombre max égal au nombre de cette arme portée */
    {
      id: "defiler",
      name: "Defiler",
      category: "walkers",
      base: "160mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Daemon", "Defiler"],
      stats: { M: "12\"", T: 11, Sv: "3+", W: 18, Ld: "6+", OC: 5, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 300 }, { from: 2, pts: 350 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "hades-battle-cannon", name: "Hades battle cannon", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+3", skill: "3+", S: "10", AP: "-1", D: "3", abilities: ["blast"] }] },
        { id: "ectoplasma-destructor", name: "Ectoplasma destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "D6", skill: "3+", S: "12", AP: "-3", D: "3", abilities: ["blast"] }] },
        { id: "excruciator-cannon", name: "Excruciator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "6", AP: "-1", D: "2", abilities: [] }] },
        { id: "magma-cutters", name: "Magma cutters", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "heavy-baleflamer", name: "Heavy baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "7", AP: "-2", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "hades-lascannon", name: "Hades lascannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "heavy-reaper-autocannon", name: "Heavy reaper autocannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "4", skill: "3+", S: "9", AP: "-1", D: "3", abilities: ["devastating-wounds", "sustained-hits:1"] }] },
        { id: "heavy-missile-launcher", name: "Heavy missile launcher", type: "ranged",
          profiles: [
            { name: "krak", range: "48\"", A: "2",   skill: "3+", S: "10", AP: "-2", D: "D6+1", abilities: [] },
            { name: "frag", range: "48\"", A: "2D6", skill: "3+", S: "5",  AP: "-1", D: "1",    abilities: ["blast"] }
          ] },
        { id: "shearing-claws", name: "Shearing claws", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "3+", S: "16", AP: "-3", D: "D6+1", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "10", skill: "3+", S: "6",  AP: "-2", D: "1",    abilities: [] }
          ] },
        { id: "electroscourge", name: "Electroscourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "12", AP: "-2", D: "2", abilities: ["extra-attacks", "sustained-hits:2"] }] }
      ],
      loadout: ["hades-battle-cannon", "excruciator-cannon", "excruciator-cannon", "heavy-missile-launcher", "heavy-baleflamer", "shearing-claws"],
      maxPerModel: { "electroscourge": 1 },
      options: [
        { id: "ecto", text: "Le Hades battle cannon peut être remplacé par 1 ectoplasma destructor.",
          replaces: ["hades-battle-cannon"], choices: [["ectoplasma-destructor"]] },
        { id: "magma", text: "Les excruciator cannons peuvent être remplacés par 2 magma cutters.",
          replaces: ["excruciator-cannon", "excruciator-cannon"], choices: [["magma-cutters", "magma-cutters"]] },
        { id: "baleflamer", text: "Le heavy baleflamer peut être remplacé par 1 Hades lascannon (+15 pts), 1 heavy reaper autocannon (+15 pts) ou 1 electroscourge (1 seul electroscourge par figurine).",
          replaces: ["heavy-baleflamer"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] },
        { id: "missile", text: "Le heavy missile launcher peut être remplacé par 1 Hades lascannon (+15 pts), 1 heavy reaper autocannon (+15 pts) ou 1 electroscourge (1 seul electroscourge par figurine).",
          replaces: ["heavy-missile-launcher"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] }
      ],
      abilities: [
        { name: "Scuttling Walker",
          text: "Chaque fois que cette unité fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines (sauf TITANIC) et les éléments de terrain. Elle peut alors passer à portée d'engagement de figurines ennemies, mais ne peut pas y finir son mouvement, et ses tests de Fuite Désespérée sont automatiquement réussis." },
        { name: "Daemonforge",
          text: "Chaque fois que cette unité fait un Sombre Pacte, jusqu'à la fin de la phase, chaque fois que cette figurine attaque, relancez un jet de blessure de 1." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Defiler"
    },

    {
      id: "forgefiend",
      name: "Forgefiend",
      category: "walkers",
      base: "120 x 92mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Daemon", "Forgefiend"],
      stats: { M: "8\"", T: 10, Sv: "3+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 155 }, { from: 3, pts: 165 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "ectoplasma-cannon", name: "Ectoplasma cannon", type: "ranged", cost: 5,
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "10", AP: "-3", D: "3", abilities: ["blast"] }] },
        { id: "hades-autocannon", name: "Hades autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "8", AP: "-1", D: "2", abilities: [] }] },
        { id: "armoured-limbs", name: "Armoured limbs", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "6", AP: "0", D: "2", abilities: [] }] },
        { id: "forgefiend-jaws", name: "Forgefiend jaws", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "7", AP: "0", D: "2", abilities: [] }] }
      ],
      loadout: ["hades-autocannon", "hades-autocannon", "forgefiend-jaws"],
      options: [
        { id: "ecto", text: "Les 2 Hades autocannons peuvent être remplacés par 2 ectoplasma cannons (+5 pts chacun).",
          replaces: ["hades-autocannon", "hades-autocannon"], choices: [["ectoplasma-cannon", "ectoplasma-cannon"]] },
        { id: "jaws", text: "Les Forgefiend jaws peuvent être remplacées par 1 ectoplasma cannon (+5 pts) et 1 armoured limbs.",
          replaces: ["forgefiend-jaws"], choices: [["ectoplasma-cannon", "armoured-limbs"]] }
      ],
      abilities: [
        { name: "Daemonic Ordnance",
          text: "Chaque fois que cette figurine est choisie pour tirer, elle peut utiliser cette aptitude. Dans ce cas, jusqu'à la fin de la phase, ses armes de tir ont [BLESSURES DÉVASTATRICES] et [À RISQUE]." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Forgefiend"
    },

    {
      id: "helbrute",
      name: "Helbrute",
      category: "walkers",
      base: "60mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Helbrute"],
      stats: { M: "6\"", T: 9, Sv: "2+", W: 8, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "heavy-flamer", name: "Heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "helbrute-plasma-cannon", name: "Helbrute plasma cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "8", AP: "-3", D: "3", abilities: ["blast", "hazardous"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "3+", S: "4", AP: "0",  D: "1",  abilities: ["blast"] },
            { name: "krak", range: "48\"", A: "1",  skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }
          ] },
        { id: "multi-melta", name: "Multi-melta", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "twin-autocannon", name: "Twin autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "9", AP: "-1", D: "3", abilities: ["twin-linked"] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1", "twin-linked"] }] },
        { id: "twin-lascannon", name: "Twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: ["twin-linked"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] },
        { id: "helbrute-fist", name: "Helbrute fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "12", AP: "-2", D: "3", abilities: [] }] },
        { id: "helbrute-hammer", name: "Helbrute hammer", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "4+", S: "14", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "power-scourge", name: "Power scourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "3+", S: "7", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["missile-launcher", "multi-melta", "close-combat-weapon"],
      options: [
        { id: "remplace-melta", text: "Le multi-melta peut être remplacé par 1 Helbrute plasma cannon, 1 twin autocannon, 1 twin heavy bolter, 1 twin lascannon ou 1 Helbrute fist.",
          replaces: ["multi-melta"], choices: [["helbrute-plasma-cannon"], ["twin-autocannon"], ["twin-heavy-bolter"], ["twin-lascannon"], ["helbrute-fist"]] },
        { id: "remplace-missile", text: "Le missile launcher peut être remplacé par 1 Helbrute fist, 1 Helbrute hammer ou 1 power scourge.",
          replaces: ["missile-launcher"], choices: [["helbrute-fist"], ["helbrute-hammer"], ["power-scourge"]] },
        { id: "fist-gun", requiresWeapon: "helbrute-fist", text: "Pour chaque Helbrute fist, cette figurine peut être équipée de 1 combi-bolter ou de 1 heavy flamer.",
          choices: [["combi-bolter"], ["heavy-flamer"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Dark Ascension (Aura)",
          text: "Tant qu'une unité HERETIC ASTARTES amie est à 6\" ou moins de cette figurine, chaque fois que cette unité fait un Sombre Pacte, jusqu'à la fin de la phase, les armes de ses figurines gagnent les deux aptitudes conférées par ce pacte (au lieu d'une seule)." },
        { name: "Devoted to Destruction",
          text: "Si cette figurine est équipée de deux armes de mêlée en plus de sa close combat weapon, ajoutez 2 aux Attaques de ces deux armes." }
      ],
      composition: "1 Helbrute"
    },

    {
      id: "maulerfiend",
      name: "Maulerfiend",
      category: "walkers",
      base: "120 x 92mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Daemon", "Maulerfiend"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "magma-cutters", name: "Magma cutters", type: "ranged",
          profiles: [{ range: "6\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "lasher-tendrils", name: "Lasher tendrils", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "7", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "maulerfiend-fists", name: "Maulerfiend fists", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "14", AP: "-2", D: "D6+1", abilities: [] }] }
      ],
      loadout: ["lasher-tendrils", "maulerfiend-fists"],
      options: [
        { id: "magma", text: "Les lasher tendrils peuvent être remplacés par 2 magma cutters.",
          replaces: ["lasher-tendrils"], choices: [["magma-cutters", "magma-cutters"]] }
      ],
      abilities: [
        { name: "Siege Crawler",
          text: "Vous pouvez ignorer tout ou partie des modificateurs à la caractéristique de Mouvement de cette figurine, ainsi qu'à ses jets d'Avance et de Charge." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Maulerfiend"
    },

    {
      id: "venomcrawler",
      name: "Venomcrawler",
      category: "walkers",
      base: "100mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Daemon", "Venomcrawler"],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 9, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 120 }, { from: 3, pts: 130 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "excruciator-cannon", name: "Excruciator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "6", AP: "-1", D: "2", abilities: [] }] },
        { id: "soulflayer-tendrils-and-claws", name: "Soulflayer tendrils and claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["excruciator-cannon", "excruciator-cannon", "soulflayer-tendrils-and-claws"],
      abilities: [
        { name: "Soul Eater",
          text: "À la fin de la phase de Combat, si une ou plusieurs attaques de cette figurine ont détruit une ou plusieurs unités ennemies à cette phase, ajoutez 1 aux Attaques de ses armes jusqu'à la fin de la bataille." }
      ],
      composition: "1 Venomcrawler"
    },

    /* ---------- Véhicules ---------- */
    {
      id: "heldrake",
      name: "Heldrake",
      category: "vehicles",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Chaos", "Daemon", "Heldrake"],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 12, Ld: "6+", OC: 0, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 175 }] }],
      coreAbilities: ["deadly-demise:D3", "hover"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "baleflamer", name: "Baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-1", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "hades-autocannon", name: "Hades autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "8", AP: "-1", D: "2", abilities: [] }] },
        { id: "heldrake-claws", name: "Heldrake claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "7", AP: "-1", D: "2", abilities: ["anti:Vol 2+", "devastating-wounds"] }] }
      ],
      loadout: ["hades-autocannon", "heldrake-claws"],
      options: [
        { id: "baleflamer", text: "Le Hades autocannon peut être remplacé par 1 baleflamer.",
          replaces: ["hades-autocannon"], choices: [["baleflamer"]] }
      ],
      abilities: [
        { name: "Airborne Predator",
          text: "Chaque fois que cette figurine attaque une unité qui peut VOLER, ajoutez 1 au jet de touche." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Heldrake"
    },

    {
      id: "chaos-predator-annihilator",
      name: "Chaos Predator Annihilator",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Predator Annihilator"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 140 }, { from: 3, pts: 150 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-twin-lascannon", name: "Predator twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "14", AP: "-3", D: "D6+1", abilities: ["twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-twin-lascannon", "armoured-tracks"],
      options: [
        { id: "flancs", text: "Peut être équipé de 2 heavy bolters ou de 2 lascannons.",
          choices: [["heavy-bolter", "heavy-bolter"], ["lascannon", "lascannon"]] },
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]] },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]] }
      ],
      abilities: [
        { name: "Annihilator",
          text: "Chaque fois qu'une attaque de tir de cette figurine est allouée à une figurine MONSTRE ou VÉHICULE, vous pouvez relancer le jet de dégâts." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Annihilator"
    },

    {
      id: "chaos-predator-destructor",
      name: "Chaos Predator Destructor",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Predator Destructor"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 145 }, { from: 3, pts: 155 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["sustained-hits:1"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-autocannon", name: "Predator autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "4", skill: "3+", S: "9", AP: "-1", D: "3", abilities: ["rapid-fire:2"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-autocannon", "armoured-tracks"],
      options: [
        { id: "flancs", text: "Peut être équipé de 2 heavy bolters ou de 2 lascannons.",
          choices: [["heavy-bolter", "heavy-bolter"], ["lascannon", "lascannon"]] },
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]] },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]] }
      ],
      abilities: [
        { name: "Destructor",
          text: "Chaque fois qu'une attaque de tir de cette figurine cible une unité d'INFANTERIE ennemie, améliorez de 1 la Pénétration d'armure de cette attaque." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Destructor"
    },

    {
      id: "chaos-vindicator",
      name: "Chaos Vindicator",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Vindicator"],
      stats: { M: "9\"", T: 11, Sv: "2+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 180 }, { from: 3, pts: 190 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["sombres-pactes"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "demolisher-cannon", name: "Demolisher cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "D6+3", skill: "3+", S: "14", AP: "-3", D: "D6", abilities: ["blast"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["demolisher-cannon", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]] },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]] }
      ],
      abilities: [
        { name: "Siege Shield",
          text: "Quand elle fait des attaques de tir avec son demolisher cannon, cette figurine peut cibler des unités ennemies à sa portée d'engagement (si aucune autre unité amie n'est à portée d'engagement de cette unité ennemie). De plus, quand elle fait des attaques de tir, cette figurine ne subit pas le malus aux jets de touche dû au fait d'être à portée d'engagement d'unités ennemies." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Vindicator"
    }

  ]
});

})();
