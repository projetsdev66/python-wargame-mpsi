import { useEffect, useRef, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WargameShell } from "@/components/WargameShell";
import { LEVELS } from "@/data/levels";
import { PHASES } from "@/data/phases";
import {
  createEmptyProgress,
  importProgressFile,
  isLevelAccessible,
  loadProgress,
  saveProgress,
} from "@/lib/progress";
import { PythonRunner } from "@/lib/python-runner";
import type {
  ProgressSnapshot,
  RunResult,
  RuntimeState,
  ValidationResult,
} from "@/domain/types";
import NotFound from "@/pages/not-found";
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Feedback = { tone: "success" | "error"; message: string } | null;

function readActiveLevelId(location: string) {
  const match = location.match(/^\/niveau\/([^/?#]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function CourseApp() {
  const [location, setLocation] = useLocation();
  const [progress, setProgress] = useState<ProgressSnapshot>(() => loadProgress(LEVELS));
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>("loading");
  const [runtimeMessage, setRuntimeMessage] = useState("");
  const [stdinText, setStdinText] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const runnerRef = useRef<PythonRunner | null>(null);

  const activeLevelId = readActiveLevelId(location);
  const activeLevel = LEVELS.find((level) => level.id === activeLevelId) ?? null;
  const currentCode = activeLevel
    ? progress.codeByLevel[activeLevel.id] ?? activeLevel.starterCode
    : "";
  const revealedHints = activeLevel
    ? progress.hintsRevealed[activeLevel.id] ?? 0
    : 0;

  useEffect(() => {
    const runner = new PythonRunner((state, message) => {
      setRuntimeState(state);
      setRuntimeMessage(message ?? "");
      if (state === "error" && message) {
        setFeedback({ tone: "error", message: `Python n’a pas pu démarrer : ${message}` });
      }
    });
    runnerRef.current = runner;
    return () => {
      runner.dispose();
      runnerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!saveProgress(progress)) {
      setFeedback({
        tone: "error",
        message: "La progression ne peut pas être conservée dans le stockage local de ce navigateur.",
      });
    }
  }, [progress]);

  useEffect(() => {
    if (activeLevelId && (!activeLevel || !isLevelAccessible(LEVELS, activeLevelId, progress.completedLevelIds))) {
      setLocation("/");
    }
  }, [activeLevelId, activeLevel, progress.completedLevelIds, setLocation]);

  function handleSelectLevel(id: string) {
    if (!isLevelAccessible(LEVELS, id, progress.completedLevelIds)) {
      setFeedback({ tone: "error", message: "Terminez le niveau précédent pour déverrouiller celui-ci." });
      return;
    }
    setProgress((current) => ({ ...current, lastLevelId: id }));
    setRunResult(null);
    setValidationResult(null);
    setStdinText("");
    setFeedback(null);
    setLocation(`/niveau/${encodeURIComponent(id)}`);
  }

  function handleCodeChange(code: string) {
    if (!activeLevel) return;
    setProgress((current) => ({
      ...current,
      codeByLevel: { ...current.codeByLevel, [activeLevel.id]: code },
    }));
    setRunResult(null);
    setValidationResult(null);
  }

  async function handleRun() {
    if (!activeLevel) return;
    const runner = runnerRef.current;
    if (!runner) {
      setFeedback({ tone: "error", message: "Le moteur Python est en cours de préparation." });
      return;
    }
    setRunResult(null);
    setValidationResult(null);
    const inputs = stdinText.length > 0 ? stdinText.split(/\r?\n/) : [];
    const result = await runner.run(currentCode, inputs, activeLevel.requiredPackages);
    setRunResult(result);
  }

  async function handleValidate() {
    if (!activeLevel) return;
    const runner = runnerRef.current;
    if (!runner) {
      setFeedback({ tone: "error", message: "Le moteur Python est en cours de préparation." });
      return;
    }
    setRunResult(null);
    setValidationResult(null);
    const result = await runner.validate(activeLevel, currentCode);
    setValidationResult(result);
    if (result.passed) {
      setProgress((current) => ({
        ...current,
        completedLevelIds: current.completedLevelIds.includes(activeLevel.id)
          ? current.completedLevelIds
          : [...current.completedLevelIds, activeLevel.id],
        lastLevelId: activeLevel.id,
      }));
      setFeedback({ tone: "success", message: `Niveau ${activeLevel.order} réussi. Le suivant est maintenant accessible.` });
    } else if (result.error) {
      setFeedback({ tone: "error", message: `Vérification interrompue : ${result.error}` });
    } else {
      setFeedback(null);
    }
  }

  function handleRevealHint() {
    if (!activeLevel) return;
    setProgress((current) => ({
      ...current,
      hintsRevealed: {
        ...current.hintsRevealed,
        [activeLevel.id]: Math.min(
          activeLevel.hints.length,
          (current.hintsRevealed[activeLevel.id] ?? 0) + 1,
        ),
      },
    }));
  }

  function handleResetCode() {
    if (!activeLevel) return;
    setProgress((current) => ({
      ...current,
      codeByLevel: { ...current.codeByLevel, [activeLevel.id]: activeLevel.starterCode },
    }));
    setRunResult(null);
    setValidationResult(null);
    setFeedback({ tone: "success", message: "Le code de départ a été restauré." });
  }

  function handleResetProgress() {
    setProgress(createEmptyProgress(LEVELS[0]?.id ?? ""));
    setRunResult(null);
    setValidationResult(null);
    setStdinText("");
    setFeedback({ tone: "success", message: "La progression et les brouillons ont été réinitialisés." });
    setLocation("/");
  }

  function handleExportProgress() {
    const snapshot = { ...progress, updatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "python-wargame-mpsi-progression.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback({ tone: "success", message: "La sauvegarde de progression a été téléchargée." });
  }

  async function handleImportProgress(file: File) {
    const result = await importProgressFile(file, LEVELS);
    if (!result.ok) {
      setFeedback({ tone: "error", message: result.error });
      return;
    }
    setProgress(result.progress);
    setRunResult(null);
    setValidationResult(null);
    setStdinText("");
    setLocation("/");
    setFeedback({ tone: "success", message: "La sauvegarde de progression a été importée." });
  }

  return (
    <WargameShell
      levels={LEVELS}
      phases={PHASES}
      progress={progress}
      activeLevelId={activeLevel && isLevelAccessible(LEVELS, activeLevel.id, progress.completedLevelIds) ? activeLevel.id : null}
      currentCode={currentCode}
      runResult={runResult}
      validationResult={validationResult}
      runtimeState={runtimeState}
      runtimeMessage={runtimeMessage}
      stdinText={stdinText}
      feedback={feedback}
      revealedHints={revealedHints}
      onSelectLevel={handleSelectLevel}
      onCodeChange={handleCodeChange}
      onStdinChange={setStdinText}
      onRun={handleRun}
      onValidate={handleValidate}
      onRevealHint={handleRevealHint}
      onResetCode={handleResetCode}
      onResetProgress={handleResetProgress}
      onExportProgress={handleExportProgress}
      onImportProgress={(file) => void handleImportProgress(file)}
      onDismissFeedback={() => setFeedback(null)}
    />
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
          <Route path="/" component={CourseApp} />
          <Route path="/niveau/:id" component={CourseApp} />
          <Route component={NotFound} />
        </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
