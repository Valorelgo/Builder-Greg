# Ajouter une armée « règles seules » (un fil par armée)

But : rendre consultables les règles d'armée, détachements, optimisations et stratagèmes d'une armée, avant et pendant une partie, sans ses fiches d'unités.

## Fichiers touchés par un fil d'armée

1. `factions/<id>.js` — les données de l'armée (nouveau fichier).
2. `factions/catalog.js` — une ligne dans `RefCatalog`.
3. `css/themes.css` — seulement si l'armée a un thème à elle (facultatif).

Le moteur (`js/armees.js`, `js/codex.js`) n'a pas à changer.

## Identifiant

Nom de l'armée en minuscules, tirets à la place des espaces, sans apostrophe ni accent :
« Space Marines » → `space-marines`, « T'au Empire » → `tau-empire`, « Adepta Sororitas » → `adepta-sororitas`.
Il doit correspondre au nom de la liste des armées (`AllFactions` dans `js/config.js`) pour que l'armée adverse choisie au lancement d'une partie soit reconnue.

## Ligne du catalogue

```js
const RefCatalog = [
  { id: "space-marines", name: "Space Marines", file: "space-marines" }
];
```
`color` est facultatif (sinon la couleur de la liste des armées).

## Fichier de données

Même format qu'une faction complète, sans `units` :

```js
Factions.register({
  id: "space-marines",
  name: "Space Marines",
  keyword: "Adeptus Astartes",
  armyRules: [
    { id: "oath-of-moment", name: "…", nameEn: "Oath of Moment", text: ["…"] }
  ],
  detachments: [
    {
      id: "gladius-task-force", name: "Gladius Task Force",
      cost: 2,                                  // points de détachement (obligatoire)
      dispositions: ["take-and-hold"],
      rule: { name: "…", text: ["…"] },
      enhancements: [
        { id: "…", name: "…", cost: 15, kind: "optimisation", requires: [["Adeptus Astartes"]], text: "…" }
      ],
      stratagems: [
        { id: "…", name: "…", cp: 1, type: "Tactique de Bataille",
          moments: [{ tour: "adversaire", phase: "tir" }],
          quand: "…", cible: "…", effet: "…" }
      ]
    }
  ]
});
```

`cost` et `dispositions` comptent : au lancement d'une partie, les détachements cochés pour l'adversaire sont limités par les points de détachement du format, et ils fixent sa disposition (donc les missions). `exclusiveGroup` (même valeur sur deux détachements) empêche de les prendre ensemble.

Les `moments` comptent aussi : c'est avec eux que le panneau « Adversaire » montre, en partie, les stratagèmes que l'adversaire peut jouer maintenant. `tour` est vu du côté de l'armée saisie (« vous » = le tour de cette armée).

## Plus tard : passer à une armée complète

Ajouter `units` au fichier et déplacer la ligne de `RefCatalog` vers `FactionCatalog` (avec `available: true`).

## Hors connexion

Après l'ajout d'un fichier, `python outils/maj-sw.py` met à jour `sw.js` (facultatif : le fichier est de toute façon gardé dès sa première ouverture en ligne).
