/**
 * EnergyChem S.L. — Empresa intensiva en energía.
 *
 * Planta química de proceso continuo con altísimo consumo energético.
 * La presión regulatoria ESG y los precios de energía crean tensión
 * entre producción, costes y sostenibilidad.
 */
import type { Scenario, Stakeholder, InvestmentOption } from '@/engine/types';

export const scenario: Scenario = {
  id: 'energychem-2024',
  name: 'Transformación energética EnergyChem S.L.',
  company: 'EnergyChem S.L.',
  description:
    'Planta química de proceso continuo (180 empleados) que produce resinas y polímeros técnicos. Facturación: 25M€/año. Consumo energético extremo (gas + electricidad) que representa el 38% del coste operativo. Presión regulatoria CSRD/EU Taxonomy. Presupuesto para UNA inversión estratégica.',
  budget: 200000,
  kpis: [
    { name: 'Consumo energético total', current: 1850, unit: 'MWh/año' },
    { name: 'Coste energético', current: 720000, unit: '€/año' },
    { name: 'Emisiones CO₂', current: 950, unit: 'ton/año' },
    { name: 'Uptime de planta', current: 91, unit: '%' },
    { name: 'Margen operativo', current: 12, unit: '%' },
    { name: 'Cumplimiento ESG', current: 45, unit: '% audit' },
  ],
};

export const stakeholders: Stakeholder[] = [
  {
    id: 'production',
    name: 'Operaciones',
    role: 'Director de Operaciones',
    mission: 'Mantener proceso continuo estable, maximizar uptime, evitar paradas',
    objectives: [
      'Uptime > 95%',
      'Cero paradas no planificadas',
      'Rendimiento de proceso > 92%',
    ],
    priorities: [
      'Estabilidad del proceso',
      'Disponibilidad de planta',
      'Control de variables críticas',
    ],
    weights: {
      productionEfficiency: 0.30,
      qualityImprovement: 0.10,
      financialReturn: 0.10,
      environmentalImpact: 0.05,
      implementationRisk: 0.25,
      operationalResilience: 0.20,
    },
    redLines: [
      {
        variable: 'implementationRisk',
        operator: 'lt',
        threshold: 0.15,
        description: 'No acepta inversión que ponga en riesgo la continuidad del proceso',
      },
      {
        variable: 'productionEfficiency',
        operator: 'lt',
        threshold: 0.08,
        description: 'Rechaza proyectos sin mejora operativa tangible',
      },
    ],
    concessionThreshold: 0.10,
    concessionRate: 0.12,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Cauteloso, enfocado en riesgo. "Si paramos el reactor, perdemos un turno completo."',
      concession:
        'Cede si se garantiza que la implementación no afecta al proceso continuo.',
    },
  },
  {
    id: 'quality',
    name: 'Ingeniería de Proceso',
    role: 'Jefe de Ingeniería',
    mission: 'Optimizar rendimiento de proceso, reducir variabilidad, innovar',
    objectives: [
      'Rendimiento de reacción > 94%',
      'Variabilidad < 2%',
      'Nuevos grados de producto',
    ],
    priorities: [
      'Control de proceso avanzado',
      'Reducción de variabilidad',
      'Innovación técnica',
    ],
    weights: {
      productionEfficiency: 0.15,
      qualityImprovement: 0.30,
      financialReturn: 0.05,
      environmentalImpact: 0.10,
      implementationRisk: 0.15,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'qualityImprovement',
        operator: 'lt',
        threshold: 0.08,
        description: 'No apoya inversión que no mejore proceso ni calidad',
      },
    ],
    concessionThreshold: 0.10,
    concessionRate: 0.14,
    acceptabilityThreshold: 0.28,
    style: {
      argumentative:
        'Técnico, basado en datos de proceso. "Los datos de SPC muestran que…"',
      concession:
        'Acepta si la inversión incluye monitorización avanzada o mejora de control.',
    },
  },
  {
    id: 'finance',
    name: 'Finanzas',
    role: 'Director Financiero',
    mission: 'Reducir coste energético, mejorar margen, controlar inversión',
    objectives: [
      'Reducir coste energético 20%',
      'ROI > 25% a 3 años',
      'Margen operativo > 15%',
    ],
    priorities: [
      'Ahorro energético cuantificable',
      'Retorno de inversión',
      'Control de flujo de caja',
    ],
    weights: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.05,
      financialReturn: 0.40,
      environmentalImpact: 0.10,
      implementationRisk: 0.15,
      operationalResilience: 0.20,
    },
    redLines: [
      {
        variable: 'financialReturn',
        operator: 'lt',
        threshold: 0.20,
        description: 'No invierte sin retorno financiero claro y medible',
      },
    ],
    concessionThreshold: 0.12,
    concessionRate: 0.10,
    acceptabilityThreshold: 0.35,
    style: {
      argumentative:
        'Exigente, orientado a números. "¿Cuánto ahorramos en la factura eléctrica?"',
      concession:
        'Cede si el ahorro energético compensa la inversión inicial en < 3 años.',
    },
  },
  {
    id: 'sustainability',
    name: 'Medio Ambiente',
    role: 'Director de Medio Ambiente y ESG',
    mission: 'Cumplir normativa ambiental, reducir huella de carbono, lograr certificación ESG',
    objectives: [
      'CO₂ -30% en 2 años',
      'Cumplimiento CSRD > 80%',
      'Certificación ISO 14001',
    ],
    priorities: [
      'Descarbonización',
      'Cumplimiento regulatorio',
      'Reporting ESG',
    ],
    weights: {
      productionEfficiency: 0.05,
      qualityImprovement: 0.05,
      financialReturn: 0.10,
      environmentalImpact: 0.45,
      implementationRisk: 0.10,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'environmentalImpact',
        operator: 'lt',
        threshold: 0.10,
        description: 'Rechaza inversión sin impacto ambiental significativo',
      },
    ],
    concessionThreshold: 0.14,
    concessionRate: 0.16,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Urgente, regulatorio. "La CSRD entra en vigor en 18 meses y no estamos preparados."',
      concession:
        'Acepta menor impacto ambiental si se incluye plan de descarbonización a medio plazo.',
    },
  },
];

