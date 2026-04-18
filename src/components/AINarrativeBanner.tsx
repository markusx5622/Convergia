import { cn } from '@/lib/utils';

interface AINarrativeBannerProps {
  source: 'ai' | 'fallback';
  className?: string;
}

/**
 * Disclaimer banner shown when AI narrative is active.
 * Makes it clear that results are deterministic and AI only enriches prose.
 */
export function AINarrativeBanner({ source, className }: AINarrativeBannerProps) {
  if (source !== 'ai') return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border bg-violet-50 border-violet-200',
        className,
      )}
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">
        ✨
      </span>
      <div>
        <p className="text-sm font-bold text-violet-900 mb-1">
          Narrativa enriquecida con IA
        </p>
        <p className="text-xs text-violet-700 leading-relaxed">
          Los textos marcados con <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-violet-100 rounded text-[10px] font-bold text-violet-700 border border-violet-200">✨ IA</span> fueron
          redactados por un modelo de lenguaje a partir de datos ya calculados por el motor
          determinista. <strong>Los resultados, scores, consenso y concesiones NO fueron
          modificados por la IA.</strong> Esta es una capa opcional de mejora de redacción.
        </p>
      </div>
    </div>
  );
}

/**
 * Small inline badge to mark AI-generated text fragments.
 */
export function AIBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-violet-100 rounded-md text-[10px] font-bold text-violet-700 border border-violet-200 ml-1.5 whitespace-nowrap">
      ✨ IA
    </span>
  );
}
