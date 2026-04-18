'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ConvergiaLogo } from './ConvergiaLogo';

const FLOW_STEPS = [
  { href: '/scenario', label: 'Escenario', step: 1 },
  { href: '/stakeholders', label: 'Stakeholders', step: 2 },
  { href: '/debate', label: 'Debate', step: 3 },
  { href: '/result', label: 'Resultado', step: 4 },
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
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ConvergiaLogo size="sm" color="dark" />
              <span className="text-[10px] font-bold text-[#0d6e6e] bg-[#f0fafa] border border-[#d0ecec] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Demo
              </span>
            </Link>
            <div className="flex items-center gap-0.5">
              <Link
                href="/"
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/'
                    ? 'bg-[#111827] text-white'
                    : 'text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827]',
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
                      ? 'bg-[#111827] text-white'
                      : 'text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827]',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <span className="mx-2 h-4 w-px bg-[#e1e4eb]" />
              <Link
                href="/lab"
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/lab'
                    ? 'bg-[#0d6e6e] text-white'
                    : 'text-[#0d6e6e] hover:bg-[#f0fafa] hover:text-[#0f8585]',
                )}
              >
                Lab
              </Link>
              <Link
                href="/studio"
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/studio'
                    ? 'bg-[#0d6e6e] text-white'
                    : 'text-[#0d6e6e] hover:bg-[#f0fafa] hover:text-[#0f8585]',
                )}
              >
                Studio
              </Link>
              <Link
                href="/report"
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/report'
                    ? 'bg-[#111827] text-white'
                    : 'text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827]',
                )}
              >
                Informe
              </Link>
              <span className="mx-2 h-4 w-px bg-[#e1e4eb]" />
              <Link
                href="/debug"
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors',
                  pathname === '/debug'
                    ? 'bg-[#111827] text-white'
                    : 'text-[#5b6578]/50 hover:bg-[#f0f1f5] hover:text-[#5b6578]',
                )}
              >
                /debug
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Step Progress Bar */}
      {activeStep > 0 && (
        <div className="bg-white border-b border-[#f0f1f5]">
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
                          ? 'bg-[#111827] text-white shadow-sm'
                          : isCompleted
                          ? 'bg-[#f0fafa] text-[#0d6e6e] hover:bg-[#d0ecec]'
                          : 'bg-[#f0f1f5] text-[#5b6578]/50 hover:bg-[#e1e4eb] hover:text-[#5b6578]',
                      )}
                    >
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        isActive
                          ? 'bg-white text-[#111827]'
                          : isCompleted
                          ? 'bg-[#0d6e6e] text-white'
                          : 'bg-[#e1e4eb] text-[#5b6578]',
                      )}>
                        {isCompleted ? '✓' : step.step}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </Link>
                    {i < FLOW_STEPS.length - 1 && (
                      <div className={cn(
                        'flex-1 h-0.5 mx-2 rounded-full',
                        step.step < activeStep ? 'bg-[#0d6e6e]/30' : 'bg-[#e1e4eb]',
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
      <header className="bg-white border-b border-[#f0f1f5]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeStep > 0 && (
            <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-[0.15em] mb-2">
              Paso {activeStep} de {FLOW_STEPS.length}
            </p>
          )}
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-[#5b6578] text-base leading-relaxed max-w-2xl">{subtitle}</p>
          )}
        </div>
      </header>

      {/* Demo guidance banner */}
      {guidance && (
        <div className="bg-gradient-to-r from-[#f0fafa] to-[#eef5fb] border-b border-[#d0ecec]/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0d6e6e]/10 text-[#0d6e6e] text-xs font-bold mt-0.5">
                {activeStep}
              </span>
              <div>
                <p className="text-xs font-bold text-[#0d6e6e] uppercase tracking-wider mb-0.5">{guidance.context}</p>
                <p className="text-sm text-[#111827]/60 leading-relaxed">{guidance.hint}</p>
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
      <footer className="border-t border-[#e1e4eb] bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ConvergiaLogo size="sm" variant="symbol" color="brand" />
            <p className="text-xs text-[#5b6578]">
              Motor determinista de negociación multi-stakeholder · 2025
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5b6578]/40">
              Resultado reproducible · Explicabilidad total
            </span>
            <span className="text-[#e1e4eb]">·</span>
            <Link href="/debug" className="text-xs text-[#5b6578]/40 hover:text-[#0d6e6e] font-mono transition-colors">
              /debug
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
