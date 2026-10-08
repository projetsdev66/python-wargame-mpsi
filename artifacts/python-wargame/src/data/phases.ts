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
    status: "available",
    sourceNote:
      "Les chaînes, ensembles, compréhensions, tris et récursivité s’appuient sur le PDF ; la complexité et la recherche dichotomique sont des compléments MPSI.",
  },
  {
    id: "calcul-scientifique",
    title: "Calcul scientifique",
    description: "NumPy, Matplotlib et calcul numérique.",
    status: "available",
    sourceNote:
      "Le PDF couvre NumPy et Matplotlib ; l’approximation d’intégrale par rectangles est ajoutée comme complément MPSI.",
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
