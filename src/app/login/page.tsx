"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";

export default function LoginPage() {
  const { login, dispatch } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = login(email, password);
    
    if (user) {
      document.cookie = `user=${JSON.stringify({
        email: user.email || email,
        name: user.name || 'Admin',
        role: user.role || 'admin'
      })}; path=/; max-age=86400; SameSite=Lax`;
      
      document.cookie = `auth-token=logged-in-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      
      dispatch({ type: "SHOW_TOAST", payload: { message: "مرحباً! 👋", type: "success" } });
      router.push("/dashboard");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #162033 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* خلفية متحركة */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(212, 175, 55, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(59, 130, 246, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}></div>
      </div>

      {/* بطاقة تسجيل الدخول */}
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px 32px",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1)",
        border: "1px solid rgba(212, 175, 55, 0.15)",
        position: "relative",
        zIndex: 10,
      }}>
        
        {/* ===== الرأس - أيقونة + عنوان (تصميم عمودي) ===== */}
        <div style={{
          textAlign: "center",
          marginBottom: "36px",
        }}>
          {/* الأيقونة الكبيرة - مثل Header */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)",
            border: "2px solid rgba(212, 175, 55, 0.3)",
            marginBottom: "20px",
            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.15)",
          }}>
            <svg 
              width="42" 
              height="42" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#D4AF37" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>

          {/* العنوان الرئيسي */}
          <h1 style={{
            fontSize: "1.9rem",
            fontWeight: "900",
            letterSpacing: "1px",
            background: "linear-gradient(135deg, #D4AF37 0%, #FFFFFF 50%, #D4AF37 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s linear infinite",
            marginBottom: "8px",
          }}>
            SOLUTION Immobilier
          </h1>

          {/* العنوان الفرعي */}
          <p style={{
            color: "#94a3b8",
            fontSize: "0.9rem",
            fontWeight: "500",
            margin: 0,
          }}>
            🏠 منصة إدارة العقارات
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* حقل البريد الإلكتروني */}
          <div>
            <label style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}>
              📧 البريد الإلكتروني
            </label>
            <input
              type="email"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "2px solid rgba(148, 163, 184, 0.15)",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
              dir="ltr"
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(212, 175, 55, 0.5)";
                e.target.style.boxShadow = "0 0 0 4px rgba(212, 175, 55, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(148, 163, 184, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}>
              🔒 كلمة المرور
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "2px solid rgba(148, 163, 184, 0.15)",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(212, 175, 55, 0.5)";
                e.target.style.boxShadow = "0 0 0 4px rgba(212, 175, 55, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(148, 163, 184, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 100%)",
              color: "#1a1a2e",
              border: "none",
              fontWeight: "800",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(212, 175, 55, 0.3)",
              marginTop: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(212, 175, 55, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.3)";
            }}
          >
            🔐 تسجيل الدخول
          </button>
        </form>

        {/* روابط إضافية */}
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <p style={{
            color: "#64748b",
            fontSize: "0.8rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            🔐 دخول آمن للمديرين والموظفين فقط
          </p>
          
          <Link 
            href="/"
            style={{
              display: "inline-block",
              color: "#D4AF37",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "color 0.3s ease",
              padding: "8px 16px",
              borderRadius: "10px",
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212, 175, 55, 0.15)";
              e.currentTarget.style.color = "#E5C76B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(212, 175, 55, 0.08)";
              e.currentTarget.style.color = "#D4AF37";
            }}
          >
            🏠 العودة للموقع الرئيسي
          </Link>
        </div>
      </div>

      {/* أنيميشن Shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
