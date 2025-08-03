import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Activity, BarChart3, AlertTriangle, TrendingDown, Volume2, Target } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AutobotAgent {
  name: string;
  fullName: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'standby';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Decepticon {
  name: string;
  fullName: string;
  description: string;
  threats: string[];
  severity: 'high' | 'medium' | 'low';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const autobots: AutobotAgent[] = [
  {
    name: 'BUMBLEBEE',
    fullName: 'Benefits & Utilization Management Bot for Enhanced Experience',
    description: 'Optimizes member benefits utilization and enhances customer experience through intelligent routing and personalized recommendations.',
    capabilities: ['Member Benefits Analysis', 'Utilization Optimization', 'Experience Enhancement', 'Smart Routing'],
    status: 'active',
    icon: Shield,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    name: 'RATCHET',
    fullName: 'Rx Analytics & Treatment Care Health Enhancement Technology',
    description: 'Advanced pharmacy analytics and treatment optimization for improved health outcomes and cost management.',
    capabilities: ['Prescription Analytics', 'Treatment Optimization', 'Clinical Decision Support', 'Cost Management'],
    status: 'active',
    icon: Activity,
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'IRONHIDE',
    fullName: 'Insurance & Revenue Operations Network Intelligence & Data Engine',
    description: 'Robust data intelligence for insurance operations, revenue optimization, and network performance monitoring.',
    capabilities: ['Revenue Intelligence', 'Network Analytics', 'Risk Assessment', 'Performance Monitoring'],
    status: 'active',
    icon: BarChart3,
    color: 'from-gray-400 to-blue-500'
  },
  {
    name: 'JAZZ',
    fullName: 'Just-in-time Analytics & Zero-latency Support',
    description: 'Real-time analytics and instant support delivery for critical decision-making and rapid response.',
    capabilities: ['Real-time Analytics', 'Instant Support', 'Critical Alerts', 'Rapid Response'],
    status: 'active',
    icon: Zap,
    color: 'from-purple-400 to-pink-500'
  }
];

const decepticons: Decepticon[] = [
  {
    name: 'MEGATRON',
    fullName: 'Massive Expenses & Gaps in Treatment Response Operations Network',
    description: 'Large-scale operational inefficiencies causing treatment delays and excessive costs across the network.',
    threats: ['Cost Overruns', 'Treatment Delays', 'Network Inefficiencies', 'Resource Waste'],
    severity: 'high',
    icon: AlertTriangle,
    color: 'from-red-500 to-red-700'
  },
  {
    name: 'STARSCREAM',
    fullName: 'Skyrocketing Treatment & Administrative Costs Requiring Emergency Action Management',
    description: 'Rapidly escalating costs in treatment and administration that demand immediate intervention.',
    threats: ['Cost Escalation', 'Budget Overruns', 'Emergency Interventions', 'Administrative Burden'],
    severity: 'high',
    icon: TrendingDown,
    color: 'from-orange-500 to-red-600'
  },
  {
    name: 'SOUNDWAVE',
    fullName: 'Silent Operational Undermining of Network Delivery & Workflow Analysis & Value Enhancement',
    description: 'Hidden operational issues that silently degrade network performance and workflow efficiency.',
    threats: ['Hidden Inefficiencies', 'Workflow Disruption', 'Value Erosion', 'Silent Failures'],
    severity: 'medium',
    icon: Volume2,
    color: 'from-purple-600 to-indigo-700'
  }
];

export const TransformerArchitecture = () => {
  const [activeView, setActiveView] = useState<'overview' | 'autobots' | 'decepticons'>('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'standby': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Target className="w-4 h-4 mr-2" />
          AI Architecture
        </Button>
        <Button
          variant={activeView === 'autobots' ? 'default' : 'outline'}
          onClick={() => setActiveView('autobots')}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90"
        >
          <Shield className="w-4 h-4 mr-2" />
          Autobots ({autobots.filter(a => a.status === 'active').length})
        </Button>
        <Button
          variant={activeView === 'decepticons' ? 'default' : 'outline'}
          onClick={() => setActiveView('decepticons')}
          className="bg-gradient-to-r from-red-500 to-purple-600 hover:opacity-90"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Threats ({decepticons.filter(d => d.severity === 'high').length})
        </Button>
      </div>

      {/* Overview */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Shield className="w-5 h-5" />
                AUTOBOTS - Allied AI Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Advanced AI agents working together to optimize healthcare operations and enhance member experience.
              </p>
              <div className="space-y-2">
                {autobots.map((autobot) => (
                  <div key={autobot.name} className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10">
                    <div className="flex items-center gap-2">
                      <autobot.icon className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-cyan-300">{autobot.name}</span>
                    </div>
                    <Badge className={getStatusColor(autobot.status)}>
                      {autobot.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-purple-600/10 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-300">
                <AlertTriangle className="w-5 h-5" />
                DECEPTICONS - Operational Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Critical operational challenges that PRIME's AI agents actively combat to ensure optimal performance.
              </p>
              <div className="space-y-2">
                {decepticons.map((decepticon) => (
                  <div key={decepticon.name} className="flex items-center justify-between p-2 rounded-lg bg-red-500/10">
                    <div className="flex items-center gap-2">
                      <decepticon.icon className="w-4 h-4 text-red-400" />
                      <span className="font-medium text-red-300">{decepticon.name}</span>
                    </div>
                    <Badge className={getSeverityColor(decepticon.severity)}>
                      {decepticon.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Autobots Detail */}
      {activeView === 'autobots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {autobots.map((autobot) => (
            <Card key={autobot.name} className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 border-blue-500/30 hover:border-cyan-400/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-lg bg-gradient-to-r", autobot.color)}>
                      <autobot.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-cyan-300">{autobot.name}</CardTitle>
                      <Badge className={getStatusColor(autobot.status)}>
                        {autobot.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-cyan-400 mb-2">{autobot.fullName}</h4>
                <p className="text-muted-foreground mb-4">{autobot.description}</p>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Core Capabilities:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {autobot.capabilities.map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-300">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Decepticons Detail */}
      {activeView === 'decepticons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decepticons.map((decepticon) => (
            <Card key={decepticon.name} className="bg-gradient-to-br from-red-500/10 to-purple-600/10 border-red-500/30 hover:border-red-400/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-lg bg-gradient-to-r", decepticon.color)}>
                      <decepticon.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-red-300">{decepticon.name}</CardTitle>
                      <Badge className={getSeverityColor(decepticon.severity)}>
                        {decepticon.severity} threat
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-red-400 mb-2">{decepticon.fullName}</h4>
                <p className="text-muted-foreground mb-4">{decepticon.description}</p>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Threat Vectors:</h5>
                  <div className="space-y-1">
                    {decepticon.threats.map((threat) => (
                      <Badge key={threat} variant="outline" className="text-xs bg-red-500/10 border-red-500/30 text-red-300 block w-fit">
                        {threat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};