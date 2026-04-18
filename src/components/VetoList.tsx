import type { Veto, Stakeholder, InvestmentOption } from '@/engine/types';

interface VetoListProps {
  vetoes: Veto[];
  eliminatedIds: string[];
  stakeholderNames: Record<string, string>;
  optionNames: Record<string, string>;
}

export function VetoList({ vetoes, eliminatedIds, stakeholderNames, optionNames }: VetoListProps) {
  if (vetoes.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">No se activaron líneas rojas.</p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {vetoes.map((v, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <span className="text-red-500 text-lg">🚫</span>
            <div className="text-sm">
              <strong className="text-red-700">{stakeholderNames[v.stakeholderId]}</strong>
              {' veta '}
              <strong className="text-gray-900">{optionNames[v.optionId] ?? v.optionId}</strong>
              <p className="text-red-600 text-xs mt-0.5">{v.redLineDescription}</p>
            </div>
          </li>
        ))}
      </ul>
      {eliminatedIds.length > 0 && (
        <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-sm font-semibold text-red-800">
          Opciones eliminadas (≥2 vetos): {eliminatedIds.map((id) => optionNames[id] ?? id).join(', ')}
        </div>
      )}
    </div>
  );
}
