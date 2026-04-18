'use client';

import { cn } from '@/lib/utils';
import type { ReportData } from '@/engine/report';
import type { ConsensusStatus } from '@/engine/types';
import type { LLMEnrichment } from '@/services/llm/types';
import { AIBadge } from './AINarrativeBanner';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const CONSENSUS_LABEL: Record<ConsensusStatus, string> = {
  full: 'Consenso total',
  partial: 'Consenso parcial',
  tie: 'Empate',
  none: 'Sin consenso',
};

// ---------------------------------------------------------------------------
// Report origin types
// ---------------------------------------------------------------------------

export type ReportOrigin = 'demo' | 'lab' | 'studio';
export type ReportStateType = 'base' | 'adjusted' | 'comparison';

const ORIGIN_LABELS: Record<ReportOrigin, { label: string; icon: string; color: string; bg: string; border: string }> = {
  demo: { label: 'Demo guiada', icon: '🎯', color: 'text-[#111827]', bg: 'bg-slate-50', border: 'border-slate-200' },
  lab: { label: 'Lab / Exploración', icon: '🔬', color: 'text-[#0d6e6e]', bg: 'bg-[#f0fafa]', border: 'border-[#d0ecec]' },
  studio: { label: 'Studio', icon: '🛠', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
};

const STATE_LABELS: Record<ReportStateType, { label: string; description: string }> = {
  base: { label: 'Estado base', description: 'Pesos canónicos del escenario sin modificar' },
  adjusted: { label: 'Estado ajustado', description: 'Pesos modificados por el usuario en Lab' },
  comparison: { label: 'Comparación base vs ajustado', description: 'Análisis comparativo entre estado base y estado con pesos modificados' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ReportViewProps {
  data: ReportData;
  /** Optional AI enrichment for the executive summary */
  enrichment?: LLMEnrichment;
  /** Origin mode that generated this report */
  origin?: ReportOrigin;
  /** Type of state this report represents */
  stateType?: ReportStateType;
}

export function ReportView({ data, enrichment, origin, stateType }: ReportViewProps) {
  // Compute section numbers dynamically to handle conditional sections
  let sectionCounter = 0;
  const nextSection = () => ++sectionCounter;

  const sExecutive = nextSection();           // 1
  const sWinner = nextSection();              // 2
  const sMetrics = nextSection();             // 3
  const sReasons = data.narrative.whyWon ? nextSection() : 0;
  const sBreakdown = nextSection();
  const sConcessions = nextSection();
  const sConsensus = nextSection();
  const sDiscarded = data.narrative.discardedOptions.length > 0 ? nextSection() : 0;
  const sComparison = data.comparison ? nextSection() : 0;

  const originInfo = origin ? ORIGIN_LABELS[origin] : null;
  const stateInfo = stateType ? STATE_LABELS[stateType] : null;

  return (
    <div className="report-container max-w-[800px] mx-auto bg-white print:shadow-none print:max-w-none">
      {/* ── Report context banner ── */}
      {(originInfo || stateInfo) && (
        <div className={cn(
          'rounded-lg border p-4 mb-6 print:mb-4',
          originInfo?.bg ?? 'bg-slate-50',
          originInfo?.border ?? 'border-slate-200',
        )}>
          <div className="flex items-center gap-4 flex-wrap">
            {originInfo && (
              <div className="flex items-center gap-2">
                <span className="text-base">{originInfo.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Origen</p>
                  <p className={cn('text-sm font-bold', originInfo.color)}>{originInfo.label}</p>
                </div>
              </div>
            )}
            {originInfo && stateInfo && (
              <span className="h-8 w-px bg-slate-200" />
            )}
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escenario</p>
                <p className="text-sm font-bold text-[#111827]">{data.companyName} — {data.scenarioName}</p>
              </div>
            </div>
            {stateInfo && (
              <>
                <span className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</p>
                  <p className="text-sm font-bold text-[#111827]">{stateInfo.label}</p>
                  <p className="text-xs text-slate-500">{stateInfo.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b-2 border-[#111827] pb-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Informe de Simulación
            </h1>
            <p className="text-lg text-[#5b6578] mt-1">
              {data.companyName} — {data.scenarioName}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-bold text-[#0d6e6e] tracking-wider uppercase">Convergia</p>
            <p className="text-xs text-[#5b6578] mt-0.5">Motor determinista</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {new Date(data.generatedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </header>

      {/* ── 1. Executive summary ── */}
      <section className="mb-8">
        <SectionHeading number={sExecutive} title="Resumen ejecutivo" />
        <p className="text-slate-700 leading-relaxed mb-4">
          {data.scenarioDescription}
        </p>
        <p className="text-slate-700 leading-relaxed font-medium">
          {data.narrative.headline}
        </p>
        {/* AI-enriched executive summary */}
        {enrichment?.source === 'ai' && enrichment.executiveSummary && (
          <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
            <p className="text-slate-700 leading-relaxed text-sm">
              {enrichment.executiveSummary}
              <AIBadge />
            </p>
          </div>
        )}
      </section>

      {/* ── 2. Winner ── */}
      <section className="mb-8">
        <SectionHeading number={sWinner} title="Opción ganadora" />
        {data.winnerName ? (
          <div className="border-2 border-slate-900 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{data.winnerName}</h3>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed max-w-lg">
                  {data.winnerDescription}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {data.winnerCost !== null && (
                  <p className="text-lg font-bold text-slate-900">
                    {(data.winnerCost / 1000).toFixed(0)}k€
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-600 font-medium">
            No se pudo determinar una opción ganadora tras las rondas de negociación.
          </p>
        )}
      </section>

      {/* ── 3. Key metrics ── */}
      <section className="mb-8">
        <SectionHeading number={sMetrics} title="Métricas clave" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Consenso"
            value={CONSENSUS_LABEL[data.consensusStatus]}
          />
          <MetricCard
            label="Score de consenso"
            value={data.consensusScore.toFixed(3)}
            mono
          />
          <MetricCard
            label="Conflicto total"
            value={data.totalConflict.toFixed(3)}
            mono
          />
          <MetricCard
            label="Aceptabilidad"
            value={`${data.acceptCount}/${data.stakeholderCount}`}
          />
        </div>
      </section>

      {/* ── 4. Why this option won ── */}
      {data.narrative.whyWon && (
        <section className="mb-8">
          <SectionHeading number={sReasons} title="Razones del resultado" />
          <p className="text-slate-700 leading-relaxed mb-4">
            {data.narrative.whyWon}
          </p>

          {data.narrative.keyVariables.length > 0 && (
            <div>
              <p className="text-sm font-bold text-slate-900 mb-2">Variables determinantes:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                {data.narrative.keyVariables.map((kv) => (
                  <li key={kv.variable}>
                    <span className="font-semibold">{kv.label}</span>
                    <span className="text-slate-500"> — {kv.contribution}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {/* ── 5. Stakeholder breakdown ── */}
      <section className="mb-8">
        <SectionHeading number={sBreakdown} title="Desglose por stakeholder" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="text-left py-2 pr-4 font-bold text-slate-900">Stakeholder</th>
                <th className="text-left py-2 pr-4 font-bold text-slate-900">Rol</th>
                <th className="text-left py-2 pr-4 font-bold text-slate-900">Preferencia</th>
                <th className="text-center py-2 pr-4 font-bold text-slate-900">Score</th>
                <th className="text-center py-2 font-bold text-slate-900">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.stakeholderBreakdown.map((sb) => (
                <tr key={sb.name} className="border-b border-slate-200">
                  <td className="py-2 pr-4 font-medium text-slate-900">{sb.name}</td>
                  <td className="py-2 pr-4 text-slate-600 text-xs">{sb.role}</td>
                  <td className="py-2 pr-4 text-slate-700">
                    {sb.topOption}
                    {!sb.aligned && (
                      <span className="text-slate-400 text-xs ml-1">(≠ ganador)</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-center font-mono tabular-nums text-slate-700">
                    {sb.scoreForWinner.toFixed(3)}
                  </td>
                  <td className="py-2 text-center">
                    {sb.acceptable ? (
                      <span className="text-emerald-700 font-semibold text-xs">Acepta</span>
                    ) : (
                      <span className="text-red-600 font-semibold text-xs">No acepta</span>
                    )}
                    {sb.conceded && (
                      <span className="text-amber-600 text-xs ml-1">(cedió)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. Concessions ── */}
      <section className="mb-8">
        <SectionHeading number={sConcessions} title="Concesiones" />
        {data.concessions.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No hubo concesiones — todos los stakeholders mantuvieron sus posiciones originales.
          </p>
        ) : (
          <div>
            <p className="text-slate-700 leading-relaxed mb-3">
              {data.narrative.concessionSynthesis}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="text-left py-2 pr-4 font-bold text-slate-900">Ronda</th>
                    <th className="text-left py-2 pr-4 font-bold text-slate-900">Stakeholder</th>
                    <th className="text-left py-2 pr-4 font-bold text-slate-900">De → A</th>
                    <th className="text-center py-2 font-bold text-slate-900">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {data.concessions.map((c, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-mono text-slate-500">R{c.round}</td>
                      <td className="py-2 pr-4 font-medium text-slate-900">
                        {data.stakeholderNames[c.stakeholderId] ?? c.stakeholderId}
                      </td>
                      <td className="py-2 pr-4 text-slate-700">
                        {data.optionNames[c.fromOptionId] ?? c.fromOptionId}
                        {' → '}
                        {data.optionNames[c.toOptionId] ?? c.toOptionId}
                      </td>
                      <td className="py-2 text-center font-mono tabular-nums text-slate-600">
                        {c.gap.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── 7. Consensus analysis ── */}
      <section className="mb-8">
        <SectionHeading number={sConsensus} title="Análisis de consenso" />
        <p className="text-slate-700 leading-relaxed mb-2">
          {data.narrative.consensusSummary}
        </p>
        <p className="text-slate-700 leading-relaxed">
          {data.narrative.acceptabilitySummary}
        </p>
      </section>

      {/* ── 8. Discarded options ── */}
      {data.narrative.discardedOptions.length > 0 && (
        <section className="mb-8">
          <SectionHeading number={sDiscarded} title="Opciones descartadas" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="text-left py-2 pr-4 font-bold text-slate-900">Opción</th>
                  <th className="text-center py-2 pr-4 font-bold text-slate-900">Score</th>
                  <th className="text-left py-2 font-bold text-slate-900">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {data.narrative.discardedOptions.map((d) => (
                  <tr key={d.optionId} className="border-b border-slate-200">
                    <td className="py-2 pr-4 font-medium text-slate-900">{d.optionName}</td>
                    <td className="py-2 pr-4 text-center font-mono tabular-nums text-slate-600">
                      {d.globalScore.toFixed(3)}
                    </td>
                    <td className="py-2 text-slate-600 text-xs leading-relaxed">{d.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 9. Comparison (optional) ── */}
      {data.comparison && (
        <section className="mb-8 break-before-page">
          <SectionHeading
            number={sComparison}
            title="Comparación base vs ajustado"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Base</p>
              <p className="text-lg font-bold text-slate-900">{data.comparison.baseWinnerName}</p>
              <p className="text-xs text-slate-500 font-mono">
                Consenso: {data.comparison.baseConsensusScore.toFixed(3)} · Conflicto: {data.comparison.baseConflict.toFixed(3)}
              </p>
            </div>
            <div className={cn(
              'border rounded-lg p-4',
              data.comparison.winnerChanged ? 'border-amber-300 bg-amber-50/50' : 'border-emerald-300 bg-emerald-50/50',
            )}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ajustado</p>
              <p className="text-lg font-bold text-slate-900">{data.comparison.adjustedWinnerName}</p>
              <p className="text-xs text-slate-500 font-mono">
                Consenso: {data.comparison.adjustedConsensusScore.toFixed(3)} · Conflicto: {data.comparison.adjustedConflict.toFixed(3)}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="text-left py-2 pr-4 font-bold text-slate-900">Opción</th>
                  <th className="text-center py-2 pr-4 font-bold text-slate-900">Base</th>
                  <th className="text-center py-2 pr-4 font-bold text-slate-900">Ajustado</th>
                  <th className="text-center py-2 font-bold text-slate-900">Δ</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison.rows.map((r) => (
                  <tr key={r.optionName} className="border-b border-slate-200">
                    <td className="py-2 pr-4 font-medium text-slate-900">
                      {r.optionName}
                      {r.isAdjustedWinner && <span className="ml-1 text-xs text-slate-500">(ganador)</span>}
                    </td>
                    <td className="py-2 pr-4 text-center font-mono tabular-nums text-slate-600">
                      {r.baseScore.toFixed(3)}
                    </td>
                    <td className="py-2 pr-4 text-center font-mono tabular-nums font-bold text-slate-900">
                      {r.adjustedScore.toFixed(3)}
                    </td>
                    <td className={cn(
                      'py-2 text-center font-mono tabular-nums text-xs',
                      r.delta > 0.005 ? 'text-emerald-600' : r.delta < -0.005 ? 'text-red-600' : 'text-slate-400',
                    )}>
                      {r.delta > 0 ? '+' : ''}{r.delta.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t-2 border-[#111827] pt-4 mt-12">
        <div className="flex items-center justify-between text-xs text-[#5b6578]">
          <div>
            <p className="font-bold text-[#0d6e6e]">Convergia</p>
            <p>Motor determinista de negociación multi-stakeholder</p>
            {enrichment?.source === 'ai' && (
              <p className="text-violet-500 mt-1">
                ✨ Narrativa enriquecida con IA (redacción solamente — resultados deterministas)
              </p>
            )}
          </div>
          <div className="text-right">
            <p>Generado: {new Date(data.generatedAt).toLocaleString('es-ES')}</p>
            <p>{data.roundCount} rondas · {data.stakeholderCount} stakeholders · Resultado determinista</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility sub-components
// ---------------------------------------------------------------------------

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-lg font-extrabold text-[#111827] tracking-tight mb-4 pb-2 border-b border-[#e1e4eb]">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center text-xs font-bold">
        {number}
      </span>
      {title}
    </h2>
  );
}

function MetricCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-3 text-center">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={cn('text-lg font-extrabold text-slate-900', mono && 'font-mono tabular-nums')}>
        {value}
      </p>
    </div>
  );
}
