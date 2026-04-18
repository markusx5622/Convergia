import { cn } from '@/lib/utils';
import type { Stakeholder, VariableId } from '@/engine/types';
import { VARIABLE_LABELS } from '@/engine/types';
import { WeightsBar } from './WeightsBar';

const STAKEHOLDER_COLORS: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
  production: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-700', icon: '🏭' },
  quality: { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'text-emerald-700', icon: '🔍' },
  finance: { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-700', icon: '💰' },
  sustainability: { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-700', icon: '🌱' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-50', border: 'border-slate-200', accent: 'text-slate-700', icon: '👤' };

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  compact?: boolean;
  className?: string;
}

export function StakeholderCard({ stakeholder, compact = false, className }: StakeholderCardProps) {
  const colors = STAKEHOLDER_COLORS[stakeholder.id] ?? DEFAULT_COLOR;

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6 card-interactive bg-white',
        colors.border,
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl" aria-hidden="true">{colors.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-lg font-bold', colors.accent)}>{stakeholder.name}</h3>
          <p className="text-sm text-slate-500">{stakeholder.role}</p>
        </div>
      </div>

      {/* Mission */}
      <p className="text-sm text-slate-700 mb-4 leading-relaxed">{stakeholder.mission}</p>

      {!compact && (
        <>
          {/* Priorities */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Prioridades</h4>
            <div className="flex flex-wrap gap-1.5">
              {stakeholder.priorities.map((p) => (
                <span
                  key={p}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200',
                    colors.bg,
                    colors.accent,
                    'border',
                    colors.border,
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estilo de negociación</h4>
            <p className="text-xs text-slate-600 italic leading-relaxed">&ldquo;{stakeholder.style.argumentative}&rdquo;</p>
          </div>

          {/* Weights */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pesos por variable</h4>
            <div className="space-y-1.5">
              {(Object.entries(stakeholder.weights) as [VariableId, number][]).map(([v, w]) => (
                <WeightsBar key={v} label={VARIABLE_LABELS[v]} value={w} />
              ))}
            </div>
          </div>

          {/* Red lines */}
          {stakeholder.redLines.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                🚫 Líneas rojas
                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold">
                  {stakeholder.redLines.length}
                </span>
              </h4>
              <ul className="space-y-1">
                {stakeholder.redLines.map((rl, i) => (
                  <li key={i} className="text-xs text-red-600 leading-relaxed flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {rl.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { STAKEHOLDER_COLORS, DEFAULT_COLOR };