export const options: InvestmentOption[] = [
  {
    id: 'option-a',
    name: 'Cogeneración de alta eficiencia',
    cost: 190000,
    description:
      'Instalación de sistema de cogeneración gas-electricidad de última generación para autoconsumo industrial con recuperación de calor residual.',
    impacts: {
      productionEfficiency: 0.20,
      qualityImprovement: 0.08,
      financialReturn: 0.75,
      environmentalImpact: 0.55,
      implementationRisk: 0.35,
      operationalResilience: 0.60,
    },
    risks: ['Parada parcial de 2 semanas para conexión', 'Dependencia del precio del gas'],
    favors: ['finance'],
    tensionWith: ['sustainability'],
  },
  {
    id: 'option-b',
    name: 'Instalación fotovoltaica industrial',
    cost: 175000,
    description:
      'Planta solar fotovoltaica en cubierta (500kWp) con sistema de almacenamiento por baterías para autoconsumo industrial.',
    impacts: {
      productionEfficiency: 0.05,
      qualityImprovement: 0.03,
      financialReturn: 0.50,
      environmentalImpact: 0.90,
      implementationRisk: 0.70,
      operationalResilience: 0.35,
    },
    risks: ['Dependencia climatológica', 'Intermitencia de generación'],
    favors: ['sustainability'],
    tensionWith: ['production', 'finance'],
  },
  {
    id: 'option-c',
    name: 'Control avanzado de proceso (APC)',
    cost: 130000,
    description:
      'Sistema de control predictivo multivariable para optimizar consumo energético, rendimiento y estabilidad del proceso químico.',
    impacts: {
      productionEfficiency: 0.65,
      qualityImprovement: 0.70,
      financialReturn: 0.55,
      environmentalImpact: 0.35,
      implementationRisk: 0.45,
      operationalResilience: 0.75,
    },
    risks: ['Requiere modelado complejo del proceso', 'Necesita datos históricos de calidad'],
    favors: ['quality', 'production'],
    tensionWith: ['sustainability'],
  },
  {
    id: 'option-d',
    name: 'Recuperación de calor residual',
    cost: 150000,
    description:
      'Red de intercambiadores de calor y sistema ORC para aprovechar el calor residual del proceso y convertirlo en energía útil.',
    impacts: {
      productionEfficiency: 0.15,
      qualityImprovement: 0.05,
      financialReturn: 0.65,
      environmentalImpact: 0.72,
      implementationRisk: 0.50,
      operationalResilience: 0.45,
    },
    risks: ['Integración compleja con sistema térmico existente'],
    favors: ['finance', 'sustainability'],
    tensionWith: ['production'],
  },
  {
    id: 'option-e',
    name: 'Auditoría energética + ISO 50001',
    cost: 55000,
    description:
      'Programa integral de auditoría energética, implantación de sistema de gestión energética ISO 50001 y plan de eficiencia.',
    impacts: {
      productionEfficiency: 0.25,
      qualityImprovement: 0.15,
      financialReturn: 0.30,
      environmentalImpact: 0.40,
      implementationRisk: 0.80,
      operationalResilience: 0.50,
    },
    risks: ['Resultados a medio-largo plazo', 'Requiere compromiso de toda la organización'],
    favors: ['sustainability', 'quality'],
    tensionWith: ['finance'],
  },
];
