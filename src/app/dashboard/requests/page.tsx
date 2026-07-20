cat > src/app/dashboard/requests/page.tsx << 'ENDOFFILE'
"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";
import { db } from "@/lib/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  // ✅✅✅ دالة حذف محسنة بشكل كبير
  const handleDelete = async (id: string) => {
    console.log("🚀 بدء عملية الحذف");
    console.log("📝 ID المستلم:", id);
    console.log("📝 نوع ID:", typeof id);

    // ✅ التحقق الأولي
    if (!id || typeof id !== 'string' || id.trim() === '') {
      alert("❌ خطأ: معرف الطلب غير صالح!");
      return;
    }

    const cleanId = id.trim();
    
    if (!confirm(`هل تريد حذف الطلب?\n\nID: ${cleanId}`)) {
      return;
    }

    try {
      // ✅ الخطوة 1: التحقق من وجود المستند
      console.log("🔍 التحقق من وجود المستند...");
      const docRef = doc(db, "requests", cleanId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error("❌ المستند غير موجود!");
        alert(`❌ الطلب (${cleanId}) غير موجود في قاعدة البيانات!\n\nسيتم إزالته من العرض فقط.`);
        
        // إزالة من الواجهة فقط
        dispatch({ type: "DELETE_REQUEST", payload: cleanId });
        return;
      }
      
      console.log("✅ المستند موجود:", docSnap.data());

      // ✅ الخطوة 2: محاولة الحذف
      console.log("🗑️ جاري الحذف...");
      
      await deleteDoc(docRef);
      
      console.log("✅✅✅ تم الحذف بنجاح!");

      // ✅ الخطوة 3: إزالة من الواجهة
      dispatch({ type: "DELETE_REQUEST", payload: cleanId });
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "🗑️ تم الحذف نهائياً!", type: "success" } 
      });

    } catch (error: any) {
      console.error("❌❌❌ تفاصيل الخطأ الكاملة:");
      console.error(error);
      
      let errorMsg = "خطأ مجهول";
      
      if (error?.message) {
        errorMsg = error.message;
      }
      
      if (error?.code) {
        errorMsg += `\nالكود: ${error.code}`;
      }

      alert(`❌ فشل الحذف!\n\n${errorMsg}\n\n💡 جرب:\n1. تحديث الصفحة\n2. تسجيل الخروج وإعادة الدخول`);
      
      dispatch({ 
        type: "SHOW_TOAST", 
        payload: { message: "❌ فشل الحذف!", type: "error" } 
      });
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

      {/* ✅ لوحة معلومات */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-gray-300">
          📊 عدد الطلبات: <span className="font-bold text-emerald-400">{state.requests.length}</span>
        </p>
      </div>

      {state.requests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 text-xl">لا توجد طلبات حالياً</p>
          <Link href="/dashboard/requests/form" className="mt-4 inline-block text-emerald-400 hover:text-emerald-300">
            ➕ أضف طلب جديد
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.requests.map((r: any, idx: number) => (
            <div key={r.id || idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition">
              {/* ✅ عرض المعرف */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-700">
                <code className="text-xs text-gray-400 break-all">
                  🔑 {r.id || "بدون ID"}
                </code>
              </div>
              
              <div className="p-4">
                <RequestCard request={r} />
                
                <button
                  onClick={() => handleDelete(r.id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  <span>حذف الطلب</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
ENDOFFILE
