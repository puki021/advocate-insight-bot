export interface KPIDefinition {
  id: string;
  name: string;
  definition: string;
  formula?: string;
  category: string;
  relevantRoles: string[];
  businessContext: string;
  benchmarks: {
    excellent: string;
    good: string;
    needsImprovement: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  category: string;
}

export const kpiDefinitions: KPIDefinition[] = [
  {
    id: "total_calls",
    name: "Total Calls",
    definition: "The total number of inbound and outbound calls handled by the call center in a given time period",
    formula: "Sum of all completed calls (inbound + outbound)",
    category: "Volume Metrics",
    relevantRoles: ["enterprise_leader", "supervisor", "agent"],
    businessContext: "Indicates call center capacity utilization and demand levels. High volumes may require staffing adjustments.",
    benchmarks: {
      excellent: "> 95% of capacity",
      good: "80-95% of capacity", 
      needsImprovement: "< 80% of capacity"
    }
  },
  {
    id: "answer_rate",
    name: "Answer Rate",
    definition: "Percentage of incoming calls that are answered by agents within the defined service level",
    formula: "(Answered Calls / Total Incoming Calls) × 100",
    category: "Service Quality",
    relevantRoles: ["enterprise_leader", "supervisor"],
    businessContext: "Critical for customer satisfaction. Low answer rates indicate understaffing or inefficient call routing.",
    benchmarks: {
      excellent: "> 95%",
      good: "90-95%",
      needsImprovement: "< 90%"
    }
  },
  {
    id: "avg_handle_time",
    name: "Average Handle Time (AHT)",
    definition: "Average time an agent spends handling a call, including talk time and after-call work",
    formula: "(Total Talk Time + Total Hold Time + Total Wrap Time) / Total Calls Handled",
    category: "Efficiency Metrics",
    relevantRoles: ["supervisor", "agent"],
    businessContext: "Balances efficiency with quality. Too low may indicate rushed service; too high suggests training needs.",
    benchmarks: {
      excellent: "< 4 minutes",
      good: "4-6 minutes",
      needsImprovement: "> 6 minutes"
    }
  },
  {
    id: "customer_satisfaction",
    name: "Customer Satisfaction (CSAT)",
    definition: "Average rating customers give based on their service experience",
    formula: "Sum of all satisfaction scores / Total number of surveys",
    category: "Quality Metrics",
    relevantRoles: ["enterprise_leader", "supervisor", "agent"],
    businessContext: "Direct measure of service quality and customer experience. Impacts retention and brand reputation.",
    benchmarks: {
      excellent: "> 4.5/5.0",
      good: "4.0-4.5/5.0",
      needsImprovement: "< 4.0/5.0"
    }
  },
  {
    id: "first_call_resolution",
    name: "First Call Resolution (FCR)",
    definition: "Percentage of calls resolved on the first contact without need for follow-up",
    formula: "(Calls Resolved on First Contact / Total Calls) × 100",
    category: "Quality Metrics",
    relevantRoles: ["supervisor", "agent"],
    businessContext: "Indicates agent knowledge and process efficiency. High FCR reduces costs and improves satisfaction.",
    benchmarks: {
      excellent: "> 85%",
      good: "75-85%",
      needsImprovement: "< 75%"
    }
  },
  {
    id: "agent_utilization",
    name: "Agent Utilization",
    definition: "Percentage of time agents spend on productive call-related activities",
    formula: "(Total Talk Time + Total Wrap Time) / Total Logged Time × 100",
    category: "Efficiency Metrics",
    relevantRoles: ["enterprise_leader", "supervisor"],
    businessContext: "Measures workforce efficiency. Too high indicates burnout risk; too low suggests overstaffing.",
    benchmarks: {
      excellent: "75-85%",
      good: "65-75%",
      needsImprovement: "< 65% or > 85%"
    }
  },
  {
    id: "cost_per_call",
    name: "Cost Per Call",
    definition: "Total operational cost divided by number of calls handled",
    formula: "(Agent Costs + Technology Costs + Overhead) / Total Calls",
    category: "Financial Metrics",
    relevantRoles: ["enterprise_leader"],
    businessContext: "Key profitability metric. Helps optimize staffing and technology investments.",
    benchmarks: {
      excellent: "< $10",
      good: "$10-15",
      needsImprovement: "> $15"
    }
  },
  {
    id: "revenue_impact",
    name: "Revenue Impact",
    definition: "Total revenue generated through call center activities including sales and retention",
    formula: "Direct Sales + Upsells + Retention Value - Lost Revenue",
    category: "Financial Metrics",
    relevantRoles: ["enterprise_leader"],
    businessContext: "Demonstrates call center value as profit center, not just cost center.",
    benchmarks: {
      excellent: "> 300% of operating costs",
      good: "200-300% of operating costs",
      needsImprovement: "< 200% of operating costs"
    }
  }
];

export const availableTools: Tool[] = [
  {
    id: "calculate_metric",
    name: "Calculate Metric",
    description: "Calculate specific KPIs or custom metrics from raw data",
    parameters: [
      { name: "metric_type", type: "string", description: "Type of metric to calculate", required: true },
      { name: "time_period", type: "string", description: "Time period for calculation", required: false },
      { name: "filters", type: "object", description: "Additional filters to apply", required: false }
    ],
    category: "Analytics"
  },
  {
    id: "compare_periods",
    name: "Compare Time Periods",
    description: "Compare metrics across different time periods",
    parameters: [
      { name: "metric", type: "string", description: "Metric to compare", required: true },
      { name: "period1", type: "string", description: "First time period", required: true },
      { name: "period2", type: "string", description: "Second time period", required: true }
    ],
    category: "Analytics"
  },
  {
    id: "agent_performance",
    name: "Agent Performance Analysis",
    description: "Analyze individual or team agent performance",
    parameters: [
      { name: "agent_id", type: "string", description: "Specific agent ID or 'all' for team", required: false },
      { name: "metrics", type: "array", description: "List of metrics to analyze", required: true },
      { name: "benchmark", type: "boolean", description: "Include benchmark comparison", required: false }
    ],
    category: "Performance"
  },
  {
    id: "campaign_analysis",
    name: "Campaign Performance Analysis",
    description: "Analyze marketing campaign effectiveness",
    parameters: [
      { name: "campaign_id", type: "string", description: "Specific campaign or 'all'", required: false },
      { name: "metrics", type: "array", description: "Metrics to analyze", required: true }
    ],
    category: "Marketing"
  },
  {
    id: "forecast_demand",
    name: "Demand Forecasting",
    description: "Predict future call volumes and staffing needs",
    parameters: [
      { name: "forecast_period", type: "string", description: "Period to forecast", required: true },
      { name: "historical_data", type: "string", description: "Historical data period to use", required: false }
    ],
    category: "Planning"
  },
  {
    id: "quality_analysis",
    name: "Quality Score Analysis",
    description: "Analyze call quality and customer satisfaction trends",
    parameters: [
      { name: "quality_metric", type: "string", description: "Specific quality metric", required: true },
      { name: "segment", type: "string", description: "Customer or call segment", required: false }
    ],
    category: "Quality"
  },
  {
    id: "member_lookup",
    name: "Member Information Lookup",
    description: "Find member profile information by ID, name, or phone number",
    parameters: [
      { name: "search_term", type: "string", description: "Member ID, name, or phone number", required: true },
      { name: "search_type", type: "string", description: "Type of search: id, name, or phone", required: false }
    ],
    category: "Member Services"
  },
  {
    id: "member_journey",
    name: "Member Journey Analysis",
    description: "Analyze customer journey and touchpoint interactions",
    parameters: [
      { name: "member_id", type: "string", description: "Member ID to analyze", required: true }
    ],
    category: "Member Services"
  }
];

export const getKPIDefinition = (kpiId: string): KPIDefinition | undefined => {
  return kpiDefinitions.find(kpi => kpi.id === kpiId);
};

export const getKPIsByRole = (role: string): KPIDefinition[] => {
  return kpiDefinitions.filter(kpi => kpi.relevantRoles.includes(role));
};

export const getKPIsByCategory = (category: string): KPIDefinition[] => {
  return kpiDefinitions.filter(kpi => kpi.category === category);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return availableTools.filter(tool => tool.category === category);
};