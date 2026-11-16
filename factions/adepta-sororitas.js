/* =========================================================
   ADEPTA SORORITAS — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - Règle d'armée (Actes de Foi : gagner des dés de Miracle,
     accomplir un Acte de Foi, FAQ) : complète, traduite depuis
     l'anglais, texte à jour de l'errata.
   - 8 détachements : règles et stratagèmes (37) saisis d'après les
     fiches françaises fournies (résumés repris tels quels pour
     certaines : Martyrs Sacrés, Porteuses de la Flamme, Ost Pénitent).
     Orateurs Sanctifiés n'a pas de stratagème.
   - Armée de la Foi : disposition Prendre et tenir seule (page
     récapitulative des détachements, qui fait foi).
   - Martyrs Sacrés : appelé « Martyrs Sanctifiés » sur la fiche des
     stratagèmes ; nom de la page récapitulative gardé (elle fait foi).
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - Unique : Révérend — Championnes de la Foi et Championnes Sacrées
     (exclusiveGroup).
   - Ost Pénitent : 3 optimisations réservées au meneur d'une
     REPENTIA SQUAD (requiresAttachedTo).
   - Optimisations notées « (Amélioration) » : kind "amelioration".

   Unités citées : mots-clés anglais (comme les autres factions).
     Escouade Repentia = REPENTIA SQUAD ; Réacteur Dorsal = JUMP PACK
     Célestes Sacro-saintes = CELESTIAN SACRESANTS
     Célestes Insidiatrices = CELESTIAN INSIDIANTS
     Escouade de Sœurs de Bataille = BATTLE SISTERS SQUAD
     Exo-harnais Parangon = PARAGON WARSUITS ; Vol = FLY
     Pénitent = PENITENT ; Marcheur = WALKER ; Personnage = CHARACTER
     Sainte Célestine = SAINT CELESTINE
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const TDB = "Tactique de Bataille";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation", extra = {}) => ({
  id, name, cost, kind,
  requires: [["Adepta Sororitas"]],
  text: A_SAISIR,
  ...extra
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");
// Optimisation réservée au meneur d'une Escouade Repentia
const repentia = (id, name, cost) => opt(id, name, cost, "optimisation", { requiresAttachedTo: ["REPENTIA SQUAD"] });

// Moments des stratagèmes (vus du joueur Adepta Sororitas)
const M = {
  vousCmd:   { tour: "vous", phase: "commandement" },
  vousMvt:   { tour: "vous", phase: "mouvement" },
  vousTir:   { tour: "vous", phase: "tir" },
  advCmd:    { tour: "adversaire", phase: "commandement" },
  advTir:    { tour: "adversaire", phase: "tir" },
  combat:    { tour: "les-deux", phase: "combat" },
  tout:      { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, type, moments, quand, cible, effet) =>
  ({ id, name, cp, type, moments, quand, cible, effet });

const REVEREND = "Ce détachement a l'étiquette RÉVÉREND : il ne peut pas être pris avec un autre détachement RÉVÉREND.";

Factions.register({
  id: "adepta-sororitas",
  name: "Adepta Sororitas",
  keyword: "Adepta Sororitas",

  armyRules: [
    {
      id: "gagner-des-des-de-miracle",
      name: "Actes de Foi : gagner des dés de Miracle",
      nameEn: "Acts of Faith: Gaining Miracle Dice",
      text: [
        "Si la Faction d'Armée de votre armée est ADEPTA SORORITAS, vous gagnez 1 dé de Miracle :",
        "• au début de chaque tour ;",
        "• chaque fois qu'une unité ADEPTA SORORITAS de votre armée est détruite.",
        "Chaque fois que vous gagnez un dé de Miracle, lancez 1D6 : le résultat est la valeur de ce dé de Miracle. Cette valeur ne peut être ni modifiée ni relancée, sauf si une règle le précise. Gardez vos dés de Miracle de côté : c'est votre réserve de dés de Miracle.",
        "__Errata__ : ce texte est celui de l'errata (même règle, formulation corrigée)."
      ]
    },
    {
      id: "accomplir-un-acte-de-foi",
      name: "Accomplir un Acte de Foi",
      nameEn: "Performing an Act of Faith",
      text: [
        "Avant de faire un jet de dé pour une figurine ou une unité de votre armée qui a l'aptitude Actes de Foi, si vous avez un ou plusieurs dés dans votre réserve de dés de Miracle, cette unité peut accomplir un Acte de Foi.",
        "Dans ce cas, choisissez un des dés de votre réserve de dés de Miracle pour remplacer ce jet de dé. Si le jet comprend plusieurs dés (par exemple un jet de Charge ou un test d'Ébranlement), un seul dé peut être remplacé.",
        "Le dé remplacé n'est pas lancé : la valeur du dé de Miracle choisi est utilisée comme s'il avait été obtenu (c'est un jet non modifié de cette valeur pour toutes les règles). Chaque dé de Miracle ne peut être choisi qu'une seule fois pour un remplacement.",
        "Une fois tous les remplacements faits, retirez les dés de Miracle choisis de votre réserve, puis lancez tous les dés restants, non remplacés, du jet.",
        "Les dés de Miracle peuvent être utilisés, quand une unité accomplit un Acte de Foi, pour les types de jets suivants :",
        "• jet d'Avance ;",
        "• test d'Ébranlement ;",
        "• jet de Charge ;",
        "• jet de Dégâts ;",
        "• jet de touche ;",
        "• jet de sauvegarde ;",
        "• jet de blessure."
      ]
    },
    {
      id: "faq-des-de-miracle",
      name: "FAQ : dés de Miracle",
      nameEn: "FAQ: Miracle Dice",
      text: [
        "__Q__ : Un dé de Miracle peut-il être utilisé dans une relance ?",
        "__R__ : Oui.",
        "__Q__ : Si je relance un jet dans lequel j'avais remplacé un dé par un dé de Miracle, puis-je utiliser ce dé de Miracle dans la relance (par exemple en relançant un jet de Charge) ?",
        "__R__ : Non, ce dé de Miracle est perdu. Votre unité a tout de même accompli un Acte de Foi.",
        "__Q__ : Comment fonctionnent les dés de Miracle pendant la séquence d'attaque ?",
        "__R__ : Pendant la séquence d'attaque, l'unité attaquante du joueur Adepta Sororitas peut accomplir un Acte de Foi :",
        "• pour les jets de touche : elle peut remplacer un dé de n'importe quel groupe d'attaques, avant de faire le jet ;",
        "• pour les jets de blessure : elle peut remplacer un dé de n'importe quel groupe de touches, avant de faire le jet ;",
        "• pour les jets de Dégâts : elle peut remplacer le dé d'un seul jet de Dégâts, avant de faire le jet.",
        "L'unité ciblée du joueur Adepta Sororitas peut accomplir un Acte de Foi pour les jets de sauvegarde : elle peut remplacer un dé de n'importe quel groupe d'attaques qui l'ont blessée, avant de faire le jet."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       ARMÉE DE LA FOI (Army of Faith)
       ------------------------------------------------------- */
    {
      id: "armee-de-la-foi", name: "Armée de la Foi", nameEn: "Army of Faith",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Les unités ADEPTA SORORITAS de votre armée peuvent accomplir jusqu'à 2 Actes de Foi par phase au lieu d'1."
      ] },
      enhancements: [
        opt("epee-de-sainte-ellynor", "Épée de Sainte Ellynor", 15),
        opt("aspect-divin", "Aspect Divin", 5),
        opt("litanies-de-la-foi", "Litanies de la Foi", 10),
        opt("triptyque-de-la-croisade-macharienne", "Triptyque de la Croisade Macharienne", 20)
      ],
      stratagems: [
        strat("bouclier-de-la-foi", "Bouclier de la Foi", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité ADEPTA SORORITAS de votre armée a subi une blessure mortelle.",
          "Cette unité ADEPTA SORORITAS, ou 1 unité ADEPTA SORORITAS JUMP PACK de votre armée à 3\" ou moins d'elle.",
          "Jusqu'à la fin de la phase, votre unité a Insensibilité à la Douleur 5+ contre les blessures mortelles. Si vous avez choisi une unité JUMP PACK, elle a à la place, jusqu'à la fin de la phase, une aura de 3\" qui donne Insensibilité à la Douleur 5+ contre les blessures mortelles."),
        strat("descente-angelique", "Descente Angélique", 1, null, [M.combat],
          "Fin de la phase de Combat.",
          "1 unité ADEPTA SORORITAS JUMP PACK de votre armée non engagée.",
          "Retirez-la du champ de bataille et placez-la en Réserves Stratégiques."),
        strat("eclat-aveuglant", "Éclat Aveuglant", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité ADEPTA SORORITAS INFANTRY de votre armée choisie pour cible d'une ou plusieurs de ces attaques, ou 1 unité ADEPTA SORORITAS JUMP PACK amie à 3\" ou moins d'une telle unité.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche. Si vous avez choisi une unité JUMP PACK, jusqu'à la fin de la phase, chaque fois qu'une attaque cible une unité ADEPTA SORORITAS INFANTRY amie à 3\" ou moins d'elle, soustrayez 1 au jet de touche."),
        strat("foi-et-furie", "Foi et Furie", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, ses armes de mêlée ont [LANCE]. Si elle détruit une ou plusieurs figurines ennemies, vous gagnez 1 dé de Miracle."),
        strat("guidage-divin", "Guidage Divin", 1, TDB, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses armes. Si elle détruit une ou plusieurs figurines ennemies, vous gagnez 1 dé de Miracle."),
        strat("lumiere-de-l-empereur", "Lumière de l'Empereur", 2, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité ADEPTA SORORITAS de votre armée.",
          "Jusqu'à la fin du tour, elle peut ignorer tout ou partie des modificateurs à sa CC et à sa CT, et à ses jets et tests (sauf les jets de sauvegarde). Si c'est une unité JUMP PACK, elle a à la place une aura de 3\" qui donne cet effet aux unités ADEPTA SORORITAS amies.")
      ]
    },

    /* -------------------------------------------------------
       PORTEUSES DE LA FLAMME (Bringers of Flame)
       ------------------------------------------------------- */
    {
      id: "porteuses-de-la-flamme", name: "Porteuses de la Flamme", nameEn: "Bringers of Flame",
      cost: 2, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "Les armes de tir des unités ADEPTA SORORITAS de votre armée ont [ASSAUT]. Chaque fois qu'une de ces armes cible une unité à 6\" ou moins, ajoutez 1 à la Force de l'attaque."
      ] },
      enhancements: [
        opt("feu-et-fureur", "Feu et Fureur", 30),
        opt("surplis-de-fer-de-sainte-istalela", "Surplis de Fer de Sainte Istalela", 10),
        opt("manuel-de-sainte-griselda", "Manuel de Sainte Griselda", 20),
        opt("rage-vertueuse", "Rage Vertueuse", 15)
      ],
      stratagems: [
        strat("bouclier-d-aversion", "Bouclier d'Aversion", 1, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité ADEPTA SORORITAS de votre armée.",
          "Cette unité ADEPTA SORORITAS.",
          "Jusqu'à ce que l'unité attaquante ait fini ses attaques, aggravez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité."),
        strat("coups-justes", "Coups Justes", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, ses armes de mêlée ont [TOUCHES FATALES]. Si elle détruit une ou plusieurs figurines, l'unité ennemie ciblée doit faire un test d'Ébranlement."),
        strat("emmener-les-fideles", "Emmener les Fidèles", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité ADEPTA SORORITAS de votre armée embarquée dans un TRANSPORT qui a Avancé à cette phase.",
          "Elle peut débarquer de ce TRANSPORT bien qu'il ait Avancé."),
        strat("flammes-purificatrices", "Flammes Purificatrices", 2, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, ses armes [TORRENT] ont [BLESSURES DÉVASTATRICES]."),
        strat("ire-enflammee", "Ire Enflammée", 2, TDB, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a fini de tirer sur un TRANSPORT ADEPTA SORORITAS de votre armée.",
          "1 unité ADEPTA SORORITAS embarquée dans ce TRANSPORT.",
          "Elle peut débarquer comme si c'était votre phase de Mouvement, puis tirer comme si c'était votre phase de Tir, mais doit cibler uniquement l'unité ennemie attaquante, et seulement si c'est une cible éligible."),
        strat("rites-du-feu", "Rites du Feu", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité ADEPTA SORORITAS de votre armée qui a débarqué d'un TRANSPORT à ce tour et pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une cible à 6\" ou moins et à portée d'un pion objectif, ajoutez 1 au jet de blessure. Si une ou plusieurs figurines de l'unité ciblée sont détruites par ces attaques, elle doit faire un test d'Ébranlement.")
      ]
    },

    /* -------------------------------------------------------
       CHAMPIONNES DE LA FOI (Champions of Faith)
       Unique : Révérend — exclusif avec Championnes Sacrées
       ------------------------------------------------------- */
    {
      id: "championnes-de-la-foi", name: "Championnes de la Foi", nameEn: "Champions of Faith",
      cost: 2, dispositions: ["disruption"],
      exclusiveGroup: "révérend",
      rule: { name: "Justes", text: [
        "À votre phase de Commandement, vous pouvez choisir jusqu'à 3 unités ADEPTA SORORITAS de votre armée (y compris celles embarquées dans des TRANSPORTS). Jusqu'au début de votre prochaine phase de Commandement, ces unités sont Justes.",
        "Tant qu'une unité est Juste :",
        "• ajoutez 1\" à la caractéristique de Mouvement de ses figurines ;",
        "• améliorez de 1 la caractéristique de Commandement de ses figurines ;",
        "• si c'est une unité BATTLE SISTERS SQUAD, CELESTIAN INSIDIANTS, CELESTIAN SACRESANTS ou PARAGON WARSUITS, améliorez de 1 la CC et la CT de ses armes.",
        "Tant qu'une unité CELESTIAN SACRESANTS n'est pas Ébranlée, ajoutez 1 au Contrôle d'Objectif de ses figurines.",
        REVEREND
      ] },
      enhancements: [
        opt("yeux-de-l-oracle", "Yeux de l'Oracle", 10),
        opt("marque-de-la-devotion", "Marque de la Dévotion", 30),
        opt("amulette-sanctifiee", "Amulette Sanctifiée", 25),
        opt("triptyque-du-jugement", "Triptyque du Jugement", 15)
      ],
      stratagems: [
        strat("au-coeur-de-l-heresie", "Au Cœur de l'Hérésie", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin du tour, ajoutez 1 à la Force de ses armes de mêlée. Si elle est Juste, jusqu'à la fin de la phase, améliorez aussi de 1 la Pénétration d'Armure de ses armes de mêlée."),
        strat("bastion-de-foi", "Bastion de Foi", 1, TDB, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité CELESTIAN SACRESANTS de votre armée.",
          "Cette unité CELESTIAN SACRESANTS.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche. Si elle est Juste, choisissez aussi 1 autre unité CELESTIAN SACRESANTS de votre armée non Ébranlée et à 6\" ou moins d'elle : jusqu'à la fin de la phase, chaque fois qu'une attaque cible cette autre unité, soustrayez 1 au jet de touche."),
        strat("bouclier-du-deni", "Bouclier du Déni", 1, TDB, [M.tout],
          "N'importe quelle phase, juste après qu'une blessure mortelle a été attribuée à une unité ADEPTA SORORITAS de votre armée.",
          "Cette unité ADEPTA SORORITAS.",
          "Jusqu'à la fin de la phase, ses figurines ont Insensibilité à la Douleur 6+ contre les blessures mortelles (5+ à la place si elle est Juste)."),
        strat("devouement-infatigable", "Dévouement Infatigable", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité ADEPTA SORORITAS de votre armée a Battu en Retraite.",
          "Cette unité ADEPTA SORORITAS.",
          "Jusqu'à la fin du tour, elle est éligible pour tirer à un tour où elle a Battu en Retraite. Si elle est Juste, elle est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite."),
        strat("la-voie-des-vertueux", "La Voie des Vertueux", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin du tour, chaque fois qu'une de ses figurines fait un mouvement d'Engagement ou de Consolidation, elle peut se déplacer de 6\" au lieu de 3\". Si elle est Juste, elle n'a pas besoin de finir ce mouvement plus près de la figurine ennemie la plus proche, à condition de le finir aussi près que possible de l'unité ennemie la plus proche."),
        strat("ne-tolerez-pas-l-infidele", "Ne Tolérez pas l'Infidèle", 1, null, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité ADEPTA SORORITAS Juste de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, ses armes ont au choix [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1].")
      ]
    },

    /* -------------------------------------------------------
       CHŒUR DE CONDAMNATION (Chorus of Condemnation)
       ------------------------------------------------------- */
    {
      id: "choeur-de-condamnation", name: "Chœur de Condamnation", nameEn: "Chorus of Condemnation",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: "Psaumes Condamnatoires", text: [
        "Les unités ADEPTA SORORITAS INFANTRY FLY de votre armée ont l'aptitude suivante :",
        "__Psaumes Condamnatoires__ : à votre phase de Tir, cette unité peut choisir 1 unité ennemie visible et à 12\" ou moins. Cette unité ennemie est Condamnée. Tant qu'une unité est Condamnée, elle a +3\" en portée de détection."
      ] },
      enhancements: [
        opt("clairon-de-l-urgence", "Clairon de l'Urgence", 15),
        amelio("charge-symphonique", "Charge Symphonique", 10)
      ],
      stratagems: [
        strat("cantiques-martiaux-galvanisants", "Cantiques Martiaux Galvanisants", 1, null, [M.vousCmd],
          "Début de votre phase de Commandement.",
          "1 unité ADEPTA SORORITAS INFANTRY FLY ou 1 unité EXORCIST de votre armée.",
          "Choisissez 1 unité ADEPTA SORORITAS amie Ébranlée et à 6\" ou moins de votre unité : elle n'est plus Ébranlée."),
        strat("exorcisme-harmonise", "Exorcisme Harmonisé", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité EXORCIST de votre armée est choisie pour tirer.",
          "Cette unité EXORCIST.",
          "Choisissez 1 unité ennemie visible et à 9\" ou moins d'une unité ADEPTA SORORITAS INFANTRY FLY amie. Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité fait une attaque de tir qui cible cette unité ennemie, ajoutez 1 au jet de touche."),
        strat("reprise-devastatrice", "Reprise Dévastatrice", 1, null, [M.vousTir],
          "Votre phase de Tir, juste après qu'une unité EXORCIST de votre armée a tiré.",
          "1 unité ADEPTA SORORITAS INFANTRY FLY de votre armée.",
          "Choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) touchée par ces attaques. Jusqu'à la fin de la phase, les attaques de tir de votre unité qui ciblent cette unité ennemie ont [BLESSURES DÉVASTATRICES].")
      ]
    },

    /* -------------------------------------------------------
       MARTYRS SACRÉS (Hallowed Martyrs)
       « Martyrs Sanctifiés » sur la fiche des stratagèmes
       ------------------------------------------------------- */
    {
      id: "martyrs-sacres", name: "Martyrs Sacrés", nameEn: "Hallowed Martyrs",
      cost: 3, dispositions: ["take-and-hold", "priority-assets"],
      rule: { name: null, text: [
        "Chaque fois qu'une figurine ADEPTA SORORITAS de votre armée attaque, ajoutez 1 au jet de touche si son unité est en dessous de son Effectif Initial ; ajoutez aussi 1 au jet de blessure si son unité est en dessous de la moitié de son effectif."
      ] },
      enhancements: [
        opt("chapelet-de-sacrifice", "Chapelet de Sacrifice", 25),
        opt("manteau-d-ophelia", "Manteau d'Ophelia", 20),
        opt("exemple-de-saintete", "Exemple de Sainteté", 10),
        opt("la-force-par-la-souffrance", "La Force par la Souffrance", 25)
      ],
      stratagems: [
        strat("celebrez-les-morts", "Célébrez les Morts", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a résolu ses attaques.",
          "1 unité ADEPTA SORORITAS de votre armée dont une ou plusieurs figurines ont été détruites par ces attaques.",
          "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement l'unité ennemie attaquante, et seulement si c'est une cible éligible."),
        strat("esprit-du-martyr", "Esprit du Martyr", 2, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité ADEPTA SORORITAS de votre armée.",
          "Cette unité ADEPTA SORORITAS.",
          "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite, si elle n'a pas encore combattu à cette phase, ne la retirez pas tout de suite. Elle peut combattre après que l'unité attaquante a fini ses attaques, puis elle est retirée."),
        strat("immolation-sanctifiee", "Immolation Sanctifiée", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité ADEPTA SORORITAS VEHICLE de votre armée qui a l'aptitude Destruction Néfaste a été détruite.",
          "Cette unité VEHICLE.",
          "Ne lancez pas de dé pour Destruction Néfaste : le véhicule explose automatiquement."),
        strat("lumiere-de-l-empereur-index", "Lumière de l'Empereur (Index)", 1, TDB, [M.vousCmd, M.advCmd],
          "Phase de Commandement.",
          "1 unité ADEPTA SORORITAS de votre armée en dessous de son Effectif Initial.",
          "Jusqu'à la fin du tour, elle peut ignorer tout ou partie des modificateurs à ses caractéristiques et à ses jets et tests (sauf les jets de sauvegarde)."),
        strat("intervention-divine", "Intervention Divine", 1, null, [M.tout],
          "N'importe quelle phase.",
          "1 figurine ADEPTA SORORITAS CHARACTER de votre armée qui vient d'être détruite (sauf SAINT CELESTINE, ou un personnage déjà ressuscité).",
          "Vous pouvez défausser de 1 à 3 dés de Miracle. À la fin de la phase, replacez cette figurine sur le champ de bataille, non engagée et aussi près que possible de l'endroit où elle a été détruite. Elle ne fait plus partie d'une unité attachée et son unité a un Effectif Initial de 1. Lancez 1D3, en ajoutant 1 au résultat pour chaque dé de Miracle défaussé : elle revient avec autant de PV (son nombre de PV initial au maximum)."),
        strat("juste-vengeance", "Juste Vengeance", 1, null, [M.combat],
          "Phase de Combat.",
          "1 unité ADEPTA SORORITAS de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, vous pouvez relancer les jets de touche de ses attaques de mêlée ; si elle est en dessous de la moitié de son effectif, vous pouvez aussi relancer les jets de blessure."),
        strat("souffrance-et-sacrifice", "Souffrance & Sacrifice", 1, null, [M.combat],
          "Début de la phase de Combat.",
          "1 unité ADEPTA SORORITAS INFANTRY ou WALKER de votre armée.",
          "Jusqu'à la fin de la phase, chaque fois qu'une figurine ennemie à portée d'engagement de votre unité choisit ses cibles, elle doit choisir votre unité pour cible de ses attaques.")
      ]
    },

    /* -------------------------------------------------------
       OST PÉNITENT (Penitent Host)
       ------------------------------------------------------- */
    {
      id: "ost-penitent", name: "Ost Pénitent", nameEn: "Penitent Host",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: "Serments", text: [
        "Au début de votre phase de Commandement, choisissez 1 des serments suivants ; il s'applique jusqu'au début de votre prochaine phase de Commandement. Chaque serment ne peut être choisi qu'une fois par bataille.",
        "• Ajoutez 3\" à la caractéristique de Mouvement des figurines PENITENT de votre armée.",
        "• À un tour où leur unité a chargé, ajoutez 1 à la caractéristique d'Attaques et à la Force des armes de mêlée des figurines PENITENT de votre armée.",
        "• Chaque fois qu'une figurine PENITENT de votre armée est détruite par une attaque de mêlée avant d'avoir combattu, lancez 1D6 : sur 2+, elle peut combattre avant d'être retirée."
      ] },
      enhancements: [
        opt("catechisme-de-penitence-divine", "Catéchisme de Pénitence Divine", 15),
        repentia("psaume-de-sentence-legitime", "Psaume de Sentence Légitime", 20),
        repentia("refrain-de-foi-perenne", "Refrain de Foi Pérenne", 15),
        repentia("verset-de-sainte-piete", "Verset de Sainte Piété", 15)
      ],
      stratagems: [
        strat("fanatisme-devot", "Fanatisme Dévot", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a fini de tirer sur une unité PENITENT de votre armée.",
          "Cette unité PENITENT.",
          "Elle peut faire un mouvement d'élan de D6\" maximum."),
        strat("fouet-de-culpabilite", "Fouet de Culpabilité", 1, null, [M.vousMvt],
          "Votre phase de Mouvement.",
          "1 unité PENITENT de votre armée pas encore choisie pour se déplacer à cette phase.",
          "Si elle Avance, ne lancez pas de dé : elle avance de 6\". Jusqu'à la fin du tour, elle est éligible pour déclarer une charge à un tour où elle a Avancé."),
        strat("passion-du-penitent", "Passion du Pénitent", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité PENITENT de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, un jet de touche non modifié de 5+ est une Touche Critique."),
        strat("purete-de-la-souffrance", "Pureté de la Souffrance", 1, null, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi pour cible une unité PENITENT de votre armée.",
          "Cette unité PENITENT.",
          "Jusqu'à la fin de la phase, ses figurines ont Insensibilité à la Douleur 4+."),
        strat("redemption-finale", "Rédemption Finale", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité PENITENT de votre armée a été détruite à portée d'un pion objectif que vous contrôlez.",
          "Ce pion objectif.",
          "Il reste sous votre contrôle jusqu'à ce que votre adversaire en prenne le contrôle au début ou à la fin d'un tour."),
        strat("zele-sans-limite", "Zèle sans Limite", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, juste après qu'une unité ADEPTA SORORITAS de votre armée a Battu en Retraite.",
          "Cette unité ADEPTA SORORITAS.",
          "Jusqu'à la fin du tour, elle est éligible pour tirer OU déclarer une charge à un tour où elle a Battu en Retraite (les deux si c'est une unité PENITENT).")
      ]
    },

    /* -------------------------------------------------------
       CHAMPIONNES SACRÉES (Sacred Champions)
       Unique : Révérend — exclusif avec Championnes de la Foi
       ------------------------------------------------------- */
    {
      id: "championnes-sacrees", name: "Championnes Sacrées", nameEn: "Sacred Champions",
      cost: 1, dispositions: ["take-and-hold"],
      exclusiveGroup: "révérend",
      rule: { name: null, text: [
        "Améliorez de 1 la CT et la CC des attaques des unités CELESTIAN SACRESANTS de votre armée.",
        REVEREND
      ] },
      enhancements: [
        opt("precipitation-fervente", "Précipitation Fervente", 10),
        amelio("ordonnance-de-componction", "Ordonnance de Componction", 20)
      ],
      stratagems: [
        strat("coups-sanctifies", "Coups Sanctifiés", 1, null, [M.combat],
          "Phase de Combat, quand une unité CELESTIAN SACRESANTS de votre armée est choisie pour combattre.",
          "Cette unité CELESTIAN SACRESANTS.",
          "Jusqu'à la fin de la phase, ajoutez 1 à la caractéristique d'Attaques et à la Force des armes de mêlée de ses figurines."),
        strat("determination-inflexible", "Détermination Inflexible", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité CELESTIAN SACRESANTS de votre armée est choisie pour Avancer ou Battre en Retraite.",
          "Cette unité CELESTIAN SACRESANTS.",
          "Jusqu'à la fin du tour, ses armes de tir ont [ASSAUT], et ce mouvement ne l'empêche pas d'être éligible pour tirer et déclarer une charge."),
        strat("force-d-ame-des-fideles", "Force d'Âme des Fidèles", 1, null, [M.tout],
          "N'importe quelle phase, quand une unité CELESTIAN SACRESANTS de votre armée subit une blessure mortelle.",
          "Cette unité CELESTIAN SACRESANTS.",
          "Jusqu'à la fin de la phase, ses figurines ont Insensibilité à la Douleur 5+ contre les blessures mortelles.")
      ]
    },

    /* -------------------------------------------------------
       ORATEURS SANCTIFIÉS (Sanctified Orators)
       Pas de stratagème
       ------------------------------------------------------- */
    {
      id: "orateurs-sanctifies", name: "Orateurs Sanctifiés", nameEn: "Sanctified Orators",
      cost: 1, dispositions: ["disruption"],
      rule: { name: null, text: [
        "• Les optimisations prises dans ce détachement ne comptent pas dans le nombre total d'optimisations de votre armée.",
        "• Améliorez de 1 la caractéristique de Commandement des figurines ADEPTA SORORITAS CHARACTER de votre armée.",
        "Ce détachement n'a pas de stratagème."
      ] },
      enhancements: [
        amelio("hagiomnifex", "Hagiomnifex", 25)
      ],
      stratagems: []
    }
  ]
});

})();
