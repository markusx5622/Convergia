import Link from 'next/link';
import { ConvergiaLogo } from '@/components/ConvergiaLogo';

const STEPS = [
  {
    href: '/scenario',
    title: 'Escenario',
    description: 'Contexto industrial, presupuesto, KPIs y opciones de inversión',
    step: 1,
    detail: 'Empresa industrial · 250 empleados · 5 opciones',
  },
  {
    href: '/stakeholders',
    title: 'Stakeholders',
    description: '4 decisores clave con prioridades, pesos y líneas rojas',
    step: 2,
    detail: '4 perfiles · 6 variables · pesos · vetos',
  },
  {
    href: '/debate',
    title: 'Debate',
    description: 'Rondas de negociación con scoring, conflictos y concesiones',
    step: 3,
    detail: '3 rondas · scoring ponderado · convergencia',
  },
  {
    href: '/result',
    title: 'Resultado',
    description: 'Decisión consensuada, narrativa explicativa y desglose completo',
    step: 4,
    detail: 'Decisión final · narrativa · desglose por stakeholder',
  },
] as const;

const DIFFERENTIALS = [
  {
    title: 'Determinista',
    text: 'Mismo input, mismo output. Sin azar, sin caja negra. Cada decisión tiene una causa rastreable.',
    accent: 'bg-teal-50 border-teal-200/60 text-teal-900',
    dot: 'bg-teal-500',
  },
  {
    title: 'Multi-stakeholder',
    text: '4 decisores con prioridades opuestas negocian a través de rondas de scoring, conflictos y concesiones.',
    accent: 'bg-blue-50 border-blue-200/60 text-blue-900',
    dot: 'bg-blue-500',
  },
  {
    title: 'Explicable',
    text: 'Narrativas generadas a partir de datos calculados. La capa de presentación no inventa — traduce.',
    accent: 'bg-amber-50 border-amber-200/60 text-amber-900',
    dot: 'bg-amber-500',
  },
  {
    title: 'Explorable',
    text: 'Múltiples escenarios curados, ajuste de pesos y comparación base vs ajustado — sin perder rigor.',
    accent: 'bg-violet-50 border-violet-200/60 text-violet-900',
    dot: 'bg-violet-500',
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7f8fa]">
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Convergence lines decoration */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.06]">
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="600" y1="0" x2="200" y2="300" stroke="white" strokeWidth="1"/>
              <line x1="600" y1="100" x2="200" y2="300" stroke="white" strokeWidth="1"/>
              <line x1="600" y1="200" x2="200" y2="300" stroke="white" strokeWidth="0.5"/>
              <line x1="600" y1="400" x2="200" y2="300" stroke="white" strokeWidth="0.5"/>
              <line x1="600" y1="500" x2="200" y2="300" stroke="white" strokeWidth="1"/>
              <line x1="600" y1="600" x2="200" y2="300" stroke="white" strokeWidth="1"/>
              <circle cx="200" cy="300" r="4" fill="white" opacity="0.3"/>
            </svg>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Top nav bar */}
          <nav className="flex items-center justify-between mb-16 sm:mb-20">
            <ConvergiaLogo size="md" color="light" />
            <div className="flex items-center gap-2">
              <Link
                href="/lab"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Lab
              </Link>
              <Link
                href="/report"
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Informe
              </Link>
              <Link
                href="/debug"
                className="px-3 py-1.5 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
              >
                /debug
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-[#0d6e6e] animate-convergence" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Motor determinista de negociación
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.05]">
              Decisiones complejas,{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient-text-accent)' }}>
                lógica transparente
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-4 max-w-2xl">
              Convergia simula cómo múltiples stakeholders con intereses contrapuestos alcanzan una decisión consensuada en entornos industriales.
            </p>
            <p className="text-base text-white/30 leading-relaxed mb-10 max-w-xl">
              Sin IA, sin azar. Solo lógica determinista verificable, ronda por ronda.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/scenario"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#111827] rounded-xl text-base font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Explorar la demo
                <span className="text-lg">→</span>
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 text-white/70 rounded-xl text-base font-medium hover:border-white/30 hover:text-white transition-all"
              >
                Abrir laboratorio
              </Link>
            </div>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-3 mt-14 sm:mt-16">
            {['Determinista', 'Multi-stakeholder', 'Explicable', '3 escenarios curados'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full border border-white/8 bg-white/5 text-xs font-medium text-white/35"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PROBLEM FRAMING ══════════════ */}
      <section className="py-20 px-6 border-b border-[#e1e4eb]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.2em] mb-5">El problema</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-6 leading-tight">
            Las decisiones industriales no las toma una sola persona
          </h2>
          <p className="text-lg text-[#5b6578] leading-relaxed max-w-2xl mx-auto">
            Producción quiere velocidad. Calidad exige cero defectos. Finanzas busca ROI. Sostenibilidad necesita reducir emisiones.
          </p>
          <p className="text-lg text-[#111827] font-semibold mt-4 max-w-xl mx-auto">
            ¿Cómo se modela ese proceso de negociación de forma rigurosa?
          </p>
          <div className="mt-8 h-px w-24 mx-auto bg-[#0d6e6e]/20" />
          <p className="mt-6 text-base text-[#5b6578] max-w-lg mx-auto leading-relaxed">
            Convergia convierte el <strong className="text-[#111827]">conflicto entre departamentos</strong> en el objeto central del análisis.
          </p>
        </div>
      </section>

      {/* ══════════════ WHY DIFFERENT ══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.2em] mb-4">Cómo funciona</p>
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Un motor transparente y verificable
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIFFERENTIALS.map((d) => (
              <div
                key={d.title}
                className={`rounded-2xl border p-7 transition-shadow hover:shadow-md ${d.accent}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.dot}`} />
                  <h3 className="text-base font-bold">{d.title}</h3>
                </div>
                <p className="text-sm leading-relaxed opacity-80">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHY SERIOUS ══════════════ */}
      <section className="bg-white border-y border-[#e1e4eb] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.2em] mb-5">Por qué Convergia</p>
          <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-8">
            Serio, defendible, reproducible
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl border border-[#e1e4eb]">
              <p className="text-sm font-bold text-[#111827] mb-2">Sin caja negra</p>
              <p className="text-sm text-[#5b6578] leading-relaxed">
                Cada score, cada concesión, cada veto tiene una causa rastreable en los datos.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[#e1e4eb]">
              <p className="text-sm font-bold text-[#111827] mb-2">Reproducible</p>
              <p className="text-sm text-[#5b6578] leading-relaxed">
                Mismo input → mismo output. No hay aleatoriedad ni dependencia de servicios externos.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[#e1e4eb]">
              <p className="text-sm font-bold text-[#111827] mb-2">IA opcional</p>
              <p className="text-sm text-[#5b6578] leading-relaxed">
                La capa de IA enriquece la redacción, no los resultados. Los datos son siempre deterministas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ DEMO FLOW ══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#5b6578] uppercase tracking-[0.15em] mb-3">
              Flujo de la demo · 4 pasos · ~3 minutos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {STEPS.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="group relative bg-white rounded-2xl border border-[#e1e4eb] p-7 text-left transition-all shadow-sm hover:shadow-lg hover:border-[#0d6e6e]/30 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#111827] text-white text-xs font-bold">
                    {step.step}
                  </span>
                  <span className="text-xs font-bold text-[#5b6578] uppercase tracking-wider">
                    Paso {step.step}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#111827] mb-2">
                  {step.title}
                </h2>
                <p className="text-sm text-[#5b6578] leading-relaxed mb-3">{step.description}</p>
                <p className="text-xs text-[#5b6578]/60 font-medium">{step.detail}</p>
                <span className="absolute top-6 right-6 text-[#0d6e6e] opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/scenario"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#111827] text-white rounded-xl text-lg font-bold hover:bg-[#1f2937] transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              Comenzar demo
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ ARCHITECTURE CALLOUT ══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden relative" style={{ background: 'var(--gradient-hero)' }}>
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arch-grid)" />
              </svg>
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 text-xs font-mono font-medium text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-md mb-5">
                ARQUITECTURA
              </span>
              <h2 className="text-2xl font-extrabold mb-4 tracking-tight">Dualidad: Motor + Presentación</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xl">
                El núcleo es un <strong className="text-white">motor determinista puro</strong> en TypeScript — sin dependencias externas, sin estado, sin aleatoriedad. La capa de presentación consume datos ya calculados.
                <strong className="text-white"> Toda explicación es derivada, no inventada.</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-xs font-bold text-[#5eead4] uppercase tracking-wider mb-2">Motor</p>
                  <p className="text-xs text-white/50">scoring · vetos · conflictos · consenso · concesiones · simulación</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-xs font-bold text-[#93c5fd] uppercase tracking-wider mb-2">Presentación</p>
                  <p className="text-xs text-white/50">narrativa · walkthrough · visualizaciones · debug</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/debug"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/10 text-white/70 rounded-lg text-xs font-medium hover:bg-white/15 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]" />
                  Ver verificación técnica
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ LAB + REPORT ══════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Lab */}
          <div className="rounded-2xl p-7 border border-[#e1e4eb] bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0d6e6e] bg-[#f0fafa] border border-[#d0ecec] px-3 py-1 rounded-md mb-5">
              EXPLORACIÓN
            </span>
            <h3 className="text-xl font-extrabold text-[#111827] mb-3 tracking-tight">Laboratorio de escenarios</h3>
            <p className="text-sm text-[#5b6578] leading-relaxed mb-5">
              Explora <strong className="text-[#111827]">3 escenarios industriales curados</strong>, ajusta pesos con sliders y compara resultados.
            </p>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6e6e] text-white rounded-lg text-sm font-bold hover:bg-[#0f8585] transition-colors shadow-sm"
            >
              Abrir Lab →
            </Link>
          </div>

          {/* Report */}
          <div className="rounded-2xl p-7 border border-[#e1e4eb] bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#c87514] bg-[#fef4e5] border border-[#f5dbb3] px-3 py-1 rounded-md mb-5">
              EXPORTACIÓN
            </span>
            <h3 className="text-xl font-extrabold text-[#111827] mb-3 tracking-tight">Informe exportable</h3>
            <p className="text-sm text-[#5b6578] leading-relaxed mb-5">
              Genera un <strong className="text-[#111827]">informe profesional</strong> con resumen ejecutivo, métricas, desglose y análisis. Exporta a PDF.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-lg text-sm font-bold hover:bg-[#1f2937] transition-colors shadow-sm"
            >
              Ver informe →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ConvergiaLogo size="sm" color="dark" />
              <span className="text-xs text-[#5b6578]">
                Motor determinista de negociación multi-stakeholder
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/lab" className="text-xs text-[#5b6578] hover:text-[#0d6e6e] font-mono transition-colors">/lab</Link>
              <Link href="/report" className="text-xs text-[#5b6578] hover:text-[#0d6e6e] font-mono transition-colors">/report</Link>
              <Link href="/debug" className="text-xs text-[#5b6578] hover:text-[#0d6e6e] font-mono transition-colors">/debug</Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#e1e4eb]">
            <p className="text-xs text-[#5b6578]/60 text-center">
              Proyecto académico · Ingeniería en Organización Industrial · 2025
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
