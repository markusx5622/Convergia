import type { Concession } from '@/engine/types';

interface ConcessionListProps {
  concessions: Concession[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function ConcessionList({ concessions, stakeholderNames, optionNames }: ConcessionListProps) {
  if (concessions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center">
        <p className="text-sm text-slate-400">
          Sin concesiones en esta ronda — los stakeholders mantienen sus posiciones.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {concessions.map((c, i) => (
        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
          <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">🤝</span>
          <div className="text-sm">
            <strong className="text-amber-700">{stakeholderNames[c.stakeholderId]}</strong>
            {' cede: '}
            <span className="text-slate-700">
              {optionNames[c.fromOptionId] ?? c.fromOptionId}
            </span>
            {' → '}
            <span className="font-semibold text-slate-900">
              {optionNames[c.toOptionId] ?? c.toOptionId}
            </span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              <span className="font-mono text-slate-400">Gap: {c.gap.toFixed(3)}</span> · {c.reason}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
