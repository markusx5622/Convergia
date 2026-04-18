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
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

/* ── Constants ── */

/** Tolerance for weight sum check (weights must sum to 1.0 ± this).
 *  Set to 0.02 to accommodate rounding when users enter values with limited decimal places. */
export const WEIGHT_SUM_TOLERANCE = 0.02;

/** Maximum allowed stakeholders */
export const MAX_STAKEHOLDERS = 20;

/** Maximum allowed options */
export const MAX_OPTIONS = 20;

/* ── Helpers ── */

function num(v: string): number {
  return parseFloat(v);
}

function isValidNum(v: string): boolean {
  if (typeof v !== 'string' || v.trim() === '') return false;
  const n = parseFloat(v);
  return !isNaN(n) && isFinite(n);
}

function variableLabel(v: VariableId): string {
  return VARIABLE_LABELS[v] ?? v;
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
  if (!isValidNum(s.budget)) {
    errors.push({ path: 'scenario.budget', message: 'El presupuesto debe ser un número válido.' });
  } else if (num(s.budget) <= 0) {
    errors.push({ path: 'scenario.budget', message: 'El presupuesto debe ser un número positivo.' });
  }

  return errors;
}

/* ── Stakeholder validation ── */

export function validateStakeholder(s: DraftStakeholder, idx: number): ValidationError[] {
  const prefix = `stakeholders[${idx}]`;
  const label = s.name?.trim() || `Stakeholder ${idx + 1}`;
  const errors: ValidationError[] = [];

  if (!s.name?.trim()) {
    errors.push({ path: `${prefix}.name`, message: `Stakeholder ${idx + 1}: el nombre es obligatorio.` });
  }
  if (!s.role?.trim()) {
    errors.push({ path: `${prefix}.role`, message: `${label}: el rol es obligatorio.` });
  }

  // Weights must sum to 1.0 (±tolerance)
  let weightSum = 0;
  let hasWeightErrors = false;
  for (const v of VARIABLE_IDS) {
    const raw = s.weights?.[v];
    if (raw === undefined || raw === null || !isValidNum(String(raw))) {
      errors.push({
        path: `${prefix}.weights.${v}`,
        message: `${label}: el peso de "${variableLabel(v)}" debe ser un número válido.`,
      });
      hasWeightErrors = true;
    } else {
      const w = num(String(raw));
      if (w < 0 || w > 1) {
        errors.push({
          path: `${prefix}.weights.${v}`,
          message: `${label}: el peso de "${variableLabel(v)}" debe estar entre 0 y 1 (actual: ${w}).`,
        });
        hasWeightErrors = true;
      } else {
        weightSum += w;
      }
    }
  }
  if (!hasWeightErrors && Math.abs(weightSum - 1.0) > WEIGHT_SUM_TOLERANCE) {
    errors.push({
      path: `${prefix}.weights`,
      message: `${label}: los pesos suman ${weightSum.toFixed(3)} — deben sumar 1.00 (±${WEIGHT_SUM_TOLERANCE}).`,
    });
  }

  // Red lines
  for (let ri = 0; ri < (s.redLines?.length ?? 0); ri++) {
    const rl = s.redLines[ri];
    if (!isValidNum(String(rl.threshold))) {
      errors.push({
        path: `${prefix}.redLines[${ri}].threshold`,
        message: `${label}, línea roja ${ri + 1}: el umbral debe ser un número válido.`,
      });
    } else if (num(String(rl.threshold)) < 0 || num(String(rl.threshold)) > 1) {
      errors.push({
        path: `${prefix}.redLines[${ri}].threshold`,
        message: `${label}, línea roja ${ri + 1}: el umbral debe estar entre 0 y 1.`,
      });
    }
    if (!VARIABLE_IDS.includes(rl.variable)) {
      errors.push({
        path: `${prefix}.redLines[${ri}].variable`,
        message: `${label}, línea roja ${ri + 1}: la variable "${rl.variable}" no es válida.`,
      });
    }
  }

  // Concession params
  if (!isValidNum(String(s.concessionThreshold))) {
    errors.push({
      path: `${prefix}.concessionThreshold`,
      message: `${label}: el umbral de concesión debe ser un número válido.`,
    });
  } else if (num(String(s.concessionThreshold)) < 0 || num(String(s.concessionThreshold)) > 1) {
    errors.push({
      path: `${prefix}.concessionThreshold`,
      message: `${label}: el umbral de concesión debe estar entre 0 y 1.`,
    });
  }

  if (!isValidNum(String(s.concessionRate))) {
    errors.push({
      path: `${prefix}.concessionRate`,
      message: `${label}: la tasa de concesión debe ser un número válido.`,
    });
  } else if (num(String(s.concessionRate)) < 0 || num(String(s.concessionRate)) > 1) {
    errors.push({
      path: `${prefix}.concessionRate`,
      message: `${label}: la tasa de concesión debe estar entre 0 y 1.`,
    });
  }

  if (!isValidNum(String(s.acceptabilityThreshold))) {
    errors.push({
      path: `${prefix}.acceptabilityThreshold`,
      message: `${label}: el umbral de aceptabilidad debe ser un número válido.`,
    });
  } else if (num(String(s.acceptabilityThreshold)) < 0 || num(String(s.acceptabilityThreshold)) > 1) {
    errors.push({
      path: `${prefix}.acceptabilityThreshold`,
      message: `${label}: el umbral de aceptabilidad debe estar entre 0 y 1.`,
    });
  }

  return errors;
}

