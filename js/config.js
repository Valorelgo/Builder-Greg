/* =========================================================
   CONFIG — règles communes à toutes les factions
   ========================================================= */

const Rules = {
  // Ordre d'affichage du menu des formats
  formatOptions: [2000, 1000, 1500, 1100, 1200, 1300, 1400, 1600, 1700, 1800, 1900],

  forPoints(points) {
    const big = points >= 2000;
    return {
      detachmentPoints: big ? 3 : 2,
      maxOptimisations: big ? 4 : 2,
      maxCopies:        big ? 3 : 2,
      maxBattleline:    big ? 6 : 4,   // Lignes et transports assignés
      maxUpgradeCopies: 3              // exemplaires d'une même amélioration
    };
  }
};

const Dispositions = {
  "disruption":      { name: "Disruption",      color: "#2f5d9a" },
  "priority-assets": { name: "Priority Assets", color: "#b8860b" },
  "purge-the-foe":   { name: "Purge the Foe",   color: "#a3282c" },
  "reconnaissance":  { name: "Reconnaissance",  color: "#13817f" },
  "take-and-hold":   { name: "Take and Hold",   color: "#3a7d44" }
};

const Labels = {
  phase: {
    commandement: "Commandement",
    mouvement: "Mouvement",
    tir: "Tir",
    charge: "Charge",
    combat: "Combat",
    toutes: "Toute phase"
  },
  tour: {
    "vous": "ton tour",
    "adversaire": "tour adverse",
    "les-deux": "les deux tours"
  },
  usage: {
    "une-fois-par-bataille": "1 fois par bataille",
    "une-fois-par-tour": "1 fois par tour",
    "une-fois-par-round": "1 fois par round"
  },
  // Mots-clés anglais affichés en français (les noms d'unités restent en anglais)
  keyword: {
    "Infantry": "Infanterie",
    "Character": "Personnage",
    "Battleline": "Ligne",
    "Vehicle": "Véhicule",
    "Monster": "Monstre",
    "Mounted": "Monté",
    "Transport": "Transport",
    "Dedicated Transport": "Transport assigné",
    "Aircraft": "Aéronef"
  },
  // Marques du Chaos affichées en français quand le nom diffère
  mark: {
    "Chaos Undivided": "Chaos Universel"
  }
};

const STEPS = [
  { id: "faction",     label: "Faction" },
  { id: "format",      label: "Format" },
  { id: "detachments", label: "Détachements" },
  { id: "units",       label: "Unités" }
];

// Catégories d'unités, dans l'ordre d'affichage du builder
const UnitCategories = [
  { id: "epic-infantry",       label: "Héros d'infanterie épiques" },
  { id: "epic-monster",        label: "Héros monstres épiques" },
  { id: "char-infantry",       label: "Personnages d'infanterie" },
  { id: "char-monster",        label: "Personnages monstres" },
  { id: "char-mounted",        label: "Personnages montés" },
  { id: "battleline",          label: "Ligne" },
  { id: "infantry",            label: "Infanterie" },
  { id: "dedicated-transport", label: "Transports assignés" },
  { id: "aircraft",            label: "Aéronefs" },
  { id: "monsters",            label: "Monstres" },
  { id: "walkers",             label: "Marcheurs" },
  { id: "beasts",              label: "Bêtes" },
  { id: "mounted",             label: "Montés" },
  { id: "transport",           label: "Transports" },
  { id: "vehicles",            label: "Véhicules" }
];

// Toutes les armées, pour le choix de l'armée adverse (couleur utilisée dans l'historique)
const AllFactions = [
  { name: "Adepta Sororitas",     color: "#c0392b" },
  { name: "Adeptus Custodes",     color: "#d4a017" },
  { name: "Adeptus Mechanicus",   color: "#b5442f" },
  { name: "Aeldari",              color: "#2e9c8f" },
  { name: "Astra Militarum",      color: "#6b7d3a" },
  { name: "Black Templars",       color: "#8a8a8a" },
  { name: "Blood Angels",         color: "#a8222c" },
  { name: "Chaos Daemons",        color: "#a33fa0" },
  { name: "Chaos Knights",        color: "#7a2f2f" },
  { name: "Chaos Space Marines",  color: "#b8322a" },
  { name: "Dark Angels",          color: "#2f7a43" },
  { name: "Death Guard",          color: "#8f9b3c" },
  { name: "Deathwatch",           color: "#5e6670" },
  { name: "Drukhari",             color: "#4b7d6e" },
  { name: "Emperor's Children",   color: "#9b59d0" },
  { name: "Genestealer Cults",    color: "#7f5aa8" },
  { name: "Grey Knights",         color: "#8fa3b5" },
  { name: "Imperial Agents",      color: "#9a7d5a" },
  { name: "Imperial Knights",     color: "#2f5d9a" },
  { name: "Leagues of Votann",    color: "#c97a2b" },
  { name: "Necrons",              color: "#3ee67f" },
  { name: "Orks",                 color: "#4f9a2f" },
  { name: "Space Marines",        color: "#2f6fbf" },
  { name: "Space Wolves",         color: "#6f8fa8" },
  { name: "T'au Empire",          color: "#d08a3a" },
  { name: "Thousand Sons",        color: "#2f7fa8" },
  { name: "Tyranids",             color: "#9c3f7a" },
  { name: "World Eaters",         color: "#b02a2a" }
];
