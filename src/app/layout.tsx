import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

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
            <Header />
            <main style={{ marginTop: "95px" }}>{children}</main>
            <WhatsAppButton />
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
