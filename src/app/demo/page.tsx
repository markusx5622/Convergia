import Link from 'next/link';
import { ConvergiaLogo } from '@/components/ConvergiaLogo';
import { SCENARIO_BUNDLES } from '@/data/scenarios';

/**
 * Extra presentation metadata for the demo selection cards.
 * Keyed by scenario id.
 */
const SCENARIO_META: Record<string, { tension: string; interest: string }> = {
  'metalworks-2024': {
    tension:
      'Producción quiere automatizar, Finanzas exige ROI rápido, Sostenibilidad pide descarbonización — todo con un presupuesto limitado a 100 k€.',
    interest:
      'Escenario clásico de empresa industrial con conflicto equilibrado entre los 4 departamentos. Ideal para entender cómo funciona el motor.',
  },
  'energychem-2024': {
    tension:
      'Altísimo consumo energético (38% del coste operativo) con presión regulatoria CSRD inminente y la necesidad de mantener proceso continuo.',
    interest:
      'Caso extremo donde la factura energética domina y la regulación ESG fuerza decisiones urgentes. Las opciones van de cogeneración a fotovoltaica.',
  },
  'pharmaquality-2024': {
    tension:
      'Warning Letter de la FDA: 6 meses para resolver o perder la licencia de fabricación. Todos los stakeholders bajo presión máxima.',
    interest:
      'Escenario de crisis donde la calidad es innegociable y el CEO entra en la negociación. Presupuesto extraordinario de 300 k€.',
  },
};

export default function DemoSelectionPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* Top nav */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="transition-transform duration-200 group-hover:scale-105">
              <ConvergiaLogo size="sm" color="dark" />
            </span>
            <span className="text-[10px] font-bold text-[#0d6e6e] bg-[#f0fafa] border border-[#d0ecec] px-2 py-0.5 rounded-md uppercase tracking-wider">
              Demo guiada
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Inicio
            </Link>
            <span className="mx-1 h-4 w-px bg-[#e1e4eb]" />
            <Link
              href="/lab"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#0d6e6e] hover:bg-[#f0fafa] hover:text-[#0f8585] transition-all duration-200"
            >
              Lab
            </Link>
            <Link
              href="/studio"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#0d6e6e] hover:bg-[#f0fafa] hover:text-[#0f8585] transition-all duration-200"
            >
              Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-white border-b border-[#f0f1f5]">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.2em] mb-4 animate-fade-in">
            🎯 Demo guiada · Escenarios curados
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight mb-4 animate-fade-in-up">
            Elige un escenario para explorar
          </h1>
          <p className="text-lg text-[#5b6578] max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Cada demo te guía paso a paso por una negociación completa entre múltiples stakeholders.
            Sigue el flujo lineal: escenario → stakeholders → debate → resultado.
          </p>
        </div>
      </header>

      {/* Scenario Cards */}
      <section className="flex-1 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
          {SCENARIO_BUNDLES.map((bundle) => {
            const meta = SCENARIO_META[bundle.id];
            return (
              <div
                key={bundle.id}
                className="flex flex-col bg-white rounded-2xl border border-[#e1e4eb] shadow-sm card-interactive overflow-hidden"
              >
                {/* Card header */}
                <div className="p-7 pb-5 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{bundle.icon}</span>
                    <div>
                      <h2 className="text-lg font-extrabold text-[#111827]">
                        {bundle.label}
                      </h2>
                      <p className="text-xs text-[#5b6578] mt-0.5">{bundle.tagline}</p>
                    </div>
                  </div>

                  {/* Brief context */}
                  <p className="text-sm text-[#5b6578] leading-relaxed mb-4">
                    {bundle.scenario.description.split('.').slice(0, 2).join('.') + '.'}
                  </p>

                  {/* Budget */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] text-white rounded-lg mb-4">
                    <span className="text-xs font-medium text-slate-300">Presupuesto</span>
                    <span className="text-base font-extrabold">
                      {(bundle.scenario.budget / 1000).toFixed(0)}k€
                    </span>
                  </div>

                  {/* Tension */}
                  {meta && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-red-600/80 uppercase tracking-wider mb-1">
                        Tensión principal
                      </p>
                      <p className="text-sm text-[#5b6578] leading-relaxed">
                        {meta.tension}
                      </p>
                    </div>
                  )}

                  {/* Why interesting */}
                  {meta && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-wider mb-1">
                        Por qué explorar este caso
                      </p>
                      <p className="text-sm text-[#5b6578] leading-relaxed">
                        {meta.interest}
                      </p>
                    </div>
                  )}

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#f0fafa] text-[#0d6e6e] border border-[#d0ecec]">
                      {bundle.options.length} opciones
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#f0fafa] text-[#0d6e6e] border border-[#d0ecec]">
                      {bundle.stakeholders.length} stakeholders
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-7 pb-7 pt-2">
                  <Link
                    href={`/demo/${bundle.id}/scenario`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#111827] text-white rounded-xl text-base font-bold hover:bg-[#1f2937] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Iniciar demo guiada
                    <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ConvergiaLogo size="sm" variant="symbol" color="brand" />
            <div>
              <p className="text-xs font-medium text-[#5b6578]">
                Motor determinista de negociación multi-stakeholder
              </p>
              <p className="text-[10px] text-[#5b6578]/40 mt-0.5">Resultado reproducible · Explicabilidad total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-[#5b6578]/50 hover:text-[#0d6e6e] transition-colors duration-200">
              Inicio
            </Link>
            <span className="text-[#e1e4eb]">·</span>
            <Link href="/lab" className="text-xs text-[#5b6578]/50 hover:text-[#0d6e6e] font-mono transition-colors duration-200">
              /lab
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
