import { useMemo, useRef, type KeyboardEvent } from "react";
import { Check, CircleAlert, Play, RotateCcw, Terminal } from "lucide-react";
import type { JsonValue, LevelTest, RunResult, RuntimeState, ValidationResult } from "@/domain/types";

interface CodeWorkspaceProps {
  levelId: string;
  code: string;
  runResult: RunResult | null;
  validationResult: ValidationResult | null;
  runtimeState: RuntimeState;
  runtimeMessage: string;
  stdinText: string;
  visibleTests: LevelTest[];
  onCodeChange: (code: string) => void;
  onStdinChange: (value: string) => void;
  onRun: () => void;
  onValidate: () => void;
  onResetCode: () => void;
}

const runtimeCopy: Record<RuntimeState, string> = {
  idle: "Prêt à exécuter votre code.",
  loading: "Préparation de l’environnement Python…",
  ready: "Environnement Python prêt.",
  running: "Exécution en cours…",
  error: "L’environnement Python a rencontré un problème.",
};

const PYTHON_TOKEN_PATTERN =
  /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|True|None)\b|\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b(?:print|range|len|int|float|str|bool|list|dict|tuple|set|sum|min|max|abs|enumerate|zip|sorted|input|type)\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/gm;

function tokenClass(token: string) {
  if (token.startsWith("#")) return "wg-token-comment";
  if (token.startsWith('"') || token.startsWith("'")) return "wg-token-string";
  if (/^(?:False|True|None)$/.test(token)) return "wg-token-literal";
  if (/^(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/.test(token)) {
    return "wg-token-keyword";
  }
  if (/^(?:print|range|len|int|float|str|bool|list|dict|tuple|set|sum|min|max|abs|enumerate|zip|sorted|input|type)$/.test(token)) {
    return "wg-token-builtin";
  }
  if (/^\d/.test(token)) return "wg-token-number";
  return "wg-token-operator";
}

function formatValue(value: JsonValue) {
  return JSON.stringify(value) ?? String(value);
}

function describeVisibleTest(test: LevelTest) {
  if (test.kind === "stdout") {
    const inputs = test.inputs?.length
      ? `Entrées : ${test.inputs.map(formatValue).join(", ")} · `
      : "";
    return `${inputs}sortie attendue : ${formatValue(test.expected)}`;
  }
  if (test.kind === "variable") {
    return `${test.name} = ${formatValue(test.expected)}`;
  }
  const args = test.args.map(formatValue).join(", ");
  return `${test.name}(${args}) → ${formatValue(test.expected)}`;
}

function highlightPython(code: string) {
  const parts: Array<{ text: string; className?: string }> = [];
  const pattern = new RegExp(PYTHON_TOKEN_PATTERN.source, "gm");
  let previousIndex = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > previousIndex) {
      parts.push({ text: code.slice(previousIndex, index) });
    }
    parts.push({ text: match[0], className: tokenClass(match[0]) });
    previousIndex = index + match[0].length;
  }
  if (previousIndex < code.length) parts.push({ text: code.slice(previousIndex) });
  return parts;
}

