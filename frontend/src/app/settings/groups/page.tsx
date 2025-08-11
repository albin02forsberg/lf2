'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Can } from '@/components/Can';

interface Group {
  id: number;
  name: string;
  userGroups: { user: { id: number; email: string } }[];
  groupRoles: { role: { id: number; name: string } }[];
}

interface User {
  id: number;
  email: string;
}

interface Role {
  id: number;
  name: string;
}

export default function GroupsPage() {
  const { currentTenant } = useAuthContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchGroups = useCallback(async () => {
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  }, [currentTenant, API_URL]);

  const fetchUsers = useCallback(async () => {
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  }, [currentTenant, API_URL]);

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

  useEffect(() => {
    fetchGroups();
    fetchUsers();
    fetchRoles();
  }, [fetchGroups, fetchUsers, fetchRoles]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
        body: JSON.stringify({ name: newGroupName }),
      });
      setNewGroupName('');
      fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!currentTenant) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
      });
      fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  const handleUserMembershipChange = async (
    groupId: number,
    userId: number,
    checked: boolean,
  ) => {
    if (!currentTenant) return;
    const url = `${API_URL}/groups/${groupId}/users/${userId}`;
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
      fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  const handleRoleAssignmentChange = async (
    groupId: number,
    roleId: number,
    checked: boolean,
  ) => {
    if (!currentTenant) return;
    const url = `${API_URL}/groups/${groupId}/roles/${roleId}`;
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
      fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex justify-between">
          <h1 className="text-4xl font-bold">Manage Groups</h1>
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

        <Can permission="groups:create">
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Create New Group
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name..."
                className="flex-grow p-2 border border-gray-300 rounded-md text-black"
              />
              <button
                onClick={handleCreateGroup}
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
                <th className="text-left text-black">Group</th>
                <th className="text-left text-black">Members</th>
                <th className="text-left text-black">Roles</th>
                <th className="text-left text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td className="text-black align-top">{group.name}</td>
                  <td className="align-top">
                    <div className="flex flex-col">
                      {users.map((u) => (
                        <div key={u.id}>
                          <Can permission="groups:edit">
                            <input
                              type="checkbox"
                              id={`group-${group.id}-user-${u.id}`}
                              checked={group.userGroups.some(
                                (ug) => ug.user.id === u.id,
                              )}
                              onChange={(e) =>
                                handleUserMembershipChange(
                                  group.id,
                                  u.id,
                                  e.target.checked,
                                )
                              }
                            />
                          </Can>
                          <label
                            htmlFor={`group-${group.id}-user-${u.id}`}
                            className="ml-2 text-black"
                          >
                            {u.email}
                          </label>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="align-top">
                    <div className="flex flex-col">
                      {roles.map((r) => (
                        <div key={r.id}>
                          <Can permission="groups:edit">
                            <input
                              type="checkbox"
                              id={`group-${group.id}-role-${r.id}`}
                              checked={group.groupRoles.some(
                                (gr) => gr.role.id === r.id,
                              )}
                              onChange={(e) =>
                                handleRoleAssignmentChange(
                                  group.id,
                                  r.id,
                                  e.target.checked,
                                )
                              }
                            />
                          </Can>
                          <label
                            htmlFor={`group-${group.id}-role-${r.id}`}
                            className="ml-2 text-black"
                          >
                            {r.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="align-top">
                    <Can permission="groups:delete">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
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
