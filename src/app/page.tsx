"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ===== HEADER ===== */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* الشعار */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-2xl">🏠</span>
              <div>
                <h1 className="text-lg font-bold text-emerald-400 leading-tight">
                  {language === 'ar' ? 'حلول عقارية' : 'SOLUTION'}
                </h1>
                <p className="text-xs text-gray-400 leading-tight">
                  {language === 'ar' ? 'SOLUTION Immobilier' : 'Immobilier'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 transition">{t.nav.home}</Link>
              <Link href="/properties" className="text-gray-300 hover:text-emerald-400 transition">{t.nav.properties}</Link>
              <Link href="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition">{t.nav.login}</Link>
              
              {/* زر تبديل اللغة */}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:flex flex-col gap-3 pb-4 border-t border-slate-700 mt-3 pt-4">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 py-2">{t.nav.home}</Link>
              <Link href="/properties" className="text-gray-300 hover:text-emerald-400 py-2">{t.nav.properties}</Link>
              <Link href="/login" className="text-gray-300 hover:text-emerald-400 py-2">{t.nav.login}</Link>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm mb-6 border border-emerald-500/30">
              🏠 {language === 'ar' ? 'وكالتك العقارية الأولى' : 'Votre Agence Immobilière #1'}
            </span>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-emerald-400">{language === 'ar' ? 'حلول عقارية' : 'SOLUTION'}</span>
              <br />
              <span className="text-white">{language === 'ar' ? 'لعقاراتك بأمان' : 'Immobilier'}</span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              {language === 'ar' 
                ? 'نقدم لكم أفضل العقارات في الدار البيضاء والمغرب - شقق، فيلا، محلات تجارية' 
                : 'Nous vous proposons les meilleurs biens à Casablanca et au Maroc - Appartements, Villas, Commerces'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/properties" 
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-lg transition hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                {t.properties.title} →
              </Link>
              <Link 
                href="https://web.facebook.com/SOLUTION.ImmobilierS" 
                target="_blank"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-lg transition hover:scale-105"
              >
                📱 Facebook
              </Link>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏠', title: language === 'ar' ? 'عقارات متنوعة' : 'Biens Variés', desc: language === 'ar' ? 'شقق، فيلا، محلات' : 'Appartements, Villas, Commerces' },
              { icon: '📍', title: language === 'ar' ? 'أفضل المواقع' : 'Meilleurs Emplacements', desc: language === 'ar' ? 'الدار البيضاء ومدن أخرى' : 'Casablanca et autres villes' },
              { icon: '💰', title: language === 'ar' ? 'أسعار مناسبة' : 'Prix Compétitifs', desc: language === 'ar' ? 'خيارات لكل الميزانيات' : 'Options pour tous budgets' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition text-center">
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-emerald-400">
              {language === 'ar' ? 'حلول عقارية | SOLUTION Immobilier' : 'SOLUTION Immobilier | حلول عقارية'}
            </span>
          </div>
          
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://web.facebook.com/SOLUTION.ImmobilierS" target="_blank" className="text-gray-400 hover:text-blue-400 transition">
              📱 Facebook
            </a>
            <a href="https://wa.me/212XXXXXXXXX" target="_blank" className="text-gray-400 hover:text-green-400 transition">
              💬 WhatsApp
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SOLUTION Immobilier - {language === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'}
          </p>
        </div>
      </footer>
    </div>
  );
}
