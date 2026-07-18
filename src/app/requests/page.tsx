"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";

export default function RequestsPage() {
  const { state } = useAppContext();
  const [filter, setFilter] = useState("الكل");

  const filtered = state.requests.filter((r) => {
    if (filter === "الكل") return true;
    return r.operation === filter;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">طلبات البحث</h1>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["الكل", "شراء", "كراء", "رهن"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full font-bold transition ${
              filter === f ? "bg-emerald-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((r) => (
          <RequestCard key={r.id} request={r} />
        ))}
      </div>
    </div>
  );
}
