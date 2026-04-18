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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-slate-900 tracking-tight">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
              LAB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/scenario"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/debug"
              className="px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              debug
            </Link>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">
                Laboratorio de análisis
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explorador de escenarios
              </h1>
              <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-2xl">
                Selecciona un escenario, ajusta los pesos de los stakeholders y explora cómo cambia
                la decisión final. Todo sigue siendo determinista — cada configuración produce
                exactamente un resultado.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isModified && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  ↺ Reset pesos
                </button>
              )}
              <button
                onClick={handleFullReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                ↺ Reset todo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Active scenario indicator */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
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
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
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
      <main className="max-w-7xl mx-auto px-6 py-8">
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

            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{bundle.scenario.company}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{bundle.scenario.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {bundle.scenario.kpis.map((kpi) => (
                  <div key={kpi.name} className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-center">
                    <p className="text-lg font-extrabold text-slate-900">
                      {kpi.current}
                      <span className="text-xs font-medium text-slate-400 ml-0.5">{kpi.unit}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{kpi.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Opciones de inversión
                <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {bundle.options.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundle.options.map((opt) => (
                  <div key={opt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-1">{opt.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{opt.description}</p>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
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
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚖️</span>
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-1">Ajuste de pesos por stakeholder</p>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    Mueve los sliders para explorar &quot;¿qué pasa si Finanzas pesa más?&quot; o &quot;¿y si Calidad domina?&quot;.
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
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-1">Comparación base vs ajustado</p>
                  <p className="text-xs text-indigo-700 leading-relaxed">
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Convergia Lab · Explorador de escenarios · Motor determinista
          </p>
          <div className="flex items-center gap-3">
            <Link href="/debug" className="text-xs text-slate-400 hover:text-slate-600 font-mono transition-colors">
              /debug
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
