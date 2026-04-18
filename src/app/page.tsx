import Link from 'next/link';

const STEPS = [
  {
    href: '/scenario',
    title: 'Escenario',
    description: 'Contexto de MetalWorks S.A., presupuesto, KPIs y opciones de inversión',
    icon: '🏗️',
    step: 1,
    color: 'hover:border-blue-400 hover:bg-blue-50/50',
  },
  {
    href: '/stakeholders',
    title: 'Stakeholders',
    description: 'Los 4 decisores clave, sus prioridades, pesos y líneas rojas',
    icon: '👥',
    step: 2,
    color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
  },
  {
    href: '/debate',
    title: 'Debate',
    description: 'Rondas de negociación con scoring, conflictos y concesiones',
    icon: '⚡',
    step: 3,
    color: 'hover:border-amber-400 hover:bg-amber-50/50',
  },
  {
    href: '/result',
    title: 'Resultado',
    description: 'Opción ganadora, consenso final y desglose completo de la decisión',
    icon: '🏆',
    step: 4,
    color: 'hover:border-yellow-400 hover:bg-yellow-50/50',
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="max-w-3xl w-full text-center">
        {/* Hero */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Motor determinista de negociación
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Convergia
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Simulador de decisiones multi-stakeholder para entornos industriales.
            Explora cómo múltiples decisores alcanzan consenso a través de rondas de negociación.
          </p>
        </div>

        {/* Journey label */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Flujo de la demo
          </span>
          <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {STEPS.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className={`group bg-white rounded-xl border-2 border-slate-200 p-6 text-left transition-all shadow-sm hover:shadow-md ${step.color}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{step.icon}</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                  {step.step}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Paso {step.step}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                {step.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/scenario"
          className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Comenzar demo
          <span className="text-xl">→</span>
        </Link>

        {/* Debug link */}
        <div className="mt-10">
          <Link
            href="/debug"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 font-mono transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            verificación técnica del motor
          </Link>
        </div>
      </div>
    </main>
  );
}
