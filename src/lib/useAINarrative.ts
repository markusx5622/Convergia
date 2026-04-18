'use client';

import { useState, useCallback, useRef } from 'react';
import type { LLMConfig, LLMEnrichment } from '@/services/llm/types';
import { emptyEnrichment } from '@/services/llm/types';
import type { SimulationResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { buildEnrichmentInput, generateEnrichment } from '@/services/llm/enrichment';

interface UseAINarrativeReturn {
  /** Whether AI narrative mode is enabled */
  aiEnabled: boolean;
  /** Toggle AI mode on/off */
  setAiEnabled: (enabled: boolean) => void;
  /** Current LLM configuration (null if not configured) */
  config: LLMConfig | null;
  /** Update LLM configuration */
  setConfig: (config: LLMConfig | null) => void;
  /** Current enrichment data */
  enrichment: LLMEnrichment;
  /** Whether an enrichment request is in progress */
  loading: boolean;
  /** Error message from the last enrichment attempt */
  error: string | undefined;
  /** Trigger enrichment generation */
  generate: (
    simulation: SimulationResult,
    stakeholders: Stakeholder[],
    options: InvestmentOption[],
  ) => void;
  /** Cancel any in-progress enrichment */
  cancel: () => void;
}

/**
 * Hook that manages the entire lifecycle of optional AI narrative enrichment.
 *
 * - Stores config only in React state (ephemeral)
 * - Handles loading/error/cancel states
 * - Always returns a valid enrichment object (empty if AI is off or failed)
 */
export function useAINarrative(): UseAINarrativeReturn {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [config, setConfig] = useState<LLMConfig | null>(null);
  const [enrichment, setEnrichment] = useState<LLMEnrichment>(emptyEnrichment());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const generate = useCallback(
    (
      simulation: SimulationResult,
      stakeholders: Stakeholder[],
      options: InvestmentOption[],
    ) => {
      if (!config?.apiKey) {
        setError('Configura una API key primero.');
        return;
      }

      // Cancel any previous request
      cancel();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(undefined);

      const input = buildEnrichmentInput(simulation, stakeholders, options);

      generateEnrichment(config, input, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) {
            setEnrichment(result);
            setError(result.error);
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (!controller.signal.aborted) {
            console.error('[Convergia AI] Enrichment failed:', err);
            setEnrichment(emptyEnrichment());
            setError('Error inesperado al generar narrativa IA.');
            setLoading(false);
          }
        });
    },
    [config, cancel],
  );

  // When AI is disabled, return empty enrichment
  const effectiveEnrichment = aiEnabled ? enrichment : emptyEnrichment();

  return {
    aiEnabled,
    setAiEnabled: (enabled: boolean) => {
      setAiEnabled(enabled);
      if (!enabled) {
        cancel();
        setEnrichment(emptyEnrichment());
        setError(undefined);
        setLoading(false);
      }
    },
    config,
    setConfig,
    enrichment: effectiveEnrichment,
    loading,
    error: aiEnabled ? error : undefined,
    generate,
    cancel,
  };
}
