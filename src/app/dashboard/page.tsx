"use client";

import { useAppContext } from "@/contexts/AppContext";

export default function DashboardPage() {
  const { state } = useAppContext();

  // ✅✅✅ تصفية العناصر المحذوفة (Soft Delete)
  const activeProperties = state.properties.filter((p: any) => !p.deleted);
  const activeClients = state.clients.filter((c: any) => !c.deleted);
  const activeRequests = state.requests.filter((r: any) => !r.deleted);

  const totalProps = activeProperties.length;
  const availableProps = activeProperties.filter((p) => p.status === "متوفر").length;
  const soldRented = activeProperties.filter(
    (p) => p.status === "تم البيع" || p.status === "تم الكراء"
  ).length;
  const totalClients = activeClients.length;
  const totalRequests = activeRequests.length;
  const apartments = activeProperties.filter((p) => p.propertyType.includes("شقة")).length;
  const villas = activeProperties.filter((p) => p.propertyType.includes("فيلا")).length;
  const lands = activeProperties.filter((p) => p.propertyType.includes("أرض")).length;

  const typeCounts: Record<string, number> = {};
  activeProperties.forEach((p) => {  // ✅ استخدام activeProperties
    typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(typeCounts), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">📊 لوحة التحكم</h1>

      {/* ✅ إشعار إذا كانت هناك عناصر محذوفة */}
      {(state.properties.length !== totalProps || 
        state.clients.length !== totalClients || 
        state.requests.length !== totalRequests) && (
        <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-xl">
          <p className="text-amber-300 text-sm">
            ℹ️ بعض العناصر محذوفة ولا تظهر في الإحصائيات
            <span className="mx-2">|</span>
            عقارات محذوفة: <strong>{state.properties.length - totalProps}</strong>
            <span className="mx-2">|</span>
            عملاء محذوفون: <strong>{state.clients.length - totalClients}</strong>
            <span className="mx-2">|</span>
            طلبات محذوفة: <strong>{state.requests.length - totalRequests}</strong>
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500 transition">
          <div className="text-4xl font-bold text-emerald-500 mb-2">{totalProps}</div>
          <div className="text-gray-300">🏠 إجمالي العقارات</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-green-500 transition">
          <div className="text-4xl font-bold text-green-500 mb-2">{availableProps}</div>
          <div className="text-gray-300">✅ متاح الآن</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500 transition">
          <div className="text-4xl font-bold text-amber-500 mb-2">{soldRented}</div>
          <div className="text-gray-300">💰 مبيوع/مؤجر</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition">
          <div className="text-4xl font-bold text-blue-500 mb-2">{totalClients}</div>
          <div className="text-gray-300">👥 العملاء</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition">
          <div className="text-4xl font-bold text-purple-500 mb-2">{apartments}</div>
          <div className="text-gray-300">🏢 الشقق</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-orange-500 transition">
          <div className="text-4xl font-bold text-orange-500 mb-2">{villas}</div>
          <div className="text-gray-300">🏡 الفلل</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500 transition">
          <div className="text-4xl font-bold text-cyan-500 mb-2">{lands}</div>
          <div className="text-gray-300">🌿 الأراضي</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-pink-500 transition">
          <div className="text-4xl font-bold text-pink-500 mb-2">{totalRequests}</div>
          <div className="text-gray-300">📋 الطلبات</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">📊 توزيع العقارات حسب النوع</h3>
        <div className="space-y-4">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type}>
              <div className="flex justify-between text-gray-300 mb-2">
                <span>{type}</span>
                <span className="font-bold text-emerald-400">{count}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div
                  className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
