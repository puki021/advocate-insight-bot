import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartMessageProps {
  data: {
    type: 'campaign' | 'agent';
    data: any[];
  };
}

const COLORS = ['hsl(217 91% 60%)', 'hsl(260 85% 65%)', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(199 89% 48%)'];

export const ChartMessage = ({ data }: ChartMessageProps) => {
  if (data.type === 'campaign') {
    const chartData = data.data.map(item => ({
      name: item.name,
      leads: item.leads,
      conversions: item.conversions,
      conversionRate: ((item.conversions / item.leads) * 100).toFixed(1)
    }));

    return (
      <div className="space-y-4">
        <Card className="p-6 bg-gradient-card border-border/50">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Campaign Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Bar dataKey="leads" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="hsl(260 85% 65%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.data.map((campaign, index) => (
            <Card key={campaign.name} className="p-4 bg-gradient-card border-border/50">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{campaign.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Leads:</span>
                    <span className="text-foreground font-medium">{campaign.leads.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversions:</span>
                    <span className="text-foreground font-medium">{campaign.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="text-success font-medium">${campaign.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'agent') {
    const chartData = data.data.map(agent => ({
      name: agent.name.split(' ')[0],
      calls: agent.callsHandled,
      satisfaction: agent.satisfaction
    }));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Calls Handled</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Bar dataKey="calls" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Satisfaction Scores</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="satisfaction"
                    label={({ name, satisfaction }) => `${name}: ${satisfaction}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {data.data.map((agent) => (
            <Card key={agent.name} className="p-4 bg-gradient-card border-border/50">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{agent.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calls:</span>
                    <span className="text-foreground font-medium">{agent.callsHandled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Time:</span>
                    <span className="text-foreground font-medium">{Math.floor(agent.avgHandleTime / 60)}:{String(agent.avgHandleTime % 60).padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="text-success font-medium">{agent.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};