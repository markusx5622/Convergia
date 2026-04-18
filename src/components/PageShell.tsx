'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio' },
  { href: '/scenario', label: 'Escenario' },
  { href: '/stakeholders', label: 'Stakeholders' },
  { href: '/debate', label: 'Debate' },
  { href: '/result', label: 'Resultado' },
] as const;

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function PageShell({ children, title, subtitle }: PageShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              Convergia
            </Link>
            <div className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <span className="mx-2 h-5 w-px bg-gray-200" />
              <Link
                href="/debug"
                className={cn(
                  'px-3 py-2 rounded-md text-xs font-mono transition-colors',
                  pathname === '/debug'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                )}
              >
                debug
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-gray-500 text-lg">{subtitle}</p>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
