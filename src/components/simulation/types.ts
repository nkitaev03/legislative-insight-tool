
import { LegislationItem, NewsItem } from '../monitoring/types';

export type RiskCategory = 'financial' | 'operational' | 'legal' | 'strategic' | 'reputational';

export type RiskData = LegislationItem | NewsItem | {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  source: string;
  sourceUrl: string;
  risk: 'low' | 'medium' | 'high';
  isNew: boolean;
  responsible: string;
  risks: string[];
  recommendations: { text: string; responsible: string; status: 'pending' | 'completed' }[];
  financialImpact: { min: number; max: number; expected: number };
  riskCategory: RiskCategory;
};

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
  riskCategory: RiskCategory;
}
