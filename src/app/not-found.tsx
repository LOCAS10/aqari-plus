"use client";

import React from "react";

export default function NotFound() {
  return React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "Cairo, sans-serif",
      color: "#f8fafc",
    },
  },
    React.createElement("h1", {
      style: { fontSize: "72px", fontWeight: 900, color: "#10b981" },
    }, "404"),
    React.createElement("p", {
      style: { fontSize: "20px", color: "#94a3b8" },
    }, "الصفحة غير موجودة"),
    React.createElement("a", {
      href: "/",
      style: {
        padding: "12px 28px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #059669, #10b981)",
        color: "white",
        textDecoration: "none",
        fontWeight: 700,
        fontFamily: "Cairo",
        display: "inline-block",
      },
    }, "العودة للرئيسية")
  );
}
