"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { displayPrice } from "@/components/PropertyCard";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const property = state.properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-bold">العقار غير موجود</h2>
      </div>
    );
  }

  const isFav = state.favorites.includes(property.id);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="rounded-2xl overflow-hidden mb-4">
            <img
              src={property.images[selectedImage]}
              alt={property.propertyType}
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`rounded-lg overflow-hidden border-2 ${
                  idx === selectedImage ? "border-emerald-500" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500 px-4 py-1 rounded-full">{property.operation}</span>
            <span className={`px-4 py-1 rounded-full ${property.status === "متوفر" ? "bg-green-500" : "bg-yellow-500"}`}>
              {property.status}
            </span>
            {property.featured && <span className="bg-amber-500 px-4 py-1 rounded-full">مميز</span>}
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {property.propertyType} في {property.city} - {property.district}
          </h1>

          <div className="text-3xl font-bold text-amber-500 mb-6">{displayPrice(property)}</div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-700 p-4 rounded-xl">
              <div className="text-gray-400 mb-1">المساحة</div>
              <div className="text-xl font-bold">{property.area} م²</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-xl">
              <div className="text-gray-400 mb-1">الغرف</div>
              <div className="text-xl font-bold">{property.rooms}</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-xl">
              <div className="text-gray-400 mb-1">الصالونات</div>
              <div className="text-xl font-bold">{property.salons}</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-xl">
              <div className="text-gray-400 mb-1">الحمامات</div>
              <div className="text-xl font-bold">{property.bathrooms}</div>
            </div>
            {property.floor > 0 && (
              <div className="bg-slate-700 p-4 rounded-xl">
                <div className="text-gray-400 mb-1">الطابق</div>
                <div className="text-xl font-bold">{property.floor}</div>
              </div>
            )}
            {property.year > 0 && (
              <div className="bg-slate-700 p-4 rounded-xl">
                <div className="text-gray-400 mb-1">سنة البناء</div>
                <div className="text-xl font-bold">{property.year}</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {property.garage && <span className="bg-slate-700 px-4 py-2 rounded-full">🚗 مرآب</span>}
            {property.elevator && <span className="bg-slate-700 px-4 py-2 rounded-full">🛗 مصعد</span>}
            {property.balcony && <span className="bg-slate-700 px-4 py-2 rounded-full">🌳 بلكون</span>}
            {property.garden && <span className="bg-slate-700 px-4 py-2 rounded-full">🌳 حديقة</span>}
            {property.pool && <span className="bg-slate-700 px-4 py-2 rounded-full">🏊 مسبح</span>}
            {property.guard && <span className="bg-slate-700 px-4 py-2 rounded-full">👮 حراسة</span>}
          </div>

          <div className="bg-slate-700 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-3">الوصف</h3>
            <p className="text-gray-300">{property.description}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => dispatch({ type: "TOGGLE_FAV", payload: property.id })}
              className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold transition"
            >
              {isFav ? "❤️ حذف من المفضلة" : "🤍 إضافة للمفضلة"}
            </button>
            <a
              href={`https://wa.me/212600000000?text=مرحباً، أنا مهتم بالعقار #${property.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold text-center transition"
            >
              💬 تواصل واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
