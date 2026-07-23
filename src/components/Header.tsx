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
          
          {/* الشعار (يمين) */}
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

          {/* Desktop Navigation */}
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
                whiteSpace: "nowrap",
              }}
            >
              {t.nav?.login || language === "ar" ? "دخول" : "Connexion"}
            </Link>

            <LanguageSwitcher />
          </nav>

          {/* زر Hamburger - أنيق */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hamburger-btn"
            style={{
              display: "none",
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              color: "var(--gold-primary)",
              background: mobileMenuOpen ? "rgba(212, 175, 55, 0.15)" : "transparent",
              border: mobileMenuOpen ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
              cursor: "pointer",
              zIndex: 10001,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ===== Overlay خفي ===== */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 9997,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* ===== 🎨 Side Drawer - قائمة جانبية منزلقة ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          maxWidth: "85vw",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #162033 100%)",
          zIndex: 9998,
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-105%)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: mobileMenuOpen ? "4px 0 40px rgba(0,0,0,0.4)" : "none",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* رأس القائمة */}
        <div style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
          background: "rgba(212, 175, 55, 0.03)",
        }}>
          {/* شعار صغير */}
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              fontSize: "1.15rem",
              fontWeight: "900",
              background: "linear-gradient(135deg, #D4AF37, #FFFFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "2px",
            }}>
              SOLUTION IMMOBILIER
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "1px" }}>
              {language === 'ar' ? 'حلول عقارية' : 'Solutions Immobilières'}
            </div>
          </Link>
        </div>

        {/* الروابط الرئيسية */}
        <nav style={{ padding: "16px 16px", flex: 1 }}>
          
          {/* عنصر القائمة المطور */}
          <DrawerItem 
            href="/" 
            icon={<HomeIcon />}
            text={language === "ar" ? "الرئيسية" : "Accueil"}
            onClick={() => setMobileMenuOpen(false)}
            isFirst
          />
          
          <DrawerItem 
            href="/properties" 
            icon={<BuildingIcon />}
            text={language === "ar" ? "العقارات" : "Biens"}
            onClick={() => setMobileMenuOpen(false)}
          />
          
   <DrawerItem 
  href="/favorites" 
  icon={<HeartIcon />}
  text={language === 'ar' ? "المفضلة" : "Favoris"}  ← ✅ صحّح هذا
  badge={state.favorites?.length || 0}
  onClick={() => setMobileMenuOpen(false)}
  highlight
/>
          
          <DrawerItem 
            href="/archive" 
            icon={<ArchiveIcon />}
            text={language === "ar" ? "الأرشيف" : "Archive"}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* فاصل */}
          <div style={{ 
            height: "1px", 
            background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)", 
            margin: "20px 12px 16px" 
          }}></div>

          <DrawerItem 
            href="/login" 
            icon={<LoginIcon />}
            text={t.nav?.login || language === "ar" ? "دخول" : "Connexion"}
            onClick={() => setMobileMenuOpen(false)}
            isPrimary
          />

          {/* اللغة */}
          <div style={{ padding: "16px 12px 8px" }}>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* التذييل */}
        <div style={{ 
          padding: "20px 24px",
          borderTop: "1px solid rgba(212, 175, 55, 0.1)",
          background: "rgba(0,0,0,0.15)",
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            marginBottom: "10px"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #D4AF37, #E5C76B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}>🏢</div>
            <div>
              <div style={{ color: "white", fontWeight: "700", fontSize: "0.85rem" }}>
                SOLUTION Immobilier
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.7rem" }}>
                الدار البيضاء، المغرب
              </div>
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.68rem", margin: 0 }}>
            © 2024 - جميع الحقوق محفوظة
          </p>
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

// ===== أيقونات SVG مخصصة =====
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01M16 6h.01M12 11h.01M12 16h.01M8 11h.01M16 11h.01M8 16h.01M16 16h.01"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/>
      <rect x="1" y="3" width="22" height="5" rx="1" ry="1"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  );
}

// ===== مكون عنصر القائمة =====
function DrawerItem({ 
  href, 
  icon, 
  text, 
  badge, 
  isPrimary, 
  isFirst,
  highlight,
  onClick 
}: { 
  href: string; 
  icon: React.ReactNode; 
  text: string; 
  badge?: number;
  isPrimary?: boolean;
  isFirst?: boolean;
  highlight?: boolean;
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
        padding: isFirst ? "16px 18px" : "14px 18px",
        borderRadius: "14px",
        textDecoration: "none",
        color: isPrimary ? "#1a1a2e" : "white",
        background: isPrimary 
          ? "linear-gradient(135deg, #D4AF37, #E5C76B)" 
          : highlight
            ? "rgba(239, 68, 68, 0.08)"
            : "transparent",
        border: isPrimary 
          ? "none" 
          : highlight
            ? "1px solid rgba(239, 68, 68, 0.15)"
            : "1px solid transparent",
        fontWeight: isPrimary ? "800" : "600",
        fontSize: "0.98rem",
        transition: "all 0.25s ease",
        marginTop: isFirst ? "0" : "2px",
      }}
    >
      {/* حاوية الأيقونة */}
      <span style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isPrimary 
          ? "rgba(255,255,255,0.2)"
          : highlight
            ? "rgba(239, 68, 68, 0.1)"
            : "rgba(255,255,255,0.05)",
        color: isPrimary ? "#1a1a2e" : highlight ? "#EF4444" : "var(--gold-primary)",
        flexShrink: 0,
      }}>
        {icon}
      </span>
      
      {/* النص */}
      <span style={{ flex: 1 }}>{text}</span>
      
      {/* Badge */}
      {badge !== undefined && badge > 0 && !isPrimary && (
        <span style={{
          background: highlight ? "#EF4444" : "var(--gold-primary)",
          color: "white",
          borderRadius: "20px",
          minWidth: "24px",
          height: "24px",
          fontSize: "11px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: "0 8px",
          boxShadow: highlight ? "0 2px 8px rgba(239, 68, 68, 0.35)" : "0 2px 8px rgba(212, 175, 55, 0.25)",
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      
      {/* سهم */}
      <span style={{ 
        opacity: 0.35, 
        fontSize: "0.9rem",
        color: isPrimary ? "#1a1a2e" : "inherit",
      }}>←</span>
    </Link>
  );
}
