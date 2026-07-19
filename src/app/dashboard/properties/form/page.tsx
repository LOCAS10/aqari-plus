"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import type { Property } from "@/lib/types";

const LS = {
  padding: "11px 14px",
  background: "#0f172a",
  border: "1.5px solid #2d3a4d",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  fontFamily: "Cairo, sans-serif",
};

const LB = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#cbd5e1",
  marginBottom: "6px",
};

function PropertyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, getMatches } = useApp();
  const id = searchParams.get("id");
  const existingProp = id ? state.properties.find((p) => p.id === id) : null;

  const [form, setForm] = useState({
    operation: "بيع",
    propertyType: "شقة",
    status: "متوفر",
    city: "",
    district: "",
    address: "",
    price: "",
    area: "",
    rooms: "",
    salons: "",
    bathrooms: "",
    kitchens: "",
    floor: "",
    year: "",
    facade: "",
    view: "",
    garage: false,
    elevator: false,
    balcony: false,
    garden: false,
    pool: false,
    guard: false,
    negotiable: false,
    featured: false,
    rent: "",
    mortgage: "",
    video: "",
    description: "",
  });

  const [imageUrls, setImageUrls] = useState(
    existingProp ? existingProp.images : []
  );
  const [newImgUrl, setNewImgUrl] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  const u = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addImage = () => {
    const url = newImgUrl.trim();
    if (url.length > 10) {
      setImageUrls([...imageUrls, url]);
      setNewImgUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const toNum = (v: string) => {
    const n = parseInt(v);
    return isNaN(n) ? 0 : n;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split("T")[0];

    const prop: Property = {
      id: id || "P" + String(state.propCounter).padStart(3, "0"),
      operation: form.operation as Property["operation"],
      propertyType: form.propertyType,
      status: form.status as Property["status"],
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
      year: toNum(form.year),
      facade: form.facade,
      view: form.view,
      garage: form.garage,
      elevator: form.elevator,
      balcony: form.balcony,
      garden: form.garden,
      pool: form.pool,
      guard: form.guard,
      negotiable: form.negotiable,
      featured: form.featured,
      rent: toNum(form.rent),
      mortgage: toNum(form.mortgage),
      images:
        imageUrls.length > 0
          ? imageUrls
          : ["https://picsum.photos/seed/default/600/400.jpg"],
      video: form.video,
      description: form.description,
     // استخدم new Date() لتحويل أي شيء إلى Date
createdAt: existingProp ? new Date(existingProp.createdAt) : now,
updatedAt: now,  // هذا صحيح إذا كان now من نوع Date
    };

    if (id) {
      dispatch({ type: "UPDATE_PROPERTY", payload: prop });
    } else {
      dispatch({ type: "ADD_PROPERTY", payload: prop });
    }

    const m = getMatches(prop);
    if (m.length > 0) {
      setMatches(m);
      dispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "يوجد " + m.length + " عميل يبحثون عن هذا العقار!",
          type: "success",
        },
      });
      return;
    }

    dispatch({
      type: "SHOW_TOAST",
      payload: {
        message: id ? "تم تعديل العقار" : "تم إضافة العقار",
        type: "success",
      },
    });
    router.push("/dashboard/properties");
  };

  const selStyle = {
    ...LS,
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left 12px center",
    paddingLeft: "32px",
  };

  const optStyle = { background: "#1e293b", color: "#f8fafc" };

  const types = [
    { v: "شقة", l: "شقة" },
    { v: "شقة مفروشة", l: "شقة مفروشة" },
    { v: "فيلا", l: "فيلا" },
    { v: "فيلا مفروشة", l: "فيلا مفروشة" },
    { v: "أرض", l: "أرض" },
    { v: "محل تجاري", l: "محل تجاري" },
    { v: "مكتب", l: "مكتب" },
    { v: "مستودع", l: "مستودع" },
    { v: "مزرعة", l: "مزرعة" },
  ];

  const ops = [
    { v: "بيع", l: "بيع" },
    { v: "كراء", l: "كراء" },
    { v: "رهن", l: "رهن" },
  ];

  const statuses = [
    { v: "متوفر", l: "متوفر" },
    { v: "محجوز", l: "محجوز" },
    { v: "تم البيع", l: "تم البيع" },
    { v: "تم الكراء", l: "تم الكراء" },
  ];

  const floors = [
    { v: "", l: "اختر الطابق" },
    { v: "أرضي", l: "أرضي" },
    { v: "1", l: "1" },
    { v: "2", l: "2" },
    { v: "3", l: "3" },
    { v: "4", l: "4" },
    { v: "5", l: "5" },
    { v: "6", l: "6" },
    { v: "7", l: "7" },
    { v: "8", l: "8+" },
  ];

  const row4 = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" };
  const row3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" };

  return (
    <div style={{ maxWidth: "900px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f8fafc", marginBottom: "24px" }}>
        {id ? "تعديل عقار" : "إضافة عقار جديد"}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "linear-gradient(145deg, #1e293b, #1a2332)",
          border: "1px solid #2d3a4d",
          borderRadius: "18px",
          padding: "28px",
        }}
      >
        {/* العملية والنوع والحالة */}
        <div style={row3}>
          <div>
            <label style={LB}>نوع العملية</label>
            <select style={selStyle} value={form.operation} onChange={(e) => u("operation", e.target.value)}>
              {ops.map((o) => (
                <option key={o.v} value={o.v} style={optStyle}>{o.l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={LB}>نوع العقار</label>
            <select style={selStyle} value={form.propertyType} onChange={(e) => u("propertyType", e.target.value)}>
              {types.map((t) => (
                <option key={t.v} value={t.v} style={optStyle}>{t.l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={LB}>الحالة</label>
            <select style={selStyle} value={form.status} onChange={(e) => u("status", e.target.value)}>
              {statuses.map((s) => (
                <option key={s.v} value={s.v} style={optStyle}>{s.l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* المدينة والحي والعنوان */}
        <div style={row3}>
          <div>
            <label style={LB}>المدينة *</label>
            <input style={LS} value={form.city} onChange={(e) => u("city", e.target.value)} placeholder="الدار البيضاء" />
          </div>
          <div>
            <label style={LB}>الحي *</label>
            <input style={LS} value={form.district} onChange={(e) => u("district", e.target.value)} placeholder="بوسكورة" />
          </div>
          <div>
            <label style={LB}>العنوان</label>
            <input style={LS} value={form.address} onChange={(e) => u("address", e.target.value)} placeholder="شارع..." />
          </div>
        </div>

        {/* المساحة والغرف والصالونات والحمامات */}
        <div style={row4}>
          <div>
            <label style={LB}>المساحة (م²)</label>
            <input style={LS} value={form.area} onChange={(e) => u("area", e.target.value)} placeholder="120" />
          </div>
          <div>
            <label style={LB}>عدد الغرف</label>
            <input style={LS} value={form.rooms} onChange={(e) => u("rooms", e.target.value)} placeholder="3" />
          </div>
          <div>
            <label style={LB}>الصالونات</label>
            <input style={LS} value={form.salons} onChange={(e) => u("salons", e.target.value)} placeholder="2" />
          </div>
          <div>
            <label style={LB}>الحمامات</label>
            <input style={LS} value={form.bathrooms} onChange={(e) => u("bathrooms", e.target.value)} placeholder="2" />
          </div>
        </div>

        {/* المطابخ والطابق وسنة البناء والواجهة */}
        <div style={row4}>
          <div>
            <label style={LB}>المطابخ</label>
            <input style={LS} value={form.kitchens} onChange={(e) => u("kitchens", e.target.value)} placeholder="1" />
          </div>
          <div>
            <label style={LB}>الطابق</label>
            <select style={selStyle} value={form.floor} onChange={(e) => u("floor", e.target.value)}>
              {floors.map((f) => (
                <option key={f.v} value={f.v} style={optStyle}>{f.l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={LB}>سنة البناء</label>
            <input style={LS} value={form.year} onChange={(e) => u("year", e.target.value)} placeholder="2024" />
          </div>
          <div>
            <label style={LB}>الواجهة</label>
            <input style={LS} value={form.facade} onChange={(e) => u("facade", e.target.value)} placeholder="جنوب، شمال..." />
          </div>
        </div>

        {/* السعر */}
        <div style={row3}>
          <div>
            <label style={LB}>السعر (درهم) *</label>
            <input style={LS} value={form.price} onChange={(e) => u("price", e.target.value)} placeholder="55000000" />
          </div>
          <div>
            <label style={LB}>السومة الشهرية</label>
            <input style={LS} value={form.rent} onChange={(e) => u("rent", e.target.value)} placeholder="للكراء" />
          </div>
          <div>
            <label style={LB}>مبلغ الرهن</label>
            <input style={LS} value={form.mortgage} onChange={(e) => u("mortgage", e.target.value)} placeholder="للرهن" />
          </div>
        </div>

        {/* المميزات */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ ...LB, marginBottom: "10px" }}>المميزات</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[
              ["negotiable", "قابل للتفاوض"],
              ["garage", "مرآب"],
              ["elevator", "مصعد"],
              ["balcony", "بلكون"],
              ["garden", "حديقة"],
              ["pool", "مسبح"],
              ["guard", "حراسة"],
              ["featured", "مميز"],
            ].map(([k, l]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#cbd5e1" }}>
                <input
                  type="checkbox"
                  checked={!!(form as Record<string, unknown>)[k]}
                  onChange={(e) => u(k, e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#10b981", borderRadius: "4px" }}
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* الصور */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ ...LB, marginBottom: "10px" }}>
            صور العقار ({imageUrls.length}/20)
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {imageUrls.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #2d3a4d",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://picsum.photos/seed/fallback/600/400.jpg";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(239,68,68,0.9)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ ...LS, flex: 1 }}
              value={newImgUrl}
              onChange={(e) => setNewImgUrl(e.target.value)}
              placeholder="الصق رابط الصورة هنا"
            />
            <button
              type="button"
              onClick={addImage}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "white",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Cairo",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              + إضافة
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
            لرفع الصور مجاناً: اذهب إلى imgbb.com وانسخ رابط الصورة المباشر
          </p>
        </div>

        {/* رابط الفيديو */}
        <div style={{ marginBottom: "20px" }}>
          <label style={LB}>رابط الفيديو</label>
          <input
            style={LS}
            value={form.video}
            onChange={(e) => u("video", e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* الوصف */}
        <div style={{ marginBottom: "24px" }}>
          <label style={LB}>الوصف</label>
          <textarea
            style={{ ...LS, height: "100px", resize: "vertical" }}
            value={form.description}
            onChange={(e) => u("description", e.target.value)}
            placeholder="وصف تفصيلي للعقار..."
          />
        </div>

        {/* إشعار المطابقة */}
        {matches.length > 0 && (
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <p style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "6px" }}>
              يوجد {matches.length} عميل يبحثون عن هذا العقار!
            </p>
            <p style={{ fontSize: "13px", color: "#fde68a" }}>
              {matches.join(" · ")}
            </p>
          </div>
        )}

        {/* الأزرار */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            style={{
              padding: "12px 32px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #059669, #10b981)",
              color: "white",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Cairo",
              fontSize: "15px",
            }}
          >
            {id ? "تحديث" : "حفظ العقار"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/properties")}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "transparent",
              color: "#10b981",
              border: "2px solid #10b981",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Cairo",
              fontSize: "15px",
            }}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PropertyFormPage() {
  return (
    <Suspense
      fallback={
        <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>
          جاري التحميل...
        </div>
      }
    >
      <PropertyFormContent />
    </Suspense>
  );
}
