"use client";

import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function FavoritesPage() {
  const { state } = useAppContext();
  const favorites = state.properties.filter((p) => state.favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">العقارات المفضلة</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 text-xl">لا توجد عقارات مفضلة بعد</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
