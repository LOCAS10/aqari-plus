"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Client } from "@/lib/types";

function ClientFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const id = searchParams.get("id");
  const existingClient = state.clients.find((c) => c.id === id);
  const initializedRef = useRef(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const client: Client = {
      ...form,
      id: id || Date.now().toString(),
      createdAt: existingClient ? existingClient.createdAt : now,
    } as Client;

    if (id) {
      dispatch({ type: "UPDATE_CLIENT", payload: client });
    } else {
      dispatch({ type: "ADD_CLIENT", payload: client });
    }

    dispatch({
      type: "SHOW_TOAST",
      payload: { message: "تم حفظ العميل بنجاح!", type: "success" },
    });

    router.push("/dashboard/clients");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        {id ? "تعديل عميل" : "إضافة عميل"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="الاسم"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="الهاتف"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="واتساب"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="المدينة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
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
          {id ? "تحديث" : "إضافة"}
        </button>
      </form>
    </div>
  );
}

export default function ClientFormPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <ClientFormContent />
    </Suspense>
  );
}
