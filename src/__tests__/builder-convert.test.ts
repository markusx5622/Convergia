/**
 * Unit tests for builder-convert.ts
 *
 * Covers: scenario, stakeholder, and option conversion from Draft → Engine types.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  buildScenario,
  buildStakeholders,
  buildOptions,
  buildSingleStakeholder,
  buildSingleOption,
} from '@/lib/builder-convert';
import type { BuilderState, DraftStakeholder, DraftOption } from '@/lib/builder-types';
import { VARIABLE_IDS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

/* ── Factory helpers ── */

function equalWeights(): Record<VariableId, string> {
  const w: Partial<Record<VariableId, string>> = {};
  const share = (1 / VARIABLE_IDS.length).toFixed(4);
  for (const v of VARIABLE_IDS) {
    w[v] = share;
  }
  return w as Record<VariableId, string>;
}

function halfImpacts(): Record<VariableId, string> {
  const imp: Partial<Record<VariableId, string>> = {};
  for (const v of VARIABLE_IDS) {
    imp[v] = '0.50';
  }
  return imp as Record<VariableId, string>;
}

function makeStakeholder(overrides: Partial<DraftStakeholder> = {}): DraftStakeholder {
  return {
    uid: 'sh-1',
    name: 'Producción',
    role: 'Director',
    weights: equalWeights(),
    redLines: [],
    concessionThreshold: '0.10',
    concessionRate: '0.12',
    acceptabilityThreshold: '0.30',
    ...overrides,
  };
}

function makeOption(overrides: Partial<DraftOption> = {}): DraftOption {
  return {
    uid: 'opt-1',
    name: 'Automatización',
    cost: '95000',
    description: 'Automatizar línea principal',
    risks: 'Parada de línea, Curva aprendizaje',
    impacts: halfImpacts(),
    ...overrides,
  };
}

function makeState(overrides: Partial<BuilderState> = {}): BuilderState {
  return {
    scenario: {
      name: 'Test Scenario',
      company: 'Acme Corp',
      description: 'A test scenario',
      budget: '100000',
      kpis: [{ uid: 'kpi-1', name: 'OEE', current: '72', unit: '%' }],
    },
    stakeholders: [makeStakeholder({ uid: 'sh-1', name: 'SH1' }), makeStakeholder({ uid: 'sh-2', name: 'SH2' })],
    options: [makeOption({ uid: 'opt-1', name: 'Opt A' }), makeOption({ uid: 'opt-2', name: 'Opt B', cost: '60000' })],
    ...overrides,
  };
}

/* ══════════════════════════════════════════════════════════════════════
   SCENARIO CONVERSION
   ══════════════════════════════════════════════════════════════════════ */

describe('buildScenario', () => {
  it('converts draft scenario to engine scenario', () => {
    const state = makeState();
    const result = buildScenario(state);

    expect(result.name).toBe('Test Scenario');
    expect(result.company).toBe('Acme Corp');
    expect(result.description).toBe('A test scenario');
    expect(result.budget).toBe(100000);
    expect(result.id).toMatch(/^custom-/);
  });

  it('converts KPIs correctly', () => {
    const state = makeState();
    const result = buildScenario(state);

    expect(result.kpis).toHaveLength(1);
    expect(result.kpis[0].name).toBe('OEE');
    expect(result.kpis[0].current).toBe(72);
    expect(result.kpis[0].unit).toBe('%');
  });

  it('handles invalid budget gracefully', () => {
    const state = makeState();
    state.scenario.budget = 'invalid';
    const result = buildScenario(state);

    expect(result.budget).toBe(0);
  });

  it('handles negative budget by clamping to 0', () => {
    const state = makeState();
    state.scenario.budget = '-500';
    const result = buildScenario(state);

    expect(result.budget).toBe(0);
  });

  it('trims whitespace from string fields', () => {
    const state = makeState();
    state.scenario.name = '  Test  ';
    state.scenario.company = '  Acme  ';
    const result = buildScenario(state);

    expect(result.name).toBe('Test');
    expect(result.company).toBe('Acme');
  });

  it('falls back on missing scenario fields', () => {
    const state = makeState();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.scenario = {} as any;
    const result = buildScenario(state);

    expect(result.name).toBe('Escenario personalizado');
    expect(result.company).toBe('Empresa');
  });
});

/* ══════════════════════════════════════════════════════════════════════
   STAKEHOLDER CONVERSION
   ══════════════════════════════════════════════════════════════════════ */

