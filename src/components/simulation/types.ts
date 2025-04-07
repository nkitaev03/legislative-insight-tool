
import { LegislationItem, NewsItem } from '../monitoring/types';

export type RiskData = LegislationItem | NewsItem;

export interface SimulationResult {
  riskId: string;
  title: string;
  simulations: number[];
  mean: number;
  median: number;
  min: number;
  max: number;
  percentile90: number;
  percentile95: number;
}
