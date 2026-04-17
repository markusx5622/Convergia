import { Stakeholder } from '@/engine/types';

export const stakeholders: Stakeholder[] = [
  {
    id: 'production',
    name: 'Producción',
    role: 'Director de Producción',
    mission: 'Maximizar output, minimizar paradas, cumplir plazos de entrega',
    objectives: [
      'OEE > 80%',
      'Paradas no planificadas < 20h/año',
      'Cumplimiento de entregas > 98%',
    ],
    priorities: [
      'Disponibilidad de máquina',
      'Velocidad de producción',
      'Facilidad operativa',
    ],
    weights: {
      productionEfficiency: 0.35,
      qualityImprovement: 0.05,
      financialReturn: 0.10,
      environmentalImpact: 0.05,
      implementationRisk: 0.20,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'productionEfficiency',
        operator: 'lt',
        threshold: 0.10,
        description: 'No acepta inversión que no mejore producción en absoluto',
      },
      {
        variable: 'implementationRisk',
        operator: 'lt',
        threshold: 0.20,
        description: 'No acepta proyecto con riesgo extremo de parada durante instalación',
      },
    ],
    concessionThreshold: 0.12,
    concessionRate: 0.15,
    acceptabilityThreshold: 0.35,
    style: {
      argumentative:
        'Directo, pragmático, basado en datos operativos. "¿Cuántas piezas más saco con esto?"',
      concession:
        'Acepta concesiones si se garantiza mínimo impacto en disponibilidad. Pide compensaciones concretas.',
    },
  },
  {
    id: 'quality',
    name: 'Calidad',
    role: 'Director de Calidad',
    mission: 'Cero defectos al cliente, trazabilidad total, cumplimiento normativo',
    objectives: [
      'Defectos < 1%',
      'Reclamaciones cliente: 0',
      'Trazabilidad 100%',
    ],
    priorities: [
      'Reducción de defectos',
      'Trazabilidad',
      'Cumplimiento normativo',
    ],
    weights: {
      productionEfficiency: 0.05,
      qualityImprovement: 0.40,
      financialReturn: 0.05,
      environmentalImpact: 0.05,
      implementationRisk: 0.20,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'qualityImprovement',
        operator: 'lt',
        threshold: 0.05,
        description: 'No apoya inversión que ignore calidad completamente',
      },
      {
        variable: 'productionEfficiency',
        operator: 'gt',
        threshold: 0.90,
        description: 'Sospecha que velocidad extrema sacrifica calidad',
      },
    ],
    concessionThreshold: 0.08,
    concessionRate: 0.10,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Metódico, basado en estándares y normativa. "ISO 9001 exige que…"',
      concession:
        'Acepta concesiones en velocidad si se mantiene calidad. Exige garantías documentadas.',
    },
  },
  {
    id: 'finance',
    name: 'Finanzas',
    role: 'Director Financiero',
    mission: 'Maximizar ROI, controlar riesgo financiero, optimizar flujo de caja',
    objectives: [
      'ROI > 20% a 2 años',
      'Payback < 18 meses',
      'Riesgo controlado',
    ],
    priorities: [
      'ROI cuantificable',
      'Payback rápido',
      'Bajo riesgo de inversión',
    ],
    weights: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.05,
      financialReturn: 0.35,
      environmentalImpact: 0.05,
      implementationRisk: 0.20,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'financialReturn',
        operator: 'lt',
        threshold: 0.15,
        description: 'No invierte sin retorno mínimo demostrable',
      },
    ],
    concessionThreshold: 0.10,
    concessionRate: 0.12,
    acceptabilityThreshold: 0.35,
    style: {
      argumentative:
        'Analítico, escéptico, basado en números. "Muéstrame el business case."',
      concession:
        'Acepta mayor inversión si el ROI se demuestra con datos. Prefiere opciones de menor coste a igual impacto.',
    },
  },
  {
    id: 'sustainability',
    name: 'Sostenibilidad',
    role: 'Director de Sostenibilidad',
    mission:
      'Reducir huella ambiental, cumplir regulación ESG, mejorar reputación corporativa',
    objectives: [
      'CO₂ -20%',
      'Consumo energético -15%',
      'Alineación con EU Taxonomy',
    ],
    priorities: [
      'Reducción de emisiones',
      'Eficiencia energética',
      'Cumplimiento regulatorio ESG',
    ],
    weights: {
      productionEfficiency: 0.05,
      qualityImprovement: 0.05,
      financialReturn: 0.10,
      environmentalImpact: 0.40,
      implementationRisk: 0.15,
      operationalResilience: 0.25,
    },
    redLines: [
      {
        variable: 'environmentalImpact',
        operator: 'lt',
        threshold: 0.05,
        description: 'No apoya nada que ignore completamente el medio ambiente',
      },
    ],
    concessionThreshold: 0.15,
    concessionRate: 0.18,
    acceptabilityThreshold: 0.30,
    style: {
      argumentative:
        'Visionario pero con datos regulatorios. "En 2027 la CSRD nos obliga a…"',
      concession:
        'Acepta impacto ambiental menor si se compensa con plan a medio plazo. Busca compromisos híbridos.',
    },
  },
];
