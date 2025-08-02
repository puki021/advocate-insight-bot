import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemberLookup } from '@/components/member/MemberLookup';
import { MemberProfile } from '@/components/member/MemberProfile';
import { MemberProfile as MemberProfileType } from '@/data/memberData';
import { Users, Search, Phone, MessageCircle } from 'lucide-react';

interface MemberAssistProps {
  onMemberContext: (member: MemberProfileType) => void;
}

export const MemberAssist: React.FC<MemberAssistProps> = ({ onMemberContext }) => {
  const [selectedMember, setSelectedMember] = useState<MemberProfileType | null>(null);

  const handleMemberSelect = (member: MemberProfileType) => {
    setSelectedMember(member);
    onMemberContext(member);
  };

  const getCallAssistActions = (member: MemberProfileType) => {
    const actions = [];
    
    // Based on member context
    if (member.currentContext.activeIssues.length > 0) {
      actions.push({
        type: 'urgent',
        title: 'Review Active Issues',
        description: `Address ${member.currentContext.activeIssues.length} pending issues`,
        action: 'Show active issues and resolution status'
      });
    }
    
    if (member.currentContext.riskScore > 0.5) {
      actions.push({
        type: 'warning',
        title: 'High Risk Customer',
        description: 'Customer shows signs of potential churn',
        action: 'Apply retention strategy and escalate if needed'
      });
    }
    
    // Based on persona
    if (member.persona.id === 'traditional') {
      actions.push({
        type: 'info',
        title: 'Traditional Customer Preference',
        description: 'Prefers phone calls and personal service',
        action: 'Provide detailed explanations and personal attention'
      });
    }
    
    if (member.persona.id === 'tech_savvy') {
      actions.push({
        type: 'info',
        title: 'Tech-Savvy Customer',
        description: 'Comfortable with digital solutions',
        action: 'Offer digital tools and self-service options'
      });
    }
    
    // Based on tier
    if (member.demographics.tier === 'platinum' || member.demographics.tier === 'gold') {
      actions.push({
        type: 'premium',
        title: `${member.demographics.tier.toUpperCase()} Member`,
        description: 'High-value customer - prioritize service',
        action: 'Apply premium service protocols'
      });
    }

    return actions;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Real-Time Call Assist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Lookup member information during calls for contextual assistance and personalized service.
          </p>
          
          {!selectedMember ? (
            <Tabs defaultValue="lookup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lookup">Member Lookup</TabsTrigger>
                <TabsTrigger value="recent">Recent Interactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lookup" className="space-y-4">
                <MemberLookup onMemberSelect={handleMemberSelect} />
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Recent member interactions will appear here</p>
                    <p className="text-sm">Search for a member to begin call assistance</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              {/* Call Assist Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold">Call in Progress</span>
                  <Badge variant="outline">{selectedMember.name}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedMember(null)}
                >
                  End Assist
                </Button>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Call Assist Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCallAssistActions(selectedMember).map((action, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${
                          action.type === 'urgent' ? 'border-red-200 bg-red-50' :
                          action.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                          action.type === 'premium' ? 'border-purple-200 bg-purple-50' :
                          'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{action.title}</h4>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                          <Badge 
                            variant={action.type === 'urgent' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {action.type}
                          </Badge>
                        </div>
                        <p className="text-xs mt-2 font-medium">{action.action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Member Profile */}
              <MemberProfile member={selectedMember} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};