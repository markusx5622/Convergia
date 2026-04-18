/**
 * LLM Enrichment orchestrator.
 *
 * This module coordinates calls to the LLM client and maps responses
 * into the LLMEnrichment structure consumed by UI components.
 *
 * Principles:
 * - All inputs are pre-computed by the deterministic engine
 * - The LLM only generates prose, never results
 * - If any call fails, the enrichment falls back to empty (deterministic UX continues)
 * - Each enrichment type is independent — partial failures are tolerated
 */

import type { LLMConfig, LLMEnrichment, EnrichmentInput, EnrichedArgument, EnrichedRoundNarrative } from './types';
import { emptyEnrichment } from './types';
import { chatCompletion } from './client';
import {
  buildStakeholderArgumentsPrompt,
  buildRoundObjectionsPrompt,
  buildConcessionTextsPrompt,
  buildExecutiveSummaryPrompt,
} from './prompts';

// ---------------------------------------------------------------------------
// JSON parsing helper
// ---------------------------------------------------------------------------

function tryParseJsonArray<T>(raw: string): T[] {
  try {
    // Try to extract JSON array from response (LLMs sometimes wrap in markdown)
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed: unknown = JSON.parse(match[0]);
    if (Array.isArray(parsed)) return parsed as T[];
    return [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Build enrichment input from simulation data
// ---------------------------------------------------------------------------

import type { SimulationResult, Stakeholder, InvestmentOption } from '@/engine/types';
import { buildRoundNarrative } from '@/engine/narrative';

export function buildEnrichmentInput(
  simulation: SimulationResult,
  stakeholders: Stakeholder[],
  options: InvestmentOption[],
): EnrichmentInput {
  const optionNames: Record<string, string> = {};
  for (const o of options) optionNames[o.id] = o.name;

  const stakeholderNames: Record<string, string> = {};
  for (const s of stakeholders) stakeholderNames[s.id] = s.name;

  const roundSummaries = simulation.rounds.map((r, i) => {
    const narrative = buildRoundNarrative(
      r,
      i,
      simulation.rounds,
      stakeholders,
      optionNames,
      stakeholderNames,
    );
    return { round: r.round, deterministicText: narrative.text };
  });

  const allConcessions = simulation.rounds.flatMap((r) =>
    r.concessions.map((c) => ({
      round: r.round,
      stakeholderName: stakeholderNames[c.stakeholderId] ?? c.stakeholderId,
      stakeholderId: c.stakeholderId,
      fromOption: optionNames[c.fromOptionId] ?? c.fromOptionId,
      toOption: optionNames[c.toOptionId] ?? c.toOptionId,
    })),
  );

  const vetoes = (simulation.rounds[0]?.vetoes ?? []).map((v) => ({
    stakeholderName: stakeholderNames[v.stakeholderId] ?? v.stakeholderId,
    optionName: optionNames[v.optionId] ?? v.optionId,
    reason: v.redLineDescription,
  }));

  return {
    scenarioName: simulation.scenario.name,
    companyName: simulation.scenario.company,
    scenarioDescription: simulation.scenario.description,
    stakeholders: stakeholders.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      mission: s.mission,
      topPriorities: s.priorities,
      style: s.style,
    })),
    options: options.map((o) => ({
      id: o.id,
      name: o.name,
      description: o.description,
    })),
    winnerName: simulation.finalOption?.name ?? 'Sin ganador',
    winnerId: simulation.finalOption?.id ?? '',
    consensusStatus: simulation.consensusStatus,
    concessions: allConcessions,
    vetoes,
    roundSummaries,
    deterministicHeadline: simulation.explanation,
    deterministicExplanation: simulation.explanation,
  };
}

// ---------------------------------------------------------------------------
// Main enrichment function
// ---------------------------------------------------------------------------

/**
 * Generate LLM enrichments for a simulation.
 *
 * Runs up to 4 parallel API calls. If any call fails,
 * that section falls back to empty and the rest continues.
 *
 * @returns LLMEnrichment with source='ai' if at least one call succeeded
 */
export async function generateEnrichment(
  config: LLMConfig,
  input: EnrichmentInput,
  signal?: AbortSignal,
): Promise<LLMEnrichment> {
  if (!config.apiKey) {
    return { ...emptyEnrichment(), error: 'No API key configured.' };
  }

  const errors: string[] = [];
  let anySuccess = false;

  // Run all calls in parallel for speed
  const [argsResult, objectionsResult, concessionsResult, summaryResult] =
    await Promise.all([
      chatCompletion(config, buildStakeholderArgumentsPrompt(input), signal),
      chatCompletion(config, buildRoundObjectionsPrompt(input), signal),
      input.concessions.length > 0
        ? chatCompletion(config, buildConcessionTextsPrompt(input), signal)
        : Promise.resolve(null),
      chatCompletion(config, buildExecutiveSummaryPrompt(input), signal),
    ]);

  // Parse stakeholder arguments
  let stakeholderArguments: EnrichedArgument[] = [];
  if (argsResult.ok) {
    anySuccess = true;
    const parsed = tryParseJsonArray<{ stakeholderId: string; text: string }>(
      argsResult.content,
    );
    stakeholderArguments = parsed.map((p) => ({
      stakeholderId: p.stakeholderId,
      optionId: input.winnerId,
      type: 'support' as const,
      text: p.text,
    }));
  } else {
    errors.push(`Argumentos: ${argsResult.error}`);
  }

  // Parse round objections
  let roundObjections: EnrichedArgument[] = [];
  if (objectionsResult.ok) {
    anySuccess = true;
    const parsed = tryParseJsonArray<{
      stakeholderId: string;
      round: number;
      text: string;
    }>(objectionsResult.content);
    roundObjections = parsed.map((p) => ({
      stakeholderId: p.stakeholderId,
      optionId: input.winnerId,
      type: 'objection' as const,
      text: p.text,
    }));
  } else {
    errors.push(`Objeciones: ${objectionsResult.error}`);
  }

  // Parse concession texts
  let concessionTexts: EnrichedArgument[] = [];
  if (concessionsResult !== null) {
    if (concessionsResult.ok) {
      anySuccess = true;
      const parsed = tryParseJsonArray<{
        stakeholderId: string;
        round: number;
        text: string;
      }>(concessionsResult.content);
      concessionTexts = parsed.map((p) => ({
        stakeholderId: p.stakeholderId,
        optionId: input.winnerId,
        type: 'concession' as const,
        text: p.text,
      }));
    } else {
      errors.push(`Concesiones: ${concessionsResult.error}`);
    }
  }

  // Parse executive summary
  let executiveSummary = '';
  if (summaryResult.ok) {
    anySuccess = true;
    executiveSummary = summaryResult.content;
  } else {
    errors.push(`Resumen: ${summaryResult.error}`);
  }

  // Build round narratives from a combination (we don't make a separate call per round)
  const roundNarratives: EnrichedRoundNarrative[] = [];

  return {
    stakeholderArguments,
    roundObjections,
    concessionTexts,
    executiveSummary,
    roundNarratives,
    source: anySuccess ? 'ai' : 'fallback',
    error: errors.length > 0 ? errors.join(' | ') : undefined,
  };
}
