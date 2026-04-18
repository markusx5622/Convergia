/**
 * PharmaQuality S.A. — Planta con problema grave de calidad.
 *
 * Empresa farmacéutica que ha recibido una warning letter de la FDA.
 * Todos los stakeholders están bajo presión regulatoria, pero difieren
 * en cómo abordar el problema.
 */
import type { Scenario, Stakeholder, InvestmentOption } from '@/engine/types';

export const scenario: Scenario = {
  id: 'pharmaquality-2024',
  name: 'Crisis de calidad PharmaQuality S.A.',
  company: 'PharmaQuality S.A.',
  description:
    'Planta farmacéutica (320 empleados) que produce genéricos inyectables. Facturación: 45M€/año. Ha recibido una Warning Letter de la FDA tras inspección — defectos de integridad de datos y contaminación cruzada. Tiene 6 meses para responder con acciones correctivas verificables. Presupuesto extraordinario aprobado por el consejo.',
  budget: 300000,
  kpis: [
    { name: 'Desviaciones críticas', current: 12, unit: '/año' },
    { name: 'OOS (fuera de spec)', current: 4.8, unit: '%' },
    { name: 'Integridad de datos', current: 62, unit: '% compliance' },
    { name: 'Tasa de rechazo de lotes', current: 8, unit: '%' },
    { name: 'Tiempo de liberación', current: 28, unit: 'días' },
    { name: 'Coste de no-calidad', current: 1200000, unit: '€/año' },
  ],
};

export const stakeholders: Stakeholder[] = [
  {
    id: 'production',
    name: 'Producción',
    role: 'Director de Producción',
    mission: 'Mantener suministro al mercado, minimizar lotes rechazados, cumplir planificación',
    objectives: [
      'Tasa de rechazo < 2%',
      'Cumplimiento de plan > 90%',
      'Reducir tiempo de cambio de formato',
    ],
    priorities: [
      'Continuidad de suministro',
      'Reducción de rechazos',
      'Eficiencia de línea',
    ],
    weights: {
      productionEfficiency: 0.30,
      qualityImprovement: 0.20,
      financialReturn: 0.10,
      environmentalImpact: 0.03,
      implementationRisk: 0.17,
      operationalResilience: 0.20,
    },
    redLines: [
      {
        variable: 'productionEfficiency',
        operator: 'lt',
        threshold: 0.10,
        description: 'No acepta inversión que no mejore producción — los lotes rechazados paralizan el suministro',
      },
    ],
    concessionThreshold: 0.08,
    concessionRate: 0.14,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Pragmático, urgente. "Cada lote que rechazamos es suministro que no llega al paciente."',
      concession:
        'Cede fácilmente si la inversión en calidad también reduce rechazos de producción.',
    },
  },
  {
    id: 'quality',
    name: 'Calidad / Asuntos Regulatorios',
    role: 'Director de Calidad y Regulatory Affairs',
    mission: 'Resolver la Warning Letter de FDA, restaurar compliance, evitar sanctions escalation',
    objectives: [
      'Cerrar Warning Letter en 6 meses',
      'Data Integrity compliance > 95%',
      'Desviaciones críticas = 0',
    ],
    priorities: [
      'Compliance FDA/EMA',
      'Integridad de datos',
      'Sistema de calidad robusto',
    ],
    weights: {
      productionEfficiency: 0.05,
      qualityImprovement: 0.45,
      financialReturn: 0.03,
      environmentalImpact: 0.02,
      implementationRisk: 0.15,
      operationalResilience: 0.30,
    },
    redLines: [
      {
        variable: 'qualityImprovement',
        operator: 'lt',
        threshold: 0.15,
        description: 'Rechaza cualquier inversión que no aborde directamente la crisis de calidad',
      },
      {
        variable: 'operationalResilience',
        operator: 'lt',
        threshold: 0.10,
        description: 'No acepta soluciones frágiles que no sobrevivan una re-inspección',
      },
    ],
    concessionThreshold: 0.06,
    concessionRate: 0.08,
    acceptabilityThreshold: 0.35,
    style: {
      argumentative:
        'Inflexible en compliance, basado en regulación. "La FDA no acepta excusas, solo evidencia."',
      concession:
        'Solo cede si la alternativa también mejora compliance de forma demostrable.',
    },
  },
  {
    id: 'finance',
    name: 'Finanzas',
    role: 'Director Financiero',
    mission: 'Controlar el coste de la crisis, proteger margen, justificar inversión ante el consejo',
    objectives: [
      'Reducir coste de no-calidad 60%',
      'Payback < 24 meses',
      'Proteger rating crediticio',
    ],
    priorities: [
      'Reducción de coste de no-calidad',
      'Retorno medible',
      'Evitar sanctions financieras',
    ],
    weights: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.15,
      financialReturn: 0.35,
      environmentalImpact: 0.02,
      implementationRisk: 0.18,
      operationalResilience: 0.20,
    },
    redLines: [
      {
        variable: 'financialReturn',
        operator: 'lt',
        threshold: 0.12,
        description: 'No acepta inversión sin retorno demostrable — el consejo exige justificación',
      },
    ],
    concessionThreshold: 0.10,
    concessionRate: 0.12,
    acceptabilityThreshold: 0.32,
    style: {
      argumentative:
        'Pragmático, orientado a coste total. "Cada lote rechazado nos cuesta 15k€."',
      concession:
        'Cede si la inversión en calidad tiene impacto financiero cuantificable por reducción de rechazos.',
    },
  },
  {
    id: 'sustainability',
    name: 'Dirección General',
    role: 'CEO',
    mission: 'Proteger reputación, mantener licencias de fabricación, visión estratégica',
    objectives: [
      'Resolver crisis FDA sin perder licencias',
      'Mantener contratos con clientes clave',
      'Posicionar empresa para crecimiento post-crisis',
    ],
    priorities: [
      'Gestión de riesgo reputacional',
      'Resiliencia organizacional',
      'Visión a medio plazo',
    ],
    weights: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.20,
      financialReturn: 0.15,
      environmentalImpact: 0.05,
      implementationRisk: 0.15,
      operationalResilience: 0.35,
    },
    redLines: [
      {
        variable: 'operationalResilience',
        operator: 'lt',
        threshold: 0.15,
        description: 'Rechaza soluciones que no construyan resiliencia a largo plazo',
      },
    ],
    concessionThreshold: 0.12,
    concessionRate: 0.15,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Estratégico, orientado al riesgo global. "Si perdemos la licencia de FDA, perdemos el 40% de facturación."',
      concession:
        'Cede hacia cualquier opción que minimice riesgo sistémico para la empresa.',
    },
  },
];

