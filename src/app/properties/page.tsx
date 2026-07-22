"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function PropertiesPage() {
  const { state } = useAppContext();
  const [filter, setFilter] = useState("الكل");

  // ✅✅✅ تصفية العقارات: إخفاء المحذوفة + تطبيق الفلتر
  const filtered = state.properties.filter((p) => {
    // 🔒 إخفاء العقارات المحذوفة (Soft Delete)
    if (p.deleted) return false;
    
    // تطبيق فلاتر العرض
    if (filter === "الكل") return p.status === "متوفر";
    return p.operation === filter && p.status === "متوفر";
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">العقارات المتاحة</h1>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["الكل", "بيع", "كراء", "رهن"].map((f) => (
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
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}