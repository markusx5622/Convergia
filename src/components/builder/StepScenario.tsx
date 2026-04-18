'use client';

import type { DraftScenario, DraftKPI } from '@/lib/builder-types';
import { cn } from '@/lib/utils';

interface Props {
  scenario: DraftScenario;
  onUpdate: (partial: Partial<DraftScenario>) => void;
  onAddKPI: () => void;
  onUpdateKPI: (idx: number, partial: Partial<DraftKPI>) => void;
  onRemoveKPI: (idx: number) => void;
}

export function StepScenario({ scenario, onUpdate, onAddKPI, onUpdateKPI, onRemoveKPI }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info banner */}
      <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">📋</span>
          <div>
            <p className="text-sm font-bold text-[#111827] mb-1">Define el escenario</p>
            <p className="text-xs text-[#5b6578] leading-relaxed">
              Introduce los datos básicos del escenario: nombre, empresa, descripción, presupuesto
              y, opcionalmente, KPIs base que contextualicen la situación actual.
            </p>
          </div>
        </div>
      </div>

      {/* Main fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Nombre del escenario"
            value={scenario.name}
            onChange={(v) => onUpdate({ name: v })}
            placeholder="Ej: Mejora operativa planta Barcelona"
          />
          <Field
            label="Empresa / contexto"
            value={scenario.company}
            onChange={(v) => onUpdate({ company: v })}
            placeholder="Ej: Industrias Acme S.A."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Descripción</label>
          <textarea
            value={scenario.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all resize-y"
            placeholder="Describe el contexto empresarial, el problema a resolver y las restricciones principales..."
          />
        </div>

        <div className="max-w-xs">
          <Field
            label="Presupuesto (€)"
            value={scenario.budget}
            onChange={(v) => onUpdate({ budget: v })}
            placeholder="100000"
            type="number"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">KPIs base (opcional)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Indicadores actuales que contextualizan el punto de partida.
            </p>
          </div>
          <button
            onClick={onAddKPI}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d6e6e] text-white rounded-lg text-xs font-semibold hover:bg-[#0f8585] transition-all duration-200 hover:shadow-sm"
          >
            + Añadir KPI
          </button>
        </div>

        {scenario.kpis.length === 0 ? (
          <div className="py-6 text-center animate-fade-in">
            <span className="text-2xl block mb-2">📊</span>
            <p className="text-xs text-slate-500 font-medium">
              Ningún KPI definido.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Puedes añadir indicadores como OEE, tasa de defectos, etc.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scenario.kpis.map((kpi, i) => (
              <div key={kpi.uid} className="flex items-end gap-3 group">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre</label>
                  <input
                    value={kpi.name}
                    onChange={(e) => onUpdateKPI(i, { name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                    placeholder="Ej: OEE"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valor</label>
                  <input
                    value={kpi.current}
                    onChange={(e) => onUpdateKPI(i, { current: e.target.value })}
                    type="number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                    placeholder="72"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Unidad</label>
                  <input
                    value={kpi.unit}
                    onChange={(e) => onUpdateKPI(i, { unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e] outline-none transition-all"
                    placeholder="%"
                  />
                </div>
                <button
                  onClick={() => onRemoveKPI(i)}
                  className="pb-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar KPI"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Reusable field ── */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400 focus:ring-2 focus:ring-[#0d6e6e]/30 focus:border-[#0d6e6e]',
          'outline-none transition-all',
        )}
        placeholder={placeholder}
      />
    </div>
  );
}
