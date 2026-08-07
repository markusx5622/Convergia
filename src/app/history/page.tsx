"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSavedSessions,
  deleteSession,
  SavedSession,
} from "@/lib/storage-manager";
import { ConvergiaLogo } from "@/components/ConvergiaLogo";
import {
  FileText,
  Edit2,
  Trash2,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import { saveToLocalStorage } from "@/lib/builder-persistence";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSessions(getSavedSessions());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este escenario?")) {
      deleteSession(id);
      setSessions(getSavedSessions());
    }
  };

  const handleResume = (session: SavedSession) => {
    // Guarda el estado de la sesión en el localStorage del builder actual
    saveToLocalStorage(session.state);
    // Redirige al studio para continuar editando
    router.push("/studio");
  };

  if (!mounted) return null; // Evitar hidratación mismatch

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#e1e4eb] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-extrabold text-[#111827] tracking-tight hover:opacity-80 transition-opacity duration-200"
            >
              Convergia
            </Link>
            <span className="text-[10px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200 uppercase tracking-wider">
              Mis Escenarios
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/studio"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#5b6578] hover:bg-[#f0f1f5] hover:text-[#111827] transition-all duration-200"
            >
              Nuevo Escenario
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-[#0d6e6e]" />
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Historial Local
            </h1>
            <p className="text-sm text-[#5b6578]">
              Tus escenarios guardados se almacenan de forma privada en tu
              navegador.
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No hay escenarios guardados
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Ve al Studio y empieza a configurar un nuevo escenario industrial.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] text-white rounded-lg text-sm font-bold hover:bg-[#1f2937] transition-colors shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Crear nuevo escenario
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#111827] text-lg leading-tight">
                      {session.state.scenario.name || "Sin título"}
                    </h3>
                    {session.isCompleted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completado
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#0d6e6e] mb-3">
                    {session.state.scenario.company || "Empresa no definida"}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Última modificación:{" "}
                      {new Date(session.updatedAt).toLocaleDateString()}{" "}
                      {new Date(session.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleResume(session)}
                    className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Continuar editando
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="inline-flex items-center justify-center w-10 h-10 text-red-500 rounded-lg border border-transparent hover:bg-red-50 hover:border-red-200 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
