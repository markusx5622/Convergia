/**
 * Unit tests for builder-validation.ts
 *
 * Covers: scenario, stakeholder, option, and full-state validation.
 */

import { describe, it, expect } from 'vitest';
import {
  validateScenario,
  validateStakeholder,
  validateOption,
  validateAll,
  sectionHasErrors,
  WEIGHT_SUM_TOLERANCE,
} from '@/lib/builder-validation';
import type {
  BuilderState,
  DraftScenario,
  DraftStakeholder,
  DraftOption,
} from '@/lib/builder-types';
import { VARIABLE_IDS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

/* ── Factory helpers ── */

function validScenario(): DraftScenario {
  return {
    name: 'Test Scenario',
    company: 'Acme Corp',
    description: 'A test scenario for validation',
    budget: '100000',
    kpis: [],
  };
}

function validWeights(): Record<VariableId, string> {
  const w: Partial<Record<VariableId, string>> = {};
  const share = (1 / VARIABLE_IDS.length).toFixed(4);
  // Assign equal share, adjust last to ensure sum = 1.0
  for (let i = 0; i < VARIABLE_IDS.length; i++) {
    w[VARIABLE_IDS[i]] = share;
  }
  // Adjust last to compensate for rounding
  const sum = VARIABLE_IDS.slice(0, -1).reduce((acc, v) => acc + parseFloat(w[v]!), 0);
  w[VARIABLE_IDS[VARIABLE_IDS.length - 1]] = (1 - sum).toFixed(4);
  return w as Record<VariableId, string>;
}

function validStakeholder(name = 'Stakeholder 1', role = 'Director'): DraftStakeholder {
  return {
    uid: 'test-sh-1',
    name,
    role,
    weights: validWeights(),
    redLines: [],
    concessionThreshold: '0.10',
    concessionRate: '0.12',
    acceptabilityThreshold: '0.30',
  };
}

function validImpacts(): Record<VariableId, string> {
  const imp: Partial<Record<VariableId, string>> = {};
  for (const v of VARIABLE_IDS) {
    imp[v] = '0.50';
  }
  return imp as Record<VariableId, string>;
}

function validOption(name = 'Option A', cost = '50000'): DraftOption {
  return {
    uid: 'test-opt-1',
    name,
    cost,
    description: 'A test option',
    risks: 'risk1, risk2',
    impacts: validImpacts(),
  };
}

function validState(): BuilderState {
  return {
    scenario: validScenario(),
    stakeholders: [validStakeholder('SH1', 'Role1'), validStakeholder('SH2', 'Role2')],
    options: [validOption('Opt A', '50000'), validOption('Opt B', '60000')],
  };
}

/* ══════════════════════════════════════════════════════════════════════
   SCENARIO VALIDATION
   ══════════════════════════════════════════════════════════════════════ */

describe('validateScenario', () => {
  it('returns no errors for a valid scenario', () => {
    expect(validateScenario(validScenario())).toHaveLength(0);
  });

  it('flags empty name', () => {
    const s = { ...validScenario(), name: '   ' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.name')).toBe(true);
  });

  it('flags empty company', () => {
    const s = { ...validScenario(), company: '' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.company')).toBe(true);
  });

  it('flags empty description', () => {
    const s = { ...validScenario(), description: '' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.description')).toBe(true);
  });

  it('flags non-numeric budget', () => {
    const s = { ...validScenario(), budget: 'abc' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.budget')).toBe(true);
  });

  it('flags zero budget', () => {
    const s = { ...validScenario(), budget: '0' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.budget')).toBe(true);
  });

  it('flags negative budget', () => {
    const s = { ...validScenario(), budget: '-500' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.budget')).toBe(true);
  });

  it('flags empty string budget', () => {
    const s = { ...validScenario(), budget: '' };
    const errs = validateScenario(s);
    expect(errs.some((e) => e.path === 'scenario.budget')).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   STAKEHOLDER VALIDATION
   ══════════════════════════════════════════════════════════════════════ */

describe('validateStakeholder', () => {
  it('returns no errors for a valid stakeholder', () => {
    expect(validateStakeholder(validStakeholder(), 0)).toHaveLength(0);
  });

  it('flags empty name', () => {
    const s = { ...validStakeholder(), name: '' };
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('name'))).toBe(true);
  });

  it('flags empty role', () => {
    const s = { ...validStakeholder(), role: '' };
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('role'))).toBe(true);
  });

  it('flags weight out of range (> 1)', () => {
    const s = validStakeholder();
    s.weights[VARIABLE_IDS[0]] = '1.5';
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('weights'))).toBe(true);
  });

  it('flags weight out of range (< 0)', () => {
    const s = validStakeholder();
    s.weights[VARIABLE_IDS[0]] = '-0.1';
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('weights'))).toBe(true);
  });

  it('flags weights that don\'t sum to 1.0', () => {
    const s = validStakeholder();
    // Set all weights to 0.5 — sum will be 3.0
    for (const v of VARIABLE_IDS) {
      s.weights[v] = '0.50';
    }
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.endsWith('.weights'))).toBe(true);
  });

  it('allows weights within tolerance', () => {
    const s = validStakeholder();
    // Manually set weights that sum to 1.0 ± WEIGHT_SUM_TOLERANCE
    const n = VARIABLE_IDS.length;
    const base = 1 / n;
    for (const v of VARIABLE_IDS) {
      s.weights[v] = base.toFixed(4);
    }
    // Slight adjustment within tolerance
    const sum = VARIABLE_IDS.reduce((acc, v) => acc + parseFloat(s.weights[v]), 0);
    expect(Math.abs(sum - 1.0)).toBeLessThanOrEqual(WEIGHT_SUM_TOLERANCE);
    const errs = validateStakeholder(s, 0);
    expect(errs.filter((e) => e.path.endsWith('.weights'))).toHaveLength(0);
  });

  it('flags invalid concession threshold', () => {
    const s = { ...validStakeholder(), concessionThreshold: '1.5' };
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('concessionThreshold'))).toBe(true);
  });

  it('flags invalid concession rate', () => {
    const s = { ...validStakeholder(), concessionRate: '-0.01' };
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('concessionRate'))).toBe(true);
  });

  it('flags invalid acceptability threshold', () => {
    const s = { ...validStakeholder(), acceptabilityThreshold: 'abc' };
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('acceptabilityThreshold'))).toBe(true);
  });

  it('flags red line with invalid threshold', () => {
    const s = validStakeholder();
    s.redLines = [
      { uid: 'rl-1', variable: VARIABLE_IDS[0], operator: 'lt', threshold: '1.5', description: 'test' },
    ];
    const errs = validateStakeholder(s, 0);
    expect(errs.some((e) => e.path.includes('redLines'))).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   OPTION VALIDATION
   ══════════════════════════════════════════════════════════════════════ */

describe('validateOption', () => {
  it('returns no errors for a valid option', () => {
    expect(validateOption(validOption(), 0, 100000)).toHaveLength(0);
  });

  it('flags empty name', () => {
    const o = { ...validOption(), name: '' };
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('name'))).toBe(true);
  });

  it('flags non-numeric cost', () => {
    const o = { ...validOption(), cost: 'free' };
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('cost'))).toBe(true);
  });

  it('flags zero cost', () => {
    const o = { ...validOption(), cost: '0' };
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('cost'))).toBe(true);
  });

  it('flags cost exceeding budget', () => {
    const o = { ...validOption(), cost: '200000' };
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('cost') && e.message.includes('excede'))).toBe(true);
  });

  it('does not flag cost exceeding budget when budget is 0', () => {
    const o = { ...validOption(), cost: '200000' };
    const errs = validateOption(o, 0, 0);
    expect(errs.filter((e) => e.message.includes('excede'))).toHaveLength(0);
  });

  it('flags impact out of range', () => {
    const o = validOption();
    o.impacts[VARIABLE_IDS[0]] = '1.5';
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('impacts'))).toBe(true);
  });

  it('flags negative impact', () => {
    const o = validOption();
    o.impacts[VARIABLE_IDS[0]] = '-0.1';
    const errs = validateOption(o, 0, 100000);
    expect(errs.some((e) => e.path.includes('impacts'))).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   FULL STATE VALIDATION
   ══════════════════════════════════════════════════════════════════════ */

describe('validateAll', () => {
  it('returns no errors for a fully valid state', () => {
    expect(validateAll(validState())).toHaveLength(0);
  });

  it('flags fewer than 2 stakeholders', () => {
    const s = validState();
    s.stakeholders = [validStakeholder('SH1', 'Role1')];
    const errs = validateAll(s);
    expect(errs.some((e) => e.message.includes('al menos 2 stakeholders'))).toBe(true);
  });

  it('flags fewer than 2 options', () => {
    const s = validState();
    s.options = [validOption()];
    const errs = validateAll(s);
    expect(errs.some((e) => e.message.includes('al menos 2 opciones'))).toBe(true);
  });

  it('flags duplicate stakeholder names', () => {
    const s = validState();
    s.stakeholders = [validStakeholder('DuplicateName', 'R1'), validStakeholder('DuplicateName', 'R2')];
    const errs = validateAll(s);
    expect(errs.some((e) => e.message.includes('duplicados'))).toBe(true);
  });

  it('flags duplicate option names', () => {
    const s = validState();
    s.options = [validOption('Same Name', '50000'), validOption('Same Name', '60000')];
    const errs = validateAll(s);
    expect(errs.some((e) => e.message.includes('duplicados'))).toBe(true);
  });

  it('collects scenario + stakeholder + option errors', () => {
    const s = validState();
    s.scenario.name = '';
    s.stakeholders[0].name = '';
    s.options[0].cost = '';
    const errs = validateAll(s);
    expect(errs.some((e) => e.path.startsWith('scenario'))).toBe(true);
    expect(errs.some((e) => e.path.startsWith('stakeholders'))).toBe(true);
    expect(errs.some((e) => e.path.startsWith('options'))).toBe(true);
  });

  it('handles null/undefined state gracefully', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errs = validateAll(null as any);
    expect(errs.length).toBeGreaterThan(0);
    expect(errs[0].message).toContain('no es válido');
  });
});

/* ══════════════════════════════════════════════════════════════════════
   sectionHasErrors
   ══════════════════════════════════════════════════════════════════════ */

describe('sectionHasErrors', () => {
  it('returns true when section has errors', () => {
    const errs = [{ path: 'scenario.name', message: 'err' }];
    expect(sectionHasErrors(errs, 'scenario')).toBe(true);
  });

  it('returns false when section has no errors', () => {
    const errs = [{ path: 'stakeholders[0].name', message: 'err' }];
    expect(sectionHasErrors(errs, 'scenario')).toBe(false);
  });
});
