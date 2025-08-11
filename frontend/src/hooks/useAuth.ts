'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  permissions: string[];
  isAdmin: boolean;
  // other token properties
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      setPermissions([]);
      setIsAdmin(false);
      // Do not redirect here, as this hook can be used on public pages
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        const decoded = jwtDecode<DecodedToken>(token);
        setPermissions(decoded.permissions);
        setIsAdmin(decoded.isAdmin);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setPermissions([]);
        setIsAdmin(false);
      }
    } catch (_error) {
      console.log(_error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setPermissions([]);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [router, API_URL]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (access_token: string) => {
    localStorage.setItem('token', access_token);
    await validateToken();
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setPermissions([]);
    setIsAdmin(false);
    router.push('/login');
  };

  return { isAuthenticated, isLoading, permissions, isAdmin, login, logout, validateToken };
}
