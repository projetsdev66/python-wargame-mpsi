export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type TheoryBlock =
  | { kind: "paragraph" | "tip"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "code"; text: string };

export type LevelTest =
  | {
      kind: "stdout";
      label: string;
      inputs?: string[];
      expected: string;
    }
  | {
      kind: "variable";
      label: string;
      name: string;
      expected: JsonValue;
    }
  | {
      kind: "function";
      label: string;
      name: string;
      args: JsonValue[];
      expected: JsonValue;
      tolerance?: number;
    };

export interface LearningLevel {
  id: string;
  order: number;
  phaseId: string;
  phaseTitle: string;
  title: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  minutes: number;
  objective: string;
  theory: TheoryBlock[];
  exercise: string;
  starterCode: string;
  visibleTests: LevelTest[];
  hiddenTests: LevelTest[];
  hints: string[];
  solution: string;
  requiredPackages?: ("numpy" | "matplotlib")[];
}

export interface ProgressSnapshot {
  version: 1;
  completedLevelIds: string[];
  codeByLevel: Record<string, string>;
  hintsRevealed: Record<string, number>;
  lastLevelId: string;
  updatedAt: string;
}

export interface RunResult {
  status: "success" | "error" | "timeout";
  output: string;
  error?: string;
  durationMs: number;
}

export interface CaseResult {
  label: string;
  passed: boolean;
  expected?: JsonValue;
  actual?: JsonValue;
  message?: string;
}

export interface ValidationResult {
  passed: boolean;
  visible: CaseResult[];
  hiddenPassed: number;
  hiddenTotal: number;
  error?: string;
  durationMs: number;
}

export type RuntimeState = "idle" | "loading" | "ready" | "running" | "error";

export interface PlannedPhase {
  id: string;
  title: string;
  description: string;
  status: "available" | "planned";
  sourceNote?: string;
}
