/// <reference lib="webworker" />

import type {
  JsonValue,
  LevelTest,
  RunResult,
  ValidationResult,
} from "@/domain/types";

type WorkerRequest = {
  requestId: string;
  kind: "run" | "validate";
  code: string;
  inputs?: string[];
  visibleTests?: LevelTest[];
  hiddenTests?: LevelTest[];
  requiredPackages?: ("numpy" | "matplotlib")[];
};

type WorkerResponse =
  | { kind: "status"; status: "loading" | "ready" | "error"; message?: string }
  | {
      kind: "result";
      requestId: string;
      result: RunResult | ValidationResult;
    };

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: {
    set: (name: string, value: string) => void;
  };
}

declare const self: DedicatedWorkerGlobalScope;

const PYODIDE_BASE =
  "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const MAX_CODE_LENGTH = 24_000;
const MAX_OUTPUT_LENGTH = 8_000;

let pyodidePromise: Promise<PyodideInstance> | undefined;

function send(message: WorkerResponse) {
  self.postMessage(message);
}

function loadPyodideOnce() {
  if (!pyodidePromise) {
    send({ kind: "status", status: "loading" });
    pyodidePromise = (async () => {
      const pyodideUrl = `${PYODIDE_BASE}pyodide.mjs`;
      const module = (await import(
        /* @vite-ignore */ pyodideUrl
      )) as { loadPyodide: (options: { indexURL: string }) => Promise<PyodideInstance> };
      const pyodide = await module.loadPyodide({ indexURL: PYODIDE_BASE });
      send({ kind: "status", status: "ready" });
      return pyodide;
    })().catch((error: unknown) => {
      pyodidePromise = undefined;
      const message =
        error instanceof Error ? error.message : "Chargement de Python impossible.";
      send({ kind: "status", status: "error", message });
      throw error;
    });
  }
  return pyodidePromise;
}

