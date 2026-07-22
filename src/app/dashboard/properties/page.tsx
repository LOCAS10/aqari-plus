"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function DashboardPropertiesPage() {
  const { state, dispatch } = useAppContext();

  // ✅✅✅ حذف عبر Server-Side API (تم إصلاح: إضافة await!)
  const handleDelete = async (propertyData: any) => {
    if (!propertyData?._firestoreId && !propertyData?.id) {
      alert("❌ لا يوجد ID!");
      return;
    }

    if (!confirm(`حذف العقار (${propertyData.propertyType || 'عقار'})؟\n⚠️ لا يمكن التراجع!`)) {
      return;
    }

    try {
      console.log("🗑️ جاري الحذف...");
      
      // ✅✅✅ تمت إضافة await!
      const response = await fetch('/api/delete', {  // ← كان ناقصاً await!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionName: 'properties',
          id: propertyData.id,
          backupId: propertyData._firestoreId,  // ✅ إضافة backupId
        }),
      });

      const result = await response.json();
      console.log('📊 النتيجة:', result);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'API Error');
      }

      console.log('✅ تم حذف العقار!');
      
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
        <Link href="/dashboard/properties/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">➕ إضافة عقار</Link>
      </div>

      {/* شارة API */}
      <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
        <span className="text-blue-300 text-sm">⡿ Server-Side Delete Mode v5</span>
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
              <div className="p-4 flex gap-2">
                {/* ✅✅✅ زر تعديل - جديد! */}
                <Link 
                  href={`/dashboard/properties/form?id=${p.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-center transition"
                >
                  ✏️ تعديل
                </Link>
                
                {/* زر حذف */}
                <button
                  onClick={() => handleDelete(p)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}