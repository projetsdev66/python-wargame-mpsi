import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "dictionnaires",
  order: 11,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Compter avec un dictionnaire",
  topic: "Clés et valeurs",
  difficulty: 3,
  minutes: 12,
  objective: "Associer une clé à une valeur et mettre à jour un compteur.",
  theory: [
    {
      kind: "paragraph",
      text: "Un dictionnaire associe des clés à des valeurs. On lit ou modifie une valeur en utilisant sa clé entre crochets.",
    },
    {
      kind: "code",
      text: 'frequences = {}\nfrequences["python"] = 1\nfrequences["python"] = frequences["python"] + 1',
    },
    {
      kind: "tip",
      text: "Avant d’incrémenter un compteur, vérifie si la clé existe avec if cle in dictionnaire.",
    },
  ],
  exercise:
    "Écris frequences(mots), qui renvoie un dictionnaire donnant le nombre d’occurrences de chaque chaîne de la liste. Une liste vide renvoie un dictionnaire vide.",
  starterCode:
    "def frequences(mots):\n    resultat = {}\n    # Compte chaque mot\n    return resultat\n",
  visibleTests: [
    {
      kind: "function",
      label: "Deux mots différents",
      name: "frequences",
      args: [["python", "mpsi", "python"]],
      expected: { python: 2, mpsi: 1 },
    },
    {
      kind: "function",
      label: "Mots répétés",
      name: "frequences",
      args: [["a", "a", "a"]],
      expected: { a: 3 },
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Liste vide",
      name: "frequences",
      args: [[]],
      expected: {},
    },
  ],
  hints: [
    "Parcours la liste mot par mot.",
    "Si le mot est déjà une clé, ajoute 1 à sa valeur ; sinon, initialise cette valeur à 1.",
    'Utilise if mot in resultat, puis resultat[mot] = resultat[mot] + 1.',
  ],
  solution:
    "def frequences(mots):\n    resultat = {}\n    # Chaque clé mémorise le nombre de mots déjà rencontrés\n    for mot in mots:\n        if mot in resultat:\n            resultat[mot] = resultat[mot] + 1\n        else:\n            resultat[mot] = 1\n    return resultat",
};

export default level;
