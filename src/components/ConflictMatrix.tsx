import { cn } from '@/lib/utils';
import type { Stakeholder, RoundResult } from '@/engine/types';

interface ConflictMatrixProps {
  round: RoundResult;
  stakeholders: Stakeholder[];
}

function conflictColor(val: number): string {
  if (val === 0) return 'bg-gray-50 text-gray-300';
  if (val > 0.5) return 'bg-red-100 text-red-700 font-bold';
  if (val > 0.25) return 'bg-yellow-50 text-yellow-700';
  return 'bg-green-50 text-green-700';
}

export function ConflictMatrix({ round, stakeholders }: ConflictMatrixProps) {
  const sids = stakeholders.map((s) => s.id);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="text-sm w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" />
              {stakeholders.map((s) => (
                <th key={s.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stakeholders.map((si) => (
              <tr key={si.id}>
                <td className="px-4 py-3 font-medium text-gray-900 text-sm">{si.name}</td>
                {sids.map((sj) => {
                  const val = round.conflictMatrix[si.id]?.[sj] ?? 0;
                  return (
                    <td
                      key={sj}
                      className={cn(
                        'px-4 py-3 text-center font-mono text-sm',
                        conflictColor(si.id === sj ? 0 : val),
                      )}
                    >
                      {si.id === sj ? '—' : val.toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <span>
          Conflicto total: <strong className="font-mono text-gray-700">{round.totalConflict.toFixed(3)}</strong>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-50 border border-green-200" /> Bajo
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200" /> Medio
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-200" /> Alto
        </span>
      </div>
    </div>
  );
}
