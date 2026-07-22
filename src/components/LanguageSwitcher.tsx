"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
      <button onClick={() => setLanguage('ar')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${language === 'ar' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
        🇸🇦 عربي
      </button>
      <button onClick={() => setLanguage('fr')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${language === 'fr' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
        🇫🇷 Français
      </button>
    </div>
  );
}
