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
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: scrolled ? "75px" : "var(--header-height, 95px)",
        background: "var(--gradient-navy)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: scrolled ? "2px solid var(--gold-primary)" : "2px solid transparent",
        borderImage: scrolled ? "var(--gradient-gold) 1" : "none",
        boxShadow: scrolled 
          ? "0 8px 40px rgba(0,0,0,0.4)" 
          : "0 4px 30px rgba(0,0,0,0.3)",
        zIndex: 9999,
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* ===== Desktop Navigation (يمين) ===== */}
          <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            
            {/* الرئيسية */}
            <Link href="/" className="nav-link">
              {language === "ar" ? "الرئيسية" : "Accueil"}
            </Link>

            {/* العقارات */}
            <Link href="/properties" className="nav-link">
              {language === "ar" ? "العقارات" : "Biens"}
            </Link>

            {/* ✅❤️ المفضلة - أيقونة فقط */}
            <Link
              href="/favorites"
              className="nav-link icon-btn"
              style={{ position: "relative", padding: "10px 14px" }}
              title={language === "ar" ? "المفضلة" : "Favoris"}
            >
              <span style={{ fontSize: "1.3rem" }}>المفضلة❤️</span>
              {/* Badge */}
              {state.favorites && state.favorites.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-6px",
                    background: "#EF4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "10px",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(239, 68, 68, 0.5)",
                  }}
                >
                  {state.favorites.length}
                </span>
              )}
            </Link>

            {/* ✅📦 الأرشيف - أيقونة فقط */}
            <Link
              href="/archive"
              className="nav-link icon-btn"
              style={{ padding: "10px 14px" }}
              title={language === "ar" ? "الأرشيف" : "Archive"}
            >
              <span style={{ fontSize: "1.3rem" }}>الأرشيف📦</span>
            </Link>

            {/* زر تسجيل الدخول */}
            <Link
              href="/login"
              className="btn-primary"
              style={{
                padding: scrolled ? "10px 24px" : "12px 28px",
                borderRadius: "30px",
                fontWeight: "800",
                fontSize: scrolled ? "0.9rem" : "1rem",
                background: "var(--gradient-gold)",
                color: "var(--bg-primary)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              {t.nav?.login || language === "ar" ? "دخول" : "Connexion"}
            </Link>

            {/* زر اللغة */}
            <LanguageSwitcher />
          </nav>

          {/* ===== الشعار (يسار) - تدرج ذهبي أبيض ===== */}
          <Link
            href="/"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              textDecoration: "none"
            }}
            className="logo-container"
          >
            <div
              style={{
                fontSize: scrolled ? "1.4rem" : "1.7rem",
                fontWeight: "900",
                letterSpacing: "2px",
                transition: "font-size 0.3s ease",
                background: "linear-gradient(135deg, #FFFFFF 0%, #D4AF37 50%, #FFFFFF 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}
            >
              SOLUTION
            </div>
            <div
              style={{
                fontSize: scrolled ? "0.7rem" : "0.85rem",
                color: "var(--gold-primary)",
                letterSpacing: "3px",
                fontWeight: "600",
                marginTop: "3px",
                marginLeft: "8px",
                transition: "font-size 0.3s ease",
              }}
            >
              IMMOBILIER
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              padding: "10px",
              borderRadius: "10px",
              color: "var(--gold-primary)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ===== Mobile Menu ===== */}
        {mobileMenuOpen && (
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingBottom: "20px",
              paddingTop: "20px",
              marginTop: "15px",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <Link href="/" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              🏠 {language === "ar" ? "الرئيسية" : "Accueil"}
            </Link>
            <Link href="/properties" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              🏠 {language === "ar" ? "العقارات" : "Biens"}
            </Link>
            <Link href="/favorites" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              ❤️ {language === "ar" ? "المفضلة" : "Favoris"} ({state.favorites?.length || 0})
            </Link>
            <Link href="/archive" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              📦 {language === "ar" ? "الأرشيف" : "Archive"}
            </Link>
            <Link href="/login" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>
              🔐 {t.nav?.login || language === "ar" ? "دخول" : "Connexion"}
            </Link>
            <div style={{ paddingLeft: "16px", paddingTop: "12px" }}>
              <LanguageSwitcher />
            </div>
          </nav>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .nav-link {
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          font-family: var(--font-arabic);
        }

        .nav-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.12),
            transparent
          );
          transition: left 0.5s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          background: rgba(212, 175, 55, 0.12);
          color: #d4af37;
          transform: translateY(-2px);
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* تأثير التدرج المتحرك */
        @keyframes shimmer {
          0% {
            background-position: 0 center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .logo-container:hover div:first-child {
          animation: shimmer 1.5s linear infinite;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

const mobileLinkStyle: React.CSSProperties = {
  color: "white",
  padding: "12px 16px",
  borderRadius: "10px",
  textDecoration: "none",
  fontFamily: "var(--font-arabic)",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "all 0.2s ease",
};
