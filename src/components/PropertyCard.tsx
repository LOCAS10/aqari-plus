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
  const isAdmin = state.currentUser?.role === "مدير";

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_FAV", payload: property.id });
  };

  const openWhatsapp = () => {
    const number = property.ownerWhatsapp || property.ownerPhone;
    if (number) {
      window.open(`https://wa.me/212${number.replace(/^0/, '')}`, '_blank');
    }
  };

  const callPhone = () => {
    if (property.ownerPhone) {
      window.open(`tel:${property.ownerPhone}`, '_self');
    }
  };

  // ✅✅✅ دالة الحذف الجديدة مع API
  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      return;
    }

    try {
      console.log("🗑️ جاري حذف العقار...", property.id);
      
      // ✅ استدعاء API
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionName: 'properties',
          id: property.id,
        }),
      });

      const result = await response.json();
      console.log('📊 استجابة الخادم:', result);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'API Error');
      }

      console.log('✅ تم الحذف بنجاح!');
      
      // ✅ تحديث الواجهة
      dispatch({ type: "DELETE_PROPERTY", payload: property.id });
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "✅ تم حذف العقار!", type: "success" } 
      });

    } catch (error: any) {
      console.error("❌ فشل الحذف:", error);
      alert(`فشل الحذف: ${error.message}`);
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "❌ فشل الحذف", type: "error" } 
      });
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* صورة العقار */}
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

      {/* معلومات العقار */}
      <div className="p-4 text-white">
        <div className="text-lg font-bold mb-2">
          {property.propertyType} في {property.city} - {property.district}
        </div>
        <div className="text-sm text-gray-400 mb-3 flex gap-3 flex-wrap">
          <span>📐 {property.area} م²</span>
          <span>🛏️ {property.rooms}</span>
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms}</span>}
        </div>
        <div className="text-xl font-bold text-amber-500 mb-4">
          {displayPrice(property)}
        </div>

        {/* قسم صاحب العقار - للمدير فقط */}
        {isAdmin && property.ownerName && (
          <div 
            className="mb-4 p-3 rounded-lg border-2 border-dashed border-amber-400"
            style={{
              background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full">
                🔒 خاص - مدير فقط
              </span>
            </div>

            <p className="text-amber-200 font-semibold mb-2 text-sm">
              👤 {property.ownerName}
            </p>
            
            <div className="flex gap-2 flex-wrap">
              {property.ownerPhone && (
                <button
                  onClick={callPhone}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105"
                >
                  ☎️ <span dir="ltr">{property.ownerPhone}</span>
                </button>
              )}
              
              {(property.ownerWhatsapp || property.ownerPhone) && (
                <button
                  onClick={openWhatsapp}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105"
                >
                  💬 و
