'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/useBuilderStore';
import { BUILDER_STEPS } from '@/lib/builder-types';
import type { BuilderStep } from '@/lib/builder-types';
import { exportAsJSON, importFromJSON } from '@/lib/builder-persistence';
import { StepScenario } from '@/components/builder/StepScenario';
import { StepStakeholders } from '@/components/builder/StepStakeholders';
import { StepOptions } from '@/components/builder/StepOptions';
import { StepValidation } from '@/components/builder/StepValidation';
import { StepPreview } from '@/components/builder/StepPreview';

export default function StudioPage() {
  const store = useBuilderStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepIdx = BUILDER_STEPS.findIndex((s) => s.id === store.step);

  const goNext = useCallback(() => {
    const idx = BUILDER_STEPS.findIndex((s) => s.id === store.step);
    if (idx < BUILDER_STEPS.length - 1) {
      store.setStep(BUILDER_STEPS[idx + 1].id);
    }
  }, [store]);

  const goPrev = useCallback(() => {
    const idx = BUILDER_STEPS.findIndex((s) => s.id === store.step);
    if (idx > 0) {
      store.setStep(BUILDER_STEPS[idx - 1].id);
    }
  }, [store]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importFromJSON(file);
      store.loadState(result.state);
      if (result.warnings.length > 0) {
        alert('Escenario importado con advertencias:\n\n' + result.warnings.join('\n'));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error importando archivo.');
    }
    e.target.value = '';
  }, [store]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-[#111827] tracking-tight hover:opacity-80 transition-opacity duration-200">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-bold text-white bg-[#0d6e6e] px-2 py-0.5 rounded-md uppercase tracking-wider">
              Studio
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/lab"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Lab
            </Link>
            <Link
              href="/demo"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Demo guiada
            </Link>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <header className="bg-white border-b border-[#f0f1f5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.15em] mb-2">
                🛠 Studio · Escenario personalizado
              </p>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
                Constructor de escenarios
              </h1>
              <p className="mt-2 text-[#5b6578] text-base leading-relaxed max-w-2xl">
                Crea tu propio escenario de negociación multi-stakeholder paso a paso.
                Define la empresa, los actores, las opciones y ejecuta la simulación con el motor
                determinista de Convergia.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportAsJSON(store.state)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
              >
                📤 Exportar JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
              >
                📥 Importar JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres reiniciar el escenario? Se perderán todos los datos.')) {
                    store.resetAll();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200 hover:bg-red-100 hover:shadow-sm transition-all duration-200"
              >
                ↺ Reiniciar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Step wizard progress */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-1">
            {BUILDER_STEPS.map((s, i) => {
              const isActive = s.id === store.step;
              const isCompleted = i < stepIdx;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button
                    onClick={() => store.setStep(s.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-[#111827] text-white shadow-md'
                        : isCompleted
                        ? 'bg-[#f0fafa] text-[#0d6e6e] hover:bg-[#d0ecec] hover:shadow-sm'
                        : 'bg-[#f0f1f5] text-[#5b6578]/50 hover:bg-[#e1e4eb] hover:text-[#5b6578]',
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        isActive
                          ? 'bg-white text-[#111827]'
                          : isCompleted
                          ? 'bg-[#0d6e6e] text-white'
                          : 'bg-[#e1e4eb] text-[#5b6578]',
                      )}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < BUILDER_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2 rounded-full',
                        i < stepIdx ? 'bg-[#0d6e6e]/30' : 'bg-[#e1e4eb]',
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full animate-fade-in">
        {store.step === 'scenario' && (
          <StepScenario
            scenario={store.state.scenario}
            onUpdate={store.updateScenario}
            onAddKPI={store.addKPI}
            onUpdateKPI={store.updateKPI}
            onRemoveKPI={store.removeKPI}
          />
        )}

        {store.step === 'stakeholders' && (
          <StepStakeholders
            stakeholders={store.state.stakeholders}
            onAdd={store.addStakeholder}
            onRemove={store.removeStakeholder}
            onUpdate={store.updateStakeholder}
            onUpdateWeight={store.updateStakeholderWeight}
            onAddRedLine={store.addRedLine}
            onRemoveRedLine={store.removeRedLine}
            onUpdateRedLine={store.updateRedLine}
          />
        )}

        {store.step === 'options' && (
          <StepOptions
            options={store.state.options}
            budget={store.state.scenario.budget}
            onAdd={store.addOption}
            onRemove={store.removeOption}
            onUpdate={store.updateOption}
            onUpdateImpact={store.updateOptionImpact}
          />
        )}

        {store.step === 'validate' && (
          <StepValidation
            errors={store.errors}
            state={store.state}
            onValidate={store.validate}
          />
        )}

        {store.step === 'preview' && <StepPreview state={store.state} />}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div>
            {stepIdx > 0 && (
              <button
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
              >
                ← {BUILDER_STEPS[stepIdx - 1].label}
              </button>
            )}
          </div>
          <div>
            {stepIdx < BUILDER_STEPS.length - 1 && (
              <button
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {BUILDER_STEPS[stepIdx + 1].label} →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#5b6578]">
            Convergia Studio · Constructor de escenarios · Motor determinista · 2025
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/lab"
              className="text-xs text-[#0d6e6e] hover:text-[#0f8585] font-medium transition-colors"
            >
              Lab →
            </Link>
            <Link
              href="/debug"
              className="text-xs text-[#5b6578]/50 hover:text-[#0d6e6e] font-mono transition-colors"
            >
              /debug
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
