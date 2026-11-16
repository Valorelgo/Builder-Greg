/* =========================================================
   ORKS — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - Règle d'armée Waaagh! : complète, traduite depuis l'anglais.
     « Riled up » = « Vénère » (terme des fiches françaises).
   - 15 détachements : règles et stratagèmes (40) saisis d'après les
     fiches françaises fournies (souvent résumées). Noms anglais des
     détachements repris des fiches.
     Boss Brutes et Zarbande : pas de stratagème sur la fiche.
     Zarbande : texte de la règle peut-être coupé en bas de la capture.
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - Optimisations notées « (Amélioration) » : kind "amelioration".
   - « MENEUR : … » sur la fiche : requiresAttachedTo (unité menée).

   Unités citées : mots-clés anglais (comme les autres factions).
   Correspondances avec les noms français des fiches :
     Infanterie Ork = ORKS INFANTRY ; Véhicule Ork = ORKS VEHICLE
     Marcheur Ork = ORKS WALKER ; Transport Orks = ORKS TRANSPORT
     Psyker Ork = ORKS PSYKER ; Montée = MOUNTED ; Titanesque = TITANIC
     Aérodyne = AIRCRAFT ; Vol = FLY ; Monstre = MONSTER
     Boss de Guerre = WARBOSS ; Méganobz = MEGANOBZ
     Frimeurs = FLASH GITZ ; Kasseurs = LOOTAS
     Alpagueurs = BEAST SNAGGA ; Boyz Alpagueurs = BEAST SNAGGA BOYZ
     Motards de Guerre = WARBIKERS ; Fondus d'la Vitess' = SPEED FREEKS
     Gros Mek = BIG MEK ; Kanons d'Mek = MEK GUNZ ; Morkanaute = MORKANAUT
     Klat'jet Wazboum = WAZBOM BLASTAJET ; Kopters d'la Mort = DEFFKOPTAS
     Gretchins = GRETCHIN
   À confirmer (gardés en français ou supposés) :
     Chokboyz = STORMBOYZ (supposé) ; Buggys Fourre-squigs =
     RUKKATRUKK SQUIGBUGGY (supposé) ; CHARIOT, KASS'TANKS et
     DRED EUD' LA MORT gardés en français.
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation", extra = {}) => ({
  id, name, cost, kind,
  requires: [["Orks"]],
  text: A_SAISIR,
  ...extra
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");
const meneur = (id, name, cost, unite) => opt(id, name, cost, "optimisation", { requiresAttachedTo: [unite] });

// Détachement : o = { nameEn, ruleName, rule: [textes], stratagems: [...] }
const det = (id, name, cost, dispositions, enhancements, o = {}) => ({
  id, name, cost, dispositions,
  ...(o.nameEn ? { nameEn: o.nameEn } : {}),
  rule: { name: o.ruleName || null, text: o.rule || ["Règle du détachement à saisir."] },
  enhancements,
  stratagems: o.stratagems || []
});

// Moments des stratagèmes (vus du joueur Orks)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  vousCharge: { tour: "vous", phase: "charge" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCombat:  { tour: "adversaire", phase: "combat" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, moments, quand, cible, effet) =>
  ({ id, name, cp, type: null, moments, quand, cible, effet });

// Texte commun : la figurine détruite combat avant d'être retirée
const COMBAT_AVANT_RETRAIT = "Ne retirez pas cette figurine du champ de bataille. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (selon ce qui arrive en premier).";

Factions.register({
  id: "orks",
  name: "Orks",
  keyword: "Orks",

  armyRules: [
    {
      id: "waaagh",
      name: "Waaagh!",
      nameEn: "Waaagh!",
      text: [
        "Les unités ORKS amies qui ont cette aptitude peuvent :",
        "• relancer leurs jets d'Avance ;",
        "• devenir __Vénères__, comme l'indiquent d'autres règles.",
        "Tant qu'une unité est Vénère :",
        "• elle a une sauvegarde invulnérable de 5+ ;",
        "• ses attaques de tir ont [ASSAUT] ;",
        "• quand elle est choisie pour faire une Avance, cette Avance ne l'empêche pas d'être éligible pour déclarer une charge.",
        "__Cri de Guerre (1 fois par bataille, par armée)__ : au début de la phase de Commandement, vous pouvez utiliser cette aptitude. Dans ce cas, les unités ORKS amies qui ont l'aptitude Waaagh! sont Vénères jusqu'à la fin du tour suivant."
      ]
    }
  ],

  detachments: [

    /* ----- BRIGADE BLITZ (Blitz Brigade) ----- */
    det("brigade-blitz", "Brigade Blitz", 1, ["take-and-hold"], [
      amelio("gueuleur-eud-boss", "Gueuleur eud' Boss", 10),
      amelio("gadgets-de-ciblaj", "Gadgets de Ciblaj", 25)
    ], {
      nameEn: "Blitz Brigade",
      rule: [
        "Les unités CHARIOT amies peuvent relancer leurs jets de Charge.",
        "Quand une unité CHARIOT amie est choisie pour faire une Avance, elle peut remplacer son jet d'Avance par 6."
      ],
      stratagems: [
        strat("bagarreurs-pares", "Bagarreurs Parés", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité CHARIOT de votre armée finit un Mouvement Normal.",
          "Cette unité CHARIOT.",
          "Les unités embarquées dans votre unité peuvent faire un débarquement d'assaut (elles restent donc éligibles pour déclarer une charge à ce tour)."),
        strat("impakt-imminent", "Impakt Imminent", 1, [M.vousCharge],
          "Votre phase de Charge, quand une unité CHARIOT de votre armée finit un mouvement de Charge.",
          "Cette unité CHARIOT.",
          "Chaque unité ennemie engagée avec votre unité fait un test d'Ébranlement, avec -1 à ce test."),
        strat("laiss-tourner-l-moteur", "Laiss' Tourner l'Moteur", 1, [M.combat],
          "Fin de la phase de Combat.",
          "1 unité ORKS INFANTRY non engagée de votre armée, qui était éligible pour combattre à cette phase et qui est entièrement à 6\" ou moins d'une unité TRANSPORT amie dans laquelle elle peut embarquer.",
          "Votre unité embarque dans ce TRANSPORT.")
      ]
    }),

    /* ----- BOSS BRUTES (Brute Bosses) — pas de stratagème ----- */
    det("boss-brutes", "Boss Brutes", 1, ["purge-the-foe"], [
      opt("blitzboss", "Blitzboss", 20),
      opt("brutal-mais-ruze", "Brutal Mais Ruzé", 30),
      opt("tromblon-ratich", "Tromblon Ratich'", 20),
      opt("casque-a-ruze-de-morgog", "Casque à Ruze de Morgog", 50),
      opt("tro-balez", "Tro Balèz'", 15),
      opt("mechant-kom-un-squiggouth", "Méchant kom' un Squiggouth", 25)
    ], {
      nameEn: "Brute Bosses",
      rule: [
        "Quand une figurine WARBOSS amie est détruite avant d'avoir combattu à cette phase, lancez 1D6 (+1 si son unité est Vénère) : sur 3+, ne la retirez qu'à la fin de la phase ou une fois qu'elle a combattu (selon ce qui arrive en premier).",
        "Ce détachement n'a pas de stratagème."
      ]
    }),

    /* ----- DÉROUILLEURS (Bully Boyz) ----- */
    det("derouilleurs", "Dérouilleurs", 1, ["purge-the-foe"], [
      opt("boss-a-telatepula", "Boss à Télatépula", 20),
      amelio("korrigeurs-eud-mauviet", "Korrigeurs eud' Mauviet'", 15)
    ], {
      nameEn: "Bully Boyz",
      rule: ["Les attaques de mêlée des unités MEGANOBZ et NOBZ amies ont [TOUCHES SOUTENUES 1]."],
      stratagems: [
        strat("armes-jusk-aux-dents", "Armés Jusk'aux Dents", 1, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat, quand une unité MEGANOBZ ou NOBZ de votre armée est choisie pour attaquer.",
          "Cette unité MEGANOBZ ou NOBZ.",
          "Les attaques de votre unité peuvent relancer les jets de touche de 1 ; si elle est Vénère, elles peuvent relancer les jets de touche."),
        strat("brutes-enormes", "Brutes Énormes", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité MEGANOBZ ou NOBZ de votre armée.",
          "Cette unité MEGANOBZ ou NOBZ.",
          "Les attaques de tir qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance. Pour 1 PC de plus (2 PC en tout), toutes les attaques de tir qui ciblent votre unité ont -1 au jet de blessure."),
        strat("trop-arrogants-pour-mourir", "Trop Arrogants pour Mourir", 1, [M.combat],
          "Phase de Combat, quand une unité ennemie choisit pour cible une unité MEGANOBZ ou NOBZ de votre armée.",
          "Cette unité MEGANOBZ ou NOBZ.",
          "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+1 si votre unité est Vénère) : sur 4+, " + COMBAT_AVANT_RETRAIT.charAt(0).toLowerCase() + COMBAT_AVANT_RETRAIT.slice(1))
      ]
    }),

    /* ----- LA CHASSE AU GROS (Da Big Hunt) ----- */
    det("la-chasse-au-gros", "La Chasse au Gros", 1, ["purge-the-foe"], [
      opt("coureur-de-gloire", "Coureur de Gloire", 25),
      opt("echappe-d-la-fosse", "Échappé d'la Fosse", 20)
    ], {
      nameEn: "Da Big Hunt",
      rule: ["Les attaques des unités BEAST SNAGGA amies qui ciblent une unité MONSTER ou VEHICLE ont la Pénétration d'Armure améliorée de 1."],
      stratagems: [
        strat("chasseurs-a-l-instinct", "Chasseurs à l'Instinct", 1, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité BEAST SNAGGA non engagée de votre armée, à 6\" ou moins d'un bord du champ de bataille.",
          "Placez votre unité en Réserves Stratégiques."),
        strat("ou-tu-crois-qu-tu-vas", "Où tu Crois qu'tu Vas ?", 1, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie engagée avec une unité BEAST SNAGGA de votre armée est choisie pour Battre en Retraite.",
          "Cette unité BEAST SNAGGA.",
          "L'unité ennemie doit utiliser le mode Fuite Désespérée pour sa Retraite. Si c'est une unité MONSTER ou VEHICLE, elle fait 3 jets de risque supplémentaires pour chaque unité BEAST SNAGGA engagée avec elle, avec -1 à ces jets si elle est Ébranlée."),
        strat("pousses-a-agir", "Poussés à Agir", 1, [M.advTir],
          "Phase de Tir adverse, après qu'une unité ennemie a tiré.",
          "1 unité BEAST SNAGGA non engagée de votre armée qui a perdu un ou plusieurs PV à cause de ces attaques.",
          "Votre unité peut faire un mouvement d'Élan de D6\" maximum. Si elle est Vénère, elle peut relancer ce D6.")
      ]
    }),

    /* ----- BANDE DE DREDS (Dread Mob) ----- */
    det("bande-de-dreds", "Bande de Dreds", 1, ["purge-the-foe"], [
      opt("boosteur-cybork", "Boosteur Cybork", 10),
      opt("berge-des-bot", "Bergé des Bot'", 30)
    ], {
      nameEn: "Dread Mob",
      rule: [
        "À votre phase de Tir ou à la phase de Combat, quand une unité ORKS WALKER amie (sauf TITANIC) est choisie pour attaquer, vous pouvez utiliser cette aptitude. Lancez 1D6 ou 2D6 (en relançant les doubles jusqu'à obtenir deux résultats différents). Les attaques de votre unité ont l'effet correspondant à chaque dé :",
        "• 1-2 : +1 en Attaques ;",
        "• 3-4 : +2 en Force ;",
        "• 5-6 : Pénétration d'Armure améliorée de 1.",
        "Si vous avez lancé 2D6, votre unité fait un jet de risque une fois qu'elle a attaqué."
      ],
      stratagems: [
        strat("koloss-pietineur", "Koloss Piétineur", 1, [M.vousMvt, M.vousCharge],
          "Votre phase de Mouvement ou de Charge, quand une unité ORKS WALKER de votre armée est choisie pour se déplacer ou déclarer une charge.",
          "Cette unité ORKS WALKER.",
          "Votre unité a le mot-clé MOBILE."),
        strat("marcheur-venere", "Marcheur Vénère", 1, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité ORKS WALKER de votre armée.",
          "Votre unité est Vénère jusqu'au début de votre prochain tour."),
        strat("ravages-dements", "Ravages Déments", 1, [M.combat],
          "Phase de Combat, quand une unité ennemie choisit pour cible une unité ORKS WALKER de votre armée (sauf TITANIC).",
          "Cette unité ORKS WALKER.",
          "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+3 si votre unité a le mot-clé DRED EUD' LA MORT) : sur 4+, " + COMBAT_AVANT_RETRAIT.charAt(0).toLowerCase() + COMBAT_AVANT_RETRAIT.slice(1))
      ]
    }),

    /* ----- ZAVIATEURS (Flyboyz) ----- */
    det("zaviateurs", "Zaviateurs", 1, ["reconnaissance"], [
      amelio("boss-zaviateur", "Boss Zaviateur", 20),
      amelio("reperage-impulsif", "Repérage Impulsif", 15)
    ], {
      nameEn: "Flyboyz",
      rule: [
        "Les unités AIRCRAFT ne comptent pas dans le décompte des points en Réserves Stratégiques.",
        "Tant qu'une unité ORKS AIRCRAFT ou DEFFKOPTAS amie est Vénère, ses attaques ont +1 au jet de touche."
      ],
      stratagems: [
        strat("coup-de-boule-aerien", "Coup de Boule Aérien", 1, [M.tout],
          "N'importe quelle phase, quand une unité ORKS AIRCRAFT de votre armée est détruite, avant tout jet de Destruction Néfaste.",
          "Cette unité ORKS AIRCRAFT.",
          "Votre unité perd l'aptitude Destruction Néfaste. Choisissez 1 unité ennemie à 12\" ou moins d'elle et lancez 8D6 : pour chaque 4+, elle subit 1 blessure mortelle. Retirez ensuite votre unité."),
        strat("esquive-en-tonneau", "Esquive en Tonneau", 1, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité DEFFKOPTAS non engagée de votre armée.",
          "Cette unité DEFFKOPTAS.",
          "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de 6\" maximum si elle est Vénère."),
        strat("rafales-longues-et-incontrolees", "Rafales Longues et Incontrôlées", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS AIRCRAFT ou DEFFKOPTAS de votre armée est choisie pour tirer.",
          "Cette unité ORKS AIRCRAFT ou DEFFKOPTAS.",
          "Les attaques de votre unité qui ciblent une unité FLY peuvent relancer le jet de touche.")
      ]
    }),

    /* ----- MARÉE VERTE (Green Tide) ----- */
    det("maree-verte", "Marée Verte", 1, ["take-and-hold"], [
      amelio("durboyz", "Durboyz", 25),
      opt("m-as-tu-vu-feroce", "M'as-tu-vu Féroce", 15)
    ], {
      nameEn: "Green Tide",
      rule: [
        "Les attaques de mêlée des unités BOYZ amies ont [TOUCHES SOUTENUES 1].",
        "Si une unité ORKS INFANTRY amie a fait un mouvement de Charge à ce tour, ses attaques de mêlée ont [TOUCHES FATALES] contre les unités qui ne sont ni MONSTER ni VEHICLE."
      ],
      stratagems: [
        strat("carnage-sans-borne", "Carnage sans Borne", 1, [M.combat],
          "Phase de Combat, quand une unité BOYZ de votre armée qui a fait un mouvement de Charge à ce tour est choisie pour combattre.",
          "Cette unité BOYZ.",
          "Les attaques de mêlée de votre unité ont +1 en Attaques."),
        strat("mentalite-de-la-bande", "Mentalité de la Bande", 1, [M.vousCmd],
          "Début de l'étape d'Ébranlement de votre phase de Commandement.",
          "1 unité ORKS INFANTRY de votre armée de 13 figurines ou plus.",
          "Choisissez 1 unité ORKS amie visible et à 12\" ou moins de votre unité : ses tests d'Ébranlement sont réussis automatiquement."),
        strat("on-y-va", "On y Va !", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité BOYZ ou BEAST SNAGGA BOYZ de votre armée est choisie pour se déplacer.",
          "Cette unité BOYZ ou BEAST SNAGGA BOYZ.",
          "Votre unité a +2 à ses jets d'Avance.")
      ]
    }),

    /* ----- KULTE D'LA VITESS' (Kult of Speed) ----- */
    det("kulte-d-la-vitess", "Kulte d'la Vitess'", 1, ["reconnaissance"], [
      opt("la-kompet", "La Kompèt'", 15),
      amelio("bidule-k-enfume", "Bidule K'Enfume", 10)
    ], {
      nameEn: "Kult of Speed",
      rule: [
        "Les unités WARBIKERS amies ont le mot-clé BATTLELINE.",
        "Quand une unité SPEED FREEKS amie est choisie pour faire une Avance ou une Retraite :",
        "• ses attaques de tir ont [ASSAUT] jusqu'à la fin du tour ;",
        "• ce mouvement ne l'empêche pas d'être éligible pour déclarer une charge."
      ],
      stratagems: [
        strat("grave-fondus-d-la-vitess", "Grave Fondus d'la Vitess'", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité SPEED FREEKS de votre armée.",
          "Cette unité SPEED FREEKS.",
          "Les attaques de tir qui ciblent votre unité échouent sur un jet de touche non modifié de 1 à 3."),
        strat("grele-de-dakka", "Grêle de Dakka", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité SPEED FREEKS de votre armée est choisie pour tirer.",
          "Cette unité SPEED FREEKS.",
          "Les attaques de tir de votre unité ont [TOUCHES SOUTENUES 1]."),
        strat("squigs-delicieux", "Squigs Délicieux", 1, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité RUKKATRUKK SQUIGBUGGY de votre armée.",
          "Choisissez autant d'unités ORKS INFANTRY amies à 3\" ou moins de votre unité que vous le souhaitez : chacune récupère 3 PV perdus.")
      ]
    }),

    /* ----- MEKS ZINZINS (Madcap Meks) ----- */
    det("meks-zinzins", "Meks Zinzins", 1, ["disruption"], [
      amelio("aspire-minus-perfektionne", "Aspire-minus Perfektionné", 10),
      opt("j-ni-d-la-mekawaaagh", "J'ni d'la Mékawaaagh!", 30),
      amelio("shokkeur-caracteriel", "Shokkeur Caractériel", 20)
    ], {
      nameEn: "Madcap Meks",
      rule: [
        "À votre phase de Tir, quand toutes les attaques de tir d'une unité BIG MEK, MEK GUNZ, MORKANAUT ou WAZBOM BLASTAJET ciblent une seule unité ennemie, lancez 1D6 :",
        "• 1 : l'unité ennemie a une sauvegarde invulnérable de 4+ jusqu'à la fin de ces attaques ;",
        "• 2-3 : 1 autre unité ennemie à 3\" ou moins de la cible subit D3 blessures mortelles ;",
        "• 4 : ces attaques ont +1 au jet de touche ;",
        "• 5 : l'unité ciblée gagne le mot-clé FLY et ne bénéficie pas du couvert jusqu'à la fin de ces attaques ;",
        "• 6 : l'unité ciblée a -1 en Endurance pour ces attaques."
      ],
      stratagems: [
        strat("artilleurs-vindicatifs", "Artilleurs Vindicatifs", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité MEK GUNZ de votre armée est choisie pour tirer.",
          "Cette unité MEK GUNZ.",
          "Ses attaques de tir ont, au choix : [TOUCHES FATALES] ; ou [TOUCHES SOUTENUES 1] ; ou [À RISQUE], [TOUCHES FATALES] et [TOUCHES SOUTENUES 1].")
      ]
    }),

    /* ----- NUÉE DE MINUS (Runt Swarm) ----- */
    det("nuee-de-minus", "Nuée de Minus", 1, ["priority-assets"], [
      amelio("super-sournois", "Super Sournois", 10),
      amelio("demineurs-attitres", "Démineurs Attitrés", 10)
    ], {
      nameEn: "Runt Swarm",
      rule: ["Les unités GRETCHIN amies ont le mot-clé BATTLELINE, et faire une Avance ou une Retraite ne les empêche pas d'être éligibles pour commencer une action."],
      stratagems: [
        strat("boucliers-grots", "Boucliers Grots", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité ORKS INFANTRY de votre armée (sauf GRETCHIN).",
          "1 unité GRETCHIN de votre armée à 3\" ou moins de cette unité ORKS INFANTRY.",
          "Chaque fois qu'un jet de touche contre l'unité ciblée est réussi, tant qu'il reste une figurine dans votre unité GRETCHIN sur le champ de bataille, la séquence de cette attaque s'arrête et votre unité GRETCHIN subit 1 blessure mortelle."),
        strat("on-decampe", "On Décampe !", 1, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à moins de 8\" d'une unité GRETCHIN non engagée de votre armée.",
          "Cette unité GRETCHIN.",
          "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de 6\" maximum si elle est Attachée."),
        strat("zone-de-guerre-infestee", "Zone de Guerre Infestée", 2, [M.tout],
          "N'importe quelle phase, quand une unité ennemie a détruit une unité GRETCHIN de votre armée.",
          "Cette unité GRETCHIN.",
          "Ajoutez à votre armée une nouvelle unité identique, en Réserves Stratégiques.")
      ]
    }),

    /* ----- FLING'BOYZ (Shoota Boyz) ----- */
    det("fling-boyz", "Fling'Boyz", 1, ["purge-the-foe"], [
      opt("machin-k-eblouit", "Machin K'Éblouit", 25),
      opt("squigs-vizeurs", "Squigs Vizeurs", 20)
    ], {
      nameEn: "Shoota Boyz",
      rule: [
        "Les attaques de tir des unités ORKS INFANTRY amies ont [ASSAUT].",
        "Tant qu'une de ces unités est Vénère, ses attaques de tir ont aussi +3\" de portée."
      ],
      stratagems: [
        strat("dakka-kustom", "Dakka Kustom", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS INFANTRY de votre armée est choisie pour tirer.",
          "Cette unité ORKS INFANTRY.",
          "Les attaques de tir de votre unité qui ciblent une unité (sauf MONSTER et VEHICLE) ont +1 au jet de blessure."),
        strat("dakka-luizan", "Dakka Luizan", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS INFANTRY de votre armée est choisie pour tirer.",
          "Cette unité ORKS INFANTRY.",
          "Les attaques de tir de votre unité qui ciblent une unité à 9\" ou moins ont la Pénétration d'Armure améliorée de 1."),
        strat("jamais-assez-de-dakka", "Jamais Assez de Dakka", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS INFANTRY de votre armée est choisie pour tirer.",
          "Cette unité ORKS INFANTRY.",
          "Les attaques de tir de votre unité ont [TOUCHES SOUTENUES 1].")
      ]
    }),

    /* ----- BRIGADE TAKTIK (Taktikal Brigade) ----- */
    det("brigade-taktik", "Brigade Taktik", 1, ["take-and-hold"], [
      meneur("kommandant-kitu", "Kommandant Kitu", 20, "Kommandos"),
      amelio("egorjeurs", "Égorjeurs", 15)
    ], {
      nameEn: "Taktikal Brigade",
      rule: [
        "Les unités STORMBOYZ amies ont le mot-clé BATTLELINE.",
        "Quand une unité BOYZ, KOMMANDOS ou STORMBOYZ amie est choisie pour Battre en Retraite, cette Retraite ne l'empêche pas d'être éligible pour déclarer une charge."
      ],
      stratagems: [
        strat("kand-ils-ont-le-dos-tourne", "Kand ils ont le Dos Tourné", 1, [M.advMvt],
          "Fin de la phase de Mouvement adverse.",
          "1 unité BOYZ, KOMMANDOS ou STORMBOYZ non engagée de votre armée, qui était engagée au début de la phase.",
          "Votre unité peut faire un Mouvement Normal de 6\" maximum."),
        strat("kazi-koncentres-sur-la-mission", "Kazi Koncentrés sur la Mission", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité BOYZ, KOMMANDOS ou STORMBOYZ de votre armée est choisie pour faire une Avance ou une Retraite.",
          "Cette unité BOYZ, KOMMANDOS ou STORMBOYZ.",
          "Ce mouvement ne l'empêche pas d'être éligible pour commencer une action."),
        strat("retenue-douteuse", "Retenue Douteuse", 1, [M.vousMvt],
          "Début ou fin de votre phase de Mouvement.",
          "1 unité BOYZ, KOMMANDOS ou STORMBOYZ de votre armée.",
          "Choisissez un objectif que votre unité contrôle : il est sécurisé.")
      ]
    }),

    /* ----- HORDE DE GUERRE (War Horde) — 3 PDD ----- */
    det("horde-de-guerre", "Horde de Guerre", 3, ["take-and-hold", "purge-the-foe"], [
      opt("eul-boss-vous-r-garde", "Eul' Boss Vous R'garde", 25),
      opt("suivez-moi-les-gars", "Suivez-moi Les Gars", 20),
      opt("kikoup-kitu-de-headwoppa", "Kikoup' Kitu de Headwoppa", 15),
      opt("ruze-mais-brutal", "Ruzé mais Brutal", 20)
    ], {
      nameEn: "War Horde",
      rule: ["Les attaques de mêlée des unités ORKS amies ont [TOUCHES SOUTENUES 1]."],
      stratagems: [
        strat("dakka-a-bout-portant", "Dakka à Bout Portant", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS de votre armée est choisie pour tirer.",
          "Cette unité ORKS.",
          "Les attaques de tir de votre unité ont [TIR RAPIDE 1] ; si une arme a déjà [TIR RAPIDE], sa valeur augmente de 1 (par exemple [TIR RAPIDE 1] devient [TIR RAPIDE 2])."),
        strat("fauchez-y", "Fauchez-y !", 1, [M.combat],
          "Phase de Combat, quand une unité ORKS VEHICLE de votre armée (sauf WALKER) qui a fait un mouvement de Charge à ce tour est choisie pour combattre.",
          "Cette unité ORKS VEHICLE.",
          "Les attaques de mêlée de votre unité ont [ABATTAGE 1] ; si une arme a déjà [ABATTAGE], sa valeur augmente de 1 (par exemple [ABATTAGE 1] devient [ABATTAGE 2])."),
        strat("injection-de-nitrochampis", "Injection de Nitrochampis", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ORKS MOUNTED ou ORKS VEHICLE de votre armée est choisie pour se déplacer.",
          "Cette unité ORKS MOUNTED ou VEHICLE.",
          "Votre unité a +2\" en Mouvement."),
        strat("kasser-des-tetes", "Kasser des Têtes", 1, [M.tout],
          "N'importe quelle phase, quand une unité ORKS INFANTRY Attachée de votre armée devient Ébranlée.",
          "Cette unité ORKS INFANTRY (elle peut être ciblée même si elle est Ébranlée).",
          "Lancez 1D3 : votre unité subit autant de blessures mortelles, puis elle n'est plus Ébranlée."),
        strat("les-orks-sont-jamais-battus", "Les Orks sont Jamais Battus", 1, [M.combat],
          "Phase de Combat, quand une unité ennemie choisit pour cible une unité ORKS de votre armée (sauf TITANIC).",
          "Cette unité ORKS.",
          "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+1 si votre unité est Vénère) : sur 4+, " + COMBAT_AVANT_RETRAIT.charAt(0).toLowerCase() + COMBAT_AVANT_RETRAIT.slice(1)),
        strat("tapez-pluss-fort", "Tapez Pluss Fort", 1, [M.combat],
          "Phase de Combat, quand une unité ORKS de votre armée est choisie pour combattre.",
          "Cette unité ORKS.",
          "Les attaques de mêlée de votre unité ont [TOUCHES FATALES].")
      ]
    }),

    /* ----- BOUZILLEURS (Wreckas) ----- */
    det("bouzilleurs", "Bouzilleurs", 1, ["priority-assets"], [
      meneur("chapo-du-kap-tain", "Chapo du Kap'tain", 25, "Flash Gitz"),
      amelio("dakka-super-lux", "Dakka Super Lux", 25)
    ], {
      nameEn: "Wreckas",
      rule: ["À votre phase de Tir, les attaques des unités FLASH GITZ, LOOTAS et KASS'TANKS amies peuvent relancer les jets de touche de 1 si elles ciblent une unité à portée d'un objectif, ou si l'unité qui tire est à portée d'un objectif."],
      stratagems: [
        strat("chopez-ca", "Chopez-ça", 1, [M.vousTir],
          "Votre phase de Tir, après qu'une unité FLASH GITZ, LOOTAS ou KASS'TANKS non engagée de votre armée a tiré.",
          "Cette unité.",
          "Votre unité peut faire un Mouvement Normal de 6\" maximum, mais doit le finir à portée d'un objectif. Elle ne peut pas déclarer de charge à ce tour."),
        strat("debauche-de-dakka", "Débauche de Dakka", 1, [M.advTir],
          "Phase de Tir adverse, après qu'une unité ennemie a tiré et touché une unité FLASH GITZ ou KASS'TANKS de votre armée.",
          "Cette unité FLASH GITZ ou KASS'TANKS.",
          "Votre unité tire normalement, mais ne peut cibler que cette unité ennemie."),
        strat("kanardaj-embarque", "Kanardaj' Embarqué", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ORKS TRANSPORT de votre armée est choisie pour tirer.",
          "Cette unité ORKS TRANSPORT.",
          "Les armes choisies pour son aptitude Pont de Tir ont +1 au jet de touche.")
      ]
    }),

    /* ----- ZARBANDE (Wurrband) — pas de stratagème ----- */
    det("zarbande", "Zarbande", 1, ["disruption"], [
      opt("krunch", "Krunch!", 10),
      opt("kass-tete", "Kass' Tête", 15),
      opt("akkro", "Akkro", 25)
    ], {
      nameEn: "Wurrband",
      rule: [
        "Les attaques [PSYCHIQUE] des figurines ORKS PSYKER amies ont +1 en Force, et +1 en Force de plus par tranche de 5 figurines dans leur unité (ou embarquées dans cette figurine).",
        "Les figurines ORKS PSYKER amies ont l'aptitude psychique suivante :",
        "__Rugiss'ment d'Mork (niveau psychique 1)__ : à votre phase de Mouvement, si cette unité n'est pas Ébranlée, vous pouvez faire un jet psychique pour elle en lançant 1D6 ; sur 1, cette unité devient Ébranlée. Choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) à 12\" ou moins de cette unité : elle fait un test d'Ébranlement, avec -1 à ce test par tranche de 10 figurines dans votre unité.",
        "Ce détachement n'a pas de stratagème."
      ]
    })
  ]
});

})();
