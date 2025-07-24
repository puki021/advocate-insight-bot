import { useState } from 'react';
import { User } from '@/types';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <RoleSelector onSelectRole={setUser} />;
  }

  return <ChatInterface user={user} onLogout={handleLogout} />;
};

export default Index;
