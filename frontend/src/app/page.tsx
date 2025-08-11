'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/page';
import { TenantSwitcher } from '@/components/TenantSwitcher';
import { Can } from '@/components/Can';

interface Message {
  id: number;
  text: string;
}

export default function Home() {
  const { isAuthenticated, isLoading, currentTenant, logout } = useAuthContext();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!isAuthenticated || !currentTenant) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-ID': String(currentTenant.id),
          },
        });

        if (response.status === 401) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchMessages();
  }, [isAuthenticated, router, API_URL, currentTenant, logout]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentTenant) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': String(currentTenant.id),
        },
        body: JSON.stringify({ text: newMessage }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      const createdMessage = await response.json();
      setMessages([...messages, createdMessage]);
      setNewMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8 w-full">
          <div>
            <h1 className="text-4xl font-bold">Message Board</h1>
            {currentTenant && (
              <p className="text-lg text-gray-500">{currentTenant.name}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TenantSwitcher />
            <Can permission="settings:view">
              <Link
                href="/settings"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Settings
              </Link>
            </Can>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

        <Can permission="messages:create">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a new message..."
                className="flex-grow p-2 border border-gray-300 rounded-md text-black"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </form>
        </Can>

        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="p-4 bg-gray-100 rounded-md shadow">
                <p className="text-gray-800">{message.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet. Be the first to post!</p>
          )}
        </div>
      </div>
    </main>
  );
}
