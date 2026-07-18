"use client";

import { useAppContext } from "@/contexts/AppContext";

export default function DashboardPage() {
  const { state } = useAppContext();

  const totalProps = state.properties.length;
  const availableProps = state.properties.filter((p) => p.status === "متوفر").length;
  const soldRented = state.properties.filter(
    (p) => p.status === "تم البيع" || p.status === "تم الكراء"
  ).length;
  const totalClients = state.clients.length;
  const totalRequests = state.requests.length;
  const apartments = state.properties.filter((p) => p.propertyType.includes("شقة")).length;
  const villas = state.properties.filter((p) => p.propertyType.includes("فيلا")).length;
  const lands = state.properties.filter((p) => p.propertyType.includes("أرض")).length;

  const typeCounts: Record<string, number> = {};
  state.properties.forEach((p) => {
    typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(typeCounts), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">لوحة التحكم</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-emerald-500 mb-2">{totalProps}</div>
          <div className="text-gray-300">إجمالي العقارات</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-green-500 mb-2">{availableProps}</div>
          <div className="text-gray-300">متاح الآن</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-amber-500 mb-2">{soldRented}</div>
          <div className="text-gray-300">مبعوع/مؤجر</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-blue-500 mb-2">{totalClients}</div>
          <div className="text-gray-300">العملاء</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-purple-500 mb-2">{apartments}</div>
          <div className="text-gray-300">الشقق</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-orange-500 mb-2">{villas}</div>
          <div className="text-gray-300">الفلل</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-cyan-500 mb-2">{lands}</div>
          <div className="text-gray-300">الأراضي</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-pink-500 mb-2">{totalRequests}</div>
          <div className="text-gray-300">الطلبات</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">توزيع العقارات حسب النوع</h3>
        <div className="space-y-4">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type}>
              <div className="flex justify-between text-gray-300 mb-2">
                <span>{type}</span>
                <span>{count}</span>
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
