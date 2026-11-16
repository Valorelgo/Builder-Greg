/* =========================================================
   DEATH GUARD — faction complète (unités et détachements)
   Détachements, optimisations et stratagèmes en français ;
   unités, armes et aptitudes en anglais, textes traduits.

   ÉTAT
   - Règles d'armée (Bienfait de Nurgle, Affligée, Pacte de
     Décrépitude) : complètes, traduites depuis l'anglais. Noms
     français des Fléaux non officiels (noms anglais gardés à côté).
     « Bienfait de Nurgle » repris des fiches françaises des
     détachements (Nurgle's Gift).
   - 9 détachements : règles et stratagèmes (45) saisis depuis des
     fiches françaises résumées.
   - À SAISIR : textes des optimisations (noms et points déjà saisis)
     et leurs restrictions (requires).
   - Optimisations notées « (Amélioration) » : kind "amelioration".
   - FICHES D'UNITÉS (source : Wahapedia, 11e édition, relevé du
     9 novembre 2026) : 35 fiches, vérifiées une à une sur le site.
     · Exclues : fiches Warhammer Legends et Forge World (plus jouables),
       et la fortification Miasmic Malignifier (plus jouable).
     · Unités PLAGUE LEGIONS (_faction) : Rotigus, Great Unclean One,
       Plaguebearers, Plague Drones, Beasts of Nurgle, Nurglings ;
       débloquées par Invocateurs d'Intendance (50 % des points).
     · Supports (leader.type "support") : Biologus Putrifier, Foul
       Blightspawn, Icon Bearer, Noxious Blightbringer, Plague Surgeon,
       Tallyman (leur fiche permet de rejoindre une unité déjà menée).

   Unités citées : mots-clés anglais (comme les autres factions).
   Correspondances avec les noms français des fiches fournies :
     Putréfacteur Biologus = BIOLOGUS PUTRIFIER
     Seigneur de la Virulence = LORD OF VIRULENCE
     Véroleux = POXWALKERS ; Marines de la Peste = PLAGUE MARINES
     Drone Fétide (avec Lance-peste Lourd) = FOETID BLOAT-DRONE
       (FOETID BLOAT-DRONE WITH HEAVY BLIGHT LAUNCHER)
     Métabrutus = HELBRUTE ; Semi-chenillé Méphitique = MYPHITIC BLIGHT-HAULER
     Légions de la Peste = PLAGUE LEGIONS
     Incursion = 1000 points ; Assaut = 2000 points
   ========================================================= */

