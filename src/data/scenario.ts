import { Scenario } from '@/engine/types';

export const baseScenario: Scenario = {
  id: 'metalworks-2024',
  name: 'Mejora operativa MetalWorks S.A.',
  company: 'MetalWorks S.A.',
  description:
    'Empresa industrial mediana (250 empleados) que fabrica componentes metálicos de precisión para automoción. Facturación: 18M€/año. Línea de producción principal con 15 años de antigüedad. Presupuesto disponible para UNA mejora operativa este trimestre.',
  budget: 100000,
  kpis: [
    { name: 'OEE (eficiencia global)', current: 72, unit: '%' },
    { name: 'Tasa de defectos', current: 3.2, unit: '%' },
    { name: 'Consumo energético', current: 420, unit: 'MWh/año' },
    { name: 'Coste mantenimiento', current: 85000, unit: '€/año' },
    { name: 'Paradas no planificadas', current: 48, unit: 'h/año' },
    { name: 'Emisiones CO₂', current: 180, unit: 'ton/año' },
  ],
};
