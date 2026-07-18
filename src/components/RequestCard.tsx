"use client";

import { Request } from "@/lib/types";

const formatPrice = (n: number) => {
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(2)} مليون`;
  } else if (n >= 1000) {
    return `${(n / 1000).toFixed(0)} ألف`;
  }
  return n.toString();
};

export default function RequestCard({ request }: { request: Request }) {
  const opColors = {
    شراء: "bg-blue-500",
    كراء: "bg-purple-500",
    رهن: "bg-orange-500",
  };

  const opIcons = {
    شراء: "💰",
    كراء: "🔑",
    رهن: "🏦",
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-2xl px-3 py-1 rounded-lg ${opColors[request.operation]}`}>
          {opIcons[request.operation]}
        </span>
        <div>
          <div className="font-bold">{request.clientName}</div>
          <div className="text-gray-400 text-sm">{request.operation}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-lg font-medium mb-2">{request.propertyType}</div>
        <div className="text-gray-400">{request.city}</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
          ميزانية: {formatPrice(request.budgetMin)} - {formatPrice(request.budgetMax)}
        </span>
        {request.rooms > 0 && (
          <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
            🛏️ {request.rooms}
          </span>
        )}
        {request.area > 0 && (
          <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
            📐 {request.area} م²
          </span>
        )}
        {request.mortgage && (
          <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
            🏦 رهن
          </span>
        )}
      </div>

      {request.notes && (
        <div className="text-gray-400 text-sm bg-slate-700 p-3 rounded-lg">
          {request.notes}
        </div>
      )}
    </div>
  );
}
