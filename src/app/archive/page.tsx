"use client";

import { useApp } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function ArchivePage() {
  const { state } = useApp();
  const archived = state.properties.filter(
    (p) => p.status === "تم البيع" || p.status === "تم الكراء"
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">الأرشيف</h1>
      {archived.length === 0 ? (
        <div className="text-center text-gray-400 text-xl">لا توجد عقارات في الأرشيف</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archived.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
