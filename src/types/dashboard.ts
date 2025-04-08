
export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetPosition = { x: number; y: number };
export type ChartType = 'bar' | 'line' | 'pie' | 'heatmap';

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'notifications' | 'riskReport' | 'complianceStatus' | 'recentChanges' | 'upcomingDeadlines';
  title: string;
  size: WidgetSize;
  position?: WidgetPosition;
  visible: boolean;
  // Added for drag and drop functionality
  isDragging?: boolean;
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

// Now let's create components for the customizable dashboard
