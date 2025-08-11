'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { currentTenant, user, isAuthenticated } = useAuthContext();
  const router = useRouter();

  if (!isAuthenticated) {
    return router.push('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between">
          <h1 className="text-4xl font-bold">
            Settings for {currentTenant?.name}
          </h1>
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to Home
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/settings/users">
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer h-full">
              <h2 className="text-2xl font-bold mb-2 text-black">Users</h2>
              <p className="text-black">Manage users and their roles.</p>
            </div>
          </Link>
          <Link href="/settings/roles">
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer h-full">
              <h2 className="text-2xl font-bold mb-2 text-black">Roles</h2>
              <p className="text-black">Manage roles and their permissions.</p>
            </div>
          </Link>
          <Link href="/settings/groups">
            <div className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer h-full">
              <h2 className="text-2xl font-bold mb-2 text-black">Groups</h2>
              <p className="text-black">Manage user groups.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
