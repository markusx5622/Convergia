import { cn } from '@/lib/utils';
import type { ConsensusStatus, RoundResult, Stakeholder } from '@/engine/types';
import { isAcceptableFor } from '@/engine/consensus';

const STATUS_CONFIG: Record<ConsensusStatus, { label: string; color: string; bg: string }> = {
  full: { label: 'Consenso total', color: 'text-green-700', bg: 'bg-green-100' },
  partial: { label: 'Consenso parcial', color: 'text-blue-700', bg: 'bg-blue-100' },
  tie: { label: 'Empate', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  none: { label: 'Sin consenso', color: 'text-red-700', bg: 'bg-red-100' },
};

interface ConsensusIndicatorProps {
  round: RoundResult;
  stakeholders: Stakeholder[];
  winnerId: string;
}

export function ConsensusIndicator({ round, stakeholders, winnerId }: ConsensusIndicatorProps) {
  const config = STATUS_CONFIG[round.consensusStatus];
  const pct = Math.round(round.consensusScore * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={cn('px-3 py-1 rounded-full text-sm font-semibold', config.bg, config.color)}>
            {config.label}
          </span>
          <span className="text-sm text-gray-500">
            Score: <strong className="font-mono">{round.consensusScore.toFixed(3)}</strong>
          </span>
        </div>
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : pct >= 25 ? 'bg-yellow-500' : 'bg-red-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Acceptability per stakeholder */}
      <div className="flex flex-wrap gap-3">
        {stakeholders.map((s) => {
          const ok = isAcceptableFor(s, round.scores[s.id] ?? {}, winnerId);
          return (
            <div key={s.id} className="flex items-center gap-1.5 text-sm">
              <span className={cn(
                'w-2.5 h-2.5 rounded-full',
                ok ? 'bg-green-500' : 'bg-red-400',
              )} />
              <span className="text-gray-700">{s.name}</span>
              <span className={cn(
                'text-xs font-medium',
                ok ? 'text-green-600' : 'text-red-500',
              )}>
                {ok ? 'Acepta' : 'No acepta'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
