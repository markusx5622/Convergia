'use client';

import type { DraftStakeholder, DraftRedLine } from '@/lib/builder-types';
import type { VariableId } from '@/engine/types';
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  stakeholders: DraftStakeholder[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, partial: Partial<DraftStakeholder>) => void;
  onUpdateWeight: (sIdx: number, variable: VariableId, value: string) => void;
  onAddRedLine: (sIdx: number) => void;
  onRemoveRedLine: (sIdx: number, rlIdx: number) => void;
  onUpdateRedLine: (sIdx: number, rlIdx: number, partial: Partial<DraftRedLine>) => void;
}

export function StepStakeholders({
  stakeholders,
  onAdd,
  onRemove,
  onUpdate,
  onUpdateWeight,
  onAddRedLine,
  onRemoveRedLine,
  onUpdateRedLine,
}: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info banner */}
      <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-sm font-bold text-[#111827] mb-1">Define los stakeholders</p>
            <p className="text-xs text-[#5b6578] leading-relaxed">
              Cada stakeholder tiene pesos por variable (deben sumar 1.0), líneas rojas, y
              parámetros de concesión. Mínimo 2 stakeholders para la negociación.
            </p>
          </div>
        </div>
      </div>

      {/* Stakeholder list */}
      <div className="space-y-4">
        {stakeholders.map((sh, i) => {
          const isExpanded = expandedIdx === i;
          const weightSum = VARIABLE_IDS.reduce(
            (acc, v) => acc + (parseFloat(sh.weights[v]) || 0),
            0,
          );
          const weightOk = Math.abs(weightSum - 1.0) <= 0.01;

          return (
            <div
              key={sh.uid}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {sh.name || `Stakeholder ${i + 1}`}
                    </p>
                    <p className="text-xs text-slate-500">{sh.role || 'Sin rol definido'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-xs font-mono px-2 py-0.5 rounded-md',
                      weightOk
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200',
                    )}
                  >
                    Σ {weightSum.toFixed(3)}
                  </span>
                  <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-slate-100 px-5 py-5 space-y-5 animate-fade-in">
                  {/* Name + Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nombre
                      </label>
                      <input
                        value={sh.name}
                        onChange={(e) => onUpdate(i, { name: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                        placeholder="Ej: Producción"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Rol
                      </label>
                      <input
                        value={sh.role}
                        onChange={(e) => onUpdate(i, { role: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                        placeholder="Ej: Director de Producción"
                      />
                    </div>
                  </div>

                  {/* Weights */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pesos por variable
                      </label>
                      <span
                        className={cn(
                          'text-xs font-mono px-2 py-0.5 rounded-md',
                          weightOk
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600',
                        )}
                      >
                        Total: {weightSum.toFixed(3)} {weightOk ? '✓' : '(debe ser 1.000)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {VARIABLE_IDS.map((v) => (
                        <div key={v} className="flex items-center gap-2">
                          <label
                            className="text-xs text-slate-600 flex-1 truncate"
                            title={VARIABLE_LABELS[v]}
                          >
                            {VARIABLE_LABELS[v]}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={sh.weights[v]}
                            onChange={(e) => onUpdateWeight(i, v, e.target.value)}
                            className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-right text-slate-900 font-mono focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concession params */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block">
                      Parámetros de concesión
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <NumericField
                        label="Umbral de concesión"
                        value={sh.concessionThreshold}
                        onChange={(v) => onUpdate(i, { concessionThreshold: v })}
                        hint="Gap mínimo para ceder"
                      />
                      <NumericField
                        label="Tasa de concesión"
                        value={sh.concessionRate}
                        onChange={(v) => onUpdate(i, { concessionRate: v })}
                        hint="Velocidad de ajuste"
                      />
                      <NumericField
                        label="Umbral de aceptabilidad"
                        value={sh.acceptabilityThreshold}
                        onChange={(v) => onUpdate(i, { acceptabilityThreshold: v })}
                        hint="Score mínimo aceptable"
                      />
                    </div>
                  </div>

                  {/* Red lines */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Líneas rojas
                      </label>
                      <button
                        onClick={() => onAddRedLine(i)}
                        className="text-xs font-semibold text-[#0d6e6e] hover:text-[#0f8585] transition-colors"
                      >
                        + Añadir línea roja
                      </button>
                    </div>
                    {sh.redLines.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        Sin líneas rojas. Este stakeholder aceptará cualquier resultado.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {sh.redLines.map((rl, ri) => (
                          <div
                            key={rl.uid}
                            className="flex items-end gap-2 bg-red-50/50 rounded-lg p-3 border border-red-100 group"
                          >
                            <div className="w-44">
                              <label className="block text-xs text-slate-500 mb-1">Variable</label>
                              <select
                                value={rl.variable}
                                onChange={(e) =>
                                  onUpdateRedLine(i, ri, {
                                    variable: e.target.value as VariableId,
                                  })
                                }
                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0d6e6e]/30 outline-none"
                              >
                                {VARIABLE_IDS.map((v) => (
                                  <option key={v} value={v}>
                                    {VARIABLE_LABELS[v]}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-20">
                              <label className="block text-xs text-slate-500 mb-1">Op</label>
                              <select
                                value={rl.operator}
                                onChange={(e) =>
                                  onUpdateRedLine(i, ri, {
                                    operator: e.target.value as 'lt' | 'gt',
                                  })
                                }
                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:ring-2 focus:ring-[#0d6e6e]/30 outline-none"
                              >
                                <option value="lt">&lt; (menor que)</option>
                                <option value="gt">&gt; (mayor que)</option>
                              </select>
                            </div>
                            <div className="w-20">
                              <label className="block text-xs text-slate-500 mb-1">Umbral</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={rl.threshold}
                                onChange={(e) =>
                                  onUpdateRedLine(i, ri, { threshold: e.target.value })
                                }
                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-right font-mono text-slate-900 focus:ring-2 focus:ring-[#0d6e6e]/30 outline-none"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-slate-500 mb-1">
                                Descripción
                              </label>
                              <input
                                value={rl.description}
                                onChange={(e) =>
                                  onUpdateRedLine(i, ri, { description: e.target.value })
                                }
                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 outline-none"
                                placeholder="Razón del veto"
                              />
                            </div>
                            <button
                              onClick={() => onRemoveRedLine(i, ri)}
                              className="pb-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Eliminar línea roja"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delete stakeholder */}
                  {stakeholders.length > 2 && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onRemove(i)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                      >
                        Eliminar stakeholder
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-[#0d6e6e] hover:text-[#0d6e6e] hover:bg-[#f0fafa] transition-all duration-200"
      >
        + Añadir stakeholder
      </button>
    </div>
  );
}

/* ── Helper: Numeric input ── */

function NumericField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
      <input
        type="number"
        step="0.01"
        min="0"
        max="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-right font-mono text-slate-900 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
      />
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
