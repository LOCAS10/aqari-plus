"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import type { Property } from "@/lib/types";

const LS = { padding: "11px 14px", background: "#0f172a", border: "1.5px solid #2d3a4d", borderRadius: "12px", color: "#f8fafc", fontSize: "14px", width: "100%", outline: "none", fontFamily: "'Cairo', sans-serif" };
const LB = { display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "6px" };

function PropertyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, getMatches } = useApp();
  const id = searchParams.get("id");
  const existingProp = id ? state.properties.find((p) => p.id === id) : null;

  const [form, setForm] = useState<Partial<Property>>(() => {
    if (existingProp) return { ...existingProp };
    return {
      operation: "بيع", propertyType: "شقة", status: "متوفر",
      city: "", district: "", address: "",
      price: "", area: "", rooms: "", salons: "", bathrooms: "", kitchens: "",
      floor: "", year: "", facade: "", view: "",
      garage: false, elevator: false, balcony: false, garden: false, pool: false, guard: false,
      negotiable: false, featured: false,
      rent: "", mortgage: "",
      images: ["https://picsum.photos/seed/default/600/400.jpg"],
      video: "", description: "",
    };
  });
  const [imageUrls, setImageUrls] = useState<string[]>(existingProp?.images || ["https://picsum.photos/seed/default/600/400.jpg"]);
  const [newImgUrl, setNewImgUrl] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  const u = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const addImage = () => {
    if (newImgUrl.trim()) { setImageUrls([...imageUrls, newImgUrl.trim()]); setNewImgUrl(""); }
  };
  const removeImage = (index: number) => { setImageUrls(imageUrls.filter((_, i) => i !== index)); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split("T")[0];
       const num = (v: string) => { const n = parseInt(v); return isNaN(n) ? 0 : n; };
    const prop: Property = {
      id: id || ("P" + String(state.propCounter).padStart(3, "0")),
      operation: (form.operation || "بيع") as Property["operation"],
      propertyType: form.propertyType || "شقة",
      status: (form.status || "متوفر") as Property["status"],
      city: form.city || "",
      district: form.district || "",
      address: form.address || "",
      price: num(form.price || "0"),
      area: num(form.area || "0"),
      rooms: num(form.rooms || "0"),
      salons: num(form.salons || "0"),
      bathrooms: num(form.bathrooms || "0"),
      kitchens: num(form.kitchens || "0"),
      floor: form.floor || "",
      year: num(form.year || "0"),
      facade: form.facade || "",
      view: form.view || "",
      garage: !!form.garage, elevator: !!form.elevator, balcony: !!form.balcony,
      garden: !!form.garden, pool: !!form.pool, guard: !!form.guard,
      negotiable: !!form.negotiable, featured: !!form.featured,
      rent: num(form.rent || "0"), mortgage: num(form.mortgage || "0"),
      images: imageUrls.filter(i => i && i.startsWith("http")),
      video: form.video || "",
      description: form.description || "",
      createdAt: existingProp?.createdAt || now,
      updatedAt: now,
    };

    if (id) {
      dispatch({ type: "UPDATE_PROPERTY", payload: prop });
    } else {
      dispatch({ type: "ADD_PROPERTY", payload: prop });
    }

    const m = getMatches(prop);
    if (m.length > 0) {
      setMatches(m);
      dispatch({ type: "SHOW_TOAST", payload: { message: `يوجد ${m.length} عميل يبحثون عن هذا العقار!`, type: "success" } });
      return;
    }
    dispatch({ type: "SHOW_TOAST", payload: { message: id ? "تم تعديل العقار" : "تم إضافة العقار", type: "success" } });
    router.push("/dashboard/properties");
  };

  const Sel = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
    <div>
      <label style={LB}>{label}</label>
      <select style={{ ...LS, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "left 12px center", paddingLeft: "32px" }} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.v} value={o.v} style={{ background: "#1e293b", color: "#f8fafc" }}>{o.l}</option>)}
      </select>
    </div>
  );

  const Inp = ({ label, type = "text", value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label style={LB}>{label}</label>
      <input type={type} style={LS} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );

  const types = [{ v: "شقة", l: "شقة" }, { v: "شقة مفروشة", l: "شقة مفروشة" }, { v: "فيلا", l: "فيلا" }, { v: "فيلا مفروشة", l: "فيلا مفروشة" }, { v: "أرض", l: "أرض" }, { v: "محل تجاري", l: "محل تجاري" }, { v: "مكتب", l: "مكتب" }, { v: "مستودع", l: "مستودع" }, { v: "مزرعة", l: "مزرعة" }];
  const ops = [{ v: "بيع", l: "بيع" }, { v: "كراء", l: "كراء" }, { v: "رهن", l: "رهن" }];
  const statuses = [{ v: "متوفر", l: "متوفر" }, { v: "محجوز", l: "محجوز" }, { v: "تم البيع", l: "تم البيع" }, { v: "تم الكراء", l: "تم الكراء" }];
  const floors = [{ v: "", l: "اختر الطابق" }, { v: "أرضي", l: "أرضي" }, { v: "1", l: "1" }, { v: "2", l: "2" }, { v: "3", l: "3" }, { v: "4", l: "4" }, { v: "5", l: "5" }, { v: "6+", l: "6+" }];

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f8fafc", marginBottom: "24px" }}>
        {id ? "تعديل عقار" : "إضافة عقار جديد"}
      </h1>

      <form onSubmit={handleSubmit} style={{ background: "linear-gradient(145deg, #1e293b, #1a2332)", border: "1px solid #2d3a4d", borderRadius: "18px", padding: "28px" }}>
        {/* الصف 1: العملية والنوع والحالة */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
          <Sel label="نوع العملية" value={form.operation || "بيع"} onChange={(v) => u("operation", v)} options={ops} />
          <Sel label="نوع العقار" value={form.propertyType || "شقة"} onChange={(v) => u("propertyType", v)} options={types} />
          <Sel label="الحالة" value={form.status || "متوفر"} onChange={(v) => u("status", v)} options={statuses} />
        </div>

        {/* الصف 2: المدينة والحي والعنوان */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
          <Inp label="المدينة *" value={form.city || ""} onChange={(v) => u("city", v)} placeholder="الدار البيضاء" />
          <Inp label="الحي *" value={form.district || ""} onChange={(v) => u("district", v)} placeholder="بوسكورة" />
          <Inp label="العنوان" value={form.address || ""} onChange={(v) => u("address", v)} placeholder="شارع..." />
        </div>

        {/* الصف 3: المساحة والغرف والصالونات والحمامات */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
          <Inp label="المساحة (م²)" type="number" value={form.area || ""} onChange={(v) => u("area", v)} placeholder="120" />
          <Inp label="عدد الغرف" type="number" value={form.rooms || ""} onChange={(v) => u("rooms", v)} placeholder="3" />
          <Inp label="الصالونات" type="number" value={form.salons || ""} onChange={(v) => u("salons", v)} placeholder="2" />
          <Inp label="الحمامات" type="number" value={form.bathrooms || ""} onChange={(v) => u("bathrooms", v)} placeholder="2" />
        </div>

        {/* الصف 4: المطابخ والطابق وسنة البناء والواجهة */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
          <Inp label="المطابخ" type="number" value={form.kitchens || ""} onChange={(v) => u("kitchens", v)} placeholder="1" />
          <Sel label="الطابق" value={form.floor || ""} onChange={(v) => u("floor", v)} options={floors} />
          <Inp label="سنة البناء" type="number" value={form.year || ""} onChange={(v) => u("year", v)} placeholder="2023" />
          <Inp label="الواجهة" value={form.facade || ""} onChange={(v) => u("facade", v)} placeholder="جنوب، شمال..." />
        </div>

        {/* الصف 5: السعر */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
          <Inp label="السعر (درهم) *" type="number" value={form.price || ""} onChange={(v) => u("price", v)} placeholder="55000000" />
          <Inp label="السومة الشهرية" type="number" value={form.rent || ""} onChange={(v) => u("rent", v)} placeholder="للكراء" />
          <Inp label="مبلغ الرهن" type="number" value={form.mortgage || ""} onChange={(v) => u("mortgage", v)} placeholder="للرهن" />
        </div>

        {/* الصف 6: المميزات */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ ...LB, marginBottom: "10px" }}>المميزات</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {([["negotiable", "قابل للتفاوض"], ["garage", "مرآب"], ["elevator", "مصعد"], ["balcony", "بلكون"], ["garden", "حديقة"], ["pool", "مسبح"], ["guard", "حراسة"], ["featured", "مميز"]]).map(([k, l]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#cbd5e1" }}>
                <input type="checkbox" checked={!!form[k as keyof typeof form]} onChange={(e) => u(k, e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#10b981", borderRadius: "4px" }} />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* الصف 7: الصور */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ ...LB, marginBottom: "10px" }}>صور العقار ({imageUrls.length}/20)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "10px" }}>
            {imageUrls.map((img, i) => (
              <div key={i} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #2d3a4d" }}>
                <img src={img} alt="" style={{ width: "100%", height: "100px", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/fb/600/400.jpg"; }} />
                <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "4px", left: "4px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", border: "none", color: "white", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" style={{ ...LS, flex: 1 }} value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} placeholder="الصق رابط صورة من imgbb.com" />
            <button type="button" onClick={addImage} style={{ padding: "10px 20px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #10b981)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Cairo'", fontSize: "14px", whiteSpace: "nowrap" }}>
              <i className="fas fa-plus ml-1"></i>إضافة
            </button>
          </div>
        </div>

        {/* الصف 8: رابط الفيديو */}
        <div style={{ marginBottom: "20px" }}>
          <label style={LB}>رابط الفيديو</label>
          <input type="text" style={LS} value={form.video || ""} onChange={(e) => u("video", e.target.value)} placeholder="https://youtube.com/..." />
        </div>

        {/* الصف 9: الوصف */}
               {/* الصف 9: الوصف */}
        <div style={{ marginBottom: "24px" }}>
          <label style={LB}>الوصف</label>
          <textarea style={{ ...LS, height: "100px", resize: "vertical" }} value={form.description || ""} onChange={(e) => u("description", e.target.value)} placeholder="وصف تفصيلي للعقار..." />
        </div>

        {/* إشعار المطابقة */}
        {matches.length > 0 && (
          <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <p style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "6px" }}>يوجد {matches.length} عميل يبحثون عن هذا العقار!</p>
            <p style={{ fontSize: "13px", color: "#fde68a" }}>{matches.join(" · ")}</p>
          </div>
        )}

        {/* الأزرار */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" className="btn btn-m" style={{ padding: "12px 32px", fontSize: "15px" }}>
            <i className="fas fa-save" style={{ marginLeft: "8px" }}></i>{id ? "تحديث" : "حفظ العقار"}
          </button>
          <button type="button" onClick={() => router.push("/dashboard/properties")} className="btn btn-o" style={{ padding: "12px 24px", fontSize: "15px" }}>
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PropertyFormPage() {
  return (
    <Suspense fallback={<div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>جاري التحميل...</div>}>
      <PropertyFormContent />
    </Suspense>
  );
}
