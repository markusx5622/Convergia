import { PageShell } from '@/components/PageShell';
import { StakeholderCard } from '@/components/StakeholderCard';
import { getBundle } from '@/data/scenarios';
import { VARIABLE_IDS, VARIABLE_LABELS } from '@/engine/types';
import Link from 'next/link';

export default async function DemoStakeholdersPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const bundle = getBundle(scenarioId)!;
  const { stakeholders, scenario } = bundle;

  return (
    <PageShell
      title="Stakeholders"
      subtitle={`Los ${stakeholders.length} decisores clave de ${scenario.company}, sus prioridades y las reglas con las que negocian`}
      currentStep={2}
      scenarioId={scenarioId}
      scenarioLabel={bundle.label}
    >
      {/* Stakeholder Cards */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-bold text-slate-900">Perfiles de decisores</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {stakeholders.length} stakeholders
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stakeholders.map((s) => (
            <StakeholderCard key={s.id} stakeholder={s} />
          ))}
        </div>
      </section>

      {/* Comparative Weights View */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-bold text-slate-900">Comparativa de pesos</h2>
          <span className="text-xs text-slate-400">Cómo valora cada stakeholder las 6 variables</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Variable
                </th>
                {stakeholders.map((s) => (
                  <th key={s.id} className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VARIABLE_IDS.map((v) => {
                const maxWeight = Math.max(...stakeholders.map((s) => s.weights[v]));
                return (
                  <tr key={v} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700 text-sm">{VARIABLE_LABELS[v]}</td>
                    {stakeholders.map((s) => {
                      const w = s.weights[v];
                      const isMax = w === maxWeight && w > 0;
                      return (
                        <td key={s.id} className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`font-mono text-sm ${isMax ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                              {(w * 100).toFixed(0)}%
                            </span>
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isMax ? 'bg-slate-900' : 'bg-slate-300'}`}
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
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-slate-900">Parámetros de negociación</h2>
          <span className="text-xs text-slate-400">Reglas que rigen las concesiones y la aceptación</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Parámetro
                </th>
                {stakeholders.map((s) => (
                  <th key={s.id} className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  <div>Umbral de concesión</div>
                  <p className="text-xs text-slate-400 font-normal">Diferencia mínima para considerar ceder</p>
                </td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-slate-600">
                    {s.concessionThreshold}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  <div>Tasa de concesión</div>
                  <p className="text-xs text-slate-400 font-normal">Cuánto ajusta sus pesos al ceder</p>
                </td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-slate-600">
                    {(s.concessionRate * 100).toFixed(0)}%
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  <div>Umbral de aceptabilidad</div>
                  <p className="text-xs text-slate-400 font-normal">Score mínimo para aceptar una opción</p>
                </td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center font-mono text-slate-600">
                    {s.acceptabilityThreshold}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  <div>Líneas rojas</div>
                  <p className="text-xs text-slate-400 font-normal">Restricciones no negociables</p>
                </td>
                {stakeholders.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-center">
                    {s.redLines.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                        🚫 {s.redLines.length}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Ninguna</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href={`/demo/${scenarioId}/scenario`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        >
          ← Escenario
        </Link>
        <Link
          href={`/demo/${scenarioId}/debate`}
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-base font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
        >
          Iniciar debate →
        </Link>
      </div>
    </PageShell>
  );
}
