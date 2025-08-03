import { User, UserRole } from '@/types';

export interface AuthUser extends User {
  email: string;
  password: string;
  isActive: boolean;
  department?: string;
  accessLevel: number; // 1-4, higher means more access
}

// Static user database
export const users: AuthUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@optumprime.com',
    password: 'admin123',
    role: 'enterprise_leader',
    isActive: true,
    department: 'Executive',
    accessLevel: 4
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@optumprime.com',
    password: 'supervisor123',
    role: 'supervisor',
    isActive: true,
    department: 'Operations',
    accessLevel: 3
  },
  {
    id: '3',
    name: 'Alex Thompson',
    email: 'alex.thompson@optumprime.com',
    password: 'dev123',
    role: 'developer',
    isActive: true,
    department: 'Technology',
    accessLevel: 2
  },
  {
    id: '4',
    name: 'Jessica Davis',
    email: 'jessica.davis@optumprime.com',
    password: 'agent123',
    role: 'agent',
    isActive: true,
    department: 'Customer Service',
    accessLevel: 1
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@optumprime.com',
    password: 'agent123',
    role: 'agent',
    isActive: false, // Disabled user
    department: 'Customer Service',
    accessLevel: 1
  }
];

// Role access configuration
export const roleAccess: Record<UserRole, { level: number; canAccess: UserRole[] }> = {
  enterprise_leader: { level: 4, canAccess: ['enterprise_leader', 'supervisor', 'developer', 'agent'] },
  supervisor: { level: 3, canAccess: ['supervisor', 'agent'] },
  developer: { level: 2, canAccess: ['developer'] },
  agent: { level: 1, canAccess: ['agent'] }
};

export const authenticateUser = (email: string, password: string): AuthUser | null => {
  const user = users.find(u => u.email === email && u.password === password && u.isActive);
  return user || null;
};

export const getAvailableRoles = (currentUser: AuthUser): UserRole[] => {
  const userAccess = roleAccess[currentUser.role];
  return userAccess.canAccess;
};

export const canAccessRole = (currentUser: AuthUser, targetRole: UserRole): boolean => {
  const availableRoles = getAvailableRoles(currentUser);
  return availableRoles.includes(targetRole);
};