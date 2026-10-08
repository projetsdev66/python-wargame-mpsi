import type {
  LearningLevel,
  LevelTest,
  RunResult,
  RuntimeState,
  ValidationResult,
} from "@/domain/types";

type RequestKind = "run" | "validate";

type WorkerMessage =
  | {
      kind: "status";
      status: "loading" | "ready" | "error";
      message?: string;
    }
  | {
      kind: "result";
      requestId: string;
      result: RunResult | ValidationResult;
    };

interface PendingRequest {
  resolve: (value: RunResult | ValidationResult) => void;
  timer: ReturnType<typeof setTimeout>;
  kind: RequestKind;
}

const RUN_TIMEOUT_MS = 4_000;
const VALIDATE_TIMEOUT_MS = 8_000;
const SCIENTIFIC_TIMEOUT_MS = 35_000;

export class PythonRunner {
  private worker: Worker | null = null;
  private state: RuntimeState = "idle";
  private errorMessage = "";
  private pending = new Map<string, PendingRequest>();
  private inFlight = false;
  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private onStateChange: (state: RuntimeState, message?: string) => void;

  constructor(onStateChange: (state: RuntimeState, message?: string) => void) {
    this.onStateChange = onStateChange;
    this.startWorker();
  }

  private setState(state: RuntimeState, message?: string) {
    this.state = state;
    this.errorMessage = message ?? "";
    this.onStateChange(state, message);
  }

  private currentState() {
    return this.state as RuntimeState;
  }

  private startWorker() {
    this.readyPromise = new Promise<void>((resolve) => {
      this.resolveReady = resolve;
    });
    this.setState("loading");
    this.worker = new Worker(new URL("../workers/python.worker.ts", import.meta.url), {
      type: "module",
      name: "python-wargame-runtime",
    });
    this.worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.kind === "status") {
        if (message.status === "ready") {
          this.resolveReady?.();
          this.resolveReady = null;
          this.setState("ready");
        } else if (message.status === "error") {
          this.resolveReady?.();
          this.resolveReady = null;
          this.setState("error", message.message ?? "Le moteur Python n’a pas pu démarrer.");
          this.rejectAll(message.message ?? "Le moteur Python n’a pas pu démarrer.");
        }
        return;
      }
      const pending = this.pending.get(message.requestId);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(message.requestId);
      this.setState("ready");
      pending.resolve(message.result);
    });
    this.worker.addEventListener("error", (event: ErrorEvent) => {
      const message = event.message || "Le moteur Python a rencontré une erreur.";
      this.resolveReady?.();
      this.resolveReady = null;
      this.setState("error", message);
      this.rejectAll(message);
    });
  }

  private rejectAll(message: string) {
    for (const [requestId, request] of this.pending) {
      clearTimeout(request.timer);
      const durationMs = 0;
      request.resolve(
        request.kind === "run"
          ? { status: "error", output: "", error: message, durationMs }
          : {
              passed: false,
              visible: [],
              hiddenPassed: 0,
              hiddenTotal: 0,
              error: message,
              durationMs,
            },
      );
      this.pending.delete(requestId);
    }
  }

  async run(
    code: string,
    inputs: string[] = [],
    requiredPackages: LearningLevel["requiredPackages"] = [],
  ): Promise<RunResult> {
    const result = await this.execute({
      kind: "run",
      code,
      inputs,
      requiredPackages: requiredPackages ?? [],
    });
    return result as RunResult;
  }

  async validate(
    level: LearningLevel,
    code: string,
  ): Promise<ValidationResult> {
    const result = await this.execute({
      kind: "validate",
      code,
      visibleTests: level.visibleTests,
      hiddenTests: level.hiddenTests,
      requiredPackages: level.requiredPackages ?? [],
    });
    return result as ValidationResult;
  }

  private async execute(request: {
    kind: RequestKind;
    code: string;
    inputs?: string[];
    visibleTests?: LevelTest[];
    hiddenTests?: LevelTest[];
    requiredPackages: NonNullable<LearningLevel["requiredPackages"]>;
  }): Promise<RunResult | ValidationResult> {
    if (this.inFlight) {
      return this.failureResult(request.kind, "Une exécution est déjà en cours.");
    }
    if (!this.worker || !this.readyPromise) {
      return this.failureResult(request.kind, "Le moteur Python est indisponible.");
    }
    if (this.state === "error") {
      return this.failureResult(request.kind, this.errorMessage || "Le moteur Python est indisponible.");
    }

    this.inFlight = true;
    try {
      await this.readyPromise;
      if (!this.worker || this.currentState() === "error") {
        return this.failureResult(request.kind, "Le moteur Python est indisponible.");
      }

      const requestId = crypto.randomUUID();
      const isScientific = request.requiredPackages.some((packageName) =>
        ["numpy", "matplotlib"].includes(packageName),
      );
      const timeoutMs = isScientific
        ? SCIENTIFIC_TIMEOUT_MS
        : request.kind === "run"
          ? RUN_TIMEOUT_MS
          : VALIDATE_TIMEOUT_MS;
      this.setState("running");

      return await new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.pending.delete(requestId);
          this.worker?.terminate();
          this.worker = null;
          const durationMs = timeoutMs;
          resolve(
            request.kind === "run"
              ? {
                  status: "timeout",
                  output: "",
                  error: `Le programme a dépassé la limite de ${timeoutMs / 1000} secondes.`,
                  durationMs,
                }
              : {
                  passed: false,
                  visible: [],
                  hiddenPassed: 0,
                  hiddenTotal: request.hiddenTests?.length ?? 0,
                  error: `Le programme a dépassé la limite de ${timeoutMs / 1000} secondes.`,
                  durationMs,
                },
          );
          this.startWorker();
        }, timeoutMs);

        this.pending.set(requestId, { resolve, timer, kind: request.kind });
        this.worker?.postMessage({ ...request, requestId });
      });
    } finally {
      this.inFlight = false;
    }
  }

  private failureResult(
    kind: RequestKind,
    error: string,
  ): RunResult | ValidationResult {
    return kind === "run"
      ? { status: "error", output: "", error, durationMs: 0 }
      : {
          passed: false,
          visible: [],
          hiddenPassed: 0,
          hiddenTotal: 0,
          error,
          durationMs: 0,
        };
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    for (const request of this.pending.values()) clearTimeout(request.timer);
    this.pending.clear();
  }
}
