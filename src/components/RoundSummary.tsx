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
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Puntuaciones</h3>
        <ScoreTable round={round} stakeholders={stakeholders} options={options} />
      </section>

      {/* Rankings */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Rankings por stakeholder</h3>
        <RankingGrid round={round} stakeholders={stakeholders} optionNames={optionNames} />
      </section>

      {/* Conflict */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Matriz de conflicto</h3>
        <ConflictMatrix round={round} stakeholders={stakeholders} />
      </section>

      {/* Consensus */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Indicador de consenso</h3>
        <ConsensusIndicator round={round} stakeholders={stakeholders} winnerId={winnerId} />
      </section>

      {/* Concessions */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Concesiones</h3>
        <ConcessionList
          concessions={round.concessions}
          stakeholderNames={stakeholderNames}
          optionNames={optionNames}
        />
      </section>
    </div>
  );
}
