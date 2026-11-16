/* =========================================================
   ADEPTUS ASTARTES — armées « règles seules » (sans unités)
   Un seul fichier pour les armées qui partagent la règle d'armée,
   les détachements et les stratagèmes du codex Space Marines :
     - Space Marines (id "space-marines")
     - Blood Angels  (id "blood-angels")
     - Black Templars (id "black-templars")
     - Deathwatch    (id "deathwatch")
     - Dark Angels   (id "dark-angels")
     - Space Wolves  (id "space-wolves")
   Chaque armée a sa ligne dans RefCatalog avec file: "adeptus-astartes".
   Plus tard : Dark Angels, Space Wolves, Black Templars… s'ajoutent ici
   (leurs détachements propres + ceux du codex qu'ils peuvent prendre).

   Un détachement commun n'est saisi qu'une fois (constante plus bas) :
   le corriger le corrige pour toutes les armées qui l'utilisent.

   ÉTAT
   - Règles d'armée propres (traduites depuis l'anglais) : Dark Angels,
     La Ravenwing et La Deathwing ; Black Templars, Héritiers de Sigismund ;
     Deathwatch, Recrues Vétéranes ; Space Wolves, Malédiction des Wulfen.
   - Règle d'armée commune : Doctrines de Combat (Combat Doctrines),
     traduite depuis l'anglais. « advance move » = « Avance »,
     « fall-back move » = « Retraite ».
   - Détachements saisis d'après les tableaux français fournis :
     nom, points de détachement, disposition(s), étiquette Unique,
     noms et coûts des optimisations.
       Communs (16) : Confrérie d'Assaut, Appui de la Deathwatch,
         Confrérie Devastator, Force Opérationnelle Ceste, Force
         Opérationnelle Gladius, Force Briseuse de Ligne Gravis, Force
         de Siège Gravis, Champions Cuirassés, Fer de Lance Déluge
         d'Acier, Force Furtive Phobos, Force de Choc Phobos, Force
         Opérationnelle Lance de l'Orage, Confrérie Tactique, Force
         d'Attaque Tacticus, Force Tacticus Tempête de Feu, Force
         d'Assaut Terminator.
       Space Marines seuls (6) : Lame d'Ultramar, Sentinelles de
         Céramite, Chercheurs du Père de la Forge, Colère de Medusa,
         Serre des Ombres, Force Opérationnelle de Pointe de Lance.
       Blood Angels seuls (3) : Héritiers Angéliques, Pointe de Lance
         Carmin, Colère des Condamnés.
       Black Templars seuls (3) : Poing de l'Empereur-Dieu, Maisonnée du
         Sénéchal, Croisés Liges du Vœu.
       Gladius n'est pas dans le tableau Black Templars.
       Dark Angels seuls (3) : Poursuite de Sombrevol, Force Opérationnelle
         du Cercle Intérieur, Colère du Roc (Unique : Terminator).
       Space Wolves seuls (3) : Champions de Fenris (Unique : Terminator),
         Saga du Tueur de Bêtes, Saga du Loup Suprême.
       Deathwatch seule (1) : Force Opérationnelle Lance Noire, à la place
         de l'Appui de la Deathwatch (absent de son tableau).
   - Règles et stratagèmes saisis pour tous les détachements : d'après
     les fiches françaises fournies, sauf Lame d'Ultramar, Chercheurs du
     Père de la Forge et Force Opérationnelle de Pointe de Lance, traduits
     depuis les fiches anglaises (noms français de leurs règles et
     stratagèmes : traductions, nom anglais gardé dans nameEn ; noms des
     optimisations repris du tableau français). Stratagèmes présents dans
     plusieurs détachements saisis une fois : Armure du Mépris, Force
     d'Annihilation, Frapper depuis les Ombres, Assaut Implacable.
   - Optimisations : textes saisis pour ces trois détachements traduits ;
     À SAISIR pour tous les autres.
   - Restriction de Chapitre (aucune autre unité ADEPTUS ASTARTES) :
     Blood Angels, Sentinelles de Céramite, Chercheurs du Père de la
     Forge, Pointe de Lance ; à vérifier pour Colère de Medusa et Serre
     des Ombres ; absente de la fiche Lame d'Ultramar.
   - À CONFIRMER : Munitions Hellfire (« [ANTI ≠ VÉHICULE 4+] » illisible),
     coût de Dans l'Ombre de Grandes Ailes (absent, 1 PC par défaut).
   - Vérifiés sur les fiches anglaises (coquilles des fiches françaises) :
     Assaut Implacable (version Force d'Attaque Tacticus, confirmée),
     Salve de Domination (Domination Fire : c'est l'unité ennemie qui est
     neutralisée), Opiniâtreté de l'Esprit de la Machine (Might of the
     Machine Spirit : jusqu'à votre prochaine phase de Commandement,
     Mouvement, CT, jets de touche et de blessure ; pas de table de
     dégradation ni d'Endurance).
   - Mots-clés d'unités en anglais (comme les autres armées) :
     INFANTERIE = INFANTRY ; MONTÉE = MOUNTED ; VÉHICULE = VEHICLE ;
     MARCHEUR = WALKER ; TRANSPORT ASSIGNÉ = DEDICATED TRANSPORT ;
     VOL = FLY ; MONSTRE = MONSTER ; ESCOUADE SCOUT = SCOUT SQUAD ;
     PERSONNAGE = CHARACTER ; RÉACTEURS DORSAUX = JUMP PACK ;
     COMPAGNIE DE LA MORT = DEATH COMPANY ; GARDE SANGUINIENNE =
     SANGUINARY GUARD ; LE SANGUINOR = THE SANGUINOR ;
     RÉVÉREND DE FER FEIRROS = IRON FATHER FEIRROS ;
     ESCOUADE CRUSADER = CRUSADER SQUAD ; ESCOUADE DE FRÈRES D'ÉPÉE =
     SWORD BRETHREN ; CHAPELAIN = CHAPLAIN ; ESCOUADE OUTRIDER =
     OUTRIDER SQUAD ; LIGNE = BATTLELINE ; AÉRODYNE = AIRCRAFT.
     Gardés tels quels : DEATHWING, RAVENWING.
     GRIFFES SANGLANTES = BLOOD CLAWS ; CAVALERIE SUR LOUPS TONNERRE =
     THUNDERWOLF CAVALRY ; WULFENS = WULFEN ; PRÊTRE LOUP = WOLF PRIEST.
     Gardés tels quels : DREADNOUGHT, GRAVIS, PHOBOS, TACTICUS,
     TERMINATOR, TRANSPORT, SPEEDER (nom anglais à confirmer).
   - Étiquettes Unique (exclusiveGroup) : Doctrines, Gravis, Phobos,
     Tacticus, Terminator, Ironstorm.
   - Optimisations notées « (Amélioration) » : kind "amelioration".
     « (Aura) » gardé dans le nom.
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const REGLE_A_SAISIR = "Règle du détachement à saisir.";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation") => ({
  id, name, cost, kind,
  requires: [["Adeptus Astartes"]],
  text: A_SAISIR
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");
// Optimisation dont le texte est saisi
const optx = (id, name, cost, text, kind = "optimisation") => ({ ...opt(id, name, cost, kind), text });

// Étiquette « Unique : … » : un seul détachement de ce groupe par armée
const unique = tag => `Ce détachement a l'étiquette UNIQUE : ${tag.toUpperCase()} : il ne peut pas être pris avec un autre détachement ${tag.toUpperCase()}.`;

// Détachement. o (facultatif) : { nameEn, ruleName, rule: [textes], stratagems: [...] }.
// Sans o.rule ni o.stratagems, ils restent « à saisir ».
const det = (id, name, cost, dispositions, enhancements, tag, o = {}) => ({
  id, name, cost, dispositions,
  ...(o.nameEn ? { nameEn: o.nameEn } : {}),
  ...(tag ? { exclusiveGroup: tag.toLowerCase() } : {}),
  rule: { name: o.ruleName || null, text: (o.rule || [REGLE_A_SAISIR]).concat(tag ? [unique(tag)] : []) },
  enhancements,
  stratagems: o.stratagems || []
});

// Moments des stratagèmes (vus du joueur Adeptus Astartes)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  vousCharge: { tour: "vous", phase: "charge" },
  advCharge:  { tour: "adversaire", phase: "charge" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCombat:  { tour: "adversaire", phase: "combat" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, moments, quand, cible, effet) =>
  ({ id, name, cp, type: null, moments, quand, cible, effet });
// Stratagème traduit depuis l'anglais : nom anglais gardé dans nameEn
const en = (st, nameEn) => Object.assign(st, { nameEn });

/* ---------------------------------------------------------
   RÈGLE D'ARMÉE COMMUNE
   --------------------------------------------------------- */

const DOCTRINES_DE_COMBAT = {
  id: "doctrines-de-combat",
  name: "Doctrines de Combat",
  nameEn: "Combat Doctrines",
  text: [
    "Les Space Marines puisent dans les doctrines de combat du Codex Astartes au fil de chaque phase de la bataille : ils pilonnent d'abord l'ennemi d'une puissance de feu dévastatrice, puis le criblent de salves à courte portée tout en manœuvrant pour porter un assaut final écrasant.",
    "Au début de votre phase de Commandement, vous pouvez choisir une des __doctrines de combat__ ci-dessous. Dans ce cas, elle est active pour les unités ADEPTUS ASTARTES amies qui ont cette aptitude jusqu'au début de votre prochaine phase de Commandement.",
    "__Doctrine d'Assaut__ : quand cette unité est choisie pour faire une Avance, cette Avance ne l'empêche pas d'être éligible pour déclarer une charge.",
    "__Doctrine Devastator__ : les attaques de tir de cette unité ont [ASSAUT].",
    "__Doctrine Tactique__ : quand cette unité est choisie pour Battre en Retraite, cette Retraite ne l'empêche pas d'être éligible pour tirer ni pour déclarer une charge.",
    "Sauf mention contraire :",
    "• vous ne pouvez choisir chaque doctrine de combat qu'une fois par bataille ;",
    "• une seule doctrine de combat peut être active pour chaque unité. Si une règle rend une doctrine de combat active pour une unité, celle qui l'était déjà pour cette unité ne l'est plus."
  ]
};

/* ---------------------------------------------------------
   STRATAGÈMES PRÉSENTS DANS PLUSIEURS DÉTACHEMENTS
   (même texte : saisis une fois, suffixe pour des id uniques)
   --------------------------------------------------------- */

const armureDuMepris = sfx => strat("armure-du-mepris-" + sfx, "Armure du Mépris", 1, [M.advTir, M.combat],
  "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES de votre armée.",
  "Cette unité ADEPTUS ASTARTES.",
  "Jusqu'à ce que l'unité ennemie ait fini ses attaques, aggravez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité.");

const forceDAnnihilation = sfx => strat("force-d-annihilation-" + sfx, "Force d'Annihilation", 1, [M.vousTir, M.combat],
  "Votre phase de Tir ou phase de Combat, quand une unité GRAVIS de votre armée est choisie pour attaquer.",
  "Cette unité GRAVIS.",
  "Les attaques de votre unité ont [TOUCHES FATALES].");

const frapperDepuisLesOmbres = sfx => strat("frapper-depuis-les-ombres-" + sfx, "Frapper depuis les Ombres", 1, [M.vousTir, M.combat],
  "Votre phase de Tir ou phase de Combat, quand une unité PHOBOS cachée de votre armée est choisie pour attaquer.",
  "Cette unité PHOBOS.",
  "Les attaques de votre unité ont [TOUCHES FATALES], et leur Pénétration d'Armure est améliorée de 1.");

