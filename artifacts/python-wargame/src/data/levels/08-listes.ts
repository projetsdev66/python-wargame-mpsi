import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "listes",
  order: 8,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Premières listes",
  topic: "Indices, longueur et tranches",
  difficulty: 2,
  minutes: 9,
  objective: "Lire les éléments d’une liste par leur position.",
  theory: [
    {
      kind: "paragraph",
      text: "Une liste rassemble plusieurs valeurs entre crochets. Son premier indice est 0 ; l’indice -1 désigne son dernier élément. len(liste) donne sa longueur.",
    },
    {
      kind: "code",
      text: 'couleurs = ["bleu", "vert", "rouge"]\npremiere = couleurs[0]\nderniere = couleurs[-1]',
    },
    {
      kind: "tip",
      text: "Une tranche liste[debut:fin] inclut debut mais exclut fin.",
    },
  ],
  exercise:
    "Écris premier_et_dernier(valeurs), qui renvoie un tuple formé du premier et du dernier élément de la liste. La liste contient toujours au moins un élément.",
  starterCode:
    "def premier_et_dernier(valeurs):\n    # Renvoie les deux extrémités sous forme de tuple\n    pass\n",
  visibleTests: [
    {
      kind: "function",
      label: "Liste de quatre éléments",
      name: "premier_et_dernier",
      args: [[8, 3, 4, 9]],
      expected: [8, 9],
    },
    {
      kind: "function",
      label: "Liste d’un élément",
      name: "premier_et_dernier",
      args: [["seul"]],
      expected: ["seul", "seul"],
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Autres valeurs",
      name: "premier_et_dernier",
      args: [[-2, 0, 7]],
      expected: [-2, 7],
    },
  ],
  hints: [
    "Tu peux accéder au premier élément avec l’indice 0.",
    "L’indice -1 désigne le dernier élément.",
    "Renvoie (valeurs[0], valeurs[-1]).",
  ],
  solution:
    "def premier_et_dernier(valeurs):\n    # L'indice -1 désigne le dernier élément\n    return (valeurs[0], valeurs[-1])",
};

export default level;
