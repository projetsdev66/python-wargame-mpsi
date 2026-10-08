import type { LearningLevel } from "@/domain/types";

const level: LearningLevel = {
  id: "variables-et-types",
  order: 2,
  phaseId: "fondamentaux",
  phaseTitle: "Les fondamentaux",
  title: "Variables et types",
  topic: "Affectation, chaînes et nombres",
  difficulty: 1,
  minutes: 7,
  objective: "Créer des variables et leur donner une valeur du bon type.",
  theory: [
    {
      kind: "paragraph",
      text: "Une variable associe un nom à une valeur. L’affectation s’écrit avec = ; elle ne signifie pas que les deux côtés sont égaux en mathématiques.",
    },
    { kind: "code", text: 'nom = "Ada"\nage = 18\nactif = True' },
    {
      kind: "paragraph",
      text: "Les types rencontrés ici sont str pour une chaîne de caractères, int pour un entier, float pour un nombre décimal et bool pour une valeur vraie ou fausse.",
    },
  ],
  exercise:
    "Crée les variables nom, age et moyenne avec les valeurs demandées dans les tests. Respecte leurs types.",
  starterCode: "# Déclare nom, age et moyenne\n",
  visibleTests: [
    { kind: "variable", label: "nom vaut Ada", name: "nom", expected: "Ada" },
    { kind: "variable", label: "age vaut 18", name: "age", expected: 18 },
  ],
  hiddenTests: [
    {
      kind: "variable",
      label: "moyenne est un nombre décimal",
      name: "moyenne",
      expected: 15.5,
    },
  ],
  hints: [
    "Une chaîne de caractères se note entre guillemets.",
    "Un entier s’écrit sans guillemets ; un nombre décimal utilise un point.",
    'Écris nom = "Ada", age = 18 et moyenne = 15.5.',
  ],
  solution: '# Chaque nom reçoit une valeur du type demandé\nnom = "Ada"\nage = 18\nmoyenne = 15.5',
};

export default level;
