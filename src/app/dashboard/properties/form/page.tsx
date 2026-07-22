"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Property } from "@/lib/types";
import { addProperty as fbAddProperty, updateProperty as fbUpdateProperty } from "@/lib/firestore";

function toNum(v: string | number): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function ClientFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const editId = searchParams.get("id");
  
  // ✅✅✅ إصلاح: البحث يشمل _firestoreId أيضاً
  const existingProp = editId ? state.properties.find((p) => p.id === editId || (p as any)._firestoreId === editId) : null;
  const isEdit = !!existingProp;

  const [form, setForm] = useState({
    operation: (existingProp?.operation as Property["operation"]) || "بيع",
    propertyType: existingProp?.propertyType || "",
    city: existingProp?.city || "",
    district: existingProp?.district || "",
    address: existingProp?.address || "",
    price: String(existingProp?.price || ""),
    area: String(existingProp?.area || ""),
    rooms: String(existingProp?.rooms || ""),
    salons: String(existingProp?.salons || "0"),
    bathrooms: String(existingProp?.bathrooms || "0"),
    kitchens: String(existingProp?.kitchens || "0"),
    floor: String(existingProp?.floor || "0"),
    garage: existingProp?.garage || false,
    elevator: existingProp?.elevator || false,
    balcony: existingProp?.balcony || false,
    garden: existingProp?.garden || false,
    pool: existingProp?.pool || false,
    guard: existingProp?.guard || false,
    facade: existingProp?.facade || "",
    view: existingProp?.view || "",
    year: String(existingProp?.year || ""),
    status: (existingProp?.status as Property["status"]) || "متوفر",
    negotiable: existingProp?.negotiable || false,
    rent: String(existingProp?.rent || ""),
    mortgage: String(existingProp?.mortgage || ""),
    images: existingProp?.images || [],
    video: existingProp?.video || "",
    description: existingProp?.description || "",
    featured: existingProp?.featured || false,
    ownerName: existingProp?.ownerName || "",
    ownerPhone: existingProp?.ownerPhone || "",
    ownerWhatsapp: existingProp?.ownerWhatsapp || "",
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>(existingProp?.images || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingProp?.images) setPreviewImages(existingProp.images);
  }, [existingProp]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return alert("الرجاء إدخال رابط الصورة أولاً");
    if (!url.startsWith("http")) return alert("الرجاء إدخال رابط صحيح");
    const newImages = [...form.images, url];
    setForm((prev) => ({ ...prev, images: newImages }));
    setPreviewImages(newImages);
    setImageUrlInput("");
  };

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addImageUrl(); }
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, images: newImages }));
    setPreviewImages(newImages);
  };

  // ✅✅✅ handleSubmit مع إصلاح ID للتحديث!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      const now = new Date();
      
      const propertyData: any = {
        id: existingProp?.id || Date.now().toString(),
        operation: form.operation,
        propertyType: form.propertyType,
        city: form.city,
        district: form.district,
        address: form.address,
        price: toNum(form.price),
        area: toNum(form.area),
        rooms: toNum(form.rooms),
        salons: toNum(form.salons),
        bathrooms: toNum(form.bathrooms),
        kitchens: toNum(form.kitchens),
        floor: toNum(form.floor),
        garage: form.garage,
        elevator: form.elevator,
        balcony: form.balcony,
        garden: form.garden,
        pool: form.pool,
        guard: form.guard,
        facade: form.facade,
        view: form.view,
        year: toNum(form.year),
        status: form.status,
        negotiable: form.negotiable,
        rent: toNum(form.rent),
        mortgage: toNum(form.mortgage),
        images: form.images.length > 0 ? form.images : ["/placeholder.jpg"],
        video: form.video,
        description: form.description,
        featured: form.featured,
        createdAt: existingProp ? new Date(existingProp.createdAt) : now,
        updatedAt: now,
        ownerName: form.ownerName.trim() || undefined,
        ownerPhone: form.ownerPhone.trim() || undefined,
        ownerWhatsapp: form.ownerWhatsapp.trim() || undefined,
      };

      console.log("🔄 جاري حفظ العقار...");

      if (isEdit && existingProp) {
        // ✅✅✅ الإصلاح: استخدام _firestoreId للتحديث!
        const firestoreId = (existingProp as any)._firestoreId || editId;
        console.log(`🔑 تحديث العقار. FirestoreID: ${firestoreId}, OriginalID: ${editId}`);
        
        await fbUpdateProperty(firestoreId, propertyData);
        console.log("✅ تم التحديث في Firebase!");
        
        // تحديث الـ ID إذا لزم
        propertyData._firestoreId = firestoreId;
        
        dispatch({ type: "UPDATE_PROPERTY", payload: propertyData });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم تحديث العقار!", type: "success" } });
      } else {
        const newId = await fbAddProperty(propertyData);
        console.log("✅ تمت الإضافة! ID:", newId);
        propertyData.id = newId;
        dispatch({ type: "ADD_PROPERTY", payload: propertyData });
        dispatch({ type: "SHOW_TOAST", payload: { message: "✅ تم إضافة العقار!", type: "success" } });
      }

      router.push("/dashboard/properties");
    } catch (error: any) {
      console.error("❌ خطأ:", error);
      dispatch({ type: "SHOW_TOAST", payload: { message: `❌ فشل الحفظ: ${error}`, type: "error" }});
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isEdit ? "✏️ تعديل عقار" : "➕ إضافة عقار جديد"}
          </h1>
          <p className="text-gray-400">{isEdit ? "تعديل بيانات العقار" : "أدخل بيانات العقار الجديد"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ===== القسم 1: المعلومات الأساسية ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">📋 المعلومات الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع العملية *</label>
                <select name="operation" value={form.operation} onChange={handleChange} required className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="بيع">بيع</option><option value="كراء">كراء</option><option value="رهن">رهن</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع العقار *</label>
                <input type="text" name="propertyType" value={form.propertyType} onChange={handleChange} required placeholder="شقة، فيلا..." className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المدينة *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="الدار البيضاء" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الحي / المنطقة</label>
                <input type="text" name="district" value={form.district} onChange={handleChange} placeholder="المعاريف" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">العنوان التفصيلي</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="العنوان الكامل..." className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
            </div>
          </div>

          {/* ===== القسم 2: السعر والمساحة ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">💰 السعر والمساحة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {n: "price", l: "السعر (درهم) *", r: true},
                {n: "rent", l: "الكراء/شهر (درهم)"},
                {n: "mortgage", l: "الرهن (درهم)"},
                {n: "area", l: "المساحة (م²) *", r: true},
                {n: "rooms", l: "عدد الغرف *", r: true},
                {n: "floor", l: "الطابق"},
              ].map((f) => (
                <div key={f.n}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{f.l}</label>
                  <input type="number" name={f.n} value={(form as any)[f.n]} onChange={handleChange} min="0" required={f.r} dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
                </div>
              ))}
              <div className="md:col-span-3 flex items-center gap-3">
                <input type="checkbox" id="negotiable" name="negotiable" checked={form.negotiable} onChange={handleChange} className="w-5 h-5 rounded bg-slate-700 text-emerald-500"/>
                <label htmlFor="negotiable" className="text-gray-300">قابل للتفاوض</label>
              </div>
            </div>
          </div>

          {/* ===== القسم 3: المواصفات ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">🏠 المواصفات الداخلية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {["salons", "bathrooms", "kitchens", "year"].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{{salons:"الصالونات",bathrooms:"الحمامات",kitchens:"المطابخ",year:"سنة البناء"}[f]}</label>
                  <input type="number" name={f} value={(form as any)[f]} onChange={handleChange} min={f==="year"?1900:0} max={f==="year"?2030:undefined} dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["garage","elevator","balcony","garden","pool","guard"].map((k) => (
                <label key={k} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg cursor-pointer hover:bg-slate-700">
                  <input type="checkbox" name={k} checked={(form as any)[k]} onChange={handleChange} className="w-5 h-5 rounded bg-slate-600 text-emerald-500"/>
                  <span className="text-gray-300">{{garage:"🚗 مرآب",elevator:"🛗 مصعد",balcony:"🌿 بلكون",garden:"🌳 حديقة",pool:"🏊 مسبح",guard:"👮 حراسة"}[k]}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الواجهة</label>
                <select name="facade" value={form.facade} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">اختر الواجهة</option><option value="شمال">شمال</option><option value="جنوب">جنوب</option><option value="شرق">شرق</option><option value="غرب">غرب</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المنظر</label>
                <select name="view" value={form.view} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">اختر المنظر</option><option value="شارع">شارع</option><option value="حديقة">حديقة</option><option value="بحر">بحر</option><option value="مدينة">مدينة</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">حالة العقار</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="متوفر">متوفر</option><option value="محجوز">محجوز</option><option value="تم البيع">تم البيع</option><option value="تم الكراء">تم الكراء</option>
              </select>
            </div>
          </div>

          {/* ===== القسم 4: الصور ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">🖼️ صور العقار <span className="text-xs font-normal text-gray-400">(روابط)</span></h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} onKeyPress={handleImageKeyPress} placeholder="https://example.com/image.jpg" dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"/>
              </div>
              <button type="button" onClick={addImageUrl} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">➕ إضافة</button>
            </div>
            {previewImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden bg-slate-700">
                    <img src={img} alt={`صورة ${idx+1}`} className="w-full h-28 object-cover" onError={(e) => {(e.target as HTMLImageElement).src="/placeholder.jpg";}}/>
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">{idx+1}</span>
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 text-xs">✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center"><span className="text-4xl block mb-2">🖼️</span><p className="text-gray-400">لم تُضاف صور بعد</p></div>
            )}
          </div>

          {/* ===== القسم 5: الفيديو والوصف ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">🎬 الفيديو والوصف</h2>
            <input type="url" name="video" value={form.video} onChange={handleChange} placeholder="https://youtube.com/..." dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-4"/>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="وصف تفصيلي..." className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-4"/>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5 rounded bg-slate-700 text-amber-500"/>
              <span className="text-gray-300">⭐ عرض كعقار مميز</span>
            </label>
          </div>

          {/* ===== القسم 6: صاحب العقار ===== */}
          <div className="space-y-6 p-6 rounded-xl border-2 border-dashed" style={{background:'linear-gradient(135deg, rgba(120,53,15,.2), rgba(69,26,3,.3))',borderColor:'#f59e0b'}}>
            <div className="flex items-center gap-3 mb-4"><span className="text-2xl">🔒</span><div><h2 className="text-xl font-bold text-amber-400">معلومات صاحب العقار</h2><p className="text-xs text-amber-200/60">خاصة - للمدير فقط</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {n:"ownerName",l:"👤 اسم صاحب العقار",ph:"محمد العلوي"},
                {n:"ownerPhone",l:"☎️ رقم الهاتف",ph:"0661234567"},
                {n:"ownerWhatsapp",l:"💬 واتساب (اختياري)",ph:"اتركه فارغاً"}
              ].map((f) => (
                <div key={f.n}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{f.l}</label>
                  <input type={f.n==="ownerWhatsapp"?"tel":"text"} name={f.n} value={(form as any)[f.n]} onChange={handleChange} placeholder={f.ph} dir={f.n.includes("hone")?"ltr":"rtl"} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"/>
                </div>
              ))}
            </div>
          </div>

          {/* أزرار */}
          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <button type="submit" disabled={isSaving} className={`flex-1 py-4 rounded-xl font-bold text-lg transition hover:scale-[1.02] ${isSaving?'bg-gray-600 cursor-not-allowed':'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
              {isSaving ? '⏳ جاري...' : (isEdit ? '💾 حفظ التعديلات' : '➕ إضافة')}
            </button>
            <button type="button" onClick={() => router.back()} className="px-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PropertyFormPage() {
  return (<Suspense fallback={<div className="text-white text-center py-20">جاري التحميل...</div>}><ClientFormContent /></Suspense>);
}