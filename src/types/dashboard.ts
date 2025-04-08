
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetPosition = { x: number; y: number };

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'notifications' | 'riskReport' | 'complianceStatus' | 'recentChanges' | 'upcomingDeadlines';
  title: string;
  size: WidgetSize;
  position?: WidgetPosition;
  visible: boolean;
  dataSource?: string; // API endpoint reference
  refreshInterval?: number; // in seconds
}

export interface UserDashboardPreferences {
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  lastSynced?: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  assignedTo: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  priority?: 'low' | 'medium' | 'high';
  linkedRiskId?: string;
}

export interface RiskScenario {
  id: string;
  name: string;
  probability: number;
  impact: number;
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: string;
  mitigationPlans?: string[];
}

export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap';

// User and organization types for backend integration
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  department?: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  createdAt: string;
  subscription: 'free' | 'basic' | 'professional' | 'enterprise';
  settings?: OrganizationSettings;
}

export interface OrganizationSettings {
  riskCategories?: string[];
  complianceFrameworks?: string[];
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  dataRetentionPeriod?: number; // in days
}

// Product and client types for user profile
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  riskProfile?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  products?: string[]; // IDs of associated products
}
