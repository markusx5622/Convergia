import { describe, it, expect } from 'vitest';
import {
  calculateGap,
  hasMajorityPressure,
  shouldConcede,
  adjustWeights,
  processConcessions,
} from '@/engine/concession';
import { Stakeholder, VariableId, InvestmentOption } from '@/engine/types';

describe('Engine: Concession', () => {
  describe('calculateGap', () => {
    it('returns 0 if preferred is global winner', () => {
      expect(calculateGap({ optA: 100, optB: 80 }, 'optA', 'optA')).toBe(0);
    });

    it('returns score difference between preferred and winner', () => {
      // preferred=optA (100), winner=optB (60). gap = 40
      expect(calculateGap({ optA: 100, optB: 60 }, 'optA', 'optB')).toBe(40);
    });
  });

  describe('hasMajorityPressure', () => {
    it('returns true if >=3 OTHER stakeholders share the same top option', () => {
      const rankings = {
        s1: ['optA', 'optB'], // current
        s2: ['optB', 'optA'], // other 1
        s3: ['optB', 'optC'], // other 2
        s4: ['optB', 'optD'], // other 3
      };
      // For s1, optB is top for 3 others (s2, s3, s4). And s1 top is optA != optB. 
      // So s1 feels pressure.
      expect(hasMajorityPressure(rankings, 's1')).toBe(true);
    });

    it('returns false if <3 OTHER stakeholders share a top option', () => {
      const rankings = {
        s1: ['optA', 'optB'],
        s2: ['optB', 'optA'],
        s3: ['optB', 'optC'],
        s4: ['optC', 'optD'],
      };
      expect(hasMajorityPressure(rankings, 's1')).toBe(false);
    });
  });

  describe('shouldConcede', () => {
    it('returns true if gap > threshold (no pressure)', () => {
      expect(shouldConcede(50, 40, false)).toBe(true);
      expect(shouldConcede(30, 40, false)).toBe(false);
    });

    it('reduces threshold by 1.5x when pressure is true', () => {
      // gap = 30, threshold = 40. Without pressure = false.
      // With pressure, threshold = 40 / 1.5 = 26.66. gap(30) > 26.66 => true.
      expect(shouldConcede(30, 40, true)).toBe(true);
    });
  });

  describe('adjustWeights', () => {
    it('blends weights towards average and normalises', () => {
      const s1 = { weights: { productionEfficiency: 1, qualityImprovement: 0, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0 } } as Stakeholder;
      const s2 = { weights: { productionEfficiency: 0, qualityImprovement: 1, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0 } } as Stakeholder;
      
      // Avg: prod=0.5, qual=0.5
      // Blend s1 with rate=0.5:
      // prod: 1 * 0.5 + 0.5 * 0.5 = 0.5 + 0.25 = 0.75
      // qual: 0 * 0.5 + 0.5 * 0.5 = 0.25
      // total = 1.0 (no normalisation needed)
      const adjusted = adjustWeights(s1, [s1, s2], 0.5);
      expect(adjusted.productionEfficiency).toBe(0.75);
      expect(adjusted.qualityImprovement).toBe(0.25);
    });
  });

  describe('processConcessions', () => {
    it('returns concessions and updated stakeholders', () => {
      const dummyWeights: Record<VariableId, number> = {
        productionEfficiency: 1, qualityImprovement: 0, financialReturn: 0, environmentalImpact: 0, implementationRisk: 0, operationalResilience: 0
      };
      const s1 = { id: 's1', concessionThreshold: 10, concessionRate: 0.1, weights: dummyWeights } as Stakeholder;
      const stakeholders = [s1];
      const rankings = { s1: ['optA', 'optB'] };
      const scores = { s1: { optA: 100, optB: 50 } };
      // Winner is optB. gap = 100 - 50 = 50. 
      // 50 > 10 (threshold) -> should concede.
      
      const { concessions, updatedStakeholders } = processConcessions(stakeholders, rankings, scores, 'optB');
      
      expect(concessions).toHaveLength(1);
      expect(concessions[0].stakeholderId).toBe('s1');
      expect(concessions[0].gap).toBe(50);
      expect(updatedStakeholders).toHaveLength(1);
    });
  });
});
