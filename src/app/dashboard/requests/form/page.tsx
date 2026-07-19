"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Request } from "@/lib/types";
// ✅✅✅ إضافة استيراد Firebase:
import { addRequest as fbAddRequest, updateRequest as fbUpdateRequest } from "@/lib/firestore";

function RequestFormContent() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  
  // للتعديل - نتحقق من وجود ID في URL
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const editId = searchParams?.get("id");
  const existingReq = editId ? state.requests.find((r) => r.id === editId) : null;
  const isEdit = !!existingReq;

  const [clientId, setClientId] = useState(existingReq?.clientId || state.clients[0]?.id || "");
  const [form, setForm] = useState<Partial<Request>>({
    operation: existingReq?.operation || "شراء",
    propertyType: existingReq?.propertyType || "شقة",
    city: existingReq?.city || "",
    district: existingReq?.district || "",
    rooms: existingReq?.rooms || 0,
    area: existingReq?.area || 0,
    budgetMin: existingReq?.budgetMin || 0,
    budgetMax: existingReq?.budgetMax || 0,
    mortgage: existingReq?.mortgage || false,
    notes: existingReq?.notes || "",
    status: existingReq?.status || "جديد",
  });

  const [isSaving, setIsSaving] = useState(false); // ✅ حالة الحفظ

  // ✅✅✅ handleSubmit معدّل - يحفظ في Firebase مباشرة!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) {
      alert("الرجاء اختيار عميل");
      return;
    }

    setIsSaving(true);

    try {
      const requestData: Request = {
        id: existingReq?.id || Date.now().toString(),
        clientId,
        clientName: client.name,
        operation: form.operation as Request["operation"],
        propertyType: form.propertyType || "",
        city: form.city || "",
        district: form.district || "",
        rooms: parseInt(String(form.rooms)) || 0,
        area: parseInt(String(form.area)) || 0,
        budgetMin: parseInt(String(form.budgetMin)) || 0,
        budgetMax: parseInt(String(form.budgetMax)) || 0,
        mortgage: form.mortgage || false,
        notes: form.notes || "",
        status: form.status || "جديد",
        createdAt: existingReq ? existingReq.createdAt : new Date(),
      };

      console.log("🔄 جاري حفظ الطلب...");
      console.log("📊 البيانات:", requestData);

      if (isEdit && editId) {
        // ✅ تحديث في Firebase
        await fbUpdateRequest(editId, requestData);
        console.log("✅ تم تحديث الطلب في Firebase!");
        dispatch({ type: "UPDATE_REQUEST", payload: requestData });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم تحديث الطلب!", type: "success" } });
      } else {
        // ✅ إضافة جديدة في Firebase
        const newId = await fbAddRequest(requestData);
        console.log("✅ تمت إضافة الطلب في Firebase! ID:", newId);
        
        requestData.id = newId;
        dispatch({ type: "ADD_REQUEST", payload: requestData });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم إضافة الطلب!", type: "success" } });
      }

      router.push("/dashboard/requests");
    } catch (error) {
      console.error("❌❌❌ خطأ في حفظ الطلب:", error);
      dispatch({ type: "SHOW_TOAST", payload: { message: "❌ فشل الحفظ: " + error, type: "error" } });
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8">
        {/* ===== Header ===== */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isEdit ? "✏️ تعديل طلب" : "📋 إضافة طلب جديد"}
          </h1>
          <p className="text-gray-400">
            {isEdit ? "تعديل بيانات الطلب" : "أدخل بيانات طلب العميل البحث عن عقار"}
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">عدد الغرف</label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: parseInt(e.target.value) || 0 })}
                  placeholder="0" min="0" dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">اتركه 0 إذا غير مهم</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المساحة (م²)</label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: parseInt(e.target.value) || 0 })}
                  placeholder="0" min="0" dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الميزانية الدنيا (درهم)</label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.budgetMin}
                  onChange={(e) => setForm({ ...form, budgetMin: parseInt(e.target.value) || 0 })}
                  placeholder="0" min="0" dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الميزانية القصوى (درهم)</label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: parseInt(e.target.value) || 0 })}
                  placeholder="0" min="0" dir="ltr"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-2">ملاحظات أو متطلبات خاصة</label>
              <textarea
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                placeholder="أي متطلبات أخرى أو ملاحظات مهمة..."
              />
            </div>
          </div>

          {/* ===== حالة الطلب ===== */}
          {state.currentUser?.role === "مدير" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-amber-400 border-b border-slate-700 pb-2 flex items-center gap-2">
                ⚙️ إعدادات الطلب
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">حالة الطلب</label>
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
              disabled={isSaving}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition hover:scale-[1.02] ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {isSaving ? '⏳ جاري الحفظ...' : (isEdit ? '💾 حفظ التعديلات' : '➕ إضافة الطلب')}
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
