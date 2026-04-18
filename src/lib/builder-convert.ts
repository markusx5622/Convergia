/**
 * Conversion utilities: Draft types → Engine types.
 *
 * These pure functions take the mutable BuilderState
 * and produce the immutable engine types needed by runSimulation().
 */

import type { Scenario, Stakeholder, InvestmentOption, VariableId } from '@/engine/types';
import { VARIABLE_IDS } from '@/engine/types';
import type { BuilderState } from './builder-types';

function toNum(v: string, fallback = 0): number {
  const n = parseFloat(v);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}

function generateId(prefix: string, idx: number): string {
  return `${prefix}-${idx}`;
}

/* ── Build Scenario ── */

export function buildScenario(state: BuilderState): Scenario {
  return {
    id: `custom-${Date.now()}`,
    name: state.scenario.name.trim(),
    company: state.scenario.company.trim(),
    description: state.scenario.description.trim(),
    budget: toNum(state.scenario.budget),
    kpis: state.scenario.kpis.map((k) => ({
      name: k.name.trim(),
      current: toNum(k.current),
      unit: k.unit.trim(),
    })),
  };
}

/* ── Build Stakeholders ── */

export function buildStakeholders(state: BuilderState): Stakeholder[] {
  return state.stakeholders.map((s, i) => {
    const weights: Record<VariableId, number> = {} as Record<VariableId, number>;
    for (const v of VARIABLE_IDS) {
      weights[v] = toNum(s.weights[v]);
    }

    return {
      id: generateId('sh', i),
      name: s.name.trim(),
      role: s.role.trim(),
      mission: '',
      objectives: [],
      priorities: [],
      weights,
      redLines: s.redLines.map((rl) => ({
        variable: rl.variable,
        operator: rl.operator,
        threshold: toNum(rl.threshold),
        description: rl.description.trim(),
      })),
      concessionThreshold: toNum(s.concessionThreshold, 0.10),
      concessionRate: toNum(s.concessionRate, 0.12),
      acceptabilityThreshold: toNum(s.acceptabilityThreshold, 0.30),
      style: {
        argumentative: `${s.name} argumenta basándose en su rol de ${s.role}.`,
        concession: `${s.name} puede ceder cuando el gap supera su umbral.`,
      },
    };
  });
}

/* ── Build Options ── */

export function buildOptions(state: BuilderState): InvestmentOption[] {
  return state.options.map((o, i) => {
    const impacts: Record<VariableId, number> = {} as Record<VariableId, number>;
    for (const v of VARIABLE_IDS) {
      impacts[v] = toNum(o.impacts[v]);
    }

    return {
      id: generateId('opt', i),
      name: o.name.trim(),
      cost: toNum(o.cost),
      description: o.description.trim(),
      impacts,
      risks: o.risks
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      favors: [],
      tensionWith: [],
    };
  });
}
