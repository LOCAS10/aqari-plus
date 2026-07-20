"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  // ✅✅✅ حذف باستخدام Fetch API مباشرة
  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف الطلب (${id})؟`)) return;

    try {
      console.log("🗑️ جاري الحذف...", id);
      
      // استخدام Fetch API مباشرة لـ Firestore REST API
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/aqari-plus-db/databases/(default)/documents/requests/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📊 حالة الاستجابة:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ تفاصيل الخطأ:", errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      console.log("✅ تم الحذف بنجاح!");
      
      // حذف من الواجهة
      dispatch({ type: "DELETE_REQUEST", payload: id });
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "🗑️ تم الحذف!", type: "success" } 
      });

    } catch (error: any) {
      console.error("❌❌❌ فشل الحذف:", error);
      alert(`فشل الحذف!\n\n${error.message}\n\nافتح Console (F12) للمزيد`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📋 إدارة الطلبات</h1>
        <Link href="/dashboard/requests/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
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
