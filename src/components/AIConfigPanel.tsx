'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { LLMConfig } from '@/services/llm/types';
import { DEFAULT_LLM_CONFIG } from '@/services/llm/types';

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
  const [apiKey, setApiKey] = useState(config?.apiKey ?? '');
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
    setApiKey('');
    onConfigChange(null);
  }, [onConfigChange]);

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white', className)}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">⚙️</span>
          <span className="text-sm font-semibold text-slate-700">
            Configuración IA
          </span>
          {config?.apiKey && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              Configurado
            </span>
          )}
        </div>
        <span className="text-slate-400 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Introduce tu API key de OpenAI para activar la narrativa IA.
            La clave se almacena solo en memoria del navegador y nunca se envía a nuestros servidores.
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
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                apiKey.trim()
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed',
              )}
            >
              Guardar
            </button>
            {config?.apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                Borrar clave
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400">
            🔒 La API key solo existe en la memoria de esta pestaña. Al cerrarla o recargar, se pierde.
          </p>
        </div>
      )}
    </div>
  );
}
