"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Request } from "@/lib/types";

function RequestFormContent() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  const [clientId, setClientId] = useState(state.clients[0]?.id || "");
  const [form, setForm] = useState<Partial<Request>>({
    operation: "شراء",
    propertyType: "شقة",
    city: "",
    district: "",
    rooms: 0,
    area: 0,
    budgetMin: 0,
    budgetMax: 0,
    mortgage: false,
    notes: "",
    status: "جديد",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) return;

    const request: Request = {
      ...form,
      id: state.reqCounter.toString(),
      clientId,
      clientName: client.name,
      createdAt: new Date(),
    } as Request;

    dispatch({ type: "ADD_REQUEST", payload: request });
    dispatch({ type: "SHOW_TOAST", payload: { message: "تم إضافة الطلب بنجاح!", type: "success" } });
    router.push("/dashboard/requests");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8">
        {/* ===== Header ===== */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            📋 إضافة طلب جديد
          </h1>
          <p className="text-gray-400">
            أدخل بيانات طلب العميل البحث عن عقار
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ===== القسم 1: اختيار العميل ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              👤 معلومات العميل
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اختر العميل <span className="text-red-400">*</span>
              </label>
              <select
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="">-- اختر عميلاً --</option>
                {state.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    📌 {c.name} - {c.city}
                  </option>
                ))}
              </select>
              {state.clients.length === 0 && (
                <p className="text-yellow-400 text-sm mt-2">⚠️ لا يوجد عملاء. أضف عميل أولاً.</p>
              )}
            </div>
          </div>

          {/* ===== القسم 2: نوع العملية والعقار ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              🏠 نوع العملية والعقار المطلوب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* نوع العملية */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع العملية <span className="text-red-400">*</span>
                </label>
                <select
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.operation}
                  onChange={(e) => setForm({ ...form, operation: e.target.value as Request["operation"] })}
                  required
                >
                  <option value="شراء">🛒 شراء</option>
                  <option value="كراء">🔑 كراء (إيجار)</option>
                  <option value="رهن">🏦 رهن</option>
                </select>
              </div>

              {/* نوع العقار */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع العقار المطلوب <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  placeholder="مثال: شقة، فيلا، محل تجاري، أرض..."
                  required
                />
              </div>
            </div>
          </div>

          {/* ===== القسم 3: الموقع المطلوب ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              📍 الموقع المطلوب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* المدينة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  المدينة <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="مثال: الدار البيضاء، الرباط، مراكش..."
                  required
                />
              </div>

              {/* الحي / المنطقة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الحي أو المنطقة
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="مثال: المعاريف، مأمورة، الفلالة..."
                />
                <p className="text-xs text-gray-500 mt-1">اختياري - يساعد في البحث الدقيق</p>
              </div>
            </div>
          </div>

          {/* ===== القسم 4: المواصفات المطلوبة ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              📐 المواصفات المطلوبة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* عدد الغرف */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عدد الغرف
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">اتركه 0 إذا غير مهم</p>
              </div>

              {/* المساحة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  المساحة (م²)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">المساحة التقريبية بال متر مربع</p>
              </div>

              {/* الميزانية الدنيا */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الميزانية الدنيا (درهم)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.budgetMin}
                  onChange={(e) => setForm({ ...form, budgetMin: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  dir="ltr"
                />
              </div>

              {/* الميزانية العليا */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الميزانية القصوى (درهم)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  dir="ltr"
                />
              </div>
            </div>

            {/* خيار الرهن */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mortgage}
                  onChange={(e) => setForm({ ...form, mortgage: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-600 text-emerald-500 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-gray-200 font-medium">🏦 يرغب في الرهن البنكي</span>
                  <p className="text-xs text-gray-400 mt-0.5">العميل يريد شراء عقار عبر قرض بنكي</p>
                </div>
              </label>
            </div>
          </div>

          {/* ===== القسم 5: ملاحظات إضافية ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              📝 ملاحظات إضافية
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ملاحظات أو متطلبات خاصة
              </label>
              <textarea
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                placeholder="أي متطلبات أخرى أو ملاحظات مهمة...&#10;مثال: يجب أن يكون قريب من المدرسة، أو لديه موقف سيارات..."
              />
              <p className="text-xs text-gray-500 mt-1">اكتب أي تفاصيل إضافية تساعد في البحث عن العقار المناسب</p>
            </div>
          </div>

          {/* ===== حالة الطلب (للمدير فقط) ===== */}
          {state.currentUser?.role === "مدير" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-amber-400 border-b border-slate-700 pb-2 flex items-center gap-2">
                ⚙️ إعدادات الطلب
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  حالة الطلب
                </label>
                <select
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="جديد">🆕 جديد</option>
                  <option value="قيد المعالجة">⏳ قيد المعالجة</option>
                  <option value="مكتمل">✅ مكتمل</option>
                  <option value="ملغى">❌ ملغى</option>
                </select>
              </div>
            </div>
          )}

          {/* ===== أزرار الإجراءات ===== */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition hover:scale-[1.02]"
            >
              ➕ إضافة الطلب
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RequestFormPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">جاري التحميل...</div>}>
      <RequestFormContent />
    </Suspense>
  );
}
