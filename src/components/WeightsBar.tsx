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
      <span className="text-xs text-gray-500 w-36 truncate" title={label}>{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-500 w-10 text-right">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}
