"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useAppContext } from "@/contexts/AppContext";

export const formatPrice = (n: number) => {
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(2)} مليون`;
  } else if (n >= 1000) {
    return `${(n / 1000).toFixed(0)} ألف`;
  }
  return n.toString();
};

export const displayPrice = (property: Property) => {
  if (property.operation === "بيع") {
    return `${formatPrice(property.price)} درهم`;
  } else if (property.operation === "كراء") {
    return `${formatPrice(property.rent)} درهم / شهر`;
  } else {
    return `رهن: ${formatPrice(property.mortgage)} درهم`;
  }
};

export default function PropertyCard({
  property,
  actions = false,
}: {
  property: Property;
  actions?: boolean;
}) {
  const { state, dispatch } = useAppContext();
  const isFav = state.favorites.includes(property.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_FAV", payload: property.id });
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.propertyType}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={handleFav}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:scale-110 transition"
        >
          <span className={`text-2xl ${isFav ? "text-red-500" : "text-gray-500"}`}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">
            {property.operation}
          </span>
          <span className={`${property.status === "متوفر" ? "bg-green-500" : "bg-yellow-500"} text-white px-3 py-1 rounded-full text-sm`}>
            {property.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          #{property.id}
        </div>
      </div>
      <div className="p-4 text-white">
        <div className="text-lg font-bold mb-2">
          {property.propertyType} في {property.city} - {property.district}
        </div>
        <div className="text-sm text-gray-400 mb-3 flex gap-3">
          <span>📐 {property.area} م²</span>
          <span>🛏️ {property.rooms}</span>
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms}</span>}
        </div>
        <div className="text-xl font-bold text-amber-500 mb-4">
          {displayPrice(property)}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-center py-2 rounded-lg transition"
          >
            التفاصيل
          </Link>
          {actions && (
            <>
              <Link
                href={`/dashboard/properties/form?id=${property.id}`}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
              >
                تعديل
              </Link>
              <button
                onClick={() => {
                  dispatch({ type: "DELETE_PROPERTY", payload: property.id });
                  dispatch({ type: "SHOW_TOAST", payload: { message: "تم حذف العقار", type: "success" } });
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                حذف
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
