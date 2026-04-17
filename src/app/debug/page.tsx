'use client';

import { stakeholders } from '@/data/stakeholders';
import { investmentOptions } from '@/data/options';
import {
  calculateAllScores,
  calculateGlobalScores,
  rankOptionsForStakeholder,
  findGlobalWinner,
} from '@/engine/scoring';

interface VerificationCheck {
  label: string;
  expected: number;
  actual: number;
  tolerance: number;
}

function Check({ label, expected, actual, tolerance }: VerificationCheck) {
  const pass = Math.abs(actual - expected) <= tolerance;
  return (
    <tr className={pass ? 'bg-green-50' : 'bg-red-50'}>
      <td className="px-4 py-2 text-sm">{pass ? '✅' : '❌'}</td>
      <td className="px-4 py-2 text-sm font-medium">{label}</td>
      <td className="px-4 py-2 text-sm text-right font-mono">≈ {expected.toFixed(3)}</td>
      <td className="px-4 py-2 text-sm text-right font-mono">{actual.toFixed(3)}</td>
    </tr>
  );
}

export default function DebugPage() {
  const allScores = calculateAllScores(stakeholders, investmentOptions);
  const globalScores = calculateGlobalScores(stakeholders, investmentOptions);
  const globalWinnerId = findGlobalWinner(stakeholders, investmentOptions);

  const rankings: Record<string, string[]> = {};
  for (const s of stakeholders) {
    rankings[s.id] = rankOptionsForStakeholder(s, investmentOptions);
  }

  const checks: VerificationCheck[] = [
    {
      label: 'Producción prefiere option-a',
      expected: 0.550,
      actual: allScores['production']['option-a'],
      tolerance: 0.005,
    },
    {
      label: 'Calidad prefiere option-b',
      expected: 0.554,
      actual: allScores['quality']['option-b'],
      tolerance: 0.005,
    },
    {
      label: 'Finanzas prefiere option-d',
      expected: 0.664,
      actual: allScores['finance']['option-d'],
      tolerance: 0.005,
    },
    {
      label: 'Sostenibilidad prefiere option-c',
      expected: 0.517,
      actual: allScores['sustainability']['option-c'],
      tolerance: 0.005,
    },
    {
      label: 'Ganador global es option-d',
      expected: 0.526,
      actual: globalScores['option-d'],
      tolerance: 0.005,
    },
  ];

  const optionNames: Record<string, string> = {};
  for (const o of investmentOptions) {
    optionNames[o.id] = o.name;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Convergia — Debug / Verificación</h1>
          <p className="text-gray-500 mt-1">
            Validación del motor de scoring determinista (Bloque Técnico 1)
          </p>
        </div>

        {/* Score Matrix */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Matriz de puntuaciones (stakeholder × opción)
          </h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Stakeholder</th>
                  {investmentOptions.map((o) => (
                    <th key={o.id} className="px-4 py-3 text-right font-semibold">
                      <span className="block text-xs text-gray-500 font-normal">{o.id}</span>
                      {o.name}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold">Ranking (mejor → peor)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stakeholders.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <span className="block text-xs text-gray-500">{s.id}</span>
                      {s.name}
                    </td>
                    {investmentOptions.map((o) => {
                      const score = allScores[s.id][o.id];
                      const isTop = rankings[s.id][0] === o.id;
                      return (
                        <td
                          key={o.id}
                          className={`px-4 py-3 text-right font-mono ${
                            isTop ? 'font-bold text-green-700 bg-green-50' : 'text-gray-700'
                          }`}
                        >
                          {score.toFixed(3)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {rankings[s.id].map((id, idx) => (
                        <span key={id}>
                          <span className={idx === 0 ? 'font-bold text-green-700' : ''}>
                            {idx + 1}. {id}
                          </span>
                          {idx < rankings[s.id].length - 1 && ' → '}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                <tr>
                  <td className="px-4 py-3 font-bold text-blue-900">Global (media)</td>
                  {investmentOptions.map((o) => {
                    const score = globalScores[o.id];
                    const isWinner = o.id === globalWinnerId;
                    return (
                      <td
                        key={o.id}
                        className={`px-4 py-3 text-right font-mono font-bold ${
                          isWinner ? 'text-blue-700 bg-blue-100' : 'text-blue-800'
                        }`}
                      >
                        {score.toFixed(3)}
                        {isWinner && ' 🏆'}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 font-bold text-blue-900">
                    🏆 Ganador: {globalWinnerId}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Stakeholder Rankings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Rankings por stakeholder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakeholders.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{s.role}</p>
                <ol className="space-y-1">
                  {rankings[s.id].map((optId, idx) => (
                    <li
                      key={optId}
                      className={`flex justify-between text-sm ${
                        idx === 0 ? 'font-bold text-green-700' : 'text-gray-600'
                      }`}
                    >
                      <span>
                        {idx + 1}. {optId}
                      </span>
                      <span className="font-mono">{allScores[s.id][optId].toFixed(3)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Global Scores */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Puntuaciones globales (media de stakeholders)
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Opción</th>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-right font-semibold">Score global</th>
                  <th className="px-4 py-3 text-center font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investmentOptions
                  .slice()
                  .sort((a, b) => globalScores[b.id] - globalScores[a.id])
                  .map((o, idx) => {
                    const isWinner = o.id === globalWinnerId;
                    return (
                      <tr key={o.id} className={isWinner ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-3 font-mono text-gray-600">{o.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">
                          {globalScores[o.id].toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isWinner ? (
                            <span className="text-blue-700 font-bold">🏆 Ganador</span>
                          ) : (
                            <span className="text-gray-400">#{idx + 1}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verification Checks */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Verificaciones del motor (checks de la especificación)
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold w-10">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Verificación</th>
                  <th className="px-4 py-3 text-right font-semibold">Esperado</th>
                  <th className="px-4 py-3 text-right font-semibold">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {checks.map((c) => (
                  <Check key={c.label} {...c} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Tolerancia de ±0.005 por redondeo acumulado en operaciones de punto flotante.
          </p>
        </section>
      </div>
    </div>
  );
}
