'use client';

import {
  calculateAllScores,
  calculateGlobalScores,
  findGlobalWinner,
  rankOptionsForStakeholder,
} from '@/engine/scoring';
import { investmentOptions } from '@/data/options';
import { stakeholders } from '@/data/stakeholders';

const allScores = calculateAllScores(stakeholders, investmentOptions);
const globalScores = calculateGlobalScores(stakeholders, investmentOptions);
const globalWinnerId = findGlobalWinner(stakeholders, investmentOptions);

const rankings: Record<string, string[]> = {};
for (const s of stakeholders) {
  rankings[s.id] = rankOptionsForStakeholder(s, investmentOptions);
}

interface Check {
  label: string;
  pass: boolean;
  actual: string;
  expected: string;
}

function isClose(a: number, b: number, tol = 0.005): boolean {
  return Math.abs(a - b) <= tol;
}

const checks: Check[] = [
  {
    label: "Producción prefiere option-a (score ≈ 0.550)",
    pass:
      rankings['production'][0] === 'option-a' &&
      isClose(allScores['production']['option-a'], 0.55),
    actual: `${rankings['production'][0]} (${allScores['production']['option-a']})`,
    expected: 'option-a (≈ 0.550)',
  },
  {
    label: "Calidad prefiere option-b (score ≈ 0.554)",
    pass:
      rankings['quality'][0] === 'option-b' &&
      isClose(allScores['quality']['option-b'], 0.554),
    actual: `${rankings['quality'][0]} (${allScores['quality']['option-b']})`,
    expected: 'option-b (≈ 0.554)',
  },
  {
    label: "Finanzas prefiere option-d (score ≈ 0.664)",
    pass:
      rankings['finance'][0] === 'option-d' &&
      isClose(allScores['finance']['option-d'], 0.664),
    actual: `${rankings['finance'][0]} (${allScores['finance']['option-d']})`,
    expected: 'option-d (≈ 0.664)',
  },
  {
    label: "Sostenibilidad prefiere option-c (score ≈ 0.517)",
    pass:
      rankings['sustainability'][0] === 'option-c' &&
      isClose(allScores['sustainability']['option-c'], 0.517),
    actual: `${rankings['sustainability'][0]} (${allScores['sustainability']['option-c']})`,
    expected: 'option-c (≈ 0.517)',
  },
  {
    label: "Ganador global es option-d (score ≈ 0.526)",
    pass:
      globalWinnerId === 'option-d' &&
      isClose(globalScores['option-d'], 0.526),
    actual: `${globalWinnerId} (${globalScores['option-d']})`,
    expected: 'option-d (≈ 0.526)',
  },
];

const optionName: Record<string, string> = {};
for (const o of investmentOptions) {
  optionName[o.id] = o.name;
}

export default function DebugPage() {
  const allPass = checks.every((c) => c.pass);

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Convergia — Motor de Verificación</h1>
      <p className="text-gray-500 mb-8 text-sm">Debug page v1.1 · Escenario: MetalWorks S.A.</p>

      {/* Pass/Fail Summary */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Verificaciones canónicas v1.1</h2>
        <div className="space-y-2">
          {checks.map((check, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                check.pass
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <span className="text-xl">{check.pass ? '✅' : '❌'}</span>
              <div>
                <p className="font-medium text-sm">{check.label}</p>
                <p className="text-xs text-gray-500">
                  Actual: <span className="font-mono">{check.actual}</span> · Esperado:{' '}
                  <span className="font-mono">{check.expected}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`mt-4 p-3 rounded-lg font-semibold text-center ${
            allPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {allPass ? '✅ TODAS LAS VERIFICACIONES PASADAS' : '❌ ALGUNAS VERIFICACIONES FALLARON'}
        </div>
      </section>

      {/* Score Table */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Tabla de scores (stakeholder × opción)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 text-left">Stakeholder</th>
                {investmentOptions.map((o) => (
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
                  {investmentOptions.map((o) => {
                    const score = allScores[s.id][o.id];
                    const isTop = rankings[s.id][0] === o.id;
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
                {investmentOptions.map((o) => {
                  const score = globalScores[o.id];
                  const isWinner = globalWinnerId === o.id;
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
        <p className="text-xs text-gray-400 mt-2">
          Azul = preferencia del stakeholder · Amarillo = ganador global
        </p>
      </section>

      {/* Rankings */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Rankings por stakeholder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeholders.map((s) => (
            <div key={s.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">
                {s.name}{' '}
                <span className="text-xs text-gray-400 font-normal">({s.role})</span>
              </h3>
              <ol className="space-y-1">
                {rankings[s.id].map((optionId, rank) => (
                  <li key={optionId} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        rank === 0
                          ? 'bg-blue-500 text-white'
                          : rank === 1
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {rank + 1}
                    </span>
                    <span className="font-mono text-xs text-gray-400">{optionId}</span>
                    <span>{optionName[optionId]}</span>
                    <span className="ml-auto font-mono text-xs text-gray-500">
                      {allScores[s.id][optionId].toFixed(3)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Global Scores */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Scores globales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {investmentOptions
            .slice()
            .sort((a, b) => globalScores[b.id] - globalScores[a.id])
            .map((o, rank) => (
              <div
                key={o.id}
                className={`p-4 rounded-lg border text-center ${
                  o.id === globalWinnerId
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                {o.id === globalWinnerId && <div className="text-2xl mb-1">🏆</div>}
                <div className="font-mono text-xs text-gray-400 mb-1">{o.id}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {globalScores[o.id].toFixed(3)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{o.name}</div>
                <div className="text-xs text-gray-400">Coste: {(o.cost / 1000).toFixed(0)}k€</div>
                {rank === 0 && (
                  <div className="mt-2 text-xs font-semibold text-yellow-700">GANADOR GLOBAL</div>
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
