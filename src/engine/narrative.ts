/**
 * Deterministic narrative builder.
 *
 * Generates human-readable explanations from simulation data
 * (scores, rankings, vetos, concessions, conflict, consensus).
 *
 * NO LLM, NO external calls — pure data-driven text construction.
 */

import type {
  SimulationResult,
  RoundResult,
  Stakeholder,
  InvestmentOption,
  VariableId,
  Concession,
} from './types';
import { VARIABLE_LABELS } from './types';
import { isAcceptableFor } from './consensus';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sorted<T>(arr: T[], fn: (a: T, b: T) => number): T[] {
  return [...arr].sort(fn);
}

/** Return the option ID with the highest global score in a round. */
function roundWinnerId(round: RoundResult): string {
  return Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? '';
}

/** Sorted global scores descending. */
function sortedGlobalScores(gs: Record<string, number>): [string, number][] {
  return Object.entries(gs).sort(([, a], [, b]) => b - a);
}

const CONSENSUS_LABEL: Record<string, string> = {
  full: 'consenso total',
  partial: 'consenso parcial',
  tie: 'empate',
  none: 'sin consenso',
};

// ---------------------------------------------------------------------------
// 1. Result-level narrative
// ---------------------------------------------------------------------------

export interface ResultNarrative {
  /** One-line verdict */
  headline: string;
  /** Why this option won */
  whyWon: string;
  /** Which variables mattered most */
  keyVariables: { variable: VariableId; label: string; contribution: string }[];
  /** Stakeholder alignment with the winner */
  alignment: {
    stakeholderId: string;
    aligned: boolean;
    conceded: boolean;
    topOption: string;
  }[];
  /** Consensus description */
  consensusSummary: string;
  /** Acceptability description */
  acceptabilitySummary: string;
  /** Concession synthesis */
  concessionSynthesis: string;
  /** Discarded options with reasons */
  discardedOptions: {
    optionId: string;
    optionName: string;
    reason: string;
    globalScore: number;
    winnerScore: number;
  }[];
}

export function buildResultNarrative(
  sim: SimulationResult,
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
  optionNames: Record<string, string>,
  stakeholderNames: Record<string, string>,
): ResultNarrative {
  const { finalOption, consensusStatus, rounds, finalScores } = sim;
  const lastRound = rounds[rounds.length - 1];
  const winnerId = finalOption?.id ?? '';

  // --- headline ---
  const headline = finalOption
    ? `"${finalOption.name}" fue seleccionada como la mejor opción con ${CONSENSUS_LABEL[consensusStatus]}.`
    : 'No se pudo determinar una opción ganadora tras las rondas de negociación.';

  // --- why won ---
  const winnerGlobal = lastRound.globalScores[winnerId] ?? 0;
  const sortedScores = sortedGlobalScores(lastRound.globalScores);
  const runnerUp = sortedScores[1];
  const margin = runnerUp ? winnerGlobal - runnerUp[1] : 0;

  let whyWon = '';
  if (finalOption) {
    const topCount = stakeholders.filter(
      (s) => lastRound.rankings[s.id]?.[0] === winnerId,
    ).length;
    whyWon = `"${finalOption.name}" obtuvo el mayor score global promedio (${winnerGlobal.toFixed(3)})`;
    if (runnerUp) {
      whyWon += `, superando a "${optionNames[runnerUp[0]] ?? runnerUp[0]}" por ${margin.toFixed(3)} puntos`;
    }
    whyWon += `. Fue la opción preferida (#1) de ${topCount} de ${stakeholders.length} stakeholders en la ronda final.`;
  }

  // --- key variables ---
  const keyVariables = buildKeyVariables(finalOption, stakeholders);

  // --- alignment ---
  const allConcessions = rounds.flatMap((r) => r.concessions);
  const concededSet = new Set(allConcessions.map((c) => c.stakeholderId));

  const alignment = stakeholders.map((s) => {
    const topOpt = lastRound.rankings[s.id]?.[0] ?? '';
    return {
      stakeholderId: s.id,
      aligned: topOpt === winnerId,
      conceded: concededSet.has(s.id),
      topOption: topOpt,
    };
  });

  // --- consensus summary ---
  const acceptCount = finalOption
    ? stakeholders.filter((s) =>
        isAcceptableFor(s, finalScores[s.id] ?? {}, finalOption.id),
      ).length
    : 0;

  const consensusSummary = buildConsensusSummary(
    consensusStatus,
    lastRound.consensusScore,
    stakeholders.length,
    acceptCount,
    stakeholderNames,
    alignment,
  );

  // --- acceptability ---
  const acceptabilitySummary =
    acceptCount === stakeholders.length
      ? `Todos los stakeholders (${acceptCount}/${stakeholders.length}) consideran la opción aceptable — supera el umbral de aceptabilidad de cada uno.`
      : acceptCount >= 3
        ? `La opción es aceptable para ${acceptCount} de ${stakeholders.length} stakeholders (mayoría cualificada ≥ 3/4).`
        : `Solo ${acceptCount} de ${stakeholders.length} stakeholders la aceptan — no se alcanza mayoría cualificada.`;

  // --- concession synthesis ---
  const concessionSynthesis = buildConcessionSynthesis(
    allConcessions,
    stakeholderNames,
    optionNames,
  );

  // --- discarded options ---
  const discardedOptions = buildDiscardedOptions(
    sim,
    stakeholders,
    options,
    optionNames,
    winnerId,
    lastRound,
  );

  return {
    headline,
    whyWon,
    keyVariables,
    alignment,
    consensusSummary,
    acceptabilitySummary,
    concessionSynthesis,
    discardedOptions,
  };
}

