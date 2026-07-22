"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ تأثير التمرير للـ Header
  if (typeof window !== "undefined") {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 100);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      
      {/* ===== HEADER (✅ محسن - أكبر مع خلفية فاخرة) ===== */}
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
            
            {/* ✅ الشعار المحسن */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
              <div className="logo-icon animate-glow" style={{
                width: '55px',
                height: '55px',
                background: 'var(--gradient-gold)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: 'var(--shadow-gold)',
                transition: 'transform 0.3s ease'
              }}>
                🏢
              </div>
              <div>
                <h1 className="text-xl font-black leading-tight" style={{ 
                  color: 'white', 
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  SOLUTION
                </h1>
                <p className="text-xs font-semibold tracking-widest" style={{ 
                  color: 'var(--gold-primary)',
                  marginTop: '2px'
                }}>
                  IMMOBILIER
                </p>
              </div>
            </Link>

            {/* Desktop Navigation (✅ محسن) */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" className="nav-link">{t.nav.home}</Link>
              <Link href="/properties" className="nav-link">{t.nav.properties}</Link>
              <Link href="/login" className="btn-primary" style={{
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: '800'
              }}>
                {t.nav.login}
              </Link>
              
              {/* ✅ زر تبديل اللغة المحسن */}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-xl transition"
              style={{ color: 'var(--gold-primary)' }}
            >
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* Mobile Menu (✅ محسن) */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-6 border-t animate-fade-up" style={{
              borderColor: 'var(--border-color)',
              paddingTop: '20px',
              marginTop: '15px'
            }}>
              <Link href="/" className="block py-3 px-4 rounded-lg mb-2 hover-lift" style={{ color: 'white' }}>
                {t.nav.home}
              </Link>
              <Link href="/properties" className="block py-3 px-4 rounded-lg mb-2 hover-lift" style={{ color: 'white' }}>
                {t.nav.properties}
              </Link>
              <Link href="/login" className="block py-3 px-4 rounded-lg mb-4 hover-lift" style={{ color: 'white' }}>
                {t.nav.login}
              </Link>
              <div className="px-4">
                <LanguageSwitcher />
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* ===== HERO SECTION (✅ محسن - مع نجوم متحركة وخلفية فاخرة) ===== */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 py-32 md:py-40 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <span className="inline-block px-6 py-3 rounded-full text-sm font-bold mb-8 border animate-fade-up badge-success" style={{
              background: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--gold-light)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              letterSpacing: '0.05em'
            }}>
              🏠 {language === 'ar' ? 'شريكك العقاري الموثوق' : 'Votre Partenaire Immobilier de Confiance'}
            </span>
            
            {/* Title */}
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-up" style={{
              animationDelay: '0.15s',
              lineHeight: '1.15'
            }}>
              <span style={{ color: 'var(--gold-primary)' }}>
                {language === 'ar' ? 'SOLUTION' : 'SOLUTION'}
              </span>
              <br />
              <span style={{ 
                color: 'white',
                fontFamily: 'var(--font-decorative)',
                fontSize: '0.75em',
                display: 'block',
                marginTop: '10px',
                fontWeight: '400'
              }}>
                {language === 'ar' ? 'Immobilier' : 'Immobilier'}
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 animate-fade-up" style={{
              color: 'var(--muted)',
              lineHeight: '2', /* ✅ تحسين Line-height */
              animationDelay: '0.3s'
            }}>
              {language === 'ar' 
                ? 'مشروعك، أولويتنا. نقدم لكم أفضل الحلول العقارية في الدار البيضاء، بوسكورة وسيدي معروف - شقق، فيلا، محلات تجارية بأمان واحترافية' 
                : 'Votre projet, notre priorité. Nous vous proposons les meilleures solutions immobilières à Casablanca, Bouskoura et Sidi Maârouf'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up" style={{
              animationDelay: '0.45s'
            }}>
              <Link 
                href="/properties" 
                className="btn-primary animate-pulse-gold inline-flex items-center justify-center gap-3"
                style={{
                  padding: '18px 45px',
                  borderRadius: '30px',
                  fontSize: '1.15rem',
                  fontWeight: '900'
                }}
              >
                {language === 'ar' ? 'استكشف العقارات' : 'Voir les Biens'} ←
              </Link>
              
              <Link 
                href="https://web.facebook.com/SOLUTION.ImmobilierS" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-3"
                style={{
                  padding: '18px 45px',
                  borderRadius: '30px',
                  fontSize: '1.15rem',
                  fontWeight: '700'
                }}
              >
                📱 Facebook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION (✅ محسن - بطاقات ذهبية) ===== */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Section Title */}
          <div className="text-center mb-16 scroll-animate">
            <h3 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'white' }}>
              {language === 'ar' ? 'لماذا تختارنا ؟' : 'Pourquoi Nous Choisir ?'}
            </h3>
            <div className="w-24 h-1 mx-auto" style={{ background: 'var(--gradient-gold)', borderRadius: '2px' }}></div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="feature-card scroll-animate" style={{
              background: 'linear-gradient(145deg, var(--bg-card), #162033)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div className="feature-icon" style={{
                width: '85px',
                height: '85px',
                margin: '0 auto 25px',
                background: 'var(--gradient-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: 'var(--shadow-gold)',
                transition: 'transform 0.6s ease'
              }}>
                🏠
              </div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'عقارات متنوعة' : 'Biens Variés'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'شقق، فيلا، محلات تجارية - خيارات تلبي كل احتياجاتكم' : 'Appartements, Villas, Commerces - Des options pour tous vos besoins'}
              </p>
            </div>

            {/* Feature 2 */}
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
                width: '85px',
                height: '85px',
                margin: '0 auto 25px',
                background: 'var(--gradient-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: 'var(--shadow-gold)'
              }}>
                📍
              </div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'مواقع استراتيجية' : 'Meilleurs Emplacements'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'الدار البيضاء، بوسكورة، سيدي معروف - أفضل المواقع' : 'Casablanca, Bouskoura, Sidi Maârouf - Les meilleurs emplacements'}
              </p>
            </div>

            {/* Feature 3 */}
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
                width: '85px',
                height: '85px',
                margin: '0 auto 25px',
                background: 'var(--gradient-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: 'var(--shadow-gold)'
              }}>
                💰
              </div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>
                {language === 'ar' ? 'أسعار تنافسية' : 'Prix Compétitifs'}
              </h4>
              <p style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' ? 'خيارات لكل الميزانيات - استثمار آمن ومربح' : 'Options pour tous budgets - Investissement sûr et rentable'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STATS SECTION (✅ جديد - إحصائيات) ===== */}
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

      {/* ===== FOOTER (✅ محسن - احترافي 4 أعمدة) ===== */}
      <footer style={{
        background: 'var(--gradient-navy)',
        borderTop: '4px solid transparent',
        borderImage: 'var(--gradient-gold) 1',
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23D4AF37' fill-opacity='0.03' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          pointerEvents: 'none',
          opacity: 0.5
        }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'var(--gradient-gold)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: 'var(--shadow-gold)'
                }}>🏢</div>
                <div>
                  <div className="font-black text-white text-lg leading-tight">SOLUTION</div>
                  <div className="font-semibold tracking-wider" style={{ color: 'var(--gold-primary)', fontSize: '0.75rem' }}>IMMOBILIER</div>
                </div>
              </div>
              <p className="mb-6" style={{ color: 'var(--muted)', lineHeight: '1.9' }}>
                {language === 'ar' 
                  ? 'شريكك العقاري الموثوق. نساعدكم في العثور على عقار أحلامكم بأفضل الأسعار وفي أفضل المواقع.'
                  : 'Votre partenaire immobilier de confiance. Nous vous aidons à trouver le bien de vos rêves aux meilleurs prix.'}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="https://web.facebook.com/SOLUTION.ImmobilierS" target="_blank" rel="noopener noreferrer" className="social-link" style={{
                  width: '45px',
                  height: '45px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}>📘</a>
                
                {/* ✅ واتساب بالرقم الصحيح */}
                <a href={`https://wa.me/212607633144?text=${encodeURIComponent(language === 'ar' ? 'مرحباً من موقع SOLUTION Immobilier' : 'Bonjour depuis SOLUTION Immobilier')}`} target="_blank" rel="noopener noreferrer" className="social-link" style={{
                  width: '45px',
                  height: '45px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}>💬</a>
                
                <a href="#" className="social-link" style={{
                  width: '45px',
                  height: '45px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}>📷</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ 
                color: 'var(--gold-primary)',
                fontSize: '1.1rem'
              }}>
                {language === 'ar' ? 'روابط سريعة' : 'Liens Rapides'}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '40px',
                  height: '3px',
                  background: 'var(--gradient-gold)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul className="space-y-3">
                <li><Link href="/" className="hover:text-gold transition inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>{language === 'ar' ? '← الرئيسية' : 'Accueil →'}</Link></li>
                <li><Link href="/properties" className="hover:text-gold transition inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>{language === 'ar' ? '← العقارات' : 'Biens →'}</Link></li>
                <li><Link href="/login" className="hover:text-gold transition inline-flex items-center gap-2" style={{ color: 'var(--muted)' }}>{language === 'ar' ? '← تسجيل الدخول' : 'Connexion →'}</Link></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ 
                color: 'var(--gold-primary)',
                fontSize: '1.1rem'
              }}>
                {language === 'ar' ? 'خدماتنا' : 'Nos Services'}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '40px',
                  height: '3px',
                  background: 'var(--gradient-gold)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              <ul className="space-y-3">
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• بيع العقارات' : '• Vente Immobilière'}</span></li>
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• إيجار العقارات' : '• Location Immobilière'}</span></li>
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• استثمار عقاري' : '• Investissement'}</span></li>
                <li><span style={{ color: 'var(--muted)' }}>{language === 'ar' ? '• استشارات' : '• Conseil'}</span></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="font-bold mb-6 relative pb-3" style={{ 
                color: 'var(--gold-primary)',
                fontSize: '1.1rem'
              }}>
                {language === 'ar' ? 'تواصل معنا' : 'Contactez-Nous'}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '40px',
                  height: '3px',
                  background: 'var(--gradient-gold)',
                  borderRadius: '2px'
                }}></span>
              </h4>
              
              <div className="space-y-4">
                
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    fontSize: '1.1rem'
                  }}>📞</div>
                  <div>
                    <strong className="block text-white text-sm mb-1">{language === 'ar' ? 'هاتف' : 'Téléphone'}</strong>
                    <a href="tel:+212607633144" className="hover:text-gold transition" style={{ color: 'var(--muted)' }} dir="ltr">+212 607 63 31 44</a>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-3">
                  <div style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    fontSize: '1.1rem'
                  }}>📍</div>
                  <div>
                    <strong className="block text-white text-sm mb-1">{language === 'ar' ? 'العناوين' : 'Adresses'}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                      {language === 'ar' ? 'الدار البيضاء | بوسكورة | سيدي معروف' : 'Casablanca | Bouskoura | Sidi Maârouf'}
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <div style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    fontSize: '1.1rem'
                  }}>⏰</div>
                  <div>
                    <strong className="block text-white text-sm mb-1">{language === 'ar' ? 'ساعات العمل' : 'Horaires'}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                      {language === 'ar' ? 'الإثنين - السبت: 9ص - 8م' : 'Lun - Sam: 9h - 20h'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="pt-8 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} SOLUTION Immobilier - {language === 'ar' ? 'جميع الحقوق محفوظة | صنع بـ ❤️' : 'Tous droits réservés | Fait avec ❤️'}
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ WhatsApp Floating Button (زر عائم) */}
      <a 
        href={`https://wa.me/212607633144?text=${encodeURIComponent(language === 'ar' ? 'مرحباً، أنا مهتم بخدماتكم من الموقع' : 'Bonjour, je suis intéressé par vos services depuis le site')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-50 flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        style={{
          width: '65px',
          height: '65px',
          background: '#25D366',
          borderRadius: '50%',
          color: 'white',
          fontSize: '2rem',
          animation: 'pulse 2.5s infinite',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)'
        }}
        title={language === 'ar' ? 'تواصل عبر واتساب' : 'Contactez-nous sur WhatsApp'}
      >
        💬
      </a>

      {/* CSS for animations in this component */}
      <style jsx>{`
        .nav-link {
          padding: 12px 22px;
          border-radius: 14px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
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