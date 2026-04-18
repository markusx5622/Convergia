'use client';

import { useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SCENARIO_BUNDLES, DEFAULT_BUNDLE, getBundle } from '@/data/scenarios';
import type { ScenarioBundle } from '@/data/scenarios';
import { runSimulation } from '@/engine/simulation';
import { buildReportData } from '@/engine/report';
import { ReportView } from '@/components/ReportView';

export default function ReportPage() {
  const [activeScenarioId, setActiveScenarioId] = useState(DEFAULT_BUNDLE.id);

  const bundle: ScenarioBundle = getBundle(activeScenarioId) ?? DEFAULT_BUNDLE;

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
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header — hidden on print */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-slate-900 tracking-tight">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              INFORME
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
              href="/result"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Resultado
            </Link>
            <Link
              href="/lab"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              🔬 Lab
            </Link>
          </div>
        </div>
      </nav>

      {/* Controls bar — hidden on print */}
      <div className="bg-white border-b border-slate-100 print:hidden">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <label htmlFor="scenario-select" className="text-sm font-semibold text-slate-700">
                Escenario:
              </label>
              <select
                id="scenario-select"
                value={activeScenarioId}
                onChange={(e) => setActiveScenarioId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                {SCENARIO_BUNDLES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.icon} {b.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              <PrintIcon />
              Exportar / Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <main className={cn(
        'px-6 py-8 print:px-0 print:py-0',
      )}>
        <ReportView data={reportData} />
      </main>

      {/* Footer — hidden on print */}
      <footer className="border-t border-slate-200 bg-white mt-auto print:hidden">
        <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Convergia · Informe exportable · Motor determinista
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
