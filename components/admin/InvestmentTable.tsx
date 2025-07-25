"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InvestmentTable() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestments() {
      const { data, error } = await supabase.from("investments").select("*");
      if (!error) setInvestments(data || []);
      setLoading(false);
    }
    fetchInvestments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investments</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.name}</td>
              <td>{inv.type}</td>
              <td>{inv.amount}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}