/**
 * Convergia Logo System
 *
 * Symbol: A geometric "C" formed by two converging angular paths meeting at
 * a focal point — representing conflict resolution and convergence.
 * The negative space suggests a decision point where multiple vectors align.
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'wordmark';
  color?: 'dark' | 'light' | 'brand';
}

const SIZES = {
  sm: { symbol: 20, text: 'text-sm', gap: 'gap-1.5' },
  md: { symbol: 28, text: 'text-lg', gap: 'gap-2' },
  lg: { symbol: 36, text: 'text-2xl', gap: 'gap-2.5' },
  xl: { symbol: 48, text: 'text-3xl', gap: 'gap-3' },
} as const;

const COLORS = {
  dark: { fill: '#111827', text: 'text-[#111827]' },
  light: { fill: '#ffffff', text: 'text-white' },
  brand: { fill: '#0d6e6e', text: 'text-[#0d6e6e]' },
} as const;

function ConvergiaSymbol({ size, className }: { size: number; className?: string }) {
  return (
    <img
      src="/LogoConvergiasf.png"
      alt="Convergia Logo"
      width={size}
      height={size}
      className={cn("object-contain inline-block shrink-0 select-none", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

export function ConvergiaLogo({
  className,
  size = 'md',
  variant = 'full',
  color = 'dark',
}: LogoProps) {
  const s = SIZES[size];
  const c = COLORS[color];

  if (variant === 'symbol') {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <ConvergiaSymbol size={s.symbol} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-extrabold tracking-tight',
          s.text,
          c.text,
          className,
        )}
      >
        Convergia
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center', s.gap, className)}>
      <ConvergiaSymbol size={s.symbol} />
      <span
        className={cn(
          'font-extrabold tracking-tight',
          s.text,
          c.text,
        )}
      >
        Convergia
      </span>
    </span>
  );
}
