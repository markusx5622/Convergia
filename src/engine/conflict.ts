/**
 * Conflict analysis between stakeholders based on ranking distances.
 *
 * Metric: normalised Spearman footrule distance.
 * For two rankings of n items the maximum sum of |rank_i − rank_j| is ⌊n²/2⌋,
 * so dividing by that value guarantees conflict ∈ [0, 1].
 */

/**
 * Pairwise conflict between two rankings (ordered arrays of option IDs).
 * Returns a value in [0, 1].
 */
export function pairwiseConflict(rankingA: string[], rankingB: string[]): number {
  const n = rankingA.length;
  if (n <= 1) return 0;

  const posA: Record<string, number> = {};
  const posB: Record<string, number> = {};
  rankingA.forEach((id, i) => { posA[id] = i; });
  rankingB.forEach((id, i) => { posB[id] = i; });

  let sum = 0;
  for (const id of rankingA) {
    // If an option is absent from rankingB, treat it as ranked last (n − 1)
    sum += Math.abs(posA[id] - (posB[id] ?? n - 1));
  }

  // Max Spearman footrule distance = floor(n² / 2)
  const maxDistance = Math.floor((n * n) / 2);
  return maxDistance > 0 ? sum / maxDistance : 0;
}

/** Build full conflict matrix for all stakeholder pairs. Values rounded to 3dp. */
export function buildConflictMatrix(
  rankings: Record<string, string[]>,
  stakeholderIds: string[],
): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  for (const si of stakeholderIds) {
    matrix[si] = {};
    for (const sj of stakeholderIds) {
      if (si === sj) {
        matrix[si][sj] = 0;
      } else {
        matrix[si][sj] = round3(pairwiseConflict(rankings[si], rankings[sj]));
      }
    }
  }
  return matrix;
}

/** Total system conflict = average of upper-triangle pairwise conflicts. [0, 1] */
export function calculateTotalConflict(
  conflictMatrix: Record<string, Record<string, number>>,
  stakeholderIds: string[],
): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < stakeholderIds.length; i++) {
    for (let j = i + 1; j < stakeholderIds.length; j++) {
      sum += conflictMatrix[stakeholderIds[i]][stakeholderIds[j]];
      count++;
    }
  }
  return count > 0 ? round3(sum / count) : 0;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
