import Link from 'next/link';

const STEPS = [
  {
    href: '/scenario',
    title: 'Escenario',
    description: 'Contexto de MetalWorks S.A., presupuesto, KPIs y opciones de inversión',
    icon: '🏗️',
    step: 1,
  },
  {
    href: '/stakeholders',
    title: 'Stakeholders',
    description: 'Los 4 decisores clave, sus prioridades, pesos y líneas rojas',
    icon: '👥',
    step: 2,
  },
  {
    href: '/debate',
    title: 'Debate',
    description: 'Simulación de rondas de negociación con scoring, conflictos y concesiones',
    icon: '⚡',
    step: 3,
  },
  {
    href: '/result',
    title: 'Resultado',
    description: 'Opción ganadora, consenso final y desglose completo de la decisión',
    icon: '🏆',
    step: 4,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Convergia</h1>
        <p className="text-xl text-gray-500 mb-12">
          Simulador de decisiones multi-stakeholder para entornos industriales
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {STEPS.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group bg-white rounded-xl border-2 border-gray-200 p-6 text-left hover:border-gray-900 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Paso {step.step}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 mb-1">
                {step.title}
              </h2>
              <p className="text-sm text-gray-500">{step.description}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/scenario"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Comenzar demo →
        </Link>

        <div className="mt-8">
          <Link
            href="/debug"
            className="text-xs text-gray-400 hover:text-gray-600 font-mono transition-colors"
          >
            debug: verificación técnica del motor →
          </Link>
        </div>
      </div>
    </main>
  );
}
