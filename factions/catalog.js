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
    available: false
  }
];