describe('buildSingleStakeholder', () => {
  it('converts a valid stakeholder', () => {
    const sh = makeStakeholder();
    const result = buildSingleStakeholder(sh, 0);

    expect(result.id).toBe('sh-0');
    expect(result.name).toBe('Producción');
    expect(result.role).toBe('Director');
    expect(typeof result.concessionThreshold).toBe('number');
    expect(typeof result.concessionRate).toBe('number');
    expect(typeof result.acceptabilityThreshold).toBe('number');
  });

  it('normalizes weights to sum to 1.0', () => {
    const sh = makeStakeholder();
    const result = buildSingleStakeholder(sh, 0);

    const sum = VARIABLE_IDS.reduce((acc, v) => acc + result.weights[v], 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
  });

  it('clamps weights to [0, 1]', () => {
    const sh = makeStakeholder();
    sh.weights[VARIABLE_IDS[0]] = '2.0';
    sh.weights[VARIABLE_IDS[1]] = '-0.5';
    const result = buildSingleStakeholder(sh, 0);

    // All weights should be in [0, 1]
    for (const v of VARIABLE_IDS) {
      expect(result.weights[v]).toBeGreaterThanOrEqual(0);
      expect(result.weights[v]).toBeLessThanOrEqual(1);
    }
  });

  it('converts red lines correctly', () => {
    const sh = makeStakeholder({
      redLines: [
        { uid: 'rl-1', variable: VARIABLE_IDS[0], operator: 'lt', threshold: '0.15', description: 'Too low' },
      ],
    });
    const result = buildSingleStakeholder(sh, 0);

    expect(result.redLines).toHaveLength(1);
    expect(result.redLines[0].variable).toBe(VARIABLE_IDS[0]);
    expect(result.redLines[0].operator).toBe('lt');
    expect(result.redLines[0].threshold).toBe(0.15);
    expect(result.redLines[0].description).toBe('Too low');
  });

  it('clamps concession params to [0, 1]', () => {
    const sh = makeStakeholder({
      concessionThreshold: '1.5',
      concessionRate: '-0.1',
      acceptabilityThreshold: '2.0',
    });
    const result = buildSingleStakeholder(sh, 0);

    expect(result.concessionThreshold).toBe(1);
    expect(result.concessionRate).toBe(0);
    expect(result.acceptabilityThreshold).toBe(1);
  });

  it('uses fallback defaults for invalid concession params', () => {
    const sh = makeStakeholder({
      concessionThreshold: 'abc',
      concessionRate: '',
      acceptabilityThreshold: 'null',
    });
    const result = buildSingleStakeholder(sh, 0);

    expect(result.concessionThreshold).toBe(0.10);
    expect(result.concessionRate).toBe(0.12);
    expect(result.acceptabilityThreshold).toBe(0.30);
  });
});

describe('buildStakeholders', () => {
  it('converts array of stakeholders', () => {
    const state = makeState();
    const result = buildStakeholders(state);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('sh-0');
    expect(result[1].id).toBe('sh-1');
  });

  it('handles empty array', () => {
    const state = makeState({ stakeholders: [] });
    expect(buildStakeholders(state)).toHaveLength(0);
  });

  it('handles missing stakeholders field', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = { scenario: makeState().scenario } as any;
    expect(buildStakeholders(state)).toHaveLength(0);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   OPTION CONVERSION
   ══════════════════════════════════════════════════════════════════════ */

describe('buildSingleOption', () => {
  it('converts a valid option', () => {
    const opt = makeOption();
    const result = buildSingleOption(opt, 0);

    expect(result.id).toBe('opt-0');
    expect(result.name).toBe('Automatización');
    expect(result.cost).toBe(95000);
    expect(result.description).toBe('Automatizar línea principal');
  });

  it('splits risks by comma', () => {
    const opt = makeOption({ risks: 'Risk A, Risk B, Risk C' });
    const result = buildSingleOption(opt, 0);

    expect(result.risks).toEqual(['Risk A', 'Risk B', 'Risk C']);
  });

  it('handles empty risks string', () => {
    const opt = makeOption({ risks: '' });
    const result = buildSingleOption(opt, 0);

    expect(result.risks).toEqual([]);
  });

  it('clamps impacts to [0, 1]', () => {
    const opt = makeOption();
    opt.impacts[VARIABLE_IDS[0]] = '1.5';
    opt.impacts[VARIABLE_IDS[1]] = '-0.2';
    const result = buildSingleOption(opt, 0);

    expect(result.impacts[VARIABLE_IDS[0]]).toBe(1);
    expect(result.impacts[VARIABLE_IDS[1]]).toBe(0);
  });

  it('handles invalid cost gracefully', () => {
    const opt = makeOption({ cost: 'free' });
    const result = buildSingleOption(opt, 0);

    expect(result.cost).toBe(0);
  });

  it('clamps negative cost to 0', () => {
    const opt = makeOption({ cost: '-500' });
    const result = buildSingleOption(opt, 0);

    expect(result.cost).toBe(0);
  });
});

describe('buildOptions', () => {
  it('converts array of options', () => {
    const state = makeState();
    const result = buildOptions(state);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('opt-0');
    expect(result[1].id).toBe('opt-1');
  });

  it('handles empty array', () => {
    const state = makeState({ options: [] });
    expect(buildOptions(state)).toHaveLength(0);
  });

  it('handles missing options field', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = { scenario: makeState().scenario } as any;
    expect(buildOptions(state)).toHaveLength(0);
  });
});

/* ══════════════════════════════════════════════════════════════════════
   DETERMINISM
   ══════════════════════════════════════════════════════════════════════ */

describe('determinism', () => {
  it('produces identical output for identical input', () => {
    const state = makeState();

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    const result1 = {
      scenario: buildScenario(state),
      stakeholders: buildStakeholders(state),
      options: buildOptions(state),
    };

    const result2 = {
      scenario: buildScenario(state),
      stakeholders: buildStakeholders(state),
      options: buildOptions(state),
    };

    vi.useRealTimers();

    expect(result1).toEqual(result2);
  });
});
