'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/groups', label: 'Groups' },
    { href: '/admin/roles', label: 'Roles' },
    { href: '/admin/permissions', label: 'Permissions' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Admin</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded ${
                  pathname === item.href ? 'bg-gray-700' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
