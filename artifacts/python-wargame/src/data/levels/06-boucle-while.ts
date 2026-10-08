import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "boucle-while",
  order: 6,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Répéter avec while",
  topic: "Boucle conditionnelle",
  difficulty: 2,
  minutes: 10,
  objective: "Répéter jusqu’à ce qu’une condition ne soit plus vraie.",
  theory: [
    {
      kind: "paragraph",
      text: "Une boucle while répète son bloc tant que sa condition reste vraie. Une variable de contrôle doit évoluer, sinon la condition peut rester vraie sans fin.",
    },
    {
      kind: "code",
      text: "compteur = 0\nwhile compteur < 3:\n    compteur = compteur + 1",
    },
    {
      kind: "tip",
      text: "Le moteur arrête automatiquement un programme qui dépasse le délai maximal d’exécution.",
    },
  ],
  exercise:
    "Écris nombre_de_chiffres(n), qui renvoie le nombre de chiffres décimaux de l’entier n. Le signe moins ne compte pas et 0 possède un chiffre.",
  starterCode:
    "def nombre_de_chiffres(n):\n    # Traite d'abord le signe et le cas n == 0\n    # Puis compte les chiffres avec while\n    pass\n",
  visibleTests: [
    {
      kind: "function",
      label: "Entier positif",
      name: "nombre_de_chiffres",
      args: [284],
      expected: 3,
    },
    {
      kind: "function",
      label: "Zéro",
      name: "nombre_de_chiffres",
      args: [0],
      expected: 1,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Entier négatif",
      name: "nombre_de_chiffres",
      args: [-12050],
      expected: 5,
    },
  ],
  hints: [
    "Le signe peut être retiré avec abs(n).",
    "Diviser un entier positif par 10 avec // retire son dernier chiffre.",
    "Répète n = n // 10 tant que n > 0 en incrémentant un compteur.",
  ],
  solution:
    "def nombre_de_chiffres(n):\n    # Le signe ne compte pas comme un chiffre\n    n = abs(n)\n    if n == 0:\n        return 1\n    compteur = 0\n    while n > 0:\n        n = n // 10\n        compteur = compteur + 1\n    return compteur",
};

export default level;
