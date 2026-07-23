"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t, language } = useLanguage();
  const { state } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: scrolled ? "65px" : "70px",
          background: scrolled ? "rgba(15, 23, 42, 0.97)" : "var(--gradient-navy)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: scrolled ? "2px solid var(--gold-primary)" : "1px solid rgba(212, 175, 55, 0.15)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
          zIndex: 9999,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ 
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 20px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          
          {/* ===== الشعار (يمين) ===== */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              fontSize: scrolled ? "0.95rem" : "1rem",
              fontWeight: "900",
              letterSpacing: "2px",
              background: "linear-gradient(135deg, #FFFFFF 0%, #D4AF37 50%, #FFFFFF 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}>
              SOLUTION IMMOBILIER
            </div>
          </Link>

          {/* ===== Desktop Navigation (يسار) - يختفي على الموبايل ===== */}
          <nav className="desktop-nav" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px" 
          }}>
            
            <Link href="/" className="nav-link">
              {language === "ar" ? "الرئيسية" : "Accueil"}
            </Link>

            <Link href="/properties" className="nav-link">
              {language === "ar" ? "العقارات" : "Biens"}
            </Link>

            <Link
              href="/favorites"
              className="nav-link icon-btn"
              style={{ position: "relative", padding: "8px 12px" }}
              title={language === "ar" ? "المفضلة" : "Favoris"}
            >
              <span style={{ fontSize: "1.15rem" }}>المفضلة❤️</span>
              {state.favorites && state.favorites.length > 0 && (
                <span style={{
                  position: "absolute", top: "-3px", right: "-5px",
                  background: "#EF4444", color: "white", borderRadius: "50%",
                  width: "18px", height: "18px", fontSize: "9px", fontWeight: "900",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.5)",
                }}>
                  {state.favorites.length > 9 ? '9+' : state.favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/archive"
              className="nav-link icon-btn"
              style={{ padding: "8px 12px" }}
              title={language === "ar" ? "الأرشيف" : "Archive"}
            >
              <span style={{ fontSize: "1.15rem" }}>الأرشيف📦</span>
            </Link>

            <Link
              href="/login"
              className="btn-login"
              style={{
                padding: "8px 20px",
                borderRadius: "25px",
                fontWeight: "800",
                fontSize: "0.85rem",
                background: "var(--gradient-gold)",
                color: "#1a1a2e",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              {t.nav?.login || language === "ar" ? "دخول" : "Connexion"}
            </Link>

            <LanguageSwitcher />
          </nav>

          {/* ===== زر Hamburger (موبايل فقط) ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hamburger-btn"
            style={{
              display: "none",
              padding: "8px",
              borderRadius: "10px",
              color: "var(--gold-primary)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 10001,
            }}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ===== Overlay خلفي ===== */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(5px)",
            zIndex: 9998,
          }}
        />
      )}

      {/* ===== Mobile Menu (Full Screen) ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          zIndex: 9999,
          transform: mobileMenuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          paddingTop: "70px",
          paddingBottom: "40px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        {/* رأس القائمة */}
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: "900",
            background: "linear-gradient(135deg, #D4AF37, #FFFFFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "4px",
          }}>
            SOLUTION IMMOBILIER
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            {language === 'ar' ? 'مرحباً بك' : 'Bienvenue'}
          </div>
        </div>

        {/* الروابط */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          
          <MobileLink href="/" icon="🏠" text={language === "ar" ? "الرئيسية" : "Accueil"} onClick={() => setMobileMenuOpen(false)} />
          <MobileLink href="/properties" icon="🏠" text={language === "ar" ? "العقارات" : "Biens"} onClick={() => setMobileMenuOpen(false)} />
          <MobileLink 
            href="/favorites" 
            icon="❤️" 
            text={`${language === 'ar' ? 'المفضلة' : 'Favoris'} (${state.favorites?.length || 0})`}
            badge={state.favorites?.length || 0}
            onClick={() => setMobileMenuOpen(false)} 
          />
          <MobileLink href="/archive" icon="📦" text={language === "ar" ? "الأرشيف" : "Archive"} onClick={() => setMobileMenuOpen(false)} />
          
          {/* فاصل */}
          <div style={{ height: "1px", background: "var(--border-color)", margin: "16px 0" }}></div>
          
          <MobileLink 
            href="/login" 
            icon="🔐" 
            text={t.nav?.login || language === "ar" ? "دخول" : "Connexion"} 
            isPrimary 
            onClick={() => setMobileMenuOpen(false)} 
          />

          <div style={{ paddingTop: "16px" }}>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* التذييل */}
        <div style={{ 
          position: "absolute", 
          bottom: "30px", 
          left: "24px", 
          right: "24px",
          textAlign: "center",
        }}>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>© 2024 SOLUTION Immobilier</p>
        </div>
      </div>

      <style jsx>{`
        .desktop-nav {
          display: flex;
        }

        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }

        .nav-link {
          padding: 8px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.88rem;
          color: white;
          transition: all 0.25s ease;
          text-decoration: none;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(212, 175, 55, 0.12);
          color: #d4af37;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.45);
        }

        @keyframes shimmer {
          0% { background-position: 0 center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </>
  );
}

// ===== مكون الرابط المتنقل =====
function MobileLink({ 
  href, 
  icon, 
  text, 
  badge, 
  isPrimary, 
  onClick 
}: { 
  href: string; 
  icon: string; 
  text: string; 
  badge?: number;
  isPrimary?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "15px 18px",
        borderRadius: "13px",
        textDecoration: "none",
        color: isPrimary ? "#1a1a2e" : "white",
        background: isPrimary ? "linear-gradient(135deg, #D4AF37, #E5C76B)" : "transparent",
        fontWeight: isPrimary ? "800" : "600",
        fontSize: "1.05rem",
        transition: "all 0.2s ease",
        border: isPrimary ? "none" : "1px solid transparent",
      }}
    >
      <span style={{ fontSize: "1.35rem", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{text}</span>
      {badge !== undefined && badge > 0 && !isPrimary && (
        <span style={{
          background: "#EF4444",
          color: "white",
          borderRadius: "50%",
          minWidth: "22px",
          height: "22px",
          fontSize: "11px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: "0 6px",
        }}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
      <span style={{ opacity: 0.4 }}>←</span>
    </Link>
  );
}
