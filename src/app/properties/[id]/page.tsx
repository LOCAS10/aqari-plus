"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ إضافة الاستيراد الناقصة
import { useAppContext } from "@/contexts/AppContext";
import { displayPrice } from "@/components/PropertyCard";
// ✅✅✅ استيراد دوال الإشعارات
import { addNotification } from "@/lib/notifications";
// ✅✅✅ استيراد دوال Firestore (لحفظ الاستفسار)
import { addRequest as fbAddRequest } from "@/lib/firestore";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const property = state.properties.find(p => p.id === id);
  const router = useRouter();
  
  // ✅✅✅ حالة الحفظ
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

  // ✅✅✅ دالة التحقق من تسجيل الدخول
  const isLoggedIn = !!state.currentUser;

  // ✅✅✅ دالة إرسال الاستفسار (للتجنب تكرار الكود)
  const handleSubmitInquiry = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inquiryForm.name || !inquiryForm.phone) {
      alert("الرجاء إدخال اسمك ورقم هاتفك");
      return;
    }
    
    try {
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
      
      // ✅✅✅ تم الإصلاح - إضافة الحقول الإلزامية الثلاثة
      await addNotification({
        id: Date.now().toString() + '-notif',           // ✅ معرف فريد للإشعار
        type: 'inquiry',
        clientName: inquiryForm.name,
        clientPhone: inquiryForm.phone,
        inquiryType: inquiryType,
        propertyTitle: `${property.propertyType} في ${property.city}`,
        propertyCity: property.city,
        notes: inquiryForm.notes,
        createdAt: new Date(),                           // ✅ تاريخ الإنشاء
        read: false,                                     // ✅ حالة القراءة (جديد)
      });
      
      await fbAddRequest(inquiryData);
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { 
          message: `✅ تم إرسال طلب ${inquiryType}! سنتواصل معك قريباً 📧`,
          type: "success" 
        }
      });
      
      setShowInquiryModal(false);
      setInquiryForm({ name: '', phone: '', notes: '' });
      
      setTimeout(() => {
        router.push('/properties');
      }, 1500);
      
    } catch (error) {
      console.error("❌ خطأ:", error);
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "❌ فشل الإرسال!", type: "error" }
      });
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
              <div className="
