import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
}

const MOCK_USERS: Record<UserRole, MockUser> = {
  customer: {
    id: 'c1',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    role: 'customer',
    avatar: 'SW',
    phone: '(870) 555-0123',
  },
  provider: {
    id: '1',
    name: 'Deja Johnson',
    email: 'deja.johnson@email.com',
    role: 'provider',
    avatar: 'DJ',
    phone: '(870) 555-0456',
  },
  admin: {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@atn.local',
    role: 'admin',
    avatar: 'AU',
  },
};

interface AuthContextValue {
  user: MockUser;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>('customer');

  const user = role ? MOCK_USERS[role] : MOCK_USERS['customer'];
  const isAuthenticated = role !== null;

  function setRole(newRole: UserRole) {
    setRoleState(newRole);
  }

  function logout() {
    setRoleState(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
