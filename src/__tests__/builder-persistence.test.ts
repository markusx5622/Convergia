/**
 * Unit tests for builder-persistence.ts
 *
 * Covers: sanitizeBuilderState, importFromJSON shape validation,
 * and export/import round-trip safety.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeBuilderState } from '@/lib/builder-persistence';
import { VARIABLE_IDS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

/* ── Factory helpers ── */

function fullValidState() {
  const weights: Record<string, string> = {};
  const impacts: Record<string, string> = {};
  for (const v of VARIABLE_IDS) {
    weights[v] = (1 / VARIABLE_IDS.length).toFixed(4);
    impacts[v] = '0.50';
  }

  return {
    scenario: {
      name: 'Test',
      company: 'Acme',
      description: 'Desc',
      budget: '100000',
      kpis: [{ uid: 'kpi-1', name: 'OEE', current: '72', unit: '%' }],
    },
    stakeholders: [
      {
        uid: 'sh-1',
        name: 'SH1',
        role: 'Role1',
        weights,
        redLines: [
          { uid: 'rl-1', variable: VARIABLE_IDS[0], operator: 'lt', threshold: '0.10', description: 'test' },
        ],
        concessionThreshold: '0.10',
        concessionRate: '0.12',
        acceptabilityThreshold: '0.30',
      },
    ],
    options: [
      {
        uid: 'opt-1',
        name: 'Option A',
        cost: '50000',
        description: 'Desc',
        risks: 'risk1',
        impacts,
      },
    ],
  };
}

/* ══════════════════════════════════════════════════════════════════════
   sanitizeBuilderState
   ══════════════════════════════════════════════════════════════════════ */

describe('sanitizeBuilderState', () => {
  it('returns a valid BuilderState for a well-formed object', () => {
    const result = sanitizeBuilderState(fullValidState());
    expect(result).not.toBeNull();
    expect(result!.scenario.name).toBe('Test');
    expect(result!.stakeholders).toHaveLength(1);
    expect(result!.options).toHaveLength(1);
  });

  it('returns null for non-object input', () => {
    expect(sanitizeBuilderState(null)).toBeNull();
    expect(sanitizeBuilderState(undefined)).toBeNull();
    expect(sanitizeBuilderState('string')).toBeNull();
    expect(sanitizeBuilderState(42)).toBeNull();
    expect(sanitizeBuilderState([])).toBeNull();
  });

  it('fills missing scenario fields with defaults', () => {
    const result = sanitizeBuilderState({ scenario: {}, stakeholders: [], options: [] });
    expect(result).not.toBeNull();
    expect(result!.scenario.name).toBe('');
    expect(result!.scenario.budget).toBe('');
    expect(result!.scenario.kpis).toEqual([]);
  });

  it('recovers from completely missing scenario', () => {
    const result = sanitizeBuilderState({ stakeholders: [], options: [] });
    expect(result).not.toBeNull();
    expect(result!.scenario.name).toBe('');
  });

  it('fills missing stakeholder fields with defaults', () => {
    const result = sanitizeBuilderState({
      scenario: { name: 'test' },
      stakeholders: [{ name: 'SH1' }],
      options: [],
    });
    expect(result).not.toBeNull();
    const sh = result!.stakeholders[0];
    expect(sh.name).toBe('SH1');
    expect(sh.role).toBe('');
    expect(sh.concessionThreshold).toBe('0.10');
    expect(sh.concessionRate).toBe('0.12');
    expect(sh.acceptabilityThreshold).toBe('0.30');
    // All VARIABLE_IDS should have weights
    for (const v of VARIABLE_IDS) {
      expect(sh.weights[v as VariableId]).toBeDefined();
    }
  });

  it('fills missing option fields with defaults', () => {
    const result = sanitizeBuilderState({
      scenario: { name: 'test' },
      stakeholders: [],
      options: [{ name: 'Opt' }],
    });
    expect(result).not.toBeNull();
    const opt = result!.options[0];
    expect(opt.name).toBe('Opt');
    expect(opt.cost).toBe('');
    expect(opt.risks).toBe('');
    for (const v of VARIABLE_IDS) {
      expect(opt.impacts[v as VariableId]).toBeDefined();
    }
  });

  it('skips non-object entries in stakeholders array', () => {
    const result = sanitizeBuilderState({
      scenario: {},
      stakeholders: [{ name: 'Valid' }, null, 'string', 42, { name: 'Also Valid' }],
      options: [],
    });
    expect(result).not.toBeNull();
    expect(result!.stakeholders).toHaveLength(2);
  });

  it('skips non-object entries in options array', () => {
    const result = sanitizeBuilderState({
      scenario: {},
      stakeholders: [],
      options: [null, { name: 'Valid Opt' }, undefined],
    });
    expect(result).not.toBeNull();
    expect(result!.options).toHaveLength(1);
  });

  it('filters red lines with invalid variable IDs', () => {
    const result = sanitizeBuilderState({
      scenario: {},
      stakeholders: [
        {
          name: 'SH',
          redLines: [
            { variable: VARIABLE_IDS[0], operator: 'lt', threshold: '0.1', description: 'ok' },
            { variable: 'invalidVar', operator: 'gt', threshold: '0.2', description: 'bad' },
          ],
        },
      ],
      options: [],
    });
    expect(result).not.toBeNull();
    expect(result!.stakeholders[0].redLines).toHaveLength(1);
    expect(result!.stakeholders[0].redLines[0].variable).toBe(VARIABLE_IDS[0]);
  });

  it('handles numeric values in string fields (e.g. from hand-edited JSON)', () => {
    const result = sanitizeBuilderState({
      scenario: { name: 'test', budget: 50000 },
      stakeholders: [{ name: 'SH', concessionThreshold: 0.15 }],
      options: [{ name: 'Opt', cost: 30000 }],
    });
    expect(result).not.toBeNull();
    expect(result!.scenario.budget).toBe('50000');
    expect(result!.stakeholders[0].concessionThreshold).toBe('0.15');
    expect(result!.options[0].cost).toBe('30000');
  });

  it('generates UIDs for entries missing them', () => {
    const result = sanitizeBuilderState({
      scenario: {},
      stakeholders: [{ name: 'SH' }],
      options: [{ name: 'Opt' }],
    });
    expect(result).not.toBeNull();
    expect(result!.stakeholders[0].uid).toBeTruthy();
    expect(result!.options[0].uid).toBeTruthy();
  });

  it('handles deeply corrupt data without crashing', () => {
    // Completely wrong types
    const result = sanitizeBuilderState({
      scenario: 'not an object',
      stakeholders: 'not an array',
      options: 42,
    });
    expect(result).not.toBeNull();
    expect(result!.stakeholders).toHaveLength(0);
    expect(result!.options).toHaveLength(0);
  });
});
