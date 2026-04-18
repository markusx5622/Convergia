'use client';

import { useCallback } from 'react';
import { PageShell } from '@/components/PageShell';
import { ResultSummary } from '@/components/ResultSummary';
import { AINarrativeToggle } from '@/components/AINarrativeToggle';
import { AINarrativeBanner } from '@/components/AINarrativeBanner';
import { AIConfigPanel } from '@/components/AIConfigPanel';
import { useAINarrative } from '@/lib/useAINarrative';
import { runSimulation } from '@/engine/simulation';
import { baseScenario } from '@/data/scenario';
import { stakeholders } from '@/data/stakeholders';
import { investmentOptions } from '@/data/options';
import Link from 'next/link';

const sim = runSimulation(baseScenario, stakeholders, investmentOptions);

const optionNames: Record<string, string> = {};
for (const o of investmentOptions) optionNames[o.id] = o.name;

const stakeholderNames: Record<string, string> = {};
for (const s of stakeholders) stakeholderNames[s.id] = s.name;

export default function ResultPage() {
  const ai = useAINarrative();

  const handleToggle = useCallback(
    (enabled: boolean) => {
      ai.setAiEnabled(enabled);
      if (enabled && ai.config?.apiKey) {
        ai.generate(sim, stakeholders, investmentOptions);
      }
    },
    [ai],
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
    >
      <ResultSummary
        simulation={sim}
        stakeholders={stakeholders}
        options={investmentOptions}
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
            onClick={() => ai.generate(sim, stakeholders, investmentOptions)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-md"
          >
            ✨ Generar narrativa IA
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
        <Link
          href="/debate"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        >
          ← Volver al debate
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md text-sm"
          >
            📄 Exportar informe
          </Link>
          <Link
            href="/scenario"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
          >
            Revisar escenario
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
