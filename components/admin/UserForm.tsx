"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserForm({ onUserAdded }: { onUserAdded?: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.from("users").insert([{ email, role }]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setEmail("");
      setRole("");
      setSuccess(true);
      if (onUserAdded) onUserAdded();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Email</label>
        <input
          className="border px-2 py-1 w-full"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setSuccess(false);
          }}
          required
          type="email"
        />
      </div>
      <div>
        <label>Role</label>
        <input
          className="border px-2 py-1 w-full"
          value={role}
          onChange={e => {
            setRole(e.target.value);
            setSuccess(false);
          }}
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">User added!</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}