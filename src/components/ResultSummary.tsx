import { cn } from '@/lib/utils';
import type { SimulationResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { isAcceptableFor } from '@/engine/consensus';

const STATUS_LABEL: Record<string, string> = {
  full: 'Consenso total',
  partial: 'Consenso parcial',
  tie: 'Empate',
  none: 'Sin consenso',
};

const STATUS_STYLE: Record<string, string> = {
  full: 'bg-green-100 text-green-800 border-green-200',
  partial: 'bg-blue-100 text-blue-800 border-blue-200',
  tie: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  none: 'bg-red-100 text-red-800 border-red-200',
};

interface ResultSummaryProps {
  simulation: SimulationResult;
  stakeholders: Stakeholder[];
  options: InvestmentOption[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function ResultSummary({
  simulation,
  stakeholders,
  options,
  stakeholderNames,
  optionNames,
}: ResultSummaryProps) {
  const { finalOption, consensusStatus, rounds, finalScores } = simulation;
  const lastRound = rounds[rounds.length - 1];

  // Gather all concessions across all rounds
  const allConcessions = rounds.flatMap((r) =>
    r.concessions.map((c) => ({ ...c, round: r.round })),
  );

  // Eliminated options
  const eliminatedIds = rounds[0]?.eliminatedOptionIds ?? [];
  const eliminatedOptions = options.filter((o) => eliminatedIds.includes(o.id));

  // Vetoes from round 1
  const vetoes = rounds[0]?.vetoes ?? [];

  return (
    <div className="space-y-8">
      {/* Winner card */}
      {finalOption ? (
        <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 p-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🏆</span>
            <div className="flex-1">
              <p className="text-sm text-yellow-700 font-semibold uppercase tracking-wider mb-1">Opción ganadora</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{finalOption.name}</h2>
              <p className="text-gray-600 mb-4">{finalOption.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-white rounded-full border border-gray-200">
                  💰 Coste: <strong>{(finalOption.cost / 1000).toFixed(0)}k€</strong>
                </span>
                <span className={cn('px-3 py-1 rounded-full border font-semibold', STATUS_STYLE[consensusStatus])}>
                  {STATUS_LABEL[consensusStatus]}
                </span>
                <span className="px-3 py-1 bg-white rounded-full border border-gray-200">
                  📊 Score consenso: <strong className="font-mono">{lastRound?.consensusScore.toFixed(3)}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-8 text-center">
          <p className="text-red-600 font-semibold text-lg">No se pudo determinar una opción ganadora.</p>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Explicación</h3>
        <p className="text-gray-700 leading-relaxed">{simulation.explanation}</p>
      </div>

      {/* Final breakdown per stakeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Desglose final por stakeholder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeholders.map((s) => {
            const scores = finalScores[s.id] ?? {};
            const ranking = lastRound?.rankings[s.id] ?? [];
            const topOption = ranking[0];
            const acceptable = finalOption
              ? isAcceptableFor(s, scores, finalOption.id)
              : false;

            return (
              <div key={s.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{s.name}</h4>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    acceptable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                  )}>
                    {acceptable ? '✓ Acepta' : '✗ No acepta'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Preferencia final: <strong className="text-gray-700">{optionNames[topOption] ?? topOption}</strong>
                  {finalOption && topOption !== finalOption.id && (
                    <span className="text-amber-600 ml-1">(diferente al ganador)</span>
                  )}
                </p>
                {finalOption && (
                  <p className="text-xs text-gray-500">
                    Score para ganadora: <strong className="font-mono">{(scores[finalOption.id] ?? 0).toFixed(3)}</strong>
                    {' · '}
                    Umbral: <span className="font-mono">{s.acceptabilityThreshold.toFixed(2)}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Concessions timeline */}
      {allConcessions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Concesiones realizadas</h3>
          <div className="space-y-3">
            {allConcessions.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">
                  R{c.round}
                </span>
                <div className="text-sm">
                  <strong className="text-amber-700">{stakeholderNames[c.stakeholderId]}</strong>
                  {' cedió de '}
                  <span className="text-gray-700">{optionNames[c.fromOptionId] ?? c.fromOptionId}</span>
                  {' hacia '}
                  <span className="font-semibold text-gray-900">{optionNames[c.toOptionId] ?? c.toOptionId}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{c.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vetoed options */}
      {vetoes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Vetos aplicados</h3>
          <ul className="space-y-2">
            {vetoes.map((v, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
                <span className="text-red-500">🚫</span>
                <div>
                  <strong className="text-red-700">{stakeholderNames[v.stakeholderId]}</strong>
                  {' vetó '}
                  <strong className="text-gray-900">{optionNames[v.optionId] ?? v.optionId}</strong>
                  <p className="text-xs text-red-600 mt-0.5">{v.redLineDescription}</p>
                </div>
              </li>
            ))}
          </ul>
          {eliminatedOptions.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-red-100 text-red-800 text-sm font-semibold">
              Opciones eliminadas: {eliminatedOptions.map((o) => o.name).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
