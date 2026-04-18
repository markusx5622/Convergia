'use client';

import { runSimulation } from '@/engine/simulation';
import { isAcceptableFor } from '@/engine/consensus';
import { investmentOptions } from '@/data/options';
import { stakeholders } from '@/data/stakeholders';
import { baseScenario } from '@/data/scenario';
import type { RoundResult, SimulationResult } from '@/engine/types';
import Link from 'next/link';

/* ── run simulation once at module level (deterministic) ── */
const sim: SimulationResult = runSimulation(baseScenario, stakeholders, investmentOptions);

const optionName: Record<string, string> = {};
for (const o of investmentOptions) optionName[o.id] = o.name;

const stakeholderName: Record<string, string> = {};
for (const s of stakeholders) stakeholderName[s.id] = s.name;

/* ── helper components ── */

function Badge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 font-semibold">
      Aceptable
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-semibold">
      No aceptable
    </span>
  );
}

/* ── sub-sections ── */

function VetoesSection({ vetoes, eliminated }: { vetoes: SimulationResult['rounds'][0]['vetoes']; eliminated: string[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-slate-900">Vetos y líneas rojas</h2>
      {vetoes.length === 0 ? (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Ninguna línea roja activada en el escenario actual.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {vetoes.map((v, i) => (
            <li key={i} className="p-3 rounded-lg border bg-red-50 border-red-200 text-sm">
              <strong>{stakeholderName[v.stakeholderId]}</strong> veta{' '}
              <span className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">{v.optionId}</span> — {v.redLineDescription}
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
        <p className="text-xs text-slate-400 mt-2">Ninguna opción alcanza los 2 vetos necesarios para eliminación.</p>
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
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-slate-200 p-2 text-left text-xs font-semibold text-slate-500">Stakeholder</th>
            {activeOptions.map((o) => (
              <th key={o.id} className="border-b border-slate-200 p-2 text-center">
                <span className="font-mono text-xs text-slate-400">{o.id}</span>
                <br />
                <span className="text-xs font-normal text-slate-500">{o.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stakeholders.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50">
              <td className="border-b border-slate-100 p-2 font-medium text-slate-700">{s.name}</td>
              {activeOptions.map((o) => {
                const score = round.scores[s.id]?.[o.id] ?? 0;
                const isTop = round.rankings[s.id]?.[0] === o.id;
                return (
                  <td
                    key={o.id}
                    className={`border-b border-slate-100 p-2 text-center font-mono tabular-nums ${
                      isTop ? 'bg-blue-50 font-bold text-blue-800' : 'text-slate-600'
                    }`}
                  >
                    {score.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-slate-50 font-semibold">
            <td className="border-t border-slate-200 p-2 text-slate-900">Global (avg)</td>
            {activeOptions.map((o) => {
              const score = round.globalScores[o.id] ?? 0;
              const isWinner = o.id === winnerId;
              return (
                <td
                  key={o.id}
                  className={`border-t border-slate-200 p-2 text-center font-mono tabular-nums ${
                    isWinner ? 'bg-yellow-100 font-bold text-yellow-800' : 'text-slate-700'
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
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-slate-200 p-2" />
            {sids.map((sid) => (
              <th key={sid} className="border-b border-slate-200 p-2 text-center text-xs text-slate-500">
                {stakeholderName[sid]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sids.map((si) => (
            <tr key={si}>
              <td className="border-b border-slate-100 p-2 font-medium text-xs text-slate-700">{stakeholderName[si]}</td>
              {sids.map((sj) => {
                const val = round.conflictMatrix[si]?.[sj] ?? 0;
                const bg =
                  si === sj
                    ? 'bg-slate-50'
                    : val > 0.5
                    ? 'bg-red-100'
                    : val > 0.25
                    ? 'bg-yellow-50'
                    : 'bg-emerald-50';
                return (
                  <td key={sj} className={`border-b border-slate-100 p-2 text-center font-mono text-xs tabular-nums ${bg}`}>
                    {val.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-400 p-2 border-t border-slate-100">
        Conflicto total del sistema: <strong className="text-slate-600">{round.totalConflict.toFixed(3)}</strong>
      </p>
    </div>
  );
}

function ConsensusSection({ round }: { round: RoundResult }) {
  const winnerId = Object.entries(round.globalScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0];

  const statusColors: Record<string, string> = {
    full: 'bg-emerald-100 text-emerald-800',
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
        <span className="text-sm text-slate-600">
          Score de consenso: <strong className="font-mono tabular-nums">{round.consensusScore.toFixed(3)}</strong>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {stakeholders.map((s) => {
          const acceptable = isAcceptableFor(s, round.scores[s.id] ?? {}, winnerId ?? '');
          return (
            <div key={s.id} className="text-xs flex items-center gap-1">
              <span className="font-medium text-slate-700">{s.name}:</span>
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
    return <p className="text-xs text-slate-400">Sin concesiones en esta ronda.</p>;
  }
  return (
    <ul className="space-y-1">
      {concessions.map((c, i) => (
        <li key={i} className="text-sm p-2 rounded bg-amber-50 border border-amber-200">
          <strong>{stakeholderName[c.stakeholderId]}</strong> cede{' '}
          <span className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">{c.fromOptionId}</span> →{' '}
          <span className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">{c.toOptionId}</span>{' '}
          <span className="text-slate-500">(gap: {c.gap.toFixed(3)}) — {c.reason}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── main page ── */

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Minimal header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-extrabold text-slate-900 tracking-tight">
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
              DEBUG
            </span>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            ← Inicio
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              🔬 Lab
            </Link>
            <Link
              href="/report"
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              📄 Informe
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verificación técnica</h1>
          <p className="text-slate-500 text-sm mt-1">
            Escenario: {sim.scenario.name} · {sim.rounds.length} rondas · Motor determinista · Resultado reproducible
          </p>
        </header>

        {/* Verification callout */}
        <div className="bg-slate-900 rounded-xl p-5 mb-10 text-white">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold">✓</span>
            <div>
              <p className="text-sm font-bold mb-1">Resultado reproducible</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Esta página expone los datos internos completos del motor determinista. Mismos datos de entrada producen siempre el mismo resultado.
                Los scores, rankings, vetos, concesiones y métricas de consenso que ves aquí son exactamente los que alimentan las narrativas y visualizaciones de la demo.
                No hay aleatoriedad ni llamadas externas — todo es calculado localmente en el navegador.
              </p>
            </div>
          </div>
        </div>

        {/* ── Vetoes ── */}
        <VetoesSection
          vetoes={sim.rounds[0]?.vetoes ?? []}
          eliminated={sim.rounds[0]?.eliminatedOptionIds ?? []}
        />

        {/* ── Round evolution ── */}
        {sim.rounds.map((round) => (
          <section key={round.round} className="mb-12 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Ronda {round.round}
              <span className={`ml-3 text-sm px-2.5 py-1 rounded-full font-semibold ${
                round.consensusStatus === 'full' ? 'bg-emerald-100 text-emerald-700' :
                round.consensusStatus === 'partial' ? 'bg-blue-100 text-blue-700' :
                round.consensusStatus === 'tie' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {round.consensusStatus}
              </span>
            </h2>

            {/* Scores */}
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Scores (stakeholder × opción)</h3>
            <ScoreTable round={round} />
            <p className="text-xs text-slate-400 mt-2 mb-6">
              Azul = preferencia del stakeholder · Amarillo = ganador global
            </p>

            {/* Rankings */}
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Rankings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stakeholders.map((s) => (
                <div key={s.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold mb-2 text-slate-900">
                    {s.name} <span className="text-xs text-slate-400 font-normal">({s.role})</span>
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
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-mono text-xs text-slate-400">{oid}</span>
                        <span className="text-slate-700">{optionName[oid]}</span>
                        <span className="ml-auto font-mono text-xs text-slate-500 tabular-nums">
                          {(round.scores[s.id]?.[oid] ?? 0).toFixed(3)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* Conflict matrix */}
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Matriz de conflicto</h3>
            <div className="mb-6">
              <ConflictMatrix round={round} />
            </div>

            {/* Consensus */}
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Consenso</h3>
            <div className="mb-6">
              <ConsensusSection round={round} />
            </div>

            {/* Concessions */}
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Concesiones</h3>
            <ConcessionsSection concessions={round.concessions} />
          </section>
        ))}

        {/* ── Final result ── */}
        <section className="mb-10 border-t-2 border-slate-300 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Resultado final</h2>
          {sim.finalOption ? (
            <div className="p-6 rounded-xl border-2 border-yellow-400 bg-yellow-50">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-xl font-bold text-slate-900">{sim.finalOption.name}</h3>
              <p className="text-slate-600 text-sm mb-3">{sim.finalOption.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-slate-700">
                  Coste: <strong>{(sim.finalOption.cost / 1000).toFixed(0)}k€</strong>
                </span>
                <span className="text-slate-700">
                  Consenso:{' '}
                  <strong className="uppercase">{sim.consensusStatus}</strong>
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-700">{sim.explanation}</p>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">No se determinó opción final.</p>
          )}
        </section>
      </div>
    </div>
  );
}
