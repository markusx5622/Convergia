import { cn } from '@/lib/utils';

interface WeightsBarProps {
  label: string;
  value: number;
  maxValue?: number;
  className?: string;
}

export function WeightsBar({ label, value, maxValue = 0.5, className }: WeightsBarProps) {
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-slate-500 w-36 truncate" title={label}>{label}</span>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 60 ? 'bg-slate-800' : pct >= 30 ? 'bg-slate-500' : 'bg-slate-300',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500 w-10 text-right tabular-nums">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}
