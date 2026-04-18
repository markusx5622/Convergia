/**
 * Persistence helpers for the Scenario Builder.
 *
 * - localStorage for session persistence
 * - JSON export/import for sharing and backup
 *
 * Import includes deep shape validation to reject corrupt or foreign JSON.
 */

import type { BuilderState, DraftStakeholder, DraftOption } from './builder-types';
import { VARIABLE_IDS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

const LS_KEY = 'convergia:builder-state';

/** Current schema version — bump when BuilderState shape changes. */
const SCHEMA_VERSION = 1;

/** Maximum file size for JSON import (1 MB — prevents browser slowdown from large files). */
const MAX_IMPORT_FILE_SIZE = 1_048_576;

/* ── Auto-incrementing UID for sanitized entries (not security-sensitive). ── */
let _sanitizeCounter = 0;
function nextSanitizeUid(prefix: string): string {
  return `${prefix}-${Date.now()}-${++_sanitizeCounter}`;
}

/* ── Serialisable wrapper (adds version) ── */

interface PersistedState {
  version: number;
  state: BuilderState;
}

/* ── Shape validation helpers ── */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isStringOrNumber(v: unknown): boolean {
  return typeof v === 'string' || typeof v === 'number';
}

function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && isFinite(v)) return String(v);
  return fallback;
}

function ensureWeights(w: unknown): Record<VariableId, string> {
  const result: Partial<Record<VariableId, string>> = {};
  const share = (1 / VARIABLE_IDS.length).toFixed(3);
  for (const v of VARIABLE_IDS) {
    const val = isObject(w) ? w[v] : undefined;
    result[v] = isStringOrNumber(val) ? ensureString(val, share) : share;
  }
  return result as Record<VariableId, string>;
}

function ensureImpacts(imp: unknown): Record<VariableId, string> {
  const result: Partial<Record<VariableId, string>> = {};
  for (const v of VARIABLE_IDS) {
    const val = isObject(imp) ? imp[v] : undefined;
    result[v] = isStringOrNumber(val) ? ensureString(val, '0.50') : '0.50';
  }
  return result as Record<VariableId, string>;
}

function sanitizeStakeholder(raw: unknown): DraftStakeholder | null {
  if (!isObject(raw)) return null;
  return {
    uid: isString(raw.uid) ? raw.uid : nextSanitizeUid('imported'),
    name: ensureString(raw.name),
    role: ensureString(raw.role),
    weights: ensureWeights(raw.weights),
    redLines: Array.isArray(raw.redLines)
      ? raw.redLines
          .filter(isObject)
          .filter((rl) => VARIABLE_IDS.includes(rl.variable as VariableId))
          .map((rl) => ({
            uid: isString(rl.uid) ? rl.uid : nextSanitizeUid('rl'),
            variable: rl.variable as VariableId,
            operator: rl.operator === 'gt' ? 'gt' as const : 'lt' as const,
            threshold: ensureString(rl.threshold, '0.10'),
            description: ensureString(rl.description),
          }))
      : [],
    concessionThreshold: ensureString(raw.concessionThreshold, '0.10'),
    concessionRate: ensureString(raw.concessionRate, '0.12'),
    acceptabilityThreshold: ensureString(raw.acceptabilityThreshold, '0.30'),
  };
}

function sanitizeOption(raw: unknown): DraftOption | null {
  if (!isObject(raw)) return null;
  return {
    uid: isString(raw.uid) ? raw.uid : nextSanitizeUid('imported'),
    name: ensureString(raw.name),
    cost: ensureString(raw.cost),
    description: ensureString(raw.description),
    risks: ensureString(raw.risks),
    impacts: ensureImpacts(raw.impacts),
  };
}

/**
 * Deeply validate and sanitize a raw object into a BuilderState.
 * Fills missing fields with safe defaults so the app never crashes on corrupt data.
 * Returns null only if the structure is completely unrecoverable.
 */
