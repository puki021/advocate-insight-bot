import { UserRole } from '@/types';
import { AgentTools, ToolResult } from './AgentTools';
import { availableTools, getKPIsByRole, getKPIDefinition } from '@/data/knowledgeBase';

export interface AgentResponse {
  type: 'text' | 'kpi' | 'chart' | 'tool_result' | 'knowledge';
  content: string;
  data?: any;
  toolsUsed?: string[];
  reasoning?: string;
}

export class AgenticAgent {
  private tools: AgentTools;
  
  constructor() {
    this.tools = new AgentTools();
  }

  async processQuery(query: string, userRole: UserRole): Promise<AgentResponse> {
    const lowerQuery = query.toLowerCase();
    
    // Analyze the intent of the user query
    const intent = this.analyzeIntent(lowerQuery);
    
    // Based on intent, decide which tools to use
    const toolPlan = this.planToolExecution(intent, lowerQuery, userRole);
    
    if (toolPlan.useTools.length > 0) {
      return await this.executeToolPlan(toolPlan, query, userRole);
    }
    
    // If no tools needed, provide knowledge-based response
    return this.provideKnowledgeResponse(intent, query, userRole);
  }

  private analyzeIntent(query: string): {
    type: 'calculation' | 'comparison' | 'analysis' | 'forecast' | 'definition' | 'general';
    entities: string[];
    confidence: number;
  } {
    const patterns = {
      calculation: /calculate|compute|what is|show me|current|today/,
      comparison: /compare|versus|vs|difference|trend|change|last|previous/,
      analysis: /analyze|analysis|performance|deep dive|insights|breakdown/,
      forecast: /forecast|predict|future|projection|estimate|expect/,
      definition: /what does|define|definition|meaning|explain|help me understand/
    };

    // Extract entities (KPIs, metrics, etc.)
    const entities = this.extractEntities(query);
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(query)) {
        return {
          type: type as any,
          entities,
          confidence: 0.8
        };
      }
    }
    
    return {
      type: 'general',
      entities,
      confidence: 0.5
    };
  }

  private extractEntities(query: string): string[] {
    const entities = [];
    const lowerQuery = query.toLowerCase();
    
    // KPI entities
    const kpiKeywords = {
      'answer_rate': ['answer rate', 'answered calls', 'service level'],
      'avg_handle_time': ['handle time', 'aht', 'call duration', 'talk time'],
      'customer_satisfaction': ['satisfaction', 'csat', 'customer rating', 'feedback'],
      'first_call_resolution': ['fcr', 'first call', 'resolution', 'resolved'],
      'agent_utilization': ['utilization', 'agent productivity', 'efficiency'],
      'cost_per_call': ['cost', 'expenses', 'budget'],
      'revenue_impact': ['revenue', 'sales', 'income', 'profit']
    };
    
    for (const [kpi, keywords] of Object.entries(kpiKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        entities.push(kpi);
      }
    }
    
    // Other entities
    if (lowerQuery.includes('agent') || lowerQuery.includes('team')) {
      entities.push('agents');
    }
    if (lowerQuery.includes('campaign') || lowerQuery.includes('marketing')) {
      entities.push('campaigns');
    }
    
    return entities;
  }

  private planToolExecution(intent: any, query: string, userRole: UserRole): {
    useTools: string[];
    parameters: any[];
    reasoning: string;
  } {
    const { type, entities } = intent;
    
    switch (type) {
      case 'calculation':
        if (entities.length > 0) {
          return {
            useTools: ['calculate_metric'],
            parameters: [{ metric_type: entities[0], time_period: 'today' }],
            reasoning: `User wants to calculate ${entities[0]} - using calculation tool`
          };
        }
        break;
        
      case 'comparison':
        if (entities.length > 0) {
          return {
            useTools: ['compare_periods'],
            parameters: [{ metric: entities[0], period1: 'last_week', period2: 'this_week' }],
            reasoning: `User wants to compare ${entities[0]} across time periods`
          };
        }
        break;
        
      case 'analysis':
        if (entities.includes('agents')) {
          return {
            useTools: ['agent_performance'],
            parameters: [{ metrics: ['satisfaction', 'callsHandled'], benchmark: true }],
            reasoning: 'User wants agent performance analysis'
          };
        }
        if (entities.includes('campaigns')) {
          return {
            useTools: ['campaign_analysis'],
            parameters: [{ metrics: ['conversions', 'revenue'] }],
            reasoning: 'User wants campaign performance analysis'
          };
        }
        break;
        
      case 'forecast':
        return {
          useTools: ['forecast_demand'],
          parameters: [{ forecast_period: 'next_month' }],
          reasoning: 'User wants demand forecasting'
        };
    }
    
    return {
      useTools: [],
      parameters: [],
      reasoning: 'No specific tools needed for this query'
    };
  }

  private async executeToolPlan(toolPlan: any, originalQuery: string, userRole: UserRole): Promise<AgentResponse> {
    const results: ToolResult[] = [];
    
    // Execute tools sequentially (could be parallelized for independent tools)
    for (let i = 0; i < toolPlan.useTools.length; i++) {
      const toolId = toolPlan.useTools[i];
      const params = toolPlan.parameters[i];
      
      const result = await this.tools.executeTool(toolId, params);
      results.push(result);
    }
    
    // Combine results and generate response
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      return {
        type: 'text',
        content: "I encountered issues processing your request. Please try rephrasing your question.",
        reasoning: toolPlan.reasoning
      };
    }
    
    // Format the response based on results
    const primaryResult = successfulResults[0];
    
    if (primaryResult.chartData) {
      return {
        type: 'chart',
        content: this.generateInsightfulResponse(primaryResult, originalQuery),
        data: primaryResult.chartData,
        toolsUsed: toolPlan.useTools,
        reasoning: toolPlan.reasoning
      };
    }
    
    return {
      type: 'tool_result',
      content: this.generateInsightfulResponse(primaryResult, originalQuery),
      data: primaryResult.data,
      toolsUsed: toolPlan.useTools,
      reasoning: toolPlan.reasoning
    };
  }

  private generateInsightfulResponse(result: ToolResult, originalQuery: string): string {
    const { data, message } = result;
    
    if (!data) return message;
    
    // Generate contextual insights based on the data
    let response = message + "\n\n";
    
    if (data.benchmark) {
      response += `📊 **Performance Assessment:** ${data.benchmark}\n`;
    }
    
    if (data.businessContext) {
      response += `💡 **Business Context:** ${data.businessContext}\n`;
    }
    
    if (data.change && parseFloat(data.change) > 0) {
      response += `📈 **Positive Trend:** This metric is improving, indicating good operational health.\n`;
    }
    
    if (data.staffingRecommendation) {
      const rec = data.staffingRecommendation;
      if (rec.additionalNeeded > 0) {
        response += `⚠️ **Staffing Alert:** Consider adding ${rec.additionalNeeded} more agents to handle projected demand.\n`;
      }
    }
    
    return response.trim();
  }

  private provideKnowledgeResponse(intent: any, query: string, userRole: UserRole): AgentResponse {
    const { type, entities } = intent;
    
    if (type === 'definition' && entities.length > 0) {
      const kpiDef = getKPIDefinition(entities[0]);
      if (kpiDef) {
        return {
          type: 'knowledge',
          content: `**${kpiDef.name}**\n\n${kpiDef.definition}\n\n**Formula:** ${kpiDef.formula}\n\n**Business Context:** ${kpiDef.businessContext}`,
          data: kpiDef
        };
      }
    }
    
    // Role-specific default responses
    const roleResponses = {
      enterprise_leader: "I can help you with strategic KPIs like revenue impact, cost optimization, and ROI analysis. Try asking about 'revenue performance', 'cost per call analysis', or 'forecast next quarter demand'.",
      supervisor: "I can analyze team performance, agent metrics, and operational efficiency. Ask me about 'team performance analysis', 'agent utilization trends', or 'quality score breakdown'.",
      developer: "I can provide system performance insights and technical metrics. Try 'system performance analysis', 'API response time trends', or 'error rate investigation'.",
      agent: "I can help with your individual performance and customer insights. Ask about 'my performance metrics', 'customer satisfaction trends', or 'skill development areas'."
    };
    
    return {
      type: 'text',
      content: roleResponses[userRole] || "How can I help you analyze your call center data today? I have access to various analytical tools and a comprehensive knowledge base."
    };
  }
}
