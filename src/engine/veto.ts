import { Stakeholder, InvestmentOption, Veto, RedLine } from './types';

/**
 * Check whether a single red line is violated by an option.
 * operator 'lt' → veto if impact < threshold
 * operator 'gt' → veto if impact > threshold
 */
export function isRedLineViolated(redLine: RedLine, option: InvestmentOption): boolean {
  const value = option.impacts[redLine.variable];
  if (redLine.operator === 'lt') return value < redLine.threshold;
  if (redLine.operator === 'gt') return value > redLine.threshold;
  return false;
}

/** Find all vetoes across every stakeholder × option pair. */
export function findVetoes(
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
): Veto[] {
  const vetoes: Veto[] = [];
  for (const s of stakeholders) {
    for (const o of options) {
      for (const rl of s.redLines) {
        if (isRedLineViolated(rl, o)) {
          vetoes.push({
            stakeholderId: s.id,
            optionId: o.id,
            redLineDescription: rl.description,
          });
        }
      }
    }
  }
  return vetoes;
}

/** Return IDs of options that received 2 or more vetoes (from distinct stakeholders). */
export function getEliminatedOptionIds(vetoes: Veto[]): string[] {
  // Count unique stakeholders per option
  const byOption: Record<string, Set<string>> = {};
  for (const v of vetoes) {
    if (!byOption[v.optionId]) byOption[v.optionId] = new Set();
    byOption[v.optionId].add(v.stakeholderId);
  }
  return Object.entries(byOption)
    .filter(([, sids]) => sids.size >= 2)
    .map(([optionId]) => optionId);
}

/**
 * Zero-out scores for stakeholder-option pairs where the stakeholder vetoed the option.
 * Returns a new scores object (does not mutate).
 */
export function applyVetoesToScores(
  scores: Record<string, Record<string, number>>,
  vetoes: Veto[],
): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  for (const [sid, optScores] of Object.entries(scores)) {
    result[sid] = { ...optScores };
  }
  for (const v of vetoes) {
    if (result[v.stakeholderId]) {
      result[v.stakeholderId][v.optionId] = 0;
    }
  }
  return result;
}
