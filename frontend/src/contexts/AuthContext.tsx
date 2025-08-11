'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  is_superadmin: boolean;
}

interface Tenant {
  id: number;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  permissions: string[];
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  switchTenant: (tenantId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setUser(null);
      router.push('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const {
          sub,
          email,
          is_superadmin,
          tenants: userTenants,
          permissionsByTenant,
        } = decoded;
        setUser({ id: sub, email, is_superadmin });
        setTenants(userTenants);

        const storedTenantId = localStorage.getItem('tenantId');
        const tenantToSet =
          userTenants.find((t: any) => t.id === Number(storedTenantId)) ||
          userTenants[0];

        if (tenantToSet) {
          setCurrentTenant(tenantToSet);
          setPermissions(permissionsByTenant[tenantToSet.id] || []);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Token validation failed', error);
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, API_URL]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = (token: string) => {
    const decoded: any = jwtDecode(token);
    const {
      sub,
      email,
      is_superadmin,
      tenants: userTenants,
      permissionsByTenant,
    } = decoded;

    localStorage.setItem('token', token);
    setUser({ id: sub, email, is_superadmin });
    setTenants(userTenants);

    const tenantToSet = userTenants[0];
    if (tenantToSet) {
      localStorage.setItem('tenantId', String(tenantToSet.id));
      setCurrentTenant(tenantToSet);
      setPermissions(permissionsByTenant[tenantToSet.id] || []);
    }

    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
    setPermissions([]);
    router.push('/login');
  };

  const switchTenant = (tenantId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      localStorage.setItem('tenantId', String(tenantId));
      setCurrentTenant(tenant);
      const decoded: any = jwtDecode(token);
      setPermissions(decoded.permissionsByTenant[tenantId] || []);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        tenants,
        currentTenant,
        permissions,
        isLoading,
        login,
        logout,
        switchTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