/* ── Option validation ── */

export function validateOption(o: DraftOption, idx: number, budget: number): ValidationError[] {
  const prefix = `options[${idx}]`;
  const label = o.name?.trim() || `Opción ${idx + 1}`;
  const errors: ValidationError[] = [];

  if (!o.name?.trim()) {
    errors.push({ path: `${prefix}.name`, message: `Opción ${idx + 1}: el nombre es obligatorio.` });
  }

  if (!isValidNum(String(o.cost))) {
    errors.push({ path: `${prefix}.cost`, message: `${label}: el coste debe ser un número válido.` });
  } else if (num(String(o.cost)) <= 0) {
    errors.push({ path: `${prefix}.cost`, message: `${label}: el coste debe ser un número positivo.` });
  } else if (budget > 0 && num(String(o.cost)) > budget) {
    errors.push({
      path: `${prefix}.cost`,
      message: `${label}: el coste (${num(String(o.cost)).toLocaleString('es-ES')}€) excede el presupuesto (${budget.toLocaleString('es-ES')}€).`,
    });
  }

  // Impacts between 0 and 1
  for (const v of VARIABLE_IDS) {
    const raw = o.impacts?.[v];
    if (raw === undefined || raw === null || !isValidNum(String(raw))) {
      errors.push({
        path: `${prefix}.impacts.${v}`,
        message: `${label}: el impacto de "${variableLabel(v)}" debe ser un número válido.`,
      });
    } else {
      const val = num(String(raw));
      if (val < 0 || val > 1) {
        errors.push({
          path: `${prefix}.impacts.${v}`,
          message: `${label}: el impacto de "${variableLabel(v)}" debe estar entre 0 y 1 (actual: ${val}).`,
        });
      }
    }
  }

  return errors;
}

/* ── Full state validation ── */

export function validateAll(state: BuilderState): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!state || typeof state !== 'object') {
    errors.push({ path: 'state', message: 'El estado del builder no es válido.' });
    return errors;
  }

  // Scenario
  if (!state.scenario) {
    errors.push({ path: 'scenario', message: 'Falta la configuración del escenario.' });
  } else {
    errors.push(...validateScenario(state.scenario));
  }

  // Stakeholders array check
  if (!Array.isArray(state.stakeholders)) {
    errors.push({ path: 'stakeholders', message: 'La lista de stakeholders no es válida.' });
  } else {
    // Min stakeholders
    if (state.stakeholders.length < 2) {
      errors.push({
        path: 'stakeholders',
        message: 'Se requieren al menos 2 stakeholders para una negociación.',
      });
    }
    if (state.stakeholders.length > MAX_STAKEHOLDERS) {
      errors.push({
        path: 'stakeholders',
        message: `Se permiten un máximo de ${MAX_STAKEHOLDERS} stakeholders.`,
      });
    }

    // Duplicate stakeholder names
    const shNames = state.stakeholders
      .map((s) => s.name?.trim().toLowerCase())
      .filter(Boolean);
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const name of shNames) {
      if (seen.has(name)) dupes.add(name);
      seen.add(name);
    }
    if (dupes.size > 0) {
      errors.push({
        path: 'stakeholders',
        message: `Nombres de stakeholders duplicados: ${[...dupes].join(', ')}. Cada stakeholder debe tener un nombre único.`,
      });
    }

    for (let i = 0; i < state.stakeholders.length; i++) {
      errors.push(...validateStakeholder(state.stakeholders[i], i));
    }
  }

  // Options array check
  if (!Array.isArray(state.options)) {
    errors.push({ path: 'options', message: 'La lista de opciones no es válida.' });
  } else {
    // Min options
    if (state.options.length < 2) {
      errors.push({
        path: 'options',
        message: 'Se requieren al menos 2 opciones de inversión.',
      });
    }
    if (state.options.length > MAX_OPTIONS) {
      errors.push({
        path: 'options',
        message: `Se permiten un máximo de ${MAX_OPTIONS} opciones.`,
      });
    }

    // Duplicate option names
    const optNames = state.options
      .map((o) => o.name?.trim().toLowerCase())
      .filter(Boolean);
    const seenOpt = new Set<string>();
    const dupesOpt = new Set<string>();
    for (const name of optNames) {
      if (seenOpt.has(name)) dupesOpt.add(name);
      seenOpt.add(name);
    }
    if (dupesOpt.size > 0) {
      errors.push({
        path: 'options',
        message: `Nombres de opciones duplicados: ${[...dupesOpt].join(', ')}. Cada opción debe tener un nombre único.`,
      });
    }

    const budget = state.scenario && isValidNum(state.scenario.budget) ? num(state.scenario.budget) : 0;
    for (let i = 0; i < state.options.length; i++) {
      errors.push(...validateOption(state.options[i], i, budget));
    }
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
