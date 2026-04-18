export type VariableId =
  | 'productionEfficiency'
  | 'qualityImprovement'
  | 'financialReturn'
  | 'environmentalImpact'
  | 'implementationRisk'
  | 'operationalResilience';

export const VARIABLE_IDS: VariableId[] = [
  'productionEfficiency',
  'qualityImprovement',
  'financialReturn',
  'environmentalImpact',
  'implementationRisk',
  'operationalResilience',
];

export const VARIABLE_LABELS: Record<VariableId, string> = {
  productionEfficiency: 'Eficiencia Productiva',
  qualityImprovement: 'Mejora de Calidad',
  financialReturn: 'Retorno Financiero',
  environmentalImpact: 'Impacto Ambiental',
  implementationRisk: 'Riesgo de Implementación',
  operationalResilience: 'Resiliencia Operacional',
};

export interface KPI {
  name: string;
  current: number;
  unit: string;
}

export interface Scenario {
  id: string;
  name: string;
  company: string;
  description: string;
  budget: number;
  kpis: KPI[];
}

export interface InvestmentOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  impacts: Record<VariableId, number>;
  risks: string[];
  favors: string[];
  tensionWith: string[];
}

export interface RedLine {
  variable: VariableId;
  operator: 'lt' | 'gt';
  threshold: number;
  description: string;
}

export interface StakeholderStyle {
  argumentative: string;
  concession: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  mission: string;
  objectives: string[];
  priorities: string[];
  weights: Record<VariableId, number>;
  redLines: RedLine[];
  concessionThreshold: number;
  concessionRate: number;
  acceptabilityThreshold: number;
  style: StakeholderStyle;
}

export type ConsensusStatus = 'full' | 'partial' | 'none' | 'tie';

export interface Concession {
  stakeholderId: string;
  fromOptionId: string;
  toOptionId: string;
  gap: number;
  reason: string;
}

export interface Veto {
  stakeholderId: string;
  optionId: string;
  redLineDescription: string;
}

export interface Argument {
  stakeholderId: string;
  type: 'support' | 'objection' | 'concession';
  targetOptionId: string;
  text: string;
}

export interface RoundResult {
  round: number;
  scores: Record<string, Record<string, number>>;
  globalScores: Record<string, number>;
  rankings: Record<string, string[]>;
  concessions: Concession[];
  vetoes: Veto[];
  consensusScore: number;
  consensusStatus: ConsensusStatus;
  arguments: Argument[];
  conflictMatrix: Record<string, Record<string, number>>;
  totalConflict: number;
  eliminatedOptionIds: string[];
}

export interface SimulationResult {
  scenario: Scenario;
  rounds: RoundResult[];
  finalOption: InvestmentOption | null;
  consensusStatus: ConsensusStatus;
  finalScores: Record<string, Record<string, number>>;
  explanation: string;
}
