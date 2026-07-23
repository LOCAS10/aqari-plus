"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { Request } from "@/lib/types";

const formatPrice = (n: number) => {
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(2)} مليون`;
  } else if (n >= 1000) {
    return `${(n / 1000).toFixed(0)} ألف`;
  }
  return n.toString();
};

interface RequestDetailClientProps {
  request: Request;
}

export default function RequestDetailClient({ request }: RequestDetailClientProps) {
  const { state } = useAppContext();
  const isAuthenticated = !!state.currentUser;

  const opColors = {
    شراء: "bg-blue-500",
    كراء: "bg-purple-500",
    رهن: "bg-orange-500",
  };

  const opIcons = {
    شراء: "💰",
    كراء: "🔑",
    رهن: "🏦",
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/requests" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 
                     transition-colors mb-6 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">→</span>
            <span>العودة للطلبات</span>
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-3xl px-4 py-2 rounded-xl ${opColors[request.operation]} shadow-lg`}>
                  {opIcons[request.operation]}
                </span>
                <h1 className="text-4xl font-bold text-white">
                  {request.propertyType}
                </h1>
              </div>
              
              {isAuthenticated ? (
                <Link 
                  href={`/dashboard/clients?id=${request.clientId}`}
                  className="inline-flex items-center gap-2 text-lg hover:text-emerald-400 
                           transition-colors underline decoration-dotted underline-offset-2"
                >
                  👤 <span className="font-semibold">{request.clientName}</span>
                </Link>
              ) : (
                <p className="text-lg text-slate-300">
                  👤 <span className="font-semibold">{request.clientName}</span>
                </p>
              )}
            </div>

            {/* Badge الحالة */}
            <span className={`px-6 py-2 rounded-full font-bold text-white shadow-lg ${
              request.status === 'متاح' ? 'bg-emerald-500' : 
              request.status === 'قيد المعالجة' ? 'bg-yellow-500' :
              'bg-slate-600'
            }`}>
              {request.status || 'متاح'}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* بطاقة المعلومات الأساسية */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📋 معلومات الطلب
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">نوع العملية</p>
                  <p className="text-lg font-semibold text-white">{request.operation}</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">المدينة</p>
                  <p className="text-lg font-semibold text-white">{request.city}</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">نوع العقار</p>
                  <p className="text-lg font-semibold text-white">{request.propertyType}</p>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">تاريخ الإنشاء</p>
                  <p className="text-lg font-semibold text-white">
                    {request.createdAt?.toDate?.()?.toLocaleDateString('ar-DZ') || 
                     new Date(request.createdAt).toLocaleDateString('ar-DZ')}
                  </p>
                </div>
              </div>
            </div>

            {/* بطاقة الميزانية والمواصفات */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💰 الميزانية والمواصفات
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4">
                  <span className="text-slate-400">نطاق الميزانية</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(request.budgetMin)} - {formatPrice(request.budgetMax)}
                  </span>
                </div>

                {request.area > 0 && (
                  <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4">
                    <span className="text-slate-400">📐 المساحة</span>
                    <span className="text-lg font-semibold text-blue-400">
                      {request.area} م²
                    </span>
                  </div>
                )}

                {request.rooms > 0 && (
                  <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4">
                    <span className="text-slate-400">🛏️ عدد الغرف</span>
                    <span className="text-lg font-semibold text-purple-400">
                      {request.rooms} غرف
                    </span>
                  </div>
                )}

                {request.mortgage && (
                  <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4">
                    <span className="text-slate-400">🏦 الرهن العقاري</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                      متاح
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ملاحظات */}
            {request.notes && (
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📝 ملاحظات إضافية
                </h2>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {request.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            
            {/* بطاقة إجراءات سريعة */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4">⚡ إجراءات سريعة</h2>
              
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={`/dashboard/clients?id=${request.clientId}`}
                      className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white 
                               text-center py-3 px-4 rounded-xl font-bold transition-all duration-200 
                               shadow-lg hover:shadow-emerald-500/40"
                    >
                      👤 عرض بيانات العميل
                    </Link>
                    
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white 
                                     py-3 px-4 rounded-xl font-bold transition-all duration-200 
                                     shadow-lg hover:shadow-blue-500/40">
                      💬 تواصل مع العميل
                    </button>
                    
                    <button className="w-full bg-slate-700 hover:bg-slate-600 text-white 
                                     py-3 px-4 rounded-xl font-bold transition-all duration-200">
                      ⭐ أضف للمفضلة
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-4">🔒</div>
                    <p className="text-slate-300 font-medium mb-4">
                      لتتمكن من اتخاذ إجراءات
                    </p>
                    <Link 
                      href={`/login?redirect=/requests/${request.id}`}
                      className="inline-block px-8 py-3 rounded-xl font-bold transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 100%)',
                        color: '#1a1a2e'
                      }}
                    >
                      🔐 تسجيل الدخول
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">معلومات الطلب</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الطلب:</span>
                  <span className="text-white font-mono"># {request.id?.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الحالة:</span>
                  <span className="text-emerald-400 font-medium">{request.status || 'نشط'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
