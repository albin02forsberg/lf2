'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface Group {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  groups: Group[];
}

export default function UsersPage() {
  const { currentTenant } = useTenant();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!currentTenant) return;

    const fetchUsersAndGroups = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const [usersResponse, groupsResponse] = await Promise.all([
          fetch(`${API_URL}/tenants/${currentTenant.id}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Tenant-ID': String(currentTenant.id),
            },
          }),
          fetch(`${API_URL}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Tenant-ID': String(currentTenant.id),
            },
          }),
        ]);

        if (!usersResponse.ok || !groupsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersResponse.json();
        const groupsData = await groupsResponse.json();
        setUsers(usersData);
        setGroups(groupsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndGroups();
  }, [API_URL, currentTenant]);

  const handleEditUserGroups = async (user: User) => {
    const selectedGroupIds = user.groups.map(g => g.id);
    const availableGroups = groups.filter(g => !selectedGroupIds.includes(g.id));

    // For simplicity, using prompt. In a real app, use a modal.
    const groupIdStr = prompt(`Enter Group ID to add for ${user.email} (available: ${availableGroups.map(g => `${g.id}: ${g.name}`).join(', ')})`);

    if (groupIdStr) {
      const groupId = parseInt(groupIdStr, 10);
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/groups/${groupId}/users/${user.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': String(currentTenant.id),
          },
        });
        // Re-fetch users
        const usersResponse = await fetch(`${API_URL}/tenants/${currentTenant.id}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Tenant-ID': String(currentTenant.id),
            },
          });
        const usersData = await usersResponse.json();
        setUsers(usersData);

      } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };


  if (!currentTenant) {
    return <div>Please select a tenant.</div>
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Users for {currentTenant.name}</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Groups</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2">{user.id}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">
                  {user.groups.map((g) => g.name).join(', ')}
                </td>
                <td className="py-2">
                  <button onClick={() => handleEditUserGroups(user)} className="text-blue-500 hover:underline mr-2">Edit Groups</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
