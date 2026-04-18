'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SCENARIO_BUNDLES, DEFAULT_BUNDLE, getBundle } from '@/data/scenarios';
import type { ScenarioBundle } from '@/data/scenarios';
import type { Stakeholder, VariableId } from '@/engine/types';
import { VARIABLE_IDS } from '@/engine/types';
import { runSimulation } from '@/engine/simulation';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { StakeholderWeightSliders } from '@/components/StakeholderWeightSliders';
import { ComparisonPanel } from '@/components/ComparisonPanel';

type LabTab = 'scenario' | 'weights' | 'results';

export default function LabPage() {
  // ── State ──
  const [activeScenarioId, setActiveScenarioId] = useState(DEFAULT_BUNDLE.id);
  const [customWeightsMap, setCustomWeightsMap] = useState<
    Record<string, Record<VariableId, number>[] | undefined>
  >({});
  const [activeTab, setActiveTab] = useState<LabTab>('scenario');

  // ── Derived ──
  const bundle: ScenarioBundle = getBundle(activeScenarioId) ?? DEFAULT_BUNDLE;
  const canonicalStakeholders = bundle.stakeholders;
  const customWeights = customWeightsMap[activeScenarioId];

  const adjustedStakeholders: Stakeholder[] = useMemo(() => {
    if (!customWeights) return canonicalStakeholders;
    return canonicalStakeholders.map((s, i) => ({
      ...s,
      weights: customWeights[i] ?? s.weights,
    }));
  }, [canonicalStakeholders, customWeights]);

  const isModified = useMemo(
    () =>
      customWeights
        ? canonicalStakeholders.some((s, i) =>
            VARIABLE_IDS.some(
              (v) =>
                Math.abs(s.weights[v] - (customWeights[i]?.[v] ?? s.weights[v])) > 0.005,
            ),
          )
        : false,
    [canonicalStakeholders, customWeights],
  );

  // ── Simulations (memoised) ──
  const baseResult = useMemo(
    () => runSimulation(bundle.scenario, canonicalStakeholders, bundle.options),
    [bundle],
  );

  const adjustedResult = useMemo(
    () => runSimulation(bundle.scenario, adjustedStakeholders, bundle.options),
    [bundle, adjustedStakeholders],
  );

  // ── Handlers ──
  const handleScenarioSelect = useCallback((id: string) => {
    setActiveScenarioId(id);
  }, []);

  const handleWeightsChange = useCallback(
    (sIdx: number, weights: Record<VariableId, number>) => {
      setCustomWeightsMap((prev) => {
        const current =
          prev[activeScenarioId] ??
          canonicalStakeholders.map((s) => ({ ...s.weights }));
        const next = [...current];
        next[sIdx] = weights;
        return { ...prev, [activeScenarioId]: next };
      });
    },
    [activeScenarioId, canonicalStakeholders],
  );

  const handleReset = useCallback(() => {
    setCustomWeightsMap((prev) => {
      const next = { ...prev };
      delete next[activeScenarioId];
      return next;
    });
  }, [activeScenarioId]);

  const handleFullReset = useCallback(() => {
    setActiveScenarioId(DEFAULT_BUNDLE.id);
    setCustomWeightsMap({});
  }, []);

  // ── Tab content ──
  const TABS: { id: LabTab; label: string; icon: string }[] = [
    { id: 'scenario', label: 'Escenario', icon: '🏗️' },
    { id: 'weights', label: 'Pesos', icon: '⚖️' },
    { id: 'results', label: 'Comparación', icon: '📊' },
  ];

  // Build report URL with Lab context
  const reportBaseUrl = `/report?origin=lab&scenario=${activeScenarioId}`;
  const reportAdjustedUrl = `${reportBaseUrl}&state=adjusted`;
  const reportComparisonUrl = `${reportBaseUrl}&state=comparison`;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-[#111827] tracking-tight hover:opacity-80 transition-opacity duration-200">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-bold text-[#0d6e6e] bg-[#f0fafa] px-2 py-0.5 rounded-md border border-[#d0ecec] uppercase tracking-wider">
              Lab / Exploración
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
              href="/demo"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Demo guiada
            </Link>
            <Link
              href="/studio"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Studio
            </Link>
            <Link
              href="/debug"
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#5b6578]/50 hover:bg-[#f0f1f5] hover:text-[#5b6578] transition-all duration-200"
            >
              /debug
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
                🔬 Sandbox analítico
              </p>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
                Lab / Exploración de escenarios
              </h1>
              <p className="mt-2 text-[#5b6578] text-base leading-relaxed max-w-2xl">
                Entorno libre de exploración: selecciona un escenario, ajusta los pesos de los
                stakeholders y observa cómo cambia la decisión. No hay orden fijo — explora a tu
                ritmo. Todo sigue siendo determinista.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0d6e6e] bg-[#f0fafa] rounded-md border border-[#d0ecec]">
                  No lineal
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0d6e6e] bg-[#f0fafa] rounded-md border border-[#d0ecec]">
                  Sandbox
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0d6e6e] bg-[#f0fafa] rounded-md border border-[#d0ecec]">
                  Determinista
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isModified && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200 hover:bg-amber-100 transition-all duration-200 hover:shadow-sm"
                >
                  ↺ Reset pesos
                </button>
              )}
              <button
                onClick={handleFullReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-200 transition-all duration-200 hover:shadow-sm"
              >
                ↺ Reset todo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Active scenario indicator */}
      <div className="bg-gradient-to-r from-[#f0fafa] to-[#eef5fb] border-b border-[#d0ecec]/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          <span className="text-xl">{bundle.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{bundle.scenario.company}</p>
            <p className="text-xs text-slate-500">{bundle.scenario.name}</p>
          </div>
          {isModified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
              ⚠ Pesos modificados
            </span>
          )}
          <span className="text-xs font-mono text-slate-400">
            Ganador actual: <strong className="text-slate-700">{adjustedResult.finalOption?.name ?? '—'}</strong>
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-[#111827] text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {/* Scenario tab */}
        {activeTab === 'scenario' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Seleccionar escenario</h2>
              <ScenarioSelector
                bundles={SCENARIO_BUNDLES}
                activeId={activeScenarioId}
                onSelect={handleScenarioSelect}
              />
            </section>

            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm card-interactive">
              <h2 className="text-lg font-bold text-[#111827] mb-3">{bundle.scenario.company}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{bundle.scenario.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {bundle.scenario.kpis.map((kpi) => (
                  <div key={kpi.name} className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-center transition-all duration-200 hover:bg-[#f0fafa] hover:border-[#d0ecec]">
                    <p className="text-lg font-extrabold text-[#111827]">
                      {kpi.current}
                      <span className="text-xs font-medium text-slate-400 ml-0.5">{kpi.unit}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{kpi.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111827] mb-3">
                Opciones de inversión
                <span className="ml-2 text-xs font-medium text-[#0d6e6e] bg-[#f0fafa] px-2 py-0.5 rounded-full border border-[#d0ecec]">
                  {bundle.options.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {bundle.options.map((opt) => (
                  <div key={opt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm card-interactive">
                    <h3 className="font-bold text-[#111827] mb-1">{opt.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{opt.description}</p>
                    <span className="text-sm font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md">
                      {(opt.cost / 1000).toFixed(0)}k€
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Weights tab */}
        {activeTab === 'weights' && (
          <div className="space-y-6">
            <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚖️</span>
                <div>
                  <p className="text-sm font-bold text-[#111827] mb-1">Ajuste de pesos por stakeholder</p>
                  <p className="text-xs text-[#5b6578] leading-relaxed">
                    Mueve los sliders para explorar cómo cambia el resultado al dar más peso a un stakeholder u otro.
                    Los pesos siempre suman 100% — al mover uno, los demás se reajustan proporcionalmente.
                    El resultado se recalcula de forma determinista en cada cambio.
                  </p>
                </div>
              </div>
            </div>
            <StakeholderWeightSliders
              stakeholders={adjustedStakeholders}
              canonicalStakeholders={canonicalStakeholders}
              onWeightsChange={handleWeightsChange}
            />
          </div>
        )}

        {/* Results tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-[#f0fafa] rounded-xl border border-[#d0ecec] p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="text-sm font-bold text-[#111827] mb-1">Comparación base vs ajustado</p>
                  <p className="text-xs text-[#5b6578] leading-relaxed">
                    El resultado &quot;base&quot; usa los pesos canónicos del escenario. El resultado &quot;ajustado&quot; usa
                    los pesos que has configurado en la pestaña anterior. Ambos son deterministas.
                  </p>
                </div>
              </div>
            </div>
            <ComparisonPanel
              baseResult={baseResult}
              adjustedResult={adjustedResult}
              options={bundle.options}
              stakeholders={adjustedStakeholders}
              isModified={isModified}
            />
            {/* Precise report CTAs */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
              <h4 className="font-bold text-[#111827] mb-1 flex items-center gap-2">
                📄 Generar informe desde Lab
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Elige qué tipo de informe quieres generar a partir de tu exploración actual.
              </p>
              <div className="flex flex-wrap gap-3">
                {isModified ? (
                  <>
                    <Link
                      href={reportAdjustedUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      📄 Informe del estado ajustado
                    </Link>
                    <Link
                      href={reportComparisonUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-xl text-sm font-bold hover:bg-[#0f8585] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      📊 Informe comparativo base vs ajustado
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`${reportBaseUrl}&state=base`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    📄 Informe del estado base
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#5b6578]">
            Convergia Lab · Sandbox analítico · Exploración no lineal · Motor determinista · 2025
          </p>
          <div className="flex items-center gap-3">
            <Link href="/debug" className="text-xs text-[#5b6578]/50 hover:text-[#0d6e6e] font-mono transition-colors">
              /debug
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
