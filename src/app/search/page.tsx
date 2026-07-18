"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const { state } = useAppContext();

  const [type, setType] = useState(searchParams.get("type") || "");
  const [op, setOp] = useState(searchParams.get("op") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [status, setStatus] = useState("متوفر");
  const [smartText, setSmartText] = useState("");
  const [results, setResults] = useState(state.properties);
  const initializedRef = useRef(false);

  const filterProperties = useCallback(() => {
    let filtered = [...state.properties];

    if (type) filtered = filtered.filter((p) => p.propertyType.includes(type));
    if (op) filtered = filtered.filter((p) => p.operation === op);
    if (city) filtered = filtered.filter((p) => p.city.includes(city));
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (minArea) filtered = filtered.filter((p) => p.area >= parseInt(minArea));
    if (maxArea) filtered = filtered.filter((p) => p.area <= parseInt(maxArea));
    if (minPrice) {
      if (op === "كراء") {
        filtered = filtered.filter((p) => p.rent >= parseInt(minPrice));
      } else if (op === "رهن") {
        filtered = filtered.filter((p) => p.mortgage >= parseInt(minPrice));
      } else {
        filtered = filtered.filter((p) => p.price >= parseInt(minPrice));
      }
    }
    if (maxPrice) {
      if (op === "كراء") {
        filtered = filtered.filter((p) => p.rent <= parseInt(maxPrice));
      } else if (op === "رهن") {
        filtered = filtered.filter((p) => p.mortgage <= parseInt(maxPrice));
      } else {
        filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
      }
    }

    setResults(filtered);
  }, [state.properties, type, op, city, status, minArea, maxArea, minPrice, maxPrice]);

  const smartSearch = useCallback(() => {
    const text = smartText.toLowerCase();
    let opMatch = "";
    if (text.includes("بيع") || text.includes("شراء")) opMatch = "بيع";
    if (text.includes("كراء") || text.includes("ايجار")) opMatch = "كراء";
    if (text.includes("رهن")) opMatch = "رهن";

    let typeMatch = "";
    if (text.includes("شقة")) typeMatch = "شقة";
    if (text.includes("فيلا")) typeMatch = "فيلا";
    if (text.includes("أرض")) typeMatch = "أرض";
    if (text.includes("مكتب")) typeMatch = "مكتب";
    if (text.includes("محل")) typeMatch = "محل تجاري";

    let cityMatch = "";
    const cities = ["الرباط", "الدار البيضاء", "المحمدية", "بوسكورة", "عين الحق", "سيدي موسى"];
    for (const c of cities) {
      if (text.includes(c.toLowerCase())) {
        cityMatch = c;
        break;
      }
    }

    let minP = 0, maxP = Infinity;
    const millionMatches = text.match(/(\d+)\s*مليون/);
    if (millionMatches) {
      minP = parseInt(millionMatches[1]) * 1000000;
      maxP = minP;
      if (text.includes("بين")) {
        const betweenMatches = text.match(/بين\s*(\d+)\s*و\s*(\d+)\s*مليون/);
        if (betweenMatches) {
          minP = parseInt(betweenMatches[1]) * 1000000;
          maxP = parseInt(betweenMatches[2]) * 1000000;
        }
      }
    }

    const scored = state.properties
      .filter((p) => p.status === "متوفر")
      .map((p) => {
        let score = 0;
        if (!opMatch || p.operation === opMatch) score += 10;
        if (!typeMatch || p.propertyType.includes(typeMatch)) score += 10;
        if (!cityMatch || p.city.includes(cityMatch)) score += 10;
        if (minP <= (p.price || p.rent || p.mortgage) && (p.price || p.rent || p.mortgage) <= maxP) score += 10;
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((p) => p.score > 0);

    setResults(scored);
  }, [state.properties, smartText]);

  useEffect(() => {
    if (!initializedRef.current) {
      filterProperties();
      initializedRef.current = true;
    }
  }, [filterProperties]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">بحث متقدم</h1>

      <div className="bg-slate-800 rounded-2xl p-6 mb-10">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={op}
            onChange={(e) => setOp(e.target.value)}
          >
            <option value="">العملية</option>
            <option value="بيع">بيع</option>
            <option value="كراء">كراء</option>
            <option value="رهن">رهن</option>
          </select>
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">نوع العقار</option>
            <option value="شقة">شقة</option>
            <option value="فيلا">فيلا</option>
            <option value="أرض">أرض</option>
            <option value="مكتب">مكتب</option>
            <option value="محل تجاري">محل تجاري</option>
          </select>
          <input
            type="text"
            placeholder="المدينة"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <select
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="متوفر">متوفر</option>
            <option value="محجوز">محجوز</option>
            <option value="تم البيع">تم البيع</option>
            <option value="تم الكراء">تم الكراء</option>
          </select>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="number"
            placeholder="السعر الأدنى"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="السعر الأقصى"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="المساحة الدنيا"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
          />
          <input
            type="number"
            placeholder="المساحة العليا"
            className="p-3 rounded-lg bg-slate-700 text-white"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
          />
        </div>

        <button
          onClick={filterProperties}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition w-full"
        >
          بحث
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">بحث ذكي</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="مثال: شقة للبيع في بوسكورة بين 50 و70 مليون"
            className="flex-1 p-3 rounded-lg bg-slate-700 text-white"
            value={smartText}
            onChange={(e) => setSmartText(e.target.value)}
          />
          <button
            onClick={smartSearch}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            بحث ذكي
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-12 px-4 text-center text-white">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
