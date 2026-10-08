import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "chaines",
  order: 10,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Travailler sur les chaînes",
  topic: "Parcours et méthodes de str",
  difficulty: 2,
  minutes: 10,
  objective: "Parcourir les caractères d’un texte et compter ceux qui vérifient une condition.",
  theory: [
    {
      kind: "paragraph",
      text: "Une chaîne de caractères se parcourt comme une séquence. La méthode lower() renvoie une version en minuscules sans modifier la chaîne d’origine.",
    },
    {
      kind: "code",
      text: 'mot = "Python"\nfor caractere in mot.lower():\n    print(caractere)',
    },
    {
      kind: "tip",
      text: "L’opérateur in teste l’appartenance : caractere in voyelles renvoie True ou False.",
    },
  ],
  exercise:
    "Écris compter_voyelles(texte), qui compte les lettres a, e, i, o et u sans distinguer majuscules et minuscules. Les voyelles accentuées ne sont pas comptées.",
  starterCode:
    "def compter_voyelles(texte):\n    compteur = 0\n    # Parcours le texte en minuscules\n    return compteur\n",
  visibleTests: [
    {
      kind: "function",
      label: "Mot Python",
      name: "compter_voyelles",
      args: ["Python"],
      expected: 1,
    },
    {
      kind: "function",
      label: "Majuscules",
      name: "compter_voyelles",
      args: ["EDUCATION"],
      expected: 5,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Aucune voyelle",
      name: "compter_voyelles",
      args: ["xyz"],
      expected: 0,
    },
  ],
  hints: [
    "Mets le texte en minuscules avec lower().",
    "La chaîne 'aeiou' contient les cinq voyelles prises en compte.",
    "Incrémente compteur si le caractère courant appartient à 'aeiou'.",
  ],
  solution:
    'def compter_voyelles(texte):\n    voyelles = "aeiou"\n    compteur = 0\n    # lower() rend le test indépendant de la casse\n    for caractere in texte.lower():\n        if caractere in voyelles:\n            compteur = compteur + 1\n    return compteur',
};

export default level;
