"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900" style={{ direction: 'rtl' }}>
      <div className="text-center p-8">
        <div className="text-8xl mb-6">😔</div>
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          الصفحة غير موجودة
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <Link 
          href="/" 
          className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)',
            color: '#1a1a2e',
            boxShadow: '0 8px 30px rgba(212, 175, 55, 0.3)'
          }}
        >
          🏠 العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
