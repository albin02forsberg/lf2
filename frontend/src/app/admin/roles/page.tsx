'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [rolesResponse, permissionsResponse] = await Promise.all([
        fetch(`${API_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!rolesResponse.ok || !permissionsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const rolesData = await rolesResponse.json();
      const permissionsData = await permissionsResponse.json();
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [API_URL]);

  const handleCreateRole = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRoleName,
          permissions: selectedPermissions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create role');
      }

      setNewRoleName('');
      setSelectedPermissions([]);
      fetchRolesAndPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/roles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRolesAndPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Roles</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Role</h2>
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              id="roleName"
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Role name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Permissions</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([...selectedPermissions, permission.id]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter((id) => id !== permission.id)
                        );
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Role
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Permissions</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="py-2">{role.id}</td>
                <td className="py-2">{role.name}</td>
                <td className="py-2">
                  {role.permissions.map((p) => p.name).join(', ')}
                </td>
                <td className="py-2">
                  <button className="text-blue-500 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDeleteRole(role.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
