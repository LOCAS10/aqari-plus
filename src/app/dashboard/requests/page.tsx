"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";
import { deleteRequest } from "@/lib/firestore";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف الطلب (${id})؟`)) return;

    try {
      console.log("🗑️ جاري الحذف...", id);
      await deleteRequest(id);
      console.log("✅ تم الحذف!");
      
      dispatch({ type: "DELETE_REQUEST", payload: id });
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "🗑️ تم الحذف!", type: "success" } 
      });
    } catch (error: any) {
      console.error("❌ خطأ:", error);
      alert("فشل الحذف: " + error?.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📋 إدارة الطلبات</h1>
        <Link 
          href="/dashboard/requests/form" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          ➕ إضافة طلب
        </Link>
      </div>

      {state.requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 text-xl">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.requests.map((r: any) => (
            <div key={r.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <RequestCard request={r} />
              <button
                onClick={() => handleDelete(r.id)}
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
