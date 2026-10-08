import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  BookMarked,
  CircleHelp,
  Code2,
  Download,
  RotateCcw,
  Upload,
} from "lucide-react";
import type {
  LearningLevel,
  PlannedPhase,
  ProgressSnapshot,
  RunResult,
  RuntimeState,
  ValidationResult,
} from "@/domain/types";
import { CodeWorkspace } from "@/components/CodeWorkspace";
import { LevelNavigation, type LevelStatus } from "@/components/LevelNavigation";
import { TheoryPanel } from "@/components/TheoryPanel";

/** Props required to render and operate the Python Wargame learning shell. */
export interface WargameShellProps {
  /** The course levels available to the learner, normally the real LEVELS dataset. */
  levels: LearningLevel[];
  /** Course phases, normally the real PHASES dataset. */
  phases: PlannedPhase[];
  /** Persisted progress snapshot used to derive completion and unlocking. */
  progress: ProgressSnapshot;
  /** Currently selected level id; null shows the course overview. */
  activeLevelId: string | null;
  /** Current editor content for the selected level. */
  currentCode: string;
  /** Result of the last code execution, supplied by the parent runtime. */
  runResult: RunResult | null;
  /** Result of the last test validation, supplied by the parent runtime. */
  validationResult: ValidationResult | null;
  /** Runtime lifecycle state supplied by the parent. */
  runtimeState: RuntimeState;
  /** Error detail when the browser cannot start the runtime. */
  runtimeMessage: string;
  /** Standard input passed to input(), one value per line. */
  stdinText: string;
  /** A short import, export, or storage status message. */
  feedback: { tone: "success" | "error"; message: string } | null;
  /** Number of hints already revealed for the selected level. */
  revealedHints: number;
  onSelectLevel: (id: string) => void;
  onCodeChange: (code: string) => void;
  onStdinChange: (value: string) => void;
  onRun: () => void;
  onValidate: () => void;
  onRevealHint: () => void;
  onResetCode: () => void;
  onResetProgress: () => void;
  onExportProgress: () => void;
  onImportProgress: (file: File) => void;
  onDismissFeedback: () => void;
}

function levelStatuses(levels: LearningLevel[], progress: ProgressSnapshot): Record<string, LevelStatus> {
  const ordered = [...levels].sort((a, b) => a.order - b.order);
  const completed = new Set(progress.completedLevelIds);
  const firstUncompleted = ordered.findIndex((level) => !completed.has(level.id));
  return Object.fromEntries(
    ordered.map((level, index) => [
      level.id,
      firstUncompleted === -1 || index < firstUncompleted
        ? "complete"
        : index === firstUncompleted
          ? "available"
          : "locked",
    ]),
  );
}

