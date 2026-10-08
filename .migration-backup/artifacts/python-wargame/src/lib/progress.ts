import type { LearningLevel, ProgressSnapshot } from "@/domain/types";

export const PROGRESS_STORAGE_KEY = "python-wargame-mpsi.progress.v1";
export const MAX_CODE_LENGTH = 24_000;
const MAX_IMPORT_BYTES = 2_000_000;

export type ImportResult =
  | { ok: true; progress: ProgressSnapshot }
  | { ok: false; error: string };

export function createEmptyProgress(firstLevelId: string): ProgressSnapshot {
  return {
    version: 1,
    completedLevelIds: [],
    codeByLevel: {},
    hintsRevealed: {},
    lastLevelId: firstLevelId,
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeProgress(
  candidate: unknown,
  knownLevelIds: Set<string>,
): ImportResult {
  if (!candidate || typeof candidate !== "object") {
    return { ok: false, error: "Le fichier ne contient pas une sauvegarde valide." };
  }
  const input = candidate as Record<string, unknown>;
  if (input.version !== 1) {
    return { ok: false, error: "Cette version de sauvegarde n’est pas prise en charge." };
  }

  const completedLevelIds = Array.isArray(input.completedLevelIds)
    ? input.completedLevelIds.filter(
        (id): id is string => typeof id === "string" && knownLevelIds.has(id),
      )
    : [];
  const codeByLevel: Record<string, string> = {};
  if (input.codeByLevel && typeof input.codeByLevel === "object") {
    for (const [id, value] of Object.entries(input.codeByLevel)) {
      if (
        knownLevelIds.has(id) &&
        typeof value === "string" &&
        value.length <= MAX_CODE_LENGTH
      ) {
        codeByLevel[id] = value;
      }
    }
  }
  const hintsRevealed: Record<string, number> = {};
  if (input.hintsRevealed && typeof input.hintsRevealed === "object") {
    for (const [id, value] of Object.entries(input.hintsRevealed)) {
      if (knownLevelIds.has(id) && typeof value === "number" && Number.isFinite(value)) {
        hintsRevealed[id] = Math.max(0, Math.min(20, Math.floor(value)));
      }
    }
  }
  const requestedLastLevel =
    typeof input.lastLevelId === "string" && knownLevelIds.has(input.lastLevelId)
      ? input.lastLevelId
      : "";
  const lastLevelId = requestedLastLevel || [...knownLevelIds][0] || "";
  const updatedAt =
    typeof input.updatedAt === "string" && !Number.isNaN(Date.parse(input.updatedAt))
      ? input.updatedAt
      : new Date().toISOString();

  return {
    ok: true,
    progress: {
      version: 1,
      completedLevelIds: [...new Set(completedLevelIds)],
      codeByLevel,
      hintsRevealed,
      lastLevelId,
      updatedAt,
    },
  };
}

export function loadProgress(levels: LearningLevel[]): ProgressSnapshot {
  const empty = createEmptyProgress(levels[0]?.id ?? "");
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = sanitizeProgress(
      JSON.parse(raw) as unknown,
      new Set(levels.map((level) => level.id)),
    );
    return parsed.ok ? parsed.progress : empty;
  } catch {
    return empty;
  }
}

export function saveProgress(progress: ProgressSnapshot): boolean {
  try {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function importProgressFile(
  file: File,
  levels: LearningLevel[],
): Promise<ImportResult> {
  if (file.size > MAX_IMPORT_BYTES) {
    return { ok: false, error: "Le fichier dépasse la taille maximale de 2 Mo." };
  }
  try {
    const parsed: unknown = JSON.parse(await file.text());
    return sanitizeProgress(
      parsed,
      new Set(levels.map((level) => level.id)),
    );
  } catch {
    return { ok: false, error: "Impossible de lire ce fichier JSON." };
  }
}

export function getUnlockedLevelOrder(
  levels: LearningLevel[],
  completedLevelIds: string[],
): number {
  const completed = new Set(completedLevelIds);
  const next = levels.findIndex((level) => !completed.has(level.id));
  return next === -1 ? levels.length - 1 : next;
}

export function isLevelAccessible(
  levels: LearningLevel[],
  targetId: string,
  completedLevelIds: string[],
): boolean {
  const targetIndex = levels.findIndex((level) => level.id === targetId);
  if (targetIndex < 0) return false;
  return targetIndex <= getUnlockedLevelOrder(levels, completedLevelIds);
}
