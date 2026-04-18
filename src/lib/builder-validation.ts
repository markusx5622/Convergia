/**
 * Validation utilities for the Scenario Builder.
 *
 * All validations are pure functions — no side-effects.
 * Returns an array of ValidationError objects.
 */

import type {
  BuilderState,
  DraftScenario,
  DraftStakeholder,
  DraftOption,
  ValidationError,
} from './builder-types';
import { VARIABLE_IDS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

/* ── Helpers ── */

function num(v: string): number {
  return parseFloat(v);
}

function isValidNum(v: string): boolean {
  const n = parseFloat(v);
  return !isNaN(n) && isFinite(n);
}

/* ── Scenario validation ── */

export function validateScenario(s: DraftScenario): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!s.name.trim()) {
    errors.push({ path: 'scenario.name', message: 'El nombre del escenario es obligatorio.' });
  }
  if (!s.company.trim()) {
    errors.push({ path: 'scenario.company', message: 'La empresa / contexto es obligatorio.' });
  }
  if (!s.description.trim()) {
    errors.push({ path: 'scenario.description', message: 'La descripción es obligatoria.' });
  }
  if (!isValidNum(s.budget) || num(s.budget) <= 0) {
    errors.push({ path: 'scenario.budget', message: 'El presupuesto debe ser un número positivo.' });
  }

  return errors;
}

/* ── Stakeholder validation ── */

export function validateStakeholder(s: DraftStakeholder, idx: number): ValidationError[] {
  const prefix = `stakeholders[${idx}]`;
  const errors: ValidationError[] = [];

  if (!s.name.trim()) {
    errors.push({ path: `${prefix}.name`, message: `Stakeholder ${idx + 1}: el nombre es obligatorio.` });
  }
  if (!s.role.trim()) {
    errors.push({ path: `${prefix}.role`, message: `Stakeholder ${idx + 1}: el rol es obligatorio.` });
  }

  // Weights must sum to 1.0 (±0.01 tolerance)
  let weightSum = 0;
  for (const v of VARIABLE_IDS) {
    const w = num(s.weights[v]);
    if (!isValidNum(s.weights[v]) || w < 0 || w > 1) {
      errors.push({
        path: `${prefix}.weights.${v}`,
        message: `Stakeholder "${s.name || idx + 1}": el peso de ${v} debe estar entre 0 y 1.`,
      });
    } else {
      weightSum += w;
    }
  }
  if (Math.abs(weightSum - 1.0) > 0.011) {
    errors.push({
      path: `${prefix}.weights`,
      message: `Stakeholder "${s.name || idx + 1}": los pesos suman ${weightSum.toFixed(3)} — deben sumar 1.00.`,
    });
  }

  // Red lines
  for (let ri = 0; ri < s.redLines.length; ri++) {
    const rl = s.redLines[ri];
    if (!isValidNum(rl.threshold) || num(rl.threshold) < 0 || num(rl.threshold) > 1) {
      errors.push({
        path: `${prefix}.redLines[${ri}].threshold`,
        message: `Stakeholder "${s.name || idx + 1}", línea roja ${ri + 1}: umbral debe estar entre 0 y 1.`,
      });
    }
  }

  // Concession params
  if (!isValidNum(s.concessionThreshold) || num(s.concessionThreshold) < 0 || num(s.concessionThreshold) > 1) {
    errors.push({
      path: `${prefix}.concessionThreshold`,
      message: `Stakeholder "${s.name || idx + 1}": umbral de concesión debe estar entre 0 y 1.`,
    });
  }
  if (!isValidNum(s.concessionRate) || num(s.concessionRate) < 0 || num(s.concessionRate) > 1) {
    errors.push({
      path: `${prefix}.concessionRate`,
      message: `Stakeholder "${s.name || idx + 1}": tasa de concesión debe estar entre 0 y 1.`,
    });
  }
  if (!isValidNum(s.acceptabilityThreshold) || num(s.acceptabilityThreshold) < 0 || num(s.acceptabilityThreshold) > 1) {
    errors.push({
      path: `${prefix}.acceptabilityThreshold`,
      message: `Stakeholder "${s.name || idx + 1}": umbral de aceptabilidad debe estar entre 0 y 1.`,
    });
  }

  return errors;
}

/* ── Option validation ── */

export function validateOption(o: DraftOption, idx: number, budget: number): ValidationError[] {
  const prefix = `options[${idx}]`;
  const errors: ValidationError[] = [];

  if (!o.name.trim()) {
    errors.push({ path: `${prefix}.name`, message: `Opción ${idx + 1}: el nombre es obligatorio.` });
  }
  if (!isValidNum(o.cost) || num(o.cost) <= 0) {
    errors.push({ path: `${prefix}.cost`, message: `Opción "${o.name || idx + 1}": el coste debe ser un número positivo.` });
  } else if (num(o.cost) > budget && budget > 0) {
    errors.push({
      path: `${prefix}.cost`,
      message: `Opción "${o.name || idx + 1}": el coste (${num(o.cost).toLocaleString('es-ES')}€) excede el presupuesto (${budget.toLocaleString('es-ES')}€).`,
    });
  }

  // Impacts between 0 and 1
  for (const v of VARIABLE_IDS) {
    const val = num(o.impacts[v]);
    if (!isValidNum(o.impacts[v]) || val < 0 || val > 1) {
      errors.push({
        path: `${prefix}.impacts.${v}`,
        message: `Opción "${o.name || idx + 1}": impacto ${v} debe estar entre 0 y 1.`,
      });
    }
  }

  return errors;
}

/* ── Full state validation ── */

export function validateAll(state: BuilderState): ValidationError[] {
  const errors: ValidationError[] = [];

  // Scenario
  errors.push(...validateScenario(state.scenario));

  // Min stakeholders
  if (state.stakeholders.length < 2) {
    errors.push({
      path: 'stakeholders',
      message: 'Se requieren al menos 2 stakeholders para una negociación.',
    });
  }
  for (let i = 0; i < state.stakeholders.length; i++) {
    errors.push(...validateStakeholder(state.stakeholders[i], i));
  }

  // Min options
  if (state.options.length < 2) {
    errors.push({
      path: 'options',
      message: 'Se requieren al menos 2 opciones de inversión.',
    });
  }
  const budget = isValidNum(state.scenario.budget) ? num(state.scenario.budget) : 0;
  for (let i = 0; i < state.options.length; i++) {
    errors.push(...validateOption(state.options[i], i, budget));
  }

  return errors;
}

/* ── Has errors for a specific section ── */

export function sectionHasErrors(
  errors: ValidationError[],
  section: 'scenario' | 'stakeholders' | 'options',
): boolean {
  return errors.some((e) => e.path.startsWith(section));
}
