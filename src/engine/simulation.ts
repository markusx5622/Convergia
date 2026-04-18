import {
  Stakeholder,
  InvestmentOption,
  Scenario,
  RoundResult,
  SimulationResult,
} from './types';
import { calculateAllScores } from './scoring';
import { findVetoes, getEliminatedOptionIds, applyVetoesToScores } from './veto';
import { buildConflictMatrix, calculateTotalConflict } from './conflict';
import {
  detectConsensusStatus,
  calculateConsensusScore,
  isAcceptableForMajority,
} from './consensus';
import { processConcessions } from './concession';

/** Compute global scores (avg across stakeholders) from a scores matrix. */
function globalScoresFromMatrix(
  scores: Record<string, Record<string, number>>,
  stakeholderIds: string[],
  optionIds: string[],
): Record<string, number> {
  const gs: Record<string, number> = {};
  for (const oid of optionIds) {
    let sum = 0;
    for (const sid of stakeholderIds) {
      sum += scores[sid][oid] ?? 0;
    }
    gs[oid] = Math.round((sum / stakeholderIds.length) * 1000) / 1000;
  }
  return gs;
}

/** Derive ranking (best → worst) from a single stakeholder's score map. */
function rankFromScores(scores: Record<string, number>): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id);
}

/** Find option ID with highest global score. */
function winnerFromGlobalScores(globalScores: Record<string, number>): string {
  let winnerId = '';
  let max = -Infinity;
  for (const [id, score] of Object.entries(globalScores)) {
    if (score > max) {
      max = score;
      winnerId = id;
    }
  }
  return winnerId;
}

/**
 * Run the full deterministic simulation.
 *
 * Pipeline per round:
 *  1. Calculate raw scores
 *  2. Apply veto zeroing (score = 0 for vetoed stakeholder-option pairs)
 *  3. Compute global scores, rankings
 *  4. Build conflict matrix & total conflict
 *  5. Detect consensus status & score
 *  6. Execute concessions (rounds 1..maxRounds-1) to adjust weights for next round
 *
 * Eliminated options (≥ 2 vetoes) are removed before all rounds.
 */
export function runSimulation(
  scenario: Scenario,
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
  maxRounds = 3,
): SimulationResult {
  // --- Vetoes (computed once on full option set) ---
  const vetoes = findVetoes(stakeholders, options);
  const eliminatedIds = getEliminatedOptionIds(vetoes);
  let activeOptions = options.filter((o) => !eliminatedIds.includes(o.id));
  if (activeOptions.length === 0) activeOptions = [...options]; // fallback

  // Vetoes that apply to still-active options
  const activeVetoes = vetoes.filter(
    (v) => !eliminatedIds.includes(v.optionId),
  );

  let currentStakeholders = stakeholders.map((s) => ({ ...s }));
  const rounds: RoundResult[] = [];

  for (let round = 1; round <= maxRounds; round++) {
    const sids = currentStakeholders.map((s) => s.id);
    const oids = activeOptions.map((o) => o.id);

    // 1. Raw scores
    const rawScores = calculateAllScores(currentStakeholders, activeOptions);

    // 2. Apply veto zeroing
    const scores = applyVetoesToScores(rawScores, activeVetoes);

    // 3. Global scores & rankings
    const globalScores = globalScoresFromMatrix(scores, sids, oids);
    const rankings: Record<string, string[]> = {};
    for (const sid of sids) {
      rankings[sid] = rankFromScores(scores[sid]);
    }
    const globalWinnerId = winnerFromGlobalScores(globalScores);

    // 4. Conflict
    const conflictMatrix = buildConflictMatrix(rankings, sids);
    const totalConflict = calculateTotalConflict(conflictMatrix, sids);

    // 5. Consensus
    const consensusStatus = detectConsensusStatus(rankings);
    const consensusScore = calculateConsensusScore(rankings, globalWinnerId);

    // 6. Concessions (not in last round)
    let concessions: RoundResult['concessions'] = [];
    if (round < maxRounds) {
      const result = processConcessions(
        currentStakeholders,
        rankings,
        scores,
        globalWinnerId,
      );
      concessions = result.concessions;
      currentStakeholders = result.updatedStakeholders;
    }

    rounds.push({
      round,
      scores,
      globalScores,
      rankings,
      concessions,
      vetoes: round === 1 ? vetoes : [],
      consensusScore,
      consensusStatus,
      arguments: [],
      conflictMatrix,
      totalConflict,
      eliminatedOptionIds: eliminatedIds,
    });
  }

  // --- Final result ---
  const lastRound = rounds[rounds.length - 1];
  const finalWinnerId = winnerFromGlobalScores(lastRound.globalScores);
  const finalOption = activeOptions.find((o) => o.id === finalWinnerId) ?? null;
  const acceptable = finalOption
    ? isAcceptableForMajority(currentStakeholders, lastRound.scores, finalOption.id)
    : false;

  return {
    scenario,
    rounds,
    finalOption,
    consensusStatus: lastRound.consensusStatus,
    finalScores: lastRound.scores,
    explanation: finalOption
      ? `La opción "${finalOption.name}" ${acceptable ? 'es aceptable' : 'NO es aceptable'} para al menos 3 de 4 stakeholders. Consenso: ${lastRound.consensusStatus}. Conflicto total: ${lastRound.totalConflict}.`
      : 'No se pudo determinar una opción final.',
  };
}
