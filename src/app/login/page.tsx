"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

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
      dispatch({ type: "SHOW_TOAST", payload: { message: "مرحباً! 👋", type: "success" } });
      router.push("/dashboard");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-12 px-4">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        {/* تدرج ذهبي خفيف في الخلفية */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700 relative z-10">
        
        {/* ===== الشعار والأيقونة والعنوان المتدرج ===== */}
        <div className="text-center mb-8">
          
          {/* ✅ أيقونة فوق العنوان */}
          <div 
            className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-2xl relative"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)",
              boxShadow: "0 8px 32px rgba(212, 175, 55, 0.35)",
              animation: "logoFloat 3s ease-in-out infinite",
            }}
          >
            <span className="text-4xl">🏢</span>
            {/* لمعان خفيف حول الأيقونة */}
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)",
              }}
            ></div>
          </div>

          {/* ✅✅✅ العنوان بتدرج ذهبي أبيض متحرك */}
          <h1 
            className="text-3xl font-black mb-1 tracking-wide"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #D4AF37 25%, #FFF8DC 50%, #D4AF37 75%, #FFFFFF 100%)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
              filter: "drop-shadow(0 2px 15px rgba(212, 175, 55, 0.25))",
              letterSpacing: "3px",
            }}
          >
            SOLUTION IMMOBILIER
          </h1>

          {/* خط ذهبي تحت العنوان */}
          <div 
            className="w-24 h-0.5 mx-auto mt-3 mb-4 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          ></div>

          <p className="text-gray-400 text-sm font-medium tracking-wide">
            منصة إدارة العقارات
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              📧 البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              🔒 كلمة المرور
            </label>
            <input
              type="password"
              className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl text-center flex items-center gap-2 justify-center">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-white"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)",
              color: "#1a1a2e",
              boxShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(212, 175, 55, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(212, 175, 55, 0.3)";
            }}
          >
            🔐 تسجيل الدخول
          </button>
        </form>

        {/* رسالة احترافية */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>دخول آمن للمديرين والموظفين فقط</span>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
