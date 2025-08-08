'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../sidebar';
import toast from 'react-hot-toast';

type User = {
  id: number;
  fullname: string;
  email: string;
  contact: string;
  role: string;
  is_active: number | string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const API_URL = import.meta.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/elnepal/backend/api';

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/get_users.php`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error('Failed to load users');
      }
    } catch {
      toast.error('Something went wrong');
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const suspendUser = async (id: number) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      const res = await fetch(`${API_URL}/suspend_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User suspended');
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to suspend');
      }
    } catch {
      toast.error('Error suspending user');
    }
  };

  const reactivateUser = async (id: number) => {
    if (!confirm('Are you sure you want to reactivate this user?')) return;

    try {
      const res = await fetch(`${API_URL}/reactivate_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User reactivated');
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to reactivate');
      }
    } catch {
      toast.error('Error reactivating user');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Users Management</h1>
        <p className="text-gray-600 mb-4">List and manage all registered users.</p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-200 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user, index) => {
                const isActive = Number(user.is_active) === 1;

                return (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.fullname}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.contact}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      {isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Suspended</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isActive ? (
                        <button
                          onClick={() => suspendUser(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => reactivateUser(user.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
