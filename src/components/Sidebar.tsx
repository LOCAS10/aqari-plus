"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "📊 الإحصائيات" },
    { href: "/dashboard/properties", label: "🏢 إدارة العقارات" },
    { href: "/dashboard/properties/form", label: "➕ إضافة عقار" },
    { href: "/dashboard/requests", label: "📋 إدارة الطلبات" },
    { href: "/dashboard/requests/form", label: "➕ إضافة طلب" },
    { href: "/dashboard/clients", label: "👥 إدارة العملاء" },
    { href: "/dashboard/clients/form", label: "➕ إضافة عميل" },
    { href: "/", label: "🏠 العودة للموقع" },
  ];

  return (
    <aside className="bg-slate-800 text-white w-64 min-h-screen sticky top-16 p-4">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-3 rounded-lg transition ${
              pathname === link.href
                ? "bg-emerald-500"
                : "hover:bg-slate-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