const PYTHON_HARNESS = String.raw`
import builtins as _wg_builtins
import contextlib as _wg_contextlib
import io as _wg_io
import json as _wg_json
import math as _wg_math
import traceback as _wg_traceback

_wg_payload = _wg_json.loads(_wargame_payload)
_wg_kind = _wg_payload["kind"]
_wg_code = _wg_payload["code"]
_wg_packages = set(_wg_payload.get("requiredPackages", []))
_wg_allowed_imports = {"math", "random", "statistics", "collections", "re"}
if "numpy" in _wg_packages:
    _wg_allowed_imports.add("numpy")
if "matplotlib" in _wg_packages:
    _wg_allowed_imports.add("matplotlib")
_wg_original_import = _wg_builtins.__import__

def _wg_safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    root = name.split(".")[0]
    if root not in _wg_allowed_imports:
        raise ImportError("Ce module n'est pas disponible dans cet exercice.")
    return _wg_original_import(name, globals, locals, fromlist, level)

_wg_safe_builtins = dict(vars(_wg_builtins))
for _wg_unsafe_name in ("open", "eval", "exec", "compile", "breakpoint"):
    _wg_safe_builtins.pop(_wg_unsafe_name, None)
_wg_safe_builtins["__import__"] = _wg_safe_import

def _wg_json_value(value):
    if isinstance(value, tuple):
        return [_wg_json_value(item) for item in value]
    if isinstance(value, list):
        return [_wg_json_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _wg_json_value(item) for key, item in value.items()}
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return repr(value)

def _wg_equal(actual, expected, tolerance=0):
    if isinstance(expected, (int, float)) and not isinstance(expected, bool):
        if isinstance(actual, (int, float)) and not isinstance(actual, bool):
            return abs(actual - expected) <= tolerance
    if isinstance(expected, list):
        if not isinstance(actual, (list, tuple)) or len(actual) != len(expected):
            return False
        return all(_wg_equal(a, e, tolerance) for a, e in zip(actual, expected))
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or set(actual) != set(expected):
            return False
        return all(_wg_equal(actual[k], expected[k], tolerance) for k in expected)
    return actual == expected

def _wg_execute_test(test):
    _wg_stdout = _wg_io.StringIO()
    _wg_stderr = _wg_io.StringIO()
    _wg_inputs = list(test.get("inputs", []))

    def _wg_input(prompt=""):
        if prompt:
            print(prompt, end="")
        if not _wg_inputs:
            raise EOFError("Aucune donnée supplémentaire n'a été fournie.")
        return _wg_inputs.pop(0)

    _wg_student_builtins = dict(_wg_safe_builtins)
    _wg_student_builtins["input"] = _wg_input
    _wg_namespace = {
        "__builtins__": _wg_student_builtins,
        "__name__": "__main__",
    }
    try:
        with _wg_contextlib.redirect_stdout(_wg_stdout), _wg_contextlib.redirect_stderr(_wg_stderr):
            exec(_wg_code, _wg_namespace, _wg_namespace)
            if test["kind"] == "stdout":
                _wg_actual = _wg_stdout.getvalue()
            elif test["kind"] == "variable":
                if test["name"] not in _wg_namespace:
                    raise NameError("La variable « " + test["name"] + " » n'est pas définie.")
                _wg_actual = _wg_namespace[test["name"]]
            else:
                _wg_function = _wg_namespace.get(test["name"])
                if not callable(_wg_function):
                    raise NameError("La fonction « " + test["name"] + " » n'est pas définie.")
                _wg_actual = _wg_function(*test.get("args", []))
        _wg_actual_json = _wg_json_value(_wg_actual)
        _wg_expected = test["expected"]
        _wg_passed = _wg_equal(_wg_actual, _wg_expected, test.get("tolerance", 0))
        return {
            "label": test["label"],
            "passed": bool(_wg_passed),
            "expected": _wg_expected,
            "actual": _wg_actual_json,
            "message": None if _wg_passed else "Le résultat ne correspond pas à celui attendu.",
        }
    except Exception as _wg_error:
        return {
            "label": test["label"],
            "passed": False,
            "error": _wg_traceback.format_exception_only(type(_wg_error), _wg_error)[-1].strip(),
            "message": _wg_traceback.format_exception_only(type(_wg_error), _wg_error)[-1].strip(),
        }

def _wg_run_source():
    _wg_stdout = _wg_io.StringIO()
    _wg_stderr = _wg_io.StringIO()
    _wg_inputs = list(_wg_payload.get("inputs", []))

    def _wg_input(prompt=""):
        if prompt:
            print(prompt, end="")
        if not _wg_inputs:
            raise EOFError("Aucune donnée supplémentaire n'a été fournie.")
        return _wg_inputs.pop(0)

    _wg_student_builtins = dict(_wg_safe_builtins)
    _wg_student_builtins["input"] = _wg_input
    _wg_namespace = {"__builtins__": _wg_student_builtins, "__name__": "__main__"}
    try:
        with _wg_contextlib.redirect_stdout(_wg_stdout), _wg_contextlib.redirect_stderr(_wg_stderr):
            exec(_wg_code, _wg_namespace, _wg_namespace)
        return {
            "status": "success",
            "output": (_wg_stdout.getvalue() + _wg_stderr.getvalue())[:8000],
        }
    except Exception as _wg_error:
        return {
            "status": "error",
            "output": (_wg_stdout.getvalue() + _wg_stderr.getvalue())[:8000],
            "error": _wg_traceback.format_exception_only(type(_wg_error), _wg_error)[-1].strip(),
        }

if len(_wg_code) > 24000:
    _wg_result = {"status": "error", "output": "", "error": "Le code dépasse la limite de 24 000 caractères."}
elif _wg_kind == "run":
    _wg_result = _wg_run_source()
else:
    _wg_visible = _wg_payload.get("visibleTests", [])
    _wg_hidden = _wg_payload.get("hiddenTests", [])
    _wg_tests = _wg_visible + _wg_hidden
    _wg_results = []
    _wg_execution_error = None
    for _wg_test in _wg_tests:
        _wg_case_result = _wg_execute_test(_wg_test)
        _wg_results.append(_wg_case_result)
        if _wg_case_result.get("error"):
            _wg_execution_error = _wg_case_result["error"]
            break
    _wg_visible_results = _wg_results[:len(_wg_visible)]
    _wg_hidden_results = _wg_results[len(_wg_visible):]
    _wg_hidden_passed = sum(1 for _wg_result_case in _wg_hidden_results if _wg_result_case["passed"])
    _wg_result = {
        "passed": len(_wg_results) == len(_wg_tests) and all(_wg_result_case["passed"] for _wg_result_case in _wg_results),
        "visible": _wg_visible_results,
        "hiddenPassed": _wg_hidden_passed,
        "hiddenTotal": len(_wg_hidden),
        "error": _wg_execution_error,
    }
_wargame_result_json = _wg_json.dumps(_wg_result, ensure_ascii=False, allow_nan=False)
_wargame_result_json
`;

