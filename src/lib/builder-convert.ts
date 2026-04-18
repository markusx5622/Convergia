/**
 * Conversion utilities: Draft types → Engine types.
 *
 * These pure functions take the mutable BuilderState
 * and produce the immutable engine types needed by runSimulation().
 *
 * Values are clamped to valid ranges to guarantee the engine receives clean data.
 */

import type { Scenario, Stakeholder, InvestmentOption, VariableId } from '@/engine/types';
import { VARIABLE_IDS } from '@/engine/types';
import type { BuilderState, DraftStakeholder, DraftOption } from './builder-types';

function toNum(v: unknown, fallback = 0): number {
  if (typeof v === 'number') return isFinite(v) ? v : fallback;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return isNaN(n) || !isFinite(n) ? fallback : n;
  }
  return fallback;
}

/** Clamp a number to [min, max] */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function generateId(prefix: string, idx: number): string {
  return `${prefix}-${idx}`;
}

/**
 * Normalise weights so they sum to exactly 1.0.
 * If all weights are zero, distributes equally.
 */
function normalizeWeights(raw: Record<VariableId, number>): Record<VariableId, number> {
  let sum = 0;
  for (const v of VARIABLE_IDS) {
    sum += raw[v];
  }
  const result: Record<VariableId, number> = {} as Record<VariableId, number>;
  if (sum === 0) {
    const equal = 1 / VARIABLE_IDS.length;
    for (const v of VARIABLE_IDS) {
      result[v] = Math.round(equal * 10000) / 10000;
    }
  } else {
    for (const v of VARIABLE_IDS) {
      result[v] = Math.round((raw[v] / sum) * 10000) / 10000;
    }
  }
  return result;
}

/* ── Build Scenario ── */

export function buildScenario(state: BuilderState): Scenario {
  const s = state.scenario;
  return {
    id: `custom-${Date.now()}`,
    name: (s?.name ?? '').trim() || 'Escenario personalizado',
    company: (s?.company ?? '').trim() || 'Empresa',
    description: (s?.description ?? '').trim() || '',
    budget: Math.max(0, toNum(s?.budget)),
    kpis: Array.isArray(s?.kpis)
      ? s.kpis.map((k) => ({
          name: (k?.name ?? '').trim(),
          current: toNum(k?.current),
          unit: (k?.unit ?? '').trim(),
        }))
      : [],
  };
}

/* ── Build single stakeholder (exported for testability) ── */

export function buildSingleStakeholder(s: DraftStakeholder, idx: number): Stakeholder {
  const rawWeights: Record<VariableId, number> = {} as Record<VariableId, number>;
  for (const v of VARIABLE_IDS) {
    rawWeights[v] = clamp(toNum(s.weights?.[v]), 0, 1);
  }
  const weights = normalizeWeights(rawWeights);

  return {
    id: generateId('sh', idx),
    name: (s.name ?? '').trim() || `Stakeholder ${idx + 1}`,
    role: (s.role ?? '').trim() || 'Sin rol',
    mission: '',
    objectives: [],
    priorities: [],
    weights,
    redLines: Array.isArray(s.redLines)
      ? s.redLines
          .filter((rl) => rl && VARIABLE_IDS.includes(rl.variable))
          .map((rl) => ({
            variable: rl.variable,
            operator: rl.operator === 'gt' ? 'gt' as const : 'lt' as const,
            threshold: clamp(toNum(rl.threshold), 0, 1),
            description: (rl.description ?? '').trim(),
          }))
      : [],
    concessionThreshold: clamp(toNum(s.concessionThreshold, 0.10), 0, 1),
    concessionRate: clamp(toNum(s.concessionRate, 0.12), 0, 1),
    acceptabilityThreshold: clamp(toNum(s.acceptabilityThreshold, 0.30), 0, 1),
    style: {
      argumentative: `${(s.name ?? '').trim()} argumenta basándose en su rol de ${(s.role ?? '').trim()}.`,
      concession: `${(s.name ?? '').trim()} puede ceder cuando el gap supera su umbral.`,
    },
  };
}

/* ── Build Stakeholders ── */

export function buildStakeholders(state: BuilderState): Stakeholder[] {
  if (!Array.isArray(state.stakeholders)) return [];
  return state.stakeholders.map((s, i) => buildSingleStakeholder(s, i));
}

/* ── Build single option (exported for testability) ── */

export function buildSingleOption(o: DraftOption, idx: number): InvestmentOption {
  const impacts: Record<VariableId, number> = {} as Record<VariableId, number>;
  for (const v of VARIABLE_IDS) {
    impacts[v] = clamp(toNum(o.impacts?.[v]), 0, 1);
  }

  const risksStr = typeof o.risks === 'string' ? o.risks : '';

  return {
    id: generateId('opt', idx),
    name: (o.name ?? '').trim() || `Opción ${idx + 1}`,
    cost: Math.max(0, toNum(o.cost)),
    description: (o.description ?? '').trim(),
    impacts,
    risks: risksStr
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean),
    favors: [],
    tensionWith: [],
  };
}

/* ── Build Options ── */

export function buildOptions(state: BuilderState): InvestmentOption[] {
  if (!Array.isArray(state.options)) return [];
  return state.options.map((o, i) => buildSingleOption(o, i));
}
