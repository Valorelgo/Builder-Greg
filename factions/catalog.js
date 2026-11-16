/* =========================================================
   CATALOGUE — liste légère des factions (chargée au démarrage)
   Les données complètes ne sont chargées qu'à la sélection.
   color : couleur d'accent de la faction. Le reste du thème
   (fonds, police des titres) est dans css/themes.css.
   ========================================================= */

const FactionCatalog = [
  {
    id: "emperors-children",
    name: "Emperor's Children",
    subtitle: "La IIIe Légion, vouée à Slaanesh",
    file: "emperors-children",
    color: "#9b59d0",
    available: true
  },
  {
    id: "chaos-space-marines",
    name: "Chaos Space Marines",
    subtitle: "Les Légions renégates",
    file: "chaos-space-marines",
    color: "#b8322a",
    available: true
  },
  {
    id: "aeldari",
    name: "Aeldari",
    subtitle: "Les héritiers d'un empire déchu",
    file: "aeldari",
    color: "#2ec4b6",
    available: true
  },
  {
    id: "necrons",
    name: "Necrons",
    subtitle: "Les dynasties endormies",
    file: "necrons",
    color: "#3ee67f",
    available: true
  },
  {
    id: "world-eaters",
    name: "World Eaters",
    subtitle: "La XIIe Légion, vouée à Khorne",
    file: "world-eaters",
    color: "#b8222a",
    available: true
  },
  {
    id: "death-guard",
    name: "Death Guard",
    subtitle: "La XIVe Légion, vouée à Nurgle",
    file: "death-guard",
    color: "#8f9b3c",
    available: true
  }
];

/* =========================================================
   ARMÉES CONSULTABLES SEULEMENT — détachements, optimisations
   et stratagèmes, sans fiches d'unités (voir js/armees.js).
   Une ligne par armée : { id, name, file, color }
     id    : nom de l'armée en minuscules, tirets à la place des
             espaces, sans apostrophe (« T'au Empire » → "tau-empire")
     file  : fichier factions/<file>.js (souvent le même que id)
     color : facultatif, sinon celle de la liste des armées (config.js)
   Quand une armée reçoit ses fiches d'unités, sa ligne passe
   dans FactionCatalog ci-dessus.
   ========================================================= */

const RefCatalog = [
  { id: "leagues-of-votann", name: "Leagues of Votann", file: "leagues-of-votann" },
  { id: "chaos-daemons", name: "Chaos Daemons", file: "chaos-daemons" },
  { id: "adepta-sororitas", name: "Adepta Sororitas", file: "adepta-sororitas" },
  { id: "adeptus-custodes", name: "Adeptus Custodes", file: "adeptus-custodes" },
  { id: "orks", name: "Orks", file: "orks" },
  { id: "thousand-sons", name: "Thousand Sons", file: "thousand-sons" },
  // Space Marines et chapitres : un seul fichier (règle, détachements et stratagèmes communs)
  { id: "space-marines", name: "Space Marines", file: "adeptus-astartes" },
  { id: "blood-angels", name: "Blood Angels", file: "adeptus-astartes" },
  { id: "black-templars", name: "Black Templars", file: "adeptus-astartes" },
  { id: "dark-angels", name: "Dark Angels", file: "adeptus-astartes" },
  { id: "deathwatch", name: "Deathwatch", file: "adeptus-astartes" },
  { id: "space-wolves", name: "Space Wolves", file: "adeptus-astartes" }
];
