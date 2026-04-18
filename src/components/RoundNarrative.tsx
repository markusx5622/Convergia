import { cn } from '@/lib/utils';
import type { RoundNarrative } from '@/engine/narrative';

interface RoundNarrativeCardProps {
  narrative: RoundNarrative;
  optionNames: Record<string, string>;
  stakeholderNames: Record<string, string>;
}

export function RoundNarrativeCard({
  narrative,
  optionNames,
  stakeholderNames,
}: RoundNarrativeCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">📝</span>
        <h4 className="text-sm font-bold text-blue-900">Resumen de la ronda</h4>
        {narrative.leaderChanged && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
            ↻ Cambio de líder
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border',
            narrative.consensusTrend === 'improving'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : narrative.consensusTrend === 'declining'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-50 text-slate-600 border-slate-200',
            narrative.leaderChanged ? '' : 'ml-auto',
          )}
        >
          {narrative.consensusTrend === 'improving'
            ? '↑ Consenso mejora'
            : narrative.consensusTrend === 'declining'
              ? '↓ Consenso baja'
              : '= Consenso estable'}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-4">
        {narrative.text}
      </p>

      {/* Key metrics row */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-lg border border-blue-100 text-xs font-medium text-slate-700">
          🏆 Líder: <strong>{optionNames[narrative.leader] ?? narrative.leader}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-lg border border-blue-100 text-xs font-medium text-slate-700">
          📊 Score: <strong className="font-mono tabular-nums">{narrative.leaderScore.toFixed(3)}</strong>
        </span>
        {narrative.positionChanges.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-xs font-medium text-amber-700">
            🤝 {narrative.positionChanges.length} concesión{narrative.positionChanges.length > 1 ? 'es' : ''}
          </span>
        )}
        {narrative.topConflictPair && (() => {
          const nameA = stakeholderNames[narrative.topConflictPair.a] ?? narrative.topConflictPair.a;
          const nameB = stakeholderNames[narrative.topConflictPair.b] ?? narrative.topConflictPair.b;
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg border border-red-100 text-xs font-medium text-red-700">
              ⚔️ {nameA} vs {nameB} ({narrative.topConflictPair.value.toFixed(3)})
            </span>
          );
        })()}
      </div>
    </div>
  );
}
