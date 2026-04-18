/**
 * LLM enrichment layer — barrel export.
 *
 * This module provides an OPTIONAL narrative enrichment layer
 * powered by external LLM APIs. The deterministic engine remains
 * the single source of truth for all results.
 */

export type {
  LLMConfig,
  LLMEnrichment,
  EnrichmentInput,
  EnrichedArgument,
  EnrichedRoundNarrative,
} from './types';

export { DEFAULT_LLM_CONFIG, emptyEnrichment } from './types';
export { generateEnrichment, buildEnrichmentInput } from './enrichment';
export { chatCompletion } from './client';
