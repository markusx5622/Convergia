import type { Concession } from '@/engine/types';

interface ConcessionListProps {
  concessions: Concession[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function ConcessionList({ concessions, stakeholderNames, optionNames }: ConcessionListProps) {
  if (concessions.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Sin concesiones en esta ronda.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {concessions.map((c, i) => (
        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <span className="text-amber-500 text-lg">🤝</span>
          <div className="text-sm">
            <strong className="text-amber-700">{stakeholderNames[c.stakeholderId]}</strong>
            {' cede: '}
            <span className="text-gray-700">
              {optionNames[c.fromOptionId] ?? c.fromOptionId}
            </span>
            {' → '}
            <span className="font-semibold text-gray-900">
              {optionNames[c.toOptionId] ?? c.toOptionId}
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Gap: {c.gap.toFixed(3)} · {c.reason}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
