import { describe, it, expect } from 'vitest';
import {
  pairwiseConflict,
  buildConflictMatrix,
  calculateTotalConflict,
} from '@/engine/conflict';

describe('Engine: Conflict', () => {
  describe('pairwiseConflict', () => {
    it('returns 0 when rankings are identical', () => {
      const rA = ['optA', 'optB', 'optC'];
      const rB = ['optA', 'optB', 'optC'];
      expect(pairwiseConflict(rA, rB)).toBe(0);
    });

    it('returns 1 when rankings are exactly reversed (max distance)', () => {
      const rA = ['optA', 'optB', 'optC']; // pos: A=0, B=1, C=2
      const rB = ['optC', 'optB', 'optA']; // pos: A=2, B=1, C=0
      // diff: A=|0-2|=2, B=|1-1|=0, C=|2-0|=2. sum=4
      // maxDistance = floor(3*3 / 2) = floor(4.5) = 4
      // conflict = 4/4 = 1
      expect(pairwiseConflict(rA, rB)).toBe(1);
    });

    it('returns proportional value for partial disagreement', () => {
      const rA = ['optA', 'optB', 'optC', 'optD'];
      // pos A=0, B=1, C=2, D=3
      const rB = ['optA', 'optC', 'optB', 'optD'];
      // pos A=0, B=2, C=1, D=3
      // diff: A=0, B=1, C=1, D=0. sum=2
      // maxDist = floor(16/2) = 8
      // conflict = 2/8 = 0.25
      expect(pairwiseConflict(rA, rB)).toBe(0.25);
    });

    it('handles missing options by treating them as ranked last', () => {
      const rA = ['optA', 'optB']; // pos: A=0, B=1
      const rB = ['optB']; // pos: B=0, A=missing(treat as n-1 = 2-1 = 1)
      // diff: A=|0-1|=1, B=|1-0|=1. sum=2
      // maxDist = floor(4/2) = 2
      // conflict = 2/2 = 1
      expect(pairwiseConflict(rA, rB)).toBe(1);
    });

    it('returns 0 for single item rankings', () => {
      expect(pairwiseConflict(['optA'], ['optA'])).toBe(0);
    });
  });

  describe('buildConflictMatrix', () => {
    it('builds an NxN matrix of pairwise conflicts rounded to 3dp', () => {
      const rankings = {
        s1: ['optA', 'optB', 'optC'],
        s2: ['optC', 'optB', 'optA'], // conflict s1-s2 = 1
        s3: ['optA', 'optB', 'optC'], // conflict s1-s3 = 0, s2-s3 = 1
      };
      
      const matrix = buildConflictMatrix(rankings, ['s1', 's2', 's3']);
      expect(matrix).toEqual({
        s1: { s1: 0, s2: 1, s3: 0 },
        s2: { s1: 1, s2: 0, s3: 1 },
        s3: { s1: 0, s2: 1, s3: 0 },
      });
    });
  });

  describe('calculateTotalConflict', () => {
    it('averages the upper-triangle conflicts', () => {
      const matrix = {
        s1: { s1: 0, s2: 1, s3: 0.5 },
        s2: { s1: 1, s2: 0, s3: 0.2 },
        s3: { s1: 0.5, s2: 0.2, s3: 0 },
      };
      const sids = ['s1', 's2', 's3'];
      // Pairs: (s1,s2)=1, (s1,s3)=0.5, (s2,s3)=0.2. Sum = 1.7. Count = 3. Avg = 1.7/3 = 0.5666... => 0.567
      expect(calculateTotalConflict(matrix, sids)).toBe(0.567);
    });

    it('returns 0 for < 2 stakeholders', () => {
      expect(calculateTotalConflict({ s1: { s1: 0 } }, ['s1'])).toBe(0);
      expect(calculateTotalConflict({}, [])).toBe(0);
    });
  });
});
