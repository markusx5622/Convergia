import type { RoundResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { buildRoundNarrative } from '@/engine/narrative';
import { RoundNarrativeCard } from './RoundNarrative';
import { ScoreTable } from './ScoreTable';
import { RankingGrid } from './RankingList';
import { ConflictMatrix } from './ConflictMatrix';
import { ConsensusIndicator } from './ConsensusIndicator';
import { ConcessionList } from './ConcessionList';

interface RoundSummaryProps {
  round: RoundResult;
  allRounds: RoundResult[];
  stakeholders: Stakeholder[];
  options: InvestmentOption[];
  optionNames: Record<string, string>;
  stakeholderNames: Record<string, string>;
}

function SectionTitle({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-base">{icon}</span>
      <div>
        <h3 className="text-base font-bold text-[#111827]">{title}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

export function RoundSummary({
  round,
  allRounds,
  stakeholders,
  options,
  optionNames,
  stakeholderNames,
}: RoundSummaryProps) {
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? '';

  const roundIndex = allRounds.findIndex((r) => r.round === round.round);

  const narrative = buildRoundNarrative(
    round,
    roundIndex >= 0 ? roundIndex : 0,
    allRounds,
    stakeholders,
    optionNames,
    stakeholderNames,
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Round narrative */}
      <RoundNarrativeCard
        narrative={narrative}
        optionNames={optionNames}
        stakeholderNames={stakeholderNames}
      />

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
