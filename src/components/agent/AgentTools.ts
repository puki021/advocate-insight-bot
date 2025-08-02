import { mockCallCenterData } from '@/data/mockData';
import { availableTools, getKPIDefinition } from '@/data/knowledgeBase';
import { getMemberById, searchMembersByPhone, searchMembersByName, MemberProfile } from '@/data/memberData';

export interface ToolResult {
  success: boolean;
  data?: any;
  message: string;
  chartData?: any;
}

export class AgentTools {
  async executeTool(toolId: string, parameters: any): Promise<ToolResult> {
    switch (toolId) {
      case 'calculate_metric':
        return this.calculateMetric(parameters);
      case 'compare_periods':
        return this.comparePeriods(parameters);
      case 'agent_performance':
        return this.analyzeAgentPerformance(parameters);
      case 'campaign_analysis':
        return this.analyzeCampaigns(parameters);
      case 'forecast_demand':
        return this.forecastDemand(parameters);
      case 'quality_analysis':
        return this.analyzeQuality(parameters);
      case 'member_lookup':
        return this.lookupMember(parameters);
      case 'member_journey':
        return this.analyzeMemberJourney(parameters);
      default:
        return {
          success: false,
          message: `Unknown tool: ${toolId}`
        };
    }
  }

  private async calculateMetric(params: any): Promise<ToolResult> {
    const { metric_type, time_period = 'today' } = params;
    
    const calculations: any = {
      'answer_rate': {
        value: ((mockCallCenterData.answeredCalls / mockCallCenterData.totalCalls) * 100).toFixed(1) + '%',
        calculation: `${mockCallCenterData.answeredCalls} answered / ${mockCallCenterData.totalCalls} total calls`,
        benchmark: 'Excellent (>95%)'
      },
      'avg_handle_time': {
        value: `${Math.floor(mockCallCenterData.averageHandleTime / 60)}:${String(mockCallCenterData.averageHandleTime % 60).padStart(2, '0')}`,
        calculation: `${mockCallCenterData.averageHandleTime} seconds average`,
        benchmark: 'Good (4-6 minutes)'
      },
      'customer_satisfaction': {
        value: mockCallCenterData.customerSatisfaction.toFixed(1) + '/5.0',
        calculation: `Based on customer survey responses`,
        benchmark: 'Good (4.0-4.5/5.0)'
      },
      'first_call_resolution': {
        value: mockCallCenterData.firstCallResolution + '%',
        calculation: `Calls resolved on first contact`,
        benchmark: 'Excellent (>85%)'
      }
    };

    const result = calculations[metric_type];
    if (!result) {
      return {
        success: false,
        message: `Metric "${metric_type}" not found. Available metrics: ${Object.keys(calculations).join(', ')}`
      };
    }

    const kpiDef = getKPIDefinition(metric_type);
    
    return {
      success: true,
      data: {
        metric: metric_type,
        value: result.value,
        calculation: result.calculation,
        benchmark: result.benchmark,
        definition: kpiDef?.definition,
        businessContext: kpiDef?.businessContext
      },
      message: `Calculated ${metric_type} for ${time_period}: ${result.value}`
    };
  }

  private async comparePeriods(params: any): Promise<ToolResult> {
    const { metric, period1, period2 } = params;
    
    // Simulate historical data comparison
    const currentValue = mockCallCenterData.customerSatisfaction;
    const previousValue = currentValue - 0.3; // Simulated previous period
    const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    
    return {
      success: true,
      data: {
        metric,
        period1: { period: period1, value: previousValue.toFixed(1) },
        period2: { period: period2, value: currentValue.toFixed(1) },
        change: `+${change}%`,
        trend: 'improving'
      },
      chartData: {
        type: 'trend',
        data: [
          { period: period1, value: previousValue },
          { period: period2, value: currentValue }
        ]
      },
      message: `${metric} improved by ${change}% from ${period1} to ${period2}`
    };
  }

