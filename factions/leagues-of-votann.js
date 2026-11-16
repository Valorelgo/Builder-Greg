/* =========================================================
   LEAGUES OF VOTANN — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - Règle d'armée (Acquisition Hostile / Consolider la Prise, Points de
     Rendement) : complète, traduite depuis l'anglais. « Consolider la
     Prise » et « PR » repris des fiches françaises des détachements.
   - 10 détachements : règles et stratagèmes (51) saisis.
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - Unique : Âtrebande — Âtrebande et Convention d'Âtregardes
     (exclusiveGroup).
   - Optimisations notées « (Amélioration) » : kind "amelioration".
     Restrictions (requires) à préciser avec les textes.

   Unités citées : mots-clés anglais (comme les autres factions).
   Correspondances avec les noms français des fiches fournies :
     Maître-Fer = BRÔKHYR IRON-MASTER ; Stratège Memnyr = MEMNYR STRATEGIST
     Évaluateur Arkanyste = ARKANYST EVALUATOR
     Tonnekogs Brôkhyr = BRÔKHYR THUNDERKYN
     Chaudronniers Cognats de Fer = IRONKIN STEELJACKS (supposé)
     Beserks / Tremblaterres Chtoniens = CTHONIAN BESERKS / CTHONIAN EARTHSHAKERS
     Guerriers Âtrekogs = HEARTHKYN WARRIORS ; Yaegirs Hernkogs = HERNKYN YAEGIRS
     Hernkogs = HERNKYN ; Pionniers = HERNKYN PIONEERS
     Âtregardes Einhyrs = EINHYR HEARTHGUARD ; Champion Einhyr = EINHYR CHAMPION
     Ûthar le Destiné = ÛTHAR THE DESTINED
     Forteresse Mobile Hekaton = HEKATON LAND FORTRESS
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const TDB = "Tactique de Bataille";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation") => ({
  id, name, cost, kind,
  requires: [["Leagues of Votann"]],
  text: A_SAISIR
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");

// Moments des stratagèmes (vus du joueur Votann)
const M = {
  vousCmd:   { tour: "vous", phase: "commandement" },
  vousMvt:   { tour: "vous", phase: "mouvement" },
  vousTir:   { tour: "vous", phase: "tir" },
  vousCharge:{ tour: "vous", phase: "charge" },
  vousTout:  { tour: "vous", phase: "toutes" },
  advMvt:    { tour: "adversaire", phase: "mouvement" },
  advTir:    { tour: "adversaire", phase: "tir" },
  advCombat: { tour: "adversaire", phase: "combat" },
  combat:    { tour: "les-deux", phase: "combat" },
  tout:      { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, type, moments, quand, cible, effet) =>
  ({ id, name, cp, type, moments, quand, cible, effet });

const ETIQUETTE = "Ce détachement a l'étiquette ÂTREBANDE : il ne peut pas être pris avec un autre détachement ÂTREBANDE.";

Factions.register({
  id: "leagues-of-votann",
  name: "Leagues of Votann",
  keyword: "Leagues of Votann",

  armyRules: [
    {
      id: "points-de-rendement",
      name: "Points de Rendement (PR)",
      nameEn: "Yield Points (YP)",
      text: [
        "Si la Faction d'Armée de votre armée est LEAGUES OF VOTANN, les unités LEAGUES OF VOTANN de votre armée ont l'une de deux aptitudes : __Acquisition Hostile__ ou __Consolider la Prise__ (voir ci-dessous). Pendant la bataille, l'aptitude qu'ont ces unités dépend du nombre de Points de Rendement (PR) que vous avez :",
        "• Au début de la bataille, vos unités ont Acquisition Hostile jusqu'au début de votre prochaine phase de Commandement.",
        "• À la fin de votre phase de Commandement, si vous avez moins de 7 PR, vos unités ont Acquisition Hostile jusqu'au début de votre prochaine phase de Commandement.",
        "• À la fin de votre phase de Commandement, si vous avez 7 PR ou plus, vos unités ont Consolider la Prise jusqu'au début de votre prochaine phase de Commandement.",
        "__Gagner des PR__ : à la fin de la phase de Commandement de chaque joueur, vous gagnez 1 PR si vous contrôlez un ou plusieurs pions objectifs dans votre zone de déploiement. À partir du deuxième round de bataille, vous gagnez aussi 1 PR pour chacune des conditions suivantes que vous remplissez :",
        "• vous contrôlez un ou plusieurs pions objectifs hors de votre zone de déploiement ;",
        "• vous contrôlez deux pions objectifs ou plus hors de votre zone de déploiement ;",
        "• vous contrôlez plus de pions objectifs que votre adversaire.",
        "À votre tour, les PR gagnés de cette façon le sont toujours avant de déterminer quelle aptitude ont les unités LEAGUES OF VOTANN de votre armée.",
        "__Dépenser des PR__ : chaque fois qu'une règle vous permet de dépenser des PR, retirez-les de votre total (il ne peut pas descendre sous 0) ; si vous n'en avez pas assez, vous ne pouvez pas utiliser cette règle.",
        "__Note du concepteur__ : les règles qui font gagner ou dépenser des PR permettent donc de choisir l'aptitude de vos unités (Acquisition Hostile ou Consolider la Prise) selon ce qui vous avantage le plus. Votre armée ne change d'aptitude qu'à la fin de votre phase de Commandement : il faut parfois anticiper pour la garder ou en changer.",
        "__Exemple__ : à son troisième tour, les unités de Freida avaient Acquisition Hostile, car elle avait 6 PR à la fin de sa phase de Commandement. À son quatrième tour, à la fin de sa phase de Commandement, elle contrôle un pion objectif dans sa zone de déploiement et un autre hors de sa zone, et son adversaire en contrôle deux. Elle gagne 2 PR et en a donc 8 : ses unités ont maintenant Consolider la Prise.",
        "Pendant ce tour, Freida utilise un stratagème qui lui permet de dépenser des PR. Elle en dépense 2 et redescend à 6 PR. Ses unités gardent pourtant Consolider la Prise : elles ne changeront d'aptitude que si, à la fin de sa prochaine phase de Commandement, elle a toujours moins de 7 PR."
      ]
    },
    {
      id: "acquisition-hostile",
      name: "Acquisition Hostile",
      nameEn: "Hostile Acquisition",
      text: [
        "• Chaque fois qu'une figurine de cette unité fait une attaque qui cible une unité ennemie à portée d'un ou plusieurs pions objectifs, ajoutez 1 au jet de touche.",
        "• Vous pouvez relancer les jets d'Avance et de Charge de cette unité."
      ]
    },
    {
      id: "consolider-la-prise",
      name: "Consolider la Prise",
      nameEn: "Fortify Takeover",
      text: [
        "• Chaque fois qu'une figurine de cette unité fait une attaque qui cible une unité ennemie, si cette unité est à portée d'un ou plusieurs pions objectifs que vous contrôlez, ajoutez 1 au jet de touche.",
        "• Chaque fois qu'une attaque cible cette unité, si la Force de l'attaque est supérieure à l'Endurance de cette unité et que cette unité n'est pas un VEHICLE, soustrayez 1 au jet de blessure."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       PIONNIERS BLINDÉS (Armoured Trailblazers)
       ------------------------------------------------------- */
    {
      id: "pionniers-blindes", name: "Pionniers Blindés", nameEn: "Armoured Trailblazers",
      cost: 1, dispositions: ["disruption"],
      rule: { name: null, text: [
        "Les unités SAGITAUR de votre armée ont l'aptitude Éclaireurs 6\"."
      ] },
      enhancements: [
        amelio("lignes-d-attaque-optimisees", "Lignes d'Attaque Optimisées", 15),
        amelio("munitions-a-saturation", "Munitions à Saturation", 15)
      ],
      stratagems: [
        strat("construit-pour-durer", "Construit pour Durer", 1, null, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité SAGITAUR de votre armée.",
          "Cette unité SAGITAUR.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque de tir cible votre unité, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."),
        strat("debordement-de-blindes-par-le-flanc", "Débordement de Blindés par le Flanc", 1, null, [M.advMvt],
          "Fin de la phase de Mouvement adverse, à partir du deuxième round de bataille.",
          "Jusqu'à 2 unités SAGITAUR de votre armée en Réserves Stratégiques.",
          "Chacune de vos unités fait un mouvement d'arrivée."),
        strat("tirs-croises-coordonnes", "Tirs Croisés Coordonnés", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "Jusqu'à 2 unités SAGITAUR de votre armée.",
          "Choisissez 1 unité ennemie. Chaque fois qu'une figurine de vos unités fait une attaque de tir qui la cible, relancez un jet de touche de 1 et un jet de blessure de 1.")
      ]
    },

    /* -------------------------------------------------------
       BANDE ASSERMENTÉE EXPRESSE (Brandfast Oathband)
       ------------------------------------------------------- */
    {
      id: "bande-assermentee-expresse", name: "Bande Assermentée Expresse", nameEn: "Brandfast Oathband",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Les unités LEAGUES OF VOTANN TRANSPORT de votre armée ont l'aptitude suivante :",
        "__Aura__ : tant qu'une unité LEAGUES OF VOTANN INFANTRY amie est à 6\" ou moins de ce TRANSPORT, les attaques de tir de ses figurines INFANTRY ont [TOUCHES SOUTENUES 1]."
      ] },
      enhancements: [
        opt("jugement-precurseur", "Jugement Précurseur", 15),
        opt("restauration-distinctive", "Restauration Distinctive", 5),
        opt("alchimie-tactique", "Alchimie Tactique", 10),
        opt("cyber-implant-trivarg", "Cyber-implant Trivärg", 40)
      ],
      stratagems: [
        strat("efficience-inexorable", "Efficience Inexorable", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEAGUES OF VOTANN de votre armée.",
          "Jusqu'à la fin de la phase, elle est éligible pour tirer même si elle a Battu en Retraite à ce tour."),
        strat("escalade-opportuniste", "Escalade Opportuniste", 1, null, [M.advTir],
          "Phase de Tir adverse, si les unités de votre armée ont Acquisition Hostile, juste après qu'une unité ennemie a touché une unité LEAGUES OF VOTANN VEHICLE de votre armée (sauf HEKATON LAND FORTRESS).",
          "Cette unité VEHICLE.",
          "Elle peut faire un Mouvement Normal de D6\" maximum."),
        strat("fusee-de-vengeance", "Fusée de Vengeance", 2, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a touché une unité LEAGUES OF VOTANN INFANTRY de votre armée.",
          "1 unité KAPRICUS ou SAGITAUR de votre armée à 6\" ou moins de cette unité INFANTRY (ou 1 HEKATON LAND FORTRESS si vous dépensez 2 PR).",
          "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement l'unité ennemie attaquante, et seulement si c'est une cible éligible."),
        strat("mode-bastion", "Mode Bastion", 1, TDB, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 HEKATON LAND FORTRESS de votre armée pas encore choisie pour se déplacer à cette phase.",
          "Jusqu'à la fin de la phase, quand elle fait un Mouvement Normal ou une Avance, elle peut traverser horizontalement les éléments de terrain."),
        strat("positions-sures", "Positions Sûres", 1, null, [M.vousTout],
          "Fin de n'importe laquelle de vos phases.",
          "1 unité LEAGUES OF VOTANN TRANSPORT de votre armée.",
          "1 unité LEAGUES OF VOTANN embarquée dans ce TRANSPORT peut débarquer : ses figurines peuvent être placées n'importe où sur le champ de bataille, entièrement à 6\" ou moins du TRANSPORT. Elle ne peut pas déclarer de charge à ce tour, mais peut agir normalement pour le reste du tour."),
        strat("priorite-illuminee", "Priorité Illuminée", 1, null, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité LEAGUES OF VOTANN VEHICLE de votre armée a tiré.",
          "Cette unité VEHICLE.",
          "Choisissez 1 unité ennemie touchée par ces attaques. Jusqu'à la fin de la phase, chaque fois qu'une figurine LEAGUES OF VOTANN INFANTRY de votre armée attaque cette unité ennemie, ajoutez 1 au jet de touche.")
      ]
    },

    /* -------------------------------------------------------
       ÉQUIPE D'ASSAUT DE GHÂLERIE (Dêlve Assault Shift)
       ------------------------------------------------------- */
    {
      id: "equipe-d-assaut-de-ghalerie", name: "Équipe d'Assaut de Ghâlerie", nameEn: "Dêlve Assault Shift",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Les unités CTHONIAN BESERKS de votre armée ont l'aptitude Frappe en Profondeur et le mot-clé BATTLELINE."
      ] },
      enhancements: [
        opt("navigateur-de-ghalmonde", "Navigateur de Ghâlmonde", 25),
        opt("systeme-de-brouillage-multibande", "Système de Brouillage Multibande", 10),
        opt("marteau-pilon", "Marteau-pilon", 15),
        opt("superviseur-de-seisme", "Superviseur de Séisme", 20)
      ],
      stratagems: [
        strat("assaut-augmetique", "Assaut Augmétique", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité CTHONIAN BESERKS de votre armée pas encore choisie pour se déplacer à cette phase.",
          "Vous pouvez dépenser jusqu'à 2 PR : ajoutez autant de pouces au Mouvement de ses figurines. De plus, jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Avancé."),
        strat("force-inarretable", "Force Inarrêtable", 1, null, [M.combat],
          "Phase de Combat.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines fait un mouvement d'Engagement ou de Consolidation, elle peut se déplacer de 6\" au lieu de 3\"."),
        strat("fracture-tectonique", "Fracture Tectonique", 1, null, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité CTHONIAN EARTHSHAKERS de votre armée a tiré.",
          "Cette unité CTHONIAN EARTHSHAKERS.",
          "Choisissez 1 unité ennemie touchée par ces attaques. Jusqu'à votre prochaine phase de Mouvement, soustrayez 2 à sa caractéristique de Mouvement. Si vous dépensez 2 PR, soustrayez aussi 2 à ses jets de Charge."),
        strat("infusion-de-cyberstimulants", "Infusion de Cyberstimulants", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité CTHONIAN BESERKS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de blessure de 1. Si vous dépensez 2 PR, vous pouvez relancer le jet de blessure à la place."),
        strat("voies-d-acces-cachees", "Voies d'Accès Cachées", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité CTHONIAN BESERKS, HEARTHKYN WARRIORS ou HERNKYN YAEGIRS de votre armée non engagée.",
          "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."),
        strat("voute-de-tramonde", "Voûte de Trämonde", 1, null, [M.advTir],
          "Phase de Tir adverse, si les unités de votre armée ont Acquisition Hostile, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité LEAGUES OF VOTANN INFANTRY de votre armée choisie pour cible.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de blessure.")
      ]
    },

    /* -------------------------------------------------------
       CHERCHEURS DES CONFINS (Farseekers)
       ------------------------------------------------------- */
    {
      id: "chercheurs-des-confins", name: "Chercheurs des Confins", nameEn: "Farseekers",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: null, text: [
        "Chaque fois qu'une figurine HERNKYN de votre armée fait une attaque qui cible une unité à 12\" ou moins, ajoutez 1 au jet de touche."
      ] },
      enhancements: [
        amelio("verrouilleurs-panspectraux", "Verrouilleurs Panspectraux", 10),
        amelio("talismans-embrumonde", "Talismans Embrümonde", 15)
      ],
      stratagems: [
        strat("analyse-meprisante", "Analyse Méprisante", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "1 unité HERNKYN de votre armée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité. Les attaques des unités LEAGUES OF VOTANN de votre armée qui ciblent cette unité ennemie ont [IGNORE LE COUVERT]."),
        strat("economie-de-mouvement", "Économie de Mouvement", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité HERNKYN PIONEERS non engagée de votre armée.",
          "Cette unité HERNKYN PIONEERS.",
          "Elle peut faire un Mouvement Normal de D3+3\" maximum."),
        strat("ne-gachez-aucun-tir", "Ne Gâchez Aucun Tir", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité HERNKYN de votre armée est choisie pour tirer.",
          "Cette unité HERNKYN.",
          "Jusqu'à la fin de la phase, ses attaques de tir ont [TOUCHES FATALES].")
      ]
    },

    /* -------------------------------------------------------
       ÂTREBANDE (Hearthband)
       Unique : Âtrebande — exclusif avec Convention d'Âtregardes
       ------------------------------------------------------- */
    {
      id: "atrebande", name: "Âtrebande", nameEn: "Hearthband",
      cost: 3, dispositions: ["priority-assets", "reconnaissance"],
      exclusiveGroup: "âtrebande",
      rule: { name: null, text: [
        "Chaque fois qu'une figurine LEAGUES OF VOTANN de votre armée fait une attaque qui cible l'unité éligible la plus proche ou une unité à portée d'engagement de l'unité de cette figurine :",
        "• relancez un jet de blessure de 1 ;",
        "• si son unité est une unité KÂHL, EINHYR HEARTHGUARD ou ÛTHAR THE DESTINED, améliorez de 1 la Pénétration d'Armure de l'attaque.",
        ETIQUETTE
      ] },
      enhancements: [
        opt("bouclier-modele-bastion", "Bouclier modèle Bastion", 25),
        opt("grand-kahl", "Grand Kâhl", 30),
        opt("ferrotrame", "Ferrotrame", 10),
        opt("multigenerateur-sismique", "Multigénérateur Sismique", 15)
      ],
      stratagems: [
        strat("cause-certaine", "Cause Certaine", 1, null, [M.combat],
          "Phase de Combat.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines fait un mouvement d'Engagement ou de Consolidation, elle peut se déplacer de 6\" maximum au lieu de 3\"."),
        strat("durrlaks", "Dürrlâks", 1, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité KÂHL, ÛTHAR THE DESTINED ou EINHYR HEARTHGUARD de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          "Jusqu'à la fin de la phase, les figurines de votre unité ont une sauvegarde invulnérable de 4+."),
        strat("fureur-de-l-atre", "Fureur de l'Âtre", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité EINHYR HEARTHGUARD de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, ajoutez 1 à la Force des armes de tir de ses figurines. Si vous dépensez 1 PR, ces armes ont aussi [TOUCHES SOUTENUES 1]."),
        strat("hargne-obstinee", "Hargne Obstinée", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité LEAGUES OF VOTANN INFANTRY de votre armée a Battu en Retraite.",
          "Cette unité.",
          "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."),
        strat("matrices-de-materialisation", "Matrices de Matérialisation", 1, null, [M.vousMvt],
          "Étape des Renforts de votre phase de Mouvement.",
          "1 unité LEAGUES OF VOTANN de votre armée en Réserves qui a l'aptitude Frappe en Profondeur.",
          "Elle peut être placée n'importe où à plus de 6\" horizontalement de toute unité ennemie, mais n'est pas éligible pour déclarer une charge à ce tour."),
        strat("savoir-faire-superieur", "Savoir-faire Supérieur", 2, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité MONSTER ou VEHICLE, ajoutez 1 à la caractéristique de Dégâts de l'attaque.")
      ]
    },

    /* -------------------------------------------------------
       ARSENAL DU FEU DE L'ÂTRE (Hearthfyre Arsenal)
       « Chaudronniers Cognats de Fer » = IRONKIN STEELJACKS (supposé)
       ------------------------------------------------------- */
    {
      id: "arsenal-du-feu-de-l-atre", name: "Arsenal du Feu de l'Âtre", nameEn: "Hearthfyre Arsenal",
      cost: 2, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "À la fin de votre phase de Commandement, vous gagnez 1 PR pour chaque pion objectif hors de votre zone de déploiement que vous contrôlez et à portée duquel se trouve un BRÔKHYR IRON-MASTER ou un MEMNYR STRATEGIST de votre armée (2 PR maximum par tour).",
        "À votre phase de Tir, chaque fois qu'une unité BRÔKHYR, IRONKIN STEELJACKS ou ARKANYST EVALUATOR de votre armée est choisie pour tirer, vous pouvez dépenser 1 PR : jusqu'à la fin de la phase, relancez ses jets de touche de 1."
      ] },
      enhancements: [
        opt("tenacite-calculee", "Ténacité Calculée", 15),
        opt("nodule-arpentr", "Nodule ÂrpentR", 20),
        opt("ecrin-a-gravitons", "Écrin à Gravitons", 5),
        opt("manteau-des-anciens", "Manteau des Anciens", 10)
      ],
      stratagems: [
        strat("besoin-cogite", "Besoin Cogité", 1, null, [M.advMvt],
          "Fin de la phase de Mouvement adverse.",
          "1 unité IRONKIN STEELJACKS de votre armée.",
          "Elle peut faire un Mouvement Normal, mais doit le finir aussi près que possible du pion objectif le plus proche."),
        strat("munitions-a-retardement", "Munitions à Retardement", 1, null, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité BRÔKHYR, IRONKIN STEELJACKS ou ARKANYST EVALUATOR de votre armée a tiré.",
          "Cette unité.",
          "Choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) touchée par ces attaques. Jusqu'à votre prochaine phase de Mouvement, chaque fois qu'elle fait un Mouvement Normal, une Avance ou une Retraite, lancez 1D6 par figurine de cette unité : pour chaque 1, elle subit 1 blessure mortelle (6 au maximum)."),
        strat("mur-d-acier", "Mur d'Acier", 1, TDB, [M.vousCharge],
          "Votre phase de Charge, juste après qu'une unité IRONKIN STEELJACKS de votre armée a fini un mouvement de Charge.",
          "Cette unité IRONKIN STEELJACKS.",
          "Choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 par figurine de votre unité (+2D6 si vous dépensez 2 PR) : pour chaque 4+, l'unité ennemie subit 1 blessure mortelle (6 au maximum)."),
        strat("precision-infaillible", "Précision Infaillible", 2, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité BRÔKHYR THUNDERKYN de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, vous pouvez ignorer tout ou partie des modificateurs à la CT, au jet de touche, au jet de blessure et à la Pénétration d'Armure."),
        strat("preoccupation-premiere", "Préoccupation Première", 1, null, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité BRÔKHYR, IRONKIN STEELJACKS ou ARKANYST EVALUATOR de votre armée qui est restée stationnaire à la phase de Mouvement a tiré.",
          "Cette unité.",
          "Elle peut faire un Mouvement Normal."),
        strat("purge-preventive", "Purge Préventive", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, juste après qu'une unité ennemie a Battu en Retraite.",
          "1 unité BRÔKHYR THUNDERKYN ou IRONKIN STEELJACKS de votre armée.",
          "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible. Soustrayez 1 au jet de touche de ces attaques.")
      ]
    },

    /* -------------------------------------------------------
       CONVENTION D'ÂTREGARDES (Hearthguard Covenant)
       Unique : Âtrebande — exclusif avec Âtrebande
       ------------------------------------------------------- */
    {
      id: "convention-d-atregardes", name: "Convention d'Âtregardes", nameEn: "Hearthguard Covenant",
      cost: 1, dispositions: ["priority-assets"],
      exclusiveGroup: "âtrebande",
      rule: { name: null, text: [
        "Chaque fois qu'une figurine KÂHL, EINHYR CHAMPION, EINHYR HEARTHGUARD ou ÛTHAR THE DESTINED de votre armée fait une attaque de tir qui cible une unité à 9\" ou moins, relancez un jet de blessure de 1.",
        ETIQUETTE
      ] },
      enhancements: [
        opt("grand-kahl-convention", "Grand Kâhl", 30),
        opt("ferrotrame-convention", "Ferrotrame", 10)
      ],
      stratagems: [
        strat("durrlaks-convention", "Dürrlâks", 1, null, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité EINHYR HEARTHGUARD de votre armée.",
          "Cette unité EINHYR HEARTHGUARD.",
          "Jusqu'à la fin de la phase, les figurines de votre unité ont une sauvegarde invulnérable de 4+."),
        strat("fureur-de-l-atre-convention", "Fureur de l'Âtre", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité EINHYR HEARTHGUARD de votre armée est choisie pour tirer.",
          "Cette unité EINHYR HEARTHGUARD.",
          "Jusqu'à la fin de la phase, ajoutez 1 à la Force de ses attaques de tir. Si vous dépensez 1 PR, elles ont aussi [TOUCHES SOUTENUES 1]."),
        strat("matrice-de-materialisation", "Matrice de Matérialisation", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité EINHYR HEARTHGUARD de votre armée qui a l'aptitude Frappe en Profondeur est choisie pour faire un mouvement d'arrivée.",
          "Cette unité EINHYR HEARTHGUARD.",
          "Elle peut être placée n'importe où sur le champ de bataille à plus de 6\" horizontalement de toute unité ennemie, même dans la zone de déploiement adverse. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge.")
      ]
    },

    /* -------------------------------------------------------
       MERCENAIRES ASSERMENTÉS (Mercenary Oathband)
       ------------------------------------------------------- */
    {
      id: "mercenaires-assermentes", name: "Mercenaires Assermentés", nameEn: "Mercenary Oathband",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Les unités LEAGUES OF VOTANN de votre armée n'ont les aptitudes Acquisition Hostile et Consolider la Prise que de la façon décrite ici.",
        "Au début de la bataille, les unités LEAGUES OF VOTANN de votre armée ont Acquisition Hostile. À la fin de votre phase de Commandement, vous pouvez dépenser 3 PR : dans ce cas, elles perdent Acquisition Hostile et gagnent Consolider la Prise, ou l'inverse."
      ] },
      enhancements: [
        opt("manipulateur-de-moyens", "Manipulateur de Moyens", 25),
        opt("implant-de-ciblage-etacarn-sb9", "Implant de Ciblage EtaCarn SB9", 15),
        opt("prospecteur-mercenaire", "Prospecteur Mercenaire", 20),
        opt("courtage-metaphysique", "Courtage Métaphysique", 20)
      ],
      stratagems: [
        strat("arsenal-de-flibustier", "Arsenal de Flibustier", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEAGUES OF VOTANN INFANTRY de votre armée pas encore choisie pour tirer à cette phase.",
          "Vous pouvez dépenser 3 PR. Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de touche de 1 et un jet de blessure de 1. Si vous avez dépensé 3 PR, vous pouvez relancer le jet de touche à la place (et toujours relancer un jet de blessure de 1)."),
        strat("contrat-auxiliaire", "Contrat Auxiliaire", 1, null, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité LEAGUES OF VOTANN MOUNTED ou INFANTRY de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, les armes de ses figurines ont [PRÉCISION]."),
        strat("defense-optimale", "Défense Optimale", 1, null, [M.combat],
          "Phase de Combat.",
          "1 unité LEAGUES OF VOTANN INFANTRY de votre armée pas encore choisie pour combattre à cette phase.",
          "Vous pouvez dépenser 3 PR. Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de touche de 1 et un jet de blessure de 1. Si vous avez dépensé 3 PR, vous pouvez relancer le jet de blessure à la place (et toujours relancer un jet de touche de 1)."),
        strat("exploitation-mobile", "Exploitation Mobile", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité HERNKYN de votre armée hors de portée d'engagement de toute unité ennemie ; ou, si vous dépensez 2 PR, jusqu'à 2 unités HERNKYN de votre armée dans ce cas.",
          "Retirez vos unités du champ de bataille et placez-les en Réserves Stratégiques."),
        strat("grand-artifice", "Grand Artifice", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité LEAGUES OF VOTANN de votre armée a Battu en Retraite.",
          "Cette unité.",
          "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."),
        strat("nouveaux-horizons", "Nouveaux Horizons", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité LEAGUES OF VOTANN INFANTRY de votre armée hors de portée d'engagement de toute unité ennemie, et 1 TRANSPORT ami dans lequel elle peut embarquer.",
          "Si votre unité est entièrement à 6\" ou moins de ce TRANSPORT, elle peut y embarquer.")
      ]
    },

    /* -------------------------------------------------------
       BANDE ASSERMENTÉE DE GAÂRD DU BESOIN (Needgaârd Oathband)
       ------------------------------------------------------- */
    {
      id: "bande-assermentee-de-gaard-du-besoin", name: "Bande Assermentée de Gaârd du Besoin", nameEn: "Needgaârd Oathband",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Vous gagnez 1 PR pour chaque unité ennemie détruite."
      ] },
      enhancements: [
        opt("cimier-ancestral", "Cimier Ancestral", 15),
        opt("estimation-des-pertes", "Estimation des Pertes", 10),
        opt("ambassadeur-de-fer", "Ambassadeur de Fer", 5),
        opt("speculateur-assermente", "Spéculateur Assermenté", 30)
      ],
      stratagems: [
        strat("endurci-par-l-espace", "Endurci par l'Espace", 1, null, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, si les unités de votre armée ont Consolider la Prise, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité LEAGUES OF VOTANN de votre armée choisie pour cible.",
          "Jusqu'à ce que l'unité attaquante ait fini ses attaques, aggravez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité."),
        strat("marque-du-traqr", "Marque du TraqR", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de touche de 1 et un jet de blessure de 1."),
        strat("pour-l-honneur-de-la-tenance", "Pour l'Honneur de la Tenance", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure des armes de mêlée de ses figurines (de 2 si vous dépensez 3 PR)."),
        strat("reactions-de-represailles", "Réactions de Représailles", 2, null, [M.advTir],
          "Phase de Tir adverse, si les unités de votre armée ont Consolider la Prise, juste après qu'une unité ennemie a tiré sur une unité LEAGUES OF VOTANN de votre armée.",
          "Cette unité LEAGUES OF VOTANN.",
          "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible."),
        strat("retraite-en-bon-ordre", "Retraite en Bon Ordre", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité LEAGUES OF VOTANN de votre armée a Battu en Retraite.",
          "Cette unité.",
          "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."),
        strat("sentence-ancestrale", "Sentence Ancestrale", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, ses attaques de tir ont [TOUCHES SOUTENUES 1] ([TOUCHES SOUTENUES 2] si vous dépensez 3 PR).")
      ]
    },

    /* -------------------------------------------------------
       PROSPECTION PERSÉCUTRICE (Persecution Prospect)
       ------------------------------------------------------- */
    {
      id: "prospection-persecutrice", name: "Prospection Persécutrice", nameEn: "Persecution Prospect",
      cost: 2, dispositions: ["disruption"],
      rule: { name: "Adeptes de la Guérilla", text: [
        "Les unités LEAGUES OF VOTANN de votre armée ont l'aptitude suivante :",
        "__Adeptes de la Guérilla__ : à votre phase de Tir, quand cette unité est choisie pour tirer, elle peut choisir 1 unité ennemie éligible (sauf MONSTER et VEHICLE) et faire toutes ses attaques de tir contre elle. Juste après avoir tiré, si elle l'a touchée, cette unité ennemie est Assaillie jusqu'à votre prochaine phase de Tir (ou Clouée si elle était déjà Assaillie).",
        "Tant qu'une unité est Clouée, soustrayez 2 à sa caractéristique de Mouvement et 2 à ses jets de Charge."
      ] },
      enhancements: [
        opt("deceleur-de-points-faibles", "Déceleur de Points Faibles", 25),
        opt("stratege-nomade", "Stratège Nomade", 20),
        opt("saboteur-chirurgical", "Saboteur Chirurgical", 10),
        opt("decret-d-acquisition", "Décret d'Acquisition", 10)
      ],
      stratagems: [
        strat("avarice-variable", "Avarice Variable", 1, null, [M.tout],
          "Début de n'importe quelle phase, si les unités de votre armée ont Consolider la Prise.",
          "1 unité LEAGUES OF VOTANN CHARACTER de votre armée.",
          "Vous pouvez dépenser autant de PR que vous le souhaitez. Si vous avez alors 6 PR ou moins, les unités de votre armée repassent à Acquisition Hostile."),
        strat("elan-frontalier", "Élan Frontalier", 1, TDB, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité HERNKYN de votre armée pas encore choisie pour se déplacer à cette phase.",
          "Jusqu'à la fin de la phase, si elle Avance, ne lancez pas de dé : elle avance de 6\"."),
        strat("failles-exposees", "Failles Exposées", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité HERNKYN de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, si elle tire sur une unité Assaillie, ou si vous dépensez 2 PR, vous pouvez relancer ses jets de blessure."),
        strat("formation-dispersee", "Formation Dispersée", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité LEAGUES OF VOTANN INFANTRY ou MOUNTED de votre armée choisie pour cible.",
          "Jusqu'à la fin de la phase, votre unité a l'aptitude Discrétion et bénéficie du couvert."),
        strat("reflexe-d-accapareur", "Réflexe d'Accapareur", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité LEAGUES OF VOTANN de votre armée (sauf ARTILLERY et VEHICLE).",
          "Cette unité LEAGUES OF VOTANN.",
          "Elle peut faire un Mouvement Normal de D6\" maximum (6\" si vous dépensez 2 PR), mais ne peut pas embarquer."),
        strat("tactiques-de-ranger", "Tactiques de Ranger", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEAGUES OF VOTANN de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, si elle cible une unité Assaillie ou si elle a le mot-clé HERNKYN, vous pouvez relancer ses jets de touche.")
      ]
    }
  ]
});

})();
