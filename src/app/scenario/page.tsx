import { PageShell } from '@/components/PageShell';
import { OptionCard } from '@/components/OptionCard';
import { baseScenario } from '@/data/scenario';
import { investmentOptions } from '@/data/options';
import Link from 'next/link';

export default function ScenarioPage() {
  return (
    <PageShell
      title="Escenario de decisión"
      subtitle="Contexto operativo y opciones de inversión disponibles para MetalWorks S.A."
      currentStep={1}
    >
      {/* Company Context */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-4xl">🏗️</span>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-slate-900">{baseScenario.company}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{baseScenario.name}</p>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">{baseScenario.description}</p>
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-xl shadow-sm">
          <span className="text-sm font-medium text-slate-300">Presupuesto disponible</span>
          <span className="text-2xl font-extrabold">
            {(baseScenario.budget / 1000).toFixed(0)}k€
          </span>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900">KPIs actuales</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Línea base
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {baseScenario.kpis.map((kpi) => (
            <div
              key={kpi.name}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-2xl font-extrabold text-slate-900">
                {kpi.current}
                <span className="text-xs font-medium text-slate-400 ml-0.5">{kpi.unit}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1.5 leading-snug">{kpi.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Options */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900">Opciones de inversión</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {investmentOptions.length} opciones
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {investmentOptions.map((option, i) => (
            <OptionCard key={option.id} option={option} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        >
          ← Inicio
        </Link>
        <Link
          href="/stakeholders"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-base font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
        >
          Ver stakeholders →
        </Link>
      </div>
    </PageShell>
  );
}
