"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import type { Property } from "@/lib/types";

function toNum(v: string | number): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function ClientFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const editId = searchParams.get("id");
  const existingProp = editId ? state.properties.find((p) => p.id === editId) : null;
  const isEdit = !!existingProp;

  // ✅✅✅ حالة النموذج - مع الحقول الجديدة للمالك:
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
    images: existingProp?.images || ["/placeholder.jpg"],
    video: existingProp?.video || "",
    description: existingProp?.description || "",
    featured: existingProp?.featured || false,
    
    // ✅✅✅ الحقول الجديدة - صاحب العقار:
    ownerName: existingProp?.ownerName || "",
    ownerPhone: existingProp?.ownerPhone || "",
    ownerWhatsapp: existingProp?.ownerWhatsapp || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>(existingProp?.images || ["/placeholder.jpg"]);

  useEffect(() => {
    if (existingProp?.images) {
      setPreviewImages(existingProp.images);
    }
  }, [existingProp]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ دالة رفع الصور (يمكن تطويرها لاحقاً لرفع فعلي)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...form.images];
    
    Array.from(files).forEach((file) => {
      // حالياً نستخدم URL.createObjectURL (محلي)
      // TODO: لاحقاً ارفع الصورة واحفظ الرابط
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    setForm((prev) => ({ ...prev, images: newImages }));
    setPreviewImages(newImages);
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, images: newImages }));
    setPreviewImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    
    // ✅✅✅ كائن العقار مع الحقول الجديدة:
    const propertyData: Property = {
      id: existingProp?.id || String(Date.now()),
      operation: form.operation as Property["operation"],
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
      status: form.status as Property["status"],
      negotiable: form.negotiable,
      rent: toNum(form.rent),
      mortgage: toNum(form.mortgage),
      images: form.images.length > 0 ? form.images : ["/placeholder.jpg"],
      video: form.video,
      description: form.description,
      featured: form.featured,
      createdAt: existingProp ? new Date(existingProp.createdAt) : now,
      updatedAt: now,

      // ✅✅✅ حقول صاحب العقار:
      ownerName: form.ownerName.trim() || undefined,
      ownerPhone: form.ownerPhone.trim() || undefined,
      ownerWhatsapp: form.ownerWhatsapp.trim() || undefined,
    };

    if (isEdit) {
      dispatch({ type: "UPDATE_PROPERTY", payload: propertyData });
      dispatch({ type: "SHOW_TOAST", payload: { message: "تم تحديث العقار بنجاح", type: "success" } });
    } else {
      dispatch({ type: "ADD_PROPERTY", payload: propertyData });
      dispatch({ type: "SHOW_TOAST", payload: { message: "تم إضافة العقار بنجاح", type: "success" } });
    }

    router.push("/dashboard/properties");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isEdit ? "✏️ تعديل عقار" : "➕ إضافة عقار جديد"}
          </h1>
          <p className="text-gray-400">
            {isEdit ? "تعديل بيانات العقار" : "أدخل بيانات العقار الجديد"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ===== القسم 1: المعلومات الأساسية ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              📋 المعلومات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* نوع العملية */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع العملية *</label>
                <select
                  name="operation"
                  value={form.operation}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="بيع">بيع</option>
                  <option value="كراء">كراء</option>
                  <option value="رهن">رهن</option>
                </select>
              </div>

              {/* نوع العقار */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع العقار *</label>
                <input
                  type="text"
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  required
                  placeholder="مثال: شقة، فيلا، محل..."
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* المدينة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المدينة *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="مثال: الدار البيضاء"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الحي / المنطقة</label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="مثال: المعاريف"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* العنوان */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">العنوان التفصيلي</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="العنوان الكامل..."
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ===== القسم 2: السعر والمساحة ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              💰 السعر والمساحة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* السعر */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">السعر (درهم) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* الكراء */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الكراء/شهر (درهم)</label>
                <input
                  type="number"
                  name="rent"
                  value={form.rent}
                  onChange={handleChange}
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* الرهن */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الرهن (درهم)</label>
                <input
                  type="number"
                  name="mortgage"
                  value={form.mortgage}
                  onChange={handleChange}
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* المساحة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المساحة (م²) *</label>
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* الغرف */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">عدد الغرف *</label>
                <input
                  type="number"
                  name="rooms"
                  value={form.rooms}
                  onChange={handleChange}
                  required
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* الطابق */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الطابق</label>
                <input
                  type="number"
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  min="0"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* قابل للتفاوض */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="negotiable"
                name="negotiable"
                checked={form.negotiable}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="negotiable" className="text-gray-300">قابل للتفاوض</label>
            </div>
          </div>

          {/* ===== القسم 3: المواصفات الداخلية ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              🏠 المواصفات الداخلية
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الصالونات</label>
                <input type="number" name="salons" value={form.salons} onChange={handleChange} min="0" dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الحمامات</label>
                <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} min="0" dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المطابخ</label>
                <input type="number" name="kitchens" value={form.kitchens} onChange={handleChange} min="0" dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">سنة البناء</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} min="1900" max="2030" dir="ltr" className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>

            {/* المميزات */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "garage", label: "🚗 مرآب", field: "garage" },
                { key: "elevator", label: "🛗 مصعد", field: "elevator" },
                { key: "balcony", label: "🌿 بلكون", field: "balcony" },
                { key: "garden", label: "🌳 حديقة", field: "garden" },
                { key: "pool", label: "🏊 مسبح", field: "pool" },
                { key: "guard", label: "👮 حراسة", field: "guard" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                  <input
                    type="checkbox"
                    name={item.field}
                    checked={(form as any)[item.field]}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-gray-300">{item.label}</span>
                </label>
              ))}
            </div>

            {/* الواجهة والمنظر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الواجهة</label>
                <select name="facade" value={form.facade} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">اختر الواجهة</option>
                  <option value="شمال">شمال</option>
                  <option value="جنوب">جنوب</option>
                  <option value="شرق">شرق</option>
                  <option value="غرب">غرب</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">المنظر</label>
                <select name="view" value={form.view} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">اختر المنظر</option>
                  <option value="شارع">شارع</option>
                  <option value="حديقة">حديقة</option>
                  <option value="بحر">بحر</option>
                  <option value="مدينة">مدينة</option>
                </select>
              </div>
            </div>

            {/* الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">حالة العقار</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="متوفر">متوفر</option>
                <option value="محجوز">محجوز</option>
                <option value="تم البيع">تم البيع</option>
                <option value="تم الكراء">تم الكراء</option>
              </select>
            </div>
          </div>

          {/* ===== القسم 4: الصور ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              🖼️ صور العقار
            </h2>

            {/* رفع صور جديدة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">إضافة صور</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-slate-700/30 transition"
              >
                <span className="text-4xl mb-2 block">📷</span>
                <span className="text-gray-400">اضغط لاختيار الصور</span>
                <span className="text-xs text-gray-500 block mt-1">(يمكن اختيار عدة صور)</span>
              </button>
            </div>

            {/* معاينة الصور */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden">
                    <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition text-sm font-bold"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== القسم 5: الفيديو والوصف ===== */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              🎬 الفيديو والوصف
            </h2>

            {/* رابط الفيديو */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">رابط الفيديو (YouTube أو غيره)</label>
              <input
                type="url"
                name="video"
                value={form.video}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?..."
                dir="ltr"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* الوصف */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">وصف العقار</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="اكتب وصفاً تفصيلياً للعقار..."
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>

            {/* مميز */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="featured" className="text-gray-300">⭐ عرض كعقار مميز</label>
            </div>
          </div>

          {/* ✅✅✅ القسم 6: معلومات صاحب العقار (خاص - لا يظهر للزوار) */}
          <div 
            className="space-y-6 p-6 rounded-xl border-2 border-dashed"
            style={{
              background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.2) 0%, rgba(69, 26, 3, 0.3) 100%)',
              borderColor: '#f59e0b'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h2 className="text-xl font-bold text-amber-400">معلومات صاحب العقار</h2>
                <p className="text-xs text-amber-200/60">هذه المعلومات خاصة - تظهر فقط للمدير</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* اسم صاحب العقار */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  👤 اسم صاحب العقار
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="مثال: محمد العلوي"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ☎️ رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  value={form.ownerPhone}
                  onChange={handleChange}
                  placeholder="0661234567"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* رقم الواتساب */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💬 رقم الواتساب <span className="text-gray-500">(اختياري)</span>
                </label>
                <input
                  type="tel"
                  name="ownerWhatsapp"
                  value={form.ownerWhatsapp}
                  onChange={handleChange}
                  placeholder="اتركه فارغاً = نفس الهاتف"
                  dir="ltr"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* تنبيه */}
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 flex items-start gap-3">
              <span className="text-amber-400">ℹ️</span>
              <p className="text-sm text-amber-200/80">
                هذه المعلومات لن تظهر للزوار العاديين. ستظهر فقط للمدير في لوحة التحكم وصفحة تفاصيل العقار.
              </p>
            </div>
          </div>

          {/* ===== أزرار الإجراءات ===== */}
          <div className="flex gap-4 pt-4 border-t border-slate-700">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition hover:scale-[1.02]"
            >
              {isEdit ? "💾 حفظ التعديلات" : "➕ إضافة العقار"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PropertyFormPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">جاري التحميل...</div>}>
      <ClientFormContent />
    </Suspense>
  );
}
