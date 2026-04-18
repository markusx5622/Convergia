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
        'rounded-xl border-2 p-6 transition-shadow hover:shadow-md bg-white',
        highlight ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
          {letter}
        </span>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{option.name}</h3>
          <span className="text-sm font-semibold text-gray-500">
            {(option.cost / 1000).toFixed(0)}k€
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{option.description}</p>

      {/* Impacts */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Impactos</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {(Object.entries(option.impacts) as [VariableId, number][]).map(([v, val]) => (
            <div key={v} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 truncate">{VARIABLE_LABELS[v]}</span>
              <span className={cn(
                'font-mono font-medium ml-1',
                val >= 0.6 ? 'text-green-600' : val >= 0.3 ? 'text-gray-700' : 'text-red-500',
              )}>
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Favors / Tensions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {option.favors.map((f) => (
          <span key={f} className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
            ✓ {stakeholderName[f] ?? f}
          </span>
        ))}
        {option.tensionWith.map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-medium">
            ⚡ {stakeholderName[t] ?? t}
          </span>
        ))}
      </div>

      {/* Risks */}
      {option.risks.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Riesgos</h4>
          <ul className="space-y-0.5">
            {option.risks.map((r, i) => (
              <li key={i} className="text-xs text-gray-500">⚠ {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
