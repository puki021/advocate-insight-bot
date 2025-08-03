import { User, UserRole } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Code, Headphones, Zap } from 'lucide-react';
import { AuthUser, canAccessRole } from '@/data/authData';
import matrixBg from '@/assets/matrix-bg.jpg';
import circuitBoard from '@/assets/circuit-board.jpg';

interface RoleSelectorProps {
  currentUser: AuthUser;
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

export const RoleSelector = ({ currentUser, onSelectRole }: RoleSelectorProps) => {
  const handleRoleSelect = (role: UserRole, title: string) => {
    if (canAccessRole(currentUser, role)) {
      const user: User = {
        id: currentUser.id,
        name: currentUser.name,
        role,
      };
      onSelectRole(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated circuit background */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center animate-pulse"
        style={{ backgroundImage: `url(${circuitBoard})` }}
      ></div>
      
      {/* Matrix-style overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${matrixBg})` }}
      ></div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header with Optum PRIME branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-autobot-glow">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                OPTUM PRIME
              </h1>
              <p className="text-lg text-slate-300 font-semibold tracking-wider">
                ADVANCED AI ANALYTICS PLATFORM
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 mb-8">
            <p className="text-xl text-slate-200 mb-2">
              Welcome, <span className="text-blue-400 font-semibold">{currentUser.name}</span>
            </p>
            <p className="text-slate-400">
              Access Level: <span className="text-cyan-400">{currentUser.accessLevel}</span> | 
              Department: <span className="text-cyan-400">{currentUser.department}</span>
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Select your operational role to access specialized analytics and insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map(({ role, title, description, icon: Icon, color }) => {
            const hasAccess = canAccessRole(currentUser, role);
            return (
              <Card 
                key={role} 
                className={`p-6 transition-all duration-300 border border-blue-500/30 relative overflow-hidden ${
                  hasAccess 
                    ? 'cursor-pointer group hover:shadow-autobot bg-slate-800/80 backdrop-blur-sm hover:scale-[1.02]' 
                    : 'opacity-50 cursor-not-allowed bg-slate-900/50'
                }`}
                onClick={() => hasAccess && handleRoleSelect(role, title)}
              >
                {/* Gradient border effect for active cards */}
                {hasAccess && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <div className="text-center space-y-4 relative z-10">
                  <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mx-auto ${
                    hasAccess ? 'group-hover:scale-110 transition-transform duration-300' : ''
                  }`}>
                    <Icon className={`w-8 h-8 ${hasAccess ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${hasAccess ? 'text-slate-200' : 'text-gray-500'}`}>
                      {title}
                    </h3>
                    <p className={`text-sm mt-1 ${hasAccess ? 'text-slate-400' : 'text-gray-600'}`}>
                      {description}
                    </p>
                  </div>
                  <Button 
                    variant={hasAccess ? "default" : "secondary"}
                    size="sm" 
                    className={`w-full ${
                      hasAccess 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hasAccess}
                  >
                    {hasAccess ? 'Access Role' : 'Restricted'}
                  </Button>
                </div>
                
                {/* Access denied overlay */}
                {!hasAccess && (
                  <div className="absolute inset-0 bg-red-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 text-xs font-semibold bg-red-900/50 px-2 py-1 rounded">
                      INSUFFICIENT ACCESS
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        
        {/* Access info footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Role access is determined by your authorization level. Contact your system administrator for access upgrades.
          </p>
        </div>
      </div>
    </div>
  );
};