'use client';

import { cn } from '@/lib/utils';
import type { SimulationResult, Stakeholder, InvestmentOption, ConsensusStatus } from '@/engine/types';

interface ComparisonPanelProps {
  baseResult: SimulationResult;
  adjustedResult: SimulationResult;
  options: InvestmentOption[];
  stakeholders: Stakeholder[];
  isModified: boolean;
}

const CONSENSUS_LABEL: Record<ConsensusStatus, string> = {
  full: 'Consenso total',
  partial: 'Consenso parcial',
  tie: 'Empate',
  none: 'Sin consenso',
};

const CONSENSUS_STYLE: Record<ConsensusStatus, string> = {
  full: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-blue-100 text-blue-800',
  tie: 'bg-yellow-100 text-yellow-800',
  none: 'bg-red-100 text-red-800',
};

function getWinnerId(result: SimulationResult): string {
  return result.finalOption?.id ?? '';
}

function getGlobalScore(result: SimulationResult, optionId: string): number {
  const lastRound = result.rounds[result.rounds.length - 1];
  return lastRound?.globalScores[optionId] ?? 0;
}

function getTotalConflict(result: SimulationResult): number {
  const lastRound = result.rounds[result.rounds.length - 1];
  return lastRound?.totalConflict ?? 0;
}

function getConsensusScore(result: SimulationResult): number {
  const lastRound = result.rounds[result.rounds.length - 1];
  return lastRound?.consensusScore ?? 0;
}

