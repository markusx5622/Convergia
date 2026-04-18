import { redirect } from 'next/navigation';
import { getBundle, SCENARIO_BUNDLES } from '@/data/scenarios';

/**
 * Layout for /demo/[scenarioId]/* routes.
 *
 * Validates the scenarioId against known bundles.
 * Invalid IDs redirect to the demo selection page.
 * Also exports generateStaticParams for build-time generation.
 */

export function generateStaticParams() {
  return SCENARIO_BUNDLES.map((b) => ({ scenarioId: b.id }));
}

export default async function DemoScenarioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const bundle = getBundle(scenarioId);

  if (!bundle) {
    redirect('/demo');
  }

  return <>{children}</>;
}
