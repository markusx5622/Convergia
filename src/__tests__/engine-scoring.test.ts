import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  calculateScoresForStakeholder,
  calculateAllScores,
  calculateGlobalScores,
  rankOptionsForStakeholder,
  findGlobalWinner,
} from '@/engine/scoring';
import { Stakeholder, InvestmentOption, VariableId } from '@/engine/types';

describe('Engine: Scoring', () => {
  const dummyWeights: Record<VariableId, number> = {
    productionEfficiency: 10,
    qualityImprovement: 20,
    financialReturn: 30,
    environmentalImpact: 0,
    implementationRisk: 0,
    operationalResilience: 40,
  };

  const dummyImpactsA: Record<VariableId, number> = {
    productionEfficiency: 5, // 5*10=50
    qualityImprovement: 10, // 10*20=200
    financialReturn: 2, // 2*30=60
    environmentalImpact: 0, // 0
    implementationRisk: 0, // 0
    operationalResilience: 1, // 1*40=40
  }; // Total = 350

  const dummyImpactsB: Record<VariableId, number> = {
    productionEfficiency: 1, // 10
    qualityImprovement: 1, // 20
    financialReturn: 10, // 300
    environmentalImpact: 0, // 0
    implementationRisk: 0, // 0
    operationalResilience: 1, // 40
  }; // Total = 370

  const s1 = { id: 's1', weights: dummyWeights } as Stakeholder;
  const s2 = { id: 's2', weights: dummyWeights } as Stakeholder;
  const optA = { id: 'optA', impacts: dummyImpactsA } as InvestmentOption;
  const optB = { id: 'optB', impacts: dummyImpactsB } as InvestmentOption;

  describe('calculateScore', () => {
    it('calculates weighted sum correctly', () => {
      expect(calculateScore(s1, optA)).toBe(350);
      expect(calculateScore(s1, optB)).toBe(370);
    });
  });

  describe('calculateScoresForStakeholder', () => {
    it('returns a record of scores for all options', () => {
      expect(calculateScoresForStakeholder(s1, [optA, optB])).toEqual({
        optA: 350,
        optB: 370,
      });
    });
  });

  describe('calculateAllScores', () => {
    it('returns nested record stakeholder -> option -> score', () => {
      expect(calculateAllScores([s1, s2], [optA, optB])).toEqual({
        s1: { optA: 350, optB: 370 },
        s2: { optA: 350, optB: 370 },
      });
    });
  });

  describe('calculateGlobalScores', () => {
    it('averages the scores across all stakeholders', () => {
      const s3 = {
        id: 's3',
        weights: { ...dummyWeights, financialReturn: 0, qualityImprovement: 0, productionEfficiency: 0, operationalResilience: 0, environmentalImpact: 0, implementationRisk: 0 },
      } as Stakeholder; 
      // s3 gives 0 to all options
      // avg optA = (350 + 350 + 0) / 3 = 233.333
      // avg optB = (370 + 370 + 0) / 3 = 246.667

      expect(calculateGlobalScores([s1, s2, s3], [optA, optB])).toEqual({
        optA: 233.333,
        optB: 246.667,
      });
    });
  });

  describe('rankOptionsForStakeholder', () => {
    it('returns options sorted by score descending', () => {
      expect(rankOptionsForStakeholder(s1, [optA, optB])).toEqual(['optB', 'optA']);
      expect(rankOptionsForStakeholder(s1, [optB, optA])).toEqual(['optB', 'optA']);
    });
  });

  describe('findGlobalWinner', () => {
    it('returns the option ID with the highest global score', () => {
      expect(findGlobalWinner([s1, s2], [optA, optB])).toBe('optB');
    });
  });
});
