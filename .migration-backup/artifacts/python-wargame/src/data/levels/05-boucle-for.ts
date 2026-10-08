import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "boucle-for",
  order: 5,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Répéter avec for",
  topic: "Boucles et range",
  difficulty: 1,
  minutes: 9,
  objective: "Répéter une opération un nombre connu de fois.",
  theory: [
    {
      kind: "paragraph",
      text: "Une boucle for parcourt les éléments d’un itérable. range(n) fournit les entiers de 0 à n exclu ; range(debut, fin) s’arrête également avant fin.",
    },
    {
      kind: "code",
      text: "total = 0\nfor i in range(1, 4):\n    total = total + i",
    },
    {
      kind: "tip",
      text: "Le corps de la boucle est indenté. Vérifie soigneusement la borne de fin de range().",
    },
  ],
  exercise:
    "Écris somme_jusqua(n), qui renvoie la somme des entiers de 1 à n inclus. Pour n = 0, la somme vaut 0.",
  starterCode:
    "def somme_jusqua(n):\n    total = 0\n    # Parcours les entiers de 1 à n inclus\n    return total\n",
  visibleTests: [
    {
      kind: "function",
      label: "Somme de 1 à 5",
      name: "somme_jusqua",
      args: [5],
      expected: 15,
    },
    {
      kind: "function",
      label: "Borne nulle",
      name: "somme_jusqua",
      args: [0],
      expected: 0,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Somme de 1 à 20",
      name: "somme_jusqua",
      args: [20],
      expected: 210,
    },
  ],
  hints: [
    "Il faut parcourir plusieurs valeurs de i et mettre à jour total.",
    "Pour inclure n, la borne de fin de range doit être n + 1.",
    "Parcours range(1, n + 1) et ajoute i à total à chaque tour.",
  ],
  solution:
    "def somme_jusqua(n):\n    total = 0\n    # La borne de fin est exclusive : on utilise n + 1\n    for i in range(1, n + 1):\n        total = total + i\n    return total",
};

export default level;
