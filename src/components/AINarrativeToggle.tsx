'use client';

import { cn } from '@/lib/utils';

interface AINarrativeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Toggle switch for enabling/disabling the optional AI narrative layer.
 * Always shows experimental badge and disclaimer.
 */
export function AINarrativeToggle({
  enabled,
  onToggle,
  loading = false,
  error,
}: AINarrativeToggleProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        enabled
          ? 'bg-violet-50 border-violet-200'
          : 'bg-slate-50 border-slate-200',
      )}
    >
      <div className="flex items-center gap-3">
        {/* Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          disabled={loading}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
            enabled ? 'bg-violet-600' : 'bg-slate-300',
            loading && 'opacity-50 cursor-wait',
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              enabled ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </button>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Narrativa IA
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
              Experimental
            </span>
            {loading && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-100 text-violet-700 border border-violet-200 animate-pulse">
                Generando…
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {enabled
              ? 'IA enriquece la redacción. Los resultados siguen siendo deterministas.'
              : 'Activar para enriquecer la narrativa con IA. No afecta los resultados.'}
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">
            <strong>Error IA:</strong> {error}
          </p>
          <p className="text-xs text-red-500 mt-1">
            La app continúa funcionando con narrativa determinista.
          </p>
        </div>
      )}
    </div>
  );
}
