import { User, UserRole } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Users, Code, Headphones } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (user: User) => void;
}

const roles = [
  {
    role: 'enterprise_leader' as UserRole,
    title: 'Enterprise Leader',
    description: 'Strategic insights and revenue analytics',
    icon: Building2,
    color: 'bg-gradient-primary',
  },
  {
    role: 'supervisor' as UserRole,
    title: 'Supervisor',
    description: 'Team performance and operational metrics',
    icon: Users,
    color: 'bg-accent',
  },
  {
    role: 'developer' as UserRole,
    title: 'Developer',
    description: 'System performance and technical analytics',
    icon: Code,
    color: 'bg-info',
  },
  {
    role: 'agent' as UserRole,
    title: 'Agent',
    description: 'Personal performance and call insights',
    icon: Headphones,
    color: 'bg-success',
  },
];

export const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  const handleRoleSelect = (role: UserRole, title: string) => {
    const user: User = {
      id: '1',
      name: `${title} User`,
      role,
    };
    onSelectRole(user);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Advocate Insight Bot
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered call center analytics and insights
          </p>
          <p className="text-muted-foreground mt-2">
            Select your role to access personalized dashboards and reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map(({ role, title, description, icon: Icon, color }) => (
            <Card 
              key={role} 
              className="p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group border-border/50 bg-gradient-card"
              onClick={() => handleRoleSelect(role, title)}
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Select Role
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};