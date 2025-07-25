"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function InvestmentForm({ onInvestmentAdded }: { onInvestmentAdded?: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
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
    const { error } = await supabase.from("investments").insert([
      { name, type, amount, status }
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setName("");
      setType("");
      setAmount("");
      setStatus("");
      setSuccess(true);
      if (onInvestmentAdded) onInvestmentAdded();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <input
          className="border px-2 py-1 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Type</label>
        <input
          className="border px-2 py-1 w-full"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Amount</label>
        <input
          className="border px-2 py-1 w-full"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          type="number"
        />
      </div>
      <div>
        <label>Status</label>
        <input
          className="border px-2 py-1 w-full"
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            setSuccess(false);
          }}
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">Investment added!</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Investment"}
      </button>
    </form>
  );
}