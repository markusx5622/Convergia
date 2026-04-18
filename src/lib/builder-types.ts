/**
 * Types for the Custom Scenario Studio / Scenario Builder.
 *
 * These map closely to the engine types (Scenario, Stakeholder, InvestmentOption)
 * but include mutable draft forms with string fields for controlled inputs,
 * plus unique IDs for list management.
 */

import type { VariableId } from '@/engine/types';

/* ── Draft KPI (editable form) ── */
export interface DraftKPI {
  uid: string;
  name: string;
  current: string; // string for controlled input — parsed to number on build
  unit: string;
}

/* ── Draft Scenario ── */
export interface DraftScenario {
  name: string;
  company: string;
  description: string;
  budget: string; // string for controlled input
  kpis: DraftKPI[];
}

/* ── Draft Red Line ── */
export interface DraftRedLine {
  uid: string;
  variable: VariableId;
  operator: 'lt' | 'gt';
  threshold: string; // string for controlled input
  description: string;
}

/* ── Draft Stakeholder ── */
export interface DraftStakeholder {
  uid: string;
  name: string;
  role: string;
  weights: Record<VariableId, string>; // string for slider/input
  redLines: DraftRedLine[];
  concessionThreshold: string;
  concessionRate: string;
  acceptabilityThreshold: string;
}

/* ── Draft Impact (per variable) ── */
export type DraftImpacts = Record<VariableId, string>;

/* ── Draft Investment Option ── */
export interface DraftOption {
  uid: string;
  name: string;
  cost: string;
  description: string;
  risks: string; // comma-separated for simplicity
  impacts: DraftImpacts;
}

/* ── Full builder state (serialisable) ── */
export interface BuilderState {
  scenario: DraftScenario;
  stakeholders: DraftStakeholder[];
  options: DraftOption[];
}

/* ── Validation error ── */
export interface ValidationError {
  path: string;      // e.g. "stakeholders[0].weights"
  message: string;
}

/* ── Builder wizard steps ── */
export type BuilderStep = 'scenario' | 'stakeholders' | 'options' | 'validate' | 'preview';

export const BUILDER_STEPS: { id: BuilderStep; label: string; icon: string }[] = [
  { id: 'scenario', label: 'Escenario', icon: '📋' },
  { id: 'stakeholders', label: 'Stakeholders', icon: '👥' },
  { id: 'options', label: 'Opciones', icon: '💡' },
  { id: 'validate', label: 'Validación', icon: '✅' },
  { id: 'preview', label: 'Simular', icon: '🚀' },
];
