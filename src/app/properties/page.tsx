"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function PropertiesPage() {
  const { state } = useAppContext();
  const [filter, setFilter] = useState("الكل");

  // ✅ تصفية العقارات: إخفاء المحذوفة + تطبيق الفلتر
  const filtered = state.properties.filter((p) => {
    // 🔒 إخفاء العقارات المحذوفة (Soft Delete)
    if ((p as any).deleted) return false;
    
    // تطبيق فلاتر العرض
    if (filter === "الكل") return p.status === "متوفر";
    return p.operation === filter && p.status === "متوفر";
  });

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--bg-primary)',  // ✅ خلفية Navy فاخرة
      paddingTop: 'calc(var(--header-height) + 40px)',
      paddingBottom: '60px'
    }}>
      
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ===== ✅ Header Section (عنوان متدرج) ===== */}
        <div className="text-center mb-16 scroll-animate">
          
          {/* Badge */}
          <span className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-6" style={{
            background: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.05em'
          }}>
            🏠 تصفح مجموعتنا المتميزة
          </span>
          
          {/* ✅ العنوان المتدرج */}
          <h1 className="mb-4" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            // ✅ التدرج الذهبي → الأبيض
            background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 30%, #FFFFFF 50%, #E5C76B 70%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.25))'
          }}>
            العقارات المتاحة
          </h1>
          
          {/* خط ذهبي تحت العنوان */}
          <div className="w-32 h-1 mx-auto mb-6" style={{ 
            background: 'var(--gradient-gold)', 
            borderRadius: '2px' 
          }}></div>
          
          {/* الوصف */}
          <p className="text-lg max-w-2xl mx-auto" style={{ 
            color: 'var(--muted)', 
            lineHeight: '2' 
          }}>
            اكتشف أفضل العقارات في الدار البيضاء، بوسكورة وسيدي معروف
          </p>
        </div>

        {/* ===== ✅ Filter Buttons (أزرار فلتر ذهبية) ===== */}
        <div className="flex justify-center gap-4 mb-14 flex-wrap scroll-animate" style={{ animationDelay: '0.15s' }}>
          {["الكل", "بيع", "كراء", "رهن"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="filter-btn"
              style={{
                padding: '14px 32px',
                borderRadius: '30px',           // ✅ دائري
                fontWeight: '800',
                fontSize: '1rem',
                letterSpacing: '0.03em',
                transition: 'all var(--transition-normal)',
                border: '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-arabic)',
                // ✅ الشرط: إذا محدد = ذهبي، وإلا = شفاف
                background: filter === f ? 'var(--gradient-gold)' : 'transparent',
                color: filter === f ? 'var(--bg-primary)' : 'var(--gold-primary)',
                borderColor: filter === f ? 'var(--gold-primary)' : 'var(--border-color)',
                boxShadow: filter === f ? 'var(--shadow-gold)' : 'none',
                transform: filter === f ? 'translateY(-2px) scale(1.02)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--gold-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
            >
              {/* ✅ أيقونة لكل زر */}
              <span className="mr-2">
                {f === "الكل" && "🏠"}
                {f === "بيع" && "💰"}
                {f === "كراء" && "🔑"}
                {f === "رهن" && "📋"}
              </span>
              {f}
              
              {/* ✅ عداد العقارات في كل فلتر */}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{
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

        {/* ===== ✅ Properties Grid (شبكة محسنة) ===== */}
        
        {/* حالة عدم وجود عقارات */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 scroll-animate">
            <div style={{ fontSize: '5rem', marginBottom: '20px', opacity: 0.3 }}>🔍</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--muted)' }}>
              لا توجد عقارات حالياً
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              حاول مرة أخرى لاحقاً أو غير الفلتر
            </p>
          </div>
        ) : (
          <>
            {/* ✅ عداد النتائج */}
            <div className="flex justify-between items-center mb-8 px-4">
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                عرض <span className="font-bold" style={{ color: 'var(--gold-primary)' }}>{filtered.length}</span> عقار
                {filter !== "الكل" && (
                  <span> - تصنيف: <strong>{filter}</strong></span>
                )}
              </p>
              
              {/* ترتيب (اختياري - يمكن إضافته لاحقاً) */}
              <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                <span>ترتيب حسب:</span>
                <select className="bg-transparent border-none outline-none cursor-pointer" style={{ color: 'var(--gold-primary)', fontWeight: '600' }}>
                  <option value="latest">الأحدث</option>
                  <option value="price-low">السعر: الأقل</option>
                  <option value="price-high">السعر: الأعلى</option>
                </select>
              </div>
            </div>

            {/* ✅ Grid محسن */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((p, index) => (
                <div 
                  key={p.id} 
                  className="scroll-animate"
                  style={{ animationDelay: `${index * 0.1}s` }}  // ✅ كل بطاقة تظهر بتأخير
                >
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ Load More Button (زر تحميل المزيد - اختياري) */}
        {filtered.length > 0 && filtered.length >= 9 && (
          <div className="text-center mt-16 scroll-animate">
            <button className="btn-secondary" style={{
              padding: '16px 50px',
              borderRadius: '30px',
              fontSize: '1.05rem',
              fontWeight: '700'
            }}>
              تحميل المزيد ↓
            </button>
          </div>
        )}

      </div>

      {/* ✅ CSS خاص بهذا المكون */}
      <style jsx>{`
        /* تأثير Hover للأزرار */
        .filter-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: var(--shadow-gold) !important;
        }
        
        /* تحسين Select */
        select option {
          background: var(--bg-card);
          color: white;
        }
      `}</style>

    </div>
  );
}