// ---------------------------------------------------------------------------
// key variables
// ---------------------------------------------------------------------------

function buildKeyVariables(
  finalOption: InvestmentOption | null,
  stakeholders: Stakeholder[],
): ResultNarrative['keyVariables'] {
  if (!finalOption) return [];

  // Calculate effective weighted contribution of each variable
  const contributions: { variable: VariableId; total: number }[] = [];
  const varIds = Object.keys(finalOption.impacts) as VariableId[];

  for (const v of varIds) {
    let total = 0;
    for (const s of stakeholders) {
      total += s.weights[v] * finalOption.impacts[v];
    }
    contributions.push({ variable: v, total: total / stakeholders.length });
  }

  const sortedContribs = sorted(contributions, (a, b) => b.total - a.total);
  const totalScore = sortedContribs.reduce((s, c) => s + c.total, 0);

  return sortedContribs.slice(0, 3).map((c) => ({
    variable: c.variable,
    label: VARIABLE_LABELS[c.variable],
    contribution: totalScore > 0
      ? `${((c.total / totalScore) * 100).toFixed(0)}% del score (${c.total.toFixed(3)})`
      : `${c.total.toFixed(3)}`,
  }));
}

// ---------------------------------------------------------------------------
// consensus summary
// ---------------------------------------------------------------------------

function buildConsensusSummary(
  status: string,
  score: number,
  total: number,
  acceptCount: number,
  stakeholderNames: Record<string, string>,
  alignment: ResultNarrative['alignment'],
): string {
  const aligned = alignment.filter((a) => a.aligned);
  const notAligned = alignment.filter((a) => !a.aligned);
  const conceded = alignment.filter((a) => a.conceded && !a.aligned);

  let text = '';
  if (status === 'full') {
    text = `Se alcanzó consenso total: todos los stakeholders tienen la misma opción como primera preferencia (score de consenso: ${score.toFixed(3)}).`;
  } else if (status === 'partial') {
    text = `Se alcanzó consenso parcial (score: ${score.toFixed(3)}). `;
    text += `${aligned.length} de ${total} stakeholders prefieren directamente la opción ganadora`;
    if (notAligned.length > 0) {
      const names = notAligned.map((a) => stakeholderNames[a.stakeholderId]).join(', ');
      text += `, mientras que ${names} ${notAligned.length === 1 ? 'mantiene' : 'mantienen'} otra preferencia`;
    }
    text += '.';
  } else if (status === 'tie') {
    text = `Existe un empate técnico (score: ${score.toFixed(3)}). No hay una mayoría clara.`;
  } else {
    text = `No se alcanzó consenso (score: ${score.toFixed(3)}). `;
    text += `Solo ${aligned.length} de ${total} stakeholders apoyan la opción ganadora como primera opción.`;
  }

  if (conceded.length > 0) {
    const names = conceded.map((a) => stakeholderNames[a.stakeholderId]).join(', ');
    text += ` ${names} ${conceded.length === 1 ? 'cedió' : 'cedieron'} durante la negociación, ajustando sus pesos hacia el consenso del grupo.`;
  }

  return text;
}

// ---------------------------------------------------------------------------
// concession synthesis
// ---------------------------------------------------------------------------