  private async analyzeAgentPerformance(params: any): Promise<ToolResult> {
    const { agent_id, metrics, benchmark = true } = params;
    
    if (agent_id && agent_id !== 'all') {
      const agent = mockCallCenterData.agentPerformance.find(a => 
        a.name.toLowerCase().includes(agent_id.toLowerCase())
      );
      
      if (!agent) {
        return {
          success: false,
          message: `Agent "${agent_id}" not found`
        };
      }

      return {
        success: true,
        data: {
          agent: agent.name,
          performance: {
            callsHandled: agent.callsHandled,
            avgHandleTime: `${Math.floor(agent.avgHandleTime / 60)}:${String(agent.avgHandleTime % 60).padStart(2, '0')}`,
            satisfaction: agent.satisfaction.toFixed(1),
            ranking: 'Top 20%'
          }
        },
        message: `Performance analysis for ${agent.name} completed`
      };
    }
    
    // Team analysis
    const topPerformer = mockCallCenterData.agentPerformance.reduce((prev, current) => 
      prev.satisfaction > current.satisfaction ? prev : current
    );
    
    return {
      success: true,
      data: {
        teamSize: mockCallCenterData.agentPerformance.length,
        topPerformer: topPerformer.name,
        avgSatisfaction: (mockCallCenterData.agentPerformance.reduce((sum, agent) => 
          sum + agent.satisfaction, 0) / mockCallCenterData.agentPerformance.length).toFixed(1),
        agents: mockCallCenterData.agentPerformance
      },
      chartData: {
        type: 'agent_comparison',
        data: mockCallCenterData.agentPerformance
      },
      message: `Team performance analysis completed. Top performer: ${topPerformer.name}`
    };
  }

  private async analyzeCampaigns(params: any): Promise<ToolResult> {
    const { campaign_id, metrics } = params;
    
    if (campaign_id && campaign_id !== 'all') {
      const campaign = mockCallCenterData.campaignPerformance.find(c => 
        c.name.toLowerCase().includes(campaign_id.toLowerCase())
      );
      
      if (!campaign) {
        return {
          success: false,
          message: `Campaign "${campaign_id}" not found`
        };
      }

      const conversionRate = ((campaign.conversions / campaign.leads) * 100).toFixed(1);
      const revenuePerLead = (campaign.revenue / campaign.leads).toFixed(2);
      
      return {
        success: true,
        data: {
          campaign: campaign.name,
          performance: {
            leads: campaign.leads,
            conversions: campaign.conversions,
            revenue: `$${campaign.revenue.toLocaleString()}`,
            conversionRate: `${conversionRate}%`,
            revenuePerLead: `$${revenuePerLead}`
          }
        },
        message: `${campaign.name} analysis: ${conversionRate}% conversion rate, $${revenuePerLead} per lead`
      };
    }
    
    // All campaigns analysis
    const totalRevenue = mockCallCenterData.campaignPerformance.reduce((sum, c) => sum + c.revenue, 0);
    const bestCampaign = mockCallCenterData.campaignPerformance.reduce((prev, current) => 
      (current.conversions / current.leads) > (prev.conversions / prev.leads) ? current : prev
    );
    
    return {
      success: true,
      data: {
        totalCampaigns: mockCallCenterData.campaignPerformance.length,
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        bestPerformer: bestCampaign.name,
        campaigns: mockCallCenterData.campaignPerformance
      },
      chartData: {
        type: 'campaign_performance',
        data: mockCallCenterData.campaignPerformance
      },
      message: `Campaign analysis completed. Best performer: ${bestCampaign.name}`
    };
  }

  private async forecastDemand(params: any): Promise<ToolResult> {
    const { forecast_period } = params;
    
    // Simulate demand forecasting
    const currentCalls = mockCallCenterData.totalCalls;
    const forecastGrowth = 1.15; // 15% growth projection
    const forecastedCalls = Math.round(currentCalls * forecastGrowth);
    
    const requiredAgents = Math.ceil(forecastedCalls / 150); // Assuming 150 calls per agent capacity
    const currentAgents = mockCallCenterData.agentPerformance.length;
    
    return {
      success: true,
      data: {
        period: forecast_period,
        currentCalls,
        forecastedCalls,
        projectedGrowth: '15%',
        staffingRecommendation: {
          currentAgents,
          requiredAgents,
          additionalNeeded: Math.max(0, requiredAgents - currentAgents)
        }
      },
      chartData: {
        type: 'forecast',
        data: [
          { period: 'Current', calls: currentCalls },
          { period: forecast_period, calls: forecastedCalls }
        ]
      },
      message: `Demand forecast for ${forecast_period}: ${forecastedCalls} calls expected (+15% growth)`
    };
  }

