"use client";

import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { useState } from "react";

export default function ArchivePage() {
  const { state } = useApp();
  const { language } = useLanguage();
  const [filter, setFilter] = useState("الكل");
  
  // ✅ جلب العقارات المؤرشفة (غير المتاحة)
  const allArchived = state.properties.filter(
    (p) => p.status === "تم البيع" || p.status === "تم الكراء" || p.status === "تم الرهن" || p.status !== "متوفر"
  );
  
  // ✅ تطبيق الفلتر
  const archived = filter === "الكل" 
    ? allArchived 
    : allArchived.filter(p => p.status === filter);

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--bg-primary)',
      paddingTop: 'calc(var(--header-height, 95px) + 40px)',
      paddingBottom: '60px'
    }}>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ===== Header Section (متدرج ذهبي) ===== */}
        <div className="text-center mb-12">
          
          {/* Badge */}
          <span className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6" style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            📦 {language === 'ar' ? 'سجل العقارات' : 'Historique des Biens'}
          </span>
          
          {/* ✅ العنوان المتدرج */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 30%, #FFFFFF 50%, #E5C76B 70%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.25))'
          }}>
            {language === 'ar' ? 'الأرشيف' : 'Archive'}
          </h1>
          
          {/* خط ذهبي */}
          <div className="w-32 h-1 mx-auto mb-8" style={{ 
            background: 'var(--gradient-gold)', 
            borderRadius: '2px' 
          }}></div>
          
          {/* وصف */}
          <p style={{ 
            color: 'var(--muted)', 
            fontSize: '1.1rem',
            lineHeight: '1.9',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {language === 'ar' 
              ? 'العقارات التي تم بيعها أو تأجيرها أو رهنها بنجاح ✓'
              : 'Biens vendus, loués ou hypothéqués avec succès ✓'}
          </p>
        </div>

        {/* ===== ✅ Filter Buttons (فلتر الحالات) ===== */}
        <div className="flex justify-center gap-4 mb-14 flex-wrap">
          {[
            { key: "الكل", label: language === 'ar' ? 'الكل' : 'Tous', icon: '📋', count: allArchived.length },
            { key: "تم البيع", label: language === 'ar' ? 'مباع' : 'Vendus', icon: '💰', count: allArchived.filter(p => p.status === "تم البيع").length },
            { key: "تم الكراء", label: language === 'ar' ? 'مؤجر' : 'Loués', icon: '🔑', count: allArchived.filter(p => p.status === "تم الكراء").length },
            { key: "تم الرهن", label: language === 'ar' ? 'مرهون' : 'Hypothéqués', icon: '📝', count: allArchived.filter(p => p.status === "تم الرهن").length }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '12px 28px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                border: '2px solid',
                cursor: 'pointer',
                fontFamily: 'var(--font-arabic)',
                background: filter === f.key ? 'var(--gradient-gold)' : 'transparent',
                color: filter === f.key ? 'var(--bg-primary)' : 'var(--gold-primary)',
                borderColor: filter === f.key ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.3)',
                boxShadow: filter === f.key ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                transform: filter === f.key ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <span className="mr-2">{f.icon}</span>
              {f.label}
              
              {/* عداد */}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{
                background: filter === f.key ? 'rgba(10, 22, 40, 0.2)' : 'rgba(212, 175, 55, 0.15)',
                fontSize: '0.75rem'
              }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* ===== حالة فارغة ===== */}
        {archived.length === 0 ? (
          <div className="text-center py-24 scroll-animate">
            
            {/* أيقونة */}
            <div style={{
              fontSize: '7rem',
              marginBottom: '30px',
              opacity: 0.3,
              animation: 'float 6s ease-in-out infinite',
              display: 'inline-block'
            }}>📭</div>
            
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--muted)' }}>
              {language === 'ar' ? 'الأرشيف فارغ' : 'Archive Vide'}
            </h2>
            
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ 
              color: 'var(--muted)', 
              lineHeight: '2' 
            }}>
              {language === 'ar' 
                ? 'لا توجد عقارات مؤرشفة حالياً. العقارات المباعة أو المؤجرة ستظهر هنا تلقائياً!'
                : "Aucun bien archivé pour le moment. Les biens vendus ou loués apparaîtront ici automatiquement!"}
            </p>
            
            {/* زر العودة للعقارات المتاحة */}
            <a 
              href="/properties"
              className="btn-primary inline-flex items-center gap-3"
              style={{
                padding: '16px 40px',
                borderRadius: '30px',
                fontSize: '1.05rem',
                fontWeight: '800'
              }}
            >
              🏠 {language === 'ar' ? 'عرض العقارات المتاحة' : 'Voir les Biens Disponibles'} ←
            </a>
          </div>
        ) : (
          <>
            {/* معلومات النتائج */}
            <div className="flex justify-between items-center mb-10 px-2">
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                {language === 'ar' ? 'عرض' : 'Affichage de'} 
                <span className="font-bold text-lg mx-2" style={{ color: 'var(--gold-primary)' }}>
                  {archived.length}
                </span> 
                {language === 'ar' ? 'عقار مؤرشف' : 'bien(s) archivé(s)'}
                {filter !== "الكل" && (
                  <span> - {language === 'ar' ? 'تصنيف:' : 'catégorie:'} <strong>{filter}</strong></span>
                )}
              </p>
              
              {/* إحصائية سريعة */}
              <div className="hidden md:flex gap-6 text-sm" style={{ color: 'var(--muted)' }}>
                <span>💰 {allArchived.filter(p => p.status === "تم البيع").length} مباع</span>
                <span>🔑 {allArchived.filter(p => p.status === "تم الكراء").length} مؤجر</span>
              </div>
            </div>

            {/* ===== Grid المحسن (البطاقات شاحبة قليلاً = مؤرشفة) ===== */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {archived.map((property, index) => (
                <div 
                  key={property.id}
                  className="scroll-animate archived-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* ✅ غلاف شفاف على البطاقة */}
                  <div style={{
                    position: 'relative',
                    opacity: '0.85',
                    filter: 'grayscale(20%)'  // ← رمادي خفيف
                  }}>
                    <PropertyCard property={property} />
                    
                    {/* ✅ شارة "مؤرشف" فوق البطاقة */}
                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <span className="px-4 py-2 rounded-full text-xs font-bold shadow-lg" style={{
                        background: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                      }}>
                        ✓ {property.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* رسالة في الأسفل */}
            <div className="text-center mt-16 pt-10 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                {language === 'ar' 
                  ? '💡 هل تبحث عن عقار مشابه؟ تصفح عقاراتنا المتاحة!'
                  : '💡 Vous cherchez un bien similaire? Consultez nos biens disponibles!'}
              </p>
              
              <a 
                href="/properties"
                className="btn-secondary inline-flex items-center gap-2 mt-4"
                style={{
                  padding: '14px 32px',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  fontWeight: '700'
                }}
              >
                🏠 {language === 'ar' ? 'العقارات المتاحة' : 'Biens Disponibles'}
              </a>
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
        
        .archived-card-wrapper:hover {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
          transition: all 0.5s ease;
        }
        
        button:hover {
          transform: translateY(-3px);
        }
      `}</style>

    </div>
  );
}
