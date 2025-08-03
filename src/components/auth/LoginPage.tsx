import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Shield, AlertCircle } from 'lucide-react';
import { authenticateUser, AuthUser } from '@/data/authData';
import robotHero from '@/assets/robot-hero.jpg';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = authenticateUser(email, password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials or account disabled');
    }
    
    setIsLoading(false);
  };

  // Demo credentials helper
  const demoCredentials = [
    { role: 'Enterprise Leader', email: 'sarah.chen@optumprime.com', password: 'admin123' },
    { role: 'Supervisor', email: 'mike.rodriguez@optumprime.com', password: 'supervisor123' },
    { role: 'Developer', email: 'alex.thompson@optumprime.com', password: 'dev123' },
    { role: 'Agent', email: 'jessica.davis@optumprime.com', password: 'agent123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-circuit-pattern animate-pulse"></div>
      </div>
      
      {/* Hero robot image */}
      <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
        <img src={robotHero} alt="Autobot" className="w-48 h-48 object-cover rounded-full border-4 border-blue-500/30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-slate-800/80 backdrop-blur-sm border-blue-500/30 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  OPTUM PRIME
                </h1>
                <p className="text-sm text-slate-400">Advanced AI Analytics Platform</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure Access Portal</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert className="bg-red-900/50 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Access System'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Demo Credentials:</h3>
              <div className="space-y-2">
                {demoCredentials.map(({ role, email, password }) => (
                  <div key={role} className="text-xs text-slate-400 font-mono">
                    <div className="font-semibold text-blue-400">{role}:</div>
                    <div>Email: {email}</div>
                    <div>Password: {password}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};