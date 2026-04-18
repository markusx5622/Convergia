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

  const totalConcessions = sim.rounds.reduce((acc, r) => acc + r.concessions.length, 0);

  return (
    <PageShell
      title="Debate multi-stakeholder"
      subtitle={`Simulación determinista de ${sim.rounds.length} rondas de negociación entre los 4 decisores`}
      currentStep={3}
    >
      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Ganador inicial</p>
          <p className="text-lg font-bold text-slate-900">{optionNames[initialWinnerId] ?? initialWinnerId}</p>
          <p className="text-xs text-slate-400 mt-1">Ronda 1 — antes de concesiones</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Ganador final</p>
          <p className="text-lg font-bold text-slate-900">{optionNames[finalWinnerId] ?? finalWinnerId}</p>
          <div className="mt-1">
            {initialWinnerId === finalWinnerId ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                ✓ Sin cambio
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                ↻ Ganador cambió
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Resumen</p>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold text-slate-900">{sim.rounds.length} rondas</p>
              <p className="text-xs text-slate-400 mt-1">{totalConcessions} concesiones · {round1.vetoes.length} vetos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vetos (shown once) */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Vetos y líneas rojas</h2>
          {round1.vetoes.length > 0 && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {round1.vetoes.length} activados
            </span>
          )}
        </div>
        <VetoList
          vetoes={round1.vetoes}
          eliminatedIds={round1.eliminatedOptionIds}
          stakeholderNames={stakeholderNames}
          optionNames={optionNames}
        />
      </section>

      {/* Round tabs */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900">Rondas de negociación</h2>
          <div className="flex items-center gap-1.5 ml-auto">
            {sim.rounds.map((r, i) => (
              <button
                key={r.round}
                onClick={() => setActiveRound(i)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeRound === i
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700',
                )}
              >
                Ronda {r.round}
              </button>
            ))}
          </div>
        </div>

        {currentRound && (
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold">
                {currentRound.round}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ronda {currentRound.round}
              </h3>
              <span className={cn(
                'ml-auto px-2.5 py-1 rounded-full text-xs font-semibold',
                currentRound.consensusStatus === 'full' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                currentRound.consensusStatus === 'partial' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                currentRound.consensusStatus === 'tie' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                'bg-red-50 text-red-700 border border-red-200'
              )}>
                {currentRound.consensusStatus === 'full' ? 'Consenso total' :
                 currentRound.consensusStatus === 'partial' ? 'Consenso parcial' :
                 currentRound.consensusStatus === 'tie' ? 'Empate' : 'Sin consenso'}
              </span>
            </div>
            <RoundSummary
              round={currentRound}
              allRounds={sim.rounds}
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
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href="/stakeholders"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        >
          ← Stakeholders
        </Link>
        <Link
          href="/result"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-base font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
        >
          Ver resultado final →
        </Link>
      </div>
    </PageShell>
  );
}
