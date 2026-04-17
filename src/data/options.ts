import { InvestmentOption } from '@/engine/types';

export const investmentOptions: InvestmentOption[] = [
  {
    id: 'option-a',
    name: 'Automatización parcial de línea',
    cost: 95000,
    description:
      'Automatización de la sección de ensamblaje con robots colaborativos y sistema de alimentación automática.',
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
      'Instalación de cámaras de inspección con IA para detección automática de defectos en línea.',
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
      'Actualización de motores, variadores de frecuencia y sistema de recuperación de calor.',
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
      'Red de sensores IoT con plataforma de análisis predictivo para anticipar fallos de maquinaria.',
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
      'Programa intensivo de formación en lean manufacturing, kaizen y mejora continua para mandos intermedios y operarios.',
    impacts: {
      productionEfficiency: 0.35,
      qualityImprovement: 0.30,
      financialReturn: 0.35,
      environmentalImpact: 0.15,
      implementationRisk: 0.85,
      operationalResilience: 0.30,
    },
    risks: ['Resultados lentos y difíciles de medir'],
    favors: ['all'],
    tensionWith: ['finance'],
  },
];
