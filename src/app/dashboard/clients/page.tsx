"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import ClientCard from "@/components/ClientCard";

export default function DashboardClientsPage() {
  const { state, dispatch } = useAppContext();

  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف العميل (${id})؟`)) return;

    try {
      console.log("🗑️ جاري حذف العميل...", id);
      
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/aqari-plus-db/databases/(default)/documents/clients/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      console.log("✅ تم الحذف!");
      dispatch({ type: "DELETE_CLIENT", payload: id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "🗑️ تم حذف العميل!", type: "success" } });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">👥 إدارة العملاء</h1>
        <Link href="/dashboard/clients/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
          ➕ إضافة عميل
        </Link>
      </div>

      {state.clients.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400 text-xl">لا يوجد عملاء</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.clients.map((c: any) => (
            <div key={c.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <ClientCard client={c} />
              <button
                onClick={() => handleDelete(c.id)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                🗑️ حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
