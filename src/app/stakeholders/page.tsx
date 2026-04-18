import { PageShell } from '@/components/PageShell';
import { StakeholderCard } from '@/components/StakeholderCard';
import { WeightsBar } from '@/components/WeightsBar';
import { stakeholders } from '@/data/stakeholders';
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';
import type { VariableId } from '@/engine/types';
import Link from 'next/link';

export default function StakeholdersPage() {
  return (
    <PageShell
      title="Stakeholders"
      subtitle="Los 4 decisores clave de MetalWorks S.A. y sus prioridades"
    >
      {/* Stakeholder Cards */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stakeholders.map((s) => (
            <StakeholderCard key={s.id} stakeholder={s} />
          ))}
        </div>
      </section>

      {/* Comparative Weights View */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Comparativa de pesos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Variable
                </th>
                {stakeholders.map((s) => (
                  <th key={s.id} className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {VARIABLE_IDS.map((v) => {
                const maxWeight = Math.max(...stakeholders.map((s) => s.weights[v]));
                return (
                  <tr key={v} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">{VARIABLE_LABELS[v]}</td>
                    {stakeholders.map((s) => {
                      const w = s.weights[v];
                      const isMax = w === maxWeight && w > 0;
                      return (
                        <td key={s.id} className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-mono text-sm ${isMax ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                              {(w * 100).toFixed(0)}%
                            </span>
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isMax ? 'bg-gray-900' : 'bg-gray-400'}`}
                                style={{ width: `${(w / 0.5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Thresholds comparison */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Parámetros de negociación</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Parámetro
                </th>
                {stakeholders.map((s) => (
                  <th key={s.id} className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Umbral de concesión</td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-gray-600">
                    {s.concessionThreshold}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Tasa de concesión</td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-gray-600">
                    {(s.concessionRate * 100).toFixed(0)}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Umbral de aceptabilidad</td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-gray-600">
                    {s.acceptabilityThreshold}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Líneas rojas</td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center text-gray-600">
                    <span className="font-mono">{s.redLines.length}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <Link
          href="/debate"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Iniciar debate →
        </Link>
      </div>
    </PageShell>
  );
}
