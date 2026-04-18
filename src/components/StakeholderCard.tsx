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

const DEFAULT_COLOR = { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-700', icon: '👤' };

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
        'rounded-xl border-2 p-6 transition-shadow hover:shadow-md',
        colors.bg,
        colors.border,
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{colors.icon}</span>
        <div>
          <h3 className={cn('text-lg font-bold', colors.accent)}>{stakeholder.name}</h3>
          <p className="text-sm text-gray-500">{stakeholder.role}</p>
        </div>
      </div>

      {/* Mission */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{stakeholder.mission}</p>

      {!compact && (
        <>
          {/* Priorities */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prioridades</h4>
            <div className="flex flex-wrap gap-1.5">
              {stakeholder.priorities.map((p) => (
                <span
                  key={p}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium',
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
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estilo</h4>
            <p className="text-xs text-gray-600 italic">&ldquo;{stakeholder.style.argumentative}&rdquo;</p>
          </div>

          {/* Weights */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pesos</h4>
            <div className="space-y-1.5">
              {(Object.entries(stakeholder.weights) as [VariableId, number][]).map(([v, w]) => (
                <WeightsBar key={v} label={VARIABLE_LABELS[v]} value={w} />
              ))}
            </div>
          </div>

          {/* Red lines */}
          {stakeholder.redLines.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">🚫 Líneas rojas</h4>
              <ul className="space-y-1">
                {stakeholder.redLines.map((rl, i) => (
                  <li key={i} className="text-xs text-red-600">{rl.description}</li>
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
