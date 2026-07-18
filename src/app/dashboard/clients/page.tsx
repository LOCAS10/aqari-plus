"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

export default function DashboardClientsPage() {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة العملاء</h1>
        <Link
          href="/dashboard/clients/form"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          إضافة عميل
        </Link>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.clients.map((c) => (
            <div key={c.id} className="bg-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{c.name}</h3>
              <div className="text-gray-300 mb-2">
                📞 {c.phone}
              </div>
              <div className="text-gray-300 mb-2">
                💬 {c.whatsapp}
              </div>
              <div className="text-gray-300 mb-4">
                📍 {c.city}
              </div>
              {c.notes && (
                <div className="text-gray-400 text-sm mb-4 bg-slate-600 p-3 rounded-lg">
                  {c.notes}
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/clients/form?id=${c.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 rounded-lg transition"
                >
                  تعديل
                </Link>
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_CLIENT", payload: c.id });
                    dispatch({ type: "SHOW_TOAST", payload: { message: "تم حذف العميل!", type: "success" } });
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-center px-4 py-2 rounded-lg transition"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