// Texte de la Force d'Attaque Tacticus (confirmé). La fiche française de
// Tempête de Feu indique à tort « [TOUCHES FATALES : Non-MONSTRE/VÉHICULE] ».
const assautImplacable = sfx => strat("assaut-implacable-" + sfx, "Assaut Implacable", 1, [M.vousTir, M.combat],
  "Votre phase de Tir ou phase de Combat, quand une unité TACTICUS de votre armée est choisie pour attaquer.",
  "Cette unité TACTICUS.",
  "Les attaques de votre unité ont [TOUCHES SOUTENUES 1] contre les unités qui ne sont ni MONSTER ni VEHICLE, et [TOUCHES FATALES : MONSTER/VEHICLE].");

// Tactiques de Mission des KILL TEAM (Appui de la Deathwatch, Lance Noire)
const TACTIQUES_DE_MISSION = [
  "Les unités KILL TEAM amies qui ont l'aptitude Tactiques de Mission ont les aptitudes suivantes :",
  "__Tactiques Furor__ : si la Doctrine Devastator est active pour votre unité, ses attaques ont [TOUCHES SOUTENUES 1].",
  "__Tactiques Malleus__ : si la Doctrine Tactique est active pour votre unité, ses attaques ont [TOUCHES FATALES].",
  "__Tactiques Purgatus__ : si la Doctrine d'Assaut est active pour votre unité, ses attaques qui ciblent une unité ennemie à 9\" ou moins d'elle ont [PRÉCISION]."
];

// Munitions des KILL TEAM (Appui de la Deathwatch, Lance Noire)
const sfxId = (id, sfx) => sfx ? `${id}-${sfx}` : id;
const munitionsDragonfire = sfx => strat(sfxId("munitions-dragonfire", sfx), "Munitions Dragonfire", 1, [M.vousTir],
  "Votre phase de Tir, quand une unité KILL TEAM de votre armée est choisie pour tirer.",
  "Cette unité KILL TEAM.",
  "Les attaques de tir de votre unité peuvent relancer les jets de blessure de 1, et ont [IGNORE LE COUVERT].");
// Fiche française illisible (« [ANTI ≠ VEHICULE 4+] ») : version anglaise à demander
const munitionsHellfire = sfx => strat(sfxId("munitions-hellfire", sfx), "Munitions Hellfire", 1, [M.vousTir],
  "Votre phase de Tir, quand une unité KILL TEAM de votre armée est choisie pour tirer.",
  "Cette unité KILL TEAM.",
  "Les attaques de tir de votre unité (sauf celles qui ont [BLESSURES DÉVASTATRICES]) ont [ANTI-… 4+]. À confirmer : la fiche indique « [ANTI ≠ VÉHICULE 4+] ».");
const munitionsKraken = sfx => strat(sfxId("munitions-kraken", sfx), "Munitions Kraken", 1, [M.vousTir],
  "Votre phase de Tir, quand une unité KILL TEAM de votre armée est choisie pour tirer.",
  "Cette unité KILL TEAM.",
  "Les attaques de tir de votre unité ont +6\" de portée et +1 en Force.");

/* ---------------------------------------------------------
   DÉTACHEMENTS COMMUNS (tous les chapitres, selon leur tableau)
   --------------------------------------------------------- */

