import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JourneyEvent } from '@/data/memberData';
import { 
  Globe, 
  Smartphone, 
  Phone, 
  Mail, 
  MessageCircle, 
  Store,
  CheckCircle,
  XCircle,
  ArrowUp,
  Clock
} from 'lucide-react';

interface JourneyMapProps {
  events: JourneyEvent[];
  memberName: string;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ events, memberName }) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [events]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'web': return <Globe className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'call_center': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      case 'store': return <Store className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'converted': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'abandoned': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'escalated': return <ArrowUp className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'converted': return 'border-blue-200 bg-blue-50';
      case 'abandoned': return 'border-red-200 bg-red-50';
      case 'escalated': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'web': return 'bg-blue-100 text-blue-800';
      case 'mobile': return 'bg-purple-100 text-purple-800';
      case 'call_center': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-yellow-100 text-yellow-800';
      case 'chat': return 'bg-pink-100 text-pink-800';
      case 'store': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Journey Map - {memberName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Chronological view of customer touchpoints and interactions
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Journey Timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border"></div>
          
          <div className="space-y-6">
            {sortedEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline Node */}
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-background shadow">
                  {getChannelIcon(event.channel)}
                </div>
                
                {/* Event Content */}
                <div className={`flex-1 rounded-lg border p-4 ${getOutcomeColor(event.outcome)}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{event.touchpoint}</h4>
                        <Badge className={getChannelColor(event.channel)}>
                          {event.channel.replace('_', ' ')}
                        </Badge>
                        {getOutcomeIcon(event.outcome)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {event.activity}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      
                      {/* Event Details */}
                      {event.details && (
                        <div className="mt-2 text-xs">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Badge 
                      variant={event.outcome === 'success' || event.outcome === 'converted' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {event.outcome}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Journey Analytics */}
        <div className="mt-6 pt-6 border-t">
          <h5 className="font-semibold mb-3">Journey Analytics</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedEvents.length}
              </div>
              <div className="text-xs text-muted-foreground">Total Touchpoints</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sortedEvents.filter(e => e.outcome === 'success').length}
              </div>
              <div className="text-xs text-muted-foreground">Successful</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(sortedEvents.map(e => e.channel)).size}
              </div>
              <div className="text-xs text-muted-foreground">Channels Used</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((new Date(sortedEvents[sortedEvents.length - 1]?.timestamp).getTime() - 
                            new Date(sortedEvents[0]?.timestamp).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-muted-foreground">Days Span</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};