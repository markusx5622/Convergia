'use client';

import { cn } from '@/lib/utils';
import type { ScenarioBundle } from '@/data/scenarios';

interface ScenarioSelectorProps {
  bundles: ScenarioBundle[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ScenarioSelector({ bundles, activeId, onSelect }: ScenarioSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {bundles.map((b) => {
        const isActive = b.id === activeId;
        return (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className={cn(
              'text-left rounded-xl border-2 p-5 transition-all',
              isActive
                ? 'border-[#0d6e6e] bg-[#111827] text-white shadow-lg scale-[1.02]'
                : 'border-[#e1e4eb] bg-white text-[#5b6578] hover:border-[#0d6e6e]/40 hover:shadow-md',
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{b.icon}</span>
              <span className={cn(
                'text-base font-bold',
                isActive ? 'text-white' : 'text-slate-900',
              )}>
                {b.label}
              </span>
            </div>
            <p className={cn(
              'text-sm leading-relaxed',
              isActive ? 'text-slate-300' : 'text-slate-500',
            )}>
              {b.tagline}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                'text-xs font-mono px-2 py-0.5 rounded-md',
                isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
              )}>
                {(b.scenario.budget / 1000).toFixed(0)}k€
              </span>
              <span className={cn(
                'text-xs font-mono px-2 py-0.5 rounded-md',
                isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
              )}>
                {b.options.length} opciones
              </span>
              <span className={cn(
                'text-xs font-mono px-2 py-0.5 rounded-md',
                isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500',
              )}>
                {b.stakeholders.length} stakeholders
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
