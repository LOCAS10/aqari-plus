"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-500">
            <span className="text-3xl">🏢</span>
            عقاري بلس
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-emerald-400 transition">الرئيسية</Link>
            <Link href="/properties" className="hover:text-emerald-400 transition">العقارات</Link>
            <Link href="/search" className="hover:text-emerald-400 transition">البحث</Link>
            <Link href="/requests" className="hover:text-emerald-400 transition">الطلبات</Link>
            <Link href="/favorites" className="hover:text-emerald-400 transition">المفضلة</Link>
            <Link href="/archive" className="hover:text-emerald-400 transition">الأرشيف</Link>
          </nav>

          <div className="flex items-center gap-4">
            {state.currentUser ? (
              <>
                <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition">لوحة التحكم</Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">تسجيل الخروج</button>
              </>
            ) : (
              <Link href="/login" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition">تسجيل الدخول</Link>
            )}

            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>الرئيسية</Link>
            <Link href="/properties" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>العقارات</Link>
            <Link href="/search" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>البحث</Link>
            <Link href="/requests" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>الطلبات</Link>
            <Link href="/favorites" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>المفضلة</Link>
            <Link href="/archive" className="hover:text-emerald-400 transition" onClick={() => setMobileMenu(false)}>الأرشيف</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
