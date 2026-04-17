import { InvestmentOption } from '@/engine/types';

export const investmentOptions: InvestmentOption[] = [
  {
    id: 'option-a',
    name: 'Automatización parcial de línea',
    cost: 95000,
    description:
      'Automatización parcial de la línea de producción principal para aumentar OEE y reducir paradas.',
    impacts: {
      productionEfficiency: 0.85,
      qualityImprovement: 0.30,
      financialReturn: 0.45,
      environmentalImpact: 0.08,
      implementationRisk: 0.25,
      operationalResilience: 0.55,
    },
    risks: ['Parada de línea 3 semanas durante instalación'],
    favors: ['production'],
    tensionWith: ['finance', 'sustainability'],
  },
  {
    id: 'option-b',
    name: 'Sistema de visión artificial QC',
    cost: 70000,
    description:
      'Sistema de control de calidad por visión artificial para detección automática de defectos.',
    impacts: {
      productionEfficiency: 0.15,
      qualityImprovement: 0.90,
      financialReturn: 0.40,
      environmentalImpact: 0.12,
      implementationRisk: 0.55,
      operationalResilience: 0.20,
    },
    risks: ['Curva de aprendizaje del personal'],
    favors: ['quality'],
    tensionWith: ['production', 'finance'],
  },
  {
    id: 'option-c',
    name: 'Retrofit energético de maquinaria',
    cost: 85000,
    description:
      'Retrofit energético de maquinaria existente para reducir consumo y emisiones.',
    impacts: {
      productionEfficiency: 0.10,
      qualityImprovement: 0.05,
      financialReturn: 0.60,
      environmentalImpact: 0.88,
      implementationRisk: 0.40,
      operationalResilience: 0.15,
    },
    risks: ['Compatibilidad con equipos legacy'],
    favors: ['sustainability'],
    tensionWith: ['production', 'quality'],
  },
  {
    id: 'option-d',
    name: 'Mantenimiento predictivo IoT',
    cost: 60000,
    description:
      'Sistema de mantenimiento predictivo basado en IoT para anticipar fallos y reducir paradas.',
    impacts: {
      productionEfficiency: 0.30,
      qualityImprovement: 0.10,
      financialReturn: 0.80,
      environmentalImpact: 0.12,
      implementationRisk: 0.65,
      operationalResilience: 0.85,
    },
    risks: ['Datos insuficientes al inicio', 'Dependencia de conectividad'],
    favors: ['finance', 'production'],
    tensionWith: ['quality'],
  },
  {
    id: 'option-e',
    name: 'Programa de formación Lean+',
    cost: 40000,
    description:
      'Programa intensivo de formación en lean manufacturing y mejora continua.',
    impacts: {
      productionEfficiency: 0.35,
      qualityImprovement: 0.30,
      financialReturn: 0.35,
      environmentalImpact: 0.15,
      implementationRisk: 0.85,
      operationalResilience: 0.30,
    },
    risks: ['Resultados lentos y difíciles de medir'],
    favors: ['production', 'quality', 'finance', 'sustainability'],
    tensionWith: ['finance'],
  },
];
