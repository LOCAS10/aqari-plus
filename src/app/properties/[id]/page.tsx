"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { displayPrice } from "@/components/PropertyCard";
// ✅✅✅ استيراد دوال الإشعارات
import { addNotification } from "@/lib/notifications";
// ✅✅✅ استيراد دوال Firestore (لحفظظ الاستفسار)
import { addRequest as fbAddRequest } from "@/lib/firestore";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const property = state.properties.find(p => p.id === id);
  const router = useRouter();
  
  // ✅✅✅ حالة الحفظظ
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryType, setInquiryType] = useState<'زيارة' | 'شراء' | 'كراء'>('شراء');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    notes: '',
  });
  
  // ✅✅✅ التحقق من صلاحيات المستخدم
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

  // ✅✅✅ دوال الاتصال
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

  // ✅✅✅ دالة فتحقق من تسجيل الدخول
  const isLoggedIn = !!state.currentUser;

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
            <div className="bg-slice-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🛏 الغرف</div>
              <div className="text-xl font-bold">{property.rooms}</div>
            </div>
            <div className="bg-slice-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🛋️ الصالونات</div>
              <div className="text-xl font-bold">{property.salons}</div>
            </div>
            <div className="bg-slice-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
              <div className="text-gray-400 text-sm mb-1">🚿 الحمامات</div>
              <div className="text-xl font-bold">{property.bathrooms}</div>
            </div>
            {property.floor > 0 && (
              <div className="bg-slice-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
                <div className="text-gray-400 text-sm mb-1">🏢 الطابق</div>
                <div className="text-xl font-bold">{property.floor}</div>
              </div)
            }
            {property.year > 0 && (
              <div className="bg-slice-700/50 p-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition">
                <div className="text-gray-400 text-sm mb-1">📅 سنة البناء</div>
                <div className="text-xl font-bold">{property.year}</div>
              </div>
            )
          </div>

          {/* المميزات */}
          <div className="flex flex-wrap gap-3 mb-8">
            {property.garage && (
              <span className="bg-slate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🚗 مرآب
              </span>
            )}
            {property.elevator && (
              <span className="bg-sate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🛗 مصعد
              </span>
            )}
            {property.balcony && (
              <span className="bg-sate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🌿 بلكون
              </span>
            )}
            {property.garden && (
              <span className="bg-sate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🌳 حديقة
              </span>
            )}
            {property.pool && (
              <span className="bg-sate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
                🏊 مسبح
              </span>
            )}
            {property.guard && (
              <span className="bg-sate-700/70 px-4 py-2 rounded-full text-sm border border-slate-600">
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

          {/* ✅✅✅ للزوار والموظفين - نموذج الاستفسار! */}
          {!isAdmin && (
            <div 
              className="mb-8"
            >
              <div 
                className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-6 rounded-xl border border-emerald-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  📩 مهتم بهذا العقار؟
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  تواصل معنا وسنرد عليك في أقرب وقت ممكن!
                </p>
                
                <div className="space-y-4">
                  {/* ✅ 3 أزرار سريعة - كلها تؤدي لنفسحة واحدة */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* زر زيارة */}
                    <button
                      onClick={() => {
                        setShowInquiryModal(true);
                        setInquiryType('زيارة');
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-blue-600/20 hover:bg-blue-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.05] shadow-lg hover:shadow-blue-500/25"
                    >
                      <span className="text-2xl">📞</span>
                      <span className="text-xs opacity-75">أريد زيارة العقار</span>
                      <span className="text-xs opacity-60">(مجاناً مجاناً)</span>
                    </button>

                    {/* زر شراء */}
                    <button
                      onClick={() => {
                        setShowInquiryModal(true);
                        setInquiryType('شراء');
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-emerald-600/20 hover:bg-emerald-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.05] shadow-lg hover:shadow-emerald-500/25"
                    >
                      <span className="text-2xl">🛒</span>
                      <span className="text-xs opacity-75">أريد شراء هذا العقار!</span>
                      <span className="text-xs opacity-60">(سعر مناسب جداً!)</span>
                    </button>

                    {/* زر كراء */}
                    <button
                      onClick={() => {
                        setShowInquiryModal(true);
                        setInquiryType('كراء');
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-purple-600/20 hover:bg-purple-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.05] shadow-lg hover:shadow-purple-500/25"
                    >
                      <span className="text-2xl">🔑</span>
                      <span className="text-xs opacity-75">أرغب في استئجار عقار!</span>
                      <span className="text-xs opacity-60">(سعر مناسب جداً!)</span>
                    </button>
                  </div>
                  
                  {/* ✅ زر إرسال */}
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      
                      if (!inquiryForm.name || !inquiryForm.phone) {
                        alert("الرجاء إدخل اسمك ورقم هاتفك أولاً");
                        return;
                      }
                      
                      try {
                        // ✅✅✅ 1. حفظ الاستفسار في Firebase
                        const inquiryData = {
                          ...inquiryForm,
                          id: Date.now().toString(),
                          propertyId: property.id,
                          propertyName: `${property.propertyType} في ${property.city}`,
                          propertyCity: property.city,
                          status: 'جديد',
                          createdAt: new Date(),
                          clientId: 'guest-' + inquiryForm.phone, // زائر مؤقت
                          clientName: inquiryForm.name,
                          clientPhone: inquiryForm.phone,
                          notes: inquiryForm.notes,
                        };
                        
                        console.log("🔄 جاري حفظ الاستفسار...");
                        
                        // ✅✅✅ 2. إرسال إشعار للمدير
                        await addNotification({
                          type: 'inquiry',
                          clientName: inquiryForm.name,
                          clientPhone: inquiryForm.phone,
                          inquiryType: inquiryType,
                          propertyTitle: `${property.propertyType} في ${property.city}`,
                          propertyCity: property.city,
                          notes: inquiryForm.notes,
                        });
                        
                        // ✅✅✅ 3. حفظظ في Firebase (اختياري)
                        await fbAddRequest(inquiryData);
                        
                        dispatch({ 
                          type: "SHOW_TOAST", 
                          payload: { 
                            message: `✅ تم إرسال طلب ${inquiryType}! سنتواصل معك قريباً 📧`,
                            type: "success" 
                          });
                          
                        // ✅✅✅ 4 - أغلق Modal وأنتقل للصفحة الرئيسية
                        setShowInquiryModal(false);
                        setInquiryForm({ name: '', phone: '', notes: '' });
                        
                        // ✅✅ 5 - إعادة التوجيه للصفحة الرئيسية
                        setTimeout(() => {
                          router.push('/properties');
                        }, 1500); // بعد 1.5 ثانية

                      }}>
                        <input type="hidden" value={showInquiryModal.toString()} readOnly />
                      </form>
                  </div>
                  
                  {/* ✅ Modal الاستفسار */}
                  {showInquiryModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center z-[9999]">
                      <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-2xl border border-slate-700">
                        
                        {/* أيقونة إغلاق */}
                        <button
                          onClick={() => setShowInModal(false)}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full text-xl font-bold hover:bg-red-700 hover:bg-red-700 transition"
                          title="إغلاق"
                        >
                          ✕
                        </button>
                      </div>

                        {/* Header */}
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-2 animate-bounce inline-block">📝</div>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {inquiryType === 'زيارة' ? '📞' : 
                             inquiryType === 'شراء' ? '🛒' : '🔑'}
                          </h2>
                          
                          <p className="text-gray-400 text-sm">
                            عقار: **{property.propertyType}** في **{property.city}**
                          </p>
                        </div>

                        {/* النموذج */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            
                          if (!inquiryForm.name || !inquiryForm.phone) {
                              alert("يرجب إدخل اسمك ورقم هاتفك");
                              return;
                            }
                            
                          try {
                            // ✅ حفظ الاستفسار
                            const inquiryData = {
                              ...inquiryForm,
                              id: Date.now().toString(),
                              propertyId: property.id,
                              propertyName: `${property.propertyType} في ${property.city}`,
                              propertyCity: property.city,
                              status: 'جديد',
                              createdAt: new Date(),
                              clientId: 'guest-' + inquiryForm.phone,
                              clientName: inquiryForm.name,
                              clientPhone: inquiryForm.phone,
                              notes: inquiryForm.notes,
                            };
                            
                            console.log("🔄 جاري حفظ الاستفسار...");
                            
                            // ✅ إرسال إشعار للمدير
                            await addNotification({
                              type: 'inquiry',
                              clientName: inquiryForm.name,
                              clientPhone: inquiryForm.phone,
                              inquiryType: inquiryType,
                              propertyTitle: `${property.propertyType} في ${property.city}`,
                              propertyCity: property.city,
                              notes: inquiryForm.notes,
                            });
                            
                            // ✅ حفظظ في Firebase
                            await fbAddRequest(inquiryData);
                            
                            dispatch({ 
                              type: "SHOW_TOAST", 
                              payload: { 
                                message: `✅ تم إرسال طلب ${inquiryType}! 📧`,
                                type: "success" 
                              });
                            
                            // ✅ أغلق Modal
                            setShowInquiryModal(false);
                            setInquiryForm({ name: '', phone: '', notes: '' });
                            
                            // ✅ إعادة التوجيه
                            setTimeout(() => {
                              router.push('/properties');
                            }, 2000);
                            
                          }} catch (error) {
                            console.error("❌ خطأ:", error);
                            dispatch({ 
                              type: "SHOW_TOAST", 
                              payload: { message: "❌ فشل الإرسال!", type: "error" }
                            );
                            setShowInModal(false);
                          }}
                        }}
                      </form>
                    </div>
                  </div>
                )}
              )}
              
              {/* ===== أزرار أسفل الصفحة ===== */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <Link
                  href="/"
                  className="text-emerald-400 underline text-sm hover:text-emerald-600 transition-colors duration-200"
                >
                  ← العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
