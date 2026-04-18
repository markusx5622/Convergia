'use client';

import { useMemo } from 'react';
import type { BuilderState, ValidationError } from '@/lib/builder-types';
import { buildScenario, buildStakeholders, buildOptions } from '@/lib/builder-convert';
import { validateAll } from '@/lib/builder-validation';
import { runSimulation } from '@/engine/simulation';
import { VARIABLE_LABELS } from '@/engine/types';
import type { SimulationResult } from '@/engine/types';
import { cn } from '@/lib/utils';

interface Props {
  state: BuilderState;
}

export function StepPreview({ state }: Props) {
  const errors: ValidationError[] = useMemo(() => validateAll(state), [state]);
  const isValid = errors.length === 0;

  const result: SimulationResult | null = useMemo(() => {
    if (!isValid) return null;
    try {
      const scenario = buildScenario(state);
      const stakeholders = buildStakeholders(state);
      const options = buildOptions(state);
      return runSimulation(scenario, stakeholders, options);
    } catch {
      return null;
    }
  }, [state, isValid]);

  if (!isValid) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-sm font-bold text-amber-800">
            El escenario tiene {errors.length} error{errors.length !== 1 ? 'es' : ''}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Vuelve al paso de validación para corregirlos antes de simular.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
        <p className="text-2xl mb-2">❌</p>
        <p className="text-sm font-bold text-red-800">Error ejecutando la simulación</p>
        <p className="text-xs text-red-600 mt-1">
          Revisa los datos del escenario. Es posible que algún valor sea inconsistente.
        </p>
      </div>
    );
  }

  const lastRound = result.rounds[result.rounds.length - 1];
  const winner = result.finalOption;
  const engineStakeholders = buildStakeholders(state);
  const engineOptions = buildOptions(state);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info banner */}
      <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">🚀</span>
          <div>
            <p className="text-sm font-bold text-[#111827] mb-1">Resultado de la simulación</p>
            <p className="text-xs text-[#5b6578] leading-relaxed">
              El motor determinista ha ejecutado {result.rounds.length} rondas de negociación con
              tus datos personalizados. Los resultados son reproducibles e idénticos cada vez que se
              ejecutan con los mismos inputs.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm card-interactive">
        <h2 className="text-lg font-bold text-[#111827] mb-1">{state.scenario.name}</h2>
        <p className="text-sm text-slate-500 mb-3">{state.scenario.company}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>
            Presupuesto:{' '}
            <strong className="text-slate-900">
              {parseFloat(state.scenario.budget).toLocaleString('es-ES')}€
            </strong>
          </span>
          <span>
            Stakeholders: <strong className="text-slate-900">{state.stakeholders.length}</strong>
          </span>
          <span>
            Opciones: <strong className="text-slate-900">{state.options.length}</strong>
          </span>
          <span>
            Rondas: <strong className="text-slate-900">{result.rounds.length}</strong>
          </span>
        </div>
      </div>

      {/* Winner */}
      {winner ? (
        <div className="bg-gradient-to-r from-emerald-50 to-[#f0fafa] rounded-xl border border-emerald-200 p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Opción ganadora
              </p>
              <p className="text-xl font-extrabold text-emerald-900">{winner.name}</p>
            </div>
          </div>
          <p className="text-sm text-emerald-800 mb-2">{winner.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
              Coste: {winner.cost.toLocaleString('es-ES')}€
            </span>
            <span className="text-emerald-700">
              Consenso: <strong>{result.consensusStatus}</strong>
            </span>
            <span className="text-emerald-700">
              Conflicto total: <strong>{lastRound.totalConflict.toFixed(3)}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
          <p className="text-sm font-bold text-amber-800">
            No se pudo determinar una opción ganadora
          </p>
        </div>
      )}

      {/* Global scores */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Puntuaciones globales (última ronda)
        </h3>
        <div className="space-y-2">
          {engineOptions
            .map((o) => ({
              option: o,
              score: lastRound.globalScores[o.id] ?? 0,
            }))
            .sort((a, b) => b.score - a.score)
            .map(({ option, score }, rank) => {
              const isWinner = winner && option.id === winner.id;
              const maxScore = Math.max(
                ...Object.values(lastRound.globalScores),
                0.001,
              );
              return (
                <div
                  key={option.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 border',
                    isWinner
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-100',
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      isWinner
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600',
                    )}
                  >
                    {rank + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 flex-1">
                    {option.name}
                  </span>
                  <div className="w-40 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full animate-progress',
                        isWinner ? 'bg-emerald-500' : 'bg-slate-400',
                      )}
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-700 w-14 text-right">
                    {score.toFixed(3)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Scores per stakeholder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Scores por stakeholder (última ronda)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-2 text-xs font-bold text-slate-500">Opción</th>
                {engineStakeholders.map((s) => (
                  <th key={s.id} className="text-right py-2 px-2 text-xs font-bold text-slate-500">
                    {s.name}
                  </th>
                ))}
                <th className="text-right py-2 px-2 text-xs font-bold text-slate-700">Global</th>
              </tr>
            </thead>
            <tbody>
              {engineOptions.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-150">
                  <td className="py-2 px-2 font-medium text-slate-900">{o.name}</td>
                  {engineStakeholders.map((s) => (
                    <td key={s.id} className="py-2 px-2 text-right font-mono text-slate-600">
                      {(lastRound.scores[s.id]?.[o.id] ?? 0).toFixed(3)}
                    </td>
                  ))}
                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                    {(lastRound.globalScores[o.id] ?? 0).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vetoes */}
      {result.rounds[0].vetoes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Vetos detectados</h3>
          <div className="space-y-2">
            {result.rounds[0].vetoes.map((v, i) => {
              const sh = engineStakeholders.find((s) => s.id === v.stakeholderId);
              const opt = engineOptions.find((o) => o.id === v.optionId);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-red-50 rounded-lg px-4 py-2 border border-red-100 text-sm"
                >
                  <span className="text-red-500 font-bold">🚫</span>
                  <span className="text-red-800">
                    <strong>{sh?.name ?? v.stakeholderId}</strong> veta{' '}
                    <strong>{opt?.name ?? v.optionId}</strong>
                  </span>
                  <span className="text-xs text-red-600 ml-auto">{v.redLineDescription}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Eliminated options */}
      {lastRound.eliminatedOptionIds.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Opciones eliminadas</h3>
          <div className="flex flex-wrap gap-2">
            {lastRound.eliminatedOptionIds.map((eid) => {
              const opt = engineOptions.find((o) => o.id === eid);
              return (
                <span
                  key={eid}
                  className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-md line-through"
                >
                  {opt?.name ?? eid}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Rounds detail */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Evolución por rondas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
          {result.rounds.map((round) => {
            const roundWinnerId = Object.entries(round.globalScores).sort(
              ([, a], [, b]) => b - a,
            )[0]?.[0];
            const roundWinner = engineOptions.find((o) => o.id === roundWinnerId);
            return (
              <div
                key={round.round}
                className="bg-slate-50 rounded-lg border border-slate-200 p-4 card-interactive"
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ronda {round.round}
                </p>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  {roundWinner?.name ?? '—'}
                </p>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>Consenso: <strong>{round.consensusStatus}</strong> ({round.consensusScore.toFixed(3)})</p>
                  <p>Conflicto: <strong>{round.totalConflict.toFixed(3)}</strong></p>
                  <p>Concesiones: <strong>{round.concessions.length}</strong></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-r from-[#111827] to-[#0d3d3d] rounded-xl p-6 shadow-lg animate-fade-in-up">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Explicación final
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">{result.explanation}</p>
      </div>
    </div>
  );
}
