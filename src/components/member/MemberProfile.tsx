import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-react';
import { MemberProfile as MemberProfileType } from '@/data/memberData';
import { JourneyMap } from './JourneyMap';

interface MemberProfileProps {
  member: MemberProfileType;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({ member }) => {
  const getRiskColor = (riskScore: number) => {
    if (riskScore < 0.3) return 'text-green-600';
    if (riskScore < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return 'Low';
    if (riskScore < 0.7) return 'Medium';
    return 'High';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <Badge className={getTierColor(member.demographics.tier)}>
                  {member.demographics.tier} Member
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{member.memberId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{member.demographics.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Since {new Date(member.demographics.customerSince).getFullYear()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className={`text-lg font-semibold ${getRiskColor(member.currentContext.riskScore)}`}>
                Risk: {getRiskLevel(member.currentContext.riskScore)}
              </div>
              <div className="text-sm text-muted-foreground">
                LTV: ${member.currentContext.lifetimeValue.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{member.demographics.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Income:</span>
              <span className="font-medium">{member.demographics.income}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Education:</span>
              <span className="font-medium">{member.demographics.education}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupation:</span>
              <span className="font-medium">{member.demographics.occupation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Family Status:</span>
              <span className="font-medium">{member.demographics.familyStatus}</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sentiment:</span>
              <Badge variant={member.currentContext.sentiment === 'positive' ? 'default' : 
                             member.currentContext.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                {member.currentContext.sentiment}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Risk Score:</span>
                <span className={`font-medium ${getRiskColor(member.currentContext.riskScore)}`}>
                  {Math.round(member.currentContext.riskScore * 100)}%
                </span>
              </div>
              <Progress value={member.currentContext.riskScore * 100} className="h-2" />
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Interaction:</span>
              <span className="font-medium">
                {member.currentContext.lastInteraction.toLocaleDateString()}
              </span>
            </div>
            
            {member.currentContext.activeIssues.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-muted-foreground">Active Issues:</span>
                </div>
                <div className="space-y-1">
                  {member.currentContext.activeIssues.map((issue, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {issue.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Persona Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Customer Persona: {member.persona.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{member.persona.description}</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Behaviors</h4>
              <ul className="space-y-1 text-sm">
                {member.persona.behaviors.map((behavior, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>{behavior}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Preferences</h4>
              <ul className="space-y-1 text-sm">
                {member.persona.preferences.map((preference, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{preference}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Pain Points</h4>
              <ul className="space-y-1 text-sm">
                {member.persona.painPoints.map((painPoint, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>{painPoint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Map */}
      <JourneyMap events={member.journey} memberName={member.name} />
    </div>
  );
};