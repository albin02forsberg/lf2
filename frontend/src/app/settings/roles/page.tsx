'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Can } from '@/components/Can';

interface Role {
  id: number;
  name: string;
  rolePermissions: { permission: { id: number; name: string } }[];
}

interface Permission {
  id: number;
  name: string;
}

export default function RolesPage() {
  const { currentTenant } = useAuthContext();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchRoles = useCallback(async () => {
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  }, [currentTenant, API_URL]);

  const fetchPermissions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  }, [API_URL]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim() || !currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
        body: JSON.stringify({ name: newRoleName }),
      });
      setNewRoleName('');
      fetchRoles(); // Refetch roles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      fetchRoles(); // Refetch roles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  const handlePermissionChange = async (
    roleId: number,
    permissionId: number,
    checked: boolean,
  ) => {
    if (!currentTenant) return;
    const url = `${API_URL}/roles/${roleId}/permissions/${permissionId}`;
    const method = checked ? 'POST' : 'DELETE';
    try {
      const token = localStorage.getItem('token');
      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      fetchRoles(); // Refetch roles
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between">
          <h1 className="text-4xl font-bold">Manage Roles</h1>
          <Link
            href="/settings"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to Settings
          </Link>
        </div>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">
            {error}
          </p>
        )}

        <Can permission="roles:create">
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Create New Role
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="New role name..."
                className="flex-grow p-2 border border-gray-300 rounded-md text-black"
              />
              <button
                onClick={handleCreateRole}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </Can>

        <div className="p-6 bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-black">Role</th>
                <th className="text-left text-black">Permissions</th>
                <th className="text-left text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="text-black">{role.name}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((p) => (
                        <div key={p.id}>
                          <Can permission="roles:edit">
                            <input
                              type="checkbox"
                              id={`${role.id}-${p.id}`}
                              checked={role.rolePermissions.some(
                                (rp) => rp.permission.id === p.id,
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role.id,
                                  p.id,
                                  e.target.checked,
                                )
                              }
                            />
                          </Can>
                          <label
                            htmlFor={`${role.id}-${p.id}`}
                            className="ml-2 text-black"
                          >
                            {p.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Can permission="roles:delete">
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
