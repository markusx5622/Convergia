'use client';

import { runSimulation } from '@/engine/simulation';
import { isAcceptableFor } from '@/engine/consensus';
import { investmentOptions } from '@/data/options';
import { stakeholders } from '@/data/stakeholders';
import { baseScenario } from '@/data/scenario';
import type { RoundResult, SimulationResult } from '@/engine/types';

/* ── run simulation once at module level (deterministic) ── */
const sim: SimulationResult = runSimulation(baseScenario, stakeholders, investmentOptions);

const optionName: Record<string, string> = {};
for (const o of investmentOptions) optionName[o.id] = o.name;

const stakeholderName: Record<string, string> = {};
for (const s of stakeholders) stakeholderName[s.id] = s.name;

/* ── helper components ── */

function Badge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
      Aceptable
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
      No aceptable
    </span>
  );
}

/* ── sub-sections ── */

function VetoesSection({ vetoes, eliminated }: { vetoes: SimulationResult['rounds'][0]['vetoes']; eliminated: string[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Vetos y red lines</h2>
      {vetoes.length === 0 ? (
        <p className="text-gray-500 text-sm">Ninguna red line activada en el escenario actual.</p>
      ) : (
        <ul className="space-y-2">
          {vetoes.map((v, i) => (
            <li key={i} className="p-3 rounded-lg border bg-red-50 border-red-200 text-sm">
              <strong>{stakeholderName[v.stakeholderId]}</strong> veta{' '}
              <span className="font-mono">{v.optionId}</span> — {v.redLineDescription}
            </li>
          ))}
        </ul>
      )}
      {eliminated.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-red-100 text-red-800 text-sm font-semibold">
          Opciones eliminadas (≥ 2 vetos): {eliminated.map((id) => optionName[id] ?? id).join(', ')}
        </div>
      )}
      {eliminated.length === 0 && vetoes.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">Ninguna opción alcanza los 2 vetos necesarios para eliminación.</p>
      )}
    </section>
  );
}

