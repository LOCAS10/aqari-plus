"use client";

import Link from "next/link";

interface LoginPromptModalProps {
  onClose: () => void;
  requestId?: string;
  requestTitle?: string;
}

export default function LoginPromptModal({ 
  onClose, 
  requestId, 
  requestTitle 
}: LoginPromptModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div 
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(16, 185, 129, 0.2))',
              border: '2px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <span className="text-4xl">🔐</span>
          </div>
          
          <h3 
            className="text-2xl font-bold mb-3"
            style={{ color: '#D4AF37' }}
          >
            مطلوب تسجيل الدخول
          </h3>
          
          <p className="text-slate-400 leading-relaxed text-sm">
            يجب عليك <strong className="text-white">تسجيل الدخول</strong> أو{' '}
            <strong className="text-white">إنشاء حساب</strong> لتتمكن من عرض تفاصيل هذا الطلب.
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-300 mb-2">✨ بعد تسجيل الدخول:</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>عرض تفاصيل الطلب بالكامل</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>التواصل مع صاحب الطلب</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>إضافة طلباتك الخاصة</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href={`/login?redirect=/requests/${requestId}`}
            onClick={onClose}
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white 
                     text-center py-3 px-4 rounded-xl font-bold transition-all duration-200 
                     shadow-lg hover:shadow-emerald-500/40"
          >
            👤 تسجيل الدخول
          </Link>
          
          <Link
            href={`/login?mode=register&redirect=/requests/${requestId}`}
            onClick={onClose}
            className="block w-full bg-transparent hover:bg-slate-700 text-white 
                     text-center py-3 px-4 rounded-xl font-bold transition-all duration-200 
                     border border-slate-600 hover:border-emerald-500"
          >
            📝 إنشاء حساب جديد
          </Link>
          
          <button
            onClick={onClose}
            className="block w-full text-slate-500 hover:text-slate-300 
                     text-center py-2 px-4 font-medium transition-colors text-sm"
          >
            لاحقاً، شكراً
          </button>
        </div>

        {requestTitle && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              📋 الطلب: <span className="text-slate-400">{requestTitle}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
