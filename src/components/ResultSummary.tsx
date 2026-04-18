import { cn } from '@/lib/utils';
import type { SimulationResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { isAcceptableFor } from '@/engine/consensus';
import { buildResultNarrative } from '@/engine/narrative';
import { ResultExplanation } from './ResultExplanation';
import { DiscardedOptions } from './DiscardedOptions';
import { AIBadge } from './AINarrativeBanner';
import type { LLMEnrichment } from '@/services/llm/types';

const STATUS_LABEL: Record<string, string> = {
  full: 'Consenso total',
  partial: 'Consenso parcial',
  tie: 'Empate',
  none: 'Sin consenso',
};

const STATUS_STYLE: Record<string, string> = {
  full: 'bg-emerald-100 text-emerald-800 border-emerald-200',
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
  /** Optional AI enrichment — only used when AI mode is active */
  enrichment?: LLMEnrichment;
}

export function ResultSummary({
  simulation,
  stakeholders,
  options,
  stakeholderNames,
  optionNames,
  enrichment,
}: ResultSummaryProps) {
  const { finalOption, consensusStatus, rounds, finalScores } = simulation;
  const lastRound = rounds[rounds.length - 1];

  // Gather all concessions across all rounds
  const allConcessions = rounds.flatMap((r) =>
    r.concessions.map((c) => ({ ...c, round: r.round })),
  );

  // Vetoes from round 1
  const vetoes = rounds[0]?.vetoes ?? [];

  // Count acceptances
  const acceptCount = finalOption
    ? stakeholders.filter((s) => isAcceptableFor(s, finalScores[s.id] ?? {}, finalOption.id)).length
    : 0;

  // Build deterministic narrative
  const narrative = buildResultNarrative(
    simulation,
    stakeholders,
    options,
    optionNames,
    stakeholderNames,
  );

  return (
    <div className="space-y-6">
      {/* Winner card */}
      {finalOption ? (
        <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 p-8 shadow-md">
          <div className="flex items-start gap-5">
            <span className="text-5xl flex-shrink-0">🏆</span>
            <div className="flex-1">
              <p className="text-xs text-yellow-700 font-bold uppercase tracking-widest mb-2">Opción ganadora</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{finalOption.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-5">{finalOption.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-slate-200 text-sm font-medium shadow-sm">
                  💰 <strong>{(finalOption.cost / 1000).toFixed(0)}k€</strong>
                </span>
                <span className={cn('inline-flex items-center px-3.5 py-1.5 rounded-full border text-sm font-bold', STATUS_STYLE[consensusStatus])}>
                  {STATUS_LABEL[consensusStatus]}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-slate-200 text-sm font-medium shadow-sm">
                  📊 <strong className="font-mono tabular-nums">{lastRound?.consensusScore.toFixed(3)}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-slate-200 text-sm font-medium shadow-sm">
                  👥 <strong>{acceptCount}/{stakeholders.length}</strong> aceptan
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-8 text-center shadow-sm">
          <span className="text-4xl mb-3 block">⚠️</span>
          <p className="text-red-600 font-bold text-lg">No se pudo determinar una opción ganadora.</p>
          <p className="text-red-500 text-sm mt-1">El motor no alcanzó suficiente consenso entre los stakeholders.</p>
        </div>
      )}

      {/* Rich explanatory narrative */}
      <ResultExplanation
        narrative={narrative}
        stakeholderNames={stakeholderNames}
        optionNames={optionNames}
      />

      {/* Discarded options with reasons */}
      <DiscardedOptions discardedOptions={narrative.discardedOptions} />

      {/* Final breakdown per stakeholder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-base">👥</span>
          <h3 className="font-bold text-slate-900">Desglose final por stakeholder</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeholders.map((s) => {
            const scores = finalScores[s.id] ?? {};
            const ranking = lastRound?.rankings[s.id] ?? [];
            const topOption = ranking[0];
            const acceptable = finalOption
              ? isAcceptableFor(s, scores, finalOption.id)
              : false;

            return (
              <div key={s.id} className={cn(
                'rounded-xl border-2 p-5 transition-shadow',
                acceptable ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30',
              )}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900">{s.name}</h4>
                  <span className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold border',
                    acceptable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200',
                  )}>
                    {acceptable ? '✓ Acepta' : '✗ No acepta'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">
                  Preferencia final: <strong className="text-slate-700">{optionNames[topOption] ?? topOption}</strong>
                  {finalOption && topOption !== finalOption.id && (
                    <span className="text-amber-600 ml-1 font-medium">(≠ ganador)</span>
                  )}
                </p>
                {finalOption && (
                  <p className="text-xs text-slate-500">
                    Score para ganadora: <strong className="font-mono tabular-nums">{(scores[finalOption.id] ?? 0).toFixed(3)}</strong>
                    {' · '}
                    Umbral: <span className="font-mono tabular-nums">{s.acceptabilityThreshold.toFixed(2)}</span>
                  </p>
                )}
                {/* AI-enriched stakeholder argument */}
                {enrichment?.source === 'ai' && (() => {
                  const arg = enrichment.stakeholderArguments.find(
                    (a) => a.stakeholderId === s.id,
                  );
                  return arg ? (
                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;{arg.text}&rdquo;
                        <AIBadge />
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Concessions timeline */}
      {allConcessions.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-base">🤝</span>
            <h3 className="font-bold text-slate-900">Concesiones realizadas</h3>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {allConcessions.length} total
            </span>
          </div>
          <div className="space-y-3">
            {allConcessions.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">
                  R{c.round}
                </span>
                <div className="text-sm">
                  <strong className="text-amber-700">{stakeholderNames[c.stakeholderId]}</strong>
                  {' cedió de '}
                  <span className="text-slate-700">{optionNames[c.fromOptionId] ?? c.fromOptionId}</span>
                  {' hacia '}
                  <span className="font-bold text-slate-900">{optionNames[c.toOptionId] ?? c.toOptionId}</span>
                  <p className="text-xs text-slate-500 mt-1">{c.reason}</p>
                  {/* AI-enriched concession text */}
                  {enrichment?.source === 'ai' && (() => {
                    const ct = enrichment.concessionTexts.find(
                      (a) => a.stakeholderId === c.stakeholderId,
                    );
                    return ct ? (
                      <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                        &ldquo;{ct.text}&rdquo;
                        <AIBadge />
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
          <p className="text-sm text-slate-400">
            No hubo concesiones durante la negociación — los stakeholders mantuvieron sus posiciones.
          </p>
        </div>
      )}

      {/* Vetoed options */}
      {vetoes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-base">🚫</span>
            <h3 className="font-bold text-slate-900">Vetos aplicados</h3>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {vetoes.length}
            </span>
          </div>
          <ul className="space-y-2">
            {vetoes.map((v, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm">
                <span className="text-red-500 flex-shrink-0">🚫</span>
                <div>
                  <strong className="text-red-700">{stakeholderNames[v.stakeholderId]}</strong>
                  {' vetó '}
                  <strong className="text-slate-900">{optionNames[v.optionId] ?? v.optionId}</strong>
                  <p className="text-xs text-red-600/80 mt-1">{v.redLineDescription}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
