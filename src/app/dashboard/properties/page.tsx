"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function DashboardPropertiesPage() {
  const { state } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة العقارات</h1>
        <Link
          href="/dashboard/properties/form"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          إضافة عقار
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.properties.map((p) => (
          <PropertyCard key={p.id} property={p} actions />
        ))}
      </div>
    </div>
  );
}
