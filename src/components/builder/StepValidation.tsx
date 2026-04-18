'use client';

import type { ValidationError } from '@/lib/builder-types';
import type { BuilderState } from '@/lib/builder-types';
import { cn } from '@/lib/utils';

interface Props {
  errors: ValidationError[];
  state: BuilderState;
  onValidate: () => ValidationError[];
}

export function StepValidation({ errors, state, onValidate }: Props) {
  const scenarioErrors = errors.filter((e) => e.path.startsWith('scenario'));
  const stakeholderErrors = errors.filter((e) => e.path.startsWith('stakeholders'));
  const optionErrors = errors.filter((e) => e.path.startsWith('options'));
  const hasRun = errors.length > 0 || (scenarioErrors.length === 0 && stakeholderErrors.length === 0 && optionErrors.length === 0);

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-bold text-[#111827] mb-1">Validación del escenario</p>
            <p className="text-xs text-[#5b6578] leading-relaxed">
              Verifica que todos los datos estén completos y sean coherentes antes de simular.
              Pulsa el botón para ejecutar las validaciones.
            </p>
          </div>
        </div>
      </div>

      {/* Validate button */}
      <div className="flex justify-center">
        <button
          onClick={onValidate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1f2937] transition-all shadow-md"
        >
          🔍 Ejecutar validación
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard
          title="Escenario"
          icon="📋"
          count={scenarioErrors.length}
          summary={state.scenario.name || '(sin nombre)'}
          detail={`Presupuesto: ${parseFloat(state.scenario.budget) > 0 ? `${parseFloat(state.scenario.budget).toLocaleString('es-ES')}€` : 'no definido'}`}
        />
        <SectionCard
          title="Stakeholders"
          icon="👥"
          count={stakeholderErrors.length}
          summary={`${state.stakeholders.length} definidos`}
          detail={state.stakeholders.map((s) => s.name || '?').join(', ')}
        />
        <SectionCard
          title="Opciones"
          icon="💡"
          count={optionErrors.length}
          summary={`${state.options.length} definidas`}
          detail={state.options.map((o) => o.name || '?').join(', ')}
        />
      </div>

      {/* Error list */}
      {hasRun && errors.length === 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-sm font-bold text-emerald-800">
            Escenario válido — listo para simular
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Todos los datos son coherentes. Puedes avanzar al paso siguiente.
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-red-50 border-b border-red-100">
            <p className="text-sm font-bold text-red-800">
              {errors.length} error{errors.length !== 1 ? 'es' : ''} encontrado
              {errors.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {errors.map((err, i) => (
              <li key={i} className="px-5 py-3 flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <div>
                  <p className="text-sm text-slate-900">{err.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{err.path}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Section summary card ── */

function SectionCard({
  title,
  icon,
  count,
  summary,
  detail,
}: {
  title: string;
  icon: string;
  count: number;
  summary: string;
  detail: string;
}) {
  const isOk = count === 0;
  return (
    <div
      className={cn(
        'rounded-xl border p-5',
        isOk
          ? 'bg-white border-slate-200'
          : 'bg-red-50/50 border-red-200',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {count > 0 && (
          <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
        {count === 0 && (
          <span className="ml-auto text-xs text-emerald-600">✓</span>
        )}
      </div>
      <p className="text-sm text-slate-700">{summary}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{detail}</p>
    </div>
  );
}
