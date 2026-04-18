'use client';

import { PageShell } from '@/components/PageShell';
import { ResultSummary } from '@/components/ResultSummary';
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
  return (
    <PageShell
      title="Resultado final"
      subtitle="Decisión consensuada después de la simulación completa"
    >
      <ResultSummary
        simulation={sim}
        stakeholders={stakeholders}
        options={investmentOptions}
        stakeholderNames={stakeholderNames}
        optionNames={optionNames}
      />

      {/* Navigation */}
      <div className="flex justify-center gap-4 pt-8">
        <Link
          href="/debate"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          ← Volver al debate
        </Link>
        <Link
          href="/scenario"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Revisar escenario
        </Link>
      </div>
    </PageShell>
  );
}
