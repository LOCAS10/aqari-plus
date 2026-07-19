"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";
import RequestCard from "@/components/RequestCard";

export default function Home() {
  const { state } = useApp();
  const [searchType, setSearchType] = useState("");
  const [searchOp, setSearchOp] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [counts, setCounts] = useState({ total: 0, available: 0, clients: 0, requests: 0 });

  useEffect(() => {
    const available = state.properties.filter(p => p.status === "متوفر");
    const target = { total: state.properties.length, available: available.length, clients: state.clients.length, requests: state.requests.length };
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let current = { total: 0, available: 0, clients: 0, requests: 0 };
    const timer = setInterval(() => {
      const done = Object.keys(target).every(k => current[k] >= target[k]);
      if (done) { clearInterval(timer); setCounts(target); return; }
      Object.keys(target).forEach(k => { current[k] = Math.min(current[k] + Math.max(1, Math.ceil(target[k] / steps)), target[k]); });
      setCounts({ ...current });
    }, interval);
    return () => clearInterval(timer);
  }, [state.properties.length, state.clients.length, state.requests.length]);

  const featuredProps = state.properties.filter(p => p.featured && p.status === "متوفر");
  const latestReqs = [...state.requests].reverse().slice(0, 6);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType) params.set("type", searchType);
    if (searchOp) params.set("op", searchOp);
    if (searchCity) params.set("city", searchCity);
    window.location.href = `/search?${params.toString()}`;
  };

  const types = ["شقة", "شقة مفروشة", "فيلا", "فيلا مفروشة", "أرض", "محل تجاري", "مكتب", "مستودع", "مزرعة"];

  return (
    <div>
      {/* === هيرو === */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(30,41,59,0.88)), url('https://picsum.photos/seed/realestate-hero-dark/1920/1080.jpg') center/cover",
        }}
      >
        {/* تأثيرات إضاءة */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 25% 40%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 75% 75%, rgba(245,158,11,0.05) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* شارة */}
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full border border-emerald-500/20" style={{ background: "rgba(16,185,129,0.08)" }}>
            <i className="fas fa-star text-emerald-400 text-sm"></i>
            <span className="text-emerald-400 text-sm font-bold">أكبر منصة عقارية في الدار البيضاء</span>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight text-white">
            ابحث عن عقارك
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to left, #34d399, #fbbf24)" }}
            >
              المثالي بسهولة
            </span>
          </h1>

          {/* الوصف */}
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            للبيع، للكراء، وللرهن — منصة متكاملة بإدارة ذكية توفّر لك الوقت والجهد
          </p>

          {/* صندوق البحث الزجاجي */}
          <div
            className="rounded-2xl p-4 md:p-5 max-w-3xl mx-auto"
            style={{
              background: "rgba(30,41,59,0.55)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(45,58,77,0.6)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                className="w-full p-3 rounded-xl text-sm font-semibold outline-none transition-all"
                style={{ background: "#0f172a", border: "1.5px solid #2d3a4d", color: "#f8fafc" }}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="">نوع العقار</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                className="w-full p-3 rounded-xl text-sm font-semibold outline-none transition-all"
                style={{ background: "#0f172a", border: "1.5px solid #2d3a4d", color: "#f8fafc" }}
                value={searchOp}
                onChange={(e) => setSearchOp(e.target.value)}
              >
                <option value="">العملية</option>
                <option value="بيع">بيع</option>
                <option value="كراء">كراء</option>
                <option value="رهن">رهن</option>
              </select>

              <input
                type="text"
                placeholder="المدينة أو الحي..."
                className="w-full p-3 rounded-xl text-sm font-semibold outline-none transition-all"
                style={{ background: "#0f172a", border: "1.5px solid #2d3a4d", color: "#f8fafc" }}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white transition-all"
                style={{ background: "linear-gradient(135deg, #059669, #10b981)", boxShadow: "0 4px 20px rgba(16,185,129,0.25)" }}
              >
                <i className="fas fa-search ml-2"></i>بحث
              </button>
            </div>
          </div>
        </div>

        {/* أيقونة البيت العائمة */}
        <div
          className="absolute bottom-12 left-10 w-16 h-16 rounded-2xl flex items-center justify-center hidden md:flex"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <i className="fas fa-home text-emerald-400 text-2xl"></i>
        </div>

        {/* أيقونة المفتاح العائمة */}
        <div
          className="absolute top-24 right-24 w-14 h-14 rounded-xl flex items-center justify-center hidden md:flex"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
            animation: "float 4s ease-in-out infinite 0.5s",
          }}
        >
          <i className="fas fa-key text-amber-400 text-lg"></i>
        </div>
      </section>

      {/* === الإحصائيات === */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي العقارات", value: counts.total, color: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
            { label: "المتاح الآن", value: counts.available, color: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" },
            { label: "العملاء", value: counts.clients, color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.15)" },
            { label: "الطلبات", value: counts.requests, color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, #1e293b, #1a2332)", border: `1px solid ${stat.border}` }}
            >
              <div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full"
                style={{ background: stat.color, opacity: 0.06 }}
              />
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === العروض المميزة === */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">
                العقارات <span className="text-emerald-400">المميزة</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>أفضل العقارات المتاحة حالياً</p>
            </div>
            <button
              onClick={() => { window.location.href = "/properties"; }}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ border: "2px solid #10b981", color: "#10b981", background: "transparent" }}
            >
              عرض الكل <i className="fas fa-arrow-left mr-1"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProps.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* === آخر الطلبات === */}
      <section className="py-14 px-4" style={{ background: "rgba(30,41,59,0.2)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">
                آخر <span className="text-amber-400">الطلبات</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>ما يبحث عنه العملاء</p>
            </div>
            <button
              onClick={() => { window.location.href = "/requests"; }}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ border: "2px solid #10b981", color: "#10b981", background: "transparent" }}
            >
              عرض الكل <i className="fas fa-arrow-left mr-1"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestReqs.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="py-10 px-4" style={{ borderTop: "1px solid #2d3a4d" }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              <i className="fas fa-building text-white text-lg"></i>
            </div>
            <span className="text-lg font-black text-white">عقاري بلس</span>
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>
            منصة العقارات الاحترافية — جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* === CSS للأنيميشن === */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
