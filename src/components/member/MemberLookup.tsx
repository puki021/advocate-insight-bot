import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Phone, Mail, MapPin, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { MemberProfile, getMemberById, searchMembersByPhone, searchMembersByName } from '@/data/memberData';

interface MemberLookupProps {
  onMemberSelect: (member: MemberProfile) => void;
}

export const MemberLookup: React.FC<MemberLookupProps> = ({ onMemberSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MemberProfile[]>([]);
  const [searchType, setSearchType] = useState<'name' | 'phone' | 'id'>('name');

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    let results: MemberProfile[] = [];
    
    switch (searchType) {
      case 'name':
        results = searchMembersByName(searchTerm);
        break;
      case 'phone':
        results = searchMembersByPhone(searchTerm);
        break;
      case 'id':
        const member = getMemberById(searchTerm);
        results = member ? [member] : [];
        break;
    }
    
    setSearchResults(results);
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Member Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="flex gap-1">
              {(['name', 'phone', 'id'] as const).map((type) => (
                <Button
                  key={type}
                  variant={searchType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((member) => (
            <Card key={member.memberId} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={() => onMemberSelect(member)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge className={getTierColor(member.demographics.tier)}>
                          {member.demographics.tier}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {member.demographics.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Customer since {new Date(member.demographics.customerSince).getFullYear()}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          LTV: ${member.currentContext.lifetimeValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-sm font-medium ${getSentimentColor(member.currentContext.sentiment)}`}>
                      {member.currentContext.sentiment.toUpperCase()}
                    </div>
                    
                    {member.currentContext.activeIssues.length > 0 && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">{member.currentContext.activeIssues.length} active issues</span>
                      </div>
                    )}
                    
                    {member.currentContext.riskScore > 0.5 && (
                      <Badge variant="destructive" className="text-xs">
                        High Risk
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchTerm && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No members found matching "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};