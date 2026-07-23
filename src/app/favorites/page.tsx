"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { state } = useAppContext();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // ✅ تأكد من أن المكون mounted (لتجنب مشاكل SSR/hydration)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ جلب العقارات المفضلة فقط (مع حماية)
  const favorites = mounted && !state.loading 
    ? state.properties.filter((p) => state.favorites.includes(p.id))
    : [];

  // حالة التحميل
  if (!mounted || state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p style={{ color: 'var(--muted)' }}>
            {language === 'ar' ? 'جاري تحميل المفضلة...' : 'Chargement des favoris...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--bg-primary)',
      paddingTop: 'calc(var(--header-height, 95px) + 40px)',
      paddingBottom: '60px'
    }}>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-16">
          
          <span className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6" style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            ❤️ {language === 'ar' ? 'مجموعتك المختارة' : 'Votre Collection Préférée'}
          </span>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 30%, #FFFFFF 50%, #E5C76B 70%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {language === 'ar' ? 'العقارات المفضلة' : 'Mes Favoris'}
          </h1>
          
          <div className="w-32 h-1 mx-auto mb-8" style={{ background: 'var(--gradient-gold)', borderRadius: '2px' }}></div>
          
          <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: '1.9' }}>
            {language === 'ar' 
              ? `لديك ${favorites.length} عقار في مفضلتك 💎`
              : `Vous avez ${favorites.length} bien(s) en favoris 💎`}
          </p>

          {/* ✅✅✅ Debug info (احذفه لاحقاً) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 rounded-xl text-left text-xs" style={{ 
              background: 'rgba(212, 175, 55, 0.1)', 
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#D4AF37',
              maxWidth: '500px',
              margin: '20px auto'
            }}>
              <p><strong>Debug Info:</strong></p>
              <p>properties count: {state.properties.length}</p>
              <p>favorites IDs: {JSON.stringify(state.favorites)}</p>
              <p>filtered count: {favorites.length}</p>
              <p>loading: {state.loading ? 'yes' : 'no'}</p>
              <p>mounted: {mounted ? 'yes' : 'no'}</p>
            </div>
          )}
        </div>

        {/* ===== حالة فارغة ===== */}
        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <div style={{
              fontSize: '7rem', marginBottom: '30px', opacity: 0.35,
              animation: 'float 6s ease-in-out infinite', display: 'inline-block'
            }}>💔</div>
            
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--muted)' }}>
              {language === 'ar' ? 'لا توجد عقارات مفضلة بعد' : 'Aucun favori pour le moment'}
            </h2>
            
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--muted)', lineHeight: '2' }}>
              {language === 'ar' 
                ? 'اضغط على ❤️ على أي بطاقة عقار لإضافته إلى مفضلتك.'
                : "Appuyez sur ❤️ sur n'importe quelle carte bien pour l'ajouter à vos favoris."}
            </p>
            
            <Link href="/properties" className="btn-primary inline-flex items-center gap-3" style={{
              padding: '18px 45px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: '800'
            }}>
              🏠 {language === 'ar' ? 'تصفح العقارات الآن' : 'Voir les Biens'} ←
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 px-2">
              <div style={{ color: 'var(--muted)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--gold-primary)' }}>
                  {favorites.length}
                </span> 
                <span>{language === 'ar' ? ' عقار محفوظ' : ' bien(s) sauvegardé(s)'}</span>
              </div>
              
              <button
                onClick={() => {
                  if (confirm(language === 'ar' ? 'هل تريد مسح جميع المفضلات؟' : 'Vider tous les favoris?')) {
                    // مسح الكل من localStorage و state
                    localStorage.removeItem('aqari_favorites');
                    window.location.reload();
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {favorites.map((property, index) => (
                <div key={property.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            <div className="text-center mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
                {language === 'ar' 
                  ? '💡 نصيحة: شارك مفضلتك مع العائلة عبر واتساب!'
                  : '💡 Astuce: Partagez vos favoris via WhatsApp!'}
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        button:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