async function handleRequest(request: WorkerRequest) {
  const started = performance.now();
  if (request.code.length > MAX_CODE_LENGTH) {
    const result: RunResult = {
      status: "error",
      output: "",
      error: `Le code dépasse la limite de ${MAX_CODE_LENGTH.toLocaleString("fr-FR")} caractères.`,
      durationMs: 0,
    };
    send({ kind: "result", requestId: request.requestId, result });
    return;
  }

  try {
    const pyodide = await loadPyodideOnce();
    if (request.requiredPackages?.length) {
      await pyodide.loadPackage([...new Set(request.requiredPackages)]);
    }
    const payload = {
      kind: request.kind,
      code: request.code,
      inputs: request.inputs ?? [],
      visibleTests: request.visibleTests ?? [],
      hiddenTests: request.hiddenTests ?? [],
      requiredPackages: request.requiredPackages ?? [],
    };
    pyodide.globals.set("_wargame_payload", JSON.stringify(payload));
    const proxy = await pyodide.runPythonAsync(PYTHON_HARNESS);
    const json =
      typeof proxy === "string"
        ? proxy
        : proxy && typeof proxy === "object" && "toJs" in proxy
          ? String(proxy)
          : String(proxy);
    if (proxy && typeof proxy === "object" && "destroy" in proxy) {
      (proxy as { destroy?: () => void }).destroy?.();
    }
    const raw = JSON.parse(json) as Omit<RunResult, "durationMs"> & {
      visible?: ValidationResult["visible"];
      hiddenPassed?: number;
      hiddenTotal?: number;
      passed?: boolean;
    };
    const durationMs = Math.round(performance.now() - started);

    let result: RunResult | ValidationResult;
    if (request.kind === "run") {
      result = {
        status: raw.status ?? "error",
        output: String(raw.output ?? "").slice(0, MAX_OUTPUT_LENGTH),
        error: raw.error,
        durationMs,
      };
    } else {
      result = {
        passed: raw.passed === true,
        visible: raw.visible ?? [],
        hiddenPassed: raw.hiddenPassed ?? 0,
        hiddenTotal: raw.hiddenTotal ?? 0,
        error: raw.error,
        durationMs,
      };
    }
    send({ kind: "result", requestId: request.requestId, result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Une erreur est survenue dans le moteur Python.";
    const durationMs = Math.round(performance.now() - started);
    const result: RunResult | ValidationResult =
      request.kind === "run"
        ? { status: "error", output: "", error: message, durationMs }
        : {
            passed: false,
            visible: [],
            hiddenPassed: 0,
            hiddenTotal: request.hiddenTests?.length ?? 0,
            error: message,
            durationMs,
          };
    send({ kind: "result", requestId: request.requestId, result });
  }
}

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  void handleRequest(event.data);
});

void loadPyodideOnce().catch(() => undefined);
