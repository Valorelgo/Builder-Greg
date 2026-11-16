/* =========================================================
   NECRONS — Données de faction
   Détachements, optimisations et stratagèmes en français ;
   unités, armes et mots-clés en anglais (comme les CSM).

   ÉTAT
   - Règle d'armée Protocoles de Réanimation : complète (les unités
     porteront armyRules: ["protocoles-de-reanimation"]).
   - 12 détachements : complets (règles, 42 optimisations, 63 stratagèmes).
   - « Tétrarque » = Overlord et « Console de Commandement » = Catacomb
     Command Barge (supposés) ; « Mécanoptères » = Tomb Blades (confirmé).
   - Non gérés par le moteur (texte seulement) : +2 en Force des autres
     Necrons après une destruction (Légion Maudite).
   - Optimisation obligatoire des C'tan (Panthéon de Malheur) : vérifiée
     (mandatoryEnhancement).
   - Légion Maudite : +2 en Force des DESTROYER CULT calculé (weaponMods,
     js/regles-etendues.js).
   - Arsenal Brise-Astres : [ASSAUT] ajouté à tous les VEHICLE et MOUNTED,
     sans exclure les TITANIC (choix du joueur : pas de Titanesques saisis).
   - Unités : complètes (47 fiches) ; faction disponible dans catalog.js.
   - Restrictions « requires » : noms d'unités anglais supposés, à aligner
     sur les fiches quand elles seront saisies.

   Escortes (Tomb Crawlers, Cryptothralls) : retinue, rattachement géré par
   js/regles-etendues.js (une seule escorte par unité menée par un Cryptek).

   Rappels de format (voir aeldari.js pour des exemples complets) :
     enhancements[].kind : "optimisation" (personnage) ou "amelioration"
                           (unité, jusqu'à 3 exemplaires dans l'armée)
     exclusiveGroup      : détachements « Unique » (Dynastie, Hypercrypte)
   ========================================================= */

