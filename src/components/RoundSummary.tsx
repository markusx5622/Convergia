import type { RoundResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { ScoreTable } from './ScoreTable';
import { RankingGrid } from './RankingList';
import { ConflictMatrix } from './ConflictMatrix';
import { ConsensusIndicator } from './ConsensusIndicator';
import { ConcessionList } from './ConcessionList';

interface RoundSummaryProps {
  round: RoundResult;
  stakeholders: Stakeholder[];
  options: InvestmentOption[];
  optionNames: Record<string, string>;
  stakeholderNames: Record<string, string>;
}

function SectionTitle({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{icon}</span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {description && (
        <span className="text-xs text-slate-400 ml-1">{description}</span>
      )}
    </div>
  );
}

export function RoundSummary({
  round,
  stakeholders,
  options,
  optionNames,
  stakeholderNames,
}: RoundSummaryProps) {
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? '';

  return (
    <div className="space-y-8">
      {/* Scores */}
      <section>
        <SectionTitle icon="📊" title="Puntuaciones" description="Score ponderado de cada stakeholder por opción" />
        <ScoreTable round={round} stakeholders={stakeholders} options={options} />
      </section>

      {/* Rankings */}
      <section>
        <SectionTitle icon="🥇" title="Rankings por stakeholder" description="Orden de preferencia individual" />
        <RankingGrid round={round} stakeholders={stakeholders} optionNames={optionNames} />
      </section>

      {/* Conflict */}
      <section>
        <SectionTitle icon="⚔️" title="Matriz de conflicto" description="Nivel de desacuerdo entre pares" />
        <ConflictMatrix round={round} stakeholders={stakeholders} />
      </section>

      {/* Consensus */}
      <section>
        <SectionTitle icon="🎯" title="Indicador de consenso" description="Estado de acuerdo global" />
        <ConsensusIndicator round={round} stakeholders={stakeholders} winnerId={winnerId} />
      </section>

      {/* Concessions */}
      <section>
        <SectionTitle icon="🤝" title="Concesiones" description="Ajustes realizados en esta ronda" />
        <ConcessionList
          concessions={round.concessions}
          stakeholderNames={stakeholderNames}
          optionNames={optionNames}
        />
      </section>
    </div>
  );
}
