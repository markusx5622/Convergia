import { cn } from '@/lib/utils';
import type { ResultNarrative } from '@/engine/narrative';

interface DiscardedOptionsProps {
  discardedOptions: ResultNarrative['discardedOptions'];
}

export function DiscardedOptions({ discardedOptions }: DiscardedOptionsProps) {
  if (discardedOptions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-base">📊</span>
        <div>
          <h3 className="font-bold text-[#111827]">Opciones descartadas</h3>
          <span className="text-xs text-slate-400">
            {discardedOptions.length} opción{discardedOptions.length > 1 ? 'es' : ''} no seleccionada{discardedOptions.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="space-y-3 stagger-children">
        {discardedOptions.map((d) => {
          const isEliminated = d.reason.startsWith('Eliminada');
          return (
            <div
              key={d.optionId}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 hover:shadow-sm',
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