function CourseOverview({
  levels,
  phases,
  statuses,
  onSelectLevel,
}: {
  levels: LearningLevel[];
  phases: PlannedPhase[];
  statuses: Record<string, LevelStatus>;
  onSelectLevel: (id: string) => void;
}) {
  const nextLevel = [...levels].sort((a, b) => a.order - b.order).find((level) => statuses[level.id] === "available");
  return (
    <section className="wg-empty" data-testid="panel-course-overview">
      <span className="wg-eyebrow"><BookMarked size={14} /> Votre atelier Python MPSI</span>
      <h2>Un programme à la fois.</h2>
      <p>
        Des notions du cours, mises en pratique dans de courts défis. Avancez à votre rythme :
        chaque étape s’ouvre lorsque la précédente est validée.
      </p>
      {nextLevel ? (
        <button
          className="wg-button wg-button-primary"
          type="button"
          onClick={() => onSelectLevel(nextLevel.id)}
          data-testid="button-start-learning"
        >
          {statuses[nextLevel.id] === "available" && nextLevel.order === 1 ? "Commencer le parcours" : "Reprendre le parcours"}
          <ArrowRight size={15} />
        </button>
      ) : levels.length > 0 ? (
        <p className="wg-pass" data-testid="status-course-complete">Tous les niveaux disponibles sont terminés.</p>
      ) : (
        <p data-testid="empty-levels">Aucun niveau n’est disponible pour le moment.</p>
      )}
      <div className="wg-overview-phases" aria-label="Contenu du parcours">
        {phases.map((phase, index) => {
          const count = levels.filter((level) => level.phaseId === phase.id).length;
          return (
            <div className="wg-overview-phase" key={phase.id} data-testid={`overview-phase-${phase.id}`}>
              <span className="wg-overview-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{phase.title}</strong>
                <span>{phase.status === "available" ? `${count} niveaux` : "À venir"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WargameShell({
  levels,
  phases,
  progress,
  activeLevelId,
  currentCode,
  runResult,
  validationResult,
  runtimeState,
  runtimeMessage,
  stdinText,
  feedback,
  revealedHints,
  onSelectLevel,
  onCodeChange,
  onStdinChange,
  onRun,
  onValidate,
  onRevealHint,
  onResetCode,
  onResetProgress,
  onExportProgress,
  onImportProgress,
  onDismissFeedback,
}: WargameShellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const sortedLevels = useMemo(() => [...levels].sort((a, b) => a.order - b.order), [levels]);
  const statuses = useMemo(() => levelStatuses(sortedLevels, progress), [sortedLevels, progress]);
  const selected = sortedLevels.find((level) => level.id === activeLevelId) ?? null;
  const completedCount = Object.values(statuses).filter((status) => status === "complete").length;
  const percent = sortedLevels.length ? Math.round((completedCount / sortedLevels.length) * 100) : 0;
  const visibleSelected = selected && statuses[selected.id] !== "locked" ? selected : null;
  const hintCount = visibleSelected?.hints.length ?? 0;
  const hintsToShow = Math.max(0, Math.min(revealedHints, hintCount));

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (
      file &&
      window.confirm(
        "Importer cette sauvegarde remplacera votre progression et le code actuellement enregistré sur cet appareil. Continuer ?",
      )
    ) {
      onImportProgress(file);
    }
    event.currentTarget.value = "";
  }

  return (
    <div className="wg-shell">
      <header className="wg-topbar">
        <div className="wg-brand" aria-label="Python Wargame MPSI">
          <span className="wg-brand-mark" aria-hidden="true">Py</span>
          <span className="wg-brand-name">Python Wargame</span>
          <span className="wg-brand-sub">MPSI · carnet de pratique</span>
        </div>
        <div className="wg-top-actions">
          <input
            ref={fileInputRef}
            className="wg-file-input"
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            aria-label="Importer une sauvegarde de progression"
            data-testid="input-import-progress"
          />
          <button className="wg-button wg-button-quiet" type="button" onClick={onExportProgress} data-testid="button-export-progress">
            <Download size={15} /> Exporter
          </button>
          <button className="wg-button wg-button-quiet" type="button" onClick={() => fileInputRef.current?.click()} data-testid="button-import-progress">
            <Upload size={15} /> Importer
          </button>
          {confirmReset ? (
            <>
              <button className="wg-button" type="button" onClick={() => setConfirmReset(false)} data-testid="button-cancel-reset-progress">Garder</button>
              <button
                className="wg-button"
                type="button"
                onClick={() => { onResetProgress(); setConfirmReset(false); }}
                data-testid="button-confirm-reset-progress"
              >
                Confirmer
              </button>
            </>
          ) : (
            <button className="wg-button wg-button-quiet" type="button" onClick={() => setConfirmReset(true)} data-testid="button-reset-progress" aria-label="Réinitialiser la progression">
              <RotateCcw size={15} /> <span className="wg-reset-label">Réinitialiser</span>
            </button>
          )}
        </div>
      </header>

      <main className="wg-main">
        {confirmReset && (
          <div className="wg-confirm-banner" role="alert" data-testid="message-confirm-reset">
            <span>Réinitialiser toute la progression et le code sauvegardé ?</span>
            <span>Cette action ne peut pas être annulée.</span>
          </div>
        )}
        {feedback && (
          <div
            className={`wg-feedback wg-feedback-${feedback.tone}`}
            role={feedback.tone === "error" ? "alert" : "status"}
            data-testid="message-feedback"
          >
            <span>{feedback.message}</span>
            <button type="button" onClick={onDismissFeedback} aria-label="Fermer le message" data-testid="button-dismiss-feedback">Fermer</button>
          </div>
        )}
        <div className="wg-intro">
          <div>
            <p className="wg-eyebrow"><Code2 size={14} /> Apprendre en écrivant</p>
            <h1 className="wg-heading">Le cours, côté pratique.</h1>
            <p className="wg-intro-copy">Un parcours personnel pour transformer les notions Python du programme MPSI en réflexes de code.</p>
          </div>
          <section className="wg-progress" aria-label="Progression du parcours" data-testid="progress-course">
            <div className="wg-progress-line">
              <span className="wg-progress-count">{completedCount} <span className="wg-progress-total">/ {sortedLevels.length}</span></span>
              <span className="wg-progress-caption">niveaux terminés</span>
            </div>
            <div className="wg-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Progression du parcours">
              <div className="wg-progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </section>
        </div>

        {levels.length === 0 ? (
          <section className="wg-empty" role="status" data-testid="empty-course">
            <CircleHelp size={26} color="hsl(var(--muted-foreground))" />
            <h2>Le parcours se prépare.</h2>
            <p>Aucun niveau n’a encore été fourni. Revenez bientôt pour commencer.</p>
          </section>
        ) : (
          <div className="wg-layout">
            <LevelNavigation
              levels={sortedLevels}
              phases={phases}
              activeLevelId={visibleSelected?.id ?? null}
              statuses={statuses}
              onSelectLevel={onSelectLevel}
            />
            <div className="wg-workspace">
              {visibleSelected ? (
                <>
                  <section className="wg-lesson-head" aria-labelledby="active-level-heading" data-testid={`lesson-${visibleSelected.id}`}>
                    <div className="wg-lesson-top">
                      <div>
                        <div className="wg-lesson-number">Niveau {String(visibleSelected.order).padStart(2, "0")} · {visibleSelected.phaseTitle}</div>
                        <h2 className="wg-lesson-title" id="active-level-heading">{visibleSelected.title}</h2>
                        <p className="wg-lesson-objective">{visibleSelected.objective}</p>
                      </div>
                      {statuses[visibleSelected.id] === "complete" && <span className="wg-pill" data-testid={`status-level-${visibleSelected.id}`}>Terminé</span>}
                    </div>
                    <div className="wg-lesson-facts">
                      <span className="wg-pill">{visibleSelected.topic}</span>
                      {visibleSelected.requiredPackages?.map((name) => <span key={name} className="wg-pill">Bibliothèque : {name}</span>)}
                    </div>
                  </section>
                  <div className="wg-content-grid">
                    <TheoryPanel level={visibleSelected} />
                    <CodeWorkspace
                      levelId={visibleSelected.id}
                      code={currentCode}
                      runResult={runResult}
                      validationResult={validationResult}
                      runtimeState={runtimeState}
                      runtimeMessage={runtimeMessage}
                      stdinText={stdinText}
                      visibleTests={visibleSelected.visibleTests}
                      onCodeChange={onCodeChange}
                      onStdinChange={onStdinChange}
                      onRun={onRun}
                      onValidate={onValidate}
                      onResetCode={onResetCode}
                    />
                  </div>
                  <section className="wg-hints" aria-labelledby="hints-heading" data-testid={`panel-hints-${visibleSelected.id}`}>
                    <div className="wg-hints-head">
                      <div>
                        <h2 className="wg-hints-title" id="hints-heading"><CircleHelp size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />Un indice, si besoin</h2>
                        <p className="wg-hints-copy">À votre rythme — consultez-les seulement si vous bloquez.</p>
                      </div>
                      {hintsToShow < hintCount && (
                        <button type="button" className="wg-button" onClick={onRevealHint} data-testid={`button-reveal-hint-${visibleSelected.id}`}>
                          Révéler un indice <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                    {hintsToShow > 0 && (
                      <ol className="wg-hint-list" data-testid={`list-hints-${visibleSelected.id}`}>
                        {visibleSelected.hints.slice(0, hintsToShow).map((hint, index) => (
                          <li className="wg-hint" key={`${visibleSelected.id}-hint-${index}`} data-testid={`text-hint-${visibleSelected.id}-${index + 1}`}>
                            <strong>Indice {index + 1}.</strong> {hint}
                          </li>
                        ))}
                      </ol>
                    )}
                    {hintCount === 0 && <p className="wg-hints-copy" data-testid="empty-hints">Aucun indice supplémentaire pour ce défi.</p>}
                    {statuses[visibleSelected.id] === "complete" || validationResult?.passed ? (
                      <details className="wg-solution" data-testid={`details-solution-${visibleSelected.id}`}>
                        <summary data-testid={`summary-solution-${visibleSelected.id}`}>Afficher la correction commentée</summary>
                        {visibleSelected.solution ? (
                          <pre className="wg-code-sample" data-testid={`text-solution-${visibleSelected.id}`}>{visibleSelected.solution}</pre>
                        ) : (
                          <p className="wg-hints-copy">La correction n’est pas encore disponible.</p>
                        )}
                      </details>
                    ) : (
                      <p className="wg-solution-locked" data-testid={`message-solution-locked-${visibleSelected.id}`}>
                        La correction commentée se débloque après la réussite du défi.
                      </p>
                    )}
                  </section>
                </>
              ) : (
                <CourseOverview
                  levels={sortedLevels}
                  phases={phases}
                  statuses={statuses}
                  onSelectLevel={onSelectLevel}
                />
              )}
              <p className="wg-footer-note" data-testid="text-course-source">
                Adaptation de notions du <cite>Cours de Python</cite> de Patrick Fuchs et Pierre Poulain,
                Université Paris Cité, sous licence{" "}
                <a href="https://creativecommons.org/licenses/by-sa/3.0/fr/" target="_blank" rel="noreferrer">
                  CC BY-SA 3.0 France
                </a>
                . Les niveaux s’ouvrent au fil de votre progression.
              </p>
            </div>
          </div>
        )}
        <div className="wg-sr-only" aria-live="polite" data-testid="status-progress-live">
          {completedCount} niveau{completedCount !== 1 ? "x" : ""} terminé{completedCount !== 1 ? "s" : ""} sur {sortedLevels.length}.
        </div>
      </main>
    </div>
  );
}
