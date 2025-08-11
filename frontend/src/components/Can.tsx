'use client';

import { useAuthContext } from '@/contexts/AuthContext';

interface CanProps {
  children: React.ReactNode;
  permission: string;
}

export function Can({ children, permission }: CanProps) {
  const { permissions, user } = useAuthContext();

  if (user?.is_superadmin) {
    return <>{children}</>;
  }

  if (permissions.includes(permission)) {
    return <>{children}</>;
  }

  return null;
}
