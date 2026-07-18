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
      dispatch({ type: "SHOW_TOAST", payload: { message: "مرحباً!", type: "success" } });
      router.push("/dashboard");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">تسجيل الدخول</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full p-4 rounded-xl bg-slate-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aqari.ma"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-4 rounded-xl bg-slate-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-xl text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition"
          >
            دخول
          </button>
        </form>

        <div className="mt-8 text-gray-400 text-center text-sm">
          للتجربة:<br />
          <span className="font-mono text-emerald-400">admin@aqari.ma / admin123</span> (مدير)<br />
          <span className="font-mono text-emerald-400">user@aqari.ma / user123</span> (موظف)
        </div>
      </div>
    </div>
  );
}
