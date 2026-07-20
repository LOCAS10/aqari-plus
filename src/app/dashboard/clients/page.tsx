"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function DashboardClientsPage() {
  const { state, dispatch } = useAppContext();

  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف العميل (${id})؟`)) return;

    try {
      console.log("🗑️ جاري حذف العميل...", id);
      
      await updateDoc(doc(db, "clients", id), {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
      
      console.log("✅ تم الحذف!");
      dispatch({ type: "DELETE_CLIENT", payload: id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "🗑️ تم حذف العميل!", type: "success" } });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  const activeClients = state.clients.filter((c: any) => !c.deleted);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">👥 إدارة العملاء</h1>
        <Link href="/dashboard/clients/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
          ➕ إضافة عميل
        </Link>
      </div>

      <div className="mb-4 p-3 bg-slate-800 rounded-lg text-gray-400">
        عدد العملاء: <strong className="text-emerald-400">{activeClients.length}</strong>
      </div>

      {activeClients.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400 text-xl">لا يوجد عملاء</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeClients.map((c: any) => (
            <div key={c.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-2">{c.name || "بدون اسم"}</h3>
              <p className="text-gray-400 text-sm mb-1">📱 {c.phone || "بدون هاتف"}</p>
              {c.city && <p className="text-gray-500 text-xs">📍 {c.city}</p>}
              
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
