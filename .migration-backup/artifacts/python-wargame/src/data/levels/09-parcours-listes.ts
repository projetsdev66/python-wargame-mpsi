import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "parcours-listes",
  order: 9,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Parcourir et accumuler",
  topic: "Boucle for et accumulateur",
  difficulty: 2,
  minutes: 11,
  objective: "Calculer une valeur en parcourant une liste.",
  theory: [
    {
      kind: "paragraph",
      text: "On peut parcourir directement les valeurs d’une liste avec for. Un accumulateur garde un résultat partiel, mis à jour à chaque tour.",
    },
    {
      kind: "code",
      text: "total = 0\nfor valeur in valeurs:\n    total = total + valeur",
    },
    {
      kind: "tip",
      text: "Choisis une valeur initiale adaptée à l’opération : 0 pour une somme, 1 pour un produit.",
    },
  ],
  exercise:
    "Écris moyenne(valeurs), qui calcule la moyenne d’une liste non vide. Utilise une boucle et un accumulateur plutôt que sum().",
  starterCode:
    "def moyenne(valeurs):\n    total = 0\n    # Parcours les valeurs, puis renvoie la moyenne\n    pass\n",
  visibleTests: [
    {
      kind: "function",
      label: "Moyenne de trois valeurs",
      name: "moyenne",
      args: [[2, 5, 8]],
      expected: 5,
      tolerance: 1e-9,
    },
    {
      kind: "function",
      label: "Valeurs négatives",
      name: "moyenne",
      args: [[-2, 0, 2]],
      expected: 0,
      tolerance: 1e-9,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Liste d’un seul élément",
      name: "moyenne",
      args: [[7.5]],
      expected: 7.5,
      tolerance: 1e-9,
    },
  ],
  hints: [
    "Commence par total = 0.",
    "Ajoute chaque valeur à total, puis divise par len(valeurs).",
    "Renvoie total / len(valeurs) après la boucle.",
  ],
  solution:
    "def moyenne(valeurs):\n    total = 0\n    # Accumule les valeurs une à une\n    for valeur in valeurs:\n        total = total + valeur\n    return total / len(valeurs)",
};

export default level;
