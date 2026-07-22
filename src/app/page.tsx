"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // تأثير التمرير
  if (typeof window !== "undefined") {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 100);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      
      {/* ===== HEADER ===== */}
      <header className={`transition-all duration-300 ${scrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        background: 'var(--gradient-navy)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '2px solid transparent',
        borderImage: 'var(--gradient-gold) 1',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        zIndex: 9999
      }}>
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* الشعار */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
              <div style={{
                width: '55px',
                height: '55px',
                background: 'var(--gradient-gold)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: 'var(--shadow-gold)'
              }}>
                🏢
              </div>
              <div>
                <h1 className="text-xl font-black leading-tight" style={{ 
                  color: 'white', 
                  letterSpacing: '1px'
                }}>SOLUTION</h1>
                <p className="text-xs font-semibold tracking-widest" style={{ 
                  color: 'var(--gold-primary)', marginTop: '2px' }}>IMMOBILIER</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" className="nav-link">{t.nav.home}</Link>
              <Link href="/properties" className="nav-link">{t.nav.properties}</Link>
              <Link href="/login" className="btn-primary" style={{
                padding: '12px 28px', borderRadius: '30px', fontWeight: '800'
              }}>{t.nav.login}</Link>
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-3 rounded-xl transition" style={{ color: 'var(--gold-primary)' }}>
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-6 border-t animate-fade-up" style={{ borderColor: 'var(--border-color)', paddingTop: '20px', marginTop: '15px' }}>
              <Link href="/" className="block py-3 px-4 rounded-lg mb-2 hover-lift" style={{ color: 'white' }}>{t.nav.home}</Link>
              <Link href="/properties" className="block py-3 px-4 rounded-lg mb-2 hover-lift" style={{ color: 'white' }}>{t.nav.properties}</Link>
              <Link href="/login" className="block py-3 px-4 rounded-lg mb-4 hover-lift" style={{ color: 'white' }}>{t.nav.login}</Link>
              <div className="px-4"><LanguageSwitcher /></div>
            </nav>
          )}
        </div>
      </header>

      {/* ===== HERO SECTION (✅ مع صورة خلفية + عناصر متحركة) ===== */}
<section style={{
  position: 'relative',
  minHeight: '100vh',
  marginTop: 'var(--header-height)',
  backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',      // ✅ توسيط عمودي
  justifyContent: 'center',   // ✅ توسيط أفقي
  overflow: 'hidden'
}}>
  
  {/* Overlay Gradient */}
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(27, 46, 74, 0.88) 50%, rgba(10, 22, 40, 0.92) 100%)',
    zIndex: 1
  }}></div>

  {/* نجوم متحركة */}
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, var(--gold-primary), transparent),
      radial-gradient(2px 2px at 40px 70px, var(--gold-light), transparent),
      radial-gradient(1px 1px at 90px 40px, white, transparent),
      radial-gradient(1px 1px at 130px 80px, var(--gold-primary), transparent),
      radial-gradient(2px 2px at 160px 30px, white, transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '350px 250px',
    animation: 'starsMove 30s linear infinite',
    opacity: 0.35,
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>

  {/* ✅ المحتوى في الوسط تماماً */}
  <div className="max-w-5xl mx-auto px-4 py-24 relative z-10 w-full text-center">
    
    {/* Badge */}
    <span className="inline-block px-6 py-3 rounded-full text-sm font-bold mb-8 animate-fade-up badge-success" style={{
      background: 'rgba(212, 175, 55, 0.15)',
      color: 'var(--gold-light)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      letterSpacing: '0.05em',
      display: 'inline-block'  // ✅ Badge في الوسط
    }}>
      🏠 {language === 'ar' ? 'شريكك العقاري الموثوق' : 'Votre Partenaire Immobilier de Confiance'}
    </span>
    
    {/* ✅ العنوان المتدرج (ذهبي → أبيض) */}
    <h2 className="mb-6 animate-fade-up" style={{
      fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',     // ✅ حجم أكبر قليلاً
      fontWeight: '900',
      lineHeight: '1.15',
      marginBottom: '25px',
      animationDelay: '0.15s',
      fontFamily: 'var(--font-arabic)',
      textAlign: 'center',                        // ✅ في الوسط
      // ✅ التدرج اللوني (ذهبي → أبيض)
      background: 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 25%, #FFFFFF 50%, #E5C76B 75%, #D4AF37 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      // ✅ تأثير توهج حول النص
      filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))'
    }}>
      {language === 'ar' ? 'SOLUTION' : 'SOLUTION'}
      <br />
      <span style={{ 
        fontFamily: 'var(--font-decorative)', 
        fontSize: '0.7em', 
        display: 'block', 
        marginTop: '12px',
        fontWeight: '400',
        // ✅ الخط الثاني أيضاً متدرج
        background: 'linear-gradient(135deg, #FFFFFF 0%, #E5C76B 50%, #D4AF37 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {language === 'ar' ? 'Immobilier' : 'Immobilier'}
      </span>
    </h2>
    
    {/* ✅ الوصف في الوسط */}
    <p className="text-base md:text-lg mx-auto mb-12 animate-fade-up" style={{
      color: 'var(--muted)',
      lineHeight: '2.1',                          // ✅ Line-height أفضل
      animationDelay: '0.3s',
      fontSize: '1.08rem',
      maxWidth: '700px',                           // ✅ عرض محدود للوصف
      margin: '0 auto 48px auto',                  // ✅ توسيط تلقائي
      textAlign: 'center'                           // ✅ نص في الوسط
    }}>
      {language === 'ar' 
        ? 'مشروعك، أولويتنا. نقدم لكم أفضل الحلول العقارية في الدار البيضاء، بوسكورة وسيدي معروف بأمان واحترافية' 
        : 'Votre projet, notre priorité. Les meilleures solutions immobilières à Casablanca, Bouskoura et Sidi Maârouf'}
    </p>

    {/* ✅ الأزرار في الوسط */}
    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-up" style={{ 
      animationDelay: '0.45s' 
    }}>
      <Link href="/properties" className="btn-primary animate-pulse-gold inline-flex items-center justify-center gap-3" style={{
        padding: '16px 42px',
        borderRadius: '30px',
        fontSize: '1.05rem',
        fontWeight: '800'
      }}>
        {language === 'ar' ? 'استكشف العقارات' : 'Voir les Biens'} ←
      </Link>
      
      <Link href="https://web.facebook.com/SOLUTION.ImmobilierS" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center justify-center gap-3" style={{
        padding: '16px 42px',
        borderRadius: '30px',
        fontSize: '1.05rem',
        fontWeight: '700'
      }}>
        📱 Facebook
      </Link>
    </div>
  </div>

  {/* ✅ 🔑 المفتاح (أعلى يمين - يتحرك) */}
  <div style={{
    position: 'absolute',
    top: '12%',
    right: '6%',
    fontSize: '4.5rem',
    opacity: 0.28,
    animation: 'floatKey 6s ease-in-out infinite',
    zIndex: 3,
    filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.35))'
  }}>🔑</div>

  {/* ✅ 🏠 البيت (أسفل يسار - يتحرك) */}
  <div style={{
    position: 'absolute',
    bottom: '15%',
    left: '5%',
    fontSize: '5rem',
    opacity: 0.28,
    animation: 'floatHouse 7s ease-in-out infinite',
    zIndex: 3,
    filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.4))'
  }}>🏠</div>

  {/* ✅ 🏢 مبنى (وسط يمين - حركة بطيئة) */}
  <div style={{
    position: 'absolute',
    top: '40%',
    right: '12%',
    fontSize: '3.8rem',
    opacity: 0.18,
    animation: 'floatBuilding 8s ease-in-out infinite',
    zIndex: 3,
    filter: 'drop-shadow(0 0 18px rgba(212, 175, 55, 0.3))'
  }}>🏢</div>

</section>

      {/* ===== FEATURES ===== */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center mb-16 scroll-animate">
            <h3 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'white' }}>
              {language === 'ar' ? 'لماذا تختارنا ؟' : 'Pourquoi Nous Choisir ?'}
            </h3>
            <div className="w-24 h-1 mx-auto" style={{ background: 'var(--gradient-gold)', borderRadius: '2px' }}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            
            <div className="feature-card scroll-animate" style={{
              background: 'linear-gradient(145deg, var(--bg-card), #162033)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div className="feature-icon" style={{
                width: '85px', height: '85px', margin: '0 auto 25px',
                background: 'var(--gradient-gold)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', boxShadow: 'var(--shadow-gold)'
              }}>🏠</div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'عقارات متنوعة' : 'Biens Variés'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'شقق، فيلا، محلات تجارية' : 'Appartements, Villas, Commerces'}
              </p>
            </div>

            <div className="feature-card scroll-animate" style={{
              background: 'linear-gradient(145deg, var(--bg-card), #162033)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              animationDelay: '0.15s'
            }}>
              <div className="feature-icon" style={{
                width: '85px', height: '85px', margin: '0 auto 25px',
                background: 'var(--gradient-gold)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', boxShadow: 'var(--shadow-gold)'
              }}>📍</div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'مواقع استراتيجية' : 'Meilleurs Emplacements'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'الدار البيضاء، بوسكورة، سيدي معروف' : 'Casablanca, Bouskoura, Sidi Maârouf'}
              </p>
            </div>

            <div className="feature-card scroll-animate" style={{
              background: 'linear-gradient(145deg, var(--bg-card), #162033)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              animationDelay: '0.3s'
            }}>
              <div className="feature-icon" style={{
                width: '85px', height: '85px', margin: '0 auto 25px',
                background: 'var(--gradient-gold)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', boxShadow: 'var(--shadow-gold)'
              }}>💰</div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'أسعار تنافسية' : 'Prix Compétitifs'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'خيارات لكل الميزانيات' : 'Options pour tous budgets'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20" style={{ background: 'var(--gradient-navy)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat-card scroll-animate">
              <div className="stat-number">+250</div>
              <div className="stat-label">{language === 'ar' ? 'عقار مباع' : 'Biens Vendus'}</div>
            </div>
            <div className="stat-card scroll-animate" style={{ animationDelay: '0.1s' }}>
              <div className="stat-number">+180</div>
              <div className="stat-label">{language === 'ar' ? 'عميل سعيد' : 'Clients Satisfaits'}</div>
            </div>
            <div className="stat-card scroll-animate" style={{ animationDelay: '0.2s' }}>
              <div className="stat-number">+15</div>
              <div className="stat-label">{language === 'ar' ? 'سنة خبرة' : "Ans d'Expérience"}</div>
            </div>
            <div className="stat-card scroll-animate" style={{ animationDelay: '0.3s' }}>
              <div className="stat-number">24/7</div>
              <div className="stat-label">{language === 'ar' ? 'دعم متواصل' : 'Support Continu'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'var(--gradient-navy)',
        borderTop: '4px solid transparent',
        borderImage: 'var(--gradient-gold) 1',
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23D4AF37' fill-opacity='0.03' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
          backgroundSize: 'cover', backgroundPosition: 'bottom', pointerEvents: 'none', opacity: 0.5
        }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: '50px', height: '50px', background: 'var(--gradient-gold)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'var(--shadow-gold)' }}>🏢</div>
                <div>
                  <div className="font-black text-white text-lg leading-tight">SOLUTION</div>
                  <div className="font-semibold tracking-wider" style={{ color: 'var(--gold-primary)', fontSize: '0.75rem' }}>IMMOBILIER</div>
                </div>
              </div>
              <p className="mb-6" style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'شريكك العقاري الموثوق.' : 'Votre partenaire immobilier de confiance.'}
              </p>
              
              <div className="flex gap-3">
                <a href="https://web.facebook.com/SOLUTION.ImmobilierS" target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontSize: '1.2rem' }}>📘</a>
                
                <a href={`https://wa.me/212607633144?text=${encodeURIComponent(language === 'ar' ? 'مرحباً من موقع SOLUTION' : 'Bonjour depuis SOLUTION')}`} target="_blank" rel="noopener noreferrer" className="social-link" style={{ width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontSize: '1.2rem' }}>💬</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                {language === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '3px', background: 'var(--gradient-gold)', borderRadius: '2px' }}></span>
              </h4>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-gold transition inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>{language === 'ar' ? '← الرئيسية' : 'Accueil →'}</Link></li>
                <li><Link href="/properties" className="hover:text-gold transition inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>{language === 'ar' ? '← العقارات' : 'Biens →'}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                {language === 'ar' ? 'خدماتنا' : 'Nos Services'}
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '3px', background: 'var(--gradient-gold)', borderRadius: '2px' }}></span>
              </h4>
              <ul className="space-y-3">
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• بيع العقارات' : '• Vente'}</span></li>
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• إيجار' : '• Location'}</span></li>
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• استثمار' : '• Investissement'}</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                {language === 'ar' ? 'تواصل معنا' : 'Contactez-Nous'}
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '3px', background: 'var(--gradient-gold)', borderRadius: '2px' }}></span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div style={{ width: '42px', height: '42px', minWidth: '42px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>📞</div>
                  <div>
                    <strong className="block text-white text-sm mb-1">{language === 'ar' ? 'هاتف' : 'Téléphone'}</strong>
                    <a href="tel:+212607633144" className="hover:text-gold transition" style={{ color: 'var(--muted)' }} dir="ltr">+212 607 63 31 44</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div style={{ width: '42px', height: '42px', minWidth: '42px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>📍</div>
                  <div>
                    <strong className="block text-white text-sm mb-1">{language === 'ar' ? 'العناوين' : 'Adresses'}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{language === 'ar' ? 'الدار البيضاء | بوسكورة | سيدي معروف' : 'Casablanca | Bouskoura | Sidi Maârouf'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} SOLUTION Immobilier - {language === 'ar' ? 'جميع الحقوق محفوظة ❤️' : 'Tous droits réservés ❤️'}
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ WhatsApp Floating Button */}
      <a href={`https://wa.me/212607633144?text=${encodeURIComponent(language === 'ar' ? 'مرحباً، أنا مهتم بخدماتكم' : 'Bonjour, je suis intéressé')}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-50 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        style={{ width: '65px', height: '65px', background: '#25D366', borderRadius: '50%', color: 'white', fontSize: '2rem', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
        title={language === 'ar' ? 'واتساب' : 'WhatsApp'}
      >
        💬
      </a>

      {/* ✅ CSS Animations للحركات الجديدة */}
      <style jsx>{`
        .nav-link {
          padding: 12px 22px;
          border-radius: 14px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          background: rgba(212, 175, 55, 0.12);
          color: #D4AF37;
          transform: translateY(-2px);
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          border-color: #D4AF37 !important;
          box-shadow: 0 15px 50px rgba(212, 175, 55, 0.25) !important;
        }
        .feature-card:hover .feature-icon {
          transform: rotateY(360deg);
        }
        
        /* ✅ حركة المفتاح (صعود/نزول + دوران خفيف) */
        @keyframes floatKey {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-25px) rotate(5deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(-3deg); 
          }
          75% { 
            transform: translateY(-30px) rotate(3deg); 
          }
        }
        
        /* ✅ حركة البيت (صعود/نزول + ميلان) */
        @keyframes floatHouse {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(25px) rotate(-4deg) scale(1.05); 
          }
          66% { 
            transform: translateY(-15px) rotate(3deg) scale(0.98); 
          }
        }
        
        /* ✅ حركة المبنى (بطيئة وسلسة) */
        @keyframes floatBuilding {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.15; 
          }
          50% { 
            transform: translateY(-20px); 
            opacity: 0.25; 
          }
        }
        
        /* حركة النجوم */
        @keyframes starsMove {
          from { transform: translateY(0); }
          to { transform: translateY(-150px); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 20px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        
        .social-link:hover {
          background: #D4AF37 !important;
          color: #0A1628 !important;
          transform: translateY(-5px);
        }
      `}</style>

    </div>
  );
}
