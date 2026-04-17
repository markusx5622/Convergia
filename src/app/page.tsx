import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Convergia</h1>
        <p className="text-xl text-gray-600 mb-2">
          Simulador de toma de decisiones multi-stakeholder para entornos industriales.
        </p>
        <p className="text-gray-500 mb-8">
          Una plataforma que modela cómo diferentes áreas de una empresa negocian una decisión de
          inversión bajo restricciones reales.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/debug"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Debug / Verificación →
          </Link>
        </div>
      </div>
    </main>
  );
}
