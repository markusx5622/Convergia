import { Stakeholder, Concession, VARIABLE_IDS, VariableId } from './types';

/**
 * Gap between a stakeholder's score for their preferred option and the global winner.
 * Returns 0 when preferred === global winner.
 */
export function calculateGap(
  stakeholderScores: Record<string, number>,
  preferredOptionId: string,
  globalWinnerId: string,
): number {
  if (preferredOptionId === globalWinnerId) return 0;
  return stakeholderScores[preferredOptionId] - stakeholderScores[globalWinnerId];
}

/**
 * Majority pressure: true when 3+ stakeholders (excluding the current one) share
 * the same top option AND that top option differs from the current stakeholder's top.
 */
export function hasMajorityPressure(
  rankings: Record<string, string[]>,
  stakeholderId: string,
): boolean {
  const allTops: Record<string, string[]> = {};
  for (const [sid, ranking] of Object.entries(rankings)) {
    const top = ranking[0];
    if (!allTops[top]) allTops[top] = [];
    allTops[top].push(sid);
  }
  for (const [, sids] of Object.entries(allTops)) {
    if (sids.length >= 3 && !sids.includes(stakeholderId)) return true;
  }
  return false;
}

/**
 * Decide whether a stakeholder should concede.
 * With majority pressure the effective threshold is reduced by factor 1.5
 * (making concession easier).
 */
export function shouldConcede(
  gap: number,
  concessionThreshold: number,
  majorityPressure: boolean,
): boolean {
  const effectiveThreshold = majorityPressure
    ? concessionThreshold / 1.5
    : concessionThreshold;
  return gap > effectiveThreshold;
}

/**
 * Blend a stakeholder's weights towards the group average.
 * effectiveRate = concessionRate (× 1.5 when majority pressure).
 * After blending, weights are renormalised to sum to 1.
 */
export function adjustWeights(
  stakeholder: Stakeholder,
  allStakeholders: Stakeholder[],
  effectiveRate: number,
): Record<VariableId, number> {
  // Compute group-average weights
  const avg = {} as Record<VariableId, number>;
  for (const v of VARIABLE_IDS) {
    let s = 0;
    for (const sh of allStakeholders) s += sh.weights[v];
    avg[v] = s / allStakeholders.length;
  }

  // Blend
  const blended = {} as Record<VariableId, number>;
  for (const v of VARIABLE_IDS) {
    blended[v] = stakeholder.weights[v] * (1 - effectiveRate) + avg[v] * effectiveRate;
  }

  // Renormalise
  let total = 0;
  for (const v of VARIABLE_IDS) total += blended[v];
  for (const v of VARIABLE_IDS) {
    blended[v] = Math.round((blended[v] / total) * 10000) / 10000;
  }
  return blended;
}

/**
 * Process concessions for all stakeholders in a single round.
 * Returns the list of concessions made and updated stakeholder copies.
 */
export function processConcessions(
  stakeholders: Stakeholder[],
  rankings: Record<string, string[]>,
  allScores: Record<string, Record<string, number>>,
  globalWinnerId: string,
): { concessions: Concession[]; updatedStakeholders: Stakeholder[] } {
  const concessions: Concession[] = [];
  const updatedStakeholders: Stakeholder[] = [];

  for (const s of stakeholders) {
    const preferredId = rankings[s.id][0];
    const gap = calculateGap(allScores[s.id], preferredId, globalWinnerId);
    const pressure = hasMajorityPressure(rankings, s.id);

    if (
      preferredId !== globalWinnerId &&
      shouldConcede(gap, s.concessionThreshold, pressure)
    ) {
      const effectiveRate = Math.min(pressure ? s.concessionRate * 1.5 : s.concessionRate, 1);
      const newWeights = adjustWeights(s, stakeholders, effectiveRate);

      concessions.push({
        stakeholderId: s.id,
        fromOptionId: preferredId,
        toOptionId: globalWinnerId,
        gap: Math.round(gap * 1000) / 1000,
        reason: pressure
          ? `Gap ${gap.toFixed(3)} > umbral ajustado ${(s.concessionThreshold / 1.5).toFixed(3)} (presión de mayoría ×1.5)`
          : `Gap ${gap.toFixed(3)} > umbral ${s.concessionThreshold}`,
      });

      updatedStakeholders.push({ ...s, weights: newWeights });
    } else {
      updatedStakeholders.push({ ...s });
    }
  }

  return { concessions, updatedStakeholders };
}
