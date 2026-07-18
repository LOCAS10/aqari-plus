"use client";

import { useAppContext } from "@/contexts/AppContext";

export default function Toast() {
  const { state } = useAppContext();

  if (!state.toast) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={`fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg ${colors[state.toast.type]}`}>
      {state.toast.message}
    </div>
  );
}
