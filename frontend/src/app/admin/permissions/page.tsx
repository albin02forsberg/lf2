'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Permission {
  id: number;
  name: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPermissionName, setNewPermissionName] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [API_URL]);

  const handleCreatePermission = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newPermissionName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create permission');
      }

      setNewPermissionName('');
      fetchPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeletePermission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this permission?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/permissions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete permission');
      }

      fetchPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleEditPermission = async (id: number, currentName: string) => {
    const newName = prompt('Enter new permission name:', currentName);
    if (newName && newName !== currentName) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/permissions/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
          throw new Error('Failed to update permission');
        }

        fetchPermissions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
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
      <h1 className="text-3xl font-bold mb-4">Manage Permissions</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Permission</h2>
        <form onSubmit={handleCreatePermission} className="flex gap-2">
          <input
            type="text"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            placeholder="Permission name"
            className="flex-grow p-2 border border-gray-300 rounded-md text-black"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td className="py-2">{permission.id}</td>
                <td className="py-2">{permission.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleEditPermission(permission.id, permission.name)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePermission(permission.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
