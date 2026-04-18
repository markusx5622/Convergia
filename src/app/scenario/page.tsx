import { PageShell } from '@/components/PageShell';
import { OptionCard } from '@/components/OptionCard';
import { baseScenario } from '@/data/scenario';
import { investmentOptions } from '@/data/options';
import Link from 'next/link';

export default function ScenarioPage() {
  return (
    <PageShell
      title="Escenario de decisión"
      subtitle="Contexto operativo y opciones de inversión para MetalWorks S.A."
    >
      {/* Company Context */}
      <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-4xl">🏗️</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{baseScenario.company}</h2>
            <p className="text-gray-500">{baseScenario.name}</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">{baseScenario.description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg">
          <span className="text-sm">Presupuesto disponible:</span>
          <span className="text-xl font-bold">
            {(baseScenario.budget / 1000).toFixed(0)}k€
          </span>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">KPIs actuales</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {baseScenario.kpis.map((kpi) => (
            <div
              key={kpi.name}
              className="bg-white rounded-lg border border-gray-200 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">
                {kpi.current}
                <span className="text-sm font-normal text-gray-400 ml-0.5">{kpi.unit}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{kpi.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Options */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de inversión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentOptions.map((option, i) => (
            <OptionCard key={option.id} option={option} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Link
          href="/stakeholders"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Ver stakeholders →
        </Link>
      </div>
    </PageShell>
  );
}
