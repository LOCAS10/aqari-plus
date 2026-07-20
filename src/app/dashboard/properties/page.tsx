"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function DashboardPropertiesPage() {
  const { state, dispatch } = useAppContext();

  const handleDelete = async (id: string) => {
    if (!id || !confirm(`حذف العقار (${id})؟\n⚠️ لا يمكن التراجع!`)) return;

    try {
      console.log("🗑️ جاري حذف العقار...", id);
      
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/aqari-plus-db/databases/(default)/documents/properties/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      console.log("✅ تم الحذف!");
      dispatch({ type: "DELETE_PROPERTY", payload: id });
      dispatch({ type: "SHOW_TOAST", payload: { message: "🗑️ تم حذف العقار!", type: "success" } });

    } catch (error: any) {
      console.error("❌ فشل:", error);
      alert(`فشل: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">🏠 إدارة العقارات</h1>
        <Link href="/dashboard/properties/form" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition">
          ➕ إضافة عقار
        </Link>
      </div>

      {state.properties.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-400 text-xl">لا توجد عقارات</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.properties.map((p: any) => (
            <div key={p.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <PropertyCard property={p} />
              <div className="p-4">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
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
