"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import RequestCard from "@/components/RequestCard";

export default function DashboardRequestsPage() {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة الطلبات</h1>
        <Link
          href="/dashboard/requests/form"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          إضافة طلب
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.requests.map((r) => (
          <div key={r.id} className="relative">
            <RequestCard request={r} />
            <button
              onClick={() => {
                dispatch({ type: "DELETE_REQUEST", payload: r.id });
                dispatch({ type: "SHOW_TOAST", payload: { message: "تم حذف الطلب!", type: "success" } });
              }}
              className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
