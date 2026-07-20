"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  // ✅ Soft Delete - وضع علامة محذوف بدلاً من الحذف الفعلي
  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف الطلب (${id})؟\n\n(يمكن استرجاعه لاحقاً)`)) return;

    try {
      console.log("🗑️ جاري حذف الطلب (soft delete)...", id);
      
      const docRef = doc(db, "requests", id);
      
      // ✅ إضافة علامة الحذف بدلاً من الحذف الفعلي
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: "admin",
      });
      
      console.log("✅ تم حذف الطلب (soft delete)!");
      
      // إزالة من الواجهة فقط
      dispatch({ type: "DELETE_REQUEST", payload: id });
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "🗑️ تم حذف الطلب!", type: "success" } 
      });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  // ✅ تصفية الطلبات المحذوفة من العرض
  const activeRequests = state.requests.filter((r: any) => !r.deleted);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📋 إدارة الطلبات</h1>
        <Link href="/dashboard/requests/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
          ➕ إضافة طلب
        </Link>
      </div>

      {/* ✅ عرض عدد الطلبات الفعلية */}
      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
        <span className="text-gray-400">
          عدد الطلبات: <strong className="text-emerald-400">{activeRequests.length}</strong>
          {activeRequests.length !== state.requests.length && (
            <span className="text-gray-500 text-sm mr-4">
              ({state.requests.length - activeRequests.length} محذوفة)
            </span>
          )}
        </span>
      </div>

      {activeRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 text-xl">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.map((r: any) => (
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