export const options: InvestmentOption[] = [
  {
    id: 'option-a',
    name: 'Digitalización de datos (Data Integrity)',
    cost: 250000,
    description:
      'Migración completa a registros electrónicos con audit trail, firmas electrónicas 21 CFR Part 11 y eliminación de registros en papel.',
    impacts: {
      productionEfficiency: 0.15,
      qualityImprovement: 0.88,
      financialReturn: 0.30,
      environmentalImpact: 0.10,
      implementationRisk: 0.35,
      operationalResilience: 0.80,
    },
    risks: ['Complejidad de migración de datos históricos', 'Resistencia al cambio del personal'],
    favors: ['quality'],
    tensionWith: ['finance', 'production'],
  },
  {
    id: 'option-b',
    name: 'Monitorización ambiental continua',
    cost: 180000,
    description:
      'Red de sensores IoT para monitorización continua de partículas, presión diferencial, temperatura y humedad en todas las salas limpias.',
    impacts: {
      productionEfficiency: 0.20,
      qualityImprovement: 0.70,
      financialReturn: 0.45,
      environmentalImpact: 0.08,
      implementationRisk: 0.55,
      operationalResilience: 0.65,
    },
    risks: ['Calibración y mantenimiento continuo', 'Integración con SCADA existente'],
    favors: ['quality', 'production'],
    tensionWith: ['finance'],
  },
  {
    id: 'option-c',
    name: 'Rediseño de líneas de contención',
    cost: 280000,
    description:
      'Separación física de líneas, instalación de sistemas de contención aisladores y mejora de flujos de materiales para eliminar contaminación cruzada.',
    impacts: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.80,
      financialReturn: 0.20,
      environmentalImpact: 0.15,
      implementationRisk: 0.25,
      operationalResilience: 0.70,
    },
    risks: ['Parada de producción 4-6 semanas', 'Coste cercano al límite de presupuesto'],
    favors: ['quality', 'sustainability'],
    tensionWith: ['finance', 'production'],
  },
  {
    id: 'option-d',
    name: 'Programa de excelencia en calidad',
    cost: 120000,
    description:
      'Programa intensivo de formación GMP, revisión de SOPs, cultura de calidad y sistema de gestión del conocimiento para todo el personal.',
    impacts: {
      productionEfficiency: 0.25,
      qualityImprovement: 0.50,
      financialReturn: 0.40,
      environmentalImpact: 0.05,
      implementationRisk: 0.75,
      operationalResilience: 0.55,
    },
    risks: ['Resultados dependen del compromiso del personal', 'Difícil de demostrar ante FDA como CAPA'],
    favors: ['production', 'finance'],
    tensionWith: ['quality'],
  },
  {
    id: 'option-e',
    name: 'Automatización de análisis QC',
    cost: 200000,
    description:
      'Laboratorio automatizado con robótica para preparación de muestras, HPLC/GC automatizados y LIMS integrado para reducir tiempo de liberación.',
    impacts: {
      productionEfficiency: 0.35,
      qualityImprovement: 0.65,
      financialReturn: 0.55,
      environmentalImpact: 0.12,
      implementationRisk: 0.40,
      operationalResilience: 0.72,
    },
    risks: ['Validación de métodos analíticos automatizados', 'Coste de mantenimiento de equipos'],
    favors: ['quality', 'finance'],
    tensionWith: ['production'],
  },
];
