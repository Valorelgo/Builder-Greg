/* =========================================================
   STRATAGÈMES DE BASE — communs à toutes les factions
   Même format que les stratagèmes de détachement :
   moments : liste de { tour, phase }
   limite  : "une-fois-par-bataille", etc.
   restrictions : texte de restriction de la carte
   modes   : variantes au choix (avec un éventuel surcoût cpExtra)
   ========================================================= */

const CoreStratagems = [
  {
    id: "relance-de-commandement",
    name: "Relance de Commandement",
    ref: "15.02",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "les-deux", phase: "toutes" }],
    quand: "À n'importe quelle phase, juste après avoir fait l'un des jets suivants pour une unité ou une figurine amie : jet d'Avance, de charge, de dégâts, de risque, de touche, de sauvegarde, de blessure, ou jet du nombre d'attaques d'une arme.",
    cible: "Cette unité ou cette figurine.",
    effet: "Relancez ce jet. Si vous avez lancé plusieurs dés en même temps, choisissez-en un seul à relancer, sauf pour un jet de charge, qui se relance entièrement."
  },
  {
    id: "defi-epique",
    name: "Défi Épique",
    ref: "15.03",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "les-deux", phase: "combat" }],
    quand: "Phase de Combat, juste après qu'une unité de PERSONNAGE amie a été choisie pour combattre.",
    cible: "Cette unité de PERSONNAGE.",
    effet: "Choisissez 1 figurine de PERSONNAGE de votre unité : jusqu'à la fin de la phase, ses armes de mêlée ont [PRÉCISION]."
  },
  {
    id: "courage-insense",
    name: "Courage Insensé",
    ref: "15.04",
    cp: 1,
    type: "Stratagème de base",
    limite: "une-fois-par-bataille",
    moments: [{ tour: "vous", phase: "commandement" }],
    quand: "Étape d'Ébranlement de votre phase de Commandement, juste avant de faire un test d'Ébranlement pour une unité amie.",
    cible: "Cette unité.",
    effet: "Ce test d'Ébranlement est automatiquement réussi.",
    restrictions: "Une seule fois par bataille."
  },
  {
    id: "explosifs",
    name: "Explosifs",
    ref: "15.05",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "vous", phase: "tir" }],
    quand: "Votre phase de Tir.",
    cible: "1 unité GRENADES amie non engagée, éligible pour tirer et qui n'a pas Avancé à ce tour.",
    effet: "Choisissez 1 figurine GRENADES de l'unité et 1 unité ennemie non engagée, visible et à 8\" ou moins d'elle. Lancez six D6 : pour chaque 4+, cette unité ennemie subit 1 blessure mortelle."
  },
  {
    id: "impact-ecrasant",
    name: "Impact Écrasant",
    ref: "15.06",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "vous", phase: "charge" }],
    quand: "Votre phase de Charge, juste après qu'une unité MONSTER ou VEHICLE amie a fini un mouvement de Charge.",
    cible: "Cette unité.",
    effet: "Choisissez 1 unité ennemie engagée avec elle, puis 1 figurine de votre unité engagée avec cette unité ennemie. Lancez autant de D6 que l'Endurance de cette figurine : pour chaque 1, votre unité subit 1 blessure mortelle ; pour chaque 5+, l'unité ennemie subit 1 blessure mortelle (6 au maximum par unité)."
  },
  {
    id: "arrivee-precipitee",
    name: "Arrivée Précipitée",
    ref: "15.07",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "adversaire", phase: "mouvement" }],
    quand: "Fin de la phase de Mouvement adverse.",
    cible: "1 unité amie en Réserves Stratégiques (sauf AIRCRAFT).",
    effet: "Elle fait un mouvement d'arrivée.",
    restrictions: "Impossible pendant le premier round de bataille."
  },
  {
    id: "tir-en-etat-d-alerte",
    name: "Tir en État d'Alerte",
    ref: "15.08",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "adversaire", phase: "mouvement" }],
    quand: "Fin de la phase de Mouvement adverse.",
    cible: "1 unité amie non engagée (sauf TITANIC).",
    effet: "Elle tire en Tir au Jugé : une seule unité ennemie visible et éligible à 24\" ou moins peut être ciblée, chaque attaque ne touche que sur un 6 non modifié (quels que soient la CT et les modificateurs) et les jets de touche ne peuvent pas être relancés. Ensuite, jusqu'à la fin de la phase, l'unité ne peut pas entreprendre d'action."
  },
  {
    id: "ecran-de-fumee",
    name: "Écran de Fumée",
    ref: "15.10",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "adversaire", phase: "tir" }],
    quand: "Début de la phase de Tir adverse.",
    cible: "1 unité SMOKE amie.",
    effet: "Jusqu'à la fin de la phase, chaque attaque qui cible cette unité, ou une unité qui n'est pas entièrement visible de l'attaquant à cause d'une ou plusieurs figurines de cette unité, donne à la cible le Bénéfice du Couvert."
  },
  {
    id: "intervention-heroique",
    name: "Intervention Héroïque",
    ref: "15.11",
    cp: 1,
    type: "Stratagème de base",
    moments: [{ tour: "adversaire", phase: "charge" }],
    quand: "Fin de la phase de Charge adverse.",
    cible: "1 unité amie non engagée à 12\" ou moins d'une ou plusieurs unités ennemies. Une unité VEHICLE ne peut être choisie que si c'est un PERSONNAGE ou un WALKER.",
    effet: "Votre unité résout une charge. Avant le jet de charge, choisissez un mode :\n• Bondir pour Défendre : les cibles de charge ne peuvent être que des unités ennemies qui ont fait un mouvement de Charge à cette phase et sont dans la distance maximale.\n• Dans la Mêlée (+1 PC) : un jet de charge supérieur à 6 (après modificateurs) devient 6, et vous pouvez choisir pour cibles une ou plusieurs unités ennemies à 6\" ou moins de votre unité et dans la distance maximale.",
    modes: [
      { name: "Bondir pour Défendre", cpExtra: 0 },
      { name: "Dans la Mêlée", cpExtra: 1 }
    ]
  },
  {
    id: "contre-offensive",
    name: "Contre-offensive",
    ref: "15.12",
    cp: 2,
    type: "Stratagème de base",
    moments: [{ tour: "adversaire", phase: "combat" }],
    quand: "Étape Combattre de la phase de Combat adverse, juste après qu'une unité ennemie a résolu ses attaques.",
    cible: "1 unité amie éligible pour combattre.",
    effet: "Jusqu'à la fin de la phase, votre unité a Combat en Premier et doit être la prochaine unité que vous choisissez pour combattre."
  }
];
