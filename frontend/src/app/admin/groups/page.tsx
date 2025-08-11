'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface Role {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  roles: Role[];
}

export default function GroupsPage() {
  const { currentTenant } = useTenant();
  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!currentTenant) return;

    const fetchGroupsAndRoles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const [groupsResponse, rolesResponse] = await Promise.all([
          fetch(`${API_URL}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Tenant-ID': String(currentTenant.id),
            },
          }),
          fetch(`${API_URL}/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!groupsResponse.ok || !rolesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const groupsData = await groupsResponse.json();
        const rolesData = await rolesResponse.json();
        setGroups(groupsData);
        setRoles(rolesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndRoles();
  }, [API_URL, currentTenant]);

  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
        body: JSON.stringify({
          name: newGroupName,
          roles: selectedRoles,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      setNewGroupName('');
      setSelectedRoles([]);
      // Re-fetch groups
      const groupsResponse = await fetch(`${API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      const groupsData = await groupsResponse.json();
      setGroups(groupsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!currentTenant) return;
    if (!confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      // Re-fetch
      const groupsResponse = await fetch(`${API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      const groupsData = await groupsResponse.json();
      setGroups(groupsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
      <h1 className="text-3xl font-bold mb-4">Manage Groups for {currentTenant.name}</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Group</h2>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              id="groupName"
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={role.id}
                    checked={selectedRoles.includes(role.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role.id]);
                      } else {
                        setSelectedRoles(
                          selectedRoles.filter((id) => id !== role.id)
                        );
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{role.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Group
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Roles</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="py-2">{group.id}</td>
                <td className="py-2">{group.name}</td>
                <td className="py-2">
                  {group.roles.map((r) => r.name).join(', ')}
                </td>
                <td className="py-2">
                  <button className="text-blue-500 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDeleteGroup(group.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
