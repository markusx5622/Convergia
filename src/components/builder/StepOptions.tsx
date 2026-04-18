'use client';

import type { DraftOption } from '@/lib/builder-types';
import type { VariableId } from '@/engine/types';
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  options: DraftOption[];
  budget: string;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, partial: Partial<DraftOption>) => void;
  onUpdateImpact: (oIdx: number, variable: VariableId, value: string) => void;
}

export function StepOptions({
  options,
  budget,
  onAdd,
  onRemove,
  onUpdate,
  onUpdateImpact,
}: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const budgetNum = parseFloat(budget) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info banner */}
      <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-bold text-[#111827] mb-1">Define las opciones de inversión</p>
            <p className="text-xs text-[#5b6578] leading-relaxed">
              Cada opción tiene un coste, descripción, riesgos e impactos normalizados (0–1) sobre
              las 6 variables del motor. Mínimo 2 opciones. El coste no debe superar el presupuesto
              ({budgetNum > 0 ? `${budgetNum.toLocaleString('es-ES')}€` : 'no definido'}).
            </p>
          </div>
        </div>
      </div>

      {/* Options list */}
      <div className="space-y-4">
        {options.map((opt, i) => {
          const isExpanded = expandedIdx === i;
          const costNum = parseFloat(opt.cost) || 0;
          const overBudget = budgetNum > 0 && costNum > budgetNum;

          return (
            <div
              key={opt.uid}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#0d6e6e]/10 text-[#0d6e6e] flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {opt.name || `Opción ${String.fromCharCode(65 + i)}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {costNum > 0 ? `${costNum.toLocaleString('es-ES')}€` : 'Sin coste definido'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {overBudget && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      ⚠ Excede presupuesto
                    </span>
                  )}
                  <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 px-5 py-5 space-y-5 animate-fade-in">
                  {/* Name + Cost */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nombre
                      </label>
                      <input
                        value={opt.name}
                        onChange={(e) => onUpdate(i, { name: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                        placeholder="Ej: Automatización parcial"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Coste (€)
                      </label>
                      <input
                        type="number"
                        value={opt.cost}
                        onChange={(e) => onUpdate(i, { cost: e.target.value })}
                        className={cn(
                          'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 outline-none transition-all',
                          overBudget ? 'border-red-300 bg-red-50/50' : 'border-slate-300',
                        )}
                        placeholder="95000"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Descripción
                    </label>
                    <textarea
                      value={opt.description}
                      onChange={(e) => onUpdate(i, { description: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all resize-y"
                      placeholder="Descripción breve de la opción de inversión..."
                    />
                  </div>

                  {/* Risks */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Riesgos (separados por coma)
                    </label>
                    <input
                      value={opt.risks}
                      onChange={(e) => onUpdate(i, { risks: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                      placeholder="Parada de línea 3 semanas, Curva de aprendizaje"
                    />
                  </div>

                  {/* Impacts */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block">
                      Impactos normalizados (0 = nulo, 1 = máximo)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {VARIABLE_IDS.map((v) => {
                        const val = parseFloat(opt.impacts[v]) || 0;
                        return (
                          <div key={v}>
                            <div className="flex items-center justify-between mb-1">
                              <label
                                className="text-xs text-slate-600 truncate"
                                title={VARIABLE_LABELS[v]}
                              >
                                {VARIABLE_LABELS[v]}
                              </label>
                              <span className="text-xs font-mono text-slate-500 ml-1">
                                {val.toFixed(2)}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={opt.impacts[v]}
                              onChange={(e) => onUpdateImpact(i, v, e.target.value)}
                              className="w-full accent-[#0d6e6e] h-2"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delete option */}
                  {options.length > 2 && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onRemove(i)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                      >
                        Eliminar opción
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
        + Añadir opción de inversión
      </button>
    </div>
  );
}