  private async analyzeQuality(params: any): Promise<ToolResult> {
    const { quality_metric, segment } = params;
    
    const qualityData = {
      overallSatisfaction: mockCallCenterData.customerSatisfaction,
      firstCallResolution: mockCallCenterData.firstCallResolution,
      qualityTrend: 'improving',
      topIssues: [
        'Long wait times',
        'Agent knowledge gaps',
        'System technical issues'
      ],
      improvements: [
        'Implement callback system',
        'Enhanced agent training',
        'System upgrades'
      ]
    };
    
    return {
      success: true,
      data: qualityData,
      message: `Quality analysis completed. Overall satisfaction: ${qualityData.overallSatisfaction}/5.0`
    };
  }

  private async lookupMember(params: any): Promise<ToolResult> {
    const { search_term, search_type = 'name' } = params;
    
    if (!search_term) {
      return {
        success: false,
        message: 'Search term is required for member lookup'
      };
    }

    let members: MemberProfile[] = [];
    
    switch (search_type) {
      case 'id':
        const member = getMemberById(search_term);
        members = member ? [member] : [];
        break;
      case 'phone':
        members = searchMembersByPhone(search_term);
        break;
      case 'name':
      default:
        members = searchMembersByName(search_term);
        break;
    }

    if (members.length === 0) {
      return {
        success: false,
        message: `No members found for "${search_term}"`
      };
    }

    const member = members[0]; // Return first match for chat context
    
    return {
      success: true,
      data: {
        member,
        searchResults: members.length,
        memberInfo: {
          name: member.name,
          tier: member.demographics.tier,
          sentiment: member.currentContext.sentiment,
          riskScore: member.currentContext.riskScore,
          lifetimeValue: member.currentContext.lifetimeValue,
          activeIssues: member.currentContext.activeIssues,
          persona: member.persona.name
        }
      },
      message: `Found member: ${member.name} (${member.demographics.tier} tier, ${member.currentContext.sentiment} sentiment)`
    };
  }

  private async analyzeMemberJourney(params: any): Promise<ToolResult> {
    const { member_id } = params;
    
    const member = getMemberById(member_id);
    if (!member) {
      return {
        success: false,
        message: `Member with ID "${member_id}" not found`
      };
    }

    const journey = member.journey;
    const channels = new Set(journey.map(e => e.channel));
    const successfulInteractions = journey.filter(e => e.outcome === 'success').length;
    const escalatedInteractions = journey.filter(e => e.outcome === 'escalated').length;
    
    // Journey insights
    const journeySpan = Math.round(
      (new Date(journey[journey.length - 1]?.timestamp).getTime() - 
       new Date(journey[0]?.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );

    const insights = [];
    
    if (escalatedInteractions > 0) {
      insights.push(`${escalatedInteractions} interactions required escalation`);
    }
    
    if (channels.has('call_center') && channels.has('chat')) {
      insights.push('Customer uses both call center and chat support');
    }
    
    if (successfulInteractions / journey.length > 0.8) {
      insights.push('High success rate in interactions');
    }

    return {
      success: true,
      data: {
        member: member.name,
        journeyStats: {
          totalTouchpoints: journey.length,
          channelsUsed: channels.size,
          successfulInteractions,
          escalatedInteractions,
          journeySpan: `${journeySpan} days`
        },
        insights,
        recentActivity: journey.slice(-3).map(event => ({
          touchpoint: event.touchpoint,
          activity: event.activity,
          outcome: event.outcome,
          timestamp: event.timestamp
        }))
      },
      chartData: {
        type: 'journey_timeline',
        data: journey
      },
      message: `Journey analysis for ${member.name}: ${journey.length} touchpoints across ${channels.size} channels over ${journeySpan} days`
    };
  }
}