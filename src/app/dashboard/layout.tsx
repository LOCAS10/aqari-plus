"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!state.currentUser) {
      router.push("/login");
    }
  }, [state.currentUser, router]);

  // ✅✅✅ إذا لم يكن مسجلاً - عرض صفحة "محمي"
  if (!state.currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md mx-auto p-8">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700 text-center">
            {/* أيقونة القفل */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
              <span className="text-4xl">🔒</span>
            </div>

            {/* العنوان */}
            <h1 className="text-3xl font-bold text-white mb-3">منطقة محمية</h1>
            <p className="text-gray-300 mb-8 text-lg">
              يجب تسجيل الدخول للوصول إلى لوحة التحكم
            </p>

            {/* الأزرار */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25"
              >
                🔐 تسجيل الدخول
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02]"
              >
                🏠 العودة للرئيسية
              </button>
            </div>

            {/* ملاحظة */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <span>💡</span>
                <span>لوحة التحكم تحتوي بيانات حساسة - للمديرين والموظفين فقط</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
