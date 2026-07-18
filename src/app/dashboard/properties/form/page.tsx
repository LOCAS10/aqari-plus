"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Property } from "@/lib/types";

function PropertyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, getMatches } = useAppContext();
  const id = searchParams.get("id");
  const existingProp = state.properties.find((p) => p.id === id);
  const initializedRef = useRef(false);

  const [form, setForm] = useState<Partial<Property>>(() => {
    if (existingProp) {
      return existingProp;
    }
    return {
      operation: "بيع",
      propertyType: "شقة",
      city: "",
      district: "",
      address: "",
      price: 0,
      area: 0,
      rooms: 0,
      salons: 0,
      bathrooms: 0,
      kitchens: 0,
      floor: 0,
      garage: false,
      elevator: false,
      balcony: false,
      garden: false,
      pool: false,
      guard: false,
      facade: "",
      view: "",
      year: 0,
      status: "متوفر",
      negotiable: false,
      rent: 0,
      mortgage: 0,
      images: ["https://picsum.photos/seed/default/600/400.jpg"],
      video: "",
      description: "",
      featured: false,
    };
  });

  useEffect(() => {
    if (existingProp && !initializedRef.current) {
      setForm(existingProp);
      initializedRef.current = true;
    }
  }, [existingProp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const prop: Property = {
      ...form,
      id: id || state.propCounter.toString(),
      createdAt: existingProp ? existingProp.createdAt : now,
      updatedAt: now,
    } as Property;

    if (id) {
      dispatch({ type: "UPDATE_PROPERTY", payload: prop });
    } else {
      dispatch({ type: "ADD_PROPERTY", payload: prop });
    }

    const matches = getMatches(prop);
    if (matches.length > 0) {
      dispatch({
        type: "SHOW_TOAST",
        payload: {
          message: `يوجد ${matches.length} عميل يبحثون عن هذا العقار! ${matches.join(", ")}`,
          type: "success",
        },
      });
    } else {
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "تم حفظ العقار بنجاح!", type: "success" },
      });
    }

    router.push("/dashboard/properties");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        {id ? "تعديل عقار" : "إضافة عقار"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.operation}
            onChange={(e) => setForm({ ...form, operation: e.target.value as Property["operation"] })}
          >
            <option value="بيع">بيع</option>
            <option value="كراء">كراء</option>
            <option value="رهن">رهن</option>
          </select>
          <input
            type="text"
            placeholder="نوع العقار"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
            required
          />
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Property["status"] })}
          >
            <option value="متوفر">متوفر</option>
            <option value="محجوز">محجوز</option>
            <option value="تم البيع">تم البيع</option>
            <option value="تم الكراء">تم الكراء</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="المدينة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="الحي"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
          <input
            type="text"
            placeholder="العنوان"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="number"
            placeholder="المساحة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: parseInt(e.target.value) || 0 })}
            required
          />
          <input
            type="number"
            placeholder="الغرف"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.rooms}
            onChange={(e) => setForm({ ...form, rooms: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الصالونات"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.salons}
            onChange={(e) => setForm({ ...form, salons: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الحمامات"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="number"
            placeholder="المطابخ"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.kitchens}
            onChange={(e) => setForm({ ...form, kitchens: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الطابق"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="سنة البناء"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="الواجهة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.facade}
            onChange={(e) => setForm({ ...form, facade: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="number"
            placeholder="السعر"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="الإيجار الشهري"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.rent}
            onChange={(e) => setForm({ ...form, rent: parseInt(e.target.value) || 0 })}
          />
          <input
            type="number"
            placeholder="مبلغ الرهن"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={form.mortgage}
            onChange={(e) => setForm({ ...form, mortgage: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.negotiable}
              onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
            />
            قابل للتفاوض
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.garage}
              onChange={(e) => setForm({ ...form, garage: e.target.checked })}
            />
            مرآب
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.elevator}
              onChange={(e) => setForm({ ...form, elevator: e.target.checked })}
            />
            مصعد
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.balcony}
              onChange={(e) => setForm({ ...form, balcony: e.target.checked })}
            />
            بلكون
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.garden}
              onChange={(e) => setForm({ ...form, garden: e.target.checked })}
            />
            حديقة
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.pool}
              onChange={(e) => setForm({ ...form, pool: e.target.checked })}
            />
            مسبح
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.guard}
              onChange={(e) => setForm({ ...form, guard: e.target.checked })}
            />
            حراسة
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            مميز
          </label>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="رابط الفيديو"
            className="w-full p-3 rounded-lg bg-slate-700 text-white"
            value={form.video}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <textarea
            placeholder="الوصف"
            className="w-full p-4 rounded-lg bg-slate-700 text-white h-40"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition"
        >
          {id ? "تحديث" : "إضافة"}
        </button>
      </form>
    </div>
  );
}

export default function PropertyFormPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <PropertyFormContent />
    </Suspense>
  );
}
