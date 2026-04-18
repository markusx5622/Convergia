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

  if (activeOptions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-400">No hay opciones activas en esta ronda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stakeholder
            </th>
            {activeOptions.map((o) => (
              <th key={o.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {o.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stakeholders.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900 text-sm">{s.name}</td>
              {activeOptions.map((o) => {
                const score = round.scores[s.id]?.[o.id] ?? 0;
                const isTop = round.rankings[s.id]?.[0] === o.id;
                return (
                  <td
                    key={o.id}
                    className={cn(
                      'px-4 py-3 text-center font-mono text-sm tabular-nums',
                      isTop ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-600',
                    )}
                  >
                    {score.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-slate-50 font-semibold">
            <td className="px-4 py-3 text-slate-900">Promedio global</td>
            {activeOptions.map((o) => {
              const score = round.globalScores[o.id] ?? 0;
              const isWinner = o.id === winnerId;
              return (
                <td
                  key={o.id}
                  className={cn(
                    'px-4 py-3 text-center font-mono tabular-nums',
                    isWinner ? 'bg-yellow-50 text-yellow-800 font-bold' : 'text-slate-700',
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
