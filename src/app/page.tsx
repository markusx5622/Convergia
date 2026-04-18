import Link from 'next/link';

const STEPS = [
  {
    href: '/scenario',
    title: 'Escenario',
    description: 'Contexto de MetalWorks S.A., presupuesto, KPIs y opciones de inversión',
    icon: '🏗️',
    step: 1,
    color: 'hover:border-blue-400 hover:bg-blue-50/50',
    detail: 'Empresa industrial · 250 empleados · 5 opciones de inversión',
  },
  {
    href: '/stakeholders',
    title: 'Stakeholders',
    description: 'Los 4 decisores clave, sus prioridades, pesos y líneas rojas',
    icon: '👥',
    step: 2,
    color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
    detail: '4 perfiles · 6 variables · pesos individuales · vetos',
  },
  {
    href: '/debate',
    title: 'Debate',
    description: 'Rondas de negociación con scoring, conflictos y concesiones',
    icon: '⚡',
    step: 3,
    color: 'hover:border-amber-400 hover:bg-amber-50/50',
    detail: '3 rondas · scoring ponderado · concesiones · convergencia',
  },
  {
    href: '/result',
    title: 'Resultado',
    description: 'Opción ganadora, consenso final y desglose completo de la decisión',
    icon: '🏆',
    step: 4,
    color: 'hover:border-yellow-400 hover:bg-yellow-50/50',
    detail: 'Decisión final · narrativa explicativa · desglose por stakeholder',
  },
] as const;

const HIGHLIGHTS = [
  {
    icon: '🎯',
    title: 'Determinista',
    text: 'Mismo input, mismo output. Sin azar, sin caja negra. Cada decisión tiene una causa rastreable.',
  },
  {
    icon: '👥',
    title: 'Multi-stakeholder',
    text: '4 decisores con prioridades opuestas negocian a través de rondas de scoring, conflictos y concesiones.',
  },
  {
    icon: '📊',
    title: 'Explicable',
    text: 'Narrativas generadas a partir de datos calculados. La capa de presentación no inventa — traduce.',
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 sm:px-8 pt-20 pb-16">
        <div className="max-w-3xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Motor determinista de negociación
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
            Convergia
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-3">
            Simulador de decisiones multi-stakeholder<br className="hidden sm:block" /> para entornos industriales.
          </p>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Explora cómo 4 decisores con intereses contrapuestos alcanzan consenso a través de rondas de negociación — sin IA, sin azar, solo lógica determinista verificable.
          </p>
          <Link
            href="/scenario"
            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Explorar la demo
            <span className="text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* Problem framing */}
      <section className="bg-white border-y border-slate-200 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">El problema</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Las decisiones industriales no las toma una sola persona
          </h2>
          <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Producción quiere velocidad. Calidad exige cero defectos. Finanzas busca ROI. Sostenibilidad necesita reducir emisiones. <strong className="text-slate-700">¿Cómo se modela ese proceso de negociación de forma rigurosa?</strong> Convergia convierte el conflicto entre departamentos en el objeto central del análisis.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Cómo funciona</p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Un motor transparente y verificable
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <span className="text-3xl mb-4 block">{h.icon}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{h.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo flow */}
      <section className="bg-white border-y border-slate-200 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Flujo de la demo · 4 pasos · ~3 minutos
            </span>
            <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
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
                <p className="text-sm text-slate-500 leading-relaxed mb-2">{step.description}</p>
                <p className="text-xs text-slate-400 font-medium">{step.detail}</p>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/scenario"
              className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Comenzar demo
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture callout */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">ARQUITECTURA</span>
            </div>
            <h2 className="text-xl font-extrabold mb-3 tracking-tight">Dualidad: Motor + Presentación</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              El núcleo de Convergia es un <strong className="text-white">motor determinista puro</strong> escrito en TypeScript — sin dependencias externas, sin estado, sin aleatoriedad. La capa de presentación consume los datos ya calculados y genera narrativas explicativas. <strong className="text-white">Toda explicación es derivada, no inventada.</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Motor</p>
                <p className="text-xs text-slate-300">scoring · vetos · conflictos · consenso · concesiones · simulación</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Presentación</p>
                <p className="text-xs text-slate-300">narrativa · walkthrough · visualizaciones · debug</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/debug"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Ver verificación técnica
              </Link>
              <span className="text-xs text-slate-500">Acceso completo a los datos internos del motor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center">
          <p className="text-sm font-bold text-slate-900 mb-1">Convergia</p>
          <p className="text-xs text-slate-400 mb-3">
            Motor determinista de negociación multi-stakeholder
          </p>
          <p className="text-xs text-slate-400">
            Proyecto académico · Ingeniería en Organización Industrial
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href="/debug"
              className="text-xs text-slate-400 hover:text-slate-600 font-mono transition-colors"
            >
              /debug
            </Link>
            <span className="text-slate-200">·</span>
            <span className="text-xs text-slate-400">
              Next.js 16 · TypeScript · Tailwind v4
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
