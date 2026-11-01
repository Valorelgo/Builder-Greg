/* =========================================================
   AELDARI — Données de faction
   Détachements, optimisations et stratagèmes en français ;
   unités, armes et mots-clés en anglais.

   ÉTAT
   - 15 détachements : complets (règles, 52 optimisations, 78 stratagèmes).
   - Règle d'armée Transe Guerrière : complète (les unités porteront
     armyRules: ["transe-guerriere"]).
   - Unités : complètes, 63 ici + 11 unités Ynnari dans ynnari.js
     (fichier auxiliaire débloqué par Dévots d'Ynnead).
   - Règle d'armée Chemins Disparates (Disparate Paths) : complète ; à mettre
     sur toutes les unités HARLEQUINS et YNNARI.
   - Restrictions « requires » : noms d'unités anglais supposés, à aligner
     sur les fiches quand elles seront saisies.

   Règles du moteur propres à cette faction : js/regles-etendues.js
   (Ligne gagnée, Optimisations de Corsaire, Seigneur de Guerre imposé,
   Travelling Players, héros épiques exclusifs, aptitudes d'armes ciblées,
   compteurs de pions en partie).

   Rappels de format (voir chaos-space-marines.js pour des exemples complets) :
     enhancements[].kind : "optimisation" (personnage) ou "amelioration"
                           (unité, jusqu'à 3 exemplaires dans l'armée)
   ========================================================= */

