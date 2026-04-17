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
  const allScores: Record<string, Record<string, number>> = {};
  for (const s of stakeholders) {
    allScores[s.id] = calculateScoresForStakeholder(s, options);
  }
  return allScores;
}

/** Global scores: average across all stakeholders for each option */
export function calculateGlobalScores(
  stakeholders: Stakeholder[],
  options: InvestmentOption[]
): Record<string, number> {
  const allScores = calculateAllScores(stakeholders, options);
  const globalScores: Record<string, number> = {};

  for (const option of options) {
    let sum = 0;
    for (const s of stakeholders) {
      sum += allScores[s.id][option.id];
    }
    globalScores[option.id] = Math.round((sum / stakeholders.length) * 1000) / 1000;
  }
  return globalScores;
}

/** Rank options best→worst for a stakeholder */
export function rankOptionsForStakeholder(
  stakeholder: Stakeholder,
  options: InvestmentOption[]
): string[] {
  const scores = calculateScoresForStakeholder(stakeholder, options);
  return options
    .map((o) => o.id)
    .sort((a, b) => scores[b] - scores[a]);
}

/** Find the option with highest global score */
export function findGlobalWinner(
  stakeholders: Stakeholder[],
  options: InvestmentOption[]
): string {
  const globalScores = calculateGlobalScores(stakeholders, options);
  let winnerId = options[0].id;
  let maxScore = -1;
  for (const [optionId, score] of Object.entries(globalScores)) {
    if (score > maxScore) {
      maxScore = score;
      winnerId = optionId;
    }
  }
  return winnerId;
}
