'use client';

import { PageShell } from '@/components/PageShell';
import { VetoList } from '@/components/VetoList';
import { RoundSummary } from '@/components/RoundSummary';
import { runSimulation } from '@/engine/simulation';
import { baseScenario } from '@/data/scenario';
import { stakeholders } from '@/data/stakeholders';
import { investmentOptions } from '@/data/options';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const sim = runSimulation(baseScenario, stakeholders, investmentOptions);

const optionNames: Record<string, string> = {};
for (const o of investmentOptions) optionNames[o.id] = o.name;

const stakeholderNames: Record<string, string> = {};
for (const s of stakeholders) stakeholderNames[s.id] = s.name;

export default function DebatePage() {
  const [activeRound, setActiveRound] = useState(sim.rounds.length - 1);
  const round1 = sim.rounds[0];
  const currentRound = sim.rounds[activeRound];

  // Initial winner (round 1)
  const initialWinnerId = Object.entries(round1.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? '';

  // Final winner
  const finalWinnerId = Object.entries(sim.rounds[sim.rounds.length - 1].globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? '';

  return (
    <PageShell
      title="Debate multi-stakeholder"
      subtitle={`Simulación de ${sim.rounds.length} rondas de negociación determinista`}
    >
      {/* Initial winner summary */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ganador inicial (Ronda 1)</p>
            <p className="text-xl font-bold text-gray-900">{optionNames[initialWinnerId] ?? initialWinnerId}</p>
          </div>
          <span className="text-gray-300">→</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ganador final (Ronda {sim.rounds.length})</p>
            <p className="text-xl font-bold text-gray-900">{optionNames[finalWinnerId] ?? finalWinnerId}</p>
          </div>
          {initialWinnerId === finalWinnerId ? (
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Sin cambio de ganador
            </span>
          ) : (
            <span className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
              Ganador cambió
            </span>
          )}
        </div>
      </section>

      {/* Vetos (shown once) */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vetos y líneas rojas</h2>
        <VetoList
          vetoes={round1.vetoes}
          eliminatedIds={round1.eliminatedOptionIds}
          stakeholderNames={stakeholderNames}
          optionNames={optionNames}
        />
      </section>

      {/* Round tabs */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mr-4">Rondas</h2>
          {sim.rounds.map((r, i) => (
            <button
              key={r.round}
              onClick={() => setActiveRound(i)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                activeRound === i
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              )}
            >
              Ronda {r.round}
            </button>
          ))}
        </div>

        {currentRound && (
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <RoundSummary
              round={currentRound}
              stakeholders={stakeholders}
              options={investmentOptions.filter(
                (o) => !currentRound.eliminatedOptionIds.includes(o.id),
              )}
              optionNames={optionNames}
              stakeholderNames={stakeholderNames}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Link
          href="/result"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Ver resultado final →
        </Link>
      </div>
    </PageShell>
  );
}
