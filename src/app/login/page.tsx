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
      </div>

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700 relative z-10">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">أقاري بلس</h1>
          <p className="text-gray-400 text-sm">منصة إدارة العقارات</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              📧 البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
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
              className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
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
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* ✅ بدلاً من بيانات التجربة - رسالة احترافية */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            🔐 دخول آمن للمديرين والموظفين فقط
          </p>
        </div>
      </div>
    </div>
  );
}
