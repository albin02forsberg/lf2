'use client';

import { useAuth } from '@/hooks/useAuth';

interface CanProps {
  children: React.ReactNode;
  permission: string;
}

export function Can({ children, permission }: CanProps) {
  const { permissions, isAdmin } = useAuth();

  const hasPermission = () => {
    if (isAdmin) {
      return true;
    }
    return permissions.includes(permission);
  };

  if (!hasPermission()) {
    return null;
  }

  return <>{children}</>;
}
