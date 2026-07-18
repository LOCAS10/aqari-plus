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
    dispatch({ type: "SHOW_TOAST", payload: { message: "تم إضافة الطلب!", type: "success" } });
    router.push("/dashboard/requests");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">إضافة طلب</h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            {state.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.operation}
            onChange={(e) => setForm({ ...form, operation: e.target.value as Request["operation"] })}
          >
            <option value="شراء">شراء</option>
            <option value="كراء">كراء</option>
            <option value="رهن">رهن</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="نوع العقار"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="المدينة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="الحي"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="number"
            placeholder="الميزانية الدنيا"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.budgetMin}
            onChange={(e) => setForm({ ...form, budgetMin: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الميزانية العليا"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.budgetMax}
            onChange={(e) => setForm({ ...form, budgetMax: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الغرف"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.rooms}
            onChange={(e) => setForm({ ...form, rooms: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="المساحة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-white mb-4">
            <input
              type="checkbox"
              checked={form.mortgage}
              onChange={(e) => setForm({ ...form, mortgage: e.target.checked })}
            />
            يريد رهن
          </label>
        </div>

        <div className="mb-6">
          <textarea
            placeholder="ملاحظات"
            className="w-full p-4 rounded-lg bg-slate-700 text-white h-32"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition"
        >
          إضافة
        </button>
      </form>
    </div>
  );
}

export default function RequestFormPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RequestFormContent />
    </Suspense>
  );
}
