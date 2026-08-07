import { ConvergiaLogo } from "./ConvergiaLogo";

interface PrintCoverPageProps {
  companyName: string;
  scenarioName: string;
  dateStr: string;
}

export function PrintCoverPage({
  companyName,
  scenarioName,
  dateStr,
}: PrintCoverPageProps) {
  return (
    <div className="hidden print:flex flex-col min-h-screen justify-center items-center text-center p-12 print:break-after-page relative">
      <div className="absolute top-12 left-12">
        <ConvergiaLogo size="lg" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto space-y-12">
        <div className="w-24 h-1 bg-[#c87514] mb-8" />

        <h1 className="text-6xl font-extrabold text-[#111827] tracking-tight leading-tight">
          Dossier de Simulación Estratégica
        </h1>

        <div className="w-full h-px bg-slate-200" />

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#0d6e6e]">{companyName}</h2>
          <h3 className="text-xl font-medium text-slate-500">{scenarioName}</h3>
        </div>
      </div>

      <div className="w-full flex justify-between items-end mt-auto pt-12 border-t border-slate-200">
        <div className="text-left">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
            Generado el
          </p>
          <p className="text-lg font-medium text-slate-800">{dateStr}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
            Motor de decisión
          </p>
          <p className="text-lg font-medium text-slate-800">
            Convergia Enterprise
          </p>
        </div>
      </div>
    </div>
  );
}
