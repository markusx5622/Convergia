import { cn } from '@/lib/utils';
import type { InvestmentOption, VariableId } from '@/engine/types';
import { VARIABLE_LABELS } from '@/engine/types';
import { stakeholders } from '@/data/stakeholders';

const stakeholderName: Record<string, string> = {};
for (const s of stakeholders) stakeholderName[s.id] = s.name;

interface OptionCardProps {
  option: InvestmentOption;
  index: number;
  className?: string;
  highlight?: boolean;
}

export function OptionCard({ option, index, className, highlight = false }: OptionCardProps) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const letter = letters[index] ?? String(index + 1);

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6 card-interactive bg-white',
        highlight ? 'border-[#0d6e6e] ring-2 ring-[#0d6e6e]/20 shadow-md' : 'border-slate-200 shadow-sm',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-colors duration-200',
          highlight ? 'bg-[#0d6e6e] text-white' : 'bg-slate-900 text-white',
        )}>
          {letter}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 leading-tight">{option.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              'text-sm font-bold px-2.5 py-0.5 rounded-lg transition-colors duration-200',
              highlight ? 'text-white bg-[#0d6e6e]' : 'text-slate-900 bg-slate-100',
            )}>
              {(option.cost / 1000).toFixed(0)}k€
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{option.description}</p>

      {/* Impacts */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Impactos</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(Object.entries(option.impacts) as [VariableId, number][]).map(([v, val]) => (
            <div key={v} className="flex items-center justify-between text-xs gap-1">
              <span className="text-slate-500 truncate">{VARIABLE_LABELS[v]}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full animate-progress',
                      val >= 0.6 ? 'bg-emerald-400' : val >= 0.3 ? 'bg-slate-400' : 'bg-red-400',
                    )}
                    style={{ width: `${val * 100}%` }}
                  />
                </div>
                <span className={cn(
                  'font-mono font-semibold tabular-nums w-8 text-right',
                  val >= 0.6 ? 'text-emerald-600' : val >= 0.3 ? 'text-slate-700' : 'text-red-500',
                )}>
                  {val.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favors / Tensions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {option.favors.map((f) => (
          <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 transition-colors duration-200 hover:bg-emerald-100">
            ✓ {stakeholderName[f] ?? f}
          </span>
        ))}
        {option.tensionWith.map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 font-medium border border-red-200 transition-colors duration-200 hover:bg-red-100">
            ⚡ {stakeholderName[t] ?? t}
          </span>
        ))}
      </div>

      {/* Risks */}
      {option.risks.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Riesgos</h4>
          <ul className="space-y-1">
            {option.risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
