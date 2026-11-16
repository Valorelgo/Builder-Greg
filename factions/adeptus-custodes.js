/* =========================================================
   ADEPTUS CUSTODES — armée « règles seules » (sans unités)
   Consultable avant et pendant une partie (voir js/armees.js).
   Détachements, optimisations et stratagèmes en français.

   ÉTAT
   - 2 règles d'armée, traduites depuis l'anglais :
     Égide de l'Empereur (Aegis of the Emperor) et Ka'tah Martial
     (Martial Ka'tah), avec ses 6 aptitudes de ka'tah et la règle
     du Ka'tah favori. Termes alignés sur les fiches françaises :
     « readied » = « préparée », « Favoured Ka'tah » = « Ka'tah favori ».
   - 13 détachements : règles, Ka'tah favoris et stratagèmes (41)
     saisis d'après les fiches françaises fournies. Noms anglais des
     détachements repris des fiches.
   - Champions Auriques : 2 stratagèmes seulement sur la fiche.
   - À SAISIR : textes des optimisations (noms et points déjà saisis).
   - Unique : Ost-Rempart — Bouclier Aquilin, Ost Effroyable,
     Émissaires Imperatus, Élus de l'Empereur, Gardiens des Ombres,
     Garde Solaire (exclusiveGroup).
   - Optimisations notées « (Amélioration) » : kind "amelioration".
     « (un par armée) » : repris dans le texte. Restrictions
     (requires) à préciser avec les textes (Veille de Dames du Néant :
     probablement ANATHEMA PSYKANA).

   Unités citées : mots-clés anglais (comme les autres factions).
     Personnage = CHARACTER ; Infanterie = INFANTRY ; Monté = MOUNTED
     Monstre = MONSTER ; Véhicule = VEHICLE ; Marcheur = WALKER
     Aérodyne = AIRCRAFT ; Veilleurs Custodiens = CUSTODIAN WARDENS
     Escouade Prosecutor = PROSECUTORS ; Escouade Vigilator = VIGILATORS
     Escouade de Répurgatrices = WITCHSEEKERS
     Mots-clés anglais à confirmer, gardés en français :
     ANTIGRAV D'ASSAUT (Force d'Assaut Antigrav) et SENTINELLES DE
     CONFIANCE (Honorés Compagnons, Gardiens du Trône).
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation", extra = {}) => ({
  id, name, cost, kind,
  requires: [["Adeptus Custodes"]],
  text: A_SAISIR,
  ...extra
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");
const unParArmee = (id, name, cost) => opt(id, name, cost, "amelioration", { text: "Une seule par armée. " + A_SAISIR });

// Moments des stratagèmes (vus du joueur Custodes)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  vousCharge: { tour: "vous", phase: "charge" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCharge:  { tour: "adversaire", phase: "charge" },
  advCombat:  { tour: "adversaire", phase: "combat" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, moments, quand, cible, effet) =>
  ({ id, name, cp, type: null, moments, quand, cible, effet });

const OST_REMPART = "Ce détachement a l'étiquette OST-REMPART : il ne peut pas être pris avec un autre détachement OST-REMPART.";
const favori = (katahName, effet) => `__Ka'tah favori : ${katahName}__ — effet supplémentaire : ${effet}`;

// Aptitude de ka'tah (règle d'armée)
const katah = (id, name, quand, cible, effet) => ({
  id: "katah-" + id, name: `Ka'tah : ${name}`, nameEn: name,
  text: [`__Quand__ : ${quand}`, `__Cible__ : ${cible}`, ...[].concat(effet)]
});

// Stratagèmes communs à plusieurs détachements
const bardesDAuramite = (suffix = "") => strat("bardes-d-auramite" + suffix, "Bardés d'Auramite", 1, [M.advTir, M.combat],
  "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS CUSTODES de votre armée (sauf CUSTODIAN WARDENS).",
  "Cette unité ADEPTUS CUSTODES.",
  "Jusqu'à ce que l'unité ennemie ait fini ses attaques, aggravez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité.");
const concentrationSurhumaine = (suffix = "") => strat("concentration-surhumaine" + suffix, "Concentration Surhumaine", 1, [M.tout],
  "Fin de n'importe quelle phase.",
  "1 unité ADEPTUS CUSTODES de votre armée qui n'est pas préparée.",
  "Votre unité est préparée. Restriction : vous ne pouvez pas choisir la même unité pour cible de ce stratagème plus d'une fois par round de bataille.");
const vifCommeLAigle = (suffix = "") => strat("vif-comme-l-aigle" + suffix, "Vif comme l'Aigle", 1, [M.advMvt],
  "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité SENTINELLES DE CONFIANCE non engagée de votre armée.",
  "Cette unité SENTINELLES DE CONFIANCE.",
  "Elle peut faire un Mouvement Normal de D3+3\" maximum.");

Factions.register({
  id: "adeptus-custodes",
  name: "Adeptus Custodes",
  keyword: "Adeptus Custodes",

  armyRules: [
    {
      id: "egide-de-l-empereur",
      name: "Égide de l'Empereur",
      nameEn: "Aegis of the Emperor",
      text: [
        "Les unités ADEPTUS CUSTODES amies qui ont cette aptitude ont Insensibilité à la Douleur 5+ contre les blessures mortelles."
      ]
    },
    {
      id: "katah-martial",
      name: "Ka'tah Martial",
      nameEn: "Martial Ka'tah",
      text: [
        "Au début de votre phase de Commandement, les unités ADEPTUS CUSTODES amies qui ont cette aptitude sont __préparées__. Tant qu'une unité amie est préparée, vous pouvez choisir une des aptitudes de ka'tah ci-dessous pour cette unité. Dans ce cas, l'unité n'est plus préparée.",
        "Chaque aptitude de ka'tah indique quand elle peut être utilisée et ses effets sur l'unité qui l'utilise.",
        "Conseil : placez un pion à côté de chaque unité préparée, et retirez-le quand elle ne l'est plus.",
        "__Ka'tah favori__ : tous les détachements qui ont l'étiquette « Unique : Ost-Rempart » indiquent un Ka'tah favori. Si vous avez choisi un de ces détachements, l'aptitude de ka'tah qui est le Ka'tah favori de ce détachement donne en plus l'effet supplémentaire indiqué dans ce détachement.",
        "__Exemple__ : si vous avez choisi le détachement Garde Solaire, quand vous choisissez l'aptitude de ka'tah Calistus pour une unité préparée, cette unité a +2\" en Mouvement en plus de l'effet normal de Calistus."
      ]
    },
    katah("conservai", "Conservai",
      "votre phase de Commandement.",
      "1 unité préparée amie.",
      ["__Effet__ : jusqu'à la fin du tour :",
       "• être engagée ou Ébranlée n'empêche pas votre unité d'être éligible pour commencer une action ;",
       "• commencer une action n'empêche pas votre unité d'être éligible pour tirer."]),
    katah("dacatarai", "Dacatarai",
      "début de la phase de Combat.",
      "1 unité préparée amie.",
      "__Effet__ : les attaques de mêlée de votre unité qui ciblent une unité ennemie (sauf MONSTER et VEHICLE) peuvent relancer les jets de touche de 1."),
    katah("kaptaris", "Kaptaris",
      "début de la phase de Combat.",
      "1 unité préparée amie.",
      "__Effet__ : les attaques de mêlée qui ciblent votre unité ont -1 au jet de touche."),
    katah("calistus", "Calistus",
      "votre phase de Mouvement, quand une unité préparée amie est choisie pour se déplacer.",
      "Cette unité préparée.",
      "__Effet__ : quand votre unité fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser tous les types de figurines."),
    katah("rendax", "Rendax",
      "phase de Combat, quand une unité préparée amie est choisie pour combattre.",
      "1 unité préparée amie.",
      "__Effet__ : les attaques de mêlée de votre unité ont [TOUCHES FATALES : MONSTER/VEHICLE]."),
    katah("salvus", "Salvus",
      "votre phase de Tir, quand une unité préparée amie est choisie pour tirer.",
      "Cette unité préparée.",
      ["__Effet__ : votre unité peut ignorer les modificateurs :",
       "• à sa CT ;",
       "• à ses jets de touche et de blessure."])
  ],

  detachments: [

    /* -------------------------------------------------------
       BOUCLIER AQUILIN (Aquilan Shield) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "bouclier-aquilin", name: "Bouclier Aquilin", nameEn: "Aquilan Shield",
      cost: 1, dispositions: ["take-and-hold"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Tant qu'une unité ADEPTUS CUSTODES amie (sauf MONSTER et VEHICLE) est à portée d'un objectif, chaque fois qu'une attaque de tir la cible, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure.",
        favori("Salvus", "les attaques de tir de votre unité ont +6\" de portée."),
        OST_REMPART
      ] },
      enhancements: [
        opt("pas-une-balle-de-perdue", "Pas une Balle de Perdue", 10),
        opt("caducatrix-de-pareldor", "Caducatrix de Pareldor", 30)
      ],
      stratagems: [
        strat("la-pointe-de-la-serre", "La Pointe de la Serre", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour tirer.",
          "Cette unité ADEPTUS CUSTODES.",
          "Les attaques de tir de votre unité qui ciblent une unité ennemie à 9\" ou moins de votre unité ont +1 en Force."),
        strat("manoeuvre-et-tir", "Manœuvre et Tir", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour Battre en Retraite.",
          "Cette unité ADEPTUS CUSTODES.",
          "Ce mouvement ne l'empêche pas d'être éligible pour tirer ou déclarer une charge."),
        strat("reactions-rapides", "Réactions Rapides", 1, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit une Retraite.",
          "1 unité ADEPTUS CUSTODES INFANTRY de votre armée qui était engagée avec cette unité ennemie au début de la phase.",
          "Votre unité tire normalement, mais ne peut cibler que cette unité ennemie.")
      ]
    },

    /* -------------------------------------------------------
       CHAMPIONS AURIQUES (Auric Champions)
       2 stratagèmes seulement sur la fiche
       ------------------------------------------------------- */
    {
      id: "champions-auriques", name: "Champions Auriques", nameEn: "Auric Champions",
      cost: 1, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "À votre phase de Commandement, vous pouvez choisir 1 unité ennemie comme __ennemi effroyable__. Les attaques des figurines ADEPTUS CUSTODES CHARACTER amies qui ciblent l'unité ennemi effroyable ont +1 au jet de blessure."
      ] },
      enhancements: [
        opt("exemple-galvanisant", "Exemple Galvanisant", 10),
        opt("suaire-de-la-lame-cachee", "Suaire de la Lame Cachée", 20),
        opt("creation-superieure", "Création Supérieure", 30)
      ],
      stratagems: [
        strat("champion-dore", "Champion Doré", 1, [M.tout],
          "N'importe quelle phase, quand une figurine ADEPTUS CUSTODES CHARACTER de votre armée a utilisé une aptitude de sa fiche marquée « une fois par bataille, par unité ».",
          "Cette figurine ADEPTUS CUSTODES CHARACTER.",
          "Elle peut utiliser cette aptitude une fois de plus, mais pas à la même phase. Restriction : vous ne pouvez pas utiliser ce stratagème sur la même figurine plus d'une fois par bataille."),
        strat("le-devoir-jusqu-a-la-mort", "Le Devoir jusqu'à la Mort", 1, [M.combat],
          "Phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS CUSTODES de votre armée.",
          "Cette unité ADEPTUS CUSTODES.",
          "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+1 si c'est une figurine CHARACTER) : sur 3+, ne la retirez pas. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (selon ce qui arrive en premier).")
      ]
    },

    /* -------------------------------------------------------
       OST EFFROYABLE (Dread Host) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "ost-effroyable", name: "Ost Effroyable", nameEn: "Dread Host",
      cost: 1, dispositions: ["purge-the-foe"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Les unités ADEPTUS CUSTODES amies peuvent relancer leurs jets de Charge.",
        favori("Dacatarai", "quand une unité ennemie engagée avec votre unité fait un mouvement d'Engagement ou de Consolidation, elle a -2\" pour ce mouvement."),
        OST_REMPART
      ] },
      enhancements: [
        opt("parangon-aurique", "Parangon Aurique", 15),
        opt("bretteur-sans-faille", "Bretteur Sans Faille", 15)
      ],
      stratagems: [
        strat("colere-foudroyante", "Colère Foudroyante", 1, [M.combat],
          "Phase de Combat, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour faire un mouvement d'Engagement.",
          "Cette unité ADEPTUS CUSTODES.",
          "Pour ce mouvement d'Engagement, votre unité peut se déplacer de D3+3\" maximum."),
        strat("lueur-doree-des-moiraides", "Lueur Dorée des Moiraïdes", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour faire un mouvement d'arrivée.",
          "Cette unité ADEPTUS CUSTODES.",
          "Jusqu'au début de votre prochain tour, les attaques qui ciblent votre unité ont -1 au jet de touche, et les unités ennemies ne peuvent pas la cibler avec des tirs en état d'alerte (Tir au Jugé)."),
        strat("rapidite-extraordinaire", "Rapidité Extraordinaire", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée finit une Avance.",
          "Cette unité ADEPTUS CUSTODES.",
          "Cette Avance ne l'empêche pas d'être éligible pour déclarer une charge.")
      ]
    },

    /* -------------------------------------------------------
       ÉMISSAIRES IMPERATUS (Emissaries Imperatus) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "emissaires-imperatus", name: "Émissaires Imperatus", nameEn: "Emissaries Imperatus",
      cost: 1, dispositions: ["priority-assets"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Les unités ADEPTUS CUSTODES amies ont Combat en Premier.",
        favori("Conservai", "jusqu'à la fin du tour, être choisie pour faire une Avance ou une Retraite n'empêche pas votre unité d'être éligible pour commencer une action."),
        OST_REMPART
      ] },
      enhancements: [
        opt("orbe-aurifere", "Orbe Aurifère", 20),
        opt("le-fil-de-la-lame", "Le Fil de la Lame", 15)
      ],
      stratagems: [
        strat("devoir-altruiste", "Devoir Altruiste", 1, [M.advCharge],
          "Fin de la phase de Charge adverse.",
          "1 unité ADEPTUS CUSTODES de votre armée non engagée et à 6\" ou moins d'une unité ennemie (une unité VEHICLE seulement si c'est une unité CHARACTER ou WALKER).",
          "Votre unité déclare une charge. Si le jet de Charge est supérieur à 6 (après modificateurs), remplacez-le par 6. Vous pouvez choisir pour cibles de la charge n'importe quelles unités ennemies à 6\" ou moins de votre unité et à distance de charge ou moins."),
        strat("porteurs-de-sa-lumiere", "Porteurs de Sa Lumière", 1, [M.combat],
          "Phase de Combat, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour combattre.",
          "Cette unité ADEPTUS CUSTODES.",
          "Les attaques de mêlée de votre unité peuvent ignorer les modificateurs aux jets de touche et aux jets de blessure."),
        strat("tueurs-de-cauchemars", "Tueurs de Cauchemars", 1, [M.combat],
          "Phase de Combat, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour combattre.",
          "Cette unité ADEPTUS CUSTODES.",
          "Les attaques de mêlée de votre unité qui ciblent une unité dont l'Endurance est supérieure à celle de votre unité ont +1 au jet de blessure.")
      ]
    },

    /* -------------------------------------------------------
       ÉLUS DE L'EMPEREUR (Emperor's Chosen) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "elus-de-l-empereur", name: "Élus de l'Empereur", nameEn: "Emperor's Chosen",
      cost: 1, dispositions: ["priority-assets"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Quand une unité ADEPTUS CUSTODES amie est choisie pour attaquer, ses attaques peuvent relancer un jet de touche et relancer un jet de blessure.",
        favori("Rendax", "vous pouvez choisir 1 unité ennemie MONSTER ou VEHICLE engagée avec votre unité et lancer 1D6 : sur 1-2, elle subit 1 blessure mortelle ; sur 3-5, elle subit D3 blessures mortelles ; sur 6, elle subit 3 blessures mortelles."),
        OST_REMPART
      ] },
      enhancements: [
        opt("issu-du-hall-des-armureries", "Issu du Hall des Armureries", 15),
        opt("manteau-radieux", "Manteau Radieux", 40)
      ],
      stratagems: [
        bardesDAuramite(),
        strat("bastion-impenetrable", "Bastion Impénétrable", 1, [M.vousMvt],
          "Fin de votre phase de Mouvement.",
          "1 unité ADEPTUS CUSTODES de votre armée (sauf MONSTER et VEHICLE).",
          "Choisissez un objectif que votre unité contrôle : il est sécurisé."),
        concentrationSurhumaine()
      ]
    },

    /* -------------------------------------------------------
       FORCE D'ASSAUT ANTIGRAV (Grav-assault Force)
       Mot-clé ANTIGRAV D'ASSAUT : nom anglais à confirmer
       ------------------------------------------------------- */
    {
      id: "force-d-assaut-antigrav", name: "Force d'Assaut Antigrav", nameEn: "Grav-assault Force",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: null, text: [
        "Les unités ANTIGRAV D'ASSAUT amies ont une sauvegarde invulnérable de 4+ contre les attaques de tir."
      ] },
      enhancements: [
        amelio("mobilite-antigravitique", "Mobilité Antigravitique", 15),
        amelio("deploiement-de-combat", "Déploiement de Combat", 20)
      ],
      stratagems: [
        strat("aneantissement-inevitable", "Anéantissement Inévitable", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ANTIGRAV D'ASSAUT de votre armée est choisie pour tirer.",
          "Cette unité ANTIGRAV D'ASSAUT.",
          "Votre unité peut ignorer les modificateurs à sa CT et à ses jets de touche."),
        strat("la-victoire-avant-la-mort", "La Victoire avant la Mort", 1, [M.tout],
          "N'importe quelle phase, quand une unité ANTIGRAV D'ASSAUT de votre armée à portée d'un objectif est détruite.",
          "Cette unité ANTIGRAV D'ASSAUT (elle peut être ciblée même si elle est détruite).",
          "Choisissez un objectif que votre unité contrôlait quand elle a été détruite et à portée duquel ne se trouve aucune unité ennemie (sauf AIRCRAFT) : il est sécurisé."),
        strat("stabilisateurs-avances", "Stabilisateurs Avancés", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ANTIGRAV D'ASSAUT de votre armée est choisie pour tirer.",
          "Cette unité ANTIGRAV D'ASSAUT.",
          "Les attaques de tir de votre unité ont [ASSAUT].")
      ]
    },

    /* -------------------------------------------------------
       GARDIENS DU TRÔNE (Guardians of the Throne) — 3 PDD
       Mot-clé SENTINELLES DE CONFIANCE : nom anglais à confirmer
       ------------------------------------------------------- */
    {
      id: "gardiens-du-trone", name: "Gardiens du Trône", nameEn: "Guardians of the Throne",
      cost: 3, dispositions: ["priority-assets", "purge-the-foe"],
      rule: { name: null, text: [
        "À la phase de Combat, quand une unité ADEPTUS CUSTODES amie est choisie pour combattre, ses attaques de mêlée ont, au choix, [TOUCHES SOUTENUES 1] ou [TOUCHES FATALES]."
      ] },
      enhancements: [
        opt("fleau-des-abominations", "Fléau des Abominations", 20),
        opt("le-sceau-du-castellan", "Le Sceau du Castellan", 25),
        opt("oeil-d-aigle", "Œil d'Aigle", 30),
        opt("lumiere-de-l-empereur", "Lumière de l'Empereur", 15)
      ],
      stratagems: [
        bardesDAuramite("-trone"),
        strat("bouclier-d-honneur", "Bouclier d'Honneur", 1, [M.combat],
          "Début de la phase de Combat.",
          "1 unité ADEPTUS CUSTODES INFANTRY ou MOUNTED de votre armée.",
          "Quand une figurine ennemie engagée avec votre unité choisit ses cibles, si elle ne choisit pas votre unité pour cible de toutes ses attaques, ses attaques ont -1 au jet de touche et -1 au jet de blessure."),
        strat("cible-principale", "Cible Principale", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour tirer.",
          "Cette unité ADEPTUS CUSTODES.",
          "Les attaques de tir de votre unité peuvent relancer un jet de touche, un jet de blessure et un jet de Dégâts."),
        concentrationSurhumaine("-trone"),
        strat("endurance-sans-limite", "Endurance sans Limite", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée finit une Avance.",
          "Cette unité ADEPTUS CUSTODES.",
          "Jusqu'à la fin du tour, les attaques de tir de votre unité ont [ASSAUT], et cette Avance ne l'empêche pas d'être éligible pour déclarer une charge."),
        vifCommeLAigle("-trone")
      ]
    },

    /* -------------------------------------------------------
       HONORÉS COMPAGNONS (Honoured Companions)
       ------------------------------------------------------- */
    {
      id: "honores-compagnons", name: "Honorés Compagnons", nameEn: "Honoured Companions",
      cost: 1, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Tant qu'une unité SENTINELLES DE CONFIANCE amie est à portée d'un objectif, ses attaques peuvent relancer les jets de blessure de 1."
      ] },
      enhancements: [
        opt("hurleur-arae", "Hurleur Arae", 20),
        amelio("prestes-sentinelles", "Prestes Sentinelles", 15)
      ],
      stratagems: [
        strat("domaine-de-l-empereur", "Domaine de l'Empereur", 1, [M.combat],
          "Phase de Combat, quand une unité SENTINELLES DE CONFIANCE de votre armée est choisie pour faire un mouvement de Consolidation.",
          "Cette unité SENTINELLES DE CONFIANCE.",
          "Vous pouvez choisir le mode de Consolidation sur objectif pour ce mouvement, quelles que soient les restrictions « avant de se déplacer ». Votre unité peut donc sortir de portée d'engagement des unités ennemies, tant qu'elle remplit les conditions de ce mode."),
        strat("vengez-les-guerriers-tombes", "Vengez les Guerriers Tombés", 1, [M.combat],
          "Phase de Combat, quand une unité SENTINELLES DE CONFIANCE de votre armée en dessous de son Effectif Initial est choisie pour combattre.",
          "Cette unité SENTINELLES DE CONFIANCE.",
          "Les attaques de mêlée de votre unité (sauf celles des figurines CHARACTER) ont +2 en Attaques."),
        vifCommeLAigle()
      ]
    },

    /* -------------------------------------------------------
       LIONS DE L'EMPEREUR (Lions of the Emperor)
       ------------------------------------------------------- */
    {
      id: "lions-de-l-empereur", name: "Lions de l'Empereur", nameEn: "Lions of the Emperor",
      cost: 1, dispositions: ["disruption"],
      rule: { name: null, text: [
        "À la fin de la phase de Combat adverse, si une unité ADEPTUS CUSTODES TERMINATOR amie n'est pas engagée, vous pouvez la placer en Réserves Stratégiques."
      ] },
      enhancements: [
        opt("ferocite-leonine", "Férocité Léonine", 20),
        opt("descente-fulgurante", "Descente Fulgurante", 20)
      ],
      stratagems: [
        strat("fureur-de-l-empereur", "Fureur de l'Empereur", 1, [M.vousCharge],
          "Votre phase de Charge, quand une unité ADEPTUS CUSTODES TERMINATOR de votre armée qui a fait un mouvement d'arrivée à ce tour est choisie pour déclarer une charge.",
          "Cette unité ADEPTUS CUSTODES TERMINATOR.",
          "Votre unité a +2 aux jets de Charge."),
        strat("lachez-les-lions", "Lâchez les Lions", 1, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité ADEPTUS CUSTODES TERMINATOR de votre armée de 2 figurines ou plus.",
          "Votre unité est scindée en unités séparées d'une figurine chacune. Chacune de ces nouvelles unités a un Effectif Initial de 1."),
        strat("veille-sans-fin", "Veille sans Fin", 2, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS CUSTODES TERMINATOR de votre armée.",
          "Cette unité ADEPTUS CUSTODES TERMINATOR.",
          "Jusqu'à ce que l'unité ennemie ait fini ses attaques, les attaques qui ciblent votre unité ont -1 en Dégâts.")
      ]
    },

    /* -------------------------------------------------------
       PUISSANCE DES MORITOI (Might of the Moritoi)
       ------------------------------------------------------- */
    {
      id: "puissance-des-moritoi", name: "Puissance des Moritoi", nameEn: "Might of the Moritoi",
      cost: 1, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Tant qu'une unité ADEPTUS CUSTODES DREADNOUGHT amie est à son Effectif Initial, elle a +2 en Contrôle d'Objectif.",
        "Tant qu'une unité ADEPTUS CUSTODES DREADNOUGHT amie est en dessous de son Effectif Initial, ses attaques peuvent relancer les jets de touche de 1.",
        "Tant qu'une unité ADEPTUS CUSTODES DREADNOUGHT amie est en dessous de la moitié de son effectif, ses attaques peuvent relancer les jets de touche de 1 et les jets de blessure de 1."
      ] },
      enhancements: [
        unParArmee("augure-en-liaison-montante", "Augure en Liaison Montante", 30),
        unParArmee("memento-moritoi", "Memento Moritoi", 30)
      ],
      stratagems: [
        strat("assaut-incessant", "Assaut Incessant", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES DREADNOUGHT de votre armée finit une Avance.",
          "Cette unité ADEPTUS CUSTODES DREADNOUGHT.",
          "Jusqu'à la fin du tour, les attaques de tir de votre unité ont [ASSAUT]. Cette Avance ne l'empêche pas d'être éligible pour déclarer une charge."),
        strat("elan-irresistible", "Élan Irrésistible", 1, [M.vousMvt, M.vousCharge],
          "Votre phase de Mouvement ou de Charge, quand une unité ADEPTUS CUSTODES DREADNOUGHT de votre armée est choisie pour se déplacer ou déclarer une charge.",
          "Cette unité ADEPTUS CUSTODES DREADNOUGHT.",
          "Votre unité a le mot-clé MOBILE."),
        strat("honore-inhume", "Honoré Inhumé", 1, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat.",
          "1 unité ADEPTUS CUSTODES DREADNOUGHT de votre armée.",
          "Votre unité a l'aptitude suivante : __Honoré Inhumé (Aura)__ : les unités ADEPTUS CUSTODES amies à 6\" ou moins de cette unité peuvent relancer les jets de touche de 1.")
      ]
    },

    /* -------------------------------------------------------
       VEILLE DE DAMES DU NÉANT (Null-maiden Vigil)
       ------------------------------------------------------- */
    {
      id: "veille-de-dames-du-neant", name: "Veille de Dames du Néant", nameEn: "Null-maiden Vigil",
      cost: 1, dispositions: ["disruption"],
      rule: { name: null, text: [
        "Quand vous rassemblez votre armée, vous pouvez choisir une figurine ANATHEMA PSYKANA CHARACTER amie comme SEIGNEUR DE GUERRE.",
        "Les unités PROSECUTORS amies ont le mot-clé BATTLELINE.",
        "Les unités ANATHEMA PSYKANA amies ont l'aptitude suivante :",
        "__Effroi Insidieux (Aura)__ : à l'étape d'Ébranlement de la phase de Commandement adverse, chaque unité ennemie à 12\" ou moins de cette unité qui est PSYKER et/ou en dessous de son Effectif Initial fait un test d'Ébranlement, avec -1 à ce test."
      ] },
      enhancements: [
        opt("oeil-de-la-chasseresse", "Œil de la Chasseresse", 10),
        opt("chevaliere-de-l-oubli", "Chevalière de l'Oubli", 15)
      ],
      stratagems: [
        strat("balayage-et-purge", "Balayage et Purge", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité WITCHSEEKERS de votre armée est choisie pour tirer.",
          "Cette unité WITCHSEEKERS.",
          "Les attaques [TORRENT] de votre unité ont +1 en Attaques ; ou, si elles ciblent une unité PSYKER ou Ébranlée, +2 en Attaques."),
        strat("fines-lames-anathemes", "Fines Lames Anathèmes", 1, [M.combat],
          "Phase de Combat, quand une unité VIGILATORS de votre armée est choisie pour combattre.",
          "Cette unité VIGILATORS.",
          "Les attaques de votre unité ont, au choix, [TOUCHES SOUTENUES 1] ou [TOUCHES FATALES]."),
        strat("salve-anti-psy", "Salve Anti-psy", 1, [M.vousTir],
          "Votre phase de Tir, quand une unité PROSECUTORS de votre armée a tiré.",
          "Cette unité PROSECUTORS.",
          "Choisissez 1 unité ennemie touchée par ces attaques : elle est persécutée jusqu'à la fin du tour. Les attaques qui ciblent une unité persécutée ont la Pénétration d'Armure améliorée de 1.")
      ]
    },

    /* -------------------------------------------------------
       GARDIENS DES OMBRES (Shadowkeepers) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "gardiens-des-ombres", name: "Gardiens des Ombres", nameEn: "Shadowkeepers",
      cost: 1, dispositions: ["purge-the-foe"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Tant qu'une unité ADEPTUS CUSTODES amie (sauf MONSTER et VEHICLE) est à portée d'un objectif, chaque fois qu'une attaque de mêlée la cible, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure.",
        favori("Kaptaris", "vous pouvez choisir 1 unité ennemie engagée avec votre unité : elle doit faire un test d'Ébranlement, avec -1 à ce test. Vous ne pouvez pas choisir la même unité ennemie pour cet effet plus d'une fois par phase."),
        OST_REMPART
      ] },
      enhancements: [
        opt("protection-geno-alchimique", "Protection Géno-alchimique", 30),
        opt("destructeur-irresistible", "Destructeur Irrésistible", 25)
      ],
      stratagems: [
        strat("aucune-issue", "Aucune Issue", 2, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie finit une Retraite.",
          "1 unité ADEPTUS CUSTODES INFANTRY de votre armée non engagée et à 6\" ou moins de cette unité ennemie.",
          "Votre unité déclare une charge. Vous ne pouvez choisir pour cibles de la charge que des unités ennemies qui ont fait une Retraite à cette phase et qui sont à distance de charge ou moins."),
        strat("gardiens-indomptables", "Gardiens Indomptables", 1, [M.advCombat],
          "Phase de Combat adverse, quand une unité ennemie a combattu.",
          "1 unité ADEPTUS CUSTODES de votre armée à portée d'un objectif et éligible pour combattre.",
          "Votre unité a Combat en Premier et doit être la prochaine unité que vous choisissez pour combattre."),
        strat("lourde-responsabilite", "Lourde Responsabilité", 1, [M.combat],
          "Phase de Combat, quand une unité ADEPTUS CUSTODES INFANTRY de votre armée est choisie pour combattre.",
          "Cette unité ADEPTUS CUSTODES.",
          "Les attaques de mêlée de votre unité ont [TOUCHES FATALES : CHARACTER/MONSTER].")
      ]
    },

    /* -------------------------------------------------------
       GARDE SOLAIRE (Solar Watch) — Unique : Ost-Rempart
       ------------------------------------------------------- */
    {
      id: "garde-solaire", name: "Garde Solaire", nameEn: "Solar Watch",
      cost: 1, dispositions: ["reconnaissance"], exclusiveGroup: "ost-rempart",
      rule: { name: null, text: [
        "Quand une unité ADEPTUS CUSTODES amie Bat en Retraite, ce mouvement ne l'empêche pas d'être éligible pour déclarer une charge.",
        favori("Calistus", "votre unité a +2\" en Mouvement."),
        OST_REMPART
      ] },
      enhancements: [
        amelio("aigle-aurique", "Aigle Aurique", 15),
        opt("offensive-audacieuse", "Offensive Audacieuse", 30)
      ],
      stratagems: [
        strat("a-portee-de-lance", "À Portée de Lance", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour Battre en Retraite.",
          "Cette unité ADEPTUS CUSTODES.",
          "Cette Retraite ne l'empêche pas d'être éligible pour tirer."),
        strat("grenade-gravimetrique", "Grenade Gravimétrique", 1, [M.advCharge],
          "Début de la phase de Charge adverse.",
          "1 unité ADEPTUS CUSTODES de votre armée non engagée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité. Quand elle déclare une charge, elle a -1 aux jets de Charge."),
        strat("inexorable", "Inexorable", 1, [M.vousMvt],
          "Votre phase de Mouvement, quand une unité ADEPTUS CUSTODES de votre armée est choisie pour se déplacer.",
          "Cette unité ADEPTUS CUSTODES.",
          "Jusqu'à la fin du tour, votre unité peut ignorer les modificateurs à son Mouvement, à ses jets d'Avance et à ses jets de Charge.")
      ]
    }
  ]
});

})();
