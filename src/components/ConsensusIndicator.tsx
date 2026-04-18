import { cn } from '@/lib/utils';
import type { ConsensusStatus, RoundResult, Stakeholder } from '@/engine/types';
import { isAcceptableFor } from '@/engine/consensus';

const STATUS_CONFIG: Record<ConsensusStatus, { label: string; color: string; bg: string; border: string }> = {
  full: { label: 'Consenso total', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  partial: { label: 'Consenso parcial', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  tie: { label: 'Empate', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  none: { label: 'Sin consenso', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
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
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={cn('px-3 py-1.5 rounded-full text-sm font-semibold border', config.bg, config.color, config.border)}>
            {config.label}
          </span>
          <span className="text-sm text-slate-500">
            Score: <strong className="font-mono tabular-nums">{round.consensusScore.toFixed(3)}</strong>
          </span>
        </div>
        <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className={cn(
            'h-full rounded-full animate-progress',
            pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 25 ? 'bg-yellow-500' : 'bg-red-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Acceptability per stakeholder */}
      <div className="flex flex-wrap gap-3">
        {stakeholders.map((s) => {
          const ok = isAcceptableFor(s, round.scores[s.id] ?? {}, winnerId);
          return (
            <div key={s.id} className={cn(
              'flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all duration-200',
              ok ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 border-red-200 hover:bg-red-100',
            )}>
              <span className={cn(
                'w-2.5 h-2.5 rounded-full flex-shrink-0',
                ok ? 'bg-emerald-500' : 'bg-red-400',
              )} />
              <span className="text-slate-700 font-medium">{s.name}</span>
              <span className={cn(
                'text-xs font-semibold',
                ok ? 'text-emerald-600' : 'text-red-500',
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
