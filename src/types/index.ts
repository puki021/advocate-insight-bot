export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 'enterprise_leader' | 'supervisor' | 'developer' | 'agent';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'dashboard' | 'kpi' | 'chart';
  data?: any;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'neutral';
  color: 'success' | 'warning' | 'destructive' | 'info';
}

export interface CallCenterData {
  totalCalls: number;
  answeredCalls: number;
  averageHandleTime: number;
  customerSatisfaction: number;
  firstCallResolution: number;
  agentUtilization: number;
  campaignPerformance: Array<{
    name: string;
    leads: number;
    conversions: number;
    revenue: number;
  }>;
  agentPerformance: Array<{
    name: string;
    callsHandled: number;
    avgHandleTime: number;
    satisfaction: number;
  }>;
}