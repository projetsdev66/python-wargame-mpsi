import type { PlannedPhase } from "@/domain/types";

export const PHASES: PlannedPhase[] = [
  {
    id: "fondamentaux",
    title: "Les fondamentaux",
    description: "Écrire, lire et organiser ses premiers programmes Python.",
    status: "available",
  },
  {
    id: "algorithmique",
    title: "Algorithmique",
    description: "Parcours, recherches, tris, récursivité et structures de données.",
    status: "planned",
    sourceNote:
      "La complexité, les piles et les files ne sont pas développées dans le PDF fourni.",
  },
  {
    id: "calcul-scientifique",
    title: "Calcul scientifique",
    description: "NumPy, Matplotlib et calcul numérique.",
    status: "planned",
    sourceNote:
      "Le PDF couvre NumPy et Matplotlib ; intégration numérique, Newton et Euler nécessitent un support MPSI complémentaire.",
  },
  {
    id: "ds-tp",
    title: "Défis MPSI",
    description: "Problèmes guidés en plusieurs questions, proches des TP et des DS.",
    status: "planned",
    sourceNote:
      "Les sujets doivent être validés à partir de vos supports MPSI avant leur rédaction.",
  },
];
