import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header"; // ✅ استيراد Header

export const metadata: Metadata = {
  title: "SOLUTION Immobilier | حلول عقارية",
  description:
    "شريكك العقاري الموثوق - الدار البيضاء، بوسكورة، سيدي معروف",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <LanguageProvider>
          <AppProvider>
            {/* ✅✅✅ Header يظهر هنا في كل الصفحات! */}
            <Header />

            {/* المحتوى الرئيسي - بمساحة من الأعلى للـ Header */}
            <main style={{ marginTop: "95px" }}>{children}</main>

            {/* ✅ WhatsApp Floating Button - يظهر في كل الصفحات */}
            <a
              href="https://wa.me/212607633144?text=مرحباً%20من%20موقع%20SOLUTION%20Immobilier"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "fixed",
                bottom: "24px",
                left: "24px",
                zIndex: 9998,
                width: "65px",
                height: "65px",
                background: "#25D366",
                borderRadius: "50%",
                color: "white",
                fontSize: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(37, 211, 102, 0.4)",
                transition: "transform 0.3s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              title={
                typeof window !== "undefined" && document.documentElement.lang === "ar"
                  ? "واتساب"
                  : "WhatsApp"
              }
            >
              💬
            </a>
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
