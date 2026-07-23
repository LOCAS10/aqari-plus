cat > "src/app/requests/[id]/RequestDetailClient.tsx" << 'ENDOFFILE'
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

const formatPrice = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} مليون`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)} ألف`;
  return n.toString();
};

interface Props {
  request: any;
}

export default function RequestDetailClient({ request }: Props) {
  const router = useRouter();
  const { state } = useAppContext();

  useEffect(() => {
    if (!state.currentUser) {
      router.replace('/login?redirect=/requests/' + request.id);
    }
  }, [state.currentUser, router, request.id]);

  if (!state.currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-white text-xl">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  const opColors: Record<string, string> = { شراء: "bg-blue-500", كراء: "bg-purple-500", رهن: "bg-orange-500" };
  const opIcons: Record<string, string> = { شراء: "💰", كراء: "🔑", رهن: "🏦" };

  const formatDate = (dateVal: any) => {
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString('ar-DZ');
    } catch {
      return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link href="/requests" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6 group">
            <span className="group-hover:-translate-x-1 transition-transform">→</span>
            <span>العودة للطلبات</span>
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-3xl px-4 py-2 rounded-xl ${opColors[request.operation] || 'bg-gray-500'} shadow-lg`}>
                  {opIcons[request.operation] || '📋'}
                </span>
                <h1 className="text-4xl font-bold text-white">{request.propertyType}</h1>
              </div>
              <Link href={`/dashboard/clients?id=${request.clientId}`} className="text-lg hover:text-emerald-400 transition-colors underline decoration-dotted">
                👤 <span className="font-semibold">{request.clientName}</span>
              </Link>
            </div>
            <span className={`px-6 py-2 rounded-full font-bold text-white shadow-lg ${request.status === 'متاح' ? 'bg-emerald-500' : 'bg-yellow-500'}`}>
              {request.status || 'متاح'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">معلومات الطلب</h2>
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
                  <p className="text-sm text-slate-400 mb-1">التاريخ</p>
                  <p className="text-lg font-semibold text-white">{formatDate(request.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">الميزانية</h2>
              <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4">
                <span className="text-slate-400">نطاق الميزانية</span>
                <span className="text-xl font-bold text-emerald-400">{formatPrice(request.budgetMin)} - {formatPrice(request.budgetMax)}</span>
              </div>
              {request.area > 0 && (
                <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-4 mt-3">
                  <span className="text-slate-400">المساحة</span>
                  <span className="text-lg font-semibold text-blue-400">{request.area} م²</span>
                </div>
              )}
            </div>

            {request.notes && (
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">ملاحظات</h2>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-slate-300 whitespace-pre-wrap">{request.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4">إجراءات</h2>
              <div className="space-y-3">
                <Link href={`/dashboard/clients?id=${request.clientId}`} className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3 px-4 rounded-xl font-bold transition-all shadow-lg">
                  عرض بيانات العميل
                </Link>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg">
                  تواصل
                </button>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg">
                  حذف الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDOFFILE
