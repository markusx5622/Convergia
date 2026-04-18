import { cn } from '@/lib/utils';
import type { Stakeholder, InvestmentOption, RoundResult } from '@/engine/types';

interface RankingListProps {
  round: RoundResult;
  stakeholder: Stakeholder;
  optionNames: Record<string, string>;
}

export function RankingList({ round, stakeholder, optionNames }: RankingListProps) {
  const ranking = round.rankings[stakeholder.id] ?? [];

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
                  ? 'bg-gray-300 text-gray-700'
                  : idx === 2
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-gray-100 text-gray-500',
              )}
            >
              {idx + 1}
            </span>
            <span className="text-gray-900 truncate flex-1">{optionNames[oid] ?? oid}</span>
            <span className="font-mono text-xs text-gray-400 ml-auto flex-shrink-0">
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
        <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            {s.name}
            <span className="text-xs text-gray-400 font-normal ml-2">{s.role}</span>
          </h4>
          <RankingList round={round} stakeholder={s} optionNames={optionNames} />
        </div>
      ))}
    </div>
  );
}
