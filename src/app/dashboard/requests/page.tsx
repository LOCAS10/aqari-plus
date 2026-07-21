"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";
import { db } from "@/lib/firebase";
import { doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  const handleDelete = async (requestData: any) => {
    if (!requestData?.phone) {
      alert("❌ لا يوجد رقم هاتف!");
      return;
    }

    if (!confirm(`حذف الطلب (${requestData.name})؟`)) return;

    try {
      console.log("🗑️ جاري حذف الطلب...");
      
      // ✅ البحث برقم الهاتف
      const q = query(collection(db, "requests"), where("phone", "==", requestData.phone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("❌ الطلب غير موجود! سيتم إزالته.");
        dispatch({ type: "DELETE_REQUEST", payload: requestData.id });
        return;
      }
      
      // Soft Delete
      const docRef = doc(db, "requests", querySnapshot.docs[0].id);
      await updateDoc(docRef, { deleted: true, deletedAt: new Date().toISOString() });
      
      console.log("✅ تم الحذف!");
      dispatch({ type: "DELETE_REQUEST", payload: requestData.id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "🗑️ تم حذف الطلب!", type: "success" } });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  const activeRequests = state.requests.filter((r: any) => !r.deleted);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📋 إدارة الطلبات</h1>
        <Link href="/dashboard/requests/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">➕ إضافة طلب</Link>
      </div>

      <div className="mb-4 p-3 bg-slate-800 rounded-lg text-gray-400">
        عدد الطلبات: <strong className="text-emerald-400">{activeRequests.length}</strong>
      </div>

      {activeRequests.length === 0 ? (
        <div className="text-center py-20"><div className="text-6xl mb-4">📭</div><p className="text-gray-400 text-xl">لا توجد طلبات</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.map((r: any) => (
            <div key={r.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-gray-500 mb-2 font-mono bg-slate-900 px-2 py-1 rounded">📱 {r.phone || "بدون هاتف"}</div>
              <RequestCard request={r} />
              <button onClick={() => handleDelete(r)} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold">🗑️ حذف</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
