import type { Concession } from '@/engine/types';

interface ConcessionListProps {
  concessions: Concession[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function ConcessionList({ concessions, stakeholderNames, optionNames }: ConcessionListProps) {
  if (concessions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center animate-fade-in">
        <span className="text-xl block mb-2">🤲</span>
        <p className="text-sm text-slate-500 font-medium">Sin concesiones en esta ronda</p>
        <p className="text-xs text-slate-400 mt-1">Los stakeholders mantienen sus posiciones.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 stagger-children">
      {concessions.map((c, i) => (
        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">🤝</span>
          <div className="text-sm flex-1">
            <strong className="text-amber-700">{stakeholderNames[c.stakeholderId]}</strong>
            {' cede: '}
            <span className="text-slate-700">
              {optionNames[c.fromOptionId] ?? c.fromOptionId}
            </span>
            <span className="mx-1.5 text-amber-500 font-bold">→</span>
            <span className="font-semibold text-slate-900">
              {optionNames[c.toOptionId] ?? c.toOptionId}
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed flex items-center gap-2">
              <span className="font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Gap: {c.gap.toFixed(3)}</span>
              <span className="text-slate-400">·</span>
              <span>{c.reason}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
