/**
 * Builder state management hook.
 *
 * Single source of truth for the whole Scenario Studio.
 * Uses React state + localStorage auto-save.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { VariableId } from '@/engine/types';
import { VARIABLE_IDS } from '@/engine/types';
import type {
  BuilderState,
  BuilderStep,
  DraftScenario,
  DraftStakeholder,
  DraftOption,
  DraftKPI,
  DraftRedLine,
  ValidationError,
} from './builder-types';
import { validateAll } from './builder-validation';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './builder-persistence';

/* ── Factory helpers ── */

let _uid = 0;
function uid(): string {
  return `uid-${Date.now()}-${++_uid}`;
}

function emptyWeights(): Record<VariableId, string> {
  const w: Partial<Record<VariableId, string>> = {};
  const share = (1 / VARIABLE_IDS.length).toFixed(3);
  for (const v of VARIABLE_IDS) {
    w[v] = share;
  }
  return w as Record<VariableId, string>;
}

function emptyImpacts(): Record<VariableId, string> {
  const imp: Partial<Record<VariableId, string>> = {};
  for (const v of VARIABLE_IDS) {
    imp[v] = '0.50';
  }
  return imp as Record<VariableId, string>;
}

export function createEmptyStakeholder(): DraftStakeholder {
  return {
    uid: uid(),
    name: '',
    role: '',
    weights: emptyWeights(),
    redLines: [],
    concessionThreshold: '0.10',
    concessionRate: '0.12',
    acceptabilityThreshold: '0.30',
  };
}

export function createEmptyOption(): DraftOption {
  return {
    uid: uid(),
    name: '',
    cost: '',
    description: '',
    risks: '',
    impacts: emptyImpacts(),
  };
}

export function createEmptyKPI(): DraftKPI {
  return { uid: uid(), name: '', current: '', unit: '' };
}

export function createEmptyRedLine(): DraftRedLine {
  return {
    uid: uid(),
    variable: VARIABLE_IDS[0],
    operator: 'lt',
    threshold: '0.10',
    description: '',
  };
}

function defaultState(): BuilderState {
  return {
    scenario: {
      name: '',
      company: '',
      description: '',
      budget: '',
      kpis: [],
    },
    stakeholders: [createEmptyStakeholder(), createEmptyStakeholder()],
    options: [createEmptyOption(), createEmptyOption()],
  };
}

/* ── Hook ── */

export function useBuilderStore() {
  const [state, setState] = useState<BuilderState>(defaultState);
  const [step, setStep] = useState<BuilderStep>('scenario');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const initialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved = loadFromLocalStorage();
    if (saved) setState(saved);
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (initialized.current) {
      saveToLocalStorage(state);
    }
  }, [state]);

  /* ── Scenario ── */
  const updateScenario = useCallback((partial: Partial<DraftScenario>) => {
    setState((prev) => ({
      ...prev,
      scenario: { ...prev.scenario, ...partial },
    }));
  }, []);

  const addKPI = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scenario: {
        ...prev.scenario,
        kpis: [...prev.scenario.kpis, createEmptyKPI()],
      },
    }));
  }, []);

  const updateKPI = useCallback((idx: number, partial: Partial<DraftKPI>) => {
    setState((prev) => {
      const kpis = [...prev.scenario.kpis];
      kpis[idx] = { ...kpis[idx], ...partial };
      return { ...prev, scenario: { ...prev.scenario, kpis } };
    });
  }, []);

  const removeKPI = useCallback((idx: number) => {
    setState((prev) => ({
      ...prev,
      scenario: {
        ...prev.scenario,
        kpis: prev.scenario.kpis.filter((_, i) => i !== idx),
      },
    }));
  }, []);

  /* ── Stakeholders ── */
  const addStakeholder = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stakeholders: [...prev.stakeholders, createEmptyStakeholder()],
    }));
  }, []);

  const removeStakeholder = useCallback((idx: number) => {
    setState((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((_, i) => i !== idx),
    }));
  }, []);

  const updateStakeholder = useCallback((idx: number, partial: Partial<DraftStakeholder>) => {
    setState((prev) => {
      const list = [...prev.stakeholders];
      list[idx] = { ...list[idx], ...partial };
      return { ...prev, stakeholders: list };
    });
  }, []);

  const updateStakeholderWeight = useCallback(
    (sIdx: number, variable: VariableId, value: string) => {
      setState((prev) => {
        const list = [...prev.stakeholders];
        list[sIdx] = {
          ...list[sIdx],
          weights: { ...list[sIdx].weights, [variable]: value },
        };
        return { ...prev, stakeholders: list };
      });
    },
    [],
  );

  const addRedLine = useCallback((sIdx: number) => {
    setState((prev) => {
      const list = [...prev.stakeholders];
      list[sIdx] = {
        ...list[sIdx],
        redLines: [...list[sIdx].redLines, createEmptyRedLine()],
      };
      return { ...prev, stakeholders: list };
    });
  }, []);

  const removeRedLine = useCallback((sIdx: number, rlIdx: number) => {
    setState((prev) => {
      const list = [...prev.stakeholders];
      list[sIdx] = {
        ...list[sIdx],
        redLines: list[sIdx].redLines.filter((_, i) => i !== rlIdx),
      };
      return { ...prev, stakeholders: list };
    });
  }, []);

  const updateRedLine = useCallback(
    (sIdx: number, rlIdx: number, partial: Partial<DraftRedLine>) => {
      setState((prev) => {
        const list = [...prev.stakeholders];
        const rls = [...list[sIdx].redLines];
        rls[rlIdx] = { ...rls[rlIdx], ...partial };
        list[sIdx] = { ...list[sIdx], redLines: rls };
        return { ...prev, stakeholders: list };
      });
    },
    [],
  );

  /* ── Options ── */
  const addOption = useCallback(() => {
    setState((prev) => ({
      ...prev,
      options: [...prev.options, createEmptyOption()],
    }));
  }, []);

  const removeOption = useCallback((idx: number) => {
    setState((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  }, []);

  const updateOption = useCallback((idx: number, partial: Partial<DraftOption>) => {
    setState((prev) => {
      const list = [...prev.options];
      list[idx] = { ...list[idx], ...partial };
      return { ...prev, options: list };
    });
  }, []);

  const updateOptionImpact = useCallback(
    (oIdx: number, variable: VariableId, value: string) => {
      setState((prev) => {
        const list = [...prev.options];
        list[oIdx] = {
          ...list[oIdx],
          impacts: { ...list[oIdx].impacts, [variable]: value },
        };
        return { ...prev, options: list };
      });
    },
    [],
  );

  /* ── Validation ── */
  const validate = useCallback((): ValidationError[] => {
    const errs = validateAll(state);
    setErrors(errs);
    return errs;
  }, [state]);

  /* ── Reset ── */
  const resetAll = useCallback(() => {
    setState(defaultState());
    clearLocalStorage();
    setStep('scenario');
    setErrors([]);
  }, []);

  /* ── Load from imported state ── */
  const loadState = useCallback((newState: BuilderState) => {
    setState(newState);
    setStep('scenario');
    setErrors([]);
  }, []);

  return {
    state,
    step,
    setStep,
    errors,
    // Scenario
    updateScenario,
    addKPI,
    updateKPI,
    removeKPI,
    // Stakeholders
    addStakeholder,
    removeStakeholder,
    updateStakeholder,
    updateStakeholderWeight,
    addRedLine,
    removeRedLine,
    updateRedLine,
    // Options
    addOption,
    removeOption,
    updateOption,
    updateOptionImpact,
    // Actions
    validate,
    resetAll,
    loadState,
  };
}
