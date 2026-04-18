'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const FLOW_STEPS = [
  { href: '/scenario', label: 'Escenario', step: 1, icon: '🏗️' },
  { href: '/stakeholders', label: 'Stakeholders', step: 2, icon: '👥' },
  { href: '/debate', label: 'Debate', step: 3, icon: '⚡' },
  { href: '/result', label: 'Resultado', step: 4, icon: '🏆' },
] as const;

const STEP_GUIDANCE: Record<number, { context: string; hint: string }> = {
  1: {
    context: 'Contexto',
    hint: 'Estás viendo el escenario industrial. Observa la empresa, su presupuesto y las 5 opciones de inversión disponibles. Cada opción impacta de forma diferente en las 6 variables del sistema.',
  },
  2: {
    context: 'Actores',
    hint: 'Conoce a los 4 decisores. Cada uno tiene pesos distintos para las 6 variables, líneas rojas que no negociará y umbrales de concesión diferentes. Estas asimetrías son las que generan el conflicto.',
  },
  3: {
    context: 'Negociación',
    hint: 'Aquí el motor ejecuta las rondas de negociación. Observa cómo cambian los scores, quién cede, cómo evoluciona el conflicto y si el consenso mejora o empeora con cada ronda.',
  },
  4: {
    context: 'Decisión',
    hint: 'Este es el resultado final del proceso. La narrativa explica por qué ganó esta opción, quién la apoya, quién cedió y qué variables fueron determinantes. Todo es derivado de los datos calculados.',
  },
};

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
}

function getStepFromPath(pathname: string): number {
  const stepMap: Record<string, number> = {
    '/scenario': 1,
    '/stakeholders': 2,
    '/debate': 3,
    '/result': 4,
  };
  return stepMap[pathname] ?? 0;
}

export function PageShell({ children, title, subtitle, currentStep }: PageShellProps) {
  const pathname = usePathname();
  const activeStep = currentStep ?? getStepFromPath(pathname);
  const guidance = STEP_GUIDANCE[activeStep];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Convergia
              </span>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                DEMO
              </span>
            </Link>
            <div className="flex items-center gap-0.5">
              <Link
                href="/"
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                Inicio
              </Link>
              {FLOW_STEPS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <span className="mx-2 h-4 w-px bg-slate-200" />
              <Link
                href="/debug"
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors',
                  pathname === '/debug'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
                )}
              >
                debug
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Step Progress Bar */}
      {activeStep > 0 && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-1">
              {FLOW_STEPS.map((step, i) => {
                const isActive = step.step === activeStep;
                const isCompleted = step.step < activeStep;
                return (
                  <div key={step.step} className="flex items-center flex-1">
                    <Link
                      href={step.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600',
                      )}
                    >
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        isActive
                          ? 'bg-white text-slate-900'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500',
                      )}>
                        {isCompleted ? '✓' : step.step}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </Link>
                    {i < FLOW_STEPS.length - 1 && (
                      <div className={cn(
                        'flex-1 h-0.5 mx-2 rounded-full',
                        step.step < activeStep ? 'bg-emerald-300' : 'bg-slate-200',
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeStep > 0 && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Paso {activeStep} de {FLOW_STEPS.length}
            </p>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-2xl">{subtitle}</p>
          )}
        </div>
      </header>

      {/* Demo guidance banner */}
      {guidance && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mt-0.5">
                {activeStep}
              </span>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-0.5">{guidance.context}</p>
                <p className="text-sm text-blue-900/70 leading-relaxed">{guidance.hint}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Convergia · Motor determinista de negociación multi-stakeholder
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">
              Resultado reproducible · Explicabilidad total
            </span>
            <span className="text-slate-200">·</span>
            <Link href="/debug" className="text-xs text-slate-400 hover:text-slate-600 font-mono transition-colors">
              /debug
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
