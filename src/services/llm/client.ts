/**
 * Minimal fetch-based client for OpenAI-compatible chat completion APIs.
 *
 * Design choices:
 * - Zero dependencies (uses native fetch)
 * - AbortController support for cancellation
 * - Structured error handling with graceful fallback
 * - Never throws — always returns a result or error string
 */

import type { LLMConfig } from './types';
import { SYSTEM_PROMPT } from './prompts';

export interface ChatCompletionResult {
  ok: true;
  content: string;
}

export interface ChatCompletionError {
  ok: false;
  error: string;
}

export type ChatCompletionResponse = ChatCompletionResult | ChatCompletionError;

/**
 * Send a single chat completion request to an OpenAI-compatible API.
 *
 * @param config  LLM configuration (url, key, model, etc.)
 * @param prompt  The user prompt (system prompt is prepended automatically)
 * @param signal  Optional AbortSignal for cancellation
 */
export async function chatCompletion(
  config: LLMConfig,
  prompt: string,
  signal?: AbortSignal,
): Promise<ChatCompletionResponse> {
  if (!config.apiKey) {
    return { ok: false, error: 'No se proporcionó API key.' };
  }

  if (!prompt.trim()) {
    return { ok: false, error: 'Prompt vacío.' };
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      return {
        ok: false,
        error: `API error ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }

    const data: unknown = await response.json();

    // Type-safe extraction from OpenAI response shape
    if (
      typeof data === 'object' &&
      data !== null &&
      'choices' in data &&
      Array.isArray((data as Record<string, unknown>).choices)
    ) {
      const choices = (data as { choices: unknown[] }).choices;
      if (choices.length > 0) {
        const first = choices[0] as Record<string, unknown>;
        if (
          typeof first.message === 'object' &&
          first.message !== null &&
          'content' in (first.message as Record<string, unknown>)
        ) {
          const content = (first.message as { content: unknown }).content;
          if (typeof content === 'string') {
            return { ok: true, content: content.trim() };
          }
        }
      }
    }

    return { ok: false, error: 'Respuesta inesperada de la API.' };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'Solicitud cancelada.' };
    }
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return { ok: false, error: `Error de red: ${message}` };
  }
}
