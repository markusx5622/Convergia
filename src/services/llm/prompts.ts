/**
 * Prompt builders for the LLM enrichment layer.
 *
 * Each function builds a structured prompt that:
 * 1. Clearly states the AI role (redaction only, not decision)
 * 2. Includes all relevant computed data as context
 * 3. Instructs the LLM to NOT invent new results
 *
 * All prompts use the EnrichmentInput which contains
 * only pre-computed deterministic results.
 */

import type { EnrichmentInput } from './types';

// ---------------------------------------------------------------------------
// System prompt (shared across all enrichment calls)
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `Eres un redactor técnico experto en informes de decisiones industriales.

REGLAS ABSOLUTAS:
- NUNCA inventes resultados, scores, ganadores, ni datos numéricos.
- NUNCA cambies quién ganó, quién vetó, quién cedió, ni el consenso.
- Tu ÚNICO rol es mejorar la REDACCIÓN de textos que ya existen.
- Usa un tono profesional, conciso y analítico.
- Escribe siempre en español.
- NO uses markdown, solo texto plano.
- NO uses expresiones vagas como "podría ser" o "tal vez".
- Sé específico y directo.`;

// ---------------------------------------------------------------------------
// 1. Stakeholder arguments
// ---------------------------------------------------------------------------

export function buildStakeholderArgumentsPrompt(input: EnrichmentInput): string {
  const stakeholderList = input.stakeholders
    .map(
      (s) =>
        `- ${s.name} (${s.role}): Misión: "${s.mission}". Prioridades: ${s.topPriorities.join(', ')}. Estilo: "${s.style.argumentative}"`,
    )
    .join('\n');

  const optionList = input.options
    .map((o) => `- ${o.name}: ${o.description}`)
    .join('\n');

  return `Contexto: ${input.companyName} — ${input.scenarioName}.
${input.scenarioDescription}

Opciones de inversión:
${optionList}

Ganadora (decidida por el motor determinista): "${input.winnerName}"
Consenso: ${input.consensusStatus}

Stakeholders:
${stakeholderList}

TAREA: Para cada stakeholder, redacta UN argumento breve (2-3 frases) que expresaría sobre su opción preferida o sobre la ganadora, coherente con su rol, misión y estilo argumentativo.

Formato de respuesta (JSON array):
[{"stakeholderId": "...", "text": "..."}]

IMPORTANTE: No inventes resultados. Solo redacta argumentos coherentes con los datos proporcionados.`;
}

// ---------------------------------------------------------------------------
// 2. Round objections
// ---------------------------------------------------------------------------

export function buildRoundObjectionsPrompt(input: EnrichmentInput): string {
  const concessionList =
    input.concessions.length > 0
      ? input.concessions
          .map(
            (c) =>
              `- Ronda ${c.round}: ${c.stakeholderName} cedió de "${c.fromOption}" a "${c.toOption}"`,
          )
          .join('\n')
      : '(No hubo concesiones)';

  const roundList = input.roundSummaries
    .map((r) => `- Ronda ${r.round}: ${r.deterministicText}`)
    .join('\n');

  return `Contexto: ${input.companyName} — ${input.scenarioName}.
Ganadora: "${input.winnerName}". Consenso: ${input.consensusStatus}.

Resumen de rondas:
${roundList}

Concesiones registradas:
${concessionList}

Stakeholders:
${input.stakeholders.map((s) => `- ${s.name} (${s.role}): "${s.style.argumentative}"`).join('\n')}

TAREA: Para cada stakeholder que NO tiene como primera preferencia la opción ganadora, redacta UNA objeción breve (1-2 frases) que expresaría, coherente con su estilo.

Formato (JSON array):
[{"stakeholderId": "...", "round": 1, "text": "..."}]

IMPORTANTE: Las objeciones deben ser coherentes con los datos. No inventes conflictos que no existen.`;
}

// ---------------------------------------------------------------------------
// 3. Concession texts
// ---------------------------------------------------------------------------

export function buildConcessionTextsPrompt(input: EnrichmentInput): string {
  if (input.concessions.length === 0) return '';

  const concessionList = input.concessions
    .map(
      (c) =>
        `- Ronda ${c.round}: ${c.stakeholderName} cedió de "${c.fromOption}" a "${c.toOption}"`,
    )
    .join('\n');

  const stakeholderStyles = input.stakeholders
    .map((s) => `- ${s.name}: Estilo de concesión: "${s.style.concession}"`)
    .join('\n');

  return `Contexto: ${input.companyName} — "${input.winnerName}" es la ganadora.

Concesiones realizadas (datos del motor):
${concessionList}

Estilos de concesión:
${stakeholderStyles}

TAREA: Para cada concesión, redacta una frase natural (1-2 oraciones) que exprese la concesión en primera persona del stakeholder, coherente con su estilo.

Formato (JSON array):
[{"stakeholderId": "...", "round": 1, "text": "..."}]`;
}

// ---------------------------------------------------------------------------
// 4. Executive summary
// ---------------------------------------------------------------------------

export function buildExecutiveSummaryPrompt(input: EnrichmentInput): string {
  const vetoList =
    input.vetoes.length > 0
      ? input.vetoes
          .map((v) => `- ${v.stakeholderName} vetó "${v.optionName}": ${v.reason}`)
          .join('\n')
      : '(No hubo vetos)';

  return `Contexto: ${input.companyName} — ${input.scenarioName}.
${input.scenarioDescription}

RESULTADO DEFINITIVO (calculado por motor determinista):
- Ganadora: "${input.winnerName}"
- Consenso: ${input.consensusStatus}
- Explicación del motor: "${input.deterministicExplanation}"

Vetos:
${vetoList}

Concesiones: ${input.concessions.length > 0 ? input.concessions.map((c) => `${c.stakeholderName}: ${c.fromOption} → ${c.toOption} (ronda ${c.round})`).join('; ') : 'Ninguna'}

TAREA: Redacta un resumen ejecutivo profesional (3-5 frases) que explique el resultado de la simulación. Debe sonar como un párrafo de un informe de consultoría industrial.

IMPORTANTE: NO cambies el resultado. La ganadora ES "${input.winnerName}". El consenso ES ${input.consensusStatus}. Solo mejora la redacción.

Responde solo con el texto del resumen, sin formato adicional.`;
}

// ---------------------------------------------------------------------------
// Export system prompt for client usage
// ---------------------------------------------------------------------------

export { SYSTEM_PROMPT };
