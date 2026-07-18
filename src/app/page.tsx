"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import PropertyCard from "@/components/PropertyCard";
import RequestCard from "@/components/RequestCard";

export default function Home() {
  const { state } = useAppContext();
  const [searchType, setSearchType] = useState("");
  const [searchOp, setSearchOp] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const featuredProps = state.properties.filter(p => p.featured && p.status === "متوفر");
  const latestReqs = state.requests.slice(0, 3);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType) params.set("type", searchType);
    if (searchOp) params.set("op", searchOp);
    if (searchCity) params.set("city", searchCity);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">ابحث عن عقارك المثالي بسهولة</h1>
          <p className="text-xl text-emerald-100 mb-10">أكبر منصة عقارية في المغرب - للبيع، للكراء، وللرهن</p>

          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-4">
            <select
              className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 text-slate-900"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">نوع العقار</option>
              <option value="شقة">شقة</option>
              <option value="فيلا">فيلا</option>
              <option value="أرض">أرض</option>
              <option value="مكتب">مكتب</option>
              <option value="محل تجاري">محل تجاري</option>
            </select>

            <select
              className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 text-slate-900"
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
              placeholder="المدينة"
              className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 text-slate-900"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              بحث
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-emerald-500 mb-2">{state.properties.length}</div>
            <div className="text-gray-300">إجمالي العقارات</div>
          </div>
          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">{state.properties.filter(p => p.status === "متوفر").length}</div>
            <div className="text-gray-300">المتاح الآن</div>
          </div>
          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-amber-500 mb-2">{state.clients.length}</div>
            <div className="text-gray-300">العملاء</div>
          </div>
          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">{state.requests.length}</div>
            <div className="text-gray-300">الطلبات</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">العقارات المميزة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProps.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">آخر الطلبات</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestReqs.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
