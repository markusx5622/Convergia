'use client';

import { use, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getBundle } from '@/data/scenarios';
import { runSimulation } from '@/engine/simulation';
import { buildReportData } from '@/engine/report';
import { ReportView } from '@/components/ReportView';
import { AINarrativeToggle } from '@/components/AINarrativeToggle';
import { AIConfigPanel } from '@/components/AIConfigPanel';
import { useAINarrative } from '@/lib/useAINarrative';

export default function DemoReportPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = use(params);
  const bundle = getBundle(scenarioId)!;
  const ai = useAINarrative();

  const simulation = useMemo(
    () => runSimulation(bundle.scenario, bundle.stakeholders, bundle.options),
    [bundle],
  );

  const optionNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const o of bundle.options) names[o.id] = o.name;
    return names;
  }, [bundle.options]);

  const stakeholderNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const s of bundle.stakeholders) names[s.id] = s.name;
    return names;
  }, [bundle.stakeholders]);

  const reportData = useMemo(
    () =>
      buildReportData(
        simulation,
        bundle.stakeholders,
        bundle.options,
        optionNames,
        stakeholderNames,
      ),
    [simulation, bundle.stakeholders, bundle.options, optionNames, stakeholderNames],
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header — hidden on print */}
      <nav className="bg-white border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-[#111827] tracking-tight">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-bold text-[#c87514] bg-[#fef4e5] px-2 py-0.5 rounded-md border border-[#f5dbb3] uppercase tracking-wider">
              Informe
            </span>
            <span className="text-[#e1e4eb] text-sm">/</span>
            <span className="text-xs font-semibold text-[#111827] truncate max-w-[180px]">
              {bundle.label}
            </span>
            <Link
              href="/demo"
              className="text-[10px] font-medium text-[#0d6e6e] hover:text-[#0f8585] bg-[#f0fafa] hover:bg-[#d0ecec] border border-[#d0ecec] px-2 py-0.5 rounded-md transition-colors"
            >
              Cambiar
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-colors"
            >
              Inicio
            </Link>
            <Link
              href={`/demo/${scenarioId}/result`}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-colors"
            >
              Resultado
            </Link>
            <Link
              href="/lab"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-[#0d6e6e] hover:bg-[#f0fafa] hover:text-[#0f8585] transition-colors"
            >
              Lab / Exploración
            </Link>
            <Link
              href="/debug"
              className="px-2.5 py-1.5 rounded-md text-xs font-mono text-[#5b6578]/50 hover:bg-[#f0f1f5] hover:text-[#5b6578] transition-colors"
            >
              /debug
            </Link>
          </div>
        </div>
      </nav>

      {/* Controls bar — hidden on print */}
      <div className="bg-white border-b border-slate-100 print:hidden">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                {bundle.icon} {bundle.label}
              </span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1f2937] transition-all shadow-md hover:shadow-lg"
            >
              <PrintIcon />
              Exportar / Imprimir
            </button>
          </div>

          {/* AI Controls */}
          <div className="mt-4 space-y-3">
            <AIConfigPanel
              config={ai.config}
              onConfigChange={(config) => ai.setConfig(config)}
            />
            <AINarrativeToggle
              enabled={ai.aiEnabled}
              onToggle={(enabled) => {
                ai.setAiEnabled(enabled);
                if (enabled && ai.config?.apiKey) {
                  ai.generate(simulation, bundle.stakeholders, bundle.options);
                }
              }}
              loading={ai.loading}
              error={ai.error}
            />
            {ai.aiEnabled && ai.config?.apiKey && !ai.loading && ai.enrichment.source === 'fallback' && (
              <button
                type="button"
                onClick={() => ai.generate(simulation, bundle.stakeholders, bundle.options)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                ✨ Generar narrativa IA
              </button>
            )}
            {ai.aiEnabled && !ai.config?.apiKey && !ai.loading && (
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-700">
                  <strong>Paso previo:</strong> Abre &ldquo;Configuración IA&rdquo; e introduce tu API key de OpenAI.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Sin API key, el informe se genera con narrativa determinista.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report content */}
      <main className={cn(
        'px-6 py-8 print:px-0 print:py-0',
      )}>
        <ReportView data={reportData} enrichment={ai.enrichment} origin="demo" stateType="base" />
      </main>

      {/* Footer — hidden on print */}
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto print:hidden">
        <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#5b6578]">
            Convergia · Informe exportable · Motor determinista · 2025
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

function PrintIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
  );
}
