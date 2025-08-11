'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export const TenantSwitcher = () => {
  const { tenants, currentTenant, switchTenant } = useAuthContext();

  if (!tenants || tenants.length === 0) {
    return null;
  }

  return (
    <div>
      <select
        id="tenant-select"
        value={currentTenant?.id || ''}
        onChange={(e) => {
          const tenantId = parseInt(e.target.value, 10);
          switchTenant(tenantId);
        }}
        className="p-2 border rounded text-black"
      >
        {tenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
    </div>
  );
};
