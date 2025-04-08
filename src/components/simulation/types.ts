
import { LegislationItem, NewsItem } from '../monitoring/types';

export type RiskCategory = 'financial' | 'operational' | 'legal' | 'strategic' | 'reputational';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'pending' | 'in-progress' | 'mitigated' | 'accepted';

export interface RiskResponse {
  id: string;
  title: string;
  description: string;
  responsible: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Base risk interface for backend integration
export interface BaseRisk {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  source: string;
  sourceUrl: string;
  risk: RiskSeverity;
  isNew: boolean;
  responsible: string;
  risks: string[];
  recommendations: { text: string; responsible: string; status: 'pending' | 'completed' }[];
  financialImpact: { min: number; max: number; expected: number };
  status?: RiskStatus;
  responses?: RiskResponse[];
  lastUpdated?: string;
}

// Extended risk data type that includes all possible properties
export type RiskData = (LegislationItem | NewsItem | BaseRisk) & {
  riskCategory?: RiskCategory;
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
  percentile99?: number;
  riskCategory: RiskCategory;
  scenarioName?: string;
  scenarioType?: 'base' | 'stress' | 'custom';
  createdAt?: string;
  updatedBy?: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  type: 'base' | 'stress' | 'custom';
  results: SimulationResult[];
  parameters: {
    simulationRuns: number;
    confidenceLevel: number;
    distributionType: string;
    stressTestCoefficient: number;
    includeCorrelations: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// API response types for backend integration
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface RiskAnalysisFilters {
  category?: RiskCategory[];
  severity?: RiskSeverity[];
  dateFrom?: string;
  dateTo?: string;
  responsible?: string[];
  status?: RiskStatus[];
}
