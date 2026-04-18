import { cn } from '@/lib/utils';
import type { Stakeholder, RoundResult } from '@/engine/types';

interface RankingListProps {
  round: RoundResult;
  stakeholder: Stakeholder;
  optionNames: Record<string, string>;
}

export function RankingList({ round, stakeholder, optionNames }: RankingListProps) {
  const ranking = round.rankings[stakeholder.id] ?? [];

  if (ranking.length === 0) {
    return <p className="text-xs text-slate-400 italic">Sin ranking disponible.</p>;
  }

  return (
    <ol className="space-y-1.5">
      {ranking.map((oid, idx) => {
        const score = round.scores[stakeholder.id]?.[oid] ?? 0;
        return (
          <li key={oid} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                idx === 0
                  ? 'bg-yellow-400 text-yellow-900'
                  : idx === 1
                  ? 'bg-slate-300 text-slate-700'
                  : idx === 2
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-slate-100 text-slate-500',
              )}
            >
              {idx + 1}
            </span>
            <span className="text-slate-900 truncate flex-1">{optionNames[oid] ?? oid}</span>
            <span className="font-mono text-xs text-slate-400 ml-auto flex-shrink-0 tabular-nums">
              {score.toFixed(3)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

interface RankingGridProps {
  round: RoundResult;
  stakeholders: Stakeholder[];
  optionNames: Record<string, string>;
}

export function RankingGrid({ round, stakeholders, optionNames }: RankingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stakeholders.map((s) => (
        <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-3">
            {s.name}
            <span className="text-xs text-slate-400 font-normal ml-2">{s.role}</span>
          </h4>
          <RankingList round={round} stakeholder={s} optionNames={optionNames} />
        </div>
      ))}
    </div>
  );
}
