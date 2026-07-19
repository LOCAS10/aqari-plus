"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Client } from "@/lib/types";
// ✅✅✅ إضافة استيراد Firebase:
import { addClient as fbAddClient, updateClient as fbUpdateClient } from "@/lib/firestore";

function ClientFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const id = searchParams.get("id");
  const existingClient = id ? state.clients.find((c) => c.id === id) : null;
  const isEdit = !!existingClient;
  const initializedRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false); // ✅ حالة الحفظ

  const [form, setForm] = useState<Partial<Client>>(() => {
    if (existingClient) {
      return existingClient;
    }
    return {
      name: "",
      phone: "",
      whatsapp: "",
      city: "",
      notes: "",
    };
  });

  useEffect(() => {
    if (existingClient && !initializedRef.current) {
      setForm(existingClient);
      initializedRef.current = true;
    }
  }, [existingClient]);

  // ✅✅✅ handleSubmit معدّل - يحفظ في Firebase مباشرة!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    setIsSaving(true);

    try {
      const now = new Date();
      const client: Client = {
        name: form.name || "",
        phone: form.phone || "",
        whatsapp: form.whatsapp || "",
        city: form.city || "",
        notes: form.notes || "",
        id: id || Date.now().toString(),
        createdAt: existingClient ? existingClient.createdAt : now,
      };

      console.log("🔄 جاري حفظ العميل...");
      console.log("📊 البيانات:", client);

      if (isEdit && id) {
        // ✅ تحديث في Firebase
        await fbUpdateClient(id, client);
        console.log("✅ تم تحديث العميل في Firebase!");
        dispatch({ type: "UPDATE_CLIENT", payload: client });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم تحديث العميل!", type: "success" } });
      } else {
        // ✅ إضافة جديدة في Firebase
        const newId = await fbAddClient(client);
        console.log("✅ تمت إضافة العميل في Firebase! ID:", newId);
        
        client.id = newId;
        dispatch({ type: "ADD_CLIENT", payload: client });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم إضافة العميل!", type: "success" } });
      }

      router.push("/dashboard/clients");
    } catch (error) {
      console.error("❌❌❌ خطأ في حفظ العميل:", error);
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
            {isEdit ? "✏️ تعديل عميل" : "👤 إضافة عميل جديد"}
          </h1>
          <p className="text-gray-400">
            {isEdit ? "تعديل بيانات العميل" : "أدخل بيانات العميل الجديد"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ===== القسم 1: المعلومات الأساسية ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              👤 المعلومات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الاسم الكامل <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: محمد العلوي"
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رقم الهاتف <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0661234567"
                  dir="ltr"
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  placeholder="0661234567 (اختياري)"
                  dir="ltr"
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا كان نفس رقم الهاتف</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  المدينة
                </label>
                <input
                  type="text"
                  placeholder="مثال: الدار البيضاء"
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ===== القسم 2: ملاحظات ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              📝 ملاحظات إضافية
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ملاحظات</label>
              <textarea
                placeholder="أي ملاحظات أو معلومات إضافية عن العميل..."
                className="w-full p-4 rounded-lg bg-slate-700 text-white h-32 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* ===== أزرار الإجراءات ===== */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition hover:scale-[1.02] ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {isSaving ? '⏳ جاري الحفظ...' : (isEdit ? '💾 تحديث العميل' : '➕ إضافة العميل')}
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

export default function ClientFormPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">جاري التحميل...</div>}>
      <ClientFormContent />
    </Suspense>
  );
}
