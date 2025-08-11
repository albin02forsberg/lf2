'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from './MainLayout';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  const noLayoutRoutes = ['/login', '/signup'];
  const isNoLayoutRoute = noLayoutRoutes.includes(pathname);

  if (isNoLayoutRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default AppLayout;
