"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default function DashboardClientsPage() {
  const { state, dispatch } = useAppContext();

  // ✅✅✅ حذف باستخدام رقم الهاتف (فريد لكل عميل)
  const handleDelete = async (clientData: any) => {
    if (!clientData?.phone) {
      alert("❌ لا يوجد رقم هاتف لهذا العميل!");
      return;
    }

    if (!confirm(`حذف العميل (${clientData.name})؟\n📱 ${clientData.phone}`)) {
      return;
    }

    try {
      console.log("🗑️ جاري حذف العميل...");
      console.log("📱 البحث بالهاتف:", clientData.phone);
      
      // ✅ البحث عن العميل برقم الهاتف في Firebase
      const clientsRef = collection(db, "clients");
      const q = query(clientsRef, where("phone", "==", clientData.phone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.error("❌ العميل غير موجود في Firebase!");
        alert(`❌ العميل (${clientData.name}) غير موجود في Firebase!\n\nسيتم إزالته من القائمة فقط.`);
        
        // إزالة من الواجهة فقط
        dispatch({ type: "DELETE_CLIENT", payload: clientData.id });
        return;
      }
      
      // ✅ وجدناه! نحصل على الـ ID الحقيقي
      const docSnapshot = querySnapshot.docs[0];
      const realId = docSnapshot.id;
      const docRef = doc(db, "clients", realId);
      
      console.log("✅ وجدنا العميل!");
      console.log("🔑 ID الحقيقي:", realId);
      console.log("📄 بيانات:", docSnapshot.data());
      
      // ✅ Soft Delete
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
      
      console.log("✅ تم الحذف بنجاح!");
      
      // إزالة من الواجهة
      dispatch({ type: "DELETE_CLIENT", payload: clientData.id });
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: `🗑️ تم حذف العميل "${clientData.name}"!`, type: "success" } 
      });

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

      {/* ✅ معلومات */}
      <div className="mb-4 p-3 bg-slate-800 rounded-lg text-gray-400">
        عدد العملاء: <strong className="text-emerald-400">{activeClients.length}</strong>
        <span className="text-xs text-gray-500 mr-4">(البحث والحذف بالهاتف)</span>
      </div>

      {activeClients.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-400 text-xl">لا يوجد عملاء</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeClients.map((c: any, idx: number) => (
            <div key={c.id || idx} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              {/* ✅ عرض الهاتف بوضوح */}
              <div className="text-xs text-gray-500 mb-2 font-mono bg-slate-900 px-2 py-1 rounded">
                📱 {c.phone || "بدون هاتف"}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{c.name || "بدون اسم"}</h3>
              {c.city && <p className="text-gray-500 text-xs mb-2">📍 {c.city}</p>}
              {c.notes && <p className="text-gray-500 text-xs italic mb-3">{c.notes}</p>}
              
              <button
                onClick={() => handleDelete(c)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
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
