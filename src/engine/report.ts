/**
 * Report data builder — assembles a structured, export-ready
 * report object from a SimulationResult.
 *
 * This module is a PURE presentation-layer aggregator:
 *   - it does NOT duplicate engine logic
 *   - it does NOT run the simulation
 *   - it consumes already-computed results
 *
 * The resulting ReportData is consumed by ReportView for rendering
 * a print-friendly / exportable report.
 */

import type {
  SimulationResult,
  Stakeholder,
  InvestmentOption,
  Concession,
  ConsensusStatus,
} from './types';
import { isAcceptableFor } from './consensus';
import { buildResultNarrative, type ResultNarrative } from './narrative';

// ---------------------------------------------------------------------------
// Report data types
// ---------------------------------------------------------------------------

export interface StakeholderBreakdown {
  name: string;
  role: string;
  topOption: string;
  scoreForWinner: number;
  acceptable: boolean;
  aligned: boolean;
  conceded: boolean;
}

export interface ComparisonRow {
  optionName: string;
  baseScore: number;
  adjustedScore: number;
  delta: number;
  isBaseWinner: boolean;
  isAdjustedWinner: boolean;
}

export interface ComparisonData {
  baseWinnerName: string;
  adjustedWinnerName: string;
  winnerChanged: boolean;
  baseConsensusStatus: ConsensusStatus;
  adjustedConsensusStatus: ConsensusStatus;
  baseConsensusScore: number;
  adjustedConsensusScore: number;
  baseConflict: number;
  adjustedConflict: number;
  rows: ComparisonRow[];
}

export interface ReportData {
  /** Report generation timestamp */
  generatedAt: string;
  /** Scenario name */
  scenarioName: string;
  /** Company name */
  companyName: string;
  /** Scenario description */
  scenarioDescription: string;
  /** Budget */
  budget: number;
  /** Winning option name (or null) */
  winnerName: string | null;
  /** Winning option description */
  winnerDescription: string | null;
  /** Winning option cost */
  winnerCost: number | null;
  /** Consensus status */
  consensusStatus: ConsensusStatus;
  /** Consensus score (0–1) */
  consensusScore: number;
  /** Total conflict (0–1) */
  totalConflict: number;
  /** Number of rounds */
  roundCount: number;
  /** How many stakeholders accept */
  acceptCount: number;
  /** Total stakeholder count */
  stakeholderCount: number;
  /** Breakdown per stakeholder */
  stakeholderBreakdown: StakeholderBreakdown[];
  /** All concessions across rounds */
  concessions: (Concession & { round: number })[];
  /** Rich narrative from the narrative module */
  narrative: ResultNarrative;
  /** Name maps for display */
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
  /** Optional base vs adjusted comparison */
  comparison: ComparisonData | null;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildReportData(
  simulation: SimulationResult,
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
  optionNames: Record<string, string>,
  stakeholderNames: Record<string, string>,
  baseSimulation?: SimulationResult,
): ReportData {
  const { finalOption, consensusStatus, rounds, finalScores } = simulation;
  const lastRound = rounds[rounds.length - 1];

  // Narrative
  const narrative = buildResultNarrative(
    simulation,
    stakeholders,
    options,
    optionNames,
    stakeholderNames,
  );

  // Accept count
  const acceptCount = finalOption
    ? stakeholders.filter((s) =>
        isAcceptableFor(s, finalScores[s.id] ?? {}, finalOption.id),
      ).length
    : 0;

  // All concessions
  const allConcessions = rounds.flatMap((r) =>
    r.concessions.map((c) => ({ ...c, round: r.round })),
  );

  // Stakeholder breakdown
  const concededIds = new Set(allConcessions.map((c) => c.stakeholderId));
  const stakeholderBreakdown: StakeholderBreakdown[] = stakeholders.map((s) => {
    const scores = finalScores[s.id] ?? {};
    const ranking = lastRound?.rankings[s.id] ?? [];
    const topOption = ranking[0] ?? '';
    const acceptable = finalOption
      ? isAcceptableFor(s, scores, finalOption.id)
      : false;

    return {
      name: s.name,
      role: s.role,
      topOption: optionNames[topOption] ?? topOption,
      scoreForWinner: finalOption ? (scores[finalOption.id] ?? 0) : 0,
      acceptable,
      aligned: finalOption ? topOption === finalOption.id : false,
      conceded: concededIds.has(s.id),
    };
  });

  // Comparison (only if a base simulation is provided and differs)
  let comparison: ComparisonData | null = null;
  if (baseSimulation) {
    const baseLastRound = baseSimulation.rounds[baseSimulation.rounds.length - 1];
    const adjLastRound = lastRound;

    const baseWinnerId = baseSimulation.finalOption?.id ?? '';
    const adjWinnerId = finalOption?.id ?? '';

    const rows: ComparisonRow[] = options
      .filter((o) => !adjLastRound?.eliminatedOptionIds.includes(o.id))
      .map((o) => ({
        optionName: optionNames[o.id] ?? o.name,
        baseScore: baseLastRound?.globalScores[o.id] ?? 0,
        adjustedScore: adjLastRound?.globalScores[o.id] ?? 0,
        delta: (adjLastRound?.globalScores[o.id] ?? 0) - (baseLastRound?.globalScores[o.id] ?? 0),
        isBaseWinner: o.id === baseWinnerId,
        isAdjustedWinner: o.id === adjWinnerId,
      }))
      .sort((a, b) => b.adjustedScore - a.adjustedScore);

    comparison = {
      baseWinnerName: baseSimulation.finalOption?.name ?? 'Sin ganador',
      adjustedWinnerName: finalOption?.name ?? 'Sin ganador',
      winnerChanged: baseWinnerId !== adjWinnerId,
      baseConsensusStatus: baseSimulation.consensusStatus,
      adjustedConsensusStatus: consensusStatus,
      baseConsensusScore: baseLastRound?.consensusScore ?? 0,
      adjustedConsensusScore: lastRound?.consensusScore ?? 0,
      baseConflict: baseLastRound?.totalConflict ?? 0,
      adjustedConflict: lastRound?.totalConflict ?? 0,
      rows,
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    scenarioName: simulation.scenario.name,
    companyName: simulation.scenario.company,
    scenarioDescription: simulation.scenario.description,
    budget: simulation.scenario.budget,
    winnerName: finalOption?.name ?? null,
    winnerDescription: finalOption?.description ?? null,
    winnerCost: finalOption?.cost ?? null,
    consensusStatus,
    consensusScore: lastRound?.consensusScore ?? 0,
    totalConflict: lastRound?.totalConflict ?? 0,
    roundCount: rounds.length,
    acceptCount,
    stakeholderCount: stakeholders.length,
    stakeholderBreakdown,
    concessions: allConcessions,
    narrative,
    stakeholderNames,
    optionNames,
    comparison,
  };
}
