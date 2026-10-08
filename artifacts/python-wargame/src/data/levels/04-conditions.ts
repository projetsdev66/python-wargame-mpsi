import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "conditions",
  order: 4,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Faire un choix",
  topic: "Comparaisons et conditions",
  difficulty: 1,
  minutes: 8,
  objective: "Choisir un résultat selon une condition.",
  theory: [
    {
      kind: "paragraph",
      text: "Une comparaison produit une valeur booléenne. Les opérateurs courants sont ==, !=, <, <=, > et >=. Attention : = affecte une valeur, == compare deux valeurs.",
    },
    {
      kind: "code",
      text: 'if temperature < 0:\n    etat = "gel"\nelse:\n    etat = "liquide"',
    },
    {
      kind: "tip",
      text: "Chaque branche se termine par : et son bloc est décalé par indentation. elif ajoute un cas intermédiaire.",
    },
  ],
  exercise:
    'Écris la fonction classer_nombre(n) qui renvoie "positif", "nul" ou "négatif" selon le signe de n.',
  starterCode:
    'def classer_nombre(n):\n    # Complète les conditions\n    pass\n',
  visibleTests: [
    {
      kind: "function",
      label: "Nombre positif",
      name: "classer_nombre",
      args: [4],
      expected: "positif",
    },
    {
      kind: "function",
      label: "Zéro",
      name: "classer_nombre",
      args: [0],
      expected: "nul",
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Nombre négatif",
      name: "classer_nombre",
      args: [-3],
      expected: "négatif",
    },
  ],
  hints: [
    "Teste d’abord si n est strictement positif.",
    "Ajoute un cas pour zéro et un cas final pour les valeurs négatives.",
    'Utilise if n > 0, elif n == 0, puis else, avec les chaînes demandées.',
  ],
  solution:
    'def classer_nombre(n):\n    # Les cas sont exclusifs : un seul résultat est renvoyé\n    if n > 0:\n        return "positif"\n    elif n == 0:\n        return "nul"\n    else:\n        return "négatif"',
};

export default level;
