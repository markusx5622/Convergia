"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  ChevronDown,
  KeyRound,
  Lock,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { LLMConfig } from "@/services/llm/types";
import { DEFAULT_LLM_CONFIG } from "@/services/llm/types";

interface AIConfigPanelProps {
  config: LLMConfig | null;
  onConfigChange: (config: LLMConfig | null) => void;
  className?: string;
}

/**
 * Collapsible panel for configuring LLM API settings.
 * The API key is stored only in component state (browser memory) — never persisted.
 */
export function AIConfigPanel({
  config,
  onConfigChange,
  className,
}: AIConfigPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [apiKey, setApiKey] = useState(config?.apiKey ?? "");
  const [model, setModel] = useState(config?.model ?? DEFAULT_LLM_CONFIG.model);

  const handleSave = useCallback(() => {
    if (!apiKey.trim()) {
      onConfigChange(null);
      return;
    }
    onConfigChange({
      ...DEFAULT_LLM_CONFIG,
      apiKey: apiKey.trim(),
      model,
    });
  }, [apiKey, model, onConfigChange]);

  const handleClear = useCallback(() => {
    setApiKey("");
    onConfigChange(null);
  }, [onConfigChange]);

  return (
    <div
      className={cn("rounded-xl border border-slate-200 bg-white", className)}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="ai-config-content"
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            Configuración IA
          </span>
          {config?.apiKey && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Configurado
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              id="ai-config-content"
              className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3"
            >
              <p className="text-xs text-slate-500 leading-relaxed flex gap-2">
                <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Introduce tu API key de OpenAI para activar la narrativa IA.
                  La clave se almacena solo en memoria del navegador y nunca se
                  envía a nuestros servidores.
                </span>
              </p>

              <div>
                <label
                  htmlFor="ai-api-key"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  API Key
                </label>
                <input
                  id="ai-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="ai-model"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Modelo
                </label>
                <select
                  id="ai-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (recomendado)</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  aria-label="Guardar clave de API de OpenAI"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                    apiKey.trim()
                      ? "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-md hover:-translate-y-px"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  )}
                >
                  Guardar
                </button>
                {config?.apiKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Borrar clave de API de OpenAI"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Borrar clave
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                La API key solo existe en la memoria de esta pestaña. Al
                cerrarla o recargar, se pierde.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
