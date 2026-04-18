import { cn } from '@/lib/utils';
import type { ResultNarrative } from '@/engine/narrative';
import { VARIABLE_LABELS } from '@/engine/types';
import type { VariableId } from '@/engine/types';

interface ResultExplanationProps {
  narrative: ResultNarrative;
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function ResultExplanation({
  narrative,
  stakeholderNames,
  optionNames,
}: ResultExplanationProps) {
  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📋</span>
          <h3 className="font-bold text-slate-900">Resumen de la decisión</h3>
        </div>
        <p className="text-slate-800 font-medium text-lg leading-relaxed">
          {narrative.headline}
        </p>
      </div>

      {/* Why this option won */}
      {narrative.whyWon && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🎯</span>
            <h3 className="font-bold text-slate-900">¿Por qué ganó esta opción?</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">{narrative.whyWon}</p>
        </div>
      )}

      {/* Key variables */}
      {narrative.keyVariables.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">⚖️</span>
            <h3 className="font-bold text-slate-900">Variables que más pesaron</h3>
          </div>
          <div className="space-y-3">
            {narrative.keyVariables.map((kv, i) => (
              <div
                key={kv.variable}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">
                    {VARIABLE_LABELS[kv.variable as VariableId] ?? kv.label}
                  </p>
                  <p className="text-xs text-slate-500">{kv.contribution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stakeholder alignment */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🧭</span>
          <h3 className="font-bold text-slate-900">Alineación de stakeholders</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {narrative.alignment.map((a) => {
            const name = stakeholderNames[a.stakeholderId] ?? a.stakeholderId;
            return (
              <div
                key={a.stakeholderId}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  a.aligned
                    ? 'bg-emerald-50 border-emerald-200'
                    : a.conceded
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-red-50 border-red-200',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm',
                    a.aligned
                      ? 'bg-emerald-200 text-emerald-800'
                      : a.conceded
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-red-200 text-red-800',
                  )}
                >
                  {a.aligned ? '✓' : a.conceded ? '↻' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{name}</p>
                  <p className="text-xs text-slate-500">
                    {a.aligned
                      ? 'Alineado con la opción ganadora'
                      : a.conceded
                        ? `Cedió — prefería "${optionNames[a.topOption] ?? a.topOption}"`
                        : `No alineado — prefiere "${optionNames[a.topOption] ?? a.topOption}"`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consensus summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🤝</span>
          <h3 className="font-bold text-slate-900">Nivel de consenso</h3>
        </div>
        <p className="text-slate-700 leading-relaxed">{narrative.consensusSummary}</p>
      </div>

      {/* Acceptability */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">✅</span>
          <h3 className="font-bold text-slate-900">Aceptabilidad</h3>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {narrative.acceptabilitySummary}
        </p>
      </div>

      {/* Concession synthesis */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🔄</span>
          <h3 className="font-bold text-slate-900">Síntesis de concesiones</h3>
        </div>
        <p className="text-slate-700 leading-relaxed">
          {narrative.concessionSynthesis}
        </p>
      </div>
    </div>
  );
}
