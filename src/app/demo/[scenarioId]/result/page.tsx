'use client';

import { use, useMemo, useCallback } from 'react';
import { PageShell } from '@/components/PageShell';
import { ResultSummary } from '@/components/ResultSummary';
import { AINarrativeToggle } from '@/components/AINarrativeToggle';
import { AINarrativeBanner } from '@/components/AINarrativeBanner';
import { AIConfigPanel } from '@/components/AIConfigPanel';
import { useAINarrative } from '@/lib/useAINarrative';
import { runSimulation } from '@/engine/simulation';
import { getBundle } from '@/data/scenarios';
import Link from 'next/link';

export default function DemoResultPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = use(params);
  const bundle = getBundle(scenarioId)!;
  const { scenario, stakeholders, options } = bundle;

  const sim = useMemo(
    () => runSimulation(scenario, stakeholders, options),
    [scenario, stakeholders, options],
  );

  const optionNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const o of options) names[o.id] = o.name;
    return names;
  }, [options]);

  const stakeholderNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const s of stakeholders) names[s.id] = s.name;
    return names;
  }, [stakeholders]);

  const ai = useAINarrative();

  const handleToggle = useCallback(
    (enabled: boolean) => {
      ai.setAiEnabled(enabled);
      if (enabled && ai.config?.apiKey) {
        ai.generate(sim, stakeholders, options);
      }
    },
    [ai, sim, stakeholders, options],
  );

  const handleConfigChange = useCallback(
    (config: Parameters<typeof ai.setConfig>[0]) => {
      ai.setConfig(config);
    },
    [ai],
  );

  return (
    <PageShell
      title="Resultado final"
      subtitle="Decisión consensuada tras completar todas las rondas de negociación"
      currentStep={4}
      scenarioId={scenarioId}
      scenarioLabel={bundle.label}
    >
      <ResultSummary
        simulation={sim}
        stakeholders={stakeholders}
        options={options}
        stakeholderNames={stakeholderNames}
        optionNames={optionNames}
        enrichment={ai.enrichment}
      />

      {/* Deterministic engine callout */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mt-8">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">⚙️</span>
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">Motor determinista</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todo lo que ves en esta página fue calculado por el motor determinista de Convergia. Las narrativas, scores y desgloses son derivados de datos — no generados por IA.
              Puedes verificar cada número en la <a href="/debug" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-blue-200">página de verificación técnica</a>.
            </p>
          </div>
        </div>
      </div>

      {/* AI Narrative section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">✨</span>
          <h3 className="font-bold text-slate-900">Capa narrativa IA</h3>
          <span className="text-xs text-slate-400">(opcional)</span>
        </div>

        <AIConfigPanel
          config={ai.config}
          onConfigChange={handleConfigChange}
        />

        <AINarrativeToggle
          enabled={ai.aiEnabled}
          onToggle={handleToggle}
          loading={ai.loading}
          error={ai.error}
        />

        <AINarrativeBanner source={ai.enrichment.source} />

        {ai.aiEnabled && ai.config?.apiKey && !ai.loading && ai.enrichment.source === 'fallback' && (
          <button
            type="button"
            onClick={() => ai.generate(sim, stakeholders, options)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-md"
          >
            ✨ Generar narrativa IA
          </button>
        )}

        {ai.aiEnabled && !ai.config?.apiKey && !ai.loading && (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700">
              <strong>Paso previo:</strong> Abre la sección &ldquo;Configuración IA&rdquo; arriba e introduce tu API key de OpenAI para activar la generación de narrativa.
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Sin API key, Convergia funciona perfectamente con narrativa determinista.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
        <Link
          href={`/demo/${scenarioId}/debate`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        >
          ← Volver al debate
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/demo/${scenarioId}/report`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md text-sm"
          >
            📄 Exportar informe
          </Link>
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
          >
            🔬 Explorar en Lab
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md text-sm"
          >
            Cambiar escenario
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