(() => {

const A_SAISIR = "Texte à saisir.";
const TDB = "Tactique de Bataille";

// Optimisation (personnage) ou amélioration (unité), texte à saisir
const opt = (id, name, cost, kind = "optimisation") => ({
  id, name, cost, kind,
  requires: [["Death Guard"]],
  text: A_SAISIR
});
const amelio = (id, name, cost) => opt(id, name, cost, "amelioration");

// Moments des stratagèmes (vus du joueur Death Guard)
const M = {
  vousCmd:    { tour: "vous", phase: "commandement" },
  vousMvt:    { tour: "vous", phase: "mouvement" },
  vousTir:    { tour: "vous", phase: "tir" },
  vousCharge: { tour: "vous", phase: "charge" },
  vousCombat: { tour: "vous", phase: "combat" },
  advCmd:     { tour: "adversaire", phase: "commandement" },
  advMvt:     { tour: "adversaire", phase: "mouvement" },
  advTir:     { tour: "adversaire", phase: "tir" },
  advCharge:  { tour: "adversaire", phase: "charge" },
  cmd:        { tour: "les-deux", phase: "commandement" },
  combat:     { tour: "les-deux", phase: "combat" },
  tout:       { tour: "les-deux", phase: "toutes" }
};

const strat = (id, name, cp, type, moments, quand, cible, effet) =>
  ({ id, name, cp, type, moments, quand, cible, effet });

Factions.register({
  id: "death-guard",
  name: "Death Guard",
  keyword: "Death Guard",

  armyRules: [
    {
      id: "bienfait-de-nurgle",
      name: "Bienfait de Nurgle (Aura)",
      nameEn: "Nurgle's Gift (Aura)",
      text: [
        "Si la Faction d'Armée de votre armée est DEATH GUARD, tant qu'une unité ennemie est à Portée de Contagion d'une ou plusieurs figurines DEATH GUARD de votre armée, elle est __Affligée__ (voir ci-dessous).",
        "__Portée de Contagion__ : elle augmente au fil de la bataille.",
        "• 1er round de bataille : 3\".",
        "• 2e round de bataille : 6\".",
        "• À partir du 3e round de bataille : 9\".",
        "La Portée de Contagion ne peut pas dépasser 12\" après modificateurs."
      ]
    },
    {
      id: "affligee",
      name: "Affligée",
      nameEn: "Afflicted",
      text: [
        "Pendant l'étape Déclarer les Formations de Bataille, choisissez l'un des Fléaux ci-dessous. Jusqu'à la fin de la bataille, tant qu'une unité ennemie est Affligée, soustrayez 1 à la caractéristique d'Endurance de ses figurines, et elle subit l'effet du Fléau choisi.",
        "__Fléau Grouillecrâne__ (Skullsquirm Blight) : chaque fois qu'une figurine de cette unité fait une attaque de tir, les unités ennemies bénéficient du couvert contre cette attaque. Chaque fois qu'une figurine de cette unité fait une attaque de mêlée, soustrayez 1 au jet de touche.",
        "__Fièvre Claque-os__ (Rattlejoint Ague) : aggravez de 1 la caractéristique de Sauvegarde des figurines de cette unité.",
        "__Pourrâme Scabreuse__ (Scabrous Soulrot) : aggravez de 1 les caractéristiques de Mouvement, de Commandement et de Contrôle d'Objectif des figurines de cette unité (le Contrôle d'Objectif ne peut pas descendre sous 1 de cette façon)."
      ]
    },
    {
      id: "pacte-de-decrepitude",
      name: "Pacte de Décrépitude",
      nameEn: "Pact of Decay",
      text: [
        "Lors de la constitution de votre armée, sauf mention contraire, vous ne pouvez pas choisir PLAGUE LEGIONS comme Faction d'Armée."
      ]
    }
  ],

  detachments: [

    /* -------------------------------------------------------
       CHAMPIONS DE LA CONTAGION (Champions of Contagion)
       ------------------------------------------------------- */
    {
      id: "champions-de-la-contagion", name: "Champions de la Contagion", nameEn: "Champions of Contagion",
      cost: 2, dispositions: ["take-and-hold"],
      rule: { name: null, text: [
        "Au début de chaque round de bataille, vous pouvez remplacer le Fléau choisi (voir Affligée) par un autre de la liste."
      ] },
      enhancements: [
        opt("cornucophagus", "Cornucophagus", 35),
        opt("ingredient-final", "Ingrédient Final", 20),
        opt("seringue-de-nurgle", "Seringue de Nurgle", 25),
        opt("visions-de-virulence", "Visions de Virulence", 15)
      ],
      stratagems: [
        strat("benedictions-crasseuses", "Bénédictions Crasseuses", 1, TDB, [M.vousTir, M.vousCombat],
          "Votre phase de Tir ou de Combat.",
          "1 unité DEATH GUARD Attachée de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, ses attaques font des Touches Critiques sur un jet de touche non modifié de 5+."),
        strat("infusion-rabique", "Infusion Rabique", 1, null, [M.combat],
          "Début de la phase de Combat.",
          "1 unité DEATH GUARD de votre armée qui inclut 2 CHARACTERS.",
          "Jusqu'à la fin de la phase, elle a l'aptitude Combat en Premier."),
        strat("malveillance-exacerbee", "Malveillance Exacerbée", 2, TDB, [M.vousTir, M.vousCombat],
          "Votre phase de Tir ou de Combat.",
          "1 unité DEATH GUARD Attachée de votre armée pas encore choisie pour tirer ou combattre à cette phase.",
          "Jusqu'à la fin de la phase, quand elle attaque une unité en dessous de sa Force Initiale, vous pouvez relancer les jets de touche et de blessure."),
        strat("perseverance-grotesque", "Persévérance Grotesque", 1, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité DEATH GUARD Attachée de votre armée choisie pour cible.",
          "Jusqu'à la fin de la phase, ajoutez 2 à la caractéristique d'Endurance de ses figurines."),
        strat("tetes-de-mort", "Têtes de Mort", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 BIOLOGUS PUTRIFIER non engagé de votre armée pas encore choisi pour tirer à cette phase.",
          "Choisissez 1 unité ennemie (sauf VEHICLE) visible et à 8\" ou moins. Jusqu'au début de votre prochain tour, elle subit les effets de tous les Fléaux (voir Affligée)."),
        strat("vecteur-mobile", "Vecteur Mobile", 1, null, [M.vousMvt],
          "Votre phase de Mouvement, avant l'étape des Renforts.",
          "1 unité DEATH GUARD CHARACTER de votre armée qui ne mène pas d'unité.",
          "Elle peut être attachée à une unité amie à 2\" ou moins horizontalement et 5\" ou moins verticalement, sauf si cette unité est Ébranlée ou ne peut plus accepter de meneur selon les règles de formation.")
      ]
    },

    /* -------------------------------------------------------
       MACHINES DE CONTAGION (Contagion Engines)
       ------------------------------------------------------- */
    {
      id: "machines-de-contagion", name: "Machines de Contagion", nameEn: "Contagion Engines",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: null, text: [
        "• Les unités FOETID BLOAT-DRONE, FOETID BLOAT-DRONE WITH HEAVY BLIGHT LAUNCHER, HELBRUTE et MYPHITIC BLIGHT-HAULER de votre armée ont le mot-clé MACHINES DE CONTAGION.",
        "• Les attaques de tir des unités MACHINES DE CONTAGION de votre armée ont [ASSAUT]."
      ] },
      enhancements: [
        amelio("lancette-de-la-plaie-du-monde", "Lancette de la Plaie du Monde", 15),
        amelio("parasite-moissonneur", "Parasite Moissonneur", 15)
      ],
      stratagems: [
        strat("cycle-de-la-vesanie-putrescente", "Cycle de la Vésanie Putrescente", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie engagée avec une unité MACHINES DE CONTAGION de votre armée est choisie pour Battre en Retraite.",
          "Cette unité MACHINES DE CONTAGION.",
          "Lancez 1D6 : sur 1, l'unité ennemie subit 1 blessure mortelle ; sur 2-5, elle subit D3 blessures mortelles ; sur 6, elle subit 3 blessures mortelles."),
        strat("deluge-de-rouille", "Déluge de Rouille", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité MACHINES DE CONTAGION de votre armée est choisie pour tirer.",
          "Cette unité MACHINES DE CONTAGION.",
          "Choisissez 1 unité ennemie visible : elle est Affligée jusqu'à ce que votre unité ait fini ses attaques."),
        strat("nouveaux-vecteurs", "Nouveaux Vecteurs", 1, null, [M.vousTir, M.combat],
          "Votre phase de Tir ou phase de Combat, quand une unité MACHINES DE CONTAGION de votre armée est choisie pour attaquer.",
          "Cette unité MACHINES DE CONTAGION.",
          "Jusqu'à la fin de la phase, relancez un jet de blessure de 1 pour ses attaques.")
      ]
    },

    /* -------------------------------------------------------
       ÉLUS DU SEIGNEUR DE LA MORT (Death Lord's Chosen)
       ------------------------------------------------------- */
    {
      id: "elus-du-seigneur-de-la-mort", name: "Élus du Seigneur de la Mort", nameEn: "Death Lord's Chosen",
      cost: 2, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "À la phase de Commandement adverse, lancez 2D6 pour chaque unité ennemie Affligée, en soustrayant 1 au résultat si elle est en dessous de sa Demi-Force : sur 6 ou moins, elle subit D3 blessures mortelles."
      ] },
      enhancements: [
        opt("visage-de-la-mort", "Visage de la Mort", 10),
        opt("heaume-du-roi-des-mouches", "Heaume du Roi des Mouches", 20),
        opt("vigueur-infecte", "Vigueur Infecte", 15),
        opt("talisman-maleputride", "Talisman Maleputride", 30)
      ],
      stratagems: [
        strat("balisage-infectieux", "Balisage Infectieux", 1, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 LORD OF VIRULENCE de votre armée.",
          "Choisissez 1 pion objectif visible et à 30\" ou moins de lui. Jusqu'au début de votre prochain tour, les unités ennemies à portée de ce pion objectif sont Affligées."),
        strat("eclosion-de-pestilence", "Éclosion de Pestilence", 1, null, [M.tout],
          "Début de n'importe quelle phase.",
          "1 unité DEATH GUARD TERMINATOR de votre armée.",
          "Jusqu'à la fin de la phase, ajoutez 3\" à sa Portée de Contagion."),
        strat("enseignements-de-mortarion", "Enseignements de Mortarion", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité DEATH GUARD TERMINATOR de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, ses armes de tir ont [ASSAUT] et [LOURD]."),
        strat("impact-ecoeurant", "Impact Écœurant", 1, null, [M.vousCharge],
          "Votre phase de Charge, juste après qu'une unité DEATH GUARD TERMINATOR de votre armée a fini un mouvement de Charge.",
          "Cette unité TERMINATOR.",
          "Choisissez 1 unité ennemie à portée d'engagement d'elle et lancez 1D6 par figurine de votre unité à portée d'engagement de cette unité ennemie : pour chaque 2+, elle subit 1 blessure mortelle (6 au maximum)."),
        strat("mornes-faucheuses", "Mornes Faucheuses", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité DEATH GUARD TERMINATOR de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, vous pouvez relancer ses jets de touche (sauf contre les unités MONSTER et VEHICLE)."),
        strat("rancoeur-imperissable", "Rancœur Impérissable", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité DEATH GUARD TERMINATOR de votre armée choisie pour cible.",
          "Jusqu'à la fin de la phase, chaque fois qu'une de ses figurines est détruite avant d'avoir combattu, lancez 1D6 : sur 4+, elle peut combattre avant d'être retirée.")
      ]
    },

    /* -------------------------------------------------------
       OST VERMOULU (Flyblown Host)
       ------------------------------------------------------- */
    {
      id: "ost-vermoulu", name: "Ost Vermoulu", nameEn: "Flyblown Host",
      cost: 1, dispositions: ["reconnaissance"],
      rule: { name: null, text: [
        "À l'étape Déclarer les Formations de Bataille, vous pouvez choisir jusqu'à 2 unités PLAGUE MARINES de votre armée : elles ont l'aptitude Infiltrateurs."
      ] },
      enhancements: [
        amelio("murmure-d-insectes", "Murmure d'Insectes", 15),
        amelio("voile-de-peste", "Voile de Peste", 15)
      ],
      stratagems: [
        strat("horreur-bourdonnante", "Horreur Bourdonnante", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité PLAGUE MARINES de votre armée est choisie pour tirer.",
          "Cette unité PLAGUE MARINES.",
          "Jusqu'à la fin de la phase, relancez un jet de touche de 1 pour ses attaques de tir ; si elles ciblent une unité à demi-portée, relancez aussi un jet de blessure de 1."),
        strat("oeil-de-la-nuee", "Œil de la Nuée", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité PLAGUE MARINES de votre armée est choisie pour tirer.",
          "Cette unité PLAGUE MARINES.",
          "Jusqu'à la fin de la phase, ses attaques de tir ont [COMBAT RAPPROCHÉ]."),
        strat("paroxysme-nauseabond", "Paroxysme Nauséabond", 1, null, [M.combat],
          "Début de la phase de Combat.",
          "1 unité PLAGUE MARINES engagée de votre armée.",
          "Choisissez 1 unité ennemie engagée avec elle : elle fait un test d'Ébranlement, en soustrayant 1 au résultat.")
      ]
    },

    /* -------------------------------------------------------
       MARTEAU DE MORTARION (Mortarion's Hammer)
       ------------------------------------------------------- */
    {
      id: "marteau-de-mortarion", name: "Marteau de Mortarion", nameEn: "Mortarion's Hammer",
      cost: 2, dispositions: ["purge-the-foe"],
      rule: { name: null, text: [
        "Au début de chaque round de bataille, choisissez 2 unités ennemies sur le champ de bataille et à plus de 12\" de votre armée (1 en Incursion, 3 en Assaut). Jusqu'à la fin du round, ces unités sont à Portée de Contagion de votre armée."
      ] },
      enhancements: [
        opt("fleau-de-gerbe-bile", "Fléau de Gerbe-bile", 10),
        opt("oeil-de-l-affliction", "Œil de l'Affliction", 20),
        opt("familier-hurleur", "Familier Hurleur", 15),
        opt("vrilles-effluves", "Vrilles-effluves", 30)
      ],
      stratagems: [
        strat("bourbier-infecte", "Bourbier Infecte", 1, null, [M.advCharge],
          "Début de la phase de Charge adverse.",
          "1 unité DEATH GUARD VEHICLE non engagée de votre armée.",
          "Choisissez 1 unité ennemie visible et à 12\" ou moins de votre unité. Jusqu'à la fin de la phase, quand elle déclare une charge, soustrayez 1 à son jet de Charge."),
        strat("broyage-implacable", "Broyage Implacable", 1, null, [M.vousMvt, M.vousCharge],
          "Votre phase de Mouvement ou de Charge.",
          "1 unité DEATH GUARD VEHICLE de votre armée.",
          "Jusqu'à la fin de la phase, elle peut traverser horizontalement les éléments de terrain."),
        strat("pousses-au-desespoir", "Poussés au Désespoir", 1, TDB, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité DEATH GUARD de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, vous pouvez relancer ses jets de touche contre les unités ennemies visibles (sauf AIRCRAFT) dans la zone de déploiement adverse."),
        strat("source-d-immondices", "Source d'Immondices", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité DEATH GUARD VEHICLE de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, ses armes de tir ont [ASSAUT]."),
        strat("terres-affligees", "Terres Affligées", 2, null, [M.vousMvt],
          "Fin de votre phase de Mouvement.",
          "1 unité DEATH GUARD VEHICLE de votre armée.",
          "Choisissez 1 élément de terrain visible et à 24\" ou moins de votre unité. Jusqu'au début de votre prochain tour, les unités ennemies à 3\" ou moins de cet élément de terrain sont Affligées."),
        strat("tornade-de-dardezieux", "Tornade de Dardezieux", 1, null, [M.advCmd],
          "Phase de Commandement adverse.",
          "1 unité DEATH GUARD VEHICLE de votre armée.",
          "Choisissez 1 pion objectif visible de votre unité : les unités ennemies à portée de ce pion objectif doivent faire un test d'Ébranlement.")
      ]
    },

    /* -------------------------------------------------------
       PARANGONS DE LA PUTRESCENCE (Paragons of Putrescence)
       ------------------------------------------------------- */
    {
      id: "parangons-de-la-putrescence", name: "Parangons de la Putrescence", nameEn: "Paragons of Putrescence",
      cost: 1, dispositions: ["priority-assets"],
      rule: { name: null, text: [
        "Ajoutez 3\" à la Portée de Contagion des unités DEATH GUARD CHARACTER de votre armée (12\" au maximum)."
      ] },
      enhancements: [
        opt("hote-de-la-verole-hybride", "Hôte de la Vérole Hybride", 40),
        opt("essaim-revigorant", "Essaim Revigorant", 20)
      ],
      stratagems: [
        strat("contamination-simultanee", "Contamination Simultanée", 1, null, [M.vousTir],
          "Votre phase de Tir, quand une unité DEATH GUARD CHARACTER de votre armée entreprend une action.",
          "Cette unité CHARACTER.",
          "Cette action ne l'empêche pas d'être éligible pour tirer."),
        strat("infection-territoriale", "Infection Territoriale", 1, null, [M.cmd],
          "Début de la phase de Commandement.",
          "1 unité DEATH GUARD CHARACTER de votre armée.",
          "Jusqu'à la fin du tour, ajoutez 1 à la caractéristique de Contrôle d'Objectif de ses figurines."),
        strat("spasmes-aggraves", "Spasmes Aggravés", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "1 unité DEATH GUARD CHARACTER de votre armée.",
          "Choisissez 1 unité ennemie visible et à Portée de Contagion de votre unité : elle a +6\" en portée de détection.")
      ]
    },

    /* -------------------------------------------------------
       VECTORIUM DE LA POURRITURE TITUBANTE (Shamblerot Vectorium)
       ------------------------------------------------------- */
    {
      id: "vectorium-de-la-pourriture-titubante", name: "Vectorium de la Pourriture Titubante", nameEn: "Shamblerot Vectorium",
      cost: 2, dispositions: ["disruption"],
      rule: { name: null, text: [
        "Les unités POXWALKERS de votre armée ont le mot-clé BATTLELINE.",
        "À votre phase de Commandement des rounds de bataille 2, 3 et 4 (2 et 3 seulement en Incursion ; 2, 3, 4 et 5 en Assaut), ajoutez une nouvelle unité de 10 POXWALKERS à votre armée, en Réserves Stratégiques."
      ] },
      enhancements: [
        opt("seigneur-de-la-verole-ambulante", "Seigneur de la Vérole Ambulante", 15),
        opt("tristesiphon", "Tristesiphon", 10),
        opt("talisman-d-eclosion", "Talisman d'Éclosion", 25),
        opt("biniou-gate", "Biniou Gâté", 25)
      ],
      stratagems: [
        strat("cache-parmi-les-morts", "Caché parmi les Morts", 1, null, [M.vousMvt],
          "Étape des Renforts de votre phase de Mouvement.",
          "1 unité POXWALKERS sans meneur de votre armée en Réserves Stratégiques.",
          "Jusqu'à la fin de la phase, elle a l'aptitude Frappe en Profondeur."),
        strat("choc-et-horreur", "Choc et Horreur", 1, null, [M.vousCharge],
          "Votre phase de Charge, juste après qu'une unité DEATH GUARD de votre armée a fini un mouvement de Charge.",
          "Cette unité DEATH GUARD.",
          "Chaque unité ennemie à portée d'engagement d'elle fait un test d'Ébranlement, en soustrayant 1 au résultat."),
        strat("etreinte-de-la-verole-ambulante", "Étreinte de la Vérole Ambulante", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité POXWALKERS de votre armée choisie pour cible.",
          "Après les attaques, lancez 1D6 par figurine POXWALKERS détruite par ces attaques : pour chaque 6, l'unité attaquante subit 1 blessure mortelle. Si votre unité n'est pas détruite, chaque figurine ainsi détruite compte pour le nombre de POXWALKERS qui se relèvent à la fin de la phase de Combat."),
        strat("faim-tenaillante", "Faim Tenaillante", 1, TDB, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 unité POXWALKERS de votre armée.",
          "Jusqu'à la fin du tour, ajoutez 1 aux caractéristiques de Mouvement, d'Attaques et de Force de ses figurines."),
        strat("mur-titubant", "Mur Titubant", 1, null, [M.advTir],
          "Phase de Tir adverse, juste après qu'une unité ennemie a choisi pour cible une unité DEATH GUARD de votre armée.",
          "1 unité POXWALKERS de votre armée à 3\" ou moins de cette unité DEATH GUARD et visible par elle et par l'unité attaquante.",
          "Jusqu'à la fin de la phase, chaque fois qu'une attaque devrait être allouée à une figurine de votre unité DEATH GUARD, si votre unité POXWALKERS est toujours sur le champ de bataille, visible par la figurine attaquante et une cible éligible pour cette attaque, aucun jet de sauvegarde n'est fait : à la place, détruisez autant de figurines POXWALKERS que la caractéristique de Dégâts de l'attaque."),
        strat("recouvert-de-crasse", "Recouvert de Crasse", 1, null, [M.combat],
          "Phase de Combat, juste après qu'une unité POXWALKERS de votre armée a été détruite.",
          "1 unité ennemie qui a attaqué cette unité POXWALKERS à cette phase.",
          "Elle est Affligée jusqu'à la fin de la bataille.")
      ]
    },

    /* -------------------------------------------------------
       INVOCATEURS D'INTENDANCE (Tallyband Summoners)
       ------------------------------------------------------- */
    {
      id: "invocateurs-d-intendance", name: "Invocateurs d'Intendance", nameEn: "Tallyband Summoners",
      cost: 2, dispositions: ["disruption"],
      // Débloque les unités PLAGUE LEGIONS de ce fichier (_faction: "Plague Legions")
      unlocks: ["Plague Legions"],
      constraints: [{ type: "maxPointsPercent", keyword: "Plague Legions", percent: 50 }],
      rule: { name: null, text: [
        "• Jusqu'à 50 % de votre armée peut être composée d'unités PLAGUE LEGIONS.",
        "• Les unités PLAGUE LEGIONS de votre armée à 7\" ou moins d'une unité DEATH GUARD de votre armée ont l'aptitude Bienfait de Nurgle.",
        "• Ajoutez 3\" à la Portée de Contagion des unités DEATH GUARD de votre armée à 7\" ou moins d'une unité PLAGUE LEGIONS de votre armée."
      ] },
      enhancements: [
        opt("fleau-du-fanal", "Fléau du Fanal", 20),
        opt("glas-entropique", "Glas Entropique", 15),
        opt("affrecolteur", "Affrécolteur", 10),
        opt("grimoire-des-bienfaits-abondants", "Grimoire des Bienfaits Abondants", 20)
      ],
      stratagems: [
        strat("avalanche-de-chair", "Avalanche de Chair", 1, null, [M.vousMvt, M.vousCharge],
          "Votre phase de Mouvement ou de Charge.",
          "1 unité PLAGUE LEGIONS MONSTER de votre armée pas encore choisie pour se déplacer ou charger à cette phase.",
          "Jusqu'à la fin de la phase, quand elle fait un Mouvement Normal, une Avance ou un mouvement de Charge, elle peut traverser horizontalement les éléments de terrain."),
        strat("avatars-de-decrepitude", "Avatars de Décrépitude", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité PLAGUE LEGIONS de votre armée.",
          "Jusqu'à la fin de la phase, les unités ennemies à 6\" ou moins d'elle sont Affligées."),
        strat("bourbe-collante", "Bourbe Collante", 1, null, [M.advMvt],
          "Phase de Mouvement adverse, quand une unité ennemie (sauf MONSTER et VEHICLE) engagée avec une unité PLAGUE LEGIONS de votre armée est choisie pour Battre en Retraite.",
          "Cette unité PLAGUE LEGIONS.",
          "L'unité ennemie doit réussir un test d'Ébranlement, sinon elle doit rester stationnaire."),
        strat("corruption-etreignante", "Corruption Étreignante", 1, TDB, [M.combat],
          "Phase de Combat.",
          "1 unité DEATH GUARD de votre armée pas encore choisie pour combattre à cette phase.",
          "Jusqu'à la fin de la phase, vous pouvez relancer ses jets de touche de mêlée contre les unités engagées avec une unité PLAGUE LEGIONS de votre armée."),
        strat("nuisibles-persistants", "Nuisibles Persistants", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité NURGLINGS de votre armée a été détruite.",
          "Cette unité NURGLINGS.",
          "Ajoutez à votre armée une nouvelle unité identique, avec son effectif de départ, en Réserves Stratégiques."),
        strat("pourrissement-generalise", "Pourrissement Généralisé", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité PLAGUE LEGIONS de votre armée.",
          "Jusqu'à la fin de la phase, les unités ennemies engagées avec elle sont considérées comme non engagées avec elle et peuvent être choisies pour cible par vos attaques de tir. Chaque fois qu'une de ces unités ennemies perd 1 PV à cause d'une attaque de tir alors qu'elle est à portée d'engagement de votre unité, lancez 1D6 : sur 5+, votre unité subit 1 blessure mortelle.")
      ]
    },

    /* -------------------------------------------------------
       VECTORIUM VIRULENT (Virulent Vectorium)
       ------------------------------------------------------- */
    {
      id: "vectorium-virulent", name: "Vectorium Virulent", nameEn: "Virulent Vectorium",
      cost: 3, dispositions: ["take-and-hold", "purge-the-foe"],
      rule: { name: null, text: [
        "À la fin de votre phase de Commandement, chaque pion objectif contrôlé par une unité DEATH GUARD de votre armée est sécurisé par votre armée. Jusqu'à ce que vous en perdiez le contrôle, les unités ennemies à portée de ce pion objectif sont Affligées."
      ] },
      enhancements: [
        opt("archi-contaminateur", "Archi-contaminateur", 25),
        opt("arme-demon-de-nurgle", "Arme-démon de Nurgle", 10),
        opt("fourneau-des-pestes", "Fourneau des Pestes", 25),
        opt("regeneration-revulsante", "Régénération Révulsante", 30)
      ],
      stratagems: [
        strat("affreusement-resistant", "Affreusement Résistant", 2, TDB, [M.advTir, M.combat],
          "Phase de Tir adverse ou phase de Combat, juste après qu'une unité ennemie a choisi ses cibles.",
          "1 unité DEATH GUARD de votre armée choisie pour cible.",
          "Jusqu'à la fin de la phase, soustrayez 1 à la caractéristique de Dégâts des attaques qui ciblent votre unité."),
        strat("detonation-putride", "Détonation Putride", 1, null, [M.tout],
          "N'importe quelle phase, juste après qu'une unité DEATH GUARD VEHICLE ou MONSTER de votre armée qui a l'aptitude Destruction Néfaste a été détruite.",
          "Cette unité.",
          "Elle explose automatiquement, sans lancer de dé. Les unités qui subissent des blessures mortelles de cette explosion sont Affligées jusqu'au début de votre prochain tour."),
        strat("effusion-pestifere", "Effusion Pestifère", 2, null, [M.vousCmd],
          "Votre phase de Commandement, si votre SEIGNEUR DE GUERRE DEATH GUARD est sur le champ de bataille.",
          "Votre armée.",
          "Jusqu'à votre prochaine phase de Commandement, ajoutez 3\" à la Portée de Contagion de votre armée."),
        strat("eruption-de-spores-sangsues", "Éruption de Spores-sangsues", 1, null, [M.vousCmd],
          "Votre phase de Commandement.",
          "1 figurine DEATH GUARD de votre armée qui a perdu 1 PV ou plus.",
          "Choisissez 1 unité ennemie à 3\" ou moins d'elle et lancez autant de D6 que de PV perdus par votre figurine : pour chaque 5+, l'unité ennemie subit 1 blessure mortelle (6 au maximum) et votre figurine récupère 1 PV perdu (6 au maximum)."),
        strat("generosite-debordante", "Générosité Débordante", 1, null, [M.vousTir],
          "Début de votre phase de Tir.",
          "1 unité DEATH GUARD CHARACTER de votre armée.",
          "Choisissez 1 unité ennemie visible d'elle. Jusqu'à la fin de la phase, chaque fois qu'une unité DEATH GUARD de votre armée tire sur cette unité ennemie, vous pouvez relancer les jets du nombre d'attaques."),
        strat("mal-rampant", "Mal Rampant", 1, null, [M.vousTir],
          "Votre phase de Tir.",
          "1 unité DEATH GUARD INFANTRY de votre armée pas encore choisie pour tirer à cette phase.",
          "Jusqu'à la fin de la phase, vous pouvez relancer ses jets de touche et de blessure contre les unités Affligées.")
      ]
    }
  ],

  /* =========================================================
     UNITÉS — format de factions/emperors-children.js
     Valeurs recopiées de Wahapedia (11e édition).
     ========================================================= */
  units: [

    /* ---------- Héros d'infanterie épiques ---------- */
    {
      id: "typhus",
      name: "Typhus",
      category: "epic-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Psyker", "Epic Hero", "Chaos", "Nurgle", "Terminator", "Typhus"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Blightlord Terminators", "Deathshroud Terminators", "Poxwalkers"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "lakrimae", name: "Lakrimae", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "9", AP: "-2", D: "3", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }
          ] }
      ],
      loadout: ["lakrimae"],
      abilities: [
        { name: "The Destroyer Hive", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une attaque de mêlée cible cette unité, soustrayez 1 au jet de touche." },
        { name: "Eater Plague (Psychic)",
          text: "À votre phase de Tir, vous pouvez choisir 1 unité ennemie visible et à 18\" ou moins de ce PSYKER (sauf une unité qui a l'aptitude Agent Solitaire, ne fait pas partie d'une unité Attachée et n'est pas à 12\" ou moins de ce PSYKER) et lancer 1D6 : sur 1, l'unité de ce PSYKER subit D3 blessures mortelles ; sur 2-5, l'unité ennemie subit D6 blessures mortelles ; sur 6, elle subit D3+3 blessures mortelles." }
      ],
      composition: "1 Typhus"
    },

    /* ---------- Héros monstres épiques ---------- */
    {
      id: "mortarion",
      name: "Mortarion",
      category: "epic-monster",
      base: "100mm",
      keywords: ["Monster", "Character", "Psyker", "Fly", "Epic Hero", "Grenades", "Chaos", "Nurgle", "Daemon", "Primarch", "Mortarion"],
      stats: { M: "10\"", T: 12, Sv: "2+", W: 16, Ld: "5+", OC: 6, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 375 }] }],
      mustBeWarlord: true,                          // Supreme Commander
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:5+"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "lantern", name: "Lantern", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "2+", S: "10", AP: "-3", D: "3", abilities: ["pistol", "sustained-hits:D3"] }] },
        { id: "rotwind", name: "Rotwind", type: "ranged",
          profiles: [{ range: "24\"", A: "D6+3", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["blast", "devastating-wounds", "lethal-hits", "psychic"] }] },
        { id: "silence", name: "Silence", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "2+", S: "14", AP: "-3", D: "D6+1", abilities: ["devastating-wounds", "lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "15", skill: "2+", S: "8",  AP: "-2", D: "2",    abilities: ["lethal-hits", "sustained-hits:1"] }
          ] }
      ],
      loadout: ["lantern", "rotwind", "silence"],
      abilities: [
        { name: "Lord of the Death Guard", usage: "une-fois-par-tour",
          text: "Une fois par tour, cette figurine peut utiliser l'une des aptitudes Lord of the Death Guard : Diseased Influence, Boon of Death ou Inflamed Reprisal." },
        { name: "Diseased Influence (Lord of the Death Guard)",
          text: "Juste après qu'une unité ennemie a fini un Mouvement Normal, une Avance ou une Retraite à 8\" ou moins d'une unité DEATH GUARD amie elle-même à 6\" ou moins de cette figurine, si cette unité DEATH GUARD n'est à portée d'engagement d'aucune unité ennemie, elle peut faire un Mouvement Normal de 5\" maximum." },
        { name: "Boon of Death (Lord of the Death Guard)",
          text: "À la phase de Combat, quand une unité DEATH GUARD amie à 6\" ou moins de cette figurine est choisie pour cible d'une attaque, cette figurine peut utiliser cette aptitude. Dans ce cas, jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité DEATH GUARD est détruite par une attaque de mêlée, si elle n'a pas encore combattu à cette phase, lancez 1D6 : sur 2+, ne la retirez pas tout de suite. Elle peut combattre une fois que l'unité attaquante a fini ses attaques, puis elle est retirée." },
        { name: "Inflamed Reprisal (Lord of the Death Guard)",
          text: "À la phase de Tir adverse, quand une unité DEATH GUARD amie à 6\" ou moins de cette figurine est choisie pour cible d'une attaque, cette figurine peut utiliser cette aptitude. Dans ce cas, une fois que l'unité attaquante a fini ses attaques, cette unité DEATH GUARD peut tirer comme si c'était votre phase de Tir, mais en aggravant de 1 la CT de ses attaques, et elle ne peut cibler que cette unité ennemie (et seulement si c'est une cible éligible)." },
        { name: "Host of Plagues",
          text: "À la fin de votre phase de Mouvement, lancez 1D6 pour chaque unité ennemie à 6\" ou moins de cette figurine, en ajoutant 1 au résultat si elle est Affligée : sur 3+, cette unité subit D3 blessures mortelles." },
        { name: "Supreme Commander",
          text: "Si cette figurine fait partie de votre armée, elle doit être votre Seigneur de Guerre." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Mortarion"
    },
    {
      id: "rotigus",
      name: "Rotigus",
      category: "epic-monster",
      base: "130mm",
      _faction: "Plague Legions",
      keywords: ["Monster", "Character", "Epic Hero", "Psyker", "Chaos", "Nurgle", "Daemon", "Summoned", "Rotigus"],
      stats: { M: "7\"", T: 12, Sv: "5+", W: 22, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 280 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:6+"],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "streams-of-brackish-filth", name: "Streams of brackish filth", type: "ranged",
          profiles: [{ range: "12\"", A: "2D6", skill: "N/A", S: "8", AP: "-2", D: "1", abilities: ["devastating-wounds", "ignores-cover", "torrent"] }] },
        { id: "gnarlrod", name: "Gnarlrod", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "7",  skill: "2+", S: "10", AP: "-3", D: "3", abilities: ["lethal-hits", "psychic"] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "8",  AP: "-1", D: "1", abilities: ["lethal-hits", "psychic"] }
          ] }
      ],
      loadout: ["streams-of-brackish-filth", "gnarlrod"],
      abilities: [
        { name: "Virulent Blessing (Psychic)",
          text: "Au début de la phase de Combat, vous pouvez choisir 1 unité ennemie visible et à 24\" ou moins de cette figurine. Jusqu'à la fin de la phase, chaque fois qu'une attaque faite par une figurine PLAGUE LEGIONS est allouée à une figurine de cette unité, ajoutez 1 à la caractéristique de Dégâts de l'attaque." },
        { name: "Deluge of Nurgle (Aura)",
          text: "Tant qu'une unité ennemie est à 6\" ou moins de cette figurine, soustrayez 2 à la caractéristique de Mouvement et 1 à la caractéristique de Contrôle d'Objectif de ses figurines." }
      ],
      damaged: { range: "1-7", text: "Tant que cette figurine a 1 à 7 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Rotigus"
    },

    /* ---------- Personnages d'infanterie ----------
       leader.type "support" : fiches qui permettent de rejoindre une unité
       déjà menée par un autre Leader (notion de Support de la V11). Rangés
       par le moteur dans la catégorie « Supports ». */
    {
      id: "biologus-putrifier",
      name: "Biologus Putrifier",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Nurgle", "Biologus Putrifier"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { type: "support", canLead: ["Plague Marines"] },
      coreAbilities: ["deadly-demise:1", "support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "hyper-blight-grenades", name: "Hyper blight grenades", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "3+", S: "7", AP: "-1", D: "2", abilities: ["assault", "blast", "lethal-hits"] }] },
        { id: "injector-pistol", name: "Injector pistol", type: "ranged",
          profiles: [{ range: "3\"", A: "1", skill: "3+", S: "4", AP: "-1", D: "3", abilities: ["anti:Infanterie 2+", "pistol", "precision"] }] },
        { id: "plague-knives", name: "Plague knives", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["hyper-blight-grenades", "injector-pistol", "plague-knives"],
      abilities: [
        { name: "Foul Infusion", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes des figurines de cette unité ont [TOUCHES FATALES]. De plus, chaque fois qu'une figurine de cette unité attaque, un jet de touche non modifié de 5+ est une Touche Critique, au lieu de 6 seulement." },
        { name: "Extraction of Fresh Disease",
          text: "La première fois que l'unité de cette figurine détruit une unité ennemie grâce à une attaque de mêlée, jusqu'à la fin de la bataille, ajoutez 6 à la caractéristique de Contrôle d'Objectif de cette figurine." }
      ],
      composition: "1 Biologus Putrifier"
    },
    {
      id: "foul-blightspawn",
      name: "Foul Blightspawn",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Nurgle", "Foul Blightspawn"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { type: "support", canLead: ["Plague Marines"] },
      coreAbilities: ["support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plague-sprayer", name: "Plague sprayer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "7", AP: "-2", D: "2", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["plague-sprayer", "close-combat-weapon"],
      abilities: [
        { name: "Blinding Spray", usage: "une-fois-par-bataille",
          text: "À la phase de Combat, vous pouvez choisir 1 figurine de votre armée qui a cette aptitude. Dans ce cas, jusqu'à la fin de la phase, l'unité de cette figurine a l'aptitude Combat en Premier. Chaque figurine ne peut être choisie pour cette aptitude qu'une fois par bataille." },
        { name: "Putrefying Stink",
          text: "Les figurines ennemies ne peuvent ni commencer ni finir une Avance à 9\" ou moins de cette figurine." }
      ],
      composition: "1 Foul Blightspawn"
    },
    {
      id: "icon-bearer",
      name: "Icon Bearer",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Nurgle", "Icon Bearer"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "5+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 45 }] }],
      leader: { type: "support", canLead: ["Plague Marines"] },
      coreAbilities: ["support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "plague-knife", name: "Plague knife", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["boltgun", "plague-knife"],
      abilities: [
        { name: "Unclean Icon", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, ajoutez 1 à la caractéristique de Contrôle d'Objectif des figurines de cette unité." },
        { name: "Blessed Icon of Disease", usage: "une-fois-par-bataille",
          text: "Une fois par bataille, au début de n'importe quelle phase, vous pouvez choisir 1 unité DEATH GUARD amie Ébranlée et à 12\" ou moins de cette figurine : elle n'est plus Ébranlée." }
      ],
      composition: "1 Icon Bearer"
    },
    {
      id: "lord-of-contagion",
      name: "Lord of Contagion",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Nurgle", "Terminator", "Lord of Contagion"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 110 }] }],
      leader: { canLead: ["Blightlord Terminators", "Deathshroud Terminators"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "manreaper", name: "Manreaper", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "2+", S: "9", AP: "-2", D: "3", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "10", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }
          ] }
      ],
      loadout: ["manreaper"],
      abilities: [
        { name: "Vector of Disease", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, les armes de mêlée des figurines de cette unité ont [TOUCHES SOUTENUES 1] et [LANCE]." },
        { name: "Unholy Resilience", usage: "une-fois-par-bataille",
          text: "La première fois qu'une figurine qui a cette aptitude est détruite au cours d'un round de bataille, lancez 1D6 à la fin de la phase : sur 2+, replacez-la sur le champ de bataille aussi près que possible de l'endroit où elle a été détruite et hors de portée d'engagement de toute unité ennemie, avec 3 PV restants. Chaque figurine ne peut être replacée ainsi qu'une fois par bataille." }
      ],
      composition: "1 Lord of Contagion"
    },
    {
      id: "lord-of-poxes",
      name: "Lord of Poxes",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Grenades", "Chaos", "Nurgle", "Lord of Poxes"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 5, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 65 }] }],
      leader: { canLead: ["Plague Marines"] },
      coreAbilities: ["leader"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "2+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "2+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "great-plague-blade", name: "Great plague blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "8", AP: "-2", D: "2", abilities: ["devastating-wounds", "lethal-hits"] }] }
      ],
      loadout: ["plasma-pistol", "great-plague-blade"],
      abilities: [
        { name: "Gift of Poxes",
          text: "Ajoutez 3\" à la Portée de Contagion de cette figurine." },
        { name: "Shroud of Disease", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, cette unité ne peut être choisie pour cible d'attaques de tir que si la figurine attaquante est à 18\" ou moins." }
      ],
      composition: "1 Lord of Poxes"
    },
    {
      id: "lord-of-virulence",
      name: "Lord of Virulence",
      category: "char-infantry",
      base: "50mm",
      keywords: ["Infantry", "Character", "Chaos", "Nurgle", "Terminator", "Lord of Virulence"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 6, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 90 }] }],
      leader: { canLead: ["Blightlord Terminators", "Deathshroud Terminators"] },
      coreAbilities: ["deep-strike", "leader"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "twin-plague-spewer", name: "Twin plague spewer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent", "twin-linked"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "2+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["twin-plague-spewer", "power-fist"],
      abilities: [
        { name: "Virulent Aura", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque de tir, vous pouvez relancer le jet de blessure." },
        { name: "Blight Bombardment",
          text: "Au début de votre phase de Tir, choisissez 1 unité ennemie visible et à 30\" ou moins de cette figurine. Jusqu'à la fin de la phase, chaque fois qu'une figurine DEATH GUARD amie fait une attaque de tir qui cible cette unité, relancez un jet de touche de 1 (si l'attaque est faite avec une arme [DÉFLAGRATION], vous pouvez relancer le jet de touche à la place)." }
      ],
      composition: "1 Lord of Virulence"
    },
    {
      id: "malignant-plaguecaster",
      name: "Malignant Plaguecaster",
      category: "char-infantry",
      base: "32mm",
      keywords: ["Infantry", "Character", "Psyker", "Chaos", "Nurgle", "Malignant Plaguecaster"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { canLead: ["Plague Marines", "Poxwalkers"] },
      coreAbilities: ["leader"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "pistol"] }] },
        { id: "plague-wind", name: "Plague Wind", type: "ranged",
          profiles: [
            { name: "witchfire",         range: "12\"", A: "D6",   skill: "N/A", S: "4", AP: "-1", D: "D3", abilities: ["psychic", "torrent"] },
            { name: "focused witchfire", range: "12\"", A: "D6+3", skill: "N/A", S: "6", AP: "-2", D: "D3", abilities: ["hazardous", "psychic", "torrent"] }
          ] },
        { id: "corrupted-staff", name: "Corrupted staff", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "D3", abilities: ["lethal-hits", "psychic"] }] }
      ],
      loadout: ["bolt-pistol", "plague-wind", "corrupted-staff"],
      abilities: [
        { name: "Gift of Contagion (Psychic)", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité fait une attaque qui cible une unité Affligée, cette attaque a [TOUCHES SOUTENUES 1]." },
        { name: "Pestilent Fallout (Psychic)",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie INFANTRY touchée par une ou plusieurs attaques de son Plague Wind. Jusqu'à la fin du prochain tour de votre adversaire, cette unité est affaiblie : tant qu'une unité est affaiblie, soustrayez 2\" à la caractéristique de Mouvement de ses figurines." }
      ],
      composition: "1 Malignant Plaguecaster"
    },
    {
      id: "noxious-blightbringer",
      name: "Noxious Blightbringer",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Nurgle", "Noxious Blightbringer"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 50 }] }],
      leader: { type: "support", canLead: ["Plague Marines", "Poxwalkers"] },
      coreAbilities: ["support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "cursed-plague-bell", name: "Cursed plague bell", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "4", AP: "0", D: "2", abilities: ["anti:Psyker 2+", "lethal-hits"] }] }
      ],
      loadout: ["plasma-pistol", "cursed-plague-bell"],
      abilities: [
        { name: "Sickening Vitality", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, ajoutez 1\" à la caractéristique de Mouvement des figurines de cette unité, et vous pouvez relancer ses jets d'Avance et de Charge." },
        { name: "Tocsin of Misery (Aura)",
          text: "À l'étape d'Ébranlement de la phase de Commandement adverse, si une unité ennemie en dessous de son effectif initial est à 9\" ou moins de cette figurine, elle doit faire un test d'Ébranlement, en soustrayant 1 au résultat si c'est une unité PSYKER." }
      ],
      composition: "1 Noxious Blightbringer"
    },
    {
      id: "plague-surgeon",
      name: "Plague Surgeon",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Nurgle", "Plague Surgeon"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 50 }] }],
      leader: { type: "support", canLead: ["Plague Marines"] },
      coreAbilities: ["support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "pistol"] }] },
        { id: "balesword", name: "Balesword", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["bolt-pistol", "balesword"],
      abilities: [
        { name: "Tainted Narthecium", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, à votre phase de Commandement, vous pouvez ramener 1 figurine de Garde du corps détruite dans cette unité." },
        { name: "Inflamed Infections",
          text: "Au début de la phase de Combat, choisissez 1 unité ennemie à portée d'engagement de cette figurine. Jusqu'à la fin de la phase, chaque fois que cette figurine fait une attaque qui cible cette unité, un jet de touche non modifié de 5+ est une Touche Critique. Si cette unité est en dessous de la moitié de son effectif, c'est sur un jet de touche non modifié de 4+ à la place." }
      ],
      composition: "1 Plague Surgeon"
    },
    {
      id: "tallyman",
      name: "Tallyman",
      category: "char-infantry",
      base: "40mm",
      keywords: ["Infantry", "Character", "Chaos", "Nurgle", "Tallyman"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 60 }] }],
      leader: { type: "support", canLead: ["Plague Marines"] },
      coreAbilities: ["support"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["plasma-pistol", "close-combat-weapon"],
      abilities: [
        { name: "Malicious Calculations", grants: "unite-menee",
          text: "Tant que cette figurine mène une unité, chaque fois qu'une figurine de cette unité attaque, vous pouvez ignorer tout ou partie des modificateurs à la CT ou à la CC de l'attaque et/ou tout ou partie des modificateurs au jet de touche." },
        { name: "Sevenfold Chant",
          text: "À votre phase de Commandement, si cette figurine est sur le champ de bataille, lancez 2D6 : sur 7+, vous gagnez 1 PC." }
      ],
      composition: "1 Tallyman"
    },

    /* ---------- Personnages monstres ---------- */
    {
      id: "daemon-prince-of-nurgle",
      name: "Daemon Prince of Nurgle",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Chaos", "Nurgle", "Daemon", "Daemon Prince"],
      stats: { M: "8\"", T: 12, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 185 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "2+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "7",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Death Guard Defenders",
          text: "Tant que cette figurine est à 3\" ou moins d'une ou plusieurs unités DEATH GUARD INFANTRY amies, elle a l'aptitude Agent Solitaire." },
        { name: "Fevered Strategist", usage: "une-fois-par-round",
          text: "Une fois par round de bataille, une figurine de votre armée qui a cette aptitude peut l'utiliser quand une unité DEATH GUARD amie à 12\" ou moins d'elle est ciblée par un stratagème. Dans ce cas, ce stratagème coûte 1 PC de moins pour cette utilisation." },
        { name: "Miasma of Pestilence (Aura)",
          text: "Tant qu'une unité DEATH GUARD amie est à 6\" ou moins de cette figurine, chaque fois qu'une attaque de tir cible cette unité, ses figurines ont le Bénéfice du Couvert contre cette attaque." }
      ],
      composition: "1 Death Guard Daemon Prince"
    },
    {
      id: "daemon-prince-of-nurgle-with-wings",
      name: "Daemon Prince of Nurgle with Wings",
      category: "char-monster",
      base: "60mm",
      keywords: ["Monster", "Character", "Fly", "Chaos", "Nurgle", "Daemon", "Daemon Prince with Wings"],
      stats: { M: "12\"", T: 11, Sv: "2+", W: 10, Ld: "6+", OC: 3, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 160 }] }],
      coreAbilities: ["deadly-demise:D3", "deep-strike"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "infernal-cannon", name: "Infernal cannon", type: "ranged",
          profiles: [{ range: "24\"", A: "3", skill: "2+", S: "7", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "hellforged-weapons", name: "Hellforged weapons", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "7",  skill: "2+", S: "8", AP: "-2", D: "3", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "14", skill: "2+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }
          ] }
      ],
      loadout: ["infernal-cannon", "hellforged-weapons"],
      abilities: [
        { name: "Horrifying Visage",
          text: "Chaque fois que cette figurine finit un mouvement de Charge, choisissez 1 unité ennemie à portée d'engagement d'elle : cette unité doit faire un test d'Ébranlement, en soustrayant 1 au résultat." },
        { name: "Enfeebling Miasma (Aura)",
          text: "Tant qu'une unité ennemie (sauf MONSTER et VEHICLE) est à 6\" ou moins de cette figurine, chaque fois qu'elle est choisie pour Battre en Retraite, ses figurines doivent faire des tests de Fuite Désespérée. Si cette unité est Ébranlée, soustrayez 1 à chacun de ces tests." }
      ],
      composition: "1 Daemon Prince of Nurgle with Wings"
    },
    {
      id: "great-unclean-one",
      name: "Great Unclean One",
      category: "char-monster",
      base: "130mm",
      _faction: "Plague Legions",
      keywords: ["Monster", "Character", "Psyker", "Chaos", "Nurgle", "Daemon", "Summoned", "Great Unclean One"],
      stats: { M: "7\"", T: 12, Sv: "5+", W: 20, Ld: "6+", OC: 5, InSv: "4+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 265 }, { from: 3, pts: 280 }] }],
      coreAbilities: ["deadly-demise:D6", "deep-strike", "feel-no-pain:6+"],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "plague-flail", name: "Plague flail", type: "ranged",
          profiles: [{ range: "6\"", A: "D6+1", skill: "3+", S: "7", AP: "-2", D: "2", abilities: [] }] },
        { id: "putrid-vomit", name: "Putrid vomit", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "5", AP: "-2", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "bileblade", name: "Bileblade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "2+", S: "6", AP: "-2", D: "2", abilities: ["extra-attacks", "lethal-hits"] }] },
        { id: "bilesword", name: "Bilesword", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "6",  skill: "2+", S: "10", AP: "-2", D: "D6+1", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "12", skill: "2+", S: "7",  AP: "-1", D: "1",    abilities: ["lethal-hits"] }
          ] },
        { id: "doomsday-bell", name: "Doomsday bell", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "2+", S: "7", AP: "-1", D: "2", abilities: ["lethal-hits", "Reverberating Summons"] }] }
      ],
      loadout: ["plague-flail", "putrid-vomit", "bilesword"],
      options: [
        { id: "flail", text: "Le plague flail peut être remplacé par 1 bileblade.",
          replaces: ["plague-flail"], choices: [["bileblade"]] },
        { id: "bell", text: "La bilesword peut être remplacée par 1 doomsday bell.",
          replaces: ["bilesword"], choices: [["doomsday-bell"]] }
      ],
      abilities: [
        { name: "Daemon Lord of Nurgle (Aura)",
          text: "Tant qu'une unité PLAGUE LEGIONS amie est à 6\" ou moins de cette figurine, ajoutez 1 à la caractéristique d'Endurance de ses figurines." },
        { name: "Nurgle's Rot (Psychic)",
          text: "À la fin de votre phase de Mouvement, vous pouvez choisir 1 unité ennemie à 12\" ou moins de cette figurine. Jusqu'au début de votre prochaine phase de Mouvement, cette unité est pourrie : tant qu'une unité est pourrie, soustrayez 1 à la caractéristique d'Endurance de ses figurines." },
        { name: "Reverberating Summons (doomsday bell)",
          text: "Chaque fois qu'une figurine est détruite par cette arme, vous pouvez choisir 1 unité de PLAGUEBEARERS amie à 12\" ou moins du porteur et y ramener 1 figurine de Plaguebearer détruite." }
      ],
      damaged: { range: "1-7", text: "Tant que cette figurine a 1 à 7 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Great Unclean One"
    },

    /* ---------- Ligne ---------- */
    {
      id: "plague-marines",
      name: "Plague Marines",
      category: "battleline",
      base: "32mm",
      keywords: ["Infantry", "Battleline", "Grenades", "Chaos", "Nurgle", "Plague Marines"],
      stats: { M: "5\"", T: 6, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
      sizes: [
        { models: 5,  costs: [{ from: 1, pts: 90 }] },
        { models: 7,  costs: [{ from: 1, pts: 125 }] },
        { models: 10, costs: [{ from: 1, pts: 175 }] }
      ],
      coreAbilities: [],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "blight-launcher", name: "Blight launcher", type: "ranged",
          profiles: [{ range: "24\"", A: "D3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["blast", "lethal-hits"] }] },
        { id: "boltgun", name: "Boltgun", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "bolt-pistol", name: "Bolt pistol", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "pistol"] }] },
        { id: "meltagun", name: "Meltagun", type: "ranged",
          profiles: [{ range: "12\"", A: "1", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["melta:2"] }] },
        { id: "plague-belcher", name: "Plague belcher", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "4", AP: "0", D: "1", abilities: ["anti:Infanterie 4+", "ignores-cover", "torrent"] }] },
        { id: "plague-spewer", name: "Plague spewer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "plasma-gun", name: "Plasma gun", type: "ranged",
          profiles: [
            { name: "standard",    range: "24\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["rapid-fire:1"] },
            { name: "supercharge", range: "24\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "rapid-fire:1"] }
          ] },
        { id: "plasma-pistol", name: "Plasma pistol", type: "ranged",
          profiles: [
            { name: "standard",    range: "12\"", A: "1", skill: "3+", S: "7", AP: "-2", D: "1", abilities: ["pistol"] },
            { name: "supercharge", range: "12\"", A: "1", skill: "3+", S: "8", AP: "-3", D: "2", abilities: ["hazardous", "pistol"] }
          ] },
        { id: "bubotic-weapons", name: "Bubotic weapons", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "5", AP: "-2", D: "1", abilities: ["lethal-hits"] }] },
        { id: "heavy-plague-weapon", name: "Heavy plague weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "plague-knives", name: "Plague knives", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "power-fist", name: "Power fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] }] }
      ],
      wargear: [{ id: "icon-of-despair", name: "Icon of despair" }],
      models: [
        { id: "plague-champion", name: "Plague Champion", count: 1,       loadout: ["boltgun", "plague-knives"] },
        { id: "plague-marine",   name: "Plague Marine",   count: "reste", loadout: ["boltgun", "plague-knives"] }
      ],
      options: [
        { id: "champ-gun", model: "plague-champion", text: "Le boltgun du Plague Champion peut être remplacé par 1 bolt pistol, 1 plasma gun ou 1 plasma pistol.",
          replaces: ["boltgun"], choices: [["bolt-pistol"], ["plasma-gun"], ["plasma-pistol"]] },
        { id: "champ-knives", model: "plague-champion", text: "Les plague knives du Plague Champion peuvent être remplacées par 1 bubotic weapons ou 1 power fist.",
          replaces: ["plague-knives"], choices: [["bubotic-weapons"], ["power-fist"]] },
        { id: "blight", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 blight launcher.",
          replaces: ["boltgun"], choices: [["blight-launcher"]], max: { per: 5, count: 1 } },
        { id: "spewer", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 plague spewer.",
          replaces: ["boltgun"], choices: [["plague-spewer"]], max: { per: 5, count: 1 } },
        { id: "special", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, le boltgun d'1 Plague Marine peut être remplacé par 1 meltagun, 1 plague belcher ou 1 plasma gun.",
          replaces: ["boltgun"], choices: [["meltagun"], ["plague-belcher"], ["plasma-gun"]], max: { per: 5, count: 1 } },
        { id: "bubotic", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Plague Marines peuvent remplacer leur boltgun par 1 bubotic weapons.",
          replaces: ["boltgun"], choices: [["bubotic-weapons"]], max: { per: 5, count: 2 } },
        { id: "heavy", model: "plague-marine", text: "Pour chaque tranche de 5 figurines, jusqu'à 2 Plague Marines peuvent remplacer leur boltgun par 1 heavy plague weapon.",
          replaces: ["boltgun"], choices: [["heavy-plague-weapon"]], max: { per: 5, count: 2 } },
        { id: "icon", model: "plague-marine", text: "1 Plague Marine équipé d'un boltgun peut porter 1 icon of despair. Son boltgun ne peut alors pas être remplacé.",
          choices: [["icon-of-despair"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Infused with the Blessings of Nurgle",
          text: "À votre phase de Tir, chaque fois que cette unité est choisie pour tirer, après qu'elle a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'au début de votre prochain tour, cette unité ennemie est Affligée." },
        { name: "Icon of Despair (Aura)", requiresWargear: "icon-of-despair",
          text: "Tant qu'une unité ennemie est à 6\" ou moins du porteur, aggravez de 1 la caractéristique de Commandement des figurines de cette unité." }
      ],
      composition: "1 Plague Champion et 4 à 9 Plague Marines"
    },
    {
      id: "plaguebearers",
      name: "Plaguebearers",
      category: "battleline",
      base: "32mm",
      _faction: "Plague Legions",
      keywords: ["Infantry", "Battleline", "Chaos", "Nurgle", "Daemon", "Summoned", "Plaguebearers"],
      stats: { M: "5\"", T: 5, Sv: "7+", W: 2, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [{ models: 10, costs: [{ from: 1, pts: 115 }] }],
      coreAbilities: ["deep-strike"],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "plaguesword", name: "Plaguesword", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      wargear: [{ id: "daemonic-icon", name: "Daemonic icon" }, { id: "instrument-of-chaos", name: "Instrument of Chaos" }],
      models: [
        { id: "plagueridden",  name: "Plagueridden",  count: 1,       loadout: ["plaguesword"] },
        { id: "plaguebearer",  name: "Plaguebearer",  count: "reste", loadout: ["plaguesword"] }
      ],
      options: [
        { id: "instrument", model: "plaguebearer", text: "1 Plaguebearer qui ne porte pas de daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "plaguebearer", text: "1 Plaguebearer qui ne porte pas d'instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Infected Outbreak",
          text: "À la fin de votre phase de Commandement, si cette unité est à portée d'un pion objectif que vous contrôlez, il reste sous votre contrôle jusqu'à ce que le Niveau de Contrôle de votre adversaire sur ce pion soit supérieur au vôtre à la fin d'une phase." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Plagueridden et 9 Plaguebearers"
    },

    /* ---------- Transports assignés ---------- */
    {
      id: "chaos-rhino",
      name: "Chaos Rhino",
      category: "dedicated-transport",
      base: null,                                   // socle : la figurine elle-même
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Nurgle", "Transport", "Dedicated Transport", "Rhino"],
      stats: { M: "12\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 2 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 75 }, { from: 4, pts: 85 }] }],
      coreAbilities: ["deadly-demise:D3", "firing-deck:2"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["combi-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter supplémentaire ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } },
        { id: "havoc-ajout", group: "havoc", text: "Peut être équipé de 1 havoc launcher…",
          choices: [["havoc-launcher"]], max: { count: 1 } },
        { id: "havoc-remplace", group: "havoc", text: "…ou remplacer 1 combi-bolter par 1 havoc launcher.",
          replaces: ["combi-bolter"], choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      transport: {
        capacity: 12,
        allowed: [["Death Guard", "Infantry"]],
        excluded: ["Terminator"],
        text: "Capacité de transport de 12 figurines DEATH GUARD INFANTRY. Ne peut pas transporter de figurines TERMINATOR."
      },
      abilities: [
        { name: "Fire Support",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin de la phase, chaque fois qu'une figurine amie qui a débarqué de ce TRANSPORT à ce tour fait une attaque qui cible cette unité ennemie, vous pouvez relancer le jet de blessure." }
      ],
      composition: "1 Chaos Rhino"
    },

    /* ---------- Infanterie ---------- */
    {
      id: "blightlord-terminators",
      name: "Blightlord Terminators",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Nurgle", "Terminator", "Blightlord Terminators"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 3, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 3,  costs: [{ from: 1, pts: 115 }, { from: 3, pts: 145 }] },
        { models: 5,  costs: [{ from: 1, pts: 185 }, { from: 3, pts: 215 }] },
        { models: 10, costs: [{ from: 1, pts: 370 }, { from: 3, pts: 400 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "blight-launcher", name: "Blight launcher", type: "ranged",
          profiles: [{ range: "24\"", A: "D3", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["blast", "lethal-hits"] }] },
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "plague-spewer", name: "Plague spewer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "reaper-autocannon", name: "Reaper autocannon", type: "ranged",
          profiles: [{ range: "36\"", A: "4", skill: "3+", S: "7", AP: "-1", D: "1", abilities: ["devastating-wounds", "sustained-hits:1"] }] },
        { id: "bubotic-blade", name: "Bubotic blade", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "-2", D: "2", abilities: ["lethal-hits"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: [] }] },
        { id: "flail-of-corruption", name: "Flail of corruption", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits"] }] }
      ],
      models: [
        { id: "blightlord-champion",   name: "Blightlord Champion",   count: 1,       loadout: ["combi-bolter", "bubotic-blade"] },
        { id: "blightlord-terminator", name: "Blightlord Terminator", count: "reste", loadout: ["combi-bolter", "bubotic-blade"] }
      ],
      options: [
        { id: "combi-weapon", text: "Pour chaque tranche de 5 figurines, jusqu'à 3 figurines peuvent remplacer leur combi-bolter par 1 combi-weapon.",
          replaces: ["combi-bolter"], choices: [["combi-weapon"]], max: { per: 5, count: 3 } },
        { id: "flail", model: "blightlord-terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter et la bubotic blade d'1 Blightlord Terminator peuvent être remplacés par 1 flail of corruption.",
          replaces: ["combi-bolter", "bubotic-blade"], choices: [["flail-of-corruption"]], max: { per: 5, count: 1 } },
        { id: "blight", model: "blightlord-terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter d'1 Blightlord Terminator peut être remplacé par 1 blight launcher.",
          replaces: ["combi-bolter"], choices: [["blight-launcher"]], max: { per: 5, count: 1 } },
        { id: "reaper", model: "blightlord-terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter d'1 Blightlord Terminator peut être remplacé par 1 reaper autocannon.",
          replaces: ["combi-bolter"], choices: [["reaper-autocannon"]], max: { per: 5, count: 1 } },
        { id: "spewer", model: "blightlord-terminator", text: "Pour chaque tranche de 5 figurines, le combi-bolter d'1 Blightlord Terminator peut être remplacé par 1 plague spewer.",
          replaces: ["combi-bolter"], choices: [["plague-spewer"]], max: { per: 5, count: 1 } },
        { id: "spewer-3", model: "blightlord-terminator", text: "Si l'unité ne compte que 3 figurines, le combi-bolter et la bubotic blade d'1 Blightlord Terminator peuvent être remplacés par 1 plague spewer et 1 close combat weapon.",
          replaces: ["combi-bolter", "bubotic-blade"], choices: [["plague-spewer", "close-combat-weapon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Blistering Fusillade",
          text: "Si cette unité a un effectif initial de 5 figurines ou plus, ou si un CHARACTER la mène, chaque fois qu'une de ses figurines fait une attaque de tir qui cible une unité Affligée, améliorez de 1 la Force et la Pénétration d'Armure de l'attaque." }
      ],
      composition: "1 Blightlord Champion et 2 à 9 Blightlord Terminators"
    },
    {
      id: "deathshroud-terminators",
      name: "Deathshroud Terminators",
      category: "infantry",
      base: "40mm",
      keywords: ["Infantry", "Chaos", "Nurgle", "Terminator", "Deathshroud Terminators"],
      stats: { M: "5\"", T: 7, Sv: "2+", W: 4, Ld: "6+", OC: 1, InSv: "4+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 150 }, { from: 3, pts: 160 }] },
        { models: 6, costs: [{ from: 1, pts: 305 }, { from: 3, pts: 315 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plaguespurt-gauntlet", name: "Plaguespurt gauntlet", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "3", AP: "0", D: "1", abilities: ["anti:Infanterie 4+", "ignores-cover", "pistol", "torrent"] }] },
        { id: "manreaper", name: "Manreaper", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "4", skill: "2+", S: "8", AP: "-2", D: "2", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "8", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits"] }
          ] }
      ],
      wargear: [{ id: "icon-of-despair", name: "Icon of despair" }],
      models: [
        { id: "deathshroud-champion",   name: "Deathshroud Champion",   count: 1,       loadout: ["plaguespurt-gauntlet", "manreaper"] },
        { id: "deathshroud-terminator", name: "Deathshroud Terminator", count: "reste", loadout: ["plaguespurt-gauntlet", "manreaper"] }
      ],
      options: [
        { id: "gauntlet", model: "deathshroud-champion", text: "Le Deathshroud Champion peut être équipé de 1 plaguespurt gauntlet supplémentaire.",
          choices: [["plaguespurt-gauntlet"]], max: { count: 1 } },
        { id: "icon", model: "deathshroud-champion", text: "Le Deathshroud Champion peut porter 1 icon of despair.",
          choices: [["icon-of-despair"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Silent Bodyguard",
          text: "Tant qu'une figurine CHARACTER mène cette unité, cette figurine CHARACTER a l'aptitude Insensible à la Douleur 4+." },
        { name: "Death Approaches",
          text: "À votre phase de Mouvement, chaque fois que cette unité est placée sur le champ de bataille grâce à l'aptitude Frappe en Profondeur, elle peut être placée n'importe où à plus de 6\" horizontalement de toute unité ennemie Affligée et à plus de 8\" horizontalement de toute autre unité ennemie." },
        { name: "Icon of Despair (Aura)", requiresWargear: "icon-of-despair",
          text: "Tant qu'une unité ennemie est à 6\" ou moins du porteur, aggravez de 1 la caractéristique de Commandement des figurines de cette unité." }
      ],
      composition: "1 Deathshroud Champion et 2 à 5 Deathshroud Terminators"
    },
    {
      id: "poxwalkers",
      name: "Poxwalkers",
      category: "infantry",
      base: "25mm",
      keywords: ["Infantry", "Chaos", "Nurgle", "Poxwalkers"],
      stats: { M: "5\"", T: 4, Sv: "7+", W: 1, Ld: "8+", OC: 1 },
      sizes: [
        { models: 10, costs: [{ from: 1, pts: 65 }] },
        { models: 20, costs: [{ from: 1, pts: 130 }] }
      ],
      coreAbilities: ["infiltrators", "feel-no-pain:5+"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "improvised-weapon", name: "Improvised weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "5+", S: "3", AP: "0", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["improvised-weapon"],
      abilities: [
        { name: "Curse of the Walking Pox",
          text: "Chaque fois qu'une figurine POXWALKER de cette unité fait une attaque qui détruit une figurine ennemie (sauf MONSTER et VEHICLE), une fois que cette unité a résolu ses attaques, vous pouvez ramener 1 figurine POXWALKER détruite dans cette unité. Tant que TYPHUS mène cette unité, les figurines ennemies détruites par son aptitude Eater Plague comptent, pour cette aptitude, comme détruites par une attaque d'une figurine POXWALKER de cette unité." }
      ],
      composition: "10 à 20 Poxwalkers"
    },

    /* ---------- Montés ---------- */
    {
      id: "plague-drones",
      name: "Plague Drones",
      category: "mounted",
      base: "60mm (socle volant)",
      _faction: "Plague Legions",
      keywords: ["Mounted", "Fly", "Chaos", "Nurgle", "Daemon", "Summoned", "Plague Drones"],
      stats: { M: "10\"", T: 8, Sv: "6+", W: 5, Ld: "7+", OC: 2, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 110 }] },
        { models: 6, costs: [{ from: 1, pts: 220 }] }
      ],
      coreAbilities: ["deep-strike"],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "deaths-heads", name: "Death's heads", type: "ranged",
          profiles: [{ range: "12\"", A: "D3", skill: "4+", S: "4", AP: "0", D: "1", abilities: ["blast", "lethal-hits"] }] },
        { id: "foul-mouthparts", name: "Foul mouthparts", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "4+", S: "5", AP: "-1", D: "2", abilities: ["extra-attacks", "lethal-hits"] }] },
        { id: "plaguesword", name: "Plaguesword", type: "melee",
          profiles: [{ range: "Mêlée", A: "2", skill: "3+", S: "4", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      wargear: [{ id: "daemonic-icon", name: "Daemonic icon" }, { id: "instrument-of-chaos", name: "Instrument of Chaos" }],
      models: [
        { id: "plaguebringer", name: "Plaguebringer", count: 1,       loadout: ["deaths-heads", "foul-mouthparts", "plaguesword"] },
        { id: "plague-drone",  name: "Plague Drone",  count: "reste", loadout: ["deaths-heads", "foul-mouthparts", "plaguesword"] }
      ],
      options: [
        { id: "instrument", model: "plague-drone", text: "1 Plague Drone qui ne porte pas de daemonic icon peut porter 1 instrument of Chaos.",
          choices: [["instrument-of-chaos"]], max: { count: 1 } },
        { id: "icon", model: "plague-drone", text: "1 Plague Drone qui ne porte pas d'instrument of Chaos peut porter 1 daemonic icon.",
          choices: [["daemonic-icon"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Death's Heads",
          text: "À votre phase de Tir, après que cette unité a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin du tour, chaque fois qu'une unité PLAGUE LEGIONS amie fait une attaque qui cible cette unité, vous pouvez relancer le jet de blessure." },
        { name: "Daemonic Icon", requiresWargear: "daemonic-icon",
          text: "Les figurines de l'unité du porteur ont une caractéristique de Commandement de 6+." },
        { name: "Instrument of Chaos", requiresWargear: "instrument-of-chaos",
          text: "Ajoutez 1 aux jets de Charge de l'unité du porteur." }
      ],
      composition: "1 Plaguebringer et 2 à 5 Plague Drones"
    },

    /* ---------- Bêtes ---------- */
    {
      id: "beasts-of-nurgle",
      name: "Beasts of Nurgle",
      category: "beasts",
      base: "60mm",
      _faction: "Plague Legions",
      keywords: ["Beast", "Chaos", "Nurgle", "Daemon", "Summoned", "Beasts of Nurgle"],
      stats: { M: "6\"", T: 9, Sv: "6+", W: 7, Ld: "7+", OC: 3, InSv: "5+" },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 70 }] },
        { models: 2, costs: [{ from: 1, pts: 140 }] }
      ],
      coreAbilities: ["deadly-demise:1", "deep-strike", "scouts:6\""],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "putrid-appendages", name: "Putrid appendages", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "4+", S: "6", AP: "-1", D: "2", abilities: ["devastating-wounds"] }] }
      ],
      loadout: ["putrid-appendages"],
      abilities: [
        { name: "Grotesque Regeneration",
          text: "À la fin de chaque phase, si une figurine Beasts of Nurgle de cette unité a perdu des PV sans être détruite, elle récupère tous ses PV perdus." }
      ],
      composition: "1 à 2 Beasts of Nurgle"
    },
    {
      id: "chaos-spawn",
      name: "Chaos Spawn",
      category: "beasts",
      base: "50mm",
      keywords: ["Beast", "Chaos", "Nurgle", "Spawn"],
      stats: { M: "8\"", T: 7, Sv: "4+", W: 4, Ld: "7+", OC: 1 },
      sizes: [{ models: 2, costs: [{ from: 1, pts: 80 }] }],
      coreAbilities: ["deadly-demise:1", "feel-no-pain:5+", "scouts:6\""],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "hideous-mutations", name: "Hideous mutations", type: "melee",
          profiles: [{ range: "Mêlée", A: "D6+2", skill: "4+", S: "5", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["hideous-mutations"],
      abilities: [
        { name: "Lethal Ichor",
          text: "Chaque fois qu'une attaque de mêlée est allouée à une figurine de cette unité, une fois que l'unité attaquante a fini ses attaques, lancez 1D6 (six D6 au maximum par unité attaquante) : pour chaque 4+, l'unité attaquante subit 1 blessure mortelle." }
      ],
      composition: "2 Chaos Spawn"
    },

    /* ---------- Nuées ---------- */
    {
      id: "nurglings",
      name: "Nurglings",
      category: "swarms",
      base: "40mm",
      _faction: "Plague Legions",
      keywords: ["Swarm", "Chaos", "Nurgle", "Daemon", "Summoned", "Nurglings"],
      stats: { M: "5\"", T: 3, Sv: "7+", W: 4, Ld: "8+", OC: 0, InSv: "5+" },
      sizes: [
        { models: 3, costs: [{ from: 1, pts: 45 }] },
        { models: 6, costs: [{ from: 1, pts: 90 }] }
      ],
      coreAbilities: ["deep-strike", "infiltrators"],
      armyRules: ["pacte-de-decrepitude"],
      weapons: [
        { id: "diseased-claws-and-teeth", name: "Diseased claws and teeth", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "5+", S: "2", AP: "0", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["diseased-claws-and-teeth"],
      abilities: [
        { name: "Mischief Makers",
          text: "Chaque fois qu'une unité ennemie (sauf TITANIC) à portée d'engagement d'une ou plusieurs unités qui ont cette aptitude est choisie pour combattre, jusqu'à la fin de la phase, chaque fois qu'une figurine de cette unité ennemie fait une attaque de mêlée, soustrayez 1 au jet de touche." }
      ],
      composition: "3 à 6 Nurgling Swarms"
    },

    /* ---------- Transports ---------- */
    {
      id: "chaos-land-raider",
      name: "Chaos Land Raider",
      category: "transport",
      base: null,
      keywords: ["Vehicle", "Transport", "Frame", "Smoke", "Chaos", "Nurgle", "Land Raider"],
      stats: { M: "10\"", T: 12, Sv: "2+", W: 16, Ld: "6+", OC: 5 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 220 }, { from: 3, pts: 240 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "soulshatter-lascannon", name: "Soulshatter lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits", "sustained-hits:1", "twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "6", skill: "4+", S: "8", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["soulshatter-lascannon", "soulshatter-lascannon", "twin-heavy-bolter", "armoured-tracks"],
      options: [
        { id: "arme-sup", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      transport: {
        capacity: 14,
        allowed: [["Death Guard", "Infantry"]],
        double: ["Terminator"],
        text: "Capacité de transport de 14 figurines DEATH GUARD INFANTRY. Chaque figurine TERMINATOR compte pour 2 places."
      },
      abilities: [
        { name: "Assault Ramp",
          text: "Chaque fois qu'une unité débarque de ce véhicule après qu'il a fait un Mouvement Normal, elle fait un mouvement de débarquement d'assaut (Règles de Base, 18.06) pour ce débarquement." }
      ],
      damaged: { range: "1-5", text: "Tant que cette figurine a 1 à 5 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Land Raider"
    },

    /* ---------- Véhicules ----------
       cost sur une arme = surcoût en points par exemplaire pris */
    {
      id: "chaos-predator-annihilator",
      name: "Chaos Predator Annihilator",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Nurgle", "Predator Annihilator"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 130 }, { from: 3, pts: 140 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits", "sustained-hits:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-twin-lascannon", name: "Predator twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "14", AP: "-3", D: "D6+1", abilities: ["twin-linked"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-twin-lascannon", "armoured-tracks"],
      options: [
        { id: "sponsons", text: "Peut être équipé de 2 lascannons ou de 2 heavy bolters.",
          choices: [["lascannon", "lascannon"], ["heavy-bolter", "heavy-bolter"]], max: { count: 1 } },
        { id: "combi", text: "Peut être équipé de 1 combi-weapon ou de 1 combi-bolter.",
          choices: [["combi-weapon"], ["combi-bolter"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Metalophagic Infection",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie MONSTER ou VEHICLE touchée par une ou plusieurs de ces attaques et lancez 1D6, en ajoutant 1 au résultat si elle est Affligée : sur 5+, cette unité subit D3 blessures mortelles." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Annihilator"
    },
    {
      id: "chaos-predator-destructor",
      name: "Chaos Predator Destructor",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Smoke", "Chaos", "Nurgle", "Predator Destructor"],
      stats: { M: "10\"", T: 10, Sv: "3+", W: 11, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 140 }, { from: 3, pts: 150 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "combi-weapon", name: "Combi-weapon", type: "ranged",
          profiles: [{ range: "24\"", A: "1", skill: "4+", S: "5", AP: "-1", D: "1", abilities: ["anti:Infanterie 4+", "devastating-wounds", "rapid-fire:1"] }] },
        { id: "havoc-launcher", name: "Havoc launcher", type: "ranged",
          profiles: [{ range: "48\"", A: "D6", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["blast"] }] },
        { id: "heavy-bolter", name: "Heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits", "sustained-hits:1"] }] },
        { id: "lascannon", name: "Lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "predator-autocannon", name: "Predator autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "4", skill: "3+", S: "9", AP: "-1", D: "3", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["predator-autocannon", "armoured-tracks"],
      options: [
        { id: "sponsons", text: "Peut être équipé de 2 heavy bolters ou de 2 lascannons.",
          choices: [["heavy-bolter", "heavy-bolter"], ["lascannon", "lascannon"]], max: { count: 1 } },
        { id: "combi", text: "Peut être équipé de 1 combi-bolter ou de 1 combi-weapon.",
          choices: [["combi-bolter"], ["combi-weapon"]], max: { count: 1 } },
        { id: "havoc", text: "Peut être équipé de 1 havoc launcher.",
          choices: [["havoc-launcher"]], max: { count: 1 } }
      ],
      abilities: [
        { name: "Hail of Corrosive Disease",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie (sauf MONSTER et VEHICLE) touchée par une ou plusieurs de ces attaques. Jusqu'à la fin de la phase, chaque fois qu'une unité DEATH GUARD amie fait une attaque de tir qui cible cette unité, améliorez de 1 la Pénétration d'Armure de l'attaque. Une même unité ennemie ne peut être affectée par cette aptitude qu'une fois par phase." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Chaos Predator Destructor"
    },
    {
      id: "foetid-bloat-drone",
      name: "Foetid Bloat-drone",
      category: "vehicles",
      base: "60mm",
      keywords: ["Vehicle", "Fly", "Chaos", "Nurgle", "Daemon", "Foetid Bloat-drone"],
      stats: { M: "10\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 100 }, { from: 3, pts: 110 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "plaguespitter", name: "Plaguespitter", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "6", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "fleshmower", name: "Fleshmower", type: "melee",
          profiles: [{ range: "Mêlée", A: "10", skill: "3+", S: "7", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "plague-probe", name: "Plague probe", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["fleshmower", "plague-probe"],
      options: [
        { id: "spitters", text: "Le fleshmower peut être remplacé par 2 plaguespitters.",
          replaces: ["fleshmower"], choices: [["plaguespitter", "plaguespitter"]] }
      ],
      abilities: [
        { name: "Hovering Death",
          text: "Cette figurine est éligible pour tirer et déclarer une charge à un tour où elle a Battu en Retraite." }
      ],
      composition: "1 Foetid Bloat-drone"
    },
    {
      id: "foetid-bloat-drone-with-heavy-blight-launcher",
      name: "Foetid Bloat-drone with Heavy Blight Launcher",
      category: "vehicles",
      base: "60mm",
      keywords: ["Vehicle", "Fly", "Chaos", "Nurgle", "Daemon", "Foetid Bloat-drone with Heavy Blight Launcher"],
      stats: { M: "10\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 125 }, { from: 3, pts: 135 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "heavy-blight-launcher", name: "Heavy blight launcher", type: "ranged",
          profiles: [{ range: "36\"", A: "D6+2", skill: "3+", S: "10", AP: "-2", D: "3", abilities: ["blast", "lethal-hits"] }] },
        { id: "plague-probe", name: "Plague probe", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["heavy-blight-launcher", "plague-probe"],
      abilities: [
        { name: "Explosive Blight",
          text: "À votre phase de Tir, chaque fois que cette figurine fait une attaque qui détruit une unité ennemie, avant de retirer la dernière figurine de cette unité, lancez 1D6, en ajoutant 1 au résultat si cette unité est Affligée : sur 5+, chaque unité ennemie à 6\" ou moins de cette figurine est Affligée jusqu'au début de votre prochain tour." }
      ],
      composition: "1 Foetid Bloat-drone"
    },
    {
      id: "myphitic-blight-hauler",
      name: "Myphitic Blight-hauler",
      category: "vehicles",
      base: "80mm",
      keywords: ["Vehicle", "Smoke", "Chaos", "Nurgle", "Daemon", "Myphitic Blight-hauler"],
      stats: { M: "10\"", T: 9, Sv: "3+", W: 10, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [
        { models: 1, costs: [{ from: 1, pts: 95 }] },
        { models: 2, costs: [{ from: 1, pts: 190 }] }
      ],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "bile-spurt", name: "Bile spurt", type: "ranged",
          profiles: [{ range: "12\"", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["lethal-hits"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "3+", S: "4", AP: "0",  D: "1",  abilities: ["blast"] },
            { name: "krak", range: "48\"", A: "1",  skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }
          ] },
        { id: "multi-melta", name: "Multi-melta", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["lethal-hits", "melta:2"] }] },
        { id: "gnashing-maw", name: "Gnashing maw", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "6", AP: "-1", D: "1", abilities: ["lethal-hits"] }] }
      ],
      loadout: ["bile-spurt", "missile-launcher", "multi-melta", "gnashing-maw"],
      abilities: [
        { name: "Tank Hunters",
          text: "À votre phase de Tir, chaque fois qu'une figurine de cette unité fait une attaque qui cible une unité MONSTER ou VEHICLE, ajoutez 1 au jet de touche et 1 au jet de blessure." }
      ],
      composition: "1 à 2 Myphitic Blight-haulers"
    },
    {
      id: "plagueburst-crawler",
      name: "Plagueburst Crawler",
      category: "vehicles",
      base: null,
      keywords: ["Vehicle", "Frame", "Chaos", "Nurgle", "Daemon", "Plagueburst Crawler"],
      stats: { M: "10\"", T: 10, Sv: "2+", W: 12, Ld: "6+", OC: 3, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 170 }, { from: 3, pts: 200 }] }],
      coreAbilities: ["deadly-demise:D3"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "entropy-cannon", name: "Entropy cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "1", skill: "3+", S: "10", AP: "-3", D: "D6+1", abilities: ["lethal-hits"] }] },
        { id: "heavy-slugger", name: "Heavy slugger", type: "ranged",
          profiles: [{ range: "36\"", A: "4", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits"] }] },
        { id: "plagueburst-mortar", name: "Plagueburst mortar", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+3", skill: "3+", S: "8", AP: "-1", D: "2", abilities: ["blast", "indirect-fire", "lethal-hits"] }] },
        { id: "plaguespitter", name: "Plaguespitter", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "6", AP: "-1", D: "1", abilities: ["anti:Infanterie 2+", "ignores-cover", "torrent"] }] },
        { id: "rothail-volley-gun", name: "Rothail volley gun", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "0", D: "1", abilities: ["lethal-hits", "rapid-fire:3"] }] },
        { id: "armoured-tracks", name: "Armoured tracks", type: "melee",
          profiles: [{ range: "Mêlée", A: "3", skill: "4+", S: "6", AP: "0", D: "1", abilities: [] }] }
      ],
      loadout: ["entropy-cannon", "entropy-cannon", "heavy-slugger", "plagueburst-mortar", "armoured-tracks"],
      options: [
        { id: "spitters", text: "Les 2 entropy cannons peuvent être remplacés par 2 plaguespitters.",
          replaces: ["entropy-cannon", "entropy-cannon"], choices: [["plaguespitter", "plaguespitter"]] },
        { id: "rothail", text: "Le heavy slugger peut être remplacé par 1 rothail volley gun.",
          replaces: ["heavy-slugger"], choices: [["rothail-volley-gun"]] }
      ],
      abilities: [
        { name: "Spore-laced Shock Waves",
          text: "À votre phase de Tir, chaque fois que vous choisissez une cible pour le Plagueburst mortar de cette figurine, lancez 1D6 pour l'unité ciblée et pour chaque autre unité ennemie à 3\" ou moins d'elle, en ajoutant 1 si l'unité concernée est Affligée. Sur 6+, cette unité est frappée par les spores : une fois toutes les attaques de cette figurine contre l'unité ciblée résolues, chaque unité frappée par les spores subit D3 blessures mortelles." }
      ],
      damaged: { range: "1-4", text: "Tant que cette figurine a 1 à 4 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Plagueburst Crawler"
    },

    /* ---------- Marcheurs ---------- */
    {
      id: "defiler",
      name: "Defiler",
      category: "walkers",
      base: "160mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Nurgle", "Daemon", "Defiler"],
      stats: { M: "12\"", T: 11, Sv: "3+", W: 18, Ld: "6+", OC: 5, InSv: "5+" },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 300 }, { from: 2, pts: 350 }] }],
      coreAbilities: ["deadly-demise:D6"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "ectoplasma-destructor", name: "Ectoplasma destructor", type: "ranged",
          profiles: [{ range: "36\"", A: "D6", skill: "3+", S: "12", AP: "-3", D: "3", abilities: ["blast", "lethal-hits"] }] },
        { id: "excruciator-cannon", name: "Excruciator cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "6", skill: "3+", S: "6", AP: "-1", D: "2", abilities: ["lethal-hits"] }] },
        { id: "hades-battle-cannon", name: "Hades battle cannon", type: "ranged",
          profiles: [{ range: "48\"", A: "D6+3", skill: "3+", S: "10", AP: "-1", D: "3", abilities: ["blast", "lethal-hits"] }] },
        { id: "hades-lascannon", name: "Hades lascannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: ["lethal-hits"] }] },
        { id: "heavy-baleflamer", name: "Heavy baleflamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6+3", skill: "N/A", S: "7", AP: "-2", D: "2", abilities: ["ignores-cover", "torrent"] }] },
        { id: "heavy-missile-launcher", name: "Heavy missile launcher", type: "ranged",
          profiles: [
            { name: "krak", range: "48\"", A: "2",   skill: "3+", S: "10", AP: "-2", D: "D6+1", abilities: ["lethal-hits"] },
            { name: "frag", range: "48\"", A: "2D6", skill: "3+", S: "5",  AP: "-1", D: "1",    abilities: ["blast", "lethal-hits"] }
          ] },
        { id: "heavy-reaper-autocannon", name: "Heavy reaper autocannon", type: "ranged", cost: 15,
          profiles: [{ range: "48\"", A: "4", skill: "3+", S: "9", AP: "-1", D: "3", abilities: ["devastating-wounds", "lethal-hits", "sustained-hits:1"] }] },
        { id: "magma-cutters", name: "Magma cutters", type: "ranged",
          profiles: [{ range: "12\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["lethal-hits", "melta:2"] }] },
        { id: "electroscourge", name: "Electroscourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "12", AP: "-2", D: "2", abilities: ["extra-attacks", "sustained-hits:2"] }] },
        { id: "shearing-claws", name: "Shearing claws", type: "melee",
          profiles: [
            { name: "strike", range: "Mêlée", A: "5",  skill: "3+", S: "16", AP: "-3", D: "D6+1", abilities: ["lethal-hits"] },
            { name: "sweep",  range: "Mêlée", A: "10", skill: "3+", S: "6",  AP: "-2", D: "1",    abilities: ["lethal-hits"] }
          ] }
      ],
      loadout: ["hades-battle-cannon", "excruciator-cannon", "excruciator-cannon", "heavy-missile-launcher", "heavy-baleflamer", "shearing-claws"],
      maxPerModel: { "electroscourge": 1 },
      options: [
        { id: "ecto", text: "Le Hades battle cannon peut être remplacé par 1 ectoplasma destructor.",
          replaces: ["hades-battle-cannon"], choices: [["ectoplasma-destructor"]] },
        { id: "magma", text: "Les excruciator cannons peuvent être remplacés par 2 magma cutters.",
          replaces: ["excruciator-cannon", "excruciator-cannon"], choices: [["magma-cutters", "magma-cutters"]] },
        { id: "baleflamer", text: "Le heavy baleflamer peut être remplacé par 1 Hades lascannon, 1 heavy reaper autocannon ou 1 electroscourge (1 electroscourge au maximum par figurine).",
          replaces: ["heavy-baleflamer"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] },
        { id: "missile", text: "Le heavy missile launcher peut être remplacé par 1 Hades lascannon, 1 heavy reaper autocannon ou 1 electroscourge (1 electroscourge au maximum par figurine).",
          replaces: ["heavy-missile-launcher"], choices: [["hades-lascannon"], ["heavy-reaper-autocannon"], ["electroscourge"]] }
      ],
      abilities: [
        { name: "Scuttling Walker",
          text: "Chaque fois que cette unité fait un Mouvement Normal, une Avance ou une Retraite, elle peut traverser les figurines (sauf TITANIC) et les éléments de terrain. Elle peut alors passer à portée d'engagement de figurines ennemies, mais ne peut pas y finir son mouvement, et ses tests de Fuite Désespérée sont automatiquement réussis." },
        { name: "Barrage of Filth",
          text: "À votre phase de Tir, après que cette figurine a tiré, choisissez 1 unité ennemie touchée par une ou plusieurs de ces attaques. Jusqu'à la fin de la phase, cette unité ne peut pas avoir le Bénéfice du Couvert." }
      ],
      damaged: { range: "1-6", text: "Tant que cette figurine a 1 à 6 PV restants, chaque fois qu'elle attaque, soustrayez 1 au jet de touche." },
      composition: "1 Defiler"
    },
    {
      id: "helbrute",
      name: "Helbrute",
      category: "walkers",
      base: "60mm",
      keywords: ["Vehicle", "Walker", "Chaos", "Nurgle", "Helbrute"],
      stats: { M: "7\"", T: 9, Sv: "2+", W: 8, Ld: "6+", OC: 3 },
      sizes: [{ models: 1, costs: [{ from: 1, pts: 105 }] }],
      coreAbilities: ["deadly-demise:1"],
      armyRules: ["bienfait-de-nurgle"],
      weapons: [
        { id: "combi-bolter", name: "Combi-bolter", type: "ranged",
          profiles: [{ range: "24\"", A: "2", skill: "3+", S: "5", AP: "-1", D: "1", abilities: ["lethal-hits", "rapid-fire:2"] }] },
        { id: "heavy-flamer", name: "Heavy flamer", type: "ranged",
          profiles: [{ range: "12\"", A: "D6", skill: "N/A", S: "5", AP: "-1", D: "1", abilities: ["ignores-cover", "torrent"] }] },
        { id: "missile-launcher", name: "Missile launcher", type: "ranged",
          profiles: [
            { name: "frag", range: "48\"", A: "D6", skill: "3+", S: "4", AP: "0",  D: "1",  abilities: ["blast"] },
            { name: "krak", range: "48\"", A: "1",  skill: "3+", S: "9", AP: "-2", D: "D6", abilities: [] }
          ] },
        { id: "multi-melta", name: "Multi-melta", type: "ranged",
          profiles: [{ range: "18\"", A: "2", skill: "3+", S: "9", AP: "-4", D: "D6", abilities: ["lethal-hits", "melta:2"] }] },
        { id: "plasma-cannon", name: "Plasma cannon", type: "ranged",
          profiles: [{ range: "36\"", A: "D3", skill: "3+", S: "8", AP: "-3", D: "3", abilities: ["blast", "hazardous", "lethal-hits"] }] },
        { id: "twin-autocannon", name: "Twin autocannon", type: "ranged",
          profiles: [{ range: "48\"", A: "2", skill: "3+", S: "10", AP: "-1", D: "3", abilities: ["lethal-hits", "twin-linked"] }] },
        { id: "twin-heavy-bolter", name: "Twin heavy bolter", type: "ranged",
          profiles: [{ range: "36\"", A: "3", skill: "3+", S: "5", AP: "-1", D: "2", abilities: ["lethal-hits", "sustained-hits:1", "twin-linked"] }] },
        { id: "twin-lascannon", name: "Twin lascannon", type: "ranged",
          profiles: [{ range: "48\"", A: "1", skill: "3+", S: "12", AP: "-3", D: "D6+1", abilities: ["twin-linked"] }] },
        { id: "close-combat-weapon", name: "Close combat weapon", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "6", AP: "0", D: "1", abilities: [] }] },
        { id: "helbrute-fist", name: "Helbrute fist", type: "melee",
          profiles: [{ range: "Mêlée", A: "5", skill: "3+", S: "12", AP: "-2", D: "3", abilities: [] }] },
        { id: "helbrute-hammer", name: "Helbrute hammer", type: "melee",
          profiles: [{ range: "Mêlée", A: "4", skill: "3+", S: "14", AP: "-3", D: "D6+1", abilities: [] }] },
        { id: "power-scourge", name: "Power scourge", type: "melee",
          profiles: [{ range: "Mêlée", A: "8", skill: "3+", S: "7", AP: "-1", D: "2", abilities: [] }] }
      ],
      loadout: ["multi-melta", "helbrute-fist", "close-combat-weapon"],
      options: [
        { id: "melta", text: "Le multi-melta peut être remplacé par 1 plasma cannon, 1 twin autocannon, 1 twin lascannon, 1 twin heavy bolter ou 1 Helbrute fist supplémentaire.",
          replaces: ["multi-melta"], choices: [["plasma-cannon"], ["twin-autocannon"], ["twin-lascannon"], ["twin-heavy-bolter"], ["helbrute-fist"]] },
        { id: "fist-missile", text: "1 des Helbrute fists peut être remplacé par 1 missile launcher.",
          replaces: ["helbrute-fist"], choices: [["missile-launcher"]], max: { count: 1 } },
        { id: "fist-melee", text: "1 des Helbrute fists peut être remplacé par 1 Helbrute hammer ou 1 power scourge.",
          replaces: ["helbrute-fist"], choices: [["helbrute-hammer"], ["power-scourge"]], max: { count: 1 } },
        { id: "fist-gun", requiresWeapon: "helbrute-fist", text: "Pour chaque Helbrute fist, peut être équipé de 1 combi-bolter ou de 1 heavy flamer (ce Helbrute fist ne peut alors plus être remplacé).",
          choices: [["combi-bolter"], ["heavy-flamer"]], max: { count: 2 } }
      ],
      abilities: [
        { name: "Diseased Malice",
          text: "Chaque fois que cette figurine fait une attaque qui cible une unité Affligée, ajoutez 1 au jet de blessure." },
        { name: "Froth-spattered Frenzy",
          text: "Si cette figurine est équipée de deux armes de mêlée en plus de sa close combat weapon, ajoutez 2 à la caractéristique d'Attaques de ces deux armes." }
      ],
      composition: "1 Helbrute"
    }
  ]
});

})();
