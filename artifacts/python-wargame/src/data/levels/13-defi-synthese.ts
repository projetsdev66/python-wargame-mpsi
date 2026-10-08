import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "defi-synthese",
  order: 13,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Défi de synthèse",
  topic: "Listes, fonctions et dictionnaires",
  difficulty: 3,
  minutes: 15,
  objective: "Combiner plusieurs notions dans une fonction courte.",
  theory: [
    {
      kind: "paragraph",
      text: "Un programme se construit en décomposant le problème : parcourir les données, accumuler les valeurs utiles, puis renvoyer un résultat clairement structuré.",
    },
    {
      kind: "code",
      text: "total = 0\nfor valeur in valeurs:\n    total = total + valeur\nmoyenne = total / len(valeurs)",
    },
    {
      kind: "tip",
      text: "Teste séparément les cas habituels et les cas limites, par exemple une liste d’un seul élément.",
    },
  ],
  exercise:
    "Écris bilan_notes(notes), pour une liste non vide. Renvoie un dictionnaire contenant le nombre de notes, leur moyenne et la note maximale, avec les clés « nombre », « moyenne » et « maximum ».",
  starterCode:
    "def bilan_notes(notes):\n    total = 0\n    maximum = notes[0]\n    # Parcours les notes\n    # Construis puis renvoie le dictionnaire\n    pass\n",
  visibleTests: [
    {
      kind: "function",
      label: "Bilan de trois notes",
      name: "bilan_notes",
      args: [[10, 14, 18]],
      expected: { nombre: 3, moyenne: 14, maximum: 18 },
      tolerance: 1e-9,
    },
  ],
  hiddenTests: [
    {
      kind: "function",
      label: "Une seule note",
      name: "bilan_notes",
      args: [[7.5]],
      expected: { nombre: 1, moyenne: 7.5, maximum: 7.5 },
      tolerance: 1e-9,
    },
    {
      kind: "function",
      label: "Notes négatives",
      name: "bilan_notes",
      args: [[-4, -1]],
      expected: { nombre: 2, moyenne: -2.5, maximum: -1 },
      tolerance: 1e-9,
    },
  ],
  hints: [
    "Le parcours peut mettre à jour total et maximum en même temps.",
    "La moyenne est total divisé par le nombre d’éléments.",
    'Renvoie {"nombre": len(notes), "moyenne": total / len(notes), "maximum": maximum}.',
  ],
  solution:
    'def bilan_notes(notes):\n    total = 0\n    maximum = notes[0]\n    # Un seul parcours suffit pour la somme et le maximum\n    for note in notes:\n        total = total + note\n        if note > maximum:\n            maximum = note\n    return {\n        "nombre": len(notes),\n        "moyenne": total / len(notes),\n        "maximum": maximum,\n    }',
};

export default level;