(() => {

Factions.register({
  id: "aeldari",
  name: "Aeldari",
  keyword: "Aeldari",   // mot-clé requis par défaut pour toute unité

  /* Règle d'armée : Transe Guerrière (Battle Focus)
     Noms des manœuvres : « Vifs comme le Vent » et « Se Replier » viennent
     des détachements ; les quatre autres sont traduits (à aligner sur le codex). */
  // Suivis en partie (js/regles-etendues.js)
  trackers: [
    {
      id: "pions-transe",
      type: "reserve",
      label: "Pions de Transe Guerrière",
      perPoints: [[0, 2], [2000, 4], [3000, 6]],
      refill: "round",
      bonus: [
        { detachment: "ost-de-guerre", rounds: [1], add: 1 },
        { enhancement: "stratege-intemporel", add: 1 }
      ],
      hint: "Les pions non dépensés sont perdus à la fin du round."
    },
    {
      id: "pions-temple-aspect",
      type: "unitTokens",
      label: "Pions de Temple Aspect",
      ability: "Aspect Shrine Token",
      per: 5,
      hint: "Une fois par bataille et par pion : un jet de touche ou de blessure devient un 6 non modifié."
    },
    {
      id: "drakolithe",
      type: "unitTokens",
      label: "Drakolithe",
      wargear: "drakolithe",
      hint: "Une fois par bataille et par pion : 1 blessure mortelle sur 3+ à une unité ennemie qui finit un mouvement à 8\" ou moins."
    }
  ],

  armyRules: [
    {
      id: "transe-guerriere",
      name: "Transe Guerrière",
      nameEn: "Battle Focus",
      text: [
        "Si la Faction d'Armée de votre armée est ASURYANI, au début de chaque round de bataille, vous recevez des pions de Transe Guerrière selon le format : 2 en Incursion (moins de 2 000 points), 4 en Force de Frappe (2 000 points), 6 en Offensive (3 000 points et plus).",
        "Chaque fois qu'un des déclencheurs ci-dessous se produit, vous pouvez dépenser 1 pion de Transe Guerrière pour que l'unité éligible concernée fasse cette manœuvre agile. Une unité est éligible si elle a cette aptitude et n'a pas déjà fait de manœuvre agile à cette phase. Sauf mention contraire, vous ne pouvez pas déclencher la même manœuvre agile plus d'une fois par phase. À la fin du round, les pions non dépensés sont perdus.",
        "__Vifs comme le Vent__ (Swift as the Wind) — Déclencheur : quand une unité éligible de votre armée est choisie pour faire un Mouvement Normal, une Avance ou une Retraite. Effet : jusqu'à la fin de la phase, ajoutez 2\" au Mouvement de ses figurines. Peut être déclenchée plusieurs fois par phase, par des unités différentes.",
        "__Ombres Fugaces__ (Flitting Shadows) — Déclencheur : quand une unité éligible de votre armée est choisie pour faire un Mouvement Normal, une Avance ou une Retraite, est placée sur le champ de bataille, ou déclare une charge. Effet : jusqu'à la fin du tour, les unités ennemies ne peuvent pas utiliser le stratagème Tir en État d'Alerte pour tirer sur elle.",
        "__Moteurs Stellaires__ (Star Engines) — Déclencheur : quand une unité VEHICLE éligible de votre armée est choisie pour faire une Avance. Effet : jusqu'à la fin du tour, ses armes de tir ont [ASSAUT].",
        "__Frappe Soudaine__ (Sudden Strike) — Déclencheur : quand une unité éligible de votre armée finit un mouvement de Charge. Effet : jusqu'à la fin du tour, chaque fois qu'une de ses figurines fait un mouvement d'engagement ou de consolidation, elle peut se déplacer de 6\" au lieu de 3\".",
        "__Opportunité Saisie__ (Opportunity Seized) — Déclencheur : quand une unité ennemie finit une Retraite. Effet : 1 unité éligible de votre armée (sauf TITANIC) qui a commencé la phase à portée d'engagement de cette unité ennemie peut faire un Mouvement Normal de D6+1\" maximum.",
        "__Se Replier__ (Fade Back) — Déclencheur : à la phase de Tir adverse, juste après qu'une unité ennemie a tiré. Effet : 1 unité éligible de votre armée (sauf TITANIC) touchée par une ou plusieurs de ces attaques peut faire un Mouvement Normal de D6+1\" maximum."
      ]
    },
    {
      // Pas d'effet en jeu : autorise les unités HARLEQUINS dans une armée Asuryani
      id: "chemins-disparates",
      name: "Chemins Disparates",
      nameEn: "Disparate Paths",
      text: [
        "Quand vous rassemblez votre armée, vous pouvez y inclure des unités HARLEQUINS, même si elles n'ont pas le mot-clé de faction ASURYANI. Sauf mention contraire, vous ne pouvez pas choisir HARLEQUINS ou YNNARI comme Faction d'Armée."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       OST BLINDÉ (Armoured Warhost)
       « Influence Directrice » = Guiding Presence (nom de la 1re planche)
       [ASSAUT] réservé aux VEHICLE : weaponAbilities[].to.
       ------------------------------------------------------- */
    {
      id: "ost-blinde",
      name: "Ost Blindé",
      cost: 1,
      dispositions: ["reconnaissance"],

      weaponAbilities: [{ type: "ranged", ability: "assault", to: [["Vehicle"]] }],

      rule: {
        name: null,
        text: [
          "Les armes de tir des unités AELDARI VEHICLE de votre armée ont [ASSAUT]."
        ]
      },

      enhancements: [
        {
          id: "guiding-presence",
          name: "Influence Directrice",
          cost: 25,
          kind: "optimisation",
          requires: [["Psyker"]],
          text: "Au début de votre phase de Tir, choisissez 1 unité AELDARI VEHICLE amie visible et à 6\" ou moins du porteur : jusqu'à la fin de la phase, ajoutez 1 aux jets de touche de ses attaques de tir."
        },
        {
          id: "pierre-esprit-de-raelyth",
          name: "Pierre-esprit de Raelyth",
          cost: 20,
          kind: "optimisation",
          requires: [["Psyker"]],
          text: "Tant que le porteur est à 3\" ou moins d'une ou plusieurs unités AELDARI VEHICLE amies, il a l'aptitude Agent Solitaire.\nÀ votre phase de Mouvement, au début ou à la fin du mouvement de l'unité du porteur, vous pouvez choisir 1 figurine AELDARI VEHICLE amie à 3\" ou moins de lui : elle récupère jusqu'à D3 PV perdus."
        }
      ],

      stratagems: [
        {
          id: "moteurs-vectoriels",
          name: "Moteurs Vectoriels",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, quand une unité AELDARI VEHICLE de votre armée Bat en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle reste éligible pour tirer à un tour où elle a Battu en Retraite."
        },
        {
          id: "protection-esoterique",
          name: "Protection Ésotérique",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, quand une unité AELDARI VEHICLE de votre armée subit une blessure mortelle.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, elle a l'aptitude Insensible à la Douleur 5+ contre les blessures mortelles."
        },
        {
          id: "vision-des-ames-blinde",          // même nom que dans Dévots d'Ynnead, effet différent
          name: "Vision des Âmes",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité AELDARI VEHICLE de votre armée est choisie pour tirer.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, pendant la résolution de ses attaques, vous pouvez relancer un jet de touche, un jet de blessure et un jet de Dégâts."
        }
      ]
    },

    /* -------------------------------------------------------
       OST ASPECT (Aspect Host)
       « Guerriers Aspects » = ASPECT WARRIORS, « Avatar de Khaine » = AVATAR OF KHAINE,
       « Autarque Sautevoie » = Autarch Wayleaper, « Mort Hurlante » = The Wailing Doom
       « Pion de Temple Aspect » : vient d'une autre règle (à confirmer)
       ------------------------------------------------------- */
    {
      id: "ost-aspect",
      name: "Ost Aspect",
      cost: 3,
      dispositions: ["priority-assets", "reconnaissance"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une unité ASPECT WARRIORS ou AVATAR OF KHAINE de votre armée est choisie pour tirer ou combattre, choisissez l'un des effets suivants jusqu'à la fin de la phase : relancer ses jets de touche de 1, ou relancer ses jets de blessure de 1."
        ]
      },

      enhancements: [
        {
          id: "aspect-du-meurtre",
          name: "Aspect du Meurtre",
          cost: 15,
          kind: "optimisation",
          requires: [["Autarch"], ["Autarch Wayleaper"]],
          text: "Les armes de mêlée du porteur ont [PRÉCISION], et ajoutez 1 à leurs Dégâts."
        },
        {
          id: "manteau-de-sagesse",
          name: "Manteau de Sagesse",
          cost: 20,
          kind: "optimisation",
          requires: [["Autarch"], ["Autarch Wayleaper"]],
          text: "Tant que le porteur mène une unité ASPECT WARRIORS, chaque fois que cette unité tire ou combat, elle bénéficie des deux effets de la règle du détachement (relance des jets de touche de 1 et des jets de blessure de 1)."
        },
        {
          id: "pierre-miroitante",
          name: "Pierre Miroitante",
          cost: 10,
          kind: "optimisation",
          requires: [["Autarch"], ["Autarch Wayleaper"]],
          text: "Tant que le porteur mène une unité ASPECT WARRIORS, chaque fois qu'une attaque de tir cible cette unité, soustrayez 1 au jet de blessure."
        },
        {
          id: "stratege-erudit",
          name: "Stratège Érudit",
          cost: 10,
          kind: "optimisation",
          requires: [["Autarch"], ["Autarch Wayleaper"]],
          text: "Tant que le porteur mène une unité ASPECT WARRIORS, ajoutez 1 à la CO des figurines de cette unité."
        }
      ],

      stratagems: [
        {
          id: "concentration-guerriere",
          name: "Concentration Guerrière",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité ASPECT WARRIORS ou AVATAR OF KHAINE de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, vous pouvez ignorer tout ou partie des modificateurs à la CC, à la CT, aux jets de touche, à la Force, à la Pénétration d'Armure et aux Dégâts de ses attaques."
        },
        {
          id: "jusqu-a-leur-dernier-souffle",
          name: "Jusqu'à leur Dernier Souffle",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité ASPECT WARRIORS ou AVATAR OF KHAINE de votre armée choisie pour cible.",
          effet: "Vous pouvez retirer 1 pion de Temple Aspect de votre unité. Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 (+1 si vous avez retiré un pion de Temple Aspect) : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "precision-surnaturelle",
          name: "Précision Surnaturelle",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité ASPECT WARRIORS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Vous pouvez retirer 1 pion de Temple Aspect de votre unité. Choisissez ensuite une des aptitudes suivantes (deux si vous avez retiré un pion) : [IGNORE LE COUVERT], [TOUCHES FATALES], [TOUCHES SOUTENUES 1]. Jusqu'à la fin de la phase, les armes de tir de ses figurines ont les aptitudes choisies."
        },
        {
          id: "ruine-ineluctable",
          name: "Ruine Inéluctable",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 figurine AVATAR OF KHAINE de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, son arme The Wailing Doom a une portée de 18\" et une caractéristique de Dégâts de 8."
        },
        {
          id: "sanctuaire-aeroporte",
          name: "Sanctuaire Aéroporté",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Fin de la phase de Combat.",
          cible: "1 unité ASURYANI de votre armée qui était éligible pour combattre à cette phase, qui n'est plus à portée d'engagement d'aucune unité ennemie et qui est entièrement à 6\" ou moins d'un TRANSPORT ami.",
          effet: "Elle peut embarquer dans ce TRANSPORT."
        },
        {
          id: "vengeance-de-khaine",
          name: "Vengeance de Khaine",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie (sauf MONSTER et VEHICLE) engagée avec une unité ASPECT WARRIORS ou AVATAR OF KHAINE de votre armée a été choisie pour Battre en Retraite.",
          cible: "Cette unité ASPECT WARRIORS ou AVATAR OF KHAINE.",
          effet: "Les figurines de l'unité ennemie doivent faire des tests de Fuite Désespérée, en soustrayant 1 au résultat si elle est Ébranlée."
        }
      ]
    },

    /* -------------------------------------------------------
       COTERIE DE CORSAIRES (Corsair Coterie)
       « Optimisations de Corsaire » : prises par des UNITÉS Anhrathe
       (pas seulement des personnages), chacune une seule fois dans l'armée.
       « Coureurs Mirages » = Shroud Runners
       ------------------------------------------------------- */
    {
      id: "coterie-de-corsaires",
      name: "Coterie de Corsaires",
      cost: 2,
      dispositions: ["priority-assets"],

      rule: {
        name: null,
        text: [
          "Tant qu'un pion objectif est sous votre contrôle, chaque fois qu'une unité ennemie finit un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge à portée de ce pion, lancez 1D6 : sur 2+, cette unité ennemie subit D3 blessures mortelles.",
          "Les unités ANHRATHE de votre armée ont l'aptitude suivante : à la fin d'une phase, si cette unité est à portée d'un pion objectif que vous contrôlez, ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase.",
          "Chaque fois que vous ajoutez une unité ANHRATHE à votre armée, elle peut recevoir jusqu'à 1 Optimisation de Corsaire payante. Chaque Optimisation de Corsaire incluse dans votre armée doit être unique."
        ]
      },

      enhancements: [
        {
          id: "archipillard",
          name: "Archipillard",
          cost: 35,
          kind: "corsaire",
          requires: [["Anhrathe"]],
          text: "Au début de la bataille, choisissez 1 figurine CHARACTER de l'unité du porteur. Elle a l'aptitude suivante :\n__Seigneur de la Duperie (Aura)__ : chaque fois que votre adversaire cible avec un stratagème une unité de son armée à 12\" ou moins de cette figurine, augmentez de 1 PC le coût de cette utilisation du stratagème."
        },
        {
          id: "infamie",
          name: "Infamie (Aura)",
          cost: 25,
          kind: "corsaire",
          requires: [["Anhrathe"]],
          text: "Tant qu'une unité ennemie est à 3\" ou moins de cette unité, soustrayez 1 à la CO de ses figurines (minimum 1)."
        },
        {
          id: "pierre-du-neant",
          name: "Pierre du Néant",
          cost: 15,
          kind: "corsaire",
          requires: [["Anhrathe", "Infantry"]],
          text: "Les figurines de cette unité ont une sauvegarde invulnérable de 5+."
        },
        {
          id: "pierre-des-voies-de-la-toile",
          name: "Pierre des Voies de la Toile",
          cost: 25,
          kind: "corsaire",
          requires: [["Anhrathe"]],
          usage: "une-fois-par-bataille",
          text: "Les figurines de cette unité ont l'aptitude Frappe en Profondeur. De plus, une fois par bataille, à la fin du tour adverse, si cette unité n'est à portée d'engagement d'aucune unité ennemie, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques."
        }
      ],

      stratagems: [
        {
          id: "dans-la-breche",
          name: "Dans la Brèche",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, juste après qu'une unité ANHRATHE de votre armée a détruit une ou plusieurs unités ennemies.",
          cible: "Cette unité ANHRATHE.",
          effet: "Après avoir résolu toutes ses attaques de tir, elle peut faire un Mouvement Normal de D6+1\" maximum."
        },
        {
          id: "embuscade-d-errants",
          name: "Embuscade d'Errants",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité RANGERS ou SHROUD RUNNERS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de tir de ses figurines ont [IGNORE LE COUVERT] et [TIR RAPIDE 1], et leur Pénétration d'Armure est améliorée de 1."
        },
        {
          id: "peine-vengeresse",
          name: "Peine Vengeresse",
          cp: 1,                       // coût absent de la capture : 1 PC supposé
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          cible: "1 unité AELDARI INFANTRY de votre armée dont une ou plusieurs figurines ont été détruites par ces attaques, ni Ébranlée ni à portée d'engagement d'une unité ennemie.",
          effet: "Elle peut faire un mouvement d'Élan : lancez 1D6 et ajoutez 1, ses figurines se déplacent d'autant de pouces au maximum et l'unité doit finir aussi près que possible de l'unité ennemie la plus proche (sauf AIRCRAFT). Ses figurines peuvent alors finir à portée d'engagement de cette unité ennemie."
        },
        {
          id: "ruse-letale",
          name: "Ruse Létale",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité AELDARI de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Battu en Retraite. Si c'est une unité ANHRATHE, choisissez aussi 1 unité ennemie à portée d'engagement de laquelle elle était au début de la phase, et lancez 6D6 : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle."
        },
        {
          id: "tenebres-et-tromperie",
          name: "Ténèbres et Tromperie",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité AELDARI INFANTRY de votre armée à portée d'un pion objectif que vous contrôlez, choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, ses figurines ont l'aptitude Discrétion, et votre unité ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins."
        },
        {
          id: "tribut-des-pirates",
          name: "Tribut des Pirates",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité AELDARI de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de blessure de 1. Si c'est une unité ANHRATHE, quand elle attaque une unité ennemie à portée d'un pion objectif, vous pouvez relancer le jet de blessure à la place."
        }
      ]
    },

    /* -------------------------------------------------------
       DÉVOTS D'YNNEAD (Devoted to Ynnead)
       Ouvre l'armée aux unités Ynnari du fichier ynnari.js (Yvraine, l'Yncarne,
       le Visarch et des unités drukhari). Yvraine ou l'Yncarne doit être
       Seigneur de Guerre (constraints : warlordOneOf).
       « Grand Prophète » = Farseer, « Archonte » = Archon, « Succube » = Succubus,
       « Tempête Surnaturelle » = Eldritch Storm
       « Psycharque » : nom anglais à confirmer
       ------------------------------------------------------- */
    {
      id: "devots-d-ynnead",
      name: "Dévots d'Ynnead",
      cost: 2,
      dispositions: ["priority-assets"],
      constraints: [{ type: "warlordOneOf", names: ["Yvraine", "The Yncarne"] }],

      // Débloque les unités Ynnari (fichier chargé à la demande, comme les démons des Emperor's Children)
      unlocks: ["Ynnari"],
      extraFiles: ["ynnari"],

      grantsKeywords: [
        { to: [["Asuryani"]], keywords: ["Ynnari"] }
      ],

      rule: {
        name: null,
        text: [
          "Vous pouvez inclure des unités YNNARI dans votre armée. Les unités ASURYANI de votre armée gagnent le mot-clé YNNARI. Votre armée doit inclure YVRAINE et/ou L'YNCARNE, et l'une d'elles doit être votre Seigneur de Guerre.",
          "À la fin de la phase de Tir adverse, si une ou plusieurs unités YNNARI de votre armée ont été détruites à cette phase, choisissez 1 unité YNNARI INFANTRY ou YNNARI MOUNTED de votre armée qui était à 6\" ou moins d'une de ces unités détruites : elle peut faire un Mouvement Normal de D6+1\" maximum.",
          "Une fois par tour, quand une unité YNNARI de votre armée fait la manœuvre agile Se Replier, elle peut faire un mouvement d'Élan de D6+1\" maximum au lieu d'un Mouvement Normal.",
          "(Fin de la règle à vérifier : le texte était peut-être coupé sur la capture.)"
        ]
      },

      enhancements: [
        {
          id: "vigueur-empruntee",
          name: "Vigueur Empruntée",
          cost: 10,
          kind: "optimisation",
          requires: [["Archon"]],
          text: "Ajoutez 2 aux Attaques des armes de mêlée du porteur."
        },
        {
          id: "regard-d-ynnead",
          name: "Regard d'Ynnead",
          cost: 15,
          kind: "optimisation",
          requires: [["Farseer"]],
          text: "L'arme Eldritch Storm du porteur a [BLESSURES DÉVASTATRICES]."
        },
        {
          id: "force-morbide",
          name: "Force Morbide",
          cost: 15,
          kind: "optimisation",
          requires: [["Succubus"]],
          text: "Chaque fois que le porteur fait une attaque de mêlée, vous pouvez relancer le jet de blessure."
        },
        {
          id: "tempete-de-murmures",
          name: "Tempête de Murmures",
          cost: 10,
          kind: "optimisation",
          requires: [["Ynnari"]],          // « Psycharque uniquement » : à remplacer par le nom anglais de l'unité
          text: "À votre phase de Tir, après que le porteur a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ses attaques : elle doit faire un test d'Ébranlement."
        }
      ],

      stratagems: [
        {
          id: "drap-mortuaire",
          name: "Drap Mortuaire",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une unité YNNARI de votre armée a été détruite alors qu'elle était à portée d'un pion objectif qu'elle contrôlait à la phase précédente.",
          cible: "Ce pion objectif.",
          effet: "Il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        },
        {
          id: "emissaires-d-ynnead",
          name: "Émissaires d'Ynnead",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité YNNARI INFANTRY de votre armée a choisi ses cibles.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, relancez ses jets de touche de 1. Si elle est en dessous de son effectif initial, vous pouvez relancer ses jets de touche à la place."
        },
        {
          id: "la-mort-repond-a-la-mort",
          name: "La Mort répond à la Mort",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Fin de la phase de Tir adverse.",
          cible: "1 unité YNNARI de votre armée (sauf WRAITH CONSTRUCT) dont une ou plusieurs figurines ont été détruites à cette phase.",
          effet: "Elle peut tirer comme si c'était votre phase de Tir."
        },
        {
          id: "ouvrir-le-voile",
          name: "Ouvrir le Voile",
          cp: 2,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité YNNARI de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, ne la retirez pas tout de suite : elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "resistance-macabre",
          name: "Résistance Macabre",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité YNNARI INFANTRY ou YNNARI MOUNTED de votre armée (sauf WRAITH CONSTRUCT) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de blessure."
        },
        {
          id: "vision-des-ames",
          name: "Vision des Âmes",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité YNNARI de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de tir de ses figurines ont [TOUCHES FATALES] et [IGNORE LE COUVERT]."
        }
      ]
    },

    /* -------------------------------------------------------
       PILLARDS SORCIERS (Eldritch Raiders)
       Optimisations de Corsaire : kind "corsaire" (comme la Coterie de Corsaires).
       « Corsaires Neanti » = CORSAIR VOIDSCARRED, « Coureurs Mirages » = SHROUD RUNNERS
       « Croc Stellaire » = STARFANGS
       ------------------------------------------------------- */
    {
      id: "pillards-sorciers",
      name: "Pillards Sorciers",
      cost: 2,
      dispositions: ["purge-the-foe"],

      rule: {
        name: null,
        text: [
          "Les unités AELDARI de votre armée sont éligibles pour déclarer une charge à un tour où elles ont Avancé. De plus, chaque fois qu'une unité ANHRATHE, RANGERS ou SHROUD RUNNERS de votre armée Avance, vous pouvez relancer le jet d'Avance.",
          "Chaque fois que vous ajoutez une unité ANHRATHE à votre armée, elle peut recevoir jusqu'à 1 Optimisation de Corsaire payante. Chaque Optimisation de Corsaire incluse dans votre armée doit être unique."
        ]
      },

      enhancements: [
        {
          id: "celerite-de-l-assaut",
          name: "Célérité de l'Assaut",
          cost: 20,
          kind: "corsaire",
          requires: [["Anhrathe"]],
          text: "Les armes de mêlée des figurines de cette unité ont [LANCE]."
        },
        {
          id: "injections-surrenales",
          name: "Injections Surrénales",
          cost: 20,
          kind: "corsaire",
          requires: [["Anhrathe", "Infantry"]],
          text: "Cette unité peut faire la manœuvre agile Se Replier sans dépenser de pion de Transe Guerrière. Elle peut la faire même si d'autres unités l'ont faite à la même phase, et cela n'empêche pas d'autres unités de faire la même manœuvre agile à cette phase."
        },
        {
          id: "munitions-exotiques",
          name: "Munitions Exotiques",
          cost: 15,
          kind: "corsaire",
          requires: [["Anhrathe"]],
          text: "Les armes de tir des figurines de cette unité ont [ANTI-MONSTRE 5+] et [ANTI-VÉHICULE 5+]."
        },
        {
          id: "prince-pirate",
          name: "Prince Pirate",
          cost: 15,
          kind: "corsaire", allowEpic: true,
          requires: [["Prince Yriel"]],
          text: "Chaque fois que vous dépensez un pion de Transe Guerrière pour que l'unité du porteur fasse une manœuvre agile, lancez 1D6 : sur 3+, vous gagnez 1 pion de Transe Guerrière."
        }
      ],

      stratagems: [
        {
          id: "butin-des-pillards",
          name: "Butin des Pillards",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "commandement" }],
          quand: "Phase de Commandement.",
          cible: "1 unité ANHRATHE de votre armée à portée d'engagement d'une ou plusieurs unités ennemies.",
          effet: "Jusqu'au début de la prochaine phase de Commandement, ajoutez 1 à la CO des figurines de votre unité."
        },
        {
          id: "l-exemple-d-yriel",
          name: "L'Exemple d'Yriel",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité AELDARI INFANTRY de votre armée (sauf WRAITH CONSTRUCT) choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, ses figurines ont l'aptitude Insensible à la Douleur 5+."
        },
        {
          id: "nulle-proie-hors-d-atteinte",
          name: "Nulle Proie hors d'Atteinte",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité ANHRATHE, RANGERS ou SHROUD RUNNERS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, si la Force de l'attaque est inférieure à la plus haute Endurance des figurines de l'unité ciblée, ajoutez 1 au jet de blessure."
        },
        {
          id: "repli-et-renforts",
          name: "Repli et Renforts",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité ANHRATHE de votre armée qui n'est à portée d'engagement d'aucune unité ennemie.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques. Si elle est en dessous de son effectif initial, ramenez-y toutes ses figurines détruites (sauf CHARACTER)."
        },
        {
          id: "tir-handicapant",
          name: "Tir Handicapant",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "charge" }],
          quand: "Début de la phase de Charge adverse.",
          cible: "1 unité RANGERS, SHROUD RUNNERS ou STARFANGS de votre armée.",
          effet: "Choisissez 1 unité ennemie (sauf TITANIC) visible et à 36\" ou moins de votre unité. Jusqu'à la fin de la phase, chaque fois qu'elle déclare une charge, soustrayez 2 au jet de Charge (non cumulable avec d'autres modificateurs négatifs à ce jet)."
        },
        {
          id: "tueurs-impitoyables",
          name: "Tueurs Impitoyables",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité CORSAIR VOIDSCARRED de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, ajoutez 1 aux Dégâts des attaques de ses figurines."
        }
      ]
    },

    /* -------------------------------------------------------
       REPRÉSENTATION FATIDIQUE (Fateful Performance)
       Mêmes noms d'unités que Fantômes de la Toile.
       ------------------------------------------------------- */
    {
      id: "representation-fatidique",
      name: "Représentation Fatidique",
      cost: 1,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une unité HARLEQUINS de votre armée fait un mouvement de Charge, elle peut traverser les figurines ennemies."
        ]
      },

      enhancements: [
        {
          id: "gaze-de-brume-representation",
          name: "Gaze de Brume",
          cost: 20,
          kind: "optimisation",
          requires: [["Shadowseer"]],
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont l'aptitude Infiltrateurs."
        },
        {
          id: "un-pied-dans-le-futur",
          name: "Un Pied dans le Futur",
          cost: 15,
          kind: "optimisation",
          requires: [["Troupe Master"]],
          text: "Vous pouvez relancer les jets de Charge de l'unité du porteur."
        }
      ],

      stratagems: [
        {
          id: "feinte-piegeuse",
          name: "Feinte Piégeuse",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité HARLEQUINS INFANTRY non engagée de votre armée.",
          cible: "Cette unité HARLEQUINS INFANTRY.",
          effet: "Elle peut faire un Mouvement Normal de D3+3\" maximum."
        },
        {
          id: "la-chute-des-heros-representation",   // même nom que dans Fantômes de la Toile
          name: "La Chute des Héros",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, quand une unité ennemie cible une unité HARLEQUINS de votre armée.",
          cible: "Cette unité HARLEQUINS.",
          effet: "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (au premier des deux)."
        },
        {
          id: "sortie-de-scene-representation",      // même nom que dans Fantômes de la Toile
          name: "Sortie de Scène",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité HARLEQUINS non engagée de votre armée.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."
        }
      ]
    },

    /* -------------------------------------------------------
       FANTÔMES DE LA TOILE (Ghosts of the Webway)
       « Arlequins » = HARLEQUINS, « Troupe » = TROUPE,
       « Bouffon Tragique » = Death Jester, « Prophète de l'Ombre » = Shadowseer,
       « Coryphée » = Troupe Master
       3 exemplaires des trois personnages : travellingPlayersMax.
       CO 2 des Troupes : rappelée dans la règle (non recalculée).
       ------------------------------------------------------- */
    {
      id: "fantomes-de-la-toile",
      name: "Fantômes de la Toile",
      cost: 2,
      dispositions: ["disruption"],
      travellingPlayersMax: 3,

      grantsKeywords: [
        { to: [["Troupe"]], keywords: ["Battleline"] }
      ],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une figurine HARLEQUINS de votre armée fait un mouvement de Charge, elle peut traverser les figurines ennemies.",
          "Les unités TROUPE de votre armée ont une CO de 2 et gagnent le mot-clé BATTLELINE (Ligne).",
          "Vous pouvez inclure jusqu'à 3 exemplaires de chacune des unités suivantes : DEATH JESTER, SHADOWSEER, TROUPE MASTER.",
          "Quand vous rassemblez votre armée, vous pouvez choisir une figurine HARLEQUINS CHARACTER amie pour être votre Seigneur de Guerre."
        ]
      },

      enhancements: [
        {
          id: "farce-du-meurtrier",
          name: "Farce du Meurtrier",
          cost: 20,
          kind: "optimisation",
          requires: [["Death Jester"]],
          text: "Chaque fois que le porteur attaque une unité en dessous de la moitié de son effectif, chaque touche réussie est une Touche Critique."
        },
        {
          id: "gaze-de-brume-fantomes",
          name: "Gaze de Brume",
          cost: 15,
          kind: "optimisation",
          requires: [["Shadowseer"]],
          text: "Tant que le porteur mène une unité, les figurines de cette unité ont l'aptitude Infiltrateurs."
        },
        {
          id: "masque-des-secrets",
          name: "Masque des Secrets",
          cost: 15,
          kind: "optimisation",
          requires: [["Harlequins"]],
          text: "Chaque fois qu'une unité ennemie (sauf MONSTER et VEHICLE) à portée d'engagement du porteur Bat en Retraite, ses figurines doivent faire des tests de Fuite Désespérée, en soustrayant 1 au résultat si elle est Ébranlée."
        },
        {
          id: "serpentin-de-cegorach",
          name: "Serpentin de Cegorach",
          cost: 25,
          kind: "optimisation",
          requires: [["Troupe Master"]],
          text: "Chaque fois que l'unité du porteur finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement et lancez 1D6 pour chaque figurine de l'unité du porteur à portée d'engagement de celle-ci : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle (6 au maximum)."
        }
      ],

      stratagems: [
        {
          id: "danse-sanglante",
          name: "Danse Sanglante",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "charge" }],
          quand: "Fin de la phase de Charge adverse.",
          cible: "1 unité HARLEQUINS INFANTRY ou HARLEQUINS MOUNTED de votre armée à 6\" ou moins d'une ou plusieurs unités ennemies qu'elle pourrait charger.",
          effet: "Elle peut déclarer une charge contre une ou plusieurs de ces unités ennemies et la résoudre, mais ne reçoit pas les bonus de charge à ce tour."
        },
        {
          id: "fuite-moqueuse",
          name: "Fuite Moqueuse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité HARLEQUINS de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."
        },
        {
          id: "la-chute-des-heros",
          name: "La Chute des Héros",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité HARLEQUINS de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "mort-simulee",
          name: "Mort Simulée",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une figurine HARLEQUINS CHARACTER de votre armée a été détruite.",
          cible: "Cette figurine.",
          effet: "À la fin de la phase, replacez-la sur le champ de bataille aussi près que possible de l'endroit où elle a été détruite et hors de portée d'engagement de toute unité ennemie, avec la moitié de ses PV de départ.",
          restrictions: "Une seule fois par bataille pour chaque personnage."
        },
        {
          id: "replique-du-trompeur",
          name: "Réplique du Trompeur",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité TROUPE de votre armée.",
          cible: "Cette unité TROUPE.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        },
        {
          id: "sortie-de-scene",
          name: "Sortie de Scène",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité HARLEQUINS de votre armée qui n'est à portée d'engagement d'aucune unité ennemie.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."
        }
      ]
    },

    /* -------------------------------------------------------
       OST DE BATAILLE DE GARDIENS (Guardian Battlehost)
       « Vengeurs » = DIRE AVENGERS, « Gardiens » = GUARDIANS,
       « Gardiens de Choc » = STORM GUARDIANS, « Armes d'Appui » = SUPPORT WEAPONS,
       « Marcheurs de Guerre » = WAR WALKERS
       ------------------------------------------------------- */
    {
      id: "ost-de-bataille-de-gardiens",
      name: "Ost de Bataille de Gardiens",
      cost: 2,
      dispositions: ["take-and-hold"],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une figurine DIRE AVENGERS, GUARDIANS, SUPPORT WEAPONS ou WAR WALKERS de votre armée attaque, si son unité ou l'unité ciblée est à portée d'un pion objectif, ajoutez 1 au jet de touche."
        ]
      },

      enhancements: [
        {
          id: "souffle-de-vaul",
          name: "Souffle de Vaul",
          cost: 10,
          kind: "optimisation",
          requires: [["Asuryani"]],
          text: "Tant que le porteur mène une unité STORM GUARDIANS, vous pouvez relancer les jets du nombre d'attaques de ses flamers et les jets de Dégâts de ses fusion guns."
        },
        {
          id: "champion-du-vaisseau-monde",
          name: "Champion du Vaisseau-monde",
          cost: 25,
          kind: "optimisation",
          requires: [["Asuryani"]],
          text: "Le porteur a une CO de 5."
        },
        {
          id: "chemin-etherique-de-la-toile",
          name: "Chemin Éthérique de la Toile",
          cost: 30,
          kind: "optimisation",
          requires: [["Asuryani"]],
          text: "À l'étape de Déclaration des Formations de Bataille, choisissez jusqu'à 2 unités GUARDIANS de votre armée : elles ont l'aptitude Infiltrateurs."
        },
        {
          id: "protecteur-des-voies",
          name: "Protecteur des Voies",
          cost: 20,
          kind: "optimisation",
          requires: [["Asuryani"]],
          usage: "une-fois-par-round",
          text: "Une fois par round, tant que le porteur mène une unité DIRE AVENGERS ou GUARDIANS, vous pouvez cibler cette unité avec le stratagème Tir en État d'Alerte pour 0 PC. Elle touche alors sur un jet non modifié de 5+, ou de 4+ si elle est à portée d'un pion objectif."
        }
      ],

      stratagems: [
        {
          id: "attaque-propice",
          name: "Attaque Propice",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité STORM GUARDIANS de votre armée pas encore choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin du tour, quand elle Avance, ne lancez pas de dé : elle avance de 6\". Elle est éligible pour tirer à un tour où elle a Avancé."
        },
        {
          id: "lames-d-asuryan",
          name: "Lames d'Asuryan",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité DIRE AVENGERS ou GUARDIANS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de tir de ses figurines ont [PISTOLET]."
        },
        {
          id: "le-cout-de-la-victoire",
          name: "Le Coût de la Victoire",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité GUARDIANS de votre armée qui n'est à portée d'engagement d'aucune unité ennemie.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques. Ramenez-y toutes ses figurines détruites."
        },
        {
          id: "relais-de-bouclier",
          name: "Relais de Bouclier",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité DIRE AVENGERS ou GUARDIANS de votre armée à portée d'un pion objectif et choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de blessure."
        },
        {
          id: "salves-protectrices",
          name: "Salves Protectrices",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité DIRE AVENGERS ou GUARDIANS de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité ennemie à portée d'un pion objectif, vous pouvez relancer le jet de blessure."
        },
        {
          id: "vengeance-de-vaul",
          name: "Vengeance de Vaul",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a détruit une unité DIRE AVENGERS ou GUARDIANS de votre armée et a fini ses attaques.",
          cible: "1 unité WAR WALKERS de votre armée.",
          effet: "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible.",
          restrictions: "Une seule fois par round."
        }
      ]
    },

    /* -------------------------------------------------------
       VOIE DE L'ERRANT (Path of the Outcast)
       « Coureurs Mirages » = SHROUD RUNNERS
       ------------------------------------------------------- */
    {
      id: "voie-de-l-errant",
      name: "Voie de l'Errant",
      cost: 1,
      dispositions: ["reconnaissance"],

      rule: {
        name: null,
        text: [
          "Quand une unité RANGERS ou SHROUD RUNNERS de votre armée est choisie pour tirer, les unités ennemies ont +6\" en portée de détection jusqu'à ce que cette unité ait fini de tirer."
        ]
      },

      enhancements: [
        {
          id: "oeil-de-l-assassin",
          name: "Œil de l'Assassin",
          cost: 15,
          kind: "amelioration",
          requires: [["Rangers"], ["Shroud Runners"]],
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir qui cible une unité CHARACTER, améliorez de 1 la Pénétration d'Armure de l'attaque."
        },
        {
          id: "tireurs-d-elite-camoufles",
          name: "Tireurs d'Élite Camouflés",
          cost: 10,
          kind: "amelioration",
          requires: [["Rangers"]],
          text: "Les attaques de tir de cette unité ne l'empêchent pas d'être cachée."
        }
      ],

      stratagems: [
        {
          id: "nomades-du-chemin-cache",
          name: "Nomades du Chemin Caché",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité RANGERS ou SHROUD RUNNERS de votre armée a tiré.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de D6\" maximum. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge ni pour embarquer dans un TRANSPORT."
        },
        {
          id: "repousser-le-voile",
          name: "Repousser le Voile",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité RANGERS ou SHROUD RUNNERS de votre armée a tiré.",
          cible: "Cette unité.",
          effet: "Choisissez 1 unité ennemie touchée par ces attaques : elle a +6\" en portée de détection."
        },
        {
          id: "suppression-surnaturelle",
          name: "Suppression Surnaturelle",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité RANGERS ou SHROUD RUNNERS de votre armée a tiré.",
          cible: "Cette unité.",
          effet: "Choisissez 1 unité ennemie touchée par ces attaques : elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat si une ou plusieurs de ses figurines ont été détruites par ces attaques."
        }
      ]
    },

    /* ------------------------------------------------------- */
    /* CONSEIL DES PRESCIENTS (Seer Council)
       « Psyker Asuryani » = ASURYANI PSYKER, « Châsse Fantôme » = WRAITH CONSTRUCT */
    {
      id: "conseil-des-prescients",
      name: "Conseil des Prescients",
      cost: 2,
      dispositions: ["priority-assets"],

      tracker: {
        id: "des-de-destin",
        type: "reserve",
        label: "Dés de Destin",
        perPoints: [[0, 3], [2000, 6], [3000, 9]],
        refill: "bataille",
        debutRound: "Au début du premier round : lancer les Dés de Destin et les garder de côté.",
        hint: "Chaque dé dépensé réduit de 1 PC le stratagème de sa valeur (1 Pressentiment d'Effroi, 2 Prévenu, 3 Vérité Dévoilée, 4 Sort Inéluctable, 5 Fureur d'Isha, 6 Bouclier Psychique)."
      },

      rule: {
        name: "Dés de Destin",
        text: [
          "Au début du premier round de bataille, générez 6 Dés de Destin (3 en format Incursion, 9 en format Offensive) : lancez-les et gardez-les dans votre réserve.",
          "Chaque Dé de Destin peut être dépensé pour réduire de 1 PC le coût du stratagème qui correspond à sa valeur :",
          "1 : Pressentiment d'Effroi",
          "2 : Prévenu",
          "3 : Vérité Dévoilée",
          "4 : Sort Inéluctable",
          "5 : Fureur d'Isha",
          "6 : Bouclier Psychique"
        ]
      },

      enhancements: [
        {
          id: "oeil-lucide",
          name: "Œil Lucide",
          cost: 30,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker"]],
          text: "À votre phase de Commandement, vous pouvez ajouter 1 à la valeur d'un Dé de Destin de votre réserve, ou lui soustraire 1."
        },
        {
          id: "runes-de-protection",
          name: "Runes de Protection",
          cost: 25,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker"]],
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont l'aptitude Insensible à la Douleur 4+ contre les blessures mortelles, les attaques psychiques et les Blessures Critiques infligées par des attaques avec [BLESSURES DÉVASTATRICES]."
        },
        {
          id: "pierre-de-fureur-surnaturelle",
          name: "Pierre de Fureur Surnaturelle",
          cost: 15,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker"]],
          text: "Ajoutez 12\" à la portée des armes [PSYCHIQUE] du porteur."
        },
        {
          id: "torque-de-morai-heg",
          name: "Torque de Morai-Heg",
          cost: 20,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, quand votre adversaire cible avec un stratagème une unité de son armée à 12\" ou moins du porteur, vous pouvez augmenter de 1 PC le coût de ce stratagème."
        }
      ],

      stratagems: [
        {
          id: "pressentiment-d-effroi",
          name: "Pressentiment d'Effroi",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "commandement" }],
          quand: "Phase de Commandement (la vôtre ou celle de l'adversaire). Dé de Destin : 1.",
          cible: "1 figurine ASURYANI PSYKER de votre armée.",
          effet: "Choisissez 1 unité ennemie visible et à 18\" ou moins de cette figurine : elle doit faire un test d'Ébranlement en soustrayant 1 au résultat."
        },
        {
          id: "prevenu",
          name: "Prévenu",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles. Dé de Destin : 2.",
          cible: "1 unité ASURYANI INFANTRY de votre armée (sauf WRAITH CONSTRUCT) choisie pour cible, à 9\" ou moins d'une ou plusieurs figurines ASURYANI PSYKER amies.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche et 1 au jet de blessure."
        },
        {
          id: "verite-devoilee",
          name: "Vérité Dévoilée",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement. Dé de Destin : 3.",
          cible: "1 unité ASURYANI INFANTRY de votre armée (sauf WRAITH CONSTRUCT) pas encore choisie pour se déplacer à cette phase, qui n'a pas été placée sur le champ de bataille à cette phase et qui est à 9\" ou moins d'une ou plusieurs figurines ASURYANI PSYKER amies.",
          effet: "Retirez votre unité du champ de bataille et placez-la en Réserves Stratégiques. Elle a l'aptitude Frappe en Profondeur et doit arriver plus tard à cette même phase (y compris pendant votre premier tour)."
        },
        {
          id: "sort-ineluctable",
          name: "Sort Inéluctable",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir. Dé de Destin : 4.",
          cible: "1 unité ASURYANI INFANTRY de votre armée (sauf WRAITH CONSTRUCT) à 9\" ou moins d'une figurine ASURYANI PSYKER amie et pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, ses armes de tir ont [IGNORE LE COUVERT], et chaque fois qu'une de ses attaques inflige une Blessure Critique, améliorez de 1 la Pénétration d'Armure de cette attaque."
        },
        {
          id: "fureur-d-isha",
          name: "Fureur d'Isha",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une figurine ASURYANI PSYKER de votre armée. Dé de Destin : 5.",
          cible: "Cette figurine ASURYANI PSYKER.",
          effet: "Lancez 6D6 : pour chaque 3+, cette unité ennemie subit 1 blessure mortelle."
        },
        {
          id: "bouclier-psychique",
          name: "Bouclier Psychique",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles. Dé de Destin : 6.",
          cible: "1 unité ASURYANI INFANTRY de votre armée (sauf WRAITH CONSTRUCT) choisie pour cible, à 9\" ou moins d'une ou plusieurs figurines ASURYANI PSYKER amies.",
          effet: "Jusqu'à la fin de la phase, votre unité ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins d'elle."
        }
      ]
    },

    /* -------------------------------------------------------
       LES FILS DU SERPENT (Serpent's Brood)
       Mêmes noms que Fantômes de la Toile. « Canon hurleur » = shrieker cannon.
       [TOUCHES SOUTENUES 1] réservées aux HARLEQUINS MOUNTED et VEHICLE :
       weaponAbilities[].to. 3 exemplaires des personnages : travellingPlayersMax.
       ------------------------------------------------------- */
    {
      id: "les-fils-du-serpent",
      name: "Les Fils du Serpent",
      cost: 2,
      dispositions: ["purge-the-foe"],

      weaponAbilities: [{ ability: "sustained-hits:1", to: [["Harlequins", "Mounted"], ["Harlequins", "Vehicle"]] }],
      travellingPlayersMax: 3,

      grantsKeywords: [
        { to: [["Troupe"]], keywords: ["Battleline"] }
      ],

      rule: {
        name: null,
        text: [
          "Les armes des figurines HARLEQUINS MOUNTED et HARLEQUINS VEHICLE de votre armée ont [TOUCHES SOUTENUES 1].",
          "Chaque fois qu'une unité HARLEQUINS de votre armée débarque d'un TRANSPORT, jusqu'à la fin du tour, ses armes ont [TOUCHES SOUTENUES 1].",
          "Les unités TROUPE de votre armée gagnent le mot-clé BATTLELINE (Ligne), et leurs figurines ont une CO de 2.",
          "Vous pouvez inclure jusqu'à 3 exemplaires de chacune des unités suivantes : DEATH JESTER, SHADOWSEER, TROUPE MASTER.",
          "Quand vous rassemblez votre armée, vous pouvez choisir une figurine HARLEQUINS CHARACTER amie pour être votre Seigneur de Guerre."
        ]
      },

      enhancements: [
        {
          id: "atours-de-la-mue",
          name: "Atours de la Mue",
          cost: 25,
          kind: "optimisation",
          requires: [["Shadowseer"]],
          text: "Après le déploiement des deux armées, choisissez jusqu'à 3 unités HARLEQUINS de votre armée et redéployez-les. Vous pouvez alors les placer en Réserves Stratégiques, quel que soit le nombre d'unités qui y sont déjà."
        },
        {
          id: "clef-des-fantomes",
          name: "Clef des Fantômes",
          cost: 20,
          kind: "optimisation",
          requires: [["Harlequins"]],
          excludes: ["Solitaire"],
          text: "Les figurines de l'unité du porteur ont l'aptitude Éclaireurs 6\"."
        },
        {
          id: "plainte-du-tisseur",
          name: "Plainte du Tisseur",
          cost: 20,
          kind: "optimisation",
          requires: [["Troupe Master"]],
          text: "Ajoutez 3 à la Force et 1 aux Attaques des armes de mêlée du porteur."
        },
        {
          id: "regard-perfide",
          name: "Regard Perfide",
          cost: 10,
          kind: "optimisation",
          requires: [["Death Jester"]],
          text: "Quand vous utilisez l'aptitude Amusement Cruel du porteur, vous pouvez choisir deux aptitudes pour son shrieker cannon au lieu d'une seule."
        }
      ],

      stratagems: [
        {
          id: "anneaux-du-tisseur",
          name: "Anneaux du Tisseur",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "combat" }],
          quand: "Fin de votre phase de Combat.",
          cible: "1 unité HARLEQUINS MOUNTED de votre armée qui était éligible pour combattre à cette phase.",
          effet: "Si elle n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal. Sinon, elle peut faire une Retraite de 6\" maximum."
        },
        {
          id: "bond-aerien",
          name: "Bond Aérien",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité HARLEQUINS MOUNTED ou HARLEQUINS VEHICLE de votre armée.",
          effet: "Si elle n'est à portée d'engagement d'aucune unité ennemie, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques."
        },
        {
          id: "colere-venimeuse",
          name: "Colère Venimeuse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité HARLEQUINS VEHICLE de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Après qu'elle a tiré, si elle n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de 6\" maximum. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge."
        },
        {
          id: "crochets-des-fils",
          name: "Crochets des Fils",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Début de la phase de Combat.",
          cible: "1 unité TROUPE de votre armée.",
          effet: "Jusqu'à la fin de la phase, quand vous utilisez son aptitude Danse de la Mort, vous pouvez choisir trois aptitudes au lieu d'une seule."
        },
        {
          id: "foulee-fulgurante",
          name: "Foulée Fulgurante",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité HARLEQUINS de votre armée.",
          effet: "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge à un tour où elle a Avancé."
        },
        {
          id: "foulee-tramee",
          name: "Foulée Tramée",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité HARLEQUINS INFANTRY de votre armée.",
          cible: "Cette unité HARLEQUINS INFANTRY.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        }
      ]
    },

    /* -------------------------------------------------------
       CONCLAVE SPECTRAL (Spirit Conclave)
       « Châsse Fantôme » = Wraith Construct, « Spirite » = Spiritseer,
       « Seigneur Fantôme » = Wraithlord, « Chevalier Fantôme » = Wraithknight,
       « Guerriers Fantômes » = Wraithblades, « Gardes Fantômes » = Wraithguard
       Noms anglais à aligner sur les fiches d'unités quand elles seront saisies.
       ------------------------------------------------------- */
    {
      id: "conclave-spectral",
      name: "Conclave Spectral",
      cost: 2,
      dispositions: ["take-and-hold"],

      grantsKeywords: [
        { to: [["Wraithblades"], ["Wraithguard"]], keywords: ["Battleline"] }
      ],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une figurine PSYKER ASURYANI de votre armée est détruite, l'unité attaquante gagne 1 pion de Mort Vengeresse. Chaque fois qu'une figurine WRAITH CONSTRUCT de votre armée attaque une unité qui a 1 pion de Mort Vengeresse ou plus, ajoutez 1 au jet de touche et 1 au jet de blessure.",
          "__Aura__ : tant qu'une unité WRAITHLORD, WRAITHBLADES ou WRAITHGUARD de votre armée est à 12\" ou moins d'une figurine PSYKER ASURYANI amie, elle bénéficie de la Transe Guerrière.",
          "Les unités WRAITHBLADES et WRAITHGUARD de votre armée gagnent le mot-clé BATTLELINE (Ligne)."
        ]
      },

      enhancements: [
        {
          id: "devoir-superieur",
          name: "Devoir Supérieur",
          cost: 25,
          kind: "optimisation",
          requires: [["Spiritseer"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, quand une unité ennemie finit un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins du porteur, l'unité du porteur peut faire un Mouvement Normal de 6\" maximum."
        },
        {
          id: "lueur-de-clarte",
          name: "Lueur de Clarté",
          cost: 30,
          kind: "optimisation",
          requires: [["Spiritseer"]],
          text: "À votre phase de Commandement, choisissez 1 unité WRAITH CONSTRUCT amie à 12\" ou moins du porteur. Jusqu'au début de votre prochaine phase de Commandement, ajoutez 1 à la CO de ses figurines INFANTRY et 3 à la CO de ses figurines MONSTER."
        },
        {
          id: "rune-des-brumes",
          name: "Rune des Brumes",
          cost: 10,
          kind: "optimisation",
          requires: [["Spiritseer"]],
          text: "À votre phase de Commandement, choisissez 1 unité WRAITH CONSTRUCT amie à 12\" ou moins du porteur. Jusqu'au début de votre prochaine phase de Commandement, elle a le Bénéfice du Couvert, sauf contre les attaques de figurines à moins de 18\"."
        },
        {
          id: "sceptre-de-kurnous",
          name: "Sceptre de Kurnous",
          cost: 15,
          kind: "optimisation",
          requires: [["Spiritseer"]],
          text: "À votre phase de Commandement, choisissez 1 unité WRAITH CONSTRUCT amie (sauf TITANIC) à 12\" ou moins du porteur. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une de ses figurines inflige une Blessure Critique, cette attaque a [PRÉCISION]."
        }
      ],

      stratagems: [
        {
          id: "armure-de-moelle-spectrale",
          name: "Armure de Moelle Spectrale",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité WRAITH CONSTRUCT de votre armée (sauf TITANIC) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque est allouée à une figurine de votre unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque."
        },
        {
          id: "lames-de-l-au-dela",
          name: "Lames de l'Au-delà",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité WRAITHBLADES, WRAITHLORD ou WRAITHKNIGHT de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de mêlée de ses figurines ont [BLESSURES DÉVASTATRICES]."
        },
        {
          id: "marqueur-spirituel",
          name: "Marqueur Spirituel",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Début de votre phase de Mouvement.",
          cible: "1 unité WRAITHGUARD ou WRAITHBLADES de votre armée à portée d'un pion objectif que vous contrôlez.",
          effet: "Ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        },
        {
          id: "oeil-du-prescient",
          name: "Œil du Prescient",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 figurine PSYKER ASURYANI de votre armée, et 1 unité WRAITH CONSTRUCT de votre armée à 12\" ou moins d'elle et pas encore choisie pour attaquer à cette phase.",
          effet: "Choisissez 1 unité ennemie visible du PSYKER. Jusqu'à la fin de la phase, quand l'unité WRAITH CONSTRUCT attaque cette unité ennemie, vous pouvez ignorer tout ou partie des modificateurs à la Pénétration d'Armure et aux Dégâts de ses attaques."
        },
        {
          id: "pas-broyeurs",
          name: "Pas Broyeurs",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge, juste après qu'une unité WRAITHBLADES, WRAITHLORD ou WRAITHKNIGHT de votre armée a fini un mouvement de Charge.",
          cible: "Cette unité.",
          effet: "Choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 par figurine WRAITHBLADES de votre unité (4D6 pour un WRAITHLORD, 6D6 pour un WRAITHKNIGHT) : pour chaque 3+, cette unité ennemie subit 1 blessure mortelle."
        },
        {
          id: "pont-spirituel",
          name: "Pont Spirituel",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité WRAITHBLADES, WRAITHGUARD ou WRAITHLORD de votre armée, et 1 figurine PSYKER ASURYANI de votre armée.",
          effet: "Jusqu'à votre prochaine phase de Commandement, ces deux unités sont considérées comme étant à 12\" ou moins l'une de l'autre pour l'aura du détachement et pour l'aptitude Guide Psychique."
        }
      ]
    },

    /* -------------------------------------------------------
       VACILLEMENT CRÉPUSCULAIRE (Twilight Flickers)
       ------------------------------------------------------- */
    {
      id: "vacillement-crepusculaire",
      name: "Vacillement Crépusculaire",
      cost: 1,
      dispositions: ["take-and-hold"],

      rule: {
        name: null,
        text: [
          "Les unités HARLEQUINS de votre armée ont l'aptitude Discrétion."
        ]
      },

      enhancements: [
        {
          id: "artiste-du-preambule",
          name: "Artiste du Préambule",
          cost: 20,
          kind: "optimisation",
          requires: [["Harlequins"]],
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont l'aptitude Éclaireurs 6\"."
        },
        {
          id: "masques-du-rideau-d-ombre",
          name: "Masques du Rideau d'Ombre",
          cost: 15,
          kind: "amelioration",
          requires: [["Troupe"]],
          text: "Cette unité a l'aptitude Combat en Premier."
        }
      ],

      stratagems: [
        {
          id: "mirage-fantasmatique",
          name: "Mirage Fantasmatique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité HARLEQUINS VEHICLE de votre armée a tiré.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de D6\" maximum. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge."
        },
        {
          id: "repetition-predite",
          name: "Répétition Prédite",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, quand une unité TROUPE de votre armée est choisie pour combattre.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, ses attaques de mêlée ont [LANCE]."
        },
        {
          id: "representation-captivante",
          name: "Représentation Captivante",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Fin de votre phase de Mouvement.",
          cible: "1 unité TROUPE de votre armée.",
          effet: "Choisissez 1 pion objectif qu'elle contrôle : il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        }
      ]
    },

    /* -------------------------------------------------------
       OST DE GUERRE (Warhost)
       « Pion de Transe Guerrière » = jeton de Battle Focus (règle d'armée)
       « Aérodyne » = AIRCRAFT
       ------------------------------------------------------- */
    {
      id: "ost-de-guerre",
      name: "Ost de Guerre",
      cost: 2,
      dispositions: ["reconnaissance"],

      rule: {
        name: null,
        text: [
          "Au début de la bataille, vous gagnez 1 pion de Transe Guerrière supplémentaire.",
          "Chaque fois qu'une unité de votre armée fait la manœuvre agile Vifs comme le Vent, ajoutez 1\" à son Mouvement.",
          "Ajoutez 1 aux jets de dés de vos manœuvres agiles."
        ]
      },

      enhancements: [
        {
          id: "destructeur-psychique",
          name: "Destructeur Psychique",
          cost: 30,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker"]],
          text: "Ajoutez 1 aux Dégâts des armes de tir [PSYCHIQUE] du porteur."
        },
        {
          id: "don-de-prescience",
          name: "Don de Prescience",
          cost: 15,
          kind: "optimisation",
          requires: [["Asuryani"]],
          usage: "une-fois-par-round",
          text: "Une fois par round, vous pouvez cibler l'unité du porteur avec le stratagème Relance de Commandement pour 0 PC."
        },
        {
          id: "gemme-du-phenix",
          name: "Gemme du Phénix",
          cost: 35,
          kind: "optimisation",
          requires: [["Asuryani"]],
          usage: "une-fois-par-bataille",
          text: "La première fois que le porteur est détruit, retirez-le du champ de bataille puis, à la fin de la phase, lancez 1D6 : sur 2+, replacez-le aussi près que possible de l'endroit où il a été détruit et hors de portée d'engagement de toute unité ennemie, avec tous ses PV."
        },
        {
          id: "stratege-intemporel",
          name: "Stratège Intemporel",
          cost: 15,
          kind: "optimisation",
          requires: [["Asuryani"]],
          text: "Au début de chaque round, si le porteur est sur le champ de bataille (ou embarqué dans un TRANSPORT sur le champ de bataille), vous gagnez 1 pion de Transe Guerrière supplémentaire."
        }
      ],

      stratagems: [
        {
          id: "feinte-de-repli",
          name: "Feinte de Repli",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, juste après qu'une unité ASURYANI de votre armée a Battu en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."
        },
        {
          id: "puissance-de-feu-eclair",
          name: "Puissance de Feu Éclair",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité ASURYANI de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, ses armes ont [TOUCHES SOUTENUES 1] contre les cibles à 12\" ou moins. Si une arme a déjà cette aptitude, elle inflige à la place une Touche Critique sur un jet de touche non modifié de 5+."
        },
        {
          id: "reactions-eclair",
          name: "Réactions Éclair",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité ASURYANI de votre armée (sauf WRAITH CONSTRUCT) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche."
        },
        {
          id: "sanctuaire-aeroporte-guerre",      // même stratagème que dans l'Ost Aspect
          name: "Sanctuaire Aéroporté",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Fin de la phase de Combat.",
          cible: "1 unité ASURYANI de votre armée qui était éligible pour combattre à cette phase, qui n'est plus à portée d'engagement d'aucune unité ennemie et qui est entièrement à 6\" ou moins d'un TRANSPORT ami.",
          effet: "Elle peut embarquer dans ce TRANSPORT."
        },
        {
          id: "tirer-et-disparaitre",
          name: "Tirer et Disparaître",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, juste après qu'une unité ASURYANI INFANTRY de votre armée (sauf AIRCRAFT, ASURMEN et WRAITH CONSTRUCT) a tiré.",
          cible: "Cette unité.",
          effet: "Elle peut faire un Mouvement Normal de D6+1\" maximum. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge ni pour embarquer dans un TRANSPORT."
        },
        {
          id: "tunnel-a-travers-la-toile",
          name: "Tunnel à travers la Toile",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "combat" }],
          quand: "Fin de la phase de Combat adverse.",
          cible: "1 unité ASURYANI INFANTRY de votre armée non engagée et entièrement à 9\" ou moins d'un bord du champ de bataille.",
          effet: "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."
        }
      ]
    },

    /* -------------------------------------------------------
       OST DE GARDIENS DU VENT (Windrider Host)
       « Gardiens du Vent » = WINDRIDERS, « Vypers » = VYPERS
       ------------------------------------------------------- */
    {
      id: "ost-de-gardiens-du-vent",
      name: "Ost de Gardiens du Vent",
      cost: 2,
      dispositions: ["disruption"],

      grantsKeywords: [
        { to: [["Windriders"]], keywords: ["Battleline"] }
      ],

      rule: {
        name: null,
        text: [
          "À l'étape de Déclaration des Formations de Bataille, les unités ASURYANI MOUNTED et VYPERS de votre armée peuvent être placées en Réserves. À l'étape des Renforts, elles peuvent arriver comme des Réserves Stratégiques, en considérant que le round en cours a un numéro de plus que le round réel.",
          "À la fin du tour adverse, vous pouvez choisir jusqu'à 2 unités ASURYANI MOUNTED ou VYPERS de votre armée non engagées (1 en format Incursion, 3 en format Offensive) : retirez-les du champ de bataille et placez-les en Réserves Stratégiques.",
          "Les unités WINDRIDERS de votre armée gagnent le mot-clé BATTLELINE (Ligne)."
        ]
      },

      enhancements: [
        {
          id: "echos-d-ulthanesh",
          name: "Échos d'Ulthanesh",
          cost: 20,
          kind: "optimisation",
          requires: [["Asuryani", "Mounted"]],
          text: "À votre phase de Commandement, lancez 1D6 (+1 si le porteur est hors de votre zone de déploiement, et +1 de plus s'il est dans la zone de déploiement adverse) : sur 5+, vous gagnez 1 PC."
        },
        {
          id: "premiere-lame-au-clair",
          name: "Première Lame au Clair",
          cost: 10,
          kind: "optimisation",
          requires: [["Asuryani", "Mounted"]],
          text: "Les figurines de l'unité du porteur ont l'aptitude Éclaireurs 9\"."
        },
        {
          id: "champ-mirage",
          name: "Champ Mirage",
          cost: 25,
          kind: "optimisation",
          requires: [["Asuryani", "Mounted"]],
          text: "Chaque fois qu'une attaque cible l'unité du porteur, soustrayez 1 au jet de touche."
        },
        {
          id: "attaque-presciente",
          name: "Attaque Presciente",
          cost: 15,
          kind: "optimisation",
          requires: [["Asuryani", "Psyker", "Mounted"]],
          text: "Les armes [PSYCHIQUE] du porteur ont [ANTI-MONSTRE 2+] et [ANTI-VÉHICULE 2+]."
        }
      ],

      stratagems: [
        {
          id: "cavaliers-audacieux",
          name: "Cavaliers Audacieux",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Étape des Renforts de votre phase de Mouvement.",
          cible: "1 unité ASURYANI MOUNTED ou VYPERS de votre armée en Réserves.",
          effet: "Elle peut être placée n'importe où à plus de 6\" horizontalement de toute unité ennemie. Si elle est placée à moins de 8\" d'une unité ennemie, elle ne peut pas déclarer de charge à ce tour."
        },
        {
          id: "esquive-en-spirale",
          name: "Esquive en Spirale",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité ASURYANI MOUNTED ou VYPERS de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, ses figurines ont une sauvegarde invulnérable de 4+."
        },
        {
          id: "la-mort-venue-d-en-haut",
          name: "La Mort venue d'en Haut",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité ASURYANI MOUNTED ou VYPERS de votre armée arrivée des Réserves à ce tour et pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, vous pouvez relancer ses jets de blessure."
        },
        {
          id: "puissance-de-feu-concentree",
          name: "Puissance de Feu Concentrée",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité ASURYANI MOUNTED ou VYPERS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses attaques."
        },
        {
          id: "survol",
          name: "Survol",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "vous", phase: "combat" }],
          quand: "Fin de votre phase de Tir ou de votre phase de Combat.",
          cible: "1 unité ASURYANI MOUNTED de votre armée qui a détruit une unité ennemie à cette phase.",
          effet: "Elle peut faire un Mouvement Normal de 7\" maximum."
        },
        {
          id: "vent-de-lames",
          name: "Vent de Lames",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité ASURYANI MOUNTED ou VYPERS de votre armée pas encore choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Avancé ou Battu en Retraite."
        }
      ]
    }
  ],

  /* =========================================================
     UNITÉS — À SAISIR (même format que les autres factions)
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ----------
       Mot-clé de faction ajouté aux keywords : Asuryani, Harlequins ou Ynnari. */

    {
      id: "asurmen",
      name: "Asurmen",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Grenades", "Aspect Warrior", "Phoenix Lord", "Asurmen", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 135 }] }],
      leader: { canLead: ["Dire Avengers"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "bloody-twins", name: "Bloody Twins", type: "ranged",
          profiles: [{ range: "24\"", A: "6", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["assault", "pistol"] }] },
        { id: "sword-of-asur", name: "Sword of Asur", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "6", AP: "-3", D: "3", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["bloody-twins", "sword-of-asur"],
      abilities: [
        { name: "Tactical Acumen", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à votre phase de Tir, après que cette unité a tiré, elle peut faire un Mouvement Normal de 6\" maximum. Dans ce cas, jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge." },
        { name: "Hand of Asuryan", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, quand cette figurine est choisie pour tirer, elle peut utiliser cette aptitude. Jusqu'à la fin de la phase, ses Bloody Twins ont une caractéristique de Dégâts de 3, et les aptitudes [ANTI-INFANTERIE 5+] et [BLESSURES DÉVASTATRICES]." }
      ],
      composition: "1 Asurmen"
    },

    {
      id: "baharroth",
      name: "Baharroth",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Jump Pack", "Fly", "Grenades", "Aspect Warrior", "Phoenix Lord", "Baharroth", "Asuryani"],
      stats: { M: "14\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }] }],
      leader: { canLead: ["Swooping Hawks"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "fury-of-the-tempest", name: "Fury of the Tempest", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "2+", S: "6", AP: "-1", D: "2", abilities: ["assault", "lethal-hits"] }] },
        { id: "shining-blade", name: "Shining Blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-2", D: "2", abilities: ["sustained-hits:1"] }] }
      ],
      loadout: ["fury-of-the-tempest", "shining-blade"],
      abilities: [
        { name: "Cloudstrider", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à la fin du tour adverse, si cette unité n'est à portée d'engagement d'aucune unité ennemie, vous pouvez la retirer du champ de bataille et la placer en Réserves Stratégiques. De plus, quand cette unité est placée grâce à Frappe en Profondeur à votre phase de Mouvement, elle peut utiliser cette aptitude : elle peut alors être placée n'importe où à plus de 6\" horizontalement de toute figurine ennemie, mais jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge." },
        { name: "Cry of the Wind",
          text: "Chaque fois que cette figurine est placée sur le champ de bataille, jusqu'à la fin du tour, chaque fois qu'elle fait une attaque de tir, un jet de touche non modifié réussi est une Touche Critique." }
      ],
      composition: "1 Baharroth"
    },

    {
      id: "eldrad-ulthran",
      name: "Eldrad Ulthran",
      category: "epic-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Psyker", "Farseer", "Eldrad Ulthran", "Asuryani"],
      stats: { M: "7\"", T: 4, Sv: "6+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 120 }] }],
      leader: { canLead: ["Guardian Defenders", "Storm Guardians"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "mind-war", name: "Mind War", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "2+", S: "5", AP: "-2", D: "D6", abilities: ["anti:Personnage 4+", "precision", "psychic"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "staff-of-ulthamar-and-witchblade", name: "Staff of Ulthamar and witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["mind-war", "shuriken-pistol", "staff-of-ulthamar-and-witchblade"],
      abilities: [
        { name: "Diviner of Futures",
          text: "Au début de votre phase de Commandement, si cette figurine est sur le champ de bataille, vous gagnez 1 PC." },
        { name: "Doom (Psychic)",
          text: "À la fin de votre phase de Mouvement, choisissez 1 unité ennemie à 18\" ou moins de cette figurine et visible d'elle. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une figurine AELDARI amie attaque cette unité, ajoutez 1 au jet de blessure." },
        { name: "Unité rattachée",
          text: "Si cette figurine n'est pas déjà rattachée à une unité, elle peut être rattachée à une unité même si une unité WARLOCKS y est déjà rattachée." }
      ],
      composition: "1 Eldrad Ulthran"
    },

    {
      id: "fuegan",
      name: "Fuegan",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Grenades", "Aspect Warrior", "Phoenix Lord", "Fuegan", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }] }],
      leader: { canLead: ["Fire Dragons"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "searsong", name: "Searsong", type: "ranged",
          profiles: [
            { name: "beam",  range: "12\"", A: "3", skill: "2+", S: "8",  AP: "-3", D: "2",  abilities: ["assault", "melta:1", "sustained-hits:2"] },
            { name: "lance", range: "18\"", A: "1", skill: "2+", S: "14", AP: "-4", D: "D6", abilities: ["assault", "melta:6"] }
          ] },
        { id: "fire-axe", name: "Fire Axe", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "5", AP: "-4", D: "3", abilities: [] }] }
      ],
      loadout: ["searsong", "fire-axe"],
      abilities: [
        { name: "Burning Lance", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, ajoutez 6\" à la portée des armes [FUSION] des figurines de cette unité." },
        { name: "Unquenchable Resolve", usage: "une-fois-par-bataille",
          text: "La première fois que cette figurine est détruite, à la fin de la phase, lancez 1D6 : sur 2+, replacez-la sur le champ de bataille aussi près que possible de l'endroit où elle a été détruite et hors de portée d'engagement de toute unité ennemie, avec tous ses PV." }
      ],
      composition: "1 Fuegan"
    },

    {
      id: "jain-zar",
      name: "Jain Zar",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Aspect Warrior", "Phoenix Lord", "Jain Zar", "Asuryani"],
      stats: { M: "8\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 105 }] }],
      leader: { canLead: ["Howling Banshees"] },
      coreAbilities: ["fights-first", "leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "silent-death", name: "Silent Death", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "6", AP: "-2", D: "1", abilities: ["assault"] }] },
        { id: "blade-of-destruction", name: "Blade of Destruction", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "6", AP: "-3", D: "2", abilities: ["anti:Infanterie 3+"] }] }
      ],
      loadout: ["silent-death", "blade-of-destruction"],
      abilities: [
        { name: "Whirling Death", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois que cette unité Avance, ne faites pas de jet d'Avance : jusqu'à la fin de la phase, ajoutez 6\" au Mouvement de ses figurines, et ignorez la distance verticale quand elles font ce mouvement d'Avance." },
        { name: "Storm of Silence",
          text: "Chaque fois que cette figurine attaque une unité CHARACTER, vous pouvez relancer le jet de blessure." }
      ],
      composition: "1 Jain Zar"
    },

    {
      id: "kharseth",
      name: "Kharseth",
      category: "epic-infantry",
      base: "32mm",
      keywords: ["Infantry", "Aeldari", "Character", "Epic Hero", "Psyker", "Anhrathe", "Kharseth", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 80 }] }],
      leader: { canLead: ["Corsair Voidreavers", "Corsair Voidscarred"] },
      coreAbilities: ["leader", "scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "dread-of-the-deep-void", name: "Dread of the Deep Void", type: "ranged",
          profiles: [{ range: "24\"", A: "D6+2", skill: "3+", S: "3", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "blast", "hazardous", "ignores-cover", "psychic"] }] },
        { id: "waystave", name: "Waystave", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "3", AP: "0", D: "3", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["dread-of-the-deep-void", "waystave"],
      abilities: [
        { name: "Aethersense (Psychic)",
          text: "Les unités ennemies placées sur le champ de bataille depuis les Réserves ne peuvent pas être placées à 12\" ou moins de cette figurine." },
        { name: "Fury of the Void (Psychic)",
          text: "À votre phase de Tir, après que l'unité de cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs attaques de son Dread of the Deep Void. Jusqu'à la fin du tour, cette unité est déchirée : chaque fois qu'une figurine AELDARI de votre armée l'attaque, ajoutez 1 à la Force de l'attaque." }
      ],
      composition: "1 Kharseth"
    },

    {
      id: "lhykhis",
      name: "Lhykhis",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Jump Pack", "Fly", "Aspect Warrior", "Phoenix Lord", "Lhykhis", "Asuryani"],
      stats: { M: "12\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 135 }] }],
      leader: { canLead: ["Warp Spiders"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "brood-twain", name: "Brood Twain", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-2", D: "1", abilities: ["ignores-cover", "torrent", "twin-linked"] }] },
        { id: "spiders-fangs", name: "Spider's Fangs", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "4", AP: "-2", D: "1", abilities: ["extra-attacks", "lethal-hits"] }] },
        { id: "weaverender", name: "Weaverender", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["brood-twain", "spiders-fangs", "weaverender"],
      abilities: [
        { name: "Empyric Ambush", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, cette unité est éligible pour déclarer une charge à un tour où elle a utilisé son aptitude Flickerjump." },
        { name: "Whispering Web",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin du tour, chaque fois qu'une figurine AELDARI amie attaque cette unité, un jet de touche non modifié de 5+ est une Touche Critique." }
      ],
      composition: "1 Lhykhis"
    },

    {
      id: "maugan-ra",
      name: "Maugan Ra",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Aspect Warrior", "Phoenix Lord", "Maugan Ra", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }] }],
      leader: { canLead: ["Dark Reapers"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "maugetar", name: "Maugetar", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "2+", S: "7", AP: "-2", D: "2", abilities: ["devastating-wounds", "ignores-cover"] }] },
        { id: "maugetar-melee", name: "Maugetar", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "6", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["maugetar", "maugetar-melee"],
      abilities: [
        { name: "Harvester of Souls", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à votre phase de Tir, après avoir choisi les cibles de cette unité, si toutes ses attaques ciblent la même unité, lancez 1D6 pour cette unité ciblée et 1D6 pour chaque autre unité ennemie à 3\" ou moins d'elle : sur 5+, l'unité concernée est touchée par des débris explosifs. Après avoir résolu toutes les attaques de l'unité contre sa cible, chaque unité touchée par des débris explosifs subit D3 blessures mortelles." },
        { name: "Face of Death",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques : elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat." }
      ],
      composition: "1 Maugan Ra"
    },

    {
      id: "prince-yriel",
      name: "Prince Yriel",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Character", "Epic Hero", "Anhrathe", "Prince Yriel", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }] }],
      leader: { canLead: ["Corsair Voidreavers", "Corsair Voidscarred"] },
      coreAbilities: ["leader", "scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "eye-of-wrath", name: "Eye of Wrath", type: "ranged",
          profiles: [{ range: "6\"", A: "3", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["assault", "pistol"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "spear-of-twilight", name: "Spear of Twilight", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "7", AP: "-3", D: "3", abilities: ["lance"] }] }
      ],
      loadout: ["eye-of-wrath", "shuriken-pistol", "spear-of-twilight"],
      abilities: [
        { name: "Piratical Hero", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité attaque, l'attaque a [TOUCHES SOUTENUES 1] et vous ajoutez 1 au jet de touche." },
        { name: "Prince of Corsairs",
          text: "Après le déploiement des deux armées, si cette unité est sur le champ de bataille (ou embarquée dans un TRANSPORT sur le champ de bataille), choisissez jusqu'à 3 unités AELDARI de votre armée et redéployez-les. Vous pouvez alors les placer en Réserves Stratégiques, quel que soit le nombre d'unités qui y sont déjà." }
      ],
      composition: "1 Prince Yriel"
    },

    {
      id: "solitaire",
      name: "Solitaire",
      category: "epic-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Aeldari", "Solitaire", "Harlequins"],
      stats: { M: "12\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 105 }] }],
      cannotBeWarlord: true,                       // Path of Damnation
      coreAbilities: ["fights-first", "lone-operative", "stealth"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "solitaire-weapons", name: "Solitaire weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "9", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["precision"] }] }
      ],
      wargear: [{ id: "flip-belt", name: "Flip belt" }],
      loadout: ["solitaire-weapons", "flip-belt"],
      abilities: [
        { name: "Path of Damnation",
          text: "Cette figurine ne peut pas être votre Seigneur de Guerre." },
        { name: "Blitz", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, à votre phase de Mouvement, avant que cette figurine fasse un Mouvement Normal, elle peut utiliser cette aptitude. Jusqu'à la fin du tour, ajoutez 2D6\" à son Mouvement et 3 aux Attaques de ses Solitaire weapons." },
        { name: "Blur of Movement",
          text: "Cette figurine est éligible pour déclarer une charge à un tour où elle a Avancé." },
        { name: "Flip Belt", requiresWargear: "flip-belt",
          text: "Chaque fois que l'unité du porteur fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue." }
      ],
      composition: "1 Solitaire"
    },

    /* ---------- Héros monstres épiques ---------- */

    {
      id: "avatar-of-khaine",
      name: "Avatar of Khaine",
      category: "epic-monster",
      base: "80mm",
      keywords: ["Monster", "Character", "Epic Hero", "Aeldari", "Daemon", "Avatar of Khaine", "Asuryani"],
      stats: { M: "10\"", T: 11, Sv: "2+", W: 14, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 250 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "the-wailing-doom", name: "The Wailing Doom", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "16", AP: "-4", D: "D6+2", abilities: ["sustained-hits:D3"] }] },
        { id: "the-wailing-doom-melee", name: "The Wailing Doom", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "16", AP: "-4", D: "D6+2", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "2+", S: "8",  AP: "-2", D: "2",    abilities: [] }
          ] }
      ],
      loadout: ["the-wailing-doom", "the-wailing-doom-melee"],
      abilities: [
        { name: "Molten Form",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, divisez par deux la caractéristique de Dégâts de cette attaque." },
        { name: "The Bloody-Handed (Aura)",
          text: "Tant qu'une unité AELDARI amie est à 6\" ou moins de cette figurine, ajoutez 1 à ses jets d'Avance et de Charge." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Avatar of Khaine"
    },

    /* ---------- Personnages d'infanterie ----------
       travellingPlayers : 1 seul exemplaire, sauf détachement qui en autorise 3
       (Fantômes de la Toile, Fils du Serpent). */

    {
      id: "autarch",
      name: "Autarch",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Aeldari", "Grenades", "Autarch", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Dark Reapers", "Dire Avengers", "Fire Dragons", "Guardian Defenders", "Howling Banshees", "Storm Guardians", "Striking Scorpions"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "death-spinner", name: "Death spinner", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "dragon-fusion-gun", name: "Dragon fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3"] }] },
        { id: "dragon-fusion-pistol", name: "Dragon fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3", "pistol"] }] },
        { id: "reaper-launcher", name: "Reaper launcher", type: "ranged",
          profiles: [
            { name: "starshot",  range: "48\"", A: "1", skill: "3+", S: "10", AP: "-2", D: "3", abilities: ["heavy", "ignores-cover"] },
            { name: "starswarm", range: "48\"", A: "2", skill: "3+", S: "4",  AP: "-2", D: "1", abilities: ["heavy", "ignores-cover"] }
          ] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "banshee-blade", name: "Banshee blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "4", AP: "-2", D: "2", abilities: ["anti:Infanterie 3+"] }] },
        { id: "scorpion-chainsword", name: "Scorpion chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "star-glaive", name: "Star glaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["shuriken-pistol", "star-glaive"],
      options: [
        { id: "remplace-pistol", text: "Le shuriken pistol peut être remplacé par 1 death spinner, 1 Dragon fusion gun, 1 Dragon fusion pistol ou 1 Reaper launcher.",
          replaces: ["shuriken-pistol"], choices: [["death-spinner"], ["dragon-fusion-gun"], ["dragon-fusion-pistol"], ["reaper-launcher"]] },
        { id: "remplace-glaive", text: "La star glaive peut être remplacée par 1 Banshee blade ou 1 Scorpion chainsword.",
          replaces: ["star-glaive"], choices: [["banshee-blade"], ["scorpion-chainsword"]] }
      ],
      abilities: [
        { name: "Superlative Strategist", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, vous pouvez relancer les jets d'Avance de cette unité, ainsi que tous les jets faits pour elle pendant une manœuvre agile." },
        { name: "Path of Command", usage: "une-fois-par-round",
          text: "Une fois par round, une figurine de votre armée qui a cette aptitude peut l'utiliser quand son unité est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Aspect Training", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité HOWLING BANSHEES, elle a l'aptitude Combat en Premier. Tant qu'elle mène une unité STRIKING SCORPIONS, elle a les aptitudes Infiltrateurs, Éclaireurs 7\" et Discrétion." }
      ],
      composition: "1 Autarch"
    },

    {
      id: "autarch-wayleaper",
      name: "Autarch Wayleaper",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Aeldari", "Jump Pack", "Fly", "Grenades", "Autarch Wayleaper", "Asuryani"],
      stats: { M: "14\"", T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Swooping Hawks", "Warp Spiders"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "death-spinner", name: "Death spinner", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "dragon-fusion-gun", name: "Dragon fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3"] }] },
        { id: "dragon-fusion-pistol", name: "Dragon fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3", "pistol"] }] },
        { id: "reaper-launcher", name: "Reaper launcher", type: "ranged",
          profiles: [
            { name: "starshot",  range: "48\"", A: "1", skill: "3+", S: "10", AP: "-2", D: "3", abilities: ["heavy", "ignores-cover"] },
            { name: "starswarm", range: "48\"", A: "2", skill: "3+", S: "4",  AP: "-2", D: "1", abilities: ["heavy", "ignores-cover"] }
          ] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "banshee-blade", name: "Banshee blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "4", AP: "-2", D: "2", abilities: ["anti:Infanterie 3+"] }] },
        { id: "scorpion-chainsword", name: "Scorpion chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "star-glaive", name: "Star glaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["shuriken-pistol", "star-glaive"],
      options: [
        { id: "remplace-pistol", text: "Le shuriken pistol peut être remplacé par 1 death spinner, 1 Dragon fusion gun, 1 Dragon fusion pistol ou 1 Reaper launcher.",
          replaces: ["shuriken-pistol"], choices: [["death-spinner"], ["dragon-fusion-gun"], ["dragon-fusion-pistol"], ["reaper-launcher"]] },
        { id: "remplace-glaive", text: "La star glaive peut être remplacée par 1 Banshee blade ou 1 Scorpion chainsword.",
          replaces: ["star-glaive"], choices: [["banshee-blade"], ["scorpion-chainsword"]] }
      ],
      abilities: [
        { name: "Indomitable Strength of Will", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois que vous dépensez un pion de Transe Guerrière pour que cette unité fasse une manœuvre agile, lancez 1D6 : sur 3+, vous gagnez 1 pion de Transe Guerrière." },
        { name: "Path of Command", usage: "une-fois-par-round",
          text: "Une fois par round, une figurine de votre armée qui a cette aptitude peut l'utiliser quand son unité est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." }
      ],
      composition: "1 Autarch Wayleaper"
    },

    {
      id: "death-jester",
      name: "Death Jester",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Death Jester", "Harlequins"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      travellingPlayers: true,
      coreAbilities: ["lone-operative"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "shrieker-cannon", name: "Shrieker cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "2+", S: "6", AP: "-2", D: "2", abilities: [] }] },
        { id: "jesters-blade", name: "Jester's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "flip-belt", name: "Flip belt" }],
      loadout: ["shrieker-cannon", "jesters-blade", "flip-belt"],
      abilities: [
        { name: "Travelling Players",
          text: "Sauf mention contraire, votre armée ne peut pas inclure plus d'un exemplaire de cette figurine." },
        { name: "Death is Not Enough",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) touchée par une ou plusieurs de ces attaques : elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat si une ou plusieurs de ses figurines ont été détruites par ces attaques." },
        { name: "Cruel Amusement",
          text: "À votre phase de Tir, chaque fois que cette figurine est choisie pour tirer, choisissez une des aptitudes suivantes : jusqu'à la fin de la phase, son shrieker cannon l'a. [IGNORE LE COUVERT], [PRÉCISION] ou [TOUCHES SOUTENUES 3]." },
        { name: "Flip Belt", requiresWargear: "flip-belt",
          text: "Chaque fois que l'unité du porteur fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue." }
      ],
      composition: "1 Death Jester"
    },

    {
      id: "farseer",
      name: "Farseer",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Psyker", "Farseer", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { canLead: ["Guardian Defenders", "Storm Guardians"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "eldritch-storm", name: "Eldritch Storm", type: "ranged",
          profiles: [{ range: "24\"", A: "D6", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["blast", "psychic"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "singing-spear", name: "Singing spear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "9", AP: "0", D: "3", abilities: ["assault", "psychic"] }] },
        { id: "singing-spear-melee", name: "Singing spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "3", abilities: ["psychic"] }] },
        { id: "witchblade", name: "Witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["eldritch-storm", "shuriken-pistol", "witchblade"],
      options: [
        { id: "remplace-witchblade", text: "La witchblade peut être remplacée par 1 singing spear.",
          replaces: ["witchblade"], choices: [["singing-spear", "singing-spear-melee"]] }
      ],
      abilities: [
        { name: "Branching Fates (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, une fois par phase, vous pouvez changer le résultat d'un jet de touche, d'un jet de blessure ou d'un jet de Dégâts fait pour une figurine de cette unité (sauf SUPPORT WEAPON) en 6 non modifié." },
        { name: "Guide (Psychic)",
          text: "À la fin de votre phase de Mouvement, choisissez 1 unité ennemie à 18\" ou moins de cette figurine et visible d'elle. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une figurine AELDARI amie attaque cette unité, ajoutez 1 au jet de touche. Chaque unité ne peut être choisie qu'une fois par tour pour cette aptitude." }
      ],
      composition: "1 Farseer"
    },

    {
      id: "shadowseer",
      name: "Shadowseer",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Psyker", "Grenades", "Shadowseer", "Harlequins"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 50 }] }],
      travellingPlayers: true,
      leader: { canLead: ["Troupe"] },
      coreAbilities: ["leader", "stealth"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "miststave", name: "Miststave", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "5", AP: "-1", D: "D3", abilities: ["psychic"] }] }
      ],
      wargear: [{ id: "flip-belt", name: "Flip belt" }],
      loadout: ["shuriken-pistol", "miststave", "flip-belt"],
      options: [
        { id: "remplace-pistol", text: "Le shuriken pistol peut être remplacé par 1 neuro disruptor.",
          replaces: ["shuriken-pistol"], choices: [["neuro-disruptor"]] }
      ],
      abilities: [
        { name: "Travelling Players",
          text: "Sauf mention contraire, votre armée ne peut pas inclure plus d'un exemplaire de cette figurine." },
        { name: "Fog of Dreams (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, cette unité ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins." },
        { name: "Treacherous Illusion (Psychic)",
          text: "Les armes de mêlée des figurines ennemies ont [À RISQUE] quand elles ciblent l'unité de cette figurine." },
        { name: "Flip Belt", requiresWargear: "flip-belt",
          text: "Chaque fois que l'unité du porteur fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue." }
      ],
      composition: "1 Shadowseer"
    },

    {
      id: "spiritseer",
      name: "Spiritseer",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Psyker", "Spiritseer", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "6+", W: 3, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 50 }] }],
      coreAbilities: ["stealth"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "witch-staff", name: "Witch staff", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "D3", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["shuriken-pistol", "witch-staff"],
      abilities: [
        { name: "Spiritseer",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités WRAITH CONSTRUCT amies, elle a l'aptitude Agent Solitaire." },
        { name: "Spirit Mark (Psychic)", usage: "une-fois-par-tour",
          text: "Une fois par tour, à votre phase de Mouvement, quand cette figurine commence ou finit un mouvement, choisissez 1 unité WRAITH CONSTRUCT amie (sauf TITANIC) à 6\" ou moins d'elle et 1 unité ennemie visible d'elle. Jusqu'au début de votre prochaine phase de Mouvement, les armes des figurines de l'unité amie ont [TOUCHES SOUTENUES 1] quand elles ciblent cette unité ennemie." },
        { name: "Tears of Isha (Psychic)",
          text: "À votre phase de Commandement, choisissez 1 unité WRAITH CONSTRUCT amie à 6\" ou moins de cette figurine. Si une ou plusieurs de ses figurines ont été détruites, vous pouvez en ramener 1 dans l'unité. Sinon, 1 figurine de cette unité récupère jusqu'à D3 PV perdus. Chaque unité ne peut être choisie qu'une fois par tour pour cette aptitude." }
      ],
      composition: "1 Spiritseer"
    },

    {
      id: "troupe-master",
      name: "Troupe Master",
      category: "char-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Aeldari", "Grenades", "Troupe Master", "Harlequins"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      travellingPlayers: true,
      leader: { canLead: ["Troupe"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "fusion-pistol", name: "Fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "2+", S: "8", AP: "-4", D: "D6", abilities: ["assault", "melta:2", "pistol"] }] },
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "harlequins-special-weapon", name: "Harlequin's special weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "4", AP: "-1", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "troupe-masters-blade", name: "Troupe Master's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "5", AP: "-2", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "flip-belt", name: "Flip belt" }],
      loadout: ["shuriken-pistol", "troupe-masters-blade", "flip-belt"],
      options: [
        { id: "remplace-pistol", text: "Le shuriken pistol peut être remplacé par 1 fusion pistol ou 1 neuro disruptor.",
          replaces: ["shuriken-pistol"], choices: [["fusion-pistol"], ["neuro-disruptor"]] },
        { id: "remplace-blade", text: "Le Troupe Master's blade peut être remplacé par 1 Harlequin's special weapon.",
          replaces: ["troupe-masters-blade"], choices: [["harlequins-special-weapon"]] }
      ],
      abilities: [
        { name: "Travelling Players",
          text: "Sauf mention contraire, votre armée ne peut pas inclure plus d'un exemplaire de cette figurine." },
        { name: "Choreographer of War", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait un mouvement d'engagement ou de consolidation, elle peut se déplacer de 6\" au lieu de 3\". De plus, elle n'a pas besoin de finir ce mouvement plus près de la figurine ennemie la plus proche, à condition de le finir aussi près que possible de l'unité ennemie la plus proche." },
        { name: "Cegorach's Favour",
          text: "Chaque fois que cette figurine fait une attaque de mêlée, vous pouvez relancer un jet de touche de 1, et ajoutez 1 au jet de blessure." },
        { name: "Flip Belt", requiresWargear: "flip-belt",
          text: "Chaque fois que l'unité du porteur fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue." }
      ],
      composition: "1 Troupe Master"
    },

    {
      id: "warlock",
      name: "Warlock",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Aeldari", "Psyker", "Warlock", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "6+", W: 2, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 40 }] }],
      leader: { type: "support", canLead: ["Guardian Defenders", "Storm Guardians"] },
      coreAbilities: ["support"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "destructor", name: "Destructor", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["psychic", "torrent"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "singing-spear", name: "Singing spear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "0", D: "3", abilities: ["assault", "psychic"] }] },
        { id: "singing-spear-melee", name: "Singing spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "3", abilities: ["psychic"] }] },
        { id: "witchblade", name: "Witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["destructor", "shuriken-pistol", "witchblade"],
      options: [
        { id: "remplace-witchblade", text: "La witchblade peut être remplacée par 1 singing spear.",
          replaces: ["witchblade"], choices: [["singing-spear", "singing-spear-melee"]] }
      ],
      abilities: [
        { name: "Runes of Fortune (Psychic)",
          text: "Chaque fois qu'une unité ennemie déclare une charge, si une ou plusieurs unités avec cette aptitude sont parmi les cibles de cette charge, soustrayez 2 au jet de Charge." },
        { name: "Psychic Communion (Psychic)",
          text: "Chaque fois que cette figurine est choisie pour tirer, jusqu'à la fin de la phase, ajoutez 1 aux Attaques et à la Force de son Destructor pour chaque autre figurine AELDARI PSYKER amie à 6\" ou moins d'elle (+2 au maximum)." }
      ],
      composition: "1 Warlock"
    },

    /* ---------- Personnages montés ---------- */

    {
      id: "clanblade",
      name: "Clanblade",
      category: "char-mounted",
      base: "75 x 42mm",
      keywords: ["Mounted", "Aeldari", "Character", "Exodite", "Mobile", "Clanblade", "Asuryani"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "6+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }] }],
      leader: { canLead: ["Dragon Knights"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "solar-carbine", name: "Solar Carbine", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "drakesteed-fangs-and-talons", name: "Drakesteed Fangs and Talons", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "moonblades", name: "Moonblades", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "4", AP: "-2", D: "2", abilities: ["lethal-hits", "twin-linked"] }] }
      ],
      loadout: ["solar-carbine", "drakesteed-fangs-and-talons", "moonblades"],
      abilities: [
        { name: "Blade of the Clans",
          text: "Les attaques de mêlée de cette unité ont [TOUCHES SOUTENUES 1]." },
        { name: "Cornered Prey",
          text: "Quand une unité ennemie engagée avec cette unité est choisie pour Battre en Retraite, elle doit utiliser le mode Fuite Désespérée. Si cette unité ennemie est Ébranlée, soustrayez 1 à ses jets de risque." }
      ],
      composition: "1 Clanblade"
    },

    {
      id: "farseer-skyrunner",
      name: "Farseer Skyrunner",
      category: "char-mounted",
      base: "32mm (socle de vol)",
      keywords: ["Mounted", "Character", "Aeldari", "Fly", "Psyker", "Farseer", "Farseer Skyrunner", "Asuryani"],
      stats: { M: "14\"", T: 4, Sv: "6+", W: 5, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { canLead: ["Windriders"] },
      coreAbilities: ["leader"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "eldritch-storm", name: "Eldritch Storm", type: "ranged",
          profiles: [{ range: "24\"", A: "D6", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["blast", "psychic"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "singing-spear", name: "Singing spear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "0", D: "3", abilities: ["assault", "psychic"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "singing-spear-melee", name: "Singing spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "3", abilities: ["psychic"] }] },
        { id: "witchblade", name: "Witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["eldritch-storm", "shuriken-pistol", "twin-shuriken-catapult", "witchblade"],
      options: [
        { id: "remplace-witchblade", text: "La witchblade peut être remplacée par 1 singing spear.",
          replaces: ["witchblade"], choices: [["singing-spear", "singing-spear-melee"]] }
      ],
      abilities: [
        { name: "Branching Fates (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, une fois par phase, vous pouvez changer le résultat d'un jet de touche, d'un jet de blessure ou d'un jet de Dégâts fait pour une figurine de cette unité en 6 non modifié." },
        { name: "Misfortune (Psychic)",
          text: "À la fin de votre phase de Mouvement, choisissez 1 unité ennemie à 18\" ou moins de cette figurine et visible d'elle. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une figurine de cette unité attaque, soustrayez 1 au jet de blessure. Chaque unité ne peut être choisie qu'une fois par tour pour cette aptitude." }
      ],
      composition: "1 Farseer Skyrunner"
    },

    {
      id: "leystalker",
      name: "Leystalker",
      category: "char-mounted",
      base: "75 x 42mm",
      keywords: ["Mounted", "Aeldari", "Character", "Exodite", "Mobile", "Leystalker", "Asuryani"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      coreAbilities: ["lone-operative", "scouts:9\"", "stealth"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "long-rifle", name: "Long Rifle", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "2+", S: "6", AP: "-2", D: "3", abilities: ["devastating-wounds", "precision"] }] },
        { id: "drakesteed-fangs-and-talons", name: "Drakesteed Fangs and Talons", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "hunting-blades", name: "Hunting Blades", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "-1", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "drakolithe", name: "Drakolithe" }],
      loadout: ["drakolithe", "drakolithe", "long-rifle", "drakesteed-fangs-and-talons", "hunting-blades"],
      abilities: [
        { name: "Long Rifle",
          text: "Le [BLESSURES DÉVASTATRICES] du Long Rifle ne s'applique qu'aux attaques qui ciblent une unité qui n'est ni MONSTER ni VEHICLE." },
        { name: "Panicked Quarry",
          text: "À votre phase de Tir, quand cette unité a tiré, choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) touchée par ces attaques : elle fait un jet d'Ébranlement, en soustrayant 1 au résultat." },
        { name: "Drakolithe", requiresWargear: "drakolithe",
          text: "Une fois par bataille et par pion Drakolithe (2 au départ) : quand une unité ennemie finit un mouvement à 8\" ou moins de cette unité, si cette unité n'est pas engagée ou si l'unité ennemie a fini ce mouvement engagée avec elle, vous pouvez utiliser cette aptitude. Lancez 1D6 : sur 3+, cette unité ennemie subit 1 blessure mortelle. Retirez un pion Drakolithe à chaque utilisation." }
      ],
      composition: "1 Leystalker"
    },

    {
      id: "stonesinger",
      name: "Stonesinger",
      category: "char-mounted",
      base: "75 x 42mm",
      keywords: ["Mounted", "Aeldari", "Character", "Exodite", "Mobile", "Psyker", "Stonesinger", "Asuryani"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 55 }] }],
      leader: { type: "support", canLead: ["Dragon Knights"] },
      coreAbilities: ["support"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "song-of-waning", name: "Song of Waning", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "4", AP: "-2", D: "3", abilities: ["anti:Monstre/Véhicule 3+", "psychic"] }] },
        { id: "solar-carbine", name: "Solar Carbine", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "venomcrest-spit", name: "Venomcrest Spit", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "N/A", S: "3", AP: "-2", D: "2", abilities: ["anti:non-Monstre/Véhicule 3+", "blast:1", "torrent"] }] },
        { id: "drakesteed-fangs-and-talons", name: "Drakesteed Fangs and Talons", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "stone-stave", name: "Stone Stave", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "-1", D: "2", abilities: ["anti:non-Monstre/Véhicule 2+", "psychic"] }] }
      ],
      loadout: ["song-of-waning", "solar-carbine", "venomcrest-spit", "drakesteed-fangs-and-talons", "stone-stave"],
      abilities: [
        { name: "Elemental Ensnarement",
          text: "À la fin de votre phase de Combat, si cette unité n'est pas Ébranlée, vous pouvez utiliser cette aptitude. Lancez 1D6 : sur 1, cette unité est Ébranlée. Quel que soit le résultat, choisissez ensuite 1 unité ennemie MONSTER ou VEHICLE (sauf TITANIC) visible et à 18\" ou moins de cette unité : elle est entravée jusqu'au début de votre prochain tour. Une unité entravée a −2\" en Mouvement et ne peut pas être clouée." }
      ],
      composition: "1 Stonesinger"
    },
    /* ---------- Ligne ---------- */

    {
      id: "corsair-voidreavers",
      name: "Corsair Voidreavers",
      category: "battleline",
      base: "28,5mm",
      keywords: ["Infantry", "Battleline", "Aeldari", "Grenades", "Anhrathe", "Corsair Voidreavers", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 65 }] },
        { models: 10, costs: [{ from: 1, pts: 110 }] }
      ],
      coreAbilities: ["scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "blaster", name: "Blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6+1", abilities: ["assault"] }] },
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shredder", name: "Shredder", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "N/A", S: "6", AP: "0", D: "1", abilities: ["assault", "torrent"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "shuriken-rifle", name: "Shuriken rifle", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "rapid-fire:1"] }] },
        { id: "wraithcannon", name: "Wraithcannon", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "14", AP: "-4", D: "D6+1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "mistshield", name: "Mistshield" }],
      models: [
        { id: "voidreaver-felarch", name: "Voidreaver Felarch", count: 1,       loadout: ["shuriken-pistol", "power-sword", "close-combat-weapon"] },
        { id: "corsair-voidreaver", name: "Corsair Voidreaver", count: "reste", loadout: ["shuriken-pistol", "power-sword", "close-combat-weapon"] }
      ],
      options: [
        { id: "felarch-pistol", model: "voidreaver-felarch", text: "Le shuriken pistol du Voidreaver Felarch peut être remplacé par 1 neuro disruptor ou 1 shuriken rifle.",
          replaces: ["shuriken-pistol"], choices: [["neuro-disruptor"], ["shuriken-rifle"]] },
        { id: "mistshield", model: "voidreaver-felarch", text: "Le Voidreaver Felarch peut être équipé de 1 mistshield.",
          choices: [["mistshield"]], max: { count: 1 } },
        { id: "rifle", model: "corsair-voidreaver", text: "N'importe quel nombre de Corsair Voidreavers peuvent remplacer leur shuriken pistol et leur power sword par 1 shuriken rifle.",
          replaces: ["shuriken-pistol", "power-sword"], choices: [["shuriken-rifle"]] },
        // La fiche permet aussi de remplacer un shuriken rifle à la place de la power sword :
        // le builder ne gère que la power sword (cas le plus courant).
        { id: "special", model: "corsair-voidreaver", text: "Pour chaque tranche de 5 figurines, la power sword (ou le shuriken rifle) d'1 Corsair Voidreaver peut être remplacée par 1 blaster ou 1 shredder.",
          replaces: ["power-sword"], choices: [["blaster"], ["shredder"]], max: { per: 5, count: 1 } },
        { id: "heavy", model: "corsair-voidreaver", text: "Si l'unité compte 10 figurines, le shuriken rifle d'1 Corsair Voidreaver peut être remplacé par 1 shuriken cannon ou 1 wraithcannon.",
          replaces: ["shuriken-rifle"], choices: [["shuriken-cannon"], ["wraithcannon"]], max: { per: 10, count: 1 } }
      ],
      abilities: [
        { name: "Reavers of the Void",
          text: "Chaque fois qu'une figurine de cette unité attaque, relancez un jet de touche de 1. Si la cible est à portée d'un pion objectif, vous pouvez relancer le jet de touche à la place." },
        { name: "Mistshield", requiresWargear: "mistshield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." }
      ],
      composition: "1 Voidreaver Felarch et 4 à 9 Corsair Voidreavers"
    },

    {
      id: "guardian-defenders",
      name: "Guardian Defenders",
      category: "battleline",
      base: "28,5mm (Heavy Weapon Platform : 40mm)",
      keywords: ["Infantry", "Battleline", "Aeldari", "Grenades", "Guardians", "Guardian Defenders", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 2 },
      statLines: [
        { label: "Guardian Defender",     stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 2 } },
        { label: "Heavy Weapon Platform", stats: { M: "7\"", T: 3, Sv: "4+", W: 2, Ld: "7+", OC: 0 } }
      ],
      sizes: [{ models: 11, costs: [{ from: 1, pts: 90 }] }],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "3+", S: "10", AP: "-2", D: "D6", abilities: [] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "3+", S: "4",  AP: "-1", D: "1",  abilities: ["blast"] }
          ] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "shuriken-catapult", name: "Shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "guardian-defender",     name: "Guardian Defender",     count: 10, loadout: ["shuriken-catapult", "close-combat-weapon"] },
        { id: "heavy-weapon-platform", name: "Heavy Weapon Platform", count: 1,  loadout: ["shuriken-cannon", "close-combat-weapon"] }
      ],
      options: [
        { id: "plateforme", model: "heavy-weapon-platform", text: "Le shuriken cannon de la Heavy Weapon Platform peut être remplacé par 1 missile launcher, 1 bright lance, 1 scatter laser ou 1 starcannon.",
          replaces: ["shuriken-cannon"], choices: [["missile-launcher"], ["bright-lance"], ["scatter-laser"], ["starcannon"]] }
      ],
      abilities: [
        { name: "Fleet of Foot",
          text: "Cette unité peut faire la manœuvre agile Se Replier sans dépenser de pion de Transe Guerrière. Elle peut la faire même si d'autres unités l'ont faite à la même phase, et cela n'empêche pas d'autres unités de faire la même manœuvre agile à cette phase." },
        { name: "Crewed Platform",
          text: "Quand la dernière figurine Guardian Defender de cette unité est détruite, les figurines Heavy Weapon Platform restantes de l'unité sont aussi détruites." }
      ],
      composition: "10 Guardian Defenders et 1 Heavy Weapon Platform"
    },

    {
      id: "storm-guardians",
      name: "Storm Guardians",
      category: "battleline",
      base: "28,5mm (Serpent's Scale Platform : 40mm)",
      keywords: ["Infantry", "Battleline", "Aeldari", "Grenades", "Guardians", "Storm Guardians", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 2 },
      statLines: [
        { label: "Storm Guardian",          stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 2 } },
        { label: "Serpent's Scale Platform", stats: { M: "7\"", T: 3, Sv: "4+", W: 2, Ld: "7+", OC: 0 } }
      ],
      sizes: [{ models: 11, costs: [{ from: 1, pts: 100 }] }],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["assault", "ignores-cover", "torrent"] }] },
        { id: "fusion-gun", name: "Fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6", abilities: ["assault", "melta:2"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "serpent-shield", name: "Serpent shield" }],
      models: [
        { id: "storm-guardian",           name: "Storm Guardian",           count: 10, loadout: ["shuriken-pistol", "close-combat-weapon"] },
        { id: "serpents-scale-platform",  name: "Serpent's Scale Platform", count: 1,  loadout: ["close-combat-weapon", "serpent-shield"] }
      ],
      options: [
        { id: "flamer", model: "storm-guardian", text: "Jusqu'à 2 Storm Guardians peuvent remplacer leur shuriken pistol par 1 flamer.",
          replaces: ["shuriken-pistol"], choices: [["flamer"]], max: { count: 2 } },
        { id: "fusion", model: "storm-guardian", text: "Jusqu'à 2 Storm Guardians peuvent remplacer leur shuriken pistol par 1 fusion gun.",
          replaces: ["shuriken-pistol"], choices: [["fusion-gun"]], max: { count: 2 } },
        { id: "sword", model: "storm-guardian", text: "Jusqu'à 2 Storm Guardians peuvent remplacer leur close combat weapon par 1 power sword.",
          replaces: ["close-combat-weapon"], choices: [["power-sword"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Stormblades",
          text: "À la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Crewed Platform",
          text: "Quand la dernière figurine Storm Guardian de cette unité est détruite, les figurines Serpent's Scale Platform restantes de l'unité sont aussi détruites." },
        { name: "Serpent Shield", requiresWargear: "serpent-shield",
          text: "Les figurines de l'unité du porteur ont une sauvegarde invulnérable de 5+." }
      ],
      composition: "10 Storm Guardians et 1 Serpent's Scale Platform"
    },
    /* ---------- Infanterie ----------
       Aspect Shrine Token : 1 pion par tranche de 5 figurines (texte seulement).
       Support Artillery (plateformes) : rattachement à des Guardian Defenders
       géré comme une escorte (retinue.joins), une plateforme par unité. */

    {
      id: "corsair-skyreavers",
      name: "Corsair Skyreavers",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Anhrathe", "Jump Pack", "Fly", "Grenades", "Corsair Skyreavers", "Asuryani"],
      stats: { M: "12\"", T: 3, Sv: "5+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 75 }] },
        { models: 10, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: ["deep-strike", "scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "blaster", name: "Blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6+1", abilities: ["assault"] }] },
        { id: "blast-pistol", name: "Blast pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "D3", abilities: ["assault", "pistol"] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["assault", "ignores-cover", "torrent"] }] },
        { id: "fusion-gun", name: "Fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6", abilities: ["assault", "melta:2"] }] },
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shredder", name: "Shredder", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "N/A", S: "6", AP: "0", D: "1", abilities: ["assault", "torrent"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "corsair-blade", name: "Corsair blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "skyreaver-felarch", name: "Skyreaver Felarch", count: 1,       loadout: ["shuriken-pistol", "corsair-blade"] },
        { id: "skyreaver",         name: "Skyreaver",         count: "reste", loadout: ["shuriken-pistol", "corsair-blade"] }
      ],
      options: [
        { id: "felarch-pistol", model: "skyreaver-felarch", text: "Le shuriken pistol du Skyreaver Felarch peut être remplacé par 1 blast pistol ou 1 neuro disruptor.",
          replaces: ["shuriken-pistol"], choices: [["blast-pistol"], ["neuro-disruptor"]] },
        { id: "special", model: "skyreaver", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Skyreavers peuvent remplacer leur shuriken pistol et leur Corsair blade par 1 blaster, 1 flamer, 1 fusion gun ou 1 shredder, chacun avec 1 close combat weapon. Pas deux fois la même option (deux fois au maximum si l'unité compte 10 figurines).",
          replaces: ["shuriken-pistol", "corsair-blade"], max: { per: 5, count: 2 },
          choices: [["blaster", "close-combat-weapon"], ["flamer", "close-combat-weapon"], ["fusion-gun", "close-combat-weapon"], ["shredder", "close-combat-weapon"]] }
      ],
      abilities: [
        { name: "Raid and Run",
          text: "À la fin de la phase de Combat, si cette unité était éligible pour combattre à cette phase et n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de D3+3\" maximum. Sinon, si elle était éligible pour combattre à cette phase, elle peut Battre en Retraite de D3+3\" maximum." }
      ],
      composition: "1 Skyreaver Felarch et 4 à 9 Skyreavers"
    },

    {
      id: "corsair-voidscarred",
      name: "Corsair Voidscarred",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Grenades", "Anhrathe", "Corsair Voidscarred", "Asuryani"],
      keywordsNote: "Psyker : Way Seeker seulement.",
      stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 70 }] },
        { models: 10, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: ["scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "blaster", name: "Blaster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6+1", abilities: ["assault"] }] },
        { id: "executioner", name: "Executioner", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "3+", S: "6", AP: "-2", D: "D3", abilities: ["anti:Infanterie 2+", "psychic"] }] },
        { id: "fusion-pistol", name: "Fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6", abilities: ["assault", "melta:2", "pistol"] }] },
        { id: "long-rifle", name: "Long rifle", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "2", abilities: ["heavy", "precision"] }] },
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shredder", name: "Shredder", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "N/A", S: "6", AP: "0", D: "1", abilities: ["assault", "torrent"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "shuriken-rifle", name: "Shuriken rifle", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "rapid-fire:1"] }] },
        { id: "wraithcannon", name: "Wraithcannon", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "14", AP: "-4", D: "D6+1", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "paired-hekatarii-blades", name: "Paired Hekatarii blades", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "3", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] },
        { id: "witch-staff", name: "Witch staff", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "3", AP: "0", D: "D3", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      wargear: [
        { id: "channeller-stones", name: "Channeller stones" },
        { id: "faolchu", name: "Faolchú" },
        { id: "mistshield", name: "Mistshield" }
      ],
      // Shade Runner, Soul Weaver et Way Seeker (0-1 chacun) : pris en remplaçant
      // l'équipement d'un Corsair Voidscarred (options ci-dessous).
      models: [
        { id: "voidscarred-felarch", name: "Voidscarred Felarch",  count: 1,       loadout: ["shuriken-pistol", "power-sword", "close-combat-weapon"] },
        { id: "corsair-voidscarred", name: "Corsair Voidscarred", count: "reste", loadout: ["shuriken-pistol", "power-sword", "close-combat-weapon"] }
      ],
      options: [
        { id: "shade-runner", model: "corsair-voidscarred", text: "1 Corsair Voidscarred peut être remplacé par 1 Shade Runner (shuriken pistol, close combat weapon, paired Hekatarii blades).",
          replaces: ["power-sword"], choices: [["paired-hekatarii-blades"]], max: { count: 1 } },
        { id: "soul-weaver", model: "corsair-voidscarred", text: "1 Corsair Voidscarred peut être remplacé par 1 Soul Weaver (shuriken pistol, power sword, close combat weapon, channeller stones).",
          choices: [["channeller-stones"]], max: { count: 1 } },
        { id: "way-seeker", model: "corsair-voidscarred", text: "1 Corsair Voidscarred peut être remplacé par 1 Way Seeker (shuriken pistol, Executioner, close combat weapon, witch staff).",
          replaces: ["power-sword"], choices: [["executioner", "witch-staff"]], max: { count: 1 } },
        { id: "rifle", model: "corsair-voidscarred", text: "N'importe quel nombre de Corsair Voidscarred peuvent remplacer leur shuriken pistol et leur power sword par 1 shuriken rifle.",
          replaces: ["shuriken-pistol", "power-sword"], choices: [["shuriken-rifle"]] },
        { id: "felarch-pistol", model: "voidscarred-felarch", text: "Le shuriken pistol du Voidscarred Felarch peut être remplacé par 1 neuro disruptor ou 1 shuriken rifle.",
          replaces: ["shuriken-pistol"], choices: [["neuro-disruptor"], ["shuriken-rifle"]] },
        { id: "mistshield", model: "voidscarred-felarch", text: "Le Voidscarred Felarch peut être équipé de 1 mistshield.",
          choices: [["mistshield"]], max: { count: 1 } },
        { id: "special", model: "corsair-voidscarred", text: "Pour chaque tranche de 5 figurines, le shuriken rifle d'1 Corsair Voidscarred peut être remplacé par 1 blaster ou 1 shredder.",
          replaces: ["shuriken-rifle"], choices: [["blaster"], ["shredder"]], max: { per: 5, count: 1 } },
        { id: "heavy", model: "corsair-voidscarred", text: "Si l'unité compte 10 figurines, le shuriken rifle d'1 Corsair Voidscarred peut être remplacé par 1 shuriken cannon ou 1 wraithcannon.",
          replaces: ["shuriken-rifle"], choices: [["shuriken-cannon"], ["wraithcannon"]], max: { per: 10, count: 1 } },
        { id: "long-rifle", model: "corsair-voidscarred", text: "Si l'unité compte 10 figurines, le shuriken rifle d'1 Corsair Voidscarred peut être remplacé par 1 long rifle.",
          replaces: ["shuriken-rifle"], choices: [["long-rifle"]], max: { per: 10, count: 1 } },
        { id: "fusion-pistol", model: "corsair-voidscarred", text: "Si l'unité compte 10 figurines, la power sword d'1 Corsair Voidscarred peut être remplacée par 1 fusion pistol.",
          replaces: ["power-sword"], choices: [["fusion-pistol"]], max: { per: 10, count: 1 } },
        { id: "faolchu", model: "corsair-voidscarred", text: "1 Corsair Voidscarred équipé d'un shuriken pistol et d'une power sword peut être équipé de 1 Faolchú.",
          choices: [["faolchu"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Piratical Raiders",
          gameChoice: "Au début de la bataille, choisir l'unité ennemie visée par les Piratical Raiders.",
          text: "Au début de la bataille, choisissez 1 unité de l'armée adverse. Les armes des figurines de cette unité ont [TOUCHES FATALES] et [PRÉCISION] quand elles ciblent cette unité ennemie." },
        { name: "Channeller Stones", requiresWargear: "channeller-stones", usage: "une-fois-par-tour",
          text: "Une fois par tour, la première fois qu'un jet de sauvegarde est raté pour l'unité du porteur, réduisez à 0 les Dégâts de cette attaque." },
        { name: "Faolchú", requiresWargear: "faolchu",
          text: "Les armes de tir des figurines de l'unité du porteur ont [IGNORE LE COUVERT]." },
        { name: "Mistshield", requiresWargear: "mistshield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." }
      ],
      composition: "1 Voidscarred Felarch, 4 à 9 Corsair Voidscarred, 0-1 Shade Runner, 0-1 Soul Weaver et 0-1 Way Seeker (10 figurines au maximum)"
    },

    {
      id: "d-cannon-platform",
      name: "D-cannon Platform",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Frame", "Support Weapon", "D-cannon Platform", "Asuryani"],
      // Support Artillery : rejoint une unité de Guardian Defenders (js/regles-etendues.js)
      retinue: { joins: [["Guardian Defenders"]], label: "Guardian Defenders" },
      stats: { M: "7\"", T: 6, Sv: "4+", W: 5, Ld: "7+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 110 }, { from: 3, pts: 130 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "d-cannon", name: "D-cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "D3", skill: "3+", S: "16", AP: "-4", D: "D6+2", abilities: ["blast", "devastating-wounds", "indirect-fire"] }] },
        { id: "shuriken-catapult", name: "Shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["d-cannon", "shuriken-catapult", "close-combat-weapon"],
      abilities: [
        { name: "Support Artillery",
          text: "Au début de l'étape de Déclaration des Formations de Bataille, cette figurine peut rejoindre 1 unité GUARDIAN DEFENDERS de votre armée (une unité ne peut pas avoir plus d'une figurine SUPPORT WEAPON). Elle fait alors partie de cette unité GUARDIANS pour le reste de la bataille, et l'effectif initial de l'unité est augmenté d'autant. Cette figurine, et l'unité qu'elle rejoint, ne peuvent pas embarquer dans un TRANSPORT." },
        { name: "Support Weapon",
          text: "Chaque fois qu'une attaque cible l'unité de cette figurine, si l'unité contient une ou plusieurs autres figurines, cette figurine a une Endurance de 3 jusqu'à la résolution de l'attaque." },
        { name: "Structural Collapse",
          text: "Chaque fois que cette figurine attaque avec son D-cannon, relancez un jet de Dégâts de 1. Si l'attaque cible une unité TITANIC, vous pouvez relancer le jet de Dégâts à la place." }
      ],
      composition: "1 D-cannon Platform"
    },

    {
      id: "dark-reapers",
      name: "Dark Reapers",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Aspect Warriors", "Dark Reapers", "Asuryani"],
      stats: { M: "6\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Dark Reaper",        stats: { M: "6\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Dark Reaper Exarch", stats: { M: "6\"", T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 95 }] },
        { models: 10, costs: [{ from: 1, pts: 200 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "2+", S: "10", AP: "-2", D: "D6", abilities: ["ignores-cover"] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "2+", S: "4",  AP: "-1", D: "1",  abilities: ["blast", "ignores-cover"] }
          ] },
        { id: "reaper-launcher", name: "Reaper launcher", type: "ranged",
          profiles: [
            { name: "starshot",  range: "48\"", A: "1", skill: "3+", S: "10", AP: "-2", D: "3", abilities: ["ignores-cover"] },
            { name: "starswarm", range: "48\"", A: "2", skill: "3+", S: "5",  AP: "-2", D: "1", abilities: ["ignores-cover"] }
          ] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["ignores-cover", "lethal-hits"] }] },
        { id: "tempest-launcher", name: "Tempest launcher", type: "ranged",
          profiles: [{ range: "36\"", A: "2D6", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["blast", "indirect-fire"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "dark-reaper-exarch", name: "Dark Reaper Exarch", count: 1,       loadout: ["reaper-launcher", "close-combat-weapon"] },
        { id: "dark-reaper",        name: "Dark Reaper",        count: "reste", loadout: ["reaper-launcher", "close-combat-weapon"] }
      ],
      options: [
        { id: "exarch", model: "dark-reaper-exarch", text: "Le Reaper launcher du Dark Reaper Exarch peut être remplacé par 1 missile launcher, 1 shuriken cannon ou 1 tempest launcher.",
          replaces: ["reaper-launcher"], choices: [["missile-launcher"], ["shuriken-cannon"], ["tempest-launcher"]] }
      ],
      abilities: [
        { name: "Inescapable Accuracy",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir, vous pouvez ignorer tout ou partie des modificateurs à la CT de l'arme et au jet de touche." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Dark Reaper Exarch et 4 à 9 Dark Reapers"
    },

    {
      id: "dire-avengers",
      name: "Dire Avengers",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Grenades", "Aspect Warriors", "Dire Avengers", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Dire Avenger",        stats: { M: "7\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Dire Avenger Exarch", stats: { M: "7\"", T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 70 }] },
        { models: 10, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "avenger-shuriken-catapult", name: "Avenger shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "4", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "diresword", name: "Diresword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] },
        { id: "power-glaive", name: "Power glaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-3", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "shimmershield", name: "Shimmershield" }],
      models: [
        { id: "dire-avenger-exarch", name: "Dire Avenger Exarch", count: 1,       loadout: ["avenger-shuriken-catapult", "close-combat-weapon"] },
        { id: "dire-avenger",        name: "Dire Avenger",        count: "reste", loadout: ["avenger-shuriken-catapult", "close-combat-weapon"] }
      ],
      options: [
        { id: "exarch-melee", model: "dire-avenger-exarch", text: "L'Avenger shuriken catapult du Dire Avenger Exarch peut être remplacé par 1 shuriken pistol et 1 diresword, ou 1 shuriken pistol et 1 power glaive.",
          replaces: ["avenger-shuriken-catapult"], choices: [["shuriken-pistol", "diresword"], ["shuriken-pistol", "power-glaive"]] },
        { id: "exarch-twin", model: "dire-avenger-exarch", requiresWeapon: "avenger-shuriken-catapult", text: "Si le Dire Avenger Exarch est équipé de 1 Avenger shuriken catapult, il peut être équipé de 1 Avenger shuriken catapult supplémentaire.",
          choices: [["avenger-shuriken-catapult"]], max: { count: 1 } },
        { id: "exarch-shield", model: "dire-avenger-exarch", text: "Le shuriken pistol du Dire Avenger Exarch peut être remplacé par 1 shimmershield.",
          replaces: ["shuriken-pistol"], choices: [["shimmershield"]] }
      ],
      abilities: [
        { name: "Bladestorm",
          text: "Les armes de tir des figurines de cette unité ont [TOUCHES SOUTENUES 1] quand elles ciblent une unité ennemie à mi-portée ou moins." },
        { name: "Shimmershield", requiresWargear: "shimmershield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Dire Avenger Exarch et 4 à 9 Dire Avengers"
    },

    {
      id: "fire-dragons",
      name: "Fire Dragons",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Grenades", "Aspect Warriors", "Fire Dragons", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Fire Dragon",        stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Fire Dragon Exarch", stats: { M: "7\"", T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 110 }, { from: 3, pts: 120 }] },
        { models: 10, costs: [{ from: 1, pts: 240 }, { from: 3, pts: 250 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "dragon-fusion-gun", name: "Dragon fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3"] }] },
        { id: "dragon-fusion-pistol", name: "Dragon fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:3", "pistol"] }] },
        { id: "dragons-breath-flamer", name: "Dragon's breath flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+2", skill: "N/A", S: "6", AP: "-2", D: "1", abilities: ["assault", "ignores-cover", "torrent"] }] },
        { id: "exarchs-dragon-fusion-gun", name: "Exarch's Dragon fusion gun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["assault", "melta:6"] }] },
        { id: "firepike", name: "Firepike", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "3+", S: "12", AP: "-4", D: "D6", abilities: ["assault", "melta:3"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "dragon-axe", name: "Dragon axe", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-4", D: "D6", abilities: [] }] }
      ],
      models: [
        { id: "fire-dragon-exarch", name: "Fire Dragon Exarch", count: 1,       loadout: ["exarchs-dragon-fusion-gun", "close-combat-weapon"] },
        { id: "fire-dragon",        name: "Fire Dragon",        count: "reste", loadout: ["dragon-fusion-gun", "close-combat-weapon"] }
      ],
      options: [
        { id: "exarch", model: "fire-dragon-exarch", text: "L'Exarch's Dragon fusion gun du Fire Dragon Exarch peut être remplacé par 1 Dragon's breath flamer, 1 Dragon fusion pistol et 1 Dragon axe, ou 1 firepike.",
          replaces: ["exarchs-dragon-fusion-gun"], choices: [["dragons-breath-flamer"], ["dragon-fusion-pistol", "dragon-axe"], ["firepike"]] }
      ],
      abilities: [
        { name: "Assured Destruction",
          text: "À votre phase de Tir, chaque fois qu'une figurine de cette unité fait une attaque de tir qui cible une unité MONSTER ou VEHICLE, vous pouvez relancer le jet de touche, le jet de blessure et le jet de Dégâts." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Fire Dragon Exarch et 4 à 9 Fire Dragons"
    },

    {
      id: "howling-banshees",
      name: "Howling Banshees",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Aspect Warriors", "Howling Banshees", "Asuryani"],
      stats: { M: "8\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Howling Banshee",        stats: { M: "8\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Howling Banshee Exarch", stats: { M: "8\"", T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 85 }] },
        { models: 10, costs: [{ from: 1, pts: 165 }] }
      ],
      coreAbilities: ["fights-first"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "triskele", name: "Triskele", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "3+", S: "3", AP: "-1", D: "1", abilities: ["anti:Infanterie 3+", "assault"] }] },
        { id: "banshee-blade", name: "Banshee blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "2+", S: "4", AP: "-2", D: "2", abilities: ["anti:Infanterie 3+"] }] },
        { id: "executioner", name: "Executioner", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "6", AP: "-3", D: "3", abilities: ["anti:Infanterie 3+"] }] },
        { id: "mirrorswords", name: "Mirrorswords", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "4", AP: "-2", D: "2", abilities: ["anti:Infanterie 3+"] }] },
        { id: "triskele-melee", name: "Triskele", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "3", AP: "-1", D: "1", abilities: ["anti:Infanterie 3+"] }] }
      ],
      models: [
        { id: "howling-banshee-exarch", name: "Howling Banshee Exarch", count: 1,       loadout: ["shuriken-pistol", "banshee-blade"] },
        { id: "howling-banshee",        name: "Howling Banshee",        count: "reste", loadout: ["shuriken-pistol", "banshee-blade"] }
      ],
      options: [
        { id: "exarch-blade", model: "howling-banshee-exarch", group: "exarch", text: "La Banshee blade du Howling Banshee Exarch peut être remplacée par 1 executioner ou 1 triskele…",
          replaces: ["banshee-blade"], choices: [["executioner"], ["triskele", "triskele-melee"]] },
        { id: "exarch-mirror", model: "howling-banshee-exarch", group: "exarch", text: "…ou son shuriken pistol et sa Banshee blade peuvent être remplacés par 1 mirrorswords.",
          replaces: ["shuriken-pistol", "banshee-blade"], choices: [["mirrorswords"]] }
      ],
      abilities: [
        { name: "Sauvegarde invulnérable",
          text: "La sauvegarde invulnérable de ces figurines est de 5+, et de 4+ contre les attaques de mêlée." },
        { name: "Acrobatic",
          text: "Cette unité est éligible pour déclarer une charge à un tour où elle a Avancé ou Battu en Retraite." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Howling Banshee Exarch et 4 à 9 Howling Banshees"
    },

    {
      id: "rangers",
      name: "Rangers",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Rangers", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "5+", W: 1, Ld: "7+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 60 }] },
        { models: 10, costs: [{ from: 1, pts: 110 }] }
      ],
      coreAbilities: ["infiltrators", "stealth"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "long-rifle", name: "Long rifle", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "2", abilities: ["heavy", "precision"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["long-rifle", "shuriken-pistol", "close-combat-weapon"],
      abilities: [
        { name: "Sauvegarde invulnérable",
          text: "La sauvegarde invulnérable de 5+ de ces figurines ne s'applique qu'aux attaques de tir." },
        { name: "Path of the Outcast",
          text: "À la phase de Mouvement adverse, si une unité ennemie finit un mouvement à 8\" ou moins de cette unité, et si cette unité n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de D6\" maximum." }
      ],
      composition: "5 à 10 Rangers"
    },

    {
      id: "shadow-weaver-platform",
      name: "Shadow Weaver Platform",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Frame", "Support Weapon", "Shadow Weaver Platform", "Asuryani"],
      // Support Artillery : rejoint une unité de Guardian Defenders (js/regles-etendues.js)
      retinue: { joins: [["Guardian Defenders"]], label: "Guardian Defenders" },
      stats: { M: "7\"", T: 6, Sv: "4+", W: 5, Ld: "7+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "shadow-weaver", name: "Shadow weaver", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+2", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["blast", "indirect-fire"] }] },
        { id: "shuriken-catapult", name: "Shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["shadow-weaver", "shuriken-catapult", "close-combat-weapon"],
      abilities: [
        { name: "Support Artillery",
          text: "Au début de l'étape de Déclaration des Formations de Bataille, cette figurine peut rejoindre 1 unité GUARDIAN DEFENDERS de votre armée (une unité ne peut pas avoir plus d'une figurine SUPPORT WEAPON). Elle fait alors partie de cette unité GUARDIANS pour le reste de la bataille, et l'effectif initial de l'unité est augmenté d'autant. Cette figurine, et l'unité qu'elle rejoint, ne peuvent pas embarquer dans un TRANSPORT." },
        { name: "Support Weapon",
          text: "Chaque fois qu'une attaque cible l'unité de cette figurine, si l'unité contient une ou plusieurs autres figurines, cette figurine a une Endurance de 3 jusqu'à la résolution de l'attaque." },
        { name: "Monofilament Snare",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs attaques de son shadow weaver. Jusqu'au début de votre prochain tour, elle est prise au piège : chaque fois qu'elle fait un Mouvement Normal, une Avance ou une Retraite, lancez 1D6 par figurine de l'unité ; pour chaque 1, elle subit 1 blessure mortelle." }
      ],
      composition: "1 Shadow Weaver Platform"
    },

    {
      id: "striking-scorpions",
      name: "Striking Scorpions",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Aspect Warriors", "Striking Scorpions", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Striking Scorpion",        stats: { M: "7\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Striking Scorpion Exarch", stats: { M: "7\"", T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 75 }] },
        { models: 10, costs: [{ from: 1, pts: 145 }] }
      ],
      coreAbilities: ["infiltrators", "scouts:7\"", "stealth"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "chainsabres", name: "Chainsabres", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol", "twin-linked"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "biting-blade", name: "Biting blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-3", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "chainsabres-melee", name: "Chainsabres", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1", "twin-linked"] }] },
        { id: "scorpion-chainsword", name: "Scorpion chainsword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "scorpions-claw", name: "Scorpion's claw", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "striking-scorpion-exarch", name: "Striking Scorpion Exarch", count: 1,       loadout: ["shuriken-pistol", "scorpion-chainsword", "scorpions-claw"] },
        { id: "striking-scorpion",        name: "Striking Scorpion",        count: "reste", loadout: ["shuriken-pistol", "scorpion-chainsword"] }
      ],
      options: [
        { id: "exarch", model: "striking-scorpion-exarch", text: "Le shuriken pistol, la Scorpion chainsword et la Scorpion's claw du Striking Scorpion Exarch peuvent être remplacés par 1 biting blade et 1 shuriken pistol, ou 1 chainsabres.",
          replaces: ["shuriken-pistol", "scorpion-chainsword", "scorpions-claw"], choices: [["biting-blade", "shuriken-pistol"], ["chainsabres", "chainsabres-melee"]] }
      ],
      abilities: [
        { name: "Mandiblasters",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée, si elle a fait un mouvement de Charge à ce tour, un jet de touche non modifié de 5+ est une Touche Critique." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Striking Scorpion Exarch et 4 à 9 Striking Scorpions"
    },

    {
      id: "swooping-hawks",
      name: "Swooping Hawks",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Aeldari", "Jump Pack", "Fly", "Grenades", "Aspect Warriors", "Swooping Hawks", "Asuryani"],
      stats: { M: "14\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Swooping Hawk",        stats: { M: "14\"", T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Swooping Hawk Exarch", stats: { M: "14\"", T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 95 },  { from: 3, pts: 110 }] },
        { models: 10, costs: [{ from: 1, pts: 190 }, { from: 3, pts: 205 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "exarchs-lasblaster", name: "Exarch's lasblaster", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["assault", "lethal-hits"] }] },
        { id: "hawks-talon", name: "Hawk's talon", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "6", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "lasblaster", name: "Lasblaster", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["assault", "lethal-hits"] }] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "sunpistol", name: "Sunpistol", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["assault", "lethal-hits", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "-2", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "swooping-hawk-exarch", name: "Swooping Hawk Exarch", count: 1,       loadout: ["hawks-talon", "close-combat-weapon"] },
        { id: "swooping-hawk",        name: "Swooping Hawk",        count: "reste", loadout: ["lasblaster", "close-combat-weapon"] }
      ],
      options: [
        { id: "exarch", model: "swooping-hawk-exarch", text: "Le Hawk's talon du Swooping Hawk Exarch peut être remplacé par 1 Exarch's lasblaster, 1 sunpistol et 1 power sword, ou 1 scatter laser.",
          replaces: ["hawks-talon"], choices: [["exarchs-lasblaster"], ["sunpistol", "power-sword"], ["scatter-laser"]] }
      ],
      abilities: [
        { name: "Grenade Pack Flyover", usage: "une-fois-par-tour",
          text: "Une fois par tour, à votre phase de Mouvement, quand cette unité est placée sur le champ de bataille ou finit un Mouvement Normal, une Avance ou une Retraite, elle peut utiliser cette aptitude : choisissez 1 unité ennemie à 8\" ou moins d'elle et visible, puis lancez 1D6 par figurine SWOOPING HAWKS de l'unité ; pour chaque 4+, cette unité ennemie subit 1 blessure mortelle (6 au maximum). Jusqu'à la fin du tour, vous ne pouvez pas cibler cette unité avec le stratagème Explosifs." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Swooping Hawk Exarch et 4 à 9 Swooping Hawks"
    },

    {
      id: "troupe",
      name: "Troupe",
      category: "infantry",
      base: "25mm",
      keywords: ["Infantry", "Aeldari", "Grenades", "Troupe", "Harlequins"],
      stats: { M: "8\"", T: 3, Sv: "6+", W: 1, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 85 }] },
        { models: 6,  costs: [{ from: 1, pts: 100 }] },
        { models: 11, costs: [{ from: 1, pts: 190 }] },
        { models: 12, costs: [{ from: 1, pts: 205 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "fusion-pistol", name: "Fusion pistol", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "8", AP: "-4", D: "D6", abilities: ["assault", "melta:2", "pistol"] }] },
        { id: "neuro-disruptor", name: "Neuro disruptor", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["anti:Infanterie 2+", "assault", "pistol"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "harlequins-blade", name: "Harlequin's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "3", AP: "-1", D: "1", abilities: ["devastating-wounds"] }] },
        { id: "harlequins-special-weapon", name: "Harlequin's special weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["devastating-wounds"] }] },
        { id: "power-sword", name: "Power sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "flip-belt", name: "Flip belt" }],
      models: [
        { id: "lead-player", name: "Lead Player", count: 1,       loadout: ["shuriken-pistol", "harlequins-blade", "flip-belt"] },
        { id: "player",      name: "Player",      count: "reste", loadout: ["shuriken-pistol", "harlequins-blade", "flip-belt"] }
      ],
      options: [
        { id: "special", text: "N'importe quel nombre de figurines peuvent remplacer leur Harlequin's blade par 1 Harlequin's special weapon.",
          replaces: ["harlequins-blade"], choices: [["harlequins-special-weapon"]] },
        { id: "lead-sword", model: "lead-player", text: "La Harlequin's blade du Lead Player peut être remplacée par 1 power sword.",
          replaces: ["harlequins-blade"], choices: [["power-sword"]] },
        { id: "neuro", text: "Jusqu'à 2 figurines (4 si l'unité compte 10 figurines ou plus) peuvent remplacer leur shuriken pistol par 1 neuro disruptor.",
          replaces: ["shuriken-pistol"], choices: [["neuro-disruptor"]], max: { per: 5, count: 2 } },
        { id: "fusion", text: "Jusqu'à 2 figurines (4 si l'unité compte 10 figurines ou plus) peuvent remplacer leur shuriken pistol par 1 fusion pistol.",
          replaces: ["shuriken-pistol"], choices: [["fusion-pistol"]], max: { per: 5, count: 2 } }
      ],
      abilities: [
        { name: "Dance of Death",
          gameChoice: "Au début de la phase de Combat, choisir l'aptitude de la Troupe.",
          text: "Au début de la phase de Combat, choisissez une des aptitudes suivantes : cette unité l'a jusqu'à la fin de la phase.\n• Hero's Prowess : chaque fois qu'une figurine de cette unité attaque, relancez un jet de touche de 1.\n• Villain's Doom : chaque fois qu'une figurine de cette unité attaque, ajoutez 1 au jet de blessure.\n• Trickster's Grace : chaque fois qu'une attaque cible cette unité, soustrayez 1 au jet de touche." },
        { name: "Flip Belt", requiresWargear: "flip-belt",
          text: "Chaque fois que l'unité du porteur fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue." }
      ],
      composition: "1 Lead Player et 4 à 11 Players"
    },

    {
      id: "vibro-cannon-platform",
      name: "Vibro Cannon Platform",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Frame", "Support Weapon", "Vibro Cannon Platform", "Asuryani"],
      // Support Artillery : rejoint une unité de Guardian Defenders (js/regles-etendues.js)
      retinue: { joins: [["Guardian Defenders"]], label: "Guardian Defenders" },
      stats: { M: "7\"", T: 6, Sv: "4+", W: 5, Ld: "7+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "shuriken-catapult", name: "Shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "vibro-cannon", name: "Vibro cannon", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "9", AP: "-1", D: "2", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["vibro-cannon", "shuriken-catapult", "close-combat-weapon"],
      abilities: [
        { name: "Support Artillery",
          text: "Au début de l'étape de Déclaration des Formations de Bataille, cette figurine peut rejoindre 1 unité GUARDIAN DEFENDERS de votre armée (une unité ne peut pas avoir plus d'une figurine SUPPORT WEAPON). Elle fait alors partie de cette unité GUARDIANS pour le reste de la bataille, et l'effectif initial de l'unité est augmenté d'autant. Cette figurine, et l'unité qu'elle rejoint, ne peuvent pas embarquer dans un TRANSPORT." },
        { name: "Support Weapon",
          text: "Chaque fois qu'une attaque cible l'unité de cette figurine, si l'unité contient une ou plusieurs autres figurines, cette figurine a une Endurance de 3 jusqu'à la résolution de l'attaque." },
        { name: "Sonic Destruction",
          text: "À votre phase de Tir, chaque fois que cette figurine attaque une unité ennemie avec son vibro cannon, améliorez de 1 la Force, la Pénétration d'Armure et les Dégâts de l'attaque pour chaque autre figurine VIBRO CANNON PLATFORM amie qui a attaqué cette même unité ennemie avec son vibro cannon à cette phase." }
      ],
      composition: "1 Vibro Cannon Platform"
    },

    {
      id: "warlock-conclave",
      name: "Warlock Conclave",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Aeldari", "Psyker", "Warlocks", "Warlock Conclave", "Asuryani"],
      stats: { M: "7\"", T: 3, Sv: "6+", W: 2, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 2, costs: [{ from: 1, pts: 55 }] },
        { models: 4, costs: [{ from: 1, pts: 110 }] }
      ],
      leader: { type: "support", canLead: ["Guardian Defenders", "Storm Guardians"] },
      coreAbilities: ["support"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "destructor", name: "Destructor", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["psychic", "torrent"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "singing-spear", name: "Singing spear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "0", D: "3", abilities: ["assault", "psychic"] }] },
        { id: "singing-spear-melee", name: "Singing spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "3", abilities: ["psychic"] }] },
        { id: "witchblade", name: "Witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["destructor", "shuriken-pistol", "witchblade"],
      options: [
        { id: "spear", text: "N'importe quel nombre de figurines peuvent remplacer leur witchblade par 1 singing spear.",
          replaces: ["witchblade"], choices: [["singing-spear", "singing-spear-melee"]] }
      ],
      abilities: [
        { name: "Protect (Psychic)",
          text: "Tant qu'une figurine FARSEER mène cette unité, chaque fois qu'une attaque cible cette unité, soustrayez 1 au jet de blessure." },
        { name: "Psychic Communion (Psychic)",
          text: "Chaque fois que cette unité est choisie pour tirer, pour chaque figurine WARLOCK de l'unité, jusqu'à la fin de la phase, ajoutez 1 aux Attaques et à la Force de son Destructor pour chaque autre figurine AELDARI PSYKER amie à 6\" ou moins d'elle (+2 au maximum)." }
      ],
      composition: "2 à 4 Warlocks"
    },

    {
      id: "warp-spiders",
      name: "Warp Spiders",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Aeldari", "Jump Pack", "Fly", "Aspect Warriors", "Warp Spiders", "Asuryani"],
      stats: { M: "12\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" },
      statLines: [
        { label: "Warp Spider",        stats: { M: "12\"", T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1, InSv: "5+" } },
        { label: "Warp Spider Exarch", stats: { M: "12\"", T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1, InSv: "5+" } }
      ],
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 105 }, { from: 3, pts: 125 }] },
        { models: 10, costs: [{ from: 1, pts: 200 }, { from: 3, pts: 220 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "death-spinner", name: "Death spinner", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "death-weavers", name: "Death weavers", type: "ranged",
          profiles: [{ range: "6\"", A: "D6", skill: "N/A", S: "4", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent", "twin-linked"] }] },
        { id: "exarchs-death-spinner", name: "Exarch's death spinner", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "6", AP: "-2", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "spinneret-rifle", name: "Spinneret rifle", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "powerblade-array", name: "Powerblade array", type: "melee",
          profiles: [{ range: "Mêlée", A: "10", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["lethal-hits", "twin-linked"] }] },
        { id: "powerblades", name: "Powerblades", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "-2", D: "1", abilities: ["lethal-hits", "twin-linked"] }] }
      ],
      models: [
        { id: "warp-spider-exarch", name: "Warp Spider Exarch", count: 1,       loadout: ["exarchs-death-spinner", "close-combat-weapon"] },
        { id: "warp-spider",        name: "Warp Spider",        count: "reste", loadout: ["death-spinner", "close-combat-weapon"] }
      ],
      options: [
        { id: "exarch", model: "warp-spider-exarch", text: "L'Exarch's death spinner du Warp Spider Exarch peut être remplacé par 1 spinneret rifle et 1 death weavers, 1 powerblades et 1 death weavers, ou 1 powerblade array.",
          replaces: ["exarchs-death-spinner"], choices: [["spinneret-rifle", "death-weavers"], ["powerblades", "death-weavers"], ["powerblade-array"]] }
      ],
      abilities: [
        { name: "Flickerjump",
          text: "À votre phase de Mouvement, chaque fois que cette unité est choisie pour faire un Mouvement Normal, elle peut utiliser cette aptitude. Dans ce cas, jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge et ses figurines ont un Mouvement de 24\". À la fin de la phase, lancez 1D6 par figurine de l'unité : pour chaque 1, l'unité subit 1 blessure mortelle." },
        { name: "Aspect Shrine Token", usage: "une-fois-par-bataille",
          text: "1 pion de Temple Aspect par tranche de 5 figurines. Une fois par bataille par pion, vous pouvez changer le résultat d'un jet de touche ou de blessure fait pour une figurine de cette unité (sauf CHARACTER) en 6 non modifié. Retirez un pion à chaque utilisation." }
      ],
      composition: "1 Warp Spider Exarch et 4 à 9 Warp Spiders"
    },

    {
      id: "wraithblades",
      name: "Wraithblades",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Wraith Construct", "Wraithblades", "Asuryani"],
      stats: { M: "6\"", T: 6, Sv: "2+", W: 3, Ld: "8+", OC: 1 },
      sizes: [{ models: 5, costs: [{ from: 1, pts: 140 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "ghostaxe", name: "Ghostaxe", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "7", AP: "-2", D: "2", abilities: [] }] },
        { id: "ghostswords", name: "Ghostswords", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "4+", S: "5", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "forceshield", name: "Forceshield" }],
      loadout: ["ghostswords"],
      options: [
        { id: "axe", text: "Toutes les figurines de cette unité peuvent remplacer leurs ghostswords par 1 ghostaxe et 1 forceshield.",
          allModels: true, replaces: ["ghostswords"], choices: [["ghostaxe", "forceshield"]] }
      ],
      abilities: [
        { name: "Malevolent Souls",
          text: "Chaque fois qu'une figurine de cette unité est détruite par une attaque de mêlée, si elle n'a pas combattu à cette phase, lancez 1D6 : sur 3+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée." },
        { name: "Psychic Guidance",
          text: "Tant que cette unité est à 12\" ou moins d'une ou plusieurs figurines AELDARI PSYKER amies, ses figurines ont un Commandement de 6+, et chaque fois qu'une de ses figurines attaque, ajoutez 1 au jet de touche." },
        { name: "Forceshield", requiresWargear: "forceshield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." }
      ],
      composition: "5 Wraithblades"
    },

    {
      id: "wraithguard",
      name: "Wraithguard",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Aeldari", "Wraith Construct", "Wraithguard", "Asuryani"],
      stats: { M: "6\"", T: 6, Sv: "2+", W: 3, Ld: "8+", OC: 1 },
      sizes: [{ models: 5, costs: [{ from: 1, pts: 145 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "wraithcannon", name: "Wraithcannon", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "4+", S: "14", AP: "-4", D: "D6+1", abilities: [] }] },
        { id: "d-scythe", name: "D-scythe", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "7", AP: "-3", D: "1", abilities: ["torrent"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["wraithcannon", "close-combat-weapon"],
      options: [
        { id: "scythe", text: "Toutes les figurines de cette unité peuvent remplacer leur wraithcannon par 1 D-scythe.",
          allModels: true, replaces: ["wraithcannon"], choices: [["d-scythe"]] }
      ],
      abilities: [
        { name: "War Construct",
          text: "Cette unité est éligible pour tirer à un tour où elle a Battu en Retraite." },
        { name: "Psychic Guidance",
          text: "Tant que cette unité est à 12\" ou moins d'une ou plusieurs figurines AELDARI PSYKER amies, ses figurines ont un Commandement de 6+, et chaque fois qu'une de ses figurines attaque, ajoutez 1 au jet de touche." }
      ],
      composition: "5 Wraithguard"
    },
    /* ---------- Montés ---------- */

    {
      id: "dragon-knights",
      name: "Dragon Knights",
      category: "mounted",
      base: "75 x 42mm",
      keywords: ["Mounted", "Aeldari", "Exodite", "Mobile", "Dragon Knights", "Asuryani"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 2 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 85 },  { from: 3, pts: 95 }] },
        { models: 6, costs: [{ from: 1, pts: 180 }, { from: 3, pts: 190 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "laser-lance", name: "Laser Lance", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "6", AP: "-2", D: "3", abilities: ["assault"] }] },
        { id: "solar-carbine", name: "Solar Carbine", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "drakesteed-fangs-and-talons", name: "Drakesteed Fangs and Talons", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "laser-lance-melee", name: "Laser Lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-2", D: "3", abilities: ["lance"] }] }
      ],
      wargear: [{ id: "drakolithe", name: "Drakolithe" }],
      models: [
        { id: "dragon-knight-leader", name: "Dragon Knight Leader", count: 1,       loadout: ["drakesteed-fangs-and-talons", "laser-lance", "laser-lance-melee", "solar-carbine"] },
        { id: "dragon-knight",        name: "Dragon Knight",        count: "reste", loadout: ["drakesteed-fangs-and-talons", "laser-lance", "laser-lance-melee", "solar-carbine"] }
      ],
      options: [
        { id: "drakolithe", text: "Pour chaque tranche de 3 figurines, l'unité peut être équipée de 2 Drakolithe.",
          choices: [["drakolithe", "drakolithe"]], max: { per: 3, count: 1 } }
      ],
      abilities: [
        { name: "On the Hunt",
          text: "Quand cette unité est choisie pour Battre en Retraite, cela ne l'empêche pas d'être éligible pour tirer et pour déclarer une charge." },
        { name: "Agile Reach",
          text: "Quand cette unité est choisie pour combattre, les armes de mêlée de ses figurines non engagées qui sont à 3\" ou moins d'une unité ennemie engagée avec cette unité peuvent cibler cette unité ennemie." },
        { name: "Drakolithe", requiresWargear: "drakolithe",
          text: "Une fois par bataille et par pion Drakolithe : quand une unité ennemie finit un mouvement à 8\" ou moins de cette unité, si cette unité n'est pas engagée ou si l'unité ennemie a fini ce mouvement engagée avec elle, vous pouvez utiliser cette aptitude. Lancez 1D6 : sur 3+, cette unité ennemie subit 1 blessure mortelle. Retirez un pion Drakolithe à chaque utilisation." }
      ],
      composition: "1 Dragon Knight Leader et 2 à 5 Dragon Knights"
    },

    {
      id: "shining-spears",
      name: "Shining Spears",
      category: "mounted",
      base: "60mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Aspect Warriors", "Shining Spears", "Asuryani"],
      stats: { M: "14\"", T: 4, Sv: "3+", W: 2, Ld: "6+", OC: 2, InSv: "5+" },
      statLines: [
        { label: "Shining Spear",        stats: { M: "14\"", T: 4, Sv: "3+", W: 2, Ld: "6+", OC: 2, InSv: "5+" } },
        { label: "Shining Spear Exarch", stats: { M: "14\"", T: 4, Sv: "3+", W: 3, Ld: "6+", OC: 2, InSv: "5+" } }
      ],
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 100 }] },
        { models: 6, costs: [{ from: 1, pts: 200 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "laser-lance", name: "Laser lance", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "6", AP: "-2", D: "3", abilities: ["assault"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "star-lance", name: "Star lance", type: "ranged",
          profiles: [{ range: "6\"", A: "1", skill: "3+", S: "9", AP: "-3", D: "3", abilities: ["assault"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "laser-lance-melee", name: "Laser lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-2", D: "3", abilities: ["anti:Monstre 3+", "anti:Véhicule 3+", "lance"] }] },
        { id: "paragon-sabre", name: "Paragon sabre", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "star-lance-melee", name: "Star lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-3", D: "3", abilities: ["anti:Monstre 3+", "anti:Véhicule 3+", "lance"] }] }
      ],
      wargear: [{ id: "shimmershield", name: "Shimmershield" }],
      models: [
        { id: "shining-spear-exarch", name: "Shining Spear Exarch", count: 1,       loadout: ["laser-lance", "laser-lance-melee", "twin-shuriken-catapult"] },
        { id: "shining-spear",        name: "Shining Spear",        count: "reste", loadout: ["laser-lance", "laser-lance-melee", "twin-shuriken-catapult"] }
      ],
      options: [
        { id: "exarch-lance", model: "shining-spear-exarch", text: "La laser lance du Shining Spear Exarch peut être remplacée par 1 paragon sabre ou 1 star lance.",
          replaces: ["laser-lance", "laser-lance-melee"], choices: [["paragon-sabre"], ["star-lance", "star-lance-melee"]] },
        { id: "exarch-cannon", model: "shining-spear-exarch", text: "Le twin shuriken catapult du Shining Spear Exarch peut être remplacé par 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["shuriken-cannon"]] },
        { id: "exarch-shield", model: "shining-spear-exarch", text: "Le Shining Spear Exarch peut être équipé de 1 shimmershield.",
          choices: [["shimmershield"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Extreme Mobility",
          text: "Chaque fois que cette unité fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, ignorez la distance verticale pour calculer la distance totale parcourue par ses figurines." },
        { name: "Shimmershield", requiresWargear: "shimmershield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." }
      ],
      composition: "1 Shining Spear Exarch et 2 à 5 Shining Spears"
    },

    {
      id: "shroud-runners",
      name: "Shroud Runners",
      category: "mounted",
      base: "60mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Shroud Runners", "Asuryani"],
      stats: { M: "14\"", T: 4, Sv: "5+", W: 3, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 90 }] },
        { models: 6, costs: [{ from: 1, pts: 165 }] }
      ],
      coreAbilities: ["scouts:9\"", "stealth"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "long-rifle", name: "Long rifle", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "2", abilities: ["precision"] }] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "2+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["long-rifle", "scatter-laser", "shuriken-pistol", "close-combat-weapon"],
      abilities: [
        { name: "Sauvegarde invulnérable",
          text: "La sauvegarde invulnérable de 5+ de ces figurines ne s'applique qu'aux attaques de tir." },
        { name: "Target Acquisition",
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs attaques de long rifle : jusqu'à la fin de la phase, elle ne peut pas avoir le Bénéfice du Couvert." }
      ],
      composition: "3 à 6 Shroud Runners"
    },

    {
      id: "skyweavers",
      name: "Skyweavers",
      category: "mounted",
      base: "60mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Smoke", "Skyweavers", "Harlequins"],
      stats: { M: "14\"", T: 4, Sv: "4+", W: 3, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [
        { models: 2, costs: [{ from: 1, pts: 90 }] },
        { models: 4, costs: [{ from: 1, pts: 180 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "skyweaver-haywire-cannon", name: "Skyweaver haywire cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "3", AP: "-1", D: "3", abilities: ["anti:Véhicule 4+", "devastating-wounds"] }] },
        { id: "star-bolas", name: "Star bolas", type: "ranged",
          profiles: [{ range: "12\"", A: "D3", skill: "3+", S: "7", AP: "-2", D: "2", abilities: [] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "zephyrglaive", name: "Zephyrglaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["shuriken-cannon", "star-bolas", "close-combat-weapon"],
      options: [
        { id: "haywire", text: "N'importe quel nombre de figurines peuvent remplacer leur shuriken cannon par 1 Skyweaver haywire cannon.",
          replaces: ["shuriken-cannon"], choices: [["skyweaver-haywire-cannon"]] },
        { id: "glaive", text: "N'importe quel nombre de figurines peuvent remplacer leurs star bolas par 1 zephyrglaive.",
          replaces: ["star-bolas"], choices: [["zephyrglaive"]] }
      ],
      abilities: [
        { name: "Acrobatic Grace",
          text: "Cette unité a l'aptitude Discrétion. Chaque fois qu'une attaque de mêlée cible cette unité, soustrayez 1 au jet de touche." }
      ],
      composition: "2 à 4 Skyweavers"
    },

    {
      id: "warlock-skyrunners",
      name: "Warlock Skyrunners",
      category: "mounted",
      base: "32mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Psyker", "Warlocks", "Warlock Skyrunners", "Asuryani"],
      stats: { M: "14\"", T: 4, Sv: "6+", W: 3, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 45 }] },
        { models: 2, costs: [{ from: 1, pts: 90 }] }
      ],
      leader: { type: "support", canLead: ["Windriders"] },
      coreAbilities: ["support"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "destructor", name: "Destructor", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["psychic", "torrent"] }] },
        { id: "shuriken-pistol", name: "Shuriken pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "pistol"] }] },
        { id: "singing-spear", name: "Singing spear", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "0", D: "3", abilities: ["assault", "psychic"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "singing-spear-melee", name: "Singing spear", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "3", abilities: ["psychic"] }] },
        { id: "witchblade", name: "Witchblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "3", AP: "0", D: "2", abilities: ["anti:Infanterie 2+", "psychic"] }] }
      ],
      loadout: ["destructor", "shuriken-pistol", "twin-shuriken-catapult", "witchblade"],
      options: [
        { id: "spear", text: "N'importe quel nombre de figurines peuvent remplacer leur witchblade par 1 singing spear.",
          replaces: ["witchblade"], choices: [["singing-spear", "singing-spear-melee"]] }
      ],
      abilities: [
        { name: "Runes of Battle (Psychic)",
          text: "Les armes des figurines de cette unité ont [IGNORE LE COUVERT]." },
        { name: "Psychic Communion (Psychic)",
          text: "Chaque fois que cette unité est choisie pour tirer, pour chaque figurine WARLOCK de l'unité, jusqu'à la fin de la phase, ajoutez 1 aux Attaques et à la Force de son Destructor pour chaque autre figurine AELDARI PSYKER amie à 6\" ou moins d'elle (+2 au maximum)." }
      ],
      composition: "1 à 2 Warlock Skyrunners"
    },

    {
      id: "windriders",
      name: "Windriders",
      category: "mounted",
      base: "32mm (socle de vol)",
      keywords: ["Mounted", "Aeldari", "Fly", "Windriders", "Asuryani"],
      stats: { M: "14\"", T: 4, Sv: "4+", W: 2, Ld: "7+", OC: 2, InSv: "6+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 80 }] },
        { models: 6, costs: [{ from: 1, pts: 170 }] }
      ],
      coreAbilities: [],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["twin-shuriken-catapult", "close-combat-weapon"],
      options: [
        { id: "heavy", text: "N'importe quel nombre de figurines peuvent remplacer leur twin shuriken catapult par 1 scatter laser ou 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["scatter-laser"], ["shuriken-cannon"]] }
      ],
      abilities: [
        { name: "Swift Demise",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir, relancez un jet de touche de 1. Si la cible de l'attaque est la cible éligible la plus proche, vous pouvez relancer le jet de touche à la place." }
      ],
      composition: "3 à 6 Windriders"
    },
    /* ---------- Monstres ----------
       Catégorie « monsters » ajoutée dans config.js */

    {
      id: "wraithknight",
      name: "Wraithknight",
      category: "monsters",
      base: "120 x 92mm",
      keywords: ["Monster", "Titanic", "Towering", "Aeldari", "Walker", "Wraith Construct", "Wraithknight", "Asuryani"],
      stats: { M: "12\"", T: 12, Sv: "2+", W: 18, Ld: "6+", OC: 10 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 385 }, { from: 2, pts: 405 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "heavy-wraithcannon", name: "Heavy wraithcannon", type: "ranged", cost: 10,
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "20", AP: "-4", D: "2D6", abilities: ["devastating-wounds"] }] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "suncannon", name: "Suncannon", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+4", skill: "3+", S: "10", AP: "-3", D: "3", abilities: ["blast"] }] },
        { id: "titanic-feet", name: "Titanic feet", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "8", AP: "-1", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "scattershield", name: "Scattershield" }],
      loadout: ["suncannon", "titanic-feet", "scattershield"],
      options: [
        { id: "suncannon", text: "Le suncannon peut être remplacé par 1 heavy wraithcannon (+10 pts).",
          replaces: ["suncannon"], choices: [["heavy-wraithcannon"]] },
        { id: "scattershield", text: "Le scattershield peut être remplacé par 1 heavy wraithcannon (+10 pts).",
          replaces: ["scattershield"], choices: [["heavy-wraithcannon"]] },
        { id: "armes", text: "Cette figurine peut être équipée de jusqu'à 2 armes parmi : scatter laser, shuriken cannon, starcannon.",
          choices: [["scatter-laser"], ["shuriken-cannon"], ["starcannon"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Titanic Strides",
          text: "Chaque fois que cette figurine fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines (sauf TITANIC) et les éléments de terrain de 4\" de haut ou moins. Elle peut alors passer à portée d'engagement de figurines ennemies, mais ne peut pas y finir son mouvement. Elle peut aussi traverser des éléments de terrain de plus de 4\" de haut, mais dans ce cas, après son mouvement, lancez 1D6 : sur 1, elle est Ébranlée." },
        { name: "Point-blank Devastation",
          text: "Chaque fois que le heavy wraithcannon ou le suncannon de cette figurine cible une unité à mi-portée ou moins, vous pouvez relancer le jet du nombre d'attaques." },
        { name: "Scattershield", requiresWargear: "scattershield",
          text: "Le porteur a une sauvegarde invulnérable de 4+, et chaque fois qu'une attaque lui est allouée, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, soustrayez 5 à sa CO, et chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Wraithknight"
    },

    {
      id: "wraithknight-with-ghostglaive",
      name: "Wraithknight with Ghostglaive",
      category: "monsters",
      base: "120 x 92mm",
      keywords: ["Monster", "Titanic", "Towering", "Aeldari", "Walker", "Wraith Construct", "Wraithknight with Ghostglaive", "Asuryani"],
      stats: { M: "12\"", T: 12, Sv: "2+", W: 18, Ld: "6+", OC: 10 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 380 }, { from: 2, pts: 400 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "heavy-wraithcannon", name: "Heavy wraithcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "20", AP: "-4", D: "2D6", abilities: ["devastating-wounds"] }] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "titanic-ghostglaive", name: "Titanic ghostglaive", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "3+", S: "16", AP: "-3", D: "6", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "15", skill: "3+", S: "8",  AP: "-2", D: "2", abilities: [] }
          ] }
      ],
      wargear: [{ id: "scattershield", name: "Scattershield" }],
      loadout: ["titanic-ghostglaive", "scattershield"],
      options: [
        { id: "scattershield", text: "Le scattershield peut être remplacé par 1 heavy wraithcannon.",
          replaces: ["scattershield"], choices: [["heavy-wraithcannon"]] },
        { id: "armes", text: "Cette figurine peut être équipée de jusqu'à 2 armes parmi : scatter laser, shuriken cannon, starcannon.",
          choices: [["scatter-laser"], ["shuriken-cannon"], ["starcannon"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Titanic Agility",
          text: "Chaque fois que cette figurine fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines et les éléments de terrain. Elle peut alors passer à portée d'engagement de figurines ennemies, mais ne peut pas y finir son mouvement." },
        { name: "Scattershield", requiresWargear: "scattershield",
          text: "Le porteur a une sauvegarde invulnérable de 4+, et chaque fois qu'une attaque lui est allouée, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, soustrayez 5 à sa CO, et chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Wraithknight with Ghostglaive"
    },

    {
      id: "wraithlord",
      name: "Wraithlord",
      category: "monsters",
      base: "60mm",
      keywords: ["Monster", "Aeldari", "Walker", "Wraith Construct", "Wraithlord", "Asuryani"],
      stats: { M: "8\"", T: 10, Sv: "2+", W: 10, Ld: "8+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: [],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "flamer", name: "Flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["assault", "ignores-cover", "torrent"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "4+", S: "10", AP: "-2", D: "D6", abilities: [] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "4+", S: "4",  AP: "-1", D: "1",  abilities: ["blast"] }
          ] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "4+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "shuriken-catapult", name: "Shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "4+", S: "4", AP: "-1", D: "1", abilities: ["assault"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "4+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "ghostglaive", name: "Ghostglaive", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "4", skill: "4+", S: "10", AP: "-3", D: "D6+1", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "8", skill: "4+", S: "7",  AP: "-2", D: "2",    abilities: [] }
          ] },
        { id: "wraithbone-fists", name: "Wraithbone fists", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "7", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["shuriken-catapult", "shuriken-catapult", "wraithbone-fists"],
      options: [
        { id: "flamer", text: "Chacun des shuriken catapults peut être remplacé par 1 flamer.",
          replaces: ["shuriken-catapult"], choices: [["flamer"]], max: { count: 2 } },
        { id: "ghostglaive", text: "Cette figurine peut être équipée de 1 ghostglaive.",
          choices: [["ghostglaive"]], max: { count: 1 } },
        { id: "armes", text: "Cette figurine peut être équipée de jusqu'à 2 armes parmi : missile launcher, bright lance, scatter laser, shuriken cannon, starcannon.",
          choices: [["missile-launcher"], ["bright-lance"], ["scatter-laser"], ["shuriken-cannon"], ["starcannon"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Fated Hero",
          gameChoice: "Au début de la bataille, choisir le mot-clé visé par le Wraithlord.",
          text: "Au début de la bataille, choisissez l'un des mots-clés suivants : INFANTRY, MONSTER, MOUNTED ou VEHICLE. Chaque fois que cette figurine attaque une unité qui a ce mot-clé, relancez un jet de touche de 1 et un jet de blessure de 1." },
        { name: "Psychic Guidance",
          text: "Tant que cette figurine est à 12\" ou moins d'une ou plusieurs figurines AELDARI PSYKER amies, améliorez de 1 la CT et la CC de ses armes, et elle a un Commandement de 6+." }
      ],
      composition: "1 Wraithlord"
    },
    /* ---------- Transports ---------- */

    {
      id: "falcon",
      name: "Falcon",
      category: "transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Transport", "Fly", "Frame", "Falcon", "Asuryani"],
      stats: { M: "14\"", T: 9, Sv: "3+", W: 12, Ld: "7+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "3+", S: "10", AP: "-2", D: "D6", abilities: [] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "3+", S: "4",  AP: "-1", D: "1",  abilities: ["blast"] }
          ] },
        { id: "pulse-laser", name: "Pulse laser", type: "ranged",
          profiles: [{ range: "48\"", A: "3", skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["pulse-laser", "scatter-laser", "twin-shuriken-catapult", "wraithbone-hull"],
      options: [
        { id: "scatter", text: "Le scatter laser peut être remplacé par 1 missile launcher, 1 bright lance, 1 shuriken cannon ou 1 starcannon.",
          replaces: ["scatter-laser"], choices: [["missile-launcher"], ["bright-lance"], ["shuriken-cannon"], ["starcannon"]] },
        { id: "catapult", text: "Le twin shuriken catapult peut être remplacé par 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["shuriken-cannon"]] }
      ],
      transport: {
        capacity: 6,
        // Asuryani et Arlequins (AELDARI INFANTRY) ; Yvraine et le Visarch sont les seuls Ynnari admis.
        // Pas d'exclusion « Ynnari » : avec les Dévots d'Ynnead, les Asuryani gagnent ce mot-clé.
        allowed: [["Asuryani", "Infantry"], ["Harlequins", "Infantry"], ["Yvraine"], ["The Visarch"]],
        excluded: ["Jump Pack"],
        double: ["Wraith Construct"],
        text: "Capacité de transport de 6 figurines AELDARI INFANTRY. Chaque figurine WRAITH CONSTRUCT compte pour 2 places. Il ne peut pas transporter de figurines JUMP PACK ni YNNARI (sauf ASURYANI, YVRAINE et THE VISARCH)."
      },
      abilities: [
        { name: "Fire Support",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin du tour, chaque fois qu'une figurine amie qui a débarqué de ce TRANSPORT à ce tour attaque cette unité ennemie, vous pouvez relancer le jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Falcon"
    },
    /* ---------- Véhicules ---------- */

    {
      id: "fire-prism",
      name: "Fire Prism",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Fly", "Frame", "Fire Prism", "Asuryani"],
      stats: { M: "14\"", T: 9, Sv: "3+", W: 12, Ld: "7+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 150 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "prism-cannon", name: "Prism cannon", type: "ranged",
          profiles: [
            { name: "dispersed pulse", range: "60\"", A: "2D6", skill: "3+", S: "6",  AP: "-2", D: "2", abilities: ["blast"] },
            { name: "focused lances",  range: "60\"", A: "2",   skill: "3+", S: "18", AP: "-4", D: "6", abilities: [] }
          ] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["prism-cannon", "twin-shuriken-catapult", "wraithbone-hull"],
      options: [
        { id: "catapult", text: "Le twin shuriken catapult peut être remplacé par 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["shuriken-cannon"]] }
      ],
      abilities: [
        { name: "Linked Fire",
          text: "Profil focused lances du prism cannon : quand vous choisissez ses cibles, vous pouvez mesurer la portée et déterminer la visibilité depuis une autre figurine FIRE PRISM amie visible du porteur. Dans ce cas, l'arme a une caractéristique d'Attaques de 1." },
        { name: "Crystal Matrix",
          text: "Chaque fois que cette figurine est choisie pour tirer, pendant la résolution de ces attaques, vous pouvez relancer un jet de touche et un jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Fire Prism"
    },

    {
      id: "night-spinner",
      name: "Night Spinner",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Fly", "Frame", "Night Spinner", "Asuryani"],
      stats: { M: "14\"", T: 9, Sv: "3+", W: 12, Ld: "7+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 165 }, { from: 3, pts: 195 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "doomweaver", name: "Doomweaver", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+3", skill: "3+", S: "7", AP: "-1", D: "2", abilities: ["blast", "indirect-fire", "twin-linked"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["doomweaver", "twin-shuriken-catapult", "wraithbone-hull"],
      options: [
        { id: "catapult", text: "Le twin shuriken catapult peut être remplacé par 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["shuriken-cannon"]] }
      ],
      abilities: [
        { name: "Monofilament Web",
          text: "À votre phase de Tir, après que cette figurine a tiré, si une ou plusieurs attaques de son doomweaver ont touché une unité ennemie, cette unité est clouée jusqu'au début de votre prochain tour : soustrayez 2 à sa caractéristique de Mouvement et 2 à ses jets de Charge." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Night Spinner"
    },

    {
      id: "starfangs",
      name: "Starfangs",
      category: "vehicles",
      base: "105 x 70mm",
      keywords: ["Vehicle", "Aeldari", "Anhrathe", "Fly", "Smoke", "Grenades", "Starfangs", "Asuryani"],
      stats: { M: "14\"", T: 6, Sv: "3+", W: 6, Ld: "7+", OC: 2 },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 70 }] },
        { models: 2, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: ["deadly-demise:1", "scouts:7\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "disintegrator-cannon", name: "Disintegrator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "6", AP: "-3", D: "2", abilities: ["assault"] }] },
        { id: "starfang-grenade-launcher", name: "Starfang grenade launcher", type: "ranged",
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "6", AP: "-3", D: "2", abilities: ["assault", "blast"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["disintegrator-cannon", "starfang-grenade-launcher", "wraithbone-hull"],
      abilities: [
        { name: "Hallucinogen Grenades",
          text: "Au début de la phase de Tir adverse, cette unité peut utiliser cette aptitude : choisissez 1 unité AELDARI INFANTRY de votre armée visible et à 36\" ou moins d'elle. Jusqu'à la fin de la phase, cette unité a l'aptitude Discrétion." }
      ],
      composition: "1 à 2 Starfangs"
    },

    {
      id: "voidweaver",
      name: "Voidweaver",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Fly", "Frame", "Voidweaver", "Harlequins"],
      stats: { M: "14\"", T: 6, Sv: "4+", W: 6, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 115 }] }],
      coreAbilities: ["deadly-demise:1", "stealth"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "prismatic-cannon", name: "Prismatic cannon", type: "ranged",
          profiles: [
            { name: "dispersed pulse", range: "24\"", A: "2D6", skill: "3+", S: "4",  AP: "0",  D: "1", abilities: ["blast"] },
            { name: "focused lances",  range: "24\"", A: "2",   skill: "3+", S: "12", AP: "-3", D: "4", abilities: [] }
          ] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "voidweaver-haywire-cannon", name: "Voidweaver haywire cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "4", AP: "-1", D: "3", abilities: ["anti:Véhicule 4+", "devastating-wounds"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["shuriken-cannon", "shuriken-cannon", "voidweaver-haywire-cannon", "close-combat-weapon"],
      options: [
        { id: "prismatic", text: "Le Voidweaver haywire cannon peut être remplacé par 1 prismatic cannon.",
          replaces: ["voidweaver-haywire-cannon"], choices: [["prismatic-cannon"]] }
      ],
      abilities: [
        { name: "Polychromatic Camouflage",
          text: "Cette unité ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins." }
      ],
      composition: "1 Voidweaver"
    },

    {
      id: "vypers",
      name: "Vypers",
      category: "vehicles",
      base: "105 x 70mm",
      keywords: ["Vehicle", "Aeldari", "Fly", "Vypers", "Asuryani"],
      stats: { M: "14\"", T: 6, Sv: "3+", W: 6, Ld: "7+", OC: 2 },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 75 }] },
        { models: 2, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "3+", S: "10", AP: "-2", D: "D6", abilities: [] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "3+", S: "4",  AP: "-1", D: "1",  abilities: ["blast"] }
          ] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:2"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "2+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["shuriken-cannon", "bright-lance", "wraithbone-hull"],
      options: [
        { id: "lance", text: "N'importe quel nombre de figurines peuvent remplacer leur bright lance par 1 scatter laser ou 1 starcannon.",
          replaces: ["bright-lance"], choices: [["scatter-laser"], ["starcannon"]] },
        { id: "missile", text: "N'importe quel nombre de figurines peuvent remplacer leur shuriken cannon par 1 missile launcher.",
          replaces: ["shuriken-cannon"], choices: [["missile-launcher"]] }
      ],
      abilities: [
        { name: "Harassment Fire",
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'au début de votre prochain tour, elle est réprimée : chaque fois qu'une de ses figurines attaque, soustrayez 1 au jet de touche." }
      ],
      composition: "1 à 2 Vypers"
    },
    /* ---------- Marcheurs ---------- */

    {
      id: "war-walkers",
      name: "War Walkers",
      category: "walkers",
      base: "60mm",
      keywords: ["Vehicle", "Aeldari", "Walker", "War Walkers", "Asuryani"],
      stats: { M: "10\"", T: 7, Sv: "3+", W: 6, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 80 }] },
        { models: 2, costs: [{ from: 1, pts: 160 }] }
      ],
      coreAbilities: ["scouts:9\""],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "3+", S: "10", AP: "-2", D: "D6", abilities: [] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "3+", S: "4",  AP: "-1", D: "1",  abilities: ["blast"] }
          ] },
        { id: "scatter-laser", name: "Scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1"] }] },
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "war-walker-feet", name: "War Walker feet", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["shuriken-cannon", "shuriken-cannon", "war-walker-feet"],
      options: [
        { id: "armes", text: "Chaque shuriken cannon peut être remplacé par 1 missile launcher, 1 bright lance, 1 scatter laser ou 1 starcannon.",
          replaces: ["shuriken-cannon"], choices: [["missile-launcher"], ["bright-lance"], ["scatter-laser"], ["starcannon"]] }
      ],
      abilities: [
        { name: "Crystalline Targeting",
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin de la phase, chaque fois qu'une unité AELDARI amie attaque cette unité ennemie, améliorez de 1 la Pénétration d'Armure de l'attaque. Chaque unité ne peut être choisie qu'une fois par tour pour cette aptitude." }
      ],
      composition: "1 à 2 War Walkers"
    },

    /* ---------- Transports assignés ---------- */

    {
      id: "starweaver",
      name: "Starweaver",
      category: "dedicated-transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Transport", "Dedicated Transport", "Smoke", "Fly", "Frame", "Starweaver", "Harlequins"],
      stats: { M: "14\"", T: 6, Sv: "4+", W: 6, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }, { from: 4, pts: 80 }] }],
      coreAbilities: ["deadly-demise:1", "firing-deck:6"],
      armyRules: ["transe-guerriere", "chemins-disparates"],
      weapons: [
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["shuriken-cannon", "shuriken-cannon", "close-combat-weapon"],
      transport: {
        capacity: 6,
        allowed: [["Harlequins", "Infantry"]],
        text: "Capacité de transport de 6 figurines HARLEQUINS INFANTRY."
      },
      abilities: [
        { name: "Rapid Embarkation",
          text: "À la fin de la phase de Combat, si aucune figurine n'est embarquée dans ce TRANSPORT, vous pouvez choisir 1 unité HARLEQUINS INFANTRY amie de 6 figurines ou moins entièrement à 6\" ou moins de lui. Sauf si elle est à portée d'engagement d'une ou plusieurs unités ennemies, elle peut embarquer dans ce TRANSPORT, même à un tour où elle en a débarqué." }
      ],
      composition: "1 Starweaver"
    },

    {
      id: "wave-serpent",
      name: "Wave Serpent",
      category: "dedicated-transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Transport", "Dedicated Transport", "Fly", "Frame", "Wave Serpent", "Asuryani"],
      stats: { M: "14\"", T: 9, Sv: "3+", W: 13, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 115 }, { from: 4, pts: 125 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["transe-guerriere"],
      weapons: [
        { id: "shuriken-cannon", name: "Shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "twin-missile-launcher", name: "Twin missile launcher", type: "ranged",
          profiles: [
            { name: "starshot", range: "48\"", A: "1",  skill: "3+", S: "10", AP: "-2", D: "D6", abilities: ["twin-linked"] },
            { name: "sunburst", range: "48\"", A: "D6", skill: "3+", S: "4",  AP: "-1", D: "1",  abilities: ["blast", "twin-linked"] }
          ] },
        { id: "twin-bright-lance", name: "Twin bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: ["twin-linked"] }] },
        { id: "twin-scatter-laser", name: "Twin scatter laser", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["sustained-hits:1", "twin-linked"] }] },
        { id: "twin-shuriken-cannon", name: "Twin shuriken cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits", "twin-linked"] }] },
        { id: "twin-shuriken-catapult", name: "Twin shuriken catapult", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["assault", "twin-linked"] }] },
        { id: "twin-starcannon", name: "Twin starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["twin-linked"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["twin-shuriken-cannon", "twin-shuriken-catapult", "wraithbone-hull"],
      options: [
        { id: "arme-principale", text: "Le twin shuriken cannon peut être remplacé par 1 twin missile launcher, 1 twin bright lance, 1 twin scatter laser ou 1 twin starcannon.",
          replaces: ["twin-shuriken-cannon"], choices: [["twin-missile-launcher"], ["twin-bright-lance"], ["twin-scatter-laser"], ["twin-starcannon"]] },
        { id: "catapult", text: "Le twin shuriken catapult peut être remplacé par 1 shuriken cannon.",
          replaces: ["twin-shuriken-catapult"], choices: [["shuriken-cannon"]] }
      ],
      transport: {
        capacity: 12,
        allowed: [["Asuryani", "Infantry"], ["Yvraine"], ["The Visarch"]],
        excluded: ["Jump Pack"],
        double: ["Wraith Construct"],                // comptent pour 2 places
        text: "Capacité de transport de 12 figurines ASURYANI INFANTRY. Chaque figurine WRAITH CONSTRUCT compte pour 2 places. Il ne peut pas transporter de figurines JUMP PACK ni YNNARI (sauf ASURYANI, YVRAINE et THE VISARCH)."
      },
      abilities: [
        { name: "Wave Serpent Shield",
          text: "Chaque fois qu'une attaque de tir cible cette figurine, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Wave Serpent"
    },
    /* ---------- Aéronefs ----------
       Catégorie « aircraft » ajoutée dans config.js */

    {
      id: "crimson-hunter",
      name: "Crimson Hunter",
      category: "aircraft",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Fly", "Aircraft", "Aspect Warrior", "Crimson Hunter", "Asuryani"],
      stats: { M: "-", T: 8, Sv: "3+", W: 12, Ld: "6+", OC: "-", InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 160 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "bright-lance", name: "Bright lance", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+2", abilities: [] }] },
        { id: "pulse-laser", name: "Pulse laser", type: "ranged",
          profiles: [{ range: "48\"", A: "3", skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }] },
        { id: "starcannon", name: "Starcannon", type: "ranged",
          profiles: [{ range: "36\"", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: [] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["starcannon", "starcannon", "pulse-laser", "wraithbone-hull"],
      options: [
        { id: "lances", text: "Les 2 starcannons peuvent être remplacés par 2 bright lances.",
          replaces: ["starcannon", "starcannon"], choices: [["bright-lance", "bright-lance"]] }
      ],
      abilities: [
        { name: "Skyhunter",
          text: "Chaque fois que cette figurine fait une attaque de tir qui cible une unité qui a le mot-clé FLY, ajoutez 1 au jet de touche et 1 au jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Crimson Hunter"
    },

    {
      id: "hemlock-wraithfighter",
      name: "Hemlock Wraithfighter",
      category: "aircraft",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Aeldari", "Fly", "Aircraft", "Psyker", "Wraith Construct", "Hemlock Wraithfighter", "Asuryani"],
      stats: { M: "-", T: 8, Sv: "3+", W: 12, Ld: "6+", OC: "-" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 155 }] }],
      coreAbilities: [],
      armyRules: [],
      weapons: [
        { id: "heavy-d-scythe", name: "Heavy D-scythe", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "4+", S: "12", AP: "-4", D: "2", abilities: ["blast"] }] },
        { id: "wraithbone-hull", name: "Wraithbone hull", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["heavy-d-scythe", "heavy-d-scythe", "wraithbone-hull"],
      abilities: [
        { name: "Mindshock Pod (Aura, Psychic)",
          text: "Tant qu'une unité ennemie est à 9\" ou moins de cette figurine, soustrayez 1 à ses tests d'Ébranlement et de Commandement." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Hemlock Wraithfighter"
    }
  ]
});

})();
