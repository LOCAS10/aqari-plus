"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default function FavoritesPage() {
  const { state } = useAppContext();
  const { language } = useLanguage();
  
  // ✅ جلب العقارات المفضلة فقط
  const favorites = state.properties.filter((p) => state.favorites.includes(p.id));

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--bg-primary)',
      paddingTop: 'calc(var(--header-height, 95px) + 40px)',
      paddingBottom: '60px'
    }}>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ===== Header Section (متدرج ذهبي) ===== */}
        <div className="text-center mb-16">
          
          {/* Badge */}
          <span className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6" style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            ❤️ {language === 'ar' ? 'مجموعتك المختارة' : 'Votre Collection Préférée'}
          </span>
          
          {/* ✅ العنوان المتدرج */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '20px',
            // تدرج ذهبي → أبيض → ذهبي
            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 30%, #FFFFFF 50%, #E5C76B 70%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.25))'
          }}>
            {language === 'ar' ? 'العقارات المفضلة' : 'Mes Favoris'}
          </h1>
          
          {/* خط ذهبي تحت العنوان */}
          <div className="w-32 h-1 mx-auto mb-8" style={{ 
            background: 'var(--gradient-gold)', 
            borderRadius: '2px' 
          }}></div>
          
          {/* عداد المفضلة */}
          <p style={{ 
            color: 'var(--muted)', 
            fontSize: '1.15rem',
            lineHeight: '1.9'
          }}>
            {language === 'ar' 
              ? `لديك ${favorites.length} عقار في مفضلتك 💎`
              : `Vous avez ${favorites.length} bien(s) en favoris 💎`}
          </p>
        </div>

        {/* ===== حالة فارغة (محسنة) ===== */}
        {favorites.length === 0 ? (
          <div className="text-center py-24 scroll-animate">
            
            {/* أيقونة كبيرة متحركة */}
            <div style={{
              fontSize: '7rem',
              marginBottom: '30px',
              opacity: 0.35,
              animation: 'float 6s ease-in-out infinite',
              display: 'inline-block'
            }}>💔</div>
            
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--muted)' }}>
              {language === 'ar' ? 'لا توجد عقارات مفضلة بعد' : 'Aucun favori pour le moment'}
            </h2>
            
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ 
              color: 'var(--muted)', 
              lineHeight: '2' 
            }}>
              {language === 'ar' 
                ? 'اضغط على ❤️ على أي بطاقة عقار لإضافته إلى مفضلتك. يمكنك الرجوع إليها في أي وقت!'
                : "Appuyez sur ❤️ sur n'importe quelle carte de bien pour l'ajouter à vos favoris. Vous pouvez y accéder à tout moment!"}
            </p>
            
            {/* زر الذهاب للعقارات */}
            <Link 
              href="/properties"
              className="btn-primary inline-flex items-center gap-3 animate-pulse-gold"
              style={{
                padding: '18px 45px',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: '800'
              }}
            >
              🏠 {language === 'ar' ? 'تصفح العقارات الآن' : 'Voir les Biens'} ←
            </Link>
            
            {/* أو زر عشوائي */}
            <div className="mt-6">
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                {language === 'ar' ? 'أو' : 'ou'}
              </p>
              <button 
                onClick={() => window.location.href = '/properties'}
                className="btn-secondary inline-flex items-center gap-2"
                style={{
                  padding: '14px 32px',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                🎲 {language === 'ar' ? 'اكتشاف عشوائي' : 'Découverte Aléatoire'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ===== معلومات إضافية قبل Grid ===== */}
            <div className="flex justify-between items-center mb-10 px-2">
              
              {/* عداد مع تفاصيل */}
              <div style={{ color: 'var(--muted)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--gold-primary)' }}>
                  {favorites.length}
                </span> 
                <span>{language === 'ar' ? ' عقار محفوظ' : ' bien(s) sauvegardé(s)'}</span>
              </div>
              
              {/* زر مسح الكل (اختياري) */}
              <button
                onClick={() => {
                  if (confirm(language === 'ar' ? 'هل تريد مسح جميع المفضلات؟' : 'Vider tous les favoris?')) {
                    // هنا يمكن إضافة dispatch لمسح الكل
                    alert(language === 'ar' ? 'تم المسح!' : 'Vidés!');
                  }
                }}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#FCA5A5',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                🗑️ {language === 'ar' ? 'مسح الكل' : 'Tout supprimer'}
              </button>
            </div>

            {/* ===== Grid المحسن ===== */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {favorites.map((property, index) => (
                <div 
                  key={property.id}
                  className="scroll-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* ✅ رسالة تشجيعية في الأسفل */}
            <div className="text-center mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
                {language === 'ar' 
                  ? '💡 نصيحة: شارك مفضلتك مع العائلة عبر واتساب!'
                  : '💡 Astuce: Partagez vos favoris avec votre famille via WhatsApp!'}
              </p>
              
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'مفضلاتي - SOLUTION Immobilier',
                      url: window.location.href,
                      text: `شاهد ${favorites.length} عقار مميز!`
                    });
                  } else {
                    alert(language === 'ar' ? 'مشاركة غير مدعومة في هذا المتصفح' : 'Partage non supporté');
                  }
                }}
                className="mt-4 btn-whatsapp inline-flex items-center gap-2"
                style={{
                  padding: '14px 32px',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}
              >
                💬 {language === 'ar' ? 'شارك المفضلة' : 'Partager les Favoris'}
              </button>
            </div>
          </>
        )}

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        button:hover {
          transform: translateY(-2px);
        }
      `}</style>

    </div>
  );
}
