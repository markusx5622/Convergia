import { describe, it, expect } from 'vitest';
import { runSimulation } from '@/engine/simulation';
import { Scenario, Stakeholder, InvestmentOption, VariableId } from '@/engine/types';

describe('Engine: Simulation Pipeline', () => {
  const scenario: Scenario = { id: 'test-scenario', name: 'Test', company: 'Test Co', description: '', budget: 1000, kpis: [] };

  const dummyWeights: Record<VariableId, number> = {
    productionEfficiency: 0.5, qualityImprovement: 0.5, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0
  };

  const s1: Stakeholder = {
    id: 's1', name: 'S1', role: '', mission: '', objectives: [], priorities: [],
    weights: dummyWeights,
    redLines: [],
    concessionThreshold: 20, concessionRate: 0.1, acceptabilityThreshold: 50,
    style: { argumentative: '', concession: '' }
  };
  const s2: Stakeholder = { ...s1, id: 's2' };

  const optA: InvestmentOption = {
    id: 'optA', name: 'Opt A', cost: 100, description: '', risks: [], favors: [], tensionWith: [],
    impacts: { productionEfficiency: 100, qualityImprovement: 100, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0 }
  };
  const optB: InvestmentOption = {
    id: 'optB', name: 'Opt B', cost: 100, description: '', risks: [], favors: [], tensionWith: [],
    impacts: { productionEfficiency: 50, qualityImprovement: 50, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0 }
  };

  it('runs multiple rounds and computes a final option', () => {
    const result = runSimulation(scenario, [s1, s2], [optA, optB], 2);
    
    expect(result.rounds).toHaveLength(2);
    expect(result.finalOption?.id).toBe('optA'); // optA has higher impacts (100 vs 50)
    expect(result.consensusStatus).toBe('full');
    expect(result.rounds[0].scores.s1.optA).toBe(100);
    expect(result.rounds[0].scores.s1.optB).toBe(50);
  });

  it('eliminates options with >= 2 vetoes', () => {
    const s1Veto: Stakeholder = {
      ...s1,
      redLines: [{ variable: 'productionEfficiency', operator: 'lt', threshold: 60, description: '' }]
    };
    const s2Veto: Stakeholder = {
      ...s2,
      redLines: [{ variable: 'productionEfficiency', operator: 'lt', threshold: 60, description: '' }]
    };
    // optB has 50 < 60, so both s1 and s2 will veto optB.

    const result = runSimulation(scenario, [s1Veto, s2Veto], [optA, optB], 1);
    
    expect(result.rounds[0].eliminatedOptionIds).toContain('optB');
    // optA should be the only one active and therefore the winner
    expect(result.finalOption?.id).toBe('optA');
  });
});
