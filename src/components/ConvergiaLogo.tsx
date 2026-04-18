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

function ConvergiaSymbol({ size, fill }: { size: number; fill: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer converging arcs forming an abstract "C" */}
      <path
        d="M34 8C28.5 4.5 21 4 15 7C9 10 5 16.5 5 24C5 31.5 9 38 15 41C21 44 28.5 43.5 34 40"
        stroke={fill}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner convergence lines meeting at focal point */}
      <path
        d="M30 14L22 24L30 34"
        stroke={fill}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Focal point — the convergence node */}
      <circle cx="22" cy="24" r="2.5" fill={fill} />
      {/* Converging rays from outside */}
      <path
        d="M38 16L30 22"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M38 32L30 26"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
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
        <ConvergiaSymbol size={s.symbol} fill={c.fill} />
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
      <ConvergiaSymbol size={s.symbol} fill={c.fill} />
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
