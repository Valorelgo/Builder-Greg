/* =========================================================
   WORLD EATERS — Données de faction (faction jouable, FactionCatalog)
   Détachements, optimisations et stratagèmes en français ;
   unités, armes et mots-clés en anglais (comme les CSM).

   ÉTAT
   - Unités : complètes (24 fiches World Eaters, d'après les fiches fournies).
     Lord Invocatus : catégorie epic-mounted, ajoutée au moteur (js/config.js).
     Heldrake : rangé en véhicules (pas de mot-clé AIRCRAFT).
   - Culte du Sang : BATTLELINE donné aux Jakhals et Goremongers (grantsKeywords) ;
     le plafond d'exemplaires du moteur reste celui des unités non-Ligne.
   - Disciple de Khorne : donne BLOOD LEGIONS (compté dans les 50 %, pas de
     Seigneur de Guerre) et le rattachement aux Bloodcrushers / Flesh Hounds
     (Flesh Hounds et Bloodcrushers confirmés).
   - Démons de Khorne (BLOOD LEGIONS) : fichier auxiliaire blood-legions.js,
     débloqué par Démoniaux de Khorne (unlocks/extraFiles, 50 % des points,
     pas de Seigneur de Guerre), comme les démons des Emperor's Children.
     Saisis : Skarbrand, Bloodthirster, Bloodletters, Flesh Hounds, Bloodcrushers.
   - Règle d'armée (Pacte de Sang, Bénédictions de Khorne) : complète,
     traduite depuis l'anglais. Noms français des Bénédictions : à
     vérifier avec le codex français (nom anglais affiché à côté).
   - 8 détachements complets : règles, stratagèmes (39), optimisations
     (26), d'après les fiches françaises fournies (souvent résumées).
   - Démoniaux de Khorne : la règle était partiellement masquée sur la
     fiche (début et fin à vérifier).
   - Noms d'optimisations : ceux de la liste officielle des points
     (« Avidité Guerrière », « Corps d'Airain ») ; les fiches les
     appelaient « Assoiffé de Combats » et « Forme d'Airain ».

   Unités citées : mots-clés anglais (comme les autres factions).
   Correspondances avec les noms français des fiches :
     Berzerks de Khorne = KHORNE BERZERKERS ; Chakhals = JAKHALS
     Munifisangs = GOREMONGERS (confirmé)
     Escouade Terminator = TERMINATOR SQUAD
     Véhicule Démon = DAEMON VEHICLE ; Ferrocerberus = MAULERFIEND (confirmé)
     Octoliés = EIGHTBOUND ; Octoliés Exaltés = EXALTED EIGHTBOUND
     Possédés = POSSESSED (confirmé par la fiche du Slaughterbound)
     Légions du Sang = BLOOD LEGIONS ; Sanguinaires = BLOODLETTERS
     Équarrisseurs = BLOODCRUSHERS (confirmé) ; Molosses de Khorne = FLESH HOUNDS (confirmé)
     Seigneur sur Juggernaut = LORD ON JUGGERNAUT
     Titanesque = TITANIC ; Héros Épique = EPIC HERO
   ========================================================= */

