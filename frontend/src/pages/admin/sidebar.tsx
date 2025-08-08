'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package, PlusSquare, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/admin' },
  { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
  { name: 'Products', icon: <Package className="w-5 h-5" />, path: '/admin/products' },
  { name: 'Add Product', icon: <PlusSquare className="w-5 h-5" />, path: '/admin/products/add' },
  { name: 'Orders', icon: <PlusSquare className="w-5 h-5" />, path: '/admin/orders' },
  { name: 'Categories', icon: <Settings className="w-5 h-5" />, path: '/admin/categories' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition ${
              pathname === item.path ? 'bg-gray-800' : ''
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
