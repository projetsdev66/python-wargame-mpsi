import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "lire-et-convertir",
  order: 3,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Lire et convertir",
  topic: "Entrées, conversions et f-strings",
  difficulty: 1,
  minutes: 8,
  objective: "Lire une réponse au clavier, la convertir et produire une sortie formatée.",
  theory: [
    {
      kind: "paragraph",
      text: "input() renvoie toujours une chaîne de caractères. Pour effectuer un calcul, il faut convertir la réponse avec int() ou float().",
    },
    {
      kind: "code",
      text: 'age = int(input("Ton âge ? "))\nprint(f"Dans un an : {age + 1}")',
    },
    {
      kind: "tip",
      text: "Dans une f-string, les expressions placées entre accolades sont évaluées avant l’affichage.",
    },
  ],
  exercise:
    "Lis deux nombres décimaux avec input(), puis affiche leur somme sous la forme « Somme : 7.5 ». Les tests fournissent les deux réponses dans l’ordre.",
  starterCode:
    '# Lis deux nombres avec input(), puis affiche "Somme : " suivi de leur somme\n',
  visibleTests: [
    {
      kind: "stdout",
      label: "Addition de deux décimaux",
      inputs: ["2.5", "5"],
      expected: "Somme : 7.5\n",
    },
  ],
  hiddenTests: [
    {
      kind: "stdout",
      label: "Addition avec un nombre négatif",
      inputs: ["-1.25", "3"],
      expected: "Somme : 1.75\n",
    },
  ],
  hints: [
    "Convertis chaque réponse avec float().",
    "Stocke les deux réponses dans des variables, puis additionne-les.",
    'Utilise print(f"Somme : {premier + second}") après les deux conversions.',
  ],
  solution:
    '# input() fournit du texte : float() permet de calculer\npremier = float(input())\nsecond = float(input())\nprint(f"Somme : {premier + second}")',
};

export default level;