function ScoreTable({ round }: { round: RoundResult }) {
  const activeOptions = investmentOptions.filter(
    (o) => !round.eliminatedOptionIds.includes(o.id),
  );
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-left">Stakeholder</th>
            {activeOptions.map((o) => (
              <th key={o.id} className="border border-gray-200 p-2 text-center">
                <span className="font-mono text-xs">{o.id}</span>
                <br />
                <span className="text-xs font-normal text-gray-500">{o.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stakeholders.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 p-2 font-medium">{s.name}</td>
              {activeOptions.map((o) => {
                const score = round.scores[s.id]?.[o.id] ?? 0;
                const isTop = round.rankings[s.id]?.[0] === o.id;
                return (
                  <td
                    key={o.id}
                    className={`border border-gray-200 p-2 text-center font-mono ${
                      isTop ? 'bg-blue-100 font-bold text-blue-800' : ''
                    }`}
                  >
                    {score.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td className="border border-gray-200 p-2">Global (avg)</td>
            {activeOptions.map((o) => {
              const score = round.globalScores[o.id] ?? 0;
              const isWinner = o.id === winnerId;
              return (
                <td
                  key={o.id}
                  className={`border border-gray-200 p-2 text-center font-mono ${
                    isWinner ? 'bg-yellow-100 font-bold text-yellow-800' : ''
                  }`}
                >
                  {score.toFixed(3)}
                  {isWinner && ' 🏆'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ConflictMatrix({ round }: { round: RoundResult }) {
  const sids = stakeholders.map((s) => s.id);
  return (
    <div className="overflow-x-auto">
      <table className="text-sm border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2" />
            {sids.map((sid) => (
              <th key={sid} className="border border-gray-200 p-2 text-center text-xs">
                {stakeholderName[sid]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sids.map((si) => (
            <tr key={si}>
              <td className="border border-gray-200 p-2 font-medium text-xs">{stakeholderName[si]}</td>
              {sids.map((sj) => {
                const val = round.conflictMatrix[si]?.[sj] ?? 0;
                const bg =
                  si === sj
                    ? 'bg-gray-50'
                    : val > 0.5
                    ? 'bg-red-100'
                    : val > 0.25
                    ? 'bg-yellow-50'
                    : 'bg-green-50';
                return (
                  <td key={sj} className={`border border-gray-200 p-2 text-center font-mono text-xs ${bg}`}>
                    {val.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-1">
        Conflicto total del sistema: <strong>{round.totalConflict.toFixed(3)}</strong>
      </p>
    </div>
  );
}

function ConsensusSection({ round }: { round: RoundResult }) {
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];

  const statusColors: Record<string, string> = {
    full: 'bg-green-100 text-green-800',
    partial: 'bg-blue-100 text-blue-800',
    tie: 'bg-yellow-100 text-yellow-800',
    none: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[round.consensusStatus] ?? ''}`}>
          Consenso: {round.consensusStatus.toUpperCase()}
        </span>
        <span className="text-sm text-gray-600">
          Score de consenso: <strong className="font-mono">{round.consensusScore.toFixed(3)}</strong>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {stakeholders.map((s) => {
          const acceptable = isAcceptableFor(s, round.scores[s.id] ?? {}, winnerId ?? '');
          return (
            <div key={s.id} className="text-xs flex items-center gap-1">
              <span className="font-medium">{s.name}:</span>
              <Badge ok={acceptable} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConcessionsSection({ concessions }: { concessions: RoundResult['concessions'] }) {
  if (concessions.length === 0) {
    return <p className="text-xs text-gray-400">Sin concesiones en esta ronda.</p>;
  }
  return (
    <ul className="space-y-1">
      {concessions.map((c, i) => (
        <li key={i} className="text-sm p-2 rounded bg-amber-50 border border-amber-200">
          <strong>{stakeholderName[c.stakeholderId]}</strong> cede{' '}
          <span className="font-mono text-xs">{c.fromOptionId}</span> →{' '}
          <span className="font-mono text-xs">{c.toOptionId}</span>{' '}
          <span className="text-gray-500">(gap: {c.gap.toFixed(3)}) — {c.reason}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── main page ── */

export default function DebugPage() {
  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Convergia — Motor de Verificación</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Debug page v1.1 · Escenario: {sim.scenario.name} · {sim.rounds.length} rondas
      </p>

      {/* ── Vetoes ── */}
      <VetoesSection
        vetoes={sim.rounds[0]?.vetoes ?? []}
        eliminated={sim.rounds[0]?.eliminatedOptionIds ?? []}
      />

      {/* ── Round evolution ── */}
      {sim.rounds.map((round) => (
        <section key={round.round} className="mb-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Ronda {round.round}</h2>

          {/* Scores */}
          <h3 className="text-lg font-semibold mb-3">Scores (stakeholder × opción)</h3>
          <ScoreTable round={round} />
          <p className="text-xs text-gray-400 mt-2 mb-6">
            Azul = preferencia del stakeholder · Amarillo = ganador global
          </p>

          {/* Rankings */}
          <h3 className="text-lg font-semibold mb-3">Rankings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {stakeholders.map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  {s.name} <span className="text-xs text-gray-400 font-normal">({s.role})</span>
                </h4>
                <ol className="space-y-1">
                  {(round.rankings[s.id] ?? []).map((oid, idx) => (
                    <li key={oid} className="flex items-center gap-2 text-sm">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0
                            ? 'bg-blue-500 text-white'
                            : idx === 1
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-mono text-xs text-gray-400">{oid}</span>
                      <span>{optionName[oid]}</span>
                      <span className="ml-auto font-mono text-xs text-gray-500">
                        {(round.scores[s.id]?.[oid] ?? 0).toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Conflict matrix */}
          <h3 className="text-lg font-semibold mb-3">Matriz de conflicto</h3>
          <div className="mb-6">
            <ConflictMatrix round={round} />
          </div>

          {/* Consensus */}
          <h3 className="text-lg font-semibold mb-3">Consenso</h3>
          <div className="mb-6">
            <ConsensusSection round={round} />
          </div>

          {/* Concessions */}
          <h3 className="text-lg font-semibold mb-3">Concesiones</h3>
          <ConcessionsSection concessions={round.concessions} />
        </section>
      ))}

      {/* ── Final result ── */}
      <section className="mb-10 border-t-2 border-gray-300 pt-8">
        <h2 className="text-2xl font-bold mb-4">Resultado final</h2>
        {sim.finalOption ? (
          <div className="p-6 rounded-xl border-2 border-yellow-400 bg-yellow-50">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-xl font-bold">{sim.finalOption.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{sim.finalOption.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                Coste: <strong>{(sim.finalOption.cost / 1000).toFixed(0)}k€</strong>
              </span>
              <span>
                Consenso:{' '}
                <strong className="uppercase">{sim.consensusStatus}</strong>
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-700">{sim.explanation}</p>
          </div>
        ) : (
          <p className="text-red-600 font-semibold">No se determinó opción final.</p>
        )}
      </section>
    </div>
  );
}
