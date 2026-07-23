"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

// ===== تنسيق السعر - بالأرقام فقط! =====
export const formatPrice = (n: number): string => {
  // ✅✅✅ إرجاع الأرقام مع فاصلة الآلاف (بدون "ألف" أو "مليون")
  return n.toLocaleString('ar-MA'); // ← "2,000" بدلاً من "2 ألف"
};

export const displayPrice = (property: Property, t?: any): string => {
  const currency = "درهم";
  
  if (property.operation === "بيع") {
    return `${formatPrice(property.price)} ${currency}`;
  }
  if (property.operation === "كراء") {
    // ✅ "2000 درهم/شهر" بدلاً من "2 ألف درهم/شهر"
    const perMonth = t?.properties?.perMonth || "/للشهر";
    return `${formatPrice(property.rent)} ${currency} ${perMonth}`;
  }
  return `رهن: ${formatPrice(property.mortgage)} ${currency}`;
};

// ✅✅✅ دالة جديدة - تنسيق الطابق
export const formatFloor = (floor: number | undefined): string => {
  if (floor === undefined || floor === null) return '';
  if (floor === 0) return 'طابق أرضي';     // ← 0 = الأرضي
  if (floor < 0) return 'قبو';           // ← سالب = قبو
  return `الطابق ${floor}`;             // ← عادي
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
  
  const [isFav, setIsFav] = useState(false);
  
  useEffect(() => {
    if (state && state.favorites) {
      const fav = state.favorites.includes(property.id);
      setIsFav(fav);
      console.log(`[PropertyCard ${property.id}] isFav:`, fav);
    }
  }, [state?.favorites, property.id]);

  const isAdmin = state.currentUser?.role === "مدير";

  // ===== المفضلة =====
  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== ❤️ handleFav Triggered ===');
    console.log('Property ID:', property.id);
    console.log('Current isFav:', isFav);
    
    const newFavState = !isFav;
    setIsFav(newFavState);
    
    try {
      if (!dispatch || typeof dispatch !== 'function') {
        throw new Error('dispatch غير متوفر');
      }
      
      dispatch({ type: "TOGGLE_FAV", payload: property.id });
      console.log(`✅ تم ${newFavState ? 'إضافة' : 'إزالة'} العقار من المفضلة`);
      
    } catch (error) {
      console.error('❌ خطأ في handleFav:', error);
      setIsFav(!newFavState);
    }
  };

  // ===== واتساب =====
  const openWhatsapp = () => {
    const whatsappNumber = "212607633144";
    
    const message = language === 'ar' 
      ? `مرحباً، أنا مهتم بهذا العقار:\n🏠 ${property.propertyType} ${property.operation} - ${property.city}\n💰 ${displayPrice(property, t)}\n\nمن موقع SOLUTION Immobilier`
      : `Bonjour, je suis intéressé par ce bien:\n🏠 ${property.propertyType} ${property.operation} - ${property.city}\n💰 ${displayPrice(property, t)}\n\nDepuis SOLUTION Immobilier`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ===== هاتف =====
  const callPhone = () => {
    const phone = property.ownerPhone || "0607633144";
    window.open(`tel:${phone}`, '_self');
  };

  // ===== مشاركة واتساب =====
  const shareToWhatsApp = () => {
    const link = typeof window !== 'undefined' 
      ? `${window.location.origin}/properties/${property.id}`
      : `https://solution-immobilier.vercel.app/properties/${property.id}`;
    
    const whatsappNumber = "212607633144";
    
    let message: string;
    
    if (language === 'fr') {
      message = `🏠 *${property.propertyType} ${property.operation}* - ${property.city}\n\n📍 *${property.propertyType}* ${property.district || ''} - ${property.city}\n📐 ${property.area} m² | 🛏️ ${property.rooms} Ch. | 🚿 ${property.bathrooms || 0} SDB${property.floor !== undefined ? `\n🏢 Etage: ${formatFloor(property.floor)}` : ''}\n\n💰 *${displayPrice(property, t)}* ${property.negotiable ? '✅ Négociable' : ''}\n\n📝 ${property.description ? property.description.substring(0, 100) + '...' : ''}\n\n🔗 *Voir l'annonce & photos:*\n ${link}\n\n━━━━━━━━━━━━━━━━━\n\n📱 *Suivez-nous sur Facebook:*\nhttps://web.facebook.com/SOLUTION.ImmobilierS\n\n📞 *SOLUTION Immobilier - Votre confiance, notre priorité*`;
    } else {
      message = `🏠 *${property.propertyType} ${property.operation}* - ${property.city}\n\n📍 *${property.propertyType}* ${property.district || ''} - ${property.city}\n📐 ${property.area} م² | 🛏️ ${property.rooms} غرف | 🚿 ${property.bathrooms || 0} حمامات${property.floor !== undefined ? `\n🏢 ${formatFloor(property.floor)}` : ''}\n\n💰 *${displayPrice(property, t)}* ${property.negotiable ? '✅ قابل للتفاوض' : ''}\n\n📝 ${property.description ? property.description.substring(0, 100) + '...' : ''}\n\n🔗 *شاهد الصور والتفاصيل:*\n ${link}\n\n━━━━━━━━━━━━━━━━━\n\n📱 *تابعنا على فيسبوك:*\nhttps://web.facebook.com/SOLUTION.ImmobilierS\n\n📞 *SOLUTION Immobilier - حلول عقارية*`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  // ===== نسخ الرابط =====
  const copyLink = () => {
    const link = typeof window !== 'undefined' 
      ? `${window.location.origin}/properties/${property.id}`
      : `https://solution-immobilier.vercel.app/properties/${property.id}`;
      
    navigator.clipboard.writeText(link).then(() => {
      if (dispatch) {
        dispatch({ type: "SHOW_TOAST", payload: { message: language === 'ar' ? '✅ تم نسخ الرابط!' : '✅ Lien copié!', type: "success" }});
      }
    });
  };

  // ===== حذف =====
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
    <div className="property-card-enhanced" style={{
      background: 'linear-gradient(145deg, var(--bg-card), #162033)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all var(--transition-slow)',
      position: 'relative'
    }}>
      {/* شريط ذهبي علوي */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--gradient-gold)',
        transform: 'scaleX(0)',
        transition: 'transform var(--transition-normal)',
        zIndex: 10
      }} className="gold-bar"></div>
      
      {/* صورة */}
      <div className="relative overflow-hidden" style={{ height: '240px' }}>
        <img 
          src={property.images[0]} 
          alt={property.propertyType} 
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.6s ease' }}
        />
        
        {/* زر المفضلة */}
        <button 
          onClick={handleFav} 
          className="absolute top-3 right-3 p-2.5 rounded-full transition-all hover:scale-110 z-20"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-sm)',
            border: 'none',
            cursor: 'pointer'
          }}
          title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <span className={`text-xl transition-colors duration-200`} style={{ color: isFav ? '#EF4444' : '#9CA3AF' }}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{
            background: 'linear-gradient(135deg, #D4AF37, #E5C76B)',
            color: '#0A1628',
            boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
          }}>
            {property.operation}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold`} style={{
            background: property.status === "متوفر" ? '#25D366' : '#F59E0B',
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            {property.status}
          </span>
        </div>
        
        {/* ID Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold" style={{
          background: 'rgba(0,0,0,0.75)',
          color: 'var(--gold-primary)',
          backdropFilter: 'blur(5px)'
        }}>
          #{property.id}
        </div>
      </div>

      {/* معلومات */}
      <div className="p-5" style={{ color: 'white' }}>
        <h3 className="text-lg font-bold mb-3 leading-tight" style={{ lineHeight: '1.4' }}>
          {property.propertyType} {language === 'fr' ? 'à' : 'في'} {property.city} - {property.district}
        </h3>
        
        {/* ✅✅✅ المعلومات التفصيلية - مع الطابق! */}
        <div className="flex gap-4 mb-4 flex-wrap text-sm" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--gold-primary)' }}>📐</span> 
            {property.area} م²
          </span>
          
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--gold-primary)' }}>🛏️</span> 
            {property.rooms}
          </span>
          
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <span style={{ color: 'var(--gold-primary)' }}>🚿</span> 
              {property.bathrooms}
            </span>
          )}
          
          {/* ✅✅✅ الطابق - جديد! */}
          {property.floor !== undefined && property.floor !== null && (
            <span className="flex items-center gap-1">
              <span style={{ color: 'var(--gold-primary)' }}>🏢</span> 
              {formatFloor(property.floor)}
            </span>
          )}
        </div>
        
        {/* السعر - الآن بالأرقام! */}
        <div className="text-2xl font-black mb-5 pb-4 border-b" style={{
          background: 'linear-gradient(135deg, #D4AF37, #E5C76B, #FFFFFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          borderColor: 'var(--border-subtle)'
        }}>
          {displayPrice(property, t)}
        </div>

        {/* معلومات المدير */}
        {isAdmin && property.ownerName && (
          <div className="mb-4 p-4 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
            border: '2px dashed var(--gold-primary)'
          }}>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2" style={{
              background: '#DC2626',
              color: 'white'
            }}>
              🔒 خاص
            </span>
            <p className="font-semibold mt-2" style={{ color: 'var(--gold-light)' }}>
              👤 {property.ownerName}
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {property.ownerPhone && (
                <button onClick={callPhone} className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105" style={{
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: 'white'
                }}>
                  ☎️ {property.ownerPhone}
                </button>
              )}
              
              {(property.ownerWhatsapp || property.ownerPhone) && (
                <button onClick={openWhatsapp} className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105" style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: 'white'
                }}>
                  💬 واتساب
                </button>
              )}
            </div>
          </div>
        )}

        {/* زر الاستفسار للزوار */}
        {!isAdmin && property.ownerName && (
          <div className="mb-4">
            <button onClick={() => alert(t.properties?.inquirySuccess || 'شكراً!')} className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg" style={{
              background: 'var(--gradient-gold)',
              color: 'var(--bg-primary)'
            }}>
              📩 {t.properties?.inquiry || 'استفسار'}
            </button>
          </div>
        )}

        {/* الأزرار الرئيسية */}
        <div className="flex gap-3">
          <Link href={`/properties/${property.id}`} className="flex-1 text-center py-3 rounded-xl font-bold transition-all hover:shadow-lg" style={{
            background: 'var(--gradient-gold)',
            color: 'var(--bg-primary)'
          }}>
            {t.properties?.details || 'التفاصيل'} →
          </Link>
          
          {actions && (
            <>
              <Link href={`/dashboard/properties/form?id=${property.id}`} className="px-4 py-3 rounded-xl transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: 'white'
              }}>
                ✏️
              </Link>
              <button onClick={handleDelete} className="px-4 py-3 rounded-xl transition-all hover:scale-105" style={{
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                color: 'white'
              }}>
                🗑️
              </button>
            </>
          )}
        </div>

        {/* أزرار المشاركة */}
        <div className="mt-4 pt-4 flex gap-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button 
            onClick={shareToWhatsApp}
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white'
            }}
          >
            💬 {t.properties?.whatsapp || 'واتساب'}
          </button>
          
          <button 
            onClick={copyLink}
            className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--gold-primary)',
              border: '1px solid var(--border-color)'
            }}
            title={t.common?.copy || 'نسخ'}
          >
            🔗
          </button>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .property-card-enhanced:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.25);
          border-color: #D4AF37 !important;
        }
        
        .property-card-enhanced:hover .gold-bar {
          transform: scaleX(1);
        }
        
        .property-card-enhanced:hover img {
          transform: scale(1.08) rotate(0.5deg);
        }
        
        button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
