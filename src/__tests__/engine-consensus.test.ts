import { describe, it, expect } from 'vitest';
import {
  getTopOptions,
  detectConsensusStatus,
  calculateConsensusScore,
  isAcceptableFor,
  isAcceptableForMajority,
} from '@/engine/consensus';
import { Stakeholder, InvestmentOption } from '@/engine/types';

describe('Engine: Consensus', () => {
  describe('getTopOptions', () => {
    it('returns the first option for each stakeholder', () => {
      const rankings = {
        s1: ['optA', 'optB', 'optC'],
        s2: ['optB', 'optA', 'optC'],
      };
      expect(getTopOptions(rankings)).toEqual({
        s1: 'optA',
        s2: 'optB',
      });
    });
  });

  describe('detectConsensusStatus', () => {
    it('returns "full" when all stakeholders share the same #1 option', () => {
      const rankings = {
        s1: ['optA', 'optB'],
        s2: ['optA', 'optC'],
        s3: ['optA', 'optD'],
        s4: ['optA', 'optE'],
      };
      expect(detectConsensusStatus(rankings)).toBe('full');
    });

    it('returns "partial" when >= 75% share the same #1 option (3 of 4)', () => {
      const rankings = {
        s1: ['optA', 'optB'],
        s2: ['optA', 'optC'],
        s3: ['optA', 'optD'],
        s4: ['optB', 'optA'],
      };
      expect(detectConsensusStatus(rankings)).toBe('partial');
    });

    it('returns "tie" when there is a tie for the top count', () => {
      const rankings = {
        s1: ['optA', 'optB'],
        s2: ['optA', 'optC'],
        s3: ['optB', 'optA'],
        s4: ['optB', 'optC'],
      };
      expect(detectConsensusStatus(rankings)).toBe('tie');
    });

    it('returns "none" when there is no clear majority or tie', () => {
      // 5 stakeholders, max count is 2 (< 75% which is 3.75 -> 4)
      const rankings = {
        s1: ['optA'],
        s2: ['optA'],
        s3: ['optB'],
        s4: ['optC'],
        s5: ['optD'],
      };
      expect(detectConsensusStatus(rankings)).toBe('none');
    });
  });

  describe('calculateConsensusScore', () => {
    it('calculates average score based on rank positions', () => {
      const rankings = {
        s1: ['optA', 'optB', 'optC'], // maxRank=2, rank=0 -> (2-0)/2 = 1
        s2: ['optB', 'optA', 'optC'], // rank=1 -> (2-1)/2 = 0.5
        s3: ['optC', 'optB', 'optA'], // rank=2 -> (2-2)/2 = 0
      };
      // Sum = 1.5, avg = 1.5 / 3 = 0.5
      expect(calculateConsensusScore(rankings, 'optA')).toBe(0.5);
    });

    it('handles winner absent from ranking gracefully', () => {
      const rankings = {
        s1: ['optB', 'optC'], // optA absent -> rank=last(1) -> (1-1)/1 = 0
      };
      expect(calculateConsensusScore(rankings, 'optA')).toBe(0);
    });
  });

  describe('isAcceptableFor', () => {
    const mockStakeholder = { acceptabilityThreshold: 60 } as Stakeholder;

    it('returns true if score >= threshold', () => {
      expect(isAcceptableFor(mockStakeholder, { optA: 65 }, 'optA')).toBe(true);
      expect(isAcceptableFor(mockStakeholder, { optA: 60 }, 'optA')).toBe(true);
    });

    it('returns false if score < threshold or undefined', () => {
      expect(isAcceptableFor(mockStakeholder, { optA: 59 }, 'optA')).toBe(false);
      expect(isAcceptableFor(mockStakeholder, { optB: 80 }, 'optA')).toBe(false);
    });
  });

  describe('isAcceptableForMajority', () => {
    const s1 = { id: 's1', acceptabilityThreshold: 50 } as Stakeholder;
    const s2 = { id: 's2', acceptabilityThreshold: 60 } as Stakeholder;
    const s3 = { id: 's3', acceptabilityThreshold: 70 } as Stakeholder;
    const stakeholders = [s1, s2, s3];
    
    const allScores = {
      s1: { optA: 55 }, // yes
      s2: { optA: 65 }, // yes
      s3: { optA: 65 }, // no
    };

    it('returns true if >= minCount stakeholders find it acceptable', () => {
      // 2 out of 3 find optA acceptable, minCount=2 should pass
      expect(isAcceptableForMajority(stakeholders, allScores, 'optA', 2)).toBe(true);
    });

    it('returns false if < minCount stakeholders find it acceptable', () => {
      // 2 out of 3 find optA acceptable, minCount=3 should fail
      expect(isAcceptableForMajority(stakeholders, allScores, 'optA', 3)).toBe(false);
    });
  });
});
