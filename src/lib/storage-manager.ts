/**
 * Local-First Storage Manager for Convergia.
 *
 * Saves a list of historical sessions (simulations or studio drafts)
 * into localStorage, allowing the user to resume or review past work.
 */

import type { BuilderState } from "./builder-types";

const HISTORY_KEY = "convergia:history";

export interface SavedSession {
  id: string; // Unique identifier (UUID-like or timestamp-based)
  createdAt: number; // Timestamp when created
  updatedAt: number; // Timestamp when last modified
  title: string; // User-friendly title (e.g. "Scenario: Acme Corp")
  state: BuilderState; // The full draft state
  isCompleted: boolean; // Whether it reached the final "debate" phase
}

/**
 * Retrieve all saved sessions, ordered by most recent first.
 */
export function getSavedSessions(): SavedSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const sessions = JSON.parse(raw) as SavedSession[];
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    console.error("Failed to load sessions from localStorage", err);
    return [];
  }
}

/**
 * Save or update a session in the history.
 */
export function saveSession(
  state: BuilderState,
  isCompleted = false,
  existingId?: string,
): string {
  if (typeof window === "undefined") return "";

  const id = existingId || `session-${Date.now()}`;
  const now = Date.now();
  const sessions = getSavedSessions();

  const title = state.scenario.company
    ? `${state.scenario.company} - ${state.scenario.name}`
    : "Borrador sin título";

  const newSession: SavedSession = {
    id,
    createdAt: now,
    updatedAt: now,
    title,
    state,
    isCompleted,
  };

  const existingIndex = sessions.findIndex((s) => s.id === id);
  if (existingIndex >= 0) {
    // Preserve original creation time if updating
    newSession.createdAt = sessions[existingIndex].createdAt;
    sessions[existingIndex] = newSession;
  } else {
    sessions.push(newSession);
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error(
      "Failed to save session to localStorage (QuotaExceeded?)",
      err,
    );
    // If quota exceeded, we could try to evict the oldest session, but for now we'll just fail gracefully
  }

  return id;
}

/**
 * Load a specific session by ID.
 */
export function getSessionById(id: string): SavedSession | null {
  const sessions = getSavedSessions();
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Delete a session from the history.
 */
export function deleteSession(id: string): void {
  if (typeof window === "undefined") return;
  const sessions = getSavedSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to update sessions after deletion", err);
  }
}

/**
 * Clear the entire history.
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error("Failed to clear history", err);
  }
}
