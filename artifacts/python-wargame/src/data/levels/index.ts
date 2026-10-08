import level01 from "./01-premiers-pas";
import level02 from "./02-variables-et-types";
import level03 from "./03-lire-et-convertir";
import level04 from "./04-conditions";
import level05 from "./05-boucle-for";
import level06 from "./06-boucle-while";
import level07 from "./07-fonctions";
import level08 from "./08-listes";
import level09 from "./09-parcours-listes";
import level10 from "./10-chaines";
import level11 from "./11-dictionnaires";
import level12 from "./12-tuples";
import level13 from "./13-defi-synthese";
import advancedLevels from "./14-a-20-algorithmique";
import type { LearningLevel } from "@/domain/types";

export const LEVELS: LearningLevel[] = [
  level01,
  level02,
  level03,
  level04,
  level05,
  level06,
  level07,
  level08,
  level09,
  level10,
  level11,
  level12,
  level13,
  ...advancedLevels,
];

export { type LearningLevel } from "@/domain/types";
