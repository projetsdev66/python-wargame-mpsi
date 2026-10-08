import { Check, Lock, Circle } from "lucide-react";
import type { LearningLevel, PlannedPhase } from "@/domain/types";

export type LevelStatus = "complete" | "available" | "locked";

interface LevelNavigationProps {
  levels: LearningLevel[];
  phases: PlannedPhase[];
  activeLevelId: string | null;
  statuses: Record<string, LevelStatus>;
  onSelectLevel: (id: string) => void;
}

export function LevelNavigation({
  levels,
  phases,
  activeLevelId,
  statuses,
  onSelectLevel,
}: LevelNavigationProps) {
  return (
    <nav className="wg-rail" aria-label="Navigation des niveaux" data-testid="navigation-levels">
      <div className="wg-rail-head">
        <p className="wg-section-label">Parcours Python</p>
      </div>
      <div className="wg-phase-list">
        {phases.map((phase) => {
          const phaseLevels = levels
            .filter((level) => level.phaseId === phase.id)
            .sort((a, b) => a.order - b.order);
          return (
            <section key={phase.id} aria-label={phase.title} data-testid={`phase-${phase.id}`}>
              <h2 className="wg-phase-title">{phase.title}</h2>
              {phaseLevels.map((level) => {
                const status = statuses[level.id];
                const locked = status === "locked";
                const current = activeLevelId === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    className="wg-level-link"
                    aria-current={current ? "step" : undefined}
                    aria-label={`${level.title}, ${status === "complete" ? "terminé" : locked ? "verrouillé" : "à faire"}`}
                    disabled={locked}
                    onClick={() => onSelectLevel(level.id)}
                    data-testid={`button-level-${level.id}`}
                  >
                    <span className="wg-level-index">{String(level.order).padStart(2, "0")}</span>
                    <span className="wg-level-meta">
                      <span className="wg-level-name">{level.title}</span>
                      <span className="wg-level-topic">{level.topic}</span>
                    </span>
                    <span className="wg-status-mark" aria-hidden="true">
                      {status === "complete" ? <Check size={15} /> : locked ? <Lock size={13} /> : <Circle size={12} />}
                    </span>
                  </button>
                );
              })}
              {phase.status === "planned" && (
                <div className="wg-planned" data-testid={`status-phase-${phase.id}`}>
                  <strong>À venir</strong>
                  <span>{phase.description}</span>
                  {phase.sourceNote && <span style={{ marginTop: 6 }}>{phase.sourceNote}</span>}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </nav>
  );
}
