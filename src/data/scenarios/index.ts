/**
 * Scenario registry — single source of truth for all curated scenarios.
 *
 * Each ScenarioBundle contains everything needed to run the simulation:
 * scenario metadata, stakeholders and investment options.
 *
 * The engine receives these directly — no global singletons needed.
 */
import type { Scenario, Stakeholder, InvestmentOption } from '@/engine/types';
import * as metalworks from './metalworks';
import * as energychem from './energychem';
import * as pharmaquality from './pharmaquality';

export interface ScenarioBundle {
  /** Unique scenario id (matches Scenario.id) */
  id: string;
  /** Short display label for the selector */
  label: string;
  /** Icon emoji */
  icon: string;
  /** One-line tagline for the selector card */
  tagline: string;
  /** Scenario data */
  scenario: Scenario;
  /** Stakeholders for this scenario */
  stakeholders: Stakeholder[];
  /** Investment options for this scenario */
  options: InvestmentOption[];
}

export const SCENARIO_BUNDLES: ScenarioBundle[] = [
  {
    id: metalworks.scenario.id,
    label: 'MetalWorks S.A.',
    icon: '🏭',
    tagline: 'Mejora operativa en empresa industrial mediana',
    scenario: metalworks.scenario,
    stakeholders: metalworks.stakeholders,
    options: metalworks.options,
  },
  {
    id: energychem.scenario.id,
    label: 'EnergyChem S.L.',
    icon: '⚡',
    tagline: 'Transformación energética en planta de proceso continuo',
    scenario: energychem.scenario,
    stakeholders: energychem.stakeholders,
    options: energychem.options,
  },
  {
    id: pharmaquality.scenario.id,
    label: 'PharmaQuality S.A.',
    icon: '💊',
    tagline: 'Crisis de calidad farmacéutica con Warning Letter FDA',
    scenario: pharmaquality.scenario,
    stakeholders: pharmaquality.stakeholders,
    options: pharmaquality.options,
  },
];

/** Default / canonical scenario bundle */
export const DEFAULT_BUNDLE = SCENARIO_BUNDLES[0];

/** Lookup a bundle by scenario id */
export function getBundle(id: string): ScenarioBundle | undefined {
  return SCENARIO_BUNDLES.find((b) => b.id === id);
}