export function ComparisonPanel({
  baseResult,
  adjustedResult,
  options,
  stakeholders,
  isModified,
}: ComparisonPanelProps) {
  const optionNames: Record<string, string> = {};
  for (const o of options) optionNames[o.id] = o.name;

  const baseWinner = getWinnerId(baseResult);
  const adjWinner = getWinnerId(adjustedResult);
  const winnerChanged = baseWinner !== adjWinner;

  const baseConflict = getTotalConflict(baseResult);
  const adjConflict = getTotalConflict(adjustedResult);
  const conflictDelta = adjConflict - baseConflict;

  const baseConsensusScore = getConsensusScore(baseResult);
  const adjConsensusScore = getConsensusScore(adjustedResult);
  const consensusDelta = adjConsensusScore - baseConsensusScore;

  const baseConsensusStatus = baseResult.consensusStatus;
  const adjConsensusStatus = adjustedResult.consensusStatus;
  const consensusStatusChanged = baseConsensusStatus !== adjConsensusStatus;

  // Global scores for all options — adjusted
  const adjLastRound = adjustedResult.rounds[adjustedResult.rounds.length - 1];
  const baseLastRound = baseResult.rounds[baseResult.rounds.length - 1];

  if (!isModified) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
        <span className="text-3xl block mb-3">🔬</span>
        <p className="text-slate-600 font-medium">Resultado canónico</p>
        <p className="text-sm text-slate-400 mt-1">
          Ajusta los pesos de los stakeholders o cambia de escenario para ver comparación base vs ajustado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Winner comparison */}
      <div className={cn(
        'rounded-xl border-2 p-6',
        winnerChanged
          ? 'border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50'
          : 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50',
      )}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{winnerChanged ? '🔄' : '✅'}</span>
          <h3 className="font-bold text-slate-900">
            {winnerChanged ? 'El ganador cambió' : 'El ganador se mantiene'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/70 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Base</p>
            <p className="text-lg font-bold text-slate-900">
              {baseResult.finalOption?.name ?? 'Sin ganador'}
            </p>
            <p className="text-sm text-slate-500 font-mono tabular-nums">
              Score: {getGlobalScore(baseResult, baseWinner).toFixed(3)}
            </p>
          </div>
          <div className={cn(
            'rounded-lg p-4 border',
            winnerChanged
              ? 'bg-amber-100/50 border-amber-300'
              : 'bg-emerald-100/50 border-emerald-300',
          )}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ajustado</p>
            <p className="text-lg font-bold text-slate-900">
              {adjustedResult.finalOption?.name ?? 'Sin ganador'}
            </p>
            <p className="text-sm text-slate-500 font-mono tabular-nums">
              Score: {getGlobalScore(adjustedResult, adjWinner).toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Consensus status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Consenso</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-10">Base</span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', CONSENSUS_STYLE[baseConsensusStatus])}>
                {CONSENSUS_LABEL[baseConsensusStatus]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-10">Ajust.</span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', CONSENSUS_STYLE[adjConsensusStatus])}>
                {CONSENSUS_LABEL[adjConsensusStatus]}
              </span>
              {consensusStatusChanged && (
                <span className="text-amber-500 text-xs font-bold">← cambió</span>
              )}
            </div>
          </div>
        </div>

        {/* Consensus score */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Score de consenso</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {adjConsensusScore.toFixed(3)}
            </span>
            <span className={cn(
              'text-sm font-semibold font-mono tabular-nums',
              consensusDelta > 0.005 ? 'text-emerald-600' : consensusDelta < -0.005 ? 'text-red-600' : 'text-slate-400',
            )}>
              {consensusDelta > 0 ? '+' : ''}{consensusDelta.toFixed(3)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Base: {baseConsensusScore.toFixed(3)}</p>
        </div>

        {/* Conflict */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Conflicto total</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {adjConflict.toFixed(3)}
            </span>
            <span className={cn(
              'text-sm font-semibold font-mono tabular-nums',
              conflictDelta < -0.005 ? 'text-emerald-600' : conflictDelta > 0.005 ? 'text-red-600' : 'text-slate-400',
            )}>
              {conflictDelta > 0 ? '+' : ''}{conflictDelta.toFixed(3)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Base: {baseConflict.toFixed(3)}</p>
        </div>
      </div>

      {/* Global scores ranking comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>📊</span> Ranking global comparado
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Opción</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Score base</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Score ajustado</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Delta</th>
              </tr>
            </thead>
            <tbody>
              {options
                .filter((o) => !adjLastRound?.eliminatedOptionIds.includes(o.id))
                .sort((a, b) => (adjLastRound?.globalScores[b.id] ?? 0) - (adjLastRound?.globalScores[a.id] ?? 0))
                .map((o) => {
                  const baseScore = baseLastRound?.globalScores[o.id] ?? 0;
                  const adjScore = adjLastRound?.globalScores[o.id] ?? 0;
                  const delta = adjScore - baseScore;
                  const isBaseWinner = o.id === baseWinner;
                  const isAdjWinner = o.id === adjWinner;
                  return (
                    <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-3">
                        <span className="font-medium text-slate-900">{o.name}</span>
                        {isAdjWinner && <span className="ml-1.5 text-yellow-500">🏆</span>}
                        {isBaseWinner && !isAdjWinner && <span className="ml-1.5 text-slate-400 text-xs">(ex-🏆)</span>}
                      </td>
                      <td className="py-2 px-3 text-center font-mono tabular-nums text-slate-600">
                        {baseScore.toFixed(3)}
                      </td>
                      <td className={cn(
                        'py-2 px-3 text-center font-mono tabular-nums font-bold',
                        isAdjWinner ? 'text-slate-900' : 'text-slate-600',
                      )}>
                        {adjScore.toFixed(3)}
                      </td>
                      <td className={cn(
                        'py-2 px-3 text-center font-mono tabular-nums text-sm',
                        delta > 0.005 ? 'text-emerald-600' : delta < -0.005 ? 'text-red-600' : 'text-slate-400',
                      )}>
                        {delta > 0 ? '+' : ''}{delta.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-stakeholder top option changes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>👥</span> Preferencias por stakeholder
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stakeholders.map((s) => {
            const baseTop = baseLastRound?.rankings[s.id]?.[0] ?? '';
            const adjTop = adjLastRound?.rankings[s.id]?.[0] ?? '';
            const changed = baseTop !== adjTop;
            return (
              <div
                key={s.id}
                className={cn(
                  'p-3 rounded-lg border',
                  changed ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200',
                )}
              >
                <p className="text-sm font-bold text-slate-900">{s.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-slate-500">{optionNames[baseTop] ?? baseTop}</span>
                  {changed && (
                    <>
                      <span className="text-amber-500 font-bold">→</span>
                      <span className="text-amber-700 font-semibold">{optionNames[adjTop] ?? adjTop}</span>
                    </>
                  )}
                  {!changed && (
                    <span className="text-emerald-500 font-semibold">sin cambio</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
