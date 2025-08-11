'use client';

import { useTenant } from '@/contexts/TenantContext';

export const TenantSwitcher = () => {
  const { tenants, currentTenant, setCurrentTenant } = useTenant();

  if (tenants.length === 0) {
    return <div>No tenants found.</div>;
  }

  return (
    <div className="p-4">
      <label htmlFor="tenant-select" className="mr-2">Current Tenant:</label>
      <select
        id="tenant-select"
        value={currentTenant?.id || ''}
        onChange={(e) => {
          const tenantId = parseInt(e.target.value, 10);
          const selectedTenant = tenants.find((t) => t.id === tenantId);
          setCurrentTenant(selectedTenant || null);
        }}
        className="p-2 border rounded"
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
