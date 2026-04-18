import { Stakeholder, ConsensusStatus } from './types';

/** Map each stakeholder to their #1 ranked option. */
export function getTopOptions(rankings: Record<string, string[]>): Record<string, string> {
  const tops: Record<string, string> = {};
  for (const [sid, ranking] of Object.entries(rankings)) {
    tops[sid] = ranking[0];
  }
  return tops;
}

/** How many stakeholders pick each option as #1. */
function topOptionCounts(rankings: Record<string, string[]>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ranking of Object.values(rankings)) {
    const top = ranking[0];
    counts[top] = (counts[top] || 0) + 1;
  }
  return counts;
}

/**
 * Detect consensus status:
 *  - full    → all stakeholders share the same #1
 *  - partial → ≥ 75 % share the same #1 (3 of 4)
 *  - tie     → two or more options tied for the highest count
 *  - none    → no clear majority
 */
export function detectConsensusStatus(rankings: Record<string, string[]>): ConsensusStatus {
  const counts = topOptionCounts(rankings);
  const n = Object.keys(rankings).length;
  const maxCount = Math.max(...Object.values(counts));

  if (maxCount === n) return 'full';
  if (maxCount >= Math.ceil(n * 0.75)) return 'partial';

  // Tie: more than one option shares the highest count
  const tiedCount = Object.values(counts).filter((c) => c === maxCount).length;
  if (tiedCount > 1) return 'tie';

  return 'none';
}

/**
 * Numeric consensus score ∈ [0, 1].
 * For each stakeholder the contribution is (maxRank − rank) / maxRank where rank
 * is the position (0-based) of the global winner in that stakeholder's ranking.
 * Averaged across stakeholders.
 */
export function calculateConsensusScore(
  rankings: Record<string, string[]>,
  globalWinnerId: string,
): number {
  const sids = Object.keys(rankings);
  if (sids.length === 0) return 0;

  let sum = 0;
  for (const sid of sids) {
    const ranking = rankings[sid];
    const rawRank = ranking.indexOf(globalWinnerId);
    // If the winner is absent from this ranking (shouldn't happen), treat as last place
    const rank = rawRank === -1 ? ranking.length - 1 : rawRank;
    const maxRank = ranking.length - 1;
    sum += maxRank > 0 ? (maxRank - rank) / maxRank : 1;
  }
  return Math.round((sum / sids.length) * 1000) / 1000;
}

/** Is the option acceptable for a single stakeholder? score ≥ acceptabilityThreshold */
export function isAcceptableFor(
  stakeholder: Stakeholder,
  scores: Record<string, number>,
  optionId: string,
): boolean {
  return (scores[optionId] ?? 0) >= stakeholder.acceptabilityThreshold;
}

/**
 * Is the option acceptable for at least `minCount` stakeholders?
 * Default minCount = 3 (≥ 3 of 4).
 */
export function isAcceptableForMajority(
  stakeholders: Stakeholder[],
  allScores: Record<string, Record<string, number>>,
  optionId: string,
  minCount = 3,
): boolean {
  let count = 0;
  for (const s of stakeholders) {
    if (isAcceptableFor(s, allScores[s.id], optionId)) count++;
  }
  return count >= minCount;
}
