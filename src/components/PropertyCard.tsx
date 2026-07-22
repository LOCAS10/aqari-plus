"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const formatPrice = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} مليون`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)} ألف`;
  return n.toString();
};

export const displayPrice = (property: Property, t?: any) => {
  const currency = "درهم";
  if (property.operation === "بيع") return `${formatPrice(property.price)} ${currency}`;
  if (property.operation === "كراء") return `${formatPrice(property.rent)} ${currency} ${t?.properties?.perMonth || "/mois"}`;
  return `رهن: ${formatPrice(property.mortgage)} ${currency}`;
};

export default function PropertyCard({
  property,
  actions = false,
}: {
  property: Property & { _firestoreId?: string; __realId?: string };
  actions?: boolean;
}) {
  const { state, dispatch } = useAppContext();
  const { t, language } = useLanguage();
  const isFav = state.favorites.includes(property.id);
  const isAdmin = state.currentUser?.role === "مدير";

  // ===== المفضلة =====
  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_FAV", payload: property.id });
  };

  // ===== واتساب =====
  const openWhatsapp = () => {
    const number = property.ownerWhatsapp || property.ownerPhone;
    if (number) window.open(`https://wa.me/212${number.replace(/^0/, '')}`, '_blank');
  };

  // ===== هاتف =====
  const callPhone = () => {
    if (property.ownerPhone) window.open(`tel:${property.ownerPhone}`, '_self');
  };

  // ===== 🆕🆕🆕 مشاركة عبر واتساب =====
  const shareToWhatsApp = () => {
    const link = `https://solution-immobilier.vercel.app/properties/${property.id}`;
    
    let message: string;
    
    if (language === 'fr') {
      message = `🏠 *${property.propertyType} ${property.operation}* - ${property.city}

📍 *${property.propertyType}* ${property.district || ''} - ${property.city}
📐 ${property.area} m² | 🛏️ ${property.rooms} Ch. | 🚿 ${property.bathrooms || 0} SDB

💰 *${displayPrice(property, t)}* ${property.negotiable ? '✅ Négociable' : ''}

📝 ${property.description ? property.description.substring(0, 100) + '...' : ''}

🔗 *Voir l'annonce & photos:*
 ${link}

━━━━━━━━━━━━━━━━━

📱 *Suivez-nous sur Facebook:*
https://web.facebook.com/SOLUTION.ImmobilierS

📞 *SOLUTION Immobilier - Votre confiance, notre priorité*`;
    } else {
      message = `🏠 *${property.propertyType} ${property.operation}* - ${property.city}

📍 *${property.propertyType}* ${property.district || ''} - ${property.city}
📐 ${property.area} م² | 🛏️ ${property.rooms} غرف | 🚿 ${property.bathrooms || 0} حمامات

💰 *${displayPrice(property, t)}* ${property.negotiable ? '✅ قابل للتفاوض' : ''}

📝 ${property.description ? property.description.substring(0, 100) + '...' : ''}

🔗 *شاهد الصور والتفاصيل:*
 ${link}

━━━━━━━━━━━━━━━━━

📱 *تابعنا على فيسبوك:*
https://web.facebook.com/SOLUTION.ImmobilierS

📞 *SOLUTION Immobilier - حلول عقارية*`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  // ===== نسخ الرابط =====
  const copyLink = () => {
    const link = `https://solution-immobilier.vercel.app/properties/${property.id}`;
    navigator.clipboard.writeText(link).then(() => {
      dispatch({ type: "SHOW_TOAST", payload: { message: language === 'ar' ? '✅ تم نسخ الرابط!' : '✅ Lien copié!', type: "success" }});
    });
  };

  // ===== حذف (مع _firestoreId) =====
  const handleDelete = async () => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Êtes-vous sûr de supprimer ce bien?')) return;
    
    try {
      const realId = property._firestoreId || property.__realId || property.id;
      
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionName: 'properties',
          id: realId,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || 'Error');

      dispatch({ type: "DELETE_PROPERTY", payload: property.id });
      dispatch({ type: "SHOW_TOAST", payload: { message: language === 'ar' ? '✅ تم الحذف!' : '✅ Supprimé!', type: "success" }});
    } catch (error: any) {
      alert(`${language === 'ar' ? 'فشل:' : 'Échec:'} ${error.message}`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* صورة */}
      <div className="relative">
        <img src={property.images[0]} alt={property.propertyType} className="w-full h-56 object-cover" />
        
        <button onClick={handleFav} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:scale-110 transition">
          <span className={`text-2xl ${isFav ? "text-red-500" : "text-gray-500"}`}>{isFav ? "❤️" : "🤍"}</span>
        </button>
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">{property.operation}</span>
          <span className={`${property.status === "متوفر" ? "bg-green-500" : "bg-yellow-500"} text-white px-3 py-1 rounded-full text-sm`}>
            {property.status}
          </span>
        </div>
        
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">#{property.id}</div>
      </div>

      {/* معلومات */}
      <div className="p-4 text-white">
        <div className="text-lg font-bold mb-2">
          {property.propertyType} {language === 'fr' ? 'à' : 'في'} {property.city} - {property.district}
        </div>
        
        <div className="text-sm text-gray-400 mb-3 flex gap-3 flex-wrap">
          <span>📐 {property.area} م²</span>
          <span>🛏️ {property.rooms}</span>
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms}</span>}
        </div>
        
        <div className="text-xl font-bold text-amber-500 mb-4">{displayPrice(property, t)}</div>

        {/* معلومات صاحب العقار (للمدير) */}
        {isAdmin && property.ownerName && (
          <div className="mb-4 p-3 rounded-lg border-2 border-dashed border-amber-400" style={{background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)'}}>
            <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full">🔒 {t.auth?.adminTitle || 'خاص'}</span>
            <p className="text-amber-200 font-semibold mt-2">👤 {property.ownerName}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {property.ownerPhone && (<button onClick={callPhone} className="px-3 py-1.5 bg-blue-600 rounded-md text-sm">☎️ {property.ownerPhone}</button>)}
              {(property.ownerWhatsapp || property.ownerPhone) && (<button onClick={openWhatsapp} className="px-3 py-1.5 bg-green-600 rounded-md text-sm">💬 واتساب</button>)}
            </div>
          </div>
        )}

        {/* للزوار - زر الاستفسار */}
        {!isAdmin && property.ownerName && (
          <div className="mb-4">
            <button onClick={() => alert(t.properties?.inquirySuccess || 'شكراً!')} className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-medium text-sm transition-all hover:shadow-lg">
              📩 {t.properties?.inquiry || 'استفسار'}
            </button>
          </div>
        )}

        {/* ===== الأزرار الرئيسية ===== */}
        <div className="flex gap-2">
          <Link href={`/properties/${property.id}`} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-center py-2 rounded-lg transition">
            {t.properties?.details || 'التفاصيل'}
          </Link>
          
          {actions && (
            <>
              <Link href={`/dashboard/properties/form?id=${property.id}`} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
                ✏️
              </Link>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                🗑️
              </button>
            </>
          )}
        </div>

        {/* ===== 🆕🆕🆕 أزرار المشاركة ===== */}
        <div className="mt-3 pt-3 border-t border-slate-700 flex gap-2">
          <button 
            onClick={shareToWhatsApp}
            className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1"
          >
            💬 {t.properties?.whatsapp || 'واتساب'}
          </button>
          
          <button 
            onClick={copyLink}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition"
            title={t.common?.copy || 'نسخ'}
          >
            🔗
          </button>
        </div>
      </div>
    </div>
  );
}