const C = {

  /* ----- CONFRÉRIE D'ASSAUT (Assault Brethren) ----- */
  confrerieDAssaut: det("confrerie-d-assaut", "Confrérie d'Assaut", 1, ["take-and-hold"], [
    amelio("assaut-furieux", "Assaut Furieux", 10),
    opt("glaive-de-l-imperium", "Glaive de l'Imperium", 20)
  ], "Doctrines", {
    nameEn: "Assault Brethren",
    rule: ["Vous pouvez choisir la Doctrine d'Assaut une fois de plus par bataille."],
    stratagems: [
      armureDuMepris("assaut"),
      strat("le-devoir-dans-la-mort", "Le Devoir dans la Mort", 1, [M.combat],
        "Phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES de votre armée.",
        "Cette unité ADEPTUS ASTARTES.",
        "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+1 si la Doctrine d'Assaut est active pour votre unité) : sur 4+, ne la retirez pas. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (selon ce qui arrive en premier)."),
      strat("puissance-genoforgee", "Puissance Génoforgée", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont [LANCE]. Si la Doctrine d'Assaut est active pour votre unité, leur Pénétration d'Armure est aussi améliorée de 1.")
    ]
  }),

  /* ----- APPUI DE LA DEATHWATCH (Deathwatch Support) ----- */
  appuiDeLaDeathwatch: det("appui-de-la-deathwatch", "Appui de la Deathwatch", 1, ["disruption"], [
    opt("balise-angelis", "Balise Angelis", 25)
  ], null, {
    nameEn: "Deathwatch Support",
    rule: [
      ...TACTIQUES_DE_MISSION,
      "Vous pouvez inclure des unités DEATHWATCH dans votre armée, même si elles n'ont pas le même mot-clé de faction de Chapitre que votre armée. Leur valeur en points combinée ne peut pas dépasser 500 points.",
      "Quand vous rassemblez votre armée, vous ne pouvez pas choisir une figurine DEATHWATCH comme SEIGNEUR DE GUERRE. Les unités KILL TEAM ne peuvent recevoir que des optimisations de ce détachement."
    ],
    stratagems: [
      strat("extraction-par-corvus-blackstar", "Extraction par Corvus Blackstar", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité KILL TEAM non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."),
      munitionsDragonfire(),
      munitionsHellfire(),
      munitionsKraken()
    ]
  }),

  /* ----- CONFRÉRIE DEVASTATOR (Devastator Brethren) ----- */
  confrerieDevastator: det("confrerie-devastator", "Confrérie Devastator", 1, ["purge-the-foe"], [
    opt("honneur-vigilant", "Honneur Vigilant", 20),
    opt("armes-a-feu-de-facture-magistrale", "Armes à Feu de Facture Magistrale", 15)
  ], "Doctrines", {
    nameEn: "Devastator Brethren",
    rule: ["Vous pouvez choisir la Doctrine Devastator une fois de plus par bataille."],
    stratagems: [
      armureDuMepris("devastator"),
      strat("grele-vengeresse", "Grêle Vengeresse", 2, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie a tiré, si ces attaques ont détruit au moins une figurine d'une unité ADEPTUS ASTARTES de votre armée.",
        "Cette unité ADEPTUS ASTARTES.",
        "Votre unité tire normalement, mais ne peut cibler que cette unité ennemie."),
      strat("tempete-de-feu", "Tempête de Feu", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de tir de votre unité ont [IGNORE LE COUVERT]. Si la Doctrine Devastator est active pour votre unité, leur Pénétration d'Armure est aussi améliorée de 1.")
    ]
  }),

  /* ----- FORCE OPÉRATIONNELLE CESTE (Gauntlet Task Force) ----- */
  ceste: det("force-operationnelle-ceste", "Force Opérationnelle Ceste", 1, ["reconnaissance"], [
    opt("liaison-de-classe-damocles", "Liaison de Classe Damoclès", 15),
    opt("offensive-briseuse-de-ligne", "Offensive Briseuse de Ligne", 20)
  ], null, {
    nameEn: "Gauntlet Task Force",
    rule: [
      "À votre phase de Tir, quand une unité ADEPTUS ASTARTES TRANSPORT amie a tiré, vous pouvez choisir 1 unité ennemie touchée par ces attaques : elle est __assaillie__ jusqu'à la fin du tour.",
      "Quand une unité ADEPTUS ASTARTES qui a débarqué à ce tour cible une unité assaillie, ses attaques ont [TOUCHES SOUTENUES 1]."
    ],
    stratagems: [
      strat("assaillir-et-securiser", "Assaillir et Sécuriser", 1, [M.vousMvt],
        "Fin de votre phase de Mouvement.",
        "1 unité ADEPTUS ASTARTES TRANSPORT de votre armée, ou 1 unité ADEPTUS ASTARTES INFANTRY embarquée à son bord.",
        "Choisissez un objectif que vous contrôlez : il est sécurisé."),
      strat("debarquement-agressif", "Débarquement Agressif", 1, [M.tout],
        "N'importe quelle phase, quand une unité ADEPTUS ASTARTES de votre armée embarquée dans un TRANSPORT est choisie pour débarquer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Pour ce débarquement, chaque figurine de votre unité peut être placée jusqu'à 3\" de la distance de placement du TRANSPORT, au lieu d'être placée strictement à la distance normale."),
      strat("le-devoir-ne-connait-pas-de-fin", "Le Devoir ne Connaît pas de Fin", 1, [M.combat],
        "Fin de la phase de Combat.",
        "1 unité ADEPTUS ASTARTES INFANTRY non engagée de votre armée, qui était éligible pour combattre à cette phase, entièrement à 6\" ou moins d'un TRANSPORT ami et éligible pour y embarquer.",
        "Votre unité embarque dans ce TRANSPORT.")
    ]
  }),

  /* ----- FORCE OPÉRATIONNELLE GLADIUS (Gladius Task Force) — 3 PDD ----- */
  gladius: det("force-operationnelle-gladius", "Force Opérationnelle Gladius", 3, ["take-and-hold", "priority-assets"], [
    opt("adepte-du-codex", "Adepte du Codex", 20),
    opt("armure-d-artificier", "Armure d'Artificier", 15),
    opt("lauriers-du-triomphe", "Lauriers du Triomphe", 20),
    opt("etendard-de-l-empereur-ascendant", "Étendard de l'Empereur Ascendant", 25)
  ], null, {
    nameEn: "Gladius Task Force",
    rule: ["Vous pouvez choisir une seule des doctrines de combat une fois de plus par bataille."],
    stratagems: [
      strat("adaptation-strategique", "Adaptation Stratégique", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."),
      armureDuMepris("gladius"),
      strat("orage-devastateur", "Orage Dévastateur", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de tir de votre unité ont [IGNORE LE COUVERT]."),
      strat("puissance-des-anges", "Puissance des Anges", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont [LANCE]."),
      strat("tactiques-reactives", "Tactiques Réactives", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 9\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED non engagée de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Votre unité peut faire un Mouvement Normal de D6\" maximum."),
      strat("une-mort-digne", "Une Mort Digne", 1, [M.combat],
        "Phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES de votre armée.",
        "Cette unité ADEPTUS ASTARTES.",
        "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 : sur 4+, ne la retirez pas. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (selon ce qui arrive en premier).")
    ]
  }),

  /* ----- FORCE BRISEUSE DE LIGNE GRAVIS (Gravis Linebreaker Force) ----- */
  briseuseGravis: det("force-briseuse-de-ligne-gravis", "Force Briseuse de Ligne Gravis", 1, ["take-and-hold"], [
    opt("robustesse-inalterable", "Robustesse Inaltérable", 20),
    opt("avance-implacable", "Avance Implacable", 20)
  ], "Gravis", {
    nameEn: "Gravis Linebreaker Force",
    rule: [
      "À un tour où une unité GRAVIS amie a fait un Mouvement Normal, ses attaques de tir :",
      "• n'ont pas [LOURD] ;",
      "• ont +1 au jet de touche."
    ],
    stratagems: [
      forceDAnnihilation("briseuse"),
      strat("impact-blinde", "Impact Blindé", 1, [M.vousCharge],
        "Votre phase de Charge, quand une unité GRAVIS de votre armée finit un mouvement de charge.",
        "Cette unité GRAVIS.",
        "Choisissez 1 unité ennemie engagée avec votre unité, et lancez 1D6 pour chaque figurine de votre unité engagée avec elle : pour chaque 3+, cette unité ennemie subit 1 blessure mortelle."),
      strat("poussee-purgatoire", "Poussée Purgatoire", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité GRAVIS de votre armée a tiré.",
        "Cette unité GRAVIS.",
        "Si votre unité n'est pas engagée, elle peut faire un Mouvement Normal de 5\" maximum, si ce mouvement l'amène à portée d'un objectif. Jusqu'à la fin du tour, votre unité n'est pas éligible pour déclarer une charge ni pour embarquer dans un TRANSPORT.")
    ]
  }),

  /* ----- FORCE DE SIÈGE GRAVIS (Gravis Siege Force) ----- */
  siegeGravis: det("force-de-siege-gravis", "Force de Siège Gravis", 1, ["take-and-hold"], [
    amelio("conquerants-inamovibles", "Conquérants Inamovibles", 15),
    opt("gantelet-narthecis", "Gantelet Narthecis", 20)
  ], "Gravis", {
    nameEn: "Gravis Siege Force",
    rule: ["Tant qu'une unité GRAVIS amie est à portée d'un objectif, les attaques qui la ciblent ont -1 au jet de blessure si leur Force est supérieure à son Endurance."],
    stratagems: [
      forceDAnnihilation("siege"),
      strat("posture-inflexible", "Posture Inflexible", 1, [M.vousMvt],
        "Fin de votre phase de Mouvement.",
        "1 unité GRAVIS de votre armée.",
        "Choisissez un objectif que votre unité contrôle : il est sécurisé."),
      strat("salves-de-neutralisation", "Salves de Neutralisation", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité GRAVIS de votre armée a tiré.",
        "Cette unité GRAVIS.",
        "Choisissez 1 unité ennemie touchée par ces attaques : elle fait un test d'Ébranlement, avec -1 à ce test.")
    ]
  }),

  /* ----- CHAMPIONS CUIRASSÉS (Ironclad Champions) ----- */
  championsCuirasses: det("champions-cuirasses", "Champions Cuirassés", 1, ["priority-assets"], [
    amelio("sarcophage-d-artificier", "Sarcophage d'Artificier", 40),
    amelio("champion-venerable", "Champion Vénérable (Aura)", 30)
  ], null, {
    nameEn: "Ironclad Champions",
    rule: ["Les unités ADEPTUS ASTARTES DREADNOUGHT amies peuvent relancer les jets de touche de 1."],
    stratagems: [
      strat("la-pitie-est-une-faiblesse", "La Pitié est une Faiblesse", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité DREADNOUGHT de votre armée est choisie pour attaquer.",
        "Cette unité DREADNOUGHT.",
        "Les attaques de votre unité ont, au choix, [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1]."),
      strat("progression-inarretable", "Progression Inarrêtable", 1, [M.vousMvt, M.vousCharge],
        "Votre phase de Mouvement ou de Charge, quand une unité DREADNOUGHT de votre armée est choisie pour se déplacer ou déclarer une charge.",
        "Cette unité DREADNOUGHT.",
        "Votre unité a le mot-clé MOBILE."),
      strat("terreur-adamantine", "Terreur Adamantine", 1, [M.combat],
        "Début de la phase de Combat.",
        "1 unité DREADNOUGHT de votre armée.",
        "Chaque unité ennemie engagée avec votre unité fait un test d'Ébranlement, avec -1 à ce test.")
    ]
  }),

  /* ----- FER DE LANCE DÉLUGE D'ACIER (Ironstorm Spearhead) ----- */
  delugeDAcier: det("fer-de-lance-deluge-d-acier", "Fer de Lance Déluge d'Acier", 1, ["purge-the-foe"], [
    amelio("honneurs-d-artilleur", "Honneurs d'Artilleur", 15),
    amelio("esprit-de-la-machine-redoutable", "Esprit de la Machine Redoutable", 25)
  ], "Ironstorm", {
    nameEn: "Ironstorm Spearhead",
    rule: ["Les attaques de tir des unités ADEPTUS ASTARTES VEHICLE amies (sauf WALKER) peuvent relancer un jet de touche et relancer un jet de blessure."],
    stratagems: [
      strat("ceramite-stratifiee", "Céramite Stratifiée", 1, [M.tout],
        "N'importe quelle phase, quand une unité ADEPTUS ASTARTES VEHICLE de votre armée subit une blessure mortelle.",
        "Cette unité ADEPTUS ASTARTES VEHICLE.",
        "Votre unité a Insensibilité à la Douleur 5+ contre les blessures mortelles."),
      strat("doctrine-du-chasseur-de-tetes", "Doctrine du Chasseur de Têtes", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES VEHICLE de votre armée (sauf DEDICATED TRANSPORT, FLY et WALKER) est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES VEHICLE.",
        "Les attaques de tir de votre unité ont [TOUCHES FATALES : MONSTER/VEHICLE]."),
      // Corrigé d'après la fiche anglaise (Might of the Machine Spirit)
      strat("opiniatrete-de-l-esprit-de-la-machine", "Opiniâtreté de l'Esprit de la Machine", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES VEHICLE de votre armée (sauf DEDICATED TRANSPORT, FLY et WALKER).",
        "Jusqu'au début de votre prochaine phase de Commandement, votre unité peut ignorer les modificateurs à son Mouvement, à sa CT, à ses jets de touche et à ses jets de blessure.")
    ]
  }),

  /* ----- FORCE FURTIVE PHOBOS (Phobos Shadow Force) ----- */
  furtivePhobos: det("force-furtive-phobos", "Force Furtive Phobos", 1, ["disruption"], [
    opt("execution-et-redeploiement", "Exécution et Redéploiement", 25),
    opt("omni-auspex-venator-furtive", "Omni-auspex Venator", 15)
  ], "Phobos", {
    nameEn: "Phobos Shadow Force",
    rule: [
      "Quand une unité PHOBOS ou SCOUT SQUAD amie a tiré :",
      "• ces attaques ne l'empêchent pas d'être cachée ;",
      "• elle peut faire un Mouvement Normal de D6\" maximum. Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge."
    ],
    stratagems: [
      frapperDepuisLesOmbres("furtive"),
      strat("repli-tactique", "Repli Tactique", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité PHOBOS ou SCOUT SQUAD non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."),
      strat("rets-mortis", "Rets Mortis", 1, [M.vousMvt],
        "Fin de votre phase de Mouvement.",
        "1 unité PHOBOS ou SCOUT SQUAD non engagée de votre armée.",
        "Si votre unité contrôle un objectif, il est __réclamé__. Tant qu'un objectif est réclamé, quand une unité ennemie finit un mouvement à portée de cet objectif, lancez 1D6 : sur 2+, cette unité ennemie subit D6 blessures mortelles. L'objectif n'est alors plus réclamé.")
    ]
  }),

  /* ----- FORCE DE CHOC PHOBOS (Phobos Shock Force) ----- */
  chocPhobos: det("force-de-choc-phobos", "Force de Choc Phobos", 1, ["disruption"], [
    opt("sceau-de-dissimulation", "Sceau de Dissimulation", 15),
    opt("omni-auspex-venator-choc", "Omni-auspex Venator", 15)
  ], "Phobos", {
    nameEn: "Phobos Shock Force",
    rule: ["À la fin de votre phase de Mouvement, si une unité PHOBOS amie est cachée, ses attaques peuvent relancer les jets de blessure de 1 jusqu'à la fin du tour."],
    stratagems: [
      frapperDepuisLesOmbres("choc"),
      strat("insaisissable-comme-les-ombres", "Insaisissable comme les Ombres", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité PHOBOS de votre armée.",
        "Cette unité PHOBOS.",
        "Les attaques de tir qui ciblent votre unité ont -1 au jet de touche."),
      strat("reactions-transhumaines", "Réactions Transhumaines", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 9\" ou moins d'une unité PHOBOS non engagée de votre armée.",
        "Cette unité PHOBOS.",
        "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de D6+2\" maximum si la Doctrine Tactique est active pour elle.")
    ]
  }),

  /* ----- FORCE OPÉRATIONNELLE LANCE DE L'ORAGE (Stormlance Task Force) ----- */
  lanceDeLOrage: det("force-operationnelle-lance-de-l-orage", "Force Opérationnelle Lance de l'Orage", 1, ["reconnaissance"], [
    amelio("autels-auspex-de-triangulation", "Autels-auspex de Triangulation", 10),
    amelio("moteurs-surgonfles", "Moteurs Surgonflés", 10)
  ], null, {
    nameEn: "Stormlance Task Force",
    rule: ["Les unités ADEPTUS ASTARTES MOUNTED et SPEEDER amies ont +2\" en Mouvement."],
    stratagems: [
      strat("attaque-subite", "Attaque Subite", 1, [M.vousMvt],
        "Votre phase de Mouvement, quand une unité ADEPTUS ASTARTES MOUNTED ou SPEEDER de votre armée est choisie pour faire une Avance.",
        "Cette unité ADEPTUS ASTARTES MOUNTED ou SPEEDER.",
        "Au lieu de lancer le dé, votre jet d'Avance vaut 6."),
      strat("cibles-veloces", "Cibles Véloces", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES MOUNTED ou SPEEDER de votre armée.",
        "Cette unité ADEPTUS ASTARTES MOUNTED ou SPEEDER.",
        "Les attaques de tir qui ciblent votre unité ont -1 au jet de touche."),
      strat("insaisissable-comme-le-vent", "Insaisissable comme le Vent", 1, [M.combat],
        "Fin de la phase de Combat.",
        "1 unité ADEPTUS ASTARTES MOUNTED de votre armée qui était éligible pour combattre à cette phase.",
        "Si votre unité n'est pas engagée, elle peut faire un Mouvement Normal. Si elle est engagée, elle peut faire une Retraite.")
    ]
  }),

  /* ----- CONFRÉRIE TACTIQUE (Tactical Brethren) ----- */
  confrerieTactique: det("confrerie-tactique", "Confrérie Tactique", 1, ["priority-assets"], [
    opt("lauriers-de-la-vigilance", "Lauriers de la Vigilance", 10),
    opt("sagacite-tactique", "Sagacité Tactique", 15)
  ], "Doctrines", {
    nameEn: "Tactical Brethren",
    rule: ["Vous pouvez choisir la Doctrine Tactique une fois de plus par bataille."],
    stratagems: [
      armureDuMepris("tactique"),
      // Fiche française : « Cette arme est neutralisée » ; l'anglaise (Domination Fire) dit bien l'unité ennemie
      strat("salve-de-domination", "Salve de Domination", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES de votre armée a tiré.",
        "Cette unité ADEPTUS ASTARTES.",
        "Choisissez 1 unité ennemie touchée par ces attaques : elle est __neutralisée__ jusqu'au début de votre prochain tour. Tant qu'une unité est neutralisée, ses attaques ont -1 au jet de touche."),
      strat("tactiques-magistrales", "Tactiques Magistrales", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 9\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED non engagée de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de 6\" maximum si la Doctrine Tactique est active pour elle.")
    ]
  }),

  /* ----- FORCE D'ATTAQUE TACTICUS (Tacticus Attack Force) ----- */
  attaqueTacticus: det("force-d-attaque-tacticus", "Force d'Attaque Tacticus", 1, ["take-and-hold"], [
    opt("parangon-martial", "Parangon Martial", 10),
    opt("champion-d-avant-garde", "Champion d'Avant-garde", 15)
  ], "Tacticus", {
    nameEn: "Tacticus Attack Force",
    rule: ["Les unités TACTICUS amies peuvent relancer leurs jets d'Avance."],
    stratagems: [
      assautImplacable("attaque"),
      strat("concentration-tactique", "Concentration Tactique", 1, [M.combat],
        "Phase de Combat, quand une unité TACTICUS de votre armée est choisie pour faire un mouvement de Consolidation.",
        "Cette unité TACTICUS.",
        "Pour ce mouvement de Consolidation, votre unité peut se déplacer de D3+3\" maximum."),
      strat("vivacite-transhumaine", "Vivacité Transhumaine", 1, [M.combat],
        "Phase de Combat, après qu'une unité ennemie a combattu.",
        "1 unité TACTICUS de votre armée à portée d'un objectif et éligible pour combattre.",
        "Votre unité a Combat en Premier pour la prochaine fois que vous choisissez une unité pour combattre à ce tour.")
    ]
  }),

  /* ----- FORCE TACTICUS TEMPÊTE DE FEU (Tacticus Firestorm Force) ----- */
  tempeteDeFeu: det("force-tacticus-tempete-de-feu", "Force Tacticus Tempête de Feu", 1, ["priority-assets"], [
    opt("cyberfamilier", "Cyberfamilier", 15),
    opt("trempe-dans-les-combats", "Trempé dans les Combats (Aura)", 10)
  ], "Tacticus", {
    nameEn: "Tacticus Firestorm Force",
    rule: ["Les attaques [TIR RAPIDE] des unités TACTICUS amies ont [TIR RAPIDE 1] quand elles ciblent une unité à la portée maximale de l'attaque."],
    stratagems: [
      assautImplacable("tempete"),
      strat("brutalite-a-bout-portant", "Brutalité à Bout Portant", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité TACTICUS non engagée de votre armée est choisie pour tirer.",
        "Cette unité TACTICUS.",
        "Les attaques de tir de votre unité (sauf celles des pistolets) ont [COMBAT RAPPROCHÉ] et [IGNORE LE COUVERT]."),
      strat("pour-l-empereur", "Pour l'Empereur !", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité TACTICUS de votre armée à portée d'un objectif.",
        "Jusqu'à la fin du tour, votre unité a un Contrôle d'Objectif de 3.")
    ]
  }),

  /* ----- FORCE D'ASSAUT TERMINATOR (Terminator Storm Force) ----- */
  assautTerminator: det("force-d-assaut-terminator", "Force d'Assaut Terminator", 1, ["priority-assets"], [
    opt("champion-de-la-premiere-compagnie", "Champion de la Première Compagnie", 20),
    opt("reliquaire-corporeum", "Reliquaire Corporeum", 25)
  ], "Terminator", {
    nameEn: "Terminator Storm Force",
    rule: ["Les unités ADEPTUS ASTARTES TERMINATOR amies ont +1 aux jets de Charge."],
    stratagems: [
      strat("extraction-par-escorteur", "Extraction par Escorteur", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité ADEPTUS ASTARTES TERMINATOR non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."),
      strat("robustesse-tactique-dreadnought", "Robustesse Tactique Dreadnought", 2, [M.advTir, M.combat],
        "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES TERMINATOR de votre armée.",
        "Cette unité ADEPTUS ASTARTES TERMINATOR.",
        "Jusqu'à ce que l'unité ennemie ait fini ses attaques, les attaques qui ciblent votre unité ont -1 en Dégâts."),
      strat("veterans-impitoyables", "Vétérans Impitoyables", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES TERMINATOR de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES TERMINATOR.",
        "Les attaques de tir de votre unité ont [TOUCHES FATALES] et [TOUCHES SOUTENUES 1].")
    ]
  })
};

// Restriction des détachements de Chapitre
const restrictionChapitre = chap => `__Restriction__ : votre armée peut inclure des unités ${chap}, mais aucune unité ADEPTUS ASTARTES d'un autre Chapitre.`;

/* ---------------------------------------------------------
   SPACE MARINES — détachements propres, puis ordre du tableau
   --------------------------------------------------------- */

const SM = {
  /* ----- LAME D'ULTRAMAR (Blade of Ultramar) — Ultramarines — 3 PDD
     Traduit depuis la fiche anglaise (noms français des stratagèmes : traduction) ----- */
  lameDUltramar: det("lame-d-ultramar", "Lame d'Ultramar", 3, ["take-and-hold", "priority-assets"], [
    optx("erudit-du-codex", "Érudit du Codex", 20,
      "Figurine CAPTAIN uniquement. La Doctrine Tactique est active pour cette unité, en plus de toute autre doctrine de combat."),
    optx("armure-d-antoninus", "Armure d'Antoninus", 15,
      "Figurine ADEPTUS ASTARTES uniquement. Cette figurine a une Sauvegarde de 2+ et Insensibilité à la Douleur 5+."),
    optx("serment-de-macragge", "Serment de Macragge", 20,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques de mêlée de cette figurine ont +1 en Force et leur Pénétration d'Armure est améliorée de 1 ; ou, si la Doctrine d'Assaut est active pour cette unité, +2 en Force et Pénétration d'Armure améliorée de 2."),
    optx("veteran-de-behemoth", "Vétéran de Béhémoth", 20,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques de tir de cette unité ont [TOUCHES SOUTENUES 1].")
  ], null, {
    nameEn: "Blade of Ultramar",
    ruleName: "Doctrines Maîtrisées",
    rule: ["Si votre armée inclut une unité MARNEUS CALGAR, vous pouvez choisir la Doctrine d'Assaut, la Doctrine Devastator et la Doctrine Tactique une fois de plus chacune par bataille."],
    stratagems: [
      armureDuMepris("ultramar"),
      en(strat("vigilance-exemplaire", "Vigilance Exemplaire", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de tir de votre unité ont [IGNORE LE COUVERT]."), "Exemplary Vigilance"),
      en(strat("adaptabilite-ultramarienne", "Adaptabilité Ultramarienne", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."), "Ultramarian Adaptivity"),
      en(strat("courage-et-honneur", "Courage et Honneur !", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont [LANCE]."), "Courage and Honour!"),
      en(strat("tactiques-pratiques", "Tactiques Pratiques", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED non engagée de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Votre unité peut faire un Mouvement Normal de D3+3\" maximum."), "Practical Tactics"),
      en(strat("prevoyance-tactique", "Prévoyance Tactique", 1, [M.advTir, M.combat],
        "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES de votre armée.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance."), "Tactical Foresight")
    ]
  }),

  /* ----- SENTINELLES DE CÉRAMITE (Ceramite Sentinels) — Imperial Fists ----- */
  sentinellesDeCeramite: det("sentinelles-de-ceramite", "Sentinelles de Céramite", 2, ["take-and-hold"], [
    opt("omnivox-castellum", "Omnivox Castellum", 10),
    opt("maitrise-defensive", "Maîtrise Défensive", 10),
    opt("honneur-inoxydable", "Honneur Inoxydable", 10),
    opt("liaison-par-crane-espion", "Liaison par Crâne-espion", 10)
  ], null, {
    nameEn: "Ceramite Sentinels",
    rule: [
      "Tant qu'une unité ADEPTUS ASTARTES amie est dans une zone de terrain, ses attaques peuvent relancer les jets de blessure de 1.",
      "Les unités ADEPTUS ASTARTES amies sont __retranchées__ tant que tout ce qui suit s'applique :",
      "• l'unité est dans une zone de terrain ;",
      "• l'unité n'a pas été placée à ce tour ;",
      "• aucune figurine de l'unité ne s'est déplacée de plus de 3\" à ce tour.",
      "Les unités DARNATH LYSANDER et TOR GARADON amies ont l'aptitude suivante :",
      "__Maîtrise Défensive__ : au début de chaque phase, cette unité est retranchée (sans tenir compte des conditions ci-dessus).",
      restrictionChapitre("IMPERIAL FISTS")
    ],
    stratagems: [
      strat("ciblage-ameliore", "Ciblage Amélioré", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de votre unité ont, au choix, [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1]. Si votre unité est retranchée, elles ont [TOUCHES FATALES] et [TOUCHES SOUTENUES 1]."),
      strat("frappe-prioritaire", "Frappe Prioritaire", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Les attaques de votre unité qui ciblent une unité MONSTER ou VEHICLE ont +1 au jet de blessure."),
      strat("instaurer-la-suprematie", "Instaurer la Suprématie", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY retranchée de votre armée est choisie pour faire un mouvement de Consolidation.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Vous pouvez choisir le mode de Consolidation sur objectif pour ce mouvement, quelles que soient les restrictions « avant de se déplacer ». Votre unité peut donc sortir de portée d'engagement des unités ennemies, tant qu'elle remplit les conditions de ce mode."),
      strat("puissance-inflexible", "Puissance Inflexible", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée à portée d'un objectif.",
        "Jusqu'à la fin du tour, votre unité a +1 en Contrôle d'Objectif."),
      strat("repositionnement-insaisissable", "Repositionnement Insaisissable", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie a tiré.",
        "1 unité ADEPTUS ASTARTES INFANTRY ou MOUNTED non engagée de votre armée qui a perdu un ou plusieurs PV à cause de ces attaques.",
        "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de D3+3\" maximum si elle est retranchée. Jusqu'à la fin du tour, elle ne peut pas embarquer dans un TRANSPORT."),
      strat("tenez-jusqu-au-bout", "Tenez jusqu'au Bout", 1, [M.advTir, M.combat],
        "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES de votre armée (sauf MONSTER et VEHICLE).",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance. Si votre unité est retranchée, toutes les attaques qui la ciblent ont -1 au jet de blessure.")
    ]
  }),

  /* ----- CHERCHEURS DU PÈRE DE LA FORGE (Forgefather's Seekers) — Salamanders
     Traduit depuis la fiche anglaise (noms français des stratagèmes : traduction) ----- */
  chercheursDuPereDeLaForge: det("chercheurs-du-pere-de-la-forge", "Chercheurs du Père de la Forge", 2, ["priority-assets"], [
    optx("forges-par-la-bataille", "Forgés par la Bataille", 25,
      "Figurine ADEPTUS ASTARTES uniquement. Cette unité peut ignorer les modificateurs à sa CT, à sa CC et à ses jets de touche."),
    optx("cape-adamantine", "Cape Adamantine", 20,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques allouées à cette figurine ont -1 en Dégâts."),
    optx("artisan-aguerri", "Artisan Aguerri", 25,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques de mêlée de cette figurine ont +1 en Force et +1 en Dégâts."),
    optx("immolator", "Immolator", 20,
      "Figurine ADEPTUS ASTARTES uniquement. Les armes [TORRENT] de cette unité ont +1 en Attaques.")
  ], null, {
    nameEn: "Forgefather's Seekers",
    ruleName: "La Quête de Vulkan",
    rule: [
      "• Vous pouvez choisir la Doctrine Devastator une fois de plus par bataille.",
      "• Les attaques de tir des unités ADEPTUS ASTARTES amies qui ciblent une unité à 12\" ou moins ont +1 en Force.",
      "Si votre armée inclut une unité VULKAN HE'STAN, les unités INFERNUS SQUAD amies ont ce qui suit :",
      "• quand cette unité est choisie pour faire une Avance ou une Retraite, ce mouvement ne l'empêche pas d'être éligible pour commencer une action ;",
      "• quand cette unité commence une action, cette action ne l'empêche pas d'être éligible pour tirer.",
      restrictionChapitre("SALAMANDERS")
    ],
    stratagems: [
      en(strat("terre-embrasee", "Terre Embrasée", 1, [M.advCharge],
        "Début de la phase de Charge adverse.",
        "1 unité ADEPTUS ASTARTES non engagée de votre armée, équipée d'une ou plusieurs armes Torrent ou Melta.",
        "Choisissez 1 unité ennemie visible à 12\" ou moins de votre unité : elle a -1 aux jets de Charge."), "Blazing Earth"),
      en(strat("colere-et-ruine", "Colère et Ruine", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES INFANTRY de votre armée.",
        "La Doctrine d'Assaut ou la Doctrine Tactique (au choix) est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."), "Wrath and Ruin"),
      en(strat("forges-dans-le-feu", "Forgés dans le Feu", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES engagée de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les armes Torrent de votre unité n'ont pas [EXPLOSION], ont [COMBAT RAPPROCHÉ] et ont +1 en Attaques."), "Forged in Fire"),
      en(strat("protocoles-d-immolation", "Protocoles d'Immolation", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "La Pénétration d'Armure des attaques de tir [TORRENT] de votre unité est améliorée de 1."), "Immolation Protocols"),
      en(strat("creuset-de-la-bataille", "Creuset de la Bataille", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour attaquer une unité ennemie à 6\" ou moins.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Les attaques de votre unité peuvent relancer les jets de touche de 1 et les jets de blessure de 1."), "Crucible of Battle"),
      en(strat("vengeance-ardente", "Vengeance Ardente", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie a tiré sur une unité ADEPTUS ASTARTES TRANSPORT de votre armée.",
        "1 unité ADEPTUS ASTARTES embarquée dans ce TRANSPORT.",
        "Votre unité peut débarquer, puis tirer normalement ; elle ne peut alors cibler que cette unité ennemie."), "Burning Vengeance")
    ]
  }),

  /* ----- COLÈRE DE MEDUSA (Medusa's Wrath) — Iron Hands ----- */
  colereDeMedusa: det("colere-de-medusa", "Colère de Medusa", 2, ["purge-the-foe"], [
    opt("adepte-de-l-omnimessie", "Adepte de l'Omnimessie", 25),
    opt("maitre-de-la-guerre-mecanisee", "Maître de la Guerre Mécanisée", 25),
    opt("toile-augure-de-ciblage", "Toile Augure de Ciblage", 30),
    opt("la-chair-est-faible", "La Chair est Faible", 15)
  ], "Ironstorm", {
    nameEn: "Medusa's Wrath",
    rule: [
      "Chaque fois qu'une unité ADEPTUS ASTARTES amie est choisie pour tirer ou pour combattre, appliquez un des effets suivants pour ces attaques :",
      "• si l'unité est à 6\" ou moins d'une unité CANNOK VAR ou IRON FATHER FEIRROS amie, vous pouvez relancer un jet de touche, un jet de blessure et un jet de Dégâts ;",
      "• sinon, vous pouvez relancer, au choix, un jet de touche, un jet de blessure ou un jet de Dégâts."
    ],
    stratagems: [
      strat("animus-vengeur", "Animus Vengeur", 1, [M.tout],
        "N'importe quelle phase, quand une unité ADEPTUS ASTARTES VEHICLE de votre armée est détruite, avant le jet de Destruction Néfaste.",
        "Cette unité ADEPTUS ASTARTES VEHICLE.",
        "Les jets de Destruction Néfaste de votre unité sont remplacés par un 6 non modifié."),
      strat("brutalite-methodique", "Brutalité Méthodique", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de votre unité ont [TOUCHES SOUTENUES 1]. Si c'est une unité VEHICLE, elles ont aussi +1 au jet de blessure."),
      strat("conviction-inflexible", "Conviction Inflexible", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée en dessous de son Effectif Initial.",
        "Jusqu'au début de votre prochaine phase de Commandement, votre unité peut ignorer les modificateurs à sa CT, à sa CC, à ses jets de touche et à ses jets de blessure."),
      strat("esprits-de-fer", "Esprits de Fer", 1, [M.tout],
        "N'importe quelle phase, quand une unité ADEPTUS ASTARTES de votre armée subit une blessure mortelle.",
        "Cette unité ADEPTUS ASTARTES.",
        "Votre unité a Insensibilité à la Douleur 5+ contre les blessures mortelles."),
      strat("fureur-de-l-ancien", "Fureur de l'Ancien", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES DREADNOUGHT de votre armée.",
        "Jusqu'au début de votre prochaine phase de Commandement, votre unité a +1\" en Mouvement, +1 en Endurance, +1 en Commandement, +1 en Contrôle d'Objectif et +1 au jet de touche."),
      strat("pouvoir-de-l-esprit-de-la-machine", "Pouvoir de l'Esprit de la Machine", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie qui a ciblé une unité ADEPTUS ASTARTES VEHICLE non engagée de votre armée a tiré.",
        "Cette unité ADEPTUS ASTARTES VEHICLE.",
        "Votre unité fait un Tir au Jugé ; si elle est à la moitié de son effectif ou moins, elle tire normalement à la place. Dans les deux cas, elle ne peut cibler que cette unité ennemie.")
    ]
  }),

  /* ----- SERRE DES OMBRES (Shadowmark Talon) — Raven Guard ----- */
  serreDesOmbres: det("serre-des-ombres", "Serre des Ombres", 2, ["disruption"], [
    opt("suaire-de-l-aile-noire", "Suaire de l'Aile Noire", 25),
    opt("couronne-des-murmures", "Couronne des Murmures", 30),
    opt("instincts-du-chasseur", "Instincts du Chasseur", 25),
    opt("rapace-de-l-ombre", "Rapace de l'Ombre", 15)
  ], "Phobos", {
    nameEn: "Shadowmark Talon",
    rule: [
      "Les unités ADEPTUS ASTARTES amies ont Discrétion.",
      "Les unités PHOBOS et SCOUT SQUAD amies ont -3\" en portée de détection.",
      "Les unités AETHON SHAAN amies ont l'aptitude suivante :",
      "__Tacticien Incomparable__ (une fois par round de bataille, par armée) : quand vous utilisez le stratagème Dans les Ténèbres, cette utilisation coûte 1 PC de moins."
    ],
    stratagems: [
      strat("abattre-les-tyrans", "Abattre les Tyrans", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Jusqu'à la fin de la phase, les attaques de mêlée de votre unité ont [PRÉCISION]."),
      strat("armes-silencieuses", "Armes Silencieuses", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée a tiré.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Ces attaques ne l'empêchent pas d'être cachée."),
      strat("dans-les-tenebres", "Dans les Ténèbres", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité ADEPTUS ASTARTES INFANTRY non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."),
      strat("feinte-et-enfoncement", "Feinte et Enfoncement", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES INFANTRY de votre armée.",
        "La Doctrine Tactique est active pour votre unité jusqu'au début de votre prochaine phase de Commandement, en plus de toute autre doctrine de combat."),
      strat("fusillade-meurtriere", "Fusillade Meurtrière", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée qui a fait un mouvement d'arrivée à ce tour est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Jusqu'à la fin de la phase, les attaques de tir de votre unité ont +1 en CT, et leur Pénétration d'Armure est améliorée de 1."),
      strat("vigilance-du-rapace", "Vigilance du Rapace", 1, [M.advMvt],
        "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un mouvement à 8\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY non engagée de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Votre unité peut faire un Mouvement Normal de D6\" maximum, ou de 6\" maximum si c'est une unité PHOBOS ou SCOUT SQUAD.")
    ]
  }),

  /* ----- FORCE OPÉRATIONNELLE DE POINTE DE LANCE (Spearpoint Task Force) — White Scars
     Traduit depuis la fiche anglaise (noms français des stratagèmes : traduction) ----- */
  pointeDeLance: det("force-operationnelle-de-pointe-de-lance", "Force Opérationnelle de Pointe de Lance", 2, ["reconnaissance"], [
    optx("sagesse-des-devins-d-orage", "Sagesse des Devins d'Orage", 15,
      "Figurine ADEPTUS ASTARTES uniquement. Cette unité peut relancer ses jets d'Avance."),
    optx("maitre-de-chasse-chogorien", "Maître de Chasse Chogorien", 20,
      "Unité ADEPTUS ASTARTES MOUNTED ou SPEEDER uniquement. Quand cette unité est choisie pour faire un mouvement d'arrivée, considérez que le numéro du round de bataille en cours est supérieur de 1.", "amelioration"),
    optx("oeil-du-chasseur", "Œil du Chasseur", 25,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques de tir de cette unité ont [IGNORE LE COUVERT] et [TOUCHES SOUTENUES 1]."),
    optx("parangon-de-pointe-de-lance", "Parangon de Pointe de Lance", 25,
      "Figurine ADEPTUS ASTARTES uniquement. Les attaques de mêlée de cette figurine ont +1 en Force et leur Pénétration d'Armure est améliorée de 1 ; ou, si cette unité a fait un mouvement de charge à ce tour, +2 en Force et Pénétration d'Armure améliorée de 2.")
  ], null, {
    nameEn: "Spearpoint Task Force",
    ruleName: "Assaut Vif comme l'Orage",
    rule: [
      "• Vous pouvez choisir la Doctrine d'Assaut ou la Doctrine Tactique une fois de plus par bataille.",
      "• Les unités ADEPTUS ASTARTES MOUNTED et SPEEDER amies ont +1 aux jets d'Avance.",
      "Les unités SUBODEN KHAN amies ont l'aptitude suivante :",
      "__Colère du Premier Khan__ : à la fin de la phase de Combat, si cette unité était éligible pour combattre à cette phase, vous pouvez utiliser cette aptitude. Si elle n'est pas engagée, elle peut faire un Mouvement Normal ; si elle est engagée, elle peut faire une Retraite.",
      restrictionChapitre("WHITE SCARS")
    ],
    stratagems: [
      en(strat("manoeuvres-evasives", "Manœuvres Évasives", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES MOUNTED ou SPEEDER de votre armée.",
        "Cette unité ADEPTUS ASTARTES MOUNTED ou SPEEDER.",
        "Les attaques de tir qui ciblent votre unité ont -1 au jet de blessure."), "Evasive Manoeuvres"),
      en(strat("letalite-mobile", "Létalité Mobile", 1, [M.vousMvt],
        "Votre phase de Mouvement, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour faire une Avance ou une Retraite.",
        "Cette unité ADEPTUS ASTARTES.",
        "Cette Retraite ne l'empêche pas d'être éligible pour tirer, et les attaques de tir de votre unité ont [ASSAUT]."), "Mobile Lethality"),
      en(strat("cavaliers-sans-faille", "Cavaliers sans Faille", 1, [M.vousMvt, M.vousCharge],
        "Votre phase de Mouvement ou de Charge, quand une unité ADEPTUS ASTARTES MOUNTED de votre armée est choisie pour se déplacer ou déclarer une charge.",
        "Cette unité ADEPTUS ASTARTES MOUNTED.",
        "Votre unité a le mot-clé MOBILE."), "Flawless Riders"),
      en(strat("coup-de-lance-et-revers-de-sabre", "Coup de Lance et Revers de Sabre", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont, au choix, [TOUCHES FATALES] ou [LANCE] ; si c'est une unité MOUNTED, elles ont [TOUCHES FATALES] et [LANCE]."), "Spear Thrust and Sabre Swing"),
      en(strat("repli-et-regroupement", "Repli et Regroupement", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité ADEPTUS ASTARTES MOUNTED ou SPEEDER non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."), "Withdraw and Regroup"),
      en(strat("instincts-du-chasseur-strat", "Instincts du Chasseur", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY, MOUNTED ou SPEEDER non engagée de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY, MOUNTED ou SPEEDER.",
        "Votre unité peut faire un Mouvement Normal de D3+3\" maximum."), "Hunter's Instincts")
    ]
  })
};

Factions.register({
  id: "space-marines",
  name: "Space Marines",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT],
  detachments: [
    C.confrerieDAssaut, SM.lameDUltramar, SM.sentinellesDeCeramite, C.appuiDeLaDeathwatch,
    C.confrerieDevastator, SM.chercheursDuPereDeLaForge, C.ceste, C.gladius,
    C.briseuseGravis, C.siegeGravis, C.championsCuirasses, C.delugeDAcier,
    SM.colereDeMedusa, C.furtivePhobos, C.chocPhobos, SM.serreDesOmbres,
    SM.pointeDeLance, C.lanceDeLOrage, C.confrerieTactique, C.attaqueTacticus,
    C.tempeteDeFeu, C.assautTerminator
  ]
});

/* ---------------------------------------------------------
   BLOOD ANGELS — détachements propres, puis ordre du tableau
   --------------------------------------------------------- */

const RESTRICTION_BA = restrictionChapitre("BLOOD ANGELS");

const BA = {

  /* ----- HÉRITIERS ANGÉLIQUES (Angelic Inheritors) — 3 PDD ----- */
  heritiersAngeliques: det("heritiers-angeliques", "Héritiers Angéliques", 3, ["priority-assets", "purge-the-foe"], [
    opt("icone-ardente", "Icône Ardente", 20),
    opt("sacrifice-ordonne", "Sacrifice Ordonné", 25),
    opt("eclair-de-prescience", "Éclair de Prescience", 25),
    opt("jusqu-a-la-mort", "Jusqu'à la Mort", 15)
  ], null, {
    nameEn: "Angelic Inheritors",
    rule: [
      "Les unités BLOOD ANGELS CHARACTER amies peuvent relancer les jets de touche de 1 et les jets de blessure de 1.",
      RESTRICTION_BA
    ],
    stratagems: [
      // Coût absent de la fiche : 1 PC par défaut, à confirmer
      strat("dans-l-ombre-de-grandes-ailes", "Dans l'Ombre de Grandes Ailes", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité ADEPTUS ASTARTES CHARACTER de votre armée.",
        "Cette unité ADEPTUS ASTARTES CHARACTER.",
        "Votre unité a Discrétion et -3\" en portée de détection. (Coût en PC absent de la fiche : à confirmer.)"),
      strat("dans-les-cieux-embrases", "Dans les Cieux Embrasés", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité THE SANGUINOR ou ADEPTUS ASTARTES JUMP PACK non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques."),
      strat("frapper-maintenant-pour-la-gloire", "Frapper Maintenant pour la Gloire", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de tir de votre unité ont [TOUCHES SOUTENUES 1]."),
      strat("fureur-concentree", "Fureur Concentrée", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont [TOUCHES FATALES] ; si c'est une unité CHARACTER, elles ont [TOUCHES FATALES] et [LANCE]."),
      strat("instant-de-grace", "Instant de Grâce", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES INFANTRY de votre armée.",
        "Votre unité a le mot-clé CHARACTER jusqu'au début de votre prochaine phase de Commandement."),
      strat("stratege-mesure", "Stratège Mesuré", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES CHARACTER de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement.")
    ]
  }),

  /* ----- POINTE DE LANCE CARMIN (Encarmine Speartip) ----- */
  pointeDeLanceCarmin: det("pointe-de-lance-carmin", "Pointe de Lance Carmin", 1, ["disruption"], [
    opt("executeur-angelique", "Exécuteur Angélique", 20),
    opt("ombre-de-l-abomination", "Ombre de l'Abomination", 15)
  ], null, {
    nameEn: "Encarmine Speartip",
    rule: [
      "La Doctrine Tactique est active pour les unités SANGUINARY GUARD amies, en plus de toute autre doctrine de combat.",
      RESTRICTION_BA
    ],
    stratagems: [
      strat("eclats-vengeurs-et-aveuglants", "Éclats Vengeurs et Aveuglants", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité SANGUINARY GUARD de votre armée.",
        "Cette unité SANGUINARY GUARD.",
        "Votre unité a Discrétion et -3\" en portée de détection."),
      strat("jugement-de-l-ost-dore", "Jugement de l'Ost Doré", 1, [M.vousCharge],
        "Votre phase de Charge, quand une unité SANGUINARY GUARD de votre armée finit un mouvement de charge.",
        "Cette unité SANGUINARY GUARD.",
        "Choisissez 1 unité ennemie engagée avec votre unité, et lancez 1D6 pour chaque figurine de votre unité engagée avec elle : pour chaque 3+, cette unité ennemie subit 1 blessure mortelle."),
      strat("vertu-inexorable", "Vertu Inexorable", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie qui était engagée avec une unité SANGUINARY GUARD de votre armée finit une Retraite, si cette unité SANGUINARY GUARD n'est plus engagée.",
        "Cette unité SANGUINARY GUARD.",
        "Votre unité peut faire un Mouvement Normal de D3+3\" maximum.")
    ]
  }),

  /* ----- COLÈRE DES CONDAMNÉS (Wrath of the Doomed) ----- */
  colereDesCondamnes: det("colere-des-condamnes", "Colère des Condamnés", 1, ["purge-the-foe"], [
    opt("interception-instinctive", "Interception Instinctive", 10),
    opt("sur-le-pont-de-l-architraitre", "Sur le Pont de l'Architraître", 20)
  ], null, {
    nameEn: "Wrath of the Doomed",
    rule: [
      "Les unités DEATH COMPANY amies ont ce qui suit :",
      "• au début de chaque phase, la Doctrine d'Assaut est active pour cette unité ;",
      "• la Doctrine Devastator et la Doctrine Tactique ne peuvent pas être actives pour cette unité.",
      "Quelles que soient les autres règles, les unités DEATH COMPANY ne peuvent donc jamais avoir d'autre doctrine active que la Doctrine d'Assaut.",
      RESTRICTION_BA
    ],
    stratagems: [
      strat("la-mort-engendre-la-vengeance", "La Mort Engendre la Vengeance", 1, [M.tout],
        "N'importe quelle phase, quand une unité DEATH COMPANY de votre armée est détruite par une unité ennemie.",
        "Cette unité ennemie.",
        "Elle est __haïe__ jusqu'à la fin de la bataille. Tant qu'une unité est haïe, les attaques des unités DEATH COMPANY amies qui la ciblent ont +1 au jet de blessure."),
      strat("le-chatiment-ne-peut-etre-entrave", "Le Châtiment ne peut être Entravé", 1, [M.vousMvt, M.vousCharge],
        "Votre phase de Mouvement ou de Charge, quand une unité DEATH COMPANY DREADNOUGHT de votre armée est choisie pour faire un Mouvement Normal, une Avance ou une charge.",
        "Cette unité DEATH COMPANY DREADNOUGHT.",
        "Votre unité a le mot-clé MOBILE."),
      strat("riposte-rageuse", "Riposte Rageuse", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie qui a ciblé une unité DEATH COMPANY non engagée de votre armée a tiré.",
        "Cette unité DEATH COMPANY.",
        "Votre unité peut faire un mouvement d'Élan de D6\" maximum.")
    ]
  })
};

Factions.register({
  id: "blood-angels",
  name: "Blood Angels",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT],
  detachments: [
    BA.heritiersAngeliques, C.confrerieDAssaut, C.appuiDeLaDeathwatch, C.confrerieDevastator,
    BA.pointeDeLanceCarmin, C.ceste, C.gladius, C.briseuseGravis,
    C.siegeGravis, C.championsCuirasses, C.delugeDAcier, C.furtivePhobos,
    C.chocPhobos, C.lanceDeLOrage, C.confrerieTactique, C.attaqueTacticus,
    C.tempeteDeFeu, C.assautTerminator, BA.colereDesCondamnes
  ]
});


/* ---------------------------------------------------------
   BLACK TEMPLARS — détachements propres, puis ordre du tableau
   --------------------------------------------------------- */

// Règle d'armée propre aux Black Templars (en plus des Doctrines de Combat)
const HERITIERS_DE_SIGISMUND = {
  id: "heritiers-de-sigismund", name: "Héritiers de Sigismund", nameEn: "Heirs of Sigismund",
  text: [
    "• Votre armée ne peut inclure aucune figurine ADEPTUS ASTARTES PSYKER.",
    "• Votre armée ne peut inclure aucune des fiches techniques suivantes du Codex Space Marines : GLADIATOR LANCER, GLADIATOR REAPER, GLADIATOR VALIANT, IMPULSOR, REPULSOR, REPULSOR EXECUTIONER."
  ]
};

const BT = {

  /* ----- POING DE L'EMPEREUR-DIEU (Fist of the God-Emperor) ----- */
  poingDeLEmpereurDieu: det("poing-de-l-empereur-dieu", "Poing de l'Empereur-Dieu", 1, ["take-and-hold"], [
    opt("parangon-du-serment", "Parangon du Serment", 10),
    amelio("ferveur-du-juste", "Ferveur du Juste", 15)
  ], null, {
    nameEn: "Fist of the God-Emperor",
    rule: [
      "Chaque fois qu'une unité CRUSADER SQUAD amie fait un mouvement d'Élan, au lieu de choisir une cible d'Élan, vous pouvez choisir l'objectif le plus proche d'elle. Pour ce mouvement d'Élan, chacune de ses figurines doit finir aussi près que possible de l'objectif choisi.",
      restrictionChapitre("BLACK TEMPLARS")
    ],
    stratagems: [
      strat("anges-reveches", "Anges Revêches", 1, [M.advTir, M.combat],
        "Phase de Tir adverse ou phase de Combat, quand une unité ennemie choisit pour cible une unité CRUSADER SQUAD de votre armée.",
        "Cette unité CRUSADER SQUAD.",
        "Les attaques qui ciblent votre unité ont -1 au jet de blessure si leur Force est supérieure à son Endurance."),
      strat("destruction-appelee", "Destruction Appelée", 1, [M.combat],
        "Phase de Combat, quand une unité CRUSADER SQUAD de votre armée est choisie pour combattre.",
        "Cette unité CRUSADER SQUAD.",
        "Les attaques de mêlée de votre unité ont, au choix, [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1]."),
      strat("flexibilite-doctrinaire", "Flexibilité Doctrinaire", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité CRUSADER SQUAD de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement.")
    ]
  }),

  /* ----- MAISONNÉE DU SÉNÉCHAL (Marshal's Household) ----- */
  maisonneeDuSenechal: det("maisonnee-du-senechal", "Maisonnée du Sénéchal", 1, ["priority-assets"], [
    amelio("modeles-de-ferveur", "Modèles de Ferveur", 10),
    amelio("legataires-de-sigismund", "Légataires de Sigismund", 15)
  ], null, {
    nameEn: "Marshal's Household",
    rule: [
      "À la phase de Combat, si une unité SWORD BRETHREN amie est à portée d'un objectif, ses attaques de mêlée ont +1 en Attaques.",
      restrictionChapitre("BLACK TEMPLARS")
    ],
    stratagems: [
      strat("execution-sans-merci", "Exécution sans Merci", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie engagée avec une unité SWORD BRETHREN de votre armée est choisie pour Battre en Retraite.",
        "Cette unité SWORD BRETHREN.",
        "Cette unité ennemie doit utiliser le mode Fuite Désespérée pour sa Retraite, avec -1 à ses jets de risque si elle est Ébranlée."),
      strat("lame-de-la-detestation", "Lame de la Détestation", 1, [M.vousCharge],
        "Votre phase de Charge, quand une unité SWORD BRETHREN de votre armée finit un mouvement de charge.",
        "Cette unité SWORD BRETHREN.",
        "Choisissez 1 unité ennemie engagée avec votre unité, et lancez 1D6 pour chaque figurine de votre unité engagée avec elle : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle (6 blessures mortelles maximum)."),
      strat("tueur-d-abominations", "Tueur d'Abominations", 1, [M.combat],
        "Phase de Combat, quand une unité SWORD BRETHREN de votre armée est choisie pour combattre.",
        "Cette unité SWORD BRETHREN.",
        "Les attaques de mêlée de votre unité qui ciblent une unité MONSTER ou VEHICLE ont +2 en Force.")
    ]
  }),

  /* ----- CROISÉS LIGES DU VŒU (Vow-Sworn Crusaders) — 2 PDD ----- */
  croisesLigesDuVoeu: det("croises-liges-du-voeu", "Croisés Liges du Vœu", 2, ["purge-the-foe"], [
    opt("servo-ost-d-augures", "Servo-ost d'Augures", 20),
    opt("aura-consecratrice", "Aura Consécratrice", 20),
    opt("animus-incendiaire", "Animus Incendiaire", 25),
    opt("eclaireur-zele", "Éclaireur Zélé", 25)
  ], null, {
    nameEn: "Vow-Sworn Crusaders",
    rule: [
      "Au début du premier round de bataille, vous pouvez choisir un des __Vœux__ suivants. Il est actif pour les unités ADEPTUS ASTARTES amies jusqu'à la fin de la bataille.",
      "__Abhorrez le Sorcier__ : les attaques de mêlée de cette unité qui ciblent une unité PSYKER ont [PRÉCISION] et [LANCE].",
      "__Relevez les Défis__ : les attaques de mêlée des unités amies qui ciblent une unité dont l'Endurance est supérieure à leur Force ont +1 au jet de blessure.",
      "__Défendez l'Honneur de l'Empereur__ : à la fin de votre phase de Mouvement, si une unité INFANTRY amie contrôle un objectif, celui-ci est sécurisé. Quand cette unité est choisie pour faire une Avance, cette Avance ne l'empêche pas d'être éligible pour commencer une action.",
      restrictionChapitre("BLACK TEMPLARS")
    ],
    stratagems: [
      strat("croises-effroyables", "Croisés Effroyables", 1, [M.advCharge],
        "Phase de Charge adverse, juste après qu'une unité ADEPTUS ASTARTES INFANTRY de votre armée a été choisie pour cible d'une charge.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "L'unité ennemie qui a déclaré cette charge fait un test d'Ébranlement, avec -1 à ce test."),
      strat("hostilite-pieuse", "Hostilité Pieuse", 1, [M.combat],
        "Phase de Combat, quand une unité CHAPLAIN ou JUDICIAR de votre armée est choisie pour combattre.",
        "Cette unité CHAPLAIN ou JUDICIAR.",
        "Jusqu'à la fin de la phase, les attaques de votre unité peuvent relancer les jets de touche de 1 ; contre les unités MONSTER ou VEHICLE, elles peuvent aussi relancer les jets de blessure de 1."),
      strat("l-heresie-engendre-le-chatiment", "L'Hérésie Engendre le Châtiment", 1, [M.advMvt],
        "Phase de Mouvement adverse, quand une unité ennemie finit un mouvement à 8\" ou moins d'une unité ADEPTUS ASTARTES INFANTRY de votre armée.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Votre unité peut faire un mouvement d'Élan de D6\" maximum."),
      strat("pieuse-offensive", "Pieuse Offensive", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour faire un mouvement d'Engagement ou de Consolidation.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Ce mouvement est de D3+3\" au lieu de 3\"."),
      strat("pour-l-honneur-de-l-empereur", "Pour l'Honneur de l'Empereur", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Jusqu'à la fin de la phase, les attaques de mêlée de votre unité ont [PRÉCISION]."),
      strat("souillure-de-l-impur", "Souillure de l'Impur", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES.",
        "Jusqu'à la fin de la phase, votre unité peut ignorer les modificateurs à sa CC, à sa CT et à ses jets de touche.")
    ]
  })
};

Factions.register({
  id: "black-templars",
  name: "Black Templars",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT, HERITIERS_DE_SIGISMUND],
  detachments: [
    C.confrerieDAssaut, C.appuiDeLaDeathwatch, C.confrerieDevastator, BT.poingDeLEmpereurDieu,
    C.ceste, C.briseuseGravis, C.siegeGravis, C.championsCuirasses,
    C.delugeDAcier, BT.maisonneeDuSenechal, C.furtivePhobos, C.chocPhobos,
    C.lanceDeLOrage, C.confrerieTactique, C.attaqueTacticus, C.tempeteDeFeu,
    C.assautTerminator, BT.croisesLigesDuVoeu
  ]
});


/* ---------------------------------------------------------
   DEATHWATCH — détachement propre, puis ordre du tableau
   (pas d'Appui de la Deathwatch : remplacé par Lance Noire)
   --------------------------------------------------------- */

// Règle d'armée propre à la Deathwatch (en plus des Doctrines de Combat)
const RECRUES_VETERANES = {
  id: "recrues-veteranes", name: "Recrues Vétéranes", nameEn: "Veteran Recruits",
  text: [
    "Votre armée ne peut inclure aucune des unités ADEPTUS ASTARTES suivantes :",
    "• SCOUT SQUAD ;",
    "• TERMINATOR SQUAD ;",
    "• TERMINATOR ASSAULT SQUAD."
  ]
};

const DW = {

  /* ----- FORCE OPÉRATIONNELLE LANCE NOIRE (Black Spear Task Force) — 3 PDD ----- */
  lanceNoire: det("force-operationnelle-lance-noire", "Force Opérationnelle Lance Noire", 3, ["priority-assets", "purge-the-foe"], [
    opt("balise-angelis-lance-noire", "Balise Angelis", 25),
    opt("la-clef-osseus", "La Clef Osseus (Aura)", 20),
    opt("voleuse-de-secrets", "Voleuse de Secrets", 10),
    opt("le-grimoire-d-ectoclades", "Le Grimoire d'Ectoclades", 15)
  ], null, {
    nameEn: "Black Spear Task Force",
    rule: [
      ...TACTIQUES_DE_MISSION,
      "__Restrictions__ : votre armée peut inclure des unités DEATHWATCH ADEPTUS ASTARTES, mais aucune unité ADEPTUS ASTARTES d'un autre Chapitre. À l'exception de KILL TEAM CASSIUS, votre armée ne peut inclure aucune unité DEATHWATCH des Agents de l'Imperium (Imperial Agents)."
    ],
    stratagems: [
      armureDuMepris("lance-noire"),
      munitionsDragonfire("lance-noire"),
      munitionsHellfire("lance-noire"),
      munitionsKraken("lance-noire"),
      strat("tactique-d-adaptation", "Tactique d'Adaptation", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."),
      strat("teleportation-de-terrain", "Téléportation de Terrain", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité ADEPTUS ASTARTES INFANTRY non engagée de votre armée.",
        "Placez votre unité en Réserves Stratégiques. Si c'est une unité KILL TEAM, elle a Frappe en Profondeur jusqu'à la fin de votre prochaine phase de Mouvement.")
    ]
  })
};

Factions.register({
  id: "deathwatch",
  name: "Deathwatch",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT, RECRUES_VETERANES],
  detachments: [
    C.confrerieDAssaut, DW.lanceNoire, C.confrerieDevastator, C.ceste,
    C.gladius, C.briseuseGravis, C.siegeGravis, C.championsCuirasses,
    C.delugeDAcier, C.furtivePhobos, C.chocPhobos, C.lanceDeLOrage,
    C.confrerieTactique, C.attaqueTacticus, C.tempeteDeFeu, C.assautTerminator
  ]
});


/* ---------------------------------------------------------
   DARK ANGELS — détachements propres, puis ordre du tableau
   --------------------------------------------------------- */

// Règles d'armée propres aux Dark Angels (en plus des Doctrines de Combat)
const LA_RAVENWING = {
  id: "la-ravenwing", name: "La Ravenwing", nameEn: "The Ravenwing",
  text: [
    "Les unités ADEPTUS ASTARTES amies suivantes ont le mot-clé RAVENWING :",
    "• les unités MOUNTED ;",
    "• les unités VEHICLE FLY."
  ]
};
const LA_DEATHWING = {
  id: "la-deathwing", name: "La Deathwing", nameEn: "The Deathwing",
  text: [
    "Les unités ADEPTUS ASTARTES amies suivantes ont le mot-clé DEATHWING :",
    "• les unités TERMINATOR ;",
    "• les unités BLADEGUARD ANCIENT, BLADEGUARD VETERAN SQUAD, STERNGUARD VETERAN SQUAD et VANGUARD VETERAN SQUAD WITH JUMP PACKS ;",
    "• les unités LAND RAIDER, LAND RAIDER CRUSADER, LAND RAIDER REDEEMER, REPULSOR et REPULSOR EXECUTIONER ;",
    "• les unités DREADNOUGHT."
  ]
};

const DA = {

  /* ----- POURSUITE DE SOMBREVOL (Darkflight Pursuit) ----- */
  poursuiteDeSombrevol: det("poursuite-de-sombrevol", "Poursuite de Sombrevol", 1, ["reconnaissance"], [
    amelio("batterie-noctiforgee", "Batterie Noctiforgée", 10),
    amelio("turbines-tenebreuses", "Turbines Ténébreuses", 15)
  ], null, {
    nameEn: "Darkflight Pursuit",
    rule: [
      "Les attaques de tir des unités RAVENWING FLY amies ont [IGNORE LE COUVERT].",
      "Les unités OUTRIDER SQUAD amies ont le mot-clé BATTLELINE.",
      restrictionChapitre("DARK ANGELS")
    ],
    stratagems: [
      strat("ailes-d-ombre", "Ailes d'Ombre", 1, [M.advTir],
        "Phase de Tir adverse, quand une unité ennemie choisit pour cible une unité RAVENWING FLY ou MOUNTED de votre armée.",
        "Cette unité RAVENWING.",
        "Votre unité a Discrétion."),
      strat("nous-sommes-la-vengeance", "Nous Sommes la Vengeance", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie qui a ciblé une unité RAVENWING FLY non engagée de votre armée a tiré.",
        "Cette unité RAVENWING FLY.",
        "Votre unité peut faire un Mouvement Normal de D3+3\" maximum."),
      strat("surveillance-aerienne", "Surveillance Aérienne", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité RAVENWING FLY de votre armée a tiré.",
        "Cette unité RAVENWING FLY.",
        "Les unités ennemies visibles et à 6\" ou moins de votre unité ont +3\" en portée de détection.")
    ]
  }),

  /* ----- FORCE OPÉRATIONNELLE DU CERCLE INTÉRIEUR (Inner Circle Task Force) ----- */
  cercleInterieur: det("force-operationnelle-du-cercle-interieur", "Force Opérationnelle du Cercle Intérieur", 1, ["priority-assets"], [
    opt("champion-de-la-deathwing", "Champion de la Deathwing", 20),
    opt("volonte-singuliere", "Volonté Singulière", 20)
  ], null, {
    nameEn: "Inner Circle Task Force",
    rule: [
      "À votre phase de Commandement, vous pouvez choisir 1 objectif : c'est votre __objectif voué__ jusqu'à votre prochaine phase de Commandement.",
      "Les attaques des unités DEATHWING INFANTRY amies qui ciblent une unité ennemie à portée de votre objectif voué ont +1 au jet de blessure.",
      restrictionChapitre("DARK ANGELS")
    ],
    stratagems: [
      strat("colere-du-lion", "Colère du Lion", 1, [M.vousCharge],
        "Votre phase de Charge, quand une unité DEATHWING de votre armée finit un mouvement de charge.",
        "Cette unité DEATHWING.",
        "Choisissez 1 unité ennemie engagée avec votre unité, et lancez 1D6 pour chaque figurine de votre unité engagée avec elle : pour chaque 3+, cette unité ennemie subit 1 blessure mortelle (6 blessures mortelles maximum)."),
      strat("le-devoir-jusqu-a-la-mort", "Le Devoir jusqu'à la Mort", 1, [M.combat],
        "Phase de Combat, quand une unité ennemie choisit pour cible une unité DEATHWING de votre armée.",
        "Cette unité DEATHWING.",
        "Chaque fois qu'une figurine de votre unité est détruite, si votre unité n'a pas encore été choisie pour combattre à cette phase, lancez 1D6 (+1 si votre unité est engagée avec une unité ennemie à portée de votre objectif voué) : sur 4+, ne la retirez pas. Elle est retirée une fois que votre unité a combattu, ou à la fin de la phase (selon ce qui arrive en premier)."),
      strat("teleportarium-relique", "Teleportarium Relique", 1, [M.vousMvt],
        "Votre phase de Mouvement, quand une unité DEATHWING de votre armée qui a Frappe en Profondeur est choisie pour faire un mouvement d'arrivée.",
        "Cette unité DEATHWING.",
        "Votre unité peut être placée à plus de 6\" horizontalement de toutes les unités ennemies (au lieu de plus de 8\"). Jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge.")
    ]
  }),

  /* ----- COLÈRE DU ROC (Wrath of the Rock) — 2 PDD — Unique : Terminator ----- */
  colereDuRoc: det("colere-du-roc", "Colère du Roc", 2, ["take-and-hold"], [
    opt("armes-antiques", "Armes Antiques", 20),
    opt("assaut-deathwing", "Assaut Deathwing", 15),
    opt("seigneur-de-la-ravenwing", "Seigneur de la Ravenwing", 15),
    opt("trempe-dans-les-combats-roc", "Trempé dans les Combats (Aura)", 10)
  ], "Terminator", {
    nameEn: "Wrath of the Rock",
    rule: [
      "Les attaques qui ciblent les unités ADEPTUS ASTARTES INFANTRY et MOUNTED amies ont -1 au jet de blessure si leur Force est supérieure à l'Endurance de la cible.",
      restrictionChapitre("DARK ANGELS")
    ],
    stratagems: [
      strat("chevaliers-de-fer", "Chevaliers de Fer", 1, [M.vousMvt, M.vousCharge],
        "Votre phase de Mouvement ou de Charge, quand une unité RAVENWING de votre armée est choisie pour se déplacer ou déclarer une charge.",
        "Cette unité RAVENWING.",
        "Votre unité a le mot-clé MOBILE."),
      strat("justice-ineluctable", "Justice Inéluctable", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES.",
        "Les attaques de mêlée de votre unité ont [PRÉCISION]."),
      strat("la-victoire-par-le-sacrifice", "La Victoire par le Sacrifice", 1, [M.tout],
        "N'importe quelle phase, quand une unité DEATHWING ou RAVENWING de votre armée à portée d'un objectif est détruite.",
        "Cette unité DEATHWING ou RAVENWING (elle peut être ciblée même si elle est détruite).",
        "Choisissez un objectif à portée duquel ne se trouve aucune unité ennemie (sauf AIRCRAFT) et que votre unité contrôlait à la fin de la phase précédente : il est sécurisé."),
      strat("maitrise-tactique", "Maîtrise Tactique", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité DEATHWING ou RAVENWING de votre armée.",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."),
      strat("reliques-du-moyen-age", "Reliques du Moyen-Âge", 1, [M.vousTir],
        "Votre phase de Tir, quand une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED de votre armée est choisie pour tirer.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Jusqu'à la fin de la phase, les attaques de tir de votre unité ont +2 en Force."),
      strat("volonte-du-lion", "Volonté du Lion", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée à portée d'un objectif.",
        "Jusqu'à la fin du tour, les figurines de votre unité ont +1 en Contrôle d'Objectif.")
    ]
  })
};

Factions.register({
  id: "dark-angels",
  name: "Dark Angels",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT, LA_RAVENWING, LA_DEATHWING],
  detachments: [
    C.confrerieDAssaut, DA.poursuiteDeSombrevol, C.appuiDeLaDeathwatch, C.confrerieDevastator,
    C.ceste, C.gladius, C.briseuseGravis, C.siegeGravis,
    DA.cercleInterieur, C.championsCuirasses, C.delugeDAcier, C.furtivePhobos,
    C.chocPhobos, C.lanceDeLOrage, C.confrerieTactique, C.attaqueTacticus,
    C.tempeteDeFeu, C.assautTerminator, DA.colereDuRoc
  ]
});


/* ---------------------------------------------------------
   SPACE WOLVES — détachements propres, puis ordre du tableau
   --------------------------------------------------------- */

// Règle des unités WULFEN (traduite depuis l'anglais)
const MALEDICTION_DES_WULFEN = {
  id: "malediction-des-wulfen", name: "Malédiction des Wulfen", nameEn: "Curse of the Wulfen",
  text: [
    "Tant que cette unité (WULFEN) est à 6\" ou moins d'une figurine SPACE WOLVES CHARACTER amie (sauf WULFEN) ou à 12\" ou moins d'une figurine WOLF PRIEST amie, si elle n'est pas Ébranlée :",
    "• si c'est une unité INFANTRY, elle a +1 en Contrôle d'Objectif ;",
    "• si c'est une unité VEHICLE, elle a +3 en Contrôle d'Objectif.",
    "__Formes Bestiales__ : pour la capacité de transport, chaque figurine WULFEN compte pour 2 figurines."
  ]
};

const SW = {

  /* ----- CHAMPIONS DE FENRIS (Champions of Fenris) — Unique : Terminator ----- */
  championsDeFenris: det("champions-de-fenris", "Champions de Fenris", 1, ["priority-assets"], [
    opt("un-geant-entre-tous", "Un Géant Entre Tous", 15),
    opt("tueur-de-proies", "Tueur de Proies", 15)
  ], "Terminator", {
    nameEn: "Champions of Fenris",
    rule: [
      "Les unités ADEPTUS ASTARTES CHARACTER amies ont l'aptitude suivante :",
      "__Contre-charge__ (une fois par round de bataille, par unité) : vous pouvez choisir cette unité pour cible du stratagème Intervention Héroïque ; cette utilisation coûte 1 PC de moins."
    ],
    stratagems: [
      strat("determination-heroique", "Détermination Héroïque", 2, [M.advTir],
        "Phase de Tir adverse, juste après qu'une unité SPACE WOLVES CHARACTER de votre armée a été choisie pour cible.",
        "Cette unité SPACE WOLVES CHARACTER.",
        "Jusqu'à la fin de la phase, les attaques qui ciblent votre unité ont -1 en Dégâts."),
      strat("direction-du-champion", "Direction du Champion", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES CHARACTER de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES CHARACTER.",
        "Jusqu'à la fin de la phase, les attaques de votre unité peuvent relancer les jets de touche de 1 et les jets de blessure de 1."),
      strat("naissance-d-une-saga", "Naissance d'une Saga", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée (sauf MONSTER et VEHICLE).",
        "Votre unité a le mot-clé CHARACTER jusqu'au début de votre prochaine phase de Commandement.")
    ]
  }),

  /* ----- SAGA DU TUEUR DE BÊTES (Saga of the Beastslayer) ----- */
  sagaDuTueurDeBetes: det("saga-du-tueur-de-betes", "Saga du Tueur de Bêtes", 1, ["purge-the-foe"], [
    opt("ruse-du-chasseur", "Ruse du Chasseur", 20),
    { ...opt("marque-du-loup", "Marque du Loup", 15), text: "Meneur : WULFEN, WULFEN WITH STORM SHIELDS. " + A_SAISIR }
  ], null, {
    nameEn: "Saga of the Beastslayer",
    rule: ["Les attaques des unités BLOOD CLAWS, THUNDERWOLF CAVALRY et WULFEN amies ont [TOUCHES FATALES : CHARACTER/MONSTER/VEHICLE]."],
    stratagems: [
      strat("ferocite-debridee", "Férocité Débridée", 1, [M.combat],
        "Phase de Combat, quand une unité BLOOD CLAWS, THUNDERWOLF CAVALRY ou WULFEN de votre armée est choisie pour combattre.",
        "Cette unité BLOOD CLAWS, THUNDERWOLF CAVALRY ou WULFEN.",
        "Les attaques de mêlée de votre unité ont [LANCE]."),
      strat("frappe-coordonnee", "Frappe Coordonnée", 1, [M.advCombat],
        "Fin de la phase de Combat adverse.",
        "1 unité BLOOD CLAWS, THUNDERWOLF CAVALRY ou WULFEN non engagée de votre armée, à 9\" ou moins d'un ou plusieurs bords du champ de bataille.",
        "Placez votre unité en Réserves Stratégiques."),
      strat("impetuosite", "Impétuosité", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie qui a ciblé une unité WULFEN, THUNDERWOLF CAVALRY ou BLOOD CLAWS non engagée de votre armée à cette phase a tiré.",
        "Cette unité WULFEN, THUNDERWOLF CAVALRY ou BLOOD CLAWS.",
        "Votre unité peut faire un mouvement d'Élan de D6\" maximum.")
    ]
  }),

  /* ----- SAGA DU LOUP SUPRÊME (Saga of the Great Wolf) — 2 PDD ----- */
  sagaDuLoupSupreme: det("saga-du-loup-supreme", "Saga du Loup Suprême", 2, ["take-and-hold"], [
    opt("chariots-de-l-orage", "Chariots de l'Orage", 25),
    opt("marque-de-grimnar", "Marque de Grimnar", 15),
    opt("hurlegueule", "Hurlegueule", 15),
    opt("predictions-du-skjald", "Prédictions du Skjald", 20)
  ], null, {
    nameEn: "Saga of the Great Wolf",
    ruleName: "Maître des Loups",
    rule: [
      "Les unités ADEPTUS ASTARTES amies (sauf MONSTER et VEHICLE) ont les aptitudes suivantes :",
      "__Mâchoires en Tenailles__ : si la Doctrine d'Assaut est active pour votre unité, elle a +1 aux jets d'Avance et aux jets de Charge.",
      "__Œil du Chasseur__ : si la Doctrine Devastator est active pour votre unité, ses attaques de tir peuvent relancer les jets de touche de 1.",
      "__Frappe Féroce__ : si la Doctrine Tactique est active pour votre unité, ses attaques qui ciblent une unité ennemie à 9\" ou moins ont [TOUCHES SOUTENUES 1].",
      "L'unité LOGAN GRIMNAR a l'aptitude suivante :",
      "__Offensive Hurlante__ (une fois par bataille, par armée) : à votre phase de Commandement, les unités ADEPTUS ASTARTES MONSTER et VEHICLE amies bénéficient de la règle Maître des Loups jusqu'au début de votre prochaine phase de Commandement."
    ],
    stratagems: [
      strat("ferocite-fenrisienne", "Férocité Fenrisienne", 1, [M.vousMvt, M.vousCharge],
        "Votre phase de Mouvement ou de Charge, quand une unité ADEPTUS ASTARTES WALKER ou MOUNTED de votre armée est choisie pour se déplacer ou déclarer une charge.",
        "Cette unité ADEPTUS ASTARTES WALKER ou MOUNTED.",
        "Votre unité a le mot-clé MOBILE."),
      strat("instincts-de-combat", "Instincts de Combat", 1, [M.advTir],
        "Phase de Tir adverse, après qu'une unité ennemie qui a ciblé une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED non engagée de votre armée a tiré.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Votre unité peut faire un Mouvement Normal de D3+3\" maximum."),
      strat("les-crocs-de-la-meute", "Les Crocs de la Meute", 1, [M.combat],
        "Phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED de votre armée est choisie pour combattre.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Les attaques de mêlée de votre unité ont [PRÉCISION]."),
      strat("oeil-de-la-meute", "Œil de la Meute", 1, [M.vousTir, M.combat],
        "Votre phase de Tir ou phase de Combat, quand une unité ADEPTUS ASTARTES INFANTRY de votre armée est choisie pour attaquer.",
        "Cette unité ADEPTUS ASTARTES INFANTRY.",
        "Les attaques de votre unité peuvent relancer les jets de blessure de 1 et de 2."),
      strat("ordres-de-grimnar", "Ordres de Grimnar", 1, [M.vousCmd],
        "Votre phase de Commandement.",
        "1 unité ADEPTUS ASTARTES de votre armée (sauf MONSTER et VEHICLE).",
        "Choisissez 1 doctrine de combat : elle est active pour votre unité jusqu'au début de votre prochaine phase de Commandement."),
      strat("totems-loups", "Totems Loups", 1, [M.tout],
        "N'importe quelle phase, quand une unité ADEPTUS ASTARTES INFANTRY ou MOUNTED de votre armée subit une blessure mortelle.",
        "Cette unité ADEPTUS ASTARTES INFANTRY ou MOUNTED.",
        "Votre unité a Insensibilité à la Douleur 5+ contre les blessures mortelles.")
    ]
  })
};

Factions.register({
  id: "space-wolves",
  name: "Space Wolves",
  keyword: "Adeptus Astartes",
  armyRules: [DOCTRINES_DE_COMBAT, MALEDICTION_DES_WULFEN],
  detachments: [
    C.confrerieDAssaut, SW.championsDeFenris, C.appuiDeLaDeathwatch, C.confrerieDevastator,
    C.ceste, C.gladius, C.briseuseGravis, C.siegeGravis,
    C.championsCuirasses, C.delugeDAcier, C.furtivePhobos, C.chocPhobos,
    SW.sagaDuTueurDeBetes, SW.sagaDuLoupSupreme, C.lanceDeLOrage, C.confrerieTactique,
    C.attaqueTacticus, C.tempeteDeFeu, C.assautTerminator
  ]
});

})();