(() => {

const TDB = "Tactique de Bataille";
const WE = "World Eaters";

// Optimisation (personnage) ou amélioration (unité)
const opt = (id, name, cost, text, requires = [[WE]], extra = {}) =>
  ({ id, name, cost, kind: "optimisation", requires, text, ...extra });
const amelio = (id, name, cost, text, requires) =>
  ({ id, name, cost, kind: "amelioration", requires, text });

// Moments des stratagèmes (vus du joueur World Eaters)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  vousCharge: { tour: "vous", phase: "charge" },
  vousCombat: { tour: "vous", phase: "combat" },
  advCmd:     { tour: "adversaire", phase: "commandement" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCombat:  { tour: "adversaire", phase: "combat" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, type, moments, quand, cible, effet, extra = {}) =>
  ({ id, name, cp, type, moments, quand, cible, effet, ...extra });

// Une Bénédiction de Khorne : dés requis, puis effet
const benediction = (id, name, nameEn, des, effet) => ({
  id, name, nameEn,
  text: [`__Dés requis__ : ${des}.`, effet]
});

// Jakhals et Goremongers, souvent cités ensemble (Culte du Sang)
const JG = "JAKHALS ou GOREMONGERS";
const PRES_IDOLE = "à 6\" ou moins d'une unité WORLD EATERS MONSTER, ou à 9\" ou moins d'une unité WORLD EATERS TITANIC, de votre armée";

Factions.register({
  id: "world-eaters",
  name: "World Eaters",
  keyword: WE,

  armyRules: [
    {
      id: "pacte-de-sang",
      name: "Pacte de Sang",
      nameEn: "Pact of Blood",
      text: [
        "Par des actes de violence frénétique et de sauvagerie sans frein, les World Eaters peuvent ouvrir une déchirure dans la réalité, laissant les démons de Khorne se déverser de ce domaine infernal.",
        "Quand vous rassemblez votre armée, sauf mention contraire, vous ne pouvez pas choisir BLOOD LEGIONS comme Faction d'Armée."
      ]
    },
    {
      id: "benedictions-de-khorne",
      name: "Bénédictions de Khorne",
      nameEn: "Blessings of Khorne",
      text: [
        "Khorne est le dieu du Chaos de la guerre et du massacre, auquel tous les World Eaters sont voués. Il bénit ceux qui versent le sang et prennent des crânes en son nom infernal.",
        "Si la Faction d'Armée de votre armée est WORLD EATERS, au début du round de bataille, vous pouvez faire un jet de Bénédictions de Khorne : lancez huit D6. Vous pouvez ensuite utiliser ces dés pour activer jusqu'à deux Bénédictions de Khorne (voir ci-dessous).",
        "Chaque Bénédiction de Khorne indique les résultats de dés qu'elle demande (quand une valeur est indiquée, il faut un double ou un triple de cette valeur ou plus). Chaque Bénédiction ne peut être activée qu'une fois par round de bataille. Les dés inutilisés du jet de Bénédictions de Khorne sont ensuite défaussés.",
        "Une fois activée, chaque Bénédiction de Khorne s'applique à toutes les unités de votre armée qui ont cette aptitude jusqu'à la fin du round de bataille.",
        "__Exemple__ : Ash fait un jet de Bénédictions de Khorne et obtient 1, 2, 2, 2, 3, 4, 6, 6. Il utilise d'abord les deux 6 pour activer Lames Warp (qui demande un double 5+) ; il lui reste 1, 2, 2, 2, 3, 4. Il utilise ensuite deux 2 pour activer Soif de Sang Débridée. Deux Bénédictions ayant été activées, il ne peut plus en activer et les dés restants sont défaussés."
      ]
    },
    benediction("soif-de-sang-debridee", "Soif de Sang Débridée", "Unbridled Bloodlust",
      "double 1+",
      "Cette unité a +1 à ses jets de Charge."),
    benediction("vigueur-de-la-rage", "Vigueur de la Rage", "Rage-Fuelled Invigoration",
      "double 2+",
      "Chaque fois qu'une figurine de cette unité fait un mouvement d'Engagement ou de Consolidation, elle peut se déplacer de 6\" maximum au lieu de 3\"."),
    benediction("carnage-total", "Carnage Total", "Total Carnage",
      "double 3+",
      "Chaque fois qu'une figurine de cette unité est détruite par une attaque de mêlée, si elle n'a pas encore combattu à cette phase, lancez 1D6 : sur 4+, ne la retirez pas du jeu. Elle peut combattre après que l'unité attaquante a fini ses attaques, puis elle est retirée du jeu."),
    benediction("excellence-martiale", "Excellence Martiale", "Martial Excellence",
      "double 4+ ou triple 1+",
      "Les armes de mêlée des figurines de cette unité ont [TOUCHES SOUTENUES 1]."),
    benediction("lames-warp", "Lames Warp", "Warp Blades",
      "double 5+ ou triple 2+",
      "Les armes de mêlée des figurines de cette unité ont [TOUCHES FATALES]."),
    benediction("frappes-decapitantes", "Frappes Décapitantes", "Decapitating Strikes",
      "double 6 ou triple 3+",
      "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée qui cible une unité INFANTRY, cette attaque a [BLESSURES DÉVASTATRICES].")
  ],

  detachments: [

    /* -------------------------------------------------------
       BANDE DE BERZERKS (Berzerker Warband)
       ------------------------------------------------------- */
    {
      id: "bande-de-berzerks", name: "Bande de Berzerks", nameEn: "Berzerker Warband",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Ajoutez 1 à la caractéristique d'Attaques des armes de mêlée des figurines WORLD EATERS de votre armée."
      ] },
      enhancements: [
        opt("avidite-guerriere", "Avidité Guerrière", 20,
          "Vous pouvez relancer les jets de Charge de l'unité du porteur. De plus, tant que Soif de Sang Débridée est active, ajoutez 1 à ces jets."),
        opt("vouge-de-berzerk", "Vouge de Berzerk", 35,
          "Ajoutez 1 aux caractéristiques d'Attaques et de Dégâts des armes de mêlée du porteur (sauf Attaques Bonus)."),
        opt("favori-de-khorne", "Favori de Khorne", 20,
          "Tant que le porteur est sur le champ de bataille, vous pouvez relancer jusqu'à 2 D6 de votre jet de Bénédictions de Khorne."),
        opt("heaume-de-colere-d-airain", "Heaume de Colère d'Airain", 30,
          "Chaque fois qu'une attaque est allouée au porteur, soustrayez 1 à la caractéristique de Dégâts de l'attaque.")
      ],
      stratagems: [
        strat("colere-du-berzerk", "Colère du Berzerk", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          "1 unité KHORNE BERZERKERS de votre armée qui peut faire un mouvement d'élan suite à ces attaques.",
          "Ne lancez pas de dé pour la distance de ce mouvement d'élan : ses figurines peuvent se déplacer de 8\" maximum."),
        strat("couper-et-trancher", "Couper et Trancher", 1, TDB, [M.vousCombat],
          "Phase de Combat.",
          "1 unité WORLD EATERS de votre armée qui a Chargé à ce tour et pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses armes de mêlée."),
        strat("des-cranes-pour-le-trone-de-cranes", "Des Crânes pour le Trône de Crânes !", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité WORLD EATERS de votre armée a détruit une figurine CHARACTER ou MONSTER.",
          "Votre armée.",
          "Faites un jet de Bénédictions de Khorne et utilisez-le pour activer 1 Bénédiction de Khorne : elle est active jusqu'à la fin du round de bataille, en plus de celles déjà actives."),
        strat("frenesie-apoplectique", "Frénésie Apoplectique", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité KHORNE BERZERKERS de votre armée a été choisie pour Avancer.",
          "Cette unité KHORNE BERZERKERS.",
          "Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Avancé."),
        strat("offrande-de-sang", "Offrande de Sang", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité WORLD EATERS de votre armée a été détruite alors qu'elle était à portée d'un pion objectif que vous contrôliez.",
          "Ce pion objectif.",
          "Il reste sous votre contrôle, même sans figurine de votre armée à sa portée, jusqu'à ce que le niveau de contrôle de votre adversaire y soit supérieur au vôtre à la fin d'une phase."),
        strat("resistance-enragee", "Résistance Enragée", 2, TDB, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité WORLD EATERS de votre armée.",
          "Cette unité WORLD EATERS.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque est allouée à une figurine de votre unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque.")
      ]
    },

    /* -------------------------------------------------------
       MACHINES D'AIRAIN (Brazen Engines)
       ------------------------------------------------------- */
    {
      id: "machines-d-airain", name: "Machines d'Airain", nameEn: "Brazen Engines",
      cost: 1, dispositions: ["disruption"],
      rule: { name: "Terreur de Khorne", text: [
        "Les unités DAEMON VEHICLE de votre armée ont l'aptitude suivante :",
        "__Terreur de Khorne__ : au début de la phase de Combat, vous pouvez choisir 1 unité ennemie à portée d'engagement de cette unité. Elle doit faire un test d'Ébranlement, en soustrayant 1 au test. Une même unité ennemie ne peut être choisie pour cet effet qu'une fois par phase."
      ] },
      enhancements: [
        amelio("entite-forgee-pour-le-meurtre", "Entité Forgée pour le Meurtre", 15,
          "Cette unité a le mot-clé DAEMON.", [[WE, "Vehicle"]]),
        amelio("serres-barbares", "Serres Barbares", 20,
          "Les Maulerfiend fists (Poings de Ferrocerberus) des figurines de cette unité ont [ABATTAGE 2].", [["Maulerfiend"]])
      ],
      stratagems: [
        strat("attise-jusqu-a-la-fureur", "Attisé jusqu'à la Fureur", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie qui a choisi pour cible une unité DAEMON VEHICLE non engagée de votre armée (sauf TITANIC) a tiré.",
          "Cette unité DAEMON VEHICLE.",
          "Elle peut faire un mouvement d'élan de D6\" maximum."),
        strat("lucidite-apoplectique", "Lucidité Apoplectique", 1, null, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat, quand une unité DAEMON VEHICLE de votre armée est choisie pour attaquer.",
          "Cette unité DAEMON VEHICLE.",
          "Jusqu'à la fin de la phase, ses attaques peuvent ignorer tout ou partie des modificateurs à la CT, à la CC, aux jets de touche et aux jets de blessure."),
        strat("trainee-de-destruction", "Traînée de Destruction", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité DAEMON VEHICLE de votre armée est choisie pour se déplacer.",
          "Cette unité DAEMON VEHICLE.",
          "Jusqu'à la fin de la phase, elle a le mot-clé MOBILE.")
      ]
    },

    /* -------------------------------------------------------
       BOUCHERS DE KHORNE (Butchers of Khorne)
       ------------------------------------------------------- */
    {
      id: "bouchers-de-khorne", name: "Bouchers de Khorne", nameEn: "Butchers of Khorne",
      cost: 1, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Au début de la phase de Combat, si une unité TERMINATOR SQUAD de votre armée est engagée, faites un jet de Bénédictions de Khorne et utilisez le résultat pour activer 1 Bénédiction de Khorne. Jusqu'à la fin de la phase, cette Bénédiction est active pour les unités TERMINATOR SQUAD de votre armée, en plus de toutes les Bénédictions déjà actives."
      ] },
      enhancements: [
        amelio("veterans-macules-de-sang", "Vétérans Maculés de Sang", 20,
          "Améliorez de 1 la Capacité de Combat des armes de mêlée des figurines de cette unité.", [["Terminator Squad"]]),
        amelio("sanctification-par-le-massacre", "Sanctification par le Massacre", 15,
          "Ajoutez 1 à la caractéristique de Contrôle d'Objectif des figurines de cette unité.", [["Terminator Squad"]])
      ],
      stratagems: [
        strat("colere-irraisonnee", "Colère Irraisonnée", 2, null, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité TERMINATOR SQUAD de votre armée.",
          "Cette unité TERMINATOR SQUAD.",
          "Jusqu'à ce que l'unité ennemie ait fini ses attaques, chaque fois qu'une attaque de tir est allouée à une figurine de votre unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque."),
        strat("ferocite-concentree", "Férocité Concentrée", 1, null, [M.combat],
          "Phase de Combat, quand une unité TERMINATOR SQUAD de votre armée est choisie pour combattre.",
          "Cette unité TERMINATOR SQUAD.",
          "Jusqu'à la fin de la phase, ajoutez 1 à la caractéristique d'Attaques des armes de mêlée de ses figurines."),
        strat("un-trophee-pour-le-trone", "Un Trophée pour le Trône", 1, null, [M.combat],
          "Phase de Combat, quand une unité TERMINATOR SQUAD de votre armée est choisie pour combattre.",
          "Cette unité TERMINATOR SQUAD.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité MONSTER ou VEHICLE, ajoutez 1 au jet de blessure.")
      ]
    },

    /* -------------------------------------------------------
       CULTE DU SANG (Cult of Blood)
       Munifisangs = GOREMONGERS (confirmé)
       ------------------------------------------------------- */
    {
      id: "culte-du-sang", name: "Culte du Sang", nameEn: "Cult of Blood",
      cost: 2, dispositions: ["priority-assets"],
      grantsKeywords: [{ to: [["Jakhals"], ["Goremongers"]], keywords: ["Battleline"] }],
      rule: { name: "Idoles de Khorne", text: [
        "Les unités JAKHALS et GOREMONGERS de votre armée ont le mot-clé BATTLELINE.",
        "Au début de votre phase de Commandement, vous pouvez choisir l'une des auras suivantes (chacune une fois par bataille au maximum) pour les unités WORLD EATERS MONSTER et TITANIC de votre armée. Jusqu'à votre prochaine phase de Commandement, elle s'applique aux unités JAKHALS et GOREMONGERS de votre armée à 6\" ou moins de l'une de ces unités (9\" si elle est TITANIC) :",
        "• +1 aux jets de touche/blessure ;",
        "• +1 aux jets d'Avance et de Charge ;",
        "• sauvegarde invulnérable de 4+."
      ] },
      enhancements: [
        opt("corps-d-airain", "Corps d'Airain", 25,
          "Ajoutez 1 à la caractéristique d'Endurance du porteur. Le porteur a l'aptitude Insensible à la Douleur 5+.", [[WE, "Monster"]]),
        opt("seigneur-boucher", "Seigneur Boucher", 10,
          "Le porteur a l'aptitude Infiltrateurs. Il a l'aptitude Meneur et peut être rattaché à une unité JAKHALS ou GOREMONGERS.", [[WE, "Infantry"]],
          { grantsLeaderOf: ["Jakhals", "Goremongers"] }),
        opt("elu-du-dieu-du-sang", "Élu du Dieu du Sang", 15,
          "Ajoutez 3\" à la portée des aptitudes Aura du porteur.", [[WE, "Monster"]]),
        opt("stratege-massacreur", "Stratège-massacreur", 20,
          "Après le déploiement des deux armées, vous pouvez redéployer jusqu'à 3 unités JAKHALS ou GOREMONGERS de votre armée. Elles peuvent être placées en Réserves Stratégiques, sans tenir compte du nombre d'unités déjà en Réserves Stratégiques.")
      ],
      stratagems: [
        strat("attire-par-le-massacre", "Attiré par le Massacre", 2, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité JAKHALS de votre armée a été détruite.",
          "Cette unité JAKHALS.",
          "Ajoutez à votre armée, en Réserves Stratégiques, une nouvelle unité identique à son effectif de départ (sans le Personnage qui la menait)."),
        strat("dans-l-ombre-des-idoles-d-airain", "Dans l'Ombre des Idoles d'Airain", 1, null, [M.advTir, M.combat],
          `Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité ${JG} de votre armée.`,
          `Cette unité ${JG}.`,
          `Jusqu'à la fin de la phase, ses figurines ont l'aptitude Insensible à la Douleur 6+ (5+ si votre unité est ${PRES_IDOLE}).`),
        strat("horde-assoiffee-de-sang", "Horde Assoiffée de Sang", 1, TDB, [M.combat],
          "Phase de Combat.",
          `1 unité ${JG} de votre armée engagée et pas encore choisie pour combattre à cette phase.`,
          "Jusqu'à la fin de la phase, les figurines de votre unité à 3\" ou moins d'une figurine ennemie sont éligibles pour combattre, et peuvent attaquer les unités ennemies à 3\" ou moins d'elles."),
        strat("idole-d-airain", "Idole d'Airain", 2, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité WORLD EATERS MONSTER ou TITANIC de votre armée.",
          "Pour ce round de bataille, elle a l'aura d'Idole de Khorne de votre choix, au lieu de celle choisie pour les autres unités de votre armée.",
          { limite: "une-fois-par-bataille" }),
        strat("ne-decevez-pas-le-dieu-du-sang", "Ne Décevez pas le Dieu du Sang", 1, null, [M.combat],
          "Phase de Combat.",
          `1 unité ${JG} de votre armée.`,
          `Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, relancez un jet de touche de 1. Si votre unité est ${PRES_IDOLE}, vous pouvez relancer le jet de touche à la place.`),
        strat("vengeance-sanglante", "Vengeance Sanglante", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité WORLD EATERS MONSTER ou TITANIC de votre armée a été détruite.",
          "Les unités JAKHALS et GOREMONGERS de votre armée.",
          "Jusqu'à la fin de la bataille, chaque fois qu'une de leurs figurines attaque l'unité ennemie qui a détruit votre unité, vous pouvez relancer le jet de touche.")
      ]
    },

    /* -------------------------------------------------------
       BOURREAUX MÉCANISÉS (Goretrack Onslaught)
       ------------------------------------------------------- */
    {
      id: "bourreaux-mecanises", name: "Bourreaux Mécanisés", nameEn: "Goretrack Onslaught",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Les unités WORLD EATERS de votre armée qui ont débarqué d'un TRANSPORT à ce tour ont +1 à leurs jets de Charge, et leurs armes de mêlée ont [LANCE]."
      ] },
      enhancements: [
        opt("deploiement-agressif", "Déploiement Agressif", 20,
          "Le TRANSPORT ASSIGNÉ dans lequel le porteur est embarqué a l'aptitude Éclaireurs 9\"."),
        opt("maceration-des-enfers", "Macération des Enfers", 25,
          "Une fois par bataille, au début de la phase de Combat, l'unité du porteur peut avoir l'aptitude Combat en Premier jusqu'à la fin de la phase.",
          [[WE]], { usage: "une-fois-par-bataille" }),
        opt("offensive-meurtriere", "Offensive Meurtrière", 5,
          "Quand l'unité du porteur débarque d'un TRANSPORT, les unités ennemies ne peuvent pas faire de Tir en État d'Alerte contre elle jusqu'à la fin du tour."),
        opt("dechainement-infernal", "Déchaînement Infernal", 10,
          "Au début de votre phase de Tir, choisissez 1 unité VEHICLE de votre armée à 6\" ou moins du porteur, ou le TRANSPORT dans lequel il est embarqué. Après qu'elle a tiré, choisissez 1 unité ennemie touchée par ses attaques : jusqu'au début de votre prochain tour, soustrayez 1 aux jets de touche de cette unité ennemie.")
      ],
      stratagems: [
        strat("assaut-a-plein-gaz", "Assaut à Plein Gaz", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 RHINO WORLD EATERS de votre armée.",
          "Il peut faire un Mouvement Normal, puis ses passagers WORLD EATERS peuvent débarquer (débarquement d'assaut) : ils restent éligibles pour déclarer une charge à ce tour."),
        strat("avance-incessante", "Avance Incessante", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a touché une unité WORLD EATERS VEHICLE de votre armée avec des attaques de tir.",
          "Cette unité VEHICLE.",
          "Elle peut faire un Mouvement Normal de 6\" maximum. Ne peut pas être utilisé avec Fureur Débridée sur la même attaque."),
        strat("debarquement-agressif", "Débarquement Agressif", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité WORLD EATERS de votre armée embarquée dans un RHINO WORLD EATERS pas encore choisi pour se déplacer à cette phase.",
          "Elle peut débarquer : ses figurines sont placées entièrement à 6\" ou moins du RHINO, et peuvent être placées à portée d'engagement d'unités ennemies."),
        strat("fureur-debridee", "Fureur Débridée", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a touché une unité WORLD EATERS VEHICLE de votre armée avec des attaques de tir.",
          "1 unité KHORNE BERZERKERS embarquée dans ce VEHICLE.",
          "Elle peut débarquer, puis faire un mouvement d'élan de D6+2\" maximum."),
        strat("passage-au-travers", "Passage au Travers", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité WORLD EATERS VEHICLE de votre armée pas encore choisie pour se déplacer à cette phase.",
          "Jusqu'à la fin de la phase, quand elle fait un Mouvement Normal ou une Avance, elle peut traverser horizontalement les éléments de terrain."),
        strat("poursuite-sans-fin-de-la-violence", "Poursuite sans Fin de la Violence", 1, null, [M.combat],
          "Fin de la phase de Combat.",
          "1 unité WORLD EATERS INFANTRY de votre armée entièrement à 6\" ou moins d'un TRANSPORT ami dans lequel elle peut embarquer.",
          "Elle peut embarquer dans ce TRANSPORT.")
      ]
    },

    /* -------------------------------------------------------
       DÉMONIAUX DE KHORNE (Khorne Daemonkin)
       Règle partiellement masquée sur la fiche : à vérifier
       ------------------------------------------------------- */
    {
      id: "demoniaux-de-khorne", name: "Démoniaux de Khorne", nameEn: "Khorne Daemonkin",
      cost: 2, dispositions: ["reconnaissance"],

      // Débloque les démons de Khorne (fichier blood-legions.js chargé à la demande)
      unlocks: ["Blood Legions"],
      extraFiles: ["blood-legions"],

      constraints: [
        { type: "maxPointsPercent", keyword: "Blood Legions", percent: 50 },
        { type: "noWarlord", keyword: "Blood Legions" }
      ],
      rule: { name: "Dîmes de Sang", text: [
        "Jusqu'à la moitié des points de votre armée peut être consacrée à des unités BLOOD LEGIONS, mais aucune d'elles ne peut être votre Seigneur de Guerre.",
        "Chaque fois qu'une unité WORLD EATERS ou BLOOD LEGIONS de votre armée détruit une unité ennemie, lancez 1D6 : sur 3+, vous gagnez 1 Dîme de Sang.",
        "Au début de votre phase de Commandement, vous pouvez dépenser des Dîmes de Sang pour donner les bonus suivants aux unités BLOOD LEGIONS de votre armée, jusqu'à la fin de la bataille :",
        "• 2 Dîmes : Insensible à la Douleur 5+ contre les blessures mortelles et les attaques psychiques (s'applique aussi aux unités WORLD EATERS) ;",
        "• 3 Dîmes : [LANCE] en mêlée ;",
        "• 4 Dîmes : sauvegarde invulnérable de 4+ ;",
        "• 5 Dîmes : les unités BLOOD LEGIONS bénéficient aussi des Bénédictions de Khorne."
      ] },
      tracker: {
        type: "choix", label: "Dîmes de Sang",
        moment: "Une unité détruite par une unité WORLD EATERS ou BLOOD LEGIONS : 1 Dîme sur 3+. Début de votre phase de Commandement : dépenser des Dîmes pour un bonus définitif.",
        options: [
          { n: 2, short: "Insensible à la Douleur 5+ contre blessures mortelles et attaques psychiques" },
          { n: 3, short: "[LANCE] en mêlée" },
          { n: 4, short: "Sauvegarde invulnérable 4+" },
          { n: 5, short: "Bénédictions de Khorne pour les BLOOD LEGIONS" }
        ],
        concerne: "Unités BLOOD LEGIONS de votre armée (le bonus à 2 Dîmes s'applique aussi aux WORLD EATERS)."
      },
      enhancements: [
        opt("lames-du-bain-de-sang-incessant", "Lames du Bain de Sang Incessant", 30,
          "Ajoutez 1 aux caractéristiques d'Attaques, de Force et de Dégâts des armes de mêlée du porteur. Chaque fois que l'unité du porteur détruit une unité ennemie, vous gagnez automatiquement 1 Dîme de Sang (au lieu de sur 3+)."),
        opt("armure-hemoforgee", "Armure Hémoforgée", 20,
          "Le porteur a une caractéristique de Sauvegarde de 2+. S'il est détruit, vous gagnez 1 Dîme de Sang.",
          [["Blood Legions"], [WE]]),
        opt("disciple-de-khorne", "Disciple de Khorne", 15,
          "Le porteur a l'aptitude Frappe en Profondeur, et le mot-clé de Faction BLOOD LEGIONS au lieu de WORLD EATERS. Il a l'aptitude Meneur et peut être rattaché à une unité BLOODCRUSHERS (Équarrisseurs) ou FLESH HOUNDS (Molosses de Khorne).",
          [["Lord on Juggernaut"]],
          // Compte alors dans les 50 % BLOOD LEGIONS et ne peut pas être Seigneur de Guerre
          { grantsKeywords: ["Blood Legions"], grantsLeaderOf: ["Bloodcrushers", "Flesh Hounds"] }),
        opt("icone-guerriere", "Icône Guerrière", 25,
          "Tant qu'une unité BLOOD LEGIONS amie est à 6\" ou moins du porteur, elle bénéficie des Bénédictions de Khorne actives ; si elle en bénéficiait déjà, elle peut relancer ses tests d'Ébranlement.")
      ],
      stratagems: [
        strat("appel-au-meurtre", "Appel au Meurtre", 1, null, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "1 unité BLOOD LEGIONS de votre armée sur le champ de bataille et non engagée.",
          "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."),
        strat("benediction-de-sang-brulant", "Bénédiction de Sang Brûlant", 1, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité WORLD EATERS de votre armée à 6\" ou moins d'une unité BLOOD LEGIONS de votre armée.",
          "Cette unité WORLD EATERS.",
          "Jusqu'à la fin de la phase, ses figurines ont une sauvegarde invulnérable de 5+ (4+ si les Dîmes de Sang donnent déjà ce bonus aux BLOOD LEGIONS)."),
        strat("fureur-demoniaque", "Fureur Démoniaque", 1, TDB, [M.vousCombat],
          "Début de votre phase de Combat.",
          "1 unité WORLD EATERS de votre armée à 6\" ou moins d'une unité BLOOD LEGIONS de votre armée.",
          "Jusqu'à la fin de la phase, ses armes de mêlée ont [LANCE]. Si les Dîmes de Sang donnent déjà ce bonus aux BLOOD LEGIONS, elles ont aussi [JUMELÉE]."),
        strat("invoque-par-le-massacre", "Invoqué par le Massacre", 1, null, [M.tout],
          "N'importe quelle phase, quand la dernière figurine d'une unité est détruite, avant de la retirer du jeu (si c'est un TRANSPORT, les unités embarquées débarquent d'abord).",
          "1 unité BLOODLETTERS de votre armée en Réserves.",
          "Placez votre unité n'importe où sur le champ de bataille, entièrement à 9\" ou moins de cette figurine détruite et à plus de 6\" horizontalement de toute unité ennemie, puis retirez la figurine détruite du jeu.",
          { restrictions: "Une seule fois par round de bataille." }),
        strat("raz-de-demons", "Raz-de-Démons", 1, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité BLOOD LEGIONS de votre armée à 6\" ou moins d'une unité WORLD EATERS de votre armée.",
          "Remettez dans votre unité 1 figurine MOUNTED, ou jusqu'à D3 figurines BEAST, ou jusqu'à D6 figurines INFANTRY détruites (sauf CHARACTER), avec tous leurs PV."),
        strat("un-crane-de-valeur", "Un Crâne de Valeur", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité WORLD EATERS ou BLOOD LEGIONS de votre armée a détruit une figurine ennemie CHARACTER ou MONSTER.",
          "Votre armée.",
          "Vous gagnez D3 Dîmes de Sang, et devez tout de suite en dépenser au moins 1 pour obtenir un bonus de Dîmes.")
      ]
    },

    /* -------------------------------------------------------
       ÉCORCHERIE DE POSSÉDÉS (Possessed Slaughterband)
       Possédés = POSSESSED (confirmé)
       ------------------------------------------------------- */
    {
      id: "ecorcherie-de-possedes", name: "Écorcherie de Possédés", nameEn: "Possessed Slaughterband",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Les unités POSSESSED de votre armée ont l'aptitude suivante :",
        "À la phase de Tir adverse, juste après qu'une unité ennemie a tiré, si une ou plusieurs figurines de cette unité ont été détruites par ces attaques, cette unité peut faire un mouvement d'élan de D6\" maximum. Ce mouvement d'élan est un mouvement de Fureur d'Airain."
      ] },
      enhancements: [
        opt("transe-frenetique", "Transe Frénétique", 20,
          "Chaque fois qu'une figurine de l'unité du porteur attaque, un jet de touche non modifié de 5+ est une Touche Critique.", [[WE, "Daemon"]]),
        opt("discernement-meurtrier", "Discernement Meurtrier", 15,
          "Chaque fois que l'unité du porteur détruit une unité ennemie, lancez 1D6 : sur 4+, vous gagnez 1 PC.", [[WE, "Daemon"]]),
        opt("vigueur-malveillante", "Vigueur Malveillante", 30,
          "Quand l'unité du porteur fait un mouvement d'élan grâce à la règle de ce détachement, elle se déplace de 6\" au lieu de D6\".", [["Slaughterbound"]]),
        opt("trepas-violent", "Trépas Violent", 10,
          "Le porteur a l'aptitude Destruction Néfaste D3+1, qui se déclenche sur 2+ au lieu de 6.", [[WE, "Daemon"]])
      ],
      stratagems: [
        strat("force-demoniaque", "Force Démoniaque", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité EIGHTBOUND ou EXALTED EIGHTBOUND de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, ajoutez 1 aux Dégâts des armes de mêlée de ses figurines quand elles attaquent : une unité qui n'est ni MONSTER ni VEHICLE (EIGHTBOUND) ; une unité MONSTER ou VEHICLE (EXALTED EIGHTBOUND)."),
        strat("fureur-immortelle", "Fureur Immortelle", 2, TDB, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité POSSESSED de votre armée.",
          "Cette unité POSSESSED.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines est détruite avant d'avoir combattu, elle peut combattre après que l'unité attaquante a fini ses attaques, puis elle est retirée du jeu."),
        strat("manifestation-rapide", "Manifestation Rapide", 1, null, [M.vousMvt],
          "Étape des Renforts de votre phase de Mouvement.",
          "1 unité EXALTED EIGHTBOUND de votre armée qui arrive en Frappe en Profondeur.",
          "Elle peut être placée à plus de 6\" horizontalement de toute unité ennemie, mais n'est pas éligible pour déclarer une charge à ce tour."),
        strat("resistance-demoniaque", "Résistance Démoniaque", 1, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité POSSESSED de votre armée.",
          "Cette unité POSSESSED.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de blessure."),
        strat("rodeurs-du-warp", "Rôdeurs du Warp", 1, null, [M.vousMvt, M.vousCharge],
          "Votre phase de Mouvement ou votre phase de Charge.",
          "1 unité POSSESSED de votre armée pas encore choisie pour se déplacer ou charger à cette phase.",
          "Jusqu'à la fin de la phase, quand elle fait un Mouvement Normal, une Avance ou un mouvement de Charge, elle peut traverser les figurines ennemies (sauf MONSTER et VEHICLE) et passer à portée d'engagement d'elles ; ses tests de Fuite Désespérée sont réussis automatiquement."),
        strat("violence-horrifiante", "Violence Horrifiante", 1, null, [M.advCmd],
          "Phase de Commandement adverse.",
          "1 unité POSSESSED de votre armée.",
          "Chaque unité ennemie à portée d'engagement d'elle doit faire un test d'Ébranlement, en soustrayant 1 au test.")
      ]
    },

    /* -------------------------------------------------------
       VAISSEAUX DE LA COLÈRE (Vessels of Wrath)
       ------------------------------------------------------- */
    {
      id: "vaisseaux-de-la-colere", name: "Vaisseaux de la Colère", nameEn: "Vessels of Wrath",
      cost: 1, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "Quand une unité WORLD EATERS CHARACTER de votre armée (sauf EPIC HERO) est choisie pour combattre, les armes de mêlée de ses figurines CHARACTER peuvent avoir, au choix :",
        "• [ABATTAGE 1] ;",
        "• ou une Pénétration d'Armure améliorée de 1."
      ] },
      enhancements: [
        opt("archi-massacreur", "Archi-massacreur", 30,
          "Une fois par bataille et par armée, à votre phase de Commandement, vous pouvez utiliser cette aptitude : jusqu'au début de votre prochain tour, toutes les Bénédictions de Khorne sont actives pour l'unité du porteur.",
          [[WE]], { usage: "une-fois-par-bataille" }),
        opt("portails-vers-la-gloire", "Portails vers la Gloire", 10,
          "Le porteur a le mot-clé MOBILE et +1 à ses jets de Charge.", [["Daemon Prince"]])
      ],
      stratagems: [
        strat("aspirer-a-l-infamie", "Aspirer à l'Infamie", 1, null, [M.combat],
          "Phase de Combat, quand une unité WORLD EATERS CHARACTER de votre armée (sauf EPIC HERO) est choisie pour combattre.",
          "Cette unité WORLD EATERS CHARACTER.",
          "Jusqu'à la fin de la phase, ajoutez 1 à la caractéristique d'Attaques et 2 à la Force des armes de mêlée de ses figurines CHARACTER."),
        strat("meprisez-le-sorcier", "Méprisez le Sorcier", 1, null, [M.tout],
          "N'importe quelle phase, quand une unité WORLD EATERS CHARACTER de votre armée (sauf EPIC HERO) subit une ou plusieurs blessures mortelles.",
          "Cette unité WORLD EATERS CHARACTER.",
          "Jusqu'à la fin de la phase, ses figurines ont l'aptitude Insensible à la Douleur 4+ contre les blessures mortelles."),
        strat("punir-les-laches", "Punir les Lâches", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie à portée d'engagement d'une unité WORLD EATERS CHARACTER de votre armée est choisie pour Battre en Retraite.",
          "Cette unité WORLD EATERS CHARACTER.",
          "L'unité ennemie doit faire des tests de Fuite Désespérée. Si elle est Ébranlée, soustrayez 1 à ces tests.")
      ]
    }
  ],

  /* =========================================================
     UNITÉS (même format que les autres factions)
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ---------- */

    {
      id: "kharn-the-betrayer",
      name: "Khârn the Betrayer",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Chaos", "Khorne", "Khârn the Betrayer", WE],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 115 }] }],
      leader: { canLead: ["Khorne Berzerkers"] },
      coreAbilities: ["leader"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "gorechild", name: "Gorechild", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "7", AP: "-2", D: "3", abilities: [] }] }
      ],
      loadout: ["plasma-pistol", "gorechild"],
      abilities: [
        { name: "Legendary Killer", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque de mêlée, relancez un jet de touche de 1 et un jet de blessure de 1." },
        { name: "The Betrayer",
          text: "À la fin de votre phase de Charge, si cette unité est sur le champ de bataille, n'est pas engagée et contient une figurine de gardes du corps, elle fait un test de Commandement. S'il est raté, une figurine de gardes du corps de cette unité est détruite." },
        { name: "Berzerker Frenzy",
          text: "La première fois que cette figurine est détruite, à la fin de la phase, lancez 1D6 : sur 2+, replacez-la sur le champ de bataille aussi près que possible de l'endroit où elle a été détruite et hors de portée d'engagement de toute unité ennemie, avec 3 PV restants." }
      ],
      composition: "1 Khârn the Betrayer"
    },

    /* ---------- Héros monstres épiques ----------
       Supreme Commander : mustBeWarlord. Wrathful Presence : choix en partie. */

    {
      id: "angron",
      name: "Angron",
      category: "epic-monster",
      base: "100mm",
      keywords: ["Monster", "Character", "Fly", "Epic Hero", "Chaos", "Khorne", "Daemon", "Primarch", "Angron", WE],
      stats: { M: "14\"", T: 11, Sv: "2+", W: 16, Ld: "5+", OC: 6, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 330 }] }],
      mustBeWarlord: true,
      coreAbilities: ["deadly-demise:D6", "deep-strike"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "samnarius-and-spinegrinder", name: "Samni'arius and Spinegrinder", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "8",  skill: "2+", S: "14", AP: "-3", D: "D6+2", abilities: ["devastating-wounds"] },
            { name: "sweep",  range: "Mêlée", A: "16", skill: "2+", S: "7",  AP: "-2", D: "2",    abilities: ["devastating-wounds"] }
          ] }
      ],
      loadout: ["samnarius-and-spinegrinder"],
      abilities: [
        { name: "Supreme Commander",
          text: "Si cette figurine fait partie de votre armée, elle doit être votre Seigneur de Guerre." },
        { name: "Reborn in Blood",
          text: "Au début du round de bataille, quand vous faites un jet de Bénédictions de Khorne, si cette figurine est détruite, vous pouvez utiliser un triple 6 de ce jet pour utiliser cette aptitude au lieu d'activer des Bénédictions de Khorne au début de ce round. Dans ce cas, cette figurine n'est plus détruite : à l'étape des Renforts de votre prochaine phase de Mouvement, placez-la n'importe où sur le champ de bataille grâce à son aptitude Frappe en Profondeur, avec 8 PV restants." },
        { name: "Wrathful Presence",
          gameChoice: "Au début de chaque round, choisir l'aptitude de Présence Courroucée d'Angron.",
          text: "Au début du round de bataille, choisissez une des aptitudes suivantes. Jusqu'au début du round suivant, cette figurine a cette aptitude.\n• __The Blood God's Favour__ : chaque fois que vous faites un jet de Bénédictions de Khorne, si cette figurine est sur le champ de bataille, vous pouvez relancer jusqu'à six des D6 lancés.\n• __Overwhelming Wrath (Aura)__ : chaque fois qu'une unité ennemie à 6\" ou moins de cette figurine est choisie pour Battre en Retraite, elle doit faire un test de Commandement. S'il est raté, elle doit Rester Immobile à cette phase à la place.\n• __Driven by Ultimate Rage (Aura)__ : tant qu'une unité WORLD EATERS amie est à 6\" ou moins de cette figurine, chaque fois qu'une de ses figurines fait une attaque de mêlée, vous pouvez relancer un jet de touche de 1 et un jet de blessure de 1." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Angron"
    },

    /* ---------- Héros montés épiques ---------- */

    {
      id: "lord-invocatus",
      name: "Lord Invocatus",
      category: "epic-mounted",
      base: "90 x 52mm",
      keywords: ["Mounted", "Character", "Epic Hero", "Chaos", "Khorne", "Lord Invocatus", WE],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 8, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }] }],
      leader: { canLead: ["Eightbound", "Exalted Eightbound", "Khorne Berzerkers"] },
      coreAbilities: ["leader", "deep-strike", "scouts:6\""],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "cowards-bane", name: "Coward's Bane", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "bladed-horn", name: "Bladed horn", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["extra-attacks", "lance"] }] }
      ],
      loadout: ["bolt-pistol", "cowards-bane", "bladed-horn"],
      abilities: [
        { name: "Fire Riders", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les figurines de cette unité ont l'aptitude Frappe en Profondeur. De plus, chaque fois qu'une figurine de cette unité fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, elle peut traverser horizontalement les figurines et les éléments de terrain. Pendant un Mouvement Normal, une Avance ou une Retraite, les figurines de cette unité peuvent passer à portée d'engagement des figurines ennemies, mais ne peuvent pas y finir leur mouvement, et tout test de Fuite Désespérée est automatiquement réussi." },
        { name: "Bloody Stampede",
          text: "Chaque fois que l'unité de cette figurine finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement de cette figurine et lancez 1D6 : sur 2-3, cette unité subit 1 blessure mortelle ; sur 4-5, elle subit D3 blessures mortelles ; sur 6, elle subit D3+3 blessures mortelles." }
      ],
      composition: "1 Lord Invocatus"
    },

    /* ---------- Personnages d'infanterie ---------- */

    {
      id: "master-of-executions",
      name: "Master of Executions",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Khorne", "Master of Executions", WE],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { canLead: ["Khorne Berzerkers"] },
      coreAbilities: ["leader"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["pistol"] }] },
        { id: "axe-of-dismemberment", name: "Axe of dismemberment", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "7", AP: "-2", D: "2", abilities: ["devastating-wounds", "precision"] }] }
      ],
      loadout: ["bolt-pistol", "axe-of-dismemberment"],
      abilities: [
        { name: "Forwards, for Blood!", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, vous pouvez relancer les jets d'Avance de cette unité, et chaque fois que cette unité fait un mouvement de Blood Surge, vous pouvez relancer le D6 qui détermine la distance de déplacement de ses figurines." },
        { name: "A Worthy Skull",
          text: "Chaque fois que cette figurine fait une attaque de mêlée qui cible une unité CHARACTER, vous pouvez relancer le jet de touche et le jet de blessure. Chaque fois que l'unité de cette figurine détruit une figurine CHARACTER, vous gagnez 1 PC." }
      ],
      composition: "1 Master of Executions"
    },

    {
      id: "slaughterbound",
      name: "Slaughterbound",
      category: "char-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Chaos", "Khorne", "Daemon", "Possessed", "Slaughterbound", WE],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 6, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Eightbound", "Exalted Eightbound"] },
      coreAbilities: ["deadly-demise:D3", "leader"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "lacerator-and-daemonic-claw", name: "Lacerator and daemonic claw", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "10", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["lacerator-and-daemonic-claw"],
      abilities: [
        { name: "Lord of the Eightbound",
          text: "Si cette figurine est rattachée à une unité WORLD EATERS POSSESSED à l'étape de Déclaration des Formations de Bataille, jusqu'à la fin de la bataille, elle a les aptitudes Frappe en Profondeur et Éclaireurs 6\"." },
        { name: "Rage Eternal", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à votre phase de Commandement, vous pouvez remettre dans cette unité une figurine de gardes du corps détruite." },
        { name: "Possessed Lord", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de la phase de Combat, cette figurine peut utiliser cette aptitude. Dans ce cas, jusqu'à la fin de la phase, ajoutez 3 à la caractéristique d'Attaques de ses armes de mêlée, et ces armes ont [BLESSURES DÉVASTATRICES]." }
      ],
      composition: "1 Slaughterbound"
    },

    /* ---------- Personnages montés ---------- */

    {
      id: "lord-on-juggernaut",
      name: "Lord on Juggernaut",
      category: "char-mounted",
      base: "90 x 52mm",
      keywords: ["Mounted", "Character", "Chaos", "Khorne", "Lord on Juggernaut", WE],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 7, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }] }],
      leader: { canLead: ["Eightbound", "Exalted Eightbound", "Khorne Berzerkers"] },
      coreAbilities: ["leader"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "exalted-chainblade", name: "Exalted chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "2+", S: "6", AP: "-1", D: "2", abilities: [] }] },
        { id: "bladed-horn", name: "Bladed horn", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["extra-attacks", "lance"] }] }
      ],
      loadout: ["plasma-pistol", "exalted-chainblade", "bladed-horn"],
      abilities: [
        { name: "Aggressive Advance", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les figurines de cette unité ont une caractéristique de Mouvement de 10\", et chaque fois qu'une figurine de cette unité fait un Mouvement Normal, une Avance, une Retraite ou un mouvement de Charge, elle peut traverser horizontalement les éléments de terrain." },
        { name: "Crush All Who Stand Before Us",
          text: "Chaque fois que l'unité de cette figurine est choisie pour combattre, vous pouvez utiliser cette aptitude. Pour déterminer quelles figurines de cette unité sont éligibles pour combattre, toute figurine à 3\" ou moins d'une ou plusieurs figurines ennemies est éligible. En résolvant ces attaques, ces figurines peuvent cibler l'une de ces unités ennemies qui est à 3\" ou moins d'elles et à portée d'engagement de leur unité." }
      ],
      composition: "1 World Eaters Lord on Juggernaut"
    },

    /* ---------- Personnages monstres ---------- */

    {
      id: "daemon-prince-of-khorne",
      name: "Daemon Prince of Khorne",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Chaos", "Khorne", "Daemon", "Daemon Prince", "Daemon Prince of Khorne", WE],
      stats: { M: "10\"", T: 10, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 200 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:1"] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "8",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "16", skill: "2+", S: "6", AP: "-1", D: "1", abilities: [] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Lord of Murder",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités WORLD EATERS INFANTRY amies, elle a l'aptitude Agent Solitaire." },
        { name: "Devastating Assault",
          text: "Chaque fois que cette figurine fait un mouvement de Charge, jusqu'à la fin du tour, ses armes de mêlée ont [BLESSURES DÉVASTATRICES]." },
        { name: "Direct the Slaughter", usage: "une-fois-par-round",
          text: "Une fois par round de bataille, une figurine de votre armée qui a cette aptitude peut l'utiliser quand une unité WORLD EATERS amie à 12\" ou moins d'elle est ciblée par un stratagème : réduisez de 1 PC le coût de cette utilisation du stratagème." }
      ],
      composition: "1 Daemon Prince of Khorne"
    },

    {
      id: "daemon-prince-of-khorne-with-wings",
      name: "Daemon Prince of Khorne with Wings",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Fly", "Chaos", "Khorne", "Daemon", "Daemon Prince", "Daemon Prince of Khorne with Wings", WE],
      stats: { M: "14\"", T: 9, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 170 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:1"] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "8",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "16", skill: "2+", S: "6", AP: "-1", D: "1", abilities: [] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Bloodied Terror",
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement de cette figurine doit faire un test d'Ébranlement, en soustrayant 1 au test si elle est en dessous de la moitié de son effectif." },
        { name: "Swooping Predator",
          text: "Chaque fois que cette figurine finit un Mouvement Normal, vous pouvez choisir 1 unité ennemie qu'elle a survolée pendant ce mouvement et lancer six D6 : pour chaque 4+, cette unité subit 1 blessure mortelle." }
      ],
      composition: "1 Daemon Prince of Khorne with Wings"
    },

    /* ---------- Ligne ---------- */

    {
      id: "khorne-berzerkers",
      name: "Khorne Berzerkers",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Khorne", "Berzerkers", WE],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 170 }] },
        { models: 20, costs: [{ from: 1, pts: 330 }] }
      ],
      coreAbilities: [],
      armyRules: ["benedictions-de-khorne"],
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
        { id: "champion",  name: "Khorne Berzerker Champion", count: 1,       loadout: ["bolt-pistol", "chainblade"] },
        { id: "berzerker", name: "Khorne Berzerker",          count: "reste", loadout: ["bolt-pistol", "chainblade"] }
      ],
      options: [
        { id: "plasma-champion", model: "champion", text: "Le bolt pistol du Khorne Berzerker Champion peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]], max: { count: 1 } },
        { id: "plasma", model: "berzerker", text: "Pour chaque tranche de 5 figurines de l'unité, le bolt pistol d'1 Khorne Berzerker peut être remplacé par 1 plasma pistol.",
          replaces: ["bolt-pistol"], choices: [["plasma-pistol"]], max: { per: 5, count: 1 } },
        { id: "eviscerator", model: "berzerker", text: "Pour chaque tranche de 5 figurines de l'unité, la chainblade d'1 Khorne Berzerker peut être remplacée par 1 Khornate eviscerator.",
          replaces: ["chainblade"], choices: [["khornate-eviscerator"]], max: { per: 5, count: 1 } },
        { id: "icon", text: "1 figurine peut être équipée de 1 icon of Khorne.",
          choices: [["icon-of-khorne"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Blood Surge",
          text: "À la phase de Tir adverse, juste après qu'une unité ennemie a tiré, si une figurine de cette unité a été détruite par ces attaques, cette unité peut faire un mouvement d'élan de D6+2\" maximum." },
        { name: "Murderous Charge",
          text: "Si cette unité a fait un mouvement de Charge à ce tour, ajoutez 1 à la Force de ses attaques de mêlée." },
        { name: "Icon of Khorne", requiresWargear: "icon-of-khorne",
          text: "Si l'unité du porteur contient une ou plusieurs Icons of Khorne, chaque fois qu'elle détruit une unité ennemie, vous gagnez 1 point de Bloodshed. Chaque fois que vous faites un jet de Bénédictions de Khorne, lancez 1 D6 supplémentaire par point de Bloodshed que vous avez, puis vous perdez tous vos points de Bloodshed." }
      ],
      composition: "1 Khorne Berzerker Champion et 9 à 19 Khorne Berzerkers"
    },

    /* ---------- Infanterie ---------- */

    {
      id: "chaos-terminators",
      name: "Chaos Terminators",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Khorne", "Terminator", "Terminator Squad", "Chaos Terminators", WE],
      stats: { M: "7\"", T: 6, Sv: "2+", W: 3, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 175 }, { from: 3, pts: 185 }] },
        { models: 10, costs: [{ from: 1, pts: 350 }, { from: 3, pts: 360 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "heavy-flamer", name: "Heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "reaper-autocannon", name: "Reaper autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "4", skill: "4+", S: "7", AP: "-1", D: "1", abilities: ["devastating-wounds", "rapid-fire:2", "sustained-hits:1"] }] },
        { id: "accursed-weapon", name: "Accursed weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "chainfist", name: "Chainfist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "8", AP: "-3", D: "2", abilities: ["anti:Véhicule 3+"] }] },
        { id: "paired-accursed-weapons", name: "Paired accursed weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      models: [
        { id: "champion",   name: "Terminator Champion", count: 1,       loadout: ["combi-bolter", "accursed-weapon"] },
        { id: "terminator", name: "Chaos Terminator",    count: "reste", loadout: ["combi-bolter", "accursed-weapon"] }
      ],
      options: [
        { id: "lourde", model: "terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter d'1 Chaos Terminator peut être remplacé par 1 heavy flamer ou 1 reaper autocannon.",
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
        { name: "Bloody Fury",
          text: "Les attaques de tir de cette unité qui ciblent la cible éligible la plus proche peuvent relancer le jet de touche.\nQuand cette unité déclare une charge, vous pouvez utiliser cette partie de l'aptitude. Dans ce cas :\n• cette unité peut relancer ce jet de Charge ;\n• cette unité doit finir ce mouvement de Charge engagée avec la cible de charge la plus proche." }
      ],
      composition: "1 Terminator Champion et 4 à 9 Chaos Terminators"
    },

    {
      id: "eightbound",
      name: "Eightbound",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Khorne", "Daemon", "Possessed", "Eightbound", WE],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 125 }, { from: 3, pts: 140 }] },
        { models: 6, costs: [{ from: 1, pts: 250 }, { from: 3, pts: 265 }] }
      ],
      coreAbilities: ["scouts:6\""],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "chainblades", name: "Chainblades", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["chainblades"],
      abilities: [
        { name: "Beacons of Rage (Aura)",
          text: "Tant qu'une unité WORLD EATERS amie est à 6\" ou moins de cette unité, chaque fois qu'une de ses figurines fait une attaque de mêlée qui cible une unité (sauf MONSTER et VEHICLE), ajoutez 1 au jet de touche. Si la cible (sauf MONSTER et VEHICLE) est en dessous de la moitié de son effectif, ajoutez aussi 1 au jet de blessure." }
      ],
      composition: "1 Eightbound Champion et 2 à 5 Eightbound"
    },

    {
      id: "exalted-eightbound",
      name: "Exalted Eightbound",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Khorne", "Daemon", "Possessed", "Exalted Eightbound", WE],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 1, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 130 }, { from: 3, pts: 145 }] },
        { models: 6, costs: [{ from: 1, pts: 260 }, { from: 3, pts: 275 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "chainblades", name: "Chainblades", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["anti:Monstre 3+", "anti:Véhicule 3+"] }] }
      ],
      loadout: ["chainblades"],
      abilities: [
        { name: "Rend and Tear",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée qui cible une unité MONSTER ou VEHICLE, jusqu'à la fin de la phase, améliorez de 1 la caractéristique de Dégâts de cette attaque." }
      ],
      composition: "1 Exalted Eightbound Champion et 2 à 5 Exalted Eightbound"
    },

    {
      id: "goremongers",
      name: "Goremongers",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Grenades", "Chaos", "Khorne", "Goremongers", WE],
      stats: { M: "9\"", T: 4, Sv: "6+", W: 1, Ld: "7+", OC: 1 },
      sizes: [{ models: 8, costs: [{ from: 1, pts: 70 }] }],
      coreAbilities: ["infiltrators"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "autopistol", name: "Autopistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "blood-harpoon", name: "Blood harpoon", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["assault", "sustained-hits:D3"] }] },
        { id: "chainblade", name: "Chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["lance"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] }
      ],
      models: [
        { id: "blood-herald", name: "Blood Herald", count: 1,       loadout: ["autopistol", "chainblade", "close-combat-weapon"] },
        { id: "goremonger",   name: "Goremonger",   count: "reste", loadout: ["autopistol", "chainblade", "close-combat-weapon"] }
      ],
      options: [
        { id: "autopistol", model: "goremonger", text: "La chainblade d'1 Goremonger peut être remplacée par 1 autopistol.",
          replaces: ["chainblade"], choices: [["autopistol"]], max: { count: 1 } },
        { id: "harpoon", model: "goremonger", text: "La chainblade d'1 Goremonger peut être remplacée par 1 blood harpoon.",
          replaces: ["chainblade"], choices: [["blood-harpoon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Loping Speed",
          text: "À la phase de Mouvement adverse, si une unité ennemie finit un mouvement à 8\" ou moins de cette unité, et si cette unité n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de D6\" maximum." }
      ],
      composition: "1 Blood Herald et 7 Goremongers"
    },

    {
      id: "jakhals",
      name: "Jakhals",
      category: "infantry",
      base: "28,5mm (Dishonoured : 40mm)",
      keywords: ["Infantry", "Grenades", "Chaos", "Khorne", "Jakhals", WE],
      stats: { M: "7\"", T: 4, Sv: "6+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 65 }] },
        { models: 20, costs: [{ from: 1, pts: 120 }] }
      ],
      coreAbilities: [],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "autopistol", name: "Autopistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "3", AP: "0", D: "1", abilities: ["pistol"] }] },
        { id: "chainblades", name: "Chainblades", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "3", AP: "0", D: "1", abilities: [] }] },
        { id: "paired-manglers", name: "Paired manglers", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "mauler-chainblade", name: "Mauler chainblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "5+", S: "4", AP: "-1", D: "2", abilities: [] }] },
        { id: "skullsmasher-and-mangler", name: "Skullsmasher and mangler", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "-1", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "icon-of-khorne", name: "Icon of Khorne" }],
      models: [
        { id: "pack-leader", name: "Jakhal Pack Leader", count: 1,                            loadout: ["autopistol", "chainblades"] },
        { id: "dishonoured", name: "Dishonoured",        count: 1, countBySize: { 10: 1, 20: 2 }, loadout: ["paired-manglers"] },
        { id: "jakhal",      name: "Jakhal",             count: "reste",                      loadout: ["autopistol", "chainblades"] }
      ],
      options: [
        { id: "mauler", model: "jakhal", text: "Pour chaque tranche de 10 figurines, les chainblades d'1 Jakhal peuvent être remplacées par 1 mauler chainblade.",
          replaces: ["chainblades"], choices: [["mauler-chainblade"]], max: { per: 10, count: 1 } },
        { id: "skullsmasher", model: "dishonoured", text: "N'importe quel nombre de Dishonoured peuvent remplacer leurs paired manglers par 1 skullsmasher and mangler.",
          replaces: ["paired-manglers"], choices: [["skullsmasher-and-mangler"]] },
        { id: "icon", model: "jakhal", text: "Pour chaque tranche de 10 figurines, 1 Jakhal peut être équipé de 1 icon of Khorne.",
          choices: [["icon-of-khorne"]], max: { per: 10, count: 1 } }
      ],
      abilities: [
        { name: "Objective Ravaged",
          text: "À la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle de votre adversaire sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Icon of Khorne", requiresWargear: "icon-of-khorne",
          text: "Si l'unité du porteur contient une ou plusieurs Icons of Khorne, chaque fois qu'elle détruit une unité ennemie, vous gagnez 1 point de Bloodshed. Chaque fois que vous faites un jet de Bénédictions de Khorne, lancez 1 D6 supplémentaire par point de Bloodshed que vous avez, puis vous perdez tous vos points de Bloodshed." }
      ],
      composition: "1 Jakhal Pack Leader, 1 Dishonoured et 8 Jakhals, ou 1 Jakhal Pack Leader, 2 Dishonoured et 17 Jakhals"
    },

    /* ---------- Transports assignés ----------
       Combi-bolter : [TIR RAPIDE 4] tel qu'indiqué sur la fiche fournie
       (2 sur le Rhino des Emperor's Children) : à vérifier. */

    {
      id: "chaos-rhino",
      name: "Chaos Rhino",
      category: "dedicated-transport",
      base: null,                                   // socle : la figurine elle-même
      keywords: ["Vehicle", "Transport", "Frame", "Dedicated Transport", "Smoke", "Chaos", "Khorne", "Rhino", WE],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }, { from: 4, pts: 85 }] }],
      coreAbilities: ["deadly-demise:D3", "firing-deck:2"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["combi-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter supplémentaire ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } },
        { id: "havoc-ajout", group: "havoc", text: "Peut être équipé de 1 havoc launcher…",
          choices: [["havoc-launcher"]], max: { count: 1 } },
        { id: "havoc-remplace", group: "havoc", text: "…ou remplacer 1 combi-bolter par 1 havoc launcher.",
          replaces: ["combi-bolter"], choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      transport: {
        capacity: 12,
        allowed: [[WE, "Infantry"]],
        excluded: ["Possessed", "Terminator"],
        text: "Capacité de transport de 12 figurines WORLD EATERS INFANTRY (sauf les figurines POSSESSED et TERMINATOR)."
      },
      abilities: [
        { name: "Meet Any Challenge",
          text: "À la phase de Mouvement adverse, chaque fois qu'une unité ennemie est placée ou finit un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins de cette figurine, les unités embarquées dans ce TRANSPORT peuvent débarquer." }
      ],
      composition: "1 Chaos Rhino"
    },

    /* ---------- Transports ---------- */

    {
      id: "chaos-land-raider",
      name: "Chaos Land Raider",
      category: "transport",
      base: null,                                   // socle : la figurine elle-même
      keywords: ["Vehicle", "Transport", "Frame", "Smoke", "Chaos", "Khorne", "Land Raider", "Chaos Land Raider", WE],
      stats: { M: "10\"", T: 12, Sv: "2+", W: 16, Ld: "6+", OC: 5 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 200 }, { from: 3, pts: 220 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "soulshatter-lascannon", name: "Soulshatter lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: ["rapid-fire:2"] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:2", "sustained-hits:1", "twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "9", skill: "3+", S: "8", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["soulshatter-lascannon", "soulshatter-lascannon", "twin-heavy-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      transport: {
        capacity: 14,
        allowed: [[WE, "Infantry"]],
        double: ["Possessed", "Terminator"],       // comptent pour 2 places
        text: "Capacité de transport de 14 figurines WORLD EATERS INFANTRY. Chaque figurine POSSESSED ou TERMINATOR compte pour 2 places."
      },
      abilities: [
        { name: "Assault Ramp",
          text: "Chaque fois qu'une unité débarque de ce véhicule après qu'il a fait un Mouvement Normal, elle fait un mouvement de débarquement d'assaut (Règles de Base, 18.06) pour ce débarquement." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Land Raider"
    },

    /* ---------- Véhicules ----------
       Heldrake : pas de mot-clé AIRCRAFT (Stationnaire), rangé ici. */

    {
      id: "chaos-predator-annihilator",
      name: "Chaos Predator Annihilator",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Khorne", "Predator Annihilator", "Chaos Predator Annihilator", WE],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }, { from: 3, pts: 140 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:2", "sustained-hits:1"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-twin-lascannon", name: "Predator twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "4+", S: "14", AP: "-3", D: "D6+1", abilities: ["rapid-fire:2", "twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-twin-lascannon", "armoured-tracks"],
      options: [
        { id: "flancs", text: "Peut être équipé de 2 heavy bolters ou de 2 lascannons.",
          choices: [["heavy-bolter", "heavy-bolter"], ["lascannon", "lascannon"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } },
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Blood-hungry Annihilator",
          text: "Chaque fois que cette figurine fait une attaque de tir qui cible la cible éligible MONSTER ou VEHICLE la plus proche à 18\" ou moins, vous pouvez relancer le jet de blessure et relancer le jet de Dégâts." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Annihilator"
    },

    {
      id: "chaos-predator-destructor",
      name: "Chaos Predator Destructor",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Khorne", "Predator Destructor", "Chaos Predator Destructor", WE],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }, { from: 3, pts: 140 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:2", "sustained-hits:1"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-autocannon", name: "Predator autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "4", skill: "4+", S: "9", AP: "-1", D: "3", abilities: ["rapid-fire:6"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-autocannon", "armoured-tracks"],
      options: [
        { id: "flancs", text: "Peut être équipé de 2 heavy bolters ou de 2 lascannons.",
          choices: [["heavy-bolter", "heavy-bolter"], ["lascannon", "lascannon"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } },
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Punishing Suppression",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques (sauf MONSTER et VEHICLE). Jusqu'au début de votre prochain tour, cette unité ennemie est supprimée : chaque fois qu'une de ses figurines attaque, soustrayez 1 au jet de touche." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Destructor"
    },

    {
      id: "heldrake",
      name: "Heldrake",
      category: "vehicles",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Chaos", "Khorne", "Daemon", "Heldrake", WE],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 12, Ld: "6+", OC: 0, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 175 }] }],
      coreAbilities: ["deadly-demise:D3", "hover"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "baleflamer", name: "Baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-1", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "hades-autocannon", name: "Hades autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "4+", S: "8", AP: "-1", D: "2", abilities: ["rapid-fire:4"] }] },
        { id: "heldrake-claws", name: "Heldrake claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "7", AP: "-1", D: "2", abilities: ["anti:Vol 2+", "devastating-wounds"] }] }
      ],
      loadout: ["hades-autocannon", "heldrake-claws"],
      options: [
        { id: "baleflamer", text: "Le Hades autocannon peut être remplacé par 1 baleflamer.",
          replaces: ["hades-autocannon"], choices: [["baleflamer"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Airborne Predator",
          text: "Chaque fois que cette figurine fait une attaque qui cible une unité qui peut voler (FLY), ajoutez 1 au jet de touche." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Heldrake"
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
      keywords: ["Vehicle", "Walker", "Chaos", "Khorne", "Daemon", "Defiler", WE],
      stats: { M: "14\"", T: 11, Sv: "3+", W: 18, Ld: "6+", OC: 5, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 270 }, { from: 2, pts: 310 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "hades-battle-cannon", name: "Hades battle cannon", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+3", skill: "4+", S: "10", AP: "-1", D: "3", abilities: ["blast", "rapid-fire:3"] }] },
        { id: "ectoplasma-destructor", name: "Ectoplasma destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "D6", skill: "4+", S: "12", AP: "-3", D: "3", abilities: ["blast", "rapid-fire:2"] }] },
        { id: "excruciator-cannon", name: "Excruciator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "4+", S: "6", AP: "-1", D: "2", abilities: ["rapid-fire:3"] }] },
        { id: "magma-cutters", name: "Magma cutters", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "4+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2", "rapid-fire:1"] }] },
        { id: "heavy-baleflamer", name: "Heavy baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "7", AP: "-2", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "hades-lascannon", name: "Hades lascannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "2", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: ["rapid-fire:1"] }] },
        { id: "heavy-reaper-autocannon", name: "Heavy reaper autocannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "4", skill: "4+", S: "9", AP: "-1", D: "3", abilities: ["devastating-wounds", "rapid-fire:2", "sustained-hits:1"] }] },
        { id: "heavy-missile-launcher", name: "Heavy missile launcher", type: "ranged",
          profiles: [
            { name: "krak", range: "48\"", A: "2",   skill: "4+", S: "10", AP: "-2", D: "D6+1", abilities: ["rapid-fire:1"] },
            { name: "frag", range: "48\"", A: "2D6", skill: "4+", S: "5",  AP: "-1", D: "1",    abilities: ["blast", "rapid-fire:3"] }
          ] },
        { id: "electroscourge", name: "Electroscourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "7", skill: "3+", S: "12", AP: "-2", D: "2", abilities: ["extra-attacks", "sustained-hits:2"] }] },
        { id: "shearing-claws", name: "Shearing claws", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "3+", S: "16", AP: "-3", D: "D6+1", abilities: [] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "3+", S: "6",  AP: "-2", D: "1",    abilities: [] }
          ] }
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
        { name: "Unleash Wrath",
          text: "À la fin de la phase de Mouvement adverse, vous pouvez choisir 1 unité ennemie placée sur le champ de bataille à 12\" ou moins de cette figurine. Cette figurine peut alors, au choix :\n• tirer sur cette unité, seulement si c'est une cible éligible ;\n• déclarer une charge : elle doit finir ce mouvement de Charge engagée avec l'unité ennemie choisie (même si la charge réussit, elle ne reçoit aucun bonus de Charge à ce tour)." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Defiler"
    },

    {
      id: "forgefiend",
      name: "Forgefiend",
      category: "walkers",
      base: "120 x 92mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Khorne", "Daemon", "Forgefiend", WE],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 140 }, { from: 3, pts: 155 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "ectoplasma-cannon", name: "Ectoplasma cannon", type: "ranged", cost: 5,
          profiles: [{ range: "36\"", A: "D3", skill: "4+", S: "10", AP: "-3", D: "3", abilities: ["blast", "rapid-fire:1"] }] },
        { id: "hades-autocannon", name: "Hades autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "4+", S: "8", AP: "-1", D: "2", abilities: ["rapid-fire:4"] }] },
        { id: "forgefiend-claws", name: "Forgefiend claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] },
        { id: "forgefiend-jaws", name: "Forgefiend jaws", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "3+", S: "7", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["hades-autocannon", "hades-autocannon", "forgefiend-jaws"],
      options: [
        { id: "ecto", text: "Les 2 Hades autocannons peuvent être remplacés par 2 ectoplasma cannons (+5 pts chacun).",
          replaces: ["hades-autocannon", "hades-autocannon"], choices: [["ectoplasma-cannon", "ectoplasma-cannon"]] },
        { id: "jaws", text: "Les Forgefiend jaws peuvent être remplacées par 1 ectoplasma cannon (+5 pts) et 1 Forgefiend claws.",
          replaces: ["forgefiend-jaws"], choices: [["ectoplasma-cannon", "forgefiend-claws"]] }
      ],
      abilities: [
        { name: "Furious Onslaught",
          text: "Chaque fois que cette figurine fait une attaque de tir qui cible la cible éligible la plus proche à 18\" ou moins, vous pouvez relancer le jet de touche." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Forgefiend"
    },

    {
      id: "helbrute",
      name: "Helbrute",
      category: "walkers",
      base: "60mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Khorne", "Helbrute", WE],
      stats: { M: "9\"", T: 9, Sv: "2+", W: 8, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 120 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["rapid-fire:4"] }] },
        { id: "heavy-flamer", name: "Heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "plasma-cannon", name: "Plasma cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "D3", skill: "4+", S: "8", AP: "-3", D: "3", abilities: ["blast", "hazardous", "rapid-fire:D3"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "4+", S: "4", AP: "0",  D: "1",  abilities: ["blast", "rapid-fire:3"] },
            { name: "krak", range: "48\"", A: "1",  skill: "4+", S: "9", AP: "-2", D: "D6", abilities: ["rapid-fire:1"] }
          ] },
        { id: "multi-melta", name: "Multi-melta", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "4+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2", "rapid-fire:1"] }] },
        { id: "twin-autocannon", name: "Twin autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "4+", S: "9", AP: "-1", D: "3", abilities: ["rapid-fire:2", "twin-linked"] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["rapid-fire:2", "sustained-hits:1", "twin-linked"] }] },
        { id: "twin-lascannon", name: "Twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "4+", S: "12", AP: "-3", D: "D6+1", abilities: ["rapid-fire:1", "twin-linked"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] },
        { id: "helbrute-fist", name: "Helbrute fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "12", AP: "-2", D: "3", abilities: [] }] },
        { id: "helbrute-hammer", name: "Helbrute hammer", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "4+", S: "14", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "power-scourge", name: "Power scourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "10", skill: "3+", S: "7", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["missile-launcher", "multi-melta", "close-combat-weapon"],
      options: [
        { id: "remplace-melta", text: "Le multi-melta peut être remplacé par 1 plasma cannon, 1 twin autocannon, 1 twin heavy bolter, 1 twin lascannon ou 1 Helbrute fist.",
          replaces: ["multi-melta"], choices: [["plasma-cannon"], ["twin-autocannon"], ["twin-heavy-bolter"], ["twin-lascannon"], ["helbrute-fist"]] },
        { id: "remplace-missile", text: "Le missile launcher peut être remplacé par 1 Helbrute fist, 1 Helbrute hammer ou 1 power scourge.",
          replaces: ["missile-launcher"], choices: [["helbrute-fist"], ["helbrute-hammer"], ["power-scourge"]] },
        { id: "fist-gun", requiresWeapon: "helbrute-fist", text: "Pour chaque Helbrute fist, cette figurine peut être équipée de 1 combi-bolter ou de 1 heavy flamer.",
          choices: [["combi-bolter"], ["heavy-flamer"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Devoted to Destruction",
          text: "Si cette figurine est équipée de deux armes de mêlée en plus de sa close combat weapon, ajoutez 2 aux Attaques de ces deux armes." },
        { name: "Frenzy", usage: "une-fois-par-tour",
          text: "Une fois par tour et par unité, à la phase de Combat, quand une unité ennemie cible cette unité, après qu'elle a résolu ses attaques, vous pouvez utiliser cette aptitude : cette unité est éligible pour combattre (même si elle a déjà combattu à cette phase) et doit être la prochaine unité choisie pour combattre." }
      ],
      composition: "1 Helbrute"
    },

    {
      id: "maulerfiend",
      name: "Maulerfiend",
      category: "walkers",
      base: "120 x 92mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Khorne", "Daemon", "Maulerfiend", WE],
      stats: { M: "12\"", T: 10, Sv: "3+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 140 }, { from: 3, pts: 150 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "magma-cutter", name: "Magma cutter", type: "ranged",
          profiles: [{ range: "6\"", A: "2", skill: "4+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2", "rapid-fire:1"] }] },
        { id: "lasher-tendrils", name: "Lasher tendrils", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "7", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "maulerfiend-fists", name: "Maulerfiend fists", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "3+", S: "14", AP: "-2", D: "D6+1", abilities: [] }] }
      ],
      loadout: ["lasher-tendrils", "maulerfiend-fists"],
      options: [
        { id: "magma", text: "Les lasher tendrils peuvent être remplacés par 2 magma cutters.",
          replaces: ["lasher-tendrils"], choices: [["magma-cutter", "magma-cutter"]] }
      ],
      abilities: [
        { name: "The Scent of Blood",
          text: "À la phase de Charge, quand cette unité déclare une charge :\n• si une unité ennemie en dessous de son effectif initial est à 9\" ou moins de cette unité, elle a +1 à ses jets de Charge ;\n• ou, si une unité ennemie en dessous de la moitié de son effectif est à 9\" ou moins de cette unité, elle a +2 à ses jets de Charge." },
        { name: "Savage Exaltation",
          text: "Chaque fois que cette figurine fait une attaque de mêlée qui cible une unité ennemie en dessous de son effectif initial, ajoutez 1 au jet de touche. Si cette unité est en dessous de la moitié de son effectif, ajoutez aussi 1 au jet de blessure." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Maulerfiend"
    },

    /* ---------- Bêtes ---------- */

    {
      id: "chaos-spawn",
      name: "Chaos Spawn",
      category: "beasts",
      base: "50mm",
      keywords: ["Beast", "Chaos", "Khorne", "Spawn", "Chaos Spawn", WE],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 4, Ld: "7+", OC: 1 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 95 }] }],
      coreAbilities: ["feel-no-pain:5+", "scouts:8\""],
      armyRules: ["benedictions-de-khorne"],
      weapons: [
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "D6+4", skill: "4+", S: "5", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["hideous-mutations"],
      abilities: [
        { name: "To Slake its Rage",
          text: "Cette unité est éligible pour déclarer une charge à un tour où elle a Avancé." }
      ],
      composition: "2 Chaos Spawn"
    }
  ]
});

})();
