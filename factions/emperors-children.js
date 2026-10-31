/* =========================================================
   EMPEROR'S CHILDREN — Données de faction
   Noms en anglais, textes en français.
   ========================================================= */

Factions.register({
  id: "emperors-children",
  name: "Emperor's Children",
  keyword: "Emperor's Children",   // mot-clé requis par défaut pour toute unité

  // Règles d'armée, référencées par leur id dans les fiches d'unités
  armyRules: [
    {
      id: "thrill-seekers",
      name: "Ivresse des Sens",
      nameEn: "Thrill Seekers",
      text: [
        "Si la Faction d'Armée de votre armée est EMPEROR'S CHILDREN, cette unité est éligible pour tirer et pour déclarer une charge à un tour où elle a Avancé ou Battu en Retraite. Dans ce cas :",
        "• elle ne peut pas cibler une unité dont elle était à portée d'engagement au début du tour ;",
        "• elle ne peut pas cibler une unité qui a déjà été la cible d'une charge ou d'attaques d'une autre unité à cette phase."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       CARNIVAL OF EXCESS
       ------------------------------------------------------- */
    {
      id: "carnival-of-excess",
      name: "Carnival of Excess",
      cost: 3,                                   // points de détachement
      dispositions: ["disruption", "priority-assets"],

      // Débloque les démons de Slaanesh (fichier chargé à la demande)
      unlocks: ["Legions of Excess"],
      extraFiles: ["legions-of-excess"],

      // Restrictions vérifiées par le moteur
      constraints: [
        { type: "maxPointsPercent", keyword: "Legions of Excess", percent: 50 },
        { type: "noWarlord",        keyword: "Legions of Excess" }
      ],

      rule: {
        name: null,   // nom de la règle à compléter si besoin
        text: [
          "Tant qu'une unité EMPEROR'S CHILDREN et une unité LEGIONS OF EXCESS de votre armée sont à 6\" ou moins l'une de l'autre, les armes des figurines de ces deux unités ont [TOUCHES SOUTENUES 1]. Si une arme a déjà cette aptitude, elle inflige à la place des Touches Critiques sur un jet de touche non modifié de 5+.",
          "Vous pouvez inclure des unités LEGIONS OF EXCESS jusqu'à 50 % des points de votre armée. Aucune d'elles ne peut être votre Seigneur de Guerre."
        ]
      },

      /* requires : liste d'alternatives, chacune = mots-clés tous requis */
      enhancements: [
        {
          id: "dark-blessings",
          name: "Dark Blessings",
          cost: 10,
          kind: "optimisation",
          requires: [["Infantry", "Emperor's Children"]],
          usage: "une-fois-par-bataille",
          text: "Une fois par bataille, juste après qu'une unité ennemie a choisi ses cibles, le porteur a une sauvegarde invulnérable de 3+ jusqu'à la fin de la phase."
        },
        {
          id: "empyric-suffusion",
          name: "Empyric Suffusion",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Chaque fois que vous ciblez l'unité du porteur avec le stratagème Intervention Héroïque, il coûte 1 PC de moins."
        },
        {
          id: "possessed-blade",
          name: "Possessed Blade",
          cost: 35,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          gameChoice: "Au début de la bataille, choisir 1 arme de mêlée du porteur.",
          text: "Au début de la bataille, choisissez 1 arme de mêlée du porteur : elle gagne +1 Attaque. Chaque fois qu'elle attaque, vous pouvez lui donner +1 Dégâts ainsi que [BLESSURES DÉVASTATRICES] et [À RISQUE] pour cette attaque."
        },
        {
          id: "warp-walker",
          name: "Warp Walker",
          cost: 35,
          kind: "optimisation",
          requires: [["Emperor's Children"], ["Keeper of Secrets"]],
          text: "L'unité du porteur avance automatiquement de 6\" au lieu de D6\". Quand elle fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines ennemies comme si elles n'étaient pas là, et ses tests de Fuite Désespérée sont automatiquement réussis."
        }
      ],

      /* moments : liste de { tour, phase }
         tour  : "vous" | "adversaire" | "les-deux"
         phase : "commandement" | "mouvement" | "tir" | "charge" | "combat" | "toutes"
         type  : optionnel */
      stratagems: [
        {
          id: "desir-obsequieux",
          name: "Désir Obséquieux",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité LEGIONS OF EXCESS de votre armée.",
          effet: "Elle peut déclarer une charge même si elle a Avancé ou Battu en Retraite ce tour, à condition qu'au moins une des cibles de la charge soit engagée avec une unité EMPEROR'S CHILDREN."
        },
        {
          id: "massacre-extatique",
          name: "Massacre Extatique",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité LEGIONS OF EXCESS de votre armée a détruit une unité ennemie.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée, non engagée et à 6\" ou moins de cette unité.",
          effet: "Elle peut déclarer une charge. Si elle a déjà combattu à cette phase, elle ne peut pas combattre de nouveau."
        },
        {
          id: "reactions-surnaturelles",
          name: "Réactions Surnaturelles",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité SLAANESH de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, soustrayez 1 au jet de touche."
        },
        {
          id: "sombres-apparitions",
          name: "Sombres Apparitions",
          cp: 2,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité de DAEMONETTES de votre armée non engagée.",
          effet: "Placez-la en Réserves Stratégiques. Si elle arrive en Frappe en Profondeur lors de l'étape de Renforts de votre prochaine phase de Mouvement, elle peut être placée à plus de 6\" horizontalement de toute unité ennemie, à condition d'être entièrement à 9\" ou moins d'une unité EMPEROR'S CHILDREN de votre armée."
        },
        {
          id: "soutenu-par-la-tourmente",
          name: "Soutenu par la Tourmente",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "Juste après qu'une unité EMPEROR'S CHILDREN de votre armée a détruit une unité ennemie.",
          cible: "1 unité LEGIONS OF EXCESS de votre armée à 6\" ou moins d'elle.",
          effet: "Elle récupère jusqu'à 3 PV perdus. S'il s'agit d'une unité de DAEMONETTES, ramenez à la place jusqu'à D3+3 figurines détruites."
        },
        {
          id: "violent-crescendo",
          name: "Violent Crescendo",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité SLAANESH MOUNTED, BEAST ou INFANTRY de votre armée qui n'a pas encore été choisie pour combattre.",
          effet: "Jusqu'à la fin de la phase, ses mouvements d'engagement et de consolidation sont de 6\" au lieu de 3\", et elle n'est pas obligée de se rapprocher de la figurine ennemie la plus proche, du moment qu'elle se rapproche de l'unité ennemie la plus proche."
        }
      ]
    },

    /* -------------------------------------------------------
       COTERIE OF THE CONCEITED
       ------------------------------------------------------- */
    {
      id: "coterie-of-the-conceited",
      name: "Coterie of the Conceited",
      cost: 3,
      dispositions: ["priority-assets", "purge-the-foe"],

      rule: {
        name: null,
        text: [
          "Au début de chaque round, si votre Seigneur de Guerre est sur le champ de bataille, vous devez annoncer un gage (un nombre). À la fin du round, si le nombre d'unités ennemies détruites pendant ce round est supérieur ou égal à votre gage, vous gagnez un nombre de points de pacte égal à ce gage (ils se cumulent d'un round à l'autre). Sinon, votre Seigneur de Guerre subit D3 blessures mortelles.",
          "Les unités EMPEROR'S CHILDREN de votre armée bénéficient de bonus selon le total de points de pacte gagnés (voir paliers)."
        ]
      },

      // Compteur suivi par le compagnon de jeu
      tracker: {
        id: "points-de-pacte",
        label: "Points de pacte",
        debutRound: "Si votre Seigneur de Guerre est sur le champ de bataille : annoncez votre gage.",
        finRound: "Unités ennemies détruites ce round ≥ gage : gagnez des points de pacte égaux au gage. Sinon : votre Seigneur de Guerre subit D3 blessures mortelles.",
        paliers: [
          { min: 1, short: "Relance touches de 1", text: "Relance des jets de touche de 1." },
          { min: 3, short: "Relance blessures de 1", combined: "Relance touches et blessures de 1", replaces: 1, text: "Relance des jets de blessure de 1." },
          { min: 5, short: "Mêlée : [TOUCHES FATALES] et [TOUCHES SOUTENUES 1]", text: "Les armes de mêlée ont [TOUCHES FATALES] et [TOUCHES SOUTENUES 1]." },
          { min: 7, short: "Touches critiques sur 5+", text: "Touches Critiques sur un jet de touche non modifié de 5+." }
        ]
      },

      enhancements: [
        {
          id: "pledge-of-dark-glory",
          name: "Pledge of Dark Glory",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Tant que le porteur mène une unité, celle-ci a +1 en CO et +1 en Commandement."
        },
        {
          id: "pledge-of-eternal-servitude",
          name: "Pledge of Eternal Servitude",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-bataille",
          text: "La première fois que le porteur est détruit, faites-lui passer un test de Commandement à la fin de la phase. S'il est réussi, replacez-le aussi près que possible de l'endroit où il a été détruit et hors de portée d'engagement de toute unité ennemie, avec D6 PV restants (sans dépasser sa caractéristique de PV)."
        },
        {
          id: "pledge-of-mortal-pain",
          name: "Pledge of Mortal Pain",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Au début de votre phase de Tir, choisissez 1 unité ennemie visible à 12\" ou moins du porteur : elle fait un test de Commandement (à -2 si elle est Ébranlée) et subit 3 blessures mortelles si elle le rate."
        },
        {
          id: "pledge-of-unholy-fortune",
          name: "Pledge of Unholy Fortune",
          cost: 30,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, si le porteur n'est pas Ébranlé, vous pouvez remplacer l'un de ses jets de touche, de blessure ou de sauvegarde par un 6 non modifié."
        }
      ],

      stratagems: [
        {
          id: "adversaires-inebranlables",
          name: "Adversaires Inébranlables",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "commandement" }],
          quand: "Phase de Commandement.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée.",
          effet: "Jusqu'à la fin du tour, elle peut ignorer tout ou partie des modificateurs à ses jets de touche et de blessure, ainsi qu'à sa CC et sa CT."
        },
        {
          id: "armure-de-l-execration",
          name: "Armure de l'Exécration",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin des attaques de l'unité attaquante, réduisez de 1 la PA des attaques qui lui sont allouées."
        },
        {
          id: "arrogance-sans-bornes",
          name: "Arrogance sans Bornes",
          cp: 1,
          type: null,
          limite: "une-fois-par-round",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, juste après qu'une unité EMPEROR'S CHILDREN de votre armée a détruit une unité ennemie.",
          cible: "Cette unité.",
          effet: "Pour la règle des points de pacte, ce round compte comme si une unité ennemie supplémentaire avait été détruite. Une seule fois par round.",
          tracker: { id: "points-de-pacte", action: "unite-detruite-bonus", valeur: 1 }
        },
        {
          id: "embrasser-la-douleur",
          name: "Embrasser la Douleur",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Début de la phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN INFANTRY de votre armée.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine ennemie à portée d'engagement de cette unité choisit ses cibles, elle doit choisir cette unité."
        },
        {
          id: "perfection-martiale",
          name: "Perfection Martiale",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui n'a pas encore été choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle peut relancer ses jets de touche."
        },
        {
          id: "protection-du-prince-noir",
          name: "Protection du Prince Noir",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une attaque ou une blessure mortelle a été allouée à une figurine EMPEROR'S CHILDREN de votre armée.",
          cible: "L'unité de cette figurine.",
          effet: "Jusqu'à la fin de la phase, elle a Insensible à la Douleur 6+ (4+ contre les blessures mortelles)."
        }
      ]
    },

    /* -------------------------------------------------------
       COURT OF THE PHOENICIAN
       ------------------------------------------------------- */
    {
      id: "court-of-the-phoenician",
      name: "Court of the Phoenician",
      cost: 2,
      dispositions: ["purge-the-foe"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une unité EMPEROR'S CHILDREN de votre armée est choisie pour combattre, si elle a fait un mouvement de Charge ce tour, elle peut utiliser cette aptitude. Dans ce cas, jusqu'à la fin de la phase, améliorez de 1 la Force et la Pénétration d'Armure de ses armes de mêlée, mais :",
          "• elle ne peut pas cibler une unité dont elle était à portée d'engagement au début du tour ;",
          "• elle ne peut pas cibler une unité qui a déjà été la cible des attaques d'une autre unité à cette phase.",
          "Une fois par round de bataille, quand vous ciblez FULGRIM avec le stratagème Brèche Sinueuse ou Supériorité Vaniteuse, ce stratagème coûte 1 PC de moins."
        ]
      },

      // Réductions de coût exploitées par le compagnon
      costModifiers: [
        {
          unit: "Fulgrim",
          stratagems: ["breche-sinueuse", "superiorite-vaniteuse"],
          reduction: 1,
          limite: "une-fois-par-round"
        }
      ],

      enhancements: [
        {
          id: "exalted-patron",
          name: "Exalted Patron",
          cost: 15,
          kind: "optimisation",
          requires: [["Lord Exultant"]],
          grantsLeaderOf: ["Flawless Blades"],       // le porteur peut mener des Flawless Blades
          requiresAttachedTo: ["Flawless Blades"],   // condition vérifiée en avertissement
          text: "Le porteur peut rejoindre et mener une unité de FLAWLESS BLADES. Ajoutez 1\" à sa caractéristique de Mouvement."
        },
        {
          id: "soulstain-made-manifest",
          name: "Soulstain Made Manifest",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Au début de la phase de Combat, vous pouvez choisir 1 unité ennemie à portée d'engagement du porteur : elle fait un test d'Ébranlement en soustrayant 1 au résultat."
        },
        {
          id: "spiritsliver",
          name: "Spiritsliver",
          cost: 20,
          kind: "optimisation",
          requires: [["Daemon Prince", "Emperor's Children"]],
          text: "Ajoutez 1 à la Force et aux Attaques des armes de mêlée du porteur."
        },
        {
          id: "tears-of-the-phoenix",
          name: "Tears of the Phoenix",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Chaque fois qu'une figurine de l'unité du porteur fait une attaque de mêlée, vous pouvez ignorer tout ou partie des modificateurs à sa CC, à son jet de touche et à son jet de blessure."
        }
      ],

      stratagems: [
        {
          id: "breche-sinueuse",
          name: "Brèche Sinueuse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }, { tour: "vous", phase: "charge" }],
          quand: "Votre phase de Mouvement ou votre phase de Charge.",
          cible: "1 unité EMPEROR'S CHILDREN DAEMON de votre armée qui n'a pas encore été choisie pour se déplacer ou charger à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'elle fait un Mouvement Normal, une Avance ou une Charge, elle peut traverser horizontalement les éléments de terrain."
        },
        {
          id: "excruciation-rapprochee",
          name: "Excruciation Rapprochée",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui n'a pas encore été choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine EMPEROR'S CHILDREN de cette unité attaque une unité éligible à 12\" ou moins, améliorez de 1 la Force et la Pénétration d'Armure de l'attaque."
        },
        {
          id: "inspiration-euphorique",
          name: "Inspiration Euphorique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité EMPEROR'S CHILDREN DAEMON de votre armée.",
          effet: "Jusqu'à la fin de la phase, vous pouvez relancer les jets de Charge des unités EMPEROR'S CHILDREN amies à 6\" ou moins de cette unité."
        },
        {
          id: "mepris-manifeste",
          name: "Mépris Manifeste",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."
        },
        {
          id: "stimulus-catalytique",
          name: "Stimulus Catalytique",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui a perdu un ou plusieurs PV à cause de ces attaques.",
          effet: "Elle peut faire un mouvement de Stimulus : lancez 1D6, ses figurines se déplacent d'autant de pouces au maximum et l'unité doit finir aussi près que possible de l'unité ennemie la plus proche (sauf AIRCRAFT). Ses figurines peuvent alors finir à portée d'engagement de cette unité ennemie."
        },
        {
          id: "superiorite-vaniteuse",
          name: "Supériorité Vaniteuse",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui n'a pas encore été choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité attaque une unité CHARACTER, vous pouvez relancer le jet de touche et le jet de blessure."
        }
      ]
    },

    /* -------------------------------------------------------
       ELEGANT BRUTES
       ------------------------------------------------------- */
    {
      id: "elegant-brutes",
      name: "Elegant Brutes",
      cost: 1,
      dispositions: ["take-and-hold"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une unité EMPEROR'S CHILDREN TERMINATOR de votre armée est placée sur le champ de bataille, elle a +1 à ses jets de Charge jusqu'à la fin du tour."
        ]
      },

      enhancements: [
        {
          id: "cacophonic-accompaniment",
          name: "Cacophonic Accompaniment",
          cost: 20,
          kind: "optimisation",
          requires: [["Lord Kakophonist"]],          // nom d'unité à vérifier
          text: "Le porteur a Frappe en Profondeur, et les attaques de tir de son unité ont [IGNORE LE COUVERT]."
        },
        {
          id: "frenzied-ferocity",
          name: "Frenzied Ferocity",
          cost: 15,
          kind: "amelioration",
          requires: [["Terminator", "Emperor's Children"]],
          excludes: ["Character"],                   // escouades uniquement
          text: "Les attaques de cette unité ont [TOUCHES SOUTENUES 1]."
        }
      ],

      stratagems: [
        {
          id: "amefeu-psychedelique",
          name: "Âmefeu Psychédélique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, quand une unité EMPEROR'S CHILDREN TERMINATOR de votre armée est choisie pour attaquer.",
          cible: "Cette unité.",
          effet: "Ses attaques ont +2 en Force."
        },
        {
          id: "delice-de-la-douleur",
          name: "Délice de la Douleur",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, quand une unité ennemie cible une unité EMPEROR'S CHILDREN TERMINATOR de votre armée.",
          cible: "Cette unité.",
          effet: "Chaque fois qu'une attaque la cible, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."
        },
        {
          id: "plongeon-warp",
          name: "Plongeon Warp",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité EMPEROR'S CHILDREN TERMINATOR de votre armée non engagée.",
          effet: "Placez-la en Réserves Stratégiques."
        }
      ]
    },

    /* -------------------------------------------------------
       FRENZIED HOST
       ------------------------------------------------------- */
    {
      id: "frenzied-host",
      name: "Frenzied Host",
      cost: 1,
      dispositions: ["reconnaissance"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une unité EMPEROR'S CHILDREN BATTLELINE de votre armée est choisie pour Avancer ou Battre en Retraite, les attaques de ses figurines ont [TOUCHES SOUTENUES 1] jusqu'à la fin du tour."
        ]
      },

      enhancements: [
        {
          id: "euphoric-crown",
          name: "Euphoric Crown",
          cost: 20,
          kind: "optimisation",
          requires: [["Lord Exultant"]],
          text: "Les attaques de mêlée du porteur ont +1 en Force."
        },
        {
          id: "howling-plate",
          name: "Howling Plate",
          cost: 20,
          kind: "optimisation",
          requires: [["Lord Exultant"]],
          text: "Améliorez de 1 la Pénétration d'Armure des attaques de tir de l'unité du porteur."
        }
      ],

      stratagems: [
        {
          id: "cacophonie-de-souffrance",
          name: "Cacophonie de Souffrance",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Début de votre phase de Tir.",
          cible: "1 unité EMPEROR'S CHILDREN BATTLELINE de votre armée.",
          effet: "Choisissez 1 unité ennemie visible et à 12\" ou moins de cette unité : elle a +6\" en portée de détection."
        },
        {
          id: "manie-possessive",
          name: "Manie Possessive",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, quand une unité ennemie cible une unité EMPEROR'S CHILDREN BATTLELINE de votre armée à portée d'un objectif.",
          cible: "Cette unité.",
          effet: "Jusqu'à ce que l'unité ennemie ait fini d'attaquer, réduisez de 1 la Pénétration d'Armure des attaques qui ciblent cette unité."
        },
        {
          id: "saturation-sensorielle-absolue",
          name: "Saturation Sensorielle Absolue",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité EMPEROR'S CHILDREN BATTLELINE de votre armée est choisie pour tirer.",
          cible: "Cette unité.",
          effet: "Ses attaques de tir ne l'empêchent pas d'être cachée."
        }
      ]
    },

    /* -------------------------------------------------------
       MERCURIAL HOST
       ------------------------------------------------------- */
    {
      id: "mercurial-host",
      name: "Mercurial Host",
      cost: 2,
      dispositions: ["reconnaissance"],

      rule: {
        name: null,
        text: [
          "Vous pouvez relancer les jets d'Avance des unités EMPEROR'S CHILDREN de votre armée."
        ]
      },

      enhancements: [
        {
          id: "intoxicating-musk",
          name: "Intoxicating Musk",
          cost: 20,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Chaque fois qu'une attaque cible l'unité du porteur, si la Force de l'attaque est supérieure à l'Endurance de l'unité, soustrayez 1 au jet de blessure."
        },
        {
          id: "loathsome-dexterity",
          name: "Loathsome Dexterity",
          cost: 10,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Quand l'unité du porteur fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines ennemies comme si elles n'étaient pas là, et ses tests de Fuite Désespérée sont automatiquement réussis."
        },
        {
          id: "steeped-in-suffering",
          name: "Steeped in Suffering",
          cost: 20,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Chaque fois qu'une figurine de l'unité du porteur attaque une unité en dessous de son effectif initial, ajoutez 1 au jet de touche. Si la cible est aussi en dessous de la moitié de son effectif, ajoutez également 1 au jet de blessure."
        },
        {
          id: "tactical-perfection",
          name: "Tactical Perfection",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          gameChoice: "Après le déploiement : redéployer jusqu'à 2 unités.",
          text: "Après le déploiement des deux armées, jusqu'à 2 unités EMPEROR'S CHILDREN de votre armée peuvent être redéployées, ou placées en Réserves Stratégiques sans tenir compte des limites habituelles."
        }
      ],

      stratagems: [
        {
          id: "exces-de-violence",
          name: "Excès de Violence",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui n'a pas encore été choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, ses armes de mêlée ont [TOUCHES SOUTENUES 1]."
        },
        {
          id: "honorez-le-prince",
          name: "Honorez le Prince",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité EMPEROR'S CHILDREN INFANTRY de votre armée qui n'a pas encore été choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle avance de 6\" au lieu de D6\"."
        },
        {
          id: "pillards-cruels",
          name: "Pillards Cruels",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée entièrement à 9\" ou moins d'un bord de table et à plus de 3\" de toute unité ennemie.",
          effet: "Placez-la en Réserves Stratégiques."
        },
        {
          id: "reactions-capricieuses",
          name: "Réactions Capricieuses",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, soustrayez 1 au jet de touche."
        },
        {
          id: "sombre-vigueur",
          name: "Sombre Vigueur",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée (sauf BEAST et VEHICLE) à 8\" ou moins de cette unité ennemie.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        },
        {
          id: "stimulants-de-combat",
          name: "Stimulants de Combat",
          cp: 2,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN INFANTRY de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, soustrayez 1 au jet de blessure."
        }
      ]
    },

    /* -------------------------------------------------------
       PEERLESS BLADESMEN
       ------------------------------------------------------- */
    {
      id: "peerless-bladesmen",
      name: "Peerless Bladesmen",
      cost: 2,
      dispositions: ["priority-assets"],

      rule: {
        name: null,
        text: [
          "À un tour où elle a fait un mouvement de Charge, chaque unité EMPEROR'S CHILDREN de votre armée peut choisir que ses armes de mêlée aient soit [TOUCHES SOUTENUES 1], soit [TOUCHES FATALES]."
        ]
      },

      enhancements: [
        {
          id: "blinding-speed",
          name: "Blinding Speed",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de la phase de Combat, l'unité du porteur a Combat en Premier jusqu'à la fin de la phase."
        },
        {
          id: "distortion",
          name: "Distortion",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Ajoutez 1 aux Attaques et aux Dégâts des armes de mêlée du porteur."
        },
        {
          id: "faultless-opportunist",
          name: "Faultless Opportunist",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Vous pouvez cibler l'unité du porteur avec le stratagème Intervention Héroïque même s'il a déjà été utilisé à cette phase. Dans ce cas, il coûte 1 PC de moins, et cette utilisation n'empêche pas d'autres utilisations du stratagème sur d'autres unités à cette phase."
        },
        {
          id: "rise-to-the-challenge",
          name: "Rise to the Challenge",
          cost: 30,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-bataille",
          text: "Une fois par bataille, à la fin de la phase de Combat, si le porteur est à portée d'engagement de 3 figurines ennemies ou plus, il peut combattre une seconde fois. Pour ces attaques, ses armes de mêlée ont au choix [TOUCHES SOUTENUES 1] ou [TOUCHES FATALES]."
        }
      ],

      stratagems: [
        {
          id: "epeiste-cruel",
          name: "Épéiste Cruel",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui a chargé ce tour et n'a pas encore été choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses attaques."
        },
        {
          id: "extase-mortelle",
          name: "Extase Mortelle",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée choisie pour cible.",
          effet: "Chaque figurine de cette unité détruite avant d'avoir combattu à cette phase peut combattre avant d'être retirée."
        },
        {
          id: "fauchez-les-faibles",
          name: "Fauchez les Faibles",
          cp: 2,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a Battu en Retraite.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée à 6\" ou moins de cette unité ennemie (sauf VEHICLE, à l'exception des WALKER).",
          effet: "Elle peut déclarer une charge contre cette unité ennemie comme si c'était votre phase de Charge, mais sans bénéficier des bonus de charge."
        },
        {
          id: "parade-adroite",
          name: "Parade Adroite",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque la cible, soustrayez 1 au jet de touche."
        },
        {
          id: "spectacle-terrifiant",
          name: "Spectacle Terrifiant",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "commandement" }],
          quand: "Phase de Commandement adverse.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui, au tour précédent, a chargé puis détruit une unité ennemie à la phase de Combat.",
          effet: "Chaque unité ennemie à 6\" ou moins d'elle fait un test d'Ébranlement (à -1 si elle est en dessous de la moitié de son effectif). Ces unités n'ont pas à passer d'autre test d'Ébranlement éventuel à cette phase."
        },
        {
          id: "violence-incessante",
          name: "Violence Incessante",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, quand une unité EMPEROR'S CHILDREN de votre armée consolide.",
          cible: "Cette unité.",
          effet: "Elle peut consolider de 6\" au lieu de 3\", à condition de finir à portée d'engagement d'au moins une unité ennemie."
        }
      ]
    },

    /* -------------------------------------------------------
       RAPID EVISCERATION
       ------------------------------------------------------- */
    {
      id: "rapid-evisceration",
      name: "Rapid Evisceration",
      cost: 2,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "Relancez les jets de touche de 1 et les jets de blessure de 1 des unités EMPEROR'S CHILDREN TRANSPORT de votre armée, ainsi que des unités EMPEROR'S CHILDREN de votre armée au tour où elles ont débarqué d'un TRANSPORT."
        ]
      },

      enhancements: [
        {
          id: "accomplished-tactician",
          name: "Accomplished Tactician",
          cost: 35,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, à la phase de Tir adverse, juste après qu'une unité ennemie a tiré, choisissez 1 unité EMPEROR'S CHILDREN de votre armée à 9\" ou moins du porteur et touchée par ces attaques : elle peut embarquer dans un TRANSPORT entièrement à 6\" ou moins d'elle."
        },
        {
          id: "heretek-adept",
          name: "Heretek Adept",
          cost: 35,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-round",
          text: "Une fois par round, quand un jet de sauvegarde est raté pour une figurine EMPEROR'S CHILDREN VEHICLE de votre armée à 6\" ou moins du porteur, vous pouvez réduire à 0 les dégâts de cette attaque."
        },
        {
          id: "spearhead-striker",
          name: "Spearhead Striker",
          cost: 20,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Au tour où l'unité du porteur débarque d'un TRANSPORT, elle peut relancer ses jets de Charge et ne peut pas être la cible de Tirs en Alerte."
        },
        {
          id: "sublime-prescience",
          name: "Sublime Prescience",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, à votre phase de Mouvement, 1 unité EMPEROR'S CHILDREN TRANSPORT de votre armée peut arriver des Réserves Stratégiques comme si l'on était un round plus tôt."
        }
      ],

      stratagems: [
        {
          id: "au-suivant",
          name: "Au Suivant",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Fin de la phase de Combat.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui a détruit une unité ennemie à cette phase.",
          effet: "Elle peut embarquer dans un TRANSPORT entièrement à 6\" ou moins d'elle, même si elle a débarqué d'un TRANSPORT ce tour."
        },
        {
          id: "avance-et-prise-de-controle",
          name: "Avance et Prise de Contrôle",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 objectif que vous contrôlez, à portée d'un EMPEROR'S CHILDREN TRANSPORT de votre armée transportant au moins une unité de TORMENTORS non Ébranlée.",
          effet: "Cet objectif reste sous votre contrôle même si vous n'avez plus de figurine à sa portée, jusqu'à ce que votre adversaire ait un CO supérieur au vôtre sur cet objectif à la fin d'une phase."
        },
        {
          id: "debarquement-reactif",
          name: "Débarquement Réactif",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 EMPEROR'S CHILDREN TRANSPORT de votre armée choisi pour cible.",
          effet: "Une unité EMPEROR'S CHILDREN embarquée à son bord peut débarquer, entièrement à 6\" ou moins du transport et hors de portée d'engagement de toute unité ennemie."
        },
        {
          id: "frappe-de-flanc",
          name: "Frappe de Flanc",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 EMPEROR'S CHILDREN TRANSPORT, ou jusqu'à 2 EMPEROR'S CHILDREN DEDICATED TRANSPORT de votre armée, entièrement à 9\" ou moins d'un bord de table.",
          effet: "Placez-les en Réserves Stratégiques."
        },
        {
          id: "offensive-continue",
          name: "Offensive Continue",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité EMPEROR'S CHILDREN de votre armée qui a débarqué ce tour d'un TRANSPORT qui avait déjà bougé.",
          effet: "Elle peut quand même déclarer une charge."
        },
        {
          id: "percee-dynamique",
          name: "Percée Dynamique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité EMPEROR'S CHILDREN VEHICLE de votre armée qui n'a pas encore été choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle peut traverser les figurines ennemies (sauf MONSTER et VEHICLE) comme si elles n'étaient pas là, et ses tests de Fuite Désespérée sont automatiquement réussis."
        }
      ]
    },

    /* -------------------------------------------------------
       SLAANESH'S CHOSEN
       ------------------------------------------------------- */
    {
      id: "slaaneshs-chosen",
      name: "Slaanesh's Chosen",
      cost: 1,
      dispositions: ["purge-the-foe"],

      rule: {
        name: null,
        text: [
          "Les unités EMPEROR'S CHILDREN CHARACTER de votre armée peuvent ignorer tout ou partie des modificateurs à leur caractéristique de Mouvement et à leurs jets d'Avance et de Charge.",
          "Au début de la bataille, l'unité de votre Seigneur de Guerre est le champion favori de votre armée. La première fois à chaque tour de joueur qu'une autre unité EMPEROR'S CHILDREN CHARACTER de votre armée détruit une unité ennemie, une fois toutes ses attaques résolues, elle devient le nouveau champion favori et remplace l'ancien.",
          "Chaque fois qu'une figurine de l'unité champion favori attaque, vous pouvez relancer le jet de blessure."
        ]
      },

      // Désignation suivie par le compagnon de jeu (une seule unité à la fois)
      tracker: {
        id: "champion-favori",
        type: "designation",
        label: "Champion favori",
        eligible: [["Emperor's Children", "Character"]],
        initial: "seigneur-de-guerre",
        rappel: "1re destruction d'une unité ennemie par une autre unité de personnage à ce tour de joueur : elle devient le champion favori.",
        bonus: "Relance des jets de blessure."
      },

      enhancements: [
        {
          id: "eager-to-prove",
          name: "Eager to Prove",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "L'unité du porteur peut relancer ses jets de Charge. Si elle est le champion favori, elle a aussi +2\" en Mouvement."
        },
        {
          id: "proud-and-vainglorious",
          name: "Proud and Vainglorious",
          cost: 20,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "L'unité du porteur peut relancer ses tests d'Ébranlement et de Commandement. Si elle est le champion favori, ses figurines ont aussi +1 en CO."
        },
        {
          id: "repulsed-by-weakness",
          name: "Repulsed by Weakness",
          cost: 25,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) à portée d'engagement de l'unité du porteur Bat en Retraite, elle doit faire des tests de Fuite Désespérée. Si l'unité du porteur est le champion favori, soustrayez 1 au résultat de ces tests."
        },
        {
          id: "slayer-of-champions",
          name: "Slayer of Champions",
          cost: 15,
          kind: "optimisation",
          requires: [["Emperor's Children"]],
          text: "Les armes de mêlée du porteur ont [PRÉCISION]. Quand il attaque une unité CHARACTER, améliorez aussi de 1 leur Force et leur Pénétration d'Armure."
        }
      ],

      stratagems: [
        {
          id: "acces-de-vengeance",
          name: "Accès de Vengeance",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré sur une unité EMPEROR'S CHILDREN CHARACTER de votre armée non engagée.",
          cible: "Cette unité de personnage.",
          effet: "Elle peut faire un mouvement d'Élan de D6\" maximum. Si elle n'est pas le champion favori, vous pouvez relancer le dé déterminant la distance."
        },
        {
          id: "duelliste-fervent",
          name: "Duelliste Fervent",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "combat" }],
          quand: "Votre phase de Combat.",
          cible: "1 unité ennemie.",
          effet: "Jusqu'à la fin de la phase, les attaques de mêlée des unités EMPEROR'S CHILDREN CHARACTER de votre armée qui ciblent cette unité ont [TOUCHES SOUTENUES 1]."
        },
        {
          id: "jalousie-exacerbee",
          name: "Jalousie Exacerbée",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, juste après qu'une unité devient le champion favori, ou juste après que le champion favori a détruit une unité ennemie.",
          cible: "Les unités EMPEROR'S CHILDREN CHARACTER de votre armée qui ne sont pas le champion favori.",
          effet: "Jusqu'à la fin de la phase, leurs attaques ont +1 en Force."
        },
        {
          id: "majeste-diabolique",
          name: "Majesté Diabolique",
          cp: 1,
          type: null,
          limite: "une-fois-par-round",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, juste après qu'une unité EMPEROR'S CHILDREN devient le nouveau champion favori.",
          cible: "Cette unité.",
          effet: "Chaque unité ennemie à 6\" ou moins d'elle fait un test d'Ébranlement à -1. Une seule fois par round."
        },
        {
          id: "refus-de-conceder",
          name: "Refus de Concéder",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge, quand une unité EMPEROR'S CHILDREN CHARACTER de votre armée à 12\" ou moins d'une ou plusieurs unités ennemies engagées déclare une charge.",
          cible: "Cette unité de personnage.",
          effet: "Elle peut relancer son jet de Charge, mais doit finir ce mouvement de Charge engagée avec une ou plusieurs de ces unités ennemies."
        },
        {
          id: "trepas-magnifique",
          name: "Trépas Magnifique",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité EMPEROR'S CHILDREN CHARACTER de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité est détruite avant d'avoir combattu, sur 4+ (3+ si c'est le champion favori), elle peut combattre une fois que l'unité attaquante a fini ses attaques, avant d'être retirée."
        }
      ]
    },

    /* -------------------------------------------------------
       SPECTACLE OF SLAUGHTER
       ------------------------------------------------------- */
    {
      id: "spectacle-of-slaughter",
      name: "Spectacle of Slaughter",
      cost: 1,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "Les unités de FLAWLESS BLADES de votre armée ont Combat en Premier."
        ]
      },

      enhancements: [
        {
          id: "beguiling-grotesquerie",
          name: "Beguiling Grotesquerie",
          cost: 15,
          kind: "amelioration",
          requires: [["Flawless Blades"]],
          text: "Les unités ennemies ne peuvent pas cibler cette unité avec des attaques de tir au jugé."
        },
        {
          id: "eager-patrons",
          name: "Eager Patrons",
          cost: 20,
          kind: "amelioration",
          requires: [["Flawless Blades"]],
          text: "Cette unité a +2\" en Mouvement."
        }
      ],

      stratagems: [
        {
          id: "frappe-determinee",
          name: "Frappe Déterminée",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge, quand une unité de FLAWLESS BLADES de votre armée commence un mouvement de Charge.",
          cible: "Cette unité.",
          effet: "Elle peut traverser les figurines (sauf MONSTER et VEHICLE) pendant ce mouvement."
        },
        {
          id: "ivres-de-triomphe",
          name: "Ivres de Triomphe",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, quand une unité ennemie qui était engagée avec une unité de FLAWLESS BLADES de votre armée finit une Retraite, si cette unité de FLAWLESS BLADES n'est plus engagée.",
          cible: "Cette unité de FLAWLESS BLADES.",
          effet: "Elle peut faire un Mouvement Normal de D3+3\" maximum."
        },
        {
          id: "l-honneur-sied-aux-fous",
          name: "L'Honneur Sied aux Fous",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, quand une unité de FLAWLESS BLADES de votre armée est choisie pour combattre.",
          cible: "Cette unité.",
          effet: "Ses attaques de mêlée ont [PRÉCISION]."
        }
      ]
    }
  ],

  /* =========================================================
     UNITÉS
     category : voir UnitCategories dans config.js
     costs    : paliers par exemplaire (from = Nième exemplaire)
     abilities / coreAbilities : références au glossaire ("id" ou "id:valeur")
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ---------- */
    {
      id: "lucius-the-eternal",
      name: "Lucius the Eternal",
      category: "epic-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Chaos", "Slaanesh", "Lucius the Eternal"],
      stats: { M: "8\"", T: 6, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }] }],
      leader: { canLead: ["Flawless Blades"] },
      coreAbilities: ["feel-no-pain:5+", "leader", "lone-operative"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "blade-of-the-laer", name: "Blade of the Laer", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "8", AP: "-3", D: "3", abilities: ["precision"] }] },
        { id: "lash-of-torment", name: "Lash of Torment", type: "melee",
          profiles: [{ range: "Mêlée", A: "10", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] }
      ],
      loadout: ["blade-of-the-laer", "lash-of-torment"],
      abilities: [
        { name: "A Challenge Worthy of Skill",
          text: "Chaque fois que cette figurine attaque une unité CHARACTER, MONSTER ou WALKER, vous pouvez relancer le jet de touche et le jet de blessure." },
        { name: "Duellist's Hubris", condition: { notLeading: true },
          text: "Au début de la phase de Combat, si cette figurine ne mène pas d'unité, elle a Combat en Premier jusqu'à la fin de la phase." }
      ],
      composition: "1 Lucius the Eternal"
    },

    /* ---------- Héros monstres épiques ---------- */
    {
      id: "fulgrim",
      name: "Fulgrim",
      category: "epic-monster",
      base: "130mm",
      keywords: ["Monster", "Mobile", "Fly", "Character", "Epic Hero", "Daemon", "Chaos", "Slaanesh", "Primarch", "Fulgrim"],
      stats: { M: "16\"", T: 11, Sv: "2+", W: 16, Ld: "5+", OC: 6, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 340 }] }],
      mustBeWarlord: true,                          // Supreme Commander
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "malefic-lash", name: "Malefic lash", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "8", AP: "-2", D: "2", abilities: ["sustained-hits:1"] }] },
        { id: "daemonic-blades", name: "Daemonic blades", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "14", AP: "-3", D: "D6+1", abilities: ["sustained-hits:1"] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "2+", S: "8",  AP: "-2", D: "2",    abilities: ["sustained-hits:1"] }
          ] },
        { id: "serpentine-tail", name: "Serpentine tail", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["extra-attacks"] }] }
      ],
      loadout: ["malefic-lash", "daemonic-blades", "serpentine-tail"],
      abilities: [
        { name: "Daemonic Poisons",
          text: "À votre phase de Tir et à la phase de Combat, après que cette figurine a fini ses attaques, choisissez 1 unité ennemie touchée par au moins une de ces attaques : elle est empoisonnée jusqu'à la fin de la bataille. Au début de la phase de Commandement de chaque joueur, lancez 1D6 pour chaque unité ennemie empoisonnée sur le champ de bataille : sur 4+, elle subit D3 blessures mortelles." },
        { name: "Daemon Primarch of Slaanesh",
          text: "Au début de la phase de Commandement adverse, choisissez 1 des aptitudes Daemon Primarch of Slaanesh. Cette figurine a cette aptitude jusqu'au début de la phase de Commandement adverse suivante." },
        { name: "Supreme Commander",
          text: "Si cette figurine fait partie de votre armée, elle doit être votre Seigneur de Guerre." }
      ],
      // Aptitudes au choix, sélectionnées en partie dans le compagnon
      abilityChoices: {
        name: "Daemon Primarch of Slaanesh",
        when: "Début de la phase de Commandement adverse",
        options: [
          { name: "Beguiling Form", text: "Chaque fois qu'une figurine attaque cette figurine, soustrayez 1 au jet de touche." },
          { name: "Daemonic Speed", text: "Cette figurine a Combat en Premier." },
          { name: "Enthralling Hypnosis (Aura)", text: "Tant qu'une unité ennemie est à 6\" ou moins de cette figurine, chaque fois qu'elle est choisie pour Battre en Retraite, elle doit faire un test de Commandement. En cas d'échec, elle doit Rester Immobile à la place." }
        ]
      },
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Fulgrim"
    },

    /* ---------- Personnages d'infanterie ---------- */
    {
      id: "lord-exultant",
      name: "Lord Exultant",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Slaanesh", "Lord Exultant"],
      stats: { M: "7\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }, { from: 3, pts: 105 }] }],
      leader: { canLead: ["Infractors", "Tormentors"] },
      coreAbilities: ["leader"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "screamer-pistol", name: "Screamer pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["ignores-cover", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "master-crafted-power-sword", name: "Master-crafted power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "5", AP: "-2", D: "2", abilities: ["precision"] }] },
        { id: "phoenix-power-spear", name: "Phoenix power spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "7", AP: "-2", D: "2", abilities: ["lance"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-2", D: "2", abilities: [] }] },
        { id: "rapture-lash", name: "Rapture lash", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["extra-attacks"] }] }
      ],
      loadout: ["bolt-pistol", "plasma-pistol", "phoenix-power-spear", "close-combat-weapon"],
      // Options : l'arme remplacée (replaces) par l'un des choix (chaque choix = liste d'armes)
      options: [
        { id: "remplace-plasma", text: "Le plasma pistol peut être remplacé par :",
          replaces: ["plasma-pistol"], choices: [["power-fist"], ["rapture-lash"]] },
        { id: "remplace-spear", text: "La Phoenix power spear peut être remplacée par :",
          replaces: ["phoenix-power-spear"], choices: [["master-crafted-power-sword"], ["screamer-pistol"]] }
      ],
      abilities: [
        { name: "Perfectionists", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes des figurines de cette unité ont [TOUCHES FATALES]." },
        { name: "Euphoric Strikes", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de la phase de Combat, cette figurine peut utiliser cette aptitude. Jusqu'à la fin de la phase, ajoutez 3 aux Attaques de ses armes de mêlée et améliorez de 1 leur Pénétration d'Armure." },
        { name: "Lord of the Host", condition: { leading: [["Emperor's Children", "Battleline"]] },
          text: "Si cette figurine est rattachée à une unité EMPEROR'S CHILDREN BATTLELINE lors de l'étape de Déclaration des Formations de Bataille, elle a les aptitudes Infiltrateurs et Éclaireurs 6\"." }
      ],
      composition: "1 Lord Exultant"
    },
    {
      id: "lord-kakophonist",
      name: "Lord Kakophonist",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Slaanesh", "Lord Kakophonist"],
      stats: { M: "6\"", T: 6, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Chaos Terminators", "Noise Marines"] },
      coreAbilities: ["leader"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "screamer-pistol", name: "Screamer pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["ignores-cover", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      loadout: ["screamer-pistol", "power-sword"],
      options: [
        { id: "remplace-sword", text: "La power sword peut être remplacée par 1 screamer pistol et 1 close combat weapon.",
          replaces: ["power-sword"], choices: [["screamer-pistol", "close-combat-weapon"]] }
      ],
      abilities: [
        { name: "Obsessive Annunciation", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes de tir des figurines de cette unité ont [TOUCHES SOUTENUES 1]." },
        { name: "Doom Siren", grants: "son-unite",
          text: "À votre phase de Tir, après que l'unité de cette figurine a tiré, choisissez 1 unité ennemie INFANTRY touchée par au moins une de ces attaques et lancez 3D6 : pour chaque 4+, elle subit 1 blessure mortelle. Si elle subit au moins une blessure mortelle de cette façon, elle doit faire un test d'Ébranlement." }
      ],
      composition: "1 Lord Kakophonist"
    },
    {
      id: "sorcerer",
      name: "Sorcerer",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Psyker", "Grenades", "Chaos", "Slaanesh", "Sorcerer"],
      stats: { M: "7\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 55 }] }],
      leader: { canLead: ["Infractors", "Noise Marines", "Tormentors"] },
      coreAbilities: ["leader"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "agonising-energies", name: "Agonising Energies", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "18\"", A: "D6", skill: "3+", S: "5", AP: "-1", D: "D3", abilities: ["psychic"] },
            { name: "focused witchfire", range: "18\"", A: "D6", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["devastating-wounds", "hazardous", "psychic"] }
          ] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "force-weapon", name: "Force weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["psychic"] }] }
      ],
      loadout: ["agonising-energies", "bolt-pistol", "force-weapon"],
      abilities: [
        { name: "Warped Interference (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une attaque de tir cible cette unité, ses figurines ont le Bénéfice du Couvert contre cette attaque." },
        { name: "Wracking Agonies (Psychic)",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité INFANTRY touchée par au moins une attaque de ses Agonising Energies. Jusqu'au début de votre prochain tour, elle est tourmentée : soustrayez 2\" à son Mouvement et 2 à ses jets de Charge." }
      ],
      composition: "1 Sorcerer"
    },

    /* ---------- Personnages monstres ---------- */
    {
      id: "daemon-prince-of-slaanesh",
      name: "Daemon Prince of Slaanesh",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Chaos", "Daemon", "Slaanesh", "Daemon Prince"],
      stats: { M: "10\"", T: 10, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 165 }, { from: 2, pts: 180 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["thrill-seekers"],
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
        { name: "Lord of Excess",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités SLAANESH INFANTRY amies, elle a l'aptitude Agent Solitaire." },
        { name: "Excessive Vigour (Aura)",
          text: "Tant qu'une unité SLAANESH amie est à 6\" ou moins de cette figurine, si cette unité a fait un mouvement de Charge ce tour, améliorez de 1 la Pénétration d'Armure des armes de mêlée de ses figurines." },
        { name: "Ecstatic Death",
          text: "Si cette figurine est détruite par une attaque de mêlée et qu'elle n'a pas encore combattu à cette phase, lancez 1D6 : sur 2+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée." }
      ],
      composition: "1 Daemon Prince of Slaanesh"
    },
    {
      id: "daemon-prince-of-slaanesh-with-wings",
      name: "Daemon Prince of Slaanesh with Wings",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Fly", "Character", "Chaos", "Daemon", "Slaanesh", "Daemon Prince with Wings"],
      stats: { M: "14\"", T: 9, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 205 }, { from: 2, pts: 225 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["thrill-seekers"],
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
        { name: "Stimulated by Pain",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de cette attaque." }
      ],
      composition: "1 Daemon Prince of Slaanesh with Wings"
    },

    /* ---------- Ligne ----------
       models  : types de figurines de l'unité (count "reste" = complète l'effectif)
       options : replaces = arme remplacée (absent = ajout) ; choices = choix possibles
                 model = figurine concernée (absent = n'importe laquelle)
                 max.count = nombre max d'options ; max.per = par tranche de N figurines
                 group = options mutuellement exclusives
       wargear : équipements sans profil d'arme (aptitude liée dans abilities) */
    {
      id: "infractors",
      name: "Infractors",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Slaanesh", "Infractors"],
      stats: { M: "7\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 95 }] },
        { models: 10, costs: [{ from: 1, pts: 175 }] }
      ],
      coreAbilities: ["scouts:6\""],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "duelling-sabre", name: "Duelling sabre", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["precision"] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["precision"] }] },
        { id: "rapture-lash", name: "Rapture lash", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["precision"] }] }
      ],
      wargear: [{ id: "icon-of-excess", name: "Icon of Excess" }],
      models: [
        { id: "obsessionist", name: "Obsessionist", count: 1,       loadout: ["bolt-pistol", "power-sword"] },
        { id: "infractor",    name: "Infractor",    count: "reste", loadout: ["bolt-pistol", "duelling-sabre"] }
      ],
      options: [
        { id: "obs-pistol", model: "obsessionist", text: "Le bolt pistol de l'Obsessionist peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "obs-sword", model: "obsessionist", text: "La power sword de l'Obsessionist peut être remplacée par 1 rapture lash.",
          replaces: ["power-sword"], choices: [["rapture-lash"]] },
        { id: "icon", model: "infractor", text: "1 Infractor peut porter 1 Icon of Excess.",
          choices: [["icon-of-excess"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Excessive Assault",
          text: "Chaque fois qu'une figurine de cette unité cible une unité ennemie avec une attaque de mêlée, relancez un jet de blessure de 1. Si l'unité ennemie est à portée d'un pion objectif, vous pouvez relancer le jet de blessure à la place." },
        { name: "Icon of Excess", requiresWargear: "icon-of-excess",
          text: "À la fin de votre phase de Tir ou de la phase de Combat, si l'unité du porteur a détruit une ou plusieurs unités ennemies à cette phase, elle fait un test de Commandement. S'il est réussi, vous gagnez 1 PC." }
      ],
      composition: "1 Obsessionist et 4 à 9 Infractors"
    },
    {
      id: "tormentors",
      name: "Tormentors",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Slaanesh", "Tormentors"],
      stats: { M: "7\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 85 }] },
        { models: 10, costs: [{ from: 1, pts: 170 }] }
      ],
      coreAbilities: ["infiltrators"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol", "precision"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["precision"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2", "precision"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["precision", "rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "precision", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol", "precision"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol", "precision"] }
          ] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "rapture-lash", name: "Rapture lash", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "4", AP: "-1", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "icon-of-excess", name: "Icon of Excess" }],
      models: [
        { id: "obsessionist", name: "Obsessionist", count: 1,       loadout: ["bolt-pistol", "power-sword"] },
        { id: "tormentor",    name: "Tormentor",    count: "reste", loadout: ["boltgun", "close-combat-weapon"] }
      ],
      options: [
        { id: "obs-pistol", model: "obsessionist", text: "Le bolt pistol de l'Obsessionist peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]] },
        { id: "obs-sword", model: "obsessionist", text: "La power sword de l'Obsessionist peut être remplacée par 1 rapture lash.",
          replaces: ["power-sword"], choices: [["rapture-lash"]] },
        { id: "melta", model: "tormentor", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Tormentor peut être remplacé par 1 meltagun.",
          replaces: ["boltgun"], choices: [["meltagun"]], max: { per: 5, count: 1 } },
        { id: "plasma", model: "tormentor", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Tormentor peut être remplacé par 1 plasma gun.",
          replaces: ["boltgun"], choices: [["plasma-gun"]], max: { per: 5, count: 1 } },
        { id: "icon", model: "tormentor", text: "1 Tormentor peut porter 1 Icon of Excess.",
          choices: [["icon-of-excess"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Objective Defiled",
          text: "À la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle de votre adversaire sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Icon of Excess", requiresWargear: "icon-of-excess",
          text: "À la fin de votre phase de Tir ou de la phase de Combat, si l'unité du porteur a détruit une ou plusieurs unités ennemies à cette phase, elle fait un test de Commandement. S'il est réussi, vous gagnez 1 PC." }
      ],
      composition: "1 Obsessionist et 4 à 9 Tormentors"
    },

    /* ---------- Transports assignés ---------- */
    {
      id: "chaos-rhino",
      name: "Chaos Rhino",
      category: "dedicated-transport",
      base: null,                                   // socle : la figurine elle-même
      keywords: ["Vehicle", "Transport", "Frame", "Dedicated Transport", "Smoke", "Chaos", "Slaanesh", "Rhino"],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }, { from: 4, pts: 80 }] }],
      coreAbilities: ["deadly-demise:D3", "firing-deck:2"],
      armyRules: ["thrill-seekers"],
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
        allowed: [["Emperor's Children", "Infantry"]],
        excluded: ["Terminator", "Flawless Blades"],
        text: "Capacité de transport de 12 figurines EMPEROR'S CHILDREN INFANTRY (sauf les figurines TERMINATOR et FLAWLESS BLADES)."
      },
      abilities: [
        { name: "Assault Vehicle",
          text: "Les unités peuvent débarquer de ce TRANSPORT après qu'il a Avancé. Elles font alors un mouvement de débarquement de choc (Règles de Base, 18.07) pour ce débarquement." }
      ],
      composition: "1 Chaos Rhino"
    },

    /* ---------- Bêtes ---------- */
    {
      id: "chaos-spawn",
      name: "Chaos Spawn",
      category: "beasts",
      base: "50mm",
      keywords: ["Beast", "Chaos", "Slaanesh", "Chaos Spawn"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 1 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 70 }] }],
      coreAbilities: ["feel-no-pain:5+"],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "D6+2", skill: "4+", S: "5", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["hideous-mutations"],
      abilities: [
        { name: "Scuttling Horrors",
          text: "À la phase de Mouvement adverse, si une unité ennemie finit un mouvement à 8\" ou moins de cette unité, et si cette unité n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de 6\" maximum." }
      ],
      composition: "2 Chaos Spawn"
    },

    /* ---------- Infanterie ---------- */
    {
      id: "chaos-terminators",
      name: "Chaos Terminators",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Slaanesh", "Terminator", "Terminator Squad"],
      stats: { M: "6\"", T: 6, Sv: "2+", W: 3, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 5, costs: [{ from: 1, pts: 155 }] }],
      coreAbilities: ["deep-strike"],
      armyRules: ["thrill-seekers"],
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
        { id: "arme-lourde", model: "chaos-terminator", text: "Le combi-bolter d'1 Chaos Terminator peut être remplacé par 1 heavy flamer ou 1 reaper autocannon.",
          replaces: ["combi-bolter"], choices: [["heavy-flamer"], ["reaper-autocannon"]], max: { count: 1 } },
        { id: "combi-weapon", text: "N'importe quel nombre de figurines peuvent remplacer leur combi-bolter par 1 combi-weapon.",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]] },
        { id: "paired", text: "Le combi-bolter et l'accursed weapon d'1 figurine peuvent être remplacés par 1 paired accursed weapons.",
          replaces: ["combi-bolter", "accursed-weapon"], choices: [["paired-accursed-weapons"]], max: { count: 1 } },
        { id: "power-fist", text: "Jusqu'à 3 figurines peuvent remplacer leur accursed weapon par 1 power fist.",
          replaces: ["accursed-weapon"], choices: [["power-fist"]], max: { count: 3 } },
        { id: "chainfist", text: "L'accursed weapon d'1 figurine peut être remplacée par 1 chainfist.",
          replaces: ["accursed-weapon"], choices: [["chainfist"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Lethal Obsession",
          text: "À votre phase de Tir, après que cette unité a tiré, vous pouvez choisir 1 unité ennemie touchée par ces attaques de tir. Jusqu'à la fin du tour, quand cette unité déclare une charge : elle peut relancer ce jet de Charge, et elle doit finir ce mouvement de Charge engagée avec cette unité ennemie." }
      ],
      composition: "1 Terminator Champion et 4 Chaos Terminators"
    },
    {
      id: "flawless-blades",
      name: "Flawless Blades",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Slaanesh", "Flawless Blades"],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 95 }] },
        { models: 6, costs: [{ from: 1, pts: 190 }] }
      ],
      coreAbilities: [],
      armyRules: ["thrill-seekers"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "blissblade", name: "Blissblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-3", D: "2", abilities: [] }] }
      ],
      loadout: ["bolt-pistol", "blissblade"],
      abilities: [
        { name: "Daemonic Patrons",
          text: "Chaque fois que cette unité est choisie pour combattre, elle peut invoquer ses patrons démoniaques. Dans ce cas, jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, un jet de blessure non modifié de 3+ est une Blessure Critique. À la fin de la phase de Combat, si elle a invoqué ses patrons à cette phase et qu'aucune figurine ennemie n'a été détruite par ses attaques à cette phase, une figurine de cette unité est détruite." }
      ],
      composition: "3 à 6 Flawless Blades"
    },
    {
      id: "noise-marines",
      name: "Noise Marines",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Slaanesh", "Noise Marines"],
      stats: { M: "6\"", T: 5, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
      sizes: [{ models: 6, costs: [{ from: 1, pts: 160 }, { from: 3, pts: 175 }] }],
      coreAbilities: [],
      armyRules: ["thrill-seekers"],
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
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par au moins une de ces attaques. Jusqu'au début de votre prochaine phase de Tir, chaque fois que cette unité fait un test d'Ébranlement ou de Commandement, soustrayez 1 au résultat." }
      ],
      composition: "1 Disharmonist et 5 Noise Marines"
    },

    /* ---------- Transports ---------- */
    {
      id: "chaos-land-raider",
      name: "Chaos Land Raider",
      category: "transport",
      base: null,
      keywords: ["Vehicle", "Transport", "Frame", "Smoke", "Chaos", "Slaanesh", "Land Raider"],
      stats: { M: "10\"", T: 12, Sv: "2+", W: 16, Ld: "6+", OC: 5 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 210 }, { from: 3, pts: 230 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["thrill-seekers"],
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
        capacity: 14,
        allowed: [["Emperor's Children", "Infantry"]],
        double: ["Terminator", "Flawless Blades"],       // comptent pour 2 places
        text: "Capacité de transport de 14 figurines EMPEROR'S CHILDREN INFANTRY. Chaque figurine TERMINATOR ou FLAWLESS BLADES compte pour 2 places."
      },
      abilities: [
        { name: "Assault Ramp",
          text: "Chaque fois qu'une unité débarque de ce véhicule après qu'il a fait un Mouvement Normal, elle fait un mouvement de débarquement d'assaut (Règles de Base, 18.06) pour ce débarquement." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Land Raider"
    },

    /* ---------- Véhicules et marcheurs ----------
       cost sur une arme = surcoût en points par exemplaire pris
       maxPerModel = nombre max d'exemplaires d'une arme */
    {
      id: "defiler",
      name: "Defiler",
      category: "walkers",
      base: "160mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Slaanesh", "Daemon", "Defiler"],
      stats: { M: "12\"", T: 11, Sv: "3+", W: 18, Ld: "6+", OC: 5, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 300 }, { from: 2, pts: 350 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["thrill-seekers"],
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
            { name: "strike", range: "Mêlée", A: "5",  skill: "3+", S: "16", AP: "-3", D: "D6+1", abilities: ["precision"] },
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
        { id: "baleflamer", text: "Le heavy baleflamer peut être remplacé par 1 Hades lascannon, 1 heavy reaper autocannon ou 1 electroscourge.",
          replaces: ["heavy-baleflamer"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] },
        { id: "missile", text: "Le heavy missile launcher peut être remplacé par 1 Hades lascannon, 1 heavy reaper autocannon ou 1 electroscourge.",
          replaces: ["heavy-missile-launcher"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] }
      ],
      abilities: [
        { name: "Scuttling Walker",
          text: "Chaque fois que cette unité fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines (sauf TITANIC) et les éléments de terrain. Elle peut alors passer à portée d'engagement de figurines ennemies, mais ne peut pas y finir son mouvement, et ses tests de Fuite Désespérée sont automatiquement réussis." },
        { name: "Revel in Desecration",
          text: "Chaque fois que cette figurine attaque une unité ennemie qui n'est pas en dessous de la moitié de son effectif, ajoutez 1 au jet de touche." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Defiler"
    },
    {
      id: "heldrake",
      name: "Heldrake",
      category: "vehicles",
      base: "120 x 92mm (socle volant)",
      keywords: ["Vehicle", "Fly", "Chaos", "Daemon", "Slaanesh", "Heldrake"],
      stats: { M: "12\"", T: 10, Sv: "3+", W: 14, Ld: "7+", OC: 0, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 175 }] }],
      coreAbilities: ["deadly-demise:D3", "hover"],
      armyRules: ["thrill-seekers"],
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
          text: "Chaque fois que cette figurine finit un Mouvement Normal, vous pouvez choisir 1 unité ennemie qu'elle a survolée pendant ce mouvement et lancer 2D6, en ajoutant 1 à chaque résultat si cette unité ennemie a le mot-clé FLY : pour chaque 4+, elle subit D3 blessures mortelles." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Heldrake"
    },
    {
      id: "maulerfiend",
      name: "Maulerfiend",
      category: "walkers",
      base: "120 x 92mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Daemon", "Slaanesh", "Maulerfiend"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 120 }, { from: 3, pts: 130 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["thrill-seekers"],
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
        { name: "Glutton for Punishment",
          text: "Chaque fois que cette figurine attaque, si elle est en dessous de son effectif initial, ajoutez 1 au jet de touche. Si elle est aussi en dessous de la moitié de son effectif, ajoutez également 1 au jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Maulerfiend"
    }
  ]
});
