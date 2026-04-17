import { Stakeholder, InvestmentOption, VARIABLE_IDS } from './types';

/** Score of one stakeholder for one option: Σ weight[v] × impact[v] */
export function calculateScore(stakeholder: Stakeholder, option: InvestmentOption): number {
  let score = 0;
  for (const v of VARIABLE_IDS) {
    score += stakeholder.weights[v] * option.impacts[v];
  }
  return Math.round(score * 1000) / 1000; // 3 decimal precision
}

/** Scores of one stakeholder for all options */
export function calculateScoresForStakeholder(
  stakeholder: Stakeholder,
  options: InvestmentOption[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const option of options) {
    scores[option.id] = calculateScore(stakeholder, option);
  }
  return scores;
}

/** All scores: stakeholderId → optionId → score */
export function calculateAllScores(
  stakeholders: Stakeholder[],
  options: InvestmentOption[]
): Record<string, Record<string, number>> {
  const all: Record<string, Record<string, number>> = {};
  for (const s of stakeholders) {
    all[s.id] = calculateScoresForStakeholder(s, options);
  }
  return all;
}

/** Global scores: optionId → average score across all stakeholders */
export function calculateGlobalScores(
  stakeholders: Stakeholder[],
  options: InvestmentOption[]
): Record<string, number> {
  const allScores = calculateAllScores(stakeholders, options);
  const global: Record<string, number> = {};
  for (const option of options) {
    let sum = 0;
    for (const s of stakeholders) {
      sum += allScores[s.id][option.id];
    }
    global[option.id] = Math.round((sum / stakeholders.length) * 1000) / 1000;
  }
  return global;
}

/** Rank options for a stakeholder, best to worst */
export function rankOptionsForStakeholder(
  stakeholder: Stakeholder,
  options: InvestmentOption[]
): string[] {
  const scores = calculateScoresForStakeholder(stakeholder, options);
  return options
    .map((o) => o.id)
    .sort((a, b) => scores[b] - scores[a]);
}

/** Find global winner option id */
export function findGlobalWinner(
  stakeholders: Stakeholder[],
  options: InvestmentOption[]
): string {
  const global = calculateGlobalScores(stakeholders, options);
  let winnerId = options[0].id;
  let maxScore = global[options[0].id];
  for (const option of options) {
    if (global[option.id] > maxScore) {
      maxScore = global[option.id];
      winnerId = option.id;
    }
  }
  return winnerId;
}
