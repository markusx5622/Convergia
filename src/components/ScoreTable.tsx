import { cn } from '@/lib/utils';
import type { RoundResult, InvestmentOption, Stakeholder } from '@/engine/types';

interface ScoreTableProps {
  round: RoundResult;
  stakeholders: Stakeholder[];
  options: InvestmentOption[];
}

export function ScoreTable({ round, stakeholders, options }: ScoreTableProps) {
  const activeOptions = options.filter(
    (o) => !round.eliminatedOptionIds.includes(o.id),
  );
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stakeholder
            </th>
            {activeOptions.map((o) => (
              <th key={o.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {o.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stakeholders.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
              {activeOptions.map((o) => {
                const score = round.scores[s.id]?.[o.id] ?? 0;
                const isTop = round.rankings[s.id]?.[0] === o.id;
                return (
                  <td
                    key={o.id}
                    className={cn(
                      'px-4 py-3 text-center font-mono text-sm',
                      isTop ? 'bg-blue-50 font-bold text-blue-700' : 'text-gray-600',
                    )}
                  >
                    {score.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td className="px-4 py-3 text-gray-900">Promedio global</td>
            {activeOptions.map((o) => {
              const score = round.globalScores[o.id] ?? 0;
              const isWinner = o.id === winnerId;
              return (
                <td
                  key={o.id}
                  className={cn(
                    'px-4 py-3 text-center font-mono',
                    isWinner ? 'bg-yellow-50 text-yellow-800 font-bold' : 'text-gray-700',
                  )}
                >
                  {score.toFixed(3)}
                  {isWinner && ' 🏆'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
