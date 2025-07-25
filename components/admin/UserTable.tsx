"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import UserTable from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from("users").select("*");
      if (!error) setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}