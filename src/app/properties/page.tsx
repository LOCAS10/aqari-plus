"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function PropertiesPage() {
  const { state } = useAppContext();
  const [filter, setFilter] = useState("الكل");

  // ✅ تصفية العقارات - أكثر أماناً ومرونة
  const filtered = state.properties.filter((p) => {
    // 🔒 إخفاء المحذوفة فقط
    if ((p as any).deleted) return false;
    
    // ✅ إذا كان "الكل" - عرض كل شيء (ما عدا المحذوف)
    if (filter === "الكل") return true;
    
    // ✅ تطبيق فلتر العملية (مرن)
    return p.operation === filter;
  });

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--bg-primary)',
      paddingTop: 'calc(var(--header-height, 95px) + 40px)',
      paddingBottom: '60px',
      minHeight: '100vh'
    }}>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          
          {/* Badge */}
          <span className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6" style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            🏠 تصفح مجموعتنا المتميزة
          </span>
          
          {/* العنوان المتدرج */}
          <h1 className="mb-4" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 30%, #FFFFFF 50%, #E5C76B 70%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            العقارات المتاحة
          </h1>
          
          {/* خط ذهبي */}
          <div className="w-32 h-1 mx-auto mb-6" style={{ 
            background: 'var(--gradient-gold)', 
            borderRadius: '2px' 
          }}></div>
          
          <p className="text-lg max-w-2xl mx-auto" style={{ 
            color: 'var(--muted)', 
            lineHeight: '1.9' 
          }}>
            اكتشف أفضل العقارات في الدار البيضاء، بوسكورة وسيدي معروف
          </p>
        </div>

        {/* ===== Filter Buttons ===== */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {["الكل", "بيع", "كراء", "رهن"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '12px 28px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                border: '2px solid',
                cursor: 'pointer',
                fontFamily: 'var(--font-arabic)',
                background: filter === f ? 'var(--gradient-gold)' : 'transparent',
                color: filter === f ? 'var(--bg-primary)' : 'var(--gold-primary)',
                borderColor: filter === f ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.3)',
                boxShadow: filter === f ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                transform: filter === f ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--gold-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              <span className="mr-2">
                {f === "الكل" && "🏠"}
                {f === "بيع" && "💰"}
                {f === "كراء" && "🔑"}
                {f === "رهن" && "📋"}
              </span>
              {f}
              
              {/* عداد */}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{
                background: filter === f ? 'rgba(10, 22, 40, 0.2)' : 'rgba(212, 175, 55, 0.15)',
                fontSize: '0.75rem'
              }}>
                {f === "الكل" 
                  ? filtered.length 
                  : filtered.filter(p => p.operation === f).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* ===== Properties Grid ===== */}
        
        {/* حالة فارغة */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.4 }}>🔍</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--muted)' }}>
              لا توجد عقارات حالياً
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
              حاول مرة أخرى لاحقاً أو غيّر الفلتر
            </p>
            
            {/* زر إعادة تعيين */}
            <button 
              onClick={() => setFilter("الكل")}
              className="mt-6 px-6 py-3 rounded-full font-bold"
              style={{
                background: 'var(--gradient-gold)',
                color: 'var(--bg-primary)'
              }}
            >
              عرض كل العقارات
            </button>
          </div>
        ) : (
          <>
            {/* معلومات النتائج */}
            <div className="flex justify-between items-center mb-8 px-2">
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                عرض <span className="font-bold text-gold">{filtered.length}</span> عقار
                {filter !== "الكل" && (
                  <span> - تصنيف: <strong>{filter}</strong></span>
                )}
              </p>
            </div>

            {/* ✅ Grid - بدون scroll-animate (لضمان الظهور) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
