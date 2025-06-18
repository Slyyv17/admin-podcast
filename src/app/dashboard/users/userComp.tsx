'use client';

import { useState, useEffect } from 'react';
import DotsLoader from '@/components/ui/loader';

interface User {
  _id: { $oid: string } | string;
  fullname: string;
  email: string;
  role: string;
}

export default function UserComp() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-users`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : data.users;

        setUsers(Array.isArray(usersArray) ? usersArray : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <main className="p-4">
      {loading ? (
        <DotsLoader />
      ) : error ? (
        <div className="text-red-500 text-center text-lg">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 text-center">No users found.</div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pry-ff justify-start">
          {users.map((user) => (
            <div
              key={typeof user._id === 'string' ? user._id : user._id?.$oid}
              className="bg-[var(--bg-clr)] p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-[var(--acc-clr)] font-semibold flex items-center justify-center text-xl">
                  {getInitials(user.fullname)}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--txt-clr)]">{user.fullname}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                  user.role === 'admin'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-[var(--acc-clr)]'
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}