
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetPosition = { x: number; y: number };

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'notifications' | 'riskReport' | 'complianceStatus' | 'recentChanges' | 'upcomingDeadlines';
  title: string;
  size: WidgetSize;
  position?: WidgetPosition;
  visible: boolean;
}

export interface UserDashboardPreferences {
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
}

export interface Action {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  assignedTo: string;
}

export interface RiskScenario {
  id: string;
  name: string;
  probability: number;
  impact: number;
  category: string;
  description: string;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap';
