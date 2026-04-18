/**
 * Persistence helpers for the Scenario Builder.
 *
 * - localStorage for session persistence
 * - JSON export/import for sharing and backup
 */

import type { BuilderState } from './builder-types';

const LS_KEY = 'convergia:builder-state';

/* ── localStorage ── */

export function saveToLocalStorage(state: BuilderState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // QuotaExceeded or SSR — silently ignore
  }
}

export function loadFromLocalStorage(): BuilderState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BuilderState;
  } catch {
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
  const json = JSON.stringify(state, null, 2);
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

export function importFromJSON(file: File): Promise<BuilderState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result as string) as BuilderState;
        // Basic shape check
        if (!state.scenario || !Array.isArray(state.stakeholders) || !Array.isArray(state.options)) {
          reject(new Error('El archivo JSON no tiene la estructura de un escenario Convergia.'));
          return;
        }
        resolve(state);
      } catch {
        reject(new Error('El archivo no es JSON válido.'));
      }
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo.'));
    reader.readAsText(file);
  });
}
