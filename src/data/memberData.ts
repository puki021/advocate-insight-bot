export interface MemberPersona {
  id: string;
  name: string;
  description: string;
  behaviors: string[];
  preferences: string[];
  painPoints: string[];
}

export interface MemberDemographics {
  age: number;
  location: string;
  income: string;
  education: string;
  occupation: string;
  familyStatus: string;
  customerSince: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface JourneyEvent {
  id: string;
  timestamp: Date;
  touchpoint: string;
  activity: string;
  channel: 'web' | 'mobile' | 'call_center' | 'email' | 'chat' | 'store';
  outcome: 'success' | 'abandoned' | 'escalated' | 'converted';
  details: any;
}

export interface MemberProfile {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  persona: MemberPersona;
  demographics: MemberDemographics;
  journey: JourneyEvent[];
  currentContext: {
    lastInteraction: Date;
    activeIssues: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    riskScore: number;
    lifetimeValue: number;
  };
}

export const memberPersonas: MemberPersona[] = [
  {
    id: 'tech_savvy',
    name: 'Tech-Savvy Professional',
    description: 'Digital-first customer who prefers self-service and online channels',
    behaviors: ['Uses mobile app frequently', 'Prefers digital communication', 'Quick decision maker'],
    preferences: ['Online chat', 'Email notifications', 'Mobile-first experience'],
    painPoints: ['Long wait times', 'Repetitive information requests', 'Inconsistent experiences']
  },
  {
    id: 'traditional',
    name: 'Traditional Customer',
    description: 'Prefers human interaction and established processes',
    behaviors: ['Calls for most inquiries', 'Values personal relationships', 'Careful decision maker'],
    preferences: ['Phone calls', 'In-person service', 'Paper statements'],
    painPoints: ['Complex digital processes', 'Automated systems', 'Lack of personal touch']
  },
  {
    id: 'price_conscious',
    name: 'Price-Conscious Buyer',
    description: 'Highly sensitive to costs and seeks value optimization',
    behaviors: ['Compares prices extensively', 'Uses promotions', 'Negotiates deals'],
    preferences: ['Cost transparency', 'Discount notifications', 'Value propositions'],
    painPoints: ['Hidden fees', 'Expensive add-ons', 'Complex pricing']
  }
];

export const mockMemberProfiles: MemberProfile[] = [
  {
    memberId: 'M001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    persona: memberPersonas[0],
    demographics: {
      age: 34,
      location: 'San Francisco, CA',
      income: '$85,000-$100,000',
      education: 'Bachelor\'s Degree',
      occupation: 'Software Engineer',
      familyStatus: 'Single',
      customerSince: '2020-03-15',
      tier: 'gold'
    },
    journey: [
      {
        id: 'j1',
        timestamp: new Date('2024-01-15T09:00:00'),
        touchpoint: 'Website Visit',
        activity: 'Product Research',
        channel: 'web',
        outcome: 'success',
        details: { pagesViewed: 5, timeSpent: '15min' }
      },
      {
        id: 'j2',
        timestamp: new Date('2024-01-15T14:30:00'),
        touchpoint: 'Mobile App',
        activity: 'Account Update',
        channel: 'mobile',
        outcome: 'success',
        details: { feature: 'profile_update' }
      },
      {
        id: 'j3',
        timestamp: new Date('2024-01-20T11:15:00'),
        touchpoint: 'Customer Support',
        activity: 'Billing Inquiry',
        channel: 'chat',
        outcome: 'escalated',
        details: { issue: 'billing_discrepancy', agent: 'Mike Chen' }
      },
      {
        id: 'j4',
        timestamp: new Date('2024-01-22T16:45:00'),
        touchpoint: 'Call Center',
        activity: 'Issue Resolution',
        channel: 'call_center',
        outcome: 'success',
        details: { resolution: 'billing_corrected', satisfaction: 4.5 }
      }
    ],
    currentContext: {
      lastInteraction: new Date('2024-01-22T16:45:00'),
      activeIssues: [],
      sentiment: 'positive',
      riskScore: 0.2,
      lifetimeValue: 12500
    }
  },
  {
    memberId: 'M002',
    name: 'Robert Smith',
    email: 'robert.smith@email.com',
    phone: '(555) 987-6543',
    persona: memberPersonas[1],
    demographics: {
      age: 58,
      location: 'Dallas, TX',
      income: '$60,000-$75,000',
      education: 'High School',
      occupation: 'Retail Manager',
      familyStatus: 'Married with children',
      customerSince: '2015-08-20',
      tier: 'platinum'
    },
    journey: [
      {
        id: 'j5',
        timestamp: new Date('2024-01-10T10:00:00'),
        touchpoint: 'Call Center',
        activity: 'Service Inquiry',
        channel: 'call_center',
        outcome: 'success',
        details: { duration: '12min', agent: 'Lisa Wong' }
      },
      {
        id: 'j6',
        timestamp: new Date('2024-01-18T15:20:00'),
        touchpoint: 'Branch Visit',
        activity: 'Document Submission',
        channel: 'store',
        outcome: 'success',
        details: { documents: ['insurance_claim'], staff: 'John Davis' }
      },
      {
        id: 'j7',
        timestamp: new Date('2024-01-25T09:30:00'),
        touchpoint: 'Call Center',
        activity: 'Follow-up Call',
        channel: 'call_center',
        outcome: 'success',
        details: { purpose: 'claim_status', satisfaction: 5.0 }
      }
    ],
    currentContext: {
      lastInteraction: new Date('2024-01-25T09:30:00'),
      activeIssues: ['insurance_claim_pending'],
      sentiment: 'neutral',
      riskScore: 0.3,
      lifetimeValue: 45000
    }
  }
];

export const getMemberById = (memberId: string): MemberProfile | undefined => {
  return mockMemberProfiles.find(member => member.memberId === memberId);
};

export const searchMembersByPhone = (phone: string): MemberProfile[] => {
  return mockMemberProfiles.filter(member => 
    member.phone.includes(phone.replace(/\D/g, ''))
  );
};

export const searchMembersByName = (name: string): MemberProfile[] => {
  return mockMemberProfiles.filter(member => 
    member.name.toLowerCase().includes(name.toLowerCase())
  );
};