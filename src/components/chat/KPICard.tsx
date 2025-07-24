import { Card } from '@/components/ui/card';
import { KPI } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard = ({ kpi }: KPICardProps) => {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  
  const trendColor = {
    up: 'text-success',
    down: kpi.color === 'success' ? 'text-success' : 'text-destructive',
    neutral: 'text-muted-foreground'
  }[kpi.trend];

  const cardColor = {
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5',
    info: 'border-info/20 bg-info/5'
  }[kpi.color];

  return (
    <Card className={cn("p-4 transition-all duration-300 hover:shadow-glow/20", cardColor)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">{kpi.label}</h4>
          {kpi.change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              {Math.abs(kpi.change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
      </div>
    </Card>
  );
};