function buildConcessionSynthesis(
  concessions: Concession[],
  stakeholderNames: Record<string, string>,
  optionNames: Record<string, string>,
): string {
  if (concessions.length === 0) {
    return 'No hubo concesiones durante la negociación — todos los stakeholders mantuvieron sus posiciones originales. La opción ganadora se determinó por score directo.';
  }

  const byStakeholder: Record<string, Concession[]> = {};
  for (const c of concessions) {
    if (!byStakeholder[c.stakeholderId]) byStakeholder[c.stakeholderId] = [];
    byStakeholder[c.stakeholderId].push(c);
  }

  const parts: string[] = [];
  for (const [sid, cs] of Object.entries(byStakeholder)) {
    const name = stakeholderNames[sid] ?? sid;
    if (cs.length === 1) {
      const c = cs[0];
      parts.push(
        `${name} cedió de "${optionNames[c.fromOptionId] ?? c.fromOptionId}" hacia "${optionNames[c.toOptionId] ?? c.toOptionId}" (gap: ${c.gap.toFixed(3)})`,
      );
    } else {
      parts.push(
        `${name} realizó ${cs.length} concesiones a lo largo del debate`,
      );
    }
  }

  return `Se produjeron ${concessions.length} concesión${concessions.length === 1 ? '' : 'es'}: ${parts.join('; ')}.`;
}

// ---------------------------------------------------------------------------
// discarded options
// ---------------------------------------------------------------------------

function buildDiscardedOptions(
  sim: SimulationResult,
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
  optionNames: Record<string, string>,
  winnerId: string,
  lastRound: RoundResult,
): ResultNarrative['discardedOptions'] {
  const eliminatedIds = lastRound.eliminatedOptionIds;
  const vetoes = sim.rounds[0]?.vetoes ?? [];
  const winnerScore = lastRound.globalScores[winnerId] ?? 0;

  return options
    .filter((o) => o.id !== winnerId)
    .map((o) => {
      const globalScore = lastRound.globalScores[o.id] ?? 0;
      const isEliminated = eliminatedIds.includes(o.id);
      const optVetoes = vetoes.filter((v) => v.optionId === o.id);

      let reason = '';
      if (isEliminated) {
        reason = `Eliminada por ${optVetoes.length} veto${optVetoes.length > 1 ? 's' : ''} de línea roja (≥ 2 vetos = eliminación).`;
      } else if (globalScore < winnerScore) {
        const diff = winnerScore - globalScore;
        const topFor = stakeholders.filter(
          (s) => lastRound.rankings[s.id]?.[0] === o.id,
        );
        reason = `Score global ${globalScore.toFixed(3)} — ${diff.toFixed(3)} puntos por debajo de la ganadora.`;
        if (topFor.length === 0) {
          reason += ' Ningún stakeholder la tenía como primera opción.';
        } else {
          reason += ` Preferida solo por ${topFor.map((s) => s.name).join(', ')}.`;
        }
        if (optVetoes.length > 0) {
          reason += ` Además recibió ${optVetoes.length} veto${optVetoes.length > 1 ? 's' : ''}.`;
        }
      } else {
        reason = 'Empate técnico resuelto por orden de evaluación.';
      }

      return {
        optionId: o.id,
        optionName: optionNames[o.id] ?? o.name,
        reason,
        globalScore,
        winnerScore,
      };
    })
    .sort((a, b) => b.globalScore - a.globalScore);
}

// ---------------------------------------------------------------------------
// 2. Round-level narrative
// ---------------------------------------------------------------------------

export interface RoundNarrative {
  /** Which option leads this round */
  leader: string;
  /** Score of the leader */
  leaderScore: number;
  /** Whether the leader changed vs previous round */
  leaderChanged: boolean;
  /** Previous leader id (empty if first round) */
  previousLeader: string;
  /** Who changed position (conceded) */
  positionChanges: string[];
  /** Who did NOT change */
  holdingFirm: string[];
  /** Whether there are vetos relevant to this round */
  vetoSummary: string;
  /** Consensus trend: improving, declining, stable */
  consensusTrend: 'improving' | 'declining' | 'stable';
  /** Consensus delta from previous round */
  consensusDelta: number;
  /** The pair with highest conflict */
  topConflictPair: { a: string; b: string; value: number } | null;
  /** Full narrative text */
  text: string;
}

