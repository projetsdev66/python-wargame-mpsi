import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "fonctions",
  order: 7,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Écrire une fonction",
  topic: "Paramètres et résultat",
  difficulty: 2,
  minutes: 10,
  objective: "Définir une fonction réutilisable qui renvoie un résultat.",
  theory: [
    {
      kind: "paragraph",
      text: "Une fonction est définie avec def, un nom et des paramètres entre parenthèses. return renvoie le résultat à l’endroit de l’appel ; print() ne fait qu’afficher un résultat.",
    },
    {
      kind: "code",
      text: "def carre(x):\n    return x * x\n\nvaleur = carre(4)",
    },
    {
      kind: "tip",
      text: "Les paramètres sont les noms utilisés dans la définition ; les arguments sont les valeurs fournies lors de l’appel.",
    },
  ],
  exercise:
    "Écris aire_rectangle(longueur, largeur), qui renvoie l’aire du rectangle. La fonction ne doit rien afficher.",
  starterCode:
    "def aire_rectangle(longueur, largeur):\n    # Renvoie l'aire\n    pass\n",
  visibleTests: [
    {
      kind: "function",
      label: "Rectangle 4 × 3",
      name: "aire_rectangle",
      args: [4, 3],
      expected: 12,
    },
    {
      kind: "function",
      label: "Un côté nul",
      name: "aire_rectangle",
      args: [0, 5],
      expected: 0,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Côtés décimaux",
      name: "aire_rectangle",
      args: [2.5, 1.2],
      expected: 3,
      tolerance: 1e-9,
    },
  ],
  hints: [
    "La formule de l’aire est le produit des deux côtés.",
    "Le résultat doit être renvoyé, pas affiché.",
    "Dans le corps, écris return longueur * largeur.",
  ],
  solution:
    "def aire_rectangle(longueur, largeur):\n    # return transmet le résultat à l'appelant\n    return longueur * largeur",
};

export default level;
