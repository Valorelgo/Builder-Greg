/* =========================================================
   SAISON DE JEU — tout ce qui change chaque année
   - scenarios   : tableau croisé des dispositions → nom de la mission
                   (ligne = ma disposition, colonne = celle de l'adversaire)
   - missions    : missions principales, une par case du tableau
   - secondaries : missions secondaires (utilisées par le compagnon)
   Pour une nouvelle saison : créer un nouveau fichier sur ce modèle
   et changer le nom du fichier chargé dans index.html.
   ========================================================= */

const MissionTimings = {
  finTour: "À la fin de votre tour.",
  finCommandement: "À la fin de votre phase de Commandement (ou à la fin de votre tour au 5e round).",
  finBataille: "À la fin de la bataille.",
  finCommandementSeul: "À la fin de votre phase de Commandement.",
  finUnTour: "À la fin d'un tour (le vôtre ou celui de l'adversaire).",
  finTourAdverse: "À la fin du tour adverse.",
  finTourAdverseOu5: "À la fin du tour adverse ou à la fin du 5e round (selon ce qui arrive en premier)."
};

const Season = {
  id: "2026",
  name: "Saison 2026",

  scenarios: {
    "priority-assets": {
      "priority-assets": "Sabotage",
      "reconnaissance":  "Opération d'avant-garde",
      "disruption":      "Extraire la relique",
      "purge-the-foe":   "Liaison vitale",
      "take-and-hold":   "Sécurisation"
    },
    "reconnaissance": {
      "priority-assets": "Ratissage",
      "reconnaissance":  "Réunir des informations",
      "disruption":      "Surveiller l'ennemi",
      "purge-the-foe":   "Triangulation",
      "take-and-hold":   "Balayage de reconnaissance"
    },
    "disruption": {
      "priority-assets": "Localiser et priver",
      "reconnaissance":  "De la poudre aux yeux",
      "disruption":      "Surclassé",
      "purge-the-foe":   "Action retardée",
      "take-and-hold":   "Piège mortel"
    },
    "purge-the-foe": {
      "priority-assets": "Courroux du destructeur",
      "reconnaissance":  "Consécration",
      "disruption":      "Châtiment",
      "purge-the-foe":   "Hachoir à viande",
      "take-and-hold":   "Force inarrêtable"
    },
    "take-and-hold": {
      "priority-assets": "Domination inéluctable",
      "reconnaissance":  "Éliminer et sécuriser",
      "disruption":      "Acquisition déterminée",
      "purge-the-foe":   "Objet inamovible",
      "take-and-hold":   "Domination du terrain"
    }
  },

  /* ---------------------------------------------------------
   MISSIONS PRINCIPALES — une par combinaison de dispositions
   Clé : nom du scénario (voir scenarios.js).
   scoring : blocs de décompte
     round : "tous" | "fin" | un round précis ("1", "5") | une plage ("1-2", "2-3", "2-4") | "N+" (à partir du round N)
     quand : moment du décompte
     lines : { text, pts, per, bonus, or }
             per   = points pour chaque unité / objectif concerné
             bonus = s'ajoute à la ligne précédente (cumulatif, « + » sur la carte)
             or    = remplace la ligne précédente (palier, « ou » sur la carte)
   rule   : règle permanente de la mission (hors décompte)
   setup  : préparation à faire au début de la bataille
   startTurn : à faire au début de chacun de vos tours
   action : action d'objectif décrite au verso de la carte
     --------------------------------------------------------- */


  missions: {
  
    /* ---------- Ma disposition : Priority Assets ---------- */
  
    "Sabotage": {
      disposition: "priority-assets", opponent: "priority-assets",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque unité amie qui a commis un sabotage à ce tour.", pts: 3, per: true },
          { text: "Pour chacune de ces unités à portée d'un ou plusieurs objectifs dans le territoire adverse.", pts: 2, per: true, bonus: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] }
      ],
      action: {
        name: "Sabotage",
        start: "Votre phase de Tir.",
        units: "Une unité à portée d'un objectif (sauf votre objectif domiciliaire).",
        limit: "Illimitée. Chaque unité qui entreprend cette action à cette phase doit être à portée d'un objectif différent.",
        complete: "À la fin de votre tour, si cette unité contrôle cet objectif.",
        effect: "Votre unité commet un sabotage."
      }
    },
  
    "Opération d'avant-garde": {
      disposition: "priority-assets", opponent: "reconnaissance",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une unité amie a effectué une opération d'avant-garde à ce tour.", pts: 4 },
          { text: "Une ou plusieurs unités ennemies ont été détruites à ce tour.", pts: 2 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 10 }
        ] }
      ],
      action: {
        name: "Opération d'avant-garde",
        start: "Votre phase de Tir.",
        units: "Une unité amie dans une zone de terrain située dans le territoire adverse.",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si aucune unité ennemie n'est dans cette zone de terrain.",
        effect: "Votre unité effectue une opération d'avant-garde."
      }
    },
  
    "Extraire la relique": {
      disposition: "priority-assets", opponent: "disruption",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une unité amie a effectué un balayage de senseurs à ce tour.", pts: 4 },
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour à portée d'un ou plusieurs objectifs ont été détruites.", pts: 3 },
          { text: "Il ne reste qu'un seul marqueur d'opération adverse, au moins une de vos unités est dans sa zone de terrain et aucune unité ennemie n'y est.", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Il ne reste qu'un seul marqueur d'opération adverse, au moins une de vos unités est dans sa zone de terrain et aucune unité ennemie n'y est.", pts: 5 }
        ] }
      ],
      action: {
        name: "Balayage de senseurs",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif central.",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Votre unité effectue un balayage de senseurs : retirez un marqueur d'opération du champ de bataille.",
        restrictions: "Impossible s'il ne reste qu'un seul marqueur d'opération sur le champ de bataille."
      }
    },
  
    "Liaison vitale": {
      disposition: "priority-assets", opponent: "purge-the-foe",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux.", pts: 2 },
          { text: "Pour chacun de vos marqueurs d'opération à portée d'un ou plusieurs de ces objectifs.", pts: 1, per: true, bonus: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Un ou plusieurs de ces objectifs sont des objectifs centraux.", pts: 4, bonus: true }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 10 }
        ] }
      ],
      action: {
        name: "Maintenir le contrôle",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif central.",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Placez un de vos marqueurs d'opération à portée de cet objectif."
      }
    },
  
    "Sécurisation": {
      disposition: "priority-assets", opponent: "take-and-hold",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une unité amie a sécurisé l'atout à ce tour.", pts: 4 },
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour à portée d'un ou plusieurs objectifs centraux ont été détruites.", pts: 2 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Vous contrôlez au moins trois objectifs.", pts: 4 }
        ] }
      ],
      action: {
        name: "Sécurisation",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif central.",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Votre unité sécurise l'atout."
      }
    },
    /* ---------- Ma disposition : Reconnaissance ---------- */
  
    "Ratissage": {
      disposition: "reconnaissance", opponent: "priority-assets",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux.", pts: 3 },
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour dans une zone de terrain ont été détruites.", pts: 2 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 4, per: true }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Aucune unité ennemie n'est entièrement dans votre territoire.", pts: 5 }
        ] }
      ]
    },
  
    "Réunir des informations": {
      disposition: "reconnaissance", opponent: "reconnaissance",
      scoring: [
        { round: "1", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux.", pts: 6 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque unité amie qui a accompli l'action Extraire des informations à ce tour.", pts: 7, per: true }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Au moins trois de vos marqueurs d'opération sont sur le champ de bataille.", pts: 5 },
          { text: "Un de vos marqueurs d'opération est à portée de l'objectif domiciliaire adverse.", pts: 5 }
        ] }
      ],
      action: {
        name: "Extraire des informations",
        start: "Votre phase de Tir, à partir du 2e round de bataille.",
        units: "Une unité à portée d'un objectif (sauf votre objectif domiciliaire) dont aucun de vos marqueurs d'opération n'est à portée.",
        limit: "Illimitée. Chaque unité qui entreprend cette action à cette phase doit être à portée d'un objectif différent.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Placez un de vos marqueurs d'opération à portée de cet objectif."
      }
    },
  
    "Surveiller l'ennemi": {
      disposition: "reconnaissance", opponent: "disruption",
      rule: "Chaque fois qu'une unité amie finit un mouvement à portée d'un objectif dont un ou plusieurs marqueurs d'opération adverses sont à portée, retirez ces marqueurs d'opération du champ de bataille.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies ont été surveillées à ce tour, sauf si chacune d'elles est à portée d'un ou plusieurs objectifs ayant un ou plusieurs marqueurs d'opération à portée.", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Aucun marqueur d'opération adverse n'est sur le champ de bataille.", pts: 5 }
        ] }
      ],
      action: {
        name: "Surveiller l'ennemi",
        start: "Votre phase de Tir.",
        units: "Une unité amie.",
        limit: "Illimitée.",
        complete: "Immédiatement.",
        effect: "Choisissez une unité ennemie visible, à 18\" ou moins de votre unité et qui n'a pas encore été surveillée à ce tour : elle est surveillée jusqu'à la fin du tour."
      }
    },
  
    "Triangulation": {
      disposition: "reconnaissance", opponent: "purge-the-foe",
      scoring: [
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, persistent: true, lines: [
          { text: "Un objectif est triangulé.", pts: 3 },
          { text: "Deux objectifs sont triangulés.", pts: 6, or: true },
          { text: "Au moins trois objectifs sont triangulés.", pts: 10, or: true }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez au moins quatre objectifs.", pts: 10 }
        ] }
      ],
      action: {
        name: "Triangulation",
        start: "Votre phase de Tir, à partir du 2e round de bataille.",
        units: "Une unité amie à portée d'un objectif (sauf votre objectif domiciliaire).",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Cet objectif est triangulé : placez un de vos marqueurs d'opération à portée de cet objectif."
      }
    },
  
    "Balayage de reconnaissance": {
      disposition: "reconnaissance", opponent: "take-and-hold",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Au moins trois unités amies sont entièrement dans trois quarts de table différents, à plus de 6\" du centre du champ de bataille.", pts: 3 },
          { text: "Au moins quatre unités amies sont entièrement dans quatre quarts de table différents, à plus de 6\" du centre du champ de bataille.", pts: 6, or: true },
          { text: "Pour chaque unité ennemie détruite à ce tour.", pts: 1, per: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 3 }
        ] }
      ]
    },
    /* ---------- Ma disposition : Disruption ---------- */
  
    "Localiser et priver": {
      disposition: "disruption", opponent: "priority-assets",
      setup: "Choisissez cinq zones de terrain hors de votre zone de déploiement et placez un de vos marqueurs d'opération dans chacune. S'il y en a moins de cinq, faites-le pour chaque zone de terrain hors de votre zone de déploiement.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour à portée d'un ou plusieurs objectifs ont été détruites.", pts: 4 },
          { text: "Il ne reste qu'un seul de vos marqueurs d'opération, au moins une de vos unités est dans sa zone de terrain et aucune unité ennemie n'y est.", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Il ne reste qu'un seul de vos marqueurs d'opération, au moins une de vos unités est dans sa zone de terrain et aucune unité ennemie n'y est.", pts: 5 }
        ] }
      ],
      action: {
        name: "Balayage de senseurs",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif central.",
        limit: "Une fois par tour.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Votre unité effectue un balayage de senseurs : retirez un marqueur d'opération du champ de bataille.",
        restrictions: "Impossible s'il ne reste qu'un seul marqueur d'opération sur le champ de bataille."
      }
    },
  
    "De la poudre aux yeux": {
      disposition: "disruption", opponent: "reconnaissance",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, persistent: true, lines: [
          { text: "Pour chaque objectif doté d'un leurre.", pts: 2, per: true },
          { text: "Pour chacun de ces objectifs situé dans le territoire adverse.", pts: 2, per: true, bonus: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Au moins quatre objectifs sont dotés d'un leurre.", pts: 10 }
        ] }
      ],
      action: {
        name: "Leurre",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif (sauf votre objectif domiciliaire) qui n'est pas encore doté d'un leurre.",
        limit: "Illimitée. Chaque unité qui entreprend cette action à cette phase doit être à portée d'un objectif différent.",
        complete: "À la fin de votre tour, si votre unité contrôle cet objectif.",
        effect: "Cet objectif est doté d'un leurre : placez un de vos marqueurs d'opération à portée de cet objectif."
      }
    },
  
    "Surclassé": {
      disposition: "disruption", opponent: "disruption",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 10 }
        ] },
        { round: "1", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 4, per: true }
        ] },
        { round: "2-3", quand: MissionTimings.finCommandementSeul, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 5, per: true }
        ] },
        { round: "4+", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 6, per: true }
        ] }
      ]
    },
  
    "Action retardée": {
      disposition: "disruption", opponent: "purge-the-foe",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque unité ennemie détruite à ce tour.", pts: 2, per: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf les objectifs domiciliaires).", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux et un ou plusieurs objectifs d'expansion.", pts: 3 }
        ] }
      ]
    },
  
    "Piège mortel": {
      disposition: "disruption", opponent: "take-and-hold",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque zone de terrain piégée à ce tour.", pts: 2, per: true },
          { text: "Pour chacune de ces zones de terrain qui est un objectif.", pts: 3, per: true, bonus: true },
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour dans une zone de terrain piégée ont été détruites.", pts: 3 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] }
      ],
      action: {
        name: "Piège",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif (sauf votre objectif domiciliaire) ou dans une zone de terrain hors de votre zone de déploiement que vous n'avez pas encore piégée.",
        limit: "Illimitée. Chaque unité qui entreprend cette action à cette phase doit être dans une zone de terrain différente.",
        complete: "Immédiatement.",
        effect: "Cette zone de terrain est piégée : placez un de vos marqueurs d'opération dans cette zone de terrain."
      }
    },
    /* ---------- Ma disposition : Purge the Foe ---------- */
  
    "Courroux du destructeur": {
      disposition: "purge-the-foe", opponent: "priority-assets",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies ont été détruites à ce tour.", pts: 3 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 6 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Plus d'unités ennemies ont été détruites à ce tour que d'unités amies au tour précédent.", pts: 4 }
        ] }
      ]
    },
  
    "Consécration": {
      disposition: "purge-the-foe", opponent: "reconnaissance",
      rule: "Chaque fois qu'une unité amie détruit une unité, elle devient consécratrice. À la fin de vos tours, pour chaque unité consécratrice, vous pouvez choisir un objectif à sa portée (sauf votre objectif domiciliaire) qui n'est pas encore consacré : placez-y un de vos marqueurs d'opération. L'objectif est consacré et l'unité n'est plus consécratrice.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, persistent: true, lines: [
          { text: "Un ou deux objectifs sont consacrés.", pts: 3 },
          { text: "Au moins trois objectifs sont consacrés.", pts: 6, or: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "L'objectif domiciliaire adverse est consacré.", pts: 5 }
        ] }
      ]
    },
  
    "Châtiment": {
      disposition: "purge-the-foe", opponent: "disruption",
      startTurn: "Choisissez une à trois unités ennemies sur le champ de bataille, à portée d'objectifs et/ou qui ont détruit une ou plusieurs unités amies au tour précédent. À défaut, choisissez une unité ennemie sur le champ de bataille. Jusqu'au début de votre prochain tour, ces unités sont condamnées.",
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Une ou plusieurs unités ennemies condamnées ont quitté le champ de bataille à ce tour.", pts: 5 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 },
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 5 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 8 }
        ] }
      ]
    },
  
    "Hachoir à viande": {
      disposition: "purge-the-foe", opponent: "purge-the-foe",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies ont été détruites à ce tour.", pts: 3 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs (sauf votre objectif domiciliaire).", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Plus d'unités ennemies ont été détruites à ce tour que d'unités amies au tour précédent.", pts: 5 },
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 5 }
        ] }
      ]
    },
  
    "Force inarrêtable": {
      disposition: "purge-the-foe", opponent: "take-and-hold",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies ont été détruites à ce tour.", pts: 3 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 4, per: true }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs que vous ne contrôliez pas au début du tour (sauf votre objectif domiciliaire).", pts: 3 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux.", pts: 5 }
        ] }
      ]
    },
  
    /* ---------- Ma disposition : Take and Hold ---------- */
  
    "Domination inéluctable": {
      disposition: "take-and-hold", opponent: "priority-assets",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez au moins trois objectifs.", pts: 4 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Vous contrôlez au moins deux objectifs.", pts: 5 },
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 4 }
        ] },
        { round: "fin", quand: MissionTimings.finBataille, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse.", pts: 5 }
        ] }
      ]
    },
  
    "Éliminer et sécuriser": {
      disposition: "take-and-hold", opponent: "reconnaissance",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités ennemies ont été détruites à ce tour par une unité amie à portée d'un ou plusieurs objectifs.", pts: 3 },
          { text: "Une ou plusieurs unités ennemies qui avaient commencé le tour à portée d'un ou plusieurs objectifs ont été détruites à ce tour.", pts: 3, or: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 4, per: true }
        ] },
        { round: "2+", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs que vous ne contrôliez pas au début du tour (sauf votre objectif domiciliaire).", pts: 3 }
        ] }
      ]
    },
  
    "Acquisition déterminée": {
      disposition: "take-and-hold", opponent: "disruption",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque objectif que vous contrôlez et que vous ne contrôliez pas au début du tour (sauf votre objectif domiciliaire).", pts: 2, per: true }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Pour chaque objectif que vous contrôlez.", pts: 3, per: true },
          { text: "Pour chacun de ces objectifs situé dans le territoire adverse.", pts: 3, per: true, bonus: true }
        ] }
      ]
    },
  
    "Objet inamovible": {
      disposition: "take-and-hold", opponent: "purge-the-foe",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez un ou plusieurs objectifs centraux.", pts: 3 }
        ] },
        { round: "2-4", quand: MissionTimings.finCommandementSeul, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 5, per: true }
        ] },
        { round: "5", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque objectif que vous contrôlez (sauf votre objectif domiciliaire).", pts: 5, per: true }
        ] }
      ]
    },
  
    "Domination du terrain": {
      disposition: "take-and-hold", opponent: "take-and-hold",
      scoring: [
        { round: "1-2", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez plus d'objectifs que votre adversaire.", pts: 2 }
        ] },
        { round: "2+", quand: MissionTimings.finCommandement, lines: [
          { text: "Pour chaque objectif que vous contrôlez.", pts: 3, per: true },
          { text: "Pour chacun de ces objectifs (sauf votre objectif domiciliaire), si vous contrôlez votre objectif domiciliaire.", pts: 2, per: true, bonus: true }
        ] }
      ]
    }
  },

  /* ---------------------------------------------------------
     MISSIONS SECONDAIRES — même format de décompte que les missions principales
     onDraw   : à faire lorsque la carte est piochée
     rule     : règle permanente tant que la carte est active
     fixable  : la carte peut être jouée en mode fixe (icône bloc-notes) — non utilisé pour l'instant
     lines.pts : nombre, ou { fixe, tactique } quand la valeur dépend du mode
                 (le compagnon utilise toujours la valeur tactique, voir secondaryMode)
     lines.max : plafond de points pour cette ligne (« jusqu'à X PdV »)
     persistent : (bloc) ce qui est acquis le reste — la sélection est reportée
                  automatiquement au round suivant (ex. objectifs triangulés)
     note     : précision de la carte
     --------------------------------------------------------- */
  /* ---------------------------------------------------------
     MISES EN PLACE DE LA TABLE — 3 configurations (A, B, C) par paire
     de dispositions : 15 paires, 45 images, noms d'origine du site :
       RapidIngress-<code 1><code 2><a|b|c>.png    ex. : RapidIngress-thpfa.png
     Les deux codes suivent toujours l'ordre de deploymentOrder
     (th, di, pf, pa, re) : Purge the Foe contre Take and Hold = "thpf".
     Pour remplacer une image, il suffit de remettre le fichier du site
     dans le dossier, sans le renommer.
     deploymentNames : noms facultatifs, clé "<code 1><code 2>" → [nom A, nom B, nom C]
     --------------------------------------------------------- */
  deploymentsFolder: "saisons/2026/mises-en-place",
  deploymentPrefix: "RapidIngress-",
  deploymentExt: "png",
  deploymentCodes: {
    "priority-assets": "pa",
    "reconnaissance":  "re",
    "disruption":      "di",
    "purge-the-foe":   "pf",
    "take-and-hold":   "th"
  },
  deploymentOrder: ["take-and-hold", "disruption", "purge-the-foe", "priority-assets", "reconnaissance"],
  deploymentConfigs: ["A", "B", "C"],
  deploymentNames: {},

  secondaryMode: "tactique",

  /* Secondaires — champs utiles au compagnon :
       pts : nombre, ou { fixe, tactique } (le compagnon utilise « tactique » ; ligne sans valeur tactique = masquée)
       per : « pour chaque » (compteur) · max : plafond de la mission · or : au choix avec la ligne précédente
       bonus : s'ajoute à la ligne précédente (jamais seul)
       redraw : repioche possible — type "round1" (1er round), "with" (si la mission `other` est en main),
                "condition" (condition de la carte, à juger à la table) ; reshuffle : la carte retourne dans la pile ;
                mandatory : repioche obligatoire
       __texte__ : passage mis en valeur */
  secondaries: [
    {
      name: "Fanal",
      onDraw: "Choisissez une unité amie sur le champ de bataille, ou embarquée dans un TRANSPORT sur le champ de bataille : c'est votre unité de fanal.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTourAdverseOu5, lines: [
          { text: "Votre unité de fanal est sur le champ de bataille et hors de votre zone de déploiement.", pts: 3 },
          { text: "Votre unité de fanal est sur le champ de bataille et hors de votre territoire.", pts: 5, or: true }
        ] }
      ]
    },
    {
      name: "Attaque de flanc",
      note: "Les bords du champ de bataille opposés sont ceux qui sont parallèles l'un à l'autre.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités amies (hors unités ébranlées et AÉRODYNES) sont à 6\" ou moins d'un ou plusieurs bords du champ de bataille et ne sont pas dans votre territoire.", pts: 3 },
          { text: "__Au moins deux__ unités amies (hors unités ébranlées et AÉRODYNES) sont à 6\" ou moins de bords du champ de bataille __opposés__, et une ou plusieurs de ces unités ne sont pas dans votre territoire.", pts: 5, or: true }
        ] }
      ]
    },
    {
      name: "Démonstration de force",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Il y a plus d'unités amies que d'unités ennemies (hors unités ébranlées et AÉRODYNES) entièrement dans le No Man's Land.", pts: 2 }
        ] },
        { round: "tous", quand: MissionTimings.finTourAdverse, lines: [
          { text: "Il y a plus d'unités amies que d'unités ennemies (hors unités ébranlées et AÉRODYNES) entièrement dans le No Man's Land.", pts: 5 }
        ] }
      ]
    },
    {
      name: "Pillage",
      redraw: { type: "with", other: "Purification", reshuffle: true },
      onDraw: "Si la mission secondaire Purification est active pour vous, vous pouvez piocher une nouvelle carte de mission secondaire et remélanger celle-ci dans votre pile.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une zone de terrain a été pillée à ce tour.", pts: 5 }
        ] }
      ],
      action: {
        name: "Piller",
        start: "Votre phase de Tir.",
        units: "Une unité dans une zone de terrain qui n'est pas dans votre territoire.",
        limit: "Une fois par tour.",
        complete: "Immédiatement.",
        effect: "Cette zone de terrain est pillée."
      }
    },
    {
      name: "Force écrasante",
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Pour chaque unité ennemie qui avait commencé le tour à portée d'un ou plusieurs objectifs et qui a été détruite.", pts: 3, per: true, max: 5 }
        ] }
      ]
    },
    {
      name: "Pas de prisonnier",
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Pour chaque unité ennemie détruite à ce tour.", pts: 2, per: true, max: 5 }
        ] }
      ]
    },
    {
      name: "Position avancée",
      redraw: { type: "round1", reshuffle: true },
      onDraw: "Si c'est le premier round de bataille, vous pouvez piocher une nouvelle carte de mission secondaire et remélanger celle-ci dans votre pile.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez l'objectif domiciliaire adverse et/ou chaque objectif d'expansion.", pts: 5 }
        ] }
      ]
    },
    {
      name: "Sécuriser le No Man's Land",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez au moins deux objectifs (sauf votre objectif domiciliaire) dans le No Man's Land.", pts: 5 }
        ] }
      ]
    },
    {
      name: "Engagement sur tous les fronts",
      fixable: true,
      rule: "Si une ou plusieurs unités amies (hors unités ébranlées et AÉRODYNES) sont entièrement dans un quart de table et à plus de 6\" du centre du champ de bataille, vous êtes présent dans ce quart de table.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous êtes présent dans trois quarts de table.", pts: { fixe: 2, tactique: 3 } },
          { text: "Vous êtes présent dans quatre quarts de table.", pts: { fixe: 4, tactique: 5 }, or: true }
        ] }
      ]
    },
    {
      name: "Défendre le bastion",
      redraw: { type: "round1", reshuffle: true, mandatory: true },
      onDraw: "Si c'est le premier round de bataille, piochez une nouvelle carte de mission secondaire et remélangez celle-ci dans votre pile.",
      scoring: [
        { round: "2+", quand: MissionTimings.finTourAdverseOu5, lines: [
          { text: "Vous contrôlez votre objectif domiciliaire.", pts: 3 },
          { text: "Il n'y a aucune unité ennemie dans votre zone de déploiement.", pts: 2, bonus: true }
        ] }
      ]
    },
    {
      name: "Un coup décisif",
      redraw: { type: "condition" },
      fixable: true,
      onDraw: "S'il n'y a aucune unité ennemie avec un effectif initial de 13+ sur le champ de bataille, vous pouvez défausser cette carte et piocher une nouvelle carte de mission secondaire.",
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Pour chaque unité ennemie avec un effectif initial de 13+ détruite à ce tour.", pts: { fixe: 4, tactique: 5 }, per: true, max: { tactique: 5 } }
        ] }
      ]
    },
    {
      name: "Purification",
      redraw: { type: "with", other: "Pillage", reshuffle: true },
      onDraw: "Si la mission secondaire Pillage est active pour vous, vous pouvez piocher une nouvelle carte de mission secondaire et remélanger celle-ci dans votre pile.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Un objectif a été purifié par votre armée à ce tour.", pts: 2 },
          { text: "Au moins deux objectifs ont été purifiés par votre armée à ce tour.", pts: 5, or: true }
        ] }
      ],
      action: {
        name: "Purifier",
        start: "Votre phase de Tir.",
        units: "Une unité amie à portée d'un objectif (sauf votre objectif domiciliaire) qui n'est pas dans votre zone de déploiement.",
        limit: "Illimitée. Chaque unité qui entreprend cette action à cette phase doit être à portée d'un objectif différent.",
        complete: "À la fin de votre tour, si cette unité contrôle cet objectif.",
        effect: "Cet objectif est purifié par votre armée."
      }
    },
    {
      name: "Le fardeau de la confiance",
      onDraw: "Lorsque cette carte est piochée, puis au début de chacun de vos tours : pour chaque objectif, vous pouvez choisir une unité amie sur le champ de bataille pour le garder. Jusqu'au début de votre prochain tour, tant que cette unité est à portée de cet objectif et que vous le contrôlez, l'objectif est gardé par votre armée.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTourAdverseOu5, lines: [
          { text: "Pour chaque objectif gardé par votre armée.", pts: 2, per: true, max: 5 }
        ] }
      ]
    },
    {
      name: "Abattez-le",
      redraw: { type: "condition" },
      fixable: true,
      onDraw: "S'il n'y a aucune figurine ennemie avec 10 PV ou plus sur le champ de bataille, vous pouvez défausser cette carte et piocher une nouvelle carte de mission secondaire.",
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Pour chaque figurine ennemie avec 10 PV ou plus détruite à ce tour.", pts: { fixe: 4, tactique: 5 }, per: true, max: { tactique: 5 } }
        ] }
      ]
    },
    {
      name: "Derrière les lignes ennemies",
      redraw: { type: "round1", reshuffle: true },
      onDraw: "Si c'est le premier round de bataille, vous pouvez piocher une nouvelle carte de mission secondaire et remélanger celle-ci dans votre pile.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Pour chaque unité amie (hors unités ébranlées et AÉRODYNES) entièrement dans la zone de déploiement adverse.", pts: 3, per: true, max: 5 }
        ] }
      ]
    },
    {
      name: "Une cible tentante",
      onDraw: "Votre adversaire choisit un objectif (sauf les objectifs domiciliaires) dans le No Man's Land : c'est votre cible tentante.",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Vous contrôlez votre cible tentante.", pts: 5 }
        ] }
      ]
    },
    {
      name: "Assassinat",
      fixable: true,
      scoring: [
        { round: "tous", quand: MissionTimings.finUnTour, lines: [
          { text: "Pour chaque figurine de PERSONNAGE détruite à ce tour.", pts: { fixe: 3 }, per: true },
          { text: "Pour chacune de ces figurines avec 4 PV ou plus.", pts: { fixe: 1 }, per: true, bonus: true },
          { text: "Une ou plusieurs figurines de PERSONNAGE ont été détruites à ce tour, ou toutes les figurines de PERSONNAGE ennemies ont été détruites pendant la bataille.", pts: { tactique: 5 } }
        ] }
      ]
    },
    {
      name: "Position centrale",
      scoring: [
        { round: "tous", quand: MissionTimings.finTour, lines: [
          { text: "Une ou plusieurs unités amies (hors unités ébranlées et AÉRODYNES) sont à 3\" ou moins du centre du champ de bataille, et aucune unité ennemie n'est à 3\" ou moins du centre.", pts: 3 },
          { text: "Une ou plusieurs unités amies (hors unités ébranlées et AÉRODYNES) sont à 3\" ou moins du centre du champ de bataille, et aucune unité ennemie n'est à 6\" ou moins du centre.", pts: 5, or: true }
        ] }
      ]
    }
  ]
};