(() => {

Factions.register({
  id: "necrons",
  name: "Necrons",
  keyword: "Necrons",   // mot-clé requis par défaut pour toute unité

  // Suivis en partie (js/regles-etendues.js)
  trackers: [
    {
      id: "plasmacytes",
      type: "unitTokens",
      label: "Plasmacytes",
      wargear: "plasmacyte",
      hint: "Une fois par bataille et par Plasmacyte : quand l'unité est choisie pour combattre, ses armes de mêlée ont [BLESSURES DÉVASTATRICES] jusqu'à la fin de la phase."
    }
  ],

  armyRules: [
    {
      id: "protocoles-de-reanimation",
      name: "Protocoles de Réanimation",
      nameEn: "Reanimation Protocols",
      text: [
        "Si la Faction d'Armée de votre armée est NECRONS, à la fin de votre phase de Commandement, chaque unité amie qui a cette aptitude et qui est sur le champ de bataille active ses Protocoles de Réanimation.",
        "Quand les Protocoles de Réanimation d'une unité s'activent, cette unité récupère D3 PV."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       ARSENAL BRISE-ASTRES (Starshatter Arsenal)
       [ASSAUT] des VEHICLE et MOUNTED : weaponAbilities[].to. L'exclusion
       des TITANIC n'est pas gérée (pas de Titanesques dans cette armée).
       « Tétrarque ou Console de Commandement » : Overlord / Catacomb
       Command Barge supposés, à confirmer.
       ------------------------------------------------------- */
    {
      id: "arsenal-brise-astres",
      name: "Arsenal Brise-Astres",
      cost: 3,
      dispositions: ["priority-assets", "purge-the-foe"],

      weaponAbilities: [{ type: "ranged", ability: "assault", to: [["Vehicle"], ["Mounted"]] }],

      rule: {
        name: null,
        text: [
          "Chaque fois qu'une figurine NECRONS de votre armée (sauf MONSTER) fait une attaque qui cible une unité à portée d'un ou plusieurs pions objectifs, ajoutez 1 au jet de touche.",
          "De plus, les armes de tir des figurines NECRONS VEHICLE et NECRONS MOUNTED de votre armée (sauf TITANIC) ont [ASSAUT]."
        ]
      },

      enhancements: [
        {
          id: "champs-de-chrono-impedance",
          name: "Champs de Chrono-impédance",
          cost: 25,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "À votre phase de Commandement, choisissez 1 unité NECRONS VEHICLE ou NECRONS MOUNTED amie (sauf TITANIC) à 6\" ou moins du porteur. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une attaque cible une figurine de cette unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque."
        },
        {
          id: "noble-exigeant",
          name: "Noble Exigeant",
          cost: 10,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "À votre phase de Commandement, choisissez 1 unité NECRONS VEHICLE ou NECRONS MOUNTED amie (sauf TITANIC) à 6\" ou moins du porteur. Jusqu'au début de votre prochaine phase de Commandement, elle est éligible pour tirer à un tour où elle a Battu en Retraite."
        },
        {
          id: "majeste-effroyable",
          name: "Majesté Effroyable (Aura)",
          cost: 30,
          kind: "optimisation",
          requires: [["Overlord"], ["Catacomb Command Barge"]],   // « Tétrarque ou Console de Commandement » : à confirmer
          text: "Tant qu'une unité NECRONS amie (sauf MONSTER et TITANIC) est à 6\" ou moins du porteur, chaque fois qu'une de ses figurines attaque, relancez un jet de touche de 1 et un jet de blessure de 1."
        },
        {
          id: "nebuloscope-miniaturise",
          name: "Nébuloscope Miniaturisé",
          cost: 15,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Les armes de l'unité du porteur ont [IGNORE LE COUVERT]."
        }
      ],

      stratagems: [
        {
          id: "chronodecalage",
          name: "Chronodécalage",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité NECRONS VEHICLE ou NECRONS MOUNTED de votre armée (sauf TITANIC) pas encore choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin de la phase, si elle Avance, ne lancez pas de dé : ajoutez 6\" à son Mouvement."
        },
        {
          id: "enveloppes-inflexibles",
          name: "Enveloppes Inflexibles",
          cp: 2,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité NECRONS VEHICLE ou NECRONS MOUNTED de votre armée (sauf TITANIC) choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."
        },
        {
          id: "recuperation-impitoyable",
          name: "Récupération Impitoyable",
          cp: 2,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et TITANIC) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité à portée d'un ou plusieurs pions objectifs, ajoutez 1 au jet de blessure."
        },
        {
          id: "repositionnement-reactif",
          name: "Repositionnement Réactif",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et TITANIC) ciblée par une ou plusieurs de ces attaques.",
          effet: "Elle peut faire un Mouvement Normal de D6\" maximum."
        },
        {
          id: "servitude-sans-fin",
          name: "Servitude sans Fin",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "combat" }],
          quand: "Fin de votre phase de Combat.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et TITANIC) à portée d'un ou plusieurs pions objectifs que vous contrôlez.",
          effet: "Ses Protocoles de Réanimation s'activent."
        },
        {
          id: "tunnel-dimensionnel",
          name: "Tunnel Dimensionnel",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité NECRONS VEHICLE ou NECRONS MOUNTED de votre armée (sauf TITANIC) pas encore choisie pour se déplacer à cette phase.",
          effet: "Jusqu'à la fin de la phase, elle peut traverser horizontalement les figurines et les éléments de terrain."
        }
      ]
    },

    /* -------------------------------------------------------
       CONCLAVE DE CRYPTEKS (Cryptek Conclave)
       Règle « Augmentations Technosorcières » (nom cité par Pouvoir
       Inexploité et Désintégrateurs Atomiques).
       [ASSAUT] des CRYPTEK : weaponAbilities[].to.
       ------------------------------------------------------- */
    {
      id: "conclave-de-crypteks",
      name: "Conclave de Crypteks",
      cost: 2,
      dispositions: ["priority-assets"],

      weaponAbilities: [{ type: "ranged", ability: "assault", to: [["Cryptek"]] }],

      rule: {
        name: "Augmentations Technosorcières",
        text: [
          "Les armes de tir des figurines CRYPTEK de votre armée ont [ASSAUT].",
          "À votre phase de Tir, chaque fois qu'une unité CRYPTEK de votre armée est choisie pour tirer, choisissez une des aptitudes suivantes : [ANTI-INFANTERIE 3+], [ANTI-MONTÉ 4+], [ASSAUT], [LOURD] ou [IGNORE LE COUVERT]. Jusqu'à la fin de la phase, les armes de tir des figurines de cette unité ont l'aptitude choisie."
        ]
      },

      enhancements: [
        {
          id: "desintegrateurs-atomiques",
          name: "Désintégrateurs Atomiques",
          cost: 10,
          kind: "optimisation",
          requires: [["Cryptek"]],
          text: "À votre phase de Tir, chaque fois que l'unité du porteur est choisie pour tirer, quand vous choisissez une aptitude pour les Augmentations Technosorcières, vous pouvez aussi choisir parmi [ANTI-MONSTRE 5+] et [ANTI-VÉHICULE 5+]."
        },
        {
          id: "gantelet-de-compression",
          name: "Gantelet de Compression",
          cost: 20,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Ajoutez 6\" à la portée des armes de tir des figurines de l'unité du porteur."
        },
        {
          id: "bolas-gravitiques",
          name: "Bolas Gravitiques",
          cost: 15,
          kind: "optimisation",
          requires: [["Cryptek"]],
          text: "À votre phase de Tir, après que le porteur a tiré, choisissez 1 unité ennemie (sauf TITANIC) touchée par une ou plusieurs de ces attaques. Jusqu'au début de votre prochain tour, elle est entravée : soustrayez 2 à sa caractéristique de Mouvement et 2 à ses jets de Charge."
        },
        {
          id: "boulier-quantique",
          name: "Boulier Quantique",
          cost: 15,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Chaque fois que vous ciblez l'unité du porteur avec un stratagème, lancez 1D6 (+1 si elle est à portée d'un ou plusieurs pions objectifs) : sur 4+, vous gagnez 1 PC."
        }
      ],

      stratagems: [
        {
          id: "ciblage-moleculaire",
          name: "Ciblage Moléculaire",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité NECRONS de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, vous pouvez ignorer tout ou partie des modificateurs à la CT ou à la CC de l'attaque et au jet de touche. Si c'est une unité CRYPTEK, vous pouvez aussi ignorer tout ou partie des modificateurs au jet de blessure."
        },
        {
          id: "malediction-spirituelle",
          name: "Malédiction Spirituelle",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a tiré ou combattu.",
          cible: "1 figurine CRYPTEK de votre armée détruite par une attaque de cette unité (le stratagème peut être utilisé même si elle vient d'être détruite).",
          effet: "Jusqu'à la fin de la bataille, chaque fois qu'une figurine NECRONS amie fait une attaque qui cible l'unité attaquante, vous pouvez relancer le jet de touche."
        },
        {
          id: "nuee-de-microscarabees",
          name: "Nuée de Microscarabées",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité CRYPTEK INFANTRY de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, si votre unité a le mot-clé NECRON WARRIORS, ses figurines ont une sauvegarde invulnérable de 5+. Si elle a le mot-clé IMMORTALS, ses figurines ont une sauvegarde invulnérable de 4+."
        },
        {
          id: "pouvoir-inexploite",
          name: "Pouvoir Inexploité",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité CRYPTEK de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, quand votre unité est choisie pour tirer et que vous choisissez une aptitude pour les Augmentations Technosorcières, vous pouvez en choisir une supplémentaire parmi celles disponibles."
        },
        {
          id: "renforcement-synergetique",
          name: "Renforcement Synergétique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Début de votre phase de Tir.",
          cible: "1 unité CRYPTEK de votre armée.",
          effet: "Choisissez 1 figurine NECRONS amie (sauf MONSTER et VEHICLE) à 12\" ou moins d'une figurine CRYPTEK de votre unité. Jusqu'à la fin de la phase, cette figurine a le mot-clé CRYPTEK."
        },
        {
          id: "siphon-des-possibles",
          name: "Siphon des Possibles",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "commandement" }],
          quand: "Phase de Commandement adverse.",
          cible: "1 unité NECRONS de votre armée à portée d'un ou plusieurs pions objectifs.",
          effet: "Ses Protocoles de Réanimation s'activent. Si c'est une unité CRYPTEK, elle récupère 1 PV supplémentaire."
        }
      ]
    },

    /* -------------------------------------------------------
       COUR CANOPTEK (Canoptek Court)
       « Matrice de Pouvoir » (règle) et « Matrice Énergétique »
       (stratagèmes) désignent la même zone : harmonisé en Matrice de Pouvoir.
       ------------------------------------------------------- */
    {
      id: "cour-canoptek",
      name: "Cour Canoptek",
      cost: 2,
      dispositions: ["take-and-hold"],

      rule: {
        name: "Matrice de Pouvoir",
        text: [
          "Votre Matrice de Pouvoir comprend votre zone de déploiement, ainsi que :",
          "• le no man's land, si vous y contrôlez au moins la moitié des pions objectifs au début de la phase ;",
          "• la zone de déploiement adverse, si vous y contrôlez au moins la moitié des pions objectifs au début de la phase.",
          "Chaque fois qu'une figurine CANOPTEK ou CRYPTEK de votre armée attaque, relancez un jet de touche de 1. Si son unité est entièrement dans votre Matrice de Pouvoir, vous pouvez relancer le jet de touche à la place."
        ]
      },

      enhancements: [
        {
          id: "autodivinateur",
          name: "Autodivinateur",
          cost: 15,
          kind: "optimisation",
          requires: [["Cryptek"]],
          text: "Chaque fois que votre adversaire gagne 1 PC grâce à une aptitude, lancez 1D6 : sur 2+, vous gagnez 1 PC."
        },
        {
          id: "sanctuaire-dimensionnel",
          name: "Sanctuaire Dimensionnel",
          cost: 20,
          kind: "optimisation",
          requires: [["Cryptek"]],
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont l'aptitude Infiltrateurs."
        },
        {
          id: "moyeu-hyperphasique",
          name: "Moyeu Hyperphasique",
          cost: 15,
          kind: "optimisation",
          requires: [["Cryptek"]],
          text: "Tant que l'unité du porteur est entièrement dans votre Matrice de Pouvoir, chaque fois qu'une figurine de cette unité attaque, relancez un jet de blessure de 1."
        },
        {
          id: "gaze-tesla-metallodermique",
          name: "Gaze Tesla Métallodermique",
          cost: 10,
          kind: "optimisation",
          requires: [["Cryptek"]],
          text: "Une fois par phase, quand une unité ennemie déclare une charge qui cible l'unité du porteur, lancez 1D6 : sur 2+, cette unité ennemie subit D3 blessures mortelles (3 blessures mortelles sur un 6)."
        }
      ],

      stratagems: [
        {
          id: "apparence-suboptimale",
          name: "Apparence Suboptimale",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "charge" }],
          quand: "Phase de Charge adverse, juste après qu'une unité ennemie a déclaré une charge.",
          cible: "1 unité CANOPTEK de votre armée entièrement dans votre Matrice de Pouvoir, choisie pour cible de cette charge.",
          effet: "Ses Protocoles de Réanimation s'activent."
        },
        {
          id: "decalage-contratemporel",
          name: "Décalage Contratemporel",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité CANOPTEK de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, votre unité ne peut être ciblée par une attaque de tir que si la figurine attaquante est à 18\" ou moins."
        },
        {
          id: "focalisation-eradicatrice",
          name: "Focalisation Éradicatrice",
          cp: 2,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Début de votre phase de Tir ou de la phase de Combat.",
          cible: "1 unité CANOPTEK ou CRYPTEK de votre armée entièrement dans votre Matrice de Pouvoir.",
          effet: "Jusqu'à la fin de la phase, les armes de ses figurines CANOPTEK et CRYPTEK ont [BLESSURES DÉVASTATRICES]."
        },
        {
          id: "impulsion-solaire",
          name: "Impulsion Solaire",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Début de votre phase de Tir.",
          cible: "1 figurine CRYPTEK de votre armée.",
          effet: "Choisissez 1 pion objectif à 18\" ou moins d'elle. Jusqu'à la fin de la phase, chaque fois qu'une figurine NECRONS de votre armée attaque une unité ennemie à portée de ce pion, l'attaque a [IGNORE LE COUVERT]."
        },
        {
          id: "malediction-du-cryptek",
          name: "Malédiction du Cryptek",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité CRYPTEK de votre armée a été détruite.",
          cible: "L'unité attaquante (unité ennemie).",
          effet: "Jusqu'à la fin de la bataille, chaque fois qu'une figurine CANOPTEK de votre armée attaque cette unité, ajoutez 1 au jet de touche et 1 au jet de blessure."
        },
        {
          id: "sous-routines-reactives",
          name: "Sous-routines Réactives",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité CANOPTEK de votre armée.",
          cible: "Cette unité CANOPTEK.",
          effet: "Elle peut faire un Mouvement Normal de 6\" maximum."
        }
      ]
    },

    /* -------------------------------------------------------
       DYNASTIE ÉVEILLÉE (Awakened Dynasty)
       Unique : Dynastie — exclusif avec Main de la Dynastie
       ------------------------------------------------------- */
    {
      id: "dynastie-eveillee",
      name: "Dynastie Éveillée",
      cost: 3,
      dispositions: ["take-and-hold", "priority-assets"],
      exclusiveGroup: "dynastie",

      rule: {
        name: null,
        text: [
          "Tant qu'une unité NECRONS de votre armée est menée par un ou plusieurs personnages NECRONS, chaque fois qu'une de ses figurines attaque, ajoutez 1 au jet de touche.",
          "Ce détachement a l'étiquette DYNASTIE : il ne peut pas être pris avec un autre détachement DYNASTIE."
        ]
      },

      enhancements: [
        {
          id: "lien-dermique-enaegique",
          name: "Lien Dermique Énægique",
          cost: 30,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Le porteur a l'aptitude Insensible à la Douleur 4+."
        },
        {
          id: "ecrin-du-royaume-du-neant",
          name: "Écrin du Royaume du Néant",
          cost: 20,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Tant que le porteur mène une unité, les figurines de cette unité ont l'aptitude Discrétion."
        },
        {
          id: "subjugateur-de-phase",
          name: "Subjugateur de Phase (Aura)",
          cost: 35,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Tant qu'une unité NECRONS amie (sauf CHARACTER) est à 6\" ou moins du porteur, chaque fois qu'une de ses figurines attaque, ajoutez 1 au jet de touche."
        },
        {
          id: "voile-de-tenebres",
          name: "Voile de Ténèbres",
          cost: 20,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          usage: "une-fois-par-bataille",
          text: "Une fois par bataille (pour toute l'armée), à la fin du tour adverse, si l'unité du porteur n'est pas engagée, vous pouvez utiliser cette aptitude :\n• placez cette unité en Réserves Stratégiques ;\n• elle a l'aptitude Frappe en Profondeur jusqu'au début de votre prochaine phase de Tir ;\n• elle doit arriver à votre prochaine phase de Mouvement (y compris pendant votre premier tour)."
        }
      ],

      stratagems: [
        {
          id: "protocole-de-la-tempete-soudaine",
          name: "Protocole de la Tempête Soudaine",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement.",
          cible: "1 unité NECRONS de votre armée.",
          effet: "Jusqu'à la fin du tour, ses armes de tir ont [ASSAUT]. Si elle est menée par un personnage NECRONS, vous pouvez aussi relancer ses jets d'Avance à cette phase."
        },
        {
          id: "protocole-des-legions-imperissables",
          name: "Protocole des Légions Impérissables",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une ou plusieurs figurines d'une unité NECRONS de votre armée ont été détruites par des attaques ennemies.",
          cible: "Cette unité NECRONS.",
          effet: "Ses Protocoles de Réanimation s'activent : elle récupère D3 PV (D3+1 si elle est menée par un personnage NECRONS)."
        },
        {
          id: "protocole-des-astres-vengeurs",
          name: "Protocole des Astres Vengeurs",
          cp: 2,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité NECRONS de votre armée a été détruite.",
          cible: "1 unité NECRONS CHARACTER de votre armée qui était à 6\" ou moins de l'unité détruite.",
          effet: "Elle peut tirer comme si c'était votre phase de Tir, mais doit cibler uniquement l'unité ennemie attaquante, et seulement si c'est une cible éligible."
        },
        {
          id: "protocole-du-neant-avide",
          name: "Protocole du Néant Avide",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité NECRONS de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, ajoutez 1 à la Force de ses armes de mêlée. Si elle est menée par un personnage NECRONS, améliorez aussi de 1 leur Pénétration d'Armure."
        },
        {
          id: "protocole-du-revenant-eternel",
          name: "Protocole du Revenant Éternel",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une figurine NECRONS INFANTRY CHARACTER de votre armée a été détruite.",
          cible: "Cette figurine.",
          effet: "À la fin de la phase, replacez-la sur le champ de bataille aussi près que possible de l'endroit où elle a été détruite et hors de portée d'engagement de toute unité ennemie, avec la moitié de ses PV de départ. Elle n'est plus rattachée à une unité : elle forme une unité d'un effectif initial de 1.",
          restrictions: "Une seule fois par bataille pour chaque figurine."
        },
        {
          id: "protocole-du-tyran-conquerant",
          name: "Protocole du Tyran Conquérant",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir.",
          cible: "1 unité NECRONS de votre armée pas encore choisie pour tirer à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une cible à mi-portée ou moins, relancez un jet de touche de 1. Si elle est menée par un personnage NECRONS, vous pouvez relancer le jet de touche à la place."
        }
      ]
    },

    /* -------------------------------------------------------
       FER DE LANCE LINCEUL CÉLESTE (Skyshroud Spearhead)
       « Mécanoptères » = TOMB BLADES (confirmé).
       ------------------------------------------------------- */
    {
      id: "fer-de-lance-linceul-celeste",
      name: "Fer de Lance Linceul Céleste",
      cost: 1,
      dispositions: ["reconnaissance"],

      rule: {
        name: null,
        text: [
          "Les unités TOMB BLADES de votre armée ont l'aptitude Frappe en Profondeur.",
          "Chaque fois qu'une unité TOMB BLADES de votre armée est choisie pour tirer, si elle a fait un mouvement d'arrivée à ce tour, ajoutez 1 au jet de touche de ses attaques de tir."
        ]
      },

      enhancements: [
        {
          id: "folie-croissante",
          name: "Folie Croissante",
          cost: 20,
          kind: "amelioration",
          requires: [["Destroyer Cult", "Mounted"]],
          text: "Les armes de tir des figurines de cette unité ont [ASSAUT]."
        },
        {
          id: "reanimation-recursive",
          name: "Réanimation Récursive",
          cost: 5,
          kind: "amelioration",
          requires: [["Tomb Blades"]],
          text: "Quand les Protocoles de Réanimation de cette unité s'activent, ajoutez 1 au jet."
        }
      ],

      stratagems: [
        {
          id: "mitraillage-omniverrouille",
          name: "Mitraillage Omniverrouillé",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Votre phase de Mouvement, quand une unité NECRONS MOUNTED de votre armée est choisie pour Battre en Retraite.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin du tour, elle reste éligible pour tirer à un tour où elle a Battu en Retraite."
        },
        {
          id: "protocoles-d-esquive",
          name: "Protocoles d'Esquive",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité NECRONS MOUNTED de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque de tir cible votre unité, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure."
        },
        {
          id: "vif-comme-la-mort",
          name: "Vif comme la Mort",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini un mouvement à 8\" ou moins d'une unité NECRONS MOUNTED non engagée de votre armée.",
          cible: "Cette unité NECRONS MOUNTED.",
          effet: "Elle peut faire un Mouvement Normal de D3+3\" maximum."
        }
      ]
    },

    /* -------------------------------------------------------
       L'ARSENAL DU PHAËRON (The Phaeron's Armoury)
       Unique : Hypercrypte — exclusif avec Légion d'Hypercrypte
       « Obélisque » = Obelisk, « Crypte Tesseract » = Tesseract Vault,
       « Monolithe » = Monolith, « Portail d'Éternité » = Eternity Gate
       ------------------------------------------------------- */
    {
      id: "l-arsenal-du-phaeron",
      name: "L'Arsenal du Phaëron",
      cost: 1,
      dispositions: ["priority-assets"],
      exclusiveGroup: "hypercrypte",

      rule: {
        name: null,
        text: [
          "Ajoutez 6\" au Mouvement des unités NECRONS TITANIC FLY de votre armée.",
          "Ce détachement a l'étiquette HYPERCRYPTE : il ne peut pas être pris avec un autre détachement HYPERCRYPTE."
        ]
      },

      enhancements: [
        {
          id: "linceul-mortel",
          name: "Linceul Mortel (Aura)",
          cost: 10,
          kind: "amelioration",
          requires: [["Obelisk"]],
          text: "À l'étape d'Ébranlement de la phase de Commandement adverse, chaque unité ennemie en dessous de son effectif initial et à 8\" ou moins de cette unité doit faire un test d'Ébranlement."
        },
        {
          id: "optimisateur-de-prelocalisation",
          name: "Optimisateur de Prélocalisation",
          cost: 25,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Chaque fois que l'unité du porteur est choisie pour tirer, si elle a été placée à ce tour grâce à l'aptitude Eternity Gate d'un Monolith, choisissez une des aptitudes suivantes : jusqu'à la fin de la phase, ses attaques de tir l'ont. [TOUCHES FATALES] ou [TOUCHES SOUTENUES 1]."
        }
      ],

      stratagems: [
        {
          id: "impulsion-de-particules",
          name: "Impulsion de Particules",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Début de votre phase de Tir.",
          cible: "1 unité NECRONS TITANIC FLY de votre armée.",
          effet: "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité : elle a +3\" en portée de détection."
        },
        {
          id: "tempete-cosmique",
          name: "Tempête Cosmique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }],
          quand: "Votre phase de Tir, quand une unité OBELISK ou TESSERACT VAULT de votre armée est choisie pour tirer.",
          cible: "Cette unité.",
          effet: "Jusqu'à la fin de la phase, améliorez de 1 la Pénétration d'Armure de ses tesla spheres."
        },
        {
          id: "trame-quantique-sous-surfacique",
          name: "Trame Quantique Sous-surfacique",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, quand une unité ennemie cible une unité NECRONS TITANIC FLY de votre armée.",
          cible: "Cette unité NECRONS TITANIC FLY.",
          effet: "Jusqu'à ce que l'unité ennemie ait fini ses attaques, aggravez de 1 la Pénétration d'Armure des attaques qui ciblent votre unité."
        }
      ]
    },

    /* -------------------------------------------------------
       LÉGION D'ANNIHILATION (Annihilation Legion)
       « Culte Destroyer » = DESTROYER CULT, « Dépeceurs » = FLAYED ONES
       ------------------------------------------------------- */
    {
      id: "legion-d-annihilation",
      name: "Légion d'Annihilation",
      cost: 2,
      dispositions: ["purge-the-foe"],

      rule: {
        name: null,
        text: [
          "Vous pouvez relancer les jets de Charge des unités DESTROYER CULT et FLAYED ONES de votre armée. Si une ou plusieurs cibles de la charge sont en dessous de la moitié de leur effectif, ajoutez aussi 1 au jet de Charge.",
          "Chaque fois qu'une figurine DESTROYER CULT de votre armée fait une attaque de tir qui cible la cible éligible la plus proche, améliorez de 1 la Pénétration d'Armure de l'attaque."
        ]
      },

      enhancements: [
        {
          id: "cauchemar-surnaturel",
          name: "Cauchemar Surnaturel",
          cost: 10,
          kind: "optimisation",
          requires: [["Destroyer Cult"]],
          text: "Au début de la phase de Combat, chaque unité ennemie à portée d'engagement du porteur doit faire un test d'Ébranlement."
        },
        {
          id: "folie-eternelle",
          name: "Folie Éternelle",
          cost: 20,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Chaque fois qu'une figurine de l'unité du porteur est détruite avant d'avoir combattu, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "superiorite-enracinee",
          name: "Supériorité Enracinée",
          cost: 5,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Chaque fois qu'une attaque d'une figurine de l'unité du porteur inflige une Blessure Critique, améliorez de 1 la Pénétration d'Armure de cette attaque."
        },
        {
          id: "faucheur-sans-ame",
          name: "Faucheur sans Âme",
          cost: 15,
          kind: "optimisation",
          requires: [["Destroyer Cult"]],
          text: "Chaque fois qu'une unité ennemie à portée d'engagement du porteur veut Battre en Retraite, lancez 1D6 : sur 3+, elle doit rester stationnaire à la place."
        }
      ],

      stratagems: [
        {
          id: "chasseurs-impitoyables",
          name: "Chasseurs Impitoyables",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité DESTROYER CULT ou FLAYED ONES de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines fait un mouvement d'engagement ou de consolidation, elle peut se déplacer de 6\" au lieu de 3\"."
        },
        {
          id: "cruaute-sanguinaire",
          name: "Cruauté Sanguinaire",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, juste après qu'une unité ennemie a fini une Retraite alors qu'elle était engagée avec une unité DESTROYER CULT ou FLAYED ONES de votre armée.",
          cible: "Cette unité DESTROYER CULT ou FLAYED ONES.",
          effet: "Lancez 1D6 : sur 2 à 5, l'unité ennemie subit D3 blessures mortelles ; sur 6, elle en subit 3. Votre unité peut ensuite faire un Mouvement Normal, mais doit le finir aussi près que possible de cette unité ennemie."
        },
        {
          id: "ire-dementielle",
          name: "Ire Démentielle",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré sur une unité DESTROYER CULT ou FLAYED ONES non engagée de votre armée.",
          cible: "Cette unité DESTROYER CULT ou FLAYED ONES.",
          effet: "Elle peut faire un mouvement d'Élan de D6\" maximum."
        },
        {
          id: "l-empreinte-de-la-faiblesse",
          name: "L'Empreinte de la Faiblesse",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité DESTROYER CULT ou FLAYED ONES de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité en dessous de son effectif initial, ajoutez 1 au jet de touche. Si cette unité est en dessous de la moitié de son effectif, ajoutez aussi 1 au jet de blessure."
        },
        {
          id: "masques-de-mort",
          name: "Masques de Mort",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité DESTROYER CULT ou FLAYED ONES de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche."
        },
        {
          id: "reanimation-meurtriere",
          name: "Réanimation Meurtrière",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité DESTROYER CULT ou FLAYED ONES de votre armée a détruit une unité ennemie ou l'a fait passer en dessous de la moitié de son effectif.",
          cible: "Cette unité DESTROYER CULT ou FLAYED ONES.",
          effet: "Ses Protocoles de Réanimation s'activent."
        }
      ]
    },

    /* -------------------------------------------------------
       LÉGION MAUDITE (Cursed Legion)
       Esprit Meurtrier : le Cryptek gagne DESTROYER CULT et peut mener
       (Appui) les quatre unités de Destroyers (noms anglais supposés).
       « Console de Commandement ou Tétrarque » : comme Majesté Effroyable.
       +2 en Force des DESTROYER CULT : weaponMods (calculé sur les fiches) ;
       +2 aux autres Necrons après une destruction : texte seulement.
       ------------------------------------------------------- */
    {
      id: "legion-maudite",
      name: "Légion Maudite",
      cost: 2,
      dispositions: ["purge-the-foe"],

      // +2 en Force permanent des DESTROYER CULT (moteur : weaponMods). La seconde
      // partie de la règle dépend de la partie : texte seulement.
      weaponMods: [{ to: [["Destroyer Cult"]], S: 2 }],

      rule: {
        name: null,
        text: [
          "Ajoutez 2 à la Force des armes des figurines DESTROYER CULT de votre armée.",
          "La première fois à chaque tour qu'une unité DESTROYER CULT de votre armée détruit une unité ennemie ou la fait passer en dessous de la moitié de son effectif, après qu'elle a fini ses attaques et jusqu'à la fin du tour, ajoutez 2 à la Force des armes des figurines NECRONS de votre armée (sauf DESTROYER CULT, MONSTER et TITANIC)."
        ]
      },

      enhancements: [
        {
          id: "diademe-maudit",
          name: "Diadème Maudit",
          cost: 25,
          kind: "optimisation",
          requires: [["Destroyer Cult"]],
          text: "Chaque fois qu'une unité ennemie a tiré, si une ou plusieurs figurines de l'unité du porteur ont été détruites par ces attaques, l'unité du porteur peut faire un mouvement d'Élan : lancez 1D6, elle se déplace d'autant de pouces au maximum et doit finir aussi près que possible de l'unité ennemie la plus proche (sauf AIRCRAFT). Ses figurines peuvent alors finir à portée d'engagement de cette unité ennemie. Une unité Ébranlée ne peut pas faire de mouvement d'Élan."
        },
        {
          id: "ankh-de-destroyer",
          name: "Ankh de Destroyer",
          cost: 20,
          kind: "optimisation",
          requires: [["Overlord"], ["Catacomb Command Barge"]],   // « Console de Commandement ou Tétrarque » : à confirmer
          grantsKeywords: ["Destroyer Cult"],
          text: "Le porteur a le mot-clé DESTROYER CULT. Ajoutez 2\" au Mouvement des figurines de l'unité du porteur, et ajoutez 2 aux Attaques des armes de mêlée du porteur."
        },
        {
          id: "marque-du-nekrosor",
          name: "Marque du Nékrosor",
          cost: 20,
          kind: "optimisation",
          requires: [["Destroyer Cult"]],
          text: "Chaque fois qu'une figurine de l'unité du porteur attaque, ajoutez 1 au jet de touche."
        },
        {
          id: "esprit-meurtrier",
          name: "Esprit Meurtrier",
          cost: 15,
          kind: "optimisation",
          requires: [["Cryptek"]],
          grantsKeywords: ["Destroyer Cult"],
          grantsLeaderOf: ["Skorpekh Destroyers", "Lokhust Destroyers", "Ophydian Destroyers", "Lokhust Heavy Destroyers"],
          text: "Le porteur a le mot-clé DESTROYER CULT. Ajoutez 3\" à son Mouvement. Le porteur peut mener (Appui) des Skorpekh Destroyers, Lokhust Destroyers, Ophydian Destroyers et Lokhust Heavy Destroyers."
        }
      ],

      stratagems: [
        {
          id: "agressivite-contre-nature",
          name: "Agressivité Contre Nature",
          cp: 2,
          type: null,
          moments: [{ tour: "adversaire", phase: "charge" }],
          quand: "Fin de la phase de Charge adverse.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et VEHICLE) à 6\" ou moins d'une ou plusieurs unités ennemies, et qui serait éligible pour déclarer une charge contre elles si c'était votre phase de Charge.",
          effet: "Elle déclare une charge qui ne peut cibler qu'une ou plusieurs de ces unités ennemies, et vous résolvez cette charge."
        },
        {
          id: "demence-contagieuse",
          name: "Démence Contagieuse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et VEHICLE) qui n'a pas déclaré de charge à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'elle déclare une charge, si une ou plusieurs cibles de cette charge sont à portée d'engagement d'une ou plusieurs unités amies, ajoutez 2 au jet de Charge."
        },
        {
          id: "image-de-la-mort",
          name: "Image de la Mort",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité DESTROYER CULT de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque cible votre unité, soustrayez 1 au jet de touche."
        },
        {
          id: "meurtre-methodique",
          name: "Meurtre Méthodique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER et VEHICLE) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de ses figurines ont [TOUCHES SOUTENUES 1]."
        },
        {
          id: "pousses-a-la-boucherie",
          name: "Poussés à la Boucherie",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "vous", phase: "charge" }],
          quand: "Votre phase de Tir ou votre phase de Charge.",
          cible: "1 unité DESTROYER CULT de votre armée.",
          effet: "Jusqu'à la fin du tour, elle est éligible pour tirer et déclarer une charge à un tour où elle a Avancé.",
          restrictions: "Une seule fois par tour."
        },
        {
          id: "protocoles-mortis",
          name: "Protocoles Mortis",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, juste après la première fois à ce tour qu'une unité DESTROYER CULT de votre armée a détruit une unité ennemie.",
          cible: "1 unité NECRONS amie (sauf MONSTER et VEHICLE) à 9\" ou moins de cette unité DESTROYER CULT.",
          effet: "Ses Protocoles de Réanimation s'activent."
        }
      ]
    },

    /* -------------------------------------------------------
       MAIN DE LA DYNASTIE (Hand of the Dynasty)
       Unique : Dynastie — exclusif avec Dynastie Éveillée
       « Immortels » = IMMORTALS, « Guerriers Nécrons » = NECRON WARRIORS
       [ASSAUT] : weaponAbilities[].to.
       ------------------------------------------------------- */
    {
      id: "main-de-la-dynastie",
      name: "Main de la Dynastie",
      cost: 1,
      dispositions: ["take-and-hold"],
      exclusiveGroup: "dynastie",

      weaponAbilities: [{ type: "ranged", ability: "assault", to: [["Immortals"], ["Necron Warriors"]] }],

      rule: {
        name: null,
        text: [
          "Les armes de tir des unités IMMORTALS et NECRON WARRIORS de votre armée ont [ASSAUT].",
          "Quand une unité IMMORTALS ou NECRON WARRIORS de votre armée Avance, cela ne l'empêche pas d'être éligible pour faire une action.",
          "Ce détachement a l'étiquette DYNASTIE : il ne peut pas être pris avec un autre détachement DYNASTIE."
        ]
      },

      enhancements: [
        {
          id: "sentinelles-animees",
          name: "Sentinelles Animées",
          cost: 20,
          kind: "amelioration",
          requires: [["Necron Warriors"]],
          text: "Cette unité a l'aptitude Éclaireurs 5\"."
        },
        {
          id: "instruments-de-domination",
          name: "Instruments de Domination",
          cost: 15,
          kind: "amelioration",
          requires: [["Immortals"]],
          text: "Les armes de tir des figurines de cette unité ont [TIR RAPIDE 1]."
        }
      ],

      stratagems: [
        {
          id: "nanosaturation",
          name: "Nanosaturation",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie a tiré sur une unité IMMORTALS ou NECRON WARRIORS de votre armée.",
          cible: "Cette unité IMMORTALS ou NECRON WARRIORS.",
          effet: "Elle peut faire un Tir en État d'Alerte, mais ne peut cibler que cette unité ennemie."
        },
        {
          id: "protocoles-preponderants",
          name: "Protocoles Prépondérants",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "commandement" }],
          quand: "Phase de Commandement.",
          cible: "1 unité IMMORTALS de votre armée.",
          effet: "Jusqu'à la fin du tour, ajoutez 1 à la CO des figurines de votre unité."
        },
        {
          id: "volonte-du-conquerant",
          name: "Volonté du Conquérant",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Fin de votre phase de Mouvement.",
          cible: "1 unité IMMORTALS ou NECRON WARRIORS de votre armée.",
          effet: "Choisissez 1 pion objectif qu'elle contrôle : il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase."
        }
      ]
    },

    /* -------------------------------------------------------
       LÉGION D'HYPERCRYPTE (Hypercrypt Legion)
       Unique : Hypercrypte — exclusif avec L'Arsenal du Phaëron
       Le retour en Réserves de la règle = « hyperphaser ».
       ------------------------------------------------------- */
    {
      id: "legion-d-hypercrypte",
      name: "Légion d'Hypercrypte",
      cost: 2,
      dispositions: ["reconnaissance"],
      exclusiveGroup: "hypercrypte",

      rule: {
        name: null,
        text: [
          "À la fin du tour adverse, vous pouvez retirer du champ de bataille des unités NECRONS de votre armée non engagées et les placer en Réserves Stratégiques (elles hyperphasent) : 1 unité en Incursion, 2 en Force de Frappe, 3 en Offensive.",
          "Ce détachement a l'étiquette HYPERCRYPTE : il ne peut pas être pris avec un autre détachement HYPERCRYPTE."
        ]
      },

      enhancements: [
        {
          id: "tyran-emergent",
          name: "Tyran Émergent",
          cost: 25,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Chaque fois qu'une figurine de l'unité du porteur attaque, relancez un jet de touche de 1. Si l'unité a été placée sur le champ de bataille à ce tour, vous pouvez relancer le jet de touche à la place."
        },
        {
          id: "superviseur-dimensionnel",
          name: "Superviseur Dimensionnel",
          cost: 25,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Tant que le porteur est sur le champ de bataille ou en Réserves Stratégiques, ajoutez 1 au nombre d'unités qui peuvent hyperphaser grâce à la règle du détachement."
        },
        {
          id: "nodule-de-transfert-hyperspatial",
          name: "Nodule de Transfert Hyperspatial",
          cost: 15,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          text: "Quand l'unité du porteur Avance, ne lancez pas de dé : elle avance de 6\"."
        },
        {
          id: "axe-osteoclave",
          name: "Axe Ostéoclave",
          cost: 20,
          kind: "optimisation",
          requires: [["Necrons"]],
          excludes: ["Transcendent C'tan"],
          affectsUnit: true,
          text: "Les figurines de l'unité du porteur ont l'aptitude Frappe en Profondeur."
        }
      ],

      stratagems: [
        {
          id: "corridor-dimensionnel",
          name: "Corridor Dimensionnel",
          cp: 2,
          type: null,
          moments: [{ tour: "vous", phase: "charge" }],
          quand: "Votre phase de Charge.",
          cible: "1 unité NECRONS de votre armée placée à ce tour grâce à l'aptitude Eternity Gate d'un Monolith qui a commencé le tour sur le champ de bataille.",
          effet: "Jusqu'à la fin de la phase, elle est éligible pour déclarer une charge."
        },
        {
          id: "cryptes-de-reanimation",
          name: "Cryptes de Réanimation",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "Votre Seigneur de Guerre NECRONS.",
          effet: "Les Protocoles de Réanimation de chacune de vos unités NECRONS en Réserves s'activent."
        },
        {
          id: "deflexion-quantique",
          name: "Déflexion Quantique",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité NECRONS VEHICLE de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, ses figurines ont une sauvegarde invulnérable de 4+."
        },
        {
          id: "precision-cosmique",
          name: "Précision Cosmique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "mouvement" }],
          quand: "Étape des Renforts de votre phase de Mouvement.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER) qui arrive grâce à un mouvement d'arrivée à cette phase.",
          effet: "Elle peut être placée à plus de 6\" horizontalement de toute unité ennemie, mais n'est pas éligible pour déclarer une charge à ce tour."
        },
        {
          id: "rappel-hyperphasique",
          name: "Rappel Hyperphasique",
          cp: 2,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une ou plusieurs figurines d'une unité NECRONS INFANTRY de votre armée ont été détruites par des attaques ennemies.",
          cible: "Cette unité NECRONS INFANTRY.",
          effet: "Retirez-la du champ de bataille et replacez-la n'importe où hors de portée d'engagement de toute unité ennemie, et entièrement à 6\" ou moins d'une figurine MONOLITH de votre armée."
        },
        {
          id: "reducteurs-entropiques",
          name: "Réducteurs Entropiques",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "Phase de Tir adverse, juste après qu'une unité ennemie à 18\" ou moins d'une figurine NECRONS TITANIC de votre armée l'a choisie pour cible.",
          cible: "Cette figurine NECRONS TITANIC.",
          effet: "Jusqu'à la fin de la phase, les armes de l'unité attaquante ont [À RISQUE]."
        }
      ]
    },

    /* -------------------------------------------------------
       PHALANGE D'OBÉISSANCE (Obeisance Phalanx)
       « Tétrarque » = Overlord supposé (à confirmer), « Noble » = NOBLE,
       « Factionnaires » = LYCHGUARD, « Triarcat » = TRIARCH,
       « Prétoriens » = TRIARCH PRAETORIANS (noms anglais supposés)
       ------------------------------------------------------- */
    {
      id: "phalange-d-obeissance",
      name: "Phalange d'Obéissance",
      cost: 2,
      dispositions: ["disruption"],

      rule: {
        name: null,
        text: [
          "À votre phase de Commandement, choisissez 1 unité ennemie. Jusqu'au début de votre prochaine phase de Commandement, chaque fois qu'une figurine NOBLE, OVERLORD, LYCHGUARD ou TRIARCH de votre armée attaque cette unité, ajoutez 1 au jet de blessure."
        ]
      },

      enhancements: [
        {
          id: "conquerant-eternel",
          name: "Conquérant Éternel",
          cost: 25,
          kind: "optimisation",
          requires: [["Overlord"]],      // « Tétrarque » : à confirmer
          affectsUnit: true,
          text: "Chaque fois qu'une figurine de l'unité du porteur attaque une cible à portée d'un ou plusieurs pions objectifs, vous pouvez relancer le jet de touche."
        },
        {
          id: "combattant-honorable",
          name: "Combattant Honorable",
          cost: 10,
          kind: "optimisation",
          requires: [["Overlord"]],
          text: "Chaque fois que le porteur détruit un personnage ennemi, votre adversaire perd 1 PC (s'il en a)."
        },
        {
          id: "volonte-inflexible",
          name: "Volonté Inflexible",
          cost: 20,
          kind: "optimisation",
          requires: [["Overlord"]],
          text: "Les armes de mêlée du porteur ont [PRÉCISION] et [ANTI-INFANTERIE 5+]."
        },
        {
          id: "noble-guerrier",
          name: "Noble Guerrier",
          cost: 15,
          kind: "optimisation",
          requires: [["Overlord"]],
          affectsUnit: true,
          text: "Chaque fois qu'une attaque de mêlée cible l'unité du porteur, soustrayez 1 au jet de touche."
        }
      ],

      stratagems: [
        {
          id: "artifice-asservi",
          name: "Artifice Asservi",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité NECRONS de votre armée (sauf TITANIC) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque, un jet de touche non modifié de 5+ est une Touche Critique."
        },
        {
          id: "ne-tolerez-aucun-rival",
          name: "Ne Tolérez Aucun Rival",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat.",
          cible: "1 unité LYCHGUARD ou TRIARCH de votre armée pas encore choisie pour combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, les armes de mêlée de ses figurines ont [PRÉCISION]."
        },
        {
          id: "obsession-territoriale",
          name: "Obsession Territoriale",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "commandement" }],
          quand: "Votre phase de Commandement.",
          cible: "1 unité LYCHGUARD ou TRIARCH de votre armée.",
          effet: "Jusqu'au début de votre prochaine phase de Commandement, ajoutez 1 à la CO de ses figurines (3 si c'est un VEHICLE)."
        },
        {
          id: "protocoles-de-nano-assemblage",
          name: "Protocoles de Nano-assemblage",
          cp: 1,
          type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité NECRONS VEHICLE de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une attaque est allouée à une figurine de votre unité, soustrayez 1 à la caractéristique de Dégâts de l'attaque."
        },
        {
          id: "sentinelles-d-eternite",
          name: "Sentinelles d'Éternité",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité LYCHGUARD ou TRIARCH PRAETORIANS de votre armée choisie pour cible.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "votre-heure-est-venue",
          name: "Votre Heure est Venue",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après que le Seigneur de Guerre adverse a été détruit.",
          cible: "Votre Seigneur de Guerre NECRONS.",
          effet: "Jusqu'à la fin de la bataille, chaque fois qu'une unité ennemie fait un test d'Ébranlement ou de Commandement, soustrayez 1 au résultat."
        }
      ]
    },

    /* -------------------------------------------------------
       PANTHÉON DE MALHEUR (Pantheon of Woe)
       C'tan : Nightbringer (Nyctophore), Deceiver (Mystificateur),
       Void Dragon (Dragon du Néant), Transcendent C'tan.
       Optimisations sur des héros épiques : allowEpic.
       Optimisation obligatoire pour chaque C'tan : mandatoryEnhancement
       (vérifiée par js/regles-etendues.js).
       ------------------------------------------------------- */
    {
      id: "pantheon-de-malheur",
      name: "Panthéon de Malheur",
      cost: 2,
      dispositions: ["disruption"],
      mandatoryEnhancement: { to: [["Necrons", "Monster"]] },

      rule: {
        name: "Champs de Distorsion",
        text: [
          "Les unités NECRONS MONSTER de votre armée ont l'aptitude suivante :",
          "__Champs de Distorsion (Aura)__ : tant qu'une unité ennemie est à 6\" ou moins de cette unité, elle est effritée. Chaque fois qu'une attaque cible une unité effritée, améliorez de 1 la Pénétration d'Armure de l'attaque.",
          "Au début de chaque phase, chaque unité NECRONS MONSTER de votre armée peut subir 3 blessures mortelles. Dans ce cas, jusqu'à la fin de la phase, la portée de son aura Champs de Distorsion passe à 9\".",
          "Restriction : quand vous rassemblez votre armée, chaque unité NECRONS MONSTER doit prendre et payer l'optimisation correspondant à son type d'unité."
        ]
      },

      enhancements: [
        {
          id: "sourdine-spirituelle",
          name: "Sourdine Spirituelle",
          cost: 35,
          kind: "optimisation", allowEpic: true,
          requires: [["C'tan Shard of the Void Dragon"]],
          usage: "une-fois-par-tour",
          text: "Une fois par tour, au début de la phase de Tir adverse, choisissez 1 unité ennemie VEHICLE visible du porteur : elle doit faire un test de Commandement. Jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité attaque, soustrayez 1 au jet de touche ; si le test a été raté, soustrayez aussi 1 au jet de blessure."
        },
        {
          id: "aiguillon-quantique",
          name: "Aiguillon Quantique",
          cost: 45,
          kind: "optimisation", allowEpic: true,
          requires: [["C'tan Shard of the Nightbringer"]],
          text: "Le porteur est éligible pour déclarer une charge à un tour où il a Avancé."
        },
        {
          id: "longe-relativiste",
          name: "Longe Relativiste",
          cost: 40,
          kind: "optimisation", allowEpic: true,
          requires: [["Transcendent C'tan"]],
          text: "À votre tour, quand le porteur fait un mouvement d'arrivée ou une Avance grâce à son aptitude Déplacement Transdimensionnel, il peut finir ce mouvement à plus de 6\" horizontalement des unités ennemies (au lieu de 8\"). S'il le finit à 8\" ou moins d'une unité ennemie, il n'est pas éligible pour déclarer une charge jusqu'à la fin du tour."
        },
        {
          id: "matrice-de-singularite",
          name: "Matrice de Singularité",
          cost: 45,
          kind: "optimisation", allowEpic: true,
          requires: [["C'tan Shard of the Deceiver"]],
          text: "Le porteur a l'aptitude suivante :\n__Seigneur de la Duperie (Aura)__ : chaque fois que votre adversaire cible avec un stratagème une unité de son armée à 12\" ou moins du porteur, augmentez de 1 PC le coût de cette utilisation du stratagème."
        }
      ],

      stratagems: [
        {
          id: "cascade-disharmonique",
          name: "Cascade Disharmonique",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "toutes" }],
          quand: "N'importe quelle phase, juste après qu'une figurine NECRONS MONSTER de votre armée a été détruite, avant son jet de Destruction Fatale.",
          cible: "Cette figurine NECRONS MONSTER (le stratagème peut être utilisé même si elle vient d'être détruite).",
          effet: "Jusqu'à la fin de la phase, son aptitude Destruction Fatale inflige ses blessures mortelles sur un jet de 3+ au lieu de 6."
        },
        {
          id: "chronodistorsion",
          name: "Chronodistorsion",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "combat" }],
          quand: "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          cible: "1 unité NECRONS de votre armée choisie pour cible d'une ou plusieurs de ces attaques.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une figurine de votre unité est détruite avant d'avoir combattu, lancez 1D6 (+1 si l'unité attaquante est effritée) : sur 4+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée."
        },
        {
          id: "ciblage-d-aura-entrophasique",
          name: "Ciblage d'Aura Entrophasique",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat.",
          cible: "1 unité NECRONS de votre armée (sauf MONSTER) pas encore choisie pour tirer ou combattre à cette phase.",
          effet: "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines attaque une unité ennemie, relancez un jet de touche de 1. Si la cible est effritée, relancez aussi un jet de blessure de 1."
        },
        {
          id: "dissolution-de-phase",
          name: "Dissolution de Phase",
          cp: 1,
          type: null,
          moments: [{ tour: "adversaire", phase: "mouvement" }],
          quand: "Phase de Mouvement adverse, quand une unité ennemie effritée est choisie pour Battre en Retraite.",
          cible: "1 unité NECRONS de votre armée à portée d'engagement de cette unité ennemie.",
          effet: "Quand l'unité ennemie Bat en Retraite, toutes ses figurines doivent faire des tests de Fuite Désespérée, en soustrayant 1 au résultat si elle est Ébranlée."
        },
        {
          id: "erosion-moleculaire",
          name: "Érosion Moléculaire",
          cp: 1,
          type: null,
          moments: [{ tour: "les-deux", phase: "commandement" }],
          quand: "Phase de Commandement.",
          cible: "1 unité NECRONS MONSTER de votre armée.",
          effet: "Choisissez 1 unité ennemie effritée visible de votre unité : elle doit faire un test d'Ébranlement en soustrayant 1 au résultat. Si elle le rate, elle subit D3+1 blessures mortelles.",
          restrictions: "Une seule fois par round."
        },
        {
          id: "transmogrification-de-masse",
          name: "Transmogrification de Masse",
          cp: 1,
          type: null,
          moments: [{ tour: "vous", phase: "tir" }, { tour: "les-deux", phase: "combat" }],
          quand: "Votre phase de Tir ou phase de Combat, juste après qu'une unité NECRONS MONSTER de votre armée a détruit une unité ennemie.",
          cible: "1 unité NECRONS amie (sauf MONSTER) à 6\" ou moins de cette unité MONSTER.",
          effet: "Si l'unité ennemie était effritée au début de la phase, les Protocoles de Réanimation de votre unité s'activent.",
          restrictions: "Une seule fois par tour."
        }
      ]
    }
  ],

  /* =========================================================
     UNITÉS (même format que les autres factions)
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ---------- */

    {
      id: "illuminor-szeras",
      name: "Illuminor Szeras",
      category: "epic-infantry",
      base: "80mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Cryptek", "Illuminor Szeras", "Necrons"],
      stats: { M: "8\"", T: 8, Sv: "2+", W: 9, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 175 }] }],
      coreAbilities: ["feel-no-pain:4+"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "eldritch-lance", name: "Eldritch lance", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "9", AP: "-3", D: "3", abilities: [] }] },
        { id: "eldritch-lance-melee", name: "Eldritch lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "9", AP: "-3", D: "3", abilities: [] }] },
        { id: "impaling-legs", name: "Impaling legs", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["extra-attacks"] }] }
      ],
      loadout: ["eldritch-lance", "eldritch-lance-melee", "impaling-legs"],
      abilities: [
        { name: "Illuminor",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs autres unités NECRONS amies, elle a l'aptitude Agent Solitaire." },
        { name: "Mechanical Augmentation (Aura)",
          text: "Tant qu'une unité NECRONS BATTLELINE amie est à 3\" ou moins de cette figurine, chaque fois qu'une figurine de cette unité attaque, améliorez de 1 la Pénétration d'Armure de l'attaque, et chaque fois qu'une attaque cible cette unité, aggravez de 1 la Pénétration d'Armure de l'attaque." },
        { name: "Atomic Energy Manipulator",
          text: "À la fin de la phase de Combat, si cette figurine a détruit une ou plusieurs figurines à cette phase, jusqu'à la fin de la bataille, ajoutez 3\" à la portée de son aptitude Mechanical Augmentation (12\" au maximum)." }
      ],
      composition: "1 Illuminor Szeras"
    },

    {
      id: "imotekh-the-stormlord",
      name: "Imotekh the Stormlord",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Noble", "Imotekh the Stormlord", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }] }],
      leader: { canLead: ["Immortals", "Lychguard", "Necron Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauntlet-of-fire", name: "Gauntlet of Fire", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "staff-of-the-destroyer", name: "Staff of the Destroyer", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "2+", S: "6", AP: "-3", D: "2", abilities: [] }] },
        { id: "staff-of-the-destroyer-melee", name: "Staff of the Destroyer", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "6", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["gauntlet-of-fire", "staff-of-the-destroyer", "staff-of-the-destroyer-melee"],
      abilities: [
        { name: "Grand Strategist",
          text: "Au début de votre phase de Commandement, si cette figurine est sur le champ de bataille, vous gagnez 1 PC." },
        { name: "Lord of the Storm", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, à la fin de votre phase de Commandement, cette figurine peut utiliser cette aptitude. Lancez 1D6 pour chaque unité ennemie à 12\" ou moins d'elle : sur 2 à 5, cette unité subit D3 blessures mortelles ; sur 6, elle subit D3+3 blessures mortelles." }
      ],
      composition: "1 Imotekh the Stormlord"
    },

    {
      id: "nekrosor-ammentar",
      name: "Nekrosor Ammentar",
      category: "epic-infantry",
      base: "80mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Destroyer Cult", "Nekrosor Ammentar", "Necrons"],
      stats: { M: "10\"", T: 8, Sv: "3+", W: 9, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 195 }] }],
      coreAbilities: ["deep-strike", "fights-first"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "enmitic-disintegrators", name: "Enmitic disintegrators", type: "ranged",
          profiles: [{ range: "18\"", A: "4", skill: "2+", S: "6", AP: "-2", D: "1", abilities: ["ignores-cover", "pistol", "sustained-hits:2"] }] },
        { id: "blade-tail-and-whip-coils", name: "Blade tail and whip coils", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["extra-attacks"] }] },
        { id: "unmaker-gauntlet", name: "Unmaker Gauntlet", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "10", AP: "-3", D: "3", abilities: [] }] }
      ],
      wargear: [{ id: "nullstone-field-generator", name: "Nullstone field generator" }],
      loadout: ["enmitic-disintegrators", "blade-tail-and-whip-coils", "unmaker-gauntlet", "nullstone-field-generator"],
      abilities: [
        { name: "Protective Disciples",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs autres unités DESTROYER CULT amies, elle a l'aptitude Agent Solitaire." },
        { name: "Infectious Murder-madness (Aura)",
          text: "Tant qu'une unité NECRONS amie (sauf MONSTER et TITANIC) est à 6\" ou moins de cette figurine, chaque fois qu'une figurine de cette unité attaque, si elle a le mot-clé DESTROYER CULT ou si l'unité ciblée est la cible éligible la plus proche, l'attaque a [TOUCHES SOUTENUES 1]." },
        { name: "Prophet of Destruction",
          text: "Chaque fois que cette figurine détruit une unité ennemie, choisissez 1 autre unité DESTROYER CULT amie à 9\" ou moins d'elle. Jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité attaque, relancez un jet de blessure de 1." },
        { name: "Nullstone Field Generator (Aura)", requiresWargear: "nullstone-field-generator",
          text: "Tant qu'une unité NECRONS amie est à 6\" ou moins du porteur, ses figurines ont l'aptitude Insensible à la Douleur 5+ contre les blessures mortelles et les attaques psychiques." }
      ],
      composition: "1 Nekrosor Ammentar"
    },

    {
      id: "orikan-the-diviner",
      name: "Orikan the Diviner",
      category: "epic-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Cryptek", "Chronomancer", "Orikan the Diviner", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { type: "support", canLead: ["Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "staff-of-tomorrow", name: "Staff of Tomorrow", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "-3", D: "D3", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["staff-of-tomorrow"],
      abilities: [
        { name: "Master Chronomancer", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les figurines de cette unité ont une sauvegarde invulnérable de 4+." },
        { name: "The Stars Are Right", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de la phase de Combat, cette figurine peut utiliser cette aptitude. Jusqu'à la fin de la phase, triplez les Attaques et la Force de son Staff of Tomorrow, et chaque jet de blessure réussi pour ses attaques est une Blessure Critique." }
      ],
      composition: "1 Orikan the Diviner"
    },

    {
      id: "trazyn-the-infinite",
      name: "Trazyn the Infinite",
      category: "epic-infantry",
      base: "25mm",
      keywords: ["Infantry", "Character", "Epic Hero", "Noble", "Trazyn the Infinite", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { canLead: ["Immortals", "Lychguard", "Necron Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "empathic-obliterator", name: "Empathic Obliterator", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "7", AP: "0", D: "D3", abilities: ["sustained-hits:D3"] }] }
      ],
      loadout: ["empathic-obliterator"],
      abilities: [
        { name: "Ancient Collector", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, ce pion reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle adverse sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Surrogate Hosts",
          text: "Au début de votre phase de Commandement, si cette figurine est sur le champ de bataille, vous pouvez choisir 1 autre figurine NECRONS INFANTRY CHARACTER amie sur le champ de bataille (sauf SKORPEKH LORD et EPIC HERO). Elle est détruite (en ignorant les règles déclenchées par la destruction d'une figurine) et cette figurine est placée à sa place, avec tous ses PV restants. Si la figurine choisie menait une unité, cette figurine est rattachée à cette unité comme Leader." }
      ],
      composition: "1 Trazyn the Infinite"
    },

    /* ---------- Héros monstres épiques ----------
       Enslaved Star God : cannotBeWarlord. */

    {
      id: "ctan-shard-of-the-deceiver",
      name: "C'tan Shard of the Deceiver",
      category: "epic-monster",
      base: "40mm",
      keywords: ["Monster", "Character", "Epic Hero", "Fly", "C'tan Shard of the Deceiver", "Necrons"],
      stats: { M: "8\"", T: 11, Sv: "3+", W: 16, Ld: "6+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 330 }] }],
      cannotBeWarlord: true,
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:5+", "stealth"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "cosmic-insanity", name: "Cosmic insanity", type: "ranged",
          profiles: [{ range: "18\"", A: "6", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["anti:Personnage 4+", "devastating-wounds", "precision"] }] },
        { id: "golden-fists", name: "Golden fists", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "10", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["cosmic-insanity", "golden-fists"],
      abilities: [
        { name: "Enslaved Star God",
          text: "Cette figurine ne peut pas être votre Seigneur de Guerre." },
        { name: "Grand Illusion",
          text: "Si votre armée inclut cette figurine, après le déploiement des deux armées, choisissez jusqu'à 3 unités NECRONS de votre armée et redéployez-les. Vous pouvez alors placer n'importe lesquelles de ces unités en Réserves Stratégiques, quel que soit le nombre d'unités qui y sont déjà." },
        { name: "Necrodermis",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      composition: "1 C'tan Shard of the Deceiver"
    },

    {
      id: "ctan-shard-of-the-nightbringer",
      name: "C'tan Shard of the Nightbringer",
      category: "epic-monster",
      base: "90mm",
      keywords: ["Monster", "Character", "Epic Hero", "Fly", "C'tan Shard of the Nightbringer", "Necrons"],
      stats: { M: "10\"", T: 11, Sv: "3+", W: 16, Ld: "6+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 360 }] }],
      cannotBeWarlord: true,
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:5+"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gaze-of-death", name: "Gaze of death", type: "ranged",
          profiles: [{ range: "18\"", A: "D3", skill: "2+", S: "12", AP: "-3", D: "D6+3", abilities: [] }] },
        { id: "scythe-of-the-nightbringer", name: "Scythe of the Nightbringer", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "14", AP: "-4", D: "D6+2", abilities: ["devastating-wounds"] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "8",  AP: "-2", D: "2",    abilities: [] }
          ] }
      ],
      loadout: ["gaze-of-death", "scythe-of-the-nightbringer"],
      abilities: [
        { name: "Enslaved Star God",
          text: "Cette figurine ne peut pas être votre Seigneur de Guerre." },
        { name: "Drain Life",
          text: "À la fin de la phase de Combat, lancez 1D6 pour chaque unité ennemie à 6\" ou moins de cette figurine : sur 4+, cette unité subit D3 blessures mortelles." },
        { name: "Necrodermis",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      composition: "1 C'tan Shard of the Nightbringer"
    },

    {
      id: "ctan-shard-of-the-void-dragon",
      name: "C'tan Shard of the Void Dragon",
      category: "epic-monster",
      base: "80mm",
      keywords: ["Monster", "Character", "Epic Hero", "Fly", "C'tan Shard of the Void Dragon", "Necrons"],
      stats: { M: "10\"", T: 11, Sv: "3+", W: 16, Ld: "6+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 345 }] }],
      cannotBeWarlord: true,
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:5+"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "spear-of-the-void-dragon", name: "Spear of the Void Dragon", type: "ranged",
          profiles: [{ range: "12\"", A: "D3", skill: "2+", S: "8", AP: "-3", D: "D6+2", abilities: ["anti:Véhicule 2+"] }] },
        { id: "voltaic-storm", name: "Voltaic storm", type: "ranged",
          profiles: [{ range: "18\"", A: "D6+3", skill: "2+", S: "7", AP: "-1", D: "2", abilities: ["blast", "sustained-hits:2"] }] },
        { id: "spear-of-the-void-dragon-melee", name: "Spear of the Void Dragon", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "2+", S: "12", AP: "-4", D: "D6+2", abilities: ["anti:Véhicule 2+"] },
            { name: "sweep",  range: "Mêlée", A: "10", skill: "2+", S: "8",  AP: "-1", D: "2",    abilities: [] }
          ] },
        { id: "canoptek-tail-blades", name: "Canoptek tail blades", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["extra-attacks"] }] }
      ],
      loadout: ["spear-of-the-void-dragon", "voltaic-storm", "spear-of-the-void-dragon-melee", "canoptek-tail-blades"],
      abilities: [
        { name: "Enslaved Star God",
          text: "Cette figurine ne peut pas être votre Seigneur de Guerre." },
        { name: "Matter Absorption",
          text: "Au début de votre phase de Tir, choisissez 1 unité ennemie VEHICLE à 12\" ou moins de cette figurine et lancez 1D6 : sur 2+, cette unité subit D3 blessures mortelles et cette figurine récupère autant de PV perdus." },
        { name: "Necrodermis",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      composition: "1 C'tan Shard of the Void Dragon"
    },

    /* ---------- Héros véhicules épiques ----------
       Supreme Commander : mustBeWarlord. Triarch Abilities : choix en partie. */

    {
      id: "the-silent-king",
      name: "The Silent King",
      category: "epic-vehicle",
      base: "Szarekh : 100mm · Triarchal Menhir : 50mm",
      keywords: ["Vehicle", "Epic Hero", "Triarch", "Character", "The Silent King", "Necrons"],
      keywordsNote: "Character et The Silent King : Szarekh seulement.",
      stats: { M: "8\"", T: 10, Sv: "2+", W: 16, Ld: "6+", OC: 6, InSv: "4+" },
      statLines: [
        { label: "Szarekh",          stats: { M: "8\"", T: 10, Sv: "2+", W: 16, Ld: "6+", OC: 6, InSv: "4+" } },
        { label: "Triarchal Menhir", stats: { M: "8\"", T: 10, Sv: "2+", W: 5,  Ld: "6+", OC: 1, InSv: "4+" } }
      ],
      sizes: [{ models: 3, costs: [{ from: 1, pts: 420 }] }],
      mustBeWarlord: true,
      coreAbilities: ["deadly-demise:D6+3"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "annihilator-beam", name: "Annihilator beam", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "2+", S: "14", AP: "-4", D: "6", abilities: [] }] },
        { id: "sceptre-of-eternal-glory", name: "Sceptre of Eternal Glory", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "2+", S: "10", AP: "-3", D: "3", abilities: ["devastating-wounds"] }] },
        { id: "staff-of-stars", name: "Staff of Stars", type: "ranged",
          profiles: [{ range: "24\"", A: "12", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["indirect-fire"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] },
        { id: "weapons-of-the-final-triarch", name: "Weapons of the Final Triarch", type: "melee",
          profiles: [{ range: "Mêlée", A: "12", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["lethal-hits"] }] }
      ],
      models: [
        { id: "szarekh",          name: "Szarekh",          count: 1, loadout: ["sceptre-of-eternal-glory", "staff-of-stars", "weapons-of-the-final-triarch"] },
        { id: "triarchal-menhir", name: "Triarchal Menhir", count: 2, loadout: ["annihilator-beam", "armoured-bulk"] }
      ],
      abilities: [
        { name: "Supreme Commander",
          text: "Si cette unité fait partie de votre armée, elle doit être votre Seigneur de Guerre." },
        { name: "Destruction Néfaste",
          text: "Destruction Néfaste D6+3 : figurine Szarekh seulement." },
        { name: "Triarch Abilities",
          gameChoice: "Au début de chaque round, choisir l'aptitude du Triarcat du Silent King.",
          text: "Au début du round de bataille, choisissez une des aptitudes suivantes. Jusqu'au début du round suivant, cette unité a cette aptitude.\n• __Phaeron of the Stars (Aura)__ : tant qu'une unité NECRONS amie (sauf MONSTER) est à 6\" ou moins de la figurine Szarekh, chaque fois qu'une figurine de cette unité attaque, relancez un jet de touche de 1 et un jet de blessure de 1.\n• __Phaeron of the Blades (Aura)__ : tant qu'une unité NECRONS amie (sauf MONSTER) est à 6\" ou moins de la figurine Szarekh, vous pouvez relancer ses jets de Charge, et chaque fois qu'une de ses figurines fait une attaque de mêlée, ajoutez 1 à la Force de l'attaque.\n• __Relentless March (Aura)__ : tant qu'une unité NECRONS amie (sauf MONSTER) est à 6\" ou moins de la figurine Szarekh, ajoutez 2\" au Mouvement de ses figurines." },
        { name: "The Silent King",
          text: "Tant qu'une unité NECRONS amie est à 6\" ou moins de la figurine Szarekh de cette unité, améliorez de 1 la caractéristique de Commandement de cette unité." },
        { name: "Triarchal Menhirs",
          text: "Si la figurine Szarekh de cette unité est détruite, toutes les figurines Triarchal Menhir restantes de l'unité sont aussi détruites." }
      ],
      damaged: { range: "1-6", text: "Tant que la figurine Szarekh de cette unité a 1 à 6 PV restants, divisez par deux les Attaques de ses armes, et chaque fois que cette unité attaque, soustrayez 1 au jet de touche." },
      composition: "1 Szarekh (Epic Hero) et 2 Triarchal Menhirs"
    },

    /* ---------- Personnages d'infanterie ---------- */

    {
      id: "chronomancer",
      name: "Chronomancer",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Cryptek", "Chronomancer", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 70 }, { from: 2, pts: 80 }] }],
      leader: { type: "support", canLead: ["Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "aeonstave", name: "Aeonstave", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["blast"] }] },
        { id: "aeonstave-melee", name: "Aeonstave", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "5", AP: "-1", D: "1", abilities: [] }] }
      ],
      loadout: ["aeonstave", "aeonstave-melee"],
      abilities: [
        { name: "Timesplinter Mantle", grants: "unite-menee",
          text: "Cette unité a l'aptitude Discrétion. Les attaques de mêlée qui ciblent cette unité ont −1 au jet de touche." },
        { name: "Chronometron",
          text: "À votre phase de Tir, après que l'unité de cette figurine a tiré, si elle n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de 5\" maximum comme si c'était votre phase de Mouvement. Dans ce cas, jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge." }
      ],
      composition: "1 Chronomancer"
    },

    {
      id: "geomancer",
      name: "Geomancer",
      category: "char-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Cryptek", "Geomancer", "Necrons"],
      stats: { M: "8\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      leader: { type: "support", canLead: ["Canoptek Macrocytes", "Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "tremorglaive", name: "Tremorglaive", type: "ranged",
          profiles: [
            { name: "reverberating beam", range: "18\"", A: "2",    skill: "4+",  S: "8", AP: "-2", D: "2", abilities: ["melta:2"] },
            { name: "shock wave pulse",   range: "18\"", A: "D6+2", skill: "N/A", S: "4", AP: "0",  D: "1", abilities: ["ignores-cover", "torrent"] }
          ] },
        { id: "tremorglaive-melee", name: "Tremorglaive", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      loadout: ["tremorglaive", "tremorglaive-melee"],
      abilities: [
        { name: "Tectonic Reverberations",
          text: "À votre phase de Mouvement, vous pouvez choisir 1 unité ennemie à 18\" ou moins de cette figurine et visible d'elle. Jusqu'au début de votre prochaine phase de Mouvement, elle est clouée : soustrayez 2 à sa caractéristique de Mouvement et 2 à ses jets de Charge." },
        { name: "Obelisk Node Control",
          text: "Tant que cette figurine est à portée d'un pion objectif que vous contrôlez, les unités ennemies placées sur le champ de bataille depuis les Réserves ne peuvent pas être placées à 12\" ou moins d'elle." },
        { name: "Vanguard Protocols",
          text: "Si cette figurine est rattachée à une unité CANOPTEK MACROCYTES à l'étape de Déclaration des Formations de Bataille, elle a l'aptitude Éclaireurs 8\"." }
      ],
      composition: "1 Geomancer"
    },

    {
      id: "hexmark-destroyer",
      name: "Hexmark Destroyer",
      category: "char-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Destroyer Cult", "Hexmark Destroyer", "Necrons"],
      stats: { M: "8\"", T: 5, Sv: "3+", W: 5, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      coreAbilities: ["deep-strike", "lone-operative"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "enmitic-disintegrator-pistols", name: "Enmitic disintegrator pistols", type: "ranged",
          profiles: [{ range: "18\"", A: "6", skill: "2+", S: "6", AP: "-2", D: "1", abilities: ["ignores-cover", "pistol"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["enmitic-disintegrator-pistols", "close-combat-weapon"],
      abilities: [
        { name: "Inescapable Death", usage: "une-fois-par-tour",
          text: "Une fois par tour, une unité de votre armée qui a cette aptitude peut être ciblée par le stratagème Tir en État d'Alerte pour 0 PC, même si vous avez déjà utilisé ce stratagème sur une autre unité à cette phase. De plus, chaque fois que vous ciblez cette unité avec ce stratagème, elle touche sur un jet non modifié de 2+." },
        { name: "Multi-threat Eliminator", usage: "une-fois-par-tour",
          text: "Une fois par tour, à la phase de Tir adverse, quand une unité ennemie fait une attaque de tir qui cible une unité NECRONS amie à 3\" ou moins d'une figurine qui a cette aptitude, après que l'unité ennemie a tiré, une figurine qui a cette aptitude et qui est à 3\" ou moins de la cible peut tirer comme si c'était votre phase de Tir. Elle doit alors cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible." }
      ],
      composition: "1 Hexmark Destroyer"
    },

    {
      id: "overlord",
      name: "Overlord",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Noble", "Overlord", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Immortals", "Lychguard", "Necron Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "staff-of-light", name: "Staff of light", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "tachyon-arrow", name: "Tachyon arrow", type: "ranged",
          profiles: [{ range: "72\"", A: "1", skill: "2+", S: "16", AP: "-5", D: "D6+2", abilities: ["one-shot"] }] },
        { id: "overlords-blade", name: "Overlord's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "staff-of-light-melee", name: "Staff of light", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "voidscythe", name: "Voidscythe", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "12", AP: "-3", D: "3", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "resurrection-orb", name: "Resurrection orb" }],
      loadout: ["tachyon-arrow", "overlords-blade"],
      // L'orbe n'est possible que sans tachyon arrow : proposée avec le remplacement
      options: [
        { id: "remplace", text: "Le tachyon arrow et l'Overlord's blade peuvent être remplacés par 1 staff of light ou 1 voidscythe. Sans tachyon arrow, cette figurine peut être équipée de 1 resurrection orb.",
          replaces: ["tachyon-arrow", "overlords-blade"],
          choices: [["staff-of-light", "staff-of-light-melee"], ["voidscythe"],
                    ["staff-of-light", "staff-of-light-melee", "resurrection-orb"], ["voidscythe", "resurrection-orb"]] }
      ],
      abilities: [
        { name: "My Will Be Done", usage: "une-fois-par-round",
          text: "Une fois par round, une unité de votre armée qui a cette aptitude peut l'utiliser quand elle est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Implacable Resilience",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de l'attaque." },
        { name: "Resurrection Orb", requiresWargear: "resurrection-orb", usage: "une-fois-par-bataille",
          text: "Une fois par bataille et par unité, à la fin de n'importe quelle phase, vous pouvez utiliser cette aptitude : cette unité ressuscite. Ses Protocoles de Réanimation s'activent, mais elle récupère D6 PV (au lieu de D3). Vous ne pouvez pas faire ressusciter plus d'une unité par tour." }
      ],
      composition: "1 Overlord"
    },

    {
      id: "overlord-with-translocation-shroud",
      name: "Overlord with Translocation Shroud",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Noble", "Overlord", "Overlord with Translocation Shroud", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Immortals", "Lychguard", "Necron Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "overlords-blade", name: "Overlord's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "resurrection-orb", name: "Resurrection orb" }],
      loadout: ["overlords-blade", "resurrection-orb"],
      abilities: [
        { name: "My Will Be Done", usage: "une-fois-par-round",
          text: "Une fois par round, une unité de votre armée qui a cette aptitude peut l'utiliser quand elle est ciblée par un stratagème : cette utilisation du stratagème coûte 1 PC de moins." },
        { name: "Translocation Shroud", grants: "unite-menee",
          text: "Chaque fois que l'unité de cette figurine Avance, ne faites pas de jet d'Avance : jusqu'à la fin de la phase, ajoutez 6\" au Mouvement de ses figurines. De plus, chaque fois qu'une figurine de cette unité fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser horizontalement les figurines et les éléments de terrain jusqu'à la fin du mouvement (elle ne peut pas finir sur une autre figurine ou son socle)." },
        { name: "Resurrection Orb", requiresWargear: "resurrection-orb", usage: "une-fois-par-bataille",
          text: "Une fois par bataille et par unité, à la fin de n'importe quelle phase, vous pouvez utiliser cette aptitude : cette unité ressuscite. Ses Protocoles de Réanimation s'activent, mais elle récupère D6 PV (au lieu de D3). Vous ne pouvez pas faire ressusciter plus d'une unité par tour." }
      ],
      composition: "1 Overlord with Translocation Shroud"
    },

    {
      id: "plasmancer",
      name: "Plasmancer",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Cryptek", "Plasmancer", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { type: "support", canLead: ["Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "plasmic-lance", name: "Plasmic lance", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "4+", S: "7", AP: "-3", D: "2", abilities: [] }] },
        { id: "plasmic-lance-melee", name: "Plasmic lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "7", AP: "-3", D: "2", abilities: [] }] }
      ],
      loadout: ["plasmic-lance", "plasmic-lance-melee"],
      abilities: [
        { name: "Harbinger of Destruction", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque de tir, un jet de touche non modifié de 5+ est une Touche Critique." },
        { name: "Living Lightning",
          text: "À votre phase de Tir, choisissez 1 unité ennemie à 18\" ou moins de cette figurine et visible d'elle (sauf une unité Agent Solitaire qui ne fait pas partie d'une unité rattachée et qui n'est pas à 12\" ou moins), et lancez 4D6 : pour chaque 4+, cette unité subit 1 blessure mortelle." }
      ],
      composition: "1 Plasmancer"
    },

    {
      id: "psychomancer",
      name: "Psychomancer",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Cryptek", "Psychomancer", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { type: "support", canLead: ["Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "abyssal-lance", name: "Abyssal lance", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "4+", S: "6", AP: "-3", D: "3", abilities: [] }] },
        { id: "abyssal-lance-melee", name: "Abyssal lance", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "6", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["abyssal-lance", "abyssal-lance-melee"],
      abilities: [
        { name: "Nightmare Shroud (Aura)",
          text: "À l'étape d'Ébranlement de la phase de Commandement adverse, si une unité ennemie en dessous de son effectif initial est à 6\" ou moins de cette figurine, elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat." },
        { name: "Harbinger of Despair", usage: "une-fois-par-tour",
          text: "Une fois par tour, au début de votre phase de Commandement, de Mouvement, de Tir, de Charge ou de Combat, vous pouvez choisir 1 unité ennemie à 18\" ou moins de cette figurine : elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat." }
      ],
      composition: "1 Psychomancer"
    },

    {
      id: "royal-warden",
      name: "Royal Warden",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Royal Warden", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 50 }] }],
      leader: { canLead: ["Immortals", "Necron Warriors"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "relic-gauss-blaster", name: "Relic gauss blaster", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["relic-gauss-blaster", "close-combat-weapon"],
      abilities: [
        { name: "Adaptive Strategy", grants: "unite-menee",
          text: "L'unité de cette figurine est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite." },
        { name: "Engrammatic Logic", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de n'importe quelle phase, vous pouvez choisir 1 unité NECRONS amie Ébranlée à 12\" ou moins de cette figurine : elle n'est plus Ébranlée." }
      ],
      composition: "1 Royal Warden"
    },

    {
      id: "skorpekh-lord",
      name: "Skorpekh Lord",
      category: "char-infantry",
      base: "60mm",
      keywords: ["Infantry", "Character", "Destroyer Cult", "Skorpekh Lord", "Necrons"],
      stats: { M: "8\"", T: 7, Sv: "3+", W: 7, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 95 }, { from: 3, pts: 105 }] }],
      leader: { canLead: ["Skorpekh Destroyers"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "enmitic-annihilator", name: "Enmitic annihilator", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["rapid-fire:2"] }] },
        { id: "flensing-claw", name: "Flensing claw", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "6", AP: "-1", D: "1", abilities: [] }] },
        { id: "hyperphase-harvester", name: "Hyperphase harvester", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "10", AP: "-3", D: "3", abilities: [] }] }
      ],
      loadout: ["enmitic-annihilator", "flensing-claw", "hyperphase-harvester"],
      abilities: [
        { name: "United In Destruction", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes de mêlée des figurines de cette unité ont [TOUCHES FATALES]." },
        { name: "Crimson Harvest",
          text: "Chaque fois que cette figurine finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 : sur 2 à 5, cette unité subit D3 blessures mortelles ; sur 6, elle subit D3+3 blessures mortelles." }
      ],
      composition: "1 Skorpekh Lord"
    },

    {
      id: "technomancer",
      name: "Technomancer",
      category: "char-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Cryptek", "Fly", "Technomancer", "Necrons"],
      stats: { M: "10\"", T: 4, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 80 }, { from: 2, pts: 90 }] }],
      leader: { type: "support", canLead: ["Canoptek Wraiths", "Immortals", "Necron Warriors"] },
      coreAbilities: ["support"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "staff-of-light", name: "Staff of light", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "4+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "staff-of-light-melee", name: "Staff of light", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      loadout: ["staff-of-light", "staff-of-light-melee"],
      abilities: [
        { name: "Rites of Reanimation", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les figurines de cette unité ont l'aptitude Insensible à la Douleur 5+." },
        { name: "Technomancer",
          text: "À la fin de votre phase de Mouvement, vous pouvez choisir 1 figurine NECRONS amie à 6\" ou moins du porteur : elle récupère jusqu'à D3 PV perdus. Chaque figurine ne peut être choisie qu'une fois par tour pour cette aptitude." }
      ],
      composition: "1 Technomancer"
    },

    /* ---------- Personnages montés ---------- */

    {
      id: "lokhust-lord",
      name: "Lokhust Lord",
      category: "char-mounted",
      base: "60mm (socle de vol)",
      keywords: ["Mounted", "Character", "Fly", "Destroyer Cult", "Lokhust Lord", "Necrons"],
      stats: { M: "8\"", T: 6, Sv: "3+", W: 6, Ld: "6+", OC: 2, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 80 }] }],
      leader: { canLead: ["Lokhust Destroyers", "Lokhust Heavy Destroyers"] },
      coreAbilities: ["leader"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "staff-of-light", name: "Staff of light", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "lords-blade", name: "Lord's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "staff-of-light-melee", name: "Staff of light", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      wargear: [
        { id: "nanoscarab-amulet", name: "Nanoscarab amulet" },
        { id: "resurrection-orb", name: "Resurrection orb" }
      ],
      loadout: ["staff-of-light", "staff-of-light-melee"],
      options: [
        { id: "lame", text: "Le staff of light peut être remplacé par 1 Lord's blade.",
          replaces: ["staff-of-light", "staff-of-light-melee"], choices: [["lords-blade"]] },
        { id: "equipement", text: "Cette figurine peut être équipée de 1 nanoscarab amulet ou de 1 resurrection orb.",
          choices: [["nanoscarab-amulet"], ["resurrection-orb"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Destroyer Cult", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque de tir, un jet de touche non modifié de 5+ est une Touche Critique." },
        { name: "Driven by Hatred",
          text: "Chaque fois que cette figurine attaque une unité ennemie en dessous de la moitié de son effectif, vous pouvez relancer le jet de touche et le jet de blessure." },
        { name: "Nanoscarab Amulet", requiresWargear: "nanoscarab-amulet",
          text: "Le porteur a l'aptitude Insensible à la Douleur 5+." },
        { name: "Resurrection Orb", requiresWargear: "resurrection-orb", usage: "une-fois-par-bataille",
          text: "Une fois par bataille et par unité, à la fin de n'importe quelle phase, vous pouvez utiliser cette aptitude : cette unité ressuscite. Ses Protocoles de Réanimation s'activent, mais elle récupère D6 PV (au lieu de D3). Vous ne pouvez pas faire ressusciter plus d'une unité par tour." }
      ],
      composition: "1 Lokhust Lord"
    },

    /* ---------- Personnages monstres ----------
       C'tan Shard : pas d'optimisation, sauf celle prévue par le Panthéon de
       Malheur (Longe Relativiste). Les optimisations « tout Necrons » des
       détachements l'excluent (excludes). */

    {
      id: "transcendent-ctan",
      name: "Transcendent C'tan",
      category: "char-monster",
      base: "60mm (socle de vol)",
      keywords: ["Monster", "Character", "Fly", "Transcendent C'tan", "Necrons"],
      stats: { M: "8\"", T: 11, Sv: "3+", W: 16, Ld: "6+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 340 }, { from: 2, pts: 360 }] }],
      cannotBeWarlord: true,
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:5+"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "seismic-assault", name: "Seismic assault", type: "ranged",
          profiles: [{ range: "12\"", A: "6", skill: "2+", S: "8", AP: "-2", D: "2", abilities: ["assault", "sustained-hits:1"] }] },
        { id: "crackling-tendrils", name: "Crackling tendrils", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "2+", S: "10", AP: "-3", D: "D6", abilities: ["sustained-hits:1"] }] }
      ],
      loadout: ["seismic-assault", "crackling-tendrils"],
      abilities: [
        { name: "Enslaved Star God",
          text: "Cette figurine ne peut pas être votre Seigneur de Guerre." },
        { name: "C'tan Shard",
          text: "Cette figurine ne peut pas recevoir d'optimisation (sauf celle imposée par le Panthéon de Malheur)." },
        { name: "Transdimensional Displacement",
          text: "À votre phase de Mouvement, quand cette unité est choisie pour faire une Avance, vous pouvez utiliser cette aptitude. Dans ce cas :\n• cette Avance n'a pas de distance maximale ;\n• cette unité peut traverser tous les types de figurines (y compris les figurines ennemies et les figurines MONSTER et VEHICLE) ;\n• après ce mouvement, elle doit être à plus de 8\" horizontalement de toutes les unités ennemies." },
        { name: "Necrodermis",
          text: "Chaque fois qu'une attaque est allouée à cette figurine, soustrayez 1 à la caractéristique de Dégâts de l'attaque." }
      ],
      composition: "1 Transcendent C'tan"
    },

    /* ---------- Personnages véhicules ---------- */

    {
      id: "catacomb-command-barge",
      name: "Catacomb Command Barge",
      category: "char-vehicle",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Character", "Noble", "Fly", "Frame", "Catacomb Command Barge", "Necrons"],
      stats: { M: "10\"", T: 8, Sv: "3+", W: 9, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 120 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-cannon", name: "Gauss cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "staff-of-light", name: "Staff of light", type: "ranged",
          profiles: [{ range: "18\"", A: "3", skill: "2+", S: "5", AP: "-2", D: "1", abilities: [] }] },
        { id: "tesla-cannon", name: "Tesla cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "3+", S: "6", AP: "0", D: "1", abilities: ["sustained-hits:2"] }] },
        { id: "overlords-blade", name: "Overlord's blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] },
        { id: "staff-of-light-melee", name: "Staff of light", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      wargear: [{ id: "resurrection-orb", name: "Resurrection orb" }],
      loadout: ["gauss-cannon", "staff-of-light", "staff-of-light-melee"],
      options: [
        { id: "canon", text: "Le gauss cannon peut être remplacé par 1 tesla cannon.",
          replaces: ["gauss-cannon"], choices: [["tesla-cannon"]] },
        { id: "lame", text: "Le staff of light peut être remplacé par 1 Overlord's blade.",
          replaces: ["staff-of-light", "staff-of-light-melee"], choices: [["overlords-blade"]] },
        { id: "orbe", text: "Cette figurine peut être équipée de 1 resurrection orb.",
          choices: [["resurrection-orb"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Carrier Wave (Aura)",
          text: "Tant qu'une unité NECRONS amie est à 6\" ou moins de cette figurine, ajoutez 1 à la CO des figurines de cette unité." },
        { name: "Advanced Quantum Shielding",
          text: "Chaque fois qu'une attaque cible cette figurine, si la Force de l'attaque est supérieure à son Endurance, soustrayez 1 au jet de blessure." },
        { name: "Resurrection Orb", requiresWargear: "resurrection-orb", usage: "une-fois-par-bataille",
          text: "Une fois par bataille et par unité, à la fin de n'importe quelle phase, vous pouvez utiliser cette aptitude : choisissez jusqu'à 1 unité NECRONS INFANTRY ou NECRONS MOUNTED amie à 6\" ou moins de cette unité. Cette unité ressuscite : ses Protocoles de Réanimation s'activent, mais elle récupère D6 PV (au lieu de D3). Vous ne pouvez pas faire ressusciter plus d'une unité par tour." }
      ],
      composition: "1 Catacomb Command Barge"
    },

    /* ---------- Ligne ---------- */

    {
      id: "immortals",
      name: "Immortals",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Immortals", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "3+", W: 1, Ld: "7+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 65 }] },
        { models: 10, costs: [{ from: 1, pts: 130 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-blaster", name: "Gauss blaster", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "tesla-carbine", name: "Tesla carbine", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["assault", "sustained-hits:2"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-blaster", "close-combat-weapon"],
      options: [
        { id: "tesla", text: "Toutes les figurines de cette unité peuvent remplacer leur gauss blaster par 1 tesla carbine (toute l'unité ou aucune).",
          allModels: true, replaces: ["gauss-blaster"], choices: [["tesla-carbine"]] }
      ],
      abilities: [
        { name: "Implacable Eradication",
          text: "Chaque fois qu'une figurine de cette unité attaque, relancez un jet de blessure de 1. Si la cible est une unité ennemie à portée d'un pion objectif, vous pouvez relancer le jet de blessure à la place." }
      ],
      composition: "5 à 10 Immortals"
    },

    {
      id: "necron-warriors",
      name: "Necron Warriors",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Necron Warriors", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 1, Ld: "7+", OC: 2 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 85 }] },
        { models: 20, costs: [{ from: 1, pts: 190 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-flayer", name: "Gauss flayer", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["lethal-hits", "rapid-fire:1"] }] },
        { id: "gauss-reaper", name: "Gauss reaper", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "4+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-flayer", "close-combat-weapon"],
      options: [
        { id: "reaper", text: "N'importe quel nombre de figurines peuvent remplacer leur gauss flayer par 1 gauss reaper.",
          replaces: ["gauss-flayer"], choices: [["gauss-reaper"]] }
      ],
      abilities: [
        { name: "Their Number is Legion",
          text: "Chaque fois que les Protocoles de Réanimation de cette unité s'activent, vous pouvez relancer le dé qui détermine le nombre de PV récupérés." }
      ],
      composition: "10 à 20 Necron Warriors"
    },

    /* ---------- Infanterie ---------- */

    {
      id: "cryptothralls",
      name: "Cryptothralls",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Cryptothralls", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "3+", W: 3, Ld: "8+", OC: 1 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 60 }] }],
      retinue: { ledBy: [["Cryptek"]], label: "CRYPTEK" },
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "scouring-eye", name: "Scouring eye", type: "ranged",
          profiles: [{ range: "6\"", A: "2", skill: "4+", S: "5", AP: "-1", D: "1", abilities: [] }] },
        { id: "scythed-limbs", name: "Scythed limbs", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "5", AP: "-1", D: "1", abilities: [] }] }
      ],
      loadout: ["scouring-eye", "scythed-limbs"],
      abilities: [
        { name: "Bound Creation",
          text: "Tant que cette unité fait partie de la même unité qu'une figurine CRYPTEK, cette figurine CRYPTEK a l'aptitude Insensible à la Douleur 4+." },
        { name: "Systematic Vigour",
          text: "Chaque fois qu'une figurine CRYPTOTHRALL de cette unité est détruite par une attaque de mêlée, si elle n'a pas combattu à cette phase, lancez 1D6 : sur 2+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée." },
        { name: "Cryptek Retinue",
          text: "Au début de l'étape de Déclaration des Formations de Bataille, cette unité peut rejoindre 1 autre unité de votre armée menée par une figurine CRYPTEK (une unité ne peut pas avoir plus d'une unité CRYPTOTHRALLS rattachée). Jusqu'à la fin de la bataille, chaque figurine de cette unité fait alors partie de cette unité de gardes du corps, dont l'effectif initial est augmenté d'autant." }
      ],
      composition: "2 Cryptothralls"
    },

    {
      id: "deathmarks",
      name: "Deathmarks",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Deathmarks", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "3+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 60 },  { from: 3, pts: 70 }] },
        { models: 10, costs: [{ from: 1, pts: 120 }, { from: 3, pts: 130 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "synaptic-disintegrator", name: "Synaptic disintegrator", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["heavy", "precision"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["synaptic-disintegrator", "close-combat-weapon"],
      abilities: [
        { name: "Hyperspace Hunters", usage: "une-fois-par-tour",
          text: "Une fois par tour, à l'étape des Renforts de la phase de Mouvement adverse, quand une unité ennemie est placée sur le champ de bataille depuis les Réserves à 18\" ou moins de cette unité et visible d'elle, cette unité peut tirer comme si c'était votre phase de Tir. Elle doit alors cibler uniquement cette unité ennemie, et seulement si c'est une cible éligible." }
      ],
      composition: "5 à 10 Deathmarks"
    },

    {
      id: "flayed-ones",
      name: "Flayed Ones",
      category: "infantry",
      base: "28,5mm",
      keywords: ["Infantry", "Flayed Ones", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "4+", W: 1, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 55 }] },
        { models: 10, costs: [{ from: 1, pts: 100 }] }
      ],
      coreAbilities: ["infiltrators", "stealth"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "flayer-claws", name: "Flayer claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["sustained-hits:1", "twin-linked"] }] }
      ],
      loadout: ["flayer-claws"],
      abilities: [
        { name: "Flesh Hunger",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée, si la cible est en dessous de la moitié de son effectif, un jet de touche réussi est une Touche Critique." }
      ],
      composition: "5 à 10 Flayed Ones"
    },

    {
      id: "lychguard",
      name: "Lychguard",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Lychguard", "Necrons"],
      stats: { M: "5\"", T: 5, Sv: "3+", W: 2, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 80 }] },
        { models: 10, costs: [{ from: 1, pts: 160 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "hyperphase-sword", name: "Hyperphase sword", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-2", D: "1", abilities: [] }] },
        { id: "warscythe", name: "Warscythe", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      wargear: [{ id: "dispersion-shield", name: "Dispersion shield" }],
      loadout: ["warscythe"],
      options: [
        { id: "epee", text: "Toutes les figurines de cette unité peuvent remplacer leur warscythe par 1 hyperphase sword et 1 dispersion shield (toute l'unité ou aucune).",
          allModels: true, replaces: ["warscythe"], choices: [["hyperphase-sword", "dispersion-shield"]] }
      ],
      abilities: [
        { name: "Guardian Protocols",
          text: "Tant qu'une figurine NOBLE mène cette unité, chaque fois qu'une attaque cible cette unité, si la Force de l'attaque est supérieure à l'Endurance de cette unité, soustrayez 1 au jet de blessure." },
        { name: "Dispersion Shield", requiresWargear: "dispersion-shield",
          text: "Le porteur a une sauvegarde invulnérable de 4+." }
      ],
      composition: "5 à 10 Lychguard"
    },

    {
      id: "ophydian-destroyers",
      name: "Ophydian Destroyers",
      category: "infantry",
      base: "50mm",
      keywords: ["Infantry", "Destroyer Cult", "Ophydian Destroyers", "Necrons"],
      stats: { M: "10\"", T: 5, Sv: "4+", W: 3, Ld: "7+", OC: 2 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 80 },  { from: 3, pts: 90 }] },
        { models: 6, costs: [{ from: 1, pts: 150 }, { from: 3, pts: 160 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "ophydian-hyperphase-weapons", name: "Ophydian hyperphase weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "plasmacyte", name: "Plasmacyte" }],
      loadout: ["ophydian-hyperphase-weapons"],
      options: [
        { id: "plasmacyte", text: "Pour chaque tranche de 3 figurines, cette unité peut avoir 1 Plasmacyte.",
          choices: [["plasmacyte"]], max: { per: 3, count: 1 } }
      ],
      abilities: [
        { name: "Tunnelling Horrors",
          text: "À la fin du tour adverse, si cette unité n'est pas engagée, vous pouvez utiliser cette aptitude :\n• placez cette unité en Réserves Stratégiques ;\n• elle doit faire un mouvement d'arrivée à votre prochaine phase de Mouvement (y compris pendant votre premier tour)." },
        { name: "Plasmacyte", requiresWargear: "plasmacyte", usage: "une-fois-par-bataille",
          text: "Une fois par bataille pour chaque Plasmacyte de cette unité, quand cette unité est choisie pour combattre, vous pouvez utiliser cette aptitude : jusqu'à la fin de la phase, les armes de mêlée de ses figurines ont [BLESSURES DÉVASTATRICES]." }
      ],
      composition: "3 à 6 Ophydian Destroyers"
    },

    {
      id: "skorpekh-destroyers",
      name: "Skorpekh Destroyers",
      category: "infantry",
      base: "50mm",
      keywords: ["Infantry", "Destroyer Cult", "Skorpekh Destroyers", "Necrons"],
      stats: { M: "8\"", T: 6, Sv: "3+", W: 3, Ld: "7+", OC: 2 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 85 },  { from: 3, pts: 95 }] },
        { models: 6, costs: [{ from: 1, pts: 170 }, { from: 3, pts: 180 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "skorpekh-hyperphase-weapons", name: "Skorpekh hyperphase weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "7", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [{ id: "plasmacyte", name: "Plasmacyte" }],
      loadout: ["skorpekh-hyperphase-weapons"],
      options: [
        { id: "plasmacyte", text: "Pour chaque tranche de 3 figurines, cette unité peut avoir 1 Plasmacyte.",
          choices: [["plasmacyte"]], max: { per: 3, count: 1 } }
      ],
      abilities: [
        { name: "Whirling Onslaught",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de mêlée, relancez un jet de touche de 1. Si cette unité a fait un mouvement de Charge à ce tour, vous pouvez relancer le jet de touche à la place." },
        { name: "Plasmacyte", requiresWargear: "plasmacyte", usage: "une-fois-par-bataille",
          text: "Une fois par bataille pour chaque Plasmacyte de cette unité, quand cette unité est choisie pour combattre, vous pouvez utiliser cette aptitude : jusqu'à la fin de la phase, les armes de mêlée de ses figurines ont [BLESSURES DÉVASTATRICES]." }
      ],
      composition: "3 à 6 Skorpekh Destroyers"
    },

    {
      id: "triarch-praetorians",
      name: "Triarch Praetorians",
      category: "infantry",
      base: "32mm",
      keywords: ["Infantry", "Fly", "Triarch", "Praetorians", "Triarch Praetorians", "Necrons"],
      stats: { M: "10\"", T: 5, Sv: "3+", W: 2, Ld: "7+", OC: 1 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 80 }] },
        { models: 10, costs: [{ from: 1, pts: 160 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "particle-caster", name: "Particle caster", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["devastating-wounds", "pistol"] }] },
        { id: "rod-of-covenant", name: "Rod of covenant", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "rod-of-covenant-melee", name: "Rod of covenant", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: [] }] },
        { id: "voidblade", name: "Voidblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: [] }] }
      ],
      loadout: ["rod-of-covenant", "rod-of-covenant-melee"],
      options: [
        { id: "lame", text: "Toutes les figurines de cette unité peuvent remplacer leur rod of covenant par 1 particle caster et 1 voidblade (toute l'unité ou aucune).",
          allModels: true, replaces: ["rod-of-covenant", "rod-of-covenant-melee"], choices: [["particle-caster", "voidblade"]] }
      ],
      abilities: [
        { name: "Relentless Combatants",
          text: "Vous pouvez relancer les jets de Charge de cette unité, et elle est éligible pour déclarer une charge à un tour où elle a Battu en Retraite." }
      ],
      composition: "5 à 10 Triarch Praetorians"
    },

    /* ---------- Montés ---------- */

    {
      id: "lokhust-destroyers",
      name: "Lokhust Destroyers",
      category: "mounted",
      base: "60mm (socle de vol)",
      keywords: ["Mounted", "Fly", "Destroyer Cult", "Lokhust Destroyers", "Necrons"],
      stats: { M: "8\"", T: 6, Sv: "3+", W: 3, Ld: "7+", OC: 2 },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 40 },  { from: 3, pts: 70 }] },
        { models: 2, costs: [{ from: 1, pts: 55 },  { from: 3, pts: 85 }] },
        { models: 3, costs: [{ from: 1, pts: 80 },  { from: 3, pts: 110 }] },
        { models: 6, costs: [{ from: 1, pts: 190 }, { from: 3, pts: 220 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-cannon", name: "Gauss cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-cannon", "close-combat-weapon"],
      abilities: [
        { name: "Hard-wired for Destruction",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir qui cible l'unité ennemie éligible la plus proche, relancez un jet de touche de 1. Si la cible est à portée d'un pion objectif contrôlé par votre adversaire, vous pouvez relancer le jet de touche à la place." }
      ],
      composition: "1 à 6 Lokhust Destroyers"
    },

    {
      id: "lokhust-heavy-destroyers",
      name: "Lokhust Heavy Destroyers",
      category: "mounted",
      base: "60mm",
      keywords: ["Mounted", "Fly", "Destroyer Cult", "Lokhust Heavy Destroyers", "Necrons"],
      stats: { M: "8\"", T: 6, Sv: "3+", W: 4, Ld: "7+", OC: 2 },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 50 },  { from: 3, pts: 60 }] },
        { models: 2, costs: [{ from: 1, pts: 100 }, { from: 3, pts: 110 }] },
        { models: 3, costs: [{ from: 1, pts: 165 }, { from: 3, pts: 175 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "enmitic-exterminator", name: "Enmitic exterminator", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["heavy", "rapid-fire:6", "sustained-hits:1"] }] },
        { id: "gauss-destructor", name: "Gauss destructor", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "14", AP: "-4", D: "6", abilities: ["heavy", "lethal-hits"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-destructor", "close-combat-weapon"],
      options: [
        { id: "exterminator", text: "N'importe quel nombre de figurines peuvent remplacer leur gauss destructor par 1 enmitic exterminator.",
          replaces: ["gauss-destructor"], choices: [["enmitic-exterminator"]] }
      ],
      abilities: [
        { name: "Optimised for Slaughter",
          text: "Chaque fois qu'une figurine de cette unité attaque avec un enmitic exterminator une unité (sauf MONSTER et VEHICLE), relancez un jet de blessure de 1. Chaque fois qu'une figurine de cette unité attaque avec un gauss destructor une unité MONSTER ou VEHICLE, relancez un jet de blessure de 1." }
      ],
      composition: "1 à 3 Lokhust Heavy Destroyers"
    },

    {
      id: "tomb-blades",
      name: "Tomb Blades",
      category: "mounted",
      base: "32mm (socle de vol)",
      keywords: ["Mounted", "Fly", "Tomb Blades", "Necrons"],
      stats: { M: "12\"", T: 5, Sv: "4+", W: 2, Ld: "7+", OC: 2 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 70 },  { from: 3, pts: 80 }] },
        { models: 6, costs: [{ from: 1, pts: 140 }, { from: 3, pts: 150 }] }
      ],
      coreAbilities: ["scouts:9\""],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "particle-beamer", name: "Particle beamer", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast", "devastating-wounds"] }] },
        { id: "twin-gauss-blaster", name: "Twin gauss blaster", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "twin-linked"] }] },
        { id: "twin-tesla-carbine", name: "Twin tesla carbine", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["assault", "sustained-hits:2", "twin-linked"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: [] }] }
      ],
      wargear: [
        { id: "shieldvanes", name: "Shieldvanes" },
        { id: "nebuloscope", name: "Nebuloscope" },
        { id: "shadowloom", name: "Shadowloom" }
      ],
      loadout: ["twin-gauss-blaster", "close-combat-weapon"],
      options: [
        { id: "armes", text: "N'importe quel nombre de figurines peuvent remplacer leur twin gauss blaster par 1 particle beamer ou 1 twin tesla carbine.",
          replaces: ["twin-gauss-blaster"], choices: [["particle-beamer"], ["twin-tesla-carbine"]] },
        { id: "shieldvanes", text: "N'importe quel nombre de figurines peuvent être équipées de 1 shieldvanes.",
          choices: [["shieldvanes"]] },
        { id: "systeme", text: "N'importe quel nombre de figurines peuvent être équipées de 1 nebuloscope ou de 1 shadowloom.",
          choices: [["nebuloscope"], ["shadowloom"]] }
      ],
      abilities: [
        { name: "Evasion Engrams",
          text: "À votre phase de Tir, après que cette unité a tiré, elle peut faire un Mouvement Normal de 6\" maximum. Dans ce cas, jusqu'à la fin du tour, elle n'est pas éligible pour déclarer une charge." },
        { name: "Nebuloscope", requiresWargear: "nebuloscope",
          text: "Les armes de tir du porteur ont [IGNORE LE COUVERT]." },
        { name: "Shadowloom", requiresWargear: "shadowloom",
          text: "Le porteur a l'aptitude Discrétion." },
        { name: "Shieldvanes", requiresWargear: "shieldvanes",
          text: "Le porteur a une Sauvegarde de 3+ et un Mouvement de 8\" (non recalculé sur la fiche)." }
      ],
      composition: "3 à 6 Tomb Blades"
    },

    /* ---------- Transports assignés ----------
       Ghost Ark : 10 NECRON WARRIORS + 1 NECRONS INFANTRY CHARACTER,
       vérifié par transport.limits (js/regles-etendues.js). */

    {
      id: "ghost-ark",
      name: "Ghost Ark",
      category: "dedicated-transport",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Frame", "Transport", "Dedicated Transport", "Ghost Ark", "Necrons"],
      stats: { M: "10\"", T: 9, Sv: "3+", W: 14, Ld: "7+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-flayer-array", name: "Gauss flayer array", type: "ranged",
          profiles: [{ range: "24\"", A: "5", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["lethal-hits", "rapid-fire:5"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-flayer-array", "gauss-flayer-array", "armoured-bulk"],
      transport: {
        capacity: 11,
        allowed: [["Necron Warriors"], ["Necrons", "Infantry", "Character"]],
        limits: [
          { to: [["Necron Warriors"]], max: 10, label: "figurine NECRON WARRIORS", labelPlural: "figurines NECRON WARRIORS" },
          { to: [["Character"]], max: 1, label: "personnage" }
        ],
        text: "Capacité de transport de 10 figurines NECRON WARRIORS et 1 figurine NECRONS INFANTRY CHARACTER."
      },
      abilities: [
        { name: "Repair Barge", usage: "une-fois-par-tour",
          text: "Une fois par tour, juste après qu'une unité ennemie a fini ses attaques, si une ou plusieurs unités NECRON WARRIORS amies à 3\" ou moins de cette figurine ont perdu un ou plusieurs PV à cause de ces attaques, cette figurine peut utiliser cette aptitude : choisissez une de ces unités NECRON WARRIORS, ses Protocoles de Réanimation s'activent. Une même unité NECRON WARRIORS ne peut pas être choisie plus d'une fois par tour pour cette aptitude." }
      ],
      composition: "1 Ghost Ark"
    },

    /* ---------- Aéronefs ---------- */

    {
      id: "doom-scythe",
      name: "Doom Scythe",
      category: "aircraft",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Aircraft", "Fly", "Doom Scythe", "Necrons"],
      stats: { M: "-", T: 9, Sv: "3+", W: 12, Ld: "7+", OC: "-" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 200 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "heavy-death-ray", name: "Heavy death ray", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "16", AP: "-4", D: "D6+1", abilities: ["sustained-hits:D3"] }] },
        { id: "twin-tesla-destructor", name: "Twin tesla destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "8", AP: "0", D: "2", abilities: ["sustained-hits:2", "twin-linked"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["heavy-death-ray", "twin-tesla-destructor", "armoured-bulk"],
      abilities: [
        { name: "Atavistic Instigation",
          text: "Chaque fois que cette figurine cible une unité ennemie avec son heavy death ray, votre adversaire doit déclarer si cette unité tient bon ou se met à couvert :\n• si elle tient bon, quand vous résolvez des attaques de tir contre elle à cette phase, un jet de touche non modifié de 5+ est une Touche Critique ;\n• si elle se met à couvert, jusqu'au début de votre prochaine phase de Tir, chaque fois qu'une figurine de cette unité attaque, soustrayez 1 au jet de touche." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Doom Scythe"
    },

    /* ---------- Bêtes ---------- */

    {
      id: "canoptek-macrocytes",
      name: "Canoptek Macrocytes",
      category: "beasts",
      base: "28,5mm",
      keywords: ["Beasts", "Fly", "Canoptek", "Macrocytes", "Canoptek Macrocytes", "Necrons"],
      stats: { M: "8\"", T: 3, Sv: "4+", W: 1, Ld: "8+", OC: 1 },
      sizes: [{ models: 5, costs: [{ from: 1, pts: 70 }] }],
      coreAbilities: ["scouts:8\""],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "atomiser-beam", name: "Atomiser beam", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "6", AP: "-1", D: "1", abilities: [] }] },
        { id: "gauss-scalpel", name: "Gauss scalpel", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "4+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "tesla-caster", name: "Tesla caster", type: "ranged",
          profiles: [{ range: "18\"", A: "1", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["assault", "sustained-hits:1"] }] },
        { id: "claws", name: "Claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "4", AP: "-1", D: "1", abilities: [] }] }
      ],
      wargear: [
        { id: "nanoscarab-projector", name: "Nanoscarab projector" },
        { id: "accelerator-mandible", name: "Accelerator mandible" }
      ],
      loadout: ["gauss-scalpel", "claws"],
      // « Gauss scalpel ou tesla caster » : une option par arme remplacée, avec un maximum commun (sharedMax).
      // L'option tesla doit rester la première (elle est appliquée avant les remplacements d'une figurine).
      options: [
        { id: "tesla", text: "Toutes les figurines de cette unité peuvent remplacer leur gauss scalpel par 1 tesla caster (toute l'unité ou aucune).",
          allModels: true, replaces: ["gauss-scalpel"], choices: [["tesla-caster"]] },
        { id: "atomiser-scalpel", text: "Le gauss scalpel d'1 figurine peut être remplacé par 1 atomiser beam et 1 nanoscarab projector.",
          replaces: ["gauss-scalpel"], choices: [["atomiser-beam", "nanoscarab-projector"]], max: { count: 1 }, sharedMax: "atomiser" },
        { id: "atomiser-tesla", text: "Le tesla caster d'1 figurine peut être remplacé par 1 atomiser beam et 1 nanoscarab projector.",
          replaces: ["tesla-caster"], choices: [["atomiser-beam", "nanoscarab-projector"]], max: { count: 1 }, sharedMax: "atomiser" },
        { id: "mandible-scalpel", text: "Le gauss scalpel d'1 figurine peut être remplacé par 1 accelerator mandible.",
          replaces: ["gauss-scalpel"], choices: [["accelerator-mandible"]], max: { count: 1 }, sharedMax: "mandible" },
        { id: "mandible-tesla", text: "Le tesla caster d'1 figurine peut être remplacé par 1 accelerator mandible.",
          replaces: ["tesla-caster"], choices: [["accelerator-mandible"]], max: { count: 1 }, sharedMax: "mandible" }
      ],
      abilities: [
        { name: "Harassment Swarm (Aura)",
          text: "Tant qu'une unité ennemie (sauf MONSTER et VEHICLE) est à 3\" ou moins de cette unité, chaque fois qu'une figurine de cette unité ennemie attaque, soustrayez 1 au jet de touche." },
        { name: "Accelerator Mandible", requiresWargear: "accelerator-mandible",
          text: "Au début de la phase de Combat, choisissez 1 unité CANOPTEK amie à 3\" ou moins de l'unité du porteur. Jusqu'à la fin de la phase, améliorez de 1 la CC des armes de ses figurines." },
        { name: "Nanoscarab Projector", requiresWargear: "nanoscarab-projector", usage: "une-fois-par-round",
          text: "Une fois par round, quand les Protocoles de Réanimation d'une unité NECRONS amie à 3\" ou moins du porteur s'activent, le porteur peut utiliser cette aptitude : cette unité récupère 1 PV supplémentaire." }
      ],
      composition: "5 Canoptek Macrocytes"
    },

    {
      id: "canoptek-tomb-crawlers",
      name: "Canoptek Tomb Crawlers",
      category: "beasts",
      base: "50mm",
      keywords: ["Beasts", "Canoptek", "Tomb Crawlers", "Canoptek Tomb Crawlers", "Necrons"],
      stats: { M: "5\"", T: 4, Sv: "3+", W: 3, Ld: "8+", OC: 1 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 60 }] }],
      retinue: { ledBy: [["Cryptek"]], label: "CRYPTEK" },
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "transdimensional-isolator", name: "Transdimensional isolator", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "4+", S: "4", AP: "-2", D: "2", abilities: [] }] },
        { id: "twin-gauss-reaper", name: "Twin gauss reaper", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "4+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits", "twin-linked"] }] },
        { id: "claws", name: "Claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "6", AP: "-1", D: "1", abilities: [] }] }
      ],
      loadout: ["twin-gauss-reaper", "claws"],
      options: [
        { id: "isolator", text: "Le twin gauss reaper d'1 figurine peut être remplacé par 1 transdimensional isolator.",
          replaces: ["twin-gauss-reaper"], choices: [["transdimensional-isolator"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Weapon Sentinels",
          text: "Chaque fois qu'une figurine de cette unité fait une attaque de tir qui cible une unité à 12\" ou moins, vous pouvez ignorer tout ou partie des modificateurs à la CT de l'attaque, au jet de touche et au jet de blessure." },
        { name: "Canoptek Retinue",
          text: "Au début de l'étape de Déclaration des Formations de Bataille, cette unité peut rejoindre 1 autre unité de votre armée menée par une figurine CRYPTEK (une unité ne peut pas avoir plus d'une unité TOMB CRAWLERS rattachée, ni à la fois une unité TOMB CRAWLERS et une unité CRYPTOTHRALLS). Jusqu'à la fin de la bataille, chaque figurine de cette unité fait alors partie de cette unité de gardes du corps, dont l'effectif initial est augmenté d'autant." }
      ],
      composition: "2 Canoptek Tomb Crawlers"
    },

    {
      id: "canoptek-wraiths",
      name: "Canoptek Wraiths",
      category: "beasts",
      base: "50mm",
      keywords: ["Beasts", "Fly", "Canoptek", "Wraiths", "Canoptek Wraiths", "Necrons"],
      stats: { M: "10\"", T: 6, Sv: "3+", W: 4, Ld: "8+", OC: 2, InSv: "4+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 95 },  { from: 2, pts: 115 }] },
        { models: 6, costs: [{ from: 1, pts: 220 }, { from: 2, pts: 240 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "particle-caster", name: "Particle caster", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "4+", S: "5", AP: "0", D: "1", abilities: ["devastating-wounds", "pistol"] }] },
        { id: "transdimensional-beamer", name: "Transdimensional beamer", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "4+", S: "4", AP: "-2", D: "3", abilities: [] }] },
        { id: "vicious-claws", name: "Vicious claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "6", AP: "-1", D: "2", abilities: [] }] },
        { id: "whip-coils", name: "Whip coils", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "4+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["vicious-claws"],
      options: [
        { id: "tir", text: "N'importe quel nombre de figurines peuvent être équipées de 1 particle caster ou de 1 transdimensional beamer.",
          choices: [["particle-caster"], ["transdimensional-beamer"]] },
        { id: "fouets", text: "N'importe quel nombre de figurines peuvent remplacer leurs vicious claws par des whip coils.",
          replaces: ["vicious-claws"], choices: [["whip-coils"]] }
      ],
      abilities: [
        { name: "Wraith Form",
          text: "Chaque fois que cette unité finit un Mouvement Normal, vous pouvez choisir 1 unité ennemie qu'elle a traversée pendant ce mouvement et lancer 1D6 pour chaque figurine de cette unité : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle." }
      ],
      composition: "3 à 6 Canoptek Wraiths"
    },

    /* ---------- Nuées ---------- */

    {
      id: "canoptek-scarab-swarms",
      name: "Canoptek Scarab Swarms",
      category: "swarms",
      base: "40mm",
      keywords: ["Swarm", "Fly", "Canoptek", "Scarab Swarms", "Canoptek Scarab Swarms", "Necrons"],
      stats: { M: "10\"", T: 2, Sv: "6+", W: 4, Ld: "8+", OC: 0 },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 40 }] },
        { models: 6, costs: [{ from: 1, pts: 80 }] }
      ],
      coreAbilities: [],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "feeder-mandibles", name: "Feeder mandibles", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "5+", S: "2", AP: "0", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["feeder-mandibles"],
      abilities: [
        { name: "Self-destruction",
          text: "Au début de la phase de Combat, si cette unité est à portée d'engagement d'une ou plusieurs unités ennemies, vous pouvez choisir 1 de ses figurines et la détruire. Dans ce cas, choisissez 1 unité ennemie à portée d'engagement de cette figurine et lancez 1D6 (+1 si cette unité est un VEHICLE) : sur 2 à 5, elle subit D3 blessures mortelles ; sur 6+, elle subit 3 blessures mortelles." },
        { name: "Chittering Swarm",
          text: "Tant qu'une unité ennemie est à portée d'engagement de cette unité, soustrayez 1 à la CO de ses figurines (minimum 1). Tant que cette unité est à 6\" ou moins d'une ou plusieurs figurines CRYPTEK amies, la CO de ses figurines est de 1." }
      ],
      composition: "3 à 6 Canoptek Scarab Swarms"
    },

    /* ---------- Transports ----------
       Night Scythe : capacité de 1 unité NECRONS INFANTRY, quel que soit son
       effectif (transport.maxUnits) ; capacity sert seulement de plafond large. */

    {
      id: "night-scythe",
      name: "Night Scythe",
      category: "transport",
      base: "120 x 92mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Transport", "Night Scythe", "Necrons"],
      stats: { M: "14\"", T: 9, Sv: "3+", W: 12, Ld: "7+", OC: 0 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike", "hover"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "twin-tesla-destructor", name: "Twin tesla destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "8", AP: "0", D: "2", abilities: ["sustained-hits:2", "twin-linked"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["twin-tesla-destructor", "armoured-bulk"],
      transport: {
        capacity: 99,
        maxUnits: 1,
        allowed: [["Necrons", "Infantry"]],
        text: "Capacité de transport de 1 unité NECRONS INFANTRY (avec ses personnages)."
      },
      abilities: [
        { name: "Invasion Beams",
          text: "À la fin de la phase de Combat, si aucune figurine n'est embarquée dans ce TRANSPORT, une unité NECRONS INFANTRY amie entièrement à 6\" ou moins de lui et qui n'est pas à portée d'engagement d'une ou plusieurs unités ennemies peut embarquer à bord." },
        { name: "Quantum Invader",
          text: "Vous pouvez placer cette figurine sur le champ de bataille à l'étape des Renforts de votre 1re, 2e ou 3e phase de Mouvement, quelles que soient les règles de mission." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Night Scythe"
    },

    /* ---------- Véhicules ---------- */

    {
      id: "annihilation-barge",
      name: "Annihilation Barge",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Frame", "Annihilation Barge", "Necrons"],
      stats: { M: "10\"", T: 8, Sv: "3+", W: 9, Ld: "7+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "gauss-cannon", name: "Gauss cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "tesla-cannon", name: "Tesla cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "4", skill: "3+", S: "6", AP: "0", D: "1", abilities: ["sustained-hits:2"] }] },
        { id: "twin-tesla-destructor", name: "Twin tesla destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "8", AP: "0", D: "2", abilities: ["sustained-hits:2", "twin-linked"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["gauss-cannon", "twin-tesla-destructor", "armoured-bulk"],
      options: [
        { id: "canon", text: "Le gauss cannon de cette figurine peut être remplacé par 1 tesla cannon.",
          replaces: ["gauss-cannon"], choices: [["tesla-cannon"]] }
      ],
      abilities: [
        { name: "Malevolent Arcing",
          text: "À votre phase de Tir, chaque fois que vous choisissez une cible pour le twin tesla destructor de cette figurine, lancez 1D6 pour l'unité ciblée et 1D6 pour chaque autre unité ennemie à 3\" ou moins d'elle. Sur 5+, l'unité concernée est frappée par des arcs d'énergie : après avoir résolu toutes les attaques de cette figurine contre l'unité ciblée, chaque unité frappée par des arcs d'énergie subit D3 blessures mortelles." }
      ],
      composition: "1 Annihilation Barge"
    },

    {
      id: "canoptek-spyders",
      name: "Canoptek Spyders",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Canoptek", "Spyders", "Canoptek Spyders", "Necrons"],
      stats: { M: "5\"", T: 7, Sv: "3+", W: 6, Ld: "8+", OC: 2 },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 65 }] },
        { models: 2, costs: [{ from: 1, pts: 110 }] }
      ],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "particle-beamer", name: "Particle beamer", type: "ranged",
          profiles: [{ range: "18\"", A: "D6", skill: "3+", S: "6", AP: "0", D: "1", abilities: ["blast", "devastating-wounds"] }] },
        { id: "automaton-claws", name: "Automaton claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "4+", S: "8", AP: "-2", D: "2", abilities: [] }] }
      ],
      wargear: [
        { id: "fabricator-claw-array", name: "Fabricator claw array" },
        { id: "gloom-prism", name: "Gloom prism" }
      ],
      loadout: ["automaton-claws"],
      options: [
        { id: "beamers", text: "N'importe quel nombre de figurines peuvent chacune être équipées de 2 particle beamers.",
          choices: [["particle-beamer", "particle-beamer"]] },
        { id: "fabricator", text: "N'importe quel nombre de figurines peuvent chacune être équipées de 1 fabricator claw array.",
          choices: [["fabricator-claw-array"]] },
        { id: "gloom", text: "N'importe quel nombre de figurines peuvent chacune être équipées de 1 gloom prism.",
          choices: [["gloom-prism"]] }
      ],
      abilities: [
        { name: "Canoptek Swarm",
          text: "À votre phase de Commandement, choisissez 1 unité CANOPTEK SCARAB SWARM amie à 6\" ou moins de cette unité. 1 figurine détruite revient dans cette unité CANOPTEK SCARAB SWARM pour chaque figurine SPYDER de cette unité." },
        { name: "Fabricator Claw Array (Aura)", requiresWargear: "fabricator-claw-array",
          text: "Tant qu'une unité NECRONS VEHICLE amie est à 6\" ou moins du porteur, elle a l'aptitude Insensible à la Douleur 6+." },
        { name: "Gloom Prism (Aura)", requiresWargear: "gloom-prism",
          text: "Tant qu'une unité NECRONS amie est à 6\" ou moins du porteur, les figurines de cette unité ont l'aptitude Insensible à la Douleur 5+ contre les blessures mortelles et les Attaques Psychiques." }
      ],
      composition: "1 à 2 Canoptek Spyders"
    },

    {
      id: "doomsday-ark",
      name: "Doomsday Ark",
      category: "vehicles",
      base: "60mm (socle de vol)",
      keywords: ["Vehicle", "Fly", "Frame", "Doomsday Ark", "Necrons"],
      stats: { M: "10\"", T: 9, Sv: "3+", W: 14, Ld: "7+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 200 }, { from: 3, pts: 230 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "doomsday-cannon", name: "Doomsday cannon", type: "ranged",
          profiles: [{ range: "72\"", A: "D6+1", skill: "3+", S: "18", AP: "-4", D: "4", abilities: ["blast", "heavy"] }] },
        { id: "gauss-flayer-array", name: "Gauss flayer array", type: "ranged",
          profiles: [{ range: "24\"", A: "5", skill: "3+", S: "4", AP: "0", D: "1", abilities: ["lethal-hits", "rapid-fire:5"] }] },
        { id: "armoured-bulk", name: "Armoured bulk", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["doomsday-cannon", "gauss-flayer-array", "gauss-flayer-array", "armoured-bulk"],
      abilities: [
        { name: "Overwhelming Obliteration",
          text: "À votre phase de Mouvement, si cette figurine reste stationnaire, son doomsday cannon a [BLESSURES DÉVASTATRICES] jusqu'à la fin du tour." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Doomsday Ark"
    },

    /* ---------- Marcheurs ---------- */

    {
      id: "canoptek-doomstalker",
      name: "Canoptek Doomstalker",
      category: "walkers",
      base: "90mm",
      keywords: ["Vehicle", "Walker", "Canoptek", "Doomstalker", "Canoptek Doomstalker", "Necrons"],
      stats: { M: "8\"", T: 8, Sv: "3+", W: 12, Ld: "8+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "doomsday-blaster", name: "Doomsday blaster", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+1", skill: "4+", S: "14", AP: "-3", D: "3", abilities: ["blast", "heavy"] }] },
        { id: "twin-gauss-flayer", name: "Twin gauss flayer", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["lethal-hits", "rapid-fire:1", "twin-linked"] }] },
        { id: "doomstalker-limbs", name: "Doomstalker limbs", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["doomsday-blaster", "twin-gauss-flayer", "doomstalker-limbs"],
      abilities: [
        { name: "Sentinel Construct",
          text: "Chaque fois que vous ciblez cette unité avec le stratagème Tir en État d'Alerte, pendant la résolution de ce stratagème, les touches sont obtenues sur des jets de touche non modifiés de 5+." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Canoptek Doomstalker"
    },

    {
      id: "canoptek-reanimator",
      name: "Canoptek Reanimator",
      category: "walkers",
      base: "60mm",
      keywords: ["Vehicle", "Walker", "Canoptek", "Reanimator", "Canoptek Reanimator", "Necrons"],
      stats: { M: "8\"", T: 6, Sv: "3+", W: 6, Ld: "8+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }] }],
      coreAbilities: ["feel-no-pain:4+"],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "atomiser-beam", name: "Atomiser beam", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "4+", S: "6", AP: "-2", D: "1", abilities: [] }] },
        { id: "reanimators-claws", name: "Reanimator's claws", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "4+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["atomiser-beam", "atomiser-beam", "reanimators-claws"],
      abilities: [
        { name: "Nanoscarab Reanimation Beam (Aura)",
          text: "Tant qu'une unité NECRONS amie est à 3\" ou moins de cette figurine, chaque fois que les Protocoles de Réanimation de cette unité s'activent, elle récupère D3 PV supplémentaires." }
      ],
      composition: "1 Canoptek Reanimator"
    },

    {
      id: "triarch-stalker",
      name: "Triarch Stalker",
      category: "walkers",
      base: "Utiliser la figurine",
      keywords: ["Vehicle", "Walker", "Triarch", "Frame", "Stalker", "Triarch Stalker", "Necrons"],
      stats: { M: "8\"", T: 8, Sv: "3+", W: 12, Ld: "7+", OC: 4, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 110 }, { from: 3, pts: 120 }] }],
      coreAbilities: ["deadly-demise:D3", "scouts:8\""],
      armyRules: ["protocoles-de-reanimation"],
      weapons: [
        { id: "heat-ray", name: "Heat ray", type: "ranged",
          profiles: [
            { name: "dispersed", range: "12\"", A: "2D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] },
            { name: "focused",   range: "18\"", A: "2",   skill: "3+",  S: "9", AP: "-4", D: "D6", abilities: ["melta:4"] }
          ] },
        { id: "particle-shredder", name: "Particle shredder", type: "ranged",
          profiles: [{ range: "18\"", A: "D6+6", skill: "2+", S: "7", AP: "0", D: "1", abilities: ["blast", "devastating-wounds"] }] },
        { id: "heavy-gauss-cannon-array", name: "Heavy gauss cannon array", type: "ranged",
          profiles: [{ range: "24\"", A: "6", skill: "3+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "stalkers-forelimbs", name: "Stalker's forelimbs", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "7", AP: "-1", D: "3", abilities: [] }] }
      ],
      loadout: ["heat-ray", "stalkers-forelimbs"],
      options: [
        { id: "arme", text: "Le heat ray de cette figurine peut être remplacé par 1 particle shredder ou 1 heavy gauss cannon array.",
          replaces: ["heat-ray"], choices: [["particle-shredder"], ["heavy-gauss-cannon-array"]] }
      ],
      abilities: [
        { name: "Targeting Relay",
          text: "À votre phase de Tir, chaque fois que cette figurine est choisie pour tirer, après avoir résolu ses attaques, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin de la phase, cette unité ne peut pas bénéficier du couvert." }
      ],
      composition: "1 Triarch Stalker"
    }
  ]
});

})();
