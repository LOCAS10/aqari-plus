import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "SOLUTION Immobilier | حلول عقارية",
  description: "وكالة عقارية - Casablanca Maroc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-slate-900 text-white antialiased">
        <LanguageProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
