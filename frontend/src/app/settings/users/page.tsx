'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Can } from '@/components/Can';

interface User {
  id: number;
  email: string;
  userRoles: { role: { id: number; name: string } }[];
}

interface Role {
  id: number;
  name: string;
}

export default function UsersPage() {
  const { currentTenant } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!currentTenant) return;

    const fetchUsers = async () => {
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
    };

    const fetchRoles = async () => {
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
    };

    fetchUsers();
    fetchRoles();
  }, [currentTenant, API_URL]);

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/groups/users/${userId}/roles/${roleId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': String(currentTenant!.id),
          },
        },
      );
      if (!response.ok) throw new Error('Failed to update role');

      // Refetch users to show the updated role
      const updatedUsers = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant!.id),
        },
      }).then((res) => res.json());
      setUsers(updatedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between">
          <h1 className="text-4xl font-bold">Manage Users</h1>
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
        <div className="p-6 bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-black">Email</th>
                <th className="text-left text-black">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="text-black">{user.email}</td>
                  <td>
                    <Can permission="users:edit">
                      <select
                        value={
                          user.userRoles.find((ur) => ur.role)?.role.id || ''
                        }
                        onChange={(e) =>
                          handleRoleChange(user.id, Number(e.target.value))
                        }
                        className="p-2 border rounded text-black"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
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
