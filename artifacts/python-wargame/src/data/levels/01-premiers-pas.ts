import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "premiers-pas",
  order: 1,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Premiers pas",
  topic: "Instructions et affichage",
  difficulty: 1,
  minutes: 5,
  objective: "Faire exécuter une instruction et afficher un message.",
  theory: [
    {
      kind: "paragraph",
      text: "Python exécute les instructions d’un script dans l’ordre. La fonction print() affiche une valeur dans la sortie du programme.",
    },
    {
      kind: "code",
      text: 'print("Bonjour !")',
    },
    {
      kind: "tip",
      text: "Le texte affiché doit être placé entre guillemets. Un commentaire commence par # et n’est pas exécuté.",
    },
  ],
  exercise:
    "Écris une instruction qui affiche exactement le texte « Bonjour Python ! ».",
  starterCode: "# Affiche le message demandé\n",
  visibleTests: [
    {
      kind: "stdout",
      label: "Le message s’affiche",
      expected: "Bonjour Python !\n",
    },
  ],
  hiddenTests: [
    {
      kind: "stdout",
      label: "Sortie exacte",
      expected: "Bonjour Python !\n",
    },
  ],
  hints: [
    "Il faut une seule instruction d’affichage.",
    "La fonction à utiliser s’appelle print.",
    'Écris print("Bonjour Python !")',
  ],
  solution: '# Affiche une chaîne de caractères\nprint("Bonjour Python !")',
};

export default level;
