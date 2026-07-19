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

  // ✅✅✅ التحقق من صلاحيات المستخدم:
  const isAdmin = state.currentUser?.role === "مدير";

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-white">العقار غير موجود</h2>
        <p className="text-gray-400 mt-2">العقار المطلوب غير موجود أو تم حذفه</p>
      </div>
    );
  }

  const isFav = state.favorites.includes(property.id);

  // ✅ دوال الاتصال
  const openOwnerWhatsapp = () => {
    const number = property.ownerWhatsapp || property.ownerPhone;
    if (number) {
      window.open(`https://wa.me/212${number.replace(/^0/, '')}?text=مرحباً، أنا مهتم بالعقار #${property.id}`, '_blank');
    }
  };

  const callOwnerPhone = () => {
    if (property.ownerPhone) {
      window.open(`tel:${property.ownerPhone}`, '_self');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* ===== قسم الصور ===== */}
        <div>
          <div className="rounded-2xl overflow-hidden mb-4 relative group">
            <img
              src={property.images[selectedImage]}
              alt={property.propertyType}
              className="w-full h-[400px] object-cover"
            />
            {/* زر المفضلة */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_FAV", payload: property.id })}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:scale-110 transition shadow-lg"
            >
              <span className={`text-2xl ${isFav ? "text-red-500" : "text-gray-500"}`}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </button>
          </div>

          {/* صور مصغرة */}
          <div className="grid grid-cols-4 gap-3">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  idx === selectedImage 
                    ? "border-emerald-500 ring-2 ring-emerald-500/30" 
                    : "border-transparent hover:border-gray-500"
                }`}
              >
                <img
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  className="w-full h-24 object-cover hover:scale-110 transition"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ===== قسم المعلومات ===== */}
        <div className="text-white">
          {/* شارات الحالة */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-emerald-500 px-4 py-1.5 rounded-full text-sm font-medium">
              {property.operation}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              property.status === "متوفر" ? "bg-green-500" : "bg-yellow-500"
            }`}>
              {property.status}
            </span>
            {property.featured && (
              <span className="bg-amber-500 px-4 py-1.5 rounded-full text-sm font-medium">
                ⭐ مميز
              </span>
            )}
          </div>

          {/* العنوان */}
          <h1 className="text-3xl font-bold mb-4 leading-relaxed">
            {property.propertyType} في {property.city} - {property.district}
          </h1>

          {/* السعر */}
          <div className="text-3xl font-bold text-amber-500 mb-8 pb-6 border-b border-slate-700">
            {displayPrice(property)}
            {property.negotiable && (
              <span className="text-sm text-gray-400 mr-3">(قابل للتفاوض)</span>
            )}
          </div>

          {/* المواصفات الرئيسية */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">📐 المساحة</div>
              <div className="text-xl font-bold">{property.area} م²</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🛏️ الغرف</div>
              <div className="text-xl font-bold">{property.rooms}</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🛋️ الصالونات</div>
              <div className="text-xl font-bold">{property.salons}</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🚿 الحمامات</div>
              <div className="text-xl font-bold">{property.bathrooms}</div>
            </div>
            {property.floor > 0 && (
              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
                <div className="text-gray-400 text-sm mb-1">🏢 الطابق</div>
                <div className="text-xl font-bold">{property.floor}</div>
              </div>
            )}
            {property.year > 0 && (
              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
                <div className="text-gray-400 text-sm mb-1">📅 سنة البناء</div>
                <div className="text-xl font-bold">{property.year}</div>
              </div>
            )}
          </div>

          {/* المميزات الإضافية */}
          <div className="flex flex-wrap gap-3 mb-8">
            {property.garage && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🚗 مرآب
              </span>
            )}
            {property.elevator && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🛗 مصعد
              </span>
            )}
            {property.balcony && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🌿 بلكون
              </span>
            )}
            {property.garden && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🌳 حديقة
              </span>
            )}
            {property.pool && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🏊 مسبح
              </span>
            )}
            {property.guard && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                👮 حراسة
              </span>
            )}
          </div>

          {/* الوصف */}
          <div className="bg-slate-700/30 p-6 rounded-xl mb-8 border border-slate-600">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              📝 الوصف
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {property.description || "لا يوجد وصف متاح لهذا العقار"}
            </p>
          </div>

          {/* ✅✅✅ قسم صاحب العقار - للمدير فقط! */}
          {isAdmin && property.ownerName && (
            <div 
              className="mb-8 p-5 rounded-xl border-2 border-dashed"
              style={{
                background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.5) 0%, rgba(69, 26, 3, 0.7) 100%)',
                borderColor: '#f59e0b'
              }}
            >
              {/* رأس القسم */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  👤 معلومات صاحب العقار
                </h3>
                <span className="text-xs font-bold bg-red-600/80 text-white px-3 py-1 rounded-full animate-pulse">
                  🔒 خاص - مدير فقط
                </span>
              </div>

              {/* اسم المالك */}
              <p className="text-amber-100 font-semibold text-lg mb-4">
                الاسم: {property.ownerName}
              </p>
              
              {/* أزرار الاتصال */}
              <div className="flex flex-wrap gap-3">
                {/* زر الهاتف */}
                {property.ownerPhone && (
                  <button
                    onClick={callOwnerPhone}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    <span className="text-lg">☎️</span>
                    <span dir="ltr">{property.ownerPhone}</span>
                  </button>
                )}
                
                {/* زر الواتساب */}
                {(property.ownerWhatsapp || property.ownerPhone) && (
                  <button
                    onClick={openOwnerWhatsapp}
                    className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                  >
                    <span className="text-lg">💬</span>
                    <span>واتساب مباشر</span>
                  </button>
                )}

                {!property.ownerWhatsapp && !property.ownerPhone && (
                  <p className="text-amber-300/70 text-sm">
                    ⚠️ لم يتم إضافة رقم اتصال لهذا العقار
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ✅✅✅ للزوار والموظفين - نموذج الاستفسار */}
          {!isAdmin && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-6 rounded-xl border border-emerald-700/50">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  📩 مهتم بهذا العقار؟
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  تواصل معنا وسنرد عليك في أقرب وقت ممكن
                </p>
                
                <button
                  onClick={() => alert('شكراً على اهتمامك!\n\nسيتم التواصل معك قريباً عبر:\n- البريد الإلكتروني\n- أو رقم الهاتف\n\nأو يمكنك زيارة مكتبنا')}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02]"
                >
                  📞 طلب التواصل بشأن هذا العقار
                </button>

                <div className="mt-4 pt-4 border-t border-emerald-800/50">
                  <p className="text-xs text-gray-500 text-center">
                    ⏰ وقت الرد: خلال 24 ساعة في أيام العمل
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== أزرار أسفل الصفحة ===== */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => dispatch({ type: "TOGGLE_FAV", payload: property.id })}
              className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3.5 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] border border-slate-600"
            >
              {isFav ? "❤️ إزالة من المفضلة" : "🤍 إضافة للمفضلة"}
            </button>
            
            {/* ✅ واتساب عام - لجميع المستخدمين */}
            <a
              href={`https://wa.me/212600000000?text=مرحباً، أنا مهتم بالعقار #${property.id} - ${property.propertyType} في ${property.city}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3.5 rounded-xl font-bold text-center transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              💬 تواصل معنا
            </a>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <p className="text-xs text-gray-500">
              🔖 رقم العقار: #{property.id} | 
              آخر تحديث: {new Date(property.updatedAt).toLocaleDateString('ar-MA')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
