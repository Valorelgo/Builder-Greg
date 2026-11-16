/* =========================================================
   CHAOS DAEMONS — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - Règle d'armée (L'Ombre du Chaos, Manifestation Démoniaque,
     Terreur Démoniaque) : complète, traduite depuis l'anglais.
   - 9 détachements : règles et stratagèmes (46) saisis d'après les
     fiches françaises fournies (résumés pour certaines règles :
     Incursion Démoniaque, Légion de l'Ombre).
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - Optimisations notées « (Amélioration) » : kind "amelioration".
     Restrictions (requires) à préciser avec les textes.

   Unités citées : mots-clés anglais (comme les autres factions).
     Montée = MOUNTED ; Ligne = BATTLELINE ; Personnage = CHARACTER
     Monstre = MONSTER ; Légion de l'Ombre = SHADOW LEGION
     Universel = UNDIVIDED ; Horreurs Roses = PINK HORRORS
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const TDB = "Tactique de Bataille";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation") => ({
  id, name, cost, kind,
  requires: [["Legiones Daemonica"]],
  text: A_SAISIR
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");

// Moments des stratagèmes (vus du joueur Chaos Daemons)
const M = {
  vousCmd:   { tour: "vous", phase: "commandement" },
  vousMvt:   { tour: "vous", phase: "mouvement" },
  vousTir:   { tour: "vous", phase: "tir" },
  vousCharge:{ tour: "vous", phase: "charge" },
  vousTout:  { tour: "vous", phase: "toutes" },
  advCmd:    { tour: "adversaire", phase: "commandement" },
  advMvt:    { tour: "adversaire", phase: "mouvement" },
  advTir:    { tour: "adversaire", phase: "tir" },
  advCharge: { tour: "adversaire", phase: "charge" },
  advCombat: { tour: "adversaire", phase: "combat" },
  combat:    { tour: "les-deux", phase: "combat" },
  tout:      { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, type, moments, quand, cible, effet) =>
  ({ id, name, cp, type, moments, quand, cible, effet });

// Stratagème « traverser les éléments de terrain », commun à plusieurs détachements
const traverser = (id, name, dieu) => strat(id, name, 1, null, [M.vousMvt, M.vousCharge],
  "Votre phase de Mouvement ou votre phase de Charge.",
  `1 unité LEGIONES DAEMONICA ${dieu} de votre armée.`,
  "Jusqu'à la fin de la phase, elle peut traverser les éléments de terrain.");

Factions.register({
  id: "chaos-daemons",
  name: "Chaos Daemons",
  keyword: "Legiones Daemonica",

  armyRules: [
    {
      id: "ombre-du-chaos",
      name: "L'Ombre du Chaos",
      nameEn: "The Shadow of Chaos",
      text: [
        "Si la Faction d'Armée de votre armée est LEGIONES DAEMONICA, certaines zones du champ de bataille sont considérées comme étant dans l'Ombre du Chaos de votre armée :",
        "• Votre zone de déploiement est toujours dans l'Ombre du Chaos de votre armée.",
        "• Au début de chaque phase, si vous contrôlez au moins la moitié des pions objectifs situés dans le No Man's Land, le No Man's Land est dans l'Ombre du Chaos de votre armée jusqu'à la fin de cette phase.",
        "• Au début de chaque phase, si vous contrôlez au moins la moitié des pions objectifs situés dans la zone de déploiement adverse, la zone de déploiement adverse est dans l'Ombre du Chaos de votre armée jusqu'à la fin de cette phase."
      ]
    },
    {
      id: "manifestation-demoniaque",
      name: "Manifestation Démoniaque",
      nameEn: "Daemonic Manifestation",
      text: [
        "Tant qu'une unité LEGIONES DAEMONICA amie est dans l'Ombre du Chaos de votre armée, chaque fois qu'elle fait un test d'Ébranlement, ajoutez 1 au test et, s'il est réussi, une figurine de cette unité récupère D3 PV perdus.",
        "Si cette unité est une unité BATTLELINE et que le test est réussi, vous pouvez à la place remettre dans l'unité jusqu'à D3 figurines détruites (sauf figurines CHARACTER)."
      ]
    },
    {
      id: "terreur-demoniaque",
      name: "Terreur Démoniaque",
      nameEn: "Daemonic Terror",
      text: [
        "Tant qu'une unité ennemie est dans l'Ombre du Chaos de votre armée, et/ou à 6\" ou moins d'une ou plusieurs unités BLOODTHIRSTER, GREAT UNCLEAN ONE, KAIROS FATEWEAVER, KEEPER OF SECRETS, LORD OF CHANGE, ROTIGUS, SHALAXI HELBANE ou SKARBRAND de votre armée, chaque fois qu'elle fait un test d'Ébranlement, soustrayez 1 au test et, s'il est raté, cette unité ennemie subit D3 blessures mortelles."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       LÉGION DU SANG (Blood Legion) — Khorne
       ------------------------------------------------------- */
    {
      id: "legion-du-sang", name: "Légion du Sang", nameEn: "Blood Legion",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Chaque fois qu'une unité ennemie (sauf AIRCRAFT) finit un Mouvement Normal ou une Avance à 8\" ou moins d'une ou plusieurs unités LEGIONES DAEMONICA KHORNE de votre armée, l'une de ces unités peut se déplacer de D6\" : elle doit finir ce mouvement aussi près que possible de cette unité ennemie, et peut finir à portée d'engagement d'elle.",
        "À la fin d'une phase au cours de laquelle une unité LEGIONES DAEMONICA KHORNE de votre armée a détruit une unité ennemie qui était à portée d'un pion objectif au début de la phase, si votre unité a un niveau de contrôle supérieur sur ce pion, il reste sous votre contrôle jusqu'à ce que le niveau de contrôle de votre adversaire y soit supérieur au vôtre à la fin d'une phase."
      ] },
      enhancements: [
        opt("gueule-d-airain", "Gueule d'Airain", 15),
        opt("cage-de-fureur", "Cage de Fureur", 20),
        opt("portail-vers-la-damnation", "Portail vers la Damnation", 10),
        opt("soif-de-massacre", "Soif de Massacre", 25)
      ],
      stratagems: [
        strat("colere-incontestable", "Colère Incontestable", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité LEGIONES DAEMONICA KHORNE de votre armée.",
          "Cette unité KHORNE.",
          "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité qui n'a pas encore combattu à cette phase est détruite par une attaque de mêlée, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle peut combattre après que l'unité attaquante a fini ses attaques, puis elle est retirée."),
        strat("gaine-d-airain", "Gainé d'Airain", 1, TDB, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi pour cible une unité LEGIONES DAEMONICA KHORNE de votre armée.",
          "Cette unité KHORNE.",
          "Jusqu'à la fin de la phase, les figurines de votre unité ont une caractéristique de Sauvegarde de 3+."),
        strat("la-fuite-des-fous", "La Fuite des Fous", 2, null, [M.advMvt],
          "Phase de Mouvement adverse, juste après qu'une unité ennemie a Battu en Retraite.",
          "1 unité LEGIONES DAEMONICA KHORNE de votre armée à 6\" ou moins de cette unité ennemie et qui serait éligible pour déclarer une charge contre elle.",
          "Elle peut déclarer une charge tout de suite, en ne ciblant que cette unité ennemie, mais ne reçoit pas de bonus de Charge à ce tour."),
        strat("le-sang-ramene-des-cranes", "Le Sang ramène des Crânes", 1, null, [M.vousCharge],
          "Votre phase de Charge.",
          "1 unité LEGIONES DAEMONICA KHORNE de votre armée pas encore choisie pour charger à cette phase.",
          "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge à un tour où elle a Avancé."),
        strat("les-cranes-ramenent-du-sang", "Les Crânes ramènent du Sang", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEGIONES DAEMONICA KHORNE MOUNTED ou INFANTRY de votre armée non engagée et qui n'a pas Battu en Retraite à ce tour.",
          "Choisissez 1 unité ennemie non engagée, visible et à 8\" ou moins de votre unité, et lancez six D6 : pour chaque 4+, elle subit 1 blessure mortelle."),
        traverser("offensive-sanguivore", "Offensive Sanguivore", "KHORNE")
      ]
    },

    /* -------------------------------------------------------
       CAVALCADE DU CHAOS (Cavalcade of Chaos)
       ------------------------------------------------------- */
    {
      id: "cavalcade-du-chaos", name: "Cavalcade du Chaos", nameEn: "Cavalcade of Chaos",
      cost: 1, dispositions: ["disruption"],
      rule: { name: null, text: [
        "Les unités LEGIONES DAEMONICA MOUNTED de votre armée sont éligibles pour tirer et déclarer une charge à un tour où elles ont Battu en Retraite."
      ] },
      enhancements: [
        amelio("destriers-apocalyptiques", "Destriers Apocalyptiques", 10),
        amelio("charge-briseuse-d-ames", "Charge Briseuse d'Âmes", 10)
      ],
      stratagems: [
        strat("chevauche-le-warp", "Chevauche-le-Warp", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité LEGIONES DAEMONICA MOUNTED de votre armée est choisie pour se déplacer.",
          "Cette unité MOUNTED.",
          "Votre unité a le mot-clé MOBILE."),
        strat("manifestations-ineluctables", "Manifestations Inéluctables", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie à portée d'engagement d'une unité LEGIONES DAEMONICA MOUNTED de votre armée est choisie pour Battre en Retraite.",
          "Cette unité MOUNTED.",
          "Les figurines de l'unité ennemie doivent faire des tests de Fuite Désespérée. Si elle est Ébranlée, soustrayez 1 à ces tests."),
        strat("par-dela-le-voile", "Par-delà le Voile", 2, null, [M.vousMvt, M.advMvt],
          "Fin de la phase de Mouvement, dès le premier round de bataille.",
          "1 unité LEGIONES DAEMONICA MOUNTED de votre armée en Réserves Stratégiques.",
          "Elle peut faire un mouvement d'arrivée.")
      ]
    },

    /* -------------------------------------------------------
       INCURSION DÉMONIAQUE (Daemonic Incursion)
       Règle : résumé fourni
       ------------------------------------------------------- */
    {
      id: "incursion-demoniaque", name: "Incursion Démoniaque", nameEn: "Daemonic Incursion",
      cost: 3, dispositions: ["take-and-hold", "disruption"],
      rule: { name: null, text: [
        "Une unité LEGIONES DAEMONICA de votre armée qui arrive en Frappe en Profondeur peut être placée à plus de 6\" (au lieu de 9\") horizontalement de toute unité ennemie, si elle est placée entièrement dans une zone qui est dans l'Ombre du Chaos de votre armée, ou entièrement à 6\" ou moins d'un Démon Majeur du même dieu de votre armée."
      ] },
      enhancements: [
        opt("a-rgath-le-roi-des-lames", "A'rgath, le Roi des Lames", 20),
        opt("voleuse-d-ames", "Voleuse d'Âmes", 15),
        opt("le-don-sans-fin", "Le Don Sans Fin", 30),
        opt("le-sceptre-eternel", "Le Sceptre Éternel", 25)
      ],
      stratagems: [
        strat("breuvage-de-terreur", "Breuvage de Terreur", 1, TDB, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité LEGIONES DAEMONICA de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses armes ; chaque fois qu'une de ses figurines attaque une unité Ébranlée, vous pouvez relancer le jet de blessure."),
        strat("corrompre-l-espace-reel", "Corrompre l'Espace Réel", 1, null, [M.vousCmd],
          "Début de votre phase de Commandement.",
          "1 unité LEGIONES DAEMONICA de votre armée à portée d'un pion objectif que vous contrôlez.",
          "Ce pion objectif est Corrompu : il reste sous votre contrôle jusqu'à ce que votre adversaire en prenne le contrôle au début ou à la fin d'un tour. Tant qu'il est Corrompu et sous votre contrôle, la zone à 6\" ou moins de lui est dans l'Ombre du Chaos de votre armée."),
        strat("invulnerabilite-demoniaque", "Invulnérabilité Démoniaque", 1, TDB, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi pour cible une unité LEGIONES DAEMONICA de votre armée.",
          "Cette unité LEGIONES DAEMONICA.",
          "Jusqu'à la fin de la phase, relancez ses jets de sauvegarde invulnérable de 1."),
        strat("le-royaume-du-chaos", "Le Royaume du Chaos", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "Jusqu'à 2 unités LEGIONES DAEMONICA de votre armée non engagées et dans l'Ombre du Chaos de votre armée, ou 1 unité LEGIONES DAEMONICA non engagée hors de l'Ombre.",
          "Retirez-les du champ de bataille et placez-les en Réserves Stratégiques. Elles font un mouvement d'arrivée à votre prochaine phase de Mouvement (même au premier round de bataille)."),
        strat("regain-warp", "Regain Warp", 1, null, [M.vousCharge],
          "Votre phase de Charge.",
          "1 unité LEGIONES DAEMONICA de votre armée dans l'Ombre du Chaos de votre armée.",
          "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge à un tour où elle a Avancé."),
        strat("residents-du-warp", "Résidents du Warp", 1, null, [M.vousMvt],
          "Étape des Renforts de votre phase de Mouvement.",
          "1 unité LEGIONES DAEMONICA de votre armée qui arrive en Frappe en Profondeur.",
          "Elle peut être placée à plus de 6\" horizontalement de toute unité ennemie (au lieu de 9\").")
      ]
    },

    /* -------------------------------------------------------
       LÉGION DE L'EXCÈS (Legion of Excess) — Slaanesh
       ------------------------------------------------------- */
    {
      id: "legion-de-l-exces", name: "Légion de l'Excès", nameEn: "Legion of Excess",
      cost: 2, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "Les unités LEGIONES DAEMONICA SLAANESH de votre armée sont éligibles pour déclarer une charge à un tour où elles ont Battu en Retraite.",
        "Chaque fois qu'une de ces unités finit un mouvement de Charge, vous pouvez décider qu'elle perd l'aptitude Combat en Premier. Dans ce cas, chaque fois qu'une de ses figurines attaque, vous pouvez relancer le jet de touche et relancer un jet de blessure de 1."
      ] },
      enhancements: [
        opt("avatar-de-la-perfection", "Avatar de la Perfection", 15),
        opt("couronne-onirique", "Couronne Onirique", 30),
        opt("fausse-majeste", "Fausse Majesté", 30),
        opt("avaleur-d-ames", "Avaleur d'Âmes", 10)
      ],
      stratagems: [
        strat("agonie-extatique", "Agonie Extatique", 1, null, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité LEGIONES DAEMONICA SLAANESH de votre armée (sauf MONSTER et VEHICLE).",
          "Cette unité SLAANESH.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."),
        strat("cavalcade-de-lames", "Cavalcade de Lames", 1, TDB, [M.vousCharge],
          "Votre phase de Charge, juste après qu'une unité LEGIONES DAEMONICA SLAANESH de votre armée a fini un mouvement de Charge.",
          "Cette unité SLAANESH.",
          "Choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 par figurine de votre unité à portée d'engagement de cette unité ennemie (six D6 si votre unité est un MONSTER) : pour chaque 4+, l'unité ennemie subit 1 blessure mortelle."),
        traverser("desir-fantasmatique", "Désir Fantasmatique", "SLAANESH"),
        strat("exces-irresistibles", "Excès Irrésistibles", 1, TDB, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi pour cible une unité LEGIONES DAEMONICA SLAANESH de votre armée.",
          "Cette unité SLAANESH.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche."),
        strat("excruciation-sensorielle", "Excruciation Sensorielle", 1, null, [M.vousCmd],
          "Votre phase de Commandement, si une unité LEGIONES DAEMONICA SLAANESH MONSTER de votre armée est sur le champ de bataille.",
          "Votre armée.",
          "Chaque unité ennemie dans l'Ombre du Chaos de votre armée doit faire un test d'Ébranlement, en soustrayant 1 au test si elle est en dessous de la moitié de son effectif."),
        strat("grands-tortionnaires", "Grands Tortionnaires", 2, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité LEGIONES DAEMONICA SLAANESH MONSTER de votre armée, ou jusqu'à 2 unités LEGIONES DAEMONICA SLAANESH (sauf MONSTER).",
          "Jusqu'à la fin de la phase, chaque fois qu'une de leurs figurines attaque, ajoutez 1 au jet de blessure.")
      ]
    },

    /* -------------------------------------------------------
       SEIGNEURS DU WARP (Lords of the Warp)
       ------------------------------------------------------- */
    {
      id: "seigneurs-du-warp", name: "Seigneurs du Warp", nameEn: "Lords of the Warp",
      cost: 1, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Les figurines LEGIONES DAEMONICA CHARACTER de votre armée (sauf MONSTER) ont +1 en Commandement et +1 en Contrôle d'Objectif."
      ] },
      enhancements: [
        amelio("bouffi-de-puissance", "Bouffi de Puissance", 10)
      ],
      stratagems: [
        strat("appel-meurtrier", "Appel Meurtrier", 1, null, [M.combat],
          "Phase de Combat, quand une unité LEGIONES DAEMONICA KHORNE CHARACTER de votre armée (sauf MONSTER) qui a fait un mouvement de Charge à ce tour est choisie pour combattre.",
          "Cette unité KHORNE CHARACTER.",
          "Ajoutez 1 à la caractéristique d'Attaques des armes de mêlée de votre unité."),
        strat("benediction-bilieuse", "Bénédiction Bilieuse", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "1 unité LEGIONES DAEMONICA NURGLE CHARACTER de votre armée (sauf MONSTER).",
          "Choisissez 1 unité ennemie visible et à 8\" ou moins de votre unité, et lancez sept D6 : pour chaque 4+, elle subit 1 blessure mortelle."),
        strat("festival-de-l-exces", "Festival de l'Excès", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a combattu.",
          "1 unité LEGIONES DAEMONICA SLAANESH CHARACTER de votre armée (sauf MONSTER) pas encore choisie pour combattre à cette phase.",
          "Votre unité a l'aptitude Combat en Premier et doit être la prochaine unité que vous choisissez pour combattre."),
        strat("magie-stridente", "Magie Stridente", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité LEGIONES DAEMONICA TZEENTCH CHARACTER de votre armée (sauf MONSTER) est choisie pour tirer.",
          "Cette unité TZEENTCH CHARACTER.",
          "Ses attaques de tir ont [TOUCHES FATALES].")
      ]
    },

    /* -------------------------------------------------------
       LÉGION DE LA PESTE (Plague Legion) — Nurgle
       ------------------------------------------------------- */
    {
      id: "legion-de-la-peste", name: "Légion de la Peste", nameEn: "Plague Legion",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: "Miasmes Mélancoliques", text: [
        "Tant qu'une unité ennemie est à 9\" ou moins d'une ou plusieurs unités LEGIONES DAEMONICA NURGLE de votre armée, elle est dans l'Ombre du Chaos de votre armée.",
        "À la phase de Commandement de chaque joueur, choisissez 1 unité ennemie dans l'Ombre du Chaos de votre armée : elle doit faire un test d'Ébranlement."
      ] },
      enhancements: [
        opt("fleau-du-chancre", "Fléau du Chancre", 15),
        opt("linceul-bourdonnant", "Linceul Bourdonnant", 35),
        opt("fontaine-de-spores", "Fontaine de Spores", 20),
        opt("gueules-d-asticots", "Gueules d'Asticots", 15)
      ],
      stratagems: [
        strat("ombres-troubles", "Ombres Troubles", 1, TDB, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité LEGIONES DAEMONICA NURGLE INFANTRY de votre armée.",
          "Jusqu'à la fin de la phase, quand elle fait un Mouvement Normal, ajoutez 5\" à sa caractéristique de Mouvement."),
        strat("peste-de-malheurs", "Peste de Malheurs", 1, null, [M.advCmd],
          "Phase de Commandement adverse, juste après qu'une unité ennemie a fait un test d'Ébranlement à cause de Miasmes Mélancoliques.",
          "1 autre unité ennemie à 9\" ou moins d'une unité LEGIONES DAEMONICA NURGLE de votre armée.",
          "Cette autre unité ennemie doit faire un test d'Ébranlement."),
        traverser("pourrissement-et-renouveau", "Pourrissement et Renouveau", "NURGLE"),
        strat("resurgence-fetide", "Résurgence Fétide", 2, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité LEGIONES DAEMONICA NURGLE de votre armée sur le champ de bataille.",
          "1 figurine détruite (sauf CHARACTER) revient dans l'unité avec tous ses PV, ou jusqu'à D3 figurines détruites (sauf CHARACTER) si c'est une unité BATTLELINE. Si c'est un MONSTER, à la place, 1 figurine de votre unité récupère jusqu'à D3+1 PV perdus."),
        strat("virulence-suintante", "Virulence Suintante", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité LEGIONES DAEMONICA NURGLE de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, un jet de touche non modifié de 5+ est une Touche Critique."),
        strat("visions-fievreuses", "Visions Fiévreuses", 1, TDB, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité LEGIONES DAEMONICA NURGLE de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, ajoutez 1 aux jets de touche de ses attaques. Après qu'elle a fini ses attaques, choisissez 1 unité ennemie touchée par une ou plusieurs d'entre elles : cette unité ennemie doit faire un test d'Ébranlement.")
      ]
    },

    /* -------------------------------------------------------
       LÉGION SCINTILLANTE (Scintillating Legion) — Tzeentch
       ------------------------------------------------------- */
    {
      id: "legion-scintillante", name: "Légion Scintillante", nameEn: "Scintillating Legion",
      cost: 2, dispositions: ["priority-assets"],
      rule: { name: "Pions de Flux", text: [
        "Vous commencez la bataille avec 3 pions de Flux. Vous pouvez dépenser 1 pion de Flux pour relancer un jet d'Avance, de touche, de blessure, de Dégâts ou de sauvegarde, ou un test de Risque, fait pour une figurine LEGIONES DAEMONICA TZEENTCH de votre armée.",
        "Chaque fois que vous dépensez un pion de Flux, votre adversaire en gagne 1. Il peut vous le rendre pour relancer un jet d'Avance, de touche, de blessure ou de sauvegarde pour son armée.",
        "À votre phase de Commandement, si votre adversaire a 1 pion de Flux ou plus, vous gagnez 1 pion de Flux."
      ] },
      enhancements: [
        opt("bouclier-improbable", "Bouclier Improbable", 30),
        opt("oeil-inevitable", "Œil Inévitable", 15),
        opt("marionnettiste-infernal", "Marionnettiste Infernal", 20),
        opt("leurrelame", "Leurrelame", 25)
      ],
      stratagems: [
        traverser("cauchemars-fatidiques", "Cauchemars Fatidiques", "TZEENTCH"),
        strat("delire-dissipe", "Délire Dissipé", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité LEGIONES DAEMONICA TZEENTCH de votre armée non engagée, ou jusqu'à 2 unités LEGIONES DAEMONICA TZEENTCH, même engagées, si vous dépensez 1 pion de Flux.",
          "Retirez vos unités du champ de bataille et placez-les en Réserves Stratégiques."),
        strat("eclipse-impossible", "Éclipse Impossible", 1, null, [M.tout],
          "N'importe quelle phase, si une unité LEGIONES DAEMONICA TZEENTCH MONSTER de votre armée est sur le champ de bataille.",
          "Votre armée.",
          "Choisissez le No Man's Land ou la zone de déploiement adverse (les deux si vous dépensez 1 pion de Flux). Jusqu'à la fin de la phase, ces zones sont dans l'Ombre du Chaos de votre armée."),
        strat("feu-capricieux", "Feu Capricieux", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité LEGIONES DAEMONICA TZEENTCH de votre armée à portée d'engagement d'une ou plusieurs unités ennemies.",
          "Jusqu'à la fin de la phase, ces unités ennemies ne sont pas considérées comme étant à portée d'engagement de votre unité pour choisir des cibles et faire des attaques de tir. Chaque fois qu'une figurine ennemie est détruite alors que son unité est à portée d'engagement de votre unité, lancez 1D6 : sur 5+, votre unité subit 1 blessure mortelle après que l'unité attaquante a fini ses attaques."),
        strat("pyrogenese", "Pyrogenèse", 1, TDB, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité LEGIONES DAEMONICA TZEENTCH de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, ajoutez 2 à la Force de ses armes ; ou dépensez 1 pion de Flux pour ajouter 3 à la Force et améliorer de 1 la Pénétration d'Armure à la place."),
        strat("realite-vacillante", "Réalité Vacillante", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité LEGIONES DAEMONICA TZEENTCH de votre armée.",
          "Cette unité TZEENTCH.",
          "Lancez 1D6 (vous pouvez dépenser 1 pion de Flux pour le relancer). Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, si le jet de touche non modifié (après relance) est égal à ce résultat, la séquence d'attaque prend fin, même si c'était une Touche Critique.")
      ]
    },

    /* -------------------------------------------------------
       LÉGION DE L'OMBRE (Shadow Legion)
       Règle : résumé fourni (liste détaillée des unités Heretic
       Astartes autorisées non saisie)
       ------------------------------------------------------- */
    {
      id: "legion-de-l-ombre", name: "Légion de l'Ombre", nameEn: "Shadow Legion",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Votre armée ne peut inclure aucun DAEMON PRINCE ni EPIC HERO (sauf BE'LAKOR), mais jusqu'à la moitié de ses points peut être consacrée à des unités HERETIC ASTARTES INFANTRY (à quelques exceptions près).",
        "Vos unités gagnent le mot-clé SHADOW LEGION ; BE'LAKOR et les unités HERETIC ASTARTES gagnent le mot-clé UNDIVIDED.",
        "• Unités SLAANESH : les unités ennemies ne peuvent pas faire de Tir en État d'Alerte (tir au jugé) contre elles.",
        "• Unités TZEENTCH : chaque fois qu'une attaque de mêlée les cible, soustrayez 1 au jet de touche ; elles ont l'aptitude Discrétion.",
        "• Unités NURGLE : chaque fois qu'une attaque les cible, si la Force de l'attaque est supérieure à leur Endurance, soustrayez 1 au jet de blessure.",
        "• Unités KHORNE : éligibles pour tirer et déclarer une charge à un tour où elles ont Avancé.",
        "• Unités UNDIVIDED : elles ont la règle Sombres Pactes même si la Faction d'Armée n'est pas HERETIC ASTARTES (BE'LAKOR réussit automatiquement son test). Les unités HERETIC ASTARTES ont l'aptitude Frappe en Profondeur."
      ] },
      enhancements: [
        opt("se-fondre-dans-les-tenebres", "Se Fondre dans les Ténèbres", 30),
        opt("ombres-bondissantes", "Ombres Bondissantes", 25),
        opt("malveillance-incarnee", "Malveillance Incarnée", 25),
        opt("manteau-d-obscurite", "Manteau d'Obscurité", 20)
      ],
      stratagems: [
        strat("chemin-d-ombre", "Chemin d'Ombre", 2, null, [M.advCharge],
          "Début de la phase de Charge adverse.",
          "1 unité SHADOW LEGION de votre armée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité : quand elle déclare une charge, soustrayez 1 à son jet de Charge. Si votre unité est NURGLE, cette unité ennemie doit aussi faire un test d'Ébranlement."),
        strat("courroux-canalise", "Courroux Canalisé", 1, null, [M.combat],
          "Phase de Combat.",
          "1 unité SHADOW LEGION de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, ses armes de mêlée ont [LANCE]. Si votre unité est KHORNE, améliorez aussi de 1 leur Pénétration d'Armure."),
        strat("ombres-liees", "Ombres Liées", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "Jusqu'à 1 unité HERETIC ASTARTES SHADOW LEGION et jusqu'à 1 unité LEGIONES DAEMONICA SHADOW LEGION de votre armée, non engagées.",
          "Retirez-les du champ de bataille et placez-les en Réserves Stratégiques."),
        strat("refus-de-mourir", "Refus de Mourir", 1, TDB, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité SHADOW LEGION de votre armée.",
          "1 figurine de votre unité récupère jusqu'à 3 PV perdus. Si votre unité est TZEENTCH, 1 figurine détruite (sauf CHARACTER) revient aussi dans l'unité avec tous ses PV."),
        strat("tenebres-envahissantes", "Ténèbres Envahissantes", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "Jusqu'à 1 unité HERETIC ASTARTES SHADOW LEGION et jusqu'à 1 unité LEGIONES DAEMONICA SHADOW LEGION de votre armée arrivées depuis les Réserves à ce tour.",
          "Jusqu'à la fin de la phase, leurs armes ont [IGNORE LE COUVERT]."),
        strat("trepas-fielleux", "Trépas Fielleux", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité SHADOW LEGION de votre armée a été détruite (avant tout jet de Destruction Néfaste).",
          "Cette unité SHADOW LEGION.",
          "Lancez 1D6 pour chaque unité ennemie à portée d'engagement de la dernière figurine de votre unité (ajoutez 2 au résultat si votre unité est SLAANESH) : sur 4-5, elle subit D3 blessures mortelles ; sur 6+, elle en subit 3.")
      ]
    },

    /* -------------------------------------------------------
       MARÉE WARP (Warptide)
       ------------------------------------------------------- */
    {
      id: "maree-warp", name: "Marée Warp", nameEn: "Warptide",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: null, text: [
        "Quand une unité LEGIONES DAEMONICA BATTLELINE de votre armée est choisie pour Avancer :",
        "• ses attaques de tir ont [ASSAUT] jusqu'à la fin du tour ;",
        "• elle reste éligible pour déclarer une charge à ce tour."
      ] },
      enhancements: [
        amelio("armes-de-maleforge", "Armes de Maleforge", 15),
        amelio("massacreurs-assoiffes-d-ames", "Massacreurs Assoiffés d'Âmes", 10)
      ],
      stratagems: [
        strat("entites-incorporelles", "Entités Incorporelles", 1, null, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité LEGIONES DAEMONICA BATTLELINE de votre armée.",
          "Cette unité BATTLELINE.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque de tir cible votre unité, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."),
        strat("infestation-demoniaque", "Infestation Démoniaque", 1, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité LEGIONES DAEMONICA BATTLELINE de votre armée (sauf PINK HORRORS).",
          "Votre unité récupère 3 PV perdus."),
        strat("vision-spirituelle", "Vision Spirituelle", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "1 unité LEGIONES DAEMONICA BATTLELINE de votre armée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité : elle a +6\" en portée de détection.")
      ]
    }
  ]
});

})();
