import { useState } from 'react';
import { User } from '@/types';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { LoginPage } from '@/components/auth/LoginPage';
import { AuthUser } from '@/data/authData';

const Index = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: AuthUser) => {
    setAuthUser(loggedInUser);
  };

  const handleRoleSelect = (selectedUser: User) => {
    setUser(selectedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthUser(null);
  };

  // Show login page if no authenticated user
  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show role selector if authenticated but no role selected
  if (!user) {
    return <RoleSelector currentUser={authUser} onSelectRole={handleRoleSelect} />;
  }

  // Show main interface
  return <ChatInterface user={user} onLogout={handleLogout} />;
};

export default Index;