export function CodeWorkspace({
  levelId,
  code,
  runResult,
  validationResult,
  runtimeState,
  runtimeMessage,
  stdinText,
  visibleTests,
  onCodeChange,
  onStdinChange,
  onRun,
  onValidate,
  onResetCode,
}: CodeWorkspaceProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const highlightedCode = useMemo(() => highlightPython(code), [code]);
  const busy = runtimeState === "loading" || runtimeState === "running";
  const statusIsError = runtimeState === "error" || runResult?.status === "error" || runResult?.status === "timeout";

  function onEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const element = event.currentTarget;
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const next = `${code.slice(0, start)}    ${code.slice(end)}`;
      onCodeChange(next);
      requestAnimationFrame(() => {
        element.selectionStart = element.selectionEnd = start + 4;
      });
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const element = event.currentTarget;
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const lineStart = code.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const currentLine = code.slice(lineStart, start);
      const indentation = currentLine.match(/^\s*/)?.[0] ?? "";
      const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
      const insertion = `\n${indentation}${extraIndent}`;
      onCodeChange(`${code.slice(0, start)}${insertion}${code.slice(end)}`);
      requestAnimationFrame(() => {
        element.selectionStart = element.selectionEnd = start + insertion.length;
      });
      return;
    }
  }

  return (
    <section className="wg-card" aria-labelledby="editor-heading" data-testid={`workspace-${levelId}`}>
      <div className="wg-card-head">
        <div>
          <h2 className="wg-card-title" id="editor-heading">Votre espace de code</h2>
          <span className="wg-card-sub">Python · niveau {levelId}</span>
        </div>
        <span className="wg-pill" data-testid="status-runtime">
          <span aria-hidden="true" style={{ color: runtimeState === "ready" ? "hsl(var(--primary))" : undefined }}>●</span>
          {runtimeState === "ready" ? "Prêt" : runtimeState === "running" ? "Exécution" : runtimeState === "loading" ? "Chargement" : runtimeState === "error" ? "Indisponible" : "En attente"}
        </span>
      </div>
      <div className="wg-editor-wrap">
        <div className="wg-editor-toolbar">
          <span className="wg-code-label">main.py</span>
          <div className="wg-editor-actions">
            <button
              type="button"
              className="wg-button wg-button-quiet"
              onClick={() => {
                if (window.confirm("Restaurer le code de départ et effacer le brouillon de ce niveau ?")) {
                  onResetCode();
                }
              }}
              data-testid={`button-reset-code-${levelId}`}
            >
              <RotateCcw size={13} /> Réinitialiser
            </button>
            <button type="button" className="wg-button" onClick={onRun} disabled={busy || runtimeState === "error"} data-testid={`button-run-${levelId}`}>
              <Play size={13} /> Exécuter
            </button>
            <button type="button" className="wg-button wg-button-primary" onClick={onValidate} disabled={busy || runtimeState === "error"} data-testid={`button-validate-${levelId}`}>
              <Check size={14} /> Vérifier
            </button>
          </div>
        </div>
        <label className="wg-sr-only" htmlFor={`code-${levelId}`}>Votre code Python</label>
        <div className="wg-editor-surface">
          <pre className="wg-editor-highlight" aria-hidden="true" ref={highlightRef}>
            <code>
              {highlightedCode.map((part, index) =>
                part.className ? (
                  <span className={part.className} key={`${index}-${part.text}`}>{part.text}</span>
                ) : (
                  <span key={`${index}-plain`}>{part.text}</span>
                ),
              )}
              {"\n"}
            </code>
          </pre>
          <textarea
            ref={editorRef}
            id={`code-${levelId}`}
            className="wg-editor"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            onKeyDown={onEditorKeyDown}
            onScroll={(event) => {
              if (highlightRef.current) {
                highlightRef.current.scrollTop = event.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }
            }}
            aria-describedby={`editor-help-${levelId}`}
            data-testid={`input-code-${levelId}`}
          />
        </div>
        <p id={`editor-help-${levelId}`} className="wg-sr-only">Appuyez sur Tab pour indenter et sur Ctrl ou Commande plus Entrée pour exécuter.</p>
        <label className="wg-stdin-label" htmlFor={`stdin-${levelId}`}>Entrées clavier <span>une valeur par ligne</span></label>
        <textarea
          id={`stdin-${levelId}`}
          className="wg-stdin"
          value={stdinText}
          onChange={(event) => onStdinChange(event.target.value)}
          placeholder="Les réponses lues avec input() apparaissent ici"
          rows={2}
          data-testid={`input-stdin-${levelId}`}
        />
      </div>
      <section className="wg-visible-tests" aria-label="Tests visibles" data-testid={`visible-tests-${levelId}`}>
        <p className="wg-visible-tests-title">Tests visibles</p>
        {visibleTests.length ? (
          <ul>
            {visibleTests.map((test, index) => (
              <li key={`${levelId}-visible-${index}`} data-testid={`visible-test-${levelId}-${index}`}>
                <span>{test.label}</span>
                <code>{describeVisibleTest(test)}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="wg-card-sub">Aucun test visible n’est défini pour ce niveau.</p>
        )}
      </section>
      <div className={`wg-runtime${statusIsError ? " error" : ""}`} role={statusIsError ? "alert" : "status"} data-testid="message-runtime">
        {statusIsError && <CircleAlert size={13} style={{ verticalAlign: "middle", marginRight: 6 }} />}
        {runResult?.status === "timeout"
          ? "Le programme a dépassé le temps autorisé."
          : runResult?.error || (runtimeState === "error" && runtimeMessage)
            ? runResult?.error || runtimeMessage
            : runtimeCopy[runtimeState]}
        {runResult && <span> · {runResult.durationMs} ms</span>}
      </div>
      <div className="wg-output" aria-live="polite">
        <div className="wg-output-head"><Terminal size={13} /> Sortie du programme</div>
        <div className={`wg-output-body${runResult?.output ? " has-output" : ""}`} data-testid={`output-run-${levelId}`}>
          {runResult?.output || (runResult?.status === "error" ? runResult.error : "Le résultat de votre exécution apparaîtra ici.")}
        </div>
      </div>
      {validationResult && (
        <div className="wg-results" role="status" data-testid={`results-validation-${levelId}`}>
          <div className="wg-result-summary">
            <span>{validationResult.passed ? "Défi réussi" : "Encore quelques ajustements"}</span>
            <span className={validationResult.passed ? "wg-pass" : "wg-fail"}>
              {validationResult.visible.filter((test) => test.passed).length}/{validationResult.visible.length} tests visibles
              {validationResult.hiddenTotal > 0 && ` · ${validationResult.hiddenPassed}/${validationResult.hiddenTotal} vérifications`}
            </span>
          </div>
          {validationResult.error && <p className="wg-fail">{validationResult.error}</p>}
          <div className="wg-result-list">
            {validationResult.visible.map((test, index) => (
              <div className="wg-result-row" key={`${levelId}-case-${index}`} data-testid={`result-case-${levelId}-${index}`}>
                <span>{test.label}</span>
                <span className={test.passed ? "wg-pass" : "wg-fail"}>{test.passed ? "Réussi" : "À revoir"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {runtimeState === "loading" && <div className="wg-sr-only" role="status" data-testid="loading-runtime">Chargement de Python</div>}
      {runtimeState === "error" && <div className="wg-sr-only" role="alert" data-testid="error-runtime">L’environnement d’exécution est indisponible.</div>}
    </section>
  );
}
