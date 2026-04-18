'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Stakeholder, VariableId } from '@/engine/types';
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';

interface StakeholderWeightSlidersProps {
  /** Current stakeholders (may have user-modified weights) */
  stakeholders: Stakeholder[];
  /** Canonical stakeholders for reference */
  canonicalStakeholders: Stakeholder[];
  /** Called when a weight changes */
  onWeightsChange: (stakeholderIndex: number, weights: Record<VariableId, number>) => void;
}

const STAKEHOLDER_COLORS: Record<string, string> = {
  production: 'accent-blue-600',
  quality: 'accent-emerald-600',
  finance: 'accent-amber-600',
  sustainability: 'accent-green-600',
};

/**
 * Renormalise weights so they sum to 1.0, preserving relative proportions
 * of all variables except the one being changed.
 */
function renormaliseWeights(
  current: Record<VariableId, number>,
  changedVar: VariableId,
  newValue: number,
): Record<VariableId, number> {
  const result = { ...current };
  result[changedVar] = newValue;

  // Sum of other weights (excluding changed)
  const otherVars = VARIABLE_IDS.filter((v) => v !== changedVar);
  const otherSum = otherVars.reduce((s, v) => s + current[v], 0);
  const remaining = 1.0 - newValue;

  if (otherSum > 0 && remaining >= 0) {
    // Proportional redistribution
    const scale = remaining / otherSum;
    for (const v of otherVars) {
      result[v] = Math.round(current[v] * scale * 10000) / 10000;
    }
  } else if (remaining >= 0) {
    // All others are zero — distribute equally
    const each = remaining / otherVars.length;
    for (const v of otherVars) {
      result[v] = Math.round(each * 10000) / 10000;
    }
  }

  // Final normalisation pass to guarantee sum = 1.0
  const total = VARIABLE_IDS.reduce((s, v) => s + result[v], 0);
  if (Math.abs(total - 1.0) > 0.001) {
    for (const v of VARIABLE_IDS) {
      result[v] = Math.round((result[v] / total) * 10000) / 10000;
    }
  }

  return result;
}

export function StakeholderWeightSliders({
  stakeholders,
  canonicalStakeholders,
  onWeightsChange,
}: StakeholderWeightSlidersProps) {
  const handleChange = useCallback(
    (sIdx: number, variable: VariableId, rawValue: number) => {
      const newWeights = renormaliseWeights(
        stakeholders[sIdx].weights,
        variable,
        rawValue,
      );
      onWeightsChange(sIdx, newWeights);
    },
    [stakeholders, onWeightsChange],
  );

  return (
    <div className="space-y-6">
      {stakeholders.map((s, sIdx) => {
        const canonical = canonicalStakeholders[sIdx];
        const isModified = canonical
          ? VARIABLE_IDS.some(
              (v) => Math.abs(s.weights[v] - canonical.weights[v]) > 0.005,
            )
          : false;

        return (
          <div
            key={s.id}
            className={cn(
              'rounded-xl border-2 p-5 bg-white transition-all',
              isModified ? 'border-amber-300 shadow-md' : 'border-slate-200 shadow-sm',
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <h4 className="font-bold text-slate-900">{s.name}</h4>
              <span className="text-xs text-slate-400">{s.role}</span>
              {isModified && (
                <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Modificado
                </span>
              )}
            </div>
            <div className="space-y-3">
              {VARIABLE_IDS.map((v) => {
                const value = s.weights[v];
                const canonicalValue = canonical?.weights[v] ?? value;
                const changed = Math.abs(value - canonicalValue) > 0.005;
                return (
                  <div key={v} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-36 truncate" title={VARIABLE_LABELS[v]}>
                      {VARIABLE_LABELS[v]}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={0.8}
                      step={0.01}
                      value={value}
                      onChange={(e) => handleChange(sIdx, v, parseFloat(e.target.value))}
                      className={cn(
                        'flex-1 h-2 rounded-full cursor-pointer appearance-none bg-slate-200',
                        STAKEHOLDER_COLORS[s.id] ?? 'accent-slate-600',
                      )}
                    />
                    <span className={cn(
                      'text-xs font-mono w-12 text-right tabular-nums',
                      changed ? 'text-amber-600 font-bold' : 'text-slate-500',
                    )}>
                      {(value * 100).toFixed(0)}%
                    </span>
                    {changed && (
                      <span className="text-[10px] text-slate-400 w-10 text-right tabular-nums">
                        ({(canonicalValue * 100).toFixed(0)}%)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-right">
              <span className="text-[10px] text-slate-400 font-mono">
                Σ = {(VARIABLE_IDS.reduce((s2, v2) => s2 + s.weights[v2], 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