export function sanitizeBuilderState(raw: unknown): BuilderState | null {
  if (!isObject(raw)) return null;

  // Scenario
  const sc = isObject(raw.scenario) ? raw.scenario : {};
  const scenario = {
    name: ensureString(sc.name),
    company: ensureString(sc.company),
    description: ensureString(sc.description),
    budget: ensureString(sc.budget),
    kpis: Array.isArray(sc.kpis)
      ? sc.kpis.filter(isObject).map((k) => ({
          uid: isString(k.uid) ? k.uid : nextSanitizeUid('kpi'),
          name: ensureString(k.name),
          current: ensureString(k.current),
          unit: ensureString(k.unit),
        }))
      : [],
  };

  // Stakeholders
  const stakeholders: DraftStakeholder[] = [];
  if (Array.isArray(raw.stakeholders)) {
    for (const rawSh of raw.stakeholders) {
      const sh = sanitizeStakeholder(rawSh);
      if (sh) stakeholders.push(sh);
    }
  }

  // Options
  const options: DraftOption[] = [];
  if (Array.isArray(raw.options)) {
    for (const rawOpt of raw.options) {
      const opt = sanitizeOption(rawOpt);
      if (opt) options.push(opt);
    }
  }

  return { scenario, stakeholders, options };
}

/* ── localStorage ── */

export function saveToLocalStorage(state: BuilderState): void {
  try {
    const persisted: PersistedState = { version: SCHEMA_VERSION, state };
    localStorage.setItem(LS_KEY, JSON.stringify(persisted));
  } catch {
    // QuotaExceeded or SSR — silently ignore
  }
}

export function loadFromLocalStorage(): BuilderState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    // Handle versioned wrapper
    if (isObject(parsed) && typeof (parsed as Record<string, unknown>).version === 'number') {
      return sanitizeBuilderState((parsed as Record<string, unknown>).state);
    }

    // Legacy format (no version wrapper) — try to sanitize directly
    return sanitizeBuilderState(parsed);
  } catch {
    // Corrupt localStorage data — clear it
    try {
      localStorage.removeItem(LS_KEY);
    } catch { /* ignore */ }
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    // ignore
  }
}

/* ── JSON export ── */

export function exportAsJSON(state: BuilderState, filename?: string): void {
  const persisted: PersistedState = { version: SCHEMA_VERSION, state };
  const json = JSON.stringify(persisted, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `convergia-scenario-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── JSON import ── */

export interface ImportResult {
  state: BuilderState;
  warnings: string[];
}

export function importFromJSON(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se proporcionó ningún archivo.'));
      return;
    }

    // Reject files larger than 1 MB
    if (file.size > MAX_IMPORT_FILE_SIZE) {
      reject(new Error('El archivo es demasiado grande (máximo 1 MB).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw: unknown = JSON.parse(reader.result as string);
        const warnings: string[] = [];

        // Handle versioned wrapper
        let stateCandidate: unknown;
        if (isObject(raw) && typeof (raw as Record<string, unknown>).version === 'number') {
          const v = (raw as Record<string, unknown>).version as number;
          if (v > SCHEMA_VERSION) {
            warnings.push(`El archivo usa la versión ${v} del esquema (actual: ${SCHEMA_VERSION}). Algunos datos podrían perderse.`);
          }
          stateCandidate = (raw as Record<string, unknown>).state;
        } else {
          // Legacy format
          stateCandidate = raw;
        }

        // Basic shape check
        if (!isObject(stateCandidate)) {
          reject(new Error('El archivo JSON no tiene la estructura esperada de un escenario Convergia.'));
          return;
        }

        const sc = stateCandidate as Record<string, unknown>;
        if (!isObject(sc.scenario) && !Array.isArray(sc.stakeholders) && !Array.isArray(sc.options)) {
          reject(new Error('El archivo JSON no contiene datos de escenario, stakeholders ni opciones.'));
          return;
        }

        const sanitized = sanitizeBuilderState(stateCandidate);
        if (!sanitized) {
          reject(new Error('No se pudo recuperar un escenario válido del archivo.'));
          return;
        }

        // Generate helpful warnings
        if (sanitized.stakeholders.length === 0) {
          warnings.push('No se encontraron stakeholders válidos. Deberás añadir al menos 2.');
        } else if (sanitized.stakeholders.length < 2) {
          warnings.push(`Solo se encontró ${sanitized.stakeholders.length} stakeholder. Se necesitan al menos 2.`);
        }

        if (sanitized.options.length === 0) {
          warnings.push('No se encontraron opciones válidas. Deberás añadir al menos 2.');
        } else if (sanitized.options.length < 2) {
          warnings.push(`Solo se encontró ${sanitized.options.length} opción. Se necesitan al menos 2.`);
        }

        resolve({ state: sanitized, warnings });
      } catch {
        reject(new Error('El archivo no contiene JSON válido.'));
      }
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo.'));
    reader.readAsText(file);
  });
}