export function buildRoundNarrative(
  round: RoundResult,
  roundIndex: number,
  allRounds: RoundResult[],
  stakeholders: Stakeholder[],
  optionNames: Record<string, string>,
  stakeholderNames: Record<string, string>,
): RoundNarrative {
  const winnerId = roundWinnerId(round);
  const winnerName = optionNames[winnerId] ?? winnerId;
  const winnerScore = round.globalScores[winnerId] ?? 0;

  // Leader change
  const prevRound = roundIndex > 0 ? allRounds[roundIndex - 1] : null;
  const previousLeader = prevRound ? roundWinnerId(prevRound) : '';
  const leaderChanged = prevRound !== null && previousLeader !== winnerId;

  // Concessions in this round
  const concededIds = new Set(round.concessions.map((c) => c.stakeholderId));
  const positionChanges = stakeholders
    .filter((s) => concededIds.has(s.id))
    .map((s) => s.id);
  const holdingFirm = stakeholders
    .filter((s) => !concededIds.has(s.id))
    .map((s) => s.id);

  // Veto summary
  let vetoSummary = '';
  if (round.vetoes.length > 0) {
    const vetoCount = round.vetoes.length;
    const elimCount = round.eliminatedOptionIds.length;
    vetoSummary = `Se activaron ${vetoCount} veto${vetoCount > 1 ? 's' : ''}`;
    if (elimCount > 0) {
      vetoSummary += `, eliminando ${elimCount} opción${elimCount > 1 ? 'es' : ''}`;
    }
    vetoSummary += '.';
  } else if (roundIndex === 0) {
    vetoSummary = 'No se activaron vetos — todas las opciones compiten.';
  }

  // Consensus trend
  const prevConsensus = prevRound?.consensusScore ?? round.consensusScore;
  const consensusDelta = round.consensusScore - prevConsensus;
  const consensusTrend: RoundNarrative['consensusTrend'] =
    Math.abs(consensusDelta) < 0.005
      ? 'stable'
      : consensusDelta > 0
        ? 'improving'
        : 'declining';

  // Top conflict pair
  const sids = stakeholders.map((s) => s.id);
  let topConflictPair: RoundNarrative['topConflictPair'] = null;
  let maxConflict = 0;
  for (let i = 0; i < sids.length; i++) {
    for (let j = i + 1; j < sids.length; j++) {
      const val = round.conflictMatrix[sids[i]]?.[sids[j]] ?? 0;
      if (val > maxConflict) {
        maxConflict = val;
        topConflictPair = { a: sids[i], b: sids[j], value: val };
      }
    }
  }

  // Build full text
  const lines: string[] = [];

  // Leader line
  if (prevRound === null) {
    lines.push(
      `En la ronda inicial, "${winnerName}" lidera con un score global de ${winnerScore.toFixed(3)}.`,
    );
  } else if (leaderChanged) {
    lines.push(
      `El liderazgo cambió: "${winnerName}" (${winnerScore.toFixed(3)}) supera a "${optionNames[previousLeader] ?? previousLeader}" que lideraba la ronda anterior.`,
    );
  } else {
    lines.push(
      `"${winnerName}" mantiene el liderazgo con ${winnerScore.toFixed(3)}.`,
    );
  }

  // Concessions
  if (positionChanges.length > 0) {
    const names = positionChanges.map((id) => stakeholderNames[id] ?? id);
    lines.push(
      `${names.join(' y ')} ${positionChanges.length === 1 ? 'realizó una concesión' : 'realizaron concesiones'}, ajustando sus pesos hacia el consenso del grupo.`,
    );
  } else if (roundIndex > 0) {
    lines.push(
      'Ningún stakeholder cedió en esta ronda — todas las posiciones se mantienen firmes.',
    );
  }

  // Vetos
  if (vetoSummary) {
    lines.push(vetoSummary);
  }

  // Consensus trend
  if (prevRound !== null) {
    if (consensusTrend === 'improving') {
      lines.push(
        `El consenso mejoró (${prevConsensus.toFixed(3)} → ${round.consensusScore.toFixed(3)}, +${consensusDelta.toFixed(3)}).`,
      );
    } else if (consensusTrend === 'declining') {
      lines.push(
        `El consenso bajó (${prevConsensus.toFixed(3)} → ${round.consensusScore.toFixed(3)}, ${consensusDelta.toFixed(3)}).`,
      );
    } else {
      lines.push(
        `El consenso se mantuvo estable en ${round.consensusScore.toFixed(3)}.`,
      );
    }
  }

  // Top conflict pair
  if (topConflictPair && topConflictPair.value > 0) {
    const aName = stakeholderNames[topConflictPair.a] ?? topConflictPair.a;
    const bName = stakeholderNames[topConflictPair.b] ?? topConflictPair.b;
    lines.push(
      `El mayor conflicto es entre ${aName} y ${bName} (${topConflictPair.value.toFixed(3)}).`,
    );
  }

  return {
    leader: winnerId,
    leaderScore: winnerScore,
    leaderChanged,
    previousLeader,
    positionChanges,
    holdingFirm,
    vetoSummary,
    consensusTrend,
    consensusDelta,
    topConflictPair,
    text: lines.join(' '),
  };
}
