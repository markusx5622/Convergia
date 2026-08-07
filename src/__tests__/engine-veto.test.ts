import { describe, it, expect } from 'vitest';
import {
  isRedLineViolated,
  findVetoes,
  getEliminatedOptionIds,
  applyVetoesToScores,
} from '@/engine/veto';
import { Stakeholder, InvestmentOption, RedLine } from '@/engine/types';

describe('Engine: Veto', () => {
  const optA = { id: 'optA', impacts: { financialReturn: 50, environmentalImpact: 10 } } as unknown as InvestmentOption;
  const optB = { id: 'optB', impacts: { financialReturn: 10, environmentalImpact: 90 } } as unknown as InvestmentOption;

  describe('isRedLineViolated', () => {
    it('violates "lt" operator if impact < threshold', () => {
      const rl: RedLine = { variable: 'financialReturn', operator: 'lt', threshold: 20, description: 'Low ROI' };
      expect(isRedLineViolated(rl, optA)).toBe(false); // 50 < 20 = false
      expect(isRedLineViolated(rl, optB)).toBe(true);  // 10 < 20 = true
    });

    it('violates "gt" operator if impact > threshold', () => {
      const rl: RedLine = { variable: 'environmentalImpact', operator: 'gt', threshold: 50, description: 'High Carbon' };
      expect(isRedLineViolated(rl, optA)).toBe(false); // 10 > 50 = false
      expect(isRedLineViolated(rl, optB)).toBe(true);  // 90 > 50 = true
    });
  });

  describe('findVetoes', () => {
    it('collects all vetoes for all stakeholders and options', () => {
      const rl1: RedLine = { variable: 'financialReturn', operator: 'lt', threshold: 20, description: 'ROI' };
      const rl2: RedLine = { variable: 'environmentalImpact', operator: 'gt', threshold: 50, description: 'Eco' };
      const s1 = { id: 's1', redLines: [rl1] } as Stakeholder;
      const s2 = { id: 's2', redLines: [rl2] } as Stakeholder;

      const vetoes = findVetoes([s1, s2], [optA, optB]);
      expect(vetoes).toHaveLength(2);
      expect(vetoes).toContainEqual({ stakeholderId: 's1', optionId: 'optB', redLineDescription: 'ROI' });
      expect(vetoes).toContainEqual({ stakeholderId: 's2', optionId: 'optB', redLineDescription: 'Eco' });
    });
  });

  describe('getEliminatedOptionIds', () => {
    it('returns options with >= 2 vetoes from distinct stakeholders', () => {
      const vetoes = [
        { stakeholderId: 's1', optionId: 'optA', redLineDescription: '' },
        { stakeholderId: 's1', optionId: 'optA', redLineDescription: '' }, // same stakeholder, shouldn't count as 2 distinct
        { stakeholderId: 's1', optionId: 'optB', redLineDescription: '' },
        { stakeholderId: 's2', optionId: 'optB', redLineDescription: '' }, // optB has 2 distinct
      ];
      expect(getEliminatedOptionIds(vetoes)).toEqual(['optB']);
    });
  });

  describe('applyVetoesToScores', () => {
    it('zeroes out scores for vetoed options', () => {
      const scores = {
        s1: { optA: 100, optB: 200 },
        s2: { optA: 300, optB: 400 },
      };
      const vetoes = [
        { stakeholderId: 's1', optionId: 'optB', redLineDescription: '' },
      ];
      const result = applyVetoesToScores(scores, vetoes);
      
      expect(result.s1.optA).toBe(100);
      expect(result.s1.optB).toBe(0); // Zeroed
      expect(result.s2.optA).toBe(300);
      expect(result.s2.optB).toBe(400); // Unaffected
    });
  });
});
