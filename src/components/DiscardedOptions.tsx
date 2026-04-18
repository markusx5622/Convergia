import { cn } from '@/lib/utils';
import type { ResultNarrative } from '@/engine/narrative';

interface DiscardedOptionsProps {
  discardedOptions: ResultNarrative['discardedOptions'];
}

export function DiscardedOptions({ discardedOptions }: DiscardedOptionsProps) {
  if (discardedOptions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📊</span>
        <h3 className="font-bold text-slate-900">Opciones descartadas</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          {discardedOptions.length}
        </span>
      </div>
      <div className="space-y-3">
        {discardedOptions.map((d) => {
          const isEliminated = d.reason.startsWith('Eliminada');
          return (
            <div
              key={d.optionId}
              className={cn(
                'p-4 rounded-xl border',
                isEliminated
                  ? 'bg-red-50/50 border-red-200'
                  : 'bg-slate-50 border-slate-200',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {d.optionName}
                    </h4>
                    {isEliminated && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold border border-red-200">
                        ELIMINADA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {d.reason}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-mono font-bold text-slate-700 tabular-nums">
                    {d.globalScore.toFixed(3)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    vs {d.winnerScore.toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
