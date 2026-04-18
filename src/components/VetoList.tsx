import type { Veto } from '@/engine/types';

interface VetoListProps {
  vetoes: Veto[];
  eliminatedIds: string[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function VetoList({ vetoes, eliminatedIds, stakeholderNames, optionNames }: VetoListProps) {
  if (vetoes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center animate-fade-in">
        <span className="text-2xl block mb-2">✅</span>
        <p className="text-slate-500 text-sm font-medium">
          No se activaron líneas rojas
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Todas las opciones pasan al debate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 stagger-children">
      <ul className="space-y-2">
        {vetoes.map((v, i) => (
          <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm transition-all duration-200 hover:shadow-md">
            <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">🚫</span>
            <div className="text-sm">
              <strong className="text-red-700">{stakeholderNames[v.stakeholderId]}</strong>
              {' veta '}
              <strong className="text-slate-900">{optionNames[v.optionId] ?? v.optionId}</strong>
              <p className="text-red-600/80 text-xs mt-1 leading-relaxed">{v.redLineDescription}</p>
            </div>
          </li>
        ))}
      </ul>
      {eliminatedIds.length > 0 && (
        <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-sm font-semibold text-red-800 flex items-center gap-2 animate-scale-in">
          <span>❌</span>
          Opciones eliminadas (≥2 vetos): {eliminatedIds.map((id) => optionNames[id] ?? id).join(', ')}
        </div>
      )}
    </div>
  );
}
