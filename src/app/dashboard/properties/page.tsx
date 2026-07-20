"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default function DashboardPropertiesPage() {
  const { state, dispatch } = useAppContext();

  // ✅ حذف بالبحث عن العقار (يمكن استخدام ID أو عنوان)
  const handleDelete = async (propertyData: any) => {
    if (!propertyData?.id) {
      alert("❌ لا يوجد ID لهذا العقار!");
      return;
    }

    if (!confirm(`حذف العقار (${propertyData.propertyType || 'بدون اسم'})؟\n⚠️ لا يمكن التراجع!`)) {
      return;
    }

    try {
      console.log("🗑️ جاري حذف العقار...");
      console.log("🔑 ID:", propertyData.id);
      
      // ✅ التحقق من وجود العقار
      const docRef = doc(db, "properties", propertyData.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error("❌ العقار غير موجود في Firebase!");
        alert("❌ العقار غير موجود! سيتم إزالته من القائمة.");
        dispatch({ type: "DELETE_PROPERTY", payload: propertyData.id });
        return;
      }
      
      // ✅ Soft Delete
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
      
      console.log("✅ تم حذف العقار!");
      dispatch({ type: "DELETE_PROPERTY", payload: propertyData.id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "🗑️ تم حذف العقار!", type: "success" } });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  const activeProperties = state.properties.filter((p: any) => !p.deleted);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">🏠 إدارة العقارات</h1>
        <Link href="/dashboard/properties/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
          ➕ إضافة عقار
        </Link>
      </div>

      <div className="mb-4 p-3 bg-slate-800 rounded-lg text-gray-400">
        عدد العقارات: <strong className="text-emerald-400">{activeProperties.length}</strong>
      </div>

      {activeProperties.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-400 text-xl">لا توجد عقارات</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProperties.map((p: any) => (
            <div key={p.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <PropertyCard property={p} />
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-2 font-mono bg-slate-900 px-2 py-1 rounded">
                  🔑 {p.id}
                </div>
                <button
                  onClick={() => handleDelete(p)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold mt-2"
                >
                  🗑️ حذف العقار
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
