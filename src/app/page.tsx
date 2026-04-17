export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Convergia</h1>
      <p className="text-lg text-gray-600 mb-8">Simulador de decisiones multi-stakeholder</p>
      <a href="/debug" className="text-blue-600 hover:underline">→ Motor de verificación (debug)</a>
    </main>
  );
}
