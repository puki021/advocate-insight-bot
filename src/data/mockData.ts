import { CallCenterData, KPI, UserRole } from '@/types';

export const mockCallCenterData: CallCenterData = {
  totalCalls: 15420,
  answeredCalls: 14890,
  averageHandleTime: 285,
  customerSatisfaction: 4.2,
  firstCallResolution: 87.5,
  agentUtilization: 78.3,
  campaignPerformance: [
    { name: 'Holiday Sale', leads: 1250, conversions: 312, revenue: 78500 },
    { name: 'Product Launch', leads: 890, conversions: 245, revenue: 125000 },
    { name: 'Retention Campaign', leads: 2100, conversions: 567, revenue: 89700 },
    { name: 'Upsell Initiative', leads: 760, conversions: 198, revenue: 45600 },
  ],
  agentPerformance: [
    { name: 'Sarah Johnson', callsHandled: 142, avgHandleTime: 245, satisfaction: 4.8 },
    { name: 'Mike Chen', callsHandled: 138, avgHandleTime: 267, satisfaction: 4.6 },
    { name: 'Emily Davis', callsHandled: 156, avgHandleTime: 298, satisfaction: 4.3 },
    { name: 'Alex Rodriguez', callsHandled: 129, avgHandleTime: 312, satisfaction: 4.1 },
    { name: 'Lisa Wang', callsHandled: 147, avgHandleTime: 234, satisfaction: 4.7 },
  ],
};

export const getKPIsForRole = (role: UserRole): KPI[] => {
  const baseKPIs: KPI[] = [
    {
      label: 'Total Calls Today',
      value: mockCallCenterData.totalCalls.toLocaleString(),
      change: 12.5,
      trend: 'up',
      color: 'info',
    },
    {
      label: 'Answer Rate',
      value: `${((mockCallCenterData.answeredCalls / mockCallCenterData.totalCalls) * 100).toFixed(1)}%`,
      change: 3.2,
      trend: 'up',
      color: 'success',
    },
    {
      label: 'Avg Handle Time',
      value: `${Math.floor(mockCallCenterData.averageHandleTime / 60)}:${String(mockCallCenterData.averageHandleTime % 60).padStart(2, '0')}`,
      change: -5.1,
      trend: 'down',
      color: 'success',
    },
    {
      label: 'Customer Satisfaction',
      value: mockCallCenterData.customerSatisfaction.toFixed(1),
      change: 0.3,
      trend: 'up',
      color: 'success',
    },
  ];

  switch (role) {
    case 'enterprise_leader':
      return [
        ...baseKPIs,
        {
          label: 'Revenue Impact',
          value: '$2.4M',
          change: 18.7,
          trend: 'up',
          color: 'success',
        },
        {
          label: 'Cost Per Call',
          value: '$12.50',
          change: -8.2,
          trend: 'down',
          color: 'success',
        },
      ];
    case 'supervisor':
      return [
        ...baseKPIs,
        {
          label: 'Agent Utilization',
          value: `${mockCallCenterData.agentUtilization}%`,
          change: 5.4,
          trend: 'up',
          color: 'info',
        },
        {
          label: 'First Call Resolution',
          value: `${mockCallCenterData.firstCallResolution}%`,
          change: 2.1,
          trend: 'up',
          color: 'success',
        },
      ];
    case 'developer':
      return [
        {
          label: 'API Response Time',
          value: '145ms',
          change: -12.3,
          trend: 'down',
          color: 'success',
        },
        {
          label: 'System Uptime',
          value: '99.97%',
          change: 0.1,
          trend: 'up',
          color: 'success',
        },
        {
          label: 'Error Rate',
          value: '0.03%',
          change: -45.2,
          trend: 'down',
          color: 'success',
        },
        {
          label: 'Database Queries/sec',
          value: '1,247',
          change: 8.9,
          trend: 'up',
          color: 'info',
        },
      ];
    default:
      return baseKPIs.slice(0, 4);
  }
};

export const generateResponse = (query: string, role: UserRole): { type: string; content: string; data?: any } => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('kpi') || lowerQuery.includes('metric') || lowerQuery.includes('performance')) {
    return {
      type: 'kpi',
      content: `Here are the key performance indicators for your ${role.replace('_', ' ')} dashboard:`,
      data: getKPIsForRole(role),
    };
  }
  
  if (lowerQuery.includes('campaign') || lowerQuery.includes('marketing')) {
    return {
      type: 'chart',
      content: 'Here\'s the current campaign performance data:',
      data: {
        type: 'campaign',
        data: mockCallCenterData.campaignPerformance,
      },
    };
  }
  
  if (lowerQuery.includes('agent') || lowerQuery.includes('team')) {
    return {
      type: 'chart',
      content: 'Agent performance overview:',
      data: {
        type: 'agent',
        data: mockCallCenterData.agentPerformance,
      },
    };
  }
  
  if (lowerQuery.includes('call') || lowerQuery.includes('volume')) {
    return {
      type: 'dashboard',
      content: 'Call center overview dashboard:',
      data: mockCallCenterData,
    };
  }
  
  // Default response
  const responses = {
    enterprise_leader: "As an Enterprise Leader, I can provide insights on revenue impact, cost optimization, and strategic KPIs. Try asking about 'KPIs', 'campaign performance', or 'call metrics'.",
    supervisor: "As a Supervisor, I can help you monitor team performance, agent utilization, and operational metrics. Ask me about 'team performance', 'agent metrics', or 'call quality'.",
    developer: "As a Developer, I can show you system performance, API metrics, and technical insights. Try asking about 'system metrics', 'performance data', or 'technical KPIs'.",
    agent: "I can help you with call center insights and performance data. Ask me about 'my performance', 'call metrics', or 'campaign results'.",
  };
  
  return {
    type: 'text',
    content: responses[role] || "How can I help you with call center analytics today?",
  };
};