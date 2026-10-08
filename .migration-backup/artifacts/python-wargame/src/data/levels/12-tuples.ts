import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "tuples",
  order: 12,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Renvoyer plusieurs valeurs",
  topic: "Tuples et parcours",
  difficulty: 3,
  minutes: 11,
  objective: "Construire et renvoyer un tuple contenant plusieurs résultats.",
  theory: [
    {
      kind: "paragraph",
      text: "Un tuple est une séquence ordonnée, souvent utilisée pour regrouper plusieurs résultats. On l’écrit généralement entre parenthèses.",
    },
    {
      kind: "code",
      text: "resultat = (3, 9)\nminimum, maximum = resultat",
    },
    {
      kind: "tip",
      text: "Une fonction peut renvoyer un tuple pour transmettre plusieurs valeurs à son appelant.",
    },
  ],
  exercise:
    "Écris extremes(valeurs), qui parcourt une liste non vide et renvoie un tuple (minimum, maximum). N’utilise pas min() ni max().",
  starterCode:
    "def extremes(valeurs):\n    minimum = valeurs[0]\n    maximum = valeurs[0]\n    # Compare les autres valeurs\n    return (minimum, maximum)\n",
  visibleTests: [
    {
      kind: "function",
      label: "Entiers",
      name: "extremes",
      args: [[7, 2, 9, 3]],
      expected: [2, 9],
    },
    {
      kind: "function",
      label: "Valeurs négatives",
      name: "extremes",
      args: [[-5, -2, -8]],
      expected: [-8, -2],
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Liste d’un élément",
      name: "extremes",
      args: [[4]],
      expected: [4, 4],
    },
  ],
  hints: [
    "Initialise le minimum et le maximum avec le premier élément.",
    "Parcours ensuite la liste et compare chaque valeur aux deux bornes.",
    "À la fin, renvoie (minimum, maximum).",
  ],
  solution:
    "def extremes(valeurs):\n    # Initialise les deux bornes avec une valeur réelle de la liste\n    minimum = valeurs[0]\n    maximum = valeurs[0]\n    for valeur in valeurs:\n        if valeur < minimum:\n            minimum = valeur\n        if valeur > maximum:\n            maximum = valeur\n    return (minimum, maximum)",
};

export default level;
