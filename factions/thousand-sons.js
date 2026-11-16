/* =========================================================
   THOUSAND SONS — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - Règle d'armée Cabale de Sorciers (Cabal of Sorcerers) : complète,
     traduite depuis l'anglais, avec ses 4 Rituels.
     « Psychic test » = test psychique ; « Warp Charge » = Charge Warp ;
     « Channel the Warp » = Canaliser le Warp.
     Noms des Rituels traduits, nom anglais entre parenthèses.
   - Pacte de Sorcellerie (Pact of Sorcery) : règle de constitution
     d'armée sur les SCINTILLATING LEGIONS, saisie comme 2e règle d'armée.
   - 9 détachements : nom, points, dispositions, étiquette Unique,
     noms anglais, règles et stratagèmes (48) saisis d'après les fiches
     françaises fournies (souvent résumées, remises en forme).
     Stratagèmes marqués [Tactique de bataille] : type renseigné.
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - « (Amélioration) » sur la fiche : kind "amelioration".
   - « MENEUR : TZAANGORS » : requiresAttachedTo (unité menée).
   - « UNIQUE : MUTANT » : exclusiveGroup "mutant" (Serviteurs du
     Changement, Pacte de Fusewarp).

   Mots-clés en anglais (comme les autres factions). Correspondances
   avec les noms français des fiches :
     Légions Scintillantes = SCINTILLATING LEGIONS ; Véhicule = VEHICLE
     Infanterie = INFANTRY ; Montée = MOUNTED ; Monstre = MONSTER
     Personnage = CHARACTER ; Ligne = BATTLELINE
     Marines Rubricae = RUBRIC MARINES ; Rubricae = RUBRICAE
     Terminators du Scarabée Occulte = SCARAB OCCULT TERMINATORS
     Robots Sekhetar = SEKHETAR ROBOTS ; Mutant = MUTANT
     Rejeton du Chaos de Tzeentch = TZEENTCH CHAOS SPAWN (supposé)
   À confirmer : « Mutants de Tzeentch » (Pacte de Fusewarp) noté
     TZEENTCH MUTANTS (supposé).
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const REGLE_A_SAISIR = "Règle du détachement à saisir.";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation", extra = {}) => ({
  id, name, cost, kind,
  requires: [["Thousand Sons"]],
  text: A_SAISIR,
  ...extra
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");
const meneur = (id, name, cost, unite) => opt(id, name, cost, "optimisation", { requiresAttachedTo: [unite] });

// Étiquette « Unique : … » : un seul détachement de ce groupe par armée
const unique = tag => `Ce détachement a l'étiquette UNIQUE : ${tag.toUpperCase()} : il ne peut pas être pris avec un autre détachement ${tag.toUpperCase()}.`;

// Détachement : o = { nameEn, ruleName, rule: [textes], stratagems: [...] }
const det = (id, name, cost, dispositions, enhancements, tag, o = {}) => ({
  id, name, cost, dispositions,
  ...(o.nameEn ? { nameEn: o.nameEn } : {}),
  ...(tag ? { exclusiveGroup: tag.toLowerCase() } : {}),
  rule: { name: o.ruleName || null, text: (o.rule || [REGLE_A_SAISIR]).concat(tag ? [unique(tag)] : []) },
  enhancements,
  stratagems: o.stratagems || []
});

// Moments des stratagèmes (vus du joueur Thousand Sons)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCharge:  { tour: "adversaire", phase: "charge" },
  advCombat:  { tour: "adversaire", phase: "combat" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, moments, quand, cible, effet, type = null) =>
  ({ id, name, cp, type, moments, quand, cible, effet });
const TACTIQUE = "Tactique de Bataille";

// Objectif sécurisé (texte commun)
const SECURISE = "il reste sous votre contrôle jusqu'à ce que votre adversaire y ait un Niveau de Contrôle supérieur au vôtre à la fin d'une phase (objectif sécurisé).";

Factions.register({
  id: "thousand-sons",
  name: "Thousand Sons",
  keyword: "Thousand Sons",

  armyRules: [
    {
      id: "cabale-de-sorciers",
      name: "Cabale de Sorciers",
      nameEn: "Cabal of Sorcerers",
      text: [
        "Si la Faction d'Armée de votre armée est THOUSAND SONS, au début de votre phase de Tir, une ou plusieurs figurines de votre armée qui ont cette aptitude peuvent tenter des Rituels parmi ceux listés ci-dessous. Pour cela, choisissez 1 figurine de votre armée qui a cette aptitude et qui n'a pas encore tenté de Rituel à ce tour, choisissez 1 Rituel qu'aucune figurine de votre armée n'a tenté de manifester à ce tour, puis faites un test psychique pour cette figurine en suivant la séquence ci-dessous.",
        "__Test psychique__",
        "• Lancez 2D6.",
        "• __Canaliser le Warp (facultatif)__ : vous pouvez lancer 1D6 supplémentaire. Si un ou plusieurs doubles ou triples ont été obtenus pendant ce test, l'unité de cette figurine subit D3 blessures mortelles.",
        "• Si la figurine n'est pas détruite, le total de tous les dés lancés pendant ce test est le résultat du test psychique. S'il est égal ou supérieur à la valeur de Charge Warp du Rituel tenté, la figurine manifeste ce Rituel et vous en appliquez les effets.",
        "__Ruine du Destin (Destiny's Ruin) — Psychique, Charge Warp 5__ : choisissez 1 unité ennemie à 24\" ou moins de la figurine qui manifeste et visible pour elle. Jusqu'à la fin de la phase, chaque fois qu'une figurine THOUSAND SONS ou SCINTILLATING LEGIONS de votre armée attaque cette unité, relancez un jet de touche de 1. Si le résultat du test psychique était de 10+, vous pouvez relancer le jet de touche à la place.",
        "__Vague Temporelle (Temporal Surge) — Psychique, Charge Warp 6__ : choisissez 1 unité THOUSAND SONS ou SCINTILLATING LEGIONS amie non engagée, à 24\" ou moins de la figurine qui manifeste et visible pour elle. Cette unité peut faire un Mouvement Normal de D6\" maximum. Si le résultat du test psychique était de 10+, elle peut faire à la place un Mouvement Normal de 6\" maximum. Dans les deux cas, jusqu'à la fin du tour, cette unité n'est pas éligible pour déclarer une charge.",
        "__Trait Funeste (Doombolt) — Psychique, Charge Warp 7__ : choisissez 1 unité ennemie à 24\" ou moins de la figurine qui manifeste et visible pour elle (sauf les unités qui ont l'aptitude Agent Solitaire, qui ne font pas partie d'une unité Attachée et qui ne sont pas à 12\" ou moins de la figurine qui manifeste). Cette unité subit D3 blessures mortelles. Si le résultat du test psychique était de 11+, elle subit D3+3 blessures mortelles à la place.",
        "__Coup du Sort (Twist of Fate) — Psychique, Charge Warp 9__ : choisissez 1 unité ennemie à 24\" ou moins de la figurine qui manifeste et visible pour elle. Jusqu'à la fin de la phase, chaque fois qu'une figurine THOUSAND SONS ou SCINTILLATING LEGIONS de votre armée attaque cette unité, la Pénétration d'Armure de cette attaque est améliorée de 1. Si le résultat du test psychique était de 12+, elle est améliorée de 2 à la place."
      ]
    },
    {
      id: "pacte-de-sorcellerie",
      name: "Pacte de Sorcellerie",
      nameEn: "Pact of Sorcery",
      text: [
        "Les démons de Tzeentch sont attirés à travers les barrières du Warp par des rituels de transmutation.",
        "Lors de la constitution de votre armée, sauf mention contraire, vous ne pouvez pas choisir SCINTILLATING LEGIONS comme Faction d'Armée."
      ]
    }
  ],

  detachments: [

    /* ----- CHANGEOST DE LA DUPERIE (Changehost of Deceit) ----- */
    det("changeost-de-la-duperie", "Changeost de la Duperie", 2, ["reconnaissance"], [
      opt("savant-diabolique", "Savant Diabolique", 20),
      opt("malediction-sournoise", "Malédiction Sournoise", 15),
      opt("cri-psychophage-infernal", "Cri Psychophage Infernal", 10),
      opt("registre-des-noms-veritables", "Registre des Noms Véritables", 20)
    ], null, {
      nameEn: "Changehost of Deceit",
      rule: [
        "Jusqu'à 50 % de votre armée peut être composée d'unités SCINTILLATING LEGIONS.",
        "Les unités THOUSAND SONS PSYKER amies à 6\" ou moins d'une unité SCINTILLATING LEGIONS amie et visibles pour elle ont une sauvegarde invulnérable de 4+ contre les attaques de tir.",
        "Les unités SCINTILLATING LEGIONS PSYKER amies à 6\" ou moins d'une unité THOUSAND SONS amie et visibles pour elle ont l'aptitude Cabale de Sorciers."
      ],
      stratagems: [
        strat("disjonction-fractale", "Disjonction Fractale", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité SCINTILLATING LEGIONS de votre armée (sauf MONSTER) est choisie pour cible.",
          "Cette unité SCINTILLATING LEGIONS.",
          "Jusqu'à la fin de la phase, votre unité ne peut être choisie pour cible que par une unité ennemie à 18\" ou moins d'elle."),
        strat("fantomes-etheres", "Fantômes Éthérés", 1, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité SCINTILLATING LEGIONS non engagée de votre armée.",
          "Cette unité SCINTILLATING LEGIONS.",
          "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de 6\" maximum si elle est entièrement à 6\" ou moins d'une unité THOUSAND SONS amie."),
        strat("portail-de-mouveleur", "Portail de Mouveleur", 1, [M.advCombat],
          "Fin de la phase de Combat adverse.",
          "Jusqu'à 2 unités SCINTILLATING LEGIONS de votre armée (1 seule si c'est un MONSTER) à plus de 3\" de toute unité ennemie.",
          "Placez ces unités en Réserves Stratégiques."),
        strat("prestige-illusoire", "Prestige Illusoire", 2, [M.combat],
          "Début de la phase de Combat.",
          "1 unité THOUSAND SONS de votre armée.",
          "Jusqu'à la fin de la phase, votre unité ne peut être choisie pour cible que s'il n'y a pas d'autre unité SCINTILLATING LEGIONS éligible comme cible."),
        strat("saignee-chronomancienne", "Saignée Chronomancienne", 1, [M.advCharge],
          "Début de la phase de Charge adverse.",
          "1 unité SCINTILLATING LEGIONS ou THOUSAND SONS PSYKER non engagée de votre armée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité. Quand cette unité ennemie déclare une charge à cette phase, elle a -1 à son jet de Charge."),
        strat("voile-sulfureux", "Voile Sulfureux", 1, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, quand une unité THOUSAND SONS ou SCINTILLATING LEGIONS de votre armée est choisie pour cible.",
          "Cette unité.",
          "Jusqu'à la fin de la phase, les attaques qui ciblent votre unité ont -1 au jet de touche.", TACTIQUE)
      ]
    }),

    /* ----- GRANDE COTERIE (Grand Coven) ----- */
    det("grande-coterie", "Grande Coterie", 3, ["disruption", "priority-assets"], [
      opt("vortex-esoterique-d-e-taph", "Vortex Ésotérique d'E'Taph", 35),
      opt("incandaeum", "Incandaeum", 15),
      opt("seigneur-du-savoir-interdit", "Seigneur du Savoir Interdit", 20),
      opt("cristal-d-umbralefices", "Cristal d'Umbraléfices", 30)
    ], null, {
      nameEn: "Grand Coven",
      rule: [
        "À votre phase de Commandement, choisissez l'un des bonus suivants (chacun ne peut être choisi qu'une fois par bataille). Jusqu'à votre prochaine phase de Commandement, il s'applique aux armes [PSYCHIQUE] des figurines THOUSAND SONS de votre armée :",
        "• +6\" de portée (armes de tir) ;",
        "• +1 au jet de blessure ;",
        "• [BLESSURES DÉVASTATRICES]."
      ],
      stratagems: [
        strat("assujetti-au-destin", "Assujetti au Destin", 1, [M.tout],
          "N'importe quelle phase, quand un jet de sauvegarde est raté pour une figurine THOUSAND SONS PSYKER de votre armée.",
          "L'unité de cette figurine.",
          "La caractéristique de Dégâts de cette attaque devient 0."),
        strat("domination-psychique", "Domination Psychique", 1, [M.tout],
          "N'importe quelle phase, quand une unité THOUSAND SONS de votre armée est choisie pour cible.",
          "Cette unité THOUSAND SONS.",
          "Jusqu'à la fin de la phase, les attaques [PSYCHIQUE] qui ciblent votre unité ont [À RISQUE], et les figurines de votre unité ont Insensible à la Douleur 4+ contre les attaques psychiques."),
        strat("foyer-occulte", "Foyer Occulte", 1, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité THOUSAND SONS PSYKER de votre armée a tenté un Rituel avec 3D6, avant de le résoudre.",
          "Cette unité THOUSAND SONS PSYKER.",
          "Vous pouvez relancer les 3 dés."),
        strat("pouvoir-egotiste", "Pouvoir Égotiste", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité THOUSAND SONS PSYKER de votre armée.",
          "Jusqu'à votre prochaine phase de Commandement, votre unité bénéficie d'un des 2 autres bonus du détachement (en plus de celui en cours pour l'armée), même s'il a déjà été choisi plus tôt dans la bataille."),
        strat("profanation-des-mondes", "Profanation des Mondes", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité THOUSAND SONS PSYKER de votre armée à portée d'un objectif que vous contrôlez.",
          "Cet objectif : " + SECURISE),
        strat("sorcellerie-devastatrice", "Sorcellerie Dévastatrice", 2, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité THOUSAND SONS PSYKER de votre armée qui n'a pas encore été choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, les armes [PSYCHIQUE] de votre unité ont +9\" de portée, et leurs attaques peuvent relancer le jet de touche et le jet de blessure.", TACTIQUE)
      ]
    }),

    /* ----- SERVITUDE DU MALEWARP (Hexwarp Thrallband) ----- */
    det("servitude-du-malewarp", "Servitude du Malewarp", 3, ["take-and-hold", "reconnaissance"], [
      opt("puissance-des-arcanes", "Puissance des Arcanes", 20),
      opt("manifestation-renforcee", "Manifestation Renforcée", 20),
      opt("assaut-empyreen", "Assaut Empyréen", 25),
      opt("coiffe-de-noctilithe", "Coiffe de Noctilithe", 15)
    ], null, {
      nameEn: "Hexwarp Thrallband",
      rule: [
        "Certaines zones du champ de bataille sont dans le __Flux de Magie__ de votre armée :",
        "• votre zone de déploiement ;",
        "• le No Man's Land, si au début de la phase en cours vous contrôlez au moins la moitié des pions d'objectif qui s'y trouvent.",
        "Chaque fois qu'une figurine THOUSAND SONS de votre armée fait une attaque [PSYCHIQUE], relancez le jet de blessure de 1. Si cette figurine est entièrement dans le Flux de Magie de votre armée, ajoutez 1 au jet de blessure à la place."
      ],
      stratagems: [
        strat("a-travers-le-voile", "À Travers le Voile", 1, [M.vousMvt],
          "Début de l'étape de Renforts de votre phase de Mouvement.",
          "1 unité RUBRIC MARINES ou SCARAB OCCULT TERMINATORS de votre armée en Réserves Stratégiques.",
          "Unité RUBRIC MARINES : jusqu'à la fin de la phase, elle a l'aptitude Frappe en Profondeur.\nUnité SCARAB OCCULT TERMINATORS qui utilise Frappe en Profondeur : elle peut être placée n'importe où, entièrement dans le Flux de Magie de votre armée et à plus de 6\" horizontalement de toute figurine ennemie, mais elle n'est pas éligible pour déclarer une charge à ce tour."),
        strat("colere-des-condamnes", "Colère des Condamnés", 1, [M.combat],
          "Phase de Combat, quand une unité THOUSAND SONS de votre armée est choisie pour cible.",
          "Cette unité THOUSAND SONS.",
          "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite, si elle n'a pas encore combattu à cette phase, lancez 1D6 (+1 si votre unité est entièrement dans le Flux de Magie de votre armée) : sur 4+, ne la retirez pas. Elle peut combattre une fois que l'unité attaquante a résolu ses attaques, puis elle est retirée."),
        strat("echeveau-du-temps", "Écheveau du Temps", 1, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité THOUSAND SONS PSYKER de votre armée a Battu en Retraite.",
          "Cette unité THOUSAND SONS PSYKER.",
          "Jusqu'à la fin du tour, votre unité est éligible pour tirer ou pour déclarer une charge à un tour où elle a Battu en Retraite. Si elle est entièrement dans le Flux de Magie de votre armée, elle est éligible pour tirer et déclarer une charge."),
        strat("flammes-warp-destructrices", "Flammes Warp Destructrices", 1, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité THOUSAND SONS PSYKER de votre armée qui n'a pas encore été choisie pour tirer et qui est entièrement dans le Flux de Magie de votre armée.",
          "Jusqu'à la fin de la phase, les armes de votre unité ont [IGNORE LE COUVERT]. Après que votre unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques : jusqu'à la fin de la phase, ses figurines ne peuvent pas bénéficier du couvert."),
        strat("malefice-protecteur", "Maléfice Protecteur", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité THOUSAND SONS PSYKER de votre armée à portée d'un pion d'objectif que vous contrôlez et qui est entièrement dans le Flux de Magie de votre armée.",
          "Ce pion d'objectif : " + SECURISE),
        strat("tempete-kaleidoscopique", "Tempête Kaléidoscopique", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité THOUSAND SONS PSYKER de votre armée est choisie pour cible.",
          "Cette unité THOUSAND SONS PSYKER.",
          "Votre unité a l'aptitude Discrétion. Si elle est entièrement dans le Flux de Magie de votre armée, elle a aussi -3\" en portée de détection.")
      ]
    }),

    /* ----- RITUEL DE RÉGÉNÉRATION (Ritual of Regeneration) ----- */
    det("rituel-de-regeneration", "Rituel de Régénération", 1, ["take-and-hold"], [
      opt("malediction-de-la-vie", "Malédiction de la Vie", 20),
      opt("eruption-de-vitalite", "Éruption de Vitalité", 35)
    ], null, {
      nameEn: "Ritual of Regeneration",
      rule: [
        "(1 fois par tour, par unité) Quand une unité THOUSAND SONS PSYKER amie (sauf MONSTER) réussit à manifester un Rituel, elle récupère D3 PV."
      ],
      stratagems: [
        strat("magie-mutagene", "Magie Mutagène", 1, [M.combat],
          "Début de la phase de Combat.",
          "1 unité THOUSAND SONS PSYKER engagée de votre armée.",
          "Choisissez 1 unité ennemie engagée avec votre unité et lancez 6D6 : pour chaque 4+, elle subit 1 blessure mortelle."),
        strat("membres-multiples", "Membres Multiples", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité THOUSAND SONS PSYKER INFANTRY ou MOUNTED de votre armée est choisie pour faire une Avance ou une Retraite.",
          "Cette unité THOUSAND SONS PSYKER.",
          "Ce mouvement ne l'empêche pas d'être éligible pour commencer une action."),
        strat("renaissance-incessante", "Renaissance Incessante", 1, [M.tout],
          "N'importe quelle phase, quand une unité THOUSAND SONS PSYKER INFANTRY ou MOUNTED de votre armée subit une blessure mortelle.",
          "Cette unité THOUSAND SONS PSYKER.",
          "Votre unité a Insensible à la Douleur 5+ contre les blessures mortelles.")
      ]
    }),

    /* ----- PHALANGE RUBRICAE (Rubricae Phalanx) ----- */
    det("phalange-rubricae", "Phalange Rubricae", 3, ["take-and-hold", "priority-assets"], [
      opt("serfs-occultes", "Serfs Occultes", 5),
      opt("seigneur-des-rubricae", "Seigneur des Rubricae", 15),
      opt("rubricae-exhumes", "Rubricae Exhumés", 30),
      opt("baton-abominus", "Bâton Abominus", 20)
    ], null, {
      nameEn: "Rubricae Phalanx",
      rule: [
        "Chaque fois qu'une attaque dont la caractéristique de Dégâts non modifiée est de 1 cible une unité RUBRICAE de votre armée, ajoutez 1 au jet de sauvegarde d'armure."
      ],
      stratagems: [
        strat("automate-ardent", "Automate Ardent", 1, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité RUBRICAE de votre armée a Battu en Retraite.",
          "Cette unité RUBRICAE.",
          "Jusqu'à la fin du tour, votre unité est éligible pour tirer et déclarer une charge."),
        strat("fusillade-infernale", "Fusillade Infernale", 1, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité THOUSAND SONS PSYKER de votre armée qui n'a pas encore été choisie pour tirer.",
          "Jusqu'à la fin de la phase, les pistolets bolters Inferno, bolters Inferno, combi-bolters Inferno et armes combinées Inferno des figurines de votre unité ont [PSYCHIQUE]."),
        strat("gardiens-implacables", "Gardiens Implacables", 2, [M.advTir],
          "Phase de Tir adverse, quand une unité RUBRIC MARINES PSYKER de votre armée est choisie pour cible.",
          "Cette unité RUBRIC MARINES.",
          "Jusqu'à la fin de la phase, les attaques qui ciblent les figurines de votre unité (sauf les figurines PSYKER) ont -1 aux Dégâts."),
        strat("phalange-inflexible", "Phalange Inflexible", 1, [M.advCharge],
          "Phase de Charge adverse, juste après qu'une unité RUBRICAE de votre armée a été chargée.",
          "Cette unité RUBRICAE.",
          "Jusqu'à la fin du tour, les attaques qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance."),
        strat("progression-inexorable", "Progression Inexorable", 1, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité RUBRICAE de votre armée.",
          "Votre unité peut ignorer tout ou partie des modificateurs de sa caractéristique de Mouvement et de ses jets d'Avance. Jusqu'à la fin de la phase, ses armes ont [ASSAUT]."),
        strat("revanche-des-rubricae", "Revanche des Rubricae", 1, [M.advTir],
          "Phase de Tir adverse, juste après qu'une figurine THOUSAND SONS PSYKER de votre armée a été détruite.",
          "1 unité RUBRICAE de votre armée qui était à 6\" ou moins de cette figurine.",
          "Votre unité peut tirer immédiatement comme si c'était votre phase de Tir, mais seulement sur l'unité attaquante (si elle est une cible éligible).")
      ]
    }),

    /* ----- COHORTE SEKHETAR (Sekhetar Cohort) ----- */
    det("cohorte-sekhetar", "Cohorte Sekhetar", 1, ["disruption"], [
      opt("occulus-infernum", "Occulus Infernum", 20),
      opt("rempart-ambulant", "Rempart Ambulant", 30)
    ], null, {
      nameEn: "Sekhetar Cohort",
      rule: [
        "Les attaques des unités SEKHETAR ROBOTS amies ont [PSYCHIQUE].",
        "Les unités THOUSAND SONS PSYKER amies ont l'aptitude suivante :",
        "__Infusion (Aura)__ : tant qu'une unité SEKHETAR ROBOTS amie est à 12\" ou moins de cette unité, la CC des attaques de mêlée de cette unité SEKHETAR ROBOTS est améliorée de 1."
      ],
      stratagems: [
        strat("champs-warp", "Champs Warp", 1, [M.advTir],
          "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité SEKHETAR ROBOTS de votre armée à 12\" ou moins d'une unité THOUSAND SONS PSYKER amie.",
          "Cette unité SEKHETAR ROBOTS.",
          "Les attaques de tir qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance."),
        strat("evacuation-occulte", "Évacuation Occulte", 1, [M.vousMvt],
          "Fin de votre phase de Mouvement.",
          "1 unité SEKHETAR ROBOTS de votre armée.",
          "Choisissez un objectif que votre unité contrôle : il est sécurisé."),
        strat("extrusion-ectoplasmique", "Extrusion Ectoplasmique", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité SEKHETAR ROBOTS de votre armée à 12\" ou moins d'une unité THOUSAND SONS PSYKER amie commence une action.",
          "Cette unité SEKHETAR ROBOTS.",
          "Cette action ne l'empêche pas d'être éligible pour tirer.")
      ]
    }),

    /* ----- SERVITEURS DU CHANGEMENT (Servants of Change) — Unique : Mutant ----- */
    det("serviteurs-du-changement", "Serviteurs du Changement", 1, ["reconnaissance"], [
      amelio("buisson-d-os-tranchants", "Buisson d'Os Tranchants", 10),
      opt("destins-reprimes", "Destins Réprimés", 15)
    ], "Mutant", {
      nameEn: "Servants of Change",
      rule: [
        "Les unités TZAANGORS amies ont le mot-clé BATTLELINE.",
        "À votre phase de Tir, tant qu'une unité MUTANT amie tire, les unités ennemies ont +6\" en portée de détection."
      ],
      stratagems: [
        strat("deplacement-prismatique", "Déplacement Prismatique", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité MUTANT INFANTRY ou MOUNTED de votre armée est choisie pour faire une Avance ou une Retraite.",
          "Cette unité MUTANT.",
          "Jusqu'à la fin du tour, les attaques de tir de votre unité ont [ASSAUT]. Ce mouvement ne l'empêche pas d'être éligible pour tirer ou déclarer une charge."),
        strat("instabilite-temporelle", "Instabilité Temporelle", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité MUTANT INFANTRY ou MOUNTED de votre armée est choisie pour faire une Avance ou une Retraite.",
          "Cette unité MUTANT.",
          "Ce mouvement ne l'empêche pas d'être éligible pour commencer une action."),
        strat("la-terre-se-tortille", "La Terre se Tortille", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité MUTANT MONSTER de votre armée est choisie pour se déplacer.",
          "Cette unité MUTANT MONSTER.",
          "Votre unité a le mot-clé MOBILE.")
      ]
    }),

    /* ----- CABALE DES FORGES EMPYRÉENNES (Warpforged Cabal) ----- */
    det("cabale-des-forges-empyreennes", "Cabale des Forges Empyréennes", 2, ["priority-assets"], [
      opt("mutation-biomecanique", "Mutation Biomécanique", 15),
      opt("cape-de-perplexite", "Cape de Perplexité", 20),
      opt("maitre-des-runes-maudites", "Maître des Runes Maudites", 10),
      opt("siphon-warp", "Siphon Warp", 5)
    ], null, {
      nameEn: "Warpforged Cabal",
      rule: [
        "Chaque fois qu'une unité THOUSAND SONS VEHICLE amie tire, elle peut :",
        "• relancer 1 jet de touche, 1 jet de blessure et 1 jet de Dégâts, si une unité THOUSAND SONS PSYKER amie est à 6\" ou moins ;",
        "• sinon, relancer 1 jet de touche, 1 jet de blessure ou 1 jet de Dégâts.",
        "Chaque fois qu'une unité THOUSAND SONS VEHICLE amie qui a l'aptitude Destruction Néfaste est détruite à 6\" ou moins d'une unité THOUSAND SONS PSYKER amie, elle explose sur 5+ au lieu de 6."
      ],
      stratagems: [
        strat("animus-malefique", "Animus Maléfique", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité THOUSAND SONS VEHICLE de votre armée à 6\" ou moins d'une unité THOUSAND SONS PSYKER amie.",
          "Jusqu'à votre prochaine phase de Commandement, votre unité peut ignorer tout ou partie des modificateurs de sa CC, de sa CT et de tous ses tests et jets (sauf les jets de sauvegarde)."),
        strat("blindage-a-sort-sangsue", "Blindage à Sort-sangsue", 1, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité THOUSAND SONS VEHICLE de votre armée a été choisie pour cible.",
          "Cette unité THOUSAND SONS VEHICLE.",
          "Jusqu'à la fin de la phase, la Pénétration d'Armure des attaques qui ciblent votre unité est dégradée de 1.", TACTIQUE),
        strat("gargouilles-de-flammes-warp", "Gargouilles de Flammes Warp", 1, [M.advCharge],
          "Phase de Charge adverse, juste après qu'une unité ennemie a chargé une unité THOUSAND SONS VEHICLE de votre armée.",
          "Cette unité THOUSAND SONS VEHICLE.",
          "Lancez 6D6 : pour chaque 5+, l'unité qui a chargé subit 1 blessure mortelle."),
        strat("machinations-cyberspirituelles", "Machinations Cyberspirituelles", 1, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité THOUSAND SONS VEHICLE de votre armée à 6\" ou moins d'une unité THOUSAND SONS PSYKER amie a Battu en Retraite.",
          "Cette unité THOUSAND SONS VEHICLE.",
          "Jusqu'à la fin du tour, votre unité est éligible pour tirer et déclarer une charge."),
        strat("paysage-mute", "Paysage Muté", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 objectif que vous contrôlez, à portée d'une unité THOUSAND SONS PSYKER de votre armée.",
          "Cet objectif : " + SECURISE + " Tant que vous le contrôlez, chaque fois qu'une unité ennemie finit un Mouvement Normal, une Avance ou une Retraite à portée de cet objectif, lancez 1D6 : sur 4+, elle subit D3 blessures mortelles."),
        strat("seve-sorciere", "Sève Sorcière", 2, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité THOUSAND SONS VEHICLE de votre armée, à 6\" ou moins d'une unité THOUSAND SONS PSYKER amie, qui n'a pas encore été choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, les armes de tir de votre unité ont [PSYCHIQUE] et +1 au jet de blessure.")
      ]
    }),

    /* ----- PACTE DE FUSEWARP (Warpmeld Pact) — Unique : Mutant ----- */
    det("pacte-de-fusewarp", "Pacte de Fusewarp", 2, ["purge-the-foe"], [
      opt("braillarque", "Braillarque", 15),
      meneur("diamant-de-distorsion", "Diamant de Distorsion", 20, "Tzaangors"),
      meneur("chair-fluide", "Chair Fluide", 10, "Tzaangors"),
      meneur("dague-de-fusewarp", "Dague de Fusewarp", 10, "Tzaangors")
    ], "Mutant", {
      nameEn: "Warpmeld Pact",
      rule: [
        "Les unités TZAANGORS amies ont le mot-clé BATTLELINE et +1 en CO.",
        "Chaque fois qu'une unité TZEENTCH MUTANTS INFANTRY ou MOUNTED amie est ciblée par une attaque, elle peut choisir de bénéficier de -1 au jet de blessure contre elle jusqu'à la fin de la phase ; elle subit alors D3 blessures mortelles à la fin de la phase.",
        "Chaque fois qu'une unité TZEENTCH MUTANTS INFANTRY ou MOUNTED amie attaque, elle peut choisir de bénéficier de +1 au jet de blessure jusqu'à la fin de la phase ; elle subit alors D3 blessures mortelles à la fin de la phase."
      ],
      stratagems: [
        strat("don-du-changement", "Don du Changement", 1, [M.tout],
          "N'importe quelle phase, quand une figurine THOUSAND SONS CHARACTER de votre armée (sauf MONSTER) vient d'être détruite. 1 fois par round au maximum.",
          "Cette figurine THOUSAND SONS CHARACTER.",
          "Ajoutez à votre armée 1 TZEENTCH CHAOS SPAWN, placé non engagé et aussi près que possible de la position de votre figurine."),
        strat("ferocite-detraquee", "Férocité Détraquée", 1, [M.combat],
          "Phase de Combat, juste après qu'une unité TZEENTCH MUTANTS de votre armée a été choisie pour combattre.",
          "Cette unité TZEENTCH MUTANTS.",
          "À cette phase, votre unité fait des mouvements d'engagement et de consolidation de 6\" au lieu de 3\", et ses figurines peuvent combattre les figurines ennemies à 3\" ou moins d'elles."),
        strat("mirage-deforme", "Mirage Déformé", 1, [M.vousMvt],
          "Étape de Renforts de votre phase de Mouvement.",
          "1 unité TZEENTCH MUTANTS de votre armée qui arrive des Réserves Stratégiques à ce tour.",
          "Votre unité peut être placée n'importe où à plus de 6\" horizontalement de toute figurine ennemie (à plus de 8\" si c'est un MONSTER), mais elle ne peut pas déclarer de charge à ce tour."),
        strat("mue-etheree", "Mue Éthérée", 1, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité TZAANGORS de votre armée a été choisie pour cible.",
          "Cette unité TZAANGORS.",
          "Jusqu'à la fin de la phase, votre unité a une sauvegarde invulnérable de 4+."),
        strat("touches-par-tzeentch", "Touchés par Tzeentch", 1, [M.vousMvt],
          "Début de votre phase de Mouvement.",
          "1 unité TZEENTCH MUTANTS de votre armée.",
          "Jusqu'à la fin du tour, votre unité est éligible pour tirer et déclarer une charge à un tour où elle a fait une Avance."),
        strat("transmutations-benies", "Transmutations Bénies", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 figurine THOUSAND SONS PSYKER de votre armée.",
          "Choisissez 1 unité TZAANGORS amie à 12\" ou moins de cette figurine : jusqu'à D3+1 figurines détruites (sauf CHARACTER) sont rajoutées à cette unité.")
      ]
    })
  ]
});

})();